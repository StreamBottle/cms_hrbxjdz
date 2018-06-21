var dbopt = require('../../modules/dbopt');
var Commfun = require('../../modules/commfun.js');
var $ = require('jquery');
var fs = require('fs');
var smlink = require('../../modules/sitemanage/link.js');
var smDepartment = require('../../modules/sitemanage/department.js');
var smchannel = require('../../modules/sitemanage/channel.js');
var smtemplate = require('../../modules/sitemanage/template.js');
var smtempopt01 = require('../../modules/sitemanage/tempopt01.js');
var smtempopt01c = require('../../modules/sitemanage/tempopt01c.js');
var smtempopt02 = require('../../modules/sitemanage/tempopt02.js');
var smtempopt02c = require('../../modules/sitemanage/tempopt02c.js');
var format = require('util').format;
var ObjectID = require('mongodb').ObjectID;

function SMSystem(smsystem) {}

module.exports = SMSystem;

//系统设置---开始
SMSystem.getSite = function (app, req, res, callback) {
    Commfun.getRes(app, req, res, function(LNG){
        var tmpJSON = $.extend({}, app.get('CFG'), app.get('RESI18N')[LNG]);
        res.render('sitemanage/site', tmpJSON);
    });
}
SMSystem.postSite = function (app, req, res, callback) {
    Commfun.getRes(app, req, res, function(LNG){
        app.get('CFG')['CONST']['SYSTEM']['NAME'] = req.body.name;
        app.get('CFG')['CONST']['SYSTEM']['ADD'] = req.body.add;
        app.get('CFG')['CONST']['SYSTEM']['ENTNAME'] = req.body.entname;
        app.get('CFG')['CONST']['SYSTEM']['FAX'] = req.body.fax;
        app.get('CFG')['CONST']['SYSTEM']['ICP'] = req.body.icp;
        app.get('CFG')['CONST']['SYSTEM']['LOGO'] = req.body.logo;
        app.get('CFG')['CONST']['SYSTEM']['MAIL'] = req.body.mail;
        app.get('CFG')['CONST']['SYSTEM']['MPATH'] = req.body.mpath;
        app.get('CFG')['CONST']['SYSTEM']['SCLOSE'] = req.body.sclose;
        app.get('CFG')['CONST']['SYSTEM']['TEL'] = req.body.tel;
        app.get('CFG')['CONST']['SYSTEM']['UPATH'] = req.body.upath;
        app.get('CFG')['CONST']['SYSTEM']['URL'] = req.body.url;
        app.get('CFG')['CONST']['SYSTEM']['USIZE'] = req.body.usize;
        app.get('CFG')['CONST']['SYSTEM']['UTYPE'] = req.body.utype;
        app.get('CFG')['CONST']['SYSTEM']['ZIP'] = req.body.zip;
        app.get('CFG')['CONST']['SYSTEM']['ISRUN'] = req.body.isrun == undefined?0:1;
        var s = "exports.Config = " + JSON.stringify(app.get('CFG'));
        fs.open(__dirname+"/../../locales/config.js", 'w+', 0666, function(err, hfs){
            // 错误检测
            if (err){
                throw err;
            }
            var buf = new Buffer(s);
            var pos = 0;
            fs.write(hfs, buf, 0, buf.length, pos, function(err){
                if (err){
                    throw err;
                }
                fs.close(hfs);
                req.session.user = null;
                req.session.menu = null;
                req.session.power = null;
                res.json({'success': true, 'url': '/' + app.get('CFG')['CONST']['SYSTEM']['MPATH'], 'isRedirect': true});
            });
        });
    });
}
//系统设置---结束
//栏目管理---开始
SMSystem.getChannelList = function (app, req, res, callback) {
    Commfun.getRes(app, req, res, function(LNG){
        var tmpJSON = $.extend({}, app.get('CFG'), app.get('RESI18N')[LNG]);
        res.render('sitemanage/channel', tmpJSON);
    });
}
SMSystem.getChannelListSkip = function (app, req, res, callback) {
//    var smmenub = [{"LABEL":"栏目发布","SUBMENU":[{"LABEL":"关于我们","KEY":"SANPO_site"},{"LABEL":"首页","KEY":"SANPO_rolelist"}]}];
    Commfun.getRes(app, req, res, function(LNG){
        var q = req.query.q?{'name':{ $regex: decodeURIComponent(req.query.q), $options: 'i' },'key':{$nin:['ROOT','SINGLE']}}:{'key':{$nin:['ROOT','SINGLE']}};
        Commfun.getChannelList(app, req, res, false, function(err, obj){
            var cl = obj;
            var options = {"limit": parseInt(req.query.pc),"skip": (parseInt(req.query.pn)-1)*parseInt(req.query.pc)}
            dbopt.getAll(smchannel.NAME, q, options, function(err, obj, total){
                if(err){
                    res.json({'success':false,'tip':err});
                }else{
                    var pos = ((parseInt(req.query.pn) - 1)* req.query.pc);
                    var pc = req.query.pn * req.query.pc > total?total-pos:req.query.pc;
                    var poe = parseInt(pos) + parseInt(pc);
                    var ps = Math.ceil(parseInt(total) / parseInt(req.query.pc));
                    if (ps == 0){ps = 1;}
                    var st = format(app.get('RESI18N')[LNG]['COMMON']['TITLE']['FOOTINFO'], ps, total, req.query.pn, pos+1, poe);
                    var tj = {'smcl': obj, 'total':total, 'pageNumber':req.query.pn, 'pageCount':pc, 'footinfo': st,smchannel:JSON.stringify(cl),
                        'pages':ps, 'pos':pos+1, 'poe':poe,'isFirstPage': (req.query.pn-1)==0, 'isLastPage':req.query.pn==ps};
                    var tmpJSON = $.extend({}, app.get('CFG'), app.get('RESI18N')[LNG], tj);
                    res.render('sitemanage/channel_list', tmpJSON);
                }
            });
        });
    });
}
SMSystem.postChannelAdd = function(app, req, res, callback){
    Commfun.getRes(app, req, res, function(LNG){
        var name = req.body.name;
        var parentkey = req.body.parentkey;
        var stype = req.body.stype;
        var key = req.body.key.toUpperCase();
        var ismenu = req.body.ismenu == undefined?0:1;
        var sortid = req.body.sortid;
        var k = {'key':parentkey};
        var tj = {'hassub':1}
        dbopt.update(smchannel.NAME, k, tj, function (err, obj){
            if (err) {
                res.json({'success': false, 'tip': err});
            } else {
                tj = new smchannel({
                    name: name, parentkey: parentkey, stype:stype, key: key, ismenu: ismenu, sortid: sortid, hassub: 0
                });
                k = {'name': name};
                if (req.body.opt == "2") {
                    k = {'_id': ObjectID(req.body.id)};
                    tj = {name: name, parentkey: parentkey, stype:stype, key: key, ismenu: ismenu, sortid: sortid};
                }
                dbopt.get(smchannel.NAME, k, function (err, obj) {
                    if (err) {
                        res.json({'success': false, 'tip': err});
                    } else {
                        if (obj) {
                            if (req.body.opt == "1") {
                                res.json({'success': false, 'tip': format(app.get('RESI18N')[LNG]['COMMON']['TIP']['EXIST'], name)});
                            } else {
                                dbopt.update(smchannel.NAME, k, tj, function (err, c) {
                                    if (err) {
                                        res.json({'success': false, 'tip': err});
                                    } else {
                                        res.json({'success': true, 'url': '/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/channel', 'isRedirect': false});
                                    }
                                });
                            }
                        } else {
                            if (req.body.opt == "1") {
                                dbopt.insert(smchannel.NAME, tj, function (err) {
                                    if (err) {
                                        res.json({'success': false, 'tip': err});
                                    } else {
                                        res.json({'success': true, 'url': '/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/channel', 'isRedirect': false});
                                    }
                                });
                            } else {
                                res.json({'success': false, 'tip': format(app.get('RESI18N')[LNG]['COMMON']['TIP']['NOEXIST'], name)});
                            }
                        }
                    }
                });
            }
        });
    });
}
SMSystem.postChannelDel = function (app, req, res, callback) {
    var k = {'_id': ObjectID(req.body.did)};
    Commfun.getRes(app, req, res, function(LNG){
        dbopt.remove(smchannel.NAME, k, function (err, c) {
            if (err) {
                res.json({'success': false, 'tip': err});
            } else {
                res.json({'success': true, 'url': '/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/channel', 'isRedirect': false});
            }
        });
    });

}
//栏目管理---结束
//模板管理---开始
SMSystem.getTemplateList = function (app, req, res, callback) {
    Commfun.getRes(app, req, res, function(LNG){
        var tmpJSON = $.extend({}, app.get('CFG'), app.get('RESI18N')[LNG]);
        res.render('sitemanage/template', tmpJSON);
    });
}
SMSystem.getTemplateListSkip = function (app, req, res, callback) {
    Commfun.getRes(app, req, res, function(LNG){
        var q = req.query.q?{'name':{ $regex: decodeURIComponent(req.query.q), $options: 'i' }}:{};
        var s = {};
        dbopt.getSkip(smtemplate.NAME, q, s, req.query.pn, req.query.pc, function(err, obj, total){
            if(err){
                res.json({'success':false,'tip':err});
            }else{
                var pos = ((parseInt(req.query.pn) - 1)* req.query.pc);
                var pc = req.query.pn * req.query.pc > total?total-pos:req.query.pc;
                var poe = parseInt(pos) + parseInt(pc);
                var ps = Math.ceil(parseInt(total) / parseInt(req.query.pc));
                if (ps == 0){ps = 1;}
                var st = format(app.get('RESI18N')[LNG]['COMMON']['TITLE']['FOOTINFO'], ps, total, req.query.pn, pos+1, poe);
                var tj = {'smtl': obj, 'total':total, 'pageNumber':req.query.pn, 'pageCount':pc, 'footinfo': st,
                    'pages':ps, 'pos':pos+1, 'poe':poe,'isFirstPage': (req.query.pn-1)==0, 'isLastPage':req.query.pn==ps};
                var tmpJSON = $.extend({}, app.get('CFG'), app.get('RESI18N')[LNG], tj);
                res.render('sitemanage/template_list', tmpJSON);
            }
        });
    });
}
SMSystem.postTemplateAdd = function(app, req, res, callback){
    Commfun.getRes(app, req, res, function(LNG){
        var name = req.body.name;
        var key = req.body.key;
        var isuse = req.body.isuse == undefined?0:1;
        if (isuse){
            app.get('CFG')['CONST']['SYSTEM']['THEME'] = key;
            var s = "exports.Config = " + JSON.stringify(app.get('CFG'));
            fs.open(__dirname+"/../../locales/config.js", 'w+', 0666, function(err, hfs){
                // 错误检测
                if (err){
                    throw err;
                }
                var buf = new Buffer(s);
                var pos = 0;
                fs.write(hfs, buf, 0, buf.length, pos, function(err){
                    if (err){
                        throw err;
                    }
                    fs.close(hfs);
                });
            });
        }
        var tj = new smtemplate({name: name, key: key, isuse: isuse});
        var k = {'key': key};
        if (req.body.opt == "2") {
            k = {'_id': ObjectID(req.body.id)};
            tj = {name: name, key: key, isuse: isuse};
        }
        dbopt.get(smtemplate.NAME, k, function (err, obj) {
            if (err) {
                res.json({'success': false, 'tip': err});
            } else {
                if (obj) {
                    if (req.body.opt == "1") {
                        res.json({'success': false, 'tip': format(app.get('RESI18N')[LNG]['COMMON']['TIP']['EXIST'], name)});
                    } else {
                        dbopt.update(smtemplate.NAME, k, tj, function (err, c) {
                            if (err) {
                                res.json({'success': false, 'tip': err});
                            } else {
                                if (obj.key != tj.key){
                                    fs.renameSync(app.get('views')+"/"+obj.key, app.get('views')+"/"+tj.key);
                                    fs.renameSync(app.get('views')+"/../public/"+obj.key,app.get('views')+"/../public/"+tj.key);
                                }
                                res.json({'success': true, 'url': '/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/template', 'isRedirect': false});
                            }
                        });
                    }
                } else {
                    if (req.body.opt == "1") {
                        dbopt.insert(smtemplate.NAME, tj, function (err) {
                            if (err) {
                                res.json({'success': false, 'tip': err});
                            } else {
                                fs.mkdirSync(app.get('views')+"/"+tj.key);
                                fs.mkdirSync(app.get('views')+"/../public/"+tj.key);
                                res.json({'success': true, 'url': '/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/template', 'isRedirect': false});
                            }
                        });
                    } else {
                        res.json({'success': false, 'tip': format(app.get('RESI18N')[LNG]['COMMON']['TIP']['NOEXIST'], name)});
                    }
                }
            }
        });
    });
}
SMSystem.postTemplateDel = function (app, req, res, callback) {
    var k = {'_id': ObjectID(req.body.did)};
    var key = req.body.key;
    Commfun.getRes(app, req, res, function(LNG){
        dbopt.remove(smtemplate.NAME, k, function (err, c) {
            if (err) {
                res.json({'success': false, 'tip': err});
            } else {
                fs.rmdirSync(app.get('views')+"/"+key);
                fs.rmdirSync(app.get('views')+"/../public/"+key);
                res.json({'success': true, 'url': '/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/template', 'isRedirect': false});
            }
        });
    });

}
//模板管理---结束
//链接管理---开始
SMSystem.getLinkList = function (app, req, res, callback) {
    Commfun.getRes(app, req, res, function(LNG){
        var tmpJSON = $.extend({}, app.get('CFG'), app.get('RESI18N')[LNG]);
        res.render('sitemanage/link', tmpJSON);
    });
}
SMSystem.getLinkListSkip = function (app, req, res, callback) {
    Commfun.getRes(app, req, res, function(LNG){
        var q = req.query.q?{'name':{ $regex: decodeURIComponent(req.query.q), $options: 'i' }}:{};
        var s = {};
            dbopt.getSkip(smlink.NAME, q, s, req.query.pn, req.query.pc, function(err, obj, total){
                if(err){
                    res.json({'success':false,'tip':err});
                }else{
                    var pos = ((parseInt(req.query.pn) - 1)* req.query.pc);
                    var pc = req.query.pn * req.query.pc > total?total-pos:req.query.pc;
                    var poe = parseInt(pos) + parseInt(pc);
                    var ps = Math.ceil(parseInt(total) / parseInt(req.query.pc));
                    if (ps == 0){ps = 1;}
                    var st = format(app.get('RESI18N')[LNG]['COMMON']['TITLE']['FOOTINFO'], ps, total, req.query.pn, pos+1, poe);
                    var tj = {'smll': obj, 'total':total, 'pageNumber':req.query.pn, 'pageCount':pc, 'footinfo': st,
                        'pages':ps, 'pos':pos+1, 'poe':poe,'isFirstPage': (req.query.pn-1)==0, 'isLastPage':req.query.pn==ps};
                    var tmpJSON = $.extend({}, app.get('CFG'), app.get('RESI18N')[LNG], tj);
                    res.render('sitemanage/link_list', tmpJSON);
                }
            });
        });
}
SMSystem.postLinkAdd = function(app, req, res, callback){
    Commfun.getRes(app, req, res, function(LNG){
        var name = req.body.name;
        var logo = req.body.logo;
        var url = req.body.url;
        var isshow = req.body.isshow == undefined?0:1;
        var sortid = req.body.sortid;
        var tj = new smlink({
            name: name, logo: logo, url: url, isshow: isshow, sortid: sortid
        });
        var k = {'name': name};
        if (req.body.opt == "2") {
            k = {'_id': ObjectID(req.body.id)};
            tj = {name: name, logo: logo, url: url, isshow: isshow, sortid: sortid};
        }
        dbopt.get(smlink.NAME, k, function (err, obj) {
            if (err) {
                res.json({'success': false, 'tip': err});
            } else {
                if (obj) {
                    if (req.body.opt == "1") {
                        res.json({'success': false, 'tip': format(app.get('RESI18N')[LNG]['COMMON']['TIP']['EXIST'], name)});
                    } else {
                        dbopt.update(smlink.NAME, k, tj, function (err, c) {
                            if (err) {
                                res.json({'success': false, 'tip': err});
                            } else {
                                res.json({'success': true, 'url': '/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/linklist', 'isRedirect': false});
                            }
                        });
                    }
                } else {
                    if (req.body.opt == "1") {
                        dbopt.insert(smlink.NAME, tj, function (err) {
                            if (err) {
                                res.json({'success': false, 'tip': err});
                            } else {
                                res.json({'success': true, 'url': '/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/linklist', 'isRedirect': false});
                            }
                        });
                    } else {
                        res.json({'success': false, 'tip': format(app.get('RESI18N')[LNG]['COMMON']['TIP']['NOEXIST'], name)});
                    }
                }
            }
        });
    });
}
SMSystem.postLinkDel = function (app, req, res, callback) {
    var k = {'_id': ObjectID(req.body.did)};
    Commfun.getRes(app, req, res, function(LNG){
        dbopt.remove(smlink.NAME, k, function (err, c) {
            if (err) {
                res.json({'success': false, 'tip': err});
            } else {
                res.json({'success': true, 'url': '/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/linklist', 'isRedirect': false});
            }
        });
    });
}
//链接管理---结束
SMSystem.getDepartmentList = function (app, req, res, callback) {
    Commfun.getRes(app, req, res, function(LNG){
        var tmpJSON = $.extend({}, app.get('CFG'), app.get('RESI18N')[LNG]);
        res.render('sitemanage/department', tmpJSON);
    });
}
SMSystem.getDepartmentSkip = function (app, req, res, callback) {
    Commfun.getRes(app, req, res, function(LNG){
        var q = req.query.q?{'name':{ $regex: decodeURIComponent(req.query.q), $options: 'i' }}:{};
        var s = {};
        dbopt.getSkip(smDepartment.NAME, q, s, req.query.pn, req.query.pc, function(err, obj, total){
            if(err){
                res.json({'success':false,'tip':err});
            }else{
                var pos = ((parseInt(req.query.pn) - 1)* req.query.pc);
                var pc = req.query.pn * req.query.pc > total?total-pos:req.query.pc;
                var poe = parseInt(pos) + parseInt(pc);
                var ps = Math.ceil(parseInt(total) / parseInt(req.query.pc));
                if (ps == 0){ps = 1;}
                var st = format(app.get('RESI18N')[LNG]['COMMON']['TITLE']['FOOTINFO'], ps, total, req.query.pn, pos+1, poe);
                var tj = {'smdl': obj, 'total':total, 'pageNumber':req.query.pn, 'pageCount':pc, 'footinfo': st,
                    'pages':ps, 'pos':pos+1, 'poe':poe,'isFirstPage': (req.query.pn-1)==0, 'isLastPage':req.query.pn==ps};
                var tmpJSON = $.extend({}, app.get('CFG'), app.get('RESI18N')[LNG], tj);
                res.render('sitemanage/department_list', tmpJSON);
            }
        });
    });
}
SMSystem.postDepartmentAdd = function(app, req, res, callback){
    Commfun.getRes(app, req, res, function(LNG){
        var name = req.body.name;
        var key = req.body.key;
        var tj = new smDepartment({name: name, key: key});
        var k = {'name': name};
        if (req.body.opt == "2") {
            k = {'_id': ObjectID(req.body.id)};
            tj = {name: name, key: key};
        }
        dbopt.get(smDepartment.NAME, k, function (err, obj) {
            if (err) {
                res.json({'success': false, 'tip': err});
            } else {
                if (obj) {
                    if (req.body.opt == "1") {
                        res.json({'success': false, 'tip': format(app.get('RESI18N')[LNG]['COMMON']['TIP']['EXIST'], name)});
                    } else {
                        dbopt.update(smDepartment.NAME, k, tj, function (err, c) {
                            if (err) {
                                res.json({'success': false, 'tip': err});
                            } else {
                                res.json({'success': true, 'url': '/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/departmentlist', 'isRedirect': false});
                            }
                        });
                    }
                } else {
                    if (req.body.opt == "1") {
                        dbopt.insert(smDepartment.NAME, tj, function (err) {
                            if (err) {
                                res.json({'success': false, 'tip': err});
                            } else {
                                res.json({'success': true, 'url': '/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/departmentlist', 'isRedirect': false});
                            }
                        });
                    } else {
                        res.json({'success': false, 'tip': format(app.get('RESI18N')[LNG]['COMMON']['TIP']['NOEXIST'], name)});
                    }
                }
            }
        });
    });
}
SMSystem.postDepartmentDel = function (app, req, res, callback) {
    var k = {'_id': ObjectID(req.body.did)};
    Commfun.getRes(app, req, res, function(LNG){
        dbopt.remove(smDepartment.NAME, k, function (err, c) {
            if (err) {
                res.json({'success': false, 'tip': err});
            } else {
                res.json({'success': true, 'url': '/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/departmentlist', 'isRedirect': false});
            }
        });
    });
}
//定制功能---开始
SMSystem.getTempOpt01List = function (app, req, res, callback) {
    Commfun.getRes(app, req, res, function(LNG){
        var tmpJSON = $.extend({}, app.get('CFG'), app.get('RESI18N')[LNG]);
        res.render('sitemanage/tempopt01', tmpJSON);
    });
}
SMSystem.getTempOpt02List = function (app, req, res, callback) {
    Commfun.getRes(app, req, res, function(LNG){
        var tmpJSON = $.extend({}, app.get('CFG'), app.get('RESI18N')[LNG]);
        res.render('sitemanage/tempopt02', tmpJSON);
    });
}
SMSystem.getTempOpt01NList = function (app, req, res, callback) {
    Commfun.getRes(app, req, res, function(LNG){
        var sdate=req.param('ukey');
        var tmpJSON = $.extend({'sdate':sdate}, app.get('CFG'), app.get('RESI18N')[LNG]);
        res.render('sitemanage/tempopt01n', tmpJSON);
    });
}
SMSystem.getTempOpt02NList = function (app, req, res, callback) {
    Commfun.getRes(app, req, res, function(LNG){
        var sdate=req.param('ukey');
        var tmpJSON = $.extend({'sdate':sdate}, app.get('CFG'), app.get('RESI18N')[LNG]);
        res.render('sitemanage/tempopt02n', tmpJSON);
    });
}
SMSystem.getTempOpt01Skip = function (app, req, res, callback) {
    Commfun.getRes(app, req, res, function(LNG){
        var q = req.query.q?{'sdate':{ $regex: decodeURIComponent(req.query.q), $options: 'i' }}:{};
        var s = {"sort": {sdate:-1}};
        dbopt.getSkip(smtempopt01.NAME, q, s, req.query.pn, req.query.pc, function(err, obj, total){
            if(err){
                res.json({'success':false,'tip':err});
            }else{
                var pos = ((parseInt(req.query.pn) - 1)* req.query.pc);
                var pc = req.query.pn * req.query.pc > total?total-pos:req.query.pc;
                var poe = parseInt(pos) + parseInt(pc);
                var ps = Math.ceil(parseInt(total) / parseInt(req.query.pc));
                if (ps == 0){ps = 1;}
                var st = format(app.get('RESI18N')[LNG]['COMMON']['TITLE']['FOOTINFO'], ps, total, req.query.pn, pos+1, poe);
                var tj = {'smtol01': obj, 'total':total, 'pageNumber':req.query.pn, 'pageCount':pc, 'footinfo': st,
                    'pages':ps, 'pos':pos+1, 'poe':poe,'isFirstPage': (req.query.pn-1)==0, 'isLastPage':req.query.pn==ps};
                var tmpJSON = $.extend({}, app.get('CFG'), app.get('RESI18N')[LNG], tj);
                res.render('sitemanage/tempopt01l', tmpJSON);
            }
        });
    });
}
SMSystem.getTempOpt02Skip = function (app, req, res, callback) {
    Commfun.getRes(app, req, res, function(LNG){
        var q = req.query.q?{'sdate':{ $regex: decodeURIComponent(req.query.q), $options: 'i' }}:{};
        var s = {"sort": {sdate:-1}};
        dbopt.getSkip(smtempopt02.NAME, q, s, req.query.pn, req.query.pc, function(err, obj, total){
            if(err){
                res.json({'success':false,'tip':err});
            }else{
                var pos = ((parseInt(req.query.pn) - 1)* req.query.pc);
                var pc = req.query.pn * req.query.pc > total?total-pos:req.query.pc;
                var poe = parseInt(pos) + parseInt(pc);
                var ps = Math.ceil(parseInt(total) / parseInt(req.query.pc));
                if (ps == 0){ps = 1;}
                var st = format(app.get('RESI18N')[LNG]['COMMON']['TITLE']['FOOTINFO'], ps, total, req.query.pn, pos+1, poe);
                var tj = {'smtol02': obj, 'total':total, 'pageNumber':req.query.pn, 'pageCount':pc, 'footinfo': st,
                    'pages':ps, 'pos':pos+1, 'poe':poe,'isFirstPage': (req.query.pn-1)==0, 'isLastPage':req.query.pn==ps};
                var tmpJSON = $.extend({}, app.get('CFG'), app.get('RESI18N')[LNG], tj);
                res.render('sitemanage/tempopt02l', tmpJSON);
            }
        });
    });
}
SMSystem.getTempOpt01NSkip = function (app, req, res, callback) {
    Commfun.getRes(app, req, res, function(LNG){
        var sdate=decodeURIComponent(req.query.q);
        var q = req.query.q?{'pid':{ $regex: sdate, $options: 'i' }}:{};
        var s = {};
        dbopt.getSkip(smtempopt01c.NAME, q, s, req.query.pn, req.query.pc, function(err, obj, total){
            if(err){
                res.json({'success':false,'tip':err});
            }else{
                var pos = ((parseInt(req.query.pn) - 1)* req.query.pc);
                var pc = req.query.pn * req.query.pc > total?total-pos:req.query.pc;
                var poe = parseInt(pos) + parseInt(pc);
                var ps = Math.ceil(parseInt(total) / parseInt(req.query.pc));
                if (ps == 0){ps = 1;}
                var st = format(app.get('RESI18N')[LNG]['COMMON']['TITLE']['FOOTINFO'], ps, total, req.query.pn, pos+1, poe);
                var tj = {'smtol01n': obj, 'total':total, 'pageNumber':req.query.pn, 'pageCount':pc, 'footinfo': st,'sdate':sdate,
                    'pages':ps, 'pos':pos+1, 'poe':poe,'isFirstPage': (req.query.pn-1)==0, 'isLastPage':req.query.pn==ps};
                var tmpJSON = $.extend({}, app.get('CFG'), app.get('RESI18N')[LNG], tj);
                res.render('sitemanage/tempopt01nl', tmpJSON);
            }
        });
    });
}
SMSystem.getTempOpt02NSkip = function (app, req, res, callback) {
    Commfun.getRes(app, req, res, function(LNG){
        var sdate=decodeURIComponent(req.query.q);
        var q = req.query.q?{'pid':{ $regex: sdate, $options: 'i' }}:{};
        var s = {};
        dbopt.getSkip(smtempopt02c.NAME, q, s, req.query.pn, req.query.pc, function(err, obj, total){
            if(err){
                res.json({'success':false,'tip':err});
            }else{
                var pos = ((parseInt(req.query.pn) - 1)* req.query.pc);
                var pc = req.query.pn * req.query.pc > total?total-pos:req.query.pc;
                var poe = parseInt(pos) + parseInt(pc);
                var ps = Math.ceil(parseInt(total) / parseInt(req.query.pc));
                if (ps == 0){ps = 1;}
                var st = format(app.get('RESI18N')[LNG]['COMMON']['TITLE']['FOOTINFO'], ps, total, req.query.pn, pos+1, poe);
                var tj = {'smtol02n': obj, 'total':total, 'pageNumber':req.query.pn, 'pageCount':pc, 'footinfo': st,'sdate':sdate,
                    'pages':ps, 'pos':pos+1, 'poe':poe,'isFirstPage': (req.query.pn-1)==0, 'isLastPage':req.query.pn==ps};
                var tmpJSON = $.extend({}, app.get('CFG'), app.get('RESI18N')[LNG], tj);
                res.render('sitemanage/tempopt02nl', tmpJSON);
            }
        });
    });
}
SMSystem.postTempOpt01Add = function(app, req, res, callback){
    Commfun.getRes(app, req, res, function(LNG){
        var sdate = req.body.sdate;
        var id = req.body.id;
        var tj = new smtempopt01({sdate: sdate});
        var k = {'sdate': sdate};
        if (req.body.opt == "2") {
            k = {'_id': ObjectID(id)};
            tj = {sdate: sdate};
        }
        dbopt.get(smtempopt01.NAME, k, function (err, obj) {
            if (err) {
                res.json({'success': false, 'tip': err});
            } else {
                if (obj) {
                    if (req.body.opt == "1") {
                        res.json({'success': false, 'tip': format(app.get('RESI18N')[LNG]['COMMON']['TIP']['EXIST'], sdate)});
                    } else {
                        dbopt.update(smtempopt01.NAME, k, tj, function (err, c) {
                            if (err) {
                                res.json({'success': false, 'tip': err});
                            } else {
                                res.json({'success': true, 'url': '/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/kqzlrb', 'isRedirect': false});
                            }
                        });
                    }
                } else {
                    if (req.body.opt == "1") {
                        dbopt.insert(smtempopt01.NAME, tj, function (err) {
                            if (err) {
                                res.json({'success': false, 'tip': err});
                            } else {
                                res.json({'success': true, 'url': '/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/kqzlrb', 'isRedirect': false});
                            }
                        });
                    } else {
                        res.json({'success': false, 'tip': format(app.get('RESI18N')[LNG]['COMMON']['TIP']['NOEXIST'], sdate)});
                    }
                }
            }
        });
    });
}
SMSystem.postTempOpt02Add = function(app, req, res, callback){
    Commfun.getRes(app, req, res, function(LNG){
        var sdate = req.body.sdate;
        var id = req.body.id;
        var tj = new smtempopt02({sdate: sdate});
        var k = {'sdate': sdate};
        if (req.body.opt == "2") {
            k = {'_id': ObjectID(id)};
            tj = {sdate: sdate};
        }
        dbopt.get(smtempopt02.NAME, k, function (err, obj) {
            if (err) {
                res.json({'success': false, 'tip': err});
            } else {
                if (obj) {
                    if (req.body.opt == "1") {
                        res.json({'success': false, 'tip': format(app.get('RESI18N')[LNG]['COMMON']['TIP']['EXIST'], sdate)});
                    } else {
                        dbopt.update(smtempopt02.NAME, k, tj, function (err, c) {
                            if (err) {
                                res.json({'success': false, 'tip': err});
                            } else {
                                res.json({'success': true, 'url': '/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/szzb', 'isRedirect': false});
                            }
                        });
                    }
                } else {
                    if (req.body.opt == "1") {
                        dbopt.insert(smtempopt02.NAME, tj, function (err) {
                            if (err) {
                                res.json({'success': false, 'tip': err});
                            } else {
                                res.json({'success': true, 'url': '/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/szzb', 'isRedirect': false});
                            }
                        });
                    } else {
                        res.json({'success': false, 'tip': format(app.get('RESI18N')[LNG]['COMMON']['TIP']['NOEXIST'], sdate)});
                    }
                }
            }
        });
    });
}
SMSystem.postTempOpt01NAdd = function(app, req, res, callback){
    Commfun.getRes(app, req, res, function(LNG){
        var cityname = req.body.cityname;
        var sywrw = req.body.sywrw;
        var pid = req.body.pid;
        var dj = req.body.dj;
        var aqi = req.body.aqi;
        var id = req.body.id;
        var tj = new smtempopt01c({cityname: cityname,sywrw: sywrw,dj: dj,aqi: aqi,pid:pid});
        var k = {'cityname': cityname, 'pid':pid};
        if (req.body.opt == "2") {
            k = {'_id': ObjectID(id)};
            tj = {cityname: cityname,sywrw: sywrw,dj: dj,aqi: aqi,pid:pid};
        }
        dbopt.get(smtempopt01c.NAME, k, function (err, obj) {
            if (err) {
                res.json({'success': false, 'tip': err});
            } else {
                if (obj) {
                    if (req.body.opt == "1") {
                        res.json({'success': false, 'tip': format(app.get('RESI18N')[LNG]['COMMON']['TIP']['EXIST'], cityname)});
                    } else {
                        dbopt.update(smtempopt01c.NAME, k, tj, function (err, c) {
                            if (err) {
                                res.json({'success': false, 'tip': err});
                            } else {
                                res.json({'success': true, 'url': '/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/kqzlrbnew/'+pid, 'isRedirect': false});
                            }
                        });
                    }
                } else {
                    if (req.body.opt == "1") {
                        dbopt.insert(smtempopt01c.NAME, tj, function (err) {
                            if (err) {
                                res.json({'success': false, 'tip': err});
                            } else {
                                res.json({'success': true, 'url': '/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/kqzlrbnew/'+pid, 'isRedirect': false});
                            }
                        });
                    } else {
                        res.json({'success': false, 'tip': format(app.get('RESI18N')[LNG]['COMMON']['TIP']['NOEXIST'], cityname)});
                    }
                }
            }
        });
    });
}
SMSystem.postTempOpt02NAdd = function(app, req, res, callback){
    Commfun.getRes(app, req, res, function(LNG){
        var pid = req.body.pid;
        var id = req.body.id;
        var jcdm = req.body.jcdm;
        var jl = req.body.jl;

        var tj = new smtempopt02c({jcdm: jcdm,jl:jl,pid:pid});
        var k = {'jcdm': jcdm,'pid':pid};
        if (req.body.opt == "2") {
            k = {'_id': ObjectID(id)};
            tj = {jcdm: jcdm,jl:jl,pid:pid};
        }
        dbopt.get(smtempopt02c.NAME, k, function (err, obj) {
            if (err) {
                res.json({'success': false, 'tip': err});
            } else {
                if (obj) {
                    if (req.body.opt == "1") {
                        res.json({'success': false, 'tip': format(app.get('RESI18N')[LNG]['COMMON']['TIP']['EXIST'], jcdm)});
                    } else {
                        dbopt.update(smtempopt02c.NAME, k, tj, function (err, c) {
                            if (err) {
                                res.json({'success': false, 'tip': err});
                            } else {
                                res.json({'success': true, 'url': '/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/szzbnew/'+pid, 'isRedirect': false});
                            }
                        });
                    }
                } else {
                    if (req.body.opt == "1") {
                        dbopt.insert(smtempopt02c.NAME, tj, function (err) {
                            if (err) {
                                res.json({'success': false, 'tip': err});
                            } else {
                                res.json({'success': true, 'url': '/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/szzbnew/'+pid, 'isRedirect': false});
                            }
                        });
                    } else {
                        res.json({'success': false, 'tip': format(app.get('RESI18N')[LNG]['COMMON']['TIP']['NOEXIST'], jcdm)});
                    }
                }
            }
        });
    });
}
SMSystem.postTempOpt01Del = function (app, req, res, callback) {
    var k = {'_id': ObjectID(req.body.did)};
    Commfun.getRes(app, req, res, function(LNG){
        dbopt.remove(smtempopt01.NAME, k, function (err, c) {
            if (err) {
                res.json({'success': false, 'tip': err});
            } else {
                res.json({'success': true, 'url': '/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/kqzlrb/', 'isRedirect': false});
            }
        });
    });
}
SMSystem.postTempOpt02Del = function (app, req, res, callback) {
    var k = {'_id': ObjectID(req.body.did)};
    Commfun.getRes(app, req, res, function(LNG){
        dbopt.remove(smtempopt02.NAME, k, function (err, c) {
            if (err) {
                res.json({'success': false, 'tip': err});
            } else {
                res.json({'success': true, 'url': '/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/szzb/', 'isRedirect': false});
            }
        });
    });
}
SMSystem.postTempOpt01NDel = function (app, req, res, callback) {
    var k = {'_id': ObjectID(req.body.did)};
    var pid = req.body.pid;
    Commfun.getRes(app, req, res, function(LNG){
        dbopt.remove(smtempopt01c.NAME, k, function (err, c) {
            if (err) {
                res.json({'success': false, 'tip': err});
            } else {
                res.json({'success': true, 'url': '/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/kqzlrbnew/'+pid, 'isRedirect': false});
            }
        });
    });
}
SMSystem.postTempOpt02NDel = function (app, req, res, callback) {
    var k = {'_id': ObjectID(req.body.did)};
    var pid = req.body.pid;
    Commfun.getRes(app, req, res, function(LNG){
        dbopt.remove(smtempopt02c.NAME, k, function (err, c) {
            if (err) {
                res.json({'success': false, 'tip': err});
            } else {
                res.json({'success': true, 'url': '/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/szzbnew/'+pid, 'isRedirect': false});
            }
        });
    });
}
//定制功能---结束