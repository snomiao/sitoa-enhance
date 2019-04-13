var cheerio = require('cheerio');
var superagent = require('superagent');

//myCookie = "iPlanetDirectoryPro=AQIC5wM2LY4Sfcw51Dwc1elxC7zuCZ1KcoZlTro2O7EMkBs%3D%40AAJTSQACMDE%3D%23; JSESSIONID=0000ZtfDUbviF8lmWR8rIITn3qg:15fs7f96g"

myCookie = "iPlanetDirectoryPro=AQIC5wM2LY4Sfcw51Dwc1elxC7zuCZ1KcoZlTro2O7EMkBs%3D%40AAJTSQACMDE%3D%23; JSESSIONID=5103F3380DB4207E3F5F1377A1C345C5"

superagent
  .get('http://sc.sit.edu.cn/public/activity/activityList.action?pageNo=1&pageSize=120&categoryId=&activityName=')
  .set('Cookie', myCookie)
  .end(function (err, sres) { // callback
    // 常规的错误处理
    if (err) {
      console.error(err);
    }
    var html = sres.text;
    var $ = cheerio.load();
    //var ans = $('#top_head_title').text();
    console.log(sres.text);
    console.log(123)
  });
