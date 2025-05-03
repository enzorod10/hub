import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'from-yellow-300', 'to-blue-400',
    'from-gray-300', 'to-gray-500',
    'from-gray-700', 'to-blue-900',
    'from-purple-900', 'to-gray-700',
    'from-blue-100', 'to-white',
    'from-gray-100', 'to-gray-400',
    'bg-gradient-to-br'
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		animation: {
			float: 'float 6s ease-in-out infinite',
			raindrop: 'raindrop 1s ease-in-out infinite',
			flash: 'flash 1s ease-in-out infinite',
			snow: 'snow 10s linear infinite'
		},
		keyframes: {
			float: {
				'0%, 100%': { transform: 'translateY(0px)' },
				'50%': { transform: 'translateY(-10px)' }
			},
			raindrop: {
				'0%': { opacity: '1', transform: 'translateY(0)' },
				'100%': { opacity: '0', transform: 'translateY(20px)' }
			},
			flash: {
				'0%, 100%': { opacity: '1' },
				'50%': { opacity: '0.2' }
			},
			snow: {
				'0%': { transform: 'translateY(-100%)' },
				'100%': { transform: 'translateY(100%)' }
			}
		}
  	}
},
  plugins: [tailwindcssAnimate],
} satisfies Config;
