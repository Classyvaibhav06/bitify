export interface TrackItem {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  durationSec: number;
  coverId: string;
  quality: string;
  plays: string;
  liked: boolean;
  bpm: number;
  baseFreq: number;
  addedAt: string;
}

export interface AlbumItem {
  id: string;
  title: string;
  artist: string;
  year: string;
  genre: string;
  coverId: string;
  trackCount: number;
  badge?: string;
  accentColor: string;
}

const coverCache: Record<string, string> = {};

/**
 * Generates high-resolution, varied, realistic album cover artwork as Data URLs
 * with rich lighting, atmospheric gradients, geometric/photographic compositions,
 * subtle film grain, and refined album typography.
 */
export function getAlbumCoverDataUrl(coverId: string): string {
  if (coverCache[coverId]) {
    return coverCache[coverId];
  }

  if (typeof document === 'undefined') return '';

  const size = 360;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Helper: subtle film grain / studio texture
  const applyVignetteAndDepth = (innerAlpha = 0, outerAlpha = 0.42) => {
    const vig = ctx.createRadialGradient(
      size * 0.5,
      size * 0.45,
      size * 0.15,
      size * 0.5,
      size * 0.5,
      size * 0.72
    );
    vig.addColorStop(0, `rgba(255,255,255,${innerAlpha})`);
    vig.addColorStop(1, `rgba(0,0,0,${outerAlpha})`);
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, size, size);
  };

  switch (coverId) {
    case 'nocturne': {
      // Deep crimson & warm gold solar eclipse over obsidian mountain horizon
      const bg = ctx.createLinearGradient(0, 0, 0, size);
      bg.addColorStop(0, '#09070c');
      bg.addColorStop(0.55, '#240b15');
      bg.addColorStop(1, '#060508');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, size, size);

      // Corona glow
      const corona = ctx.createRadialGradient(
        size * 0.5,
        size * 0.44,
        size * 0.16,
        size * 0.5,
        size * 0.44,
        size * 0.45
      );
      corona.addColorStop(0, 'rgba(251, 191, 36, 0.95)');
      corona.addColorStop(0.22, 'rgba(225, 29, 72, 0.75)');
      corona.addColorStop(0.58, 'rgba(159, 18, 57, 0.22)');
      corona.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = corona;
      ctx.fillRect(0, 0, size, size);

      // Eclipse disc
      ctx.beginPath();
      ctx.arc(size * 0.5, size * 0.44, size * 0.175, 0, Math.PI * 2);
      ctx.fillStyle = '#070609';
      ctx.fill();
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.75)';
      ctx.stroke();

      // Mountain ridge silhouette
      ctx.beginPath();
      ctx.moveTo(0, size * 0.76);
      ctx.lineTo(size * 0.22, size * 0.65);
      ctx.lineTo(size * 0.43, size * 0.72);
      ctx.lineTo(size * 0.68, size * 0.61);
      ctx.lineTo(size * 0.88, size * 0.69);
      ctx.lineTo(size, size * 0.64);
      ctx.lineTo(size, size);
      ctx.lineTo(0, size);
      ctx.closePath();
      const ridgeGrad = ctx.createLinearGradient(0, size * 0.6, 0, size);
      ridgeGrad.addColorStop(0, '#120910');
      ridgeGrad.addColorStop(1, '#050407');
      ctx.fillStyle = ridgeGrad;
      ctx.fill();

      // Subtle water reflection lines
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.28)';
      for (let i = 0; i < 9; i++) {
        const y = size * 0.78 + i * 7;
        const w = (10 - i) * 11;
        ctx.beginPath();
        ctx.moveTo(size * 0.5 - w, y);
        ctx.lineTo(size * 0.5 + w, y);
        ctx.stroke();
      }

      ctx.fillStyle = 'rgba(255,255,255,0.88)';
      ctx.font = '600 13px Inter, sans-serif';
      ctx.letterSpacing = '4px';
      ctx.fillText('NOCTURNE', 24, 34);
      ctx.fillStyle = 'rgba(244, 63, 94, 0.85)';
      ctx.font = '400 10px Inter, sans-serif';
      ctx.fillText('KAELEN VANCE', 24, 50);
      break;
    }

    case 'solaris': {
      // Warm amber, teal twilight & desert sand dunes
      const sky = ctx.createLinearGradient(0, 0, 0, size * 0.75);
      sky.addColorStop(0, '#0d3b4c');
      sky.addColorStop(0.45, '#1e5f6d');
      sky.addColorStop(0.78, '#d97736');
      sky.addColorStop(1, '#f59e0b');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, size, size);

      // Glowing low sun
      const sun = ctx.createRadialGradient(
        size * 0.62,
        size * 0.46,
        4,
        size * 0.62,
        size * 0.46,
        size * 0.26
      );
      sun.addColorStop(0, '#fffbeb');
      sun.addColorStop(0.35, 'rgba(253, 186, 116, 0.85)');
      sun.addColorStop(1, 'rgba(217, 119, 54, 0)');
      ctx.fillStyle = sun;
      ctx.beginPath();
      ctx.arc(size * 0.62, size * 0.46, size * 0.26, 0, Math.PI * 2);
      ctx.fill();

      // Sweeping sand dune 1 (lit side)
      ctx.beginPath();
      ctx.moveTo(0, size * 0.66);
      ctx.quadraticCurveTo(size * 0.38, size * 0.52, size, size * 0.68);
      ctx.lineTo(size, size);
      ctx.lineTo(0, size);
      ctx.closePath();
      const dune1 = ctx.createLinearGradient(0, size * 0.52, size, size);
      dune1.addColorStop(0, '#b45309');
      dune1.addColorStop(0.5, '#78350f');
      dune1.addColorStop(1, '#271206');
      ctx.fillStyle = dune1;
      ctx.fill();

      // Sweeping sand dune 2 (foreground shadow + warm rim)
      ctx.beginPath();
      ctx.moveTo(0, size * 0.82);
      ctx.quadraticCurveTo(size * 0.55, size * 0.63, size, size * 0.77);
      ctx.lineTo(size, size);
      ctx.lineTo(0, size);
      ctx.closePath();
      const dune2 = ctx.createLinearGradient(0, size * 0.65, size, size);
      dune2.addColorStop(0, '#d97706');
      dune2.addColorStop(0.4, '#451a03');
      dune2.addColorStop(1, '#180902');
      ctx.fillStyle = dune2;
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 251, 235, 0.92)';
      ctx.font = '600 13px Inter, sans-serif';
      ctx.fillText('SOLARIS ECHOES', 24, 34);
      ctx.fillStyle = 'rgba(253, 230, 138, 0.78)';
      ctx.font = '400 10px Inter, sans-serif';
      ctx.fillText('AURA & THE GLASS CHOIR', 24, 50);
      break;
    }

    case 'hyperion': {
      // Deep cobalt, cyan & silver architectural brutalist monoliths
      const bg = ctx.createLinearGradient(0, 0, size, size);
      bg.addColorStop(0, '#041022');
      bg.addColorStop(0.5, '#0c2747');
      bg.addColorStop(1, '#051324');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, size, size);

      // Cyan atmospheric mist
      const mist = ctx.createRadialGradient(
        size * 0.35,
        size * 0.35,
        10,
        size * 0.5,
        size * 0.5,
        size * 0.65
      );
      mist.addColorStop(0, 'rgba(56, 189, 248, 0.48)');
      mist.addColorStop(0.5, 'rgba(14, 116, 144, 0.2)');
      mist.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = mist;
      ctx.fillRect(0, 0, size, size);

      // 3D Monolith pillars with sunlit cyan edges
      const pillars = [
        { x: 64, y: 110, w: 54, h: 250, light: '#7dd3fc', dark: '#082038' },
        { x: 138, y: 74, w: 68, h: 286, light: '#bae6fd', dark: '#0b2948' },
        { x: 224, y: 132, w: 62, h: 228, light: '#38bdf8', dark: '#061a2e' },
      ];
      pillars.forEach((p) => {
        // Lit left face
        const g1 = ctx.createLinearGradient(p.x, p.y, p.x + p.w * 0.45, p.y + p.h);
        g1.addColorStop(0, p.light);
        g1.addColorStop(1, '#0284c7');
        ctx.fillStyle = g1;
        ctx.fillRect(p.x, p.y, p.w * 0.42, p.h);

        // Shadow right face
        const g2 = ctx.createLinearGradient(p.x + p.w * 0.42, p.y, p.x + p.w, p.y + p.h);
        g2.addColorStop(0, p.dark);
        g2.addColorStop(1, '#020813');
        ctx.fillStyle = g2;
        ctx.fillRect(p.x + p.w * 0.42, p.y, p.w * 0.58, p.h);
      });

      ctx.fillStyle = '#e0f2fe';
      ctx.font = '700 13px Inter, sans-serif';
      ctx.fillText('HYPERION DRIFT', 24, 34);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '500 10px Inter, sans-serif';
      ctx.fillText('SUBZERO ARCHITECTURE', 24, 50);
      break;
    }

    case 'velvet': {
      // Emerald green, warm brass & vintage studio analog reel
      const bg = ctx.createRadialGradient(
        size * 0.5,
        size * 0.5,
        20,
        size * 0.5,
        size * 0.5,
        size * 0.75
      );
      bg.addColorStop(0, '#0f392b');
      bg.addColorStop(0.6, '#072219');
      bg.addColorStop(1, '#03110c');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, size, size);

      // Metallic gold/brass concentric studio tape reel
      const cx = size * 0.5;
      const cy = size * 0.54;
      const reelGrad = ctx.createLinearGradient(cx - 110, cy - 110, cx + 110, cy + 110);
      reelGrad.addColorStop(0, '#fde68a');
      reelGrad.addColorStop(0.35, '#d97706');
      reelGrad.addColorStop(0.7, '#f59e0b');
      reelGrad.addColorStop(1, '#78350f');

      ctx.beginPath();
      ctx.arc(cx, cy, 104, 0, Math.PI * 2);
      ctx.fillStyle = reelGrad;
      ctx.fill();

      // Dark tape pack inside
      ctx.beginPath();
      ctx.arc(cx, cy, 88, 0, Math.PI * 2);
      ctx.fillStyle = '#071712';
      ctx.fill();

      // Brushed flange cutouts
      for (let i = 0; i < 3; i++) {
        const angle = (i * Math.PI * 2) / 3 - Math.PI / 2;
        const rx = cx + Math.cos(angle) * 54;
        const ry = cy + Math.sin(angle) * 54;
        ctx.beginPath();
        ctx.arc(rx, ry, 20, 0, Math.PI * 2);
        ctx.fillStyle = reelGrad;
        ctx.fill();
      }

      // Center aluminum hub
      ctx.beginPath();
      ctx.arc(cx, cy, 28, 0, Math.PI * 2);
      ctx.fillStyle = '#fef3c7';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, 9, 0, Math.PI * 2);
      ctx.fillStyle = '#04120d';
      ctx.fill();

      ctx.fillStyle = '#ecfdf5';
      ctx.font = '600 13px Inter, sans-serif';
      ctx.fillText('VELVET ANALOG', 24, 34);
      ctx.fillStyle = '#6ee7b7';
      ctx.font = '400 10px Inter, sans-serif';
      ctx.fillText('SORA TAKAHASHI', 24, 50);
      break;
    }

    case 'crimson': {
      // Ruby red, rose & obsidian sculpted acoustic wave ribbons
      const bg = ctx.createLinearGradient(0, 0, size, size);
      bg.addColorStop(0, '#180409');
      bg.addColorStop(0.5, '#0d0306');
      bg.addColorStop(1, '#050203');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, size, size);

      for (let layer = 0; layer < 14; layer++) {
        ctx.beginPath();
        const baseY = 95 + layer * 16;
        ctx.moveTo(0, baseY);
        for (let x = 0; x <= size; x += 12) {
          const wave =
            Math.sin(x * 0.022 + layer * 0.45) * 28 +
            Math.cos(x * 0.014 - layer * 0.3) * 16;
          ctx.lineTo(x, baseY + wave);
        }
        const strokeGrad = ctx.createLinearGradient(0, baseY - 30, size, baseY + 30);
        strokeGrad.addColorStop(0, 'rgba(225, 29, 72, 0.15)');
        strokeGrad.addColorStop(0.5, 'rgba(251, 113, 133, 0.85)');
        strokeGrad.addColorStop(1, 'rgba(159, 18, 57, 0.2)');
        ctx.strokeStyle = strokeGrad;
        ctx.lineWidth = 2.4;
        ctx.stroke();
      }

      ctx.fillStyle = '#fff1f2';
      ctx.font = '700 13px Inter, sans-serif';
      ctx.fillText('CRIMSON FREQUENCY', 24, 34);
      ctx.fillStyle = '#fb7185';
      ctx.font = '500 10px Inter, sans-serif';
      ctx.fillText('BITIFY STUDIO SESSIONS', 24, 50);
      break;
    }

    case 'tokyo': {
      // Violet, indigo & warm neon bokeh city lights at night
      const bg = ctx.createLinearGradient(0, 0, 0, size);
      bg.addColorStop(0, '#0c0721');
      bg.addColorStop(0.6, '#1e1136');
      bg.addColorStop(1, '#090514');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, size, size);

      const bokehCircles = [
        { x: 85, y: 180, r: 42, color: 'rgba(244, 63, 94, 0.55)' },
        { x: 150, y: 145, r: 56, color: 'rgba(168, 85, 247, 0.48)' },
        { x: 240, y: 195, r: 48, color: 'rgba(56, 189, 248, 0.52)' },
        { x: 195, y: 245, r: 38, color: 'rgba(251, 191, 36, 0.62)' },
        { x: 110, y: 255, r: 32, color: 'rgba(236, 72, 153, 0.58)' },
        { x: 280, y: 140, r: 30, color: 'rgba(250, 204, 21, 0.45)' },
        { x: 65, y: 230, r: 26, color: 'rgba(56, 189, 248, 0.45)' },
      ];
      bokehCircles.forEach((b) => {
        const g = ctx.createRadialGradient(b.x, b.y, b.r * 0.1, b.x, b.y, b.r);
        g.addColorStop(0, b.color);
        g.addColorStop(0.75, b.color);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Horizon wet street reflection bars
      for (let i = 0; i < 16; i++) {
        const y = 278 + i * 5;
        ctx.fillStyle =
          i % 2 === 0 ? 'rgba(244, 63, 94, 0.22)' : 'rgba(56, 189, 248, 0.22)';
        ctx.fillRect(30 + (i * 17) % 90, y, 140 - i * 5, 2);
      }

      ctx.fillStyle = '#f3e8ff';
      ctx.font = '600 13px Inter, sans-serif';
      ctx.fillText('TOKYO RAINFALL 04:00', 24, 34);
      ctx.fillStyle = '#c084fc';
      ctx.font = '400 10px Inter, sans-serif';
      ctx.fillText('KENJI SATO', 24, 50);
      break;
    }

    case 'monolith': {
      // Nordic sage, misty fjord & minimalist architectural ring
      const bg = ctx.createLinearGradient(0, 0, 0, size);
      bg.addColorStop(0, '#cbd5e1');
      bg.addColorStop(0.48, '#64748b');
      bg.addColorStop(1, '#0f172a');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, size, size);

      // Misty layered mountains
      const layers = [
        { y: 175, c: '#334155' },
        { y: 215, c: '#1e293b' },
        { y: 260, c: '#0f172a' },
      ];
      layers.forEach((l, idx) => {
        ctx.beginPath();
        ctx.moveTo(0, l.y);
        ctx.bezierCurveTo(
          size * 0.3,
          l.y - 35 + idx * 12,
          size * 0.7,
          l.y + 25 - idx * 8,
          size,
          l.y - 10
        );
        ctx.lineTo(size, size);
        ctx.lineTo(0, size);
        ctx.closePath();
        ctx.fillStyle = l.c;
        ctx.fill();
      });

      // Glowing white geometric ring in mist
      ctx.beginPath();
      ctx.arc(size * 0.5, size * 0.45, 58, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(248, 250, 252, 0.88)';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.font = '700 13px Inter, sans-serif';
      ctx.fillText('MONOLITH & MOSS', 24, 34);
      ctx.fillStyle = '#1e293b';
      ctx.font = '500 10px Inter, sans-serif';
      ctx.fillText('FREYJA LINDQVIST', 24, 50);
      break;
    }

    case 'prism': {
      // Dark velvet prism with luminous spectral dispersion beam
      ctx.fillStyle = '#07070b';
      ctx.fillRect(0, 0, size, size);

      // Incoming white light beam
      ctx.strokeStyle = 'rgba(255,255,255,0.85)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, size * 0.62);
      ctx.lineTo(size * 0.42, size * 0.48);
      ctx.stroke();

      // Dispersed rainbow beams on right
      const spectrum = [
        '#ef4444',
        '#f97316',
        '#eab308',
        '#22c55e',
        '#06b6d4',
        '#6366f1',
        '#ec4899',
      ];
      spectrum.forEach((col, i) => {
        ctx.strokeStyle = col;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(size * 0.56, size * 0.46 + i * 2.5);
        ctx.lineTo(size, size * 0.34 + i * 16);
        ctx.stroke();
      });

      // Glass triangle prism
      ctx.beginPath();
      ctx.moveTo(size * 0.5, size * 0.25);
      ctx.lineTo(size * 0.72, size * 0.68);
      ctx.lineTo(size * 0.28, size * 0.68);
      ctx.closePath();
      const glass = ctx.createLinearGradient(
        size * 0.28,
        size * 0.25,
        size * 0.72,
        size * 0.68
      );
      glass.addColorStop(0, 'rgba(255,255,255,0.28)');
      glass.addColorStop(0.5, 'rgba(56, 189, 248, 0.12)');
      glass.addColorStop(1, 'rgba(244, 63, 94, 0.22)');
      ctx.fillStyle = glass;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.75)';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.font = '600 13px Inter, sans-serif';
      ctx.fillText('PRISM THEORY', 24, 34);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '400 10px Inter, sans-serif';
      ctx.fillText('LUMEN COLLECTIVE', 24, 50);
      break;
    }

    default: {
      // Rich copper/gold geometric synth sphere
      const bg = ctx.createLinearGradient(0, 0, size, size);
      bg.addColorStop(0, '#1c1008');
      bg.addColorStop(0.5, '#2e1605');
      bg.addColorStop(1, '#090604');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, size, size);

      const orb = ctx.createRadialGradient(
        size * 0.42,
        size * 0.42,
        12,
        size * 0.5,
        size * 0.5,
        110
      );
      orb.addColorStop(0, '#fef08a');
      orb.addColorStop(0.35, '#ea580c');
      orb.addColorStop(0.75, '#9a3412');
      orb.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = orb;
      ctx.beginPath();
      ctx.arc(size * 0.5, size * 0.52, 110, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffedd5';
      ctx.font = '600 13px Inter, sans-serif';
      ctx.fillText('GOLDEN HOUR TAPES', 24, 34);
      ctx.fillStyle = '#fdba74';
      ctx.font = '400 10px Inter, sans-serif';
      ctx.fillText('MATEO RIVERA', 24, 50);
      break;
    }
  }

  applyVignetteAndDepth(0.02, 0.35);

  const dataUrl = canvas.toDataURL('image/png');
  coverCache[coverId] = dataUrl;
  return dataUrl;
}

export const BITIFY_ALBUMS: AlbumItem[] = [
  {
    id: 'alb-1',
    title: 'Nocturne in Obsidian',
    artist: 'Kaelen Vance',
    year: '2025',
    genre: 'Dark Electronic',
    coverId: 'nocturne',
    trackCount: 12,
    badge: 'HI-RES',
    accentColor: '#e11d48',
  },
  {
    id: 'alb-2',
    title: 'Solaris Echoes',
    artist: 'Aura & The Glass Choir',
    year: '2025',
    genre: 'Ambient Cinematic',
    coverId: 'solaris',
    trackCount: 9,
    badge: '24-BIT',
    accentColor: '#f59e0b',
  },
  {
    id: 'alb-3',
    title: 'Hyperion Drift',
    artist: 'Subzero Architecture',
    year: '2024',
    genre: 'Minimal Techno',
    coverId: 'hyperion',
    trackCount: 11,
    badge: 'LOSSLESS',
    accentColor: '#38bdf8',
  },
  {
    id: 'alb-4',
    title: 'Velvet Analog',
    artist: 'Sora Takahashi',
    year: '2025',
    genre: 'Nu-Jazz / Tape',
    coverId: 'velvet',
    trackCount: 8,
    accentColor: '#10b981',
  },
  {
    id: 'alb-5',
    title: 'Crimson Frequency',
    artist: 'Bitify Studio Sessions',
    year: '2025',
    genre: 'Modular Synth',
    coverId: 'crimson',
    trackCount: 14,
    badge: 'EXCLUSIVE',
    accentColor: '#f43f5e',
  },
  {
    id: 'alb-6',
    title: 'Tokyo Rainfall 04:00',
    artist: 'Kenji Sato',
    year: '2024',
    genre: 'Future Garage',
    coverId: 'tokyo',
    trackCount: 10,
    accentColor: '#a855f7',
  },
  {
    id: 'alb-7',
    title: 'Monolith & Moss',
    artist: 'Freyja Lindqvist',
    year: '2025',
    genre: 'Nordic Chamber',
    coverId: 'monolith',
    trackCount: 7,
    accentColor: '#94a3b8',
  },
  {
    id: 'alb-8',
    title: 'Prism Theory',
    artist: 'Lumen Collective',
    year: '2024',
    genre: 'Progressive IDM',
    coverId: 'prism',
    trackCount: 10,
    accentColor: '#ec4899',
  },
];

export const BITIFY_RECENT_TRACKS: TrackItem[] = [
  {
    id: 'trk-1',
    title: 'Obsidian Horizon (Original Mix)',
    artist: 'Kaelen Vance',
    album: 'Nocturne in Obsidian',
    duration: '03:58',
    durationSec: 238,
    coverId: 'nocturne',
    quality: '24-bit / 192kHz',
    plays: '1.4M',
    liked: true,
    bpm: 118,
    baseFreq: 110,
    addedAt: '2 mins ago',
  },
  {
    id: 'trk-2',
    title: 'Mirage Over Dune IV',
    artist: 'Aura & The Glass Choir',
    album: 'Solaris Echoes',
    duration: '04:24',
    durationSec: 264,
    coverId: 'solaris',
    quality: '24-bit / 96kHz',
    plays: '892K',
    liked: true,
    bpm: 96,
    baseFreq: 130.81,
    addedAt: '18 mins ago',
  },
  {
    id: 'trk-3',
    title: 'Cryogenic Pulse',
    artist: 'Subzero Architecture',
    album: 'Hyperion Drift',
    duration: '05:12',
    durationSec: 312,
    coverId: 'hyperion',
    quality: 'FLAC Lossless',
    plays: '640K',
    liked: false,
    bpm: 124,
    baseFreq: 146.83,
    addedAt: '45 mins ago',
  },
  {
    id: 'trk-4',
    title: 'Magnetic Tape Saturation #7',
    artist: 'Sora Takahashi',
    album: 'Velvet Analog',
    duration: '03:41',
    durationSec: 221,
    coverId: 'velvet',
    quality: '24-bit / 192kHz',
    plays: '1.1M',
    liked: true,
    bpm: 88,
    baseFreq: 164.81,
    addedAt: '1 hr ago',
  },
  {
    id: 'trk-5',
    title: 'Redline Resonance',
    artist: 'Bitify Studio Sessions',
    album: 'Crimson Frequency',
    duration: '04:06',
    durationSec: 246,
    coverId: 'crimson',
    quality: 'Master DSD',
    plays: '2.3M',
    liked: true,
    bpm: 122,
    baseFreq: 98.0,
    addedAt: '3 hrs ago',
  },
  {
    id: 'trk-6',
    title: 'Shinjuku Neon Reflections',
    artist: 'Kenji Sato',
    album: 'Tokyo Rainfall 04:00',
    duration: '03:32',
    durationSec: 212,
    coverId: 'tokyo',
    quality: '24-bit / 96kHz',
    plays: '780K',
    liked: false,
    bpm: 110,
    baseFreq: 123.47,
    addedAt: 'Yesterday',
  },
];
