/* 
    Document   : verification
    Created on : 2012-3-9, 17:28:58
    Author     : Sanpo
    Description：验证各种已知类型
 */

(function($) {
    //绑定验证事件
    $.fn.checkForm = function() {
        var AVT={
            REQUIRED:1,
            CHECK:2,
            TIP:3,
			LABEL:4
        };
        var AC={
            NUMBER:1,
            MINMAX:2,
            SAME:3
        };
        var els=$(this).find('[VTypes]');
        for (var i=0; i<els.length; i++){
            var el=els[i];
			var gV=$('#'+el.id).attr("VTypes");
            $('#'+el.id).tipsy();
                var gAv=gV.split(";");
                var gBolR=false, gLabel="", gTipid="";
                for (var j=0; j<gAv.length; j++){
                    var gAvtt=gAv[j].split(":");
                    switch (AVT[gAvtt[0].toUpperCase()]){
                        case 1:
                            gBolR=gAvtt[1].toUpperCase()=="TRUE"?true:false;
                            break;
                        case 3:
                            gTipid=gAvtt[1];
                            break;
						case 4:
							gLabel=gAvtt[1];
                            break;
                    }
                }
            $('#'+els[i].id).bind("blur",function(){
                var v=$('#'+this.id).attr("VTypes");
                var av=v.split(";");
                var bolR=false, strC="", tipid="", label="";
                for (var j=0; j<av.length; j++){
                    var avtt=av[j].split(":");
                    switch (AVT[avtt[0].toUpperCase()]){
                        case 1:
                            bolR=avtt[1].toUpperCase()=="TRUE"?true:false;
                            break;
                        case 2:
                            strC=avtt[1];
                            break;
                        case 3:
                            tipid=avtt[1];
                            break;
						case 4:
							label=avtt[1];
                            break;
                    }
                }
                if (bolR){
                    setBlankCSS(this.id, label, tipid);
                }
                if (strC!=""){
                    var bolC=false;
                    bolC=strC.indexOf("?")>0?true:false;
                    var strCA=strC.split("?");
                    if (strCA.length>1){
                        var strCB=strCA[1].split(",");
                        switch (AC[strCA[0].toUpperCase()]){
                            case 1:
                                if ($('#'+this.id).val()!=""){
                                    if (VNumber($('#'+this.id).val())=="")
                                        setCheckCSS(this.id, label, strCB[0], tipid);
                                    else
                                        setCheckCSS(this.id, label, strCB[1], tipid);
                                }
                                break;
                            case 2:
                                if ($('#'+this.id).val()!=""){
                                    if (strCB.length>1)
                                        setCheckCSS(this.id, label, strCA[0], tipid, strCB[0], strCB[1]);
                                    else
                                        setCheckCSS(this.id, label, strCA[0], tipid, strCB[0], strCB[0]);
                                }
                                break;
                            case 3:
                                if ($('#'+strCB[0]).val()==$('#'+strCB[1]).val()){
                                    if (tipid!="")
                                        $('#'+tipid)[0].innerHTML = "";
                                }else{
                                    if (tipid=="")
                                        $('#'+this.id).attr("value", RI.SAME);
                                    else{
                                        $('#'+tipid).css("color","#FF0000");
                                        $('#'+tipid)[0].innerHTML = RI.SAME;
                                    }
                                }
                                break;
                        }
                    }else{
                        if ($('#'+this.id).val()!="")
                            setCheckCSS(this.id, label, strCA[0], tipid);
                    }
                }

            });
            $('#'+els[i].id).bind("focus",function(){
                var v=$('#'+this.id).attr("VTypes");
                var av=v.split(";");
                var tipid="";
				var bolR=false, strC="", tipid="", label="";
                for (var j=0; j<av.length; j++){
                    var avtt=av[j].split(":");
                    switch (AVT[avtt[0].toUpperCase()]){
                        case 1:
                            bolR=avtt[1].toUpperCase()=="TRUE"?true:false;
                            break;
                        case 2:
                            strC=avtt[1];
                            break;
                        case 3:
                            tipid=avtt[1];
                            break;
						case 4:
							label=avtt[1];
                            break;
                    }
                }
                clearCheckCSS(this.id, label, tipid);
            });
            //setInitCSS(els[i].id, gLabel, gTipid);
        }
    }
    $.fn.checkForm.bCheckForm=true;
    //提交前验证
    $.fn.checkFormEx = function(){
        $.fn.checkForm.bCheckForm=true;
        var AVT={
            REQUIRED:1,
            CHECK:2,
            TIP:3,
			LABEL:4
        };
        var AC={
            NUMBER:1,
            MINMAX:2,
            SAME:3
        };
        //var els=$('#'+this[0].id+' [VTypes]');
        var els=$(this).find('[VTypes]');
        for (var i=0; i<els.length; i++){
            var el=els[i];
            var v=$('#'+el.id).attr("VTypes");
            var av=v.split(";");
            var bolR=false, strC="", tipid="", label="";
        
            for (var j=0; j<av.length; j++){
                var avtt=av[j].split(":");
                switch (AVT[avtt[0].toUpperCase()]){
                    case 1:
                        bolR=avtt[1].toUpperCase()=="TRUE"?true:false;
                        break;
                    case 2:
                        strC=avtt[1];
                        break;
                    case 3:
                        tipid=avtt[1];
                        break;
					case 4:
						label=avtt[1];
                        break;
                }
            }
            if (bolR){
                setBlankCSS(el.id, label, tipid);
            }
            if (strC!=""){
                var strCA=strC.split("?");
                if (strCA.length>1){
                    var strCB=strCA[1].split(",");
                    switch (AC[strCA[0].toUpperCase()]){
                        case 1:
                            if ($('#'+this.id).val()!=""){
                                if (VNumber($('#'+el.id).val())=="")
                                    setCheckCSS(el.id, label, strCB[0], tipid);
                                else
                                    setCheckCSS(el.id, label, strCB[1], tipid);
                            }
                            break;
                        case 2:
                            if ($('#'+this.id).val()!=""){
                                if (strCB.length>1)
                                    setCheckCSS(el.id, label, strCA[0], tipid, strCB[0], strCB[1]);
                                else
                                    setCheckCSS(el.id, label, strCA[0], tipid, strCB[0], strCB[0]);
                            }
                            break;
                        case 3:
                            if ($('#'+strCB[0]).val()==$('#'+strCB[1]).val()){
                                if (tipid!=""){$('#'+tipid)[0].innerHTML = "";}
                            }else{
                                if (tipid==""){
                                    $('#'+this.id).attr("value", RI.SAME);
                                }else{
                                    $('#'+tipid).css("color","#FF0000");
                                    $('#'+tipid)[0].innerHTML = RI.SAME;
                                }
                            }
                            break;
                    }
                }else{
                    if ($('#'+el.id).val()!="")
                        setCheckCSS(el.id, label, strCA[0], tipid);
                }
            }
        }
        return $.fn.checkForm.bCheckForm;
    }
    function setInitCSS(id, label, tip){
        if ($.trim($('#'+id).val())==""){
            var tm = "";
            if (label!=""){tm="【"+label+"】"}
            if (tip==""){
                $('#'+id).attr('title', tm+RI.REQUIRED);
            }else{
                $('#'+tip).css("color","#FF0000");
                $('#'+tip)[0].innerHTML = tm+RI.REQUIRED;
            }
        }
    }
    //清除为空样式
    function setBlankCSS(id, label, tip){
        if ($.trim($('#'+id).val())==""){
            $('#'+id).removeClass("border-color-blue");
			$('#'+id).addClass("border-color-red");
            $('#'+id + " i").hide();
			var tm = "";
            if (label!=""){tm="【"+label+"】"}
            if (tip==""){
                $('#'+id).attr('title', tm+RI.REQUIRED);
            }else{
                $('#'+tip).css("color","#FF0000");
                $('#'+tip)[0].innerHTML = tm+RI.REQUIRED;
            }
            $.fn.checkForm.bCheckForm = $.fn.checkForm.bCheckForm&&false;
        }else{
            $('#'+id).removeClass("border-color-red");
            $('#'+id).addClass("border-color-blue");
            $('#'+id + " i").show();
            $('#'+id).attr('title', '');
            $('#'+id).attr('original-title', '');
            $.fn.checkForm.bCheckForm = $.fn.checkForm.bCheckForm&&true;
        }
    }
    //设置验证样式
    function setCheckCSS(id, label, vtype, tip, min, max){
        var t=VTypes(id, label, vtype, min, max)
        if (t==""){
            $('#'+id).removeClass("border-color-red");
            $('#'+id).addClass("border-color-blue");
            $('#'+id + " i").show();
            $('#'+id).attr('title', '');
            $('#'+id).attr('original-title', '');
            $.fn.checkForm.bCheckForm = $.fn.checkForm.bCheckForm&&true;
        }else{
            $('#'+id).removeClass("border-color-blue");
            $('#'+id).addClass("border-color-red");
            $('#'+id + " i").hide();
            if (tip==""){
                $('#'+id).attr('title', t);
            }else{
                $('#'+tip).css("color","#FF0000");
                $('#'+tip)[0].innerHTML = t;
            } 
            $.fn.checkForm.bCheckForm = $.fn.checkForm.bCheckForm&&false;
        }
    }
    //清除验证样式
    function clearCheckCSS(id, label, tip){
        $('#'+id).removeClass("border-color-red");
        $('#'+id).removeClass("border-color-blue");
        $('#'+id + " i").hide();
        if (tip!=""){
            $('#'+tip)[0].innerHTML = "";
        }
        if (tip==""){
            $('#'+id).attr('title', '');
            $('#'+id).attr('original-title', '');
        }
    }
    //验证总入口
    function VTypes(ctrlid, label, vtype, min, max){
        var v=$('#'+ctrlid).val();
        var aType={
            MAIL:1,
            CHINAPHONE:2,
            CERNO:3,
            NUMBER:4,
            MINMAX:5,
            DATE:6
        };
        var r="";
        switch (aType[vtype.toUpperCase()])
        {
            case 1:
                r=VMail(v);
                break;
            case 2:
                r=VChinaPhone(v);
                break;
            case 3:
                r=VCerNO(v);
                break;
            case 4:
                r=VNumber(v);
                break;
            case 5:
                r=VMinMax(v, min, max);
                break;
            case 6:
                r=VDate(v);
                break;
        }
        return r;
    }

})(jQuery);
//返回信息
function returnInfo(){}
//返回信息原型
var RI=returnInfo.prototype;
//成功信息
RI={
    EMPTY:'',
    SUCCESS:'成功',//成功
    FAILURE:'失败',//失败
    CORRECT:'正确',//正确
    SAME:'前后输入不一致',//前后输入不一致
    INCORRECT:'不正确',//不正确
    REQUIRED:'必须填写',
    NUMBER:'必须为数字',//必须为数字
    LENGTH:'长度必须为%1位',//长度必须为%1位
    MINMAX:'长度必须大于等于%1，并小于等于%2'//长度必须大于等于%1，并小于等于%2
}
//信箱信息
RI.MAIL={
    INCORRECT:'\u90ae\u7bb1\u5730\u5740'+RI.INCORRECT//邮箱地址不正确
}
//中国手机信息
RI.PHONE={
    INCORRECT:'\u624b\u673a\u53f7\u7801'+RI.INCORRECT//手机号码不正确
}
//中国身份证信息
RI.CERID={
    LENGTHINCORRECT:'\u8eab\u4efd\u8bc1\u4f4d\u6570'+RI.INCORRECT+'\uff0c\u5fc5\u987b\u4e3a15\u4f4d\u621618\u4f4d\u3002',//身份证位数不正确，必须为15位或18位。
    INCORRECT:'\u8eab\u4efd\u8bc1\u53f7\u7801'+RI.INCORRECT//身份证号码不正确
}
//日期格式
RI.DATE={
    INCORRECT:'\u65e5\u671f'+RI.INCORRECT//身份证号码不正确
}
//验证邮箱
function VMail(v){
    if (v.match(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/))
        return RI.EMPTY;
    else
        return RI.MAIL.INCORRECT;
}
//验证手机号
function VChinaPhone(v){
    if (v.match(/^(1(([35][0-9])|(47)|[8][012356789]))\d{8}$/))
        return RI.EMPTY;
    else
        return RI.PHONE.INCORRECT;
}
//判断是否是数字
function VNumber(v){
    if(v.match(/^[0-9]+$/))
        return RI.EMPTY;
    else
        return RI.NUMBER;
}
//验证身份证号
function VCerNO(v){
    var l=v.length;
    if (l!=15 && l!=18)
        return RI.CERID.LENGTHINCORRECT;
    var aCity={
        11:"\u5317\u4eac",
        12:"\u5929\u6d25",
        13:"\u6cb3\u5317",
        14:"\u5c71\u897f",
        15:"\u5185\u8499\u53e4",
        21:"\u8fbd\u5b81",
        22:"\u5409\u6797",
        23:"\u9ed1\u9f99\u6c5f",
        31:"\u4e0a\u6d77",
        32:"\u6c5f\u82cf",
        33:"\u6d59\u6c5f",
        34:"\u5b89\u5fbd",
        35:"\u798f\u5efa",
        36:"\u6c5f\u897f",
        37:"\u5c71\u4e1c",
        41:"\u6cb3\u5357",
        42:"\u6e56\u5317",
        43:"\u6e56\u5357",
        44:"\u5e7f\u4e1c",
        45:"\u5e7f\u897f",
        46:"\u6d77\u5357",
        50:"\u91cd\u5e86",
        51:"\u56db\u5ddd",
        52:"\u8d35\u5dde",
        53:"\u4e91\u5357",
        54:"\u897f\u85cf",
        61:"\u9655\u897f",
        62:"\u7518\u8083",
        63:"\u9752\u6d77",
        64:"\u5b81\u590f",
        65:"\u65b0\u7586",
        71:"\u53f0\u6e7e",
        81:"\u9999\u6e2f",
        82:"\u6fb3\u95e8",
        91:"\u56fd\u5916"
    }
    if(!/^\d{17}(\d|x)$/i.test(v)){
        if(!/^\d{15}$/i.test(v)){
            return RI.CERID.INCORRECT;
        }
    }
    v=v.replace(/x$/i,"a"); 
    if(aCity[parseInt(v.substr(0,2))]==null) return RI.CERID.INCORRECT;
    var sBirthday;
    if (l==15)
        sBirthday="19"+v.substr(6,2)+"-"+Number(v.substr(8,2))+"-"+Number(v.substr(10,2)); 
    else
        sBirthday=v.substr(6,4)+"-"+Number(v.substr(10,2))+"-"+Number(v.substr(12,2)); 
    var d=new Date(sBirthday.replace(/-/g,"/")) 
    if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate())) return RI.CERID.INCORRECT;
    var iSum=0;
    if (l==18){
        for(var i = 17;i>=0;i --) 
            iSum += (Math.pow(2,i) % 11) * parseInt(v.charAt(17 - i),11)
        if(iSum%11!=1) 
            return RI.CERID.INCORRECT; 
    }
    return RI.EMPTY;
}
function VDate(v){
    if (fnCheckDate(fnRemoveBrank(v), 0)) 
        return RI.EMPTY;
    else 
        return RI.DATE.INCORRECT; 
}

//验证长度
function VMinMax(v, i, x){
    if (v.length>=i && v.length<=x)
        return RI.EMPTY;
    else{
        if (i==x)
            return RI.LENGTH.replace("%1",i);
        else
            return RI.MINMAX.replace("%1",i).replace("%2",x);
    }
}
//根据身份证取得身份证所在地行政代码、出生年月日和性别
function GetCerNOInfo(v){
    if (VCerNO(v)==RI.EMPTY){
        var unitid=v.substr(0,6);
        var birthday='19001-1-1';
        var gender="1";
        if (v.length==15){
            birthday="19"+v.substr(6,2)+"-"+Number(v.substr(8,2))+"-"+Number(v.substr(10,2)); 
            gender=v.substr(14,1)%2?"1":"2"
        }else{
            birthday=v.substr(6,4)+"-"+Number(v.substr(10,2))+"-"+Number(v.substr(12,2)); 
            gender=v.substr(16,1)%2?"1":"2"
        }
        return [unitid, birthday, gender];
    }
    return ["", "", ""];
}
//功能：日期检查函数，支持3种年、月、日之间的分隔符 "-"、"."和"/"可以选择年、月、日是否应该完整。
//  正确的日期格式为：2001-2-13 2001 2001-2 2001.2.13  2001.2 2001/2/3，日期范围为 1-1-1 到 9999-12-31 
//  同时，对当前年当前月的天数也做了判断，如：2001-2-29 2001-4-31 都是非法的日期
//参数：strDate ---- 需要判断的日期字符串
//  intFlag: 1 ---- 可以没有日  2 ---- 可以没有日和月 0 ---- 年月日必须齐全
//返回值：true ---- 日期合法 false ---- 日期不合法
function fnCheckDate(strDate,intFlag)
{
    var strCheckDate = strDate + "";     //进一步确认哪来判断的肯定是一串字符串
    if(strCheckDate == "")        //空字符串,不是合法的日期字符串，返回false
    {
        return false;
    } 
 
    //判断传进来的数据是那种格式写成日期
    var intIndex = -1;         //利用正则表达式，查找字符串中是否包含某个字符，没找到为-1,否则为 （0 - String.length - 1）
    var arrDate;          //分别存储年月日
    var regExpInfo = /-/;       //正则表达式，匹配第一个出现 "."的位置
 
    //在这里，我之所以不使用replace函数把所有的"."和"/"换成"-",然后分别存储年月日，是因为用户有可能输入 2001/3-2,就判断不出它是不合法日期了
    intIndex = strCheckDate.search(regExpInfo);   //查找是否含有 "."
    if(intIndex == - 1){
        return false;
    }
    arrDate = strCheckDate.split("-"); 
 
    if(arrDate.length > 3)        //如果分离出来的项超过3，除了年月日还有其它的，不合法日期，返回false
    {
        return false;
    }
    else if(arrDate.length > 0) 
    {
        //判断年是否合法
        if(fnIsIntNum(arrDate[0]))   //是正整数
        {
            if (parseInt(Number(arrDate[0]))<1900) return false;
            if (parseInt(Number(arrDate[0])) > 9999) return false;
        }else
            return false;
   
        //判断月是否合法
        if(arrDate.length > 1)
        {
            if(fnIsIntNum(arrDate[1]))  //是正整数
            {
                if (parseInt(Number(arrDate[1])) < 1) return false;
                if (parseInt(Number(arrDate[1])) > 12) return false;
            }
            else
            {
                return false;
            }
        }
        else //没有月
        {
            if(intFlag != 2)    //必须得有月
            {
                return false;
            }
        }
   
        //判断日是否合法
        if(arrDate.length > 2)
        {
            if(fnIsIntNum(arrDate[2]))  //是正整数
            {
                var intDayCount = fnComputerDay(parseInt(Number(arrDate[0])),parseInt(Number(arrDate[1])));
                if(intDayCount < parseInt(Number(arrDate[2])))
                {
                    return false;
                }   
            }
            else
            {
                return false;
            }
        }
        else
        {
            if(intFlag == 0)    //必须得有日
            {
                return false;
            }
        }
    }
    return true;
}

//**********************************************************************************************************
//判断一个数是否为正整数
//参数：strNum ---- 需要判断的字符串
//返回值：true ---- 整数 false ---- 非整数
function fnIsIntNum(strNum)
{
    var strCheckNum = strNum.toString();
    if(strCheckNum.length < 1)         //空字符串
        return false;
    else if(isNaN(strCheckNum))         //不是数值
        return false;
    else if(parseInt(Number(strCheckNum)) < 1)       //不是正数
        return false; 
    else if(parseFloat(Number(strCheckNum)) > parseInt(Number(strCheckNum))) //不是整数 
        return false;
 
    return true;
}

//**********************************************************************************************************
//功能：判断intYear年intMonth月的天数
//返回值：intYear年intMonth月的天数
function fnComputerDay(intYear,intMonth)
{
    var dtmDate = new Date(intYear,intMonth,-1);
    var intDay = dtmDate.getDate() + 1;
    
    return intDay;    
}

//********************************************************************************************************** //功能：去掉字符串前后空格
//返回值：去掉空格后的字符串
function fnRemoveBrank(strSource)
{
    return strSource.replace(/^\s*/,'').replace(/\s*$/,'');
}

// tipsy, facebook style tooltips for jquery
// version 1.0.0a
// (c) 2008-2010 jason frame [jason@onehackoranother.com]
// releated under the MIT license

(function($) {
    function fixTitle($ele) {
        if ($ele.attr('title') || typeof($ele.attr('original-title')) != 'string') {
            $ele.attr('original-title', $ele.attr('title') || '').removeAttr('title');
        }
    }

    function Tipsy(element, options) {
        this.$element = $(element);
        this.options = options;
        this.enabled = true;
        fixTitle(this.$element);
    }

    Tipsy.prototype = {
        show: function() {
            var title = this.getTitle();
            if (title && this.enabled) {
                var $tip = this.tip();

                $tip.find('.tipsy-inner')[this.options.html ? 'html' : 'text'](title);
                $tip[0].className = 'tipsy'; // reset classname in case of dynamic gravity
                $tip.remove().css({top: 0, left: 0, visibility: 'hidden', display: 'block'}).appendTo(document.body);

                var pos = $.extend({}, this.$element.offset(), {
                    width: this.$element[0].offsetWidth,
                    height: this.$element[0].offsetHeight
                });

                var actualWidth = $tip[0].offsetWidth, actualHeight = $tip[0].offsetHeight;
                var gravity = (typeof this.options.gravity == 'function')
                    ? this.options.gravity.call(this.$element[0])
                    : this.options.gravity;

                var tp;
                switch (gravity.charAt(0)) {
                    case 'n':
                        tp = {top: pos.top + pos.height + this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
                        break;
                    case 's':
                        tp = {top: pos.top - actualHeight - this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
                        break;
                    case 'e':
                        tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth - this.options.offset};
                        break;
                    case 'w':
                        tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width + this.options.offset};
                        break;
                }

                if (gravity.length == 2) {
                    if (gravity.charAt(1) == 'w') {
                        tp.left = pos.left + pos.width / 2 - 15;
                    } else {
                        tp.left = pos.left + pos.width / 2 - actualWidth + 15;
                    }
                }

                $tip.css(tp).addClass('tipsy-' + gravity);

                if (this.options.fade) {
                    $tip.stop().css({opacity: 0, display: 'block', visibility: 'visible'}).animate({opacity: this.options.opacity});
                } else {
                    $tip.css({visibility: 'visible', opacity: this.options.opacity});
                }
            }
        },

        hide: function() {
            if (this.options.fade) {
                this.tip().stop().fadeOut(function() { $(this).remove(); });
            } else {
                this.tip().remove();
            }
        },

        getTitle: function() {
            var title, $e = this.$element, o = this.options;
            fixTitle($e);
            var title, o = this.options;
            if (typeof o.title == 'string') {
                title = $e.attr(o.title == 'title' ? 'original-title' : o.title);
            } else if (typeof o.title == 'function') {
                title = o.title.call($e[0]);
            }
            title = ('' + title).replace(/(^\s*|\s*$)/, "");
            return title || o.fallback;
        },

        tip: function() {
            if (!this.$tip) {
                this.$tip = $('<div class="tipsy"></div>').html('<div class="tipsy-arrow"></div><div class="tipsy-inner"/></div>');
            }
            return this.$tip;
        },

        validate: function() {
            if (!this.$element[0].parentNode) {
                this.hide();
                this.$element = null;
                this.options = null;
            }
        },

        enable: function() { this.enabled = true; },
        disable: function() { this.enabled = false; },
        toggleEnabled: function() { this.enabled = !this.enabled; }
    };

    $.fn.tipsy = function(options) {

        if (options === true) {
            return this.data('tipsy');
        } else if (typeof options == 'string') {
            return this.data('tipsy')[options]();
        }

        options = $.extend({}, $.fn.tipsy.defaults, options);

        function get(ele) {
            var tipsy = $.data(ele, 'tipsy');
            if (!tipsy) {
                tipsy = new Tipsy(ele, $.fn.tipsy.elementOptions(ele, options));
                $.data(ele, 'tipsy', tipsy);
            }
            return tipsy;
        }

        function enter() {
            var tipsy = get(this);
            tipsy.hoverState = 'in';
            if (options.delayIn == 0) {
                tipsy.show();
            } else {
                setTimeout(function() { if (tipsy.hoverState == 'in') tipsy.show(); }, options.delayIn);
            }
        };

        function leave() {
            var tipsy = get(this);
            tipsy.hoverState = 'out';
            if (options.delayOut == 0) {
                tipsy.hide();
            } else {
                setTimeout(function() { if (tipsy.hoverState == 'out') tipsy.hide(); }, options.delayOut);
            }
        };

        if (!options.live) this.each(function() { get(this); });

        if (options.trigger != 'manual') {
            var binder   = options.live ? 'live' : 'bind',
                eventIn  = options.trigger == 'hover' ? 'mouseenter' : 'focus',
                eventOut = options.trigger == 'hover' ? 'mouseleave' : 'blur';
            this[binder](eventIn, enter)[binder](eventOut, leave);
        }

        return this;

    };

    $.fn.tipsy.defaults = {
        delayIn: 0,
        delayOut: 0,
        fade: false,
        fallback: '',
        gravity: 'n',
        html: false,
        live: false,
        offset: 0,
        opacity: 0.8,
        title: 'title',
        trigger: 'hover'
    };

    // Overwrite this method to provide options on a per-element basis.
    // For example, you could store the gravity in a 'tipsy-gravity' attribute:
    // return $.extend({}, options, {gravity: $(ele).attr('tipsy-gravity') || 'n' });
    // (remember - do not modify 'options' in place!)
    $.fn.tipsy.elementOptions = function(ele, options) {
        return $.metadata ? $.extend({}, options, $(ele).metadata()) : options;
    };

    $.fn.tipsy.autoNS = function() {
        return $(this).offset().top > ($(document).scrollTop() + $(window).height() / 2) ? 's' : 'n';
    };

    $.fn.tipsy.autoWE = function() {
        return $(this).offset().left > ($(document).scrollLeft() + $(window).width() / 2) ? 'e' : 'w';
    };

})(jQuery);