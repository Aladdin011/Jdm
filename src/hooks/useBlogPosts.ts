import { useState, useEffect } from 'react';
import supabase from '../lib/supabaseClient';
import { BlogPost } from '../types/blog';

export const useBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select(`
            *,
            author:profiles(name, avatar_url, role)
          `)
          .order('published_at', { ascending: false });

        if (error) throw error;

        // Transform Supabase data to match our BlogPost type
        const transformedPosts: BlogPost[] = (data || []).map((post: any) => ({
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          author: {
            name: post.author?.name || 'Anonymous',
            avatar: post.author?.avatar_url || '/default-avatar.png',
            role: post.author?.role || 'Contributor'
          },
          publishedAt: post.published_at,
          readTime: post.read_time,
          category: post.category,
          image: post.image_url,
          tags: post.tags || []
        }));

        setPosts(transformedPosts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching blog posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

    // Optional: Subscribe to real-time updates
    const subscription = supabase
      .channel('blog_posts_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'blog_posts' },
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { posts, loading, error };
};

// Hook for fetching a single blog post
export const useBlogPost = (postId: string) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select(`
            *,
            author:profiles(name, avatar_url, role)
          `)
          .eq('id', postId)
          .single();

        if (error) throw error;

        if (data) {
          const transformedPost: BlogPost = {
            id: data.id,
            title: data.title,
            excerpt: data.excerpt,
            content: data.content,
            author: {
              name: data.author?.name || 'Anonymous',
              avatar: data.author?.avatar_url || '/default-avatar.png',
              role: data.author?.role || 'Contributor'
            },
            publishedAt: data.published_at,
            readTime: data.read_time,
            category: data.category,
            image: data.image_url,
            tags: data.tags || []
          };

          setPost(transformedPost);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  return { post, loading, error };
};

