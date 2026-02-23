/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx,scss}",
    ],
    theme: {
        screens: {
            '2xl': {'max': '1535px'},
            'xl': {'max': '1279px'},
            'lg': {'max': '1023px'},
            'md': {'max': '767px'},
            'sm': {'max': '639px'},
        },
        extend: {
            colors: {
                'white': '#fff',
                'beige': {
                    '100': '#f8f4f0',
                    '500': '#98908b',
                },
                'grey': {
                    '100': '#f2f2f2',
                    '300': '#b3b3b3',
                    '500': '#696868',
                    '900': '#201f24',
                },
                'green': '#277c78',
                'yellow': '#f2cdac',
                'cyan': '#82c9d7',
                'navy': '#626070',
                'red': '#c94736',
                'purple': '#826cb0',
                'turquoise': '#597c7c',
                'brown': '#93674f',
                'magenta': '#934f6f',
                'blue': '#3f82b2',
                'navy-grey': '#97a0ac',
                'army-green': '#7f9161',
                'gold': '#cab361',
                'orange': '#be6c49',
                'pink': '#af81ba',
            }
        },
    },
    plugins: [],
}