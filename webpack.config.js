const path = require('path')

module.exports = {
  entry: {
    indoorgraphs: path.resolve(__dirname, 'src/index.ts')
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: "IndoorGraphs",
    libraryTarget: 'commonjs2',
  },
  resolve: { extensions: ['.ts', '.tsx', '.js'] },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        loader: 'ts-loader'
      }
    ]
  }
}
