import { NavLink } from 'react-router-dom'
import { ArrowRight, Copy, Layers, Sparkles, Zap, Shield, Users, Lightbulb, BarChart, Terminal } from 'lucide-react'
import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { Helmet } from 'react-helmet-async'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BlurText from '@/components/react-bits/BlurText'
import { GUIDES } from '@/data/guides'
import { PROMPTS } from '@/data/prompts'
import { STAGES } from '@/data/taxonomy'
import { WORKFLOWS } from '@/data/workflows'
import { guidePathFromId } from '@/lib/seoRoutes'

const Counter = ({ value }: { value: number }) => {
    const motionValue = useMotionValue(0)
    const springValue = useSpring(motionValue, { duration: 3000, bounce: 0 })
    const rounded = useTransform(springValue, (latest) => Math.round(latest))

    useEffect(() => {
        motionValue.set(value)
    }, [value, motionValue])

    return <motion.span>{rounded}</motion.span>
}

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
}

const stagger = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
}

export function HomePage() {
    const promptCount = PROMPTS.length
    const workflowCount = WORKFLOWS.length
    const guideCount = GUIDES.length
    const trendingItems: {
        category: string
        title: string
        description: string
        to: string
    }[] = []

    if (PROMPTS[0]) {
        trendingItems.push({
            category: 'Prompt',
            title: PROMPTS[0].title,
            description: PROMPTS[0].description,
            to: `/library?prompt=${encodeURIComponent(PROMPTS[0].id)}`,
        })
    }

    if (WORKFLOWS[0]) {
        trendingItems.push({
            category: 'Workflow',
            title: WORKFLOWS[0].title,
            description: WORKFLOWS[0].description,
            to: `/workflows?q=${encodeURIComponent(WORKFLOWS[0].title)}`,
        })
    }

    if (GUIDES[0]) {
        trendingItems.push({
            category: 'Guide',
            title: GUIDES[0].title,
            description: GUIDES[0].summary,
            to: guidePathFromId(GUIDES[0].id),
        })
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Helmet titleTemplate="%s">
                <title>Research Atlas | AI Prompts & Workflows for Academic Research</title>
                <meta name="description" content="Explore AI prompts, workflows, and method guides designed to strengthen academic research quality and speed." />
                <link rel="canonical" href="https://researchatlas.info/" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://researchatlas.info/" />
                <meta property="og:title" content="Research Atlas | AI Prompts & Workflows for Academic Research" />
                <meta property="og:description" content="Explore AI prompts, workflows, and method guides designed to strengthen academic research quality and speed." />
                <meta property="og:image" content="https://researchatlas.info/og/cover-1200x630-v2.png" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content="https://researchatlas.info/" />
                <meta name="twitter:title" content="Research Atlas | AI Prompts & Workflows for Academic Research" />
                <meta name="twitter:description" content="Explore AI prompts, workflows, and method guides designed to strengthen academic research quality and speed." />
                <meta name="twitter:image" content="https://researchatlas.info/og/cover-1200x630-v2.png" />
            </Helmet>
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-24">
                {/* Background gradient */}
                <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-slate-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-950"
                    aria-hidden="true"
                />
                <div
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-900/20"
                    aria-hidden="true"
                />
                <div className="pointer-events-none absolute inset-0 bg-grid opacity-40 mix-blend-overlay" aria-hidden="true" />

                <div className="container mx-auto relative z-10">
                    <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center lg:text-left"
                        >
                            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 backdrop-blur-sm px-4 py-1.5 text-sm font-medium mb-6 animate-in fade-in zoom-in duration-500">
                                <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                                Built for Research Rigor
                            </div>
                            <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl text-balance bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 pb-4 leading-tight">
                                Unlock Research Rigor
                            </h1>
                            <BlurText
                                text="with AI-Assisted Tools"
                                animateBy="words"
                                delay={120}
                                className="mt-3 text-2xl font-semibold text-primary sm:text-3xl lg:text-4xl justify-center lg:justify-start"
                            />
                            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                Ship evidence-grade literature reviews, verified citations, and reproducible analyses with AI workflows built for academic rigor.
                            </p>
                            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                                <Button asChild size="lg" className="gap-2 h-12 px-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow">
                                    <NavLink to="/library">
                                        Explore Library
                                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                    </NavLink>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="gap-2 h-12 px-6 backdrop-blur-sm bg-background/50 hover:bg-background/80">
                                    <NavLink to="/workflows">
                                        Explore Workflows
                                        <Layers className="h-4 w-4" aria-hidden="true" />
                                    </NavLink>
                                </Button>
                            </div>
                        </motion.div>

                        {/* Visual Preview */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative hidden lg:block perspective-1000"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-3xl opacity-50 animate-pulse" />
                            <Card className="relative border-2 shadow-2xl bg-card/50 backdrop-blur-xl transform transition-transform duration-500 ease-out-expo hover:rotate-y-[-5deg] hover:rotate-x-[5deg]">
                                <CardHeader className="pb-2 border-b border-border/50">
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1.5">
                                            <div className="h-3 w-3 rounded-full bg-red-500/80" />
                                            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                                            <div className="h-3 w-3 rounded-full bg-green-500/80" />
                                        </div>
                                        <span className="ml-2 text-xs font-mono text-muted-foreground/80">research-prompt.yaml</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4 p-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="text-xs font-semibold text-primary/80 uppercase tracking-wider">Research Goal</div>
                                            <Badge variant="outline" className="text-[10px] h-5">Qualitative</Badge>
                                        </div>
                                        <div className="rounded-lg bg-muted/50 p-3 text-sm font-medium border border-border/50">
                                            Generate a comprehensive literature review outline analyzing themes in...
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-xs font-semibold text-primary/80 uppercase tracking-wider">Parameters</div>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="rounded-md bg-blue-500/10 px-2 py-1 text-xs font-mono text-blue-600 dark:text-blue-400 border border-blue-500/20">{'{{topic}}'}</span>
                                            <span className="rounded-md bg-purple-500/10 px-2 py-1 text-xs font-mono text-purple-600 dark:text-purple-400 border border-purple-500/20">{'{{scope}}'}</span>
                                            <span className="rounded-md bg-orange-500/10 px-2 py-1 text-xs font-mono text-orange-600 dark:text-orange-400 border border-orange-500/20">{'{{methodology}}'}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <Button size="sm" className="w-full gap-2 shadow-sm">
                                            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                                            Copy Prompt
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Get Started */}
            <section className="py-20 lg:py-24">
                <div className="container mx-auto">
                    <motion.div
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="mx-auto max-w-2xl text-center"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-balance">
                            Get Started: Select Your Path
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Choose your research mode to surface workflows designed for your method.
                        </p>
                    </motion.div>
                    <motion.div
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={stagger}
                        className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 [grid-auto-rows:1fr]"
                    >
                        {[
                            {
                                title: "Qualitative",
                                subtitle: "Thematic Analysis & Grounded Theory",
                                type: "qualitative",
                                color: "from-blue-500/20 to-cyan-500/20",
                                metaColor: "text-blue-500",
                                icon: Lightbulb
                            },
                            {
                                title: "Quantitative",
                                subtitle: "Statistical Modeling & Hypothesis Testing",
                                type: "quantitative",
                                color: "from-purple-500/20 to-pink-500/20",
                                metaColor: "text-purple-500",
                                icon: BarChart
                            },
                            {
                                title: "Mixed Methods",
                                subtitle: "Convergent Design & Triangulation",
                                type: "mixed_methods",
                                color: "from-orange-500/20 to-red-500/20",
                                metaColor: "text-orange-500",
                                icon: Layers
                            },
                        ].map((path) => (
                            <motion.div key={path.type} variants={fadeInUp} className="h-full">
                                <NavLink
                                    to={`/workflows?type=${path.type}`}
                                    className="block h-full group"
                                >
                                    <Card className="relative h-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-muted bg-gradient-to-br from-card to-card/50 dark:from-card dark:to-muted/10">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${path.color} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />

                                        {/* Abstract Shape Background */}
                                        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/5 blur-3xl transition-all duration-500 group-hover:bg-primary/10" />

                                        <CardHeader className="relative z-10">
                                            <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-background/50 backdrop-blur-md shadow-sm border border-black/5 dark:border-white/5 ${path.metaColor}`}>
                                                <path.icon className="h-6 w-6" />
                                            </div>
                                            <CardTitle className="text-xl">{path.title}</CardTitle>
                                            <CardDescription className="line-clamp-2">
                                                {path.subtitle}
                                            </CardDescription>
                                        </CardHeader>

                                        <CardContent className="relative z-10 mt-auto">
                                            {/* Visual representation area */}
                                            <div className="mb-6 h-24 w-full rounded-lg bg-muted/30 border border-black/5 dark:border-white/5 flex items-center justify-center overflow-hidden group-hover:border-primary/20 transition-colors">
                                                {path.type === 'qualitative' && (
                                                    <div className="flex gap-2">
                                                        <div className="h-16 w-12 rounded-md bg-background shadow-sm border p-1 space-y-1 group-hover:scale-110 transition-transform duration-500">
                                                            <div className="h-1 w-8 rounded-full bg-blue-500/40" />
                                                            <div className="h-1 w-6 rounded-full bg-muted-foreground/20" />
                                                            <div className="h-1 w-8 rounded-full bg-muted-foreground/20" />
                                                        </div>
                                                        <div className="h-16 w-12 rounded-md bg-background shadow-sm border p-1 space-y-1 mt-2 group-hover:scale-110 transition-transform duration-500 delay-75">
                                                            <div className="h-1 w-5 rounded-full bg-cyan-500/40" />
                                                            <div className="h-1 w-8 rounded-full bg-muted-foreground/20" />
                                                        </div>
                                                    </div>
                                                )}
                                                {path.type === 'quantitative' && (
                                                    <div className="flex items-end gap-1.5 h-12">
                                                        <div className="w-3 rounded-t-sm bg-purple-500/20 h-[40%] group-hover:h-[60%] transition-all duration-500" />
                                                        <div className="w-3 rounded-t-sm bg-purple-500/40 h-[70%] group-hover:h-[90%] transition-all duration-500 delay-75" />
                                                        <div className="w-3 rounded-t-sm bg-purple-500/60 h-[50%] group-hover:h-[80%] transition-all duration-500 delay-100" />
                                                        <div className="w-3 rounded-t-sm bg-purple-500/80 h-[90%] group-hover:h-[100%] transition-all duration-500 delay-150" />
                                                    </div>
                                                )}
                                                {path.type === 'mixed_methods' && (
                                                    <div className="relative h-16 w-16">
                                                        <div className="absolute inset-0 rounded-full border-2 border-orange-500/20 group-hover:border-orange-500/40 transition-colors" />
                                                        <div className="absolute inset-4 rounded-full border-2 border-red-500/20 group-hover:border-red-500/40 transition-colors" />
                                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-orange-500/60 group-hover:scale-150 transition-transform" />
                                                    </div>
                                                )}
                                            </div>

                                            <Button variant="secondary" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all relative overflow-hidden">
                                                <span className="mx-auto font-medium">Start Path</span>
                                                <ArrowRight className="absolute right-4 h-4 w-4 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </NavLink>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Why Research Atlas? */}
            <section className="py-20 lg:py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-muted/50" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

                <div className="container mx-auto relative z-10">
                    <motion.div
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={stagger}
                        className="mx-auto max-w-2xl text-center mb-16"
                    >
                        <motion.h2 variants={fadeInUp} className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                            Why Researchers Choose Atlas
                        </motion.h2>
                        <motion.p variants={fadeInUp} className="mt-4 text-muted-foreground text-lg">
                            Built to bridge the gap between academic rigor and AI efficiency.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={stagger}
                        className="grid gap-8 md:grid-cols-3"
                    >
                        {[
                            {
                                icon: Zap,
                                title: "Accelerated Discovery",
                                description: "Method-specific workflows reduce repetitive setup time while preserving rigor-focused steps.",
                                color: "text-blue-500",
                                bg: "bg-blue-500/10",
                                border: "group-hover:border-blue-500/50",
                                glow: "to-blue-500/5",
                            },
                            {
                                icon: Shield,
                                title: "Rigor First",
                                description: "Prompts are designed with verification steps, bias checks, and citation-oriented review patterns.",
                                color: "text-purple-500",
                                bg: "bg-purple-500/10",
                                border: "group-hover:border-purple-500/50",
                                glow: "to-purple-500/5",
                            },
                            {
                                icon: Users,
                                title: "Iteratively Refined",
                                description: "Library entries are reviewed and improved over time as new use cases and edge cases are identified.",
                                color: "text-orange-500",
                                bg: "bg-orange-500/10",
                                border: "group-hover:border-orange-500/50",
                                glow: "to-orange-500/5",
                            }
                        ].map((feature, i) => (
                            <motion.div key={i} variants={fadeInUp} className="h-full">
                                <Card className={`group h-full border border-border/50 bg-background/60 backdrop-blur-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${feature.border}`}>
                                    <CardHeader>
                                        <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${feature.bg} ${feature.color} transition-transform duration-300 group-hover:scale-110`}>
                                            <feature.icon className="h-7 w-7" />
                                        </div>
                                        <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-base leading-relaxed text-muted-foreground/80 group-hover:text-muted-foreground transition-colors">
                                            {feature.description}
                                        </CardDescription>
                                    </CardContent>
                                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-transparent ${feature.glow}`} />
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Atlas Highlights */}
            <section className="py-20 lg:py-24 relative">
                <div className="container mx-auto">
                    <motion.div
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="mx-auto max-w-2xl text-center mb-16"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                            Atlas Highlights
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Evidence-first tooling for every stage of discovery.
                        </p>
                    </motion.div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {[
                            {
                                label: "Prompt Library",
                                value: promptCount,
                                suffix: "+",
                                description: "Field-tested prompts with variables",
                                icon: Sparkles,
                                color: "text-blue-500",
                                gradient: "from-blue-500/20 to-transparent"
                            },
                            {
                                label: "Workflow Packs",
                                value: workflowCount,
                                description: "Multi-phase research pipelines",
                                icon: Layers,
                                color: "text-purple-500",
                                gradient: "from-purple-500/20 to-transparent"
                            },
                            {
                                label: "Guides & Protocols",
                                value: guideCount,
                                description: "Method guidance & ethics primers",
                                icon: Shield,
                                color: "text-emerald-500",
                                gradient: "from-emerald-500/20 to-transparent"
                            },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="relative overflow-hidden rounded-3xl border bg-background/50 backdrop-blur-sm p-8 transition-all hover:border-primary/50 hover:shadow-lg lg:p-10">
                                    <div className={`absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${stat.gradient} blur-3xl opacity-50`} />

                                    <div className="relative z-10 flex flex-col items-center text-center">
                                        <div className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-muted ${stat.color}`}>
                                            <stat.icon className="h-6 w-6" />
                                        </div>

                                        <div className="flex items-baseline gap-1 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                                            <span className="bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-transparent">
                                                <Counter value={stat.value} />
                                            </span>
                                            {stat.suffix && <span className={`text-4xl ${stat.color}`}>{stat.suffix}</span>}
                                        </div>

                                        <div className="mt-4 space-y-2">
                                            <h3 className="font-semibold text-lg uppercase tracking-wide text-muted-foreground">{stat.label}</h3>
                                            <p className="text-muted-foreground/80">{stat.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trending Now */}
            <section className="py-20 lg:py-24">
                <div className="container mx-auto">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-balance">Trending Now</h2>
                            <p className="mt-3 text-muted-foreground">
                                Popular picks from across the Atlas.
                            </p>
                        </div>
                        <Button asChild variant="outline">
                            <NavLink to="/library">View all</NavLink>
                        </Button>
                    </div>
                    <motion.div
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={stagger}
                        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 [grid-auto-rows:1fr]"
                    >
                        {trendingItems.map((item) => (
                            <motion.div key={item.title} variants={fadeInUp} className="h-full">
                                <NavLink to={item.to} className="block h-full">
                                    <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/50">
                                        <CardHeader className="pb-3">
                                            <Badge variant="secondary" className="w-fit transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                                {item.category}
                                            </Badge>
                                            <CardTitle className="text-lg mt-3 group-hover:text-primary transition-colors">{item.title}</CardTitle>
                                            <CardDescription className="line-clamp-3">
                                                {item.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="mt-auto pt-0">
                                            <div className="text-sm font-medium text-primary flex items-center gap-2 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                                                Explore now <ArrowRight className="h-3 w-3" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </NavLink>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Explore by Stage */}
            <section className="py-20 lg:py-24 overflow-hidden">
                <div className="container mx-auto">
                    <div className="mx-auto max-w-2xl text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tight text-balance">
                            Explore by Research Stage
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Click a stage to filter the prompt library instantly.
                        </p>
                    </div>
                    <div className="rounded-3xl border bg-muted/30 p-6 lg:p-10 relative overflow-hidden">
                        <div
                            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"
                            aria-hidden="true"
                        />
                        <div className="relative">
                            <div className="flex flex-wrap justify-center gap-4 relative z-10">
                                {STAGES.map((stage, i) => (
                                    <NavLink
                                        key={stage.id}
                                        to={`/library?stage=${stage.id}`}
                                        className="block min-w-[160px] flex-1 max-w-[240px]"
                                    >
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.05 }}
                                            className="h-full"
                                        >
                                            <Card className="group h-full border bg-background/80 backdrop-blur-sm transition-all duration-200 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1">
                                                <CardHeader className="pb-3 p-4 flex flex-row items-center gap-3 space-y-0">
                                                    <div className="h-2 w-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors shrink-0" />
                                                    <CardTitle className="text-sm font-medium leading-none">{stage.label}</CardTitle>
                                                </CardHeader>
                                            </Card>
                                        </motion.div>
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Install on your agent */}
            <section id="install" className="py-20 lg:py-24">
                <div className="container mx-auto">
                    <div className="mx-auto max-w-3xl text-center mb-10">
                        <Badge variant="secondary" className="mb-4">
                            <Terminal className="mr-1 h-3 w-3" aria-hidden="true" />
                            New: flagship skill
                        </Badge>
                        <h2 className="text-3xl font-bold tracking-tight text-balance">
                            Install <span className="text-primary">Research Verification</span> on your agent
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            One canonical skill. Three agents. Verifies reference lists end-to-end against CrossRef and OpenAlex, catches fabricated DOIs, and returns a structured per-reference verdict.
                        </p>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                        className="mx-auto max-w-3xl"
                    >
                        <Tabs defaultValue="claude" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="claude">Claude Code</TabsTrigger>
                                <TabsTrigger value="codex">Codex CLI</TabsTrigger>
                                <TabsTrigger value="gemini">Gemini CLI</TabsTrigger>
                            </TabsList>
                            <TabsContent value="claude" className="mt-4">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base">Via the plugin marketplace</CardTitle>
                                        <CardDescription>
                                            Two commands in a Claude Code session. Skill is auto-discovered and prompt-triggered.
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
                                            Clone the repo and launch Codex from inside it — the skill is picked up natively from <span className="font-mono">.agents/skills/research-verification/</span>. No config.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <pre className="overflow-x-auto rounded-lg border bg-muted/50 p-4 text-sm font-mono">
{`git clone https://github.com/ResearchAtlas/Research-Atlas
cd Research-Atlas
codex   # ask: "verify these references" or run $research-verification`}
                                        </pre>
                                        <p className="mt-3 text-sm text-muted-foreground">
                                            Or symlink <span className="font-mono">.agents/skills/research-verification</span> into your own project&apos;s <span className="font-mono">.agents/skills/</span> to use it everywhere.
                                        </p>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="gemini" className="mt-4">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base">Via <span className="font-mono">gemini skills install</span></CardTitle>
                                        <CardDescription>
                                            Gemini reads the same <span className="font-mono">.agents/skills/</span> tree. Install once, then activation is prompt-driven — Gemini asks for consent when your prompt matches.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <pre className="overflow-x-auto rounded-lg border bg-muted/50 p-4 text-sm font-mono">
{`gemini skills install https://github.com/ResearchAtlas/Research-Atlas \\
  --path .agents/skills/research-verification
gemini skills list   # confirm research-verification is listed`}
                                        </pre>
                                        <p className="mt-3 text-sm text-muted-foreground">
                                            Then ask Gemini: <span className="font-mono">&ldquo;verify these references&rdquo;</span>. Approve the consent prompt and paste your list.
                                        </p>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 lg:py-24">
                <div className="container mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mx-auto max-w-5xl rounded-3xl border border-border bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl overflow-hidden relative"
                    >
                        {/* Glow effects */}
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2" />
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2" />

                        <div className="relative z-10 p-8 sm:p-16 text-center">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance text-white">
                                Ready to ship evidence-grade research with AI?
                            </h2>
                            <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                                Start with a workflow pack or browse the full library to accelerate your research today.
                            </p>
                            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                                <Button asChild size="lg" className="h-12 px-8 text-base shadow-lg hover:shadow-primary/20 transition-all">
                                    <NavLink to="/library">
                                        Explore Library
                                        <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                                    </NavLink>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
