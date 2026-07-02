import type { PromptContent, PromptVariable } from '@/data/prompts'
import { fillTemplate, prettifyVariableName } from '@/lib/promptVariables'

/**
 * Plain-text copy payload: the variable-filled instructions plus the prompt's
 * constraints and output requirements, so guardrails written in those fields
 * actually reach the model instead of living only in page metadata.
 */
export function buildCopyText(content: PromptContent, values: Record<string, string>): string {
    const filled = fillTemplate(content.instructions ?? '', values)
    const extras: string[] = []
    if (content.constraints) extras.push(`Constraints: ${content.constraints}`)
    if (content.outputRequirements) extras.push(`Output requirements: ${content.outputRequirements}`)
    return extras.length > 0 ? `${filled}\n\n${extras.join('\n')}` : filled
}

/**
 * Build a Markdown document for a prompt: title, description, Goal/Context/
 * Constraints/Output requirements (only when non-empty), a Prompt section
 * with the variable-filled instructions, and a Variables section.
 */
export function buildPromptMarkdown(params: {
    title: string
    description?: string
    content: PromptContent
    variables: PromptVariable[]
    values: Record<string, string>
}): string {
    const { title, description, content, variables, values } = params
    const sections: string[] = [`# ${title}`]

    if (description) sections.push(description)

    if (content.goal) sections.push(`## Goal\n\n${content.goal}`)
    if (content.context) sections.push(`## Context\n\n${content.context}`)
    if (content.constraints) sections.push(`## Constraints\n\n${content.constraints}`)
    if (content.outputRequirements) sections.push(`## Output requirements\n\n${content.outputRequirements}`)

    const filledInstructions = fillTemplate(content.instructions ?? '', values)
    sections.push(`## Prompt\n\n\`\`\`\n${filledInstructions}\n\`\`\``)

    if (variables.length > 0) {
        const lines = variables.map(v => {
            const value = values[v.name]
            return `- **${prettifyVariableName(v.name)}**: ${value ? value : '_not set_'}`
        })
        sections.push(`## Variables\n\n${lines.join('\n')}`)
    }

    return sections.join('\n\n') + '\n'
}
