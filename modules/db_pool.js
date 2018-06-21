var poolModule = require('generic-pool')
    ,MongoClient = require('mongodb').MongoClient
    ,options = require('./options')
    ,format = require('util').format;

var pool = poolModule.Pool({
    name: options.poolName
    ,create:function(callback) {
        MongoClient.connect(format("mongodb://%s:%s@%s:%s/%s?auto_reconnect=%s,poolSize=%s"
            ,options.uid, options.pwd, options.host, options.port, options.db
            , options.auto_reconnect||false, options.poolSize||1), function(err, db) {
            if(err)return callback(err);
            callback(null,db);
        });
    },
    destroy  : function(db) { db.close(); },
    max      : 10000,
    idleTimeoutMillis : 100,
    log : false
});

module.exports = pool;


