/**
 * portfolioData.ts — Central data store for the portfolio.
 *
 * All content migrated from the old HTML files:
 *   - index.html → hero, social links, skills, education, extracurriculars
 *   - projects.html  → projects[]
 *   - publication.html → publications[]
 *   - certificates.html → certificates[]
 */

/* ---------- Types ---------- */

export interface Project {
  id: string
  title: string
  description: string[]
  techStack: string[]
  domain: string
  year: number
  githubLink?: string
}

export interface Publication {
  id: string
  title: string
  conference: string
  year: number
  description: string[]
  link?: string
}

export interface Certificate {
  id: string
  title: string
  organization: string
  year: number
  description: string
}

export interface SocialLink {
  label: string
  url: string
}

export interface Education {
  id: string
  degree: string
  institution: string
  period: string
  cgpa: string
}

export interface SkillCategory {
  category: string
  skills: string[]
}

export interface Extracurricular {
  activity: string
}

/* ---------- Hero / Personal ---------- */

export const hero = {
  name: 'M. Madhumitha',
  subtitle: 'VLSI Designer | Embedded Systems Engineer',
  summary:
    'Electronics and Communication Engineering undergraduate with strong interest in VLSI Design, Functional Verification, RTL Design, FPGA systems, and Embedded Systems. Hands-on experience in Verilog/SystemVerilog-based digital design, STM32 and ARM-based embedded systems, Cadence Virtuoso CMOS design, and real-time hardware interfacing. Passionate about building efficient digital systems, embedded firmware, and hardware-software integrated solutions.',
  resumeLink:
    '',
}

/* ---------- Social Links ---------- */

export const socialLinks: SocialLink[] = [
  {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/madhumitha-m24/',
  },
  {
    label: 'GitHub',
    url: 'https://github.com/madhumitha-m24',
  },
  {
    label: 'Email',
    url: 'mailto:m.madhumitha2403@gmail.com',
  },
  {
    label: 'Instagram',
    url: 'https://instagram.com/madhu_2403_',
  },
]

/* ---------- Education ---------- */

export const education: Education[] = [
  {
    id: 'btech',
    degree: 'B.Tech in Electronics & Communication Engineering',
    institution: 'Amrita Vishwa Vidyapeetham, Bengaluru',
    period: '2023 - Present',
    cgpa: '7.98 / 10',
  },
  {
    id: 'pu',
    degree: 'PU Education',
    institution: 'Sri Chaitanya PU College, Bengaluru',
    period: '2023',
    cgpa: '7.36 / 10',
  },
  {
    id: 'secondary',
    degree: 'Secondary Education',
    institution: 'New Baldwin International School, Bengaluru',
    period: '2021',
    cgpa: '8.73 / 10',
  },
]

/* ---------- Technical Skills ---------- */

export const technicalSkills: SkillCategory[] = [
  {
    category: 'Programming Languages',
    skills: ['Embedded C', 'Python', 'Verilog', 'SystemVerilog'],
  },
  {
    category: 'Development Tools',
    skills: ['Vivado', 'Cadence Virtuoso', 'MATLAB', 'Simulink', 'GNU Radio', 'Arduino IDE', 'Proteus'],
  },
  {
    category: 'Embedded Systems',
    skills: ['STM32F446RE', 'LPC2148', 'ESP32', 'ARM7TDMI-S'],
  },
  {
    category: 'VLSI & FPGA',
    skills: ['RTL Design', 'Functional Verification', 'FSM Design', 'Asynchronous FIFO', 'CMOS Design'],
  },
  {
    category: 'Protocols & Interfaces',
    skills: ['UART', 'SPI', 'I2C', 'GPIO'],
  },
  {
    category: 'Core Areas',
    skills: ['Digital Electronics', 'Embedded Systems', 'Wireless Communication', 'Machine Learning'],
  },
]

/* ---------- Projects ---------- */

export const projects: Project[] = [
  {
    id: 'smart-waste',
    title: 'ARM Cortex-M4 Smart Waste Segregation System',
    description: [
      'Developed a smart waste segregation system using STM32F446RE ARM Cortex-M4 microcontroller.',
      'Integrated IR, moisture, and inductive proximity sensors with servo and stepper motor control.',
      'Implemented real-time embedded firmware for automated wet, dry, and metal waste classification.',
    ],
    techStack: ['STM32F446RE', 'ARM Cortex-M4', 'Embedded C', 'Sensors'],
    domain: 'Embedded',
    year: 2026,
  },
  {
    id: 'priority-arbiter',
    title: 'Weighted Cyclic Priority Arbiter using FSM',
    description: [
      'Designed and verified a weighted round-robin arbiter using Verilog/SystemVerilog.',
      'Implemented FSM-based cyclic priority allocation and layered testbench verification.',
      'Simulated and analyzed RTL waveforms using Vivado.',
    ],
    techStack: ['Verilog', 'SystemVerilog', 'Vivado', 'FSM Design'],
    domain: 'VLSI',
    year: 2026,
  },
  {
    id: 'async-fifo',
    title: 'Asynchronous FIFO in FPGA',
    description: [
      'Designed asynchronous FIFO architecture with dual clock domains for FPGA systems.',
      'Implemented near-full, near-empty, and overflow prediction logic.',
      'Verified CDC handling and FIFO behavior through simulation waveforms.',
    ],
    techStack: ['Verilog', 'FPGA', 'CDC', 'Vivado'],
    domain: 'VLSI',
    year: 2026,
  },
  {
    id: 'pid-robot',
    title: 'Autonomous Adaptive PID Controlled Mobile Robot',
    description: [
      'Designed adaptive PID-based control system for autonomous navigation.',
      'Integrated sensors and motor drivers for stable closed-loop performance.',
      'Worked on control theory, sensor fusion, and embedded system integration.',
    ],
    techStack: ['PID Control', 'Sensor Fusion', 'Embedded Systems', 'Motor Drivers'],
    domain: 'Embedded',
    year: 2025,
  },
  {
    id: 'diabetes-ml',
    title: 'Multiclass Diabetes Classification using Machine Learning',
    description: [
      'Implemented multiclass diabetes classification using ensemble learning techniques.',
      'Applied SMOTE and ADASYN for handling class imbalance.',
      'Evaluated Random Forest, SVM, XGBoost, and MLP models.',
    ],
    techStack: ['Python', 'Random Forest', 'XGBoost', 'SMOTE', 'ADASYN'],
    domain: 'ML',
    year: 2025,
  },
  {
    id: '8bit-comparator',
    title: '8-bit Comparator using Cadence Virtuoso',
    description: [
      'Designed dynamic comparator using CLA architecture in 45nm CMOS technology.',
      'Achieved optimized delay with low power consumption.',
      'Worked on transistor-level simulation and timing analysis using Cadence Virtuoso.',
    ],
    techStack: ['Cadence Virtuoso', 'CMOS 45nm', 'CLA Architecture'],
    domain: 'VLSI',
    year: 2025,
  },
  {
    id: 'scientific-calc',
    title: 'Scientific Calculator using ARM7TDMI-S',
    description: [
      'Developed a scientific calculator using LPC2148 ARM7TDMI-S microcontroller.',
      'Implemented arithmetic operations including addition, subtraction, multiplication, and division.',
      'Integrated keypad, LCD display, and UART communication using Embedded C.',
    ],
    techStack: ['LPC2148', 'ARM7TDMI-S', 'Embedded C', 'UART'],
    domain: 'Embedded',
    year: 2025,
  },
  {
    id: 'audio-amplifier',
    title: 'Analog Audio Amplifier',
    description: [
      'Designed and analyzed a multistage analog audio amplifier circuit.',
      'Worked on amplification, gain analysis, and signal conditioning concepts.',
      'Studied frequency response and analog circuit behavior.',
    ],
    techStack: ['Analog Design', 'Signal Conditioning', 'Circuit Analysis'],
    domain: 'Analog',
    year: 2024,
  },
  {
    id: 'digital-clock',
    title: 'Digital Clock using Logic Gates',
    description: [
      'Designed a digital clock for displaying hours, minutes, and seconds using logic gates.',
      'Implemented timing and counting logic using digital electronics concepts.',
      'Learned combinational and sequential logic circuit design.',
    ],
    techStack: ['Logic Gates', 'Digital Electronics', 'Sequential Logic'],
    domain: 'Digital',
    year: 2024,
  },
]

/* ---------- Publications ---------- */

export const publications: Publication[] = [
  {
    id: 'diabetes-iitcee',
    title: 'Imbalance-Aware ML for Multiclass Classification of Diabetes Data',
    conference: 'IITCEE 2026 (IEEE)',
    year: 2026,
    description: [
      'Published research work focused on multiclass diabetes classification using imbalance-aware machine learning techniques.',
      'Implemented Random Forest, XGBoost, and ensemble learning models with SMOTE and ADASYN oversampling methods.',
      'Performed feature selection and classification analysis for improving prediction performance on clinical datasets.',
      'Achieved high accuracy, precision, recall, and F1-score using optimized ensemble learning approaches.',
    ],
  },
]

/* ---------- Certificates ---------- */

export const certificates: Certificate[] = [
  {
    id: 'ml-matlab',
    title: 'Machine Learning using MATLAB',
    organization: 'MathWorks',
    year: 2025,
    description: 'Covered supervised and unsupervised learning techniques using MATLAB toolboxes.',
  },
]

/* ---------- Extracurricular Activities ---------- */

export const extracurriculars: Extracurricular[] = [
  { activity: 'Active Executive - JIDO Industrial Automation Club' },
  { activity: 'Organized Technical Workshops & Events' },
  { activity: 'Badminton' },
  { activity: 'Chess' },
  { activity: 'Drawing' },
  { activity: 'Music' },
]

/* ---------- Domain colors (for card accents) ---------- */

export const domainColors: Record<string, string> = {
  Embedded: '#34d399',
  VLSI: '#818cf8',
  ML: '#fbbf24',
  Analog: '#f472b6',
  Digital: '#22d3ee',
}
