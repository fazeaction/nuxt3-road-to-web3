module.exports = {
  content: [
    'components/**/*.{vue,js}',
    'layouts/**/*.vue',
    'pages/**/*.vue',
    'plugins/**/*.{js,ts}',
    'app.vue',
    'error.vue' // or '*.vue'
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      fontFamily: {
        aeonik_fono: ["Aeonik Fono"],
        ft_blank_grotesk: ["FT Blank Grotesk"],
      },
      screens: {
        'lg-hide-email': { 'raw': '(min-width: 800px)' },
        // => @media (min-height: 800px) { ... }
      }
    },
  },
  plugins: [],
}
