/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{ts,tsx}", // Scans all TS/TSX files in src
    ],
    theme: {
        extend: {}, // Add customizations here if needed
    },
    plugins: [],
};