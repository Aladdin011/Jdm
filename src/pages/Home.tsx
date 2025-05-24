import Layout from "@/components/layout/Layout";
import Hero from "@/components/sections/home/Hero";
import ServicesSnapshot from "@/components/sections/home/ServicesSnapshot";
import WhyChooseUs from "@/components/sections/home/WhyChooseUs";
import FeaturedProjects from "@/components/sections/home/FeaturedProjects";

export default function Home() {
  return (
    <Layout>
      <Hero />
      <ServicesSnapshot />
      <WhyChooseUs />
      <FeaturedProjects />
    </Layout>
  );
}
