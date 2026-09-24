/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#D9381E',
          'primary-hover': '#BC2B13',
          'primary-light': '#FDF2EF',
          secondary: '#1C1917',
          'secondary-hover': '#292524',
          accent: '#E87A28',
          'accent-light': '#FEF3EB',
          bg: '#F9F7F5',
          surface: '#FFFFFF',
          'surface-alt': '#F3EFEA',
          border: '#E7E2DB',
          'border-focus': '#D9381E',
          text: {
            primary: '#1A1614',
            secondary: '#6E6660',
            muted: '#A19891'
          },
          status: {
            success: '#15803D',
            'success-bg': '#ECFDF5',
            warning: '#D97706',
            'warning-bg': '#FFFBEB',
            error: '#DC2626',
            'error-bg': '#FEF2F2',
            info: '#2563EB',
            'info-bg': '#EFF6FF'
          }
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(28, 25, 23, 0.04)',
        'card': '0 2px 8px -2px rgba(28, 25, 23, 0.05), 0 1px 4px -1px rgba(28, 25, 23, 0.03)',
        'dropdown': '0 10px 25px -5px rgba(28, 25, 23, 0.1), 0 8px 10px -6px rgba(28, 25, 23, 0.05)'
      }
    },
  },
  plugins: [],
}
