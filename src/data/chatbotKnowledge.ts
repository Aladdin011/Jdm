export interface ChatResponse {
  keywords: string[];
  response: string;
  followUp?: string[];
}

export const chatbotKnowledge: ChatResponse[] = [
  {
    keywords: [
      "services",
      "what do you offer",
      "what services",
      "capabilities",
    ],
    response:
      "JD Marc offers three main service areas: 🏗️ **Total Construction** (residential, commercial, industrial), 🏙️ **Urban Planning & Smart Cities** (GIS mapping, BIM technology), and 🌍 **Global Procurement** (international sourcing, equipment logistics). We specialize in building Africa's future cities!",
    followUp: [
      "Would you like details about a specific service?",
      "Can I help you request a project quote?",
    ],
  },
  {
    keywords: ["office", "location", "address", "where are you", "contact"],
    response:
      "JD Marc has offices in three locations: 📍 **Nigeria HQ:** Plot 107, Ahmadu Bello Way, Abuja | 📍 **UK Office:** 71-75 Shelton Street, London WC2H 9RQ | 📍 **USA Office:** 125 Park Avenue, New York, NY 10017",
    followUp: [
      "Would you like specific contact details for any office?",
      "Need directions to our nearest location?",
    ],
  },
  {
    keywords: ["quote", "estimate", "project cost", "price", "how much"],
    response:
      "I'd be happy to help you get a project quote! 💼 For accurate pricing, we'll need to understand your project requirements. Please share: project type, location, timeline, and scope. You can also contact us directly at info@jdmarcng.com or call +234 (0)8037 065497.",
    followUp: [
      "What type of project are you planning?",
      "Would you like me to connect you with our project team?",
    ],
  },
  {
    keywords: [
      "projects",
      "portfolio",
      "recent work",
      "examples",
      "case studies",
    ],
    response:
      "We're proud of our diverse portfolio! 🚧 Recent highlights include: **330KVA Power Upgrade** in Onitsha, **Rigid Pavement Road Construction** in Rivers State, **Port Harcourt Airport Hotel Renovation**, and the **Lagos Smart City Pilot Project**. Each project showcases our commitment to quality and innovation.",
    followUp: [
      "Want to see more project details?",
      "Interested in a similar project type?",
    ],
  },
  {
    keywords: ["about", "company", "who are you", "history", "experience"],
    response:
      "JD Marc is a leading Pan-African engineering and infrastructure company founded in 2007! 🌍 Based in Nigeria with global reach, we've been building Africa's future cities for over 15 years. Led by CEO Jude Onwudebe and CTO Engr. Donatus Oduopara, we combine local expertise with international standards.",
    followUp: [
      "Learn more about our leadership team?",
      "Interested in our company values?",
    ],
  },
  {
    keywords: ["team", "leadership", "staff", "employees", "who works"],
    response:
      "Our expert team includes: 👨‍💼 **Jude Onwudebe** (CEO), 👨‍🔧 **Engr. Donatus Oduopara** (CTO), and **James Abel** (Project Director). We have specialized departments in Business Development, Project Management, Accounting, HR, and Digital Marketing.",
    followUp: [
      "Want to connect with a specific department?",
      "Interested in career opportunities?",
    ],
  },
  {
    keywords: [
      "careers",
      "jobs",
      "hiring",
      "work",
      "employment",
      "opportunities",
    ],
    response:
      "We're always looking for talented professionals! 💼 JD Marc offers opportunities in engineering, project management, business development, and more. We value innovation, quality, and professional growth. Contact our HR department at info@jdmarcng.com for current openings.",
    followUp: [
      "What field are you interested in?",
      "Would you like to submit your CV?",
    ],
  },
  {
    keywords: ["smart cities", "technology", "innovation", "BIM", "GIS"],
    response:
      "JD Marc is at the forefront of smart city development! 🏙️ We use cutting-edge technologies like **BIM (Building Information Modeling)**, **GIS mapping**, and **IoT infrastructure** to create sustainable, connected urban environments. Our Lagos Smart City Pilot Project is a prime example.",
    followUp: [
      "Interested in smart city solutions?",
      "Want to discuss urban planning needs?",
    ],
  },
  {
    keywords: ["contact", "reach out", "get in touch", "phone", "email"],
    response:
      "Get in touch with us! 📞 **Nigeria:** +234 (0)8037 065497 | 📧 **Email:** info@jdmarcng.com | 🌐 **Website:** www.jdmarcng.com | We also have UK (+44 7760954844) and USA offices. We'd love to discuss your project!",
    followUp: [
      "Which office would you prefer to contact?",
      "Ready to schedule a consultation?",
    ],
  },
  {
    keywords: [
      "hello",
      "hi",
      "hey",
      "good morning",
      "good afternoon",
      "good evening",
    ],
    response:
      "Hello! 👋 Welcome to JD Marc - your partner in building Africa's future cities! I'm here to help you learn about our construction, urban planning, and procurement services. How can I assist you today?",
    followUp: [
      "Tell me about your services",
      "I need a project quote",
      "Where are your offices?",
    ],
  },
];

export const defaultResponse =
  "Thank you for your question! 🤔 I'd love to help you learn more about JD Marc. You can ask me about our services, projects, locations, or request a quote. For specific inquiries, please contact us at info@jdmarcng.com or call +234 (0)8037 065497.";

export const welcomeMessage =
  "Hi there! 👋 How can I assist you with JD Marc today?";

export function findBestResponse(userMessage: string): ChatResponse {
  const lowerMessage = userMessage.toLowerCase();

  for (const knowledge of chatbotKnowledge) {
    for (const keyword of knowledge.keywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        return knowledge;
      }
    }
  }

  return {
    keywords: [],
    response: defaultResponse,
    followUp: [
      "What services do you offer?",
      "Where are your offices?",
      "Can I get a project quote?",
    ],
  };
}
