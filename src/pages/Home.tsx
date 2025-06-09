import Layout from "@/components/layout/Layout";
import Hero from "@/components/sections/home/Hero";
import ServicesSnapshot from "@/components/sections/home/ServicesSnapshot";
import WhyChooseUs from "@/components/sections/home/WhyChooseUs";
import FeaturedProjects from "@/components/sections/home/FeaturedProjects";

export default function Home() {
  return (
    <Layout>
      <section id="hero">
        <Hero />
      </section>
      <section id="services">
        <ServicesSnapshot />
      </section>
      <section id="about">
        <WhyChooseUs />
      </section>
      <section id="projects">
        <FeaturedProjects />
      </section>
      <section id="contact">
        {/* Contact section can be added here or redirect to contact page */}
        <div className="bg-gradient-to-r from-primary to-secondary py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-blue-100 mb-8">
              Get in touch with our expert team today
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Contact Us Today
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
