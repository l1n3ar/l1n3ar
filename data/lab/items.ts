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
                    cellotapeRotateAngle: '8',
                    type: 'In Progress',
                    showId: true
                },
            },
            {
                id: 'NOTE-002',
                component: 'sticky-note',
                props: {
                    title: 'Lega',
                    content: "need a 3-way toggle b/w provider search / app search / off",
                    className: "bg-pink-100 border-pink-400",
                    cellotapeRotateAngle: '4',
                    type: 'Complete',
                },
            },
            {
                id: 'NOTE-003',
                component: 'sticky-note',
                props: {
                    content: "git identity isn't set in new repos, keep getting logged in through different accounts",
                    className: "bg-blue-100 border-blue-400",
                    cellotapeRotateAngle: '-3',
                    type: 'Complete',
                },
            },
            {
                id: 'NOTE-004',
                component: 'sticky-note',
                props: {
                    content: "why the hell can't we rename desktops on mac",
                    className: "bg-green-100 border-green-400",
                    cellotapeRotateAngle: '-2',
                    type: 'To-Do',
                    showId: true
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
                defaultPosition: { x: 40, y: 40 },
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
                defaultPosition: { x: 40, y: 260 },
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
                defaultPosition: { x: 340, y: 40 },
                props: {
                    title: 'script-kiddie',
                    repo: 'l1n3ar/script-kiddie',
                    type: 'Complete',
                },
            },
        ],
    },
]
