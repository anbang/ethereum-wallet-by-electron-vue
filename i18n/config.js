const { youdao, baidu, google } = require('translation.js');

var through = require('through2'),
    gutil = require('gulp-util');
PluginError = gutil.PluginError;

// Constants, error prompts for use
const PLUGIN_NAME = 'gulp-i18n';

/**
 * Convert json language
 * @param from Translate source data
 * @param to  Translation language
 * @returns {*}
 */
function i18n(from, to) {
    // Create a stream channel to allow each file to pass
    var stream = through.obj(function (file, enc, cb) {
        // console.log(JSON.stringify(file))
        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
            return cb();
        }
        if (file.isBuffer()) {
            var json = JSON.parse(file.contents.toString());
            var tJson = '';
            //  Get the data to be translated in the json file
            for (var v in json) {
                if (json[v] instanceof Object) {
                    tJson = getText(json[v], tJson);
                }
                else {
                    tJson += json[v] + "\n";
                }
            }
            if (tJson.length > 2000)
                this.emit('error', new PluginError(PLUGIN_NAME, 'Source file is greater than 2000 words'));
            //Google Translate
            google.translate({
                text: tJson,
                from: from,
                to: to
            }).then(result => {
                // console.log("to:"+to,result.result,result) // The data structure of result is shown below

                /*
                * esult.result = [ 'Nastavení',
                    'CZR',
                    'Domů',
                    'Přenos',
                    'Kontakty',
                    'Nastavení',
                    'Celkem',
                    'Nastavení' ]
                * */
                // var result=result;
                // console.log("内容是",file.contents.toString())
                var content = file.contents.toString().replace(/(:\s*")(\S+)(")/gi, function (match, p1, p2, p3, offset, string) {
                    /*              console.log(
                    // result.raw.sentences,
                                      "【match=>"+match+"】",
                                      "【p1=>"+p1+"】",
                                      "【p2=>"+p2+"】",
                                      "【p3=>"+p3+"】",
                                      "【offset=>"+offset+"】",
                                      "【string=>"+string+"】",
                                      )*/

                    /*
                    result.raw.sentences :[
                        { trans: 'Setting\n', orig: 'Setting\n', backend: 3 },
                        { trans: 'CZR\n', orig: 'CZR\n', backend: 3 },
                        { trans: 'Home\n', orig: '首页\n', backend: 3 },
                        { trans: 'Transfer\n', orig: '转账\n', backend: 3 },
                        { trans: 'Contacts\n', orig: '联系人\n', backend: 3 },
                        { trans: 'Settings\n', orig: '设置\n', backend: 3 },
                        { trans: 'total\n', orig: '合计\n', backend: 2 },
                        { trans: 'Settings', orig: '设置', backend: 3 } ] '

                          【match=>:"设置"】'
                          '【p1=>:"】'
                          '【p2=>设置】'
                          '【p3=>"】'
                          '【offset=>270】'
                          '【string=>{\n    "lang": {\n        "browse": "Setting"\n    },\n    "unit":{\n        "czr":"CZR"\n    },\n    "model_header":{\n        "home":"首页",\n        "transfer":"转账",\n        "contacts":"联系人",\n        "setting":"设置",\n        "total":"合计"\n    },\n    "page_setting":{\n        "tit":"设置"\n    }\n}】'



                     */
                    for (var i = 0; i < result.raw.sentences.length; i++) {
                        // console.log(result.raw.sentences[i].orig == p2, , match, p2)
                        var sourcesStr = result.raw.sentences[i].orig.replace("\n", '');
                        var targetStr = result.raw.sentences[i].trans.replace("\n", '');
                        if (sourcesStr == p2) {
                            return ':"' + targetStr + '"'
                        }

                    }
                    return match
                })

                file.contents = new Buffer(content);
                // Make sure the file goes to the next gulp plugin 
                this.push(file);
                // Tell the stream engine that we have finished processing this file
                cb();

            })
        }
    });
    // return stream file
    return stream;
}

/**
 * Get data to translate
 * @param src
 * @param dst
 * @returns {*}
 */
function getText(src, dst) {
    for (var k in src) {
        if (src[k] instanceof Object) {
            dst = getText(src[k], dst);
        }
        else {
            dst += src[k] + "\n";
        }
    }
    return dst;
}

module.exports = i18n;