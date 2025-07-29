'use client'

import { useState, useEffect } from 'react'
import { Service } from '@/types'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { calculateBookingDuration } from '@/lib/utils/service-duration'
import { getServices } from '@/lib/api/services'
import { Clock } from 'lucide-react'

interface ServiceSelectorProps {
  selectedServiceIds: string[]
  onServiceChange: (serviceIds: string[], duration: number) => void
}

export function ServiceSelector({ selectedServiceIds, onServiceChange }: ServiceSelectorProps) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadServices()
  }, [])

  useEffect(() => {
    if (services.length > 0) {
      const duration = calculateBookingDuration(selectedServiceIds, services)
      onServiceChange(selectedServiceIds, duration)
    }
  }, [selectedServiceIds, services])

  const loadServices = async () => {
    try {
      const data = await getServices()
      setServices(data)
    } catch (error) {
      console.error('Error loading services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleServiceToggle = (serviceId: string) => {
    const newSelectedIds = selectedServiceIds.includes(serviceId)
      ? selectedServiceIds.filter(id => id !== serviceId)
      : [...selectedServiceIds, serviceId]
    
    const duration = calculateBookingDuration(newSelectedIds, services)
    onServiceChange(newSelectedIds, duration)
  }

  const selectedServices = services.filter(s => selectedServiceIds.includes(s.id))
  const totalPrice = selectedServices.reduce((sum, service) => sum + (service.price || 0), 0)
  const duration = calculateBookingDuration(selectedServiceIds, services)

  if (loading) {
    return (
      <div className="space-y-2">
        <Label>서비스 선택</Label>
        <div className="grid grid-cols-2 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Label>서비스 선택 *</Label>
      
      <div className="grid grid-cols-1 gap-2">
        {services.map((service) => {
          const isSelected = selectedServiceIds.includes(service.id)
          return (
            <Button
              key={service.id}
              type="button"
              variant={isSelected ? "default" : "outline"}
              className="justify-start h-auto p-3"
              onClick={() => handleServiceToggle(service.id)}
            >
              <div className="text-left">
                <div className="font-medium">{service.name}</div>
                <div className="text-xs opacity-75">
                  {service.duration_hours}시간 • {service.price?.toLocaleString()}원
                </div>
              </div>
            </Button>
          )
        })}
      </div>

      {selectedServiceIds.length > 0 && (
        <div className="bg-purple-50 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">선택된 서비스:</span>
            <div className="flex items-center space-x-1 text-purple-600">
              <Clock className="h-4 w-4" />
              <span>{duration}시간</span>
            </div>
          </div>
          
          <div className="space-y-1">
            {selectedServices.map((service) => (
              <div key={service.id} className="flex justify-between text-xs text-gray-600">
                <span>{service.name}</span>
                <span>{service.price?.toLocaleString()}원</span>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-2 flex justify-between text-sm font-medium">
            <span>총 금액:</span>
            <span className="text-purple-600">{totalPrice.toLocaleString()}원</span>
          </div>
        </div>
      )}
    </div>
  )
}