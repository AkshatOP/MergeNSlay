/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'item-glow': '#06b6d4', // cyan-500
                'monster-glow': '#dc2626', // red-600
            },
            animation: {
                'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
                'float-up': 'floatUp 1s ease-out forwards',
            },
            keyframes: {
                shake: {
                    '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
                    '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
                    '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
                    '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
                },
                floatUp: {
                    '0%': { transform: 'translateY(0)', opacity: '1' },
                    '100%': { transform: 'translateY(-50px)', opacity: '0' },
                },
            },
            boxShadow: {
                'item': '0 0 20px rgba(6, 182, 212, 0.5)',
                'monster': '0 0 20px rgba(220, 38, 38, 0.5)',
            },
        },
    },
    plugins: [],
}
