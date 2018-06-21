var crypto = require('crypto');
var dbopt = require('../../modules/dbopt');
var Commfun = require('../../modules/commfun.js');
var $ = require('jquery');
var smrole = require('../../modules/sitemanage/role.js');
var smdepartment = require('../../modules/sitemanage/department.js');
var smuser = require('../../modules/sitemanage/user.js');
var format = require('util').format;
var ObjectID = require('mongodb').ObjectID;

function SMAuth(smauth) {}

module.exports = SMAuth;
//登录---开始
SMAuth.getLogin = function (app, req, res, callback) {
    Commfun.getRes(app, req, res, function(LNG){
        var tmpJSON = $.extend({}, app.get('CFG'), app.get('RESI18N')[LNG]);
        res.render('sitemanage/login', tmpJSON);
    });
}
SMAuth.postLogin = function (app, req, res, callback) {
    var k = {'username':req.body.account, 'password':crypto.createHash('sha1').update(req.body.password+'54CMS').digest('hex')};
	console.log(1);
    Commfun.getRes(app, req, res, function(LNG) {
		console.log(2);
        dbopt.get(smuser.NAME, k, function (err, obj) {
			console.log(3);
            if (err) {
				console.log(4);
                res.json({'success': false, 'tip': err});
            } else {
				console.log(5);
                if (obj) {
                    var oar = new Array();
                    var oraa = obj.role.split(',');
                    for (i=0; i<oraa.length; i++){
                        oar.push(ObjectID(oraa[i]));
                    }
                    var mar = $.extend(true, [], app.get('RESI18N')[LNG]['MENU']);
                    k = {'_id':{$in:oar}};
                    dbopt.get(smrole.NAME, k, function (err, robj) {
                        req.session.user = obj;
                        for (i=mar.length-1; i>=0; i--){
                            if (mar[i].URL == undefined){
                                for(j=mar[i]['SUBMENU'].length-1; j>=0; j--){
                                    var p = $.inArray(mar[i]['SUBMENU'][j]['URL'], robj.power);
                                    if (p==-1){
                                        mar[i]['SUBMENU'].splice(j, 1);
                                    }
                                }
                                if (mar[i]['SUBMENU'].length == 0){
                                    mar.splice(i, 1);
                                }
                            }else{
                                var p = $.inArray(mar[i]['URL'], robj.power);
                                if (p==-1){
                                    mar.splice(i, 1);
                                }
                            }
                        }
                        req.session.menu = mar;
                        req.session.power = robj.power;
                        res.json({'success': true, 'url': '/' + app.get('CFG')['CONST']['SYSTEM']['MPATH'] + '/index', 'isRedirect': true});
                    });
                } else {
                    res.json({'success': false, 'tip': app.get('RESI18N')[LNG]['AUTH']['TIP']['ERROR']});
                }
            }
        });
    });
}
SMAuth.allLogout = function (app, req, res, callback){
    req.session.user = null;
    req.session.menu = null;
    req.session.power = null;
    res.redirect('/' + app.get('CFG')['CONST']['SYSTEM']['MPATH'] + '/');
}
SMAuth.postChangePassword = function (app, req, res, callback){
    Commfun.getRes(app, req, res, function(LNG) {
        var oldpwd = req.body.oldpwd;
        var newpwd = req.body.newpwd;
        var opwdc = crypto.createHash('sha1').update(oldpwd + '54CMS').digest('hex');
        var npwdc = crypto.createHash('sha1').update(newpwd + '54CMS').digest('hex');
        var k = {'username': req.session.user.username, 'password': opwdc};
        dbopt.get(smuser.NAME, k, function (err, obj) {
            if (err) {
                res.json({'success': false, 'tip': err});
            } else {
                if (obj) {
                    var tj = {password: npwdc};
                    dbopt.update(smuser.NAME, k, tj, function (err, c) {
                        if (err) {
                            res.json({'success': false, 'tip': err});
                        } else {
                            req.session.user = null;
                            req.session.menu = null;
                            req.session.power = null;
                            res.json({'success': true, 'url': '/' + app.get('CFG')['CONST']['SYSTEM']['MPATH'] + '/', 'isRedirect': true});
                        }
                    });
                } else {
                    res.json({'success': false, 'tip': app.get('RESI18N')[LNG]['AUTH']['TIP']['ERROR']});
                }
            }
        });
    });
}
//登录---结束

//角色管理---开始
SMAuth.getRoleList = function (app, req, res, callback) {
    Commfun.getRes(app, req, res, function(LNG){
        var tmpJSON = $.extend({}, app.get('CFG'), app.get('RESI18N')[LNG]);
        res.render('sitemanage/role', tmpJSON);
    });
}
SMAuth.getRoleListSkip = function (app, req, res, callback) {
    Commfun.getRes(app, req, res, function(LNG){
        var q = req.query.q?{'name':{ $regex: decodeURIComponent(req.query.q), $options: 'i' }}:{};
        Commfun.getChannelList(app, req, res, true, function(err, obj){
            var cl = obj;
            if (obj){
                var tar = new Array();
                for (i=0; i<obj.length; i++){
                    tar.push({"LABEL":obj[i].name,"URL":"SANPO_"+obj[i].key});
                }
                cl = [{"LABEL":"栏目发布","SUBMENU":tar}];
            }
            var s = {};
            dbopt.getSkip(smrole.NAME, q, s, req.query.pn, req.query.pc, function(err, obj, total){
                if(err){
                    res.json({'success':false,'tip':err});
                }else{
                    var pos = ((parseInt(req.query.pn) - 1)* req.query.pc);
                    var pc = req.query.pn * req.query.pc > total?total-pos:req.query.pc;
                    var poe = parseInt(pos) + parseInt(pc);
                    var ps = Math.ceil(parseInt(total) / parseInt(req.query.pc));
                    if (ps == 0){ps = 1;}
                    var smmenu = app.get('RESI18N')[LNG]['MENU'].concat(cl);
                    var st = format(app.get('RESI18N')[LNG]['COMMON']['TITLE']['FOOTINFO'], ps, total, req.query.pn, pos+1, poe);
                    var tj = {'smrl': obj, 'total':total, 'pageNumber':req.query.pn, 'pageCount':pc, 'footinfo': st,smmenu:JSON.stringify(smmenu),
                        'pages':ps, 'pos':pos+1, 'poe':poe,'isFirstPage': (req.query.pn-1)==0, 'isLastPage':req.query.pn==ps};
                    var tmpJSON = $.extend({}, app.get('CFG'), app.get('RESI18N')[LNG], tj);
                    res.render('sitemanage/role_list', tmpJSON);
                }
            });
        });
    });
}
SMAuth.postRoleAdd = function(app, req, res, callback){
    Commfun.getRes(app, req, res, function(LNG){
        var name = req.body.name;
        var power = req.body.power;
        var powertext = req.body.powertext;
        var tj = new smrole({
            name: name, power: power, powertext: powertext
        });
        var k = {'name': name};
        if (req.body.opt == "2") {
            k = {'_id': ObjectID(req.body.id)};
            tj = {'name': name, 'power': power, 'powertext': powertext};
        }
        dbopt.get(smrole.NAME, k, function (err, obj) {
            if (err) {
                res.json({'success': false, 'tip': err});
            } else {
                if (obj) {
                    if (req.body.opt == "1") {
                        res.json({'success': false, 'tip': format(app.get('RESI18N')[LNG]['COMMON']['TIP']['EXIST'], name)});
                    } else {
                        dbopt.update(smrole.NAME, k, tj, function (err, c) {
                            if (err) {
                                res.json({'success': false, 'tip': err});
                            } else {
                                res.json({'success': true, 'url': '/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/rolelist', 'isRedirect': false});
                            }
                        });
                    }
                } else {
                    if (req.body.opt == "1") {
                        dbopt.insert(smrole.NAME, tj, function (err) {
                            if (err) {
                                res.json({'success': false, 'tip': err});
                            } else {
                                res.json({'success': true, 'url': '/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/rolelist', 'isRedirect': false});
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
SMAuth.postRoleDel = function (app, req, res, callback) {
    var k = {'_id': ObjectID(req.body.did)};
    Commfun.getRes(app, req, res, function(LNG){
        dbopt.remove(smrole.NAME, k, function (err, c) {
            if (err) {
                res.json({'success': false, 'tip': err});
            } else {
                res.json({'success': true, 'url': '/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/rolelist', 'isRedirect': false});
            }
        });
    });
}
//角色管理---结束

//用户管理---开始
SMAuth.getUserList = function (app, req, res, callback) {
    Commfun.getRes(app, req, res, function(LNG){
        var tmpJSON = $.extend({}, app.get('CFG'), app.get('RESI18N')[LNG]);
        res.render('sitemanage/user', tmpJSON);
    });
}
SMAuth.getUserListSkip = function (app, req, res, callback) {
    Commfun.getRes(app, req, res, function(LNG){
        var q = req.query.q?{'username':{ $regex: decodeURIComponent(req.query.q), $options: 'i' }}:{};
        var robj,dobj;
        dbopt.getAllEx(smdepartment.NAME, {}, {'key':1,'name':1}, {}, function(err, tobj){
            dobj = tobj;
        dbopt.getAllEx(smrole.NAME, {}, {'_id':1,'name':1}, {}, function(err, tobj){
            robj = tobj;
            var options = {"limit": parseInt(req.query.pc),"skip": (parseInt(req.query.pn)-1)*parseInt(req.query.pc)}
            dbopt.getAll(smuser.NAME, q, options, function(err, obj, total){
                if(err){
                    res.json({'success':false,'tip':err});
                }else{
                    var pos = ((parseInt(req.query.pn) - 1)* req.query.pc);
                    var pc = req.query.pn * req.query.pc > total?total-pos:req.query.pc;
                    var poe = parseInt(pos) + parseInt(pc);
                    var ps = Math.ceil(parseInt(total) / parseInt(req.query.pc));
                    if (ps == 0){ps = 1;}
                    var st = format(app.get('RESI18N')[LNG]['COMMON']['TITLE']['FOOTINFO'], ps, total, req.query.pn, pos+1, poe);
                    var tj = {'smul': obj, 'total':total, 'pageNumber':req.query.pn, 'pageCount':pc, 'footinfo': st,'smrole':JSON.stringify(robj),'smdepartment':JSON.stringify(dobj),
                        'pages':ps, 'pos':pos+1, 'poe':poe,'isFirstPage': (req.query.pn-1)==0, 'isLastPage':req.query.pn==ps};
                    var tmpJSON = $.extend({}, app.get('CFG'), app.get('RESI18N')[LNG], tj);
                    res.render('sitemanage/user_list', tmpJSON);
                }
            });
        });
        });
    });
}
SMAuth.postUserAdd = function(app, req, res, callback){
    Commfun.getRes(app, req, res, function(LNG){
        var username = req.body.username;
        var realname = req.body.realname;
        var password = req.body.password;
        var pwdc = crypto.createHash('sha1').update(password+'54CMS').digest('hex');
        var role = req.body.role;
        var roletext = req.body.roletext;
        var department = req.body.department;
        var departmenttext = req.body.departmenttext;
        var tj = new smuser({
            username: username, realname: realname, password: pwdc, role: role, roletext: roletext,department:department,departmenttext:departmenttext
        });
        var k = {'username': username};
        if (req.body.opt == "2") {
            k = {'_id': ObjectID(req.body.id)};
            if (password==""){
                tj = {username: username, realname: realname, role: role, roletext: roletext,department:department,departmenttext:departmenttext};
            }else{
                tj = {username: username, realname: realname, password: pwdc, role: role, roletext: roletext,department:department,departmenttext:departmenttext};
            }
        }
        dbopt.get(smuser.NAME, k, function (err, obj) {
            if (err) {
                res.json({'success': false, 'tip': err});
            } else {
                if (obj) {
                    if (req.body.opt == "1") {
                        res.json({'success': false, 'tip': format(app.get('RESI18N')[LNG]['COMMON']['TIP']['EXIST'], name)});
                    } else {
                        dbopt.update(smuser.NAME, k, tj, function (err, c) {
                            if (err) {
                                res.json({'success': false, 'tip': err});
                            } else {
                                res.json({'success': true, 'url': '/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/userlist', 'isRedirect': false});
                            }
                        });
                    }
                } else {
                    if (req.body.opt == "1") {
                        dbopt.insert(smuser.NAME, tj, function (err) {
                            if (err) {
                                res.json({'success': false, 'tip': err});
                            } else {
                                res.json({'success': true, 'url': '/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/userlist', 'isRedirect': false});
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
SMAuth.postUserDel = function (app, req, res, callback) {
    var k = {'_id': ObjectID(req.body.did)};
    Commfun.getRes(app, req, res, function(LNG){
        dbopt.remove(smuser.NAME, k, function (err, c) {
            if (err) {
                res.json({'success': false, 'tip': err});
            } else {
                res.json({'success': true, 'url': '/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/userlist', 'isRedirect': false});
            }
        });
    });

}
//用户管理---结束