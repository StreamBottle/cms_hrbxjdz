function SMDepariment(smdepariment){
    this._id = smdepariment._id;//用户的标识，对当前公众号唯一
    this.name = smdepariment.name; //名称
    this.key = smdepariment.key; //标识
};
SMDepariment.NAME="smdepariment";
module.exports = SMDepariment;
