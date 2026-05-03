/** Deep-cloneable default site content (merged with IndexedDB on load). */

export const PROJECT_TYPES = ['Website', 'Desktop Application', 'Presentation', 'Others'];

export const SKILL_ICONS = ['plane', 'map', 'code', 'chart', 'tools', 'spark', 'palette'];

export const defaultSiteData = {
  personal: {
    name: 'Ghada Abdo Abo Obia',
    shortName: 'Ghada Abo Obia',
    title: 'Aviation & Information Systems · Full Stack .NET Developer Trainee',
    tagline:
      'Final-year student bridging air navigation, CNS technologies, and full-stack software engineering.',
    location: 'Mogawra 47, 10th of Ramadan, Egypt',
    phone: '+20 1020135691',
    email: 'ghadaaboobia@gmail.com',
    linkedin: 'https://www.linkedin.com/in/ghada-abo-obia-140b3831b/',
    github: null,
    profilePhotoId: null,
    heroIllustrationId: null,
    heroImage: null,
    heroIllustration: null,
    cvFileId: null,
    qrCodeId: null,
    awardBadgeLabel: 'DEPI',
    awardBadgeLine: 'Best Project Award · 2025',
    heroEyebrow: 'Portfolio · Aviation × Technology',
    heroCtaPrimary: 'View My Work',
    heroCtaSecondary: "Let's Connect",
    heroCvButtonLabel: 'Download CV',
    contactLead:
      'Open to aviation-tech roles, GIS-adjacent engineering, and full-stack opportunities where clarity and craft matter.',
    profileImageUrl: null,
    heroIllustrationUrl: null,
    cvUrl: null,
    qrCodeUrl: null,
    profileImageDataUrl: null,
    heroIllustrationDataUrl: null,
    cvDataUrl: null,
    qrCodeDataUrl: null,
    cvFileName: 'CV.pdf',
  },
  about: {
    sectionImageUrl: null,
    sectionImageDataUrl: null,
    paragraphs: [
      `A motivated and multidisciplinary final-year student at Zagazig National University, pursuing a Bachelor's degree in Aviation and Information Systems – Computer Science (GPA: 3.823). I am deeply passionate about Air Navigation Services, Air Traffic Control Systems, and the full spectrum of Communication, Navigation, and Surveillance (CNS) technologies that underpin modern aviation safety.`,
      `I bring a solid technical foundation in software development, GIS, and data management, combined with hands-on exposure to ATC operations, NAVAIDs, and surveillance systems acquired during my internship at the National Air Navigation Services Company (NANSC).`,
      `I am eager to contribute to aviation technology environments – particularly in air navigation services, CNS systems, and flight operations – where I can apply both my aviation knowledge and technical skills to enhance safety and operational efficiency.`,
    ],
    highlights: [
      { id: 'h1', label: 'GPA', value: '3.823' },
      { id: 'h2', label: 'Program', value: 'Aviation & Information Systems' },
      { id: 'h3', label: 'University', value: 'Zagazig National University' },
      { id: 'h4', label: 'Status', value: 'Final-year student' },
    ],
  },
  education: [
    {
      id: 'edu-1',
      title: 'Bachelor of Aviation and Information Systems – Computer Science',
      org: 'Zagazig National University · 10th of Ramadan, Egypt',
      period: 'Sep 2022 – Jun 2026 (Expected)',
      description: [
        'GPA: 3.823 · Final-year student.',
        'Aviation-related coursework: Principles of Flight 1 & 2 · Air Law 1 & 2 · Air Navigation · Aviation Meteorology 1 & 2 · Air Traffic Control System · Instrument Systems · Communication, Navigation & Surveillance Systems (CNS) · Flight Operations · Aviation Information Systems · Airports · Safety Management Systems (SMS) · Aviation Medicine.',
      ],
    },
    {
      id: 'edu-2',
      title: 'Menoufia STEM School',
      org: 'Egypt',
      period: 'Sep 2019 – Jul 2022',
      description: ['Graduated from Menofia STEM School.'],
    },
  ],
  experience: [
    {
      id: 'exp-1',
      title: 'Full Stack .NET Web Developer Trainee',
      org: 'Digital Egypt Pioneers Program (DEPI) – Ministry of Communications and Information Technology · Egypt',
      period: 'Started Jun 2025',
      description: [
        'Completed an intensive 8-month training program in full-stack web development, covering front-end and back-end technologies within the .NET ecosystem.',
        'Worked on real-world projects using .NET technologies, applying software engineering principles to build scalable and maintainable web applications.',
        'Achieved the Best Project Award with my team in recognition of outstanding performance and innovation throughout the program.',
      ],
    },
    {
      id: 'exp-2',
      title: 'Intern',
      org: 'National Air Navigation Services Company (NANSC) – Ministry of Civil Aviation, Egypt',
      period: 'Jan 2025',
      description: [
        'Practical knowledge of Voice Communication Systems used in air-ground and ground-ground communication for aviation safety.',
        'Studied Navigation Aids (NAVAIDs) including VOR, DME, and ILS — aircraft routing and precision landing.',
        'Introduction to Air Traffic Control (ATC) operations: tower, approach, and en-route control services.',
        'Explored satellite communication and surveillance systems, including ADS-B and radar, for tracking and monitoring aircraft.',
      ],
    },
    {
      id: 'exp-3',
      title: 'Practical Training',
      org: 'BEDO – The Egyptian Company for Developing Education Technologies, Egypt',
      period: '2023',
      description: [
        'Hands-on training focused on educational technologies and electronic systems.',
        'Practical experience with smart classroom tools and interactive learning platforms.',
      ],
    },
  ],
  skillGroups: [
    {
      id: 'sg-1',
      title: 'Aviation Knowledge',
      icon: 'plane',
      items: [
        'Air Navigation Basics',
        'ATC Systems',
        'CNS Systems (Communication, Navigation & Surveillance)',
        'NAVAIDs (VOR, DME, ILS)',
        'ADS-B & Radar Surveillance',
        'Voice Communication Systems',
      ],
    },
    {
      id: 'sg-2',
      title: 'GIS & Geospatial Tools',
      icon: 'map',
      items: [
        'ArcGIS Pro',
        'ArcGIS Online',
        'Spatial Analysis',
        'Raster Functions',
        'Change Detection',
      ],
    },
    {
      id: 'sg-3',
      title: 'Programming Languages',
      icon: 'code',
      items: ['Python', 'SQL', 'HTML', 'C++', 'JavaScript', 'Full Stack .NET'],
    },
    {
      id: 'sg-4',
      title: 'Data & Visualization',
      icon: 'chart',
      items: ['Power BI', 'Excel'],
    },
    {
      id: 'sg-5',
      title: 'Development Tools',
      icon: 'tools',
      items: ['VS Code', 'Microsoft Office Suite', 'Cursor', 'Claude'],
    },
    {
      id: 'sg-6',
      title: 'Soft Skills',
      icon: 'spark',
      items: [
        'Management & Accountability',
        'Problem Solving & Critical Thinking',
        'Adaptability & Willingness to Learn',
        'Documentation & Communication',
        'Effective Time Management',
        'Resilience & Patience',
        'Attention to Detail',
      ],
    },
  ],
  courses: [
    {
      id: 'c-1',
      title: 'Python for Everyone',
      provider: 'Esri',
      date: 'May 2025',
      points: [
        'Foundational Python with a focus on GIS data analysis using Esri platforms.',
        'Covered syntax, variables, loops, and real-world problem-solving using code.',
      ],
    },
    {
      id: 'c-2',
      title: 'Getting Started with Data Management',
      provider: 'Esri',
      date: 'May 2025',
      points: [
        'Organizing, storing, and managing geospatial data in ArcGIS.',
        'Data structure, metadata, file management, and efficient GIS workflows.',
      ],
    },
    {
      id: 'c-3',
      title: 'ArcGIS Lab – Performing Change Detection Using Raster Functions',
      provider: 'Esri',
      date: 'May 2025',
      points: [
        'Raster functions in ArcGIS Pro to detect and analyze geographic change over time.',
        'Environmental and land-use applications.',
      ],
    },
    {
      id: 'c-4',
      title: 'Getting Started with GIS',
      provider: 'Esri',
      date: 'May 2025',
      points: [
        'Fundamentals of GIS, spatial data concepts, map creation, and analysis with ArcGIS tools.',
      ],
    },
    {
      id: 'c-5',
      title: 'ArcGIS Online Basics',
      provider: 'Esri',
      date: 'Jun 2025',
      points: [
        'Creating, sharing, and analyzing geographic content in ArcGIS Online.',
        'Web maps, layers, symbology, and cloud-based spatial publishing.',
      ],
    },
    {
      id: 'c-6',
      title: 'Getting Started with Spatial Analysis',
      provider: 'Esri',
      date: 'Jun 2025',
      points: [
        'Spatial analysis techniques and visual reports / statistical charts in ArcGIS Pro.',
      ],
    },
    {
      id: 'c-7',
      title: 'Fundamentals of Digital Marketing – Google Digital Garage',
      provider: 'IAB Europe & The Open University',
      date: 'Aug 2019',
      points: [
        'Completed the certification exam in collaboration with IAB Europe and The Open University.',
      ],
    },
  ],
  projects: [
    {
      id: 'depi-dotnet',
      title: 'Full Stack .NET Web Application',
      description:
        'Award-winning full-stack work from DEPI — real-world .NET projects with a focus on scalable, maintainable applications.',
      projectType: 'Website',
      image: '/project-dotnet.svg',
      coverImageId: null,
      tech: ['.NET', 'C#', 'SQL', 'REST APIs', 'Software Engineering'],
      demoUrl: null,
      codeUrl: null,
      badge: 'Best Project Award · DEPI 2025',
      files: [],
    },
    {
      id: 'gis-analysis',
      title: 'GIS Data Analysis & Change Detection',
      description:
        'Geospatial workflows in ArcGIS Pro: Python, raster functions, spatial analysis, and environmental / land-use insights.',
      projectType: 'Desktop Application',
      image: '/project-gis.svg',
      coverImageId: null,
      tech: ['ArcGIS Pro', 'Python', 'Raster Analysis', 'Spatial Reporting'],
      demoUrl: null,
      codeUrl: null,
      badge: null,
      files: [],
    },
    {
      id: 'aviation-cns',
      title: 'Aviation CNS Knowledge Hub',
      description:
        'Concept project organizing ATC, NAVAIDs, and surveillance fundamentals — portfolio front-end for clear technical storytelling.',
      projectType: 'Website',
      image: '/project-aviation.svg',
      coverImageId: null,
      tech: ['React', 'JavaScript', 'UI Design', 'Information Architecture'],
      demoUrl: null,
      codeUrl: null,
      badge: 'Portfolio Concept',
      files: [],
    },
  ],
  certificates: [
    { id: 'cert-0', title: 'Digital Egypt Pioneers Program – Full Stack .NET Web Developer', provider: 'MCIT', date: '2025', note: '', imageId: null },
    { id: 'cert-1', title: 'Best Project Award – DEPI Program', provider: 'Ministry of Communications and Information Technology', date: '2025', note: '', imageId: null },
    { id: 'cert-2', title: 'Business English Track – Digital Egypt Pioneers Program, Round 3', provider: 'DEPI', date: '2025', note: '', imageId: null },
    { id: 'cert-3', title: 'Academic Excellence Award', provider: 'Zagazig National University', date: 'Mar 2025', note: '', imageId: null },
    { id: 'cert-4', title: 'Completed GIS Basics', provider: 'Esri · 2 hrs 35 mins', date: 'May 2025', note: '', imageId: null },
    { id: 'cert-5', title: 'Completed Getting Started with GIS', provider: 'Esri · 3 hrs 30 mins', date: 'May 2025', note: '', imageId: null },
    { id: 'cert-6', title: 'Completed Python for Everyone', provider: 'Esri · 4 hrs 15 mins', date: 'May 2025', note: '', imageId: null },
    { id: 'cert-7', title: 'Completed ArcGIS Lab: Working with Charts and Reports in ArcGIS Pro', provider: 'Esri · 4 hrs', date: 'May 2025', note: '', imageId: null },
    { id: 'cert-8', title: 'Intern Certificate', provider: 'BEDO Company for Electronics', date: 'May 2023', note: '', imageId: null },
    { id: 'cert-9', title: 'Art Recognition – Best Sketch Award', provider: 'TEDxYouth@STEM Obour', date: '2021', note: '', imageId: null },
    { id: 'cert-10', title: 'Certificate of Appreciation – Mental Health Awareness Campaign', provider: 'Nafsy Organization', date: 'Dec 2021', note: '', imageId: null },
    { id: 'cert-11', title: 'Premium Award – Best Member', provider: 'Vega Zag Club', date: 'Dec 2020', note: '', imageId: null },
    { id: 'cert-12', title: 'Participant – Kangaroo Science Competition', provider: 'Kangaroo Science Competition', date: '2020', note: '', imageId: null },
    { id: 'cert-13', title: 'Certificate of Appreciation – Ignite Obour STEM', provider: 'Recognized for active participation and outstanding effort', date: '2020', note: '', imageId: null },
    { id: 'cert-14', title: 'Leadership Role – Vice Principal of Students’ Union', provider: 'STEM School Menofia', date: '2019/2020', note: '', imageId: null },
    { id: 'cert-15', title: 'Certificate of Achievement – Fundamentals of Digital Marketing', provider: 'Google Digital Garage with IAB Europe & The Open University', date: 'Aug 2019', note: '', imageId: null },
  ],
  achievements: [
    {
      id: 'ach-1',
      title: 'Best Project Award',
      org: 'Digital Egypt Pioneers Program (DEPI)',
      date: '2025',
      detail: 'Outstanding performance and innovation with team.',
    },
    {
      id: 'ach-2',
      title: 'Academic Excellence Award',
      org: 'Zagazig National University',
      date: 'Mar 2025',
      detail: '',
    },
  ],
  navLinks: [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'education', label: 'Education' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'courses', label: 'Courses' },
    { id: 'certificates', label: 'Certificates' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'contact', label: 'Contact' },
  ],
};

export function cloneDefaultSiteData() {
  return JSON.parse(JSON.stringify(defaultSiteData));
}
