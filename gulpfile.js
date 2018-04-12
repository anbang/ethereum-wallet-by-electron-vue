/**
 *  将中文json文件翻译为其他语言json文件
 *  支持语言：https://cloud.google.com/translate/docs/languages
 */
const gulp = require('gulp'),
    i18n = require('./i18n/config'),
    languges = require('./i18n/languges'),
    rename = require('gulp-rename') ;
// 翻译文件的任务
gulp.task('default',function() {
	for(const languge in languges){
        gulp.src('./i18n/tap-i18n.json')
            .pipe(
                // 翻译的具体逻辑
                i18n('',languges[languge])
            )
            .pipe(rename({
                dirname: "i18n",
                basename: languges[languge],
                extname: ".json"
            }))
            //  翻译之后的文件输出的文件路径
            .pipe(gulp.dest('./src/renderer/'));
    }
});