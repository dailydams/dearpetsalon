import { Header } from '@/components/layout/Header'
import { RevenueManager } from '@/components/revenue/RevenueManager'

export default function RevenuePage() {
  return (
    <div>
      <Header 
        title="매출 관리" 
        description="서비스별 매출을 확인하고 분석합니다"
      />
      <RevenueManager />
    </div>
  )
}