# KSS Ontology Web - Configuration Files

**작성일:** 2025-11-09  
**대상:** Claude Code  
**목적:** 모든 설정 파일 완전한 코드 제공

---

## 📋 목차

1. [next.config.js](#1-nextconfigjs)
2. [tailwind.config.ts](#2-tailwindconfigts)
3. [tsconfig.json](#3-tsconfigjson)
4. [config/site.ts](#4-configsitets)
5. [config/navigation.ts](#5-confignavigationts)
6. [types/chapter.ts](#6-typeschapterts)
7. [types/simulator.ts](#7-typessimulatorrs)
8. [lib/utils.ts](#8-libutilsts)
9. [lib/constants.ts](#9-libconstantsts)
10. [app/globals.css](#10-appglobalscss)
11. [styles/mdx.css](#11-stylesmdxcss)

---

## 1. next.config.js

**파일 위치:** `/next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // MDX 지원
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  
  // 이미지 최적화
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // 정적 사이트 생성
  output: 'export',
  
  // Trailing slash
  trailingSlash: false,
  
  // Strict mode
  reactStrictMode: true,
  
  // 실험적 기능
  experimental: {
    mdxRs: true,
  },
  
  // 웹팩 설정
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
};

// MDX 설정
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      require('remark-gfm'),
    ],
    rehypePlugins: [
      require('rehype-slug'),
      require('rehype-autolink-headings'),
      [
        require('rehype-highlight'),
        {
          languages: {
            turtle: require('highlight.js/lib/languages/turtle'),
            sparql: require('highlight.js/lib/languages/sparql'),
          },
        },
      ],
    ],
  },
});

module.exports = withMDX(nextConfig);
```

---

## 2. tailwind.config.ts

**파일 위치:** `/tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './content/**/*.mdx',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'hsl(var(--foreground))',
            a: {
              color: 'hsl(var(--primary))',
              '&:hover': {
                color: 'hsl(var(--primary))',
                opacity: 0.8,
              },
            },
            'h1, h2, h3, h4': {
              color: 'hsl(var(--foreground))',
              fontWeight: '700',
            },
            code: {
              color: 'hsl(var(--foreground))',
              backgroundColor: 'hsl(var(--muted))',
              padding: '0.25rem 0.375rem',
              borderRadius: '0.25rem',
              fontWeight: '600',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: 'hsl(var(--muted))',
              color: 'hsl(var(--foreground))',
            },
            blockquote: {
              borderLeftColor: 'hsl(var(--border))',
              color: 'hsl(var(--muted-foreground))',
            },
            hr: {
              borderColor: 'hsl(var(--border))',
            },
            table: {
              borderColor: 'hsl(var(--border))',
            },
            'thead th': {
              color: 'hsl(var(--foreground))',
              borderBottomColor: 'hsl(var(--border))',
            },
            'tbody td': {
              borderBottomColor: 'hsl(var(--border))',
            },
          },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
} satisfies Config

export default config
```

---

## 3. tsconfig.json

**파일 위치:** `/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/types/*": ["./types/*"],
      "@/config/*": ["./config/*"],
      "@/content/*": ["./content/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

---

## 4. config/site.ts

**파일 위치:** `/config/site.ts`

```typescript
export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "KSS Ontology",
  description: "세계에서 가장 깊이 있는 온톨로지 교육 플랫폼. MIT 수준의 콘텐츠와 인터랙티브 시뮬레이터로 온톨로지 전문가가 되세요.",
  url: "https://kss-ontology.com",
  ogImage: "https://kss-ontology.com/og-image.png",
  
  author: {
    name: "jeromwolf",
    company: "데이터공작소 TFT",
    github: "https://github.com/jeromwolf",
    youtube: "https://youtube.com/@ai-on",
  },
  
  links: {
    github: "https://github.com/jeromwolf/kss-ontology",
    youtube: "https://youtube.com/@ai-on",
  },
  
  stats: {
    chapters: 10,
    words: 61200,
    simulators: 4,
    codeExamples: 150,
    companies: 30,
  },
  
  contact: {
    email: "contact@kss-ontology.com",
    feedback: "feedback@kss-ontology.com",
  },
  
  social: {
    twitter: "@kss_ontology",
    linkedin: "company/kss-ontology",
  },
};
```

---

## 5. config/navigation.ts

**파일 위치:** `/config/navigation.ts`

```typescript
export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: string;
  label?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface MainNavItem extends NavItem {}

export interface SidebarNavItem extends NavItemWithChildren {}

export const mainNav: MainNavItem[] = [
  {
    title: "챕터",
    href: "/chapters",
  },
  {
    title: "시뮬레이터",
    href: "/simulators",
  },
  {
    title: "프로젝트",
    href: "/chapters",
  },
  {
    title: "문서",
    href: "/docs",
  },
  {
    title: "소개",
    href: "/about",
  },
];

export const sidebarNav: SidebarNavItem[] = [
  {
    title: "PART 1: 온톨로지의 이해",
    href: "/chapters",
    items: [
      {
        title: "Chapter 1: 온톨로지란?",
        href: "/chapters/ontology-basics",
        items: [],
      },
    ],
  },
  {
    title: "PART 2: 온톨로지 기술",
    href: "/chapters",
    items: [
      {
        title: "Chapter 2: RDF",
        href: "/chapters/rdf",
        items: [],
      },
      {
        title: "Chapter 3: RDFS/OWL",
        href: "/chapters/rdfs-owl",
        items: [],
      },
      {
        title: "Chapter 4: SPARQL",
        href: "/chapters/sparql",
        items: [],
      },
      {
        title: "Chapter 5: 추론 엔진",
        href: "/chapters/reasoning",
        items: [],
      },
    ],
  },
  {
    title: "PART 3: 실전 프로젝트",
    href: "/chapters",
    items: [
      {
        title: "Chapter 6: 의료 온톨로지",
        href: "/chapters/medical",
        items: [],
      },
      {
        title: "Chapter 7: 금융 온톨로지",
        href: "/chapters/finance",
        items: [],
      },
      {
        title: "Chapter 8: 제조 온톨로지",
        href: "/chapters/manufacturing",
        items: [],
      },
      {
        title: "Chapter 9: AI + 온톨로지",
        href: "/chapters/ai-ontology",
        items: [],
      },
    ],
  },
  {
    title: "PART 4: 온톨로지의 미래",
    href: "/chapters",
    items: [
      {
        title: "Chapter 10: 미래 트렌드",
        href: "/chapters/future-trends",
        items: [],
      },
    ],
  },
];
```

---

## 6. types/chapter.ts

**파일 위치:** `/types/chapter.ts`

```typescript
export type SimulatorType =
  | 'rdf-editor'
  | 'sparql-playground'
  | 'reasoning-engine'
  | 'knowledge-graph';

export interface Chapter {
  // Identity
  id: number;
  slug: string;
  title: string;
  description: string;

  // Content
  content: string; // MDX string

  // Metadata
  wordCount: number;
  duration: string; // "90분"
  difficulty: 1 | 2 | 3 | 4 | 5;
  publishedAt: string; // ISO date
  updatedAt: string;

  // Organization
  part: 1 | 2 | 3 | 4;
  partTitle: string;
  order: number;

  // Learning
  learningObjectives: string[];
  topics: string[];
  prerequisites: number[]; // Chapter IDs

  // Resources
  simulator?: {
    type: SimulatorType;
    url: string;
  };

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

export interface ChapterMeta {
  id: number;
  slug: string;
  title: string;
  description: string;
  wordCount: number;
  duration: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  part: 1 | 2 | 3 | 4;
  partTitle: string;
  order: number;
  publishedAt: string;
  topics: string[];
  simulator?: {
    type: SimulatorType;
    url: string;
  };
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
  children?: TableOfContentsItem[];
}
```

---

## 7. types/simulator.ts

**파일 위치:** `/types/simulator.ts`

```typescript
import { SimulatorType } from './chapter';

export interface Simulator {
  id: string;
  name: string;
  description: string;
  type: SimulatorType;
  url: string;
  thumbnailUrl: string;
  
  // Usage
  usedInChapters: number[];
  features: string[];
  
  // Technical
  framework: string;
  repository?: string;
}

export const simulators: Simulator[] = [
  {
    id: 'rdf-editor',
    name: 'RDF Triple Editor',
    description: '시각적으로 RDF 트리플을 생성하고 편집하는 도구',
    type: 'rdf-editor',
    url: 'https://rdf-editor.example.com',
    thumbnailUrl: '/images/simulators/rdf-editor.png',
    usedInChapters: [2, 3],
    features: [
      'Subject-Predicate-Object 입력',
      '실시간 시각화',
      '다양한 직렬화 포맷 (Turtle, JSON-LD, RDF/XML)',
      'Export 기능',
    ],
    framework: 'React',
    repository: 'https://github.com/example/rdf-editor',
  },
  {
    id: 'sparql-playground',
    name: 'SPARQL Playground',
    description: 'SPARQL 쿼리를 작성하고 실행하는 인터랙티브 환경',
    type: 'sparql-playground',
    url: 'https://sparql-playground.example.com',
    thumbnailUrl: '/images/simulators/sparql-playground.png',
    usedInChapters: [4],
    features: [
      '실시간 쿼리 편집',
      'DBpedia/Wikidata 연동',
      '20+ 예제 쿼리',
      '결과 시각화',
    ],
    framework: 'React',
  },
  {
    id: 'reasoning-engine',
    name: 'Reasoning Engine',
    description: 'OWL 추론 과정을 단계별로 시각화',
    type: 'reasoning-engine',
    url: 'https://reasoning-engine.example.com',
    thumbnailUrl: '/images/simulators/reasoning-engine.png',
    usedInChapters: [5],
    features: [
      'RDFS/OWL 추론 규칙',
      '단계별 설명',
      'Reasoner 비교 (Pellet, HermiT)',
    ],
    framework: 'React',
  },
  {
    id: 'knowledge-graph',
    name: '3D Knowledge Graph',
    description: 'Three.js 기반 3D 지식 그래프 시각화',
    type: 'knowledge-graph',
    url: 'https://kg-viz.example.com',
    thumbnailUrl: '/images/simulators/knowledge-graph.png',
    usedInChapters: [6, 7, 8, 9],
    features: [
      '1000+ 노드 실시간 렌더링',
      '인터랙티브 탐색',
      '의료/금융/제조/AI 데이터',
    ],
    framework: 'Three.js + React',
  },
];
```

---

## 8. lib/utils.ts

**파일 위치:** `/lib/utils.ts`

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Tailwind CSS 클래스 이름을 병합하는 유틸리티
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 날짜를 포맷팅
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

/**
 * 읽기 시간 계산 (분)
 */
export function calculateReadingTime(wordCount: number): number {
  const wordsPerMinute = 200;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Slug를 제목으로 변환
 */
export function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * 제목을 Slug로 변환
 */
export function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * 숫자를 천 단위 구분자로 포맷팅
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ko-KR').format(num);
}

/**
 * 난이도를 별 이모지로 변환
 */
export function difficultyToStars(difficulty: 1 | 2 | 3 | 4 | 5): string {
  return '⭐'.repeat(difficulty);
}

/**
 * 챕터 Part 번호를 제목으로 변환
 */
export function partNumberToTitle(part: 1 | 2 | 3 | 4): string {
  const titles: Record<number, string> = {
    1: '온톨로지의 이해',
    2: '온톨로지 기술',
    3: '실전 프로젝트',
    4: '온톨로지의 미래',
  };
  return titles[part] || '';
}
```

---

## 9. lib/constants.ts

**파일 위치:** `/lib/constants.ts`

```typescript
/**
 * 챕터 메타데이터
 */
export const CHAPTERS_META = [
  {
    id: 1,
    slug: 'ontology-basics',
    title: '온톨로지란 무엇인가?',
    description: '철학적 기원부터 현대적 의미까지, 온톨로지의 본질을 이해합니다',
    wordCount: 3200,
    duration: '30분',
    difficulty: 1 as const,
    part: 1 as const,
    partTitle: '온톨로지의 이해',
    order: 1,
    topics: ['철학', '지식 표현', 'Knowledge Graph', 'Google', 'Palantir'],
    publishedAt: '2025-11-09',
  },
  {
    id: 2,
    slug: 'rdf',
    title: 'RDF',
    description: 'Resource Description Framework의 구조와 직렬화 포맷을 마스터합니다',
    wordCount: 5800,
    duration: '90분',
    difficulty: 2 as const,
    part: 2 as const,
    partTitle: '온톨로지 기술',
    order: 2,
    topics: ['RDF Triple', 'Turtle', 'JSON-LD', 'Namespace'],
    publishedAt: '2025-11-09',
    simulator: {
      type: 'rdf-editor' as const,
      url: 'https://rdf-editor.example.com',
    },
  },
  {
    id: 3,
    slug: 'rdfs-owl',
    title: 'RDFS/OWL',
    description: 'RDFS와 OWL을 통한 온톨로지 모델링의 모든 것',
    wordCount: 6200,
    duration: '100분',
    difficulty: 3 as const,
    part: 2 as const,
    partTitle: '온톨로지 기술',
    order: 3,
    topics: ['RDFS', 'OWL', 'Class', 'Property', 'Restriction'],
    publishedAt: '2025-11-09',
    simulator: {
      type: 'rdf-editor' as const,
      url: 'https://rdf-editor.example.com',
    },
  },
  {
    id: 4,
    slug: 'sparql',
    title: 'SPARQL',
    description: 'SPARQL 쿼리 언어로 지식 그래프를 탐색합니다',
    wordCount: 6800,
    duration: '110분',
    difficulty: 3 as const,
    part: 2 as const,
    partTitle: '온톨로지 기술',
    order: 4,
    topics: ['SPARQL', 'DBpedia', 'Wikidata', '쿼리 최적화'],
    publishedAt: '2025-11-09',
    simulator: {
      type: 'sparql-playground' as const,
      url: 'https://sparql-playground.example.com',
    },
  },
  {
    id: 5,
    slug: 'reasoning',
    title: '추론 엔진',
    description: 'OWL 추론 엔진의 작동 원리와 활용법',
    wordCount: 7200,
    duration: '120분',
    difficulty: 4 as const,
    part: 2 as const,
    partTitle: '온톨로지 기술',
    order: 5,
    topics: ['Reasoning', 'Pellet', 'HermiT', 'Protégé'],
    publishedAt: '2025-11-09',
    simulator: {
      type: 'reasoning-engine' as const,
      url: 'https://reasoning-engine.example.com',
    },
  },
  {
    id: 6,
    slug: 'medical',
    title: '의료 온톨로지',
    description: 'SNOMED CT와 FHIR를 활용한 의료 온톨로지 구축',
    wordCount: 6500,
    duration: '100분',
    difficulty: 4 as const,
    part: 3 as const,
    partTitle: '실전 프로젝트',
    order: 6,
    topics: ['SNOMED CT', 'FHIR', 'Mayo Clinic', '의료 정보학'],
    publishedAt: '2025-11-09',
    simulator: {
      type: 'knowledge-graph' as const,
      url: 'https://kg-viz.example.com',
    },
  },
  {
    id: 7,
    slug: 'finance',
    title: '금융 온톨로지',
    description: 'FIBO를 활용한 금융 지식 그래프 구축',
    wordCount: 6800,
    duration: '110분',
    difficulty: 4 as const,
    part: 3 as const,
    partTitle: '실전 프로젝트',
    order: 7,
    topics: ['FIBO', 'Basel III', 'JPMorgan', '규제 준수'],
    publishedAt: '2025-11-09',
    simulator: {
      type: 'knowledge-graph' as const,
      url: 'https://kg-viz.example.com',
    },
  },
  {
    id: 8,
    slug: 'manufacturing',
    title: '제조 온톨로지',
    description: 'Palantir Foundry와 Industry 4.0',
    wordCount: 6700,
    duration: '105분',
    difficulty: 4 as const,
    part: 3 as const,
    partTitle: '실전 프로젝트',
    order: 8,
    topics: ['Palantir', 'Industry 4.0', 'Airbus', '디지털 트윈'],
    publishedAt: '2025-11-09',
    simulator: {
      type: 'knowledge-graph' as const,
      url: 'https://kg-viz.example.com',
    },
  },
  {
    id: 9,
    slug: 'ai-ontology',
    title: 'AI + 온톨로지',
    description: 'Graph RAG와 Neuro-Symbolic AI',
    wordCount: 7500,
    duration: '125분',
    difficulty: 5 as const,
    part: 3 as const,
    partTitle: '실전 프로젝트',
    order: 9,
    topics: ['Graph RAG', 'LLM', 'Hallucination', 'Neuro-Symbolic'],
    publishedAt: '2025-11-09',
    simulator: {
      type: 'knowledge-graph' as const,
      url: 'https://kg-viz.example.com',
    },
  },
  {
    id: 10,
    slug: 'future-trends',
    title: '미래 트렌드',
    description: '2025-2030 온톨로지 기술 전망과 커리어 가이드',
    wordCount: 4500,
    duration: '60분',
    difficulty: 2 as const,
    part: 4 as const,
    partTitle: '온톨로지의 미래',
    order: 10,
    topics: ['미래 트렌드', '커리어', '시장 전망', '실전 프로젝트'],
    publishedAt: '2025-11-09',
  },
] as const;

/**
 * Part 제목
 */
export const PART_TITLES: Record<number, string> = {
  1: 'PART 1: 온톨로지의 이해',
  2: 'PART 2: 온톨로지 기술',
  3: 'PART 3: 실전 프로젝트',
  4: 'PART 4: 온톨로지의 미래',
};

/**
 * 통계
 */
export const STATS = {
  totalChapters: 10,
  totalWords: 61200,
  totalSimulators: 4,
  totalCodeExamples: 150,
  totalCompanies: 30,
  averageWordsPerChapter: 6120,
};
```

---

## 10. app/globals.css

**파일 위치:** `/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;

    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;

    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;

    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;

    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;

    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;

    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;

    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;

    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;

    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;

    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;

    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;

    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;

    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-secondary;
}

::-webkit-scrollbar-thumb {
  @apply bg-muted-foreground/50 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-muted-foreground;
}

/* Smooth scroll */
html {
  scroll-behavior: smooth;
}

/* Focus visible */
*:focus-visible {
  @apply outline-none ring-2 ring-ring ring-offset-2;
}
```

---

## 11. styles/mdx.css

**파일 위치:** `/styles/mdx.css`

```css
/* MDX 전용 스타일 */

.mdx-content {
  @apply prose prose-lg dark:prose-invert max-w-none;
}

/* 코드 블록 */
.mdx-content pre {
  @apply rounded-lg p-4 overflow-x-auto my-6;
}

.mdx-content code {
  @apply text-sm font-mono;
}

/* 인라인 코드 */
.mdx-content :not(pre) > code {
  @apply bg-muted px-1.5 py-0.5 rounded text-sm;
}

/* 표 */
.mdx-content table {
  @apply w-full my-6;
}

.mdx-content th {
  @apply bg-muted font-semibold text-left p-3;
}

.mdx-content td {
  @apply p-3 border-t;
}

/* 인용구 */
.mdx-content blockquote {
  @apply border-l-4 border-primary pl-4 italic my-6;
}

/* 리스트 */
.mdx-content ul {
  @apply my-4 ml-6 list-disc;
}

.mdx-content ol {
  @apply my-4 ml-6 list-decimal;
}

.mdx-content li {
  @apply my-2;
}

/* 제목 */
.mdx-content h1 {
  @apply text-4xl font-bold mt-12 mb-6;
}

.mdx-content h2 {
  @apply text-3xl font-bold mt-10 mb-5;
}

.mdx-content h3 {
  @apply text-2xl font-bold mt-8 mb-4;
}

.mdx-content h4 {
  @apply text-xl font-bold mt-6 mb-3;
}

/* 링크 */
.mdx-content a {
  @apply text-primary hover:underline;
}

/* 구분선 */
.mdx-content hr {
  @apply my-8 border-border;
}

/* 이미지 */
.mdx-content img {
  @apply rounded-lg my-6;
}
```

---

## 적용 방법

### 1. 파일 백업
```bash
# 기존 파일 백업
cp next.config.js next.config.js.backup
cp tailwind.config.ts tailwind.config.ts.backup
cp app/globals.css app/globals.css.backup
```

### 2. 파일 교체
위의 각 섹션 내용을 복사해서 해당 파일에 붙여넣기

### 3. 확인
```bash
# TypeScript 타입 체크
npx tsc --noEmit

# 빌드 테스트
npm run build

# 개발 서버 실행
npm run dev
```

### 4. Git 커밋
```bash
git add .
git commit -m "Add configuration files"
```

---

## 다음 단계

✅ 설정 파일 완료 후:

1. **FIRST-COMPONENTS.md** 파일로 컴포넌트 생성
2. 개발 서버 재시작
3. http://localhost:3000 확인

---

**작성자:** Claude Web  
**작성일:** 2025-11-09  
**파일 수:** 11개  
**총 라인 수:** 1000+

**준비 완료! 🚀**
