function funGetClientWH(){
    var myWidth = 0, myHeight = 0;
    if (/msie/.test(navigator.userAgent.toLowerCase())){
        myWidth = document.documentElement.clientWidth;
        myHeight = document.documentElement.clientHeight;
    }else{
        myWidth = window.innerWidth;
        myHeight = window.innerHeight;
    }
    return [myWidth, myHeight];
}
//浏览器改变大小
function funResize(){
    var wh=funGetClientWH();
    var tth=Number(wh[1]);
    var ttw=Number(wh[0]);
    $('#nav').css("height", (wh[1]-70)+"px");
    $('#article').css("height", (wh[1]-70)+"px");
    $('#article').css("width", (wh[0]-214)+"px");
}
function loadArticle(url, isRedirect){
    if (isRedirect){
        window.location.href = url;
    }else{
        $("#article").load(url);
    }
}
$(document).ready(function(){
    funResize();
});