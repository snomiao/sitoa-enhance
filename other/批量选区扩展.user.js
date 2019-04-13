// ==UserScript==
// @name         批量选区扩展
// @namespace    snomiao@gmail.com
// @version      0.1
// @description  批量打开链接-批量复制链接-类似linkclump
// @author       snomiao
// @include      *://*
// @grant        none
// ==/UserScript==

(function() {
    var msgbox = (msg) => {
        var e = document.createElement("div")
        e.innerHTML = `<div style="display: block; position: fixed; font-size: 40px; top:0; left: 0; z-index: 999;">${msg}</div>`
        document.body.append(e)
        setTimeout(()=>e.parentNode.removeChild(e), 1000);
    }
    window.addEventListener('keydown', event => {
        if(event.altKey &&
           !event.ctrlKey &&
           !event.shiftKey &&
           event.key == 'c'){
            var selection = document.getSelection();
            var selNode = selection.getRangeAt(0).commonAncestorContainer;
            selection.selectAllChildren(selNode.parentNode);
            if(document.execCommand("copy")){
                msgbox("HTML内容已复制")    
            }else{
                msgbox("HTML内容复制失败")
            }
        }
        // TODO: 复制链接
        // TODO: 批量打开链接
        // 复制网页标题
        if(event.altKey &&
           !event.ctrlKey &&
           !event.shiftKey &&
           event.key == 't'){
            selection = document.getSelection();
            selNode = document.querySelector('h1');

            selection.selectAllChildren(selNode);
            //
            if(document.execCommand("copy")){
                msgbox("标题已复制")
            }else{
                msgbox("标题复制失败")
            }
        }
    });
})();