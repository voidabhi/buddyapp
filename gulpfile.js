
var gulp = require('gulp'),
    runsequence = require('run-sequence'),
    jshint = require('gulp-jshint');


gulp.task('default', function () {
    runsequence('lint');
});

gulp.task('lint', function () {
    gulp.src('**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});
