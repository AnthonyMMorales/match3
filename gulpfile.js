const gulp = require('gulp');
const concat = require('gulp-concat');
const gulpif = require('gulp-if');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const jshint = require('gulp-jshint');
const imangemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const jsonmerge = require('gulp-merge-json');
const jsonminify = require('gulp-jsonminify');

const history = require('connect-history-api-fallback');
const merge = require('merge-stream');
const browserSync = require('browser-sync').create();
const del = require('del');
const runSequence = require('run-sequence');

const scripts = require('./scripts');
const styles = require('./styles');

var devMode = false;
var src = './src';
var paths = {
  get dest() { return devMode === false ? './build' : './test'; },
  get css() { return this.dest+'/css'; },
  get js() { return this.dest+'/js'; },
  get json() { return this.dest+'/json'; },
  get images() { return this.dest+'/img'; },
  get fonts() { return this.dest+'/css'; },
  get video() { return this.dest+'/css'; },
}


gulp.task('vendor', function() {
  return merge(
    gulp.src(styles)
        .pipe(concat('vendor.css'))
        .pipe(sass({ outputStyle: devMode === false ? 'compressed' : 'expanded' }).on('error', sass.logError))
        .pipe(gulp.dest(paths.css)),
    gulp.src(scripts)
        .pipe(concat('vendor.js'))
        .pipe(gulpif(devMode === false, uglify({ mangle:false })))
        .pipe(gulp.dest(paths.js)));
});


gulp.task('json', function() {
  return gulp.src(['./src/**/**/*.json', './src/**/*.json'])
        .pipe(jsonmerge('main.json'))
        .pipe(gulpif(devMode === false, jsonminify()))
        .pipe(gulp.dest(paths.json))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('css', function() {
  return gulp.src(['./src/**/**/*.scss', './src/**/*.scss'])
        .pipe(concat('main.css'))
        .pipe(sass({ outputStyle: devMode === false ? 'compressed' : 'expanded' }).on('error', sass.logError))
        .pipe(gulp.dest(paths.css))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('js', function() {
    return gulp.src(['./src/**/**/*.js', './src/**/*.js'])
        .pipe(jshint({ laxcomma: true }))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulpif(devMode === false, uglify({ mangle: false })))
        .pipe(gulp.dest(paths.js))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('fonts', function() {
    return gulp.src(['./src/*.woff', './src/**/*.woff'])
        .pipe(rename({dirname: ''}))
        .pipe(gulp.dest(paths.fonts))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('video', function() {
    return gulp.src(['./src/*.mp4', './src/**/*.mp4'])
        .pipe(rename({dirname: ''}))
        .pipe(gulp.dest(paths.video))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('html', function() {
    return gulp.src(['./src/*.html', './src/**/*.html'])
        .pipe(gulp.dest(paths.dest))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('images', function() {
    return gulp.src(['./src/**/*.+(png|jpg|gif|svg)', './src/**/**/*.+(png|jpg|gif|svg)'])
        .pipe(gulpif(devMode === false, imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 7 }),
            imagemin.svgo({ plugins: [{ removeViewBox: true }]})
          ], { verbose: true })))
        .pipe(rename({dirname: ''}))
        .pipe(gulp.dest(paths.images))
})

gulp.task('copy', function() {
    return gulp.src(['./src/*.+(config|xml|png|ico)', './src/.*+(htaccess)'])
        .pipe(gulp.dest(paths.dest));
})

gulp.task('clean', function() {
    return del(paths.dest);
})

gulp.task('watch', function() {
    gulp.watch(['./src/**/*.+(css|scss)', './src/**/**/*.+(css|scss)'], ['css']);
    gulp.watch(['./src/**/*.js', './src/**/**/*.js'], ['js']);
    gulp.watch(['./src/**/*.json', './src/**/**/*.json'], ['json']);
    gulp.watch(['./src/*.html', './src/**/*.html'], ['html']);
    gulp.watch(['./src/**/*.+(png|jpg|gif|svg)', './src/**/**/*.+(png|jpg|gif|svg)'], ['images']);
})

gulp.task('browser-sync', function() {
    return browserSync.init({
        open: false,
        server: { baseDir: paths.dest, middleware: [history()] }
    });
})

gulp.task('build', ['clean'], function() {
    runSequence(['vendor','css','js','json','html','images', 'fonts', 'video', 'copy','watch'], function(){
        console.log(' -------------------------------------');
        console.log(' Build Type: ' + (devMode === true ? 'DEV' : 'PROD'));
        console.log(' -------------------------------------');
        if(devMode === true) {
            console.log(' * Least Efficient');
            console.log(' * Uncompressed files');
            console.log(' * Longer load times');
        } else {
            console.log(' * Most Efficient');
            console.log(' * Compressed files');
            console.log(' * Shorter load times');
        }
        console.log(' -------------------------------------');
        gulp.start('browser-sync');
    });
});

gulp.task('default', function() {
    devMode = true;
    gulp.start(['build']);
});
