const {
  src, dest, parallel, series, watch,
} = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const autoprefixer = require('gulp-autoprefixer')
const sourcemaps = require('gulp-sourcemaps')
const concat = require('gulp-concat')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const del = require('del')
const webserver = require('gulp-webserver')
const fileinclude = require('gulp-file-include')
const eslint = require('gulp-eslint-new')
const cssLint = require('gulp-stylelint')
const cache = require('gulp-cached')

// TODO: dist 文件夹下面分出 dev 和 build 分别代表开发和生产
// TODO: 启动多个服务需求，将 gulp-webserver 替换成 gulp-connect
const Path = {
  dev: {
    views: './src/views/**/*.html',
    components: './src/components/',
    style: './src/assets/style/',
    styleLib: './src/assets/style/lib/*.css',
    script: './src/script/',
    scriptLib: './src/script/lib/*.js',
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

const htmlHandler = function () {
  return src(Path.dev.views)
    .pipe(fileinclude({
      prefix: '@@',
      basepath: Path.dev.components,
      context: {
        isLoadCustomStyle: false,
        isLoadDefaultScript: true,
        isLoadCustomScript: false,
      },
    }))
    .pipe(dest(Path.build.views))
}
exports.htmlHandler = htmlHandler

// 处理插件样式
const styleLibHandler = function () {
  return src(Path.dev.styleLib)
    .pipe(concat('vendors.css'))
    .pipe(dest(Path.build.style))
}
exports.styleLibHandler = styleLibHandler

const cssLintHandler = function () {
  return src(`${Path.dev.style}**/*.scss`)
    .pipe(cache('cssLinting'))
    .pipe(cssLint({
      reporters: [{
        formatter: 'string',
        console: true,
      }],
    }))
}
exports.cssLintHandler = cssLintHandler

const sassHandler = series(cssLintHandler, () => src(`${Path.dev.style}index.scss`)
  .pipe(sourcemaps.init())
  .pipe(autoprefixer())
  .pipe(sass({
    outputStyle: 'compressed',
  }).on('error', sass.logError))
  .pipe(sourcemaps.write('./maps'))
  .pipe(dest(Path.build.style)))
exports.sassHandler = sassHandler

const eslintHandler = function () {
  return src(`${Path.dev.script}es6/*.js`)
    .pipe(cache('jsLinting'))
    .pipe(eslint({
      fix: true,
    }))
    .pipe(eslint.fix())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
}
exports.eslintHandler = eslintHandler

const esHandler = function () {
  return src(`${Path.dev.script}es6/*.js`)
    .pipe(babel({
      presets: ['@babel/env'],
    }))
    .pipe(uglify())
    .pipe(dest(Path.build.script))
}

const moveJsHandler = function () {
  return src(`${Path.dev.script}*.js`)
    .pipe(dest(Path.build.script))
}

const jsHandler = series(eslintHandler, parallel(esHandler, moveJsHandler))

const jsLibHandler = function () {
  return src(Path.dev.scriptLib)
    .pipe(concat('vendors.js'))
    .pipe(uglify())
    .pipe(dest(Path.build.script))
}
exports.jsLibHandler = jsLibHandler

const imagesHandler = function () {
  return src(Path.dev.images)
    .pipe(dest(Path.build.images))
}
exports.imagesHandler = imagesHandler

const fontHandler = function () {
  return src(Path.dev.font)
    .pipe(dest(Path.build.font))
}
exports.fontHandler = fontHandler

const iconsHandler = function () {
  return src(Path.dev.icons)
    .pipe(dest(Path.build.icons))
}
exports.iconsHandler = iconsHandler

const mediaHandler = function () {
  return src(Path.dev.media)
    .pipe(dest(Path.build.media))
}
exports.mediaHandler = mediaHandler

const delHandler = function () {
  return del(['./dist'])
}
exports.delHandler = delHandler

const webHandler = function () {
  const randomPort = parseInt(Math.random() * 1000 + 3000, 10)
  return src('./dist')
    .pipe(webserver({
      host: 'localhost',
      port: randomPort,
      livereload: true,
      open: './views/',
    }))
}
exports.webHandler = webHandler

const watchHandler = function () {
  watch([`${Path.dev.views}`, `${Path.dev.components}**/*.html`], htmlHandler)
  watch(`${Path.dev.styleLib}`, styleLibHandler)
  watch(`${Path.dev.style}**/*.scss`, sassHandler)
  watch(`${Path.dev.script}es6/*.js`, jsHandler)
  watch(`${Path.dev.scriptLib}`, jsLibHandler)
  watch(`${Path.dev.images}`, imagesHandler)
  watch(`${Path.dev.font}`, fontHandler)
  watch(`${Path.dev.icons}`, iconsHandler)
  watch(`${Path.dev.media}`, mediaHandler)
}

const defTask = series(
  delHandler,
  parallel(
    htmlHandler,
    styleLibHandler,
    sassHandler,
    jsHandler,
    jsLibHandler,
    imagesHandler,
    fontHandler,
    iconsHandler,
    mediaHandler,
  ),
  parallel(
    webHandler,
    watchHandler,
  ),
)
exports.default = defTask
