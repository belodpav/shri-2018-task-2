var gulp = require('gulp'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  browserSync = require('browser-sync').create(),
  reload = browserSync.reload,
  path = require('path'),
  url = require('gulp-css-url-adjuster'),
  autoprefixer = require('autoprefixer-core'),
  postcss = require('gulp-postcss');

var params = {
  out: 'public',
  htmlSrc: 'touch.change-meeting.html',
  levels: ['touch.blocks', 'desktop.blocks'] // Уровни переопределения, например ['touch.blocks', 'desktop.blocks']
},
  getFileNames = require('html2bl').getFileNames(params);

gulp.task('default', ['server', 'build']);

gulp.task('server', function() {
  browserSync.init({
    server: params.out
  });

  gulp.watch('*.html', ['html']);

  gulp.watch(params.levels.map(function(level) {
    var cssGlob = level + '/**/*.css';
    return cssGlob;
  }), ['css']);

});

gulp.task('build', ['html', 'css', 'images']);

gulp.task('html', function() {
  gulp.src(params.htmlSrc)
  .pipe(rename('index.html'))
  .pipe(gulp.dest(params.out))
  .pipe(reload({ stream: true }));
});

gulp.task('css', function() {
  getFileNames.then(function(files) {
    gulp.src(files.css)
    .pipe(concat('style.css'))
    .pipe(url({ prepend: 'images/'}))
    .pipe(postcss([ autoprefixer() ]))
    .pipe(gulp.dest(params.out))
    .pipe(reload({ stream: true }));
  }).done();
});

gulp.task('images', function() {
  getFileNames.then(function(source) {
    gulp.src(source.dirs.map(function(dir) {
      var imgGlob = path.resolve(dir) + '/*.{png,jpg,svg}';
      return imgGlob;
    }))
    .pipe(gulp.dest(path.join(params.out, 'images')))
  }).done();
})



