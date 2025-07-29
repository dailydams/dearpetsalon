#!/bin/bash

# Vercel 배포 전 검증 스크립트
set -e

echo "🚀 Starting pre-deployment checks..."

# 환경 변수 확인
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "❌ Error: Required environment variables are not set"
    echo "Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
    exit 1
fi

# 의존성 설치
echo "📦 Installing dependencies..."
npm ci

# 린트 검사
echo "🔍 Running linter..."
npm run lint

# 타입 체크
echo "🔧 Running type check..."
npx tsc --noEmit

# 테스트 실행
echo "🧪 Running tests..."
npm run test:ci

# 빌드 테스트
echo "🏗️ Testing build..."
npm run build

echo "✅ All checks passed! Ready for deployment."

# Vercel 배포
if [ "$1" = "--deploy" ]; then
    echo "🌐 Deploying to Vercel..."
    npx vercel --prod
    echo "🎉 Deployment completed!"
fi