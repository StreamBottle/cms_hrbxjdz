function Article(article){
    this._id = article._id;//用户的标识，对当前公众号唯一
    this.achannel = article.achannel; //所属栏目
    this.title = article.title; //标题
    this.atype = article.atype; //类型 1 html 2 pdf
    this.atime = article.atime; //编写时间
    this.author = article.author; //作者
    this.authorid = article.authorid; //作者
    this.pdate = article.pdate; //发布日期
    this.aurl = article.aurl; //图片或PDF地址
    this.isshow = article.isshow; //是否在首页图片信息中显示
    this.acontent = article.acontent; //文章内容
    this.description = article.description; //文章简介
};
Article.NAME="article";
module.exports = Article;
