import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Home,
  Compass,
  Library,
  History,
  Download,
  HardDrive,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Heart,
  Radio,
  ListMusic,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Disc3,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import {
  BITIFY_ALBUMS,
  BITIFY_RECENT_TRACKS,
  getAlbumCoverDataUrl,
  TrackItem,
  AlbumItem,
} from '../data/bitifyMusicData';
import { bitifyAudio } from '../utils/audioSynth';

export const SCREEN_PIXEL_WIDTH = 1280;
export const SCREEN_PIXEL_HEIGHT = 800;

type NavSection =
  | 'Search'
  | 'Home'
  | 'Explore'
  | 'Library'
  | 'History'
  | 'Downloads'
  | 'Local Music';

export const BitifyDesktopApp: React.FC = () => {
  const [activeNav, setActiveNav] = useState<NavSection>('Library');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState<string>('All');
  const [tracks, setTracks] = useState<TrackItem[]>(BITIFY_RECENT_TRACKS);
  const [currentTrackId, setCurrentTrackId] = useState<string>('trk-1');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progressSec, setProgressSec] = useState<number>(106); // 01:46 default
  const [volume, setVolume] = useState<number>(0.76);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [shuffleOn, setShuffleOn] = useState<boolean>(false);
  const [repeatOn, setRepeatOn] = useState<boolean>(true);
  const [coverUrls, setCoverUrls] = useState<Record<string, string>>({});

  // Pre-generate all album cover Data URLs once on mount
  useEffect(() => {
    const map: Record<string, string> = {};
    const allCoverIds = [
      'nocturne',
      'solaris',
      'hyperion',
      'velvet',
      'crimson',
      'tokyo',
      'monolith',
      'prism',
    ];
    allCoverIds.forEach((id) => {
      map[id] = getAlbumCoverDataUrl(id);
    });
    setCoverUrls(map);
  }, []);

  const currentTrack = useMemo(
    () => tracks.find((t) => t.id === currentTrackId) || tracks[0],
    [tracks, currentTrackId]
  );

  // Advance playback timer when playing
  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setProgressSec((prev) => {
        if (prev + 1 >= currentTrack.durationSec) {
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isPlaying, currentTrack.durationSec]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      bitifyAudio.stop();
    };
  }, []);

  const handleTogglePlay = () => {
    if (isPlaying) {
      bitifyAudio.stop();
      setIsPlaying(false);
    } else {
      bitifyAudio.start(currentTrack.baseFreq, isMuted ? 0 : volume);
      setIsPlaying(true);
    }
  };

  const handleSelectTrack = (track: TrackItem) => {
    setCurrentTrackId(track.id);
    setProgressSec(42);
    bitifyAudio.start(track.baseFreq, isMuted ? 0 : volume);
    setIsPlaying(true);
  };

  const handleSelectAlbum = (album: AlbumItem) => {
    const matchingTrack = tracks.find((t) => t.coverId === album.coverId);
    if (matchingTrack) {
      handleSelectTrack(matchingTrack);
    }
  };

  const handlePrevTrack = () => {
    const idx = tracks.findIndex((t) => t.id === currentTrackId);
    const prevIdx = (idx - 1 + tracks.length) % tracks.length;
    handleSelectTrack(tracks[prevIdx]);
  };

  const handleNextTrack = () => {
    const idx = tracks.findIndex((t) => t.id === currentTrackId);
    const nextIdx = (idx + 1) % tracks.length;
    handleSelectTrack(tracks[nextIdx]);
  };

  const handleToggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTracks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, liked: !t.liked } : t))
    );
  };

  const handleVolumeChange = (newVol: number) => {
    const clamped = Math.max(0, Math.min(1, newVol));
    setVolume(clamped);
    setIsMuted(clamped === 0);
    bitifyAudio.setVolume(clamped);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const filteredAlbums = useMemo(() => {
    return BITIFY_ALBUMS.filter((alb) => {
      const matchesQuery =
        !searchQuery.trim() ||
        alb.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alb.artist.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre =
        activeGenre === 'All' ||
        alb.genre.toLowerCase().includes(activeGenre.toLowerCase()) ||
        (activeGenre === 'Hi-Res' && Boolean(alb.badge));
      return matchesQuery && matchesGenre;
    });
  }, [searchQuery, activeGenre]);

  const sidebarItems: { label: NavSection; icon: React.ReactNode; badge?: string }[] = [
    { label: 'Search', icon: <Search className="w-4 h-4" /> },
    { label: 'Home', icon: <Home className="w-4 h-4" /> },
    { label: 'Explore', icon: <Compass className="w-4 h-4" /> },
    { label: 'Library', icon: <Library className="w-4 h-4" />, badge: '148' },
    { label: 'History', icon: <History className="w-4 h-4" /> },
    { label: 'Downloads', icon: <Download className="w-4 h-4" />, badge: '24' },
    { label: 'Local Music', icon: <HardDrive className="w-4 h-4" /> },
  ];

  const progressRatio = Math.min(
    1,
    Math.max(0, progressSec / Math.max(1, currentTrack.durationSec))
  );

  return (
    <div
      style={{
        width: `${SCREEN_PIXEL_WIDTH}px`,
        height: `${SCREEN_PIXEL_HEIGHT}px`,
      }}
      className="relative flex flex-col bg-[#0C0B0F] text-[#F4F4F6] overflow-hidden select-none"
    >
      {/* Subtle top ambient warm/crimson studio wash inside the app */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(65% 45% at 54% 0%, rgba(225, 29, 72, 0.09) 0%, rgba(24, 20, 28, 0.04) 55%, transparent 100%)',
        }}
      />

      {/* SLIM TOP PLAYBACK & APPLICATION CONTROL BAR */}
      <header className="relative z-10 h-[46px] shrink-0 px-4 flex items-center justify-between bg-[#111015]/95 border-b border-white/[0.06]">
        {/* Left: Window Controls & Brand + History Chevrons */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48]/85 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/75 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/75 inline-block" />
          </div>

          <div className="h-3.5 w-[1px] bg-white/[0.08]" />

          {/* Bitify Brand Mark */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#F43F5E] to-[#9F1239] flex items-center justify-center shadow-[0_0_10px_rgba(225,29,72,0.45)]">
              <Disc3 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[13px] font-bold tracking-tight text-white">
              Bitify
            </span>
            <span className="text-[9px] font-mono-num uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#E11D48]/15 text-[#FB7185] border border-[#E11D48]/30">
              Studio
            </span>
          </div>

          <div className="flex items-center gap-1 ml-2">
            <button
              type="button"
              onClick={handlePrevTrack}
              className="w-6 h-6 rounded-md bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-[#A1A1AA] hover:text-white transition"
              title="Back"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleNextTrack}
              className="w-6 h-6 rounded-md bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-[#A1A1AA] hover:text-white transition"
              title="Forward"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center: Slim Top Playback Status & Mini Transport Strip */}
        <div className="flex items-center gap-3 px-3 py-1 rounded-md bg-[#17161D] border border-white/[0.06] min-w-[390px] justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={handleTogglePlay}
              className="w-5 h-5 rounded-full bg-[#E11D48] hover:bg-[#F43F5E] flex items-center justify-center text-white shrink-0 transition"
            >
              {isPlaying ? (
                <Pause className="w-2.5 h-2.5 fill-current" />
              ) : (
                <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
              )}
            </button>
            <div className="truncate">
              <span className="text-[11px] font-medium text-[#F4F4F6]">
                {currentTrack.title}
              </span>
              <span className="text-[11px] text-[#71717A] mx-1.5">•</span>
              <span className="text-[11px] text-[#A1A1AA]">
                {currentTrack.artist}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono-num bg-white/[0.04] text-[#A1A1AA] border border-white/[0.05]">
              {currentTrack.quality}
            </span>
            <div className="flex items-end gap-[2px] h-3 w-3.5">
              <span
                className={`w-[2.5px] bg-[#E11D48] rounded-full ${
                  isPlaying ? 'animate-eq-1' : 'h-1.5'
                }`}
              />
              <span
                className={`w-[2.5px] bg-[#FB7185] rounded-full ${
                  isPlaying ? 'animate-eq-2' : 'h-2.5'
                }`}
              />
              <span
                className={`w-[2.5px] bg-[#E11D48] rounded-full ${
                  isPlaying ? 'animate-eq-3' : 'h-1'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Right: Quick Search & Studio Output Indicator */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-[#71717A] absolute left-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter library, artists..."
              className="w-44 h-7 pl-8 pr-2.5 rounded-md bg-[#18171E] border border-white/[0.06] text-[11px] text-[#F4F4F6] placeholder-[#71717A] focus:outline-none focus:border-[#E11D48]/60 transition"
            />
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-white/[0.06]">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#27272A] to-[#3F3F46] border border-white/10 flex items-center justify-center text-[10px] font-semibold text-white">
              KV
            </div>
          </div>
        </div>
      </header>

      {/* MAIN MIDDLE WORKSPACE: LEFT SIDEBAR + LIBRARY & RECENTLY PLAYED */}
      <div className="relative z-10 flex-1 flex min-h-0 overflow-hidden">
        {/* COMPACT LEFT SIDEBAR */}
        <aside className="w-[196px] shrink-0 bg-[#111015] border-r border-white/[0.06] flex flex-col justify-between py-3.5 px-2.5">
          <div className="space-y-4">
            <div className="px-2">
              <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#71717A] mb-2">
                Navigation
              </div>
              <nav className="space-y-0.5">
                {sidebarItems.map((item) => {
                  const isActive = activeNav === item.label;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setActiveNav(item.label)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-[12px] font-medium transition relative ${
                        isActive
                          ? 'bg-[#E11D48]/[0.13] text-white'
                          : 'text-[#A1A1AA] hover:text-[#F4F4F6] hover:bg-white/[0.03]'
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-[#E11D48] shadow-[0_0_8px_#E11D48]" />
                      )}
                      <span className="flex items-center gap-2.5">
                        <span
                          className={
                            isActive ? 'text-[#FB7185]' : 'text-[#71717A]'
                          }
                        >
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </span>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-mono-num px-1.5 py-0.2 rounded ${
                            isActive
                              ? 'bg-[#E11D48]/25 text-[#FDA4AF]'
                              : 'bg-white/[0.04] text-[#71717A]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="h-[1px] bg-white/[0.05] mx-2" />

            {/* Curated Studio Collections */}
            <div className="px-2">
              <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#71717A] mb-2">
                Pinned Crates
              </div>
              <div className="space-y-1 text-[11px] text-[#A1A1AA]">
                {[
                  { name: 'Late Night Mastering', count: '32 tracks', active: true },
                  { name: 'Analog Warmth 24-Bit', count: '19 tracks', active: false },
                  { name: 'Sub-Bass Reference', count: '44 tracks', active: false },
                  { name: 'Tokyo Modular Live', count: '15 tracks', active: false },
                ].map((crate) => (
                  <div
                    key={crate.name}
                    className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-white/[0.03] cursor-pointer transition"
                  >
                    <span className="truncate flex items-center gap-2">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          crate.active ? 'bg-[#E11D48]' : 'bg-zinc-600'
                        }`}
                      />
                      <span className="truncate text-[#D4D4D8]">
                        {crate.name}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Sidebar Lossless DAC Card */}
          <div className="mx-1.5 p-2.5 rounded-lg bg-gradient-to-b from-[#1A1822] to-[#131218] border border-white/[0.06]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-semibold text-[#F4F4F6] flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#E11D48]" />
                BitPerfect Audio
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <p className="text-[10px] text-[#71717A] leading-tight">
              Direct CoreAudio Exclusive Mode • 192kHz
            </p>
          </div>
        </aside>

        {/* MAIN CONTENT AREA: PROMINENT ALBUM GRID + RECENTLY PLAYED */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#0D0C10] px-6 py-4 overflow-hidden justify-between">
          {/* SECTION 1: PROMINENT MUSIC LIBRARY ALBUM GRID */}
          <div>
            {/* Header & Filter Pills */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-[17px] font-semibold tracking-tight text-white">
                    {activeNav === 'Library' ? 'Music Library' : activeNav}
                  </h1>
                  <span className="text-[11px] text-[#71717A] font-mono-num">
                    • {filteredAlbums.length} Studio Masters
                  </span>
                </div>
                <p className="text-[11px] text-[#A1A1AA]">
                  Curated high-resolution albums and reference pressings
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                {['All', 'Hi-Res', 'Electronic', 'Ambient', 'Synth'].map(
                  (genre) => {
                    const active = activeGenre === genre;
                    return (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => setActiveGenre(genre)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                          active
                            ? 'bg-[#E11D48] text-white shadow-[0_2px_10px_rgba(225,29,72,0.35)]'
                            : 'bg-[#17161C] text-[#A1A1AA] hover:text-white border border-white/[0.05]'
                        }`}
                      >
                        {genre}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Clean 4-Column Album Artwork Grid (8 Albums, two crisp rows of 4) */}
            <div className="grid grid-cols-4 gap-3.5">
              {filteredAlbums.slice(0, 8).map((album) => {
                const isCurrentAlbum = currentTrack.coverId === album.coverId;
                return (
                  <div
                    key={album.id}
                    onClick={() => handleSelectAlbum(album)}
                    className={`group relative flex items-center gap-3 p-2.5 rounded-lg border transition cursor-pointer ${
                      isCurrentAlbum
                        ? 'bg-[#1B1821] border-[#E11D48]/45 shadow-[0_4px_20px_rgba(0,0,0,0.45)]'
                        : 'bg-[#141319]/90 hover:bg-[#191820] border-white/[0.06]'
                    }`}
                  >
                    {/* Rounded Album Artwork */}
                    <div className="relative w-[68px] h-[68px] rounded-md overflow-hidden shrink-0 bg-[#1F1E24] shadow-md">
                      {coverUrls[album.coverId] && (
                        <img
                          src={coverUrls[album.coverId]}
                          alt={album.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {/* Subtle Play Badge */}
                      <div
                        className={`absolute inset-0 bg-black/35 flex items-center justify-center transition-opacity ${
                          isCurrentAlbum
                            ? 'opacity-100'
                            : 'opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-full bg-[#E11D48] text-white flex items-center justify-center shadow-lg">
                          {isCurrentAlbum && isPlaying ? (
                            <Pause className="w-3.5 h-3.5 fill-current" />
                          ) : (
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Album Meta */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[9px] font-mono-num uppercase tracking-wider px-1.5 py-0.2 rounded bg-white/[0.05] text-[#A1A1AA]">
                          {album.genre}
                        </span>
                        {album.badge && (
                          <span className="text-[9px] font-mono-num font-semibold text-[#FB7185]">
                            {album.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="text-[12.5px] font-semibold text-[#F4F4F6] truncate leading-snug">
                        {album.title}
                      </h3>
                      <p className="text-[11px] text-[#A1A1AA] truncate">
                        {album.artist}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-[#71717A] font-mono-num">
                        <span>{album.year}</span>
                        <span>•</span>
                        <span>{album.trackCount} tracks</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SUBTLE HORIZONTAL SEPARATOR */}
          <div className="h-[1px] bg-white/[0.06] my-2" />

          {/* SECTION 2: RECENTLY PLAYED SECTION CONTAINING MULTIPLE TRACKS */}
          <div className="flex-1 flex flex-col min-h-0 justify-end">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h2 className="text-[14px] font-semibold text-white tracking-tight">
                  Recently Played
                </h2>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#E11D48]/15 text-[#FB7185] font-mono-num">
                  Lossless Stream
                </span>
              </div>
              <span className="text-[11px] text-[#71717A]">
                Showing {tracks.length} recent studio tracks
              </span>
            </div>

            {/* Clean 2-Column Track List (6 tracks visible simultaneously with zero overlap) */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {tracks.map((track, idx) => {
                const isSelected = track.id === currentTrackId;
                return (
                  <div
                    key={track.id}
                    onClick={() => handleSelectTrack(track)}
                    className={`group flex items-center justify-between px-3 py-2 rounded-lg border transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#1A161E] border-[#E11D48]/40'
                        : 'bg-[#131218]/80 hover:bg-[#18171F] border-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Index or Active Crimson Equalizer */}
                      <div className="w-4 flex items-center justify-center shrink-0">
                        {isSelected ? (
                          <div className="flex items-end gap-[2px] h-3 w-3.5">
                            <span
                              className={`w-[2.5px] bg-[#E11D48] rounded-full ${
                                isPlaying ? 'animate-eq-1' : 'h-2'
                              }`}
                            />
                            <span
                              className={`w-[2.5px] bg-[#FB7185] rounded-full ${
                                isPlaying ? 'animate-eq-2' : 'h-3'
                              }`}
                            />
                            <span
                              className={`w-[2.5px] bg-[#E11D48] rounded-full ${
                                isPlaying ? 'animate-eq-3' : 'h-1.5'
                              }`}
                            />
                          </div>
                        ) : (
                          <span className="text-[11px] font-mono-num text-[#71717A] group-hover:text-white">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                        )}
                      </div>

                      {/* Track Cover Thumbnail */}
                      <div className="w-9 h-9 rounded-md overflow-hidden shrink-0 bg-zinc-800 border border-white/[0.08]">
                        {coverUrls[track.coverId] && (
                          <img
                            src={coverUrls[track.coverId]}
                            alt={track.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      {/* Track Title & Artist */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p
                            className={`text-[12px] font-medium truncate ${
                              isSelected ? 'text-[#FB7185]' : 'text-[#F4F4F6]'
                            }`}
                          >
                            {track.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10.5px] text-[#A1A1AA] truncate">
                          <span className="truncate">{track.artist}</span>
                          <span className="text-[#52525B]">•</span>
                          <span className="truncate text-[#71717A]">
                            {track.album}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Metadata: Quality Badge, Heart, Duration */}
                    <div className="flex items-center gap-3 shrink-0 ml-2">
                      <span className="text-[9.5px] font-mono-num px-1.5 py-0.5 rounded bg-white/[0.03] text-[#71717A] border border-white/[0.04]">
                        {track.quality}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => handleToggleLike(track.id, e)}
                        className="text-[#71717A] hover:text-[#E11D48] transition"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            track.liked
                              ? 'fill-[#E11D48] text-[#E11D48]'
                              : ''
                          }`}
                        />
                      </button>

                      <span className="text-[11px] font-mono-num text-[#A1A1AA] w-9 text-right">
                        {track.duration}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      {/* BOTTOM PLAYBACK AREA WITH PREVIOUS, PLAY/PAUSE, NEXT, VOLUME, AND PROGRESS CONTROLS */}
      <footer className="relative z-10 h-[76px] shrink-0 px-5 bg-[#121117] border-t border-white/[0.08] flex items-center justify-between gap-6">
        {/* Left: Active Track Artwork & Details */}
        <div className="flex items-center gap-3.5 w-[300px] shrink-0">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10 shadow-md">
            {coverUrls[currentTrack.coverId] && (
              <img
                src={coverUrls[currentTrack.coverId]}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="text-[12.5px] font-semibold text-white truncate">
                {currentTrack.title}
              </h4>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#E11D48] shrink-0" />
            </div>
            <p className="text-[11px] text-[#A1A1AA] truncate">
              {currentTrack.artist} — {currentTrack.album}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[9px] font-mono-num text-[#FB7185] bg-[#E11D48]/15 px-1.5 py-0.2 rounded">
                {currentTrack.quality}
              </span>
              <span className="text-[9px] font-mono-num text-[#71717A]">
                {currentTrack.bpm} BPM
              </span>
            </div>
          </div>
        </div>

        {/* Center: Previous, Play/Pause, Next + Interactive Progress Scrub Bar */}
        <div className="flex-1 max-w-[520px] flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => setShuffleOn(!shuffleOn)}
              className={`transition ${
                shuffleOn
                  ? 'text-[#E11D48]'
                  : 'text-[#71717A] hover:text-[#F4F4F6]'
              }`}
              title="Shuffle"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handlePrevTrack}
              className="text-[#D4D4D8] hover:text-white transition"
              title="Previous Track"
            >
              <SkipBack className="w-4 h-4 fill-current" />
            </button>

            <button
              type="button"
              onClick={handleTogglePlay}
              className="w-9 h-9 rounded-full bg-[#E11D48] hover:bg-[#F43F5E] text-white flex items-center justify-center shadow-[0_0_16px_rgba(225,29,72,0.55)] transition"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={handleNextTrack}
              className="text-[#D4D4D8] hover:text-white transition"
              title="Next Track"
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </button>

            <button
              type="button"
              onClick={() => setRepeatOn(!repeatOn)}
              className={`transition ${
                repeatOn
                  ? 'text-[#E11D48]'
                  : 'text-[#71717A] hover:text-[#F4F4F6]'
              }`}
              title="Repeat"
            >
              <Repeat className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Progress Bar with Timestamps */}
          <div className="w-full flex items-center gap-2.5">
            <span className="text-[10.5px] font-mono-num text-[#A1A1AA] w-9 text-right">
              {formatTime(progressSec)}
            </span>

            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const ratio = Math.max(
                  0,
                  Math.min(1, (e.clientX - rect.left) / rect.width)
                );
                setProgressSec(Math.round(ratio * currentTrack.durationSec));
              }}
              className="relative flex-1 h-1.5 rounded-full bg-white/[0.1] cursor-pointer group flex items-center"
            >
              <div
                style={{ width: `${progressRatio * 100}%` }}
                className="h-full rounded-full bg-gradient-to-r from-[#E11D48] to-[#FB7185] relative"
              >
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_6px_rgba(225,29,72,0.9)]" />
              </div>
            </div>

            <span className="text-[10.5px] font-mono-num text-[#71717A] w-9">
              {currentTrack.duration}
            </span>
          </div>
        </div>

        {/* Right: Audio Tools & Volume Controls */}
        <div className="flex items-center justify-end gap-3.5 w-[300px] shrink-0">
          <button
            type="button"
            className="text-[#A1A1AA] hover:text-white transition"
            title="Live Radio"
          >
            <Radio className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="text-[#A1A1AA] hover:text-white transition"
            title="DSP Equalizer"
          >
            <Sliders className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="text-[#A1A1AA] hover:text-white transition"
            title="Play Queue"
          >
            <ListMusic className="w-4 h-4" />
          </button>

          <div className="h-4 w-[1px] bg-white/[0.08]" />

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const nextMute = !isMuted;
                setIsMuted(nextMute);
                bitifyAudio.setVolume(nextMute ? 0 : volume);
              }}
              className="text-[#D4D4D8] hover:text-white transition"
              title="Mute / Unmute"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-[#E11D48]" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const ratio = Math.max(
                  0,
                  Math.min(1, (e.clientX - rect.left) / rect.width)
                );
                handleVolumeChange(ratio);
              }}
              className="w-24 h-1.5 rounded-full bg-white/[0.12] cursor-pointer relative flex items-center"
            >
              <div
                style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                className="h-full rounded-full bg-gradient-to-r from-[#E11D48] to-[#F4F4F6] relative"
              >
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow" />
              </div>
            </div>

            <span className="text-[10px] font-mono-num text-[#A1A1AA] w-7 text-right">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
