export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface Skill {
  name: string;
  category: 'Languages' | 'Frameworks' | 'AI/ML' | 'Data Science' | 'Databases' | 'DevOps' | 'Tools';
  proficiency: number; // 0-100
  icon: string;
}

export interface Education {
  degree: string;
  university: string;
  cgpa: string;
  coursework: string[];
  timeline: string;
}

export interface Project {
  title: string;
  description: string;
  longDescription: string;
  techStack: string[];
  githubLink?: string;
  liveLink?: string;
  image?: string;
  category: string;
  featured: boolean;
}

export interface Certification {
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  link?: string;
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  description: string[];
  techUsed: string[];
}

export interface Contact {
  email: string;
  phone?: string;
  location: string;
  socials: SocialLink[];
  availability: 'Available' | 'Open to offers' | 'Unavailable';
}

export interface PortfolioData {
  personal: {
    name: string;
    title: string;
    tagline: string;
    bio: string;
    location: string;
    avatar: string;
    socials: SocialLink[];
  };
  skills: Skill[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
  experience: Experience[];
  contact: Contact;
}

export const PORTFOLIO_DATA: PortfolioData = {
  personal: {
    name: '[YOUR_NAME]',
    title: 'B.Tech CSE - AI & Data Science',
    tagline: 'Building intelligent solutions for complex problems',
    bio: 'I am a passionate software engineer specializing in AI and Data Science. With a strong foundation in full-stack development and machine learning, I create scalable applications that solve real-world challenges. I enjoy exploring new technologies and contributing to open-source projects.',
    location: '[YOUR_LOCATION]',
    avatar: '/assets/avatar-placeholder.png',
    socials: [
      { platform: 'GitHub', url: 'https://github.com/[YOUR_USERNAME]', icon: 'github' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/[YOUR_USERNAME]', icon: 'linkedin' },
      { platform: 'Twitter', url: 'https://twitter.com/[YOUR_USERNAME]', icon: 'twitter' },
      { platform: 'Email', url: 'mailto:[YOUR_EMAIL]', icon: 'mail' },
    ],
  },
  skills: [
    // Languages
    { name: 'Python', category: 'Languages', proficiency: 90, icon: 'python' },
    { name: 'JavaScript', category: 'Languages', proficiency: 85, icon: 'javascript' },
    { name: 'TypeScript', category: 'Languages', proficiency: 80, icon: 'typescript' },
    { name: 'Java', category: 'Languages', proficiency: 75, icon: 'java' },
    { name: 'C++', category: 'Languages', proficiency: 70, icon: 'cpp' },
    // Frameworks
    { name: 'React', category: 'Frameworks', proficiency: 85, icon: 'react' },
    { name: 'Next.js', category: 'Frameworks', proficiency: 80, icon: 'nextjs' },
    { name: 'Node.js', category: 'Frameworks', proficiency: 75, icon: 'nodejs' },
    { name: 'Django', category: 'Frameworks', proficiency: 70, icon: 'django' },
    { name: 'FastAPI', category: 'Frameworks', proficiency: 85, icon: 'fastapi' },
    // AI/ML
    { name: 'TensorFlow', category: 'AI/ML', proficiency: 75, icon: 'tensorflow' },
    { name: 'PyTorch', category: 'AI/ML', proficiency: 70, icon: 'pytorch' },
    { name: 'Scikit-learn', category: 'AI/ML', proficiency: 80, icon: 'scikit-learn' },
    { name: 'OpenCV', category: 'AI/ML', proficiency: 65, icon: 'opencv' },
    // Data Science
    { name: 'Pandas', category: 'Data Science', proficiency: 85, icon: 'pandas' },
    { name: 'NumPy', category: 'Data Science', proficiency: 85, icon: 'numpy' },
    { name: 'Matplotlib', category: 'Data Science', proficiency: 75, icon: 'matplotlib' },
    // Databases
    { name: 'PostgreSQL', category: 'Databases', proficiency: 80, icon: 'postgresql' },
    { name: 'MongoDB', category: 'Databases', proficiency: 75, icon: 'mongodb' },
    { name: 'Redis', category: 'Databases', proficiency: 60, icon: 'redis' },
    // DevOps
    { name: 'Docker', category: 'DevOps', proficiency: 70, icon: 'docker' },
    { name: 'Kubernetes', category: 'DevOps', proficiency: 50, icon: 'kubernetes' },
    { name: 'Git', category: 'DevOps', proficiency: 90, icon: 'git' },
    { name: 'AWS', category: 'DevOps', proficiency: 60, icon: 'aws' },
    // Tools
    { name: 'VS Code', category: 'Tools', proficiency: 95, icon: 'vscode' },
    { name: 'Figma', category: 'Tools', proficiency: 65, icon: 'figma' },
    { name: 'Postman', category: 'Tools', proficiency: 80, icon: 'postman' },
  ],
  education: [
    {
      degree: 'B.Tech in Computer Science & Engineering (AI & Data Science)',
      university: '[YOUR_UNIVERSITY]',
      cgpa: '[YOUR_CGPA]',
      coursework: [
        'Data Structures & Algorithms',
        'Operating Systems',
        'Database Management Systems',
        'Machine Learning',
        'Deep Learning',
        'Computer Networks',
        'Cloud Computing',
      ],
      timeline: '2020 - 2024',
    },
  ],
  projects: [
    {
      title: 'AI Portfolio OS',
      description: 'A web-based operating system interface for showcasing portfolio content.',
      longDescription:
        'Developed a comprehensive React-based operating system simulation that serves as an interactive portfolio. Features include a window management system, taskbar, start menu, and fully functional applications including a terminal, file explorer, and settings manager. Implemented using TypeScript, Tailwind CSS, and Zustand for state management.',
      techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Zustand', 'Vite'],
      githubLink: 'https://github.com/[YOUR_USERNAME]/portfolio-os',
      liveLink: 'https://[YOUR_USERNAME].github.io/portfolio-os',
      image: '/assets/projects/portfolio-os.png',
      category: 'Web Development',
      featured: true,
    },
    {
      title: 'Neural Style Transfer App',
      description: 'Application that applies artistic styles to images using deep learning.',
      longDescription:
        'Built a web application that uses a pre-trained VGG19 network to perform neural style transfer. Users can upload a content image and a style image to generate unique artwork. The backend is powered by Flask and TensorFlow, with a React frontend.',
      techStack: ['Python', 'TensorFlow', 'Flask', 'React'],
      githubLink: 'https://github.com/[YOUR_USERNAME]/style-transfer',
      image: '/assets/projects/style-transfer.png',
      category: 'AI/ML',
      featured: true,
    },
    {
      title: 'E-commerce Analytics Dashboard',
      description: 'Real-time analytics dashboard for tracking sales and user behavior.',
      longDescription:
        'Designed and implemented a dashboard for e-commerce platforms to visualize sales data, user demographics, and inventory levels. Utilized D3.js for interactive charts and Firebase for real-time data synchronization.',
      techStack: ['React', 'D3.js', 'Firebase', 'Material UI'],
      githubLink: 'https://github.com/[YOUR_USERNAME]/ecommerce-dashboard',
      image: '/assets/projects/dashboard.png',
      category: 'Data Science',
      featured: false,
    },
    {
      title: 'Smart Home Automation System',
      description: 'IoT-based system for controlling home appliances remotely.',
      longDescription:
        'Created an IoT solution using ESP32 microcontrollers and a mobile app to control lights, fans, and other appliances. Features include scheduling, voice control integration, and energy consumption monitoring.',
      techStack: ['C++', 'IoT', 'Flutter', 'Firebase'],
      githubLink: 'https://github.com/[YOUR_USERNAME]/smart-home',
      image: '/assets/projects/smart-home.png',
      category: 'IoT',
      featured: false,
    },
    {
      title: 'Task Management CLI',
      description: 'A command-line interface tool for managing developer tasks efficiently.',
      longDescription:
        'Developed a CLI tool using Rust that helps developers manage their todo lists, track time spent on tasks, and generate productivity reports. optimized for performance and ease of use.',
      techStack: ['Rust', 'CLI', 'SQLite'],
      githubLink: 'https://github.com/[YOUR_USERNAME]/task-cli',
      image: '/assets/projects/cli.png',
      category: 'Tools',
      featured: false,
    },
    {
      title: 'Medical Image Diagnosis',
      description: 'Deep learning model for detecting pneumonia from X-ray images.',
      longDescription:
        'Trained a Convolutional Neural Network (CNN) on the Chest X-Ray dataset to classify images as normal or pneumonia-affected. Achieved 95% accuracy and deployed the model as a REST API.',
      techStack: ['Python', 'Keras', 'FastAPI', 'Docker'],
      githubLink: 'https://github.com/[YOUR_USERNAME]/medical-diagnosis',
      image: '/assets/projects/medical.png',
      category: 'AI/ML',
      featured: true,
    },
  ],
  certifications: [
    {
      title: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      date: '2023',
      credentialId: '[CREDENTIAL_ID]',
      link: 'https://aws.amazon.com/verification',
    },
    {
      title: 'TensorFlow Developer Certificate',
      issuer: 'Google',
      date: '2023',
      credentialId: '[CREDENTIAL_ID]',
      link: 'https://tensorflow.org/certificate',
    },
    {
      title: 'Meta Front-End Developer Professional Certificate',
      issuer: 'Coursera',
      date: '2022',
      credentialId: '[CREDENTIAL_ID]',
      link: 'https://coursera.org/verify/[ID]',
    },
    {
      title: 'Data Science Specialist',
      issuer: 'IBM',
      date: '2022',
      credentialId: '[CREDENTIAL_ID]',
      link: 'https://ibm.com/badges/[ID]',
    },
    {
      title: 'Certified Kubernetes Administrator (CKA)',
      issuer: 'CNCF',
      date: '2023',
      credentialId: '[CREDENTIAL_ID]',
      link: 'https://cncf.io/certification/verify',
    },
  ],
  experience: [
    {
      company: '[COMPANY_NAME]',
      role: 'Full Stack Developer Intern',
      duration: 'Summer 2023',
      description: [
        'Developed and maintained features for the core web application using React and Node.js.',
        'Collaborated with the design team to implement responsive user interfaces.',
        'Optimized database queries, reducing page load times by 30%.',
      ],
      techUsed: ['React', 'Node.js', 'PostgreSQL', 'Redis'],
    },
    {
      company: '[COMPANY_NAME]',
      role: 'Machine Learning Research Assistant',
      duration: 'Jan 2023 - May 2023',
      description: [
        'Assisted in research on computer vision algorithms for autonomous vehicles.',
        'Implemented and tested state-of-the-art object detection models.',
        'Published a paper in a student research journal.',
      ],
      techUsed: ['Python', 'PyTorch', 'OpenCV'],
    },
    {
      company: 'Freelance',
      role: 'Web Developer',
      duration: '2021 - Present',
      description: [
        'Built custom websites and e-commerce stores for small businesses.',
        'Managed hosting, domain configuration, and ongoing maintenance for clients.',
        'Implemented SEO best practices to improve client visibility.',
      ],
      techUsed: ['WordPress', 'HTML/CSS', 'JavaScript', 'PHP'],
    },
  ],
  contact: {
    email: '[YOUR_EMAIL]',
    phone: '[YOUR_PHONE]',
    location: '[YOUR_LOCATION]',
    socials: [
      { platform: 'GitHub', url: 'https://github.com/[YOUR_USERNAME]', icon: 'github' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/[YOUR_USERNAME]', icon: 'linkedin' },
      { platform: 'Twitter', url: 'https://twitter.com/[YOUR_USERNAME]', icon: 'twitter' },
    ],
    availability: 'Open to offers',
  },
};
