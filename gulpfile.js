/*!
 * Gulp SMPL Makeup Builder
 *
 * @version 3.5.1
 * @author Artem Dordzhiev (Draft)
 * @type Module gulp
 * @license The MIT License (MIT)
 */

'use strict';

/* Get plugins */
var gulp = require('gulp');
var browserSync = require('browser-sync');
var config = require('./config.json');
var fs = require('fs');
var env = process.env.NODE_ENV;
var pkg = JSON.parse(fs.readFileSync('./package.json'));
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'del', 'merge-stream', 'vinyl-buffer']
});

/* Error handler closure */
function errorHandler(task, title) {
    'use strict';

    return function (err) {
        $.util.log(task ? $.util.colors.red('[' + task + (title ? ' -> ' + title : '') + ']') : "", err.toString());
        this.emit('end');
    };
}

/* Build task */
gulp.task('build', $.sequence('clean', ['copy:static'], 'icons', ['jade', 'styles', 'js', 'js:vendor']));
gulp.task('serve', $.sequence('build', 'browsersync', 'watch'));
gulp.task('default', ['build']);

/* Styles tasks */
gulp.task('styles', function (done) {
    var sassMode = fs.existsSync('./src/scss/main.scss');
    $.sequence(sassMode ? 'sass' : 'less', done);
});

gulp.task('sass', function () {
    return gulp.src('./src/scss/main.scss')
        .pipe($.sourcemaps.init()).on('error', errorHandler('sass', 'sourcemaps:init'))
        .pipe($.sass()).on('error', errorHandler('sass', 'compile'))
        .pipe($.autoprefixer()).on('error', errorHandler('sass', 'autoprefixer'))
        .pipe($.cleanCss()).on('error', errorHandler('sass', 'cleanCSS'))
        .pipe($.sourcemaps.write('.')).on('error', errorHandler('sass', 'sourcemaps:write'))
        .pipe(gulp.dest('./dist/assets/css/'))
        .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('less', function () {
    return gulp.src('./src/less/main.less')
        .pipe($.sourcemaps.init()).on('error', errorHandler('less', 'sourcemaps:init'))
        .pipe($.less()).on('error', errorHandler('less', 'compile'))
        .pipe($.autoprefixer()).on('error', errorHandler('less', 'autoprefixer'))
        .pipe($.cleanCss()).on('error', errorHandler('less', 'cleanCSS'))
        .pipe($.sourcemaps.write('.')).on('error', errorHandler('less', 'sourcemaps:write'))
        .pipe(gulp.dest('./dist/assets/css/'))
        .pipe(browserSync.stream({match: '**/*.css'}));
});

/* Jade task */
gulp.task('jade', function () {
    var locale = config.locale ? JSON.parse(fs.readFileSync('./src/locales/' + config.locale + '.json')) : null;
    var jadeOptions = {
        basedir: "./src/jade/",
        pretty: true,
        locals: {
            "ENV": env,
            "PACKAGE": pkg,
            "__": locale
        }
    };

    return gulp.src(['./src/jade/**/*.jade', '!./src/jade/_includes/**'])
        .pipe($.jade(jadeOptions)).on('error', errorHandler('jade', 'compile'))
        .pipe(gulp.dest('./dist/'))
        .pipe(browserSync.stream({match: '**/*.{html,htm}'}));
});

/* JS task */
gulp.task('js', function (done) {
    var webpackMode = fs.existsSync('./webpack.config.js');
    $.sequence(webpackMode ? 'js:webpack' : 'js:copy', done);
});

gulp.task('js:copy', function () {
    return gulp.src(['./src/js/**/*'])
        .pipe($.uglify()).on('error', errorHandler('js', 'uglify'))
        .pipe(gulp.dest('./dist/assets/js'));
});

gulp.task('js:webpack', function () {
    return gulp.src(['./src/js/**/*'])
        .pipe($.webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('./dist/assets/js'));
});

gulp.task('js:vendor', function () {
    var bowerOptions = {};
    var uglifySaveLicense = require('uglify-save-license');
    var uglifyOptions = {
        output: {
            comments: uglifySaveLicense
        }
    };

    return gulp.src('./bower.json')
        .pipe($.mainBowerFiles('**/*.js', bowerOptions)).on('error', errorHandler('js:vendor', 'mainBowerFiles'))
        .pipe($.sourcemaps.init()).on('error', errorHandler('js:vendor', 'sourcemaps:init'))
        .pipe($.concat('vendor.js')).on('error', errorHandler('js:vendor', 'concat'))
        .pipe($.uglify(uglifyOptions)).on('error', errorHandler('js:vendor', 'uglify'))
        .pipe($.sourcemaps.write('.')).on('error', errorHandler('js:vendor', 'sourcemaps:write'))
        .pipe(gulp.dest('./dist/assets/js/'));
});

/* Icon tasks */
gulp.task('icons', ['icons:svgfont', 'icons:svgsprites', 'icons:sprites']);

gulp.task('icons:svgfont', function () {
    if (fs.existsSync('./src/icons/')) {
        var fontName = pkg.name + "-icons";

        return gulp.src('./src/icons/*.svg')
            .pipe($.iconfontCss({
                fontName: fontName,
                path: './src/scss/templates/icons.scss',
                targetPath: '../../../../src/scss/generated/icons.scss',
                fontPath: '../fonts/icons/'
            }))
            .pipe($.iconfont({
                fontName: fontName,
                normalize: true,
            }))
            .pipe(gulp.dest('./dist/assets/fonts/icons/'));
    }
});

gulp.task('icons:svgsprites', function () {
    if (fs.existsSync('./src/icons/')) {
        var svgSpriteOptions = {
            mode: {
                symbol: {
                    dest: "",
                    sprite: "svgsprites.svg",
                    render: {
                        scss: {
                            dest:'../../../../src/scss/generated/svgsprites.scss',
                            template: "./src/scss/templates/svgsprites.scss"
                        }
                    }
                }
            }
        };

        return gulp.src('./src/icons/*.svg')
            .pipe($.svgSprite(svgSpriteOptions))
            .pipe(gulp.dest("./dist/assets/img/sprites/"));
    }
});

gulp.task('icons:sprites', function () {
    if (fs.existsSync('./src/sprites/')) {
        var spriteData = gulp.src('./src/sprites/**/*.png').pipe($.spritesmith({
            imgPath: '../img/sprites/sprites.png',
            imgName: 'sprites.png',
            retinaImgPath: '../img/sprites/sprites@2x.png',
            retinaImgName: 'sprites@2x.png',
            retinaSrcFilter: ['./src/sprites/**/**@2x.png'],
            cssName: 'sprites.scss',
            cssTemplate: "./src/scss/templates/sprites.scss",
            padding: 1
        }));

        var imgStream = spriteData.img
            .pipe(gulp.dest('./dist/assets/img/sprites/'));

        var cssStream = spriteData.css
            .pipe(gulp.dest('./src/scss/generated'));

        return $.mergeStream(imgStream, cssStream);
    }
});

/* Browsersync Server */
gulp.task('browsersync', function () {
    browserSync.init({
        server: "./dist",
        notify: false,
        port: 3000,
        ghostMode: {
            clicks: false,
            forms: false,
            scroll: false
        }
    });
});

/* Watcher */
gulp.task('watch', function () {
    $.watch("./src/scss/**/*", function () {
        gulp.start('sass');
    });
    $.watch("./src/less/**/*", function () {
        gulp.start('less');
    });
    $.watch("./src/jade/**/*", function () {
        gulp.start('jade');
    });
    $.watch("./src/js/**/*", function () {
        gulp.start('js');
    });
    $.watch("./src/static/**/*", function () {
        gulp.start('copy:static');
    });
});

/* Copy tasks */
gulp.task('copy:static', function () {
    return gulp.src(['./src/static/**/*'])
        .pipe(gulp.dest('./dist/'));
});

gulp.task('copy:bower', function () {
    return gulp.src(['./bower_components/**/*'])
        .pipe(gulp.dest('./dist/bower_components'));
});

/* Other tasks */
gulp.task('reload', function () {
    browserSync.reload();
});

gulp.task('clean', function () {
    return $.del(['./dist/**/*', './tmp']);
});