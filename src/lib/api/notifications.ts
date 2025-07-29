import { supabase } from '@/lib/supabase/client'
import { NotificationTemplate } from '@/types'

export async function getNotificationTemplates(): Promise<NotificationTemplate[]> {
  const { data, error } = await supabase
    .from('notification_templates')
    .select('*')
    .order('name')

  if (error) throw error
  return data || []
}

export async function getNotificationTemplate(id: string): Promise<NotificationTemplate | null> {
  const { data, error } = await supabase
    .from('notification_templates')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createNotificationTemplate(template: Omit<NotificationTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<NotificationTemplate> {
  const { data, error } = await supabase
    .from('notification_templates')
    .insert({
      ...template,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateNotificationTemplate(id: string, template: Partial<Omit<NotificationTemplate, 'id' | 'created_at' | 'updated_at'>>): Promise<NotificationTemplate> {
  const { data, error } = await supabase
    .from('notification_templates')
    .update({
      ...template,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteNotificationTemplate(id: string): Promise<void> {
  const { error } = await supabase
    .from('notification_templates')
    .delete()
    .eq('id', id)

  if (error) throw error
}