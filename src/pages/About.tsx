import { useState } from "react";
import Layout from "@/components/layout/Layout";
import SplitSection from "@/components/ui/SplitSection";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { motion } from "framer-motion";
import { teamMembers, companyValues, certifications } from "@/data/team";
import {
  Award,
  CheckCircle,
  Leaf,
  Shield,
  Lightbulb,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const valueIcons = {
  award: <Award className="w-8 h-8" />,
  shield: <Shield className="w-8 h-8" />,
  leaf: <Leaf className="w-8 h-8" />,
  lightbulb: <Lightbulb className="w-8 h-8" />,
  "check-circle": <CheckCircle className="w-8 h-8" />,
  handshake: <Users className="w-8 h-8" />,
};

export default function About() {
  const [flippedCard, setFlippedCard] = useState<number | null>(null);

  const handleCardFlip = (id: number) => {
    setFlippedCard(flippedCard === id ? null : id);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About JD Marc Constructions
            </h1>
            <p className="text-xl text-white/80 mb-8">
              At JD Marc Constructions, we are redefining urban development with
              precision, sustainability, and forward-thinking design. With a
              legacy of delivering landmark projects, our team of engineers and
              visionaries is committed to shaping tomorrow's cities.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Company Story */}
      <SplitSection
        title="Our Story"
        subtitle="Global Expertise, UK Roots"
        content={
          <div className="space-y-4">
            <p>
              JD Marc Constructions began with a clear mission: to connect
              UK-based service excellence with the vast opportunities of
              emerging markets. Today, we've evolved into a fully international
              construction and development company — driving innovation,
              infrastructure, and strategic transformation across continents.
            </p>
            <h3 className="text-lg font-bold mt-6 mb-2">
              Building Global Partnerships That Drive Progress
            </h3>
            <p>
              With a foundation in the UK and a reach that now spans beyond
              borders, we partner with transportation firms, technology
              providers, investors, urban planners, and logistics experts
              worldwide. Our deep market insight and forward-thinking strategy
              empower our partners to navigate regulatory complexities,
              diversify from saturated regions, and unlock high-value
              opportunities in untapped global markets.
            </p>
            <h3 className="text-lg font-bold mt-6 mb-2">
              Infrastructure That Shapes Economies
            </h3>
            <p>
              JD Marc doesn't just build — we advise, strategize, and enable.
              Working closely with governments and institutions in developing
              regions, we structure impactful infrastructure projects that
              attract global financing, foster long-term development, and
              deliver sustainable results.
            </p>
          </div>
        }
        image="/images/about1.jpg"
        imageAlt="Skyline Construction team on a job site"
      />

      {/* Leadership Team */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Leadership Team
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meet the experienced professionals who guide our company's vision
              and ensure the successful delivery of every project.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.slice(0, 8).map((member, index) => (
              <AnimatedSection
                key={member.id}
                delay={index * 0.1}
                className="relative"
              >
                <div
                  className={cn(
                    "relative h-[400px] w-full rounded-xl perspective-1000",
                    flippedCard === member.id ? "z-10" : "",
                  )}
                >
                  <motion.div
                    className="w-full h-full transition-all duration-500 preserve-3d cursor-pointer"
                    style={{
                      rotateY: flippedCard === member.id ? 180 : 0,
                    }}
                    onClick={() => handleCardFlip(member.id)}
                  >
                    {/* Front of Card */}
                    <div className="absolute inset-0 backface-hidden">
                      <div className="h-full bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden">
                        <div className="h-64 overflow-hidden">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-1">
                            {member.name}
                          </h3>
                          <p className="text-accent">{member.title}</p>
                        </div>
                      </div>
                    </div>

                    {/* Back of Card */}
                    <div className="absolute inset-0 backface-hidden bg-white dark:bg-gray-700 rounded-xl shadow-md p-6 [transform:rotateY(180deg)]">
                      <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                      <p className="text-accent mb-4">{member.title}</p>
                      <p className="text-muted-foreground text-sm">
                        {member.bio}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These core principles guide our decisions, shape our culture, and
              define how we approach every project and relationship.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companyValues.map((value, index) => (
              <AnimatedSection
                key={value.id}
                delay={index * 0.1}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-accent mb-5">
                  {value.icon &&
                    valueIcons[value.icon as keyof typeof valueIcons]}
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Certifications
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We maintain the highest industry standards through rigorous
              certification and continuous professional development.
            </p>
          </AnimatedSection>

          <div className="flex flex-wrap justify-center gap-6">
            {certifications.map((cert, index) => (
              <AnimatedSection
                key={cert.id}
                delay={index * 0.15}
                className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-md flex flex-col items-center text-center w-64"
              >
                <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-4">
                  {cert.icon === "certificate" && <Award size={32} />}
                  {cert.icon === "award" && <Award size={32} />}
                  {cert.icon === "shield" && <Shield size={32} />}
                  {cert.icon === "building" && <Users size={32} />}
                </div>
                <h3 className="text-lg font-bold mb-2">{cert.name}</h3>
                <p className="text-muted-foreground text-sm">
                  {cert.description}
                </p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
