export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Point2D {
  x: number;
  y: number;
}

export interface CameraConfig {
  yawDeg: number;       // Horizontal angle in degrees (e.g. -20 for 3/4 view)
  pitchDeg: number;     // Elevation angle in degrees (e.g. 17.5 for slightly elevated)
  lidAngleDeg: number;  // Lid opening angle relative to deck (e.g. 103 degrees)
  distance: number;     // Camera distance from target
  focalLength: number;  // Perspective focal length
  target: Vec3;         // 3D look-at center
  viewportCenter: Point2D; // 2D canvas center
}

/**
 * Projects a 3D point (in laptop millimeter-scale world coordinates)
 * onto 2D viewport coordinates using a pinhole perspective camera.
 */
export function projectPoint3D(pt: Vec3, cam: CameraConfig): Point2D {
  const yaw = (cam.yawDeg * Math.PI) / 180;
  const pitch = (cam.pitchDeg * Math.PI) / 180;

  // Translate relative to target
  const dx = pt.x - cam.target.x;
  const dy = pt.y - cam.target.y;
  const dz = pt.z - cam.target.z;

  // Rotate around Y axis by yaw
  const cosY = Math.cos(yaw);
  const sinY = Math.sin(yaw);
  const x1 = dx * cosY + dz * sinY;
  const y1 = dy;
  const z1 = -dx * sinY + dz * cosY;

  // Rotate around X axis by pitch (camera elevated looking down)
  const cosP = Math.cos(pitch);
  const sinP = Math.sin(pitch);
  const x2 = x1;
  const y2 = y1 * cosP - z1 * sinP;
  const z2 = y1 * sinP + z1 * cosP;

  // Camera sits at +cam.distance along Z2 axis looking toward origin
  const depth = cam.distance - z2;
  const safeDepth = Math.max(depth, 100);
  const scale = cam.focalLength / safeDepth;

  return {
    x: cam.viewportCenter.x + x2 * scale,
    y: cam.viewportCenter.y - y2 * scale,
  };
}

/**
 * Solves an 8x8 linear system A * h = b using Gaussian elimination with partial pivoting,
 * returning the CSS matrix3d(...) string that maps a flat 2D element of size (width x height)
 * with corners (0,0), (width,0), (width,height), (0,height) onto the four target 2D points
 * [topLeft, topRight, bottomRight, bottomLeft].
 */
export function computeHomographyMatrix3d(
  width: number,
  height: number,
  quad: [Point2D, Point2D, Point2D, Point2D]
): string {
  const src: [Point2D, Point2D, Point2D, Point2D] = [
    { x: 0, y: 0 },
    { x: width, y: 0 },
    { x: width, y: height },
    { x: 0, y: height },
  ];

  // Build 8x9 augmented matrix [A | b]
  const M: number[][] = [];
  for (let i = 0; i < 4; i++) {
    const u = src[i].x;
    const v = src[i].y;
    const x = quad[i].x;
    const y = quad[i].y;

    M.push([u, v, 1, 0, 0, 0, -u * x, -v * x, x]);
    M.push([0, 0, 0, u, v, 1, -u * y, -v * y, y]);
  }

  const n = 8;
  for (let col = 0; col < n; col++) {
    // Find pivot row
    let pivotRow = col;
    let maxVal = Math.abs(M[col][col]);
    for (let row = col + 1; row < n; row++) {
      const val = Math.abs(M[row][col]);
      if (val > maxVal) {
        maxVal = val;
        pivotRow = row;
      }
    }

    // Swap rows
    if (pivotRow !== col) {
      const tmp = M[col];
      M[col] = M[pivotRow];
      M[pivotRow] = tmp;
    }

    const pivot = M[col][col] || 1e-12;
    for (let j = col; j <= n; j++) {
      M[col][j] /= pivot;
    }

    for (let row = 0; row < n; row++) {
      if (row !== col) {
        const factor = M[row][col];
        for (let j = col; j <= n; j++) {
          M[row][j] -= factor * M[col][j];
        }
      }
    }
  }

  const h00 = M[0][8];
  const h01 = M[1][8];
  const h02 = M[2][8];
  const h10 = M[3][8];
  const h11 = M[4][8];
  const h12 = M[5][8];
  const h20 = M[6][8];
  const h21 = M[7][8];

  // Column-major 4x4 matrix for CSS matrix3d
  const vals = [
    h00, h10, 0, h20,
    h01, h11, 0, h21,
    0,   0,   1, 0,
    h02, h12, 0, 1,
  ];

  return `matrix3d(${vals.map((v) => v.toFixed(9)).join(',')})`;
}

/**
 * Generates 2D local points along a rounded rectangle with independent corner radii
 * [rTopLeft, rTopRight, rBottomRight, rBottomLeft] in [xMin..xMax, yMin..yMax].
 */
export function sampleRoundedRect2D(
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  radii: [number, number, number, number],
  segmentsPerCorner = 10
): Point2D[] {
  const [rTL, rTR, rBR, rBL] = radii;
  const pts: Point2D[] = [];

  // Top-Left corner: center (xMin + rTL, yMin + rTL), angle PI to 1.5*PI
  for (let i = 0; i <= segmentsPerCorner; i++) {
    const a = Math.PI + (i / segmentsPerCorner) * (Math.PI / 2);
    pts.push({
      x: xMin + rTL + rTL * Math.cos(a),
      y: yMin + rTL + rTL * Math.sin(a),
    });
  }

  // Top-Right corner: center (xMax - rTR, yMin + rTR), angle 1.5*PI to 2*PI
  for (let i = 0; i <= segmentsPerCorner; i++) {
    const a = 1.5 * Math.PI + (i / segmentsPerCorner) * (Math.PI / 2);
    pts.push({
      x: xMax - rTR + rTR * Math.cos(a),
      y: yMin + rTR + rTR * Math.sin(a),
    });
  }

  // Bottom-Right corner: center (xMax - rBR, yMax - rBR), angle 0 to 0.5*PI
  for (let i = 0; i <= segmentsPerCorner; i++) {
    const a = (i / segmentsPerCorner) * (Math.PI / 2);
    pts.push({
      x: xMax - rBR + rBR * Math.cos(a),
      y: yMax - rBR + rBR * Math.sin(a),
    });
  }

  // Bottom-Left corner: center (xMin + rBL, yMax - rBL), angle 0.5*PI to PI
  for (let i = 0; i <= segmentsPerCorner; i++) {
    const a = 0.5 * Math.PI + (i / segmentsPerCorner) * (Math.PI / 2);
    pts.push({
      x: xMin + rBL + rBL * Math.cos(a),
      y: yMax - rBL + rBL * Math.sin(a),
    });
  }

  return pts;
}

/**
 * Converts an array of 2D points into a closed or open SVG path string.
 */
export function pointsToSvgPath(pts: Point2D[], closed = true): string {
  if (pts.length === 0) return '';
  const parts = pts.map(
    (p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`
  );
  if (closed) parts.push('Z');
  return parts.join(' ');
}
