# 디어펫살롱 - 반려견 미용 예약 관리 시스템

디어펫살롱을 위한 웹 기반 반려견 미용 예약 관리 시스템입니다. 예약 관리, 고객 관리, 매출 분석, 시스템 설정 기능을 제공합니다.

## 🚀 주요 기능

### 📅 예약 관리
- 달력 및 리스트 형태의 예약 뷰
- 시간 클릭으로 간편한 예약 등록
- 서비스별 자동 시간 계산
- 예약 색상 커스터마이징
- 실시간 예약 상태 동기화

### 👥 고객 관리
- 보호자 및 반려견 정보 관리
- 카드 기반 고객 목록
- 고객 검색 및 자동완성
- 예약 이력 및 메모 관리

### 💰 매출 관리
- 서비스별 매출 분석
- 일간/주간/월간 매출 통계
- 시각적 차트 및 그래프
- 매출 데이터 내보내기

### ⚙️ 시스템 설정
- 알림톡 템플릿 관리
- 사용자 계정 및 권한 관리
- 역할 기반 접근 제어

## 🛠 기술 스택

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **UI Components**: Radix UI, Lucide React
- **State Management**: Zustand, TanStack Query
- **Charts**: Recharts
- **Testing**: Jest, React Testing Library
- **Deployment**: Vercel

## 📋 시스템 요구사항

- Node.js 18.0 이상
- npm 또는 yarn
- Supabase 계정
- Vercel 계정 (배포용)

## 🚀 시작하기

### 1. 저장소 클론

\`\`\`bash
git clone <repository-url>
cd dear-pet-salon
\`\`\`

### 2. 의존성 설치

\`\`\`bash
npm install
\`\`\`

### 3. 환경 변수 설정

\`.env.example\` 파일을 \`.env.local\`로 복사하고 필요한 값들을 설정합니다:

\`\`\`bash
cp .env.example .env.local
\`\`\`

### 4. Supabase 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. \`supabase/schema.sql\` 파일의 SQL을 실행하여 데이터베이스 스키마 생성
3. 환경 변수에 Supabase URL과 anon key 설정

### 5. 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션을 확인합니다.

## 🧪 테스트

### 단위 테스트 실행

\`\`\`bash
npm run test
\`\`\`

### 테스트 감시 모드

\`\`\`bash
npm run test:watch
\`\`\`

### 커버리지 리포트

\`\`\`bash
npm run test:coverage
\`\`\`

## 🚀 배포

### Vercel 배포 (권장)

1. [Vercel](https://vercel.com)에 GitHub 저장소 연결
2. 프로젝트 설정에서 환경 변수 추가:
   - \`NEXT_PUBLIC_SUPABASE_URL\`: Supabase 프로젝트 URL
   - \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`: Supabase anon key
3. 배포 완료! 이후 main 브랜치에 푸시할 때마다 자동 배포됩니다.

### 로컬에서 프로덕션 빌드 테스트

\`\`\`bash
npm run build
npm run start
\`\`\`

## 📁 프로젝트 구조

\`\`\`
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 인증 관련 페이지
│   ├── (dashboard)/       # 대시보드 페이지
│   └── globals.css        # 전역 스타일
├── components/            # React 컴포넌트
│   ├── ui/               # 기본 UI 컴포넌트
│   ├── layout/           # 레이아웃 컴포넌트
│   ├── booking/          # 예약 관련 컴포넌트
│   ├── customer/         # 고객 관련 컴포넌트
│   ├── revenue/          # 매출 관련 컴포넌트
│   └── settings/         # 설정 관련 컴포넌트
├── lib/                  # 유틸리티 및 설정
│   ├── api/             # API 함수
│   ├── supabase/        # Supabase 설정
│   ├── utils/           # 유틸리티 함수
│   └── providers/       # React 프로바이더
├── hooks/               # 커스텀 훅
├── types/               # TypeScript 타입 정의
└── contexts/            # React 컨텍스트
\`\`\`

## 🔧 개발 가이드

### 코딩 컨벤션

- TypeScript 사용 필수
- ESLint 및 Prettier 설정 준수
- 컴포넌트는 함수형으로 작성
- 커스텀 훅을 통한 로직 분리

### 커밋 메시지 컨벤션

\`\`\`
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드 및 설정 변경
\`\`\`

### 브랜치 전략

- \`main\`: 프로덕션 브랜치
- \`develop\`: 개발 브랜치
- \`feature/*\`: 기능 개발 브랜치
- \`hotfix/*\`: 긴급 수정 브랜치

## 📝 API 문서

### 주요 엔드포인트

- \`/api/customers\`: 고객 관리
- \`/api/bookings\`: 예약 관리
- \`/api/services\`: 서비스 관리
- \`/api/revenue\`: 매출 데이터

자세한 API 문서는 [API 문서](./docs/api.md)를 참조하세요.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your Changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the Branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 지원

문제가 발생하거나 질문이 있으시면 다음을 통해 연락해 주세요:

- 이슈 트래커: [GitHub Issues](https://github.com/your-repo/issues)
- 이메일: support@dearpetsalon.com

## 🙏 감사의 말

이 프로젝트는 다음 오픈소스 프로젝트들의 도움을 받았습니다:

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Recharts](https://recharts.org/)