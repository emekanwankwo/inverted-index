let BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
  entry: ['./src/app.js'],
  output: {
    filename: 'invertedindex.js',
    path: __dirname + '/public/scripts'
  },
  devServer: {
    contentBase: './public',
    hot: true
  },
  plugins: [
    new BrowserSyncPlugin(
      {
        // browse to http://localhost:3001/ during development 
        // host: 'localhost',
        host: 'https://inverted-index-app.herokuapp.com/',
        // port: 3001,
        port: 5000,
        server: {
          baseDir: ['./public']
        },
      },
      // plugin options 
      {
        reload: true
      }
    )
  ]
};