import { NavLink } from 'react-router-dom'
import { ArrowRight, Compass, Copy, Layers, Library, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RESEARCH_TYPES, STAGES } from '@/data/taxonomy'

export function HomePage() {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-slate-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-950" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-900/20" />

                <div className="container mx-auto relative py-20 lg:py-32">
                    <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                        {/* Text Content */}
                        <div className="text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 backdrop-blur-sm px-4 py-1.5 text-sm font-medium mb-6">
                                <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                                Built for Research Rigor
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">
                                Research Atlas:{' '}
                                <span className="text-gradient">Prompts, Workflows, Guides</span>
                            </h1>
                            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                                Navigate a curated atlas of research-ready prompts, verified workflows,
                                and educational guides. Copy, adapt, and cite with confidence.
                            </p>
                            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                                <Button asChild size="lg" className="gap-2">
                                    <NavLink to="/library">
                                        Browse Library
                                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                    </NavLink>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="gap-2">
                                    <NavLink to="/workflows">
                                        Explore Workflows
                                        <Layers className="h-4 w-4" aria-hidden="true" />
                                    </NavLink>
                                </Button>
                            </div>
                        </div>

                        {/* Visual Preview */}
                        <div className="relative hidden lg:block">
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-2xl" />
                            <Card className="relative border-2 shadow-xl">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-red-500" />
                                        <div className="h-3 w-3 rounded-full bg-yellow-500" />
                                        <div className="h-3 w-3 rounded-full bg-green-500" />
                                        <span className="ml-2 text-xs text-muted-foreground">Prompt Preview</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="space-y-1">
                                        <div className="text-xs font-medium text-muted-foreground">GOAL</div>
                                        <div className="rounded-md bg-muted p-2 text-sm">
                                            Generate a comprehensive literature review outline…
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs font-medium text-muted-foreground">VARIABLES</div>
                                        <div className="flex gap-2">
                                            <span className="rounded bg-primary/10 px-2 py-1 text-xs font-mono text-primary">{'{{topic}}'}</span>
                                            <span className="rounded bg-primary/10 px-2 py-1 text-xs font-mono text-primary">{'{{scope}}'}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <Button size="sm" className="gap-1">
                                            <Copy className="h-3 w-3" aria-hidden="true" />
                                            Copy
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* What You'll Find */}
            <section className="border-y bg-muted/30 py-8">
                <div className="container mx-auto">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="border-0 bg-transparent shadow-none">
                            <CardHeader className="pb-2">
                                <Library className="h-5 w-5 text-primary" aria-hidden="true" />
                                <CardTitle className="text-base mt-2">Prompt Library</CardTitle>
                                <CardDescription>
                                    Copy-ready prompts mapped to research stages and methods.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                        <Card className="border-0 bg-transparent shadow-none">
                            <CardHeader className="pb-2">
                                <Layers className="h-5 w-5 text-primary" aria-hidden="true" />
                                <CardTitle className="text-base mt-2">Workflows</CardTitle>
                                <CardDescription>
                                    Step-by-step pipelines like FOCUS and EXHYTE.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                        <Card className="border-0 bg-transparent shadow-none">
                            <CardHeader className="pb-2">
                                <Compass className="h-5 w-5 text-primary" aria-hidden="true" />
                                <CardTitle className="text-base mt-2">Guides</CardTitle>
                                <CardDescription>
                                    Education-first resources on rigor, verification, and ethics.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Explore by Stage */}
            <section className="py-20 lg:py-24">
                <div className="container mx-auto">
                    <div>
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-balance">
                                Explore by Research Stage
                            </h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Find prompts and workflows tailored to each phase of your research.
                            </p>
                        </div>
                        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {STAGES.map((stage) => (
                                <NavLink key={stage.id} to={`/library?stage=${stage.id}`}>
                                    <Card className="group transition-shadow transition-colors hover:shadow-lg hover:border-primary/50">
                                        <CardHeader>
                                            <CardTitle className="text-lg mt-1">{stage.label}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription className="text-sm leading-relaxed">
                                                {stage.description}
                                            </CardDescription>
                                        </CardContent>
                                    </Card>
                                </NavLink>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Research Types */}
            <section className="border-y bg-muted/30 py-20 lg:py-24">
                <div className="container mx-auto">
                    <div>
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-balance">
                                Explore by Research Type
                            </h2>
                            <p className="mt-4 text-muted-foreground">
                                Jump directly to recommended workflows for your method.
                            </p>
                        </div>
                        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {RESEARCH_TYPES.map((type) => (
                                <NavLink key={type.id} to={`/workflows?type=${type.id}`}>
                                    <Card className="group transition-shadow transition-colors hover:shadow-lg hover:border-primary/50">
                                        <CardHeader>
                                            <CardTitle className="text-lg mt-1">{type.label}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription className="text-sm leading-relaxed">
                                                {type.description}
                                            </CardDescription>
                                        </CardContent>
                                    </Card>
                                </NavLink>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 lg:py-24">
                <div className="container mx-auto">
                    <div className="mx-auto max-w-3xl rounded-2xl bg-primary p-8 text-center text-primary-foreground sm:p-12">
                        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-balance">
                            Ready to streamline your prompt workflow?
                        </h2>
                        <p className="mt-4 text-primary-foreground/80">
                            Start with a workflow pack or browse the full library.
                        </p>
                        <Button asChild size="lg" variant="secondary" className="mt-8 gap-2">
                            <NavLink to="/guides">
                                Explore Guides
                                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </NavLink>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
