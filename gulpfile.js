const { src, dest } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const autoprefixer = require('gulp-autoprefixer')
const sourcemaps = require('gulp-sourcemaps')
const concat = require('gulp-concat')

const Path = {
  dev: {
    views: 'src/views/**/*.html',
    script: 'src/script/**/*.js',
    style: 'src/assets/style/',
    styleLib: 'src/assets/style/lib/*.css',
    images: 'src/assets/images/',
    icons: 'src/assets/icons/',
    font: 'src/assets/font/',
    media: 'src/assets/media/',
  },
  build: {
    views: 'dist/views/',
    script: 'dist/script/',
    style: 'dist/assets/style/',
    styleMaps: 'dist/assets/maps/',
  },
}

const cssHandler = function() {
  return src(Path.dev.styleLib)
    .pipe(concat('vendors.css'))
    .pipe(dest(Path.build.style))
}
exports.cssHandler = cssHandler

const sassHandler = function() {
  return src(`${Path.dev.style}index.scss`)
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(sourcemaps.write('./maps'))
    .pipe(dest(Path.build.style))
}

exports.default = sassHandler
