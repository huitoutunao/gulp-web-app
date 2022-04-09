const { src, dest } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const sourcemaps = require('gulp-sourcemaps')

const Path = {
  dev: {
    views: 'src/views/**/*',
    script: 'src/script/**/*.js',
    style: 'src/assets/style/',
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

const sassHandler = function() {
  return src(`${Path.dev.style}*.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(sourcemaps.write('./maps'))
    .pipe(dest(Path.build.style))
}

exports.default = sassHandler
