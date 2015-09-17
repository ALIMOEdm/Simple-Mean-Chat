chat.factory('tools', function(){
    var t = navigator,
        e = document.documentMode,
        i = document.compatMode;
    var a = t.userAgent.toLowerCase();
    var o = a.indexOf("opera") > -1,
        r = a.indexOf("presto") > -1,
        n = a.indexOf("opera mini") > -1,
        s = !o && a.indexOf("msie 7") > -1 || 7 == e,
        l = !o && a.indexOf("msie 8") > -1 && 7 != e && 9 != e || 8 == e,
        p = !o && a.indexOf("msie 9") > -1 && 7 != e && 8 != e || 9 == e,
        u = !o && a.indexOf("msie 1") > -1,
        d = !o && a.indexOf("trident/7") > -1,
        c = !o && a.indexOf("msie 6") > -1,
        m = !o && a.indexOf("msie") > -1 || c || s || l || p || u,
        y = m && (5 == e || !u && "BackCompat" == i);

    var browser = {
        isIE: m,
        msie: m,
        isIE6: c,
        isIE7: s,
        isIE8: l,
        isIE9: p,
        isIE10: u,
        isIE11: d,
        isIEQuirks: y,
        isPresto: r,
        isFirefox: /firefox/.test(a),
        isOperaMini: n
    };

    var tools = {
        insertHTML : function(html){
            if (browser.msie/* && browser.version < 10*/) {
                if (document.selection) {
                    var r = document.selection.createRange();
                    if (r.pasteHTML) {
                        r.pasteHTML(html);
                    }
                } else {
                    var r = document.getSelection().getRangeAt(0);
                    var n = document.createElement("span");
                    r.surroundContents(n);
                    n.innerHTML = html;
                    r.collapse(false);
                }
            }else {
                document.execCommand('insertHTML', false, html);
            }
        }
    };

    return tools;
});