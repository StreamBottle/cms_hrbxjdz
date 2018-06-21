var dbopt = require('../../modules/dbopt');
var Commfun = require('../../modules/commfun.js');
var smtemplate = require('../../modules/sitemanage/template.js');
var $ = require('jquery');
var fs = require('fs');
var format = require('util').format;
var ObjectID = require('mongodb').ObjectID;

function SMUpload(smupload) {}

module.exports = SMUpload;

//文件上传---开始
SMUpload.allUpload = function (app, req, res, callback) {
    var action = req.param('action');
    if (action === "EditorFile"){
        EditorFile(app, req, res, function(){

        });
    }else if (action === "UploadLogo"){
        UploadLogo(app, req, res, function(){

        });
    }else if (action === "UploadResource"){
        ResourceFile(app, req, res, function(){

        });
    }else{
        UpLoadFile(app, req, res);
    }
}
function UploadLogo(app, req, res, callback){
    var fp = __dirname+"/../../public/";
    for (var i in req.files) {
            fs.renameSync(req.files[i].path, fp + req.files[i].name);
            res.send("/" + req.files[i].name);
    }
}
function ResourceFile(app, req, res, callback){
    var path = req.param('path');
    var key = req.param('key');
    var type = req.param('type');
    var fp = "";
    if (type === "1"){
        fp = __dirname+"/../../views/"+key+"/";
    }else if(type === "2"){
        fp = __dirname+"/../../public/"+key+"/";
    }else{
        fp = __dirname+"/../../public/"+key+path+"/";
    }
    for (var i in req.files) {
//        fs.exists(fp, function(exists){
//            if (exists){
//                fs.rename(req.files[i].path, fp + req.files[i].name, function (err) {
//                    if (err) res.send(0);
//                    res.send(1)
//                });
//            }else{
//                var par = target_path.split("/");
//                var pt = par[0];
//                for (j=1; j<par.length; j++){
//                    pt =pt + "/" + par[j];
//                    if (!fs.existsSync(pt)){
//                        fs.mkdirSync(pt);
//                    }
//                }
//                fs.rename(req.files[i].path, fp + req.files[i].name, function (err) {
//                    if (err) res.send(0);
//                    res.send(1)
//                });
//            }
//        });
//        if (fs.existsSync(fp)) {
            fs.renameSync(req.files[i].path, fp + req.files[i].name);
//            res.send("1");
//        }else{
//            var par = fp.split("/");
//            var pt = par[0];
//            for (j=1; j<par.length; j++){
//                pt =pt + "/" + par[j];
//                if (!fs.existsSync(pt)){
//                    fs.mkdirSync(pt);
//                }
//            }
//            fs.renameSync(req.files[i].path, target_path + target_file);
//            res.send("1");
//        }
    }
}
function UpLoadFile(app, req, res, callback){
    var msg = "";
    for (var i in req.files) {
        if (req.files[i].size == 0){
            // 使用同步方式删除一个文件
            fs.unlinkSync(req.files[i].path);
        } else {
            var datepath = new Date().Format("yyyy/MM/dd/");
            var target_url = '/'+app.get('CFG')['CONST']['SYSTEM']['UPATH']+'/' + datepath;
            var target_path = __dirname+'/../../public' + target_url;
            var spar = req.files[i].path.split(".");
            var target_file = new Date().Format("hhmmssS") +"."+ spar[1];
            target_url = target_url + target_file;
            if (fs.existsSync(target_path)) {
                fs.renameSync(req.files[i].path, target_path + target_file);
                res.send(target_url);
//                res.json({"status": 1, "msg": "", "name": target_file,
//                    "path": target_url,"size": req.files[i].size, "ext": spar[1]});
            }else{
                var par = target_path.split("/");
                var pt = par[0];
                for (j=1; j<par.length; j++){
                    pt =pt + "/" + par[j];
                    if (!fs.existsSync(pt)){
                        fs.mkdirSync(pt);
                    }
                }
                fs.renameSync(req.files[i].path, target_path + target_file);
                res.send(target_url);
//                res.json({"status": 1, "msg": "", "name": target_file,
//                    "path": target_url,"size": req.files[i].size, "ext": spar[1]});
            }
        }
    }
}
//文件上传---结束
//文件管理---开始
SMUpload.getFileManage = function (app, req, res, callback) {
    var key = req.param('ukey');
    Commfun.getRes(app, req, res, function(LNG){
        var k = {'key': key};
        var folers = [];
        var maxid = Commfun.getAllFolers(__dirname+"/../../public/"+key, 2, 2, folers);
        var files = Commfun.getAllFiles(__dirname+"/../../views/"+key);
        dbopt.get(smtemplate.NAME, k, function (err, obj) {
            var tgs = "";
            for (i=0; i<folers.length; i++){
                tgs += '<tr class="treegrid-'+folers[i].sid+' treegrid-parent-'+folers[i].pid+'"><td class="treegrid_td">'+folers[i].name+'</td></tr>';
            }
            var tmpJSON = $.extend({smto:obj,tgs:tgs,maxid:maxid}, app.get('CFG'), app.get('RESI18N')[LNG]);
            res.render('sitemanage/fmpanel', tmpJSON);
        });
    });
}
SMUpload.postFileList = function (app, req, res, callback) {
    var key = req.body.key;
    var path = req.body.path;
    Commfun.getRes(app, req, res, function(LNG){
        var files =[];
        if (path === "1"){
            files = Commfun.getAllFiles(__dirname+"/../../views/"+key);
        }else if(path === "2"){
            files = Commfun.getAllFiles(__dirname+"/../../public/"+key);
        }else{
            files = Commfun.getAllFiles(__dirname+"/../../public/"+key+path);
        }
        res.json({'success': true, 'files': files, 'isRedirect': false,'tip': ''});
    });
}
SMUpload.postCreateDir = function(app, req, res, callback){
    Commfun.getRes(app, req, res, function(LNG) {
        var name = req.body.name;
        var parentpath = req.body.parentpath;
        var templatekey = req.body.templatekey;
        var url = "";
        var success = true;
        if (parentpath === "1"){
            if (fs.existsSync(__dirname+"/../../views/"+templatekey+"/"+name)){
                success = false;
            }else{
                fs.mkdirSync(__dirname+"/../../views/"+templatekey+"/"+name);
                url = "/"+name;
            }
        }else if(parentpath === "2"){
            if (fs.existsSync(__dirname+"/../../public/"+templatekey+"/"+name)){
                success = false;
            }else{
                fs.mkdirSync("./public/"+templatekey+"/"+name);
                url = "/"+name;
            }
        }else{
            if (fs.existsSync(__dirname+"/../../public/"+templatekey+parentpath+"/"+name)){
                success = false;
            }else{
                fs.mkdirSync(__dirname+"/../../public/"+templatekey+parentpath+"/"+name);
                url = parentpath+"/"+name;
            }
        }
        res.json({'success': success, 'url': url, 'isRedirect': false,'tip': format(app.get('RESI18N')[LNG]['COMMON']['TIP']['EXIST'], name)});
    });
}
SMUpload.postRenameDir = function(app, req, res, callback){
    Commfun.getRes(app, req, res, function(LNG) {
        var name = req.body.name;
        var oldname = req.body.oldname;
        var parentpath = req.body.parentpath;
        var templatekey = req.body.templatekey;
        var url = parentpath.replace(oldname, name);
        var tnn = __dirname+"/../../public/"+templatekey + parentpath.replace(oldname, name);
        var tno = __dirname+"/../../public/"+templatekey + parentpath;
        var success = true;
        if (fs.existsSync(tnn)){
            success = false;
        }else{
            fs.renameSync(tno, tnn);
        }
        res.json({'success': success, 'url': url, 'isRedirect': false,'tip': format(app.get('RESI18N')[LNG]['COMMON']['TIP']['EXIST'], name)});
    });
}
SMUpload.postDeleteDir = function(app, req, res, callback){
    Commfun.getRes(app, req, res, function(LNG) {
        var path = req.body.path;
        var key = req.body.key;
            if (path === "1"){
                Commfun.deleteFolderRecursive(__dirname+"/../../views/"+key);
            }else if(path === "2"){
                Commfun.deleteFolderRecursive(__dirname+"/../../public/"+key);
            }else{
                Commfun.deleteFolderRecursive(__dirname+"/../../public/"+key+path);
            }
        res.json({'success': true, 'url': "", 'isRedirect': false,'tip': ''});
    });
}
SMUpload.postCreateFile = function(app, req, res, callback){
    Commfun.getRes(app, req, res, function(LNG) {
        var name = req.body.name;
        var content = req.body.content;
        var key = req.body.key;
        var path = req.body.path;
        var optf = req.body.optf;
        var fn = "";
        if (path === "1"){
            fn = __dirname+"/../../views/"+key+"/"+name;
        }else if(path === "2"){
            fn = __dirname+"/../../public/"+key+"/"+name;
        }else{
            fn = __dirname+"/../../public/"+key+path+"/"+name;
        }
        var success = true;
        var tip = "";
        if (optf === "1"){
            if (fs.existsSync(fn)){
                success = false;
                tip = format(app.get('RESI18N')[LNG]['COMMON']['TIP']['EXIST'], name);
            }else{
                fs.writeFileSync(fn, content);
            }
        }
        if (optf === "2"){
            if (fs.existsSync(fn)){
                fs.writeFileSync(fn, content);
            }else{
                success = false;
                tip = format(app.get('RESI18N')[LNG]['COMMON']['TIP']['NOEXIST'], name);
            }
        }
        res.json({'success': success, 'url': '', 'isRedirect': false,'tip': tip});
    });
}
SMUpload.postDeleteFile = function(app, req, res, callback){
    Commfun.getRes(app, req, res, function(LNG) {
        var name = req.body.name;
        var path = req.body.path;
        var templatekey = req.body.templatekey;
        var templatetype = req.body.templatetype;
        var fn;
        if (templatetype === "1"){
            fn = __dirname+"/../../views/"+templatekey+path+"/"+name;
        }else{
            fn = __dirname+"/../../public/"+templatekey+path+"/"+name;
        }
        var success = true;
        if (fs.existsSync(fn)){
            fs.unlinkSync(fn);
        }else{
            success = false;
        }
        res.json({'success': success, 'url': '', 'isRedirect': false,'tip': format(app.get('RESI18N')[LNG]['COMMON']['TIP']['NOEXIST'], name)});
    });
}
SMUpload.postReadFile = function(app, req, res, callback){
    Commfun.getRes(app, req, res, function(LNG) {
        var name = req.body.name;
        var key = req.body.key;
        var type = req.body.type;
        var path = req.body.path;
        var fn = "";
        if (type === "1"){
            fn = __dirname+"/../../views/"+key+"/"+name;
        }else if(type === "2"){
            fn = __dirname+"/../../public/"+key+"/"+name;
        }else{
            fn = __dirname+"/../../public/"+key+path+"/"+name;
        }
        var success = true;
        var tip = "";
        var content = "";
            if (fs.existsSync(fn)){
                content = fs.readFileSync(fn,{encoding:'utf8'});
            }else{
                success = false;
                tip = format(app.get('RESI18N')[LNG]['COMMON']['TIP']['NOEXIST'], name);
            }

        res.json({'success': success, 'url': content, 'isRedirect': false,'tip': tip});
    });
}
//文件管理---结束