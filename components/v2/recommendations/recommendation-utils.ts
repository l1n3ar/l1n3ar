export function splitWho(who: string): { name: string; role?: string } {
  const [name, ...rest] = who.split('·').map((s) => s.trim());
  return { name, role: rest.length > 0 ? rest.join(' · ') : undefined };
}

export function initials(name: string) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}
