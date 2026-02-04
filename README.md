# Research Atlas 🔬

**A curated atlas of research-ready prompts, workflows, and guides.**

Research Atlas is a static web application designed to help researchers navigate AI-assisted workflows with rigor. It provides prompts, workflows, and educational guides mapped to each stage of the research lifecycle.

## Features

*   **Static & Fast:** No database, no login. Just pure frontend code.
*   **Prompts + Workflows + Guides:** Copy-ready assets mapped to stages and methods.
*   **Research Lifecycle Support:** Organized by stages (Design, Measures, Data QC, Analysis, Interpretation, Writing).
*   **Research Type Paths:** Qualitative, quantitative, mixed methods, and more.

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YourRepo/research-atlas.git
    cd research-atlas
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

4.  **Open your browser:**
    Navigate to `http://localhost:5173` (or the port shown in your terminal).

## Usage

### Using the Library
Browse the **Library** to find prompt templates. Use **Workflows** for step-by-step pipelines and **Guides** for educational resources.

## Contributing

We welcome contributions! This project is designed as a "static-first" application, meaning the content drives the app.

### How to Add a Prompt

1.  Open `src/data/prompts.ts`.
2.  Add a new `StaticPrompt` object to the `PROMPTS` array:
    ```typescript
    {
        id: 'unique-id',
        title: 'Prompt Title',
        description: 'Brief description of what this prompt does.',
        stages: ['analysis'], // design, measures, data_qc, analysis, interpretation, writing
        researchTypes: ['quantitative'], // qualitative, quantitative, mixed_methods, ...
        tags: ['statistics', 'python'],
        content: {
            goal: '...',
            context: '...',
            instructions: '...',
            constraints: '...',
            outputRequirements: '...'
        },
        variables: [
            { name: 'dataset_name', type: 'text' }
        ],
        author: {
            name: 'Your Name',
            url: 'https://github.com/yourprofile' // Optional
        },
        createdAt: '2026-02-04T00:00:00Z',
        updatedAt: '2026-02-04T00:00:00Z'
    }
    ```
3.  Submit a Pull Request with your changes.

## Tech Stack

*   **Framework:** React + Vite
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS + shadcn/ui
*   **State Management:** TanStack Query
*   **Icons:** Lucide React

## License

MIT License. Free to use and modify for academic and commercial purposes.
