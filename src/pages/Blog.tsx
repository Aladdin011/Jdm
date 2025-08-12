import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
  Heart,
  Bookmark,
  Eye,
  ChevronDown,
  X,
  Mail,
  Play,
  Construction,
  TrendingUp,
  Award,
} from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";
import { blogPosts } from "@/data/blog";
import useAnalytics from "@/hooks/useAnalytics";
import { SEOHead } from "@/components/SEO/SEOHead";

// Enhanced BlogPost interface with additional fields
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  date: string;
  author: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
  featured: boolean;
  tags?: string[];
  readTime?: string;
  views?: number;
  likes?: number;
}

export type BlogCategory =
  | "Infrastructure Policy"
  | "Smart Cities & Urban Innovation"
  | "Behind-the-Scenes Projects"
  | "Sustainability & Climate Engineering"
  | "Emerging Trends in Civil Engineering"
  | "Construction Technology"
  | "Project Management"
  | "Remote Collaboration"
  | "Africa Development";

// Enhanced blog posts with additional metadata
const enhancedBlogPosts: BlogPost[] = blogPosts.map((post, index) => ({
  ...post,
  readTime: `${Math.floor(Math.random() * 8) + 3} min read`,
  views: Math.floor(Math.random() * 5000) + 500,
  likes: Math.floor(Math.random() * 100) + 10,
  tags: [
    "Construction Tech",
    "Innovation",
    "Africa Development",
    "Sustainability",
    "Smart Cities",
    "Infrastructure",
    "Engineering",
    "Remote Work",
  ].slice(0, Math.floor(Math.random() * 4) + 2),
}));

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | "All">("All");
  const [selectedDate, setSelectedDate] = useState<string>("latest");
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(enhancedBlogPosts);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<number>>(new Set());
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [visiblePosts, setVisiblePosts] = useState(9);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { trackBusinessEvent } = useAnalytics();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);

  // Categories for construction focus
  const categories: (BlogCategory | "All")[] = [
    "All",
    "Construction Technology",
    "Project Management", 
    "Infrastructure Policy",
    "Smart Cities & Urban Innovation",
    "Behind-the-Scenes Projects",
    "Sustainability & Climate Engineering",
    "Emerging Trends in Civil Engineering",
    "Remote Collaboration",
    "Africa Development",
  ];

  const dateFilters = [
    { value: "latest", label: "Latest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "this-month", label: "This Month" },
    { value: "this-year", label: "This Year" },
  ];

  // Filter posts based on search, category, and date
  useEffect(() => {
    let filtered = enhancedBlogPosts;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (post.tags &&
            post.tags.some((tag) =>
              tag.toLowerCase().includes(searchTerm.toLowerCase()),
            )),
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    // Date sorting
    if (selectedDate === "latest") {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (selectedDate === "oldest") {
      filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    setFilteredPosts(filtered);
    updateActiveFilters();
  }, [searchTerm, selectedCategory, selectedDate]);

  const updateActiveFilters = () => {
    const filters: Record<string, string> = {};
    if (searchTerm) filters.search = searchTerm;
    if (selectedCategory !== "All") filters.category = selectedCategory;
    if (selectedDate !== "latest") filters.date = selectedDate;
    setActiveFilters(filters);
  };

  const removeFilter = (type: string) => {
    if (type === "search") {
      setSearchTerm("");
    } else if (type === "category") {
      setSelectedCategory("All");
    } else if (type === "date") {
      setSelectedDate("latest");
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedDate("latest");
  };

  const handlePostView = (post: BlogPost) => {
    trackBusinessEvent.blogEngagement("article_view", post.title);
  };

  const handleShare = (post: BlogPost) => {
    trackBusinessEvent.blogEngagement("article_share", post.title);
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.origin + `/blog/${post.slug}`,
      });
    }
  };

  const toggleBookmark = (postId: number) => {
    const newBookmarks = new Set(bookmarkedPosts);
    if (newBookmarks.has(postId)) {
      newBookmarks.delete(postId);
    } else {
      newBookmarks.add(postId);
    }
    setBookmarkedPosts(newBookmarks);
    
    // Save to localStorage
    localStorage.setItem('bookmarked-articles', JSON.stringify(Array.from(newBookmarks)));
  };

  const toggleLike = (postId: number) => {
    const newLikes = new Set(likedPosts);
    if (newLikes.has(postId)) {
      newLikes.delete(postId);
    } else {
      newLikes.add(postId);
    }
    setLikedPosts(newLikes);
  };

  const loadMorePosts = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisiblePosts(prev => prev + 6);
      setIsLoadingMore(false);
    }, 1000);
  };

  const getFeaturedPost = () => filteredPosts.find(post => post.featured) || filteredPosts[0];
  const getVisiblePosts = () => filteredPosts.slice(0, visiblePosts);
  const hasMorePosts = filteredPosts.length > visiblePosts;

  return (
    <PageTransition>
      <SEOHead 
        title="Construction Insights & Industry Blog | JD Marc Limited"
        description="Expert insights on construction technology, project management, and infrastructure development in Africa. Read the latest from JD Marc's construction professionals."
        keywords="construction blog, infrastructure development, construction technology, project management, Africa construction, engineering insights"
        canonical="/blog"
      />

      <div className="min-h-screen bg-gray-50">
        {/* Premium Hero Section */}
        <section className="relative overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-[#051822] via-[#2D383E] to-[#7C5841]"
            style={{ y: heroY }}
          />
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-10 right-10 w-72 h-72 bg-[#AA7452] rounded-full opacity-10 blur-3xl"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 20, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-10 left-10 w-96 h-96 bg-[#D4C9C7] rounded-full opacity-5 blur-3xl"
              animate={{ 
                scale: [1.2, 1, 1.2],
                rotate: [360, 180, 0],
              }}
              transition={{ duration: 25, repeat: Infinity }}
            />
          </div>

          <div className="relative z-10 container mx-auto px-4 py-20 pt-32">
            <motion.div
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Premium Badge */}
              <motion.div
                className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-[#AA7452]/30 rounded-full mb-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Construction className="w-5 h-5 text-[#AA7452]" />
                <span className="text-[#AA7452] font-semibold text-sm">Construction Insights</span>
              </motion.div>

              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Building Knowledge,
                <span className="block bg-gradient-to-r from-[#AA7452] to-[#7C5841] bg-clip-text text-transparent">
                  Sharing Expertise
                </span>
              </motion.h1>

              <motion.p 
                className="text-xl text-blue-100 mb-12 leading-relaxed max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Discover the latest trends, innovations, and insights in African construction. 
                From project management tips to industry analysis, we share knowledge that 
                drives the construction revolution.
              </motion.p>

              {/* Advanced Search & Filter Bar */}
              <motion.div
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                  {/* Search Input */}
                  <div className="relative flex-1 w-full max-w-md">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search articles, topics, or trends..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/20 border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#AA7452] focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Category Filter */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowCategoryDropdown(!showCategoryDropdown);
                        setShowDateDropdown(false);
                      }}
                      className="flex items-center gap-2 px-4 py-3 bg-white/20 border-2 border-white/30 rounded-xl text-white hover:bg-white/30 transition-all min-w-[200px] justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {selectedCategory === "All" ? "Category" : selectedCategory}
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showCategoryDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-60 overflow-y-auto"
                      >
                        {categories.map((category) => (
                          <button
                            key={category}
                            onClick={() => {
                              setSelectedCategory(category);
                              setShowCategoryDropdown(false);
                            }}
                            className="w-full text-left px-4 py-3 text-gray-700 hover:bg-[#AA7452]/10 hover:text-[#7C5841] transition-colors text-sm first:rounded-t-xl last:rounded-b-xl"
                          >
                            {category}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  {/* Date Filter */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowDateDropdown(!showDateDropdown);
                        setShowCategoryDropdown(false);
                      }}
                      className="flex items-center gap-2 px-4 py-3 bg-white/20 border-2 border-white/30 rounded-xl text-white hover:bg-white/30 transition-all min-w-[150px] justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {dateFilters.find(d => d.value === selectedDate)?.label || "Date"}
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showDateDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showDateDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-200 z-50"
                      >
                        {dateFilters.map((filter) => (
                          <button
                            key={filter.value}
                            onClick={() => {
                              setSelectedDate(filter.value);
                              setShowDateDropdown(false);
                            }}
                            className="w-full text-left px-4 py-3 text-gray-700 hover:bg-[#AA7452]/10 hover:text-[#7C5841] transition-colors text-sm first:rounded-t-xl last:rounded-b-xl"
                          >
                            {filter.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Blog Statistics */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-8 border-t border-white/20"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#AA7452] mb-2">150+</div>
                  <div className="text-white/80 text-sm">Articles Published</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#AA7452] mb-2">50K+</div>
                  <div className="text-white/80 text-sm">Monthly Readers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#AA7452] mb-2">25+</div>
                  <div className="text-white/80 text-sm">Expert Contributors</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Active Filters Display */}
        {Object.keys(activeFilters).length > 0 && (
          <section className="py-6 bg-white border-b">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm font-semibold text-gray-600">Active Filters:</span>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(activeFilters).map(([type, value]) => (
                    <motion.div
                      key={type}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 px-3 py-1 bg-[#7C5841] text-white text-sm font-medium rounded-full"
                    >
                      <span>{value}</span>
                      <button
                        onClick={() => removeFilter(type)}
                        className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                      >
                        <X className="w-2 h-2" />
                      </button>
                    </motion.div>
                  ))}
                </div>
                <button
                  onClick={clearAllFilters}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Featured Article Section */}
        {getFeaturedPost() && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#AA7452]/10 text-[#7C5841] rounded-full text-sm font-semibold mb-4">
                  <Award className="w-4 h-4" />
                  Editor's Pick
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Featured Article</h2>
              </motion.div>

              <FeaturedPostCard
                post={getFeaturedPost()}
                onView={handlePostView}
                onShare={handleShare}
                onBookmark={toggleBookmark}
                onLike={toggleLike}
                isBookmarked={bookmarkedPosts.has(getFeaturedPost().id)}
                isLiked={likedPosts.has(getFeaturedPost().id)}
              />
            </div>
          </section>
        )}

        {/* Blog Articles Grid */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            {filteredPosts.length > 0 ? (
              <>
                <motion.h2
                  className="text-3xl font-bold text-gray-900 mb-12 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  Latest Insights
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                  {getVisiblePosts().map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <BlogPostCard
                        post={post}
                        onView={handlePostView}
                        onShare={handleShare}
                        onBookmark={toggleBookmark}
                        onLike={toggleLike}
                        isBookmarked={bookmarkedPosts.has(post.id)}
                        isLiked={likedPosts.has(post.id)}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Load More Button */}
                {hasMorePosts && (
                  <div className="text-center">
                    <button
                      onClick={loadMorePosts}
                      disabled={isLoadingMore}
                      className="inline-flex items-center gap-3 px-8 py-4 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-[#AA7452] hover:bg-[#AA7452]/5 hover:text-[#7C5841] transition-all disabled:opacity-50"
                    >
                      {isLoadingMore ? (
                        <>
                          <div className="w-5 h-5 border-2 border-[#7C5841] border-t-transparent rounded-full animate-spin" />
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>
                          <span>Load More Articles</span>
                          <TrendingUp className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <BookOpen className="mx-auto mb-6 text-gray-400 w-16 h-16" />
                <h3 className="text-2xl font-bold text-gray-600 mb-4">No articles found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search terms or filters.</p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-[#7C5841] text-white font-semibold rounded-xl hover:bg-[#AA7452] transition-colors"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </div>
        </section>

        {/* Premium Newsletter Section */}
        <section className="relative py-16 bg-[#051822] overflow-hidden">
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#AA7452]/20 to-transparent"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </div>

          <div className="relative z-10 container mx-auto px-4">
            <motion.div
              className="bg-gradient-to-br from-[#2D383E] to-[#2D383E]/80 rounded-3xl p-8 lg:p-12 backdrop-blur-sm border border-white/10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#AA7452] rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      Stay Updated with Construction Insights
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      Get the latest articles, industry trends, and exclusive content 
                      delivered directly to your inbox. Join 10,000+ construction professionals.
                    </p>
                  </div>
                </div>

                <div>
                  <form className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        className="flex-1 px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#AA7452] focus:border-transparent backdrop-blur-sm"
                      />
                      <button
                        type="submit"
                        className="px-6 py-3 bg-[#AA7452] hover:bg-[#7C5841] text-white font-semibold rounded-xl transition-all transform hover:scale-105 flex items-center gap-2 justify-center"
                      >
                        <span>Subscribe</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 text-center sm:text-left">
                      No spam, unsubscribe at any time. 
                      <a href="#" className="text-[#AA7452] hover:underline ml-1">Privacy Policy</a>
                    </p>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

// Enhanced Featured Post Card Component
function FeaturedPostCard({
  post,
  onView,
  onShare,
  onBookmark,
  onLike,
  isBookmarked,
  isLiked,
}: {
  post: BlogPost;
  onView: (post: BlogPost) => void;
  onShare: (post: BlogPost) => void;
  onBookmark: (id: number) => void;
  onLike: (id: number) => void;
  isBookmarked: boolean;
  isLiked: boolean;
}) {
  return (
    <motion.div
      className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <div className="lg:flex">
        <div className="lg:w-3/5 relative">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 lg:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <div className="px-3 py-1 bg-[#AA7452] text-white text-sm font-semibold rounded-full">
              {post.category}
            </div>
            <button
              onClick={() => onBookmark(post.id)}
              className={`w-10 h-10 rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center transition-all ${
                isBookmarked 
                  ? 'bg-[#AA7452] text-white' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
          <div className="absolute bottom-4 left-4 flex items-center gap-3 text-white">
            <div className="flex items-center gap-1 px-3 py-1 bg-black/30 rounded-full backdrop-blur-sm">
              <Clock className="w-3 h-3" />
              <span className="text-xs">{post.readTime}</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-black/30 rounded-full backdrop-blur-sm">
              <Eye className="w-3 h-3" />
              <span className="text-xs">{post.views?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="lg:w-2/5 p-8 lg:p-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#AA7452] to-[#7C5841] rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">{post.author}</div>
                <div className="text-gray-500 text-xs flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(post.date).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h3>

          <p className="text-gray-600 mb-6 leading-relaxed text-lg">
            {post.excerpt}
          </p>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-3 py-1 bg-[#AA7452]/10 text-[#7C5841] text-sm font-medium rounded-full border border-[#AA7452]/20"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <button
                onClick={() => onLike(post.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  isLiked 
                    ? 'bg-red-50 text-red-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm font-medium">{post.likes}</span>
              </button>
              
              <button
                onClick={() => onShare(post)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-sm font-medium">Share</span>
              </button>
            </div>

            <button
              onClick={() => onView(post)}
              className="flex items-center gap-2 px-6 py-3 bg-[#7C5841] hover:bg-[#AA7452] text-white font-semibold rounded-xl transition-all transform hover:scale-105"
            >
              <span>Read Article</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Enhanced Blog Post Card Component
function BlogPostCard({
  post,
  onView,
  onShare,
  onBookmark,
  onLike,
  isBookmarked,
  isLiked,
}: {
  post: BlogPost;
  onView: (post: BlogPost) => void;
  onShare: (post: BlogPost) => void;
  onBookmark: (id: number) => void;
  onLike: (id: number) => void;
  isBookmarked: boolean;
  isLiked: boolean;
}) {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
      whileHover={{ y: -4 }}
    >
      <div className="relative">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <div className="px-2 py-1 bg-[#AA7452] text-white text-xs font-semibold rounded-full">
            {post.category}
          </div>
          <button
            onClick={() => onBookmark(post.id)}
            className={`w-8 h-8 rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center transition-all ${
              isBookmarked 
                ? 'bg-[#AA7452] text-white' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Bookmark className={`w-3 h-3 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
          <div className="flex items-center gap-1 px-2 py-1 bg-black/30 rounded-full backdrop-blur-sm">
            <Clock className="w-3 h-3" />
            <span className="text-xs">{post.readTime}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-black/30 rounded-full backdrop-blur-sm">
            <Eye className="w-3 h-3" />
            <span className="text-xs">{post.views?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-[#AA7452] to-[#7C5841] rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-medium text-gray-900 text-sm">{post.author}</div>
            <div className="text-gray-500 text-xs flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(post.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight line-clamp-2">
          {post.title}
        </h3>

        <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-2 py-1 bg-[#AA7452]/10 text-[#7C5841] text-xs font-medium rounded-lg border border-[#AA7452]/20"
              >
                <Tag className="w-2 h-2" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex gap-2">
            <button
              onClick={() => onLike(post.id)}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all ${
                isLiked 
                  ? 'bg-red-50 text-red-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-xs font-medium">{post.likes}</span>
            </button>
            
            <button
              onClick={() => onShare(post)}
              className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Share2 className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={() => onView(post)}
            className="flex items-center gap-1 px-4 py-2 bg-[#7C5841] hover:bg-[#AA7452] text-white text-sm font-semibold rounded-lg transition-all"
          >
            <span>Read</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
