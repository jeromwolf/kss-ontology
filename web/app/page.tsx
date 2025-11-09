export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container flex flex-col items-center gap-8 py-24 md:py-32">
        <h1 className="text-center text-4xl font-bold leading-tight tracking-tighter md:text-6xl">
          세계에서 가장 깊이 있는
          <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            온톨로지 교육 플랫폼
          </span>
        </h1>

        <p className="max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl">
          MIT 수준의 콘텐츠와 인터랙티브 시뮬레이터로 온톨로지 전문가가 되세요
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <a
            href="/chapters"
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            시작하기
          </a>
          <a
            href="/about"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            자세히 알아보기
          </a>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/50">
        <div className="container py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
            <div className="text-center">
              <div className="text-4xl font-bold">10</div>
              <div className="mt-2 text-sm text-muted-foreground">챕터</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">61,200</div>
              <div className="mt-2 text-sm text-muted-foreground">단어</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">4</div>
              <div className="mt-2 text-sm text-muted-foreground">시뮬레이터</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">150+</div>
              <div className="mt-2 text-sm text-muted-foreground">코드 예제</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">30+</div>
              <div className="mt-2 text-sm text-muted-foreground">기업 사례</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
