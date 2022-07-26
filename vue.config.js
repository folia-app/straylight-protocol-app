module.exports = {
  lintOnSave: false,
  runtimeCompiler: true, // needed for some reason even though I'm not using prismic components...

  devServer: {
    proxy: {
      '/.netlify': {
        target: 'http://localhost:9000',
        pathRewrite: { '^/.netlify/functions': '' }
      },

      '/api/4/': {
        target: 'http://164.92.233.6:3001', // /get/0x95793c65c398d0a5eeb92d6b475f4e6a2044bee1/8000020'
        pathRewrite: { '^/api/4/': '' }
      },

      '/api/1/': {
        target: 'http://164.92.233.6', // /get/0x95793c65c398d0a5eeb92d6b475f4e6a2044bee1/8000020'
        pathRewrite: { '^/api/1/': '' }
      }

      // 'metadata/1/': {}
    }
  },

  // force Safari not to cache (dev)
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'development') {
      config
        .output
        .filename('[name].[hash].js')
        .chunkFilename('[name].[hash].js')
        .end()
    }
  },

  // webpack
  configureWebpack: {
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 250000
      }
    }
  }
}
