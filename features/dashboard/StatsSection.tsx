'use client'

import React from 'react'
import { Loader2 } from "lucide-react"

interface StatsSectionProps {
  loading?: boolean
  totalCoins?: number
}

const StatsSection: React.FC<StatsSectionProps> = ({ 
  loading = false, 
  totalCoins = 0 
}) => {
  const stats = [
    {
      value: '+9.4%',
      label: 'ROI prédit',
      color: '#0CA111'
    },
    {
      value: loading ? (
        <Loader2 className="w-8 h-8 animate-spin mx-auto" />
      ) : totalCoins,
      label: 'pièces analysées',
      color: 'inherit'
    },
    {
      value: '0.7K€',
      label: 'd\'or analysé',
      color: 'inherit'
    }
  ]

  return (
    <div className="flex flex-col md:flex-row gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="text-center flex-1">
          <div 
            className="text-3xl font-bold" 
            style={{ color: stat.color }}
          >
            {stat.value}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsSection
