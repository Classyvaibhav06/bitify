/**
 * Device cropper — extracts phones/TVs from the uploaded marketing photos
 * as transparent-background WebP cutouts (device keeps its own bezel).
 *
 * Strategy:
 *  1. VLM-provided body bbox (percentages) as the initial estimate.
 *  2. Snap each edge to the strongest image gradient within a small window
 *     (the device body edge is a hard dark-to-background transition).
 *  3. Apply a rounded-rectangle alpha mask (feathered) so everything outside
 *     the device silhouette becomes transparent.
 *  4. Export WebP with alpha.
 */
const sharp = require("sharp");
const fs = require("fs");

const PHONES = [
  { file: "photo_2026-10-31_21-55-26.jpg_862f6c6a_2K.jpg", name: "liked",       box: { L: 23, R: 77, T: 17, B: 83 } },
  { file: "photo_2026-10-31_21-55-30.jpg_88bbe6fd_2K.jpg", name: "party",       box: { L: 22, R: 78, T: 17, B: 86 } },
  { file: "photo_2026-10-31_21-55-33.jpg_bf2b9e26_2K.jpg", name: "explore",     box: { L: 20, R: 80, T: 16, B: 88 } },
  { file: "photo_2026-10-31_21-55-36.jpg_8705842b_2K.jpg", name: "search",      box: { L: 27, R: 77, T: 20, B: 83 } },
  { file: "photo_2026-10-31_21-55-38.jpg_374caf68_2K.jpg", name: "lyrics1",     box: { L: 21, R: 79, T: 14, B: 83 } },
  { file: "photo_2026-10-31_21-55-41.jpg_8a2ff481_2K.jpg", name: "lyrics2",     box: { L: 19, R: 81, T: 12, B: 88 } },
  { file: "photo_2026-10-31_21-55-43.jpg_5d091e64_2K.jpg", name: "library",     box: { L: 21, R: 79, T: 15, B: 86 } },
  { file: "photo_2026-10-31_21-55-45.jpg_bfb40ea7_2K.jpg", name: "nowplaying",  box: { L: 21, R: 79, T: 18, B: 87 } },
];

const TVS = [
  { file: "image.png_3b907ff4_2K.jpg", name: "nowplaying", box: { L: 5.6, R: 94.4, T: 4.0, B: 95.2 } },
  { file: "image.png_6a97d1e9_2K.jpg", name: "fullscreen", box: { L: 7.5, R: 92.5, T: 6.0, B: 93.8 } },
];

/** Find strongest vertical-edge column within [lo,hi] using horizontal gradient sums. */
function snapVertical(gray, W, H, lo, hi, y0, y1) {
  let best = lo, bestScore = -1;
  for (let x = Math.max(2, lo); x <= Math.min(W - 3, hi); x++) {
    let s = 0, n = 0;
    for (let y = y0; y < y1; y += 3) {
      s += Math.abs(gray[(y) * W + x + 2] - gray[(y) * W + x - 2]);
      n++;
    }
    const score = s / n;
    if (score > bestScore) { bestScore = score; best = x; }
  }
  return { edge: best, score: bestScore };
}

/** Find strongest horizontal-edge row within [lo,hi] using vertical gradient sums. */
function snapHorizontal(gray, W, H, lo, hi, x0, x1) {
  let best = lo, bestScore = -1;
  for (let y = Math.max(2, lo); y <= Math.min(H - 3, hi); y++) {
    let s = 0, n = 0;
    for (let x = x0; x < x1; x += 3) {
      s += Math.abs(gray[(y + 2) * W + x] - gray[(y - 2) * W + x]);
      n++;
    }
    const score = s / n;
    if (score > bestScore) { bestScore = score; best = y; }
  }
  return { edge: best, score: bestScore };
}

/** Build a feathered rounded-rect alpha mask (raw single-channel buffer). */
async function roundedMask(w, h, radius, feather) {
  // supersample 2x for smooth anti-aliased corners
  const S = 2;
  const W = w * S, H = h * S, R = radius * S;
  const m = Buffer.alloc(W * H, 0);
  // fill rounded rect via corner-distance test
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const dx = Math.max(R - x, x - (W - 1 - R), 0);
      const dy = Math.max(R - y, y - (H - 1 - R), 0);
      m[y * W + x] = dx * dx + dy * dy <= R * R ? 255 : 0;
    }
  }
  const r = await sharp(m, { raw: { width: W, height: H, channels: 1 } })
    .blur(feather * S)
    .resize(w, h, { kernel: "lanczos3" })
    .raw()
    .toBuffer({ resolveWithObject: true });
  return r.data;
}

async function cropDevice(srcPath, outPath, box, opts) {
  const { radiusPct = 0.09, feather = 1.4, outWidth = 640, margin = 2, snapWin = 46 } = opts;
  const meta = await sharp(srcPath).metadata();
  const W = meta.width, H = meta.height;
  const { data: gray } = await sharp(srcPath)
    .removeAlpha()
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // initial estimate in pixels
  let L = Math.round(box.L / 100 * W), R = Math.round(box.R / 100 * W);
  let T = Math.round(box.T / 100 * H), B = Math.round(box.B / 100 * H);

  // snap edges — search strongest gradient near the estimate
  const midY0 = Math.round(T + (B - T) * 0.22), midY1 = Math.round(B - (B - T) * 0.22);
  const midX0 = Math.round(L + (R - L) * 0.22), midX1 = Math.round(R - (R - L) * 0.22);
  const sL = snapVertical(gray, W, H, L - snapWin, L + snapWin, midY0, midY1);
  const sR = snapVertical(gray, W, H, R - snapWin, R + snapWin, midY0, midY1);
  const sT = snapHorizontal(gray, W, H, T - snapWin, T + snapWin, midX0, midX1);
  const sB = snapHorizontal(gray, W, H, B - snapWin, B + snapWin, midX0, midX1);

  let nL = sL.edge, nR = sR.edge, nT = sT.edge, nB = sB.edge;

  // sanity: keep edges ordered & device-like ratio; else fall back to VLM box
  const wEst = nR - nL, hEst = nB - nT;
  const ratio = wEst / hEst;
  const minRatio = opts.minRatio ?? 0.40, maxRatio = opts.maxRatio ?? 0.62;
  let usedSnap = true;
  if (nR - nL < 100 || nB - nT < 100 || ratio < minRatio || ratio > maxRatio ||
      Math.abs(nL - L) > snapWin || Math.abs(nR - R) > snapWin ||
      Math.abs(nT - T) > snapWin + 20 || Math.abs(nB - B) > snapWin + 20) {
    usedSnap = false;
    nL = L; nR = R; nT = T; nB = B;
  }

  // final crop with a hair of margin
  const cx = Math.max(0, nL - margin), cy = Math.max(0, nT - margin);
  const cw = Math.min(W, nR + margin) - cx, ch = Math.min(H, nB + margin) - cy;
  const radius = Math.round(cw * radiusPct);

  const mask = await roundedMask(cw, ch, radius, feather);

  const { data: rgba, info } = await sharp(srcPath)
    .removeAlpha()
    .extract({ left: cx, top: cy, width: cw, height: ch })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // apply mask to alpha channel
  for (let i = 0, p = 0; i < mask.length; i++, p += 4) {
    rgba[p + 3] = Math.min(rgba[p + 3], mask[i]);
  }

  const stats = {
    name: outPath.split("/").pop(),
    snapped: usedSnap,
    edges: { L: nL, R: nR, T: nT, B: nB },
    snapScores: { L: +sL.score.toFixed(1), R: +sR.score.toFixed(1), T: +sT.score.toFixed(1), B: +sB.score.toFixed(1) },
    ratio: +ratio.toFixed(4),
    size: cw + "x" + ch,
  };

  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .resize({ width: outWidth })
    .webp({ quality: 90, alphaQuality: 95 })
    .toFile(outPath);

  return stats;
}

(async () => {
  const outDir = "public/assets/mobile/phones";
  fs.mkdirSync(outDir, { recursive: true });
  const tvDir = "public/assets/tv";
  fs.mkdirSync(tvDir, { recursive: true });

  for (const p of PHONES) {
    const st = await cropDevice(
      "upload/" + p.file,
      `${outDir}/p-${p.name}.webp`,
      p.box,
      { radiusPct: 0.095, outWidth: 640, snapWin: 46, minRatio: 0.40, maxRatio: 0.62 }
    );
    console.log(JSON.stringify(st));
  }

  for (const t of TVS) {
    const st = await cropDevice(
      "upload/" + t.file,
      `${tvDir}/tv-${t.name}-real.webp`,
      t.box,
      { radiusPct: 0.013, feather: 1.2, outWidth: 1600, snapWin: 60, minRatio: 1.4, maxRatio: 2.2 }
    );
    console.log(JSON.stringify(st));
  }
})();
