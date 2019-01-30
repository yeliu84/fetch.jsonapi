import webpack from 'webpack'
import path from 'path'

const SRCDIR = path.join(__dirname, 'src')
const DISTDIR = path.join(__dirname, 'dist')

const config = {
  mode: 'production',
  entry: path.join(SRCDIR, 'index.js'),
  output: {
    path: DISTDIR,
    filename: 'fetch.jsonapi.js',
    library: 'jsonapi',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules\/(?!(query-string|strict-uri-encode))/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { modules: false }]
            ]
          }
        }
      }
    ]
  }
}

export default config
