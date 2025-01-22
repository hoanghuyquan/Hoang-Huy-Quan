const path = require('path')

module.exports = {
  webpack: {
    alias: {
      '~assets': path.resolve(__dirname, 'src/assets'),
      '~components': path.resolve(__dirname, 'src/components'),
      '~core': path.resolve(__dirname, 'src/core'),
      '~redux': path.resolve(__dirname, 'src/redux'),
      '~saga': path.resolve(__dirname, 'src/saga'),
      '~screens': path.resolve(__dirname, 'src/screens'),
      '~utils': path.resolve(__dirname, 'src/utils'),
      '~models': path.resolve(__dirname, 'src/models'),
    },
  },
}
