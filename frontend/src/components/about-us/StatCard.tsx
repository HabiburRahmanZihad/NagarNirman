'use client'

import { useEffect, useState } from 'react'

interface StatCardProps {
  number: string
  label: string
  icon: string
  delay?: number
}

export default function StatCard({ number, label, icon, delay = 0 }: StatCardProps) {
  const [count, setCount] = useState(0)
  const numericValue = parseInt(number.replace(/[^0-9]/g, ''))
  const suffix = number.replace(/[0-9]/g, '')

  useEffect(() => {
    const timer = setTimeout(() => {
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
    <div className="card bg-primary/20 backdrop-blur-sm border border-primary/30">
      <div className="card-body items-center text-center p-6">
        <div className="text-4xl mb-2">{icon}</div>
        <div className="text-3xl md:text-4xl font-bold mb-1">
          {count.toLocaleString()}
          {suffix}
        </div>
        <p className="text-primary-content/80">{label}</p>
      </div>
    </div>
  )
}