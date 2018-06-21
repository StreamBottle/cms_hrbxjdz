var pool = require('./db');

function DBOpt(dbopt){}

module.exports = DBOpt;

DBOpt.insert = function(tabname, obj, callback) {
    pool.acquire(function(err, db) {
        if (err) {
            return callback(err);
        } else {
            db.collection(tabname, function(err, collection){
                if(err){
                    return callback(err);
                }
                collection.insert(obj,{safe: true}, function(err, obj){
                    callback(err, obj);
                });
            });
        }
    });
};

DBOpt.update = function(tabname, k, obj, callback) {
    pool.acquire(function(err, db) {
        if (err) {
            return callback(err);
        } else {
            db.collection(tabname, function(err, collection){
                if(err){
                    return callback(err);
                }
                collection.update(k,{'$set':obj},{safe:true,upsert:true,multi:false},
                    function(err, count){
                        callback(err, count);
                    });
            });
        }
    });
};

DBOpt.remove = function(tabname, k, callback) {
    pool.acquire(function(err, db) {
        if (err) {
            return callback(err);
        } else {
            db.collection(tabname, function(err, collection){
                if(err){
                    return callback(err);
                }
                collection.remove(k,{safe:true, multi:false},
                    function(err, count){
                        callback(err, count);
                    });
            });
        }
    });
};

DBOpt.get = function(tabname, k, callback){
    pool.acquire(function(err, db) {
        if (err) {
            return callback(err);
        } else {
            db.collection(tabname, function(err, collection){
                if(err){
                    return callback(err);
                }
                collection.findOne(k, function(err, rs){
                    if(rs){
                        callback(err, rs);//成功！返回查询的用户信息
                    } else {
                        callback(err, null);//失败！返回null
                    }
                });
            });
        }
    });
};

DBOpt.getAll = function(tabname, k, o, callback){
    pool.acquire(function(err, db) {
        if (err) {
            return callback(err);
        } else {
            db.collection(tabname, function(err, collection){
                if(err){
                    return callback(err);
                }
                //使用 count 返回总文档数 total
                collection.find(k).count(function(err, total){
                    //根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的10个结果
                    collection.find(k, o).toArray(function (err, obj) {
                        if (err) {
                            callback(err, null);//失败！返回 null
                        }
                        callback(null, obj, total);
                    });
                });
            });
        }
    });
};

DBOpt.getEx = function(tabname, k, f, callback){
    pool.acquire(function(err, db) {
        if (err) {
            return callback(err);
        } else {
            db.collection(tabname, function(err, collection){
                if(err){
                    return callback(err);
                }
                collection.findOne(k, f, function(err, rs){
                    if(rs){
                        callback(err, rs);//成功！返回查询的用户信息
                    } else {
                        callback(err, null);//失败！返回null
                    }
                });
            });
        }
    });
};

DBOpt.getAllEx = function(tabname, k, f, o, callback){
    pool.acquire(function(err, db) {
        if (err) {
            return callback(err);
        } else {
            db.collection(tabname, function(err, collection){
                if(err){
                    return callback(err);
                }
                //使用 count 返回总文档数 total
                collection.find(k).count(function(err, total){
                    //根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的10个结果
                    collection.find(k, f, o).toArray(function (err, obj) {
                        if (err) {
                            callback(err, null);//失败！返回 null
                        }
                        callback(null, obj, total);
                    });
                });
            });
        }
    });
};

DBOpt.getSkip = function(tabname, k, p, pc, callback){
    pool.acquire(function(err, db) {
        if (err) {
            return callback(err);
        } else {
            db.collection(tabname, function(err, collection){
                if(err){
                    return callback(err);
                }
                //使用 count 返回总文档数 total
                collection.find(k).count(function(err, total){
                    //根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的10个结果
                    collection.find(k).skip((parseInt(p)-1)*parseInt(pc)).limit(parseInt(pc)).toArray(function (err, obj) {
                        if (err) {
                            callback(err, null);//失败！返回 null
                        }
                        callback(null, obj, total);
                    });
                });
            });
        }
    });
};

DBOpt.getSkipEx = function(tabname, k, f, p, pc, callback){
    pool.acquire(function(err, db) {
        if (err) {
            return callback(err);
        } else {
            db.collection(tabname, function(err, collection){
                if(err){
                    return callback(err);
                }
                //使用 count 返回总文档数 total
                collection.find(k).count(function(err, total){
                    //根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的10个结果
                    collection.find(k, f).skip((parseInt(p)-1)*parseInt(pc)).limit(parseInt(pc)).toArray(function (err, obj) {
                        if (err) {
                            callback(err, null);//失败！返回 null
                        }
                        callback(null, obj, total);
                    });
                });
            });
        }
    });
};
