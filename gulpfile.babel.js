let gulp = require('gulp');
let clean = require('gulp-clean');
let karma = require('karma').server;
let bump = require('gulp-bump');
let rename = require('gulp-rename');
let uglify = require('gulp-uglify');
let less = require('gulp-less');
let path = require('path');
let CleanCSS = require('less-plugin-clean-css');
let cleanCSS = new CleanCSS({ advanced: true });
let Autoprefix = require('less-plugin-autoprefix');
let autoprefix = new Autoprefix({ browsers: ['last 2 versions'] });
let sourcemaps = require('gulp-sourcemaps');
let git = require('gulp-git');
let jshint = require('gulp-jshint');
let stylish = require('jshint-stylish');

// Clean up dist folder
gulp.task('clean', () => gulp.src('./dist', { read: false })
                             .pipe(clean()));

// Lint
gulp.task('lint', () => gulp.src('./src/**/*.js')
                            .pipe(jshint('.jshintrc'))
                            .pipe(jshint.reporter(stylish)));

// Run tests
gulp.task('karma', done => karma.start({
                             configFile: __dirname + '/karma.conf.js',
                             singleRun: true
                           }, done));

// Build js
gulp.task('build-js', () => gulp.src('./src/js/global.js')
                                .pipe(gulp.dest('./dist'))
                                .pipe(rename('global.min.js'))
                                .pipe(uglify())
                                .pipe(gulp.dest('./dist')));

// Build less
gulp.task('build-css', () => gulp.src('./src/less/styleguide.less')
                                 .pipe(sourcemaps.init())
                                 .pipe(less({
                                   paths: [ path.join(__dirname, 'src', 'less', 'base') ],
                                   plugins: [cleanCSS, autoprefix]
                                 }))
                                 .pipe(sourcemaps.write())
                                 .pipe(gulp.dest('./dist')));

// Move less
gulp.task('copy-less', () => gulp.src(['./src/less/**/*'])
                                 .pipe(gulp.dest('./dist/styleguide')));

// Move Razor partials
gulp.task('copy-views', () => gulp.src(['./src/views/**/*'])
                                  .pipe(gulp.dest('./dist/views')));

// Bump patch versions in module
gulp.task('bump', ['test'], () => gulp.src(['./package.json', './bower.json'])
                                      .pipe(bump())
                                      .pipe(gulp.dest('./')));

// Bump patch versions in module
gulp.task('bump:minor', ['test'], () => gulp.src(['./package.json', './bower.json'])
                                            .pipe(bump({ type: 'minor' }))
                                            .pipe(gulp.dest('./')));

// Bump major versions in module
gulp.task('bump:major', ['test'], () => gulp.src(['./package.json', './bower.json'])
                                            .pipe(bump({ type: 'major' }))
                                            .pipe(gulp.dest('./')));

// Tag release in git
gulp.task('tag', () => {
  let pkg = require('./package.json');
  let v = `v ${pkg.version}`;
  let message = `Release ${v}`;

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
