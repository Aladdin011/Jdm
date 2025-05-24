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
    title: "Residential Construction",
    shortDescription:
      "Custom homes and residential complexes built to the highest standards.",
    fullDescription:
      "From individual custom homes to multi-family residential complexes, our residential construction services cover every aspect of building your dream living space. We combine premium materials, innovative techniques, and meticulous craftsmanship to create homes that are beautiful, functional, and built to last generations.",
    icon: Home,
    image: "/images/service-residential.jpg",
    features: [
      "Custom home construction",
      "Multi-family residential complexes",
      "Luxury home development",
      "Sustainable residential buildings",
      "Energy-efficient home design",
    ],
  },
  {
    id: 2,
    title: "Commercial Buildings",
    shortDescription:
      "State-of-the-art commercial spaces designed for business success.",
    fullDescription:
      "Our commercial construction services deliver modern, functional spaces that drive business success. Whether you need office buildings, retail spaces, restaurants, hotels, or mixed-use developments, we handle every aspect of the project from conceptual design through final completion. Our commercial buildings are designed for efficiency, durability, and positive user experience.",
    icon: Building2,
    image: "/images/service-commercial.jpg",
    features: [
      "Office buildings and campuses",
      "Retail and restaurant spaces",
      "Hotels and hospitality venues",
      "Medical and healthcare facilities",
      "Industrial and warehouse structures",
    ],
  },
  {
    id: 3,
    title: "Infrastructure Projects",
    shortDescription:
      "Critical infrastructure built with precision, safety, and longevity in mind.",
    fullDescription:
      "Our infrastructure division specializes in building the critical systems that communities rely on. From roads and bridges to utilities and public works, we bring decades of experience to every infrastructure project. Our team excels at managing complex logistics, navigating regulatory requirements, and delivering durable solutions that serve the public for decades to come.",
    icon: Landmark,
    image: "/images/service-infrastructure.jpg",
    features: [
      "Roads, highways, and bridges",
      "Water and wastewater systems",
      "Power and utility infrastructure",
      "Public transportation facilities",
      "Municipal buildings and public spaces",
    ],
  },
  {
    id: 4,
    title: "Design & Planning",
    shortDescription:
      "Comprehensive design services to bring your vision to life.",
    fullDescription:
      "Our in-house design team works closely with clients to transform concepts into detailed plans. We offer comprehensive architectural design, 3D modeling, and project planning services that ensure your construction project perfectly aligns with your vision. Our collaborative approach emphasizes clear communication, innovative solutions, and attention to detail at every stage.",
    icon: PenTool,
    image: "/images/service-design.jpg",
    features: [
      "Architectural design",
      "3D modeling and visualization",
      "Site planning and development",
      "Interior design services",
      "Green building design",
    ],
  },
  {
    id: 5,
    title: "Renovations",
    shortDescription:
      "Transform existing structures with modern renovations and retrofits.",
    fullDescription:
      "Breathe new life into existing structures with our comprehensive renovation services. Whether you're looking to modernize an outdated building, expand your current space, or repurpose a property for a new use, our renovation experts deliver exceptional results while minimizing disruption. We specialize in both cosmetic updates and structural renovations that improve functionality, energy efficiency, and aesthetic appeal.",
    icon: Wrench,
    image: "/images/service-renovation.jpg",
    features: [
      "Commercial space renovations",
      "Home remodeling and additions",
      "Historic building restoration",
      "Energy-efficiency retrofits",
      "Facade improvements",
    ],
  },
  {
    id: 6,
    title: "Construction Management",
    shortDescription:
      "Expert oversight ensuring your project is completed on time and within budget.",
    fullDescription:
      "Our construction management services provide comprehensive oversight throughout the entire building process. We coordinate all aspects of your project, from initial planning through final completion, ensuring that work proceeds efficiently, safely, and according to specifications. Our experienced project managers serve as your advocates, maintaining quality control, managing subcontractors, and keeping you informed at every stage.",
    icon: HardHat,
    image: "/images/service-management.jpg",
    features: [
      "Complete project oversight",
      "Budget management and cost control",
      "Scheduling and timeline management",
      "Quality assurance and compliance",
      "Subcontractor coordination",
    ],
  },
];

export const serviceCategories = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "infrastructure", label: "Infrastructure" },
];
