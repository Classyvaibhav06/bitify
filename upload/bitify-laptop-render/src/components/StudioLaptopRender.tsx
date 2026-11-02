import React, { useMemo } from 'react';
import {
  CameraConfig,
  Point2D,
  Vec3,
  computeHomographyMatrix3d,
  pointsToSvgPath,
  projectPoint3D,
  sampleRoundedRect2D,
} from '../utils/homography';
import {
  BitifyDesktopApp,
  SCREEN_PIXEL_HEIGHT,
  SCREEN_PIXEL_WIDTH,
} from './BitifyDesktopApp';
import {
  DECK_PIXEL_HEIGHT,
  DECK_PIXEL_WIDTH,
  LaptopKeyboardDeck,
} from './LaptopKeyboardDeck';

export interface StudioRenderSettings {
  yawDeg: number;
  pitchDeg: number;
  lidAngleDeg: number;
  keyLightIntensity: number;
  crimsonRimIntensity: number;
  screenBrightness: number;
  shadowIntensity: number;
}

export const DEFAULT_STUDIO_SETTINGS: StudioRenderSettings = {
  yawDeg: -19.5,         // Front-facing three-quarter angle
  pitchDeg: 17.5,        // Slightly elevated camera angle showing keyboard deck
  lidAngleDeg: 102.5,    // Natural open screen angle
  keyLightIntensity: 1.0,
  crimsonRimIntensity: 1.0,
  screenBrightness: 1.02,
  shadowIntensity: 1.0,
};

export const STAGE_WIDTH = 1440;
export const STAGE_HEIGHT = 960;

interface StudioLaptopRenderProps {
  settings: StudioRenderSettings;
  stageRef?: React.RefObject<HTMLDivElement | null>;
}

export const StudioLaptopRender: React.FC<StudioLaptopRenderProps> = ({
  settings,
  stageRef,
}) => {
  const cam: CameraConfig = useMemo(
    () => ({
      yawDeg: settings.yawDeg,
      pitchDeg: settings.pitchDeg,
      lidAngleDeg: settings.lidAngleDeg,
      distance: 1060,
      focalLength: 2280,
      target: { x: -8, y: 60, z: 98 },
      viewportCenter: { x: STAGE_WIDTH * 0.5, y: STAGE_HEIGHT * 0.5 },
    }),
    [settings.yawDeg, settings.pitchDeg, settings.lidAngleDeg]
  );

  // Physical dimensions in millimeter-scale 3D space
  const halfW = 178; // 356mm total width
  const deckDepth = 246; // 246mm deck depth
  const lidHeight = 234; // 234mm display lid height
  const lidThickness = 5.0; // Slim 5.0mm anodized aluminum lid
  const baseWallBottomY = -10.8; // Vertical side wall bottom
  const basePanBottomY = -13.8; // Tapered lower chassis pan

  // Convert display lid local coordinates (u, v, w) to 3D world space
  // u: [-halfW..+halfW], v: [0..lidHeight] along lid face, w: [-lidThickness..0] depth into back shell
  const lidPointToWorld = useMemo(() => {
    const tiltBackRad = ((settings.lidAngleDeg - 90) * Math.PI) / 180;
    const cosT = Math.cos(tiltBackRad);
    const sinT = Math.sin(tiltBackRad);
    const hingeY = 1.2;
    const hingeZ = 7.5;

    return (u: number, v: number, w = 0): Vec3 => ({
      x: u,
      y: hingeY + v * cosT - w * sinT,
      z: hingeZ - v * sinT + w * cosT,
    });
  }, [settings.lidAngleDeg]);

  // 1. Compute 4 Projected Corners of the Active Display Screen Aperture
  // Physical screen aperture: u in [-172.5, +172.5] (345mm), v in [11.2, 226.8] (215.6mm) -> exact 16:10
  const screenQuad = useMemo((): [Point2D, Point2D, Point2D, Point2D] => {
    const uMin = -172.4;
    const uMax = 172.4;
    const vBottom = 11.2;
    const vTop = 226.8;

    const tl = projectPoint3D(lidPointToWorld(uMin, vTop, 0), cam);
    const tr = projectPoint3D(lidPointToWorld(uMax, vTop, 0), cam);
    const br = projectPoint3D(lidPointToWorld(uMax, vBottom, 0), cam);
    const bl = projectPoint3D(lidPointToWorld(uMin, vBottom, 0), cam);
    return [tl, tr, br, bl];
  }, [cam, lidPointToWorld]);

  const screenMatrix3d = useMemo(
    () =>
      computeHomographyMatrix3d(
        SCREEN_PIXEL_WIDTH,
        SCREEN_PIXEL_HEIGHT,
        screenQuad
      ),
    [screenQuad]
  );

  // 2. Compute 4 Projected Corners of the Top Keyboard Deck Plane (Y = 0)
  const deckQuad = useMemo((): [Point2D, Point2D, Point2D, Point2D] => {
    const tl = projectPoint3D({ x: -halfW, y: 0, z: 0 }, cam);
    const tr = projectPoint3D({ x: halfW, y: 0, z: 0 }, cam);
    const br = projectPoint3D({ x: halfW, y: 0, z: deckDepth }, cam);
    const bl = projectPoint3D({ x: -halfW, y: 0, z: deckDepth }, cam);
    return [tl, tr, br, bl];
  }, [cam, halfW, deckDepth]);

  const deckMatrix3d = useMemo(
    () =>
      computeHomographyMatrix3d(DECK_PIXEL_WIDTH, DECK_PIXEL_HEIGHT, deckQuad),
    [deckQuad]
  );

  // 3. Sample 3D Rounded Contours for Lid, Screen Bezel, Deck, Lower Chassis, and Shadows
  const geometryPaths = useMemo(() => {
    // Lid 2D local rounded contour (note: in 2D sampling yMin is bottom v=0, yMax is top v=lidHeight)
    const lidContourLocal = sampleRoundedRect2D(
      -halfW,
      halfW,
      0,
      lidHeight,
      [5, 5, 11.5, 11.5],
      12
    );

    const lidFrontPts = lidContourLocal.map((p) =>
      projectPoint3D(lidPointToWorld(p.x, p.y, 0), cam)
    );
    const lidBackPts = lidContourLocal.map((p) =>
      projectPoint3D(lidPointToWorld(p.x, p.y, -lidThickness), cam)
    );

    // Lid inner bezel step (1.5mm inset)
    const lidInnerPts = sampleRoundedRect2D(
      -halfW + 1.6,
      halfW - 1.6,
      1.4,
      lidHeight - 1.6,
      [4, 4, 10, 10],
      10
    ).map((p) => projectPoint3D(lidPointToWorld(p.x, p.y, 0), cam));

    // Build 3D extruded rim quads between lidBackPts and lidFrontPts
    const lidRimSegments: {
      d: string;
      color: string;
      isTopKeyLight: boolean;
      isCrimsonRim: boolean;
    }[] = [];

    for (let i = 0; i < lidFrontPts.length; i++) {
      const next = (i + 1) % lidFrontPts.length;
      const pL1 = lidContourLocal[i];
      const pL2 = lidContourLocal[next];
      const midU = (pL1.x + pL2.x) * 0.5;
      const midV = (pL1.y + pL2.y) * 0.5;

      const isTop = midV > lidHeight - 14;
      const isRightSide = midU > halfW - 14;
      const isLeftSide = midU < -halfW + 14;

      let fill = '#16161B';
      if (isTop) {
        fill = '#383436'; // Warm-white key light grazing upper edge
      } else if (isRightSide || isLeftSide) {
        fill = '#2A1720'; // Subtle crimson rim light along outer edges
      }

      const segPath = pointsToSvgPath(
        [lidBackPts[i], lidBackPts[next], lidFrontPts[next], lidFrontPts[i]],
        true
      );
      lidRimSegments.push({
        d: segPath,
        color: fill,
        isTopKeyLight: isTop,
        isCrimsonRim: isRightSide || isLeftSide,
      });
    }

    // Top camera notch/sensor coordinates on upper bezel
    const camCenter = projectPoint3D(
      lidPointToWorld(0, lidHeight - 3.8, 0),
      cam
    );
    const camSensorLeft = projectPoint3D(
      lidPointToWorld(-4.5, lidHeight - 3.8, 0),
      cam
    );

    // Cylindrical hinge barrel between (X in [-132, +132])
    const hingeTopLeft = projectPoint3D({ x: -134, y: 4.2, z: 6.5 }, cam);
    const hingeTopRight = projectPoint3D({ x: 134, y: 4.2, z: 6.5 }, cam);
    const hingeBotRight = projectPoint3D({ x: 134, y: -1.2, z: 11.5 }, cam);
    const hingeBotLeft = projectPoint3D({ x: -134, y: -1.2, z: 11.5 }, cam);
    const hingePath = pointsToSvgPath([
      hingeTopLeft,
      hingeTopRight,
      hingeBotRight,
      hingeBotLeft,
    ]);

    // Deck 2D local contour: X in [-halfW..+halfW], Z in [0..deckDepth]
    const deckContourLocal = sampleRoundedRect2D(
      -halfW,
      halfW,
      0,
      deckDepth,
      [11, 11, 13.5, 13.5],
      14
    );

    const deckTopPts = deckContourLocal.map((p) =>
      projectPoint3D({ x: p.x, y: 0, z: p.y }, cam)
    );
    const deckMidPts = deckContourLocal.map((p) =>
      projectPoint3D({ x: p.x, y: baseWallBottomY, z: p.y }, cam)
    );

    // Inset tapered lower pan contour
    const panContourLocal = sampleRoundedRect2D(
      -halfW + 5.5,
      halfW - 5.5,
      5.5,
      deckDepth - 5.5,
      [10, 10, 12, 12],
      12
    );
    const deckPanPts = panContourLocal.map((p) =>
      projectPoint3D({ x: p.x, y: basePanBottomY, z: p.y }, cam)
    );

    // Build 3D vertical wall segments around the unibody deck perimeter
    const deckWallSegments: { d: string; fill: string }[] = [];
    for (let i = 0; i < deckTopPts.length; i++) {
      const next = (i + 1) % deckTopPts.length;
      const c1 = deckContourLocal[i];
      const c2 = deckContourLocal[next];

      // Outward 2D normal in (X, Z) plane
      const dx = c2.x - c1.x;
      const dz = c2.y - c1.y;
      const len = Math.hypot(dx, dz) || 1;
      const nx = dz / len;
      const nz = -dx / len;

      // Shade based on normal orientation (front lip vs left/right side walls vs corner curve)
      let r = 20;
      let g = 20;
      let b = 25;

      // Front-facing lip receives soft warm studio fill
      if (nz > 0.4) {
        const frontFactor = (nz - 0.4) / 0.6;
        r += Math.round(frontFactor * 14 * settings.keyLightIntensity);
        g += Math.round(frontFactor * 13 * settings.keyLightIntensity);
        b += Math.round(frontFactor * 15 * settings.keyLightIntensity);
      }

      // Corner specular catchlight where side wall curves into front lip
      const cornerHighlight = Math.max(0, 1 - Math.abs(Math.abs(nx) - 0.7) * 3.2);
      if (nz > 0) {
        r += Math.round(cornerHighlight * 28 * settings.keyLightIntensity);
        g += Math.round(cornerHighlight * 25 * settings.keyLightIntensity);
        b += Math.round(cornerHighlight * 27 * settings.keyLightIntensity);
      }

      // Crimson rim light along outer side edges
      if (Math.abs(nx) > 0.55) {
        r += Math.round(24 * settings.crimsonRimIntensity);
        g += Math.round(4 * settings.crimsonRimIntensity);
        b += Math.round(10 * settings.crimsonRimIntensity);
      }

      const segPath = pointsToSvgPath([
        deckTopPts[i],
        deckTopPts[next],
        deckMidPts[next],
        deckMidPts[i],
      ]);
      deckWallSegments.push({
        d: segPath,
        fill: `rgb(${Math.min(255, r)}, ${Math.min(255, g)}, ${Math.min(255, b)})`,
      });
    }

    // Build tapered lower bevel segments between deckMidPts and deckPanPts
    const lowerChamferPoly = pointsToSvgPath(deckMidPts);
    const lowerPanPoly = pointsToSvgPath(deckPanPts);

    // Front lip ergonomic CNC thumb notch (X in [-27, +27], Z = deckDepth, Y in [-4.4, 0])
    const notchPts = [
      projectPoint3D({ x: -27, y: 0, z: deckDepth }, cam),
      projectPoint3D({ x: 27, y: 0, z: deckDepth }, cam),
      projectPoint3D({ x: 24.5, y: -4.4, z: deckDepth }, cam),
      projectPoint3D({ x: -24.5, y: -4.4, z: deckDepth }, cam),
    ];
    const notchBottomRim = [
      projectPoint3D({ x: -24.5, y: -4.4, z: deckDepth }, cam),
      projectPoint3D({ x: 24.5, y: -4.4, z: deckDepth }, cam),
    ];

    // Side ports on whichever side wall faces the camera (left wall X = -halfW when yaw < 0, right wall X = +halfW when yaw > 0)
    const sideX = settings.yawDeg <= 0 ? -halfW : halfW;
    const makeSidePort = (zStart: number, zEnd: number, yTop: number, yBot: number) =>
      pointsToSvgPath([
        projectPoint3D({ x: sideX, y: yTop, z: zStart }, cam),
        projectPoint3D({ x: sideX, y: yTop, z: zEnd }, cam),
        projectPoint3D({ x: sideX, y: yBot, z: zEnd }, cam),
        projectPoint3D({ x: sideX, y: yBot, z: zStart }, cam),
      ]);

    const sidePorts = [
      // MagSafe 3 Port
      { d: makeSidePort(28, 46, -2.8, -7.6), isMagSafe: true },
      // Thunderbolt / USB-C Port 1
      { d: makeSidePort(58, 71, -3.4, -7.2), isMagSafe: false },
      // Thunderbolt / USB-C Port 2
      { d: makeSidePort(82, 95, -3.4, -7.2), isMagSafe: false },
      // 3.5mm Studio Audio Jack
      { d: makeSidePort(110, 116, -3.8, -7.0), isMagSafe: false },
    ];

    // Four Rubber Feet underneath the chassis corners + their tight contact shadows
    const footConfigs = [
      { x: -halfW + 26, z: 26, r: 12 },
      { x: halfW - 26, z: 26, r: 12 },
      { x: -halfW + 26, z: deckDepth - 26, r: 12 },
      { x: halfW - 26, z: deckDepth - 26, r: 12 },
    ];

    const rubberFeet = footConfigs.map((fc) => {
      const topLoop: Point2D[] = [];
      const botLoop: Point2D[] = [];
      const shadowLoop: Point2D[] = [];
      const steps = 16;
      for (let i = 0; i < steps; i++) {
        const a = (i / steps) * Math.PI * 2;
        const px = fc.x + Math.cos(a) * fc.r;
        const pz = fc.z + Math.sin(a) * fc.r;
        topLoop.push(projectPoint3D({ x: px, y: basePanBottomY + 0.5, z: pz }, cam));
        botLoop.push(projectPoint3D({ x: px, y: basePanBottomY - 2.2, z: pz }, cam));
        shadowLoop.push(
          projectPoint3D(
            {
              x: fc.x + Math.cos(a) * (fc.r * 1.45),
              y: basePanBottomY - 2.5,
              z: fc.z + Math.sin(a) * (fc.r * 1.45),
            },
            cam
          )
        );
      }
      return {
        footPath: pointsToSvgPath(botLoop),
        shadowPath: pointsToSvgPath(shadowLoop),
      };
    });

    // Studio Contact Shadows on the ground plane (Y = basePanBottomY - 2.6)
    // Kept tight and natural directly beneath the laptop chassis
    const shadowOuterPts = sampleRoundedRect2D(
      -halfW - 10,
      halfW + 10,
      -8,
      deckDepth + 10,
      [22, 22, 26, 26],
      12
    ).map((p) =>
      projectPoint3D({ x: p.x, y: basePanBottomY - 2.8, z: p.y }, cam)
    );

    const shadowCorePts = sampleRoundedRect2D(
      -halfW + 4,
      halfW - 4,
      4,
      deckDepth - 2,
      [14, 14, 16, 16],
      12
    ).map((p) =>
      projectPoint3D({ x: p.x, y: basePanBottomY - 2.4, z: p.y }, cam)
    );

    // Upper display lid warm-white key light highlight path
    const topKeyLightPts: Point2D[] = [];
    for (let u = -halfW + 10; u <= halfW - 10; u += 12) {
      topKeyLightPts.push(
        projectPoint3D(lidPointToWorld(u, lidHeight - 0.4, -0.5), cam)
      );
    }

    // Outer display lid crimson rim highlight path
    const rightCrimsonRimPts: Point2D[] = [];
    for (let v = 10; v <= lidHeight - 10; v += 12) {
      rightCrimsonRimPts.push(
        projectPoint3D(lidPointToWorld(halfW - 0.3, v, -0.8), cam)
      );
    }

    const leftCrimsonRimPts: Point2D[] = [];
    for (let v = 10; v <= lidHeight - 10; v += 12) {
      leftCrimsonRimPts.push(
        projectPoint3D(lidPointToWorld(-halfW + 0.3, v, -0.8), cam)
      );
    }

    return {
      lidFrontPath: pointsToSvgPath(lidFrontPts),
      lidBackPath: pointsToSvgPath(lidBackPts),
      lidInnerPath: pointsToSvgPath(lidInnerPts),
      lidRimSegments,
      camCenter,
      camSensorLeft,
      hingePath,
      deckTopPath: pointsToSvgPath(deckTopPts),
      deckMidPath: lowerChamferPoly,
      deckPanPath: lowerPanPoly,
      deckWallSegments,
      notchPath: pointsToSvgPath(notchPts),
      notchBottomRim,
      sidePorts,
      rubberFeet,
      shadowOuterPath: pointsToSvgPath(shadowOuterPts),
      shadowCorePath: pointsToSvgPath(shadowCorePts),
      topKeyLightPath: pointsToSvgPath(topKeyLightPts, false),
      rightCrimsonRimPath: pointsToSvgPath(rightCrimsonRimPts, false),
      leftCrimsonRimPath: pointsToSvgPath(leftCrimsonRimPts, false),
    };
  }, [
    cam,
    halfW,
    lidHeight,
    lidThickness,
    deckDepth,
    baseWallBottomY,
    basePanBottomY,
    lidPointToWorld,
    settings.keyLightIntensity,
    settings.crimsonRimIntensity,
    settings.yawDeg,
  ]);

  return (
    <div
      ref={stageRef}
      style={{
        width: `${STAGE_WIDTH}px`,
        height: `${STAGE_HEIGHT}px`,
        background: 'transparent',
      }}
      className="relative select-none overflow-visible"
    >
      {/* LAYER 1: STUDIO CONTACT SHADOWS, LOWER CHASSIS BASE, AND 3D DISPLAY LID FRAME */}
      <svg
        width={STAGE_WIDTH}
        height={STAGE_HEIGHT}
        viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`}
        className="pointer-events-none absolute inset-0 overflow-visible"
      >
        <defs>
          {/* Tight Natural Studio Contact Shadow Blur */}
          <filter
            id="contact-shadow-outer"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur stdDeviation="22" />
          </filter>
          <filter
            id="contact-shadow-core"
            x="-15%"
            y="-15%"
            width="130%"
            height="130%"
          >
            <feGaussianBlur stdDeviation="9" />
          </filter>
          <filter
            id="foot-shadow-blur"
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
          >
            <feGaussianBlur stdDeviation="3.5" />
          </filter>
          <filter id="rim-glow-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.6" />
          </filter>

          {/* Matte-Black Anodized Display Lid Front Bezel Gradient */}
          <linearGradient id="lid-bezel-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1B1B21" />
            <stop offset="35%" stopColor="#111116" />
            <stop offset="75%" stopColor="#0C0C10" />
            <stop offset="100%" stopColor="#171217" />
          </linearGradient>

          {/* Display Glass Inner Frame Gradient */}
          <linearGradient id="lid-glass-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0E0E12" />
            <stop offset="50%" stopColor="#08080B" />
            <stop offset="100%" stopColor="#0C0A0E" />
          </linearGradient>

          {/* Warm-White Studio Key Light Edge Gradient */}
          <linearGradient id="warm-key-light" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255, 247, 237, 0.15)" />
            <stop offset="28%" stopColor="rgba(254, 243, 199, 0.85)" />
            <stop offset="65%" stopColor="rgba(255, 250, 245, 0.9)" />
            <stop offset="100%" stopColor="rgba(244, 63, 94, 0.55)" />
          </linearGradient>

          {/* Subtle Crimson Rim Light Gradient */}
          <linearGradient id="crimson-rim-light" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(251, 113, 133, 0.78)" />
            <stop offset="50%" stopColor="rgba(225, 29, 72, 0.88)" />
            <stop offset="100%" stopColor="rgba(159, 18, 57, 0.25)" />
          </linearGradient>

          {/* Lower Base Tapered Pan Gradient */}
          <linearGradient id="base-pan-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#09090C" />
            <stop offset="48%" stopColor="#121217" />
            <stop offset="85%" stopColor="#0B0B0E" />
            <stop offset="100%" stopColor="#191015" />
          </linearGradient>

          {/* Cylindrical Hinge Gradient */}
          <linearGradient id="hinge-barrel-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#26262E" />
            <stop offset="40%" stopColor="#121217" />
            <stop offset="100%" stopColor="#060608" />
          </linearGradient>
        </defs>

        {/* 1. NATURAL STUDIO CONTACT SHADOWS BENEATH LAPTOP */}
        <g opacity={settings.shadowIntensity}>
          <path
            d={geometryPaths.shadowOuterPath}
            fill="rgba(0, 0, 0, 0.48)"
            filter="url(#contact-shadow-outer)"
          />
          <path
            d={geometryPaths.shadowCorePath}
            fill="rgba(0, 0, 0, 0.76)"
            filter="url(#contact-shadow-core)"
          />
          {geometryPaths.rubberFeet.map((rf, i) => (
            <path
              key={`fsh-${i}`}
              d={rf.shadowPath}
              fill="rgba(0, 0, 0, 0.88)"
              filter="url(#foot-shadow-blur)"
            />
          ))}
        </g>

        {/* 2. FOUR LOW-PROFILE MATTE RUBBER FEET */}
        {geometryPaths.rubberFeet.map((rf, i) => (
          <path
            key={`foot-${i}`}
            d={rf.footPath}
            fill="#070709"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.7"
          />
        ))}

        {/* 3. LOWER CHASSIS TAPERED BELLY PAN (Underneath the vertical deck walls) */}
        <path
          d={geometryPaths.deckPanPath}
          fill="url(#base-pan-grad)"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="0.8"
        />
        <path
          d={geometryPaths.deckMidPath}
          fill="url(#base-pan-grad)"
          stroke="rgba(0,0,0,0.8)"
          strokeWidth="1"
        />

        {/* 4. DISPLAY LID 3D EXTRUDED ALUMINUM THICKNESS RIM */}
        <path d={geometryPaths.lidBackPath} fill="#121216" />
        {geometryPaths.lidRimSegments.map((seg, idx) => (
          <path
            key={`lid-rim-${idx}`}
            d={seg.d}
            fill={seg.color}
            stroke={seg.color}
            strokeWidth="0.6"
          />
        ))}

        {/* 5. DISPLAY LID FRONT ANODIZED ALUMINUM FRAME & GLASS BEZEL */}
        <path
          d={geometryPaths.lidFrontPath}
          fill="url(#lid-bezel-grad)"
          stroke="rgba(255, 250, 242, 0.22)"
          strokeWidth="1.1"
        />
        <path
          d={geometryPaths.lidInnerPath}
          fill="url(#lid-glass-grad)"
          stroke="rgba(255, 255, 255, 0.06)"
          strokeWidth="0.8"
        />

        {/* 6. WARM-WHITE KEY LIGHT ALONG UPPER DISPLAY LID EDGE */}
        <path
          d={geometryPaths.topKeyLightPath}
          fill="none"
          stroke="url(#warm-key-light)"
          strokeWidth={2.2 * settings.keyLightIntensity}
          strokeLinecap="round"
          filter="url(#rim-glow-soft)"
          opacity={0.9 * settings.keyLightIntensity}
        />

        {/* 7. SUBTLE CRIMSON RIM LIGHT ALONG OUTER DISPLAY EDGES */}
        <path
          d={geometryPaths.rightCrimsonRimPath}
          fill="none"
          stroke="url(#crimson-rim-light)"
          strokeWidth={2.0 * settings.crimsonRimIntensity}
          strokeLinecap="round"
          opacity={0.85 * settings.crimsonRimIntensity}
        />
        <path
          d={geometryPaths.leftCrimsonRimPath}
          fill="none"
          stroke="url(#crimson-rim-light)"
          strokeWidth={1.6 * settings.crimsonRimIntensity}
          strokeLinecap="round"
          opacity={0.7 * settings.crimsonRimIntensity}
        />

        {/* 8. BUILT-IN STUDIO CAMERA LENS & SENSOR IN TOP BEZEL */}
        <circle
          cx={geometryPaths.camCenter.x}
          cy={geometryPaths.camCenter.y}
          r="3.2"
          fill="#050507"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="0.7"
        />
        <circle
          cx={geometryPaths.camCenter.x - 0.6}
          cy={geometryPaths.camCenter.y - 0.6}
          r="1.1"
          fill="rgba(56, 189, 248, 0.45)"
        />
        <circle
          cx={geometryPaths.camSensorLeft.x}
          cy={geometryPaths.camSensorLeft.y}
          r="1.2"
          fill="rgba(52, 211, 153, 0.65)"
        />
      </svg>

      {/* LAYER 2: PROJECTIVE 3D BITIFY DESKTOP APPLICATION ON LAPTOP SCREEN */}
      <div
        style={{
          width: `${SCREEN_PIXEL_WIDTH}px`,
          height: `${SCREEN_PIXEL_HEIGHT}px`,
          transformOrigin: '0 0',
          transform: screenMatrix3d,
          filter: `brightness(${settings.screenBrightness})`,
          borderRadius: '9px 9px 2px 2px',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.07)',
        }}
        className="absolute top-0 left-0 overflow-hidden"
      >
        <BitifyDesktopApp />

        {/* Subtle Studio Display Glass Diagonal Reflection Overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-30"
          style={{
            background:
              'linear-gradient(122deg, rgba(255, 250, 244, 0.048) 0%, rgba(255, 255, 255, 0.015) 34%, transparent 34.5%, transparent 100%)',
          }}
        />
      </div>

      {/* LAYER 3: CYLINDRICAL HINGE & 3D EXTRUDED UNIBODY DECK SIDE WALLS */}
      <svg
        width={STAGE_WIDTH}
        height={STAGE_HEIGHT}
        viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`}
        className="pointer-events-none absolute inset-0 overflow-visible"
      >
        {/* Cylindrical Anodized Hinge Barrel */}
        <path
          d={geometryPaths.hingePath}
          fill="url(#hinge-barrel-grad)"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.7"
        />

        {/* Continuous 3D Extruded Unibody Side & Front Walls around Rounded Corners */}
        {geometryPaths.deckWallSegments.map((seg, idx) => (
          <path
            key={`deck-wall-${idx}`}
            d={seg.d}
            fill={seg.fill}
            stroke={seg.fill}
            strokeWidth="0.65"
          />
        ))}

        {/* Base Top Surface Backing Plate */}
        <path d={geometryPaths.deckTopPath} fill="#15151A" />
      </svg>

      {/* LAYER 4: PROJECTIVE 3D KEYBOARD & TRACKPAD DECK SURFACE */}
      <div
        style={{
          width: `${DECK_PIXEL_WIDTH}px`,
          height: `${DECK_PIXEL_HEIGHT}px`,
          transformOrigin: '0 0',
          transform: deckMatrix3d,
        }}
        className="pointer-events-none absolute top-0 left-0"
      >
        <LaptopKeyboardDeck
          keyLightIntensity={settings.keyLightIntensity}
          crimsonRimIntensity={settings.crimsonRimIntensity}
        />
      </div>

      {/* LAYER 5: FOREGROUND CNC THUMB NOTCH, SIDE PORTS & METALLIC EDGE HIGHLIGHTS */}
      <svg
        width={STAGE_WIDTH}
        height={STAGE_HEIGHT}
        viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`}
        className="pointer-events-none absolute inset-0 overflow-visible"
      >
        {/* Side Port Cutouts (MagSafe 3, 2x Thunderbolt 4, 3.5mm Audio) */}
        {geometryPaths.sidePorts.map((port, idx) => (
          <path
            key={`port-${idx}`}
            d={port.d}
            fill="#050507"
            stroke={
              port.isMagSafe
                ? 'rgba(255, 248, 235, 0.28)'
                : 'rgba(225, 29, 72, 0.32)'
            }
            strokeWidth="0.85"
          />
        ))}

        {/* Front Lip Ergonomic CNC Thumb Notch */}
        <path
          d={geometryPaths.notchPath}
          fill="#09090C"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="0.8"
        />
        <line
          x1={geometryPaths.notchBottomRim[0].x}
          y1={geometryPaths.notchBottomRim[0].y}
          x2={geometryPaths.notchBottomRim[1].x}
          y2={geometryPaths.notchBottomRim[1].y}
          stroke={`rgba(255, 247, 237, ${0.42 * settings.keyLightIntensity})`}
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Subtle Anodized Metallic Chamfer Outline Around Top Deck Perimeter */}
        <path
          d={geometryPaths.deckTopPath}
          fill="none"
          stroke={`rgba(255, 248, 238, ${0.22 * settings.keyLightIntensity})`}
          strokeWidth="1.0"
        />
      </svg>
    </div>
  );
};
