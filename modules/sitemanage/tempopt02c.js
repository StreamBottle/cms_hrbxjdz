function SMTempOpt02C(smtempopt02c){
    this._id = smtempopt02c._id;//用户的标识，对当前公众号唯一
    this.pid = smtempopt02c.pid;//用户的标识，对当前公众号唯一
    this.jcdm = smtempopt02c.jcdm; //名称
    this.jl = smtempopt02c.jl; //名称
};
SMTempOpt02C.NAME="smtempopt02c";
module.exports = SMTempOpt02C;