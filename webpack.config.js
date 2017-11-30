import webpack from 'webpack'
import path from 'path'

const SRCDIR = path.join(__dirname, 'src')
const DISTDIR = path.join(__dirname, 'dist')

const config = {
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
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['env', { modules: false }]
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]
}

export default config
