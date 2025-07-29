import { handleSupabaseError, AppError, logError } from '../error-handler'

// console.error를 모킹
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

describe('error-handler utils', () => {
  afterEach(() => {
    mockConsoleError.mockClear()
  })

  afterAll(() => {
    mockConsoleError.mockRestore()
  })

  describe('AppError', () => {
    it('should create AppError with correct properties', () => {
      const error = new AppError('Test error', 'TEST_CODE', 400)
      
      expect(error.message).toBe('Test error')
      expect(error.code).toBe('TEST_CODE')
      expect(error.statusCode).toBe(400)
      expect(error.name).toBe('AppError')
    })

    it('should use default status code 500', () => {
      const error = new AppError('Test error', 'TEST_CODE')
      
      expect(error.statusCode).toBe(500)
    })
  })

  describe('handleSupabaseError', () => {
    it('should return default message for null/undefined error', () => {
      expect(handleSupabaseError(null)).toBe('알 수 없는 오류가 발생했습니다.')
      expect(handleSupabaseError(undefined)).toBe('알 수 없는 오류가 발생했습니다.')
    })

    it('should handle PGRST116 error code', () => {
      const error = { code: 'PGRST116' }
      expect(handleSupabaseError(error)).toBe('데이터를 찾을 수 없습니다.')
    })

    it('should handle 23505 error code', () => {
      const error = { code: '23505' }
      expect(handleSupabaseError(error)).toBe('이미 존재하는 데이터입니다.')
    })

    it('should handle 23503 error code', () => {
      const error = { code: '23503' }
      expect(handleSupabaseError(error)).toBe('참조된 데이터가 존재하지 않습니다.')
    })

    it('should handle 42501 error code', () => {
      const error = { code: '42501' }
      expect(handleSupabaseError(error)).toBe('권한이 없습니다.')
    })

    it('should handle auth errors', () => {
      expect(handleSupabaseError({ code: 'auth/invalid-email' }))
        .toBe('유효하지 않은 이메일 주소입니다.')
      
      expect(handleSupabaseError({ code: 'auth/user-not-found' }))
        .toBe('사용자를 찾을 수 없습니다.')
      
      expect(handleSupabaseError({ code: 'auth/wrong-password' }))
        .toBe('비밀번호가 올바르지 않습니다.')
    })

    it('should return error message if available', () => {
      const error = { message: 'Custom error message' }
      expect(handleSupabaseError(error)).toBe('Custom error message')
    })

    it('should return default message for unknown error codes', () => {
      const error = { code: 'UNKNOWN_CODE' }
      expect(handleSupabaseError(error)).toBe('오류가 발생했습니다.')
    })
  })

  describe('logError', () => {
    it('should log error with context', () => {
      const error = new Error('Test error')
      const context = 'TestContext'
      
      logError(error, context)
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        `[${context}] Error:`,
        error
      )
    })

    it('should log error without context', () => {
      const error = new Error('Test error')
      
      logError(error)
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        '[Unknown] Error:',
        error
      )
    })
  })
})