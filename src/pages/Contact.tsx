import { useState } from "react";
import Layout from "@/components/layout/Layout";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, CheckCircle, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Contact() {
  const [formStatus, setFormStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [fileName, setFileName] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");

    // Simulate form submission
    setTimeout(() => {
      setFormStatus("success");
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName(null);
    }
  };

  const offices = [
    {
      name: "Nigeria (Headquarters)",
      address: "Plot 107, Ahmadu Bello Way, Abuja",
      phone: "+234 (0)8037 065497",
      email: "info@jdmarcng.com",
      website: "www.jdmarcng.com",
      hours: "Monday - Friday: 8:00 AM - 6:00 PM",
      description: "Main operations and project management center",
    },
    {
      name: "United Kingdom",
      address: "71-75 Shelton Street, London WC2H 9RQ",
      phone: "+44 (0)7760954844",
      email: "info@jdmarc.co.uk",
      website: "www.jdmarc.co.uk",
      hours: "Monday - Friday: 9:00 AM - 5:00 PM GMT",
      description: "International partnerships and technology hub",
    },
    {
      name: "United States",
      address: "125 Park Avenue, New York, NY 10017",
      phone: "+1 (212) 456-7890",
      email: "usa@jdmarc.com",
      website: "Coming Soon",
      hours: "Monday - Friday: 9:00 AM - 5:00 PM EST",
      description: "Global procurement and investment operations",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-white/80 mb-8">
              Ready to build Africa's future together? Connect with JD Marc
              Construction across our global offices and discover how we can
              bring your infrastructure vision to life.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Global Offices */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Global Offices
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              With offices across three continents, JD Marc brings international
              expertise to African infrastructure challenges.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <AnimatedSection
                key={office.name}
                delay={index * 0.2}
                className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg"
              >
                <h3 className="text-xl font-bold mb-4 text-accent">
                  {office.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {office.description}
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin
                      className="text-accent mt-1 flex-shrink-0"
                      size={18}
                    />
                    <span className="text-sm">{office.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="text-accent flex-shrink-0" size={18} />
                    <a
                      href={`tel:${office.phone.replace(/\s/g, "")}`}
                      className="text-sm hover:text-accent transition-colors"
                    >
                      {office.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="text-accent flex-shrink-0" size={18} />
                    <a
                      href={`mailto:${office.email}`}
                      className="text-sm hover:text-accent transition-colors"
                    >
                      {office.email}
                    </a>
                  </div>
                  {office.website !== "Coming Soon" && (
                    <div className="flex items-center gap-3">
                      <Globe className="text-accent flex-shrink-0" size={18} />
                      <a
                        href={`https://${office.website}`}
                        className="text-sm hover:text-accent transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {office.website}
                      </a>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <Clock
                      className="text-accent mt-1 flex-shrink-0"
                      size={18}
                    />
                    <span className="text-sm">{office.hours}</span>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Start Your Project
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Tell us about your construction or infrastructure project. Our
                team will get back to you within 24 hours to discuss how we can
                help bring your vision to life.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
                {formStatus === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-8 rounded-lg flex flex-col items-center gap-4"
                  >
                    <CheckCircle className="h-12 w-12" />
                    <div className="text-center">
                      <h3 className="font-bold text-2xl mb-2">
                        Message Sent Successfully!
                      </h3>
                      <p className="text-lg">
                        Thank you for contacting JD Marc. Our team will review
                        your project details and get back to you within 24
                        hours.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Contact Information */}
                    <div>
                      <h3 className="text-xl font-semibold mb-6">
                        Contact Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            placeholder="Your full name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your.email@company.com"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            placeholder="+234 803 000 0000"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">Company/Organization</Label>
                          <Input id="company" placeholder="Your company name" />
                        </div>
                      </div>
                    </div>

                    {/* Project Information */}
                    <div>
                      <h3 className="text-xl font-semibold mb-6">
                        Project Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                          <Label htmlFor="project-type">Project Type</Label>
                          <Select>
                            <SelectTrigger id="project-type">
                              <SelectValue placeholder="Select project type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="total-construction">
                                Total Construction
                              </SelectItem>
                              <SelectItem value="urban-planning">
                                Urban Planning & Smart Cities
                              </SelectItem>
                              <SelectItem value="procurement">
                                Global Procurement
                              </SelectItem>
                              <SelectItem value="infrastructure">
                                Infrastructure Development
                              </SelectItem>
                              <SelectItem value="consultation">
                                Consultation Services
                              </SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Project Location</Label>
                          <Input
                            id="location"
                            placeholder="City, State/Country"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Project Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Please describe your project requirements, timeline, and any specific needs..."
                          rows={6}
                          required
                        />
                      </div>
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                      <Label htmlFor="file">
                        Attach Project Documents (Optional)
                      </Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        Upload sketches, blueprints, or project specifications
                        (PDF, JPG, PNG - Max 10MB)
                      </p>
                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document.getElementById("file")?.click()
                          }
                          className="text-muted-foreground"
                        >
                          Choose Files
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          {fileName ? fileName : "No files chosen"}
                        </span>
                        <input
                          id="file"
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept=".pdf,.jpg,.jpeg,.png"
                          multiple
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        className={cn(
                          "bg-accent hover:bg-accent/90 text-white w-full md:w-auto px-8 py-3 text-lg",
                          formStatus === "submitting" &&
                            "opacity-80 cursor-not-allowed",
                        )}
                        disabled={formStatus === "submitting"}
                      >
                        {formStatus === "submitting" ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Submitting...
                          </>
                        ) : (
                          "Send Project Inquiry"
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Map Section - Nigeria HQ */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <h2 className="text-2xl font-bold mb-8 text-center">
              Visit Our Nigeria Headquarters
            </h2>
            <div className="h-96 rounded-xl overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3939.665479486816!2d7.491302314770478!3d9.084792393498456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0ba9f4f1c5c7%3A0x4a4b5b4b5b4b5b4b!2sAhmadu%20Bello%20Way%2C%20Abuja%2C%20Nigeria!5e0!3m2!1sen!2sus!4v1611344619302!5m2!1sen!2sus"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                allowFullScreen
                aria-hidden="false"
                tabIndex={0}
                title="JD Marc Nigeria Office Location"
              ></iframe>
            </div>
            <div className="text-center mt-4 text-muted-foreground">
              <p>Plot 107, Ahmadu Bello Way, Abuja, Nigeria</p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
