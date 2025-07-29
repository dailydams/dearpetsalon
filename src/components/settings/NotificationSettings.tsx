'use client'

import { useState, useEffect } from 'react'
import { NotificationTemplate } from '@/types'
import { Button } from '@/components/ui/button'
import { NotificationTemplateForm } from './NotificationTemplateForm'
import { Edit, Trash2, Plus, MessageSquare } from 'lucide-react'
import { 
  getNotificationTemplates, 
  createNotificationTemplate, 
  updateNotificationTemplate, 
  deleteNotificationTemplate 
} from '@/lib/api/notifications'

export function NotificationSettings() {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null)

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      setLoading(true)
      const data = await getNotificationTemplates()
      setTemplates(data)
    } catch (error) {
      console.error('Error loading templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (templateData: Omit<NotificationTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newTemplate = await createNotificationTemplate(templateData)
      setTemplates(prev => [...prev, newTemplate])
    } catch (error) {
      console.error('Error creating template:', error)
      throw error
    }
  }

  const handleUpdate = async (templateData: Omit<NotificationTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingTemplate) return

    try {
      const updatedTemplate = await updateNotificationTemplate(editingTemplate.id, templateData)
      setTemplates(prev => 
        prev.map(template => 
          template.id === editingTemplate.id ? updatedTemplate : template
        )
      )
      setEditingTemplate(null)
    } catch (error) {
      console.error('Error updating template:', error)
      throw error
    }
  }

  const handleDelete = async (template: NotificationTemplate) => {
    if (!confirm(`"${template.name}" 템플릿을 삭제하시겠습니까?`)) {
      return
    }

    try {
      await deleteNotificationTemplate(template.id)
      setTemplates(prev => prev.filter(t => t.id !== template.id))
    } catch (error) {
      console.error('Error deleting template:', error)
    }
  }

  const handleEdit = (template: NotificationTemplate) => {
    setEditingTemplate(template)
    setFormOpen(true)
  }

  const handleFormClose = () => {
    setFormOpen(false)
    setEditingTemplate(null)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">알림톡 템플릿</h3>
          <p className="text-sm text-gray-600">고객에게 발송할 알림톡 메시지 템플릿을 관리합니다</p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          새 템플릿
        </Button>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-500 mb-4">등록된 알림톡 템플릿이 없습니다.</div>
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            첫 번째 템플릿 만들기
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{template.name}</h4>
                  <p className="text-sm text-gray-500">
                    수정일: {new Date(template.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(template)}
                    className="h-8 w-8"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(template)}
                    className="h-8 w-8 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-md p-3">
                <div className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-6">
                  {template.template}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <h5 className="text-sm font-medium text-gray-900 mb-2">미리보기</h5>
                <div className="text-sm text-gray-600 whitespace-pre-wrap">
                  {template.template
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
            </div>
          ))}
        </div>
      )}

      {/* Template Form Modal */}
      <NotificationTemplateForm
        template={editingTemplate}
        open={formOpen}
        onOpenChange={handleFormClose}
        onSubmit={editingTemplate ? handleUpdate : handleCreate}
      />
    </div>
  )
}