/**
 * portfolioData.ts — Central data store for the portfolio.
 *
 * Updated with the latest resume details:
 *   - Hero, Education, Technical Skills
 *   - Internships (Samsung PRISM, EMERTXE)
 *   - Projects (FPGA PID Robot, PixelStream FPGA, Arbiter, CLA Adder, Smart Waste)
 *   - Certifications & Publications
 */

/* ---------- Types ---------- */

export interface Project {
  id: string
  title: string
  company?: string
  description: string[]
  techStack: string[]
  domain: string
  year: number
  period?: string
  githubLink?: string
}

export interface Internship {
  id: string
  title: string
  company?: string
  role?: string
  description: string[]
  techStack: string[]
  domain: string
  year: number
  period?: string
  githubLink?: string
}

export interface Publication {
  id: string
  title: string
  conference: string
  year: number
  period?: string
  description: string[]
  link?: string
}

export interface Certificate {
  id: string
  title: string
  organization: string
  year: number
  period?: string
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
  subtitle: 'Electronics & Communication Engineer',
  summary:
    'Undergraduate in Electronics & Communication Engineering with experience in embedded systems, FPGA based design, digital systems, interfacing with sensors, and real time hardware design. Experience with Embedded C, Verilog RTL, SystemVerilog, micro-controllers, FPGA prototyping and HW/SW integration, electronics product development, design and validation. Passionate about building reliable embedded and digital hardware solutions for an electronic product.',
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
    label: 'Phone',
    url: 'tel:+916364201824',
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
    institution: 'Amrita Vishwa Vidyapeetham, Kasavanahalli, Bengaluru, India',
    period: '2023 – Present',
    cgpa: '8.07 / 10',
  },
  {
    id: 'pu',
    degree: 'PU Education (Central Board of Secondary Education)',
    institution: 'Sri Chaitanya PU College, Horamavu, Bengaluru, India',
    period: 'May 2023',
    cgpa: '7.36 / 10',
  },
  {
    id: 'secondary',
    degree: 'Secondary Education (Central Board of Secondary Education)',
    institution: 'New Baldwin International School, Ramamurthy Nagar, Bengaluru, India',
    period: 'March 2021',
    cgpa: '8.73 / 10',
  },
]

/* ---------- Technical Skills ---------- */

export const technicalSkills: SkillCategory[] = [
  {
    category: 'Programming',
    skills: ['Embedded C', 'C', 'Basic Python'],
  },
  {
    category: 'Digital Design & VLSI',
    skills: ['Verilog (RTL Design)', 'SystemVerilog (Basics)', 'Digital Logic Design', 'FPGA Prototyping'],
  },
  {
    category: 'FPGA Platforms',
    skills: ['Basys-3', 'Artix-7'],
  },
  {
    category: 'Embedded Systems',
    skills: ['STM32 (ARM Cortex-M)', 'ESP32', 'Bare-Metal Programming', 'Real-Time Systems'],
  },
  {
    category: 'Peripheral Interfacing',
    skills: ['Sensor Interfacing', 'GPIO', 'ADC', 'PWM', 'Timers', 'Motor Control'],
  },
  {
    category: 'Communication Protocols',
    skills: ['UART (Hands-on)', 'SPI (Basics)', 'I2C (Basics)'],
  },
  {
    category: 'Development Tools',
    skills: ['STM32CubeIDE', 'Vivado', 'Arduino IDE', 'MATLAB / Simulink', 'Keil', 'Proteus', 'Cadence Virtuoso'],
  },
  {
    category: 'Core Concepts',
    skills: ['Microcontrollers', 'Embedded Systems', 'Digital Electronics', 'Control Systems'],
  },
]

/* ---------- Internships ---------- */

export const internships: Internship[] = [
  {
    id: 'samsung-prism',
    title: 'FPGA-Based Adaptive PID Control with Real-Time Disturbance Rejection',
    company: 'Samsung PRISM',
    role: 'Virtual Intern',
    period: 'Dec 2025 - May 2026',
    year: 2026,
    description: [
      'Worked on FPGA-Based Adaptive PID Control with Real-Time Disturbance Rejection using Verilog.',
      'Developed control logic for an autonomous mobile robot with sensor feedback and motor control.',
      'Studied the Integration of ESP32-based wireless interface for remote speed control and robot interaction.',
    ],
    techStack: ['Verilog', 'FPGA', 'Adaptive PID', 'ESP32', 'Sensor Feedback', 'Motor Control'],
    domain: 'VLSI',
  },
  {
    id: 'emertxe-embedded',
    title: 'Real-Time EV Dashboard and ADAS Warning System',
    company: 'EMERTXE',
    role: 'Embedded Systems Intern',
    period: 'June - July 2026',
    year: 2026,
    description: [
      'Developed a Real-Time EV Dashboard and ADAS Warning System using STM32F103C8T6.',
      'Implemented embedded firmware using Embedded C, ADC, timers, UART, PWM, and sensor interfacing.',
      'Implemented EV dynamics, monitoring, obstacle detection, fault handling, and ADAS warnings system.',
    ],
    techStack: ['STM32F103C8T6', 'Embedded C', 'ADC', 'Timers', 'UART', 'PWM', 'ADAS'],
    domain: 'Embedded',
  },
]

/* ---------- Projects ---------- */

export const projects: Project[] = [
  {
    id: 'fpga-pid-robot',
    title: 'FPGA-Based Autonomous Mobile Robot with Adaptive PID Control',
    period: 'May 2026',
    year: 2026,
    description: [
      'Autonomous mobile robot using a Basys-3 FPGA, ESP32, ultrasonic sensors, and L298N motor driver.',
      'Implemented adaptive PID-based closed-loop motor control and sensor-based obstacle detection.',
      'Successfully integrated motor PWM control, and wireless speed control through an ESP32-based interface.',
    ],
    techStack: ['Basys-3 FPGA', 'ESP32', 'Adaptive PID', 'Ultrasonic Sensors', 'L298N', 'Motor PWM'],
    domain: 'Embedded',
  },
  {
    id: 'pixelstream-fpga',
    title: 'PixelStream FPGA',
    period: 'April 2026',
    year: 2026,
    description: [
      'Designed a dual-clock asynchronous FIFO in Verilog using Gray-code pointers for reliable clock-domain crossing.',
      'Near-full/Near-empty monitoring, predictive overflow detection, and packet-error handling for real-time data.',
      'Gained hands-on experience in asynchronous FIFO design, clock-domain crossing, and real-time data transfer.',
    ],
    techStack: ['Verilog', 'FPGA', 'Asynchronous FIFO', 'Gray-Code Pointers', 'CDC', 'Vivado'],
    domain: 'VLSI',
  },
  {
    id: 'interleaved-arbiter',
    title: 'Interleaved Round-Robin Arbiter',
    period: 'April 2026',
    year: 2026,
    description: [
      'Designed a multi-requestor round-robin arbiter in SystemVerilog with dynamic priority rotation and one-hot grant.',
      'Developed a self-checking verification environment with driver, monitor, and scoreboard to validate arbitration.',
      'Gained practical experience in RTL design, arbitration logic, and functional verification using SystemVerilog.',
    ],
    techStack: ['SystemVerilog', 'RTL Design', 'Dynamic Priority Rotation', 'Scoreboard Verification', 'Arbitration Logic'],
    domain: 'VLSI',
  },
  {
    id: 'cla-adder',
    title: '8-bit Carry Look-Ahead Adder',
    period: 'November 2025',
    year: 2025,
    description: [
      'Designed dynamic comparator using CLA architecture in 45nm CMOS technology in Cadence.',
      'Achieved optimized delay of 5.23 ns with low power consumption.',
      'Mastered custom IC design flow, transistor-level simulation, and timing analysis.',
    ],
    techStack: ['Cadence Virtuoso', '45nm CMOS', 'CLA Architecture', 'Dynamic Comparator', 'Timing Analysis'],
    domain: 'VLSI',
  },
  {
    id: 'smart-waste',
    title: 'ARM Cortex-M4 Based Smart Waste Segregation System',
    period: 'May 2026',
    year: 2026,
    description: [
      'Developed a smart waste segregation system using STM32F446RE ARM Cortex-M4 microcontroller.',
      'Integrated IR, moisture, and inductive proximity sensors with servo and stepper motors for automatic sorting.',
      'Successfully achieved automated real-time waste segregation through embedded sensor and motor-driven control.',
    ],
    techStack: ['STM32F446RE', 'ARM Cortex-M4', 'Embedded C', 'Sensors', 'Servo & Stepper Motors'],
    domain: 'Embedded',
  },
]

/* ---------- Publications ---------- */

export const publications: Publication[] = [
  {
    id: 'diabetes-iitcee',
    title: 'Imbalance-Aware ML for Multiclass Classification of Diabetes Data',
    conference: 'IITCEE 2026 (IEEE)',
    period: 'January 2026',
    year: 2026,
    description: [
      'Published at IITCEE 2026 (IEEE); proposed an optimized ensemble ML framework using Random Forest and XGBoost with ADASYN/SMOTE oversampling for multiclass diabetes prediction across two clinical datasets.',
      'Benchmarked eight classifiers achieving 99.41% accuracy, precision, recall, and F1-score on the stacking model.',
    ],
  },
]

/* ---------- Certificates ---------- */

export const certificates: Certificate[] = [
  {
    id: 'rtl-soc-signoff',
    title: 'Bootcamp: RTL, IP Integration, and SoC Signoff',
    organization: 'RTL & SoC Signoff Bootcamp',
    period: 'July 2026',
    year: 2026,
    description: 'Hands-on exposure to RTL design, IP integration, and SoC signoff methodologies.',
  },
  {
    id: 'ml-matlab',
    title: 'Machine Learning using MATLAB',
    organization: 'MathWorks',
    period: 'February 2025',
    year: 2025,
    description: 'Covered supervised and unsupervised learning techniques applied using MATLAB toolboxes.',
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
