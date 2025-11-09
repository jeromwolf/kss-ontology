# KSS Ontology Web - First Components

**작성일:** 2025-11-09  
**대상:** Claude Code  
**목적:** 첫 5개 핵심 컴포넌트 완전한 코드 제공

---

## 📋 목차

1. [components/layout/header.tsx](#1-componentslayoutheadertsx)
2. [components/layout/footer.tsx](#2-componentslayoutfootertsx)
3. [components/shared/theme-toggle.tsx](#3-componentssharedtheme-toggletsx)
4. [app/layout.tsx](#4-applayouttsx)
5. [app/page.tsx](#5-apppagetsx)

---

## 1. components/layout/header.tsx

**파일 위치:** `/components/layout/header.tsx`

```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { cn } from '@/lib/utils';
import { Menu, X, BookOpen } from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  title: string;
  href: string;
}

const navItems: NavItem[] = [
  { title: '챕터', href: '/chapters' },
  { title: '시뮬레이터', href: '/simulators' },
  { title: '프로젝트', href: '/projects' },
  { title: '소개', href: '/about' },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <Link 
          href="/" 
          className="mr-6 flex items-center space-x-2 lg:mr-8"
        >
          <BookOpen className="h-6 w-6" />
          <span className="hidden font-bold lg:inline-block">
            KSS Ontology
          </span>
          <span className="font-bold lg:hidden">
            KSS
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'transition-colors hover:text-foreground/80',
                isActive(item.href)
                  ? 'text-foreground'
                  : 'text-foreground/60'
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle />
          
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/chapters">시작하기</Link>
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">메뉴</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container grid gap-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-foreground',
                  isActive(item.href)
                    ? 'text-foreground'
                    : 'text-foreground/60'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.title}
              </Link>
            ))}
            <Button asChild className="w-full">
              <Link href="/chapters" onClick={() => setMobileMenuOpen(false)}>
                시작하기
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
```

---

## 2. components/layout/footer.tsx

**파일 위치:** `/components/layout/footer.tsx`

```typescript
import Link from 'next/link';
import { Github, Youtube } from 'lucide-react';
import { siteConfig } from '@/config/site';

export function Footer() {
  return (
    <footer className="border-t py-8 md:py-12">
      <div className="container">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* About */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="mb-4 text-sm font-semibold">KSS Ontology</h3>
            <p className="text-sm text-muted-foreground">
              세계에서 가장 깊이 있는 온톨로지 교육 플랫폼
            </p>
            <div className="mt-4 flex space-x-4">
              <Link
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href={siteConfig.links.youtube}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          {/* Content */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">콘텐츠</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/chapters"
                  className="text-muted-foreground hover:text-foreground"
                >
                  챕터
                </Link>
              </li>
              <li>
                <Link
                  href="/simulators"
                  className="text-muted-foreground hover:text-foreground"
                >
                  시뮬레이터
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-muted-foreground hover:text-foreground"
                >
                  프로젝트
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">리소스</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/docs"
                  className="text-muted-foreground hover:text-foreground"
                >
                  문서
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground"
                >
                  소개
                </Link>
              </li>
              <li>
                <Link
                  href="/roadmap"
                  className="text-muted-foreground hover:text-foreground"
                >
                  로드맵
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">연락처</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-muted-foreground hover:text-foreground"
                >
                  이메일
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.links.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground md:flex md:items-center md:justify-between md:text-left">
          <p>
            © {new Date().getFullYear()} {siteConfig.author.company}. All rights
            reserved.
          </p>
          <p className="mt-4 md:mt-0">
            Built with ❤️ by{' '}
            <a
              href={siteConfig.author.github}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              {siteConfig.author.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
```

---

## 3. components/shared/theme-toggle.tsx

**파일 위치:** `/components/shared/theme-toggle.tsx`

```typescript
'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">테마 전환</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          라이트
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          다크
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          시스템
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

## 4. app/layout.tsx

**파일 위치:** `/app/layout.tsx`

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { siteConfig } from '@/config/site';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'ontology',
    'knowledge graph',
    'semantic web',
    'RDF',
    'OWL',
    'SPARQL',
    '온톨로지',
    '지식 그래프',
  ],
  authors: [
    {
      name: siteConfig.author.name,
      url: siteConfig.author.github,
    },
  ],
  creator: siteConfig.author.name,
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.social.twitter,
  },
  icons: {
    icon: '/icons/favicon.ico',
    shortcut: '/icons/favicon-16x16.png',
    apple: '/icons/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

## 5. app/page.tsx

**파일 위치:** `/app/page.tsx`

```typescript
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BookOpen, Code, Lightbulb, Zap } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { STATS } from '@/lib/constants';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container flex flex-col items-center gap-8 py-24 md:py-32">
        <Badge variant="secondary" className="mb-4">
          Phase 1 완료 - 10개 챕터 공개
        </Badge>
        
        <h1 className="text-center text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
          세계에서 가장 깊이 있는
          <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            온톨로지 교육 플랫폼
          </span>
        </h1>
        
        <p className="max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl">
          {siteConfig.description}
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/chapters">
              시작하기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/about">
              자세히 알아보기
            </Link>
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/50">
        <div className="container py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
            <div className="text-center">
              <div className="text-4xl font-bold">{STATS.totalChapters}</div>
              <div className="mt-2 text-sm text-muted-foreground">챕터</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">{STATS.totalWords.toLocaleString()}</div>
              <div className="mt-2 text-sm text-muted-foreground">단어</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">{STATS.totalSimulators}</div>
              <div className="mt-2 text-sm text-muted-foreground">시뮬레이터</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">{STATS.totalCodeExamples}+</div>
              <div className="mt-2 text-sm text-muted-foreground">코드 예제</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">{STATS.totalCompanies}+</div>
              <div className="mt-2 text-sm text-muted-foreground">기업 사례</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-24 md:py-32">
        <div className="mx-auto max-w-[980px] text-center">
          <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl">
            차별화된 학습 경험
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            표면적 이해가 아닌, 진짜 전문성을 만듭니다
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <BookOpen className="h-10 w-10 text-primary" />
              <CardTitle>MIT 수준 깊이</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                평균 6,120단어/챕터. 철학적 기원부터 최신 응용까지 완전히 이해합니다.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-primary" />
              <CardTitle>인터랙티브</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                4개 프로덕션 레벨 시뮬레이터. 개념을 직접 체험하며 학습합니다.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Code className="h-10 w-10 text-primary" />
              <CardTitle>실전 중심</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                150+ 코드 예제, 30+ 기업 사례. Mayo Clinic, JPMorgan, Airbus 등.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Lightbulb className="h-10 w-10 text-primary" />
              <CardTitle>즉시 적용 가능</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                10개 실습 프로젝트 가이드. 학습 후 바로 실무에 적용할 수 있습니다.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/50">
        <div className="container py-24 md:py-32">
          <div className="mx-auto max-w-[980px] text-center">
            <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl">
              오늘부터 온톨로지 전문가가 되세요
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              10개 챕터, 61,200단어의 깊이 있는 콘텐츠가 기다립니다
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link href="/chapters">
                  무료로 시작하기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/chapters">
                  커리큘럼 보기
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
```

---

## 6. components/providers/theme-provider.tsx

**파일 위치:** `/components/providers/theme-provider.tsx`

**필수 추가 파일!** (ThemeProvider)

```typescript
'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

---

## 적용 방법

### 1. 폴더 생성 (아직 안 했다면)
```bash
mkdir -p components/layout
mkdir -p components/shared
mkdir -p components/providers
```

### 2. 파일 생성
위의 각 섹션 내용을 복사해서 해당 파일에 붙여넣기

### 3. shadcn/ui 컴포넌트 확인
```bash
# 필요한 컴포넌트가 설치되어 있는지 확인
ls components/ui/
# button.tsx, card.tsx, badge.tsx, dropdown-menu.tsx가 있어야 함

# 없으면 설치
npx shadcn@latest add button card badge dropdown-menu
```

### 4. 개발 서버 실행
```bash
npm run dev
```

### 5. 브라우저 확인
```
http://localhost:3000
```

**확인 사항:**
- [ ] Header가 상단에 고정되어 있는가?
- [ ] Logo와 네비게이션이 보이는가?
- [ ] 테마 전환 버튼이 작동하는가?
- [ ] 모바일에서 햄버거 메뉴가 작동하는가?
- [ ] Footer가 하단에 있는가?
- [ ] Hero Section이 보이는가?
- [ ] Stats가 올바르게 표시되는가?

### 6. 타입 체크
```bash
npx tsc --noEmit
# 에러 없어야 함
```

### 7. Git 커밋
```bash
git add .
git commit -m "Add first components: Header, Footer, HomePage"
```

---

## 🐛 트러블슈팅

### 문제 1: ThemeProvider 에러
```bash
# next-themes 재설치
npm install next-themes
```

### 문제 2: shadcn/ui 컴포넌트 없음
```bash
# 필요한 컴포넌트 설치
npx shadcn@latest add button card badge dropdown-menu
```

### 문제 3: config/site.ts 임포트 에러
```bash
# CONFIG-FILES.md의 config/site.ts 먼저 생성 확인
cat config/site.ts
```

### 문제 4: 스타일 적용 안 됨
```bash
# globals.css 확인
cat app/globals.css
# @tailwind 지시어가 있는지 확인
```

### 문제 5: 아이콘 안 보임
```bash
# lucide-react 재설치
npm install lucide-react
```

---

## 다음 단계

✅ 첫 컴포넌트 완료 후:

1. **챕터 목록 페이지** 생성
   - `app/chapters/page.tsx`
   
2. **챕터 상세 페이지** 생성
   - `app/chapters/[slug]/page.tsx`
   
3. **MDX 파싱** 구현
   - `lib/mdx.ts`

4. **첫 챕터 MDX 파일** 변환
   - `content/chapters/01-ontology-basics.mdx`

---

## ✅ Phase 2 완료 체크리스트

- [ ] ✅ Header 컴포넌트 작동
- [ ] ✅ Footer 컴포넌트 작동
- [ ] ✅ ThemeToggle 작동 (라이트/다크 전환)
- [ ] ✅ 홈페이지 렌더링
- [ ] ✅ 반응형 디자인 (모바일/데스크톱)
- [ ] ✅ 네비게이션 링크 작동
- [ ] ✅ 타입 에러 없음
- [ ] ✅ 빌드 성공 (npm run build)

### 완료 보고
```
✅ Phase 2 완료!

생성된 컴포넌트:
- Header: ✅ (네비게이션, 테마 전환, 모바일 메뉴)
- Footer: ✅ (링크, 소셜, 저작권)
- ThemeToggle: ✅ (라이트/다크/시스템)
- Layout: ✅ (루트 레이아웃)
- HomePage: ✅ (Hero, Stats, Features, CTA)

테스트 결과:
- npm run dev: ✅
- 데스크톱 뷰: ✅
- 모바일 뷰: ✅
- 다크 모드: ✅
- npx tsc --noEmit: ✅

다음 단계:
→ 챕터 페이지 생성
→ MDX 파싱 구현
```

---

**작성자:** Claude Web  
**작성일:** 2025-11-09  
**컴포넌트 수:** 6개  
**총 라인 수:** 600+

**준비 완료! Header와 Footer가 보일 것입니다! 🚀**
