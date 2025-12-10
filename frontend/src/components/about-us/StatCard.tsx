'use client'

import { useEffect, useState } from 'react'
import { TrendingUp } from 'lucide-react'

interface StatCardProps {
  number: string
  label: string
  icon: string
  delay?: number
}

export default function StatCard({ number, label, icon, delay = 0 }: StatCardProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const numericValue = parseInt(number.replace(/[^0-9]/g, ''))
  const suffix = number.replace(/[0-9]/g, '')

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
      
      let start = 0
      const end = numericValue
      const duration = 2000
      const increment = end / (duration / 16)

      const counter = setInterval(() => {
        start += increment
        if (start >= end) {
          setCount(end)
          clearInterval(counter)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)

      return () => clearInterval(counter)
    }, delay)

    return () => clearTimeout(timer)
  }, [numericValue, delay])

  return (
    <div className="group relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-white/10 to-white/5 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative card bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl overflow-hidden">
        <div className="card-body items-center text-center p-10">
          {/* Icon */}
          <div className="text-6xl mb-8 transform group-hover:scale-110 transition-transform duration-500">
            {icon}
          </div>
          
          {/* Animated number */}
          <div className="relative">
            <div className="text-5xl md:text-6xl font-bold text-white mb-4">
              {isVisible ? (
                <>
                  {count.toLocaleString()}
                  <span className="text-[#ffcc33]">{suffix}</span>
                </>
              ) : (
                <span className="text-white/30">0</span>
              )}
            </div>
            
            {/* Growing bar animation */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent">
              <div
                className="h-full bg-gradient-to-r from-[#ffcc33] to-white transition-all duration-2000"
                style={{ width: isVisible ? '100%' : '0%' }}
              />
            </div>
          </div>
          
          {/* Label */}
          <p className="text-white/90 text-xl font-medium mt-8">{label}</p>
          
          {/* Trend indicator */}
          <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10">
              <TrendingUp className="w-4 h-4 text-[#ffcc33]" />
              <span className="text-white/80 text-sm">Growing daily</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}