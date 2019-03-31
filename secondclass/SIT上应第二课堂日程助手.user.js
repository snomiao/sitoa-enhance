// ==UserScript==
// @name         SIT上应第二课堂日程助手
// @namespace    snomiao@gmail.com
// @version      0.2
// @description  功能：1) 在任意活动内下载ical格式的日程表 2)一键显示前200项活动
// @author       snomiao
// @match        http://sc.sit.edu.cn/*
// @match        https://sc.sit.edu.cn/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
//导入MD5函数
String.prototype.MD5 = function(){
    var string = this;
    function RotateLeft(lValue, iShiftBits) {
            return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
    }

    function AddUnsigned(lX,lY) {
        var lX4,lY4,lX8,lY8,lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
                return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
                if (lResult & 0x40000000) {
                        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                } else {
                        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                }
        } else {
                return (lResult ^ lX8 ^ lY8);
        }
    }

    function F(x,y,z) { return (x & y) | ((~x) & z); }
    function G(x,y,z) { return (x & z) | (y & (~z)); }
    function H(x,y,z) { return (x ^ y ^ z); }
    function I(x,y,z) { return (y ^ (x | (~z))); }

    function FF(a,b,c,d,x,s,ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
    };

    function GG(a,b,c,d,x,s,ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
    };

    function HH(a,b,c,d,x,s,ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
    };

    function II(a,b,c,d,x,s,ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
    };

    function ConvertToWordArray(string) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWords_temp1=lMessageLength + 8;
            var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
            var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
            var lWordArray=Array(lNumberOfWords-1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while ( lByteCount < lMessageLength ) {
                    lWordCount = (lByteCount-(lByteCount % 4))/4;
                    lBytePosition = (lByteCount % 4)*8;
                    lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
                    lByteCount++;
            }
            lWordCount = (lByteCount-(lByteCount % 4))/4;
            lBytePosition = (lByteCount % 4)*8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
            lWordArray[lNumberOfWords-2] = lMessageLength<<3;
            lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
            return lWordArray;
    };

    function WordToHex(lValue) {
            var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
            for (lCount = 0;lCount<=3;lCount++) {
                    lByte = (lValue>>>(lCount*8)) & 255;
                    WordToHexValue_temp = "0" + lByte.toString(16);
                    WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
            }
            return WordToHexValue;
    };

    function Utf8Encode(string) {
            string = string.replace(/\r\n/g,"\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                    var c = string.charCodeAt(n);

                    if (c < 128) {
                            utftext += String.fromCharCode(c);
                    }
                    else if((c > 127) && (c < 2048)) {
                            utftext += String.fromCharCode((c >> 6) | 192);
                            utftext += String.fromCharCode((c & 63) | 128);
                    }
                    else {
                            utftext += String.fromCharCode((c >> 12) | 224);
                            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                            utftext += String.fromCharCode((c & 63) | 128);
                    }

            }

            return utftext;
    };

    var x=Array();
    var k,AA,BB,CC,DD,a,b,c,d;
    var S11=7, S12=12, S13=17, S14=22;
    var S21=5, S22=9 , S23=14, S24=20;
    var S31=4, S32=11, S33=16, S34=23;
    var S41=6, S42=10, S43=15, S44=21;

    string = Utf8Encode(string);

    x = ConvertToWordArray(string);

    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

    for (k=0;k<x.length;k+=16) {
            AA=a; BB=b; CC=c; DD=d;
            a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
            d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
            c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
            b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
            a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
            d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
            c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
            b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
            a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
            d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
            c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
            b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
            a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
            d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
            c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
            b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
            a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
            d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
            c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
            b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
            a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
            d=GG(d,a,b,c,x[k+10],S22,0x2441453);
            c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
            b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
            a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
            d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
            c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
            b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
            a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
            d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
            c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
            b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
            a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
            d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
            c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
            b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
            a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
            d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
            c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
            b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
            a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
            d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
            c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
            b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
            a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
            d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
            c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
            b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
            a=II(a,b,c,d,x[k+0], S41,0xF4292244);
            d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
            c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
            b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
            a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
            d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
            c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
            b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
            a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
            d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
            c=II(c,d,a,b,x[k+6], S43,0xA3014314);
            b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
            a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
            d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
            c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
            b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
            a=AddUnsigned(a,AA);
            b=AddUnsigned(b,BB);
            c=AddUnsigned(c,CC);
            d=AddUnsigned(d,DD);
         }

     var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

     return temp.toLowerCase();
}

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function(){
        if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
            callback(xmlHttp.responseText);
        }
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

var parseEventData = (html) => {
    var re = {}
    // 样例
    var 抓取html样例 = `<h1 class="title_8">【学工部】上海应用技术大学2019届毕业生春季校园综合招聘会</h1>
        <div style=" color:#7a7a7a; text-align:center">
     	   活动编号：1053790 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
     	   活动开始时间：2019-3-29 13:00:00 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
       	  活动地点：大学生活动中心一楼大厅、第二食堂二楼&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  		   活动时长：150 分钟<br />
  		   负责人：吴晓燕  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  		 负责人电话：60873212&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  		   主办方：学工部&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  		 承办方：就业指导服务中心&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  		 刷卡时间段：2019-03-29 12:50:00&nbsp;&nbsp;--至--&nbsp;&nbsp;2019-03-15 15:20:00
  		!?
    </div>`
    var eleHTML = document.createElement("html")
    eleHTML.innerHTML = html;

    var scEvent = {}
    var 活动信息 = eleHTML.querySelector("div.box-1 > div:nth-child(2)").innerHTML.replace(/&nbsp;/g," ").replace(/<br>/g,"").split('\n').map(x=>x).join('\n');
    scEvent.hash = ("第二课堂活动：" + 活动信息.match(/活动编号：(.*)/m)[1]).MD5(32)
    scEvent.subject = eleHTML.querySelector("h1").innerText;
    scEvent.starts = new Date(活动信息.match(/刷卡时间段：([-\d]+ [:\d]+).*?[-\d]+ [:\d]+/m)[1])
    scEvent.ends = new Date(活动信息.match(/刷卡时间段：[-\d]+ [:\d]+.*?([-\d]+ [:\d]+)/m)[1])
    scEvent.location = 活动信息.match(/活动地点：(.*)/m)[1]
    scEvent.description = 活动信息 + '\n\n' + eleHTML.querySelector("div.box-1 > div:nth-child(3)").innerText
    return scEvent;
}

// activityList.action 活动列表页面
var make_ical = (events)=>{
    var CALNAME = "第二课堂活动日历"
    var EVENTS = events.map(event=>{
        // ical样例
        // BEGIN:VEVENT
        // DTSTART:20190308T050000Z
        // DTEND:20190308T063500Z
        // UID:8523315dacd42732383e3f8d07b9cd88@snomiao.com
        // SUMMARY:大学生体育测试（一）/1850769/B1230001/张群/0.5分/第2周,周5,第5-6节
        // DESCRIPTION:课程序号: 1850769\n课程名称: 大学生体育测试（一）\n课程代码: B
        //  1230001\n课程类型: 公共基础课\n课程学分: 0.5\n授课老师: 张
        //  群\n上课时间: 第2-5周,周5,第5-6节\n上课地点: 奉贤操场\n校区:
        //   奉贤校区\n计划人数: 44\n已选人数: 44\n挂牌: 是\n配课班: 1
        //  6101291, 16101261\n备注: \n
        // LOCATION:奉贤操场
        // END:VEVENT

        var EVENT_UID = event.hash + `@sit.snomiao.com`; //打算后面升级一下随机数算法
        var EVENT_SUMMARY     = event.subject;
        var EVENT_DTSTART     = (new Date(event.starts)).toISOString().replace(/-|:|\.\d+/g, '');
        var EVENT_DTEND       = (new Date(event.ends)).toISOString().replace(/-|:|\.\d+/g, '');
        var EVENT_LOCATION    = event.location;
        var EVENT_DESCRIPTION = event.description
            .split('\n').map(x=>x.trim()).join('\n').replace(/[ ]+/g, " ").replace(/[\r\n]+/g, "\n") /*删除多余的空格和换行*/
            .replace(/\n/g,'\\n').replace(/.{40}/g, c => c + '\r\n ')/*reshape为ICAL可以接受的格式*/
        var section = ""
        section += `BEGIN:VEVENT\r\n`
        section += `DTSTART:${EVENT_DTSTART}\r\n`
        section += `DTEND:${EVENT_DTEND}\r\n`
        //section += `RRULE:FREQ=WEEKLY;COUNT=11;BYDAY=FR\r\n` // 后续升级
        section += `UID:${EVENT_UID}\r\n`; //
        section += `SUMMARY:${EVENT_SUMMARY}\r\n`;
        section += `DESCRIPTION:${EVENT_DESCRIPTION}\r\n`;
        section += `LOCATION:${EVENT_LOCATION}\r\n`;
        section += `END:VEVENT\r\n`;
        return section;
    }).join('\r\n');

    var ics输出 = ``
    ics输出 += `BEGIN:VCALENDAR\r\n`;
    ics输出 += `VERSION:2.0\r\n`;
    ics输出 += `CALSCALE:GREGORIAN\r\n`;
    ics输出 += `X-WR-CALNAME:${CALNAME}\r\n`;
    ics输出 += `X-WR-TIMEZONE:Asia/Shanghai\r\n`;
    ics输出 += `BEGIN:VTIMEZONE\r\n`;
    ics输出 += `TZID:Asia/Shanghai\r\n`;
    ics输出 += `X-LIC-LOCATION:Asia/Shanghai\r\n`;
    ics输出 += `BEGIN:STANDARD\r\n`;
    ics输出 += `TZOFFSETFROM:+0800\r\n`;
    ics输出 += `TZOFFSETTO:+0800\r\n`;
    ics输出 += `TZNAME:CST\r\n`;
    ics输出 += `DTSTART:19700101T000000\r\n`;
    ics输出 += `END:STANDARD\r\n`;
    ics输出 += `END:VTIMEZONE\r\n`;
    ics输出 += `\r\n`;
    ics输出 += EVENTS;
    ics输出 += `\r\n`;
    ics输出 += `END:VCALENDAR\r\n`;

    return ics输出;
}

function download(href, title) {
    const a = document.createElement('a');
    a.setAttribute('href', href);
    a.setAttribute('download', title);
    a.click();
}
var download_text_plain = (text, title) => {
    download(URL.createObjectURL(new Blob([text])), title);
}

// all
var mk_toolbar_ed = false;
var mk_toolbar = ()=>{
    var container = document.querySelector(".user-info")
    if(!container || mk_toolbar_ed){
        return
    }
    var tool_bar = document.createElement("div")
    container.append(tool_bar);
    var toolbarHTML = `<a href="http://sc.sit.edu.cn/public/activity/activityList.action?pageNo=1&pageSize=200&categoryId=&activityName=">查看最近的200个活动</a>`
    if(window.location.href.match("activityDetail.action")){
        toolbarHTML += `<button onclick="download_current_activity_calendar_ical">下载ical日程（当前事件）</button>`
    }else{
        toolbarHTML += `<button onclick="download_listof_activity_calendar_ical">下载ical日程（当前列表）</button>`
    }
    tool_bar.innerHTML = toolbarHTML;
    mk_toolbar_ed = true;

}


// 解析并下载当前页面的日历
window.download_current_activity_calendar_ical = () => {
    var href = window.location;
    httpGetAsync(href,(html)=>{
        var re = parseEventData(html)
        re.description += '\n' + href;
        var ical_content = make_ical([re]);
        download_text_plain(ical_content, "第二课堂活动：" + document.querySelector("h1").innerText + ".ical")
    })
}

window.download_listof_activity_calendar_ical = () => {

    // 获取当前页面上所有活动详情的URL;
    var hrefs = [...document.querySelectorAll("a")].map(a=>a.href).filter(href=>!!href.match("activityDetail.action"))

    // 开始下载
    var events = [];
    hrefs.forEach(href => {
        httpGetAsync(href, (html)=>{
            var event = parseEventData(html)
            event.description += '\n' + href;
            events.push(event)

            if(events.length == hrefs.length){
                var ical_content = make_ical(events);
                download_text_plain(ical_content, document.querySelector("title").innerText + ".ical")
            }
        })
    })
}

window.addEventListener("load", mk_toolbar)
mk_toolbar()
})();