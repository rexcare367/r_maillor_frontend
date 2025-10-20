'use client'

import React from 'react'
import Slider from 'react-slick'
import { Card } from "@/components/ui/card"
import { Lightbulb, TrendingUp, AlertTriangle, Star, Target, Zap } from "lucide-react"

// Import slick carousel CSS
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

interface AlertData {
  id: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  subtitle: string
  details: string[]
  bgColor: string
  borderColor: string
  iconColor: string
  textColor: string
  detailColor: string
}

const alertData: AlertData[] = [
  {
    id: 'price-alerts',
    icon: AlertTriangle,
    title: 'Alertes de prix en temps réel',
    subtitle: 'Opportunités limitées dans le temps',
    details: [
      '3 pièces avec prix en baisse',
      '2 ventes flash détectées',
      '1 opportunité unique'
    ],
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconColor: 'text-red-600',
    textColor: 'text-red-900',
    detailColor: 'text-red-800'
  },
  {
    id: 'premium-collection',
    icon: Star,
    title: 'Collection Premium disponible',
    subtitle: 'Pièces d\'exception ajoutées',
    details: [
      '5 pièces rares ajoutées',
      'Collection Napoléon III',
      'Certificats d\'authenticité inclus'
    ],
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    iconColor: 'text-purple-600',
    textColor: 'text-purple-900',
    detailColor: 'text-purple-800'
  },
  {
    id: 'investment-tips',
    icon: Target,
    title: 'Conseils d\'investissement IA',
    subtitle: 'Stratégies personnalisées',
    details: [
      'Portfolio optimisé pour vous',
      'Diversification recommandée',
      'ROI prévu: +12%'
    ],
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-600',
    textColor: 'text-green-900',
    detailColor: 'text-green-800'
  },
  {
    id: 'market-insights',
    icon: Zap,
    title: 'Insights marché instantanés',
    subtitle: 'Analyse en temps réel',
    details: [
      'Demande en hausse de 23%',
      'Nouveaux acheteurs actifs',
      'Tendance bullish confirmée'
    ],
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    iconColor: 'text-orange-600',
    textColor: 'text-orange-600',
    detailColor: 'text-orange-800'
  }
]

const AlertSlider: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  }

  return (
    <div style={{ margin: '2rem' }}>
      <Slider {...settings} className="alert-slider">
        {alertData.map((alert) => {
          const IconComponent = alert.icon
          return (
            <div key={alert.id} className="px-2">
              <Card className={`${alert.bgColor} ${alert.borderColor} p-4 h-full`}>
                <div className="flex gap-3">
                  <IconComponent className={`w-5 h-5 ${alert.iconColor} flex-shrink-0 mt-0.5`} />
                  <div className="flex-1">
                    <div className={`font-medium ${alert.textColor} mb-1`}>
                      {alert.title}
                    </div>
                    <div className={`text-sm ${alert.detailColor} mb-2`}>
                      {alert.subtitle}
                    </div>
                    <div className="space-y-1">
                      {alert.details.map((detail, index) => (
                        <div key={index} className={`text-sm ${alert.detailColor}`}>
                          • {detail}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )
        })}
      </Slider>
      
      {/* Custom CSS for slider styling */}
      <style jsx global>{`
        .alert-slider .slick-dots {
          bottom: -40px;
        }
        
        .alert-slider .slick-dots li button:before {
          color: #6b7280;
          font-size: 12px;
        }
        
        .alert-slider .slick-dots li.slick-active button:before {
          color: #000;
        }
        
        .alert-slider .slick-prev,
        .alert-slider .slick-next {
          z-index: 1;
          width: 30px;
          height: 30px;
        }
        
        .alert-slider .slick-prev {
          left: -35px;
        }
        
        .alert-slider .slick-next {
          right: -35px;
        }
        
        .alert-slider .slick-prev:before,
        .alert-slider .slick-next:before {
          color: #000;
          font-size: 20px;
        }
        
        @media (max-width: 768px) {
          .alert-slider .slick-prev {
            left: -25px;
          }
          
          .alert-slider .slick-next {
            right: -25px;
          }
        }
      `}</style>
    </div>
  )
}

export default AlertSlider