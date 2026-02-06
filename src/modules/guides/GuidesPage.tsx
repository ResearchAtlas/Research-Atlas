import { useMemo, useEffect } from "react"
import { Helmet } from 'react-helmet-async'
import { ChevronRight } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { EDITORIAL_POLICY, GUIDES } from "@/data/guides"
import { RESEARCH_TYPE_LABELS } from "@/data/taxonomy"
import { guidePathFromId } from "@/lib/seoRoutes"
import { GuideSidebar } from "./GuideSidebar"
import { Button } from "@/components/ui/button"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

function formatIsoDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number)
  const safeDate = new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1))
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(safeDate)
}

export function GuidesPage() {
  const { guideId } = useParams<{ guideId?: string }>()
  const selectedGuideId = guideId ?? "welcome"

  const selectedGuide = useMemo(() => {
    return GUIDES.find(g => g.id === selectedGuideId) || null
  }, [selectedGuideId])

  const fallbackGuide = GUIDES[0]
  const activeGuide = selectedGuide ?? fallbackGuide
  const isNotFound = selectedGuide === null
  const sidebarGuideId = selectedGuide?.id ?? null

  const canonicalHref = isNotFound
    ? "https://researchatlas.info/guides"
    : `https://researchatlas.info${guidePathFromId(activeGuide.id)}`

  const pageDescription = isNotFound
    ? "The requested guide could not be found."
    : activeGuide.summary

  const socialTitle = isNotFound
    ? "Guide Not Found | Research Atlas"
    : activeGuide.id === "welcome"
      ? "Research Guides | Research Atlas"
      : `${activeGuide.title} | Research Atlas`

  const updatedLabel = formatIsoDate(activeGuide.lastUpdated)

  // Scroll to top when guide changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [selectedGuideId])

  // Get next and previous guides for navigation
  const { prevGuide, nextGuide } = useMemo(() => {
    const currentIndex = GUIDES.findIndex(g => g.id === activeGuide.id)
    const prev = currentIndex > 0 ? GUIDES[currentIndex - 1] : null
    const next = currentIndex < GUIDES.length - 1 ? GUIDES[currentIndex + 1] : null
    return { prevGuide: prev, nextGuide: next }
  }, [activeGuide.id])

  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>{socialTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalHref} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalHref} />
        <meta property="og:title" content={socialTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content="https://researchatlas.info/og/cover-1200x630.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonicalHref} />
        <meta name="twitter:title" content={socialTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content="https://researchatlas.info/og/cover-1200x630.png" />
        {isNotFound && <meta name="robots" content="noindex, nofollow" />}
      </Helmet>
      <div className="flex gap-8 relative">
        <GuideSidebar
          currentGuideId={sidebarGuideId}
        />

        <section aria-label="Guide content" className="flex-1 min-w-0">
          {!isNotFound ? (
            <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-4 border-b border-border/50 pb-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <span>Guides</span>
                  <ChevronRight className="h-3 w-3" />
                  <span className="items-center gap-1 inline-flex">
                    {activeGuide.researchTypes[0] && RESEARCH_TYPE_LABELS[activeGuide.researchTypes[0]]}
                  </span>
                </div>

                <h1 className="text-4xl font-bold tracking-tight text-balance">{activeGuide.title}</h1>
                <p className="text-xl text-muted-foreground leading-relaxed">{activeGuide.summary}</p>

                <div className="flex items-center gap-6 text-sm text-muted-foreground pt-2">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                      RA
                    </div>
                    <span className="font-medium text-foreground">Research Atlas Team</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                    <span>Updated {updatedLabel}</span>
                  </div>
                </div>
              </div>

              <section className="rounded-xl border bg-muted/20 p-5 space-y-3">
                <h2 className="text-lg font-semibold">Editorial Policy</h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {EDITORIAL_POLICY.map((policy) => (
                    <li key={policy} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      <span>{policy}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <div className="prose prose-slate dark:prose-invert max-w-none">
                {activeGuide.sections.map((section) => (
                  <section key={section.id} className="mb-10">
                    <h2 className="text-2xl font-semibold tracking-tight mb-4 flex items-center gap-2 group">
                      {section.title}
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary text-lg cursor-pointer">#</span>
                    </h2>

                    {section.body && (
                      <div className="text-base leading-7 text-muted-foreground/90">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            table: ({ node, ...props }) => {
                              void node
                              return <div className="my-6 w-full overflow-y-auto rounded-lg border bg-muted/20"><table className="w-full" {...props} /></div>
                            },
                            thead: ({ node, ...props }) => {
                              void node
                              return <thead className="bg-muted/50 border-b" {...props} />
                            },
                            tbody: ({ node, ...props }) => {
                              void node
                              return <tbody className="[&_tr:last-child]:border-0" {...props} />
                            },
                            tr: ({ node, ...props }) => {
                              void node
                              return <tr className="border-b transition-colors hover:bg-muted/30" {...props} />
                            },
                            th: ({ node, ...props }) => {
                              void node
                              return <th className="h-10 px-4 text-left align-middle font-semibold text-foreground [&:has([role=checkbox])]:pr-0" {...props} />
                            },
                            td: ({ node, ...props }) => {
                              void node
                              return <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-sm" {...props} />
                            },
                            p: ({ node, ...props }) => {
                              void node
                              return <p className="mb-4 last:mb-0" {...props} />
                            },
                            a: ({ node, ...props }) => {
                              void node
                              return <a className="font-medium underline underline-offset-4 decoration-primary/50 hover:decoration-primary transition-colors" {...props} />
                            },
                            ul: ({ node, ...props }) => {
                              void node
                              return <ul className="my-6 ml-6 list-disc [&>li]:mt-2" {...props} />
                            },
                            ol: ({ node, ...props }) => {
                              void node
                              return <ol className="my-6 ml-6 list-decimal [&>li]:mt-2" {...props} />
                            },
                            blockquote: ({ node, ...props }) => {
                              void node
                              return <blockquote className="mt-6 border-l-2 pl-6 italic text-muted-foreground" {...props} />
                            },
                          }}
                        >
                          {section.body}
                        </ReactMarkdown>
                      </div>
                    )}

                    {section.bullets && (
                      <ul className="mt-4 space-y-3">
                        {section.bullets.map((item, i) => (
                          <li key={i} className="flex gap-3 text-muted-foreground/90">
                            <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                            <span className="flex-1">
                              <ReactMarkdown
                                components={{
                                  p: ({ node, ...props }) => {
                                    void node
                                    return <span {...props} />
                                  },
                                  strong: ({ node, ...props }) => {
                                    void node
                                    return <span className="font-semibold text-foreground" {...props} />
                                  },
                                }}
                              >
                                {item}
                              </ReactMarkdown>
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}
              </div>

              {activeGuide.sources.length > 0 && (
                <section className="rounded-xl border bg-background p-5">
                  <h2 className="text-xl font-semibold">Sources</h2>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {activeGuide.sources.map((source) => (
                      <li key={`${activeGuide.id}-${source.title}`} className="leading-relaxed">
                        {source.url ? (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                            className="underline underline-offset-4 decoration-primary/50 hover:decoration-primary"
                          >
                            {source.title}
                          </a>
                        ) : (
                          <span>{source.title}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <div className="border-t border-border/50 pt-8 mt-12 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {prevGuide ? (
                  <Button
                    asChild
                    variant="outline"
                    className="h-auto py-4 px-6 flex flex-col items-start gap-1 w-full max-w-none text-left sm:max-w-[200px]"
                  >
                    <Link to={guidePathFromId(prevGuide.id)}>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <ChevronRight className="h-3 w-3 rotate-180" /> Previous
                      </span>
                      <span className="font-medium truncate w-full">{prevGuide.title}</span>
                    </Link>
                  </Button>
                ) : <div className="hidden sm:block" />}

                {nextGuide ? (
                  <Button
                    asChild
                    variant="default"
                    className="h-auto py-4 px-6 flex flex-col items-end gap-1 w-full max-w-none text-right sm:max-w-[200px]"
                  >
                    <Link to={guidePathFromId(nextGuide.id)}>
                      <span className="text-xs text-primary-foreground/80 uppercase tracking-wider flex items-center gap-1">
                        Next <ChevronRight className="h-3 w-3" />
                      </span>
                      <span className="font-medium truncate w-full">{nextGuide.title}</span>
                    </Link>
                  </Button>
                ) : <div />}
              </div>

              <div className="h-20" /> {/* Spacer */}
            </div>
          ) : (
            <div className="max-w-3xl mx-auto py-24 text-center space-y-4">
              <h1 className="text-3xl font-bold tracking-tight">Guide Not Found</h1>
              <p className="text-muted-foreground">
                The requested guide does not exist. Browse all available guides from the sidebar.
              </p>
              <Button asChild>
                <Link to="/guides">Back to Research Guides</Link>
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
