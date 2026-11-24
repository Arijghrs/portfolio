export const PROFILE = {
  name: 'Arij Gharsalli', first: 'Arij', role: 'Software Engineer', location: 'Ariana, Tunisia',
  email: 'arijgharsalli8@gmail.com', phone: '+216 95203001', phoneHref: 'tel:+21695203001',
  github: 'https://github.com/Arijghrs', linkedin: 'https://www.linkedin.com/in/gharsalli-arij-a841b01bb',
  resume: '/resume.pdf', validTill: '2025',
  summary: 'Motivated Software Engineer with a strong foundation in software development, problem-solving, and system design. Experienced in building web applications, developing backend solutions, working with databases, writing Python scripts, and implementing automation and testing practices. Adaptable to different technologies and committed to developing efficient, scalable, and reliable software solutions throughout the software development lifecycle.',
  languages: 'Arabic (native) · English (fluent) · French (fluent)',
}
export const NAV = [['about', 'About'], ['skills', 'Skills'], ['work', 'Work'], ['experience', 'Experience'], ['contact', 'Contact']] as const

export const SKILL_GROUPS: { family: string; items: string[] }[] = [
  { family: 'Languages', items: ['Python', 'SQL', 'JavaScript', 'TypeScript'] },
  { family: 'Data', items: ['Excel', 'Data Processing', 'Data Validation', 'Data Quality', 'Metrics Extraction'] },
  { family: 'Monitoring', items: ['Grafana', 'Prometheus', 'KPI Monitoring', 'Data Visualization', 'Power BI'] },
  { family: 'Databases', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Firebase'] },
  { family: 'DevOps', items: ['Docker', 'Jenkins', 'Nexus', 'CI/CD Pipelines'] },
  { family: 'Testing', items: ['Selenium', 'Postman', 'Jest', 'Functional Testing', 'Automated Testing'] },
  { family: 'Tools', items: ['Git', 'GitHub', 'CVS', 'RedHat Linux'] },
  { family: 'Design', items: ['Figma'] },
]

export const EXPERIENCE = [
  {
    id: 'b2b', year: '2026', title: 'B2B Business Developer', place: 'SIMIGO, freelance · (Remote)',
    points: ['Contributed to the B2B development of Simigo, a global eSIM platform providing mobile data connectivity. Focused on identifying and approaching potential business partners, prospecting travel agencies, presenting the platform s solutions, and exploring strategic partnerships to expand its B2B network and market reach'],
    tech: ['B2B Sales', 'Market Research', 'Client Communication', 'Partnership Management', ]
  },
  {
    id: 'rl', year: '2026', title: 'AI Quality Analyst & Reinforcement Learning', place: 'Anthropic, UK · (Remote)',
    points: ['Worked on AI quality evaluation and reinforcement learning tasks, assessing and improving AI model responses through structured feedback, prompt evaluation, and output validation. Focused on identifying inaccuracies, inconsistencies, and behavioral issues to help enhance AI systems reliability, relevance, and overall response quality.'],
    tech: ['Python', 'XML', 'Data Processing', 'Data Validation', 'Data Quality Analysis', 'LLMs', 'Prompt Engineering']
  },
  {
    id: 'cap', year: '2025', title: 'test automation and DevOps', place: 'Capgemini · Ariana, Tunisia · ',
    points: ['Developed a test automation and monitoring solution during my internship at Capgemini, focusing on automating test validation using Python scripts and integrating DevOps tools into the CI/CD workflow. The project involved Jenkins pipeline automation, Docker-based monitoring, Prometheus metrics collection, Grafana dashboards, and Alertmanager notifications to improve system reliability and testing efficiency.'],
    tech: ['Python', 'Excel', 'Prometheus', 'Grafana', 'Jenkins', 'Nexus', 'Docker', 'Data Validation', 'Metrics Extraction', 'Data Visualization']
  },
  {
    id: 'apaia', year: 'Summer 2024', title: 'Backend Developer', place: 'APAIA Technology · Paris, France (Remote)',
    points: ['Developed the backend of a recruitment management platform during my summer internship at APAIA Technology. Using Python and Django, I implemented authentication, role-based access control, and RESTful APIs to manage candidates, companies, job offers, and applications. The project also involved PostgreSQL database design, business logic validation and API testing with Postman.'],
    tech: ['Python', 'Django', 'Django REST Framework', 'PostgreSQL', 'Django ORM', 'Docker', 'Git', 'Postman', 'Pytest']
  },
  {
    id: 'vast', year: 'Summer 2023', title: 'Full Stack Developer', place: 'Vastsky · Nabeul, Tunisia ',
    points: ['Contributed to the development of an interactive eLearning platform during my summer internship at Vastsky. Using the MERN stack, I worked on frontend and backend features, implemented interactive quizzes and chatbot functionality, and performed manual and automated testing with Jest and Selenium to identify bugs, improve application stability, and ensure software quality.'],
    tech: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Jest', 'Selenium', 'Postman']
  },
  {
    id: 'team', year: '2022', title: 'Mobile Application Developer', place: 'TeamDev · Sousse, Tunisia · Bachelor’s final-year project',
    points: ['Designed and developed a mobile application as my Bachelor s final-year project at TeamDev, enabling parents to monitor their children s location and health data in real time. Built the application using Flutter and Firebase, integrated an Arduino-powered IoT smart bracelet for health data collection, and implemented safety features such as SOS alerts and abnormal heart rate notifications. Also created UI/UX designs and prototypes using Figma.'],
    tech: ['Flutter', 'Firebase', 'Arduino', 'IoT', 'Figma', 'Real-Time Database']
  },
]
export const EDUCATION = [
  { year: '2022 – 2025', title: 'Software Engineering', place: 'Private Higher School of Technologies & Engineering (TEK-UP)' },
  { year: '2019 – 2022', title: 'Bachelor’s degree in Computer Engineering', place: 'Institute of Computer Science, Mahdia (ISIMA)' },
  { year: '2018 – 2019', title: 'Baccalaureate in Mathematics', place: 'Abou Elkassem Elchebbi High School' },
]
/* Work panels are built from the résumé's product-style entries (no separate projects section exists).
export const PROJECTS = [
  
  { id: 'apaia', title: 'Recruitment Platform', kicker: 'APAIA Technology', description: 'A recruitment management platform allowing candidates to discover job opportunities, manage their profiles, and submit applications, while companies publish and manage job offers.', features: ['Role-based access control', 'REST APIs (DRF)', 'Duplicate-application rules', 'Docker Compose setup'] },
  { id: 'vast', title: 'eLearning Platform', kicker: 'Vastsky', description: 'An interactive eLearning platform built on the MERN stack, delivering educational content and user interactions.', features: ['Quizzes', 'Chatbot assistant', 'Jest & Selenium tests', 'Frontend + backend features'] },
  { id: 'team', title: 'Child Monitoring App', kicker: 'TeamDev', description: 'A mobile application for parents to monitor their child’s location and health data in real time, connected to an IoT smart bracelet.', features: ['Real-time location & health', 'SOS alerts', 'Abnormal heart-rate alerts', 'Firebase sync'] },
  { id: 'cap', title: 'Test Metrics Pipeline', kicker: 'Capgemini', description: 'Automation that imports Excel test cases, validates them, extracts execution metrics, and visualizes them for continuous monitoring.', features: ['Prometheus metrics', 'Grafana dashboards', 'Email notifications', 'Jenkins + Nexus + Docker'] },
  { id: 'coffee', title: 'Cofee shop Platform', kicker: 'freelance', description: 'A recruitment management platform allowing candidates to discover job opportunities, manage their profiles, and submit applications, while companies publish and manage job offers.', features: ['Role-based access control', 'REST APIs (DRF)', 'Duplicate-application rules', 'Docker Compose setup'] },
  { id: 'coffee', title: 'Cofee shop Platform', kicker: 'freelance', description: 'A recruitment management platform allowing candidates to discover job opportunities, manage their profiles, and submit applications, while companies publish and manage job offers.', features: ['Role-based access control', 'REST APIs (DRF)', 'Duplicate-application rules', 'Docker Compose setup'] },
]*/

// Replace ONLY the PROJECTS array in ./lib/data with this one.
// Frontend projects: image + url (live site), shown as picture cards.
// Backend projects: github link only, shown as open/close cards.

export const PROJECTS = [
  /* ───────────── Backend ───────────── */
  {
    id: 'offer-your-skill',
    category: 'other',
    title: 'Offer Your Skill',
    kicker: 'Personal Project',
    description: 'A freelance opportunity platform designed to connect people who need a service with freelancers looking to showcase their skills. Users can freely publish, discover, and manage freelance opportunities, communicate through messaging, and stay updated with notifications.',
    features: [
      'User authentication and account management',
      'Create, read, update, and delete freelance offers and requests',
      'Messaging between users',
      'Real-time or in-app notifications',
      'Free access to freelance opportunities'
    ],
    github: 'https://github.com/Arijghrs'
  },
  {
    id: 'task-floww',
    category: 'other',
    title: 'Task Floww',
    kicker: 'academic project',
    description: 'A web-based HR management platform designed to streamline employee management and daily organizational workflows. it provides an intuitive interface for managing HR operations, organizing tasks, and improving team collaboration through a responsive frontend and a structured backend.',
    features: [
      'Employee and HR management',
      'Task and workflow organization',
      'Responsive user interface',
      'RESTful API integration'
    ],
    github: 'https://github.com/Arijghrs/taskflowHR'
  },

  {
    id: 'team',
    category: 'other',
    title: 'Child Monitoring App',
    kicker: 'academic project',
    description: 'A mobile application for parents to monitor their child\'s location and health data in real time, connected to an IoT smart bracelet.',
    features: [
      'Real-time location & health',
      'SOS alerts',
      'Abnormal heart-rate alerts',
      'Firebase sync'
    ],
    github: 'https://github.com/Arijghrs/PROTECT'
  },
  {
    id: 'Real Estate Marketplace',
    category: 'other',
    title: 'Real Estate Marketplace',
    kicker: 'personal project',
    description: 'A real estate marketplace designed to connect property owners, agents, and potential buyers or tenants. Users can explore property listings, discover houses and apartments, and publish or manage their own offers. The platform provides an intuitive browsing experience with detailed property information, making it easier to find and advertise real estate.',
    features: [
      'JWT-based user authentication and authorization',
      'Redux state management',
      'Dynamic property search and filtering',
      'RESTful API integration',
      'CRUD operations for property listings',
      'Responsive frontend architecture'
    ],
    github: 'https://github.com/Arijghrs/projet-mern-Real-Estate-Marketplace-'
  },

  /* ───────────── Frontend ───────────── */
  {
    id: 'coffee',
    category: 'frontend',
    title: 'Coffee Shop Platform',
    kicker: 'personal project',
    description: 'A modern coffee shop website designed to showcase products and create an elegant online experience for coffee lovers.',
    features: [
      'Responsive design',
      'Product showcase',
      'Interactive UI',
      'Modern visual experience'
    ],
    tools: ['Vite', 'React', 'TypeScript', 'Tailwind CSS', 'Three.js'],
    image: '/projects/coffee.PNG',
    url: 'https://benyedder-bean-to-cup-journey.vercel.app/'
  },
  {
    id: 'maison-vert',
    category: 'frontend',
    title: 'maison-vert',
    kicker: 'personal project',
    description: 'An online plant store designed to showcase and sell plants, combining product discovery with a clean shopping experience.',
    features: [
      'Responsive layout',
      'Product presentation',
      'Clean UI',
      'Frontend development'
    ],
    tools: ['React', 'Tailwind CSS', 'Vite', 'Figma'],
    image: '/projects/vrt.PNG',
    url: 'https://maison-vert-pduz.vercel.app/'
  },
  {
    id: 'mello',
    category: 'frontend',
    title: 'Skincare Platform',
    kicker: 'Freelance',
    description: 'A modern skincare website designed to showcase products and create an elegant online shopping experience.',
    features: [
      'Responsive design',
      'Product showcase',
      'Interactive UI',
      'Modern visual experience'
    ],
    tools: ['Vite', 'React', 'TypeScript', 'Tailwind CSS'],
    image: '/projects/mllo.PNG',
    url: 'https://rhode-tint-studio.vercel.app/'
  },
  {
    id: 'ozaye',
    category: 'frontend',
    title: 'Money Transfer Platform',
    kicker: 'Freelance',
    description: 'A clean and trustworthy interface for a money transfer platform, built to make sending money simple.',
    features: [
      'Responsive design',
      'Clear transfer flow',
      'Interactive UI',
      'Modern visual experience'
    ],
    tools: ['javascript', 'CSS', 'html', 'Figma'],
    image: '/projects/ozaye.PNG',
    url: 'https://quiet-jelly-f28fe6.netlify.app/'
  },
  {
    id: 'alo-match',
    category: 'frontend',
    title: 'Football Application UI/UX',
    kicker: 'internship project',
    description: 'A sports application concept that helps users organize matches, connect with other players, and discover nearby stadiums.',
    features: [
      'Responsive design',
      'Match showcase',
      'Interactive UI',
      'Modern visual experience'
    ],
    tools: ['Figma', 'UI/UX Design', 'react native', 'springboot'],
    image: '/projects/figma.PNG',
    url: 'https://www.figma.com/design/CINqB73U0Qrbm33nhiivRP/Untitled?node-id=0-1&m=dev&t=OX5Q2rEWP8zpBIgo-1'
  },
  {
    id: 'cudi',
    category: 'frontend',
    title: 'CUDI',
    kicker: 'Freelance',
    description: 'digital marketplace allowing users to discover and purchase digital products such as images, books, music albums, and online courses. It also includes a PDF editor, offering a seamless and user-friendly digital experience.',
    features: [
      'Responsive design',
      'Product showcase',
      'Interactive UI',
      'Modern visual experience'
    ],
    tools: ['React', 'Tailwind CSS', 'Vite', 'Figma'],
    image: '/projects/Capture1.PNG',
    url: 'https://drive.google.com/file/d/1hdNRdOdCTZOeaboThEJthiP5PFpV2o_k/view?usp=sharing'
  }
]

