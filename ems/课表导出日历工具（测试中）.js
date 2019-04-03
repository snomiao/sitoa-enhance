// 课表导出日历工具

// 课程序号 课程名称    课程代码    学分  授课老师    上课时间    上课地点    选课类型    选课结果    操作

var 原始文字课表 = 
`1850769	大学生体育测试（一）	B1230001	公共基础课	0.5	张群	第2-5周,周5,第5-6节	奉贤操场	奉贤校区	44	44	是	16101291, 16101261	
1855095	消费者行为学	B310307	专业必修课	3	曾世强	第1-12周,周5,第3-4节;第1-12周,周2,第3-4节	二教G103,一教C303	奉贤校区	120	76	否	17110312, 17110311	
1855101	营销策划	B3104432	专业必修课	2	李晓英	第1-16周,周2,第1-2节	二教E303	奉贤校区	129	92	否	16110341, 16110342	
1855517	数学物理方程	B422004	学科专业基础课	2	耿永才	第1-16周,周3,第1-2节	二教H111	奉贤校区	78	74	否	16122112, 16122111	
1855582	常微分方程	B222020	学科大类课	3	汪娜	第1-16周**,周2,第5-6节;第1-16周,周4,第7-8节	二教G103	奉贤校区	105	105	否	17122111, 17122112	
1855585	数学实验与数学建模	B222022	学科专业基础课	4.5	陈浦胤	第9-16周,周5,第1-2节;第9-16周,周3,第5-6节;第1-8周**,周5,第1-2节;第1-8周,周3,第5-6节;第1-16周,周2,第7-8节	二教H204,二教H204,二教H204,二教H204,奉计1（三教111）	奉贤校区	90	88	否	17122111, 17122112	
1855661	毛泽东思想和中国特色社会主义理论体系概论（上）	B121012	公共基础课	3	闫宇豪	第8-16周**,周3,第7-8节;第7-9周,周1,第1-2节;第6周**,周3,第7-8节;第6周,周1,第1-2节;第11-16周,周1,第1-2节;第10周,周1,第1-2节;第1-5周**,周3,第7-8节;第1-5周,周1,第1-2节	二教E201,二教E201,奉贤实践基地,奉贤实践基地,二教E201,奉贤实践基地,二教E201	奉贤校区	146	131	否	17110812, 17110813, 17110811	
1855856	市场营销学	B210109	学科大类课	3	张义	第1-16周*,周4,第5-6节;第1-16周,周3,第7-8节	二教H105,一教A110	奉贤校区	88	42	否	18110311	
1855914	数学模型课程设计	B722002	实践教学	2	陶亦舟	第18-19周,周5,第1-4节;第18-19周,周4,第1-4节;第18-19周,周3,第1-8节;第18-19周,周2,第1-8节;第18-19周,周1,第1-8节	奉贤实践基地	奉贤校区	83	81	否	17122111, 17122112	
1855974	多元统计分析	B3220013	专业必修课	2	罗纯	第1-16周,周4,第5-6节	二教E303	奉贤校区	93	92	否	17122111, 17122112	
1855975	微观经济学	B3220018	专业必修课	3	肖琴	第1-12周,周4,第1-2节;第1-12周,周1,第3-4节	一教A310	奉贤校区	85	80	否	17122111, 17122112	
1855976	金融工程	B4220010	专业必修课	2	卢磊	第1-16周,周5,第3-4节	二教G301	奉贤校区	100	88	否	17122111, 17122112	
1855988	形势与政策（4）	B1280004	公共基础课	0.5	卓碧蓉	第3-9周*,周3,第7-8节	二教E201	奉贤校区	166	150	否	17122311, 17122312, 17122111, 17122112	
1856217	体育4篮球（男）	S1230123F	公共基础课	0.5	杨德洪	第1-16周,周1,第7-8节	奉贤操场	奉贤校区	48	48	是	17121111, 17121112, 17121211, 17121212, 17121311, 17121312, 17122111, 17122112, 17122311, 17122312	
1856424	英语口译	S1110003	公共基础课	2	陈洁	第1-16周,周3,第3-4节	奉语6(三教310)	奉贤校区	46	42	否	17104341, 17104302, 17104231, 17104222, 17104221, 17104112, 17104111, 17104301, 17105202, 17105201	
1856510	机械系统CAE技术	G5020015Y	通识课	2	张锁怀	第4-8周,周3,第9-11节	一教C208（研讨）	奉贤校区	30	30	否		02研讨
1856567	神奇的稀土	G5070040Y	通识课	2	刘小珍	第4-8周,周4,第9-11节	一教A204（研讨）	奉贤校区	30	30	否		07教授研讨
1857045	大学生就业与创业指导	B1310002	公共基础课	1	李德培	第3-10周,周1,第5-6节	一教C304	奉贤校区	88	88	否	16122112, 16122111	`

// 矩阵转置
var transpose = m => m[0].map((x,i) => m.map(x => x[i]))

// 循环直到不动点，这里的调试技巧：进入死循环时可以在此中断，然后修改变量使其报错或跳出
var go_to_fix_point = function(s, proc_function){
	var o = s;
	while(1){
		var tmp = proc_function(o)
		if(tmp == o){
			return o;
		}else{
			o = tmp;
		}
	}
}

// 单双周筛选
var filter_error = function(s){
	return !( s.length == 0 ||
		s.match(/.*?第\d*?[02468]周\*[^\*].*/) || 
		s.match(/.*?第\d*?[13579]周\*\*.*/)
	);
}

// 单双周统一化
var normalyze = function(s){
	return s.replace(/周\*+/, "周");
}

// 把时间表按具体某周、某节课展开成独立元素，便于比较
var expand_time_to_array = function(s){
	return go_to_fix_point(s.replace(/;|<br>/g,"\n"),
		x => x.replace(/(.*?)(\d+)-(\d+)(.*)/, function(s,a,b,c,d){
		var o = "";
		var b = parseInt(b);
		var c = parseInt(c);
		for (var i = b; i <= c; i++) {
			o += a + i + d + "\n";
		}
		return o;
	})).split("\n").filter(filter_error).map(normalyze);
};


// 把连续的2节课合并成一段时间
var mergePeriods = (periods) => {
	var lastLength = periods.length
	periods.forEach((_, index) =>{
		// 防止比较溢出
		if(!(index + 1 < periods.length)) return;
		// 跳过已经被变成undefined 的值
		if(!periods[index    ]) return;
		if(!periods[index + 1]) return;
		var match1 = periods[index    ].match(/(第\d+周,周\d+,)第(\d+)(?:-(\d+))?节/);
		var match2 = periods[index + 1].match(/(第\d+周,周\d+,)第(\d+)(?:-(\d+))?节/);

		// 判断是否同周同天
		if(!(match1 && match2 && match1[1] == match2[1])) return;

		// 补全课程结束时间
		match1[3] = match1[3] || match1[2];
		match2[3] = match2[3] || match2[2];
		
		// 判断两节课是否连续
		if(parseInt(match1[3]) + 1 == parseInt(match2[2])){
			// 如果连续，把它们头尾相接
			var a = match1[2];
			var b = match2[3];
			var time_concated = `第${a}-${b}节`
			periods[index    ] = periods[index].replace(/第(\d+)(?:-(\d+))?节/, time_concated);
			periods[index + 1] = undefined;
		}
		// periods[index] = 0;
	})
	// 然后过滤掉计算过程中制造的垃圾
	periods = periods.filter(x=>x);

	// 看看有没有合并掉一些课程
	if(lastLength == periods.length){
		return periods
	}else{
		return mergePeriods(periods)
	}
}

var 课程表_table = 原始文字课表.split('\n').map(line=>line.split('\t'))
var 分裂好的课表 = 课程表_table.map(row => {
	var rows = [];
	// 把时间表分裂掉，这里 row[6] 是原始时间表 
	// 把按教室区分的周表分裂掉
	var periods   = row[6].split(';');
	var locations = row[7].split(',');
	if(periods.length != locations.length){
		if(periods.length > locations.length){
			// 遇到locations少于periods的情况，就不断重复locations的最后一个元素
			for (var i = (periods.length - locations.length) - 1; i >= 0; i--) {
				locations = locations.concat(locations.slice(-1))
			}
		}else{
			console.log(`error: periods doesn't match locations`, row)
		}
	}
	var t_periods_location = transpose([periods, locations]);

	var rows = t_periods_location.map(pl => {
		var periods = pl[0];
		var location = pl[1];
		var periods = expand_time_to_array(periods);
		var periods = mergePeriods(periods);

		// 按分裂的时间表展开, 将原始的时间地点插到最后
		//return periods.map(period => new_row.concat([period]));
		return periods.map(period =>{
			var new_row = row.slice(0);
			new_row[6] = period;
			new_row[7] = location;
			new_row = new_row.concat([row[6],row[7]])
			return new_row;
		});
	}).flat()
	// 此时 row[10] 是分裂好的时间表
	return rows;
}).flat();
分裂好的课表

var 计算课程时间 = (period) => {
	var match = period.match(/第(\d+)周,周(\d+),第(\d+)-(\d+)节/)
	if(match){
		var weeknum         = match[1];
		var whichday        = match[2];
		var lesson_s    = match[3];
		var lesson_e    = match[4];
		let t_first_week  = (new Date('2019-02-25 00:00:00 GMT+0800')).getTime();
		let t_a_seconds   = 1000 // 1秒
		let t_a_minutes   = 60 * t_a_seconds // 1分钟
		let t_a_quarter   = 15 * t_a_minutes // 1刻钟
		let t_a_hour      = 60 * t_a_minutes // 1小时
		let t_a_day       = 24 * t_a_hour    // 1天
		let t_a_week      = 7  * t_a_day;    // 1周
		// 上课时间表
		// 第  1-2 节 08:20-09:55
		// 第  3-4 节 10:15-11:50
		// 第  5-6 节 13:00-14:35
		// 第  7-8 节 14:55-16:30
		// 第 9-11 节 18:00-20:25
		var t_lesson = {};
		t_lesson[ '1s'] = t_a_hour *  8+20 * t_a_minutes;


		t_lesson[ '2e'] = t_a_hour *  9+55 * t_a_minutes;
		t_lesson[ '3s'] = t_a_hour * 10+15 * t_a_minutes;

		t_lesson[ '4s'] = t_a_hour * 11+ 0 * t_a_minutes;
		t_lesson[ '4e'] = t_a_hour * 11+50 * t_a_minutes;
		t_lesson[ '5s'] = t_a_hour * 13+ 0 * t_a_minutes;


		t_lesson[ '6e'] = t_a_hour * 14+35 * t_a_minutes;
		t_lesson[ '7s'] = t_a_hour * 14+55 * t_a_minutes;

		t_lesson[ '8s'] = t_a_hour * 15+20 * t_a_minutes; // 有的实训课是第 8 节开始上到 17:30 左右
		t_lesson[ '8e'] = t_a_hour * 16+30 * t_a_minutes;

		t_lesson[ '9s'] = t_a_hour * 18+ 0 * t_a_minutes;
		t_lesson['11e'] = t_a_hour * 20+25 * t_a_minutes;
		

		var t_class_s = t_first_week
					  + t_a_week * (weeknum-1)
					  + t_a_day * (whichday-1)
					  + t_lesson[lesson_s+'s'];

		var t_class_e = t_first_week
					  + t_a_week * (weeknum-1)
					  + t_a_day * (whichday-1)
					  + t_lesson[lesson_e+'e'];
		return [t_class_s, t_class_e]

	}else{
		console.log('无法识别的时间:', period)
		return undefined;
	}
}


// csv导入方案
//
// csv字段
// 1
// Subject
// 活动名称，必填。
// 示例：期末考试
//
// Start Date
// 活动第一天，必填。
// 示例： 05/30/2020
//
// Start Time
// 活动开始时间。
// 示例： 10:00 AM
//
// End Date
// 活动最后一天。
// 示例： 05/30/2020
//
// End Time
// 活动结束时间。
// 示例： 1:00 PM
//
// All Day Event
// 活动是否为全天活动。如果是全天活动，请输入 True，如果不是，请输入 False。
// 示例：False
//
// Description
// 活动的说明或备注。
// 示例：50 个多选题和 2 个问答题 
//
// Location
// 活动地点。
// 示例：“北京大学，逸夫楼 209 室”
//
// Private
// 此活动是否应标为不公开。如果此活动为不公开活动，请输入 True，否则，请输入 False。
// 示例：True
//
// 原始数据格式："1857045	大学生就业与创业指导	B1310002	公共基础课	1	李德培	第3-10周,周1,第5-6节	一教C304	奉贤校区	88	88	否	16122112, 16122111	"
// 课程名称/老师/学分/班级/课程代码
var csvHeader = `Subject,Start Date,Start Time,End Date,End Time,All Day Event,Description,Location,Private`;
var csv时间表 = csvHeader + '\n' + 分裂好的课表.map(row=>{
	// csv方案
	var Subject = `${row[1]} ${row[0]} ${row[2]} ${row[5]} ${row[4]}学分`;
	var 课程时间戳 = 计算课程时间(row[6]); // 这里 row[6] 是已经分裂好的时间表
	var Start_Date = (new Date(课程时间戳[0])).toDateString();
	var Start_Time = (new Date(课程时间戳[0])).toTimeString();
	var End_Date = (new Date(课程时间戳[1])).toDateString();
	var End_Time = (new Date(课程时间戳[1])).toTimeString();
	var All_Day_Event = "False";
	var Description = row.slice(0,13).join(' ');
	var Location = row[7];
	var Private = "True";

	var csvLine = `${Subject},"${Start_Date}","${Start_Time}","${End_Date}","${End_Time}",${All_Day_Event},"${Description}","${Location}",${Private}`;
	return csvLine;
}).join('\n');

String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};


// iCalendar方案
/*
md5.js
*/String.prototype.MD5 = function () {
   string = this;
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

var ics事件表 = 分裂好的课表.map(row=>{
	// ics方案
	// 范例数据： 1857045	大学生就业与创业指导	B1310002	公共基础课	1	李德培	第3-10周,周1,第5-6节	一教C304	奉贤校区	88	88	否	16122112, 16122111	`
	//
	var 课程时间戳 = 计算课程时间(row[6]); // 这里 row[6] 是已经分裂好的时间表
	var EVENT_DTSTART = (new Date(课程时间戳[0])).toISOString().replace(/-|:|\.\d+/g, '');
	var EVENT_DTEND   = (new Date(课程时间戳[1])).toISOString().replace(/-|:|\.\d+/g, '');
	var EVENT_UID = `课程时间: ${row[0]}-${row[6]}`.MD5(32) + `@snomiao.com`; //打算后面升级一下随机数算法

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

	var EVENT_SUMMARY = `${row[1]}/${row[0]}/${row[2]}/${row[5]}/${row[4]}分/${row[6]}`.replace(/.{40}/g, c => c + '\r\n ');
	var EVENT_DESCRIPTION = ``;
	EVENT_DESCRIPTION += `课程序号: ${row[0]}\n`;
	EVENT_DESCRIPTION += `课程名称: ${row[1]}\n`;
	EVENT_DESCRIPTION += `课程代码: ${row[2]}\n`;
	EVENT_DESCRIPTION += `课程类型: ${row[3]}\n`;
	EVENT_DESCRIPTION += `课程学分: ${row[4]}\n`;
	EVENT_DESCRIPTION += `授课老师: ${row[5]}\n`;
	EVENT_DESCRIPTION += `上课时间: ${row[14]}\n`;
	EVENT_DESCRIPTION += `上课地点: ${row[15]}\n`;
	EVENT_DESCRIPTION += `校区: ${row[8]}\n`;
	EVENT_DESCRIPTION += `计划人数: ${row[9]}\n`;
	EVENT_DESCRIPTION += `已选人数: ${row[10]}\n`;
	EVENT_DESCRIPTION += `挂牌: ${row[11]}\n`;
	EVENT_DESCRIPTION += `配课班: ${row[12]}\n`;
	EVENT_DESCRIPTION += `备注: ${row[13]}\n`;
	EVENT_DESCRIPTION = EVENT_DESCRIPTION.replace(/\n/g,'\\n').replace(/.{40}/g, c => c + '\r\n ');

	var EVENT_LOCATION = `${row[7]}`;
	var section = ``;
	section += `BEGIN:VEVENT\r\n`
	//section += `DTSTART;TZID=Asia/Shanghai:${EVENT_DTSTART}\r\n`
	section += `DTSTART:${EVENT_DTSTART}\r\n`
	//section += `DTEND;TZID=Asia/Shanghai:${EVENT_DTEND}\r\n`
	section += `DTEND:${EVENT_DTEND}\r\n`
	//section += `RRULE:FREQ=WEEKLY;COUNT=11;BYDAY=FR\r\n` // 后续升级
	section += `UID:${EVENT_UID}\r\n`; //
	section += `SUMMARY:${EVENT_SUMMARY}\r\n`;
	section += `DESCRIPTION:${EVENT_DESCRIPTION}\r\n`;
	section += `LOCATION:${EVENT_LOCATION}\r\n`;
	//section += `SEQUENCE:2\r\n`; // 作用未知
	section += `END:VEVENT\r\n`;
	return section;
})
var ics输出 = ``
ics输出 += `BEGIN:VCALENDAR\r\n`;
ics输出 += `VERSION:2.0\r\n`;
ics输出 += `CALSCALE:GREGORIAN\r\n`;
ics输出 += `X-WR-CALNAME:上应测试课程表\r\n`;
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
ics输出 += `${ics事件表.join('\r\n')}`;
ics输出 += `\r\n`;
ics输出 += `END:VCALENDAR\r\n`;

ics输出


//FREQ=MONTHLY;BYDAY=MO,TU,WE,TH,FR;BYSETPOS=-1
//
// BEGIN:VCALENDAR
// VERSION:2.0
// CALSCALE:GREGORIAN
// X-WR-CALNAME:上应测试课程表
// X-WR-TIMEZONE:Asia/Shanghai
// BEGIN:VTIMEZONE
// TZID:Asia/Shanghai
// X-LIC-LOCATION:Asia/Shanghai
// BEGIN:STANDARD
// TZOFFSETFROM:+0800
// TZOFFSETTO:+0800
// TZNAME:CST
// DTSTART:19700101T000000
// END:STANDARD
// END:VTIMEZONE
//
// 事件 范例
// BEGIN:VEVENT
// DTSTART;TZID=Asia/Shanghai:20180907T082000
// DTEND;TZID=Asia/Shanghai:20180907T095500
// RRULE:FREQ=WEEKLY;COUNT=11;BYDAY=FR
// 
// SUMMARY:...
// DESCRIPTION:...
//
// LOCATION:
// SEQUENCE:2
// END:VEVENT
//
// END:VCALENDAR