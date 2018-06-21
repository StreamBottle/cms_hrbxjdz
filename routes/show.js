var dbopt = require('../modules/dbopt');
var Commfun = require('../modules/commfun.js');
var $ = require('jquery');
var format = require('util').format;
var ObjectID = require('mongodb').ObjectID;
var smchannel = require('../modules/sitemanage/channel.js');
var smlink = require('../modules/sitemanage/link.js');
var article = require('../modules/sitemanage/article.js');
var smtempopt01 = require('../modules/sitemanage/tempopt01.js');
var smtempopt01c = require('../modules/sitemanage/tempopt01c.js');
var smtempopt02 = require('../modules/sitemanage/tempopt02.js');
var smtempopt02c = require('../modules/sitemanage/tempopt02c.js');

var Fiber = require('fibers');
var Future = require('fibers/future');
var wait = Future.wait;
var fs = require('fs');

function SShow(show) {
}

module.exports = SShow;

//系统设置---开始

SShow.getIndex = function (app, req, res, callback) {
    var theme = app.get('CFG')['CONST']['SYSTEM']['THEME']
    readMenu(function (e, obj) {
        var omenu = obj;
        if (e) {
        } else {
            var k = {'key': {$nin: ['ROOT', 'SINGLE']}};
            var o = {"sort": "sortid"}
            readChannel(k, o, function (e, obj) {
                var ochannel = obj;
                if (e) {
                } else {
                    readLink(function (e, obj) {
                        var olink = obj;
                        if (e) {
                        } else {
                            var k = {'isshow': 1, 'atype': "1"};
                            var o = {"sort": {"atime": -1}, "limit": 4, "skip": 0}
                            var f = {'_id': 1, 'title': 1, 'pdate': 1, 'atype': 1, 'aurl': 1};
                            readImages(k, f, o, function (e, obj) {
                                var schannel = "";
                                for (i = 0; i < ochannel.length; i++) {
                                    schannel += "\"" + ochannel[i].key + "\":" + JSON.stringify(ochannel[i]) + ",";
                                }
                                if (schannel.length > 2) {
                                    schannel = "{" + schannel.substring(0, schannel.length - 1) + "}"
                                }
                                var tmpJSON = $.extend({}, app.get('CFG'), {ochannel: ochannel}, {"CUSTOM": {"MENU": omenu, "CHANNEL": JSON.parse(schannel), "CURRENTI": "/", "LINK": olink, "IMAGES": obj}});
                                var readarticles = Future.wrap(readArticles);
                                var tt = Fiber(function (json) {
                                    var sarticle = "";
                                    for (var i = 0; i < json.ochannel.length; i++) {
                                        if (i < json.ochannel.length) {
                                            var k = {'achannel': json.ochannel[i].key};
                                            var o = {"sort": {"atime": -1}, "limit": 4, "skip": 0}
                                            var f = {'_id': 1, 'title': 1, 'pdate': 1, 'atype': 1, 'aurl': 1,'description':1};
                                            var t = readarticles(k, f, o).wait();
                                            sarticle += "\"" + json.ochannel[i].key + "\":" + JSON.stringify(t) + ",";
                                        }
                                    }
                                    if (schannel.length > 2) {
                                        sarticle = "{" + sarticle.substring(0, sarticle.length - 1) + "}"
                                    }
                                    var tmpJSON = $.extend({}, json, {"ARTICLELIST": JSON.parse(sarticle)});
                                    res.render(theme + '/index', tmpJSON);
                                });
                                var ttt = tt.run(tmpJSON);
                            });
                        }
                    })
                }
            });
        }
    });
}
SShow.getChannel = function (app, req, res, callback) {
    var uopt = req.param('uopt');
    var utype = req.param('utype');
    var ukey = req.param('ukey');
    var upage = req.param('upage') ? req.param('upage') : 1;
    var surl = "/channel/" + utype + "/" + ukey + "/";
    var pcc = 16;
    var pn = upage;
    var theme = app.get('CFG')['CONST']['SYSTEM']['THEME']
    readMenu(function (e, obj) {
        var omenu = obj;
        if (e) {
        } else {
            var k = "";
            if (utype == 'ROOT' || utype == 'SINGLE') {
                k = {'key': ukey};
            } else {
                k = {'parentkey': utype, 'key': {$nin: ['ROOT', 'SINGLE']}};
            }
            var o = {"sort": "sortid"}
            if (utype == 'SINGLE') {
                k = {'achannel': ukey};
                readArticle(k, function (e, obj) {
                    var tmpJSON = $.extend({}, app.get('CFG'), {"CUSTOM": {"MENU": omenu, "CURRENTI": ukey}, "ARTICLE": obj});
					var target_path = theme + '/single_' + ukey;
                    if (fs.existsSync(__dirname+"/../views/" + target_path + '.ejs')) {
                        res.render(target_path, tmpJSON);
                    } else {
                        res.render(theme + '/single', tmpJSON);
                    }
                });
            } else {
			readChannel(k, o, function (e, obj) {
                var ochannel = obj;
                if (e) {
                } else {
                var q = {'achannel': ukey};
                var f = {'_id': 1, 'title': 1, 'pdate': 1, 'atype': 1, 'aurl':1, 'acontent':1,'description':1};
                var s = {"sort": {"atime": -1}};
                dbopt.getSkipEx(article.NAME, q, f, s, pn, pcc, function (err, obj, total) {
                    if (err) {
                        res.json({'success': false, 'tip': err});
                    } else {
                        if (total === 1 && obj[0].atype === '4'){
                            var tj={'smac': obj};
                            var tmpJSON = $.extend({}, app.get('CFG'),tj, {"CUSTOM": {"MENU": omenu,"CHANNEL": ochannel,"CURRENTC": ukey, "CURRENTI": ukey}});
                            var target_path = theme + '/channelsingle_' + ukey;
                            if (fs.existsSync(__dirname+"/../views/" + target_path + '.ejs')) {
                                res.render(target_path, tmpJSON);
                            } else {
								target_path = theme + '/channelsingle_' + utype;
								if (fs.existsSync(__dirname+"/../views/" + target_path + '.ejs')) {
									res.render(target_path, tmpJSON);
								} else {
									res.render(theme + '/channelsingle', tmpJSON);
								}
                            }
                        }else{
                            var pos = ((parseInt(pn) - 1) * pcc);
                            var pc = pn * pcc > total ? total - pos : pcc;
                            var poe = parseInt(pos) + parseInt(pcc);
                            var ps = Math.ceil(parseInt(total) / pcc);
                            if (ps == 0) {
                                ps = 1;
                            }
                            var st = format("共&nbsp;%s&nbsp;页&nbsp;%s&nbsp;条记录&nbsp;&nbsp;&nbsp;当前为&nbsp;<input id='pn' name='pn' type='text' VTypes='label:页码;required:true;' style='width:30px;padding:0px;margin-bottom:0px;height:20px;' value='%s'/>&nbsp;页&nbsp;从第&nbsp;%s&nbsp;条到第&nbsp;%s&nbsp;条", ps, total, pn, pos + 1, poe);
                            var tj = {'smal': obj, 'total': total, 'pageNumber': pn, 'pageCount': pc, 'footinfo': st, 'surl': surl,
                                'pages': ps, 'pos': pos + 1, 'poe': poe, 'isFirstPage': (pn - 1) == 0, 'isLastPage': pn == ps};
                            var tmpJSON = $.extend({}, app.get('CFG'), tj, {"CUSTOM": {"MENU": omenu,"CHANNEL": ochannel,"CURRENTC": ukey, "CURRENTI": ukey}});
                            var target_path = theme + '/channel_' + ukey;
                            if (fs.existsSync(__dirname+"/../views/" + target_path + '.ejs')) {
                                res.render(target_path, tmpJSON);
                            } else {
								target_path = theme + '/channel_' + utype;
								if (fs.existsSync(__dirname+"/../views/" + target_path + '.ejs')) {
									res.render(target_path, tmpJSON);
								} else {
									res.render(theme + '/channel', tmpJSON);
								}
                            }
                        }
                    }
                });
				}
			});
            }
        }
    });
}
SShow.getArticle = function (app, req, res, callback) {
    var utype = req.param('utype');
    var ukey = req.param('ukey');
    var upage = req.param('upage');
    var theme = app.get('CFG')['CONST']['SYSTEM']['THEME']
    readMenu(function (e, obj) {
        var omenu = obj;
        if (e) {

        } else {
            var k = {'_id': ObjectID(ukey)};
            readArticle(k, function (e, obj) {
                if (utype === "1") {
                    var urls = obj.aurl.split(";");
                    var simages = '<p class="media-picker-field media-picker-field-image" style="text-align:center">';
                    for (var i = 0; i < urls.length; i++) {
                        if (urls[i] != "")
                            simages += '<img src="' + urls[i] + '"><br>';
                    }
                    simages += '</p>';
                    var tmpJSON = $.extend({}, app.get('CFG'), {"CUSTOM": {"MENU": omenu, "CURRENTI": ukey}, "ARTICLE": obj, "ARTICLEIMAGE": simages});
                    res.render(theme + '/article', tmpJSON);
                } else if (utype === "2") {
                    var tmpJSON = $.extend({}, app.get('CFG'), {"CUSTOM": {"MENU": omenu, "CURRENTI": ukey}, "ARTICLE": obj});
                    res.render(theme + '/article_pdf', tmpJSON);
                } else if (utype === "3") {
                    var tmpJSON = $.extend({}, app.get('CFG'), {"CUSTOM": {"MENU": omenu, "CURRENTI": ukey}, "ARTICLE": obj});
                    res.render(theme + '/article_swf', tmpJSON);
                } else {
                    var urls = obj.aurl.split(";");
                    var simages = '<p class="media-picker-field media-picker-field-image" style="text-align:center">';
                    for (var i = 0; i < urls.length; i++) {
                        if (urls[i] != "")
                            simages += '<img src="' + urls[i] + '"><br>';
                    }
                    simages += '</p>';
                    var tmpJSON = $.extend({}, app.get('CFG'), {"CUSTOM": {"MENU": omenu, "CURRENTI": ukey}, "ARTICLE": obj, "ARTICLEIMAGE": simages});
                    res.render(theme + '/article', tmpJSON);
                }
            });
        }
    });
}
function readMenu(callback) {
    var q = {'ismenu': 1};
    var options = {"sort": "sortid"}
    dbopt.getAll(smchannel.NAME, q, options, function (err, obj, total) {
        var tmpJSON;
        if (err) {
            callback(err);
        } else {
            var o = [
                {stype: "2", key: "/", name: "首页", hassub: 0, parentkey: "ROOT"}
            ].concat(obj);
            callback(null, o);
        }
    });
}
function readChannel(k, o, callback) {
    dbopt.getAll(smchannel.NAME, k, o, function (err, obj, total) {
        if (err) {
            callback(err);
        } else {
            callback(null, obj);
        }
    });
}
function readLink(callback) {
    var q = {'isshow': 1};
    var options = {"sort": {"sortid": 1}, "limit": 7, "skip": 0}
    dbopt.getAll(smlink.NAME, q, options, function (err, obj, total) {
        var tmpJSON;
        if (err) {
            callback(err);
        } else {
            callback(null, obj);
        }
    });
}
function readImages(k, f, o, callback) {
    dbopt.getAllEx(article.NAME, k, f, o, function (err, obj, total) {
        if (err) {
            callback(err);
        } else {
            callback(null, obj);
        }
    });
}
function readArticle(k, callback) {
    dbopt.get(article.NAME, k, function (err, obj, total) {
        if (err) {
            callback(err);
        } else {
            callback(null, obj);
        }
    });
}
function readArticles(k, f, o, callback) {
    dbopt.getAllEx(article.NAME, k, f, o, function (err, obj, total) {
        if (err) {
            callback(err);
        } else {
            callback(null, obj);
        }
    });
}
function readCustomOpt01c(callback) {
    var k = {};
    var o = {'sort': {'sdate': -1}, "limit": 1, "skip": 0}
    dbopt.getAll(smtempopt01.NAME, k, o, function (err, obj, total) {
        if (err) {
            callback(err);
        } else {
            if (total == 0) callback(null, null);
            k = {'pid': obj[0].sdate};
            o = {};
            dbopt.getAll(smtempopt01c.NAME, k, o, function (err, obj, total) {
                if (err) {
                    callback(err);
                } else {
                    if (total == 0) callback(null, null);
                    callback(null, obj);
                }
            });
        }
    });
}
function readCustomOpt02c(callback) {
    var k = {};
    var o = {'sort': {'sdate': -1}, "limit": 1, "skip": 0}
    dbopt.getAll(smtempopt02.NAME, k, o, function (err, obj, total) {
        if (err) {
            callback(err);
        } else {
            if (total == 0) callback(null, null);
            k = {'pid': obj[0].sdate};
            o = {};
            dbopt.getAll(smtempopt02c.NAME, k, o, function (err, obj, total) {
                if (err) {
                    callback(err);
                } else {
                    if (total == 0) callback(null, null);
                    callback(null, obj);
                }
            });
        }
    });
}