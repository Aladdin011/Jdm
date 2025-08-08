import {
  Building2,
  MapPin,
  Globe,
  Wrench,
  Lightbulb,
  Layers,
} from "lucide-react";

export const services = [
  {
    id: 1,
    title: "Total Construction",
    shortDescription:
      "Comprehensive construction solutions from residential to industrial projects.",
    fullDescription:
      "JD Marc delivers end-to-end construction services across all sectors. From residential and commercial buildings to industrial facilities, we provide turnkey EPC (Engineering, Procurement, and Construction) delivery that meets international standards while addressing Africa's unique infrastructure needs.",
    icon: Building2,
    image: "/images/service1.jpg",
    features: [
      "Residential, commercial, and industrial buildings",
      "Roads, bridges, and utilities infrastructure",
      "Turnkey EPC delivery solutions",
      "Quality assurance and project management",
      "Sustainable construction practices",
    ],
  },
  {
    id: 2,
    title: "Urban Planning & Smart Cities",
    shortDescription:
      "Digital city planning and smart infrastructure solutions for modern Africa.",
    fullDescription:
      "Leveraging cutting-edge technology including GIS, BIM, and GPR scanning, we design smart, sustainable urban environments. Our urban planning expertise combines international best practices with local African realities to create cities that are resilient, efficient, and environmentally responsible.",
    icon: MapPin,
    image: "/images/service2.jpg",
    features: [
      "GIS + BIM digital city planning",
      "GPR scanning for underground mapping",
      "Smart, eco-friendly infrastructure design",
      "Urban regeneration and development",
      "Climate-resilient city solutions",
    ],
  },
  {
    id: 3,
    title: "Global Procurement",
    shortDescription:
      "International sourcing and logistics for construction materials and equipment.",
    fullDescription:
      "With our global network spanning Nigeria, UK, and USA, we provide comprehensive procurement services for construction materials and equipment. Our international sourcing capabilities ensure access to the latest technology and materials while maintaining cost-effectiveness for African projects.",
    icon: Globe,
    image: "/images/service3.jpg",
    features: [
      "International sourcing of construction materials",
      "Equipment logistics and technical imports",
      "Supply chain optimization",
      "Quality verification and compliance",
      "Cost-effective global procurement",
    ],
  },
];

export const serviceCategories = [
  { value: "construction", label: "Total Construction" },
  { value: "urban-planning", label: "Urban Planning" },
  { value: "procurement", label: "Global Procurement" },
];
