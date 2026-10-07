import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  hero,
  projects,
  publications,
  certificates,
  socialLinks,
  education,
  technicalSkills,
  extracurriculars,
  domainColors,
} from '../data/portfolioData'
import ProjectCard from './ProjectCard'
import { scrollToOffset } from '../utils/scrollStore'

/**
 * ContentOverlay — HTML sections rendered inside Drei's <Scroll html> container.
 *
 * Uses pure CSS positioning within the scroll container. Sections are placed
 * at absolute positions matching the scroll offsets defined in the Navbar.
 *
 * With pages=10, the scroll travel is (pages-1) = 9 viewport heights.
 * A section at offset X is placed at top = X * 9 * 100vh.
 */

const PAGES = 10

/** Convert a normalized offset (0–1) to a CSS top value in vh */
function sectionTop(offset: number): string {
  return `${offset * (PAGES - 1) * 100}vh`
}

export default function ContentOverlay() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  return (
    <>
      {/* ===== SECTION 1: Hero ===== */}
      <div
        className="scroll-section scroll-section--right"
        style={{ top: sectionTop(0.0) }}
      >
        <div className="overlay-hero">
          <p className="overlay-hero__label">WELCOME — I'M</p>
          <h1 className="overlay-hero__title">{hero.name}</h1>
          <p className="overlay-hero__role">{hero.subtitle}</p>
          <p className="overlay-hero__subtitle">Scroll down to explore ↓</p>

          <div className="overlay-hero__links">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target={link.url.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="overlay-hero__link-pill"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ===== SECTION 2: Professional Summary ===== */}
      <div
        className="scroll-section scroll-section--left"
        style={{ top: sectionTop(1/9) }}
      >
        <div className="overlay-section">
          <h2 className="overlay-section__heading">Professional Summary</h2>
          <p className="summary-text">{hero.summary}</p>
        </div>
      </div>

      {/* ===== SECTION 3: Education ===== */}
      <div
        className="scroll-section scroll-section--right"
        style={{ top: sectionTop(2/9) }}
      >
        <div className="overlay-section">
          <h2 className="overlay-section__heading">Education</h2>
          <div className="overlay-education">
            {education.map((edu) => (
              <div key={edu.id} className="edu-card">
                <div className="edu-card__header">
                  <h3 className="edu-card__degree">{edu.degree}</h3>
                  <span className="edu-card__period">{edu.period}</span>
                </div>
                <p className="edu-card__institution">{edu.institution}</p>
                <p className="edu-card__cgpa">CGPA: {edu.cgpa}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== SECTION 4: Technical Skills ===== */}
      <div
        className="scroll-section scroll-section--left scroll-section--tall"
        style={{ top: sectionTop(3/9) }}
      >
        <div className="overlay-section">
          <div className="overlay-section__header-sticky">
            <h2 className="overlay-section__heading">Technical Skills</h2>
          </div>
          <div className="overlay-skills">
            {technicalSkills.map((cat) => (
              <div key={cat.category} className="skill-group">
                <h3 className="skill-group__title">{cat.category}</h3>
                <div className="skill-group__tags">
                  {cat.skills.map((skill) => (
                    <span key={skill} className="skill-pill">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== SECTION 5: Projects ===== */}
      <div
        className="scroll-section scroll-section--right scroll-section--tall"
        style={{ top: sectionTop(4/9) }}
      >
        <div className="overlay-section">
          <div className="overlay-section__header-sticky">
            <h2 className="overlay-section__heading">Technical Projects</h2>
          </div>
          <AnimatePresence mode="wait">
            {selectedProjectId === null ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="overlay-projects-grid"
              >
                {projects.map((project, i) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={i}
                    onClick={() => {
                      setSelectedProjectId(project.id)
                      scrollToOffset(4/9)
                    }}
                  />
                ))}
              </motion.div>
            ) : (
              (() => {
                const selectedProject = projects.find((p) => p.id === selectedProjectId)
                if (!selectedProject) return null
                const accent = domainColors[selectedProject.domain] ?? '#7c3aed'
                return (
                  <motion.div
                    key="detail"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="project-detail-view"
                  >
                    <button
                      className="project-detail-back"
                      onClick={() => {
                        setSelectedProjectId(null)
                        scrollToOffset(4/9)
                      }}
                    >
                      ← Back to Projects
                    </button>
                    <div
                      className="project-detail-card"
                      style={{ '--card-accent': accent } as React.CSSProperties}
                    >
                      <div className="project-detail-header">
                        <div
                          className="project-card__tech-dot"
                          style={{ backgroundColor: accent } as React.CSSProperties}
                        />
                        <div className="project-detail-meta">
                          <h3 className="project-detail-title">{selectedProject.title}</h3>
                          <div className="project-card__badges">
                            <span className="project-card__year">{selectedProject.year}</span>
                            <span
                              className="project-card__domain"
                              style={{ borderColor: accent, color: accent }}
                            >
                              {selectedProject.domain}
                            </span>
                          </div>
                        </div>
                      </div>

                      <ul className="project-detail-desc">
                        {selectedProject.description.map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>

                      <div className="project-detail-tags">
                        {selectedProject.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="project-card__tag"
                            style={{
                              borderColor: `${accent}40`,
                              background: `${accent}15`,
                              color: accent,
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {selectedProject.githubLink && (
                        <a
                          href={selectedProject.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-detail-link"
                        >
                          View on GitHub →
                        </a>
                      )}
                    </div>
                  </motion.div>
                )
              })()
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ===== SECTION 6: Publications ===== */}
      <div
        className="scroll-section scroll-section--left"
        style={{ top: sectionTop(6/9) }}
      >
        <div className="overlay-section">
          <h2 className="overlay-section__heading">Publications</h2>
          <div className="overlay-publications">
            {publications.map((pub) => (
              <div key={pub.id} className="publication-card">
                <div className="publication-card__header">
                  <h3 className="publication-card__title">{pub.title}</h3>
                  <span className="publication-card__conf">{pub.conference}</span>
                </div>
                <ul className="publication-card__desc">
                  {pub.description.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
                {pub.link && (
                  <a
                    href={pub.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="publication-card__link"
                  >
                    Read Paper →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== SECTION 7: Certificates ===== */}
      <div
        className="scroll-section scroll-section--right"
        style={{ top: sectionTop(7/9) }}
      >
        <div className="overlay-section">
          <h2 className="overlay-section__heading">Certifications</h2>
          <div className="overlay-certificates">
            {certificates.map((cert) => (
              <div key={cert.id} className="cert-card">
                <div className="cert-card__header">
                  <h3 className="cert-card__title">{cert.title}</h3>
                  <div className="cert-card__meta">
                    <span className="cert-card__org">{cert.organization}</span>
                    <span className="cert-card__year">{cert.year}</span>
                  </div>
                </div>
                <p className="cert-card__desc">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== SECTION 8: Extracurriculars ===== */}
      <div
        className="scroll-section scroll-section--left"
        style={{ top: sectionTop(8/9) }}
      >
        <div className="overlay-section">
          <h2 className="overlay-section__heading">Extracurricular Activities</h2>
          <div className="overlay-extras">
            {extracurriculars.map((item, i) => (
              <div key={i} className="extra-pill">
                {item.activity}
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* ===== SECTION 9: Contact ===== */}
      <div
        className="scroll-section scroll-section--center"
        style={{ top: sectionTop(9/9) }}
      >
        <div className="overlay-section overlay-contact">
          <h2 className="overlay-section__heading">Let's Connect</h2>
          <p className="overlay-contact__intro">
            Feel free to reach out via the form below or any of the platforms!
          </p>

          {/* Contact Form — submits to Google Forms */}
          <form
            className="contact-form"
            action="https://docs.google.com/forms/d/e/1FAIpQLScrQLZueXpVLedA39XWvMinUvAo9ngt-y4-nnH3MzP-arpj7g/formResponse"
            method="POST"
            target="hidden_iframe"
            onSubmit={(e) => {
              const form = e.currentTarget
              setTimeout(() => {
                form.reset()
                const status = form.querySelector('.form-status') as HTMLElement
                if (status) {
                  status.textContent = 'Message sent successfully!'
                  status.style.opacity = '1'
                  setTimeout(() => { status.style.opacity = '0' }, 3000)
                }
              }, 500)
            }}
          >
            <div className="contact-form__row">
              <input
                type="text"
                name="entry.1873492433"
                placeholder="Full Name"
                required
                className="contact-form__input"
              />
              <input
                type="email"
                name="entry.1766761888"
                placeholder="Email Address"
                required
                className="contact-form__input"
              />
            </div>
            <div className="contact-form__row">
              <input
                type="tel"
                name="entry.595552444"
                placeholder="Phone Number"
                required
                className="contact-form__input"
              />
              <input
                type="text"
                name="entry.1879462701"
                placeholder="Subject"
                required
                className="contact-form__input"
              />
            </div>
            <textarea
              name="entry.1465470649"
              rows={4}
              placeholder="Your Message"
              required
              className="contact-form__textarea"
            />
            <div className="contact-form__actions">
              <button type="submit" className="contact-form__submit">
                Send Message →
              </button>
              <span className="form-status" style={{ opacity: 0 }}>Message sent!</span>
            </div>
          </form>
          <iframe name="hidden_iframe" id="hidden_iframe" style={{ display: 'none' }} title="form-target" />

          {/* Social Links */}
          <div className="overlay-contact__links">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target={link.url.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="overlay-contact__link"
              >
                <span>{link.label}</span>
              </a>
            ))}
            <a
              href={hero.resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="overlay-contact__link overlay-contact__link--resume"
            >
              <span>View Resume</span>
            </a>
          </div>
          <p className="overlay-contact__footer">© 2026 {hero.name}</p>
        </div>
      </div>
    </>
  )
}
