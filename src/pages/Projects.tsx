import { useState } from "react";
import Layout from "@/components/layout/Layout";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { projects, projectCategories } from "@/data/projects";
import ProjectCard from "@/components/ui/ProjectCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProject, setSelectedProject] = useState<
    (typeof projects)[0] | null
  >(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredProjects =
    selectedCategory === "all"
      ? projects
      : projects.filter(
          (project) => project.category.toLowerCase() === selectedCategory,
        );

  const handleProjectClick = (projectId: number) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      setIsDialogOpen(true);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Projects
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Explore our portfolio of successful projects across residential,
              commercial, and infrastructure sectors, showcasing our expertise
              and commitment to quality.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Projects Gallery */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <AnimatedSection className="mb-12">
            <Tabs
              defaultValue="all"
              onValueChange={setSelectedCategory}
              className="w-full"
            >
              <div className="flex justify-center mb-8">
                <TabsList className="bg-gray-100 dark:bg-gray-800 p-1">
                  {projectCategories.map((category) => (
                    <TabsTrigger
                      key={category.value}
                      value={category.value}
                      className="px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                    >
                      {category.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {projectCategories.map((category) => (
                <TabsContent
                  key={category.value}
                  value={category.value}
                  className="mt-0"
                >
                  <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  >
                    {filteredProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <ProjectCard
                          id={project.id}
                          title={project.title}
                          category={project.category}
                          image={project.image}
                          onClick={() => handleProjectClick(project.id)}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </AnimatedSection>
        </div>
      </section>

      {/* Project Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          {selectedProject && (
            <>
              <div className="relative h-64 md:h-80 overflow-hidden">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <Badge className="bg-accent text-white mb-2">
                    {selectedProject.category}
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    {selectedProject.title}
                  </h2>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Location
                    </h3>
                    <p className="font-medium">{selectedProject.location}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Year
                    </h3>
                    <p className="font-medium">{selectedProject.year}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Value
                    </h3>
                    <p className="font-medium">{selectedProject.value}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-2">Project Overview</h3>
                  <p className="text-muted-foreground">
                    {selectedProject.description}
                  </p>
                </div>

                {selectedProject.testimonial && (
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
                    <blockquote className="italic text-muted-foreground">
                      "{selectedProject.testimonial.quote}"
                    </blockquote>
                    <p className="mt-2 font-medium text-sm">
                      — {selectedProject.testimonial.author}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold mb-3">Project Gallery</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedProject.images?.map((img, index) => (
                      <div
                        key={index}
                        className={cn(
                          "overflow-hidden rounded-md",
                          index === 0
                            ? "col-span-3 aspect-[21/9]"
                            : "aspect-square",
                        )}
                      >
                        <img
                          src={img}
                          alt={`${selectedProject.title} image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
