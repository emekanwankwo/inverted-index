//Gulp taskrunner config file

let gulp = require('gulp'),
  runSequence = require('run-sequence'),
  run = require('gulp-run'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream'),
  webpack = require('webpack'),
  WebpackDevServer = require('webpack-dev-server'),
  webpackConfig = require('./webpack.config.js'),
  port = process.env.PORT || 3000;


// Default task to run.
gulp.task('default', () => {
  return runSequence('bundle', ['styles', 'pack'], 'browserifytest', 'webpack-dev-server');
});

// Browserify test spec file to be accessible by the browser
gulp.task('browserifytest', () => {
  return browserify('./jasmine/spec/inverted-index-test-spec.js')
    .bundle()
    .pipe(source('test-spec.js'))
    .pipe(gulp.dest('./jasmine/spec/browser'));
});

// Move the index file to the public directory
gulp.task('pack', () => {
  gulp.src('src/index.html')
    .pipe(gulp.dest('public'));
});

// Move the styles files to the public/styles directory
gulp.task('styles', () => {
  gulp.src('src/styles/*.css')
    .pipe(gulp.dest('public/styles'));
});

// Test using jasmine-node
gulp.task('test', () => {
  run('istanbul cover jasmine-node jasmine/spec/inverted-index-test-spec.js').exec();
});

// Use webpack to create the bundle file.
gulp.task('bundle', () => {
  run('node node_modules/webpack/bin/webpack').exec();
});

gulp.task('webpack-dev-server', function() {
  // modify some webpack config options
  let myConfig = Object.create(webpackConfig);
  myConfig.devtool = 'eval';
  myConfig.debug = true;

  // Start a webpack-dev-server
  new WebpackDevServer(webpack(myConfig), {
    publicPath: './' + myConfig.output.publicPath,
    stats: {
      colors: true
    }
  }).listen(port);

// Watch files for changes
gulp.task('watch', () => {

  // Watch .html files
  gulp.watch('src/*.html', ['pack']);

  // Watch .scss files
  gulp.watch('src/styles/*.css', ['styles']);

  // Watch .js files
  gulp.watch('src/*.js', ['bundle']);

});

});