/**
 * Module dependencies.
 */

var express = require('express');
var routes = require(__dirname+'/routes');
var http = require('http');
var path = require('path');

var format = require('util').format;
var MongoStore = require('connect-mongo')(express);
var options = require(__dirname+'/modules/options');
//var flash = require('connect-flash');
var fs = require('fs');
var cfg = require(__dirname+'/locales/config').Config;

var app = express();

var resi18n = new Array();
function getAllRes(root){
    var res = new Array();
    var files = fs.readdirSync(root);
    files.forEach(function(file){
        var pathname = root+'/'+file
            ,stat = fs.lstatSync(pathname);
        if (stat.isDirectory()){
            changeRes(file);
            res.push(file);
        }
    });
    return res
}
function changeRes(lng){
    fs.readFile(__dirname+"/locales/"+lng+"/resources.json", function (err, data) {
        if (err) {
            throw err;
        }
        resi18n[lng] = JSON.parse(data);
    });
}
app.set('INRES',getAllRes(__dirname+'/locales'));
app.set('RESI18N',resi18n);
app.set('CFG', cfg);
// all environments
app.set('port', process.env.PORT || 30021);
app.set('views', __dirname + '/views');
app.set('rootPath', __dirname);
app.set('view engine', 'ejs');
//app.use(flash());
app.use(express.favicon());
app.use(express.urlencoded());
app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname+'/public/uploadtmp'}));
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
    secret: options.cookieSecret,
    key: options.db,
    cookie: {maxAge: 1000 * 60 * 30},//30 minute
    store: new MongoStore({url: format("mongodb://%s:%s@%s:%s/%s", options.uid, options.pwd, options.host, options.port, options.db)})
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

routes(app);

