import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlogPost, BlogCategory } from '../types/blog';
import { 
  Calendar, 
  Clock, 
  Building2,
  Home,
  Wrench,
  Search
} from 'lucide-react';

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with Supabase queries
  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Modern Construction Techniques for Sustainable Buildings',
      excerpt: 'Exploring innovative construction methods that reduce environmental impact while maintaining structural integrity.',
      content: '',
      author: {
        name: 'Sarah Chen',
        avatar: '/avatars/sarah.jpg',
        role: 'Lead Architect'
      },
      publishedAt: '2024-01-15',
      readTime: '5 min read',
      category: 'innovation',
      image: '/blog/modern-construction.jpg',
      tags: ['Sustainability', 'Innovation', 'Green Building']
    },
    {
      id: '2',
      title: 'The Future of Industrial Construction',
      excerpt: 'How technology and automation are transforming large-scale industrial construction projects.',
      content: '',
      author: {
        name: 'Mike Rodriguez',
        avatar: '/avatars/mike.jpg',
        role: 'Project Manager'
      },
      publishedAt: '2024-01-12',
      readTime: '4 min read',
      category: 'industrial',
      image: '/blog/industrial-future.jpg',
      tags: ['Industrial', 'Technology', 'Automation']
    },
    {
      id: '3',
      title: 'Residential Construction Trends 2024',
      excerpt: 'Discover the latest trends shaping residential construction and home design.',
      content: '',
      author: {
        name: 'Emily Watson',
        avatar: '/avatars/emily.jpg',
        role: 'Design Specialist'
      },
      publishedAt: '2024-01-10',
      readTime: '6 min read',
      category: 'residential',
      image: '/blog/residential-trends.jpg',
      tags: ['Residential', 'Design', 'Trends']
    },
    {
      id: '4',
      title: 'Safety Standards in Modern Construction',
      excerpt: 'Implementing advanced safety protocols to protect workers and ensure project success.',
      content: '',
      author: {
        name: 'James Wilson',
        avatar: '/avatars/james.jpg',
        role: 'Safety Officer'
      },
      publishedAt: '2024-01-08',
      readTime: '3 min read',
      category: 'safety',
      image: '/blog/safety-standards.jpg',
      tags: ['Safety', 'Standards', 'Workplace']
    },
    {
      id: '5',
      title: 'Smart Building Materials Revolution',
      excerpt: 'Discover how innovative materials are changing the construction landscape.',
      content: '',
      author: {
        name: 'David Park',
        avatar: '/avatars/david.jpg',
        role: 'Materials Specialist'
      },
      publishedAt: '2024-01-05',
      readTime: '7 min read',
      category: 'materials',
      image: '/blog/smart-materials.jpg',
      tags: ['Materials', 'Innovation', 'Technology']
    },
    {
      id: '6',
      title: 'Project Management Best Practices',
      excerpt: 'Learn the essential practices for managing successful construction projects.',
      content: '',
      author: {
        name: 'Lisa Anderson',
        avatar: '/avatars/lisa.jpg',
        role: 'Senior Project Manager'
      },
      publishedAt: '2024-01-03',
      readTime: '5 min read',
      category: 'innovation',
      image: '/blog/project-management.jpg',
      tags: ['Management', 'Best Practices', 'Efficiency']
    }
  ];

  const categories: BlogCategory[] = [
    { id: 'all', name: 'All Articles', count: blogPosts.length },
    { id: 'innovation', name: 'Innovation', count: 2 },
    { id: 'industrial', name: 'Industrial', count: 1 },
    { id: 'residential', name: 'Residential', count: 1 },
    { id: 'safety', name: 'Safety', count: 1 },
    { id: 'materials', name: 'Materials', count: 1 }
  ];

  const categoryIcons: { [key: string]: React.ReactNode } = {
    all: <Building2 className="w-5 h-5" />,
    innovation: <Home className="w-5 h-5" />,
    industrial: <Building2 className="w-5 h-5" />,
    residential: <Home className="w-5 h-5" />,
    safety: <Wrench className="w-5 h-5" />,
    materials: <Wrench className="w-5 h-5" />
  };

  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, blogPosts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative py-20 bg-gradient-to-r from-blue-900/90 to-gray-900/90"
      >
        <div className="absolute inset-0 bg-black/40" aria-hidden="true"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold text-white mb-6"
          >
            Build. Create. Inspire.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto"
          >
            Insights and innovations from the forefront of construction excellence
          </motion.p>
        </div>
      </motion.section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="lg:w-1/4" aria-label="Blog filters and categories">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Search */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Articles</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                  <input
                    type="text"
                    placeholder="Search insights..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    aria-label="Search blog posts"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <nav className="space-y-2" aria-label="Blog categories">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                        selectedCategory === category.id
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                          : 'bg-white/50 text-gray-700 hover:bg-white/80'
                      }`}
                      aria-pressed={selectedCategory === category.id}
                      aria-label={`Filter by ${category.name}`}
                    >
                      <div className="flex items-center space-x-3">
                        {categoryIcons[category.id]}
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        selectedCategory === category.id
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {category.count}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Featured Tags */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {['Sustainability', 'Innovation', 'Design', 'Safety', 'Technology', 'Materials'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-3 py-1 bg-white/50 text-gray-700 rounded-full text-sm border border-white/20 hover:bg-white/80 transition-colors duration-200 cursor-pointer"
                      aria-label={`Search for ${tag}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </aside>

          {/* Blog Posts */}
          <main className="lg:w-3/4" aria-label="Blog posts">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid gap-8"
            >
              <AnimatePresence mode="wait">
                {filteredPosts.length > 0 ? (
                  <motion.div
                    key="posts-grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid md:grid-cols-2 gap-8"
                  >
                    {filteredPosts.map((post, index) => (
                      <BlogPostCard key={post.id} post={post} index={index} />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="no-posts"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                    role="status"
                  >
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
                      <p className="text-gray-600 text-lg">No articles found matching your criteria.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

// Blog Post Card Component
interface BlogPostCardProps {
  post: BlogPost;
  index: number;
}

const BlogPostCard = ({ post, index }: BlogPostCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-gray-600 group-hover:scale-110 transition-transform duration-500" aria-hidden="true" />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full text-sm font-medium capitalize">
            {post.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" aria-hidden="true" />
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </time>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" aria-hidden="true" />
            <span>{post.readTime}</span>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
          {post.title}
        </h2>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Author */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-gray-600 rounded-full" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-gray-900">{post.author.name}</p>
              <p className="text-xs text-gray-500">{post.author.role}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 text-sm font-medium shadow-lg shadow-blue-500/25"
            aria-label={`Read more about ${post.title}`}
          >
            Read More
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogPage;

