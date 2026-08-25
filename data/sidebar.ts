import { NavItem } from "@/lib/types";
import { Activity, Briefcase, Code2, FlaskConical, FolderKanban, GitBranch, Home, Lock, Quote, TestTube } from "lucide-react";

export const navItems: NavItem[] = [
    {
        icon: Home,
        href: "/",
        label: "Home",

    },
    {
        icon: FolderKanban,
        href: "/projects",
        label: "Projects",

    },
    {
        icon: Briefcase,
        href: "/work",
        label: "Work Experience",

    },
    {
        icon: Quote,
        href: "/recommendations",
        label: "Recommendations",
        separatorAfter: true

    },
    {
        icon: FlaskConical,
        href: "/lab",
        label: "Lab",
        isNew: true

    },
    {
        icon: Code2,
        href: "/l1n3ar",
        label: "l1n3ar",
        separatorAfter: true,

    },
    {
        icon: Activity,
        href: "/metrics",
        label: "Metrics",


    },
    {
        icon: GitBranch,
        href: "/deployments",
        label: "Deployments",
        separatorAfter: true

    },
    {
        icon: Lock,
        href: "/qalog",
        label: "Admin",

    }

]