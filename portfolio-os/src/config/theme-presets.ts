import type { ThemePreset } from '../types/theme.types';

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'midnight',
    name: 'Midnight',
    colors: {
      background: '#0f172a', // slate-900
      foreground: '#f8fafc', // slate-50
      accent: '#3b82f6', // blue-500
      surface: '#1e293b', // slate-800
      border: '#334155', // slate-700
      textPrimary: '#f1f5f9', // slate-100
      textSecondary: '#94a3b8', // slate-400
      textMuted: '#64748b', // slate-500
    },
    borderRadius: 0.5,
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    },
    glassOpacity: 0.7,
  },
  {
    id: 'aurora',
    name: 'Aurora',
    colors: {
      background: '#f8fafc', // slate-50
      foreground: '#0f172a', // slate-900
      accent: '#8b5cf6', // violet-500
      surface: '#ffffff', // white
      border: '#e2e8f0', // slate-200
      textPrimary: '#1e293b', // slate-800
      textSecondary: '#64748b', // slate-500
      textMuted: '#94a3b8', // slate-400
    },
    borderRadius: 0.75,
    shadows: {
      sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    },
    glassOpacity: 0.6,
  },
  {
    id: 'terminal',
    name: 'Terminal',
    colors: {
      background: '#000000', // black
      foreground: '#22c55e', // green-500
      accent: '#22c55e', // green-500
      surface: '#111111', // very dark gray
      border: '#22c55e', // green-500
      textPrimary: '#22c55e', // green-500
      textSecondary: '#16a34a', // green-600
      textMuted: '#15803d', // green-700
    },
    borderRadius: 0,
    shadows: {
      sm: 'none',
      md: 'none',
      lg: '0 0 10px rgba(34, 197, 94, 0.3)', // green glow
    },
    glassOpacity: 0.95,
  },
  {
    id: 'sunset',
    name: 'Sunset',
    colors: {
      background: '#2a1b15', // very dark brown
      foreground: '#fff7ed', // orange-50
      accent: '#f97316', // orange-500
      surface: '#431407', // amber-950
      border: '#7c2d12', // orange-900
      textPrimary: '#ffedd5', // orange-100
      textSecondary: '#fdba74', // orange-300
      textMuted: '#9a3412', // orange-800
    },
    borderRadius: 0.5,
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.2)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.2), 0 2px 4px -2px rgb(0 0 0 / 0.2)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
    },
    glassOpacity: 0.8,
  },
];
