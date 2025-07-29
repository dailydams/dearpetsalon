import { supabase } from '@/lib/supabase/client'
import { Profile } from '@/types'

export async function getUsers(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function createUser(email: string, password: string, name: string, role: 'admin' | 'groomer'): Promise<Profile> {
  // 1. Supabase Auth에 사용자 생성
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError) throw authError
  if (!authData.user) throw new Error('Failed to create user')

  // 2. 프로필 생성
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      email,
      name,
      role,
    })
    .select()
    .single()

  if (profileError) {
    // 프로필 생성 실패 시 Auth 사용자도 삭제
    await supabase.auth.admin.deleteUser(authData.user.id)
    throw profileError
  }

  return profileData
}

export async function updateUserProfile(id: string, updates: Partial<Omit<Profile, 'id' | 'created_at'>>): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteUser(id: string): Promise<void> {
  // 1. 프로필 삭제
  const { error: profileError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id)

  if (profileError) throw profileError

  // 2. Auth 사용자 삭제
  const { error: authError } = await supabase.auth.admin.deleteUser(id)
  if (authError) throw authError
}

export async function resetUserPassword(id: string, newPassword: string): Promise<void> {
  const { error } = await supabase.auth.admin.updateUserById(id, {
    password: newPassword
  })

  if (error) throw error
}