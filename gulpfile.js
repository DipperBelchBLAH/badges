'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var streamify = require('gulp-streamify');
var ghPages = require('gulp-gh-pages');

var path = {
    HTML: 'src/index.html',
    PAGE404: '404.html',
    CSS: 'css/**',
    IMG: 'img/**',
    DATA: 'src/data/**',
    MINIFIED_OUT: 'build.min.js',
    OUT: 'build.js',
    DEST: 'dist',
    DEST_CSS: 'dist/css',
    DEST_IMG: 'dist/img',
    DEST_DATA: 'dist/src/data',
    DEST_BUILD: 'dist/build',
    DEST_SRC: 'dist/src',
    ENTRY_POINT: './src/js/app.js'
};

gulp.task('copy', function () {
    gulp.src(path.PAGE404)
        .pipe(gulp.dest(path.DEST));
    gulp.src(path.CSS)
        .pipe(gulp.dest(path.DEST_CSS));
    gulp.src(path.IMG)
        .pipe(gulp.dest(path.DEST_IMG));
    gulp.src(path.DATA)
        .pipe(gulp.dest(path.DEST_DATA));
    gulp.src('apple-touch-icon-precomposed.png')
        .pipe(gulp.dest(path.DEST));
    gulp.src('favicon.ico')
        .pipe(gulp.dest(path.DEST));
    gulp.src('.travis.yml')
        .pipe(gulp.dest(path.DEST));
    gulp.src('.htaccess')
        .pipe(gulp.dest(path.DEST));
    gulp.src('gulpfile.js')
        .pipe(gulp.dest(path.DEST));
    gulp.src('package.json')
        .pipe(gulp.dest(path.DEST));
    gulp.src('*.txt')
        .pipe(gulp.dest(path.DEST));
});

gulp.task('watch', function () {
    gulp.src(path.HTML)
        .pipe(gulp.dest(path.DEST));
    
    gulp.watch([path.HTML, path.CSS, path.DATA, path.IMG], ['copy']);
    
    gulp.src(path.HTML)
        .pipe(gulp.dest(path.DEST));

    var watcher  = watchify(browserify({
        entries: [path.ENTRY_POINT],
        transform: [reactify],
        debug: true,
        cache: {},
        packageCache: {},
        fullPaths: true
    }));

    return watcher.on('update', function () {
        watcher.bundle()
            .pipe(source(path.OUT))
            .pipe(gulp.dest(path.DEST_SRC))
        console.log('Updated');
    })
        .bundle()
        .pipe(source(path.OUT))
        .pipe(gulp.dest(path.DEST_SRC));
});

gulp.task('build', function(){
    browserify({
        entries: [path.ENTRY_POINT],
        transform: [reactify],
    })
        .bundle()
        .pipe(source(path.MINIFIED_OUT))
        .pipe(streamify(uglify({file:path.MINIFIED_OUT})))
        .pipe(gulp.dest(path.DEST_BUILD));
});

gulp.task('replaceHTML', function(){
    gulp.src(path.HTML)
        .pipe(htmlreplace({js: 'build/' + path.MINIFIED_OUT}))
        .pipe(gulp.dest(path.DEST));
});

gulp.task('pages', function () {
    gulp.src('*.md')
        .pipe(gulp.dest(path.DEST));
    return gulp.src('./dist/**/*')
        .pipe(ghPages());
});

gulp.task('production', ['copy' , 'replaceHTML', 'build']);

gulp.task('ci', ['production']);

gulp.task('default', ['watch']);

gulp.task('deploy', ['production', 'pages']);