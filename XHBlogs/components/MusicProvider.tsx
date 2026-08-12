"use client";

import { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { siteConfig } from '../siteConfig';

// 【增强版 LRC 歌词解析】支持任意位数小数
function parseLrc(lrcText: string) {
  if (!lrcText || lrcText.length > 30000) return [];

  const lines = lrcText.split(/\r?\n/);
  const result = [];

  for (let line of lines) {
    // 支持任意位数小数
    const matches = [...line.matchAll(/\[(\d{2,}):(\d{2})(?:\.(\d+))?\]/g)];
    if (matches.length > 0) {
      let text = line.replace(/\[\d{2,}:\d{2}(?:\.\d+)?\]/g, '').trim();

      // 剔除控制字符
      const cleanText = text.replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200D\uFEFF]/g, "");

      if (cleanText) {
        for (const match of matches) {
          const min = parseInt(match[1]);
          const sec = parseInt(match[2]);
          const msStr = match[3] || '0';
          // 根据实际小数位数正确计算
          const ms = parseInt(msStr) / Math.pow(10, msStr.length);
          const time = min * 60 + sec + ms;
          result.push({ time, text: cleanText });
        }
      }
    }
  }
  return result.sort((a, b) => a.time - b.time);
}

// 🌟 1. 扩充 Context 类型
type PlayMode = 'loop' | 'single' | 'random';

interface MusicContextType {
  playlist: any[];
  currentIndex: number;
  currentSong: any;
  isPlaying: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  currentLyric: string;
  isLoading: boolean;
  volume: number;
  isMuted: boolean;
  playMode: PlayMode;

  togglePlay: () => void;
  nextSong: () => void;
  prevSong: () => void;
  handleSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  playSong: (index: number) => void;
  setVolume: (value: number) => void;
  toggleMute: () => void;
  togglePlayMode: () => void;
}

const MusicContext = createContext<MusicContextType | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [lyrics, setLyrics] = useState<{ time: number; text: string }[]>([]);
  const [currentLyric, setCurrentLyric] = useState("正在加载本地音乐...");
  const [isLoading, setIsLoading] = useState(true);

  const [volume, setVolumeState] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playMode, setPlayMode] = useState<PlayMode>('loop');

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    let isMounted = true;
    
    // 🎵 本地音乐配置
    const localPlaylist = [
      {
        id: "1",
        title: "无名的人",
        artist: "毛不易",
        cover: "/music/wuming.webp",            
        src: "/music/wuming.mp3",               
        lrcUrl: "/music/wuming.lrc",            
        lyrics: []
      },
      {
        id: "2",
        title: "暮色回响",
        artist: "张韶涵",
        cover: "/music/mosehuixiang.webp",     
        src: "/music/mosehuixiang.mp3",         
        lrcUrl: "/music/mosehuixiang.lrc",      
        lyrics: []
      },
      {
        id: "3",
        title: "兰亭序",
        artist: "周杰伦",
        cover: "/music/lantingxu.webp",        
        src: "/music/lantingxu.mp3",            
        lrcUrl: "/music/lantingxu.lrc",         
        lyrics: []
      },
      {
        id: "4",
        title: "花海",
        artist: "周杰伦",
        cover: "/music/huahai.webp",           
        src: "/music/huahai.mp3",            
        lrcUrl: "/music/huahai.lrc",         
        lyrics: []
      }
    ];

    if (isMounted) {
      setPlaylist(localPlaylist);
      setIsLoading(false);
    }

    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (playlist.length === 0) return;
    let isMounted = true;
    const currentSong = playlist[currentIndex];
    setLyrics([]);
    setCurrentLyric("♪ 正在缓冲 ♪");
    if (currentSong.lyrics && currentSong.lyrics.length > 0) {
      if (isMounted) {
        setLyrics(currentSong.lyrics);
        setCurrentLyric(currentSong.lyrics[0]?.text || "♪ 纯享音乐 ♪");
      }
    } else if (currentSong.lrcUrl) {
      fetch(currentSong.lrcUrl)
        .then(res => res.text())
        .then(text => {
          if (isMounted) {
             const parsed = parseLrc(text);
             setLyrics(parsed);
             setPlaylist(prev => {
                const newPlaylist = [...prev];
                newPlaylist[currentIndex].lyrics = parsed;
                return newPlaylist;
             });
          }
        })
        .catch(() => { if (isMounted) setCurrentLyric("♪ 纯享音乐 ♪"); });
    }

    if (isPlaying && audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => setIsPlaying(false));
      }
    }
    return () => { isMounted = false; };
  }, [currentIndex, playlist.length]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play().catch(() => setIsPlaying(false));
      setIsPlaying(!isPlaying);
    }
  };

  const nextSong = () => {
    if (playMode === 'random') {
      setCurrentIndex(Math.floor(Math.random() * playlist.length));
    } else {
      setCurrentIndex((prev) => (prev + 1) % playlist.length);
    }
  };

  const prevSong = () => {
    if (playMode === 'random') {
      setCurrentIndex(Math.floor(Math.random() * playlist.length));
    } else {
      setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    }
  };

  const playSong = (index: number) => {
    setCurrentIndex(index);
    if (!isPlaying) setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const { currentTime, duration } = audioRef.current;
      setCurrentTime(currentTime);
      setDuration(duration || 0);
      setProgress((currentTime / (duration || 1)) * 100);

      if (lyrics.length > 0) {
        const activeLyric = lyrics.slice().reverse().find(l => currentTime >= l.time);
        if (activeLyric && activeLyric.text !== currentLyric) {
          setCurrentLyric(activeLyric.text);
        }
      }
    }
  };

  const handleEnded = () => {
    if (playMode === 'single' && audioRef.current) {
       audioRef.current.currentTime = 0;
       audioRef.current.play();
    } else {
       nextSong();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = Number(e.target.value);
    setProgress(newProgress);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
    }
  };

  const setVolume = (val: number) => {
    setVolumeState(val);
    if (isMuted && val > 0) setIsMuted(false);
  };

  const toggleMute = () => setIsMuted(!isMuted);

  const togglePlayMode = () => {
    setPlayMode(prev => {
      if (prev === 'loop') return 'single';
      if (prev === 'single') return 'random';
      return 'loop';
    });
  };

  const currentSong = playlist[currentIndex];

  return (
    <MusicContext.Provider value={{
        playlist, currentIndex, currentSong, isPlaying, progress, currentTime, duration, currentLyric, isLoading,
        volume, isMuted, playMode,
        togglePlay, nextSong, prevSong, handleSeek,
        playSong, setVolume, toggleMute, togglePlayMode
    }}>
      {children}
      {currentSong && (
        <audio
          ref={audioRef}
          src={currentSong.src}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onLoadedMetadata={handleTimeUpdate}
        />
      )}
    </MusicContext.Provider>
  );
}

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error("useMusic must be used within MusicProvider");
  return context;
};
