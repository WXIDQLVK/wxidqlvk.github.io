"use client";

import { useEffect } from "react";

export default function AdminPage() {
  useEffect(() => {
    // 动态加载 Decap CMS 的 CSS 和 JS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div>
      {/* 这里的 div 用来挂载 CMS 后台 */}
      <div id="nc-root"></div>
    </div>
  );
}
