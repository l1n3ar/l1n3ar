import { ToggleLeft } from "lucide-react";
import { LabItemConfig } from "./registry";
import { SiMarkdown } from "@icons-pack/react-simple-icons";

export interface LabSection {
    title: string;
    items: LabItemConfig[];
}

export const labSections: LabSection[] = [
    {
        title: 'Notes',
        items: [
            {
                id: 'NOTE-001',
                component: 'sticky-note',
                props: {
                    content: "MCP serverize this portfolio",
                    className: "bg-yellow-100 border-yellow-400",
                    type: 'In Progress',
                },
            },
            {
                id: 'NOTE-001',
                component: 'sticky-note',
                props: {
                    content: "MCP serverize this portfolio",
                    className: "bg-yellow-100 border-yellow-400",
                    type: 'In Progress',
                },
            },
                 {
                id: 'NOTE-001',
                component: 'sticky-note',
                props: {
                    content: "MCP serverize this portfolio",
                    className: "bg-yellow-100 border-yellow-400",
                    type: 'In Progress',
                },
            },
                 {
                id: 'NOTE-001',
                component: 'sticky-note',
                props: {
                    content: "MCP serverize this portfolio",
                    className: "bg-yellow-100 border-yellow-400",
                    type: 'In Progress',
                },
            },
             
            
        ],
    },
    {
        title: 'Web Projects',
        items: [
            {
                id: 'WEB-001',
                component: 'web-product',
                props: {
                    title: 'ShadCN N-way Switch',
                    url: 'https://shadcn-nway-switch.vercel.app/',
                    icon: ToggleLeft,
                    type: 'Complete',
                    description: 'An exclusive-select toggle switch for any number of options, with icons, labels, and a dedicated off state.',
                    techStack: ['Next.JS', 'TailwindCSS'],
                },
            },
                
            {
                id: 'WEB-002',
                component: 'web-product',
                props: {
                    title: 'markdownR',
                    url: 'https://markdown-r.vercel.app/',
                    icon: SiMarkdown,
                    type: 'Complete',
                    description: 'A web tool to preview markdown formatter text',
                    techStack: ['Next.JS', 'TailwindCSS', 'React-Markdown'],
                },
            },
        ],
    },
    {
        title: 'CLI Projects',
        items: [
            {
                id: 'CLI-001',
                component: 'cli-project',
                props: {
                    title: 'script-kiddie',
                    repo: 'l1n3ar/script-kiddie',
                    type: 'Complete',
                },
            },
        ],
    },
]
