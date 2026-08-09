"use client";

import { useEffect } from "react";

export default function AdminRedirect() {
  useEffect(() => {
    // 自动跳转到我们接下来要创建的静态后台页面
    window.location.href = "/admin/index.html";
  }, []);

  return <div style={{ padding: "20px", textAlign: "center" }}>正在加载后台...</div>;
}
