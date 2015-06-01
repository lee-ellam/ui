var gulp = require('gulp');
var clean = require('gulp-clean');
var karma = require('karma').server;
var bump = require('gulp-bump');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var path = require('path');
var CleanCSS = require('less-plugin-clean-css');
var cleanCSS = new CleanCSS({ advanced: true });
var Autoprefix = require('less-plugin-autoprefix');
var autoprefix = new Autoprefix({ browsers: ['last 2 versions'] });
var sourcemaps = require('gulp-sourcemaps');
var git = require('gulp-git');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

// Clean up dist folder
gulp.task('clean', function() {
  return gulp.src('./dist', { read: false })
    .pipe(clean());
});

// Lint
gulp.task('lint', function() {
  return gulp.src('./src/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(stylish));
});

// Run tests
gulp.task('karma', function(done) {
  return karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

// Build js
gulp.task('build-js', function() {
  return gulp.src('./src/js/global.js')
    .pipe(gulp.dest('./dist'))
    .pipe(rename('global.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'))
});

// Build less
gulp.task('build-css', function() {
  return gulp.src('./src/less/styleguide.less')
    .pipe(sourcemaps.init())
    .pipe(less({
      paths: [ path.join(__dirname, 'src', 'less', 'base') ],
      plugins: [cleanCSS, autoprefix]
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist'));
});

// Move less
gulp.task('copy-less', function() {
  return gulp.src(['./src/less/**/*'])
    .pipe(gulp.dest('./dist/styleguide'));
});

// Move Razor partials
gulp.task('copy-views', function() {
  return gulp.src(['./src/views/**/*'])
    .pipe(gulp.dest('./dist/views'));
});

// Bump patch versions in module
gulp.task('bump', ['test'], function() {
  return gulp.src(['./package.json', './bower.json'])
    .pipe(bump())
    .pipe(gulp.dest('./'));
});

// Bump patch versions in module
gulp.task('bump:minor', ['test'], function() {
  return gulp.src(['./package.json', './bower.json'])
    .pipe(bump({ type: 'minor' }))
    .pipe(gulp.dest('./'));
});

// Bump major versions in module
gulp.task('bump:major', ['test'], function() {
  return gulp.src(['./package.json', './bower.json'])
    .pipe(bump({ type: 'major' }))
    .pipe(gulp.dest('./'));
});

// Tag release in git
gulp.task('tag', function() {
  var pkg = require('./package.json');
  var v = 'v' + pkg.version;
  var message = 'Release ' + v;

  return gulp.src('./')
    .pipe(git.commit(message))
    .pipe(git.tag(v, message))
    .pipe(git.push('origin', 'master', '--tags'))
    .pipe(gulp.dest('./'));
});

// Release to git and publish bower package
// TODO: publish NuGet package
gulp.task('release', ['bump', 'tag']);
gulp.task('release:minor', ['bump:minor', 'tag']);
gulp.task('release:major', ['bump:major', 'tag']);

// Lint and test
gulp.task('test', ['lint', 'karma']);

// Build files
gulp.task('build', ['clean', 'test', 'build-css', 'build-js', 'copy-less', 'copy-views']);
