// Bumped from 'theme' to invalidate everyone's previously-stored preference in one
// shot — returning visitors who'd toggled dark mode were stuck seeing it forever.
// Keep in sync with app/layout.tsx's inline no-flash script, which duplicates this
// key literally since it must run before any JS module loads.
export const THEME_STORAGE_KEY = 'theme_v2';

export function getTheme(): 'dark' | 'light' {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

// Dispatched after every change so any UI showing the current theme (navbar toggle, command
// palette, ...) can stay in sync even when a DIFFERENT control is the one that changed it.
export const THEME_CHANGE_EVENT = 'themechange';

export function setTheme(theme: 'dark' | 'light') {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

export function toggleTheme() {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark');
}
