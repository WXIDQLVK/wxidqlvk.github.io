"use client";

import { useEffect } from "react";

export default function AdminPage() {
  useEffect(() => {
    // 手动指定 config.yml 的加载路径
    window.CMS_CONFIG = {
      load_config_file: true,
    };
  }, []);

  return (
    <>
      <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
    </>
  );
}
