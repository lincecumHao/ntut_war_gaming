var gulp = require('gulp');

var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');

gulp.task('js', function(){
    browserify('public/javascripts/src/app.jsx')
        .transform(reactify)
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('public/javascripts/build/'));
});

gulp.task('login', function(){
    browserify('public/javascripts/src/Login/Login.jsx')
        .transform(reactify)
        .bundle()
        .pipe(source('Login.js'))
        .pipe(gulp.dest('public/javascripts/build/Login/'));
});

gulp.task('index', function(){
    browserify('public/javascripts/src/Index/index.jsx')
        .transform(reactify)
        .bundle()
        .pipe(source('index.js'))
        .pipe(gulp.dest('public/javascripts/build/Index/'));
});

gulp.task('watch', function() {
    gulp.watch("public/javascripts/src/**/*.jsx", ["js", "login", "index"])
})

gulp.task('default', ['watch']);