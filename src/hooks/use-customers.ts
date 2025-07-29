import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Customer } from '@/types'
import { 
  getCustomers, 
  getCustomer, 
  createCustomer, 
  updateCustomer, 
  deleteCustomer,
  searchCustomers 
} from '@/lib/api/customers'
import { toast } from '@/hooks/use-toast'

export const CUSTOMERS_QUERY_KEY = 'customers'

export function useCustomers() {
  return useQuery({
    queryKey: [CUSTOMERS_QUERY_KEY],
    queryFn: getCustomers,
  })
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: [CUSTOMERS_QUERY_KEY, id],
    queryFn: () => getCustomer(id),
    enabled: !!id,
  })
}

export function useSearchCustomers(query: string) {
  return useQuery({
    queryKey: [CUSTOMERS_QUERY_KEY, 'search', query],
    queryFn: () => searchCustomers(query),
    enabled: query.length > 0,
    staleTime: 30 * 1000, // 30초
  })
}

export function useCreateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCustomer,
    onSuccess: (newCustomer) => {
      // 고객 목록 캐시 업데이트
      queryClient.setQueryData([CUSTOMERS_QUERY_KEY], (old: Customer[] = []) => [
        newCustomer,
        ...old,
      ])
      
      toast({
        title: '고객 등록 완료',
        description: `${newCustomer.pet_name} (${newCustomer.guardian_name}) 고객이 등록되었습니다.`,
        variant: 'success',
      })
    },
    onError: (error: any) => {
      toast({
        title: '고객 등록 실패',
        description: error.message || '고객 등록 중 오류가 발생했습니다.',
        variant: 'destructive',
      })
    },
  })
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Customer, 'id' | 'created_at' | 'updated_at'>> }) =>
      updateCustomer(id, data),
    onSuccess: (updatedCustomer) => {
      // 고객 목록 캐시 업데이트
      queryClient.setQueryData([CUSTOMERS_QUERY_KEY], (old: Customer[] = []) =>
        old.map((customer) =>
          customer.id === updatedCustomer.id ? updatedCustomer : customer
        )
      )
      
      // 개별 고객 캐시 업데이트
      queryClient.setQueryData([CUSTOMERS_QUERY_KEY, updatedCustomer.id], updatedCustomer)
      
      toast({
        title: '고객 정보 수정 완료',
        description: `${updatedCustomer.pet_name} (${updatedCustomer.guardian_name}) 정보가 수정되었습니다.`,
        variant: 'success',
      })
    },
    onError: (error: any) => {
      toast({
        title: '고객 정보 수정 실패',
        description: error.message || '고객 정보 수정 중 오류가 발생했습니다.',
        variant: 'destructive',
      })
    },
  })
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: (_, deletedId) => {
      // 고객 목록 캐시에서 제거
      queryClient.setQueryData([CUSTOMERS_QUERY_KEY], (old: Customer[] = []) =>
        old.filter((customer) => customer.id !== deletedId)
      )
      
      // 개별 고객 캐시 제거
      queryClient.removeQueries({ queryKey: [CUSTOMERS_QUERY_KEY, deletedId] })
      
      toast({
        title: '고객 삭제 완료',
        description: '고객 정보가 삭제되었습니다.',
        variant: 'success',
      })
    },
    onError: (error: any) => {
      toast({
        title: '고객 삭제 실패',
        description: error.message || '고객 삭제 중 오류가 발생했습니다.',
        variant: 'destructive',
      })
    },
  })
}