"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { siteConfig } from '../siteConfig';

export default function Navbar() {
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  // 控制滚动时自动隐藏/显示导航栏
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { name: '首页', href: '/' },
    { name: '项目', href: '/projects' },
    { name: '文章', href: '/timeline' },
    { name: '照片', href: '/photowall' },
    { name: '音乐', href: '/music' },
    { name: '说说', href: '/moments' },
    { name: '杂谈', href: '/chatter' },
    { name: '友链', href: '/friends' },
    { name: '关于', href: '/about' },
  ];

  return (
    <header className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${showNav ? 'translate-y-0' : '-translate-y-full'} bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border-white/20 dark:border-white/5 shadow-sm`}>
      <div className="w-full max-w-6xl mx-auto h-16 flex items-center justify-between px-4 sm:px-[30px] box-border">
        
        {/* 左侧：博客标题（手机端自动隐藏或自适应，避免挤压） */}
        <Link href="/" className="text-lg sm:text-xl font-black text-slate-800 dark:text-white tracking-tighter hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 flex-shrink-0">
          {siteConfig.navTitle || siteConfig.authorName}
          <span className="text-indigo-500 mx-1">{siteConfig.navSuffix || 'の'}</span>
          <span className="hidden sm:inline">{siteConfig.navAfter || '宝藏之地'}</span>
        </Link>

        {/* 💻 电脑端导航菜单 */}
        <nav className="hidden md:flex gap-8 text-sm font-bold">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname === `${link.href}/`;
            return (
              <Link key={link.href} href={link.href} className={`relative py-1 transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-200 hover:text-indigo-600'}`}>
                {link.name}
                {isActive && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-500 rounded-full animate-pulse"></span>}
              </Link>
            );
          })}
        </nav>

        {/* 📱 手机端：支持横向滚动的顶部磨砂导航菜单（无论去哪个页面都固定在顶部） */}
        <nav className="flex md:hidden items-center gap-2 overflow-x-auto no-scrollbar py-2 max-w-[60%] sm:max-w-[70%]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname === `${link.href}/`;
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                  isActive 
                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30' 
                    : 'text-slate-700 dark:text-slate-200 bg-white/30 dark:bg-slate-800/40 hover:bg-white/60'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

      </div>
    </header>
  );
}
