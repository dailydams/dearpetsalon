'use client'

import { useState } from 'react'
import { Customer } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

interface CustomerFormProps {
  customer?: Customer | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
}

export function CustomerForm({ customer, open, onOpenChange, onSubmit }: CustomerFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    guardian_name: customer?.guardian_name || '',
    pet_name: customer?.pet_name || '',
    species: customer?.species || '',
    weight: customer?.weight?.toString() || '',
    phone: customer?.phone || '',
    memo: customer?.memo || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSubmit({
        guardian_name: formData.guardian_name,
        pet_name: formData.pet_name,
        species: formData.species || undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        phone: formData.phone || undefined,
        memo: formData.memo || undefined,
      })
      onOpenChange(false)
      setFormData({
        guardian_name: '',
        pet_name: '',
        species: '',
        weight: '',
        phone: '',
        memo: '',
      })
    } catch (error) {
      console.error('Error submitting customer form:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {customer ? '고객 정보 수정' : '새 고객 등록'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guardian_name">보호자명 *</Label>
              <Input
                id="guardian_name"
                value={formData.guardian_name}
                onChange={(e) => handleChange('guardian_name', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pet_name">반려견명 *</Label>
              <Input
                id="pet_name"
                value={formData.pet_name}
                onChange={(e) => handleChange('pet_name', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="species">견종</Label>
              <Input
                id="species"
                value={formData.species}
                onChange={(e) => handleChange('species', e.target.value)}
                placeholder="예: 푸들, 골든리트리버"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">체중 (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => handleChange('weight', e.target.value)}
                placeholder="예: 3.5"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">연락처</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="예: 010-1234-5678"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="memo">메모</Label>
            <textarea
              id="memo"
              value={formData.memo}
              onChange={(e) => handleChange('memo', e.target.value)}
              className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="특이사항이나 주의사항을 입력하세요"
            />
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              취소
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '저장 중...' : customer ? '수정' : '등록'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}