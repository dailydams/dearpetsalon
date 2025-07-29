import { useQuery } from '@tanstack/react-query'
import { getServices, getService } from '@/lib/api/services'

export const SERVICES_QUERY_KEY = 'services'

export function useServices() {
  return useQuery({
    queryKey: [SERVICES_QUERY_KEY],
    queryFn: getServices,
    staleTime: 10 * 60 * 1000, // 10분 - 서비스는 자주 변경되지 않음
  })
}

export function useService(id: string) {
  return useQuery({
    queryKey: [SERVICES_QUERY_KEY, id],
    queryFn: () => getService(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  })
}