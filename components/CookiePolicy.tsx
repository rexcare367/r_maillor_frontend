'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { X } from 'lucide-react'

const COOKIE_CONSENT_KEY = 'meillor-cookie-consent'

export default function CookiePolicy() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      // Show popup after a short delay for better UX
      const timer = setTimeout(() => {
        setOpen(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted')
    setOpen(false)
  }

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined')
    setOpen(false)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 pointer-events-none"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="relative rounded-2xl border border-white/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl pointer-events-auto p-4 sm:p-6"
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                aria-label="Close cookie policy"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pr-8 sm:pr-0">
                <div className="flex-1 space-y-2">
                  <h3 className="text-base font-semibold text-foreground">
                    We use cookies
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                    By clicking &quot;Accept All&quot;, you consent to our use of cookies.{' '}
                    <Link 
                      href="/privacy" 
                      className="text-primary hover:underline font-medium"
                      onClick={(e) => {
                        e.preventDefault()
                        setOpen(false)
                        router.push('/privacy')
                      }}
                    >
                      Learn more
                    </Link>
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    onClick={handleDecline}
                    className="w-full sm:w-auto border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Decline
                  </Button>
                  <Button
                    onClick={handleAccept}
                    className="w-full sm:w-auto"
                  >
                    Accept All
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
