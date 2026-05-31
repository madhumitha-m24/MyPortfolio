# M. Madhumitha - Interactive 3D Digital Portfolio

A premium, interactive digital portfolio showcasing the academic achievements, technical projects, publications, and certifications of M. Madhumitha, a student in Electronics and Communication Engineering with a specialization in VLSI Design and Embedded Systems Engineering.

This web application features a responsive 3D particle-driven background environment, smooth scroll-synchronized model interpolation, custom reactive cursor trails, glassmorphic UI components, and real-time client-side performance monitoring.

---

## Executive Architectural Design & Philosophy

The application utilizes a hybrid rendering paradigm where high-performance WebGL graphics are paired with semantic HTML elements. This ensures maximum visual fidelity without sacrificing search engine accessibility (SEO) or document readability.

### Core Component Layering
- **Background Layer**: A customized WebGL Canvas powered by React Three Fiber and Three.js containing orbiting spheres, dynamic starfields, and real-time hardware-adaptive particles.
- **User Interface Layer**: A smart fixed-position glassmorphic navigation bar displaying responsive active indicators that seamlessly transition alongside user scroll depth.
- **Dynamic Scroll Overlay**: A multi-stage overlay containing structural divisions for personal profile information, core competency areas, education timelines, projects, publications, and a secure contact portal.
- **Interactive Cursor System**: A high-speed, magnetizing pointer system tracking user movements and expanding its boundaries dynamically upon encountering actionable screen nodes.

---

## Technical Specifications

The system is constructed upon a modern frontend compilation pipeline.

| Category | Technology | Purpose |
| --- | --- | --- |
| Core Framework | React 19, TypeScript | Reactive interface construction and type safety. |
| Graphics & Render Engine | Three.js, @react-three/fiber | High-performance GPU-accelerated WebGL operations. |
| 3D Scene Controls | @react-three/drei | Starfield generators, float animations, and scroll hooks. |
| Vector & UI Transitions | Framer Motion | Fluid spring physics and structural entrance transitions. |
| Low-level Tweens | GSAP | Precise keyframe coordinate manipulations. |
| CSS Pipeline | Tailwind CSS v4, Vanilla CSS | Rapid interface styling and custom glassmorphism. |
| Asset Bundler | Vite 8 | Fast Hot Module Replacement and production optimization. |
| Deployment Automation | gh-pages | Automatic asset optimization and publishing to GitHub Pages. |

---

## Key Engineering Accomplishments

### 1. Adaptive Performance Profiling
To accommodate a wide array of client systems (ranging from mobile devices to desktop computers with dedicated GPUs), the application utilizes a hardware profiling pipeline via `PerformanceMonitor`:
- **Real-time Frame Profiling**: Monitors rendering frame rates and automatically calculates state degradation.
- **Dynamic Graphic Scalability**: Upon discovering slow render loops, the system drops the Device Pixel Ratio (DPR) to 1.0, reduces the starfield element count from 2500 to 1000, drops the ambient particle instances by 66 percent, simplifies the torus knot mesh geometry resolution, and disables expensive anti-aliasing processes.
- **Responsive Recovery**: Restores graphic quality seamlessly if the GPU performance stabilizes.

### 2. State-Controlled Cross-Layer Communication
The application decouples 3D Canvas rendering loops from browser-native DOM elements via a shared state model located in `scrollStore.ts`:
- **Canvas Synchronization**: Intercepts React Three Fiber scroll offset controls and exposes structural element handles.
- **External Click Navigation**: Allows the standard HTML navigation bar (rendered outside the 3D Canvas context) to trigger hardware-accelerated smooth scrolls to precise offsets (e.g., matching coordinates 1/9, 2/9, 4/9, or 1.0).
- **Position Pulling**: Runs low-overhead polling updates to align the current active navigation index with the exact normalized scroll height.

### 3. Smart Header Visibility System
The floating navigation header employs a directional scroll-tracking mechanism:
- **Automatic Hiding**: Minimizes header footprint on scroll-down actions to provide maximum focus on portfolio content.
- **Smart Recalls**: Immediately reveals the navigation header upon a scroll-up threshold detection of 5 pixels.
- **Hero Lock**: Ensures the navigation bar remains pinned and visible whenever the scroll position occupies the primary landing stage.

### 4. Interactive Project Filter & Transitions
The project grid supports dual-state views managed through `AnimatePresence`:
- **Seamless Grid Expansion**: Transitioning between the project catalog and individual project detail cards occurs with hardware-accelerated opacity slides.
- **Accent Theming**: The application dynamically reads domain tags (Embedded, VLSI, ML, Analog, Digital) from the database layer and recalculates active border glows, background pills, and ambient light colors to match the project domain accent.

---

## System Directory Structure

```text
MyPortfolio/
├── .github/                  # GitHub Actions workflow configurations
├── public/                   # Static browser assets and icons
├── src/
│   ├── assets/               # Shared font files and images
│   ├── components/           # Core interactive application UI components
│   │   ├── ContentOverlay.tsx # Main multi-section text layout
│   │   ├── CustomCursor.tsx  # Dynamic tracking cursor trail
│   │   ├── FloatingModel.tsx # WebGL model compositions and particle fields
│   │   ├── Navbar.tsx        # Smart glassmorphic navigation header
│   │   ├── Preloader.tsx     # Animated entrance sequencing
│   │   ├── ProjectCard.tsx   # Reusable individual project displays
│   │   ├── Scene.tsx         # GPU WebGL Canvas wrapper
│   │   └── ScrollCapture.tsx # Captures scroll events inside the Canvas
│   ├── data/                 # Central data store files
│   │   └── portfolioData.ts  # Academic and professional database
│   ├── models/               # Custom 3D asset geometries
│   ├── utils/                # Navigation utilities and state stores
│   │   └── scrollStore.ts    # Decoupled navigation store
│   ├── App.css               # Main styling rules and layout declarations
│   ├── App.tsx               # Root component coordinator
│   ├── index.css             # Entry stylesheet
│   └── main.tsx              # React mounting root file
├── eslint.config.js          # ESLint code styling configurations
├── package.json              # Compilation dependencies and script definitions
├── tsconfig.json             # Root TypeScript compilation rules
├── vite.config.ts            # Vite compiler configuration
└── README.md                 # Project documentation
```

---

## Local Development Setup

Follow these procedures to initialize the project environment and run the application locally on your workstation.

### Prerequisites
- **Node.js**: Version 18.x or higher is recommended.
- **npm**: Version 9.x or higher is recommended.

### Installation
1. Clone the project repository to your local directory:
   ```bash
   git clone https://github.com/madhumitha-m24/MyPortfolio.git
   ```

2. Navigate into the cloned directory:
   ```bash
   cd MyPortfolio
   ```

3. Install all compiler and runtime dependencies:
   ```bash
   npm install
   ```

### Execution
To initiate the local development server:
```bash
npm run dev
```

The terminal will print the local host address (typically `http://localhost:5173`). Open this URL inside your browser to inspect the application. The system will automatically reflect source code changes in real time.

---

## Production Compilation & Deployment

The application features a built-in automated compiler sequence that builds optimized bundles and deploys them to GitHub Pages.

### Production Build compilation
To construct an optimized, tree-shaken assembly of static files inside the `dist` directory:
```bash
npm run build
```

This script triggers the TypeScript compiler (`tsc`) to validate type safety, followed by the Vite builder to perform asset minification, critical CSS extraction, and chunk division.

### Local Preview of Production Build
To test the production build locally and verify exact server behaviors:
```bash
npm run preview
```

### GitHub Pages Deployment
To deploy the application to your online GitHub Pages domain, execute:
```bash
npm run deploy
```

This single command triggers the build sequence automatically, compresses the results, commits the compiled output to a dedicated `gh-pages` branch on your origin remote repository, and updates the live site.

---

## Customizing Content & Data

All data driving this application is centralized inside `src/data/portfolioData.ts`. Modifications to this file will propagate immediately across all components without needing manual changes in JSX layouts.

To update personal information, edit the export objects:
- `hero`: Contains professional titles, comprehensive biographies, and external CV cloud URLs.
- `socialLinks`: Array of target platforms and profiles.
- `education`: Sequential database of institutional dates and grade details.
- `technicalSkills`: Organized array structure dividing capabilities into categorized tag groups.
- `projects`: Dynamic list containing descriptive points, tag categories, domains, and repository paths.
- `publications`: Published IEEE/conference papers complete with details and external links.
- `certificates`: Technical certifications accompanied by details.
- `extracurriculars`: List of active hobbies and leadership roles.

---

## Continuous Integration & ESLint Quality Control

The project utilizes automated linting checks to guarantee high software standards. Run the following command to check all source files for syntax inconsistencies, unused variables, and deprecated patterns:
```bash
npm run lint
```

### ESLint Rules Extension
For production applications, it is highly recommended to configure type-aware lint rules inside the root `eslint.config.js`:

```js
import defineConfig from 'eslint-define-config'
import tseslint from 'typescript-eslint'

export default defineConfig([
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname
      }
    }
  }
])
```

This configuration enhances compile-time safety by auditing internal types, checking asynchronous call handling, and ensuring proper hook usage.
