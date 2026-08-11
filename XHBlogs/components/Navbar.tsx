"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import PageTransition from '../components/PageTransition';
import { siteConfig } from '../siteConfig';
import CloudPlayer from '../components/CloudPlayer';
import ThemeToggleBlock from '../components/ThemeToggleBlock';
import ProfileCard from '../components/ProfileCard';
import SiteDashboard from '../components/SiteDashboard';
import { albums } from '../data/albums';
import LyricBar from '../components/LyricBar';
import { ToastProvider } from '../components/ToastProvider';

import LatestPostsCarousel from '../components/LatestPostsCarousel';
import LatestChatterCarousel from '../components/LatestChatterCarousel';
import DanmakuBackground from '../components/DanmakuBackground';

function formatUpdateTime(dateString: string) {
  if (!dateString || dateString === '1970-01-01') return '刚刚更新';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    if (hours === '00' && mins === '00') return `${year}.${month}.${day}`;
    return `${year}.${month}.${day} ${hours}:${mins}`;
  } catch { return dateString; }
}

export default function Home() {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsStandalone(true);
    }
  }, []);

  let allPosts: any[] = [];
  let allChatters: any[] = [];
  
  try {
    // @ts-ignore
    const fs = typeof window === 'undefined' ? require('fs') : null;
    // @ts-ignore
    const path = typeof window === 'undefined' ? require('path') : null;
    // @ts-ignore
    const matter = typeof window === 'undefined' ? require('gray-matter') : null;

    if (fs && path && matter) {
      const postsDirectory = path.join(process.cwd(), 'posts');
      if (fs.existsSync(postsDirectory)) {
        const fileNames = fs.readdirSync(postsDirectory).filter((f: string) => f.endsWith('.md'));
        allPosts = fileNames.map((fileName: string) => {
          const fullPath = path.join(postsDirectory, fileName);
          const { data, content } = matter(fs.readFileSync(fullPath, 'utf8'));
          const rawDate = data.date || '1970-01-01';
          return {
            slug: fileName.replace(/\.md$/, ''),
            ...data,
            title: data.title || '',
            description: data.description || '',
            content: content || '',
            date: rawDate,
            formattedDate: formatUpdateTime(rawDate)
          };
        }).sort((a: any, b: any) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          if (dateB !== dateA) return dateB - dateA;
          return b.slug.localeCompare(a.slug);
        });
      }

      const chattersDirectory = path.join(process.cwd(), 'chatters');
      if (fs.existsSync(chattersDirectory)) {
        const chatterFiles = fs.readdirSync(chattersDirectory).filter((f: string) => f.endsWith('.md'));
        allChatters = chatterFiles.map((fileName: string) => {
          const fullPath = path.join(chattersDirectory, fileName);
          const { data, content } = matter(fs.readFileSync(fullPath, 'utf8'));
          const rawDate = data.date || '1970-01-01';
          const cover = data.cover || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop';
          return { slug: fileName.replace(/\.md$/, ''), title: data.title || '碎片记录', description: data.description || content.substring(0, 60), cover: cover, date: rawDate, formattedDate: formatUpdateTime(rawDate) };
        }).sort((a: any, b: any) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          if (dateB !== dateA) return dateB - dateA;
          return b.slug.localeCompare(a.slug);
        });
      }
    }
  } catch (e) {}

  const top5Posts = allPosts.length > 0 ? allPosts.slice(0, 5) : [{ slug: 'none', title: '暂无文章', description: '快去写第一篇吧！', cover: siteConfig.defaultPostCover, date: '', formattedDate: '' }];
  const top5Chatters = allChatters.length > 0 ? allChatters.slice(0, 5) : [{ slug: 'none', title: '暂无记录', description: '记录一段思绪...', cover: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop', date: '', formattedDate: '' }];

  const chatterCount = allChatters.length;
  const realPhotoCount = albums.reduce((total, album) => total + album.photos.length, 0);
  const latestAlbum = albums.length > 0 ? albums[0] : { id: '', title: '照片墙', description: '查看摄影', cover: siteConfig.photoWallImage, date: '' };

  return (
    <ToastProvider>
      <div className="min-h-screen relative pb-10">
        <Navbar />
        <PageTransition>
          {/* 🌟 完美留白：桌面 App 模式下使用 mt-44 sm:mt-48，与截图中完美的上下间距完全对齐；网页浏览器中维持 mt-24 sm:mt-28 不变 */}
          <div className={`w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10 transition-all ${isStandalone ? 'mt-44 sm:mt-48' : 'mt-24 sm:mt-28'}`}>

            <main className="flex flex-col gap-6 w-full mt-2">

              {/* 第一行：个人信息 + 播放器 */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
                <div className="col-span-1 lg:col-span-7 flex flex-col">
                    <ProfileCard postCount={allPosts.length} chatterCount={chatterCount} photoCount={realPhotoCount}/>
                </div>
                <div className="col-span-1 lg:col-span-5 flex flex-col">
                    <CloudPlayer/>
                </div>
              </div>

              {/* 歌词栏 */}
              <div className="w-full mt-6"><LyricBar/></div>

              {/* 第二行：文章轮播 + 照片墙 + 说说 + 主题切换 */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">

                <div className="col-span-1 lg:col-span-4 flex flex-col min-h-[300px]">
                  <LatestPostsCarousel posts={top5Posts} />
                </div>

                <div className="col-span-1 lg:col-span-8 flex flex-col gap-6">

                  <Link href="/photowall" className="w-full rounded-3xl bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl overflow-hidden transition-all duration-700 hover:scale-[1.02] relative group min-h-[200px] sm:min-h-[220px] flex-shrink-0">
                    <img src={latestAlbum.cover} className="w-full h-full absolute inset-0 object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"/>
                    <div className="absolute inset-0 bg-black/30 dark:bg-black/50 group-hover:bg-black/10 transition-colors duration-500"></div>
                    <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 right-6">
                      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2 underline decoration-pink-400">{latestAlbum.title}</h3>
                      <p className="text-white/90 text-sm sm:text-lg line-clamp-1">{latestAlbum.description}</p>
                    </div>
                  </Link>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full flex-1">
                    <div className="sm:col-span-2 flex flex-col min-h-[200px]">
                      <LatestChatterCarousel chatters={top5Chatters} />
                    </div>
                    <div className="sm:col-span-1 flex flex-col min-h-[120px]">
                      <ThemeToggleBlock />
                    </div>
                  </div>

                </div>
              </div>

              {/* 底部数据面板 */}
              <div className="w-full mt-4"><SiteDashboard/></div>
            </main>
          </div>
        </PageTransition>
      </div>
    </ToastProvider>
  );
}
