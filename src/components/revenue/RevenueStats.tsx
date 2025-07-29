'use client'

import { TrendingUp, Calendar, DollarSign, Users } from 'lucide-react'

interface RevenueStatsProps {
  totalRevenue: number
  totalBookings: number
  avgPerBooking: number
  period: string
}

export function RevenueStats({ totalRevenue, totalBookings, avgPerBooking, period }: RevenueStatsProps) {
  const stats = [
    {
      name: '총 매출',
      value: `${totalRevenue.toLocaleString()}원`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: '총 예약',
      value: `${totalBookings}건`,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: '예약당 평균',
      value: `${Math.round(avgPerBooking).toLocaleString()}원`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: '기간',
      value: period,
      icon: Users,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.name} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}