/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		fontFamily: {
			Inter: ['Inter']
		},
		fontWeight: {
			thin: '300',
			normal: '400',
			medium: '500',
			bold: '600'
		},
		colors: {
			body: '#FFFFFF',
			primary: '#6A3D84',
			btnPrimary: '#6A3D84',
			header: '#D4D7E5',
			transparent: 'transparent',
			white: '#FFFFFF',
			black: '#1C2434',
			whitish: '#F4F9FF',
			success: '#219653',
			error: '#D34053',
			warning: '#FFA70B',
			info: '#6A3D84',
			gray: {
				100: '#f3f4f6',
				200: '#e5e7eb',
				300: '#d1d5db',
				400: '#9ca3af',
				500: '#6b7280',
				600: '#4b5563',
				700: '#374151',
				800: '#1f2937',
				900: '#111827'
			},
			indigo: {
				600: 'rgb(79 70 229);'
			}
		},
		extend: {}
	},
	plugins: []
};
