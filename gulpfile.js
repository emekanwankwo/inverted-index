//Gulp configuration file

var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    runSequence = require('run-sequence'),
    sourcemaps = require('gulp-sourcemaps'),
    gutil = require("gulp-util"),
    webpack = require("webpack"),
    WebpackDevServer = require("webpack-dev-server"),
    webpackConfig = require("./webpack.config.js"),
    stream = require('webpack-stream'),
    browserSync = require('browser-sync').create();


// Styles

gulp.task('styles', function() {
  return sass('src/styles/main.scss', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano())
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});


// Scripts

gulp.task('scripts', function() {
  return gulp.src('src/scripts/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/assets/js'))
    // .pipe(rename({suffix: '.min'}))
    // .pipe(uglify())
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});


// Images

gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/assets/img'))
    .pipe(notify({ message: 'Images task complete' }));
});


// Cleanup before build

gulp.task('clean', function() {
    return del(['dist/assets/css', 'dist/assets/js', 'dist/assets/img']);
});

// Default task

gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images');
});

// Gulp browser-sync

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'src'
    },
  })
})


// Gulp will watch file for changes

gulp.task('watch', function() {

  // Watch the webpack
  gulp.watch(path.ALL, ['webpack']);

  // Watch .html files
  gulp.watch("*.html").on('change', browserSync.reload);

  // Watch .scss files
  gulp.watch('src/styles/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('src/scripts/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch('src/images/**/*', ['images']);

  // Watch for when any of the jasmine spec files are modified
  gulp.watch('jasmine/spec/**/*', browserSync.reload);

  // Create LiveReload server
  livereload.listen();

  // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', browserSync.reload);

});


// Gulp sass task configuration

gulp.task('sass', function() {
  return gulp.src('src/scss/**/*.scss') // Gets all files ending with .scss in app/scss
    .pipe(sass())
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// Gulp webpack task

var path = {
 HTML: 'src/index.html',
 ALL: ['src/**/*.jsx', 'src/**/*.js'],
 MINIFIED_OUT: 'build.min.js',
 DEST_SRC: 'dist/src',
 DEST_BUILD: 'dist/build',
 DEST: 'dist'
 };
 gulp.task('webpack', [], function() {
 return gulp.src(path.ALL) // gulp looks for all source files under specified path
 .pipe(sourcemaps.init()) // creates a source map which would be very helpful for debugging by maintaining the actual source code structure
 .pipe(stream(webpackConfig)) // blend in the webpack config into the source files
 // .pipe(uglify())// minifies the code for better compression
 .pipe(sourcemaps.write())
 .pipe(gulp.dest(path.DEST_BUILD));
 });

 gulp.task("webpack-dev-server", function(callback) {
 // modify some webpack config options
 var myConfig = Object.create(webpackConfig);
 myConfig.devtool = "eval";
 myConfig.debug = true;

 // Start a webpack-dev-server
 new WebpackDevServer(webpack(myConfig), {
 publicPath: "/" + myConfig.output.publicPath,
 stats: {
 colors: true
 }
 }).listen(8080, "localhost", function(err) {
 if (err) throw new gutil.PluginError("webpack-dev-server", err);
 gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
 });

 });


// Create a default watch task
 gulp.task('default', ['webpack-dev-server', 'watch']);