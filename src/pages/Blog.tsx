import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Calendar,
  User,
  Clock,
  ArrowRight,
  Filter,
  Tag,
  Share2,
  BookOpen,
} from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";
import LazyLoadImage from "@/components/ui/LazyLoadImage";
import { blog, BlogPost, BlogCategory } from "@/data/blog";
import useAnalytics from "@/hooks/useAnalytics";

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    BlogCategory | "All"
  >("All");
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(blog);
  const { trackBusinessEvent } = useAnalytics();

  // Filter posts based on search and category
  useEffect(() => {
    let filtered = blog;

    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    setFilteredPosts(filtered);
  }, [searchTerm, selectedCategory]);

  const categories: (BlogCategory | "All")[] = [
    "All",
    "Infrastructure Policy",
    "Smart Cities & Innovation",
    "Behind the Scenes",
    "Sustainability & Climate",
  ];

  const handlePostView = (post: BlogPost) => {
    trackBusinessEvent.blogEngagement("article_view", post.title);
  };

  const handleShare = (post: BlogPost) => {
    trackBusinessEvent.blogEngagement("article_share", post.title);
    // Implement actual sharing logic here
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.origin + `/blog/${post.slug}`,
      });
    }
  };

  const getFeaturedPost = () => filteredPosts[0];
  const getRecentPosts = () => filteredPosts.slice(1, 4);
  const getAllPosts = () => filteredPosts.slice(0);

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-secondary to-primary py-20 pt-32">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                JD Marc Insights
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Thought leadership on infrastructure development, smart cities,
                and building Africa's future. Expert insights from our
                engineering and construction teams.
              </p>

              {/* Search and Filter Bar */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-2xl mx-auto">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Search articles, topics, or tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    />
                  </div>
                  <div className="relative">
                    <Filter
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60"
                      size={20}
                    />
                    <select
                      value={selectedCategory}
                      onChange={(e) =>
                        setSelectedCategory(
                          e.target.value as BlogCategory | "All",
                        )
                      }
                      className="pl-12 pr-8 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-accent appearance-none cursor-pointer min-w-[200px]"
                    >
                      {categories.map((category) => (
                        <option
                          key={category}
                          value={category}
                          className="text-gray-800"
                        >
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {filteredPosts.length > 0 ? (
              <>
                {/* Featured Article */}
                {getFeaturedPost() && (
                  <motion.div
                    className="mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                      Featured Article
                    </h2>
                    <FeaturedPostCard
                      post={getFeaturedPost()}
                      onView={handlePostView}
                      onShare={handleShare}
                    />
                  </motion.div>
                )}

                {/* Recent Articles Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                    Latest Insights
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {getAllPosts().map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 * index }}
                      >
                        <BlogPostCard
                          post={post}
                          onView={handlePostView}
                          onShare={handleShare}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </>
            ) : (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <BookOpen className="mx-auto mb-4 text-gray-400" size={64} />
                <h3 className="text-2xl font-bold text-gray-600 mb-2">
                  No articles found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search terms or category filter.
                </p>
              </motion.div>
            )}
          </div>
        </section>

        {/* Newsletter Subscription */}
        <section className="bg-primary py-16">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              className="max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-white mb-4">
                Stay Updated with JD Marc Insights
              </h2>
              <p className="text-blue-100 mb-8">
                Get the latest articles on infrastructure development and smart
                cities delivered directly to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button className="px-6 py-3 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg transition-colors">
                  Subscribe
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

// Featured Post Card Component
function FeaturedPostCard({
  post,
  onView,
  onShare,
}: {
  post: BlogPost;
  onView: (post: BlogPost) => void;
  onShare: (post: BlogPost) => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/2">
          <LazyLoadImage
            src={post.image}
            alt={post.title}
            className="w-full h-64 md:h-full object-cover"
          />
        </div>
        <div className="md:w-1/2 p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
              {post.category}
            </span>
            <span className="text-gray-400">•</span>
            <div className="flex items-center gap-1 text-gray-600 text-sm">
              <Calendar size={14} />
              {post.date}
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h3>

          <p className="text-gray-600 mb-6 leading-relaxed">{post.excerpt}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <User size={14} />
              {post.author}
              <span className="text-gray-400">•</span>
              <Clock size={14} />
              {post.readTime}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onShare(post)}
                className="p-2 text-gray-600 hover:text-accent transition-colors"
              >
                <Share2 size={18} />
              </button>
              <button
                onClick={() => onView(post)}
                className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors"
              >
                Read More
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Regular Blog Post Card Component
function BlogPostCard({
  post,
  onView,
  onShare,
}: {
  post: BlogPost;
  onView: (post: BlogPost) => void;
  onShare: (post: BlogPost) => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <LazyLoadImage
        src={post.image}
        alt={post.title}
        className="w-full h-48 object-cover"
      />

      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
            {post.category}
          </span>
          <span className="text-gray-400 text-xs">•</span>
          <div className="flex items-center gap-1 text-gray-600 text-xs">
            <Calendar size={12} />
            {post.date}
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
          {post.title}
        </h3>

        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          {post.excerpt.substring(0, 120)}...
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-gray-600 text-xs">
            <User size={12} />
            {post.author}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onShare(post)}
              className="p-1 text-gray-600 hover:text-accent transition-colors"
            >
              <Share2 size={16} />
            </button>
            <button
              onClick={() => onView(post)}
              className="flex items-center gap-1 px-3 py-1 bg-accent hover:bg-accent/90 text-white text-sm rounded-md transition-colors"
            >
              Read
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
