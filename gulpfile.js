//Gulp taskrunner config file

let gulp = require('gulp'),
  runSequence = require('run-sequence'),
  run = require('gulp-run'),
  Server = require('karma').Server;

// Default task to run.
gulp.task('default', () => {
  return runSequence('bundle', ['scripts', 'styles', 'pack']);
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

// Test using karma
gulp.task('test', () => {
  run('node node_modules/jasmine-node/bin/jasmine-node --color --verbose jasmine/spec').exec();
});

// Use webpack to create the bundle file.
gulp.task('bundle', () => {
  run('node node_modules/webpack/bin/webpack').exec();
});