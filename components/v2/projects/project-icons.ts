import {
  MessageSquare, ShieldCheck, Wallet, Gavel, ShoppingCart, ClipboardCheck, FileCheck2, Terminal, FileText,
  FolderKanban, type LucideIcon,
} from 'lucide-react';

export const PROJECT_ICONS: Record<string, LucideIcon> = {
  l1n3ar: MessageSquare,
  phoenix: ShieldCheck,
  eiger: Wallet,
  aculead: Gavel,
  grocernest: ShoppingCart,
  contromoist: ClipboardCheck,
  registrum: FileCheck2,
  'script-kiddie': Terminal,
  markdownr: FileText,
};

export function projectIcon(id: string): LucideIcon {
  return PROJECT_ICONS[id] ?? FolderKanban;
}
