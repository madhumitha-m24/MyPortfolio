import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { scrollToOffset, getScrollElement } from '../utils/scrollStore'

/**
 * Navbar — A minimal, fixed-position glassmorphic navigation bar.
 *
 * Features:
 *  - Floats over the 3D scene with backdrop-blur
 *  - Click-to-scroll navigation via scrollStore
 *  - Hides on scroll-down, reveals on scroll-up (smart hide)
 *  - Active section indicator based on scroll position
 *  - Mobile hamburger menu
 */

const NAV_ITEMS = [
  { label: 'Home', offset: 0 },
  { label: 'Summary', offset: 0.125 },
  { label: 'Education', offset: 0.25 },
  { label: 'Skills', offset: 0.375 },
  { label: 'Projects', offset: 0.5 },
  { label: 'Publications', offset: 0.625 },
  { label: 'Certificates', offset: 0.75 },
  { label: 'Activities', offset: 0.875 },
  { label: 'Contact', offset: 1.0 },
]

export default function Navbar() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [hidden, setHidden] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Smart-hide: hide on scroll down, show on scroll up
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (ticking) return
      ticking = true

      requestAnimationFrame(() => {
        const scrollEl = getScrollElement()

        if (scrollEl) {
          const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight
          const offset = maxScroll > 0 ? scrollEl.scrollTop / maxScroll : 0

          // Find closest section
          let closest = 0
          let minDist = Infinity
          NAV_ITEMS.forEach((item, i) => {
            const dist = Math.abs(offset - item.offset)
            if (dist < minDist) {
              minDist = dist
              closest = i
            }
          })
          setActiveIndex(closest)

          // Smart hide (only if scrolled past hero)
          if (offset > 0.05) {
            setHidden(scrollEl.scrollTop > lastScrollY + 5)
          } else {
            setHidden(false)
          }
          setLastScrollY(scrollEl.scrollTop)
        }

        ticking = false
      })
    }

    // Poll scroll position (the drei scroll container is not window scroll)
    const interval = setInterval(handleScroll, 150)
    return () => clearInterval(interval)
  }, [lastScrollY])

  const handleNavClick = useCallback((offset: number, index: number) => {
    setActiveIndex(index)
    setMobileOpen(false)
    scrollToOffset(offset)
  }, [])

  return (
    <motion.nav
      className={`navbar ${hidden ? 'navbar--hidden' : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 2.4, duration: 0.6, ease: 'easeOut' }}
    >
      {/* Logo */}
      <a
        className="navbar__logo"
        onClick={() => handleNavClick(0, 0)}
        role="button"
        tabIndex={0}
        style={{ display: 'flex', alignItems: 'flex-start', gap: '1px' }}
      >
        <span className="navbar__logo-accent">M</span>
        <sup className="navbar__logo-sup" style={{ fontSize: '0.65em', color: '#a78bfa', marginTop: '0.12em' }}>2</sup>
      </a>

      {/* Desktop nav links */}
      <ul className="navbar__links">
        {NAV_ITEMS.map((item, i) => (
          <li key={item.label}>
            <button
              className={`navbar__link ${activeIndex === i ? 'navbar__link--active' : ''}`}
              onClick={() => handleNavClick(item.offset, i)}
            >
              {item.label}
              {activeIndex === i && (
                <motion.div
                  className="navbar__link-indicator"
                  layoutId="nav-indicator"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          </li>
        ))}
      </ul>

      {/* Resume button */}
      <a
        className="navbar__resume"
        href=""
        target="_blank"
        rel="noopener noreferrer"
      >
        Resume
      </a>

      {/* Mobile hamburger */}
      <button
        className={`navbar__hamburger ${mobileOpen ? 'navbar__hamburger--open' : ''}`}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation menu"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Mobile menu */}
      <motion.div
        className={`navbar__mobile-menu ${mobileOpen ? 'navbar__mobile-menu--open' : ''}`}
        initial={false}
        animate={mobileOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.25 }}
      >
        {NAV_ITEMS.map((item, i) => (
          <button
            key={item.label}
            className={`navbar__mobile-link ${activeIndex === i ? 'navbar__mobile-link--active' : ''}`}
            onClick={() => handleNavClick(item.offset, i)}
          >
            {item.label}
          </button>
        ))}
        <a
          className="navbar__mobile-resume"
          href=""
          target="_blank"
          rel="noopener noreferrer"
        >
          View Resume →
        </a>
      </motion.div>
    </motion.nav>
  )
}
