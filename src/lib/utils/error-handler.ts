export class AppError extends Error {
  constructor(message: string, public code: string, public statusCode: number = 500) {
    super(message)
    this.name = 'AppError'
  }
}

export const handleSupabaseError = (error: any): string => {
  if (!error) return '알 수 없는 오류가 발생했습니다.'

  // Supabase 특정 오류 코드 처리
  switch (error.code) {
    case 'PGRST116':
      return '데이터를 찾을 수 없습니다.'
    case '23505':
      return '이미 존재하는 데이터입니다.'
    case '23503':
      return '참조된 데이터가 존재하지 않습니다.'
    case '42501':
      return '권한이 없습니다.'
    case 'auth/invalid-email':
      return '유효하지 않은 이메일 주소입니다.'
    case 'auth/user-not-found':
      return '사용자를 찾을 수 없습니다.'
    case 'auth/wrong-password':
      return '비밀번호가 올바르지 않습니다.'
    case 'auth/too-many-requests':
      return '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.'
    case 'auth/network-request-failed':
      return '네트워크 연결을 확인해주세요.'
    default:
      return error.message || '오류가 발생했습니다.'
  }
}

export const logError = (error: any, context?: string) => {
  console.error(`[${context || 'Unknown'}] Error:`, error)
  
  // 프로덕션 환경에서는 외부 로깅 서비스로 전송
  if (process.env.NODE_ENV === 'production') {
    // 예: Sentry, LogRocket 등으로 전송
  }
}