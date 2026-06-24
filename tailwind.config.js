/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // 设计令牌通过 CSS 变量驱动（见 index.css），Tailwind 颜色引用之。
      // 风格：素雅 / 低饱和 / 中性。亮暗双模式 + 科目主题色。
      colors: {
        bg: 'var(--bg)',
        surface: {
          DEFAULT: 'var(--surface)',
          2: 'var(--surface-2)',
          hover: 'var(--surface-hover)',
        },
        ink: {
          DEFAULT: 'var(--text)',
          muted: 'var(--text-muted)',
          faint: 'var(--text-faint)',
        },
        border: {
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          2: 'var(--accent-2)',
          strong: 'var(--accent-strong)',
          soft: 'var(--accent-soft)',
          line: 'var(--accent-line)',
          glow: 'var(--accent-glow)',
          contrast: 'var(--accent-contrast)',
          text: 'var(--accent-text)',
        },
        code: {
          bg: 'var(--code-bg)',
          text: 'var(--code-text)',
        },
        // 题型徽标语义色（莫兰迪 / 哑光）
        tag: {
          judge: 'var(--tag-judge)',
          fill: 'var(--tag-fill)',
          short: 'var(--tag-short)',
          comp: 'var(--tag-comp)',
          calc: 'var(--tag-calc)',
          design: 'var(--tag-design)',
        },
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
        info: 'var(--info)',
      },
      fontFamily: {
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
        xs: 'var(--fs-xs)',
        sm: 'var(--fs-sm)',
        base: 'var(--fs-base)',
        md: 'var(--fs-md)',
        lg: 'var(--fs-lg)',
        xl: 'var(--fs-xl)',
        '2xl': 'var(--fs-2xl)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-md)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        pill: 'var(--radius-pill)',
      },
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        5: 'var(--space-5)',
        6: 'var(--space-6)',
        7: 'var(--space-7)',
        8: 'var(--space-8)',
        9: 'var(--space-9)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow)',
        lg: 'var(--shadow-lg)',
      },
      transitionDuration: {
        fast: '120ms',
      },
      zIndex: {
        sidebar: '30',
        header: '40',
        overlay: '50',
        search: '60',
      },
    },
  },
  plugins: [],
};
