module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'dist/bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx', '']
  },
  devtool: 'inline-source-map',
  module: {
    preLoaders: [
      { test: /\.ts?$/, loader: "tslint" }
    ],
    loaders: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      }
    ]
  },
  tslint: {
    emitErrors: true,
    failOnHint: true
  }
}