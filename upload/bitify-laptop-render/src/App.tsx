import React, { useState, useEffect, useRef } from 'react';
import { toPng } from 'html-to-image';
import {
  Camera,
  Download,
  RotateCcw,
  Sun,
  Layers,
  Sliders,
  X,
  Check,
} from 'lucide-react';
import {
  DEFAULT_STUDIO_SETTINGS,
  STAGE_HEIGHT,
  STAGE_WIDTH,
  StudioLaptopRender,
  StudioRenderSettings,
} from './components/StudioLaptopRender';

type BgMode = 'transparent' | 'checkerboard' | 'hero-composite';

export function App() {
  const [settings, setSettings] = useState<StudioRenderSettings>(
    DEFAULT_STUDIO_SETTINGS
  );
  const [bgMode, setBgMode] = useState<BgMode>('transparent');
  const [studioOpen, setStudioOpen] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const [viewportScale, setViewportScale] = useState<number>(1);

  const renderRef = useRef<HTMLDivElement | null>(null);

  // Responsively fit the entire 1440x960 laptop render stage with comfortable margin on all edges
  useEffect(() => {
    const updateScale = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const scaleX = (vw * 0.94) / STAGE_WIDTH;
      const scaleY = (vh * 0.94) / STAGE_HEIGHT;
      setViewportScale(Math.min(scaleX, scaleY, 1.15));
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Keyboard shortcut 's' to toggle Studio Inspector
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.key.toLowerCase() === 's') {
        setStudioOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleExportTransparentPng = async () => {
    if (!renderRef.current || exporting) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(renderRef.current, {
        backgroundColor: 'rgba(0,0,0,0)',
        pixelRatio: 2,
        width: STAGE_WIDTH,
        height: STAGE_HEIGHT,
        style: {
          transform: 'none',
          background: 'transparent',
        },
      });
      const link = document.createElement('a');
      link.download = 'bitify-laptop-hero-asset.png';
      link.href = dataUrl;
      link.click();
      setExportSuccess(true);
      window.setTimeout(() => setExportSuccess(false), 2600);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  const getBackgroundStyle = (): React.CSSProperties => {
    if (bgMode === 'checkerboard') {
      return {
        backgroundColor: '#0e0e11',
        backgroundImage: `
          linear-gradient(45deg, #18181c 25%, transparent 25%),
          linear-gradient(-45deg, #18181c 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #18181c 75%),
          linear-gradient(-45deg, transparent 75%, #18181c 75%)
        `,
        backgroundSize: '24px 24px',
        backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0px',
      };
    }
    if (bgMode === 'hero-composite') {
      return {
        background:
          'radial-gradient(circle at 52% 48%, rgba(225, 29, 72, 0.14) 0%, rgba(15, 10, 14, 0.96) 52%, #050507 100%)',
      };
    }
    return {
      background: 'transparent',
      backgroundColor: 'rgba(0, 0, 0, 0)',
    };
  };

  return (
    <div
      style={getBackgroundStyle()}
      className="relative w-screen h-screen flex items-center justify-center overflow-hidden"
    >
      {/* CENTERED ISOLATED LAPTOP PRODUCT RENDER */}
      <div
        style={{
          width: `${STAGE_WIDTH}px`,
          height: `${STAGE_HEIGHT}px`,
          transform: `scale(${viewportScale})`,
          transformOrigin: 'center center',
          background: 'transparent',
        }}
        className="relative flex items-center justify-center shrink-0"
      >
        <StudioLaptopRender settings={settings} stageRef={renderRef} />
      </div>

      {/* INVISIBLE HOVER HOTSPOT IN BOTTOM-RIGHT CORNER (Keeps viewport 100% pure asset by default) */}
      <div className="fixed bottom-3 right-3 z-50 group">
        {!studioOpen ? (
          <button
            type="button"
            onClick={() => setStudioOpen(true)}
            title="Open Studio Render & PNG Export Controls (Shortcut: S)"
            className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200 flex items-center gap-2 px-3 py-2 rounded-full bg-[#141318]/90 hover:bg-[#1C1A22] text-[#F4F4F6] text-xs font-medium border border-white/10 shadow-2xl backdrop-blur-md"
          >
            <Sliders className="w-3.5 h-3.5 text-[#E11D48]" />
            <span>Studio Controls & PNG Export</span>
          </button>
        ) : (
          <div className="w-[330px] rounded-2xl bg-[#121116]/95 border border-white/10 p-4 text-[#F4F4F6] shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#E11D48]" />
                <span className="text-xs font-semibold tracking-wide uppercase">
                  Studio Render Inspector
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSettings(DEFAULT_STUDIO_SETTINGS)}
                  title="Reset Camera & Lighting"
                  className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-white/[0.06] transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setStudioOpen(false)}
                  title="Hide Inspector (Pure Asset View)"
                  className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-white/[0.06] transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Background Alpha Mode Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-[#A1A1AA] flex items-center gap-1.5 font-medium">
                <Layers className="w-3.5 h-3.5 text-[#E11D48]" />
                Canvas Background
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                {[
                  { id: 'transparent', label: 'Pure Alpha' },
                  { id: 'checkerboard', label: 'Alpha Grid' },
                  { id: 'hero-composite', label: 'Hero Preview' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setBgMode(m.id as BgMode)}
                    className={`py-1.5 px-2 rounded-lg font-medium border transition ${
                      bgMode === m.id
                        ? 'bg-[#E11D48]/20 border-[#E11D48] text-white'
                        : 'bg-white/[0.03] border-white/[0.06] text-[#A1A1AA] hover:text-white'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Camera Angle Sliders */}
            <div className="space-y-2.5">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#A1A1AA]">3/4 Yaw Angle</span>
                  <span className="font-mono-num text-white">
                    {settings.yawDeg.toFixed(1)}°
                  </span>
                </div>
                <input
                  type="range"
                  min="-32"
                  max="32"
                  step="0.5"
                  value={settings.yawDeg}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      yawDeg: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full accent-[#E11D48] h-1 bg-white/10 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#A1A1AA]">Camera Elevation</span>
                  <span className="font-mono-num text-white">
                    {settings.pitchDeg.toFixed(1)}°
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="26"
                  step="0.5"
                  value={settings.pitchDeg}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      pitchDeg: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full accent-[#E11D48] h-1 bg-white/10 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#A1A1AA]">Lid Open Angle</span>
                  <span className="font-mono-num text-white">
                    {settings.lidAngleDeg.toFixed(1)}°
                  </span>
                </div>
                <input
                  type="range"
                  min="94"
                  max="114"
                  step="0.5"
                  value={settings.lidAngleDeg}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      lidAngleDeg: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full accent-[#E11D48] h-1 bg-white/10 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Studio Lighting Controls */}
            <div className="space-y-2.5 pt-1 border-t border-white/[0.06]">
              <div className="text-[11px] text-[#A1A1AA] flex items-center gap-1.5 font-medium">
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                Studio Rim & Key Lighting
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#A1A1AA]">Warm-White Key Light</span>
                  <span className="font-mono-num text-white">
                    {Math.round(settings.keyLightIntensity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="1.6"
                  step="0.05"
                  value={settings.keyLightIntensity}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      keyLightIntensity: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full accent-amber-300 h-1 bg-white/10 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#A1A1AA]">Crimson Rim Light</span>
                  <span className="font-mono-num text-white">
                    {Math.round(settings.crimsonRimIntensity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.6"
                  step="0.05"
                  value={settings.crimsonRimIntensity}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      crimsonRimIntensity: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full accent-[#E11D48] h-1 bg-white/10 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Transparent PNG Export Button */}
            <button
              type="button"
              onClick={handleExportTransparentPng}
              disabled={exporting}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] hover:from-[#F43F5E] hover:to-[#E11D48] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(225,29,72,0.45)] transition disabled:opacity-50"
            >
              {exportSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Transparent PNG Downloaded</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>
                    {exporting
                      ? 'Rendering Transparent PNG...'
                      : 'Export Transparent PNG (Alpha)'}
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
