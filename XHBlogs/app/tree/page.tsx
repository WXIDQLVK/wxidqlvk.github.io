import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// 引入前台客户端组件
import CreativeWorkshopClient from './CreativeWorkshopClient';

/** 把 gray-matter 解析出的 date（可能是 string 或 Date）统一成字符串，避免 substring 报错 */
function normalizeDate(d: any): string {
  if (!d) return '2026-05-01';
  if (d instanceof Date && !isNaN(d.getTime())) {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
  }
  return String(d);
}

function getLocalItems(directoryName: string, typeName: string) {
  const dirPath = path.join(process.cwd(), directoryName);
  let items: any[] = [];
  try {
    if (fs.existsSync(dirPath)) {
      const fileNames = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
      items = fileNames.map(fileName => {
        const fullPath = path.join(dirPath, fileName);
        // 🌟 核心：把 content（正文内容）和 data（头部参数）解构出来！
        const { data, content } = matter(fs.readFileSync(fullPath, 'utf8'));

        // 提取真正的文件名作为路由 slug
        const realSlug = fileName.replace(/\.md$/, '');

        return {
          id: data.id || realSlug,
          slug: realSlug, // 🌟 强制保留真实的 slug 供路由跳转使用
          title: data.title || '',
          type: typeName,
          // 🌟 核心修复：用 normalizeDate 确保 date 绝对是字符串，防止 substring 报错
          date: normalizeDate(data.date),
          // 🌟 核心修复：把 cover（封面图）提取出来传给前台！如果写的是 image 也兼容
          cover: data.cover || data.image || null,
          // 把正文传给前台，去掉可能存在的换行符，限制长度防止卡片撑爆
          content: content.trim()
        };
      });
    }
  } catch (error) {
    console.error(`读取 ${directoryName} 失败:`, error);
  }
  return items;
}

export default function CreativeWorkshopPage() {
  const posts = getLocalItems('posts', 'post');
  const chatters = getLocalItems('chatters', 'chatter');
  const moments = getLocalItems('moments', 'moment');

  return (
    <CreativeWorkshopClient
      posts={posts}
      chatters={chatters}
      moments={moments}
    />
  );
}
