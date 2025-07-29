'use client'

import { useState, useEffect } from 'react'
import { Profile } from '@/types'
import { Button } from '@/components/ui/button'
import { UserForm } from './UserForm'
import { Edit, Trash2, Plus, Shield, User, Key } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { 
  getUsers, 
  createUser, 
  updateUserProfile, 
  deleteUser,
  resetUserPassword 
} from '@/lib/api/users'

export function UserManagement() {
  const { profile: currentUser } = useAuth()
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<Profile | null>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await getUsers()
      setUsers(data)
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (userData: {
    email: string
    name: string
    role: 'admin' | 'groomer'
    password?: string
  }) => {
    if (!userData.password) return

    try {
      const newUser = await createUser(userData.email, userData.password, userData.name, userData.role)
      setUsers(prev => [newUser, ...prev])
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  const handleUpdate = async (userData: {
    email: string
    name: string
    role: 'admin' | 'groomer'
  }) => {
    if (!editingUser) return

    try {
      const updatedUser = await updateUserProfile(editingUser.id, {
        name: userData.name,
        role: userData.role,
      })
      setUsers(prev => 
        prev.map(user => 
          user.id === editingUser.id ? updatedUser : user
        )
      )
      setEditingUser(null)
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  const handleDelete = async (user: Profile) => {
    if (user.id === currentUser?.id) {
      alert('자신의 계정은 삭제할 수 없습니다.')
      return
    }

    if (!confirm(`${user.name} (${user.email}) 사용자를 삭제하시겠습니까?`)) {
      return
    }

    try {
      await deleteUser(user.id)
      setUsers(prev => prev.filter(u => u.id !== user.id))
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('사용자 삭제 중 오류가 발생했습니다.')
    }
  }

  const handleResetPassword = async (user: Profile) => {
    const newPassword = prompt(`${user.name}의 새 비밀번호를 입력하세요 (6자 이상):`)
    
    if (!newPassword) return
    if (newPassword.length < 6) {
      alert('비밀번호는 6자 이상이어야 합니다.')
      return
    }

    try {
      await resetUserPassword(user.id, newPassword)
      alert('비밀번호가 성공적으로 변경되었습니다.')
    } catch (error) {
      console.error('Error resetting password:', error)
      alert('비밀번호 변경 중 오류가 발생했습니다.')
    }
  }

  const handleEdit = (user: Profile) => {
    setEditingUser(user)
    setFormOpen(true)
  }

  const handleFormClose = () => {
    setFormOpen(false)
    setEditingUser(null)
  }

  const getRoleLabel = (role: string) => {
    return role === 'admin' ? '관리자' : '미용사'
  }

  const getRoleIcon = (role: string) => {
    return role === 'admin' ? Shield : User
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // 관리자만 사용자 관리 가능
  if (currentUser?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <div className="text-gray-500">관리자만 사용자 관리에 접근할 수 있습니다.</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">사용자 관리</h3>
          <p className="text-sm text-gray-600">시스템 사용자 계정을 관리합니다</p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          새 사용자
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {users.map((user) => {
          const RoleIcon = getRoleIcon(user.role)
          const isCurrentUser = user.id === currentUser?.id

          return (
            <div key={user.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${user.role === 'admin' ? 'bg-purple-100' : 'bg-blue-100'}`}>
                    <RoleIcon className={`h-5 w-5 ${user.role === 'admin' ? 'text-purple-600' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {user.name}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          본인
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {getRoleLabel(user.role)}
                      </span>
                      <span className="text-xs text-gray-500">
                        가입일: {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleResetPassword(user)}
                    className="h-8 w-8"
                    title="비밀번호 재설정"
                  >
                    <Key className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(user)}
                    className="h-8 w-8"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {!isCurrentUser && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(user)}
                      className="h-8 w-8 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-500 mb-4">등록된 사용자가 없습니다.</div>
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            첫 번째 사용자 생성하기
          </Button>
        </div>
      )}

      {/* User Form Modal */}
      <UserForm
        user={editingUser}
        open={formOpen}
        onOpenChange={handleFormClose}
        onSubmit={editingUser ? handleUpdate : handleCreate}
      />
    </div>
  )
}