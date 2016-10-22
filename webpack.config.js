module.exports = {
  entry: ['./src/app.js'],
  output: {
    filename: 'public/scripts/invertedindex.js'
  },
  devServer: {
    contentBase: './public',
    hot: true
  }
};