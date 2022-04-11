const { src, dest, parallel, series, watch } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const autoprefixer = require('gulp-autoprefixer')
const sourcemaps = require('gulp-sourcemaps')
const concat = require('gulp-concat')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const del = require('del')
const webserver = require('gulp-webserver')

// TODO: dist 文件夹下面分出 dev 和 build 分别代表开发和生产
const Path = {
  dev: {
    views: './src/views/**/*.html',
    script: './src/script/',
    style: './src/assets/style/',
    styleLib: './src/assets/style/lib/*.css',
    images: './src/assets/images/**',
    icons: './src/assets/icons/**',
    font: './src/assets/font/**',
    media: './src/assets/media/**',
  },
  build: {
    views: './dist/views/',
    script: './dist/script/',
    style: './dist/assets/style/',
    styleMaps: './dist/assets/maps/',
    images: './dist/assets/images/',
    icons: './dist/assets/icons/',
    font: './dist/assets/font/',
    media: './dist/assets/media/',
  },
}

const htmlHandler = function() {
  return src(Path.dev.views)
    .pipe(dest(Path.build.views))
}
exports.htmlHandler = htmlHandler

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
exports.sassHandler = sassHandler

const jsHandler = function() {
  return src(`${Path.dev.script}es6/*.js`)
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(dest(Path.build.script))
}
exports.jsHandler = jsHandler

const imagesHandler = function() {
  return src(Path.dev.images)
    .pipe(dest(Path.build.images))
}
exports.imagesHandler = imagesHandler

const fontHandler = function() {
  return src(Path.dev.font)
    .pipe(dest(Path.build.font))
}
exports.fontHandler = fontHandler

const iconsHandler = function() {
  return src(Path.dev.icons)
    .pipe(dest(Path.build.icons))
}
exports.iconsHandler = iconsHandler

const mediaHandler = function() {
  return src(Path.dev.media)
    .pipe(dest(Path.build.media))
}
exports.mediaHandler = mediaHandler

const delHandler = function() {
  return del(['./dist'])
}
exports.delHandler = delHandler

const webHandler = function() {
  const randomPort = parseInt(Math.random() * 1000 + 1000)
  return src('./dist')
  .pipe(webserver({
    host: 'localhost',
    port: randomPort,
    livereload: true,
    open: './views/index.html',
  }))
}
exports.webHandler = webHandler

const watchHandler = function() {
  watch(`${Path.dev.views}`, htmlHandler)
  watch(`${Path.dev.styleLib}`, cssHandler)
  watch(`${Path.dev.style}**/*.scss`, sassHandler)
  watch(`${Path.dev.script}**/*.js`, jsHandler)
}

const defTask = series(
  delHandler,
  parallel(htmlHandler, cssHandler, sassHandler, jsHandler, imagesHandler, fontHandler, iconsHandler, mediaHandler),
  parallel(webHandler, watchHandler)
)
exports.default = defTask
