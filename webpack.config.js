let BrowserSyncPlugin = require('browser-sync-webpack-plugin');
let port = process.env.PORT || 3000;

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
        host: 'localhost',
        port: port,
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