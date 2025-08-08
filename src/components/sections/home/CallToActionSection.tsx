import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Building,
  Zap,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const projectTypes = [
  "Construction & Infrastructure",
  "Solar Energy Solutions",
  "Engineering Services",
  "Project Consultation",
  "Training & Development",
  "Other",
];

const quickStats = [
  {
    icon: Building,
    value: "150+",
    label: "Projects Completed",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Zap,
    value: "50MW+",
    label: "Solar Capacity Installed",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Users,
    value: "500+",
    label: "Satisfied Clients",
    color: "from-blue-500 to-cyan-500",
  },
];

export default function CallToActionSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectType: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, projectType: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after success
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        projectType: "",
        message: "",
      });
    }, 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
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

  const cardVariants = {
    hidden: { y: 100, opacity: 0, scale: 0.8 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <section className="relative py-20 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className={
            'absolute inset-0 bg-[url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="white" opacity="0.5"/><circle cx="25" cy="25" r="1" fill="white" opacity="0.3"/><circle cx="75" cy="75" r="1.5" fill="white" opacity="0.4"/></svg>\')] bg-repeat'
          }
        />
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full"
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-20 h-20 bg-white/5 rounded-full"
          animate={{
            y: [20, -20, 20],
            x: [10, -10, 10],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <span
              className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-6"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Ready to Start Building?
            </span>

            <h2
              className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Let's Transform Your{" "}
              <span className="text-yellow-300">Vision</span> Into Reality
            </h2>

            <p
              className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Join hundreds of satisfied clients who have trusted JD Marc
              Limited to deliver excellence in construction, engineering, and
              solar solutions across Africa.
            </p>
          </motion.div>

          {/* Quick stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            {quickStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl mb-4 shadow-lg`}
                >
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div
                  className="text-3xl font-bold text-white mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {stat.value}
                </div>
                <p
                  className="text-white/80"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Main card */}
          <motion.div variants={cardVariants} className="max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="grid lg:grid-cols-2">
                {/* Contact form */}
                <div className="p-8 md:p-12">
                  <h3
                    className="text-3xl font-bold text-white mb-6"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Start Your Project Today
                  </h3>

                  <p
                    className="text-white/80 mb-8"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Tell us about your project and we'll provide you with a
                    comprehensive consultation and proposal within 24 hours.
                  </p>

                  {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Input
                            type="text"
                            name="name"
                            placeholder="Your Name *"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/60 focus:border-white/50 cursor-text"
                          />
                        </div>
                        <div>
                          <Input
                            type="email"
                            name="email"
                            placeholder="Email Address *"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/60 focus:border-white/50 cursor-text"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/60 focus:border-white/50 cursor-text"
                          />
                        </div>
                        <div>
                          <Input
                            type="text"
                            name="company"
                            placeholder="Company/Organization"
                            value={formData.company}
                            onChange={handleInputChange}
                            className="bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/60 focus:border-white/50 cursor-text"
                          />
                        </div>
                      </div>

                      <div>
                        <Select
                          value={formData.projectType}
                          onValueChange={handleSelectChange}
                        >
                          <SelectTrigger className="bg-white/20 backdrop-blur-sm border-white/30 text-white cursor-button">
                            <SelectValue placeholder="Select Project Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {projectTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Textarea
                          name="message"
                          placeholder="Tell us about your project requirements..."
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={4}
                          className="bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/60 focus:border-white/50 resize-none cursor-text"
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full bg-white text-orange-600 hover:bg-white/90 font-semibold py-4 text-lg cursor-button"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center">
                            <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mr-2" />
                            Sending Message...
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Send className="mr-2 h-5 w-5" />
                            Send Message
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </div>
                        )}
                      </Button>
                    </form>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                        <CheckCircle className="h-10 w-10 text-white" />
                      </div>
                      <h4
                        className="text-2xl font-bold text-white mb-4"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        Message Sent Successfully!
                      </h4>
                      <p
                        className="text-white/80"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        Thank you for reaching out. We'll get back to you within
                        24 hours.
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Contact information */}
                <div className="bg-black/20 p-8 md:p-12 flex flex-col justify-center">
                  <h4
                    className="text-2xl font-bold text-white mb-8"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Get In Touch Directly
                  </h4>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Phone className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h5
                          className="text-lg font-semibold text-white mb-1"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          Call Us
                        </h5>
                        <p
                          className="text-white/80"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          +234-803-706-5497
                        </p>
                        <p
                          className="text-white/80"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          +234-805-555-0123
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Mail className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h5
                          className="text-lg font-semibold text-white mb-1"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          Email Us
                        </h5>
                        <p
                          className="text-white/80"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          info@jdmarcng.com
                        </p>
                        <p
                          className="text-white/80"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          projects@jdmarcng.com
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h5
                          className="text-lg font-semibold text-white mb-1"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          Visit Our Office
                        </h5>
                        <p
                          className="text-white/80"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          123 Construction Avenue
                          <br />
                          Victoria Island, Lagos
                          <br />
                          Nigeria
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h5
                          className="text-lg font-semibold text-white mb-1"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          Business Hours
                        </h5>
                        <p
                          className="text-white/80"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          Mon - Fri: 8:00 AM - 6:00 PM
                          <br />
                          Sat: 9:00 AM - 4:00 PM
                          <br />
                          Sun: Emergency Only
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/20">
                    <p
                      className="text-white/60 text-sm"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      🚀 Emergency projects? We're available 24/7 for urgent
                      consultations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
