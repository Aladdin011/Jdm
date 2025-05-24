export const projects = [
  {
    id: 1,
    title: "Skyline Tower Residences",
    category: "Residential",
    location: "New York, NY",
    year: 2022,
    description:
      "A luxury residential tower featuring 45 stories with panoramic city views. This project showcases our commitment to combining elegant design with cutting-edge sustainable technology.",
    client: "Skyview Development Group",
    value: "$85 million",
    duration: "30 months",
    image: "/images/project-skyline-tower.jpg",
    images: [
      "/images/project-skyline-tower-1.jpg",
      "/images/project-skyline-tower-2.jpg",
      "/images/project-skyline-tower-3.jpg",
    ],
    testimonial: {
      quote:
        "Skyline Construction exceeded our expectations at every turn. Their attention to detail and commitment to quality is evident throughout the entire building.",
      author: "Jane Smith, CEO of Skyview Development Group",
    },
    featured: true,
  },
  {
    id: 2,
    title: "Metro Business Center",
    category: "Commercial",
    location: "Chicago, IL",
    year: 2021,
    description:
      "A state-of-the-art office complex spanning 125,000 sq ft with LEED Gold certification. This project features flexible workspace configurations, advanced environmental systems, and premium amenities.",
    client: "Urban Workspace Solutions",
    value: "$62 million",
    duration: "24 months",
    image: "/images/project-metro-business.jpg",
    images: [
      "/images/project-metro-business-1.jpg",
      "/images/project-metro-business-2.jpg",
      "/images/project-metro-business-3.jpg",
    ],
    testimonial: {
      quote:
        "Working with Skyline Construction was a seamless experience from start to finish. They delivered our project on time and within budget without compromising on quality.",
      author: "Robert Johnson, President of Urban Workspace Solutions",
    },
    featured: true,
  },
  {
    id: 3,
    title: "Riverside Bridge Replacement",
    category: "Infrastructure",
    location: "Portland, OR",
    year: 2023,
    description:
      "A critical infrastructure project replacing an aging bridge with a modern, earthquake-resistant structure. The project was completed ahead of schedule while maintaining traffic flow throughout construction.",
    client: "Portland Department of Transportation",
    value: "$95 million",
    duration: "36 months",
    image: "/images/project-riverside-bridge.jpg",
    images: [
      "/images/project-riverside-bridge-1.jpg",
      "/images/project-riverside-bridge-2.jpg",
      "/images/project-riverside-bridge-3.jpg",
    ],
    testimonial: {
      quote:
        "The Skyline team navigated the complexities of this project with remarkable expertise. Their innovative solutions saved both time and resources.",
      author: "Michael Williams, Director of Infrastructure, Portland DOT",
    },
    featured: true,
  },
  {
    id: 4,
    title: "Oceanview Luxury Homes",
    category: "Residential",
    location: "Miami, FL",
    year: 2022,
    description:
      "A collection of 12 premium beachfront homes featuring contemporary design, smart home technology, and hurricane-resistant construction.",
    client: "Coastal Living Developments",
    value: "$42 million",
    duration: "18 months",
    image: "/images/project-oceanview.jpg",
    images: [
      "/images/project-oceanview-1.jpg",
      "/images/project-oceanview-2.jpg",
      "/images/project-oceanview-3.jpg",
    ],
    testimonial: {
      quote:
        "The craftsmanship and attention to detail in these homes is exceptional. Skyline Construction truly understands luxury residential construction.",
      author: "Sarah Thompson, Coastal Living Developments",
    },
    featured: false,
  },
  {
    id: 5,
    title: "Central Shopping District",
    category: "Commercial",
    location: "Dallas, TX",
    year: 2021,
    description:
      "A mixed-use retail development spanning 200,000 sq ft, featuring 45 retail spaces, restaurants, and entertainment venues with a central plaza and underground parking.",
    client: "Retail Innovation Partners",
    value: "$78 million",
    duration: "28 months",
    image: "/images/project-central-shopping.jpg",
    images: [
      "/images/project-central-shopping-1.jpg",
      "/images/project-central-shopping-2.jpg",
      "/images/project-central-shopping-3.jpg",
    ],
    testimonial: {
      quote:
        "Skyline Construction translated our vision into reality with precision and professionalism. The project has become a landmark in the city.",
      author: "David Chen, Managing Partner at Retail Innovation Partners",
    },
    featured: false,
  },
  {
    id: 6,
    title: "Mountain View Hospital",
    category: "Commercial",
    location: "Denver, CO",
    year: 2023,
    description:
      "A 350,000 sq ft medical facility featuring advanced healthcare technology, patient-centered design, and sustainable building practices. The project includes specialized departments, surgical suites, and healing gardens.",
    client: "Western Healthcare Systems",
    value: "$120 million",
    duration: "36 months",
    image: "/images/project-mountain-hospital.jpg",
    images: [
      "/images/project-mountain-hospital-1.jpg",
      "/images/project-mountain-hospital-2.jpg",
      "/images/project-mountain-hospital-3.jpg",
    ],
    testimonial: {
      quote:
        "The Skyline team understood the unique requirements of healthcare construction and delivered a facility that enhances patient care and staff efficiency.",
      author: "Dr. Elizabeth Taylor, CEO of Western Healthcare Systems",
    },
    featured: true,
  },
  {
    id: 7,
    title: "Urban Transit Hub",
    category: "Infrastructure",
    location: "Seattle, WA",
    year: 2022,
    description:
      "A multi-modal transportation center connecting light rail, bus lines, and bicycle infrastructure. The project features sustainable design elements and public art installations.",
    client: "Seattle Metropolitan Transit Authority",
    value: "$65 million",
    duration: "24 months",
    image: "/images/project-transit-hub.jpg",
    images: [
      "/images/project-transit-hub-1.jpg",
      "/images/project-transit-hub-2.jpg",
      "/images/project-transit-hub-3.jpg",
    ],
    testimonial: {
      quote:
        "Skyline Construction's ability to coordinate complex systems while maintaining aesthetic quality made this project a success for our city.",
      author: "James Wilson, Director of Transit Development, Seattle MTA",
    },
    featured: false,
  },
  {
    id: 8,
    title: "Hillside Terraces Apartments",
    category: "Residential",
    location: "San Francisco, CA",
    year: 2021,
    description:
      "A 180-unit apartment complex featuring terraced design that maximizes views and natural light. The project includes community amenities, green roofs, and energy-efficient systems.",
    client: "Pacific Urban Living",
    value: "$55 million",
    duration: "22 months",
    image: "/images/project-hillside-terraces.jpg",
    images: [
      "/images/project-hillside-terraces-1.jpg",
      "/images/project-hillside-terraces-2.jpg",
      "/images/project-hillside-terraces-3.jpg",
    ],
    testimonial: {
      quote:
        "Skyline Construction navigated the challenges of our hillside site masterfully. The result is a beautiful residential community that harmonizes with the surrounding landscape.",
      author: "Laura Martinez, Development Director at Pacific Urban Living",
    },
    featured: false,
  },
];

export const projectCategories = [
  { value: "all", label: "All Projects" },
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "infrastructure", label: "Infrastructure" },
];
