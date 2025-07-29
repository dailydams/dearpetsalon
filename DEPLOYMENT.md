# 배포 가이드

## Vercel을 통한 배포

### 1. 사전 준비

1. **GitHub 저장소 준비**
   - 프로젝트를 GitHub에 푸시
   - main 브랜치가 최신 상태인지 확인

2. **Supabase 프로젝트 설정**
   - [Supabase](https://supabase.com)에서 프로젝트 생성
   - `supabase/schema.sql` 파일의 SQL 실행
   - Project URL과 anon key 확인

### 2. Vercel 배포

1. **Vercel 계정 생성 및 연결**
   ```bash
   # Vercel CLI 설치 (선택사항)
   npm i -g vercel
   ```

2. **GitHub 저장소 연결**
   - [Vercel Dashboard](https://vercel.com/dashboard)에서 "New Project" 클릭
   - GitHub 저장소 선택
   - Framework Preset: "Next.js" 자동 감지

3. **환경 변수 설정**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **배포 실행**
   - "Deploy" 버튼 클릭
   - 자동 빌드 및 배포 완료

### 3. 자동 배포 설정

- main 브랜치에 푸시할 때마다 자동 배포
- Pull Request 생성 시 Preview 배포
- 배포 상태는 GitHub에서 확인 가능

### 4. 도메인 설정 (선택사항)

1. Vercel Dashboard에서 프로젝트 선택
2. "Settings" → "Domains" 탭
3. 커스텀 도메인 추가
4. DNS 설정 완료

## 배포 전 체크리스트

- [ ] 모든 테스트 통과
- [ ] 린트 오류 없음
- [ ] 타입 체크 통과
- [ ] 환경 변수 설정 완료
- [ ] Supabase 스키마 적용 완료
- [ ] 프로덕션 빌드 테스트 완료

## 트러블슈팅

### 빌드 실패 시

1. **의존성 문제**
   ```bash
   # 로컬에서 확인
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **환경 변수 문제**
   - Vercel Dashboard에서 환경 변수 재확인
   - 변수명 오타 확인

3. **타입 오류**
   ```bash
   # 타입 체크
   npx tsc --noEmit
   ```

### 런타임 오류 시

1. **Supabase 연결 문제**
   - URL과 키 값 재확인
   - RLS 정책 확인

2. **API 오류**
   - Vercel Functions 로그 확인
   - 브라우저 개발자 도구 확인

## 성능 최적화

### Vercel Analytics 설정

1. Vercel Dashboard에서 Analytics 활성화
2. 성능 메트릭 모니터링
3. Core Web Vitals 확인

### 캐싱 최적화

- 정적 자산 자동 CDN 캐싱
- API 응답 캐싱 설정
- 이미지 최적화 자동 적용

## 모니터링

### 로그 확인

```bash
# Vercel CLI로 로그 확인
vercel logs
```

### 성능 모니터링

- Vercel Analytics 대시보드
- Lighthouse 점수 확인
- Real User Monitoring (RUM)

## 백업 및 복구

### 데이터베이스 백업

- Supabase 자동 백업 활용
- 정기적인 수동 백업 권장

### 코드 백업

- GitHub 저장소가 소스 코드 백업 역할
- 태그를 통한 버전 관리 권장