var options = require('./options');
var format = require('util').format;
var MongoClient = require('mongodb').MongoClient;

module.exports = function(callback){
console.log(options.uid);
console.log(options.pwd);
console.log(options.host);
console.log(options.port);
console.log(options.db);
console.log(format("mongodb://%s:%s@%s:%s/%s?auto_reconnect=%s,poolSize=%s"
        ,options.uid, options.pwd, options.host, options.port, options.db
        , options.auto_reconnect||false, options.poolSize||1));
    MongoClient.connect(format("mongodb://%s:%s@%s:%s/%s?auto_reconnect=%s,poolSize=%s"
        ,options.uid, options.pwd, options.host, options.port, options.db
        , options.auto_reconnect||false, options.poolSize||1), function(err, db) {
        if(err){
			console.log(err);
			callback(err);
			return 
		}
        callback(null,db);
    });
}


