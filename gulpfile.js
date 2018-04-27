/**
 *  Translate Chinese json files into other language json files
 *  language : https://cloud.google.com/translate/docs/languages
 */
const gulp = require('gulp'),
    i18n = require('./i18n/config'),
    // languges = require('./i18n/languges'),
    languges = require('./i18n/languges_conf'),
    rename = require('gulp-rename');
// The task of translating files
gulp.task('default', function () {
    for (const languge in languges) {
        // console.log(languge,languges[languge])
        gulp.src('./i18n/tap-i18n.json')
            .pipe(
                // The specific logic of translation
                i18n('', languge)
            )
            .pipe(rename({
                dirname: "i18n",
                basename: languge,
                extname: ".json"
            }))
            //  Post-translation file output file path
            .pipe(gulp.dest('./src/renderer/'));
    }
});

gulp.task('watch', function () {
    gulp.watch('i18n/tap-i18n.json', ['default']);
})
