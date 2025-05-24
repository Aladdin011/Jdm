import { useState } from "react";
import Layout from "@/components/layout/Layout";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { blogPosts, blogCategories } from "@/data/blog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedPost, setExpandedPost] = useState<number | null>(null);

  const filteredPosts =
    selectedCategory === "all"
      ? blogPosts
      : blogPosts.filter(
          (post) =>
            post.category.toLowerCase() === selectedCategory.toLowerCase(),
        );

  const featuredPosts = blogPosts.filter((post) => post.featured);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Construction Insights
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Stay updated with the latest news, trends, and insights from the
              construction industry and our team of experts.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <AnimatedSection className="mb-12">
            <h2 className="text-3xl font-bold mb-8">Featured Articles</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredPosts.slice(0, 3).map((post, index) => (
                <AnimatedSection
                  key={post.id}
                  delay={index * 0.2}
                  direction="up"
                >
                  <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-accent text-white">
                          {post.category}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="line-clamp-2 text-xl">
                        {post.title}
                      </CardTitle>
                      <CardDescription>
                        {formatDistanceToNow(new Date(post.date), {
                          addSuffix: true,
                        })}{" "}
                        by {post.author.split(",")[0]}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-muted-foreground line-clamp-3">
                        {post.excerpt}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="ghost"
                        className="p-0 text-accent hover:text-accent/80 hover:bg-transparent"
                        onClick={() => setExpandedPost(post.id)}
                      >
                        Read More
                      </Button>
                    </CardFooter>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* All Blog Posts */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <AnimatedSection className="mb-12">
            <h2 className="text-3xl font-bold mb-8">All Articles</h2>

            <Tabs
              defaultValue="all"
              onValueChange={setSelectedCategory}
              className="w-full"
            >
              <div className="flex justify-center mb-12 overflow-x-auto pb-2">
                <TabsList className="bg-white dark:bg-gray-700 p-1">
                  {blogCategories.map((category) => (
                    <TabsTrigger
                      key={category.value}
                      value={category.value}
                      className="px-4 py-2 whitespace-nowrap"
                    >
                      {category.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {blogCategories.map((category) => (
                <TabsContent
                  key={category.value}
                  value={category.value}
                  className="mt-0"
                >
                  <motion.div layout className="grid grid-cols-1 gap-8">
                    {filteredPosts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/3 h-48 md:h-auto">
                              <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="md:w-2/3 p-6">
                              <Badge className="mb-3 bg-accent text-white">
                                {post.category}
                              </Badge>
                              <h3 className="text-xl font-bold mb-2">
                                {post.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-4">
                                {formatDistanceToNow(new Date(post.date), {
                                  addSuffix: true,
                                })}{" "}
                                by {post.author.split(",")[0]}
                              </p>
                              <p className="text-muted-foreground mb-4 line-clamp-3">
                                {post.excerpt}
                              </p>
                              <Button
                                variant="ghost"
                                className="p-0 text-accent hover:text-accent/80 hover:bg-transparent"
                                onClick={() => setExpandedPost(post.id)}
                              >
                                Read More
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </AnimatedSection>
        </div>
      </section>

      {/* Blog Post Modal */}
      {expandedPost && (
        <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto flex items-start justify-center p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-xl shadow-xl my-8">
            <div className="relative">
              <button
                onClick={() => setExpandedPost(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-700 rounded-full shadow-md z-10"
              >
                ✕
              </button>

              {(() => {
                const post = blogPosts.find((p) => p.id === expandedPost);
                if (!post) return null;

                return (
                  <>
                    <div className="h-64 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-8">
                      <Badge className="mb-3 bg-accent text-white">
                        {post.category}
                      </Badge>
                      <h2 className="text-2xl md:text-3xl font-bold mb-2">
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground mb-6">
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}{" "}
                        by {post.author}
                      </p>
                      <div
                        className="prose dark:prose-invert max-w-none mb-6"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      />
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
