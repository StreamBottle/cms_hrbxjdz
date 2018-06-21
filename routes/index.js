//var rsm_auth = require('./sitemanage/auth.js');
var rsm_frame = require('./sitemanage/frame.js');
//var rsm_system = require('./sitemanage/system.js');
//var rsm_upload = require('./sitemanage/upload.js');
var $ = require('jquery');

module.exports = function(app){
    app.get('/',function(req,res,next){rsm_frame.getGo(app, req, res, next)});
    app.get('/:uopt',function(req,res,next){rsm_frame.getGo(app, req, res, next)});
    app.get('/:uopt/:utype',function(req,res,next){rsm_frame.getGo(app, req, res, next)});
    app.get('/:uopt/:utype/:ukey',function(req,res,next){rsm_frame.getGo(app, req, res, next)});
    app.get('/:uopt/:utype/:ukey/:upage',function(req,res,next){rsm_frame.getGo(app, req, res, next)});
    app.post('/:uopt',function(req,res,next){rsm_frame.postGo(app, req, res, next)});
    app.post('/:uopt/:utype',function(req,res,next){rsm_frame.postGo(app, req, res, next)});
//    //系统管理首页
//    app.all('/'+app.get('CFG')['CONST']['SYSTEM']['MPATH'],function(req,res,next){authentication(app, req, res, '', next)});
//    app.get('/'+app.get('CFG')['CONST']['SYSTEM']['MPATH'],function(req,res){ rsm_frame.getIndex(app, req, res);});
//    //系统管理登录
//    app.get('/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/login',function(req,res){ rsm_auth.getLogin(app, req, res);});
//    app.post('/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/login',function(req,res){ rsm_auth.postLogin(app, req, res);});
//    app.all('/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/logout',function(req,res){ rsm_auth.allLogout(app, req, res);});
//    app.post('/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/cpwd',function(req,res){ rsm_auth.postChangePassword(app, req, res);});
//    //系统管理首页
//    app.all('/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/index',function(req,res,next){authentication(app, req, res, '', next)});
//    app.get('/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/index',function(req,res){ rsm_frame.getIndex(app, req, res);});
//    //网站信息
//    app.get('/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/site',function(req,res){ rsm_system.getSite(app, req, res);});
//    app.post('/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/site',function(req,res){ rsm_system.postSite(app, req, res);});
//    //上传
//    app.all('/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/upload',function(req,res){ rsm_upload.allUpload(app, req, res);});
//    //角色列表
//    app.all('/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/rolelist',function(req,res,next){authentication(app, req, res, 'rolelist', next)});
//    app.get('/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/rolelist',function(req,res){ rsm_auth.getRoleList(app, req, res);});
//    app.all('/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/smrlskip',function(req,res,next){authentication(app, req, res, 'rolelist', next)});
//    app.get('/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/smrlskip',function(req,res){ rsm_auth.getRoleListSkip(app, req, res);});
//    app.all('/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/roleadd',function(req,res,next){authentication(app, req, res, 'rolelist', next)});
//    app.post('/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/roleadd',function(req,res){ rsm_auth.postRoleAdd(app, req, res);});
//    app.all('/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/roledel',function(req,res,next){authentication(app, req, res, 'rolelist', next)});
//    app.post('/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/roledel',function(req,res){ rsm_auth.postRoleDel(app, req, res);});
//    //用户列表
//    app.all('/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/userlist',function(req,res,next){authentication(app, req, res, 'userlist', next)});
//    app.get('/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/userlist',function(req,res){ rsm_auth.getUserList(app, req, res);});
//    app.all('/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/smulskip',function(req,res,next){authentication(app, req, res, 'userlist', next)});
//    app.get('/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/smulskip',function(req,res){ rsm_auth.getUserListSkip(app, req, res);});
//    app.all('/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/useradd',function(req,res,next){authentication(app, req, res, 'userlist', next)});
//    app.post('/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/useradd',function(req,res){ rsm_auth.postUserAdd(app, req, res);});
//    app.all('/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/userdel',function(req,res,next){authentication(app, req, res, 'userlist', next)});
//    app.post('/'+app.get('CFG')['CONST']['SYSTEM']['MPATH']+'/userdel',function(req,res){ rsm_auth.postUserDel(app, req, res);});
}

function authentication(app, req, res, url, next) {
    if (!req.session.user) {
        rsm_auth.getLogin(app, req, res);
    }else{
        if ($.inArray(url, req.session.power) != -1 || url == ''){
            next();
        }else{
            rsm_frame.getIndex(app, req, res);
        }
    }
}
