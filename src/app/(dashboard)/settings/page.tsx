'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { NotificationSettings } from '@/components/settings/NotificationSettings'
import { UserManagement } from '@/components/settings/UserManagement'
import { Button } from '@/components/ui/button'
import { MessageSquare, Users, Settings as SettingsIcon } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

type SettingsTab = 'notifications' | 'users' | 'general'

const tabs = [
  {
    id: 'notifications' as SettingsTab,
    name: '알림톡 설정',
    icon: MessageSquare,
    description: '고객 알림톡 템플릿 관리'
  },
  {
    id: 'users' as SettingsTab,
    name: '사용자 관리',
    icon: Users,
    description: '계정 및 권한 관리'
  },
  {
    id: 'general' as SettingsTab,
    name: '일반 설정',
    icon: SettingsIcon,
    description: '시스템 기본 설정'
  }
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('notifications')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'notifications':
        return <NotificationSettings />
      case 'users':
        return <UserManagement />
      case 'general':
        return (
          <div className="text-center py-12">
            <SettingsIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <div className="text-gray-500">일반 설정 기능은 준비 중입니다.</div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div>
      <Header 
        title="설정" 
        description="시스템 설정을 관리합니다"
      />
      
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg border border-gray-200 p-1">
          <div className="flex flex-col space-y-1 sm:flex-row sm:space-y-0">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  className={cn(
                    "flex-1 justify-start h-auto p-3 sm:p-4 text-left",
                    activeTab === tab.id && "bg-purple-600 text-white"
                  )}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="font-medium truncate">{tab.name}</div>
                      <div className={cn(
                        "text-xs truncate",
                        activeTab === tab.id ? "text-purple-100" : "text-gray-500"
                      )}>
                        {tab.description}
                      </div>
                    </div>
                  </div>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}