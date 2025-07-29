'use client'

import { useState } from 'react'
import { NotificationTemplate } from '@/types'
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

interface NotificationTemplateFormProps {
  template?: NotificationTemplate | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Omit<NotificationTemplate, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
}

const templateVariables = [
  { key: '{date}', description: '예약 날짜' },
  { key: '{time}', description: '예약 시간' },
  { key: '{pet_name}', description: '반려견 이름' },
  { key: '{guardian_name}', description: '보호자 이름' },
  { key: '{services}', description: '서비스 목록' },
  { key: '{phone}', description: '연락처' },
  { key: '{memo}', description: '메모' },
]

export function NotificationTemplateForm({ template, open, onOpenChange, onSubmit }: NotificationTemplateFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: template?.name || '',
    template: template?.template || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSubmit({
        name: formData.name,
        template: formData.template,
      })
      onOpenChange(false)
      setFormData({ name: '', template: '' })
    } catch (error) {
      console.error('Error submitting template:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById('template') as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = formData.template
      const newText = text.substring(0, start) + variable + text.substring(end)
      
      setFormData(prev => ({ ...prev, template: newText }))
      
      // 커서 위치 조정
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + variable.length, start + variable.length)
      }, 0)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {template ? '알림톡 템플릿 수정' : '새 알림톡 템플릿'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">템플릿 이름 *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="예: 예약 확인, 예약 변경"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="template">템플릿 내용 *</Label>
            <textarea
              id="template"
              value={formData.template}
              onChange={(e) => handleChange('template', e.target.value)}
              className="flex min-h-[200px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="알림톡 메시지 내용을 입력하세요"
              required
            />
          </div>

          {/* 변수 삽입 버튼들 */}
          <div className="space-y-2">
            <Label>사용 가능한 변수</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {templateVariables.map((variable) => (
                <Button
                  key={variable.key}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => insertVariable(variable.key)}
                  className="justify-start text-xs"
                  title={variable.description}
                >
                  {variable.key}
                </Button>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              버튼을 클릭하여 템플릿에 변수를 삽입할 수 있습니다.
            </p>
          </div>

          {/* 미리보기 */}
          {formData.template && (
            <div className="space-y-2">
              <Label>미리보기</Label>
              <div className="p-3 bg-gray-50 rounded-md border text-sm whitespace-pre-wrap">
                {formData.template
                  .replace(/{date}/g, '2024년 1월 15일')
                  .replace(/{time}/g, '14:00')
                  .replace(/{pet_name}/g, '마루')
                  .replace(/{guardian_name}/g, '홍길동')
                  .replace(/{services}/g, '전체미용, 목욕')
                  .replace(/{phone}/g, '010-1234-5678')
                  .replace(/{memo}/g, '특이사항 없음')
                }
              </div>
            </div>
          )}
          
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
              {loading ? '저장 중...' : template ? '수정' : '생성'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}