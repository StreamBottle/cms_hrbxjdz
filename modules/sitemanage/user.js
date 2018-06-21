function SMUser(smuser){
    this._id = smuser._id;//用户的标识，对当前公众号唯一
    this.username = smuser.username; //登录名
    this.password = smuser.password; //密码
    this.realname = smuser.realname; //真实姓名
    this.role = smuser.role; //角色
    this.roletext = smuser.roletext; //角色
    this.department = smuser.department; //部门
    this.departmenttext = smuser.departmenttext; //部门
};
SMUser.NAME="smuser";
module.exports = SMUser;

//db.smuser.insert({account:'admin'