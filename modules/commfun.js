var $ = require('jquery');
var dbopt = require('./dbopt');
var fs = require('fs');
var smchannel = require('./sitemanage/channel.js');

function Commfun(p){}
module.exports = Commfun;

Commfun.getRes = function(app, req, res, callback){
    var LNG = 'zh';
    var i18nArr  = req.acceptedLanguages;
    for (i = 0; i < i18nArr.length; i++) {
        if (LNG != i18nArr[i]){
            if ($.inArray(i18nArr[i], app.get('INRES'))!=-1)  {
                LNG = i18nArr[i];
                callback(LNG);
                return;
            }
        }else{
            callback(LNG);
            return;
        }
    }
    callback(LNG);
}

Commfun.getChannelList = function (app, req, res, p, callback) {
    var q = {'key':{$nin:['ROOT','SINGLE']}};
    if (p){
        q = {'hassub':0,'key':{$nin:['ROOT','SINGLE']}};
    }
    var fileds = {"name":true,"key":true};
    var options = {"sort": "sortid"}
    Commfun.getRes(app, req, res, function(LNG){
        dbopt.getAllEx(smchannel.NAME, q, fileds, options, function(err, obj, total){
            var tmpJSON;
            if(err){
                callback(err);
            }else{
                if (p){
                    tmpJSON = obj;
                }else{
                    var tj = [{'name': app.get('RESI18N')[LNG]['CHANNEL']['LABEL']['ROOT'], 'key':"ROOT"},
                        {'name': app.get('RESI18N')[LNG]['CHANNEL']['LABEL']['SINGLE'], 'key':"SINGLE"}];
                    tmpJSON = tj.concat(obj);
                }
                callback(null, tmpJSON);
            }
        });
    });
}

Commfun.getAllFolers = function(path, pid, sid, folers) {
    var files = fs.readdirSync(path);
    files.forEach(function(item) {
        var tmpPath = path + '/' + item;
        stat = fs.lstatSync(tmpPath)
        if (stat === undefined) return;
        if (stat.isDirectory()) {
            sid++;
            var fi = {name:item, pid:pid, sid: sid};
            folers.push(fi);
            sid = Commfun.getAllFolers(tmpPath, sid, sid, folers);
        }
    });
    return sid;
}
Commfun.getAllFiles = function(path) {
    var result = [], files = fs.readdirSync(path);
    files.forEach(function(file) {
        var pathname = path+ "/" + file
            , stat = fs.lstatSync(pathname);
        if (stat === undefined) return;
        if (stat.isFile()) {
            result.push(file);
        }
    });
    return result;
}
Commfun.deleteFolderRecursive = function(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                Commfun.deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
//调用： var time1 = new Date().Format("yyyy-MM-dd");var time2 = new Date().Format("yyyy-MM-dd HH:mm:ss");