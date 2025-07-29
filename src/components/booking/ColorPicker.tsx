'use client'

import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils/cn'

interface ColorPickerProps {
  selectedColor: string
  onColorChange: (color: string) => void
}

const colors = [
  { name: '보라색', value: '#8B5CF6' },
  { name: '파란색', value: '#3B82F6' },
  { name: '초록색', value: '#10B981' },
  { name: '노란색', value: '#F59E0B' },
  { name: '빨간색', value: '#EF4444' },
  { name: '분홍색', value: '#EC4899' },
  { name: '청록색', value: '#06B6D4' },
  { name: '주황색', value: '#F97316' },
]

export function ColorPicker({ selectedColor, onColorChange }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <Label>예약 색상</Label>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color.value}
            type="button"
            className={cn(
              "w-8 h-8 rounded-full border-2 transition-all",
              selectedColor === color.value
                ? "border-gray-400 scale-110"
                : "border-gray-200 hover:border-gray-300"
            )}
            style={{ backgroundColor: color.value }}
            onClick={() => onColorChange(color.value)}
            title={color.name}
          />
        ))}
      </div>
    </div>
  )
}