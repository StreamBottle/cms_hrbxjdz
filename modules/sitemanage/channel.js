function SMChannel(smchannel){
    this._id = smchannel._id;//用户的标识，对当前公众号唯一
    this.parentkey = smchannel.parentkey; //父栏目标识
    this.name = smchannel.name; //名称
    this.stype = smchannel.stype; //标识
    this.key = smchannel.key; //标识
    this.ismenu = smchannel.ismenu; //是否是菜单
    this.hassub = smchannel.hassub; //是否是文章
    this.sortid = smchannel.sortid; //排序
};
SMChannel.NAME="smchannel";
module.exports = SMChannel;
