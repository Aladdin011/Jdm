// Blog Types
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  publishedAt: string;
  readTime: string;
  category: string;
  image: string;
  tags: string[];
}

export interface BlogCategory {
  id: string;
  name: string;
  count: number;
}

