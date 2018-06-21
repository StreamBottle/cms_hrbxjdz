function SMRole(smrole){
    this._id = smrole._id;//用户的标识，对当前公众号唯一
    this.name = smrole.name; //角色名
    this.power = smrole.power; //权限ID
    this.powertext = smrole.powertext; //权限名称
};
SMRole.NAME="smrole";
module.exports = SMRole;