const { src, dest, parallel } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const autoprefixer = require('gulp-autoprefixer')
const sourcemaps = require('gulp-sourcemaps')
const concat = require('gulp-concat')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')

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

const imageHandler = function() {
  return src(Path.dev.images)
    .pipe(dest(Path.build.images))
}
exports.imageHandler = imageHandler

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

const defTask = parallel(cssHandler, sassHandler, jsHandler, imageHandler, fontHandler, iconsHandler, mediaHandler)
exports.default = defTask
