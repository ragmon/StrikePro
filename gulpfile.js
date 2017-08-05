var gulp = require('gulp'),
    // browserSync = require('browser-sync').create(),
    smaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    jade = require('gulp-jade'),
    del = require('del'),
    plumber = require('gulp-plumber'),
    debug = require('gulp-debug'),
    notify = require('gulp-notify'),
    rename = require('gulp-rename'),
    cssnano = require('gulp-cssnano'),
    concat = require('gulp-concat'),
    newer = require('gulp-newer');

var browserSync = require('browser-sync');
var reload      = browserSync.reload;

var path_build = {
    "build" : "public",
    "html" : "public/",
    "js" : "public/js",
    "css" : "public/css/",
    "fonts" : "public/fonts/"
};
var path_src = {
    "src" : "src/",
    "html" : 'src/jade/**/*.jade',
    "js" : "src/js/*.js",
    "scss" : "src/sass/**/*.scss",
    "fonts" : "src/fonts/",
    "watch" : "src/**/*.*"
};

gulp.task('clean', function() {
    return del(path_build.build);
});

gulp.task('sass', function () {
    return gulp.src(path_src.scss)
        .pipe(plumber({
            errorHandler: notify.onError(function (err) {
                return {
                    title: 'Sass',
                    message: err.message
                }
            })
        }))
        .pipe(smaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(smaps.write("./"))
        .pipe(rename('styles.min.css'))
        .pipe(gulp.dest(path_build.css))
        .pipe(reload({stream:true}));
});

gulp.task('html', function() {
    return gulp.src(path_src.html)
        .pipe(plumber({
            errorHandler: notify.onError(function (err) {
                return {
                    title: 'html:all',
                    message: err.message
                }
            })
        }))
        .pipe(jade({
            pretty: true
        }))
        .pipe(debug({ title: 'html:' }))
        .pipe(gulp.dest(path_build.build))
        .pipe(reload({stream:true}));
});

gulp.task('js', function () {
    return gulp.src(path_src.js)
        .pipe(plumber({
            errorHandler: notify.onError(function (err) {
                return {
                    title: 'Javascript',
                    message: err.message
                }
            })
        }))
        .pipe(smaps.init())
        .pipe(smaps.write("./"))
        .pipe(rename({dirname: ''}))
        .pipe(gulp.dest(path_build.js));
});

gulp.task('assets', function () {
    return gulp.src('src/assets/**')
        .pipe(newer('public'))
        .pipe(debug({
            title: "assets"
        }))
        .pipe(gulp.dest('public'));
});

gulp.task('watch', function () {
    gulp.watch(path_src.scss, gulp.series('sass'));
    gulp.watch(path_src.html, gulp.series('html'));
    gulp.watch(path_src.js, gulp.series('js'));
    gulp.watch('src/assets/**', gulp.series('assets'));
});

gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: "./"+path_build.build
        },
        port: 8080,
        open: true,
        notify: false
    });
});


gulp.task('build', gulp.series('clean','sass','assets','js','html'));

gulp.task('default', gulp.series('build', gulp.parallel('watch', 'browserSync')));