import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://kss-ontology.vercel.app'),
  title: {
    default: 'KSS Ontology - 세계에서 가장 깊이 있는 온톨로지 교육 플랫폼',
    template: '%s | KSS Ontology',
  },
  description: '시맨틱 웹, RDF, OWL, SPARQL을 체계적으로 학습하는 온톨로지 교육 플랫폼. 10개 챕터와 4개의 인터랙티브 시뮬레이터로 온톨로지를 마스터하세요.',
  keywords: ['온톨로지', 'Ontology', '시맨틱 웹', 'Semantic Web', 'RDF', 'OWL', 'SPARQL', '지식 그래프', 'Knowledge Graph', 'AI', '인공지능'],
  authors: [{ name: 'Kelly', url: 'https://github.com/jeromwolf' }],
  creator: 'Kelly',
  publisher: 'KSS Ontology',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://kss-ontology.vercel.app',
    title: 'KSS Ontology - 온톨로지 교육 플랫폼',
    description: '시맨틱 웹, RDF, OWL, SPARQL을 체계적으로 학습하는 온톨로지 교육 플랫폼',
    siteName: 'KSS Ontology',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KSS Ontology - 온톨로지 교육 플랫폼',
    description: '시맨틱 웹, RDF, OWL, SPARQL을 체계적으로 학습하는 온톨로지 교육 플랫폼',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
