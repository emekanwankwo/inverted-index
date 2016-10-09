var path = require('path');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

 module.exports = {
 cache: true,
 debug: true,
 devtool: 'eval',
 entry: './src/inverted-index.js',
 output: {
 path: path.join(__dirname, "build"),
 filename: 'build.min.js'
 },
 resolve: {
 extensions: ['', '.js', '.json', '.coffee']
 },
 plugins: [
    new BrowserSyncPlugin(
      // BrowserSync options 
      {
        // browse to http://localhost:3000/ during development 
        host: 'localhost',
        port: 3000,
        // proxy the Webpack Dev Server endpoint 
        // (which should be serving on http://localhost:3100/) 
        // through BrowserSync 
        //server: { baseDir: ['/src'] },
        proxy: 'http://localhost:8080/'
      },
      // plugin options 
      {
        // prevent BrowserSync from reloading the page 
        // and let Webpack Dev Server take care of this 
        reload: true
      }
    )
  ]
 };