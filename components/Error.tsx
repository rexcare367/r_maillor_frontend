'use client'

import React from 'react'
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ErrorProps {
  message?: string
  title?: string
  onRetry?: () => void
  showCard?: boolean
  variant?: 'default' | 'destructive'
}

const Error: React.FC<ErrorProps> = ({ 
  message = "Une erreur est survenue",
  title = "Erreur",
  onRetry,
  showCard = false,
  variant = 'default'
}) => {
  const variantClasses = {
    default: 'bg-red-50 border-red-200 text-red-800',
    destructive: 'bg-red-100 border-red-300 text-red-900'
  }

  const content = (
    <div className={`${variantClasses[variant]} ${showCard ? 'p-6' : 'p-4'} rounded-lg border`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="font-semibold mb-1">
            {title}
          </div>
          <div className="text-sm mb-3">
            {message}
          </div>
          {onRetry && (
            <Button 
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="text-red-700 border-red-300 hover:bg-red-100"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer
            </Button>
          )}
        </div>
      </div>
    </div>
  )

  if (showCard) {
    return (
      <Card className="border-red-200">
        {content}
      </Card>
    )
  }

  return content
}

export default Error
