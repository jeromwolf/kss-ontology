type Props = {
  children: React.ReactNode
}

export default function ChaptersLayout({ children }: Props) {
  return (
    <article className="container max-w-4xl py-8 md:py-12">
      <div className="prose prose-lg prose-slate dark:prose-invert max-w-none mdx-content">
        {children}
      </div>
    </article>
  )
}
