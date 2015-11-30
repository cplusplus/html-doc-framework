var browserify = require('browserify');
var babelify = require('babelify');
var gulp = require('gulp')
var source = require('vinyl-source-stream')
var wct = require('web-component-tester');

gulp.task('chai-html', () => {
  return browserify({
    entries: './test-util/chai-html.src.js',
    debug: true,
  })
  .transform(babelify.configure({presets: ["es2015"]}),
             // Remove if https://github.com/i-like-robots/chai-html/pull/1 is accepted.
             {global: true})
  .bundle()
  // Name the bundle.
  .pipe(source('chai-html.js'))
  // Write the bundle.
  .pipe(gulp.dest('./test-util/'));
});

gulp.task('test:local', ['chai-html'], done => {
  wct.test({plugins: {local: {},   sauce: false}}, done);
})
gulp.task('test:sauce', ['chai-html'], done => {
  wct.test({plugins: {local: false, sauce: {disabled:false}}}, done);
})
