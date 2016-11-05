var gulp = require("gulp"),
    less = require("gulp-less");

var SRC = {
  LESS: {
    MAIN: "src/less/style.less",
    WATCH: "src/less/**/*.less"
  },
  HTML: "src/**/*.html",
  IMAGES: "src/images/**/*.*"
};

var DEST = {
  BASE: "dist",
  IMAGES: "dist/images"
};


gulp.task("less", function () {
  return gulp.src(SRC.LESS.MAIN)
              .pipe(less())
              .pipe(gulp.dest(DEST.BASE));
});


gulp.task("html", function () {
  return gulp.src(SRC.HTML).pipe(gulp.dest(DEST.BASE));
});


gulp.task("images", function () {
  return gulp.src(SRC.IMAGES).pipe(gulp.dest(DEST.IMAGES));
});


gulp.task("default", ["less", "html"]);


gulp.task("watch", function () {
  gulp.watch(SRC.LESS.WATCH, ["less"]);
  gulp.watch(SRC.HTML, ["html"]);
  gulp.watch(SRC.IMAGES, ["images"]);
});
