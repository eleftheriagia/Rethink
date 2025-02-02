/**
 * Gulp file to automate the various tasks
 */

var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var cleanCss = require('gulp-clean-css');
var del = require('del');
var imagemin = require('gulp-imagemin');
var htmlmin = require('gulp-htmlmin');
var cssbeautify = require('gulp-cssbeautify');
var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var wait = require('gulp-wait');
var sourcemaps = require('gulp-sourcemaps');
var fileinclude = require('gulp-file-include');

// Define paths

var paths = {
    dist: {
        base: './dist/',
        css: './dist/css',
        html: './dist/html',
        docs: './dist/docs',
        assets: './dist/assets',
        img: './dist/assets/img',
        vendor: './dist/node_modules'
    },
    dev: {
        base: './html&css/',
        css: './html&css/css',
        html: './html&css/html',
        docs: './html&css/docs',
        assets: './html&css/assets',
        img: './html&css/assets/img',
        vendor: './html&css/node_modules'
    },
    base: {
        base: './',
        node: './node_modules'
    },
    src: {
        base: './src/',
        css: './src/css',
        html: './src/html/**/*.html',
        docs: './src/docs/**/*.html',
        assets: './src/assets/**/*.*',
        partials: './src/partials/**/*.html',
        scss: './src/scss',
        vendor: './node_modules/**/*.*'
    },
    temp: {
        base: './.temp/',
        css: './.temp/css',
        html: './.temp/html',
        docs: './.temp/docs',
        assets: './.temp/assets',
        vendor: './.temp/node_modules'
    }
};

// Compile SCSS
gulp.task('scss', function () {
    return gulp.src([paths.src.scss + '/spaces/**/*.scss', paths.src.scss + '/spaces.scss'])
        .pipe(wait(500))
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['> 1%']
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.temp.css))
        .pipe(browserSync.stream());
});

gulp.task('index', function () {
    return gulp.src([paths.src.base + '**.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: './src/partials/'
        }))
        .pipe(gulp.dest(paths.temp.base))
        .pipe(browserSync.stream());
});

gulp.task('html', function () {
    return gulp.src([paths.src.html])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: './src/partials/'
        }))
        .pipe(gulp.dest(paths.temp.html))
        .pipe(browserSync.stream());
});

gulp.task('docs', function () {
    return gulp.src([paths.src.docs])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: './src/partials/'
        }))
        .pipe(gulp.dest(paths.temp.docs))
        .pipe(browserSync.stream());
});

gulp.task('assets', function () {
    return gulp.src([paths.src.assets])
        .pipe(gulp.dest(paths.temp.assets))
        .pipe(browserSync.stream());
});

gulp.task('vendor', function () {
    return gulp.src([paths.src.vendor])
        .pipe(gulp.dest(paths.temp.vendor))
        .pipe(browserSync.stream());
});

gulp.task('serve', gulp.series('scss', 'html', 'docs', 'index', 'assets', 'vendor', function() {
    browserSync.init({
        server: paths.temp.base
    });

    gulp.watch([paths.src.scss + '/spaces/**/*.scss', paths.src.scss + '/spaces.scss'], gulp.series('scss'));
    gulp.watch([paths.src.html, paths.src.base + '**.html', paths.src.docs, paths.src.partials], gulp.series('html', 'docs', 'index'));
    gulp.watch([paths.src.assets], gulp.series('assets'));
    gulp.watch([paths.src.vendor], gulp.series('vendor'));
}));

// Beautify CSS
gulp.task('beautify:css', function () {
    return gulp.src([
        paths.dev.css + '/spaces.css'
    ])
        .pipe(cssbeautify())
        .pipe(gulp.dest(paths.dev.css))
});

// Minify CSS
gulp.task('minify:css', function () {
    return gulp.src([
        paths.dist.css + '/spaces.css'
    ])
    .pipe(cleanCss())
    .pipe(gulp.dest(paths.dist.css))
});

// Optimize images
gulp.task('optimize:img', function () {
    return gulp.src(paths.dist.img)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.dist.img))
});

// Minify Html
gulp.task('minify:html', function () {
    return gulp.src([paths.dist.html + '/**/*.html'])
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(fileinclude({
            prefix: '@@',
            basepath: './src/partials/'
        }))
        .pipe(gulp.dest(paths.dist.html))
});

gulp.task('minify:html:index', function () {
    return gulp.src([paths.dist.base + '*.html'])
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(fileinclude({
            prefix: '@@',
            basepath: './src/partials/'
        }))
        .pipe(gulp.dest(paths.dist.base))
});

// Clean
gulp.task('clean:dist', function () {
    return del([paths.dist.base]);
});

gulp.task('clean:dev', function () {
    return del([paths.dev.base]);
});

// Compile and copy scss/css
gulp.task('copy:dist:css', function () {
    return gulp.src([paths.src.scss + '/spaces/**/*.scss', paths.src.scss + '/spaces.scss'])
        .pipe(wait(500))
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['> 1%']
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.dist.css))
});

gulp.task('copy:dev:css', function () {
    return gulp.src([paths.src.scss + '/spaces/**/*.scss', paths.src.scss + '/spaces.scss'])
        .pipe(wait(500))
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['> 1%']
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.dev.css))
});

// Copy Html
gulp.task('copy:dist:html', function () {
    return gulp.src([paths.src.html])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: './src/partials/'
        }))
        .pipe(gulp.dest(paths.dist.html));
});

gulp.task('copy:dev:html', function () {
    return gulp.src([paths.src.html])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: './src/partials/'
        }))
        .pipe(gulp.dest(paths.dev.html));
});

// Copy docs
gulp.task('copy:dist:docs', function () {
    return gulp.src([paths.src.docs])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: './src/partials/'
        }))
        .pipe(gulp.dest(paths.dist.docs))
});

gulp.task('copy:dev:docs', function () {
    return gulp.src([paths.src.docs])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: './src/partials/'
        }))
        .pipe(gulp.dest(paths.dev.docs))
});

// Copy index
gulp.task('copy:dist:html:index', function () {
    return gulp.src([paths.src.base + '**.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: './src/partials/'
        }))
        .pipe(gulp.dest(paths.dist.base))
});

gulp.task('copy:dev:html:index', function () {
    return gulp.src([paths.src.base + '**.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: './src/partials/'
        }))
        .pipe(gulp.dest(paths.dev.base))
});

// Copy assets
gulp.task('copy:dist:assets', function () {
    return gulp.src(paths.src.assets)
        .pipe(gulp.dest(paths.dist.assets))
});

gulp.task('copy:dev:assets', function () {
    return gulp.src(paths.src.assets)
        .pipe(gulp.dest(paths.dev.assets))
});

// Copy node_modules
gulp.task('copy:dist:vendor', function () {
    return gulp.src(paths.src.vendor)
        .pipe(gulp.dest(paths.dist.vendor))
});

gulp.task('copy:dev:vendor', function () {
    return gulp.src(paths.src.vendor)
        .pipe(gulp.dest(paths.dev.vendor))
});

gulp.task('build:dev', gulp.series('clean:dev', 'copy:dev:css', 'copy:dev:html', 'copy:dev:docs', 'copy:dev:html:index', 'copy:dev:assets', 'beautify:css', 'copy:dev:vendor'));
gulp.task('build:dist', gulp.series('clean:dist', 'copy:dist:css', 'copy:dist:html', 'copy:dist:docs', 'copy:dist:html:index', 'copy:dist:assets', 'minify:css', 'minify:html', 'minify:html:index', 'optimize:img', 'copy:dist:vendor'));

// Default
gulp.task('default', gulp.series('serve'));