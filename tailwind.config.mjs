/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B4332',
          hover: '#285A44',
          active: '#0F3D2A',
          fg: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#D97706',
          hover: '#B36110',
          active: '#92500B',
          fg: '#FFFFFF',
        },
        background: '#F9F7F4',
        surface: {
          DEFAULT: '#FFFFFF',
          sunken: '#F4F2EE',
        },
        sidebar: '#0D2A1F',
        tc: {
          text: '#0F3D2A',
          secondary: '#5A615C',
          muted: '#7A8079',
          border: '#E5E7E1',
          'border-strong': '#CFD2CC',
        },
        success: {
          DEFAULT: '#4CAF50',
          bg: '#E8F5E9',
          fg: '#1B5E20',
          border: '#A5D6A7',
        },
        warning: {
          DEFAULT: '#FFC107',
          bg: '#FFF8E1',
          fg: '#7A4F01',
        },
        info: {
          DEFAULT: '#2196F3',
          bg: '#E3F2FD',
          fg: '#0D47A1',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        '2xs': ['11px', { lineHeight: '14px' }],
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['13px', { lineHeight: '18px' }],
        md: ['14px', { lineHeight: '20px' }],
        base: ['15px', { lineHeight: '22px' }],
        lg: ['17px', { lineHeight: '24px' }],
        xl: ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '38px' }],
        '4xl': ['36px', { lineHeight: '44px' }],
        display: ['56px', { lineHeight: '60px' }],
      },
      borderRadius: {
        xs: '4px',
        sm: '6px',
        md: '8px',
        lg: '10px',
        xl: '14px',
        '2xl': '20px',
        pill: '9999px',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(13, 42, 31, 0.04)',
        sm: '0 1px 3px rgba(13, 42, 31, 0.06), 0 1px 2px rgba(13, 42, 31, 0.04)',
        md: '0 4px 12px rgba(13, 42, 31, 0.08), 0 2px 4px rgba(13, 42, 31, 0.04)',
        lg: '0 12px 32px rgba(13, 42, 31, 0.10), 0 4px 8px rgba(13, 42, 31, 0.04)',
        xl: '0 24px 64px rgba(13, 42, 31, 0.16)',
        focus: '0 0 0 3px rgba(27, 67, 50, 0.22)',
      },
      maxWidth: {
        content: '1280px',
      },
      letterSpacing: {
        eyebrow: '0.08em',
        tight: '-0.01em',
        display: '-0.02em',
        tighter: '-0.025em',
        tightest: '-0.03em',
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.2, 0, 0.1, 1)',
        emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
      },
      transitionDuration: {
        fast: '120ms',
        base: '180ms',
        slow: '280ms',
      },
    },
  },
  plugins: [],
}
