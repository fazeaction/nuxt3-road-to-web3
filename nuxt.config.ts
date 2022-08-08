import { defineNuxtConfig } from 'nuxt'
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import nodePolyfills from 'rollup-plugin-polyfill-node';
import glslifyCompiler from 'vite-plugin-glslify'
const production = process.env.NODE_ENV === 'production';
// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config

export default defineNuxtConfig({
    typescript: {
        shim: false
    },
    app: {
        head: {
            title: 'INKOLLECTORS',
            titleTemplate: '%s—Professional Tattoo Art for the Metaverse and beyond.',
            meta: [
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { hid: 'description', name: 'description', content: 'Professional Tattoo Art for the Metaverse and beyond'},
                {hid: 'theme-color', name: 'theme-color', content: '#ffffff'},
                {hid: 'og:type', property: 'og:type', content: 'website'},
                {hid: 'og:locale', property: 'og:locale', content: 'en_US'},
                {hid: 'og:title', name: 'og:title', content: 'INKOLLECTORS'},
                {hid: 'og:image', property: 'og:image', content: 'https://www.inkollectors.com/imgs/inkollectors-website-image-card.jpg'},
                {hid: 'og:image:secure_url', property: 'og:image:secure_url', content: 'https://www.inkollectors.com/imgs/inkollectors-website-image-card.jpg'},
                {hid: 'og:description', property: 'og:description', content: 'Professional Tattoo Art for the Metaverse and beyond'},
                {hid: 'og:url', property: 'og:url', content: 'https://www.inkollectors.com'},
                {hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image'},
                {hid: 'twitter:site', name: 'twitter:site', content: '@inkollectors'},
                {hid: 'twitter:creator', name: 'twitter:creator', content: '@inkollectors'},
                {hid: 'twitter:url', name: 'twitter:url', content: 'https://www.inkollectors.com'},
                {hid: 'twitter:title', name: 'twitter:title', content: 'INKOLLECTORS'},
                {hid: 'twitter:description', name: 'twitter:description', content: 'Professional Tattoo Art for the Metaverse and beyond'},
                {hid: 'twitter:image', name: 'twitter:image', content: 'https://www.inkollectors.com/imgs/inkollectors-website-image-card.jpg'},
            ],
            link: [
                { rel: 'apple-touch-icon', sizes: '180x180', href: '/imgs/apple-touch-icon.png' },
                { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/imgs/favicon-32x32.png' },
                { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/imgs/favicon-16x16.png' },
                { rel: 'manifest', crossorigin: 'use-credentials', href: '/site.webmanifest' },
                { rel: 'shortcut icon', href: '/imgs/favicon.ico' }
            ],
        },
    },
    publicRuntimeConfig: {
        API_URL: process.env.API_URL,
        PRIVATE_KEY: process.env.PRIVATE_KEY,
        CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS
    },
    css: ["@/assets/css/styles.css"],
    build: {
        transpile: ['three'],
        postcss: {
            postcssOptions: require("./postcss.config.js"),
        },
    },
    vite: {
        plugins: [
            glslifyCompiler(),
            // ↓ Needed for development mode
            !production && nodePolyfills({
                include: ['node_modules/**/*.js', new RegExp('node_modules/.vite/.*js')]
            })
        ],

        build: {
            rollupOptions: {
                plugins: [
                    // ↓ Needed for build
                    nodePolyfills()
                ]
            },
            // ↓ Needed for build if using WalletConnect and other providers
            commonjsOptions: {
                transformMixedEsModules: true
            }
        },
        resolve: {
            alias: {
                "readable-stream": "vite-compatible-readable-stream",
            },
        },
        optimizeDeps: {
            esbuildOptions: {
                // Node.js global to browser globalThis
                define: {
                    global: "globalThis",
                },
                // Enable esbuild polyfill plugins
                plugins: [
                    NodeGlobalsPolyfillPlugin({
                        process: true,
                        buffer: true,
                    }),
                    NodeModulesPolyfillPlugin(),
                ],
            },
        },
    }
})
