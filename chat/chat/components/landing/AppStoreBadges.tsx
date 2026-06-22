"use client"

import Link from 'next/link'

interface AppStoreBadgesProps {
  size?: 'small' | 'medium' | 'large'
  showLabel?: boolean
  className?: string
}

export default function AppStoreBadges({ 
  size = 'medium', 
  showLabel = true, 
  className = '' 
}: AppStoreBadgesProps) {
  const sizeClasses = {
    small: 'px-2 py-1',
    medium: 'px-3 py-2',
    large: 'px-4 py-3'
  }

  const textClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  }

  return (
    <div className={className}>
      {showLabel && (
        <p className="text-sm text-muted-foreground mb-2">Available on:</p>
      )}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Google Play Store Badge */}
        <Link 
          href="https://play.google.com/store/apps/details?id=com.aichat.app"
          target="_blank" 
          rel="noopener noreferrer"
          className="group"
        >
          <div className={`bg-background/20 hover:bg-background/30 transition-colors rounded-lg ${sizeClasses[size]} flex items-center gap-2 w-full sm:w-auto border border-border/30`}>
            <div className="bg-foreground rounded w-8 h-8 flex items-center justify-center flex-shrink-0">
              <span className="text-background font-bold text-xs">G</span>
            </div>
            <div>
              <p className={`${textClasses[size]} text-muted-foreground`}>GET IT ON</p>
              <p className={`font-semibold text-foreground ${textClasses[size]}`}>Google Play</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}