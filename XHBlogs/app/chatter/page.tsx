import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Navbar from '../../components/Navbar';
import PageTransition from '../../components/PageTransition';
import ChatterBoard from './ChatterBoard';
import { siteConfig } from '@/siteConfig';

export const metadata = {
  title: "杂谈 | "+ siteConfig.title,
  description: "日常碎片与灵感记录",
};

export default function ChatterPage() {
  const chattersDirectory = path.join(process.cwd(), 'chatters');
  let chatters = [];

  try {
    if (!fs.existsSync(chattersDirectory)) {
      fs.mkdirSync(chattersDirectory);
    }

    const fileNames = fs.readdirSync(chattersDirectory).filter(fileName => fileName.endsWith('.md'));

    chatters = fileNames.map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fileContents = fs.readFileSync(path.join(chattersDirectory, fileName), 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || '',
        date: data.date || '未知时间',
        tags: data.tags || [],
        mood: data.mood || '',
        cover: data.cover || '',
        content: content.replace(/^#+ .*\n/m, '')
      };
    }).sort((a, b) => {
      // 🌟 改用纯字符串对比排序，彻底避开 new Date() 的时区漂移问题
      if (b.date !== a.date) {
        return b.date.localeCompare(a.date);
      }
      return b.slug.localeCompare(a.slug);
    });
  } catch (e) {
    console.error("读取杂谈文件失败:", e);
  }

  return (
    <div className="min-h-screen relative pb-10">
      <Navbar />
      <PageTransition>
        <ChatterBoard chatters={chatters} />
      </PageTransition>
    </div>
  );
}
