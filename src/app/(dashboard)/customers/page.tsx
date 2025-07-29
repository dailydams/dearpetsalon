import { Header } from '@/components/layout/Header'
import { CustomerList } from '@/components/customer/CustomerList'

export default function CustomersPage() {
  return (
    <div>
      <Header 
        title="고객 관리" 
        description="보호자와 반려견 정보를 관리합니다"
      />
      <CustomerList />
    </div>
  )
}