var crypto = require('crypto');
var dbopt = require('../../modules/dbopt');
var Commfun = require('../../modules/commfun.js');
var $ = require('jquery');
var article = require('../../modules/sitemanage/article.js');
var format = require('util').format;
var ObjectID = require('mongodb').ObjectID;
var exec = require('child_process').exec;

function SMArticle(smarticle) {}

module.exports = SMArticle;
//登录---开始

//模板管理---开始
SMArticle.getArticle = function (app, req, res, callback) {
    Commfun.getRes(app, req, res, function(LNG){
        Commfun.getChannelList(app, req, res, true, function(err, obj) {
            var ac = "";
            if (req.param("achannel")){ac = req.param("achannel");}else{ac = "";}
            var cl = new Array();
            for (i=0; i<obj.length; i++){
                if ($.inArray("SANPO_"+obj[i].key, req.session.power) != -1){
                   cl.push(obj[i]);
                }
            }
            if (obj) {
                var tmpJSON = $.extend({}, app.get('CFG'), app.get('RESI18N')[LNG],{"atype":cl, currentc:ac});
                res.render('sitemanage/articlec', tmpJSON);
            }
        });
    });
}
SMArticle.getArticleListSkip = function (app, req, res, callback) {
    Commfun.getRes(app, req, res, function(LNG){
        var q = req.query.q?{'achannel':req.query.achannel,'title':{ $regex: decodeURIComponent(req.query.q), $options: 'i' }}:{'achannel':req.query.achannel};
        var s = {"sort": {"atime":-1}};
        dbopt.getSkip(article.NAME, q, s, req.query.pn, req.query.pc, function(err, obj, total){
            if(err){
                res.json({'success':false,'tip':err});
            }else{
                var pos = ((parseInt(req.query.pn) - 1)* req.query.pc);
                var pc = req.query.pn * req.query.pc > total?total-pos:req.query.pc;
                var poe = parseInt(pos) + parseInt(pc);
                var ps = Math.ceil(parseInt(total) / parseInt(req.query.pc));
                if (ps == 0){ps = 1;}
                var st = format(app.get('RESI18N')[LNG]['COMMON']['TITLE']['FOOTINFO'], ps, total, req.query.pn, pos+1, poe);
                var tj = {'smal': obj, 'total':total, 'pageNumber':req.query.pn, 'pageCount':pc, 'footinfo': st,
                    'pages':ps, 'pos':pos+1, 'poe':poe,'isFirstPage': (req.query.pn-1)==0, 'isLastPage':req.query.pn==ps};
                var tmpJSON = $.extend({}, app.get('CFG'), app.get('RESI18N')[LNG], tj);
                res.render('sitemanage/articlec_list', tmpJSON);
            }
        });
    });
}
SMArticle.getArticlePublish = function(app, req, res, callback){
    Commfun.getRes(app, req, res, function(LNG){
        var id = req.param('upage');
        var data = req.session.menu;
        var h = "";
        for (i=0; i < data.length; i++){
            h += '<li data-role="dropdown" class="dropdown active">';
            if (data[i].URL == undefined){
                h += '<a>'+data[i].LABEL+'</a>';
                h += '<ul class="sub-menu light sidebar-dropdown-menu close">';
                for (j=0; j < data[i].SUBMENU.length; j++){
                    h += '<li><a href="javascript:loadArticle(\'/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/'+data[i].SUBMENU[j].URL+'\')">'+data[i].SUBMENU[j].LABEL+'</a></li>';
                }
                h += '</ul>'
            }else{
                h += '<a href="javascript:loadArticle(\'/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/'+data[i].URL+'\')">'+data[i].LABEL+'</a>';
            }
            h += '</li>';
        }
        if (id.toLowerCase()==="new"){
            var obj = {_id:"new",achannel:req.param('ukey'),title:"",atype:"1",atime:"",author:req.session.user.departmenttext,authorid:req.session.user.department
                ,pdate:new Date().Format("yyyy-MM-dd"),aurl:"",isshow:0,description:"",acontent:"<p>"+app.get('RESI18N')[LNG].ARTICLE.LABEL.CONTENT+"</p>"}
            var tmpJSON = $.extend({}, app.get('CFG'), app.get('RESI18N')[LNG],{'smmenu':h}, {'USERINFO':req.session.user,obj:obj});
            res.render('sitemanage/articlep', tmpJSON);
        }else{
            var k = {'_id': ObjectID(id)};
            dbopt.get(article.NAME, k, function(err, obj){
                var tmpJSON = $.extend({}, app.get('CFG'), app.get('RESI18N')[LNG],{'smmenu':h}, {'USERINFO':req.session.user,obj:obj});
                res.render('sitemanage/articlep', tmpJSON);
            });
        }

    });
}
SMArticle.postInformationAdd = function(app, req, res, callback){
    Commfun.getRes(app, req, res, function(LNG){
        var id = req.body.id;
        var achannel = req.body.achannel; //所属栏目
        var title = req.body.title;  //标题
        var author = req.body.author; //作者
        var authorid = req.body.authorid; //作者
        var pdate = req.body.pdate; //发布日期
        var aurl = req.body.aurl;//图片或PDF地址
        var acontent = req.body.acontent; //文章内容
        var description = req.body.description; //文章简介
        var isshow = req.body.isshow == undefined?0:1; //是否在首页图片信息中显示
        var atime = new Date().Format("yyyy-MM-dd hh:mm:ss"); //编写时间
        var atype = req.body.atype; //类型 1 html 2 pdf

        var tj = new article({achannel:achannel,title:title,author:author,authorid:authorid,pdate:pdate,aurl:aurl,isshow:isshow,acontent:acontent,description:description,atime:atime,atype:atype});

        if (id.toLowerCase() === "new") {
            dbopt.insert(article.NAME, tj, function (err) {
                if (err) {
                    res.json({'success': false, 'tip': err});
                } else {
                    // app.get('views')
                    if (atype === "2"){
                        var sfp = app.get('views') + '/../public'+aurl;
                        var dfp = app.get('views') + '/../public'+aurl.replace(".pdf",".swf");
                        var child = exec(app.get('views')+'/../SWFTools/pdf2swf '+sfp+' -o '+dfp,{},
                            function (error, stdout, stderr) {
                                console.log('stdout: ' + stdout);
                                console.log('stderr: ' + stderr);
                                if (error !== null) {
                                    console.log('exec error: ' + error);
                                }
                            });
                    }
                    res.json({'success': true, 'url': '/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/information?achannel='+achannel, 'isRedirect': false});
                }
            });
        }else{
            k = {'_id': ObjectID(req.body.id)};
            tj = {achannel:achannel,title:title,author:author,authorid:authorid,pdate:pdate,aurl:aurl,isshow:isshow,acontent:acontent,description:description,atime:atime,atype:atype};
            dbopt.update(article.NAME, k, tj, function (err, c) {
                if (err) {
                    res.json({'success': false, 'tip': err});
                } else {
                    if (atype === "2"){
                        var sfp = app.get('views') + '/../public'+aurl;
                        var dfp = app.get('views') + '/../public'+aurl.replace(".pdf",".swf");
                        var child = exec(app.get('views')+'/../SWFTools/pdf2swf '+sfp+' -o '+dfp,{},
                            function (error, stdout, stderr) {
                                console.log('stdout: ' + stdout);
                                console.log('stderr: ' + stderr);
                                if (error !== null) {
                                    console.log('exec error: ' + error);
                                }
                            });
                    }
                    res.json({'success': true, 'url': '/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/information?achannel='+achannel, 'isRedirect': false});
                }
            });
        }
    });
}
SMArticle.postInformationDel = function (app, req, res, callback) {
    var k = {'_id': ObjectID(req.body.did)};
    var achannel = req.body.achannel //所属栏目
    var key = req.body.key;
    Commfun.getRes(app, req, res, function(LNG){
        dbopt.remove(article.NAME, k, function (err, c) {
            if (err) {
                res.json({'success': false, 'tip': err});
            } else {
                res.json({'success': true, 'url': '/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/information?achannel='+achannel, 'isRedirect': false});
            }
        });
    });

}
//模板管理---结束