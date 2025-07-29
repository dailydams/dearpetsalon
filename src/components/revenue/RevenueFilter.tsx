'use client'

import { useState } from 'react'
import { format, subDays, subWeeks, subMonths, startOfDay, endOfDay } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar, Download } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export type DateRange = {
  startDate: string
  endDate: string
  label: string
}

interface RevenueFilterProps {
  selectedRange: DateRange
  onRangeChange: (range: DateRange) => void
  onExport?: () => void
}

const presetRanges = [
  {
    label: '오늘',
    getValue: () => {
      const today = new Date()
      return {
        startDate: startOfDay(today).toISOString(),
        endDate: endOfDay(today).toISOString(),
        label: '오늘'
      }
    }
  },
  {
    label: '어제',
    getValue: () => {
      const yesterday = subDays(new Date(), 1)
      return {
        startDate: startOfDay(yesterday).toISOString(),
        endDate: endOfDay(yesterday).toISOString(),
        label: '어제'
      }
    }
  },
  {
    label: '최근 7일',
    getValue: () => {
      const today = new Date()
      const weekAgo = subDays(today, 6)
      return {
        startDate: startOfDay(weekAgo).toISOString(),
        endDate: endOfDay(today).toISOString(),
        label: '최근 7일'
      }
    }
  },
  {
    label: '최근 30일',
    getValue: () => {
      const today = new Date()
      const monthAgo = subDays(today, 29)
      return {
        startDate: startOfDay(monthAgo).toISOString(),
        endDate: endOfDay(today).toISOString(),
        label: '최근 30일'
      }
    }
  },
  {
    label: '이번 달',
    getValue: () => {
      const today = new Date()
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      return {
        startDate: startOfDay(startOfMonth).toISOString(),
        endDate: endOfDay(today).toISOString(),
        label: '이번 달'
      }
    }
  },
  {
    label: '지난 달',
    getValue: () => {
      const today = new Date()
      const lastMonth = subMonths(today, 1)
      const startOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1)
      const endOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0)
      return {
        startDate: startOfDay(startOfLastMonth).toISOString(),
        endDate: endOfDay(endOfLastMonth).toISOString(),
        label: '지난 달'
      }
    }
  }
]

export function RevenueFilter({ selectedRange, onRangeChange, onExport }: RevenueFilterProps) {
  const [customMode, setCustomMode] = useState(false)
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')

  const handlePresetClick = (preset: typeof presetRanges[0]) => {
    const range = preset.getValue()
    onRangeChange(range)
    setCustomMode(false)
  }

  const handleCustomApply = () => {
    if (!customStartDate || !customEndDate) {
      alert('시작일과 종료일을 모두 선택해주세요.')
      return
    }

    const startDate = startOfDay(new Date(customStartDate)).toISOString()
    const endDate = endOfDay(new Date(customEndDate)).toISOString()
    
    const range: DateRange = {
      startDate,
      endDate,
      label: `${format(new Date(customStartDate), 'M/d', { locale: ko })} - ${format(new Date(customEndDate), 'M/d', { locale: ko })}`
    }
    
    onRangeChange(range)
  }

  const toggleCustomMode = () => {
    setCustomMode(!customMode)
    if (!customMode) {
      // 현재 선택된 범위를 커스텀 입력에 설정
      const start = new Date(selectedRange.startDate)
      const end = new Date(selectedRange.endDate)
      setCustomStartDate(format(start, 'yyyy-MM-dd'))
      setCustomEndDate(format(end, 'yyyy-MM-dd'))
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">기간 선택</h3>
          </div>

          {!customMode ? (
            <div className="flex flex-wrap gap-2">
              {presetRanges.map((preset) => (
                <Button
                  key={preset.label}
                  variant={selectedRange.label === preset.label ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePresetClick(preset)}
                  className="text-sm"
                >
                  {preset.label}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleCustomMode}
                className="text-sm"
              >
                직접 선택
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">시작일</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">종료일</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" onClick={handleCustomApply}>
                  적용
                </Button>
                <Button variant="outline" size="sm" onClick={toggleCustomMode}>
                  취소
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            <div className="font-medium">선택된 기간</div>
            <div>{selectedRange.label}</div>
          </div>
          
          {onExport && (
            <Button variant="outline" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              내보내기
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}