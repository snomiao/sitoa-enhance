// ==UserScript==
// @name         SIT上应教务系统兼容性修复
// @namespace    snomiao@gmail.com
// @version      0.1
// @description  使兼容 Chrome, 目前发现的bug范围包括评教、成绩查询等功能。
// @author       snomiao
// @match        http://ems.sit.edu.cn:85/student/main.jsp
// @match        http://ems.sit.edu.cn:85/admin/main.jsp
// @match        http://ems.sit.edu.cn:85/admin/score/extra/scorePoint.jsp
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    pageForm.all = pageForm.all ? pageForm.all : {};
    pageForm.all.srTerm = document.querySelector('[name="srTerm"]');
    pageForm.all.srTerm2 = document.querySelector('[name="srTerm2"]');

})();