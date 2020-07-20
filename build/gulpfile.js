const { series, src, dest } = require('gulp');
const minifycss = require('gulp-minify-css')
const version = require('../package.json').version
var gulp       = require('gulp'),
    minifyCss  = require('gulp-uglify'),
    rename     = require('gulp-rename'),
    pump       = require('pump');

function renameFile(){
  return gulp.src("../lib/samples-ui.umd.js")
  .pipe(rename("../lib/samples-ui@" + version + ".js"))
  .pipe(gulp.dest("../lib/static/js"));
}

function minCss(){
  return gulp.src("../lib/samples-ui.css")
  .pipe(rename("samples-ui@" + version + ".min.css"))
  .pipe(minifycss())
  .pipe(gulp.dest("../lib/static/css"));
}



exports.build = series([renameFile,minCss]);