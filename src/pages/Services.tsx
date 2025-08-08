import Layout from "@/components/layout/Layout";
import { services } from "@/data/services";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Services() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Services
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Comprehensive construction solutions tailored to your specific
              needs, delivered with expertise, quality, and attention to detail.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What We Offer
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From concept to completion, we provide a full range of
              construction services across residential, commercial, and
              infrastructure sectors.
            </p>
          </AnimatedSection>

          {/* Service Sections */}
          {services.map((service, index) => {
            const isEven = index % 2 === 0;

            return (
              <AnimatedSection
                key={service.id}
                direction={isEven ? "left" : "right"}
                className="mb-24 last:mb-0"
              >
                <div
                  className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-12 items-center`}
                >
                  {/* Image */}
                  <div className="w-full lg:w-1/2">
                    <div className="relative overflow-hidden rounded-xl shadow-lg aspect-[4/3]">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full lg:w-1/2">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-md bg-accent/10 text-accent flex items-center justify-center">
                        <service.icon size={24} />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold">
                        {service.title}
                      </h3>
                    </div>

                    <p className="text-muted-foreground mb-6">
                      {service.fullDescription}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle
                            className="text-accent mt-1 flex-shrink-0"
                            size={16}
                          />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      asChild
                      className="bg-accent hover:bg-accent/90 text-white"
                    >
                      <Link to="/contact">Request Service</Link>
                    </Button>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Process</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We follow a proven, systematic approach to ensure every project is
              completed to the highest standards of quality, on time, and within
              budget.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Consultation",
                description:
                  "We begin by understanding your vision, requirements, and goals for the project.",
              },
              {
                step: "02",
                title: "Planning & Design",
                description:
                  "Our experts develop detailed plans and designs tailored to your specific needs.",
              },
              {
                step: "03",
                title: "Construction",
                description:
                  "We execute the project with precision, using quality materials and skilled craftsmanship.",
              },
              {
                step: "04",
                title: "Completion & Handover",
                description:
                  "After thorough quality checks, we deliver your project on time and to specification.",
              },
            ].map((item, index) => (
              <AnimatedSection
                key={item.step}
                delay={index * 0.2}
                className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-md"
              >
                <div className="text-5xl font-bold text-accent/20 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Contact us today to discuss your construction needs and discover
              how Skyline Construction can bring your vision to life.
            </p>
            <Button
              asChild
              className="bg-accent hover:bg-accent/90 text-white text-lg px-8 py-6"
            >
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
