import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Preloader — A full-screen loading overlay with animated logo and
 * a progress-like shimmer bar. Auto-hides after a minimum display
 * time + window.onload event (ensures 3D assets are ready).
 */
export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const MIN_DISPLAY = 2200 // minimum ms to show the loader
    const start = Date.now()

    const handleLoad = () => {
      const elapsed = Date.now() - start
      const remaining = Math.max(0, MIN_DISPLAY - elapsed)
      setTimeout(() => setIsLoading(false), remaining)
    }

    // If already loaded (cached), still wait minimum time
    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
      // Fallback — never show loader forever
      const fallback = setTimeout(() => setIsLoading(false), 5000)
      return () => {
        window.removeEventListener('load', handleLoad)
        clearTimeout(fallback)
      }
    }
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* Animated name */}
          <motion.div
            className="preloader__content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="preloader__logo" style={{ display: 'flex', alignItems: 'flex-start', gap: '2px' }}>
              <span className="preloader__logo-letter" style={{ animationDelay: '0s' }}>M</span>
              <sup className="preloader__logo-sup" style={{ fontSize: '0.55em', color: '#a78bfa', alignSelf: 'flex-start', marginTop: '0.3em' }}>2</sup>
            </div>

            <motion.p
              className="preloader__tagline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              Loading 3D Experience
            </motion.p>

            {/* Progress bar */}
            <div className="preloader__bar">
              <motion.div
                className="preloader__bar-fill"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.4, duration: 1.8, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>

          {/* Background particles */}
          <div className="preloader__particles">
            {Array.from({ length: 20 }).map((_, i) => (
              <span
                key={i}
                className="preloader__particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 3}s`,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
