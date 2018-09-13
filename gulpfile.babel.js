'use strict';

import gulp from 'gulp';
import concat from 'gulp-concat';
import clean from 'gulp-clean';
import livereload from 'gulp-livereload';
import sass from 'gulp-sass';
import uglifycss from 'gulp-uglifycss';
import gulpsync from 'gulp-sync';

const gSync = gulpsync(gulp);

gulp.task("concatIndex", () => {
  gulp.src(['partials/header.html', 'partials/home.html', 'partials/footer.html'])
    .pipe(concat("index.html"))
    .pipe(gulp.dest("public"))
    .pipe(livereload({ port: 9001 }));
});

gulp.task('compileSass', () => {
  return gulp.src("scss/styles.scss")
    .pipe(sass())
    .pipe(gulp.dest('tmp_css'))
    .pipe(livereload({ port: 9001 }));
});

gulp.task('css', () => {
  return gulp.src(('./tmp_css/styles.css'))
    .pipe(uglifycss({
      "maxLineLen": 80,
      "uglyComments": true
    }))
    .pipe(gulp.dest('./public/'))
})

gulp.task('clean', function() {
  gulp.src(['public/*'])
    .pipe(clean());
});

gulp.task('remove-css', () => {
  gulp.src(['tmp_css'])
    .pipe(clean());
})

gulp.task("build", gSync.sync(['clean', 'compileSass', 'css', 'concatIndex', 'remove-css' ]), () => {
  return gulp.src(["img/*", "js/*"], { base: './'})
  .pipe(gulp.dest('public'))
  .pipe(livereload({ port: 9001 }));
});

gulp.task("watch", () => {
  livereload.listen({ port: 9001 });
  return gulp.watch(['partials/*.html', 'scss/*.scss', 'img/*', 'js/*.js'], ['build']);
});
