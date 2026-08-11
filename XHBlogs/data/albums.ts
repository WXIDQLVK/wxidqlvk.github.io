// 🛡️ 本文件由 XingHuiSama 控制台自动生成，请勿手动修改
export interface Photo { url: string; caption?: string; }
export interface Album { id: string; title: string; description: string; cover: string; date: string; photos: Photo[]; }

export const albums: Album[] = [
  {
    "id": "ripples-of-the-past",
    "title": "往昔的涟漪",
    "description": "流星划过夜空，生命的长河荡起涟漪",
    "cover": "/photos/xilian.webp",
    "date": "2026.08",
    "photos": [
      {
        "url": "/photos/xilian1.webp",
        "caption": "昔涟一"
      },
      {
        "url": "/photos/xilian2.webp",
        "caption": "昔涟二"
      },
      {
        "url": "/photos/xilian3.webp",
        "caption": "昔涟三"
      }
    ]
  },
  {
    "id": "terra-journey",
    "title": "长夜的萤火",
    "description": "同向而行的人，终会在某处相遇",
    "cover": "/photos/liuying1.webp",
    "date": "2026.08",
    "photos": [
      {
        "url": "/photos/liuying2.webp",
        "caption": "流萤一"
      },
      {
        "url": "/photos/liuying3.webp",
        "caption": "流萤二"
      }
    ]
  },
  {
    "id": "history-tour",
    "title": "云间的啼音",
    "description": "如果鸟儿注定要坠落，为何还要飞向天空",
    "cover": "/photos/niao1.webp",
    "date": "2026.08",
    "photos": [
      {
        "url": "/photos/niao1.webp",
        "caption": "知更鸟一"
      },
      {
        "url": "/photos/niao2.webp",
        "caption": "知更鸟二"
      },
      {
        "url": "/photos/niao3.webp",
        "caption": "知更鸟三"
      }
    ]
  }
];
