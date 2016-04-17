var gulp = require('gulp');

var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');

gulp.task('refIndex', function(){
    browserify('public/javascripts/src/index.jsx')
        .transform(reactify)
        .bundle()
        .pipe(source('index.js'))
        .pipe(gulp.dest('public/javascripts/build/'));
});

gulp.task('watch', function() {
    // gulp.watch("public/javascripts/src/**/*.jsx", ["js", "login", "index", "chatroom"])
    // gulp.watch("public/javascripts/src/**/*.jsx", ["login", "index", "chatroom"])
    gulp.watch("public/javascripts/src/**/*.jsx", ["refIndex"])
})

gulp.task('default', ['watch']);