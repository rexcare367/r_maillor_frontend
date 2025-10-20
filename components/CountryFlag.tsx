import React from 'react'
import { getCountryFlagUrl, hasCountryFlag } from '@/lib/utils/countryFlags'

interface CountryFlagProps {
  /** Country name in any supported language */
  country: string
  /** CSS classes for the flag image */
  className?: string
  /** Alt text for the flag image */
  alt?: string
  /** Title attribute for the flag image */
  title?: string
  /** Size preset for the flag */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** Show fallback emoji for unknown countries */
  showFallback?: boolean
  /** Custom fallback content */
  fallback?: React.ReactNode
}

const sizeClasses = {
  xs: 'w-3 h-2',
  sm: 'w-4 h-3',
  md: 'w-6 h-4',
  lg: 'w-8 h-6',
  xl: 'w-10 h-6'
}

/**
 * CountryFlag component for displaying country flags globally
 */
export const CountryFlag: React.FC<CountryFlagProps> = ({
  country,
  className = '',
  alt,
  title,
  size = 'sm',
  showFallback = true,
  fallback
}) => {
  const flagUrl = getCountryFlagUrl(country)
  const hasFlag = hasCountryFlag(country)
  
  // If we have a flag URL, display the image
  if (flagUrl && hasFlag) {
    return (
      <img
        src={flagUrl}
        alt={alt || `${country} flag`}
        title={title || country}
        className={`${sizeClasses[size]} object-cover rounded-sm ${className}`}
      />
    )
  }
  
  // Show fallback if enabled
  if (showFallback) {
    if (fallback) {
      return <>{fallback}</>
    }
    return <span className="text-xs">🏳️</span>
  }
  
  // Return null if no fallback is wanted
  return null
}

export default CountryFlag
