'use client'

import { useState, useEffect } from 'react'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'
import { ko } from 'date-fns/locale'
import { RevenueFilter, DateRange } from './RevenueFilter'
import { RevenueStats } from './RevenueStats'
import { RevenueChart } from './RevenueChart'
import { Button } from '@/components/ui/button'
import { BarChart3, PieChart, TrendingUp } from 'lucide-react'
import { 
  getRevenueByDateRange, 
  getServiceRevenue, 
  getTotalRevenue,
  RevenueData,
  ServiceRevenueData 
} from '@/lib/api/revenue'

type ChartType = 'pie' | 'bar' | 'line'

export function RevenueManager() {
  const [selectedRange, setSelectedRange] = useState<DateRange>(() => {
    const today = new Date()
    const weekAgo = subDays(today, 6)
    return {
      startDate: startOfDay(weekAgo).toISOString(),
      endDate: endOfDay(today).toISOString(),
      label: '최근 7일'
    }
  })
  
  const [chartType, setChartType] = useState<ChartType>('pie')
  const [loading, setLoading] = useState(true)
  const [totalStats, setTotalStats] = useState({
    total: 0,
    bookings: 0,
    avgPerBooking: 0
  })
  const [serviceData, setServiceData] = useState<ServiceRevenueData[]>([])
  const [dailyData, setDailyData] = useState<RevenueData[]>([])

  useEffect(() => {
    loadRevenueData()
  }, [selectedRange])

  const loadRevenueData = async () => {
    try {
      setLoading(true)
      
      const [totalData, serviceRevenueData, dailyRevenueData] = await Promise.all([
        getTotalRevenue(selectedRange.startDate, selectedRange.endDate),
        getServiceRevenue(selectedRange.startDate, selectedRange.endDate),
        getRevenueByDateRange(selectedRange.startDate, selectedRange.endDate)
      ])

      setTotalStats(totalData)
      setServiceData(serviceRevenueData)
      setDailyData(dailyRevenueData)
    } catch (error) {
      console.error('Error loading revenue data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    // CSV 내보내기 기능
    const csvData = [
      ['날짜', '매출', '예약 수'],
      ...dailyData.map(item => [
        format(new Date(item.date), 'yyyy-MM-dd'),
        item.total.toString(),
        item.bookings.toString()
      ])
    ]

    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `매출_${selectedRange.label}_${format(new Date(), 'yyyyMMdd')}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
          <div className="h-80 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 기간 필터 */}
      <RevenueFilter
        selectedRange={selectedRange}
        onRangeChange={setSelectedRange}
        onExport={handleExport}
      />

      {/* 통계 카드 */}
      <RevenueStats
        totalRevenue={totalStats.total}
        totalBookings={totalStats.bookings}
        avgPerBooking={totalStats.avgPerBooking}
        period={selectedRange.label}
      />

      {/* 차트 컨트롤 */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">매출 분석</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant={chartType === 'pie' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('pie')}
          >
            <PieChart className="h-4 w-4 mr-1" />
            비율
          </Button>
          <Button
            variant={chartType === 'bar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('bar')}
          >
            <BarChart3 className="h-4 w-4 mr-1" />
            막대
          </Button>
          <Button
            variant={chartType === 'line' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('line')}
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            추이
          </Button>
        </div>
      </div>

      {/* 차트 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RevenueChart
          serviceData={serviceData}
          dailyData={dailyData}
          type={chartType}
        />
        
        {/* 서비스별 상세 정보 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">서비스별 상세</h3>
          <div className="space-y-4">
            {serviceData.length === 0 ? (
              <p className="text-gray-500 text-center py-8">데이터가 없습니다.</p>
            ) : (
              serviceData.map((service, index) => (
                <div key={service.service_name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4', '#F97316'][index % 8] }}
                    />
                    <div>
                      <div className="font-medium text-gray-900">{service.service_name}</div>
                      <div className="text-sm text-gray-500">{service.count}회</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      {service.revenue.toLocaleString()}원
                    </div>
                    <div className="text-sm text-gray-500">
                      {service.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}