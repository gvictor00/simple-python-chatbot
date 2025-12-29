import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#0f172a',
        mist: '#e2e8f0',
        accent: '#22c55e',
        muted: '#94a3b8',
      },
      backgroundImage: {
        mesh: 'radial-gradient(circle at 20% 20%, rgba(34,197,94,0.18), transparent 25%), radial-gradient(circle at 80% 0%, rgba(59,130,246,0.2), transparent 25%), radial-gradient(circle at 40% 80%, rgba(14,165,233,0.16), transparent 28%)',
      },
    },
  },
  plugins: [],
}

export default config
