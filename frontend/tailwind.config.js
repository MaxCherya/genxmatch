/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{ts,tsx}",
    ],
    theme: {
        extend: {
            animation: {
                'slide-in': 'slideIn 0.3s ease-out',
                'orbit': 'orbit 3s infinite linear',
                'orbit-reverse': 'orbit-reverse 3s infinite linear',
                'slow-spin': 'spin 20s infinite linear',
                'bounce-short': 'bounce-short 0.8s infinite ease-in-out',
            },
            keyframes: {
                slideIn: {
                    '0%': { transform: 'translateX(100%)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                orbit: {
                    '0%': { transform: 'rotate(0deg) translateX(40px) rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg) translateX(40px) rotate(-360deg)' },
                },
                'orbit-reverse': {
                    '0%': { transform: 'rotate(0deg) translateX(40px) rotate(0deg)' },
                    '100%': { transform: 'rotate(-360deg) translateX(40px) rotate(360deg)' },
                },
                'bounce-short': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
        },
    },
    plugins: [],
};