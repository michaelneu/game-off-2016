var gulp = require('gulp'),
    less = require('gulp-less'),
    babel = require("gulp-babel");

var SRC = {
  LESS: {
    MAIN: 'web/static/frontend/src/less/style.less',
    WATCH: 'web/static/frontend/src/less/**/*.less',
  },
  IMAGES: 'web/static/frontend/src/images/**/*.*',
  PHOENIX: 'node_modules/phoenix/web/static/js/phoenix.js'
};

var DEST = {
  BASE: 'priv/static',
  IMAGES: 'priv/static/images',
};

gulp.task('less', function () {
  return gulp.src(SRC.LESS.MAIN)
              .pipe(less())
              .pipe(gulp.dest(DEST.BASE));
});

gulp.task('images', function () {
  return gulp.src(SRC.IMAGES).pipe(gulp.dest(DEST.IMAGES));
});

gulp.task('phoenix', function () {
  return gulp.src(SRC.PHOENIX)
              .pipe(babel({
                presets: ['es2015']
              }))
              .pipe(gulp.dest(DEST.BASE));
});

gulp.task('default', ['less', 'images', 'phoenix']);

gulp.task('watch', function () {
  gulp.watch(SRC.LESS.WATCH, ['less']);
  gulp.watch(SRC.IMAGES, ['images']);
});
