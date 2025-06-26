/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        './pages/**/*.{js,jsx}',
        './components/**/*.{js,jsx}',
        './app/**/*.{js,jsx}',
        './src/**/*.{js,jsx}',
    ],
    prefix: "",
    theme: {
    	container: {
    		center: true,
    		padding: '2rem',
    		screens: {
    			'2xl': '1400px'
    		}
    	},
    	extend: {
    		colors: {
    			primary: {
    				'50': '#EBF4FF',
    				'100': '#DBEAFE',
    				'200': '#BFDBFE',
    				'300': '#93C5FD',
    				'400': '#60A5FA',
    				'500': '#3B82F6',
    				'600': '#2563EB',
    				'700': '#1D4ED8',
    				'800': '#1E40AF',
    				'900': '#1E3A8A',
    				'950': '#172554',
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				'50': '#F8FAFC',
    				'100': '#F1F5F9',
    				'200': '#E2E8F0',
    				'300': '#CBD5E1',
    				'400': '#94A3B8',
    				'500': '#64748B',
    				'600': '#475569',
    				'700': '#334155',
    				'800': '#1E293B',
    				'900': '#0F172A',
    				'950': '#020617',
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			accent: {
    				'50': '#ECFDF5',
    				'100': '#D1FAE5',
    				'200': '#A7F3D0',
    				'300': '#6EE7B7',
    				'400': '#34D399',
    				'500': '#10B981',
    				'600': '#059669',
    				'700': '#047857',
    				'800': '#065F46',
    				'900': '#064E3B',
    				'950': '#022C22',
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			danger: {
    				'50': '#FEF2F2',
    				'100': '#FEE2E2',
    				'200': '#FECACA',
    				'300': '#FCA5A5',
    				'400': '#F87171',
    				'500': '#EF4444',
    				'600': '#DC2626',
    				'700': '#B91C1C',
    				'800': '#991B1B',
    				'900': '#7F1D1D',
    				'950': '#450A0A',
    				DEFAULT: '#EF4444'
    			},
    			warning: {
    				'50': '#FFFBEB',
    				'100': '#FEF3C7',
    				'200': '#FDE68A',
    				'300': '#FCD34D',
    				'400': '#FBBF24',
    				'500': '#F59E0B',
    				'600': '#D97706',
    				'700': '#B45309',
    				'800': '#92400E',
    				'900': '#78350F',
    				'950': '#451A03',
    				DEFAULT: '#F59E0B'
    			},
    			info: {
    				'50': '#ECFEFF',
    				'100': '#CFFAFE',
    				'200': '#A5F3FC',
    				'300': '#67E8F9',
    				'400': '#22D3EE',
    				'500': '#06B6D4',
    				'600': '#0891B2',
    				'700': '#0E7490',
    				'800': '#155E75',
    				'900': '#164E63',
    				'950': '#083344',
    				DEFAULT: '#06B6D4'
    			},
    			background: 'hsl(var(--background))',
    			surface: '#FFFFFF',
    			text: '#1E293B',
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			foreground: 'hsl(var(--foreground))',
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			},
    			sidebar: {
    				DEFAULT: 'hsl(var(--sidebar-background))',
    				foreground: 'hsl(var(--sidebar-foreground))',
    				primary: 'hsl(var(--sidebar-primary))',
    				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
    				accent: 'hsl(var(--sidebar-accent))',
    				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
    				border: 'hsl(var(--sidebar-border))',
    				ring: 'hsl(var(--sidebar-ring))'
    			}
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out'
    		}
    	}
    },
    plugins: [
        require("@tailwindcss/forms"),
        require("@tailwindcss/typography"),
        require("tailwindcss-animate"),
    ],
}