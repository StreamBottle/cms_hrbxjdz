var crypto = require('crypto');
var dbopt = require('../../modules/dbopt');
var Commfun = require('../../modules/commfun.js');
var $ = require('jquery');
var smuser = require('../../modules/sitemanage/user.js');
var rsm_auth = require('./auth.js');
var rsm_system = require('./system.js');
var rsm_upload = require('./upload.js');
var rsm_article = require('./article.js');
var rss_show = require('../show.js');


function SMFrame(smframe) {}

module.exports = SMFrame;

SMFrame.getGo = function (app, req, res, callback) {
    var uopt = req.param('uopt');
    var utype = req.param('utype');
    if (uopt == app.get('CFG').CONST.SYSTEM.MPATH){
        if (!req.session.user) {
            rsm_auth.getLogin(app, req, res);
            //res.redirect('/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+"/login");
            return;
        }else{
            var url = '';
            switch(utype){
                case "login":rsm_auth.getLogin(app, req, res); break;
                case "logout":rsm_auth.allLogout(app, req, res); break;
                case "index": url = ''; break;
                case "site":url = 'site'; break;
                case "upload": url = ''; break;
                case "rolelist": url = 'rolelist'; break;
                case "smrlskip": url = 'rolelist'; break;
                case "userlist": url = 'userlist'; break;
                case "smulskip": url = 'userlist';; break;
                case "departmentlist": url = 'departmentlist'; break;
                case "smdlskip": url = 'departmentlist';; break;
                case "linklist": url = 'linklist'; break;
                case "smllskip": url = 'linklist'; break;
                case "channel": url = 'channel'; break;
                case "smclskip": url = 'channel';; break;
                case "template": url = 'template'; break;
                case "smtlskip": url = 'template'; break;
                case "fmpanel": url = 'template'; break;
                case "kqzlrb": url = 'kqzlrb'; break;
                case "smto01lskip": url = 'kqzlrb'; break;
                case "szzb": url = 'szzb'; break;
                case "smto02lskip": url = 'szzb'; break;
                case "kqzlrbnew": url = 'kqzlrb'; break;
                case "kqzlrbnskip": url = 'kqzlrb'; break;
                case "szzbnew": url = 'szzb'; break;
                case "szzbnskip": url = 'szzb'; break;
                default: url = ''; break;
            }
            if ($.inArray(url, req.session.power) == -1 && url != ''){
                SMFrame.getIndex(app, req, res);
                return;
            }
        }
        switch(utype){
            case "login":rsm_auth.getLogin(app, req, res); break;
            case "logout":rsm_auth.allLogout(app, req, res); break;
            case "index": SMFrame.getIndex(app, req, res); break;
            case "site":rsm_system.getSite(app, req, res); break;
            case "upload":rsm_upload.allUpload(app, req, res); break;
            case "rolelist": rsm_auth.getRoleList(app, req, res); break;
            case "smrlskip": rsm_auth.getRoleListSkip(app, req, res); break;
            case "userlist": rsm_auth.getUserList(app, req, res); break;
            case "smulskip": rsm_auth.getUserListSkip(app, req, res); break;
            case "linklist": rsm_system.getLinkList(app, req, res); break;
            case "smllskip": rsm_system.getLinkListSkip(app, req, res); break;
            case "channel": rsm_system.getChannelList(app, req, res); break;
            case "smclskip": rsm_system.getChannelListSkip(app, req, res); break;
            case "template": rsm_system.getTemplateList(app, req, res); break;
            case "smtlskip": rsm_system.getTemplateListSkip(app, req, res); break;
            case "fmpanel":rsm_upload.getFileManage(app, req, res);break;
            case "information":rsm_article.getArticle(app, req, res);break;
            case "smalskip": rsm_article.getArticleListSkip(app, req, res); break;
            case "particle": rsm_article.getArticlePublish(app, req, res); break;
            case "kqzlrb": rsm_system.getTempOpt01List(app, req, res); break;
            case "kqzlrbskip": rsm_system.getTempOpt01Skip(app, req, res); break;
            case "szzb": rsm_system.getTempOpt02List(app, req, res); break;
            case "szzbskip": rsm_system.getTempOpt02Skip(app, req, res); break;
            case "kqzlrbnew": rsm_system.getTempOpt01NList(app, req, res); break;
            case "kqzlrbnskip": rsm_system.getTempOpt01NSkip(app, req, res); break;
            case "szzbnew": rsm_system.getTempOpt02NList(app, req, res); break;
            case "szzbnskip": rsm_system.getTempOpt02NSkip(app, req, res); break;
            case "departmentlist": rsm_system.getDepartmentList(app, req, res); break;
            case "smdlskip": rsm_system.getDepartmentSkip(app, req, res); break;
            default: rsm_auth.getLogin(app, req, res); break;
        }
    }else{
        if (uopt === undefined){
            rss_show.getIndex(app, req, res);
        }else{
            switch (uopt.toLowerCase()){
                case "channel":
                    if (utype.toLowerCase()==="jgsz"){
                        rss_show.getDepartment(app, req, res); break;
                    }else{
                        rss_show.getChannel(app, req, res); break;
                    }
                case "article":
                    rss_show.getArticle(app, req, res); break;
                default:
                    rss_show.getIndex(app, req, res); break;
            }
        }
    }
}

SMFrame.postGo = function (app, req, res, callback) {
    var uopt = req.param('uopt');
    var utype = req.param('utype');
    if (uopt == app.get('CFG').CONST.SYSTEM.MPATH){
        switch(utype){
            case "login": rsm_auth.postLogin(app, req, res); break;
            case "logout": rsm_auth.allLogout(app, req, res); break;
            case "cpwd": rsm_auth.postChangePassword(app, req, res); break;
            case "site": rsm_system.postSite(app, req, res); break;
            case "upload": rsm_upload.allUpload(app, req, res); break;
            case "roleadd": rsm_auth.postRoleAdd(app, req, res); break;
            case "roledel": rsm_auth.postRoleDel(app, req, res); break;
            case "useradd": rsm_auth.postUserAdd(app, req, res); break;
            case "userdel": rsm_auth.postUserDel(app, req, res); break;
            case "linkadd": rsm_system.postLinkAdd(app, req, res); break;
            case "linkdel": rsm_system.postLinkDel(app, req, res); break;
            case "channeladd": rsm_system.postChannelAdd(app, req, res); break;
            case "channeldel": rsm_system.postChannelDel(app, req, res); break;
            case "templateadd": rsm_system.postTemplateAdd(app, req, res); break;
            case "templatedel": rsm_system.postTemplateDel(app, req, res); break;
            case "createdir": rsm_upload.postCreateDir(app, req, res); break;
            case "renamedir": rsm_upload.postRenameDir(app, req, res); break;
            case "deletedir": rsm_upload.postDeleteDir(app, req, res); break;
            case "filelist": rsm_upload.postFileList(app, req, res); break;
            case "createfile": rsm_upload.postCreateFile(app, req, res); break;
            case "deletefile": rsm_upload.postDeleteFile(app, req, res); break;
            case "readfile": rsm_upload.postReadFile(app, req, res); break;
            case "infoadd": rsm_article.postInformationAdd(app, req, res); break;
            case "infodel": rsm_article.postInformationDel(app, req, res); break;
            case "kqzlrbadd": rsm_system.postTempOpt01Add(app, req, res); break;
            case "kqzlrbdel": rsm_system.postTempOpt01Del(app, req, res); break;
            case "szzbadd": rsm_system.postTempOpt02Add(app, req, res); break;
            case "szzbdel": rsm_system.postTempOpt02Del(app, req, res); break;
            case "kqzlrbnadd": rsm_system.postTempOpt01NAdd(app, req, res); break;
            case "kqzlrbndel": rsm_system.postTempOpt01NDel(app, req, res); break;
            case "szzbnadd": rsm_system.postTempOpt02NAdd(app, req, res); break;
            case "szzbndel": rsm_system.postTempOpt02NDel(app, req, res); break;
            case "departmentadd": rsm_system.postDepartmentAdd(app, req, res); break;
            case "departmentdel": rsm_system.postDepartmentDel(app, req, res); break;
            default: rsm_auth.postLogin(app, req, res); break;
        }
    }
}

SMFrame.getIndex = function (app, req, res, callback) {
    Commfun.getRes(app, req, res, function(LNG){
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
            var tmpJSON = $.extend({}, app.get('CFG'), app.get('RESI18N')[LNG],{'smmenu':h}, {'USERINFO':req.session.user});
            res.render('sitemanage/frame', tmpJSON);
        });
}