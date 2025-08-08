import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    id: 1,
    title: "The Future of Sustainable Construction in Africa",
    excerpt:
      "Exploring innovative green building technologies and their impact on Africa's urban development landscape.",
    author: "Dr. Adebayo Ogundimu",
    date: "2024-01-15",
    readTime: "5 min read",
    category: "Sustainability",
    image:
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 240'><rect width='400' height='240' fill='%2384cc16'/><circle cx='150' cy='120' r='40' fill='%23ffffff' opacity='0.2'/><circle cx='250' cy='80' r='25' fill='%23ffffff' opacity='0.3'/><text x='200' y='130' text-anchor='middle' dy='.3em' fill='white' font-size='14' font-family='Arial'>Sustainable Building</text></svg>",
    featured: true,
  },
  {
    id: 2,
    title: "Solar Energy Revolution: Powering Nigeria's Growth",
    excerpt:
      "How solar installations are transforming energy access and reducing costs for businesses across Nigeria.",
    author: "Eng. Fatima Aliyu",
    date: "2024-01-12",
    readTime: "7 min read",
    category: "Solar Energy",
    image:
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 240'><rect width='400' height='240' fill='%23f59e0b'/><rect x='100' y='60' width='200' height='120' fill='%2306b6d4' opacity='0.3'/><circle cx='200' cy='50' r='20' fill='%23ffffff' opacity='0.8'/><text x='200' y='130' text-anchor='middle' dy='.3em' fill='white' font-size='14' font-family='Arial'>Solar Panels</text></svg>",
    featured: false,
  },
  {
    id: 3,
    title: "Infrastructure Development: Building Connected Communities",
    excerpt:
      "The role of modern infrastructure in connecting communities and driving economic growth across Africa.",
    author: "Prof. Kwame Asante",
    date: "2024-01-10",
    readTime: "6 min read",
    category: "Infrastructure",
    image:
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 240'><rect width='400' height='240' fill='%23ef4444'/><rect x='50' y='180' width='300' height='40' fill='%23ffffff' opacity='0.2'/><rect x='180' y='80' width='40' height='140' fill='%23ffffff' opacity='0.3'/><text x='200' y='130' text-anchor='middle' dy='.3em' fill='white' font-size='14' font-family='Arial'>Infrastructure</text></svg>",
    featured: false,
  },
];

const BlogCard = ({
  post,
  index,
  featured = false,
}: {
  post: (typeof blogPosts)[0];
  index: number;
  featured?: boolean;
}) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      className={`group cursor-text ${
        featured
          ? "lg:col-span-2 lg:row-span-2"
          : "bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
      }`}
    >
      {featured ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 h-full">
          <div className="relative h-64 lg:h-80 overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 cursor-image"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                <Tag className="inline h-3 w-3 mr-1" />
                {post.category}
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center space-x-4 text-white/80 text-sm mb-3">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(post.date).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {post.readTime}
                </div>
              </div>
            </div>
          </div>
          <div className="p-8">
            <h3
              className="text-2xl lg:text-3xl font-bold text-slate-800 dark:text-white mb-4 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {post.title}
            </h3>
            <p
              className="text-slate-600 dark:text-slate-300 mb-6 text-lg leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                  {post.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p
                    className="font-semibold text-slate-800 dark:text-white text-sm"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {post.author}
                  </p>
                  <p
                    className="text-slate-500 dark:text-slate-400 text-xs"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Expert Contributor
                  </p>
                </div>
              </div>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 cursor-button"
              >
                <Link to={`/blog/${post.id}`}>
                  Read More
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="relative h-48 overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 cursor-image"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute top-3 left-3">
              <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                <Tag className="inline h-3 w-3 mr-1" />
                {post.category}
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center space-x-4 text-slate-500 dark:text-slate-400 text-xs mb-3">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(post.date).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {post.readTime}
              </div>
            </div>
            <h3
              className="text-lg font-bold text-slate-800 dark:text-white mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {post.title}
            </h3>
            <p
              className="text-slate-600 dark:text-slate-300 mb-4 text-sm leading-relaxed line-clamp-3"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xs mr-2">
                  {post.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <p
                  className="font-semibold text-slate-700 dark:text-slate-300 text-xs"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {post.author}
                </p>
              </div>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 p-2 cursor-button"
              >
                <Link to={`/blog/${post.id}`}>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </>
      )}
    </motion.article>
  );
};

export default function BlogPreview() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <span
              className="inline-block px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm font-medium mb-6"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Latest Insights
            </span>

            <h2
              className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Knowledge & Innovation from{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                Industry Leaders
              </span>
            </h2>

            <p
              className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Stay informed with the latest trends, insights, and innovations in
              construction, engineering, and sustainable energy solutions across
              Africa.
            </p>
          </motion.div>

          {/* Blog grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Featured post */}
            <BlogCard post={blogPosts[0]} index={0} featured={true} />

            {/* Regular posts */}
            <div className="space-y-8">
              {blogPosts.slice(1).map((post, index) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  index={index + 1}
                  featured={false}
                />
              ))}
            </div>
          </div>

          {/* Call to action */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-3xl p-12 border border-orange-200/50 dark:border-orange-800/50">
              <User className="h-16 w-16 text-orange-500 mx-auto mb-6" />
              <h3
                className="text-3xl font-bold text-slate-800 dark:text-white mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Want to Contribute?
              </h3>
              <p
                className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Share your expertise and insights with the JD Marc community.
                We're always looking for industry experts to contribute valuable
                content.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg font-semibold rounded-full cursor-button"
                >
                  <Link to="/blog">
                    Read All Articles
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-orange-300 dark:border-orange-700 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 px-8 py-4 text-lg font-semibold rounded-full cursor-button"
                >
                  <Link to="/contact">Submit an Article</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
