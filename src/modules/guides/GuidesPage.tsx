import { useMemo, useState, useEffect } from "react"
import { ChevronRight } from "lucide-react"
import { GUIDES } from "@/data/guides"
import { RESEARCH_TYPE_LABELS } from "@/data/taxonomy"
import { GuideSidebar } from "./GuideSidebar"
import { Button } from "@/components/ui/button"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export function GuidesPage() {
  const [selectedGuideId, setSelectedGuideId] = useState<string>("welcome")

  const selectedGuide = useMemo(() => {
    return GUIDES.find(g => g.id === selectedGuideId) || GUIDES[0]
  }, [selectedGuideId])

  // Scroll to top when guide changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [selectedGuideId])

  // Get next and previous guides for navigation
  const { prevGuide, nextGuide } = useMemo(() => {
    const currentIndex = GUIDES.findIndex(g => g.id === selectedGuideId)
    const prev = currentIndex > 0 ? GUIDES[currentIndex - 1] : null
    const next = currentIndex < GUIDES.length - 1 ? GUIDES[currentIndex + 1] : null
    return { prevGuide: prev, nextGuide: next }
  }, [selectedGuideId])

  return (
    <div className="container mx-auto py-8">
      <div className="flex gap-8 relative">
        <GuideSidebar
          currentGuideId={selectedGuideId}
          onSelectGuide={setSelectedGuideId}
        />

        <main className="flex-1 min-w-0">
          {selectedGuide ? (
            <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-4 border-b border-border/50 pb-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <span>Guides</span>
                  <ChevronRight className="h-3 w-3" />
                  <span className="items-center gap-1 inline-flex">
                    {selectedGuide.researchTypes[0] && RESEARCH_TYPE_LABELS[selectedGuide.researchTypes[0]]}
                  </span>
                </div>

                <h1 className="text-4xl font-bold tracking-tight text-balance">{selectedGuide.title}</h1>
                <p className="text-xl text-muted-foreground leading-relaxed">{selectedGuide.summary}</p>

                <div className="flex items-center gap-6 text-sm text-muted-foreground pt-2">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                      RA
                    </div>
                    <span className="font-medium text-foreground">Research Atlas Team</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                    <span>Updated recently</span>
                  </div>
                </div>
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none">
                {selectedGuide.sections.map((section) => (
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
                            table: ({ node, ...props }) => <div className="my-6 w-full overflow-y-auto rounded-lg border bg-muted/20"><table className="w-full" {...props} /></div>,
                            thead: ({ node, ...props }) => <thead className="bg-muted/50 border-b" {...props} />,
                            tbody: ({ node, ...props }) => <tbody className="[&_tr:last-child]:border-0" {...props} />,
                            tr: ({ node, ...props }) => <tr className="border-b transition-colors hover:bg-muted/30" {...props} />,
                            th: ({ node, ...props }) => <th className="h-10 px-4 text-left align-middle font-semibold text-foreground [&:has([role=checkbox])]:pr-0" {...props} />,
                            td: ({ node, ...props }) => <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-sm" {...props} />,
                            p: ({ node, ...props }) => <p className="mb-4 last:mb-0" {...props} />,
                            a: ({ node, ...props }) => <a className="font-medium underline underline-offset-4 decoration-primary/50 hover:decoration-primary transition-colors" {...props} />,
                            ul: ({ node, ...props }) => <ul className="my-6 ml-6 list-disc [&>li]:mt-2" {...props} />,
                            ol: ({ node, ...props }) => <ol className="my-6 ml-6 list-decimal [&>li]:mt-2" {...props} />,
                            blockquote: ({ node, ...props }) => <blockquote className="mt-6 border-l-2 pl-6 italic text-muted-foreground" {...props} />,
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
                              <ReactMarkdown components={{ p: ({ node, ...props }) => <span {...props} />, strong: ({ node, ...props }) => <span className="font-semibold text-foreground" {...props} /> }}>
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

              <div className="border-t border-border/50 pt-8 mt-12 flex items-center justify-between">
                {prevGuide ? (
                  <Button
                    variant="outline"
                    className="h-auto py-4 px-6 flex flex-col items-start gap-1 max-w-[200px] text-left"
                    onClick={() => setSelectedGuideId(prevGuide.id)}
                  >
                    <span className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <ChevronRight className="h-3 w-3 rotate-180" /> Previous
                    </span>
                    <span className="font-medium truncate w-full">{prevGuide.title}</span>
                  </Button>
                ) : <div />}

                {nextGuide ? (
                  <Button
                    variant="default"
                    className="h-auto py-4 px-6 flex flex-col items-end gap-1 max-w-[200px] text-right"
                    onClick={() => setSelectedGuideId(nextGuide.id)}
                  >
                    <span className="text-xs text-primary-foreground/80 uppercase tracking-wider flex items-center gap-1">
                      Next <ChevronRight className="h-3 w-3" />
                    </span>
                    <span className="font-medium truncate w-full">{nextGuide.title}</span>
                  </Button>
                ) : <div />}
              </div>

              <div className="h-20" /> {/* Spacer */}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Select a guide to view details
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
