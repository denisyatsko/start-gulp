const gulp = require('gulp'),
  gutil = require('gulp-util'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  del = require('del'),
  cache = require('gulp-cache'),
  autoprefixer = require('autoprefixer');
  notify = require('gulp-notify'),
  babel = require('gulp-babel'),
  postcss = require('gulp-postcss'),
  scss = require('postcss-scss'),
  mqpacker = require('css-mqpacker'),
  nested = require('postcss-nested'),
  cssnano = require('cssnano'),
  svgo = require('gulp-svgo');

require('babel-core/register');
require('babel-polyfill');

// Скрипты проекта
gulp.task('js', function () {
  return gulp.src([
    'node_modules/fetch-ie8/fetch.js',
    'node_modules/es6-promise/dist/es6-promise.min.js',
    'node_modules/es6-promise/dist/es6-promise.auto.min.js',
    'node_modules/regenerator-runtime/runtime.js',
    'node_modules/intersection-observer/intersection-observer.js',
    'node_modules/svgxuse/svgxuse.min.js',
    'node_modules/element-closest/browser.js',
    'node_modules/nodelist-foreach-polyfill/index.js',
    'node_modules/classlist-polyfill/src/index.js',
    'node_modules/tiny-slider/dist/min/tiny-slider.js',
    'node_modules/details-element-polyfill/dist/details-element-polyfill.js',
  ])
    .pipe(concat('scripts.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('compileJS', function () {
  return gulp.src([
    'app/js/es6/*.js'])
    .pipe(babel({presets: ['es2015', 'stage-0']}))
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function () {
  browserSync({
    proxy: "NAME",
    notify: false
  });
});

gulp.task('scss', function () {
  let plugins = [
    nested,
    mqpacker,
    autoprefixer,
    cssnano
  ];

  var src = [
    'app/scss/style.scss',
    'app/scss/404.scss'
  ];

  return gulp.src(src)
    .pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))
    .pipe(postcss(plugins, {syntax: scss}))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['scss', 'js', 'browser-sync', 'compileJS'], function () {
  gulp.watch('app/scss/**/*.scss', ['scss']);
  gulp.watch(['libs/**/*.js'], ['js']);
  gulp.watch(['app/js/**/*.js'], ['compileJS']);
  gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('images', function () {
  return gulp.src('app/img/**/*')
    .pipe(gulp.dest('dist/img'));
});

gulp.task('icons', function () {
  return gulp.src('app/icons/**/*')
    .pipe(svgo({
      plugins: [
        {cleanupIDs: false},
      ]
    }))
    .pipe(gulp.dest('dist/icons'));
});

gulp.task('build', ['removedist', 'icons', 'images', 'scss', 'js'], function () {

  var buildFiles = gulp.src([
    'app/*.html',
    'app/.htaccess',
  ]).pipe(gulp.dest('dist'));

  var buildCss = gulp.src([
    'app/css/style.css',
    'app/css/404.css',
  ]).pipe(gulp.dest('dist/css'));

  var buildJs = gulp.src([
    'app/js/jquery.min.js',
    'app/js/scripts.min.js',
    'app/js/common.js',
  ]).pipe(gulp.dest('dist/js'));

  var buildFonts = gulp.src([
    'app/fonts/**/*',
  ]).pipe(gulp.dest('dist/fonts'));

});

gulp.task('removedist', function () {
  return del.sync('dist');
});
gulp.task('clearcache', function () {
  return cache.clearAll();
});

gulp.task('default', ['watch']);
