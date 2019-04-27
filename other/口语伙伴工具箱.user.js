// ==UserScript==
// @name         SIT上应口语伙伴工具箱
// @namespace    snomiao@gmail.com
// @version      20190427.121142
// @description  可查询自己读了多少秒，读了什么课文
// @author       snomiao
// @include      *://210.35.98.12:8844/*
// @grant        none
// ==/UserScript==

var httpGetAsync = (theUrl) => {
	return new Promise((resolve, reject)=>{
		var httpRequest = new XMLHttpRequest();
		httpRequest.onreadystatechange = function() {
			if (httpRequest.readyState == 4 && httpRequest.status == 200) {
				//if you fetch a file you can JSON.parse(httpRequest.responseText)
				var data = httpRequest.responseText;
				resolve(data);
			}
		};
		httpRequest.open('GET', theUrl, true);
		httpRequest.send(null);
	})
}

var getLearningReports = async (e) => {
	e.target.disabled=true;//不可用

	var isoDate = (timestamp) => (new Date(timestamp * 1000 + 28800000 /*时区*/ )).toISOString().match('(.{10})T.{8}')[1];
	var isoTime = (timestamp) => (new Date(timestamp * 1000 + 28800000 /*时区*/ )).toISOString().match('.{10}T(.{8})')[1];
	var isoDateTime = (timestamp) => (new Date(timestamp * 1000 + 28800000 /*时区*/ )).toISOString();
	var avg = (array) => array.reduce((a, b, i) => (a * i + b) / (i + 1));

	var getList = async (starttime) => {
		console.log('getList(starttime)', {starttime})
		return JSON.parse(await httpGetAsync('/report_new.php?do=ajax&op=list' + (starttime && ('&starttime='+starttime) || '')))
	}
	var getOne = async (cid) => {
		console.log('getOne(cid)', {cid})
		return JSON.parse(await httpGetAsync('/report_new.php?do=ajax&op=one&cid=' + cid));
	}
	var getDetail = async (cid, date) => {
		console.log('getDetail(cid, date)', {cid, date})
		return JSON.parse(await httpGetAsync('/report_new.php?do=ajax&op=detail&cid=' + cid + '&date=' + date));
	}

	var starttime = (+new Date('2019-02-24')) / 1000;
	var student_id = document.cookie.match(/uchome_loginuser=(\d+)/)[1]
	var reList = await getList(starttime);
	//var reList = await getList();
	if (reList.success) {
	    var cids = Object.keys(reList.data);
	    var sum_time = 0;
	    var sum_scores = [];
	    var report = `// ${student_id} 的口语伙伴学习情况如下\n`;
	    report += (await Promise.all(cids.map(async (cid)=>{
	        var reOne = await getOne(cid);
	        if (reOne.success) {
	            var dates = Object.keys(reOne.data).filter(x => parseInt(x) > starttime);
	            var dates_report = (await Promise.all(dates.map( async (date) => {
	                var str_date = isoDate(date);
	                var lesson_count = reOne.data[date].lesson_count;
	                var studied_count = reOne.data[date].studied_count;
	                var reDetail = await getDetail(cid, date);
	                var details_report = Object.values(reDetail.data).map(function(obj) {
	                    var lessontitle = obj.lessontitle;
	                    var lessonid = obj.lessonid;
	                    var scores = obj.data.map(function(data_score) {
	                        var time = isoTime(data_score.dateline);
	                        var score = Number(data_score.score);
	                        sum_scores.push(score);
	                        return `[${time}] ${score}分`;
	                    }).join('、');
	                    return ` ${lessontitle}，得分：${scores}。`;
	                }).join('\n');
	                return ` ${str_date} 读了 ${lesson_count} 篇课文, 共 ${studied_count} 次，分别为：\n` + details_report;
	            } ))).join('\n');
	            var days = Math.round(Object.values(reList.data[cid].days)[0].day_count);
	            var lessons = Math.round(Object.values(reList.data[cid].lessons)[0].lesson_count);
	            var avgscore = Math.round(Object.values(reList.data[cid].avgscore)[0].avgscore * 100) / 100;
	            var maxscore = Math.round(Object.values(reList.data[cid].maxscore)[0].maxscore * 100) / 100;
	            var spendtime = Math.round(Object.values(reList.data[cid].spendtime)[0].spendtime);
	            sum_time += spendtime;
	            return `课程 ${cid} 学习了 ${days} 天共 ${lessons} 篇，平均分 ${avgscore}、最高分 ${maxscore}，累计时间 ${spendtime} 秒，详情如下：\n` + dates_report;
	        }
	    }))).join('\n');
	    var avg_score = Math.round(avg(sum_scores) * 100) / 100;
	    var sum_time_str = Math.round(sum_time / 60 / 60 * 100) / 100 + " 小时";
	    report += `\n\n总的来看，累计时间为 ${sum_time_str}, 平均分为：${avg_score}。`;
	};


	// alert(report)
	var ele = document.createElement('div')
	ele.innerHTML = `<pre>${report}</pre>`
	document.body.insertBefore(ele,document.body.firstChild);
	var selection = window.getSelection();
	selection.selectAllChildren(ele);

	var msgbox = (msg) => {
	    var e = document.createElement("div")
	    e.innerHTML = `<div style="display: block; position: fixed; font-size: 40px; top:0; left: 0; z-index: 999;">${msg}</div>`
	    document.body.append(e)
	    setTimeout(()=>e.parentNode.removeChild(e), 1000);
	}

	//
	if(document.execCommand("copy")){
	    msgbox("内容已复制")
	}else{
	    msgbox("内容复制失败")
	}

	e.target.disabled=false;//可用
}

var LearningReport = async()=>{
	var btn = document.createElement('button');
	btn.innerHTML = `了解我的学习情况<br>（查成绩查时间）`;
	btn.addEventListener('click', getLearningReports)
	document.querySelector('.u_name').append(btn)
}

var ForceSubmitScore = async (lid, uid) => {
	let httpGetAsync = (theUrl) => {
		return new Promise((resolve, reject)=>{
			var httpRequest = new XMLHttpRequest();
			httpRequest.onreadystatechange = function() {
				if (httpRequest.readyState == 4 && httpRequest.status == 200) {
					//if you fetch a file you can JSON.parse(httpRequest.responseText)
					var data = httpRequest.responseText;
					resolve(data);
				}
			};
			httpRequest.open('GET', theUrl, true);
			httpRequest.send(null);
		})
	}

	if(!uid){
		let profileHTML = await httpGetAsync("http://210.35.98.12:8844/cp.php?ac=profile");
		let match = profileHTML.match(/uid=(\d+)/); if(!match) return false;
		let uid = match[1];
		return ForceSubmitScore(lid, uid)
	}
	
	let pron   = round(Math.random() * 10 + 84, 2)
	let tone   = round(Math.random() * 10 + 84, 2)
	let rhythm = round(Math.random() * 10 + 84, 2)
	let scope  = round(Math.random() * 10 + 84, 2)
	let total  = round(Math.random() * 10 + 84, 2)
	let spendtime = round(Math.random() * 150 + 400, 0)
	let token = 11200000 + parseInt(Math.random() * 10000)
	let url =`http://210.35.98.12:8844//playserver.php?target=&lid=${lid}&testtype=0&targetid=&uid=${uid}&do=submitscore&total=${total}&pron=${pron}&tone=${tone}&rhythm=${rhythm}&scope=${scope}&spendtime=${spendtime}&token=${token}`
	
	return true;
}

var ForceSubmitScoreButtons = async (uid) => {
	if(!uid){
		let profileHTML = await httpGetAsync("http://210.35.98.12:8844/cp.php?ac=profile");
		let match = profileHTML.match(/uid=(\d+)/)
		if(!match) return false
		let uid = match[1];
		return ForceSubmitScoreButtons(uid)
	}
	// 历史成绩页面
	[...document.querySelectorAll("a")].filter(e=>e.href.match(/\.\/s\.php\?do=lesson&lid=(\d+)/)).map(e=>{
		var round = (number, precision) => Math.round(+number + 'e' + precision) / Math.pow(10, precision)
		let lid = e.href.match(/.\/s\.php\?do=lesson&lid=(\d+)/)[1]
		let pron   = round(Math.random() * 10 + 84, 2)
		let tone   = round(Math.random() * 10 + 84, 2)
		let rhythm = round(Math.random() * 10 + 84, 2)
		let scope  = round(Math.random() * 10 + 84, 2)
		let total  = round(Math.random() * 10 + 84, 2)
		let spendtime = round(Math.random() * 150 + 400, 0)
		let token = 11200000 + parseInt(Math.random() * 10000)
		let url =`http://210.35.98.12:8844//playserver.php?target=&lid=${lid}&testtype=0&targetid=&uid=${uid}&do=submitscore&total=${total}&pron=${pron}&tone=${tone}&rhythm=${rhythm}&scope=${scope}&spendtime=${spendtime}&token=${token}`
		
		let btn = document.createElement("button"); btn.innerHTML = `我要 ${total} 分！`
		let a = document.createElement("a"); a.append(btn); a.href=url; a.target = "_BLANK";
		let div = document.createElement("div"); div.append(a);
		e.parentNode.append(div)
	});

	// 课文列表页面
	
	[...document.querySelectorAll("a")].filter(e=>e.href.match(/.*\/s\.php\?do=lesson&iden=.*/)).map(async e=>{
		e.addEventListener("mouseover", async()=>{
			if(e.disabled) return;
			e.disabled = true;
			let lessonHTML = await httpGetAsync(e.href);
			let match1 = lessonHTML.match(/uid=(\d+)/); if(!match1) return false;
			let uid = match1[1];
			let match2 = lessonHTML.match(/lid=(\d+)/); if(!match2) return false;
			let lid = match2[1];
			
			var round = (number, precision) => Math.round(+number + 'e' + precision) / Math.pow(10, precision)
			let pron   = round(Math.random() * 10 + 84, 2)
			let tone   = round(Math.random() * 10 + 84, 2)
			let rhythm = round(Math.random() * 10 + 84, 2)
			let scope  = round(Math.random() * 10 + 84, 2)
			let total  = round(Math.random() * 10 + 84, 2)
			let spendtime = round(Math.random() * 150 + 400, 0)
			let token = 11200000 + parseInt(Math.random() * 10000)
			let url =`http://210.35.98.12:8844//playserver.php?target=&lid=${lid}&testtype=0&targetid=&uid=${uid}&do=submitscore&total=${total}&pron=${pron}&tone=${tone}&rhythm=${rhythm}&scope=${scope}&spendtime=${spendtime}&token=${token}`
			let btn = document.createElement("button"); btn.innerHTML = `我要 ${total} 分！`;
			btn.addEventListener("click", async ()=>{await httpGetAsync(url); window.location=window.location})
			let a = document.createElement("a"); a.append(btn); // a.href=url; a.target = "_BLANK";
			let div = document.createElement("div"); div.append(a);
			e.parentNode.append(a)	
		})
	});
	
	return true;
}

LearningReport()
ForceSubmitScoreButtons()

