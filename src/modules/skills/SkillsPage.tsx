import { Helmet } from 'react-helmet-async'
import { CheckCircle2, ExternalLink, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const REPO_URL = 'https://github.com/ResearchAtlas/Research-Atlas'

const WHAT_IT_DOES = [
    'Resolves DOI-backed references against CrossRef first, with OpenAlex as fallback.',
    'Cross-checks title, first-author surname, and publication year to catch fabricated DOIs and metadata mismatches.',
    'Emits a structured per-reference verdict envelope alongside a human-readable report.',
]

export function SkillsPage() {
    const canonical = 'https://researchatlas.info/skills'
    const description = 'Research Atlas ships one flagship agent skill: research-verification. See what it does and how to install it on Claude Code or Codex CLI.'
    const socialTitle = 'Skills | Research Atlas'

    return (
        <div className="container mx-auto py-8">
            <Helmet>
                <title>{socialTitle}</title>
                <meta name="description" content={description} />
                <link rel="canonical" href={canonical} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={canonical} />
                <meta property="og:title" content={socialTitle} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content="https://researchatlas.info/og/cover-1200x630-v2.png" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={canonical} />
                <meta name="twitter:title" content={socialTitle} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content="https://researchatlas.info/og/cover-1200x630-v2.png" />
            </Helmet>

            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Agent Skills</h1>
                    <p className="mt-2 max-w-2xl text-muted-foreground">
                        Research Atlas ships one flagship Agent Skill, usable from Claude Code and Codex CLI.
                        It lives in the same repo as this site.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
                            <CardTitle className="text-xl">research-verification</CardTitle>
                            {/* Skill version — keep in sync with .claude/skills/research-verification/SKILL.md frontmatter */}
                            <Badge variant="secondary">Skill v2.2.0</Badge>
                        </div>
                        <CardDescription>
                            End-to-end reference verification across Claude Code and Codex CLI.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {WHAT_IT_DOES.map((item) => (
                                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <a
                            href={REPO_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                        >
                            View on GitHub
                            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                    </CardContent>
                </Card>

                <div>
                    <h2 className="text-xl font-semibold tracking-tight mb-4">Install on your agent</h2>
                    <Tabs defaultValue="claude" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="claude">Claude Code</TabsTrigger>
                            <TabsTrigger value="codex">Codex CLI</TabsTrigger>
                        </TabsList>
                        <TabsContent value="claude" className="mt-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base">Via the plugin marketplace</CardTitle>
                                    <CardDescription>
                                        Two commands in a Claude Code session. The skill is auto-discovered and prompt-triggered.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <pre className="overflow-x-auto rounded-lg border bg-muted/50 p-4 text-sm font-mono">
{`/plugin marketplace add ResearchAtlas/Research-Atlas
/plugin install research-verification@research-atlas`}
                                    </pre>
                                    <p className="mt-3 text-sm text-muted-foreground">
                                        Then ask: <span className="font-mono">&ldquo;verify these references&rdquo;</span> and paste your list.
                                    </p>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="codex" className="mt-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base">Native <span className="font-mono">.agents/skills</span> discovery</CardTitle>
                                    <CardDescription>
                                        Clone the repo and launch Codex from inside it — the skill is picked up natively from{' '}
                                        <span className="font-mono">.agents/skills/research-verification/</span>.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <pre className="overflow-x-auto rounded-lg border bg-muted/50 p-4 text-sm font-mono">
{`git clone https://github.com/ResearchAtlas/Research-Atlas
cd Research-Atlas
codex`}
                                    </pre>
                                    <p className="mt-3 text-sm text-muted-foreground">
                                        Then ask: <span className="font-mono">&ldquo;verify these references&rdquo;</span>, or invoke it directly with{' '}
                                        <span className="font-mono">$research-verification</span>.
                                    </p>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
