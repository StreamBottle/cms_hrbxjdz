function SMLink(smlink){
    this._id = smlink._id;//用户的标识，对当前公众号唯一
    this.name = smlink.name; //登录名
    this.logo = smlink.logo; //密码
    this.url = smlink.url; //真实姓名
    this.sortid = smlink.sortid; //角色
    this.isshow = smlink.isshow; //角色
};
SMLink.NAME="smlink";
module.exports = SMLink;
