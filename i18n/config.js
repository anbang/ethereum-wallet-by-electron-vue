const { youdao, baidu, google } = require('translation.js');

var through = require('through2'),
    gutil = require('gulp-util');
PluginError = gutil.PluginError;

// 常量
const PLUGIN_NAME = 'gulp-i18n';

/**
 * 转换json的语言
 * @param from 翻译源语言
 * @param to  译文语言
 * @returns {*}
 */
function i18n(from,to){
    // 创建一个 stream 通道，以让每个文件通过
    var stream = through.obj(function(file, enc, cb) {
        // console.log(JSON.stringify(file))
        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
            return cb();
        }
        if (file.isBuffer()) {
            var json= JSON.parse(file.contents.toString());
            var tJson='';
            //  获取json文件要翻译的数据
            for(var v in json){
                if(json[v] instanceof  Object){
                    tJson=getText(json[v],tJson);
                }
                else {
                    tJson += json[v]+"\n";
                }
            }
            if(tJson.length >2000)
                this.emit('error', new PluginError(PLUGIN_NAME, '源文件 大于 2000字'));
            //谷歌翻译
            google.translate({
                text: tJson,
                from: from,
                to: to
            }).then(result => {
                // console.log("to:"+to,result.result,result) // result 的数据结构见下文

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
                var content=file.contents.toString().replace(/(:\s*")(\S+)(")/gi, function (match, p1, p2, p3, offset, string) {
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
                    for(var i=0;i<result.raw.sentences.length;i++){
                        // console.log(result.raw.sentences[i].orig == p2, , match, p2)
                        var sourcesStr=result.raw.sentences[i].orig.replace("\n",'');
                        var targetStr=result.raw.sentences[i].trans.replace("\n",'');
                        if(sourcesStr== p2){
                            return ':"'+targetStr+'"'
                        }

                    }
                    return match
                })

                file.contents=new Buffer(content);
                // 确保文件进入下一个 gulp 插件
                this.push(file);
                // 告诉 stream 引擎，我们已经处理完了这个文件
                cb();

            })
        }
    });
    // 返回文件 stream
    return stream;
}

/**
 * 获取要翻译的数据
 * @param src
 * @param dst
 * @returns {*}
 */
function getText(src,dst){
    for(var k in src){
        if(src[k] instanceof Object){
            dst = getText(src[k],dst);
        }
        else {
            dst += src[k] + "\n";
        }
    }
    return dst;
}

module.exports= i18n;