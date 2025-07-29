import { Service } from '@/types';

export function calculateBookingDuration(serviceIds: string[], services: Service[]): number {
  if (serviceIds.length === 0) return 0;
  
  const selectedServices = services.filter(s => serviceIds.includes(s.id));
  if (selectedServices.length === 0) return 0;
  
  // 특별 조합 규칙
  const serviceNames = selectedServices.map(s => s.name);
  
  // 부분미용 + 목욕 = 1시간
  if (serviceNames.includes('목욕') && serviceNames.includes('부분미용')) {
    return 1;
  }
  
  // 부분미용 + 목욕 + 얼컷 = 1시간 (PRD 요구사항)
  if (serviceNames.includes('목욕') && serviceNames.includes('부분미용') && serviceNames.includes('얼컷')) {
    return 1;
  }
  
  // 일반적인 경우: 가장 긴 서비스 시간 사용
  return Math.max(...selectedServices.map(s => s.duration_hours));
}

export function calculateEndTime(startTime: string, durationHours: number): string {
  const start = new Date(startTime);
  const end = new Date(start.getTime() + (durationHours * 60 * 60 * 1000));
  return end.toISOString();
}

export function calculateTotalPrice(serviceIds: string[], services: Service[]): number {
  const selectedServices = services.filter(s => serviceIds.includes(s.id));
  return selectedServices.reduce((sum, service) => sum + (service.price || 0), 0);
}