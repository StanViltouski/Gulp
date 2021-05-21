const gulp = require('gulp'),
	  babel = require('gulp-babel'),
	  concat = require('gulp-concat'),
      sass = require('gulp-sass'),
      autoprefixer = require('gulp-autoprefixer'),
      cleanCSS = require('gulp-clean-css'),
      uglify = require('gulp-uglify'),
      del = require('del'),
      browserSync = require('browser-sync').create(),
      sourcemaps = require('gulp-sourcemaps');


function html() {
	return gulp.src(['./src/*.html']).pipe(gulp.dest('./dist'));
}

function styles() {
	return gulp.src('./src/assets/scss/main/*.scss')
				.pipe(sourcemaps.init())
				.pipe(concat('main.scss'))
				.pipe(autoprefixer({
					overrideBrowserslist:  ['> 0.1%'],
					cascade: false
				}))
				.pipe(sass())
				.pipe(cleanCSS({level: 2}))
				.pipe(sourcemaps.write('.'))
				.pipe(gulp.dest('./dist/assets/css'))
				.pipe(browserSync.stream());

}

function scripts() {
	return gulp.src([
				'node_modules/jquery/dist/jquery.min.js',
				'./src/assets/js/**/*.js',

			])
				.pipe(sourcemaps.init())
				.pipe(babel())
				.pipe(concat('main.js'))
				.pipe(uglify()) /*toplevel: true*/
				.pipe(sourcemaps.write('.'))
				.pipe(gulp.dest('./dist/assets/js'))
				.pipe(browserSync.stream());
}

function images() {
	return gulp.src(['./src/assets/img/**']).pipe(gulp.dest('./dist/assets/img'));
}

function fonts() {
	return gulp.src(['./src/assets/fonts/**']).pipe(gulp.dest('./dist/assets/fonts'));
}

function staticFiles() {
	return gulp.src(['./src/static/**']).pipe(gulp.dest('./dist'));
}

function watch() {
	browserSync.init({
        server: {
            baseDir: "./dist"
        },
        //tunnel: true
    });
    //gulp.watch('./src/assets/img/**', images_change);
	gulp.watch('./src/assets/scss/**/*.scss', styles);
	gulp.watch('./src/assets/js/**/*.js', scripts);
	gulp.watch('./src/*.html', html).on("change", browserSync.reload);
}


function clear() {
	return del(['dist']);
}


/*=== Tasks ===*/

gulp.task('build', gulp.series(clear,
	gulp.parallel(html, staticFiles, images, fonts, styles, scripts)
));

gulp.task('dev', gulp.series('build', watch));

gulp.task('clear', clear);