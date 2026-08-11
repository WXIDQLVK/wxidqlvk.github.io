"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { siteConfig } from '../siteConfig';

export default function Navbar() {
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isStandalone, setIsStandalone] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // 检测是否是以独立App模式（添加到桌面）运行
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsStandalone(true);
    }

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
    { name: '关于', href: '/about' },
  ];

  return (
    <>
      <header className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${showNav ? 'translate-y-0' : '-translate-y-full'} bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border-white/20 dark:border-white/5 shadow-sm`}>
        {/* 🌟 整体上移：导航栏自身的顶部间距微调收窄 */}
        <div className={`w-full max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-[30px] box-border transition-all ${isStandalone ? 'pt-[52px] pb-3 h-[112px]' : 'h-16 pt-0'}`}>
          
          {/* 💻 电脑端：原封不动 */}
          <Link href="/" className="hidden md:block text-xl font-black text-slate-800 dark:text-white tracking-tighter hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300">
            {siteConfig.navTitle || siteConfig.authorName}
            <span className="text-indigo-500 mx-1">{siteConfig.navSuffix || 'の'}</span>
            {siteConfig.navAfter || '宝藏之地'}
          </Link>
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

          {/* 📱 手机端：导航栏按钮 */}
          <nav className="flex md:hidden items-center justify-between w-full overflow-x-auto no-scrollbar py-1 gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname === `${link.href}/`;
              return (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className={`px-2.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all duration-300 ${
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

      {/* 🌟 整体上移：对应的占位块同步收窄，让整个页面的顶部距离一起往上提一小点 */}
      <div className={`w-full pointer-events-none ${isStandalone ? 'pt-[64px] sm:pt-[76px] block' : 'hidden'}`} aria-hidden="true"></div>
    </>
  );
}
