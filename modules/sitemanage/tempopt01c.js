function SMTempOpt01C(smtempopt01c){
    this._id = smtempopt01c._id;//用户的标识，对当前公众号唯一
    this.pid = smtempopt01c.pid;//用户的标识，对当前公众号唯一
    this.cityname = smtempopt01c.cityname; //名称
    this.sywrw = smtempopt01c.sywrw; //名称
    this.dj = smtempopt01c.dj; //名称
    this.aqi = smtempopt01c.aqi; //名称
};
SMTempOpt01C.NAME="smtempopt01c";
module.exports = SMTempOpt01C;
