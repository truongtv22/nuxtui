// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app:{
    head:{
      script:[{src:'https://cdn.jsdelivr.net/npm/@undecaf/zbar-wasm@0.9.15/dist/index.js'},{src:'https://cdn.jsdelivr.net/npm/@undecaf/barcode-detector-polyfill@0.9.20/dist/index.js'}]
    }
  },
  devtools: { enabled: true },
  modules: ['@nuxt/ui', "nuxt-lodash", '@pinia/nuxt','@nuxt/image',],
  plugins:[],
  colorMode: {
    preference: 'system'
  },
  ui: {
    icons: {
      dynamic: true
    }
  },
  nitro: {
    plugins: ['~/server/index.ts']
  },
  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI,
    userName: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  build: {
    loaders: {
      vue: {
        transformAssetUrls: {
          audio: 'src'
        }
      }
    },

    extend(config, ctx) {
      config.module.rules.push({
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      })
    }
  }
})