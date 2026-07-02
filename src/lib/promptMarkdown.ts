import type { PromptContent, PromptVariable } from '@/data/prompts'
import { fillTemplate, prettifyVariableName } from '@/lib/promptVariables'

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
