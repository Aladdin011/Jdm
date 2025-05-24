import {
  Building2,
  Home,
  Landmark,
  PenTool,
  Wrench,
  HardHat,
} from "lucide-react";

export const services = [
  {
    id: 1,
    title: "Structural Engineering",
    shortDescription: "Delivering durable, modern structural frameworks.",
    fullDescription:
      "Our structural engineering team ensures that every project is built on a solid foundation with impeccable integrity. We combine innovative design approaches with time-tested engineering principles to create structures that stand the test of time while accommodating modern needs and aesthetics.",
    icon: Building2,
    image: "/images/service1.jpg",
    features: [
      "Advanced structural analysis",
      "Seismic-resistant design",
      "Load-bearing optimization",
      "Sustainable material selection",
      "Structural reinforcement solutions",
    ],
  },
  {
    id: 2,
    title: "Project Management",
    shortDescription: "End-to-end execution with transparent timelines.",
    fullDescription:
      "Our project management services provide comprehensive oversight from planning through completion. We maintain clear communication channels, transparent progress reporting, and meticulous attention to both schedule and budget constraints to deliver exceptional results while eliminating surprises.",
    icon: HardHat,
    image: "/images/service2.jpg",
    features: [
      "Timeline development and tracking",
      "Resource allocation and management",
      "Budget control and forecasting",
      "Risk assessment and mitigation",
      "Stakeholder communication",
    ],
  },
  {
    id: 3,
    title: "Urban Design Consulting",
    shortDescription: "Smart planning for smart cities.",
    fullDescription:
      "Our urban design team works at the intersection of architecture, planning, and technology to create spaces that enhance community life. We consider all aspects of urban development from transportation and utilities to aesthetics and environmental impact to create sustainable, livable urban environments.",
    icon: Landmark,
    image: "/images/service3.jpg",
    features: [
      "Master planning and development",
      "Transportation integration",
      "Public space optimization",
      "Infrastructure planning",
      "Smart city technology implementation",
    ],
  },
  {
    id: 4,
    title: "Interior Renovation",
    shortDescription: "Transforming interiors with precision and flair.",
    fullDescription:
      "Our interior renovation services breathe new life into existing spaces. Whether modernizing outdated facilities, optimizing functional layouts, or creating entirely new environments within existing structures, our team delivers transformative results that maximize both aesthetic appeal and practical functionality.",
    icon: Wrench,
    image: "/images/service2.jpg",
    features: [
      "Space planning and optimization",
      "Material selection and sourcing",
      "Custom built-in elements",
      "Lighting design and implementation",
      "Finish selection and installation",
    ],
  },
];

export const serviceCategories = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "infrastructure", label: "Infrastructure" },
];
