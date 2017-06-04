// npm instal --seve-dev gulpjs/gulp#4.0
// export PATH=./node_modules/.bin:$PATH

//////////////////////////////////////////////////
//
// Включаем задачи
//
/////////////////////////////////////////////////

var gulp = require('gulp'), // ВИНОВНИК ТОРЖЕСТВА 
    sass = require('gulp-sass'), // КОМПИЛЯЦИЯ SASS В CSS
    browserSync = require('browser-sync').create(),
    autoprefixer = require('gulp-autoprefixer'), // ДОБАВЛЕНИЕ ПРЕФИКСОВ
    plumber = require('gulp-plumber'),
    debug = require('gulp-debug'),
    del = require('del'), // УДОЛЕНИЕ ФАЙЛОВ И ДИРРЕКТОРИЙ
    rename = require('gulp-rename'), // ПЕРЕИМЕННОВЫВАЕТ ФАЙЛЫ
    smaps = require('gulp-sourcemaps'), // КАРТА СТИЛЕЙ
    notify = require('gulp-notify'),
    jade = require('gulp-jade'), // КОМПИЛЯЦИЯ JADE  
    newer = require('gulp-newer'),
    concat = require('gulp-concat'), // КОНКАТЕНАЦИЯ ФАЙЛОВ
    uglify = require('gulp-uglify'), // СЖАТИЕ Java Script  
    gulpif = require('gulp-if'),
    data = require('gulp-data'),
    cssnano = require('gulp-cssnano'),
    wiredep = require('wiredep').srteam;


// меняет режим сборки: 
// NODE_ENV=production gulp ... - продакшн версия. 
// gulp ... - режим разработки
const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';
//////////////////////////////////////////////////
//
// Задачи для CSS/Sass
//
/////////////////////////////////////////////////
gulp.task('sass', function () {
    return gulp.src('src/sass/*.scss')
        .pipe(plumber({
            errorHandler: notify.onError(function (err) {
                return {
                    title: 'Styles',
                    message: err.message
                }
            })
        }))
        .pipe(gulpif(isDevelopment, smaps.init()))
        .pipe(sass().on('error', sass.logError))
        //        .pipe(cssnano())
        .pipe(gulpif(isDevelopment, smaps.write("./")))
        .pipe(rename('styles.min.css'))
        .pipe(gulp.dest('public/css'));
});
//////////////////////////////////////////////////
//
// Задачи для Jade
//
/////////////////////////////////////////////////
gulp.task('jade', function () {
    return gulp.src('src/jade/*.jade')
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest('public'));
});
//////////////////////////////////////////////////
//
// Задачи для JavaScript
//
/////////////////////////////////////////////////
gulp.task('scripts', function () {
    return gulp.src('src/js/*.js')
        //        .pipe(concat("all.js"))
        //        .pipe(uglify())
        //        .pipe(rename('script.min.js'))
        .pipe(gulp.dest('public/js'));
});


//////////////////////////////////////////////////
//
// Перемещений изображений и шрифтов в папку сборки
//
/////////////////////////////////////////////////
gulp.task('assets', function () {
    return gulp.src('src/assets/**')
        .pipe(newer('public'))
        .pipe(debug({
            title: "assets"
        }))
        .pipe(gulp.dest('public'));
})

//////////////////////////////////////////////////
//
// СЖАТИЕ КАРТИНОК
//
/////////////////////////////////////////////////
gulp.task('images', function (cb) {
    gulp.src(['src/assets/**/*.png', 'src/assets/**/*.jpg', 'src/assets/**/*.gif', 'src/assets/**/*.jpeg'])
        .pipe(image_opt({
            optimizationLevel: 9,
            progressive: true,
            interlaced: true
        })).pipe(gulp.dest('public/images')).on('end', cb).on('error', cb);
});

//////////////////////////////////////////////////
//
// Удоление дирректории со сборкой
//
/////////////////////////////////////////////////
gulp.task('clean', function () {
    return del("public");
})


gulp.task('watch', function () {
    gulp.watch('src/sass/**/*.scss', gulp.series('sass'));
    gulp.watch('src/assets/**/*.*', gulp.series('assets'));
    gulp.watch('src/jade/**/*.jade', gulp.series('jade'));
    gulp.watch('src/jade/data/data.json', gulp.series('jade'));
    //    gulp.watch(['src/jade/data/data.json'], restart);
    gulp.watch('src/js/*.js', gulp.series('scripts'));
})


//////////////////////////////////////////////////
//
// Задача сборки проекта
//
/////////////////////////////////////////////////
gulp.task('build', gulp.series('clean', gulp.parallel('sass', 'scripts', 'jade', 'assets')));
//////////////////////////////////////////////////
//
// Задачи Browser-Sync
//
/////////////////////////////////////////////////
gulp.task('serv', function () {
        browserSync.init({
            server: 'public',
            index: "aboutCompany.html"
        });
        browserSync.watch('public/**/*.*').on('change', browserSync.reload);
    })
    //////////////////////////////////////////////////
    //
    // Задача по умолчанию
    //
    /////////////////////////////////////////////////
gulp.task('default', gulp.series('build', gulp.parallel('watch', 'serv')))
