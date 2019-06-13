const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const del = require('del');
const cache = require('gulp-cache');
const autoprefixer = require('gulp-autoprefixer');
const notify = require('gulp-notify');
const babel = require('gulp-babel');
const svgo = require('gulp-svgo');

require('babel-core/register');
require('babel-polyfill');

// Скрипты проекта
gulp.task('js', function () {
  return gulp.src([
    'app/libs/classlist-polyfill/index.js',
    'app/libs/nodelist-foreach-polyfill/index.js',
    'app/libs/element-closest/element-closest.js',
    'app/libs/svgxuse/svgxuse.min.js',
    'app/libs/tinyslider/tiny-slider.js',
    'app/libs/promise/polyfill.min.js',
    'app/libs/regenerator-runtime/runtime.js',
    'app/libs/fetch/fetch.js'
  ])
    .pipe(concat('scripts.min.js'))
    .pipe(uglify().on('error', console.error))
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('compileJS', function () {
  return gulp.src([
    'app/js/es6/*.js'])
    .pipe(babel({ presets: ['es2015', 'stage-0'] }))
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('browser-sync', function () {
  browserSync({
    proxy: 'GulpTest',
    notify: false
  });
});

gulp.task('sass', function () {
  return gulp.src('app/sass/main.sass')
    .pipe(sass({ outputStyle: 'expand' }).on('error', notify.onError()))
    .pipe(autoprefixer(['last 15 versions']))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('watch', ['sass', 'js', 'browser-sync', 'compileJS'], function () {
  gulp.watch('app/sass/**/*.sass', ['sass']);
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
        { cleanupIDs: false }
      ]
    }))
    .pipe(gulp.dest('dist/icons'));
});

gulp.task('build', ['removedist', 'imagemin', 'sass', 'js'], function () {
  gulp.src([
    'app/*.html',
    'app/.htaccess'
  ]).pipe(gulp.dest('dist'));

  gulp.src([
    'app/css/main.css'
  ]).pipe(gulp.dest('dist/css'));

  gulp.src([
    'app/js/jquery-3.2.1.min.js',
    'app/js/scripts.min.js',
    'app/js/common.js'
  ]).pipe(gulp.dest('dist/js'));

  gulp.src([
    'app/fonts/**/*'
  ]).pipe(gulp.dest('dist/fonts'));
});

gulp.task('removedist', function () {
  return del.sync('dist');
});
gulp.task('clearcache', function () {
  return cache.clearAll();
});

gulp.task('default', ['watch']);
