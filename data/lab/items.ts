import { SwitchCamera, ToggleLeft } from "lucide-react";
import { LabItemConfig } from "./registry";
import { SiMarkdown } from "@icons-pack/react-simple-icons";

export const labItems: LabItemConfig[] = [
    {
        id: 'NOTE-001',
        component: 'sticky-note',
        defaultPosition: { x: 150, y: 150 },
        props: {
            content: "MCP serverize this portfolio",
            className: "bg-yellow-100 border-yellow-400",
            type: 'In Progress',
            
        },
    },
    {
        id: 'CODE-001',
        component: 'web-product',
        defaultPosition: { x: 200, y: 200 },
        props: {

            title: 'ShadCN N-way Switch',
            url: 'https://shadcn-nway-switch.vercel.app/',
            icon: ToggleLeft,
            type : 'Complete',
            description : 'An exclusive-select toggle switch for any number of options, with icons, labels, and a dedicated off state.',
            techStack : ['Next.JS','TailwindCSS']

        },
    },
        {
        id: 'CODE-002',
        component: 'web-product',
        defaultPosition: { x: 100, y: 100 },
        props: {

            title: 'markdownR',
            url: 'https://markdown-r.vercel.app/',
            icon: SiMarkdown,
            type : 'Complete',
            description : 'A web tool to preview markdown formatter text',
            techStack : ['Next.JS','TailwindCSS','React-Markdown']

        },
    },
]
