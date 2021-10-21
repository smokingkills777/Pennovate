const {src, dest, parallel, series, watch} = require('gulp');

const browserSync = require('browser-sync').create();

function browsersync () {
    browserSync.init({
        server: {baseDir: 'app/'},
        notify: false,
        online: true
    })
}

exports.browsersync = browsersync;

let preprocessor = 'sass';

function startwatch() {
    watch('app/**/' + preprocessor + '/**/*', styles);
    watch('app/**/*.html').on('change', browserSync.reload);
}

const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const concat = require('gulp-concat');

function styles() {
	return src('app/' + preprocessor + '/main.' + 'scss' + '') // Выбираем источник: "app/sass/main.sass" или "app/less/main.less"
	.pipe(eval(preprocessor)()) // Преобразуем значение переменной "preprocessor" в функцию
	.pipe(concat('app.min.css')) // Конкатенируем в файл app.min.js
	.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true })) // Создадим префиксы с помощью Autoprefixer
	.pipe(cleancss( { level: { 1: { specialComments: 0 } }/* , format: 'beautify' */ } )) // Минифицируем стили
    .pipe(dest('app/css/')) // Выгрузим результат в папку "app/css/"
	.pipe(browserSync.stream()) // Сделаем инъекцию в браузер
}

exports.styles = styles;

exports.default = parallel(styles, browsersync, startwatch);