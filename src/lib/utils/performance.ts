// 성능 측정 유틸리티
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private measurements: Map<string, number> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  // 측정 시작
  start(label: string): void {
    this.measurements.set(label, performance.now())
  }

  // 측정 종료 및 결과 반환
  end(label: string): number {
    const startTime = this.measurements.get(label)
    if (!startTime) {
      console.warn(`Performance measurement '${label}' was not started`)
      return 0
    }

    const duration = performance.now() - startTime
    this.measurements.delete(label)

    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`)
    }

    return duration
  }

  // 함수 실행 시간 측정
  measure<T>(label: string, fn: () => T): T {
    this.start(label)
    const result = fn()
    this.end(label)
    return result
  }

  // 비동기 함수 실행 시간 측정
  async measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.start(label)
    const result = await fn()
    this.end(label)
    return result
  }
}

// 전역 인스턴스
export const performanceMonitor = PerformanceMonitor.getInstance()

// React 컴포넌트 렌더링 시간 측정 훅
export function useRenderTime(componentName: string) {
  if (process.env.NODE_ENV === 'development') {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      console.log(`🎨 ${componentName} render time: ${(endTime - startTime).toFixed(2)}ms`)
    }
  }
  
  return () => {}
}

// 메모리 사용량 모니터링
export function logMemoryUsage(label?: string): void {
  if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
    const memory = (performance as any).memory
    const used = Math.round(memory.usedJSHeapSize / 1024 / 1024)
    const total = Math.round(memory.totalJSHeapSize / 1024 / 1024)
    const limit = Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
    
    console.log(`🧠 Memory ${label ? `(${label})` : ''}: ${used}MB / ${total}MB (limit: ${limit}MB)`)
  }
}

// 번들 크기 분석을 위한 동적 임포트 래퍼
export async function lazyImport<T>(
  importFn: () => Promise<T>,
  componentName: string
): Promise<T> {
  if (process.env.NODE_ENV === 'development') {
    console.log(`📦 Loading ${componentName}...`)
    const startTime = performance.now()
    
    const module = await importFn()
    
    const loadTime = performance.now() - startTime
    console.log(`📦 ${componentName} loaded in ${loadTime.toFixed(2)}ms`)
    
    return module
  }
  
  return importFn()
}

// Web Vitals 측정
export function measureWebVitals(): void {
  if (typeof window !== 'undefined' && 'web-vitals' in window) {
    // Web Vitals 라이브러리가 있는 경우에만 측정
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log)
      getFID(console.log)
      getFCP(console.log)
      getLCP(console.log)
      getTTFB(console.log)
    }).catch(() => {
      // Web Vitals 라이브러리가 없는 경우 무시
    })
  }
}