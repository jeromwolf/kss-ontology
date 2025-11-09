# KSS Ontology Web - Setup Guide

**작성일:** 2025-11-09  
**대상:** Claude Code  
**목적:** Next.js 프로젝트 초기 설정 완료

---

## 📋 목차

1. [시작 전 체크리스트](#1-시작-전-체크리스트)
2. [Step 1: 프로젝트 생성](#step-1-프로젝트-생성)
3. [Step 2: 필수 패키지 설치](#step-2-필수-패키지-설치)
4. [Step 3: 폴더 구조 생성](#step-3-폴더-구조-생성)
5. [Step 4: 설정 파일 작성](#step-4-설정-파일-작성)
6. [Step 5: Git 초기화](#step-5-git-초기화)
7. [Step 6: 첫 실행 테스트](#step-6-첫-실행-테스트)
8. [완료 체크리스트](#완료-체크리스트)

---

## 1. 시작 전 체크리스트

### 필수 요구사항
- [ ] Node.js 18+ 설치 확인: `node --version`
- [ ] npm 9+ 설치 확인: `npm --version`
- [ ] Git 설치 확인: `git --version`
- [ ] 작업 디렉토리 확인: 현재 위치가 적절한가?

### 권장 사항
- [ ] VS Code 또는 적절한 에디터 준비
- [ ] 터미널 접근 가능
- [ ] 인터넷 연결 확인

---

## Step 1: 프로젝트 생성

### 명령어
```bash
npx create-next-app@latest kss-ontology-web --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```

### 프롬프트 응답
```
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like to use `src/` directory? … No
✔ Would you like to use App Router? … Yes
✔ Would you like to customize the default import alias (@/*)? … No
```

### 프로젝트로 이동
```bash
cd kss-ontology-web
```

### 확인
```bash
ls -la
# 다음 파일들이 보여야 함:
# package.json
# next.config.js
# tailwind.config.ts
# tsconfig.json
# app/
```

---

## Step 2: 필수 패키지 설치

### 2.1 MDX 관련
```bash
npm install @next/mdx @mdx-js/loader @mdx-js/react
npm install remark-gfm rehype-highlight rehype-slug rehype-autolink-headings
npm install gray-matter
```

**설명:**
- `@next/mdx`: Next.js MDX 지원
- `remark-gfm`: GitHub Flavored Markdown (표, 체크박스 등)
- `rehype-highlight`: 코드 하이라이팅
- `rehype-slug`: 제목에 자동 ID 생성
- `rehype-autolink-headings`: 제목 자동 링크
- `gray-matter`: MDX frontmatter 파싱

### 2.2 UI 라이브러리
```bash
npm install lucide-react
npm install class-variance-authority clsx tailwind-merge
npm install framer-motion
```

**설명:**
- `lucide-react`: 아이콘
- `class-variance-authority`: 컴포넌트 variants
- `clsx`, `tailwind-merge`: 클래스 이름 유틸
- `framer-motion`: 애니메이션

### 2.3 shadcn/ui 초기화
```bash
npx shadcn@latest init
```

**프롬프트 응답:**
```
✔ Would you like to use TypeScript? … yes
✔ Which style would you like to use? › Default
✔ Which color would you like to use as base color? › Slate
✔ Where is your global CSS file? … app/globals.css
✔ Would you like to use CSS variables for colors? … yes
✔ Are you using a custom tailwind prefix? … no
✔ Where is your tailwind.config.js located? … tailwind.config.ts
✔ Configure the import alias for components: … @/components
✔ Configure the import alias for utils: … @/lib/utils
✔ Are you using React Server Components? … yes
```

### 2.4 shadcn/ui 컴포넌트 추가
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add badge
npx shadcn@latest add tabs
npx shadcn@latest add progress
npx shadcn@latest add separator
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
```

### 2.5 추가 유틸리티
```bash
npm install next-themes
npm install date-fns
```

**설명:**
- `next-themes`: 다크 모드
- `date-fns`: 날짜 포맷팅

### 설치 확인
```bash
npm list --depth=0
# 모든 패키지가 설치되었는지 확인
```

---

## Step 3: 폴더 구조 생성

### 3.1 주요 폴더 생성
```bash
mkdir -p app/chapters/\[slug\]
mkdir -p app/simulators/{rdf-editor,sparql-playground,reasoning-engine,knowledge-graph}
mkdir -p app/projects/\[id\]
mkdir -p app/about
mkdir -p app/roadmap
```

### 3.2 컴포넌트 폴더
```bash
mkdir -p components/layout
mkdir -p components/chapter
mkdir -p components/home
mkdir -p components/shared
```

### 3.3 콘텐츠 폴더
```bash
mkdir -p content/chapters
mkdir -p content/docs
```

### 3.4 기타 폴더
```bash
mkdir -p lib
mkdir -p types
mkdir -p config
mkdir -p public/images
mkdir -p public/icons
mkdir -p styles
```

### 3.5 빈 파일 생성 (구조 확인용)
```bash
touch config/site.ts
touch config/navigation.ts
touch types/chapter.ts
touch types/simulator.ts
touch lib/mdx.ts
touch lib/utils.ts
touch lib/constants.ts
touch styles/mdx.css
```

### 구조 확인
```bash
tree -L 2 -I 'node_modules'
# 또는
ls -R
```

**예상 구조:**
```
kss-ontology-web/
├── app/
│   ├── chapters/
│   ├── simulators/
│   ├── projects/
│   ├── about/
│   ├── roadmap/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── layout/
│   ├── chapter/
│   ├── home/
│   ├── shared/
│   └── ui/
├── content/
│   ├── chapters/
│   └── docs/
├── lib/
├── types/
├── config/
├── public/
├── styles/
├── package.json
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## Step 4: 설정 파일 작성

### 4.1 next.config.js 수정
```bash
# 현재 내용을 백업
cp next.config.js next.config.js.backup

# 새 내용으로 교체
# (CONFIG-FILES.md 참조)
```

### 4.2 tailwind.config.ts 수정
```bash
# 현재 내용을 백업
cp tailwind.config.ts tailwind.config.ts.backup

# 새 내용으로 교체
# (CONFIG-FILES.md 참조)
```

### 4.3 tsconfig.json 확인
```bash
cat tsconfig.json
# paths가 올바른지 확인
```

### 4.4 .gitignore 수정
```bash
# .gitignore에 추가
cat >> .gitignore << 'EOF'

# MDX
.mdx-data/

# Environment
.env
.env.local
.env*.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
EOF
```

---

## Step 5: Git 초기화

### 5.1 Git 저장소 초기화
```bash
git init
```

### 5.2 첫 커밋
```bash
git add .
git commit -m "Initial commit: Next.js 14 + TypeScript + Tailwind + MDX setup"
```

### 5.3 GitHub 원격 저장소 연결 (선택)
```bash
# GitHub에서 저장소 생성 후
git remote add origin https://github.com/jeromwolf/kss-ontology-web.git
git branch -M main
git push -u origin main
```

---

## Step 6: 첫 실행 테스트

### 6.1 개발 서버 실행
```bash
npm run dev
```

**예상 출력:**
```
   ▲ Next.js 14.2.x
   - Local:        http://localhost:3000
   - Network:      http://192.168.x.x:3000

 ✓ Ready in 2.5s
```

### 6.2 브라우저 확인
```
http://localhost:3000
```

**확인 사항:**
- [ ] 페이지가 로드되는가?
- [ ] Tailwind CSS가 적용되는가?
- [ ] 콘솔 에러가 없는가?

### 6.3 빌드 테스트
```bash
npm run build
```

**예상 출력:**
```
   ▲ Next.js 14.2.x
   - Building production bundle...
   ✓ Compiled successfully
   ✓ Linting and checking validity of types
   ✓ Collecting page data
   ✓ Generating static pages (5/5)
   ✓ Finalizing page optimization
```

### 6.4 타입 체크
```bash
npx tsc --noEmit
```

**예상 출력:**
```
# 에러 없음 (출력 없음이 정상)
```

---

## 완료 체크리스트

### Phase 1 완료 확인
- [ ] ✅ Next.js 프로젝트 생성됨
- [ ] ✅ 모든 패키지 설치됨 (npm list 확인)
- [ ] ✅ shadcn/ui 초기화됨
- [ ] ✅ 8개 shadcn 컴포넌트 설치됨
- [ ] ✅ 폴더 구조 생성됨
- [ ] ✅ 설정 파일 작성됨 (next.config.js, tailwind.config.ts)
- [ ] ✅ Git 초기화 및 첫 커밋
- [ ] ✅ 개발 서버 실행 확인 (npm run dev)
- [ ] ✅ 빌드 성공 확인 (npm run build)
- [ ] ✅ 타입 체크 통과 (npx tsc --noEmit)

### 확인 명령어 모음
```bash
# 프로젝트 디렉토리 확인
pwd

# 패키지 확인
npm list --depth=0

# 폴더 구조 확인
ls -R | head -50

# Git 상태 확인
git status

# 개발 서버 테스트
npm run dev
# Ctrl+C로 종료

# 빌드 테스트
npm run build

# 타입 체크
npx tsc --noEmit
```

---

## 다음 단계 (Phase 2)

✅ Phase 1 완료 후:

1. **CONFIG-FILES.md** 파일 내용으로 설정 파일 수정
2. **FIRST-COMPONENTS.md** 파일 내용으로 컴포넌트 생성
3. 개발 서버 재시작: `npm run dev`
4. Header/Footer 컴포넌트 확인

---

## 🐛 트러블슈팅

### 문제 1: npm install 에러
```bash
# 캐시 삭제 후 재시도
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 문제 2: shadcn init 실패
```bash
# components.json이 있는지 확인
ls components.json

# 없으면 다시 init
npx shadcn@latest init
```

### 문제 3: 포트 3000 이미 사용 중
```bash
# 다른 포트 사용
npm run dev -- -p 3001
```

### 문제 4: TypeScript 에러
```bash
# TypeScript 버전 확인
npx tsc --version

# 5.0+ 아니면 업그레이드
npm install -D typescript@latest
```

### 문제 5: Tailwind 적용 안 됨
```bash
# tailwind.config.ts에서 content 경로 확인
# globals.css에서 @tailwind 지시어 확인
```

---

## 📞 지원

**문제 발생 시:**
1. 에러 메시지 전체 복사
2. `npm list --depth=0` 결과 확인
3. `git status` 확인
4. 위 정보를 Kelly에게 전달

---

## ✅ Phase 1 완료 보고

**완료 후 다음 내용을 Kelly에게 보고:**

```
✅ Phase 1 완료!

프로젝트 정보:
- 이름: kss-ontology-web
- 위치: [경로]
- Node.js: [버전]
- Next.js: 14.2.x

설치된 패키지:
- MDX: ✅
- shadcn/ui: ✅ (8개 컴포넌트)
- Tailwind: ✅
- 기타 유틸: ✅

테스트 결과:
- npm run dev: ✅
- npm run build: ✅
- npx tsc --noEmit: ✅

Git:
- 첫 커밋 완료: ✅
- 커밋 ID: [git log --oneline -1]

다음 단계:
→ CONFIG-FILES.md 내용으로 설정 파일 수정
```

---

**작성자:** Claude Web  
**작성일:** 2025-11-09  
**예상 소요 시간:** 30-60분  
**난이도:** ⭐⭐ (중하)

**준비 완료! 시작하세요! 🚀**
