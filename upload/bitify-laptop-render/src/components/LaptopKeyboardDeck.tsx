import React from 'react';

export const DECK_PIXEL_WIDTH = 1424;
export const DECK_PIXEL_HEIGHT = 984;

interface KeySpec {
  label: string;
  sub?: string;
  w?: number; // relative width weight
  align?: 'left' | 'center' | 'right';
  isTouchId?: boolean;
  isArrowStack?: boolean;
  hasHomingBar?: boolean;
  hasCapsDot?: boolean;
}

const ROW_1_FN: KeySpec[] = [
  { label: 'esc', w: 1.45, align: 'left' },
  { label: 'F1', sub: '☀', w: 1 },
  { label: 'F2', sub: '☼', w: 1 },
  { label: 'F3', sub: '▢', w: 1 },
  { label: 'F4', sub: '⌕', w: 1 },
  { label: 'F5', sub: '🎙', w: 1 },
  { label: 'F6', sub: '☾', w: 1 },
  { label: 'F7', sub: '⏮', w: 1 },
  { label: 'F8', sub: '⏯', w: 1 },
  { label: 'F9', sub: '⏭', w: 1 },
  { label: 'F10', sub: '🔇', w: 1 },
  { label: 'F11', sub: '🔉', w: 1 },
  { label: 'F12', sub: '🔊', w: 1 },
  { label: '', w: 1.05, isTouchId: true },
];

const ROW_2_NUM: KeySpec[] = [
  { label: '`', sub: '~', w: 1 },
  { label: '1', sub: '!', w: 1 },
  { label: '2', sub: '@', w: 1 },
  { label: '3', sub: '#', w: 1 },
  { label: '4', sub: '$', w: 1 },
  { label: '5', sub: '%', w: 1 },
  { label: '6', sub: '^', w: 1 },
  { label: '7', sub: '&', w: 1 },
  { label: '8', sub: '*', w: 1 },
  { label: '9', sub: '(', w: 1 },
  { label: '0', sub: ')', w: 1 },
  { label: '-', sub: '_', w: 1 },
  { label: '=', sub: '+', w: 1 },
  { label: 'delete', w: 1.55, align: 'right' },
];

const ROW_3_QWERTY: KeySpec[] = [
  { label: 'tab', w: 1.5, align: 'left' },
  { label: 'Q', w: 1 },
  { label: 'W', w: 1 },
  { label: 'E', w: 1 },
  { label: 'R', w: 1 },
  { label: 'T', w: 1 },
  { label: 'Y', w: 1 },
  { label: 'U', w: 1 },
  { label: 'I', w: 1 },
  { label: 'O', w: 1 },
  { label: 'P', w: 1 },
  { label: '[', sub: '{', w: 1 },
  { label: ']', sub: '}', w: 1 },
  { label: '\\', sub: '|', w: 1.05 },
];

const ROW_4_HOME: KeySpec[] = [
  { label: 'caps lock', w: 1.8, align: 'left', hasCapsDot: true },
  { label: 'A', w: 1 },
  { label: 'S', w: 1 },
  { label: 'D', w: 1 },
  { label: 'F', w: 1, hasHomingBar: true },
  { label: 'G', w: 1 },
  { label: 'H', w: 1 },
  { label: 'J', w: 1, hasHomingBar: true },
  { label: 'K', w: 1 },
  { label: 'L', w: 1 },
  { label: ';', sub: ':', w: 1 },
  { label: "'", sub: '"', w: 1 },
  { label: 'return', w: 1.8, align: 'right' },
];

const ROW_5_SHIFT: KeySpec[] = [
  { label: 'shift', w: 2.35, align: 'left' },
  { label: 'Z', w: 1 },
  { label: 'X', w: 1 },
  { label: 'C', w: 1 },
  { label: 'V', w: 1 },
  { label: 'B', w: 1 },
  { label: 'N', w: 1 },
  { label: 'M', w: 1 },
  { label: ',', sub: '<', w: 1 },
  { label: '.', sub: '>', w: 1 },
  { label: '/', sub: '?', w: 1 },
  { label: 'shift', w: 2.35, align: 'right' },
];

const ROW_6_BOTTOM: KeySpec[] = [
  { label: 'fn', sub: '🌐', w: 1.05, align: 'left' },
  { label: 'control', sub: '⌃', w: 1.05 },
  { label: 'option', sub: '⌥', w: 1.05 },
  { label: 'command', sub: '⌘', w: 1.3 },
  { label: '', w: 5.2 }, // Spacebar
  { label: 'command', sub: '⌘', w: 1.3 },
  { label: 'option', sub: '⌥', w: 1.05 },
  { label: '◀', w: 1 },
  { label: '▲▼', w: 1, isArrowStack: true },
  { label: '▶', w: 1 },
];

interface LaptopKeyboardDeckProps {
  keyLightIntensity?: number;
  crimsonRimIntensity?: number;
}

export const LaptopKeyboardDeck: React.FC<LaptopKeyboardDeckProps> = ({
  keyLightIntensity = 1,
  crimsonRimIntensity = 1,
}) => {
  const renderKeyRow = (
    keys: KeySpec[],
    rowHeightPx: number,
    isFnRow = false
  ) => {
    return (
      <div
        className="flex items-stretch gap-[8px] w-full"
        style={{ height: `${rowHeightPx}px` }}
      >
        {keys.map((k, idx) => {
          const flexWeight = k.w ?? 1;

          if (k.isArrowStack) {
            return (
              <div
                key={idx}
                style={{ flex: `${flexWeight} 1 0%` }}
                className="flex flex-col justify-between gap-[4px] h-full"
              >
                {['▲', '▼'].map((arrow) => (
                  <div
                    key={arrow}
                    className="relative flex-1 rounded-[6px] bg-gradient-to-b from-[#1E1E24] via-[#15151A] to-[#101014] flex items-center justify-center text-[11px] text-[#E4E4E7]/85 font-medium"
                    style={{
                      boxShadow:
                        '0 3px 0 #070709, 0 4px 5px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,248,238,0.18), inset 1px 0 0 rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <span className="scale-y-75">{arrow}</span>
                  </div>
                ))}
              </div>
            );
          }

          return (
            <div
              key={idx}
              style={{
                flex: `${flexWeight} 1 0%`,
                boxShadow:
                  '0 3.5px 0 #070709, 0 5px 7px rgba(0,0,0,0.9), inset 0 1.2px 0 rgba(255,248,238,0.18), inset 1px 0 0 rgba(255,255,255,0.07), 0 0 8px rgba(255,245,235,0.06)',
                border: '1px solid rgba(255,255,255,0.065)',
              }}
              className="relative rounded-[7px] bg-gradient-to-br from-[#202026] via-[#15151A] to-[#0F0F13] flex flex-col justify-between px-2.5 py-1.5 select-none overflow-hidden"
            >
              {/* Subtle top specular reflection across keycap */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px]"
                style={{
                  background: `linear-gradient(90deg, rgba(255,250,240,${
                    0.22 * keyLightIntensity
                  }), rgba(255,255,255,0.06), rgba(225,29,72,${
                    0.12 * crimsonRimIntensity
                  }))`,
                }}
              />

              {k.isTouchId ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div
                    className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-[#121216] to-[#09090C]"
                    style={{
                      boxShadow:
                        'inset 0 1px 3px rgba(0,0,0,0.95), 0 0 0 1.5px rgba(255,248,238,0.22)',
                    }}
                  />
                </div>
              ) : isFnRow ? (
                <div className="w-full h-full flex items-center justify-between px-0.5">
                  <span className="text-[11px] font-medium text-[#D4D4D8]/80">
                    {k.sub || ''}
                  </span>
                  <span className="text-[11px] font-medium text-[#E4E4E7]/90">
                    {k.label}
                  </span>
                </div>
              ) : k.sub && k.label.length === 1 ? (
                <div className="w-full h-full flex flex-col items-center justify-center leading-none gap-1">
                  <span className="text-[11.5px] text-[#A1A1AA]/85 font-normal">
                    {k.sub}
                  </span>
                  <span className="text-[14.5px] text-[#F4F4F6]/90 font-medium">
                    {k.label}
                  </span>
                </div>
              ) : k.sub ? (
                <div className="w-full h-full flex flex-col justify-between">
                  <span className="text-[11px] text-[#A1A1AA]/80 self-end">
                    {k.sub}
                  </span>
                  <span className="text-[11.5px] text-[#E4E4E7]/90 font-medium">
                    {k.label}
                  </span>
                </div>
              ) : (
                <div
                  className={`w-full h-full flex items-center ${
                    k.align === 'left'
                      ? 'justify-start items-end pb-0.5'
                      : k.align === 'right'
                      ? 'justify-end items-end pb-0.5'
                      : 'justify-center'
                  }`}
                >
                  {k.hasCapsDot && (
                    <span className="absolute top-2 left-2.5 w-1.5 h-1.5 rounded-full bg-emerald-400/80 shadow-[0_0_5px_#34d399]" />
                  )}
                  <span
                    className={`${
                      k.label.length > 1
                        ? 'text-[12.5px] font-medium tracking-tight text-[#D4D4D8]/90'
                        : 'text-[16px] font-medium text-[#F4F4F6]/92'
                    }`}
                  >
                    {k.label}
                  </span>
                  {k.hasHomingBar && (
                    <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-[1.5px] rounded-full bg-white/45" />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      style={{
        width: `${DECK_PIXEL_WIDTH}px`,
        height: `${DECK_PIXEL_HEIGHT}px`,
        borderRadius: '46px',
        background:
          'linear-gradient(132deg, #212127 0%, #17171C 38%, #121216 74%, #18161C 100%)',
        boxShadow: `
          inset 0 2px 2px rgba(255, 248, 235, ${0.28 * keyLightIntensity}),
          inset -2px 0 3px rgba(225, 29, 72, ${0.25 * crimsonRimIntensity}),
          inset 2px 0 3px rgba(255, 250, 240, ${0.18 * keyLightIntensity}),
          inset 0 -2px 3px rgba(255, 255, 255, 0.14)
        `,
      }}
      className="relative flex flex-col items-center justify-between pt-[54px] pb-[26px] px-[44px] overflow-hidden select-none"
    >
      {/* Subtle Anodized Brushed Aluminum Sheen + Screen Upward Light Spill */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(65% 32% at 50% 2%, rgba(225, 29, 72, ${
              0.12 * crimsonRimIntensity
            }) 0%, rgba(255, 248, 235, ${
            0.06 * keyLightIntensity
          }) 42%, transparent 80%),
            linear-gradient(115deg, rgba(255, 250, 240, ${
              0.07 * keyLightIntensity
            }) 0%, transparent 42%, rgba(0, 0, 0, 0.25) 78%, rgba(225, 29, 72, ${
            0.07 * crimsonRimIntensity
          }) 100%)
          `,
        }}
      />

      {/* Top Display Hinge Barrel Cutout Shadow Strip */}
      <div
        className="absolute top-0 left-[220px] right-[220px] h-[22px] rounded-b-[8px] bg-gradient-to-b from-[#050507] via-[#0B0B0E] to-[#15151A]"
        style={{
          boxShadow:
            '0 2px 4px rgba(0,0,0,0.85), inset 0 -1px 0 rgba(255,255,255,0.12)',
        }}
      />

      {/* UPPER SECTION: LEFT SPEAKER + RECESSED KEYBOARD WELL + RIGHT SPEAKER */}
      <div className="relative z-10 w-full flex items-stretch justify-between gap-[18px] h-[516px]">
        {/* Left Stereo Speaker Micro-Perforation Array */}
        <div
          className="w-[82px] h-full rounded-[10px] opacity-85"
          style={{
            backgroundImage:
              'radial-gradient(#060608 1.35px, transparent 1.35px)',
            backgroundSize: '6px 6px',
            boxShadow: 'inset 0 0 12px rgba(0,0,0,0.45)',
          }}
        />

        {/* CNC Recessed Keyboard Well */}
        <div
          className="flex-1 h-full rounded-[16px] p-[14px] flex flex-col justify-between bg-[#08080B]"
          style={{
            boxShadow: `
              inset 0 4px 10px rgba(0,0,0,0.95),
              inset 0 0 0 1.5px rgba(0,0,0,0.9),
              0 1.5px 0 rgba(255,248,238,${0.18 * keyLightIntensity}),
              1.5px 0 0 rgba(225,29,72,${0.16 * crimsonRimIntensity}),
              -1px -1px 0 rgba(255,255,255,0.06)
            `,
          }}
        >
          {renderKeyRow(ROW_1_FN, 48, true)}
          {renderKeyRow(ROW_2_NUM, 78)}
          {renderKeyRow(ROW_3_QWERTY, 78)}
          {renderKeyRow(ROW_4_HOME, 78)}
          {renderKeyRow(ROW_5_SHIFT, 78)}
          {renderKeyRow(ROW_6_BOTTOM, 84)}
        </div>

        {/* Right Stereo Speaker Micro-Perforation Array */}
        <div
          className="w-[82px] h-full rounded-[10px] opacity-85"
          style={{
            backgroundImage:
              'radial-gradient(#060608 1.35px, transparent 1.35px)',
            backgroundSize: '6px 6px',
            boxShadow: 'inset 0 0 12px rgba(0,0,0,0.45)',
          }}
        />
      </div>

      {/* LOWER SECTION: CENTERED FORCE TOUCH MATTE-GLASS TRACKPAD */}
      <div className="relative z-10 flex-1 w-full flex items-center justify-center pt-[16px]">
        <div
          className="w-[564px] h-[346px] rounded-[18px] relative overflow-hidden"
          style={{
            background:
              'linear-gradient(138deg, #1A1A20 0%, #131317 52%, #101014 82%, #171419 100%)',
            boxShadow: `
              inset 0 2px 5px rgba(0,0,0,0.75),
              0 0 0 1.5px #09090C,
              0 1.5px 0 rgba(255, 248, 238, ${0.24 * keyLightIntensity}),
              1.5px 0 0 rgba(225, 29, 72, ${0.2 * crimsonRimIntensity}),
              -1px -1px 0 rgba(255, 255, 255, 0.08)
            `,
          }}
        >
          {/* Controlled Specular Highlight Across Glass Trackpad Surface */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(125deg, rgba(255,250,242,0.045) 0%, transparent 48%, rgba(225,29,72,0.03) 100%)',
            }}
          />
        </div>
      </div>
    </div>
  );
};
