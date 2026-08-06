import {
  MessageSquare, ShieldCheck, Wallet, Gavel, ShoppingCart, ClipboardCheck, FileCheck2, Terminal, FileText,
  FolderKanban, type LucideIcon,
} from 'lucide-react';

// One icon per actual project, picked for what each one is — not cycled by position.
export const PROJECT_ICONS: Record<string, LucideIcon> = {
  l1n3ar: MessageSquare, // this site's own RAG chat
  phoenix: ShieldCheck, // AI governance platform
  eiger: Wallet, // quantum-safe CBDC wallet
  aculead: Gavel, // reverse-bidding freight marketplace
  grocernest: ShoppingCart, // grocery e-commerce/POS
  contromoist: ClipboardCheck, // process automation/quality inspection
  registrum: FileCheck2, // blockchain notarization
  'script-kiddie': Terminal, // shell scripts/automations
  markdownr: FileText, // markdown previewer
};

export function projectIcon(id: string): LucideIcon {
  return PROJECT_ICONS[id] ?? FolderKanban;
}
