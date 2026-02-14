
export interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  imageSrc: string;
  link: string;
}

export interface Experience {
  id: number;
  title: string;
  company: string;
  year: string;
  description: string;
}

export const portfolioData = {
  personal: {
    name: "Nabil",
    role: "Fullstack Developer",
    about: "Passionate Fullstack Developer with a knack for building scalable web applications and intuitive user interfaces. Experienced in modern JavaScript frameworks and cloud technologies.",
    email: "nabitathaillah33@gmail.com",
    github: "https://github.com/Kiritocroft",
    linkedin: "https://www.linkedin.com/in/nabil-athaillah",
    instagram: "https://www.instagram.com/kazutongl/",
    profilePicture: "/pp.jpg",
    cv: "/CV.pdf",
    logo: "/logo.png"
  },
  skills: [
    "React", "Next.js", "TypeScript", "Node.js", "TailwindCSS", "PostgreSQL", "MongoDB", "Docker", "AWS", "Git"
  ],
  experiences: [
    {
      id: 1,
      title: "Junior Web Developer - BNSP",
      company: "YPT - Digiup Bootcamp",
      year: "2024 - Present",
      description: "Developed a RESTful API integrated with the frontend. Collaborated with the Digiup team to build a website project presented to mentors from the Digiup Telkom Indonesia Foundation. Built a fullstack web application using the Django Framework."
    },
    {
      id: 2,
      title: "React Developer Apprentice",
      company: "Indosat Ooredoo Hutchison",
      year: "2022 - 2024",
      description: "Completed two modules from the Indosat Hooredo Bootcamp, developing both a React project and a portfolio project as part of the Coding Camp. Successfully graduated from the program."
    },
    {
      id: 3,
      title: "Frontend Web Developer",
      company: "DPC - Perempuan Indonesia maju Makassar",
      year: "2021 - 2022",
      description: "Designed the UI/UX for the Perempuan Indonesia Maju (PIM) Makassar website. Collaborated with the RT-ACADEMY team to develop a fullstack web application for PIM DPC Makassar. Proudly represented SMK Telkom Makassar at the Kartini Day Celebration Event at GCC Makassar."
    },
    {
      id: 4,
      title: "IT Operation - Intern",
      company: "PT Baruga Telkomsel - Sulawesi Selatan",
      year: "2026",
      description: "Monitoring and analyzing enterprise wireless network performance using Cisco Meraki, focusing on key parameters such as latency, packet loss, RSSI, and SNR to ensure optimal connectivity. Developed a web-based Dashboard and Heatmap simulation tool to assist the Marketing division in data summarization and Wi-Fi coverage visualization. Actively contributed to internal projects including the development of MySponsor.id and provided technical insights on IP Addressing and Subnetting."
    }
  ],
  projects: [
    {
      id: 1,
      title: "PIM - Perempuan Indonesia Maju",
      description: "I worked as a frontend developer on this startup project with my team for 6 month. Users can know about PIM.",
      techStack: ["Next.js", "React", "Tailwind", "Prisma", "Frame-Motion"],
      imageSrc: "/pim.png",
      link: "https://pim-makassar.vercel.app"
    }
  ],
  certificates: [
    {
      id: 1,
      title: "Junior Web Programmer",
      imageSrc: "/sertifikat1.jpg",
      description: "YPT - Digiup Bootcamp • 2023-11-28"
    },
    {
      id: 2,
      title: "Programmer Python",
      imageSrc: "/sertifikat2.jpg",
      description: "PT Telkom Prima Cipta Certif • 2023-11-23"
    },
    {
      id: 3,
      title: "Certificate of Participation",
      imageSrc: "/sertifikat3.png",
      description: "Dilesin Academy • 2024-12-17"
    },
    {
      id: 4,
      title: "Specialized Training",
      imageSrc: "/sertifikat4.png",
      description: "Professional Development • 2024"
    }
  ]
};
