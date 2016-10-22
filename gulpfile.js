//Gulp taskrunner config file

let gulp = require('gulp'),
  runSequence = require('run-sequence'),
  run = require('gulp-run'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream');

// Default task to run.
gulp.task('default', () => {
  return runSequence('bundle', ['scripts', 'styles', 'pack', 'browserifytest']);
});

// Move the index file to the public directory
gulp.task('pack', () => {
  gulp.src('index.html')
    .pipe(gulp.dest('public'));
});

// Move the styles files to the public/styles directory
gulp.task('styles', () => {
  gulp.src('src/styles/*.css')
    .pipe(gulp.dest('public/styles'));
});

// Move the scrit files to the public/scripts directory
gulp.task('scripts', () => {
  setTimeout(() => {
    gulp.src('dist/build/*.js')
      .pipe(gulp.dest('public/scripts'));
  }, 1000);
});

// Test using jasmine-node
gulp.task('test', () => {
  run('node node_modules/jasmine-node/bin/jasmine-node --color --verbose jasmine/spec/*.js').exec();
});

// Browserify test spec file to be accessible by the browser
gulp.task('browserifytest', () => {
  return browserify('./jasmine/spec/inverted-index-test-spec.js')
    .bundle()
    .pipe(source('test-spec.js'))
    .pipe(gulp.dest('./jasmine/spec/browser'));
});

// Use webpack to create the bundle file.
gulp.task('bundle', () => {
  run('node node_modules/webpack/bin/webpack').exec();
});