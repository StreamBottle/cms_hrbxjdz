function SMTemplate(smtemplate){
    this._id = smtemplate._id;//用户的标识，对当前公众号唯一
    this.name = smtemplate.name; //名称
    this.key = smtemplate.key; //标识
    this.ismenu = smtemplate.ismenu; //是否启用
};
SMTemplate.NAME="smtemplate";
module.exports = SMTemplate;
