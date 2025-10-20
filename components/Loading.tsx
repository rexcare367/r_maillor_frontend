'use client'

import React from 'react'
import { Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"

interface LoadingProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  fullHeight?: boolean
  showCard?: boolean
}

const Loading: React.FC<LoadingProps> = ({ 
  message = "Chargement...", 
  size = 'md',
  fullHeight = false,
  showCard = false
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  const content = (
    <div className={`flex items-center justify-center ${fullHeight ? 'min-h-screen' : 'py-12'}`}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-muted-foreground`} />
        <span className={`text-muted-foreground ${textSizeClasses[size]}`}>
          {message}
        </span>
      </div>
    </div>
  )

  if (showCard) {
    return (
      <Card className="p-6">
        {content}
      </Card>
    )
  }

  return content
}

export default Loading
