import { ShieldCheck, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AboutPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">About Research Atlas</h1>
          <p className="mt-2 text-muted-foreground">
            Research Atlas is a static hub of research-ready prompts, workflows, and
            guides for rigorous, transparent AI-assisted research.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
              <CardTitle className="text-base">Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Make high-quality prompting and workflow design accessible to researchers,
              while maintaining academic rigor and reproducibility.
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
              <CardTitle className="text-base">Ethics & Integrity</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              AI is a support tool. Researchers remain accountable for all claims,
              citations, and compliance with publisher policies.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
