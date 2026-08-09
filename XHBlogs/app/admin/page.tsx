"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";

// 使用 Next.js 的动态导入彻底禁掉服务端渲染（SSR）
const DecapCms = dynamic(
  async () => {
    // 动态引入样式
    import("decap-cms/dist/decap-cms.css");
    // 返回一个占位组件或直接加载
    return () => <div id="nc-root" />;
  },
  { ssr: false }
);

export default function AdminPage() {
  useEffect(() => {
    // 动态加载 CMS 核心脚本
    const script = document.createElement("script");
    script.src = "https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return <DecapCms />;
}
