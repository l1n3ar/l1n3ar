export function splitWho(who: string): { name: string; role?: string } {
  const [name, ...rest] = who.split('·').map((s) => s.trim());
  return { name, role: rest.length > 0 ? rest.join(' · ') : undefined };
}
