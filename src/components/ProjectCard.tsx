import { motion } from 'framer-motion'
import type { Project } from '../data/portfolioData'
import { domainColors } from '../data/portfolioData'

/**
 * ProjectCard — A compact glassmorphic card for individual projects.
 *
 * All content elements (tech dot, title, badges) are flat children
 * of the card container to facilitate perfect centering in CSS.
 */

interface ProjectCardProps {
  project: Project
  index: number
  onClick: () => void
}

export default function ProjectCard({ project, index, onClick }: ProjectCardProps) {
  const accent = domainColors[project.domain] ?? '#7c3aed'

  return (
    <motion.div
      className="project-card"
      style={{ '--card-accent': accent } as React.CSSProperties}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: 'easeOut' }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2, ease: 'easeOut' },
      }}
      onClick={onClick}
    >
      <div className="project-card__tech-dot" />
      <h3 className="project-card__title">{project.title}</h3>
      <div className="project-card__badges">
        <span className="project-card__year">{project.year}</span>
        <span
          className="project-card__domain"
          style={{ borderColor: accent, color: accent }}
        >
          {project.domain}
        </span>
        <span className="project-card__expand-hint">
          ▸ Details
        </span>
      </div>

      {/* Glow effect on hover */}
      <div
        className="project-card__glow"
        style={{ background: `radial-gradient(circle at 50% 50%, ${accent}15, transparent 70%)` }}
      />
    </motion.div>
  )
}
