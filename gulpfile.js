//Gulp taskrunner config file

let gulp = require('gulp'),
  runSequence = require('run-sequence'),
  run = require('gulp-run'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream');

// Default task to run.
gulp.task('default', () => {
  return runSequence('bundle', ['styles', 'pack'], 'browserifytest');
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
  run('node node_modules/jasmine-node/bin/jasmine-node --color --verbose jasmine/spec/*.js').exec();
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
  }).listen(5000, 'localhost');
});

// Create a default watch task
gulp.task('default', ['webpack-dev-server']);