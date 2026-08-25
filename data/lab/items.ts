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
                id: 'mcp',
                component: 'sticky-note',
                props: {
                    displayId : 'NOTE-001',
                    content: "MCP serverize this portfolio",
                    className: "bg-yellow-100 border-yellow-400",
                    cellotapeRotateAngle: '8',
                    type: 'In Progress',
                    showId: true
                },
            },
            {
                id: 'shad-note',
                component: 'sticky-note',
                props: {
                      displayId : 'NOTE-002',
                    title: 'Lega',
                    content: "need a 3-way toggle b/w provider search / app search / off",
                    className: "bg-pink-100 border-pink-400",
                    cellotapeRotateAngle: '4',
                    type: 'Complete',
                },
            },
            {
                id: 'script-kiddie-note',
                component: 'sticky-note',
                props: {
                     displayId : 'NOTE-003',
                    content: "git identity isn't set in new repos, keep getting logged in through different accounts",
                    className: "bg-blue-100 border-blue-400",
                    cellotapeRotateAngle: '-3',
                    type: 'Complete',
                },
            },
            {
                id: 'mac-desktops-note',
                component: 'sticky-note',
                props: {
                      displayId : 'NOTE-004',
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
                id: 'shad',
                component: 'web-product',
                defaultPosition: { x: 40, y: 40 },
                props: {
                    url: 'https://shadcn-nway-switch.vercel.app/',
                    repo: 'https://github.com/l1n3ar/shadcn-nway',

                },

            },
            {
                id: 'markdownr',
                component: 'web-product',
                defaultPosition: { x: 40, y: 260 },
                props: {
                    url: 'https://markdown-r.vercel.app/',
                    repo: 'https://github.com/l1n3ar/markdownr',
                },
            },
        ],
    },
    {
        title: 'CLI Projects',
        items: [
            {
                id: 'script-kiddie',
                component: 'cli-project',
                defaultPosition: { x: 340, y: 40 },
                props: {
                    title: 'l1n3ar/script-kiddie',
                    repo: 'https://github.com/l1n3ar/script-kiddie',
   
                },
            },
        ],
    },
]
