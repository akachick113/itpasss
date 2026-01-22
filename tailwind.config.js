/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Enable class-based dark mode
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'Noto Sans JP', 'sans-serif'],
                serif: ['Noto Serif JP', 'serif'], // Mincho style
                jp: ['Noto Sans JP', 'sans-serif'],
            },
            colors: {
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                },
                zen: {
                    bg: '#fdfbf7', // Washi paper color
                    ink: '#1e293b', // Sumi ink
                    sakura: '#fce7f3', // Pale pink
                    sakuraDark: '#fbcfe8',
                },
                glass: {
                    light: 'rgba(255, 255, 255, 0.7)',
                    dark: 'rgba(15, 23, 42, 0.6)',
                    border: 'rgba(255, 255, 255, 0.1)',
                }
            },
            animation: {
                'blob': 'blob 7s infinite',
                'fade-in': 'fadeIn 1.5s ease-out',
                'sakura-fall-1': 'sakuraFall 10s linear infinite',
                'sakura-fall-2': 'sakuraFall 15s linear infinite',
                'sakura-fall-3': 'sakuraFall 12s linear infinite',
            },
            keyframes: {
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                sakuraFall: {
                    '0%': { transform: 'translateY(-10%) rotate(0deg)', opacity: '0' },
                    '10%': { opacity: '1' },
                    '100%': { transform: 'translateY(100vh) rotate(360deg)', opacity: '0' },
                }
            }
        },
    },
    plugins: [],
}
