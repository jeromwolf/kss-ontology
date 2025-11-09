# KSS Ontology - Next.js 웹사이트 완전 기획서

**작성일:** 2025-11-09  
**버전:** 1.0  
**목표:** 세계 최고 수준의 온톨로지 교육 플랫폼

---

## 📋 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [기술 스택](#2-기술-스택)
3. [사이트맵](#3-사이트맵)
4. [폴더 구조](#4-폴더-구조)
5. [페이지별 상세 설계](#5-페이지별-상세-설계)
6. [컴포넌트 구조](#6-컴포넌트-구조)
7. [디자인 시스템](#7-디자인-시스템)
8. [데이터 구조](#8-데이터-구조)
9. [기능 명세](#9-기능-명세)
10. [단계별 구현 계획](#10-단계별-구현-계획)

---

## 1. 프로젝트 개요

### 프로젝트명
**KSS Ontology Web Platform**

### 목표
- 10개 챕터를 아름다운 웹 인터페이스로 제공
- 4개 시뮬레이터 완벽 통합
- 최고의 학습 경험 제공
- 모바일/데스크톱 완벽 지원

### 핵심 가치
- 🎨 **아름다운 디자인**: 미니멀하고 현대적
- ⚡ **빠른 성능**: 3초 이내 로딩
- 📱 **반응형**: 모든 기기 지원
- 🎮 **인터랙티브**: 시뮬레이터 완벽 통합

---

## 2. 기술 스택

### Frontend Framework
```json
{
  "framework": "Next.js 14",
  "reason": "SSG, 빠른 성능, SEO 최적화",
  "features": ["App Router", "Server Components", "Static Generation"]
}
```

### 언어
```json
{
  "language": "TypeScript",
  "reason": "타입 안전성, 개발 생산성",
  "version": "5.0+"
}
```

### 스타일링
```json
{
  "primary": "Tailwind CSS",
  "plugins": [
    "@tailwindcss/typography",
    "@tailwindcss/forms"
  ],
  "reason": "빠른 개발, 일관성, 반응형"
}
```

### 콘텐츠 관리
```json
{
  "format": "MDX",
  "libraries": [
    "@next/mdx",
    "remark-gfm",
    "rehype-highlight",
    "rehype-slug"
  ],
  "reason": "Markdown + React 컴포넌트"
}
```

### UI 라이브러리
```json
{
  "components": "shadcn/ui",
  "icons": "lucide-react",
  "animations": "framer-motion",
  "reason": "고품질 컴포넌트, 커스터마이징 가능"
}
```

### 배포
```json
{
  "platform": "Vercel",
  "reason": "Next.js 최적화, 자동 배포, 무료",
  "features": ["Preview Deployments", "Analytics", "Edge Functions"]
}
```

---

## 3. 사이트맵

```
kss-ontology.com
│
├─ / (홈페이지)
│   ├─ Hero Section
│   ├─ Features
│   ├─ Curriculum Overview
│   ├─ Testimonials
│   └─ CTA
│
├─ /chapters (챕터 목록)
│   └─ /chapters/[slug] (개별 챕터)
│       ├─ Chapter 1: ontology-basics
│       ├─ Chapter 2: rdf
│       ├─ Chapter 3: rdfs-owl
│       ├─ Chapter 4: sparql
│       ├─ Chapter 5: reasoning
│       ├─ Chapter 6: medical
│       ├─ Chapter 7: finance
│       ├─ Chapter 8: manufacturing
│       ├─ Chapter 9: ai-ontology
│       └─ Chapter 10: future-trends
│
├─ /simulators (시뮬레이터 허브)
│   ├─ /simulators/rdf-editor
│   ├─ /simulators/sparql-playground
│   ├─ /simulators/reasoning-engine
│   └─ /simulators/3d-graph
│
├─ /projects (실습 프로젝트)
│   ├─ Project 1-10 가이드
│
├─ /about (소개)
│   ├─ Vision
│   ├─ Team
│   └─ Contact
│
├─ /docs (문서)
│   ├─ Getting Started
│   ├─ FAQ
│   └─ Glossary
│
└─ /roadmap (로드맵)
```

---

## 4. 폴더 구조

```
kss-ontology-web/
│
├─ app/                          # Next.js 14 App Router
│   ├─ layout.tsx               # 루트 레이아웃
│   ├─ page.tsx                 # 홈페이지
│   ├─ globals.css              # 글로벌 스타일
│   │
│   ├─ chapters/
│   │   ├─ page.tsx             # 챕터 목록
│   │   └─ [slug]/
│   │       ├─ page.tsx         # 챕터 페이지
│   │       └─ layout.tsx       # 챕터 레이아웃
│   │
│   ├─ simulators/
│   │   ├─ page.tsx             # 시뮬레이터 허브
│   │   ├─ rdf-editor/
│   │   ├─ sparql-playground/
│   │   ├─ reasoning-engine/
│   │   └─ 3d-graph/
│   │
│   ├─ projects/
│   │   ├─ page.tsx
│   │   └─ [id]/page.tsx
│   │
│   ├─ about/
│   │   └─ page.tsx
│   │
│   ├─ docs/
│   │   ├─ page.tsx
│   │   └─ [slug]/page.tsx
│   │
│   └─ roadmap/
│       └─ page.tsx
│
├─ components/                   # React 컴포넌트
│   ├─ layout/
│   │   ├─ Header.tsx
│   │   ├─ Footer.tsx
│   │   ├─ Sidebar.tsx
│   │   └─ Navigation.tsx
│   │
│   ├─ chapter/
│   │   ├─ ChapterContent.tsx
│   │   ├─ ChapterNav.tsx
│   │   ├─ TableOfContents.tsx
│   │   ├─ CodeBlock.tsx
│   │   └─ SimulatorEmbed.tsx
│   │
│   ├─ home/
│   │   ├─ Hero.tsx
│   │   ├─ Features.tsx
│   │   ├─ CurriculumPreview.tsx
│   │   └─ Testimonials.tsx
│   │
│   ├─ ui/                       # shadcn/ui 컴포넌트
│   │   ├─ button.tsx
│   │   ├─ card.tsx
│   │   ├─ tabs.tsx
│   │   └─ ...
│   │
│   └─ shared/
│       ├─ ProgressBar.tsx
│       ├─ SearchBar.tsx
│       └─ ThemeToggle.tsx
│
├─ content/                      # MDX 콘텐츠
│   ├─ chapters/
│   │   ├─ 01-ontology-basics.mdx
│   │   ├─ 02-rdf.mdx
│   │   ├─ 03-rdfs-owl.mdx
│   │   ├─ 04-sparql.mdx
│   │   ├─ 05-reasoning.mdx
│   │   ├─ 06-medical.mdx
│   │   ├─ 07-finance.mdx
│   │   ├─ 08-manufacturing.mdx
│   │   ├─ 09-ai-ontology.mdx
│   │   └─ 10-future-trends.mdx
│   │
│   └─ docs/
│       ├─ getting-started.mdx
│       ├─ faq.mdx
│       └─ glossary.mdx
│
├─ lib/                          # 유틸리티
│   ├─ mdx.ts                   # MDX 파싱
│   ├─ utils.ts                 # 유틸 함수
│   └─ constants.ts             # 상수
│
├─ public/                       # 정적 파일
│   ├─ images/
│   ├─ icons/
│   └─ simulators/              # 시뮬레이터 빌드 파일
│
├─ styles/                       # 스타일
│   └─ mdx.css                  # MDX 전용 스타일
│
├─ types/                        # TypeScript 타입
│   ├─ chapter.ts
│   └─ simulator.ts
│
├─ config/                       # 설정
│   ├─ site.ts                  # 사이트 메타데이터
│   └─ navigation.ts            # 네비게이션 구조
│
├─ tailwind.config.ts
├─ next.config.js
├─ tsconfig.json
├─ package.json
└─ README.md
```

---

## 5. 페이지별 상세 설계

### 5.1 홈페이지 (/)

**목표:** 첫인상으로 압도, 즉시 가치 전달

#### 섹션 구조

**1. Hero Section**
```typescript
{
  headline: "세계에서 가장 깊이 있는 온톨로지 교육",
  subheadline: "10개 챕터, 4개 시뮬레이터, 61,200단어",
  cta: [
    { text: "시작하기", link: "/chapters" },
    { text: "데모 보기", link: "#demo" }
  ],
  visual: "3D Knowledge Graph 애니메이션"
}
```

**2. Stats Section**
```typescript
{
  stats: [
    { number: "10", label: "챕터" },
    { number: "61,200", label: "단어" },
    { number: "4", label: "시뮬레이터" },
    { number: "150+", label: "코드 예제" }
  ]
}
```

**3. Features Section**
```typescript
{
  features: [
    {
      icon: "📚",
      title: "MIT 수준 깊이",
      description: "평균 6,120단어/챕터",
      link: "/about"
    },
    {
      icon: "🎮",
      title: "4개 시뮬레이터",
      description: "프로덕션 레벨 인터랙티브",
      link: "/simulators"
    },
    {
      icon: "💼",
      title: "실전 중심",
      description: "30+ 기업 사례, 실제 ROI",
      link: "/chapters"
    },
    {
      icon: "🚀",
      title: "즉시 적용 가능",
      description: "10개 실습 프로젝트",
      link: "/projects"
    }
  ]
}
```

**4. Curriculum Preview**
```typescript
{
  parts: [
    {
      title: "PART 1: 기초",
      chapters: ["Ch1: 온톨로지란?"],
      icon: "📖"
    },
    {
      title: "PART 2: 기술",
      chapters: ["Ch2: RDF", "Ch3: RDFS/OWL", "Ch4: SPARQL", "Ch5: 추론"],
      icon: "⚙️"
    },
    {
      title: "PART 3: 실전",
      chapters: ["Ch6: 의료", "Ch7: 금융", "Ch8: 제조", "Ch9: AI"],
      icon: "💡"
    },
    {
      title: "PART 4: 미래",
      chapters: ["Ch10: 트렌드"],
      icon: "🔮"
    }
  ]
}
```

**5. ROI Section**
```typescript
{
  title: "실제 성과",
  cases: [
    {
      company: "Mayo Clinic",
      result: "$12M 절감",
      domain: "의료"
    },
    {
      company: "JPMorgan",
      result: "$50M 절감",
      domain: "금융"
    },
    {
      company: "Airbus",
      result: "20% 생산성 향상",
      domain: "제조"
    }
  ]
}
```

**6. CTA Section**
```typescript
{
  headline: "오늘부터 온톨로지 전문가가 되세요",
  cta: [
    { text: "무료로 시작하기", link: "/chapters/ontology-basics" },
    { text: "커리큘럼 보기", link: "/chapters" }
  ]
}
```

---

### 5.2 챕터 목록 (/chapters)

**목표:** 전체 커리큘럼 한눈에, 쉬운 네비게이션

#### 레이아웃

```
┌─────────────────────────────────────┐
│ Header                              │
├─────────────────────────────────────┤
│                                     │
│  [Progress Bar: 0/10 완료]          │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ PART 1: 온톨로지의 이해       │ │
│  │                               │ │
│  │ □ Ch1: 온톨로지란? (3,200)    │ │
│  │   ⭐ 난이도: ⭐               │ │
│  │   ⏱️ 30분                     │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ PART 2: 온톨로지 기술         │ │
│  │                               │ │
│  │ □ Ch2: RDF (5,800)            │ │
│  │ □ Ch3: RDFS/OWL (6,200)       │ │
│  │ □ Ch4: SPARQL (6,800)         │ │
│  │ □ Ch5: 추론 엔진 (7,200)      │ │
│  └───────────────────────────────┘ │
│                                     │
│  ... (PART 3, 4)                    │
│                                     │
└─────────────────────────────────────┘
```

#### 데이터 구조

```typescript
interface Chapter {
  id: number;
  slug: string;
  title: string;
  description: string;
  wordCount: number;
  duration: string; // "30분"
  difficulty: 1 | 2 | 3 | 4 | 5;
  simulator?: string;
  part: 1 | 2 | 3 | 4;
  topics: string[];
  prerequisites?: number[]; // 선수 챕터 ID
}
```

---

### 5.3 챕터 페이지 (/chapters/[slug])

**목표:** 최고의 읽기 경험, 몰입형 학습

#### 레이아웃

```
┌─────────────────────────────────────────────────┐
│ Header (고정)                                   │
├───────┬─────────────────────────────┬───────────┤
│       │                             │           │
│ TOC   │   Chapter Content           │ Sidebar   │
│       │                             │           │
│ (고정) │   # 제목                     │ (고정)    │
│       │   본문...                    │           │
│       │                             │ Progress  │
│       │   ```code                   │           │
│       │   ```                       │ Metadata  │
│       │                             │           │
│       │   [시뮬레이터 임베드]         │ Related   │
│       │                             │           │
│       │   ## 섹션                    │           │
│       │   본문...                    │           │
│       │                             │           │
└───────┴─────────────────────────────┴───────────┘
```

#### 컴포넌트

**1. Table of Contents (왼쪽)**
```typescript
<TableOfContents
  sections={[
    { id: "intro", title: "소개", level: 2 },
    { id: "concepts", title: "핵심 개념", level: 2 },
    { id: "examples", title: "예제", level: 2 }
  ]}
  activeId="intro"
/>
```

**2. Chapter Content (중앙)**
```typescript
<ChapterContent>
  {/* MDX 렌더링 */}
  <MDXContent />
  
  {/* 커스텀 컴포넌트 */}
  <CodeBlock language="turtle" />
  <SimulatorEmbed type="rdf-editor" />
  <InfoBox type="tip" />
  <Exercise />
</ChapterContent>
```

**3. Sidebar (오른쪽)**
```typescript
<Sidebar>
  <ProgressIndicator current={3} total={10} />
  
  <ChapterMeta
    wordCount={6800}
    readTime="90분"
    difficulty={4}
    simulator="SPARQL Playground"
  />
  
  <NavigationLinks
    prev={{ title: "Ch3: RDFS/OWL", slug: "rdfs-owl" }}
    next={{ title: "Ch5: 추론 엔진", slug: "reasoning" }}
  />
  
  <RelatedLinks
    simulator="/simulators/sparql-playground"
    docs="/docs/sparql-reference"
  />
</Sidebar>
```

#### MDX 커스텀 컴포넌트

```typescript
// 코드 블록
<CodeBlock language="sparql" filename="query.rq">
SELECT ?subject ?predicate ?object
WHERE {
  ?subject ?predicate ?object .
}
LIMIT 10
</CodeBlock>

// 정보 박스
<InfoBox type="tip | warning | note">
SPARQL은 RDF를 위한 쿼리 언어입니다.
</InfoBox>

// 시뮬레이터 임베드
<SimulatorEmbed 
  type="sparql-playground"
  height="600px"
  initialCode="SELECT * WHERE { ?s ?p ?o } LIMIT 10"
/>

// 연습 문제
<Exercise 
  title="SPARQL 쿼리 작성"
  difficulty={3}
  solution="/solutions/ch4-ex1"
>
문제 내용...
</Exercise>

// 다이어그램
<Diagram 
  type="mermaid"
  data={graphData}
/>
```

---

### 5.4 시뮬레이터 허브 (/simulators)

**목표:** 4개 시뮬레이터 쉽게 접근

#### 레이아웃

```
┌─────────────────────────────────────┐
│ 시뮬레이터 목록                      │
│                                     │
│ ┌───────────┐ ┌───────────┐       │
│ │ RDF       │ │ SPARQL    │       │
│ │ Editor    │ │ Playground│       │
│ │ Ch 2,3    │ │ Ch 4      │       │
│ └───────────┘ └───────────┘       │
│                                     │
│ ┌───────────┐ ┌───────────┐       │
│ │ Reasoning │ │ 3D        │       │
│ │ Engine    │ │ Graph     │       │
│ │ Ch 5      │ │ Ch 6-9    │       │
│ └───────────┘ └───────────┘       │
└─────────────────────────────────────┘
```

---

### 5.5 프로젝트 페이지 (/projects)

**목표:** 10개 실습 프로젝트 가이드

#### 프로젝트 카드

```typescript
interface Project {
  id: number;
  title: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  duration: string; // "2주"
  technologies: string[];
  relatedChapters: number[];
  steps: Step[];
}
```

---

## 6. 컴포넌트 구조

### 6.1 레이아웃 컴포넌트

#### Header.tsx
```typescript
interface HeaderProps {
  transparent?: boolean;
}

export function Header({ transparent = false }: HeaderProps) {
  return (
    <header className={cn(
      "fixed top-0 w-full z-50",
      transparent ? "bg-transparent" : "bg-white/80 backdrop-blur"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <span className="text-2xl font-bold">KSS Ontology</span>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <NavLink href="/chapters">챕터</NavLink>
            <NavLink href="/simulators">시뮬레이터</NavLink>
            <NavLink href="/projects">프로젝트</NavLink>
            <NavLink href="/docs">문서</NavLink>
          </nav>
          
          {/* Actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button href="/chapters">시작하기</Button>
          </div>
        </div>
      </div>
    </header>
  );
}
```

#### Sidebar.tsx (챕터용)
```typescript
interface SidebarProps {
  chapter: Chapter;
}

export function Sidebar({ chapter }: SidebarProps) {
  return (
    <aside className="w-64 space-y-6">
      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle>진행률</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={30} />
          <p className="text-sm mt-2">3/10 챕터 완료</p>
        </CardContent>
      </Card>
      
      {/* Chapter Info */}
      <Card>
        <CardHeader>
          <CardTitle>챕터 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>{chapter.wordCount} 단어</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{chapter.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            <span>난이도: {chapter.difficulty}/5</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>다음 챕터</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            Ch5: 추론 엔진 →
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
}
```

### 6.2 챕터 컴포넌트

#### ChapterContent.tsx
```typescript
interface ChapterContentProps {
  chapter: Chapter;
  children: React.ReactNode;
}

export function ChapterContent({ chapter, children }: ChapterContentProps) {
  return (
    <article className="prose prose-lg dark:prose-invert max-w-none">
      {/* Header */}
      <header className="mb-8">
        <div className="text-sm text-muted-foreground mb-2">
          Chapter {chapter.id}
        </div>
        <h1 className="text-4xl font-bold mb-4">{chapter.title}</h1>
        <p className="text-xl text-muted-foreground">
          {chapter.description}
        </p>
        
        {/* Meta */}
        <div className="flex items-center gap-4 mt-4 text-sm">
          <Badge>{chapter.duration}</Badge>
          <Badge>{chapter.wordCount} 단어</Badge>
          <Badge>
            {"⭐".repeat(chapter.difficulty)}
          </Badge>
        </div>
      </header>
      
      {/* Content */}
      <div className="mdx-content">
        {children}
      </div>
    </article>
  );
}
```

#### TableOfContents.tsx
```typescript
interface TOCProps {
  sections: Section[];
  activeId: string;
}

export function TableOfContents({ sections, activeId }: TOCProps) {
  return (
    <nav className="sticky top-20">
      <p className="font-semibold mb-4">목차</p>
      <ul className="space-y-2">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={cn(
                "text-sm hover:text-primary transition",
                activeId === section.id 
                  ? "text-primary font-medium" 
                  : "text-muted-foreground"
              )}
            >
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

#### CodeBlock.tsx
```typescript
interface CodeBlockProps {
  language: string;
  filename?: string;
  children: string;
}

export function CodeBlock({ language, filename, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  
  return (
    <div className="relative group">
      {filename && (
        <div className="bg-muted px-4 py-2 rounded-t-lg border border-b-0">
          <span className="text-sm font-mono">{filename}</span>
        </div>
      )}
      
      <pre className={cn(
        "overflow-x-auto p-4",
        filename ? "rounded-b-lg" : "rounded-lg"
      )}>
        <code className={`language-${language}`}>
          {children}
        </code>
      </pre>
      
      <Button
        size="sm"
        variant="ghost"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
        onClick={() => {
          navigator.clipboard.writeText(children);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </Button>
    </div>
  );
}
```

#### SimulatorEmbed.tsx
```typescript
interface SimulatorEmbedProps {
  type: 'rdf-editor' | 'sparql-playground' | 'reasoning-engine' | '3d-graph';
  height?: string;
  initialCode?: string;
}

export function SimulatorEmbed({ 
  type, 
  height = "600px",
  initialCode 
}: SimulatorEmbedProps) {
  const simulatorUrl = getSimulatorUrl(type, initialCode);
  
  return (
    <div className="my-8 border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-muted px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-4 h-4" />
          <span className="font-medium">
            {getSimulatorName(type)}
          </span>
        </div>
        
        <Button variant="ghost" size="sm" asChild>
          <a href={simulatorUrl} target="_blank">
            <ExternalLink className="w-4 h-4 mr-2" />
            새 창에서 열기
          </a>
        </Button>
      </div>
      
      {/* Iframe */}
      <iframe
        src={simulatorUrl}
        style={{ height, width: '100%' }}
        className="border-0"
      />
    </div>
  );
}
```

---

## 7. 디자인 시스템

### 7.1 컬러 팔레트

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        // Light Mode
        background: "hsl(0 0% 100%)",
        foreground: "hsl(222.2 84% 4.9%)",
        
        primary: {
          DEFAULT: "hsl(221.2 83.2% 53.3%)", // Blue
          foreground: "hsl(210 40% 98%)",
        },
        
        secondary: {
          DEFAULT: "hsl(210 40% 96.1%)",
          foreground: "hsl(222.2 47.4% 11.2%)",
        },
        
        muted: {
          DEFAULT: "hsl(210 40% 96.1%)",
          foreground: "hsl(215.4 16.3% 46.9%)",
        },
        
        accent: {
          DEFAULT: "hsl(210 40% 96.1%)",
          foreground: "hsl(222.2 47.4% 11.2%)",
        },
        
        // Semantic
        success: "hsl(142.1 76.2% 36.3%)",
        warning: "hsl(38 92% 50%)",
        error: "hsl(0 84.2% 60.2%)",
      }
    }
  }
}
```

### 7.2 타이포그래피

```typescript
// 폰트 설정
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'] });

// 사용
<body className={inter.className}>
  <code className={jetbrainsMono.className}>
```

**사이즈 스케일:**
```css
.text-xs    { font-size: 0.75rem; }   /* 12px */
.text-sm    { font-size: 0.875rem; }  /* 14px */
.text-base  { font-size: 1rem; }      /* 16px */
.text-lg    { font-size: 1.125rem; }  /* 18px */
.text-xl    { font-size: 1.25rem; }   /* 20px */
.text-2xl   { font-size: 1.5rem; }    /* 24px */
.text-3xl   { font-size: 1.875rem; }  /* 30px */
.text-4xl   { font-size: 2.25rem; }   /* 36px */
.text-5xl   { font-size: 3rem; }      /* 48px */
```

### 7.3 스페이싱

```css
/* Padding/Margin 스케일 */
.p-1  { padding: 0.25rem; }  /* 4px */
.p-2  { padding: 0.5rem; }   /* 8px */
.p-4  { padding: 1rem; }     /* 16px */
.p-6  { padding: 1.5rem; }   /* 24px */
.p-8  { padding: 2rem; }     /* 32px */
.p-12 { padding: 3rem; }     /* 48px */
.p-16 { padding: 4rem; }     /* 64px */
```

### 7.4 반응형 브레이크포인트

```typescript
{
  'sm': '640px',   // Mobile landscape
  'md': '768px',   // Tablet
  'lg': '1024px',  // Desktop
  'xl': '1280px',  // Large desktop
  '2xl': '1536px', // Extra large
}
```

---

## 8. 데이터 구조

### 8.1 Chapter 타입

```typescript
// types/chapter.ts
export interface Chapter {
  id: number;
  slug: string;
  title: string;
  description: string;
  content: string; // MDX content
  
  // Meta
  wordCount: number;
  duration: string; // "90분"
  difficulty: 1 | 2 | 3 | 4 | 5;
  publishedAt: string; // ISO date
  updatedAt: string;
  
  // Organization
  part: 1 | 2 | 3 | 4;
  order: number;
  
  // Learning
  learningObjectives: string[];
  topics: string[];
  prerequisites: number[]; // Chapter IDs
  
  // Resources
  simulator?: {
    type: 'rdf-editor' | 'sparql-playground' | 'reasoning-engine' | '3d-graph';
    url: string;
  };
  exercises: Exercise[];
  references: Reference[];
  
  // Navigation
  prev?: {
    id: number;
    title: string;
    slug: string;
  };
  next?: {
    id: number;
    title: string;
    slug: string;
  };
}

export interface Exercise {
  id: string;
  title: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  question: string;
  solution?: string;
  hints?: string[];
}

export interface Reference {
  title: string;
  url: string;
  type: 'article' | 'paper' | 'video' | 'book';
}
```

### 8.2 Simulator 타입

```typescript
// types/simulator.ts
export interface Simulator {
  id: string;
  name: string;
  description: string;
  type: 'rdf-editor' | 'sparql-playground' | 'reasoning-engine' | '3d-graph';
  url: string;
  thumbnailUrl: string;
  
  // Usage
  usedInChapters: number[];
  features: string[];
  
  // Technical
  framework: string;
  repository?: string;
}
```

### 8.3 사이트 설정

```typescript
// config/site.ts
export const siteConfig = {
  name: "KSS Ontology",
  description: "세계에서 가장 깊이 있는 온톨로지 교육 플랫폼",
  url: "https://kss-ontology.com",
  ogImage: "https://kss-ontology.com/og.jpg",
  
  author: {
    name: "jeromwolf",
    company: "데이터공작소 TFT",
    url: "https://github.com/jeromwolf"
  },
  
  links: {
    github: "https://github.com/jeromwolf/kss-ontology",
    youtube: "https://youtube.com/@ai-on",
  },
  
  analytics: {
    vercel: true,
    ga: process.env.NEXT_PUBLIC_GA_ID,
  }
};
```

---

## 9. 기능 명세

### 9.1 필수 기능 (MVP)

**1. 콘텐츠 렌더링 ✅**
- MDX 파싱 및 렌더링
- 코드 신택스 하이라이팅
- 수식 렌더링 (KaTeX)
- 반응형 이미지

**2. 네비게이션 ✅**
- 챕터 간 이동
- 목차 (TOC)
- 브레드크럼

**3. 시뮬레이터 통합 ✅**
- iframe 임베드
- 새 창에서 열기
- 반응형 높이

**4. 검색 ✅**
- 클라이언트 사이드 검색
- 챕터, 제목, 내용 검색

**5. 다크 모드 ✅**
- 시스템 테마 감지
- 수동 전환
- 로컬 스토리지 저장

### 9.2 추가 기능 (V2)

**1. 진행률 추적**
- 로컬 스토리지
- 챕터별 완료 상태
- 진행률 바

**2. 북마크**
- 특정 섹션 저장
- 빠른 접근

**3. 노트**
- 챕터별 메모
- 마크다운 지원

**4. 퀴즈**
- 인터랙티브 퀴즈
- 자동 채점
- 피드백

### 9.3 미래 기능 (V3)

**1. 사용자 계정**
- 회원가입/로그인
- 진행률 동기화
- 수료증

**2. 커뮤니티**
- 댓글
- 토론 포럼
- Q&A

**3. 프리미엄**
- 유료 콘텐츠
- 1:1 멘토링
- 수료증 발급

---

## 10. 단계별 구현 계획

### Phase 1: 프로젝트 설정 (1-2일)

**Day 1: 초기 설정**
```bash
# 1. Next.js 프로젝트 생성
npx create-next-app@latest kss-ontology-web --typescript --tailwind --app

# 2. 필수 패키지 설치
npm install @next/mdx @mdx-js/loader @mdx-js/react
npm install remark-gfm rehype-highlight rehype-slug
npm install lucide-react
npm install class-variance-authority clsx tailwind-merge

# 3. shadcn/ui 설정
npx shadcn-ui@latest init

# 4. 기본 컴포넌트 설치
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add tabs
```

**Day 2: 폴더 구조 생성**
```bash
# 폴더 생성
mkdir -p app/chapters/[slug]
mkdir -p components/{layout,chapter,home,ui,shared}
mkdir -p content/chapters
mkdir -p lib
mkdir -p types
mkdir -p config
mkdir -p public/{images,icons}

# 설정 파일 생성
touch config/site.ts
touch config/navigation.ts
touch types/chapter.ts
touch lib/mdx.ts
touch lib/utils.ts
```

---

### Phase 2: 기본 레이아웃 (2-3일)

**Day 3: Header & Footer**
```typescript
// components/layout/Header.tsx
// components/layout/Footer.tsx
// app/layout.tsx
```

**Day 4: 홈페이지**
```typescript
// app/page.tsx
// components/home/Hero.tsx
// components/home/Features.tsx
// components/home/CurriculumPreview.tsx
```

**Day 5: 스타일링 & 반응형**
```css
// 다크 모드 설정
// 반응형 테스트
// 애니메이션 추가
```

---

### Phase 3: MDX 통합 (3-4일)

**Day 6-7: MDX 파싱**
```typescript
// lib/mdx.ts - MDX 파일 읽기/파싱
// 코드 하이라이팅 설정
// 커스텀 컴포넌트 매핑
```

**Day 8-9: 챕터 페이지**
```typescript
// app/chapters/page.tsx - 챕터 목록
// app/chapters/[slug]/page.tsx - 챕터 상세
// components/chapter/ChapterContent.tsx
// components/chapter/TableOfContents.tsx
```

---

### Phase 4: 챕터 콘텐츠 변환 (4-5일)

**Day 10-12: MDX 변환**
```bash
# Chapter 1-10을 MDX로 변환
# 마크다운 문법 정리
# 커스텀 컴포넌트 적용
```

**Day 13-14: 검토 & 수정**
```bash
# 렌더링 테스트
# 오타 수정
# 이미지 최적화
```

---

### Phase 5: 시뮬레이터 통합 (2-3일)

**Day 15-16: 임베드 구현**
```typescript
// components/chapter/SimulatorEmbed.tsx
// 4개 시뮬레이터 URL 설정
// iframe 반응형 처리
```

**Day 17: 테스트**
```bash
# 각 시뮬레이터 작동 확인
# 크로스 브라우저 테스트
```

---

### Phase 6: 추가 기능 (3-4일)

**Day 18-19: 검색**
```typescript
// components/shared/SearchBar.tsx
// 클라이언트 사이드 검색
```

**Day 20-21: 진행률 & 북마크**
```typescript
// 로컬 스토리지 활용
// 진행률 바
// 북마크 기능
```

---

### Phase 7: 최적화 & 배포 (2-3일)

**Day 22-23: 최적화**
```bash
# 이미지 최적화
# 코드 스플리팅
# 성능 테스트
```

**Day 24: 배포**
```bash
# Vercel 연결
# 도메인 설정
# 배포 테스트
```

---

## 📦 Claude Code에게 전달할 명령

### 1. 프로젝트 초기화
```bash
npx create-next-app@latest kss-ontology-web --typescript --tailwind --app
cd kss-ontology-web
npm install @next/mdx @mdx-js/loader @mdx-js/react remark-gfm rehype-highlight rehype-slug lucide-react class-variance-authority clsx tailwind-merge
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card badge tabs progress
```

### 2. 폴더 구조 생성
```bash
mkdir -p app/chapters/[slug]
mkdir -p components/{layout,chapter,home,ui,shared}
mkdir -p content/chapters
mkdir -p lib types config
mkdir -p public/{images,icons}
touch config/site.ts config/navigation.ts
touch types/chapter.ts types/simulator.ts
touch lib/mdx.ts lib/utils.ts lib/constants.ts
```

### 3. Git 초기화
```bash
git init
git add .
git commit -m "Initial commit: Next.js project setup"
```

---

## 🎯 다음 단계

**Claude Code가 할 일:**
1. ✅ 프로젝트 생성
2. ✅ 폴더 구조 생성
3. ✅ 기본 설정 파일 작성
4. ✅ Git 초기화

**제(Claude Web)가 할 일:**
1. ✅ 설정 파일 코드 작성
2. ✅ 컴포넌트 코드 작성
3. ✅ MDX 콘텐츠 변환
4. ✅ 문서화

---

**작성자:** jeromwolf + Claude Sonnet 4.5  
**작성일:** 2025-11-09  
**총 페이지:** 60+  
**예상 구현 기간:** 24일

**준비 완료! 🚀**
