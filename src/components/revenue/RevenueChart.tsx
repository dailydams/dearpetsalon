'use client'

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { ServiceRevenueData, RevenueData } from '@/lib/api/revenue'

interface RevenueChartProps {
  serviceData: ServiceRevenueData[]
  dailyData: RevenueData[]
  type: 'pie' | 'bar' | 'line'
}

const COLORS = [
  '#8B5CF6', // 보라색
  '#3B82F6', // 파란색
  '#10B981', // 초록색
  '#F59E0B', // 노란색
  '#EF4444', // 빨간색
  '#EC4899', // 분홍색
  '#06B6D4', // 청록색
  '#F97316', // 주황색
]

export function RevenueChart({ serviceData, dailyData, type }: RevenueChartProps) {
  if (type === 'pie') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">서비스별 매출 비율</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={serviceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ service_name, percentage }) => `${service_name} (${percentage.toFixed(1)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="revenue"
              >
                {serviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value.toLocaleString()}원`, '매출']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }

  if (type === 'bar') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">서비스별 매출</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={serviceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="service_name" 
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toLocaleString()}원`, '매출']}
                labelFormatter={(label) => `서비스: ${label}`}
              />
              <Bar dataKey="revenue" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }

  if (type === 'line') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">일별 매출 추이</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return `${date.getMonth() + 1}/${date.getDate()}`
                }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toLocaleString()}원`, '매출']}
                labelFormatter={(label) => {
                  const date = new Date(label)
                  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
                }}
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }

  return null
}