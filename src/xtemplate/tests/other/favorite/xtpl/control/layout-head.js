/** Compiled By kissy-xtemplate */
KISSY.add(function (S, require, exports, module) {
        /*jshint quotmark:false, loopfunc:true, indent:false, asi:true, unused:false, boss:true, sub:true*/
        var layoutHead = function (scope, buffer, undefined) {
            var tpl = this,
                nativeCommands = tpl.root.nativeCommands,
                utils = tpl.root.utils;
            var callFnUtil = utils["callFn"],
                callCommandUtil = utils["callCommand"],
                eachCommand = nativeCommands["each"],
                withCommand = nativeCommands["with"],
                ifCommand = nativeCommands["if"],
                setCommand = nativeCommands["set"],
                includeCommand = nativeCommands["include"],
                parseCommand = nativeCommands["parse"],
                extendCommand = nativeCommands["extend"],
                blockCommand = nativeCommands["block"],
                macroCommand = nativeCommands["macro"],
                debuggerCommand = nativeCommands["debugger"];
            buffer.write('\r\n<meta http-equiv="X-UA-Compatible" content="IE=edge"/>\r\n<meta charset="utf-8"/>\r\n<meta name="spm-id" content="', 0);
            var id0 = scope.resolve(["spm", "meta"], 0);
            buffer.write(id0, true);
            buffer.write('" />\r\n<meta name="viewport" content="width=device-width,initial-scale=1.0"/>\r\n<meta name="description" content="中国最大、最安全的网上交易社区,尽享淘宝乐趣！"/>\r\n<meta name="keywords" content="淘宝,掏宝,网上购物,C2C,在线交易,交易市场,网上交易,交易市场,网上买,网上卖，购物网站,团购,网上贸易,安全购物,电子商务,放心买,供应,买卖信息,网店,一口价,拍卖,网上开店,网络购物,打折,免费开店,网购,频道,店铺" />\r\n\r\n<title>\r\n    ', 0);
            var option1 = {
                escape: 1
            };
            var params2 = [];
            var id3 = scope.resolve(["contextData", "usernick"], 0);
            params2.push(id3);
            option1.params = params2;
            option1.fn = function (scope, buffer) {
                buffer.write('\r\n        ', 0);
                var id4 = scope.resolve(["contextData", "usernick"], 0);
                buffer.write(id4, true);
                buffer.write('的收藏夹\r\n    ', 0);
                return buffer;
            };
            option1.inverse = function (scope, buffer) {
                buffer.write('\r\n        收藏夹\r\n    ', 0);
                return buffer;
            };
            buffer = ifCommand.call(tpl, scope, option1, buffer, 10);
            buffer.write('\r\n</title>\r\n\r\n<link rel="shortcut icon" href="http://pics.taobao.com/favicon.ico" type="image/x-icon" />\r\n\r\n', 0);
            var option5 = {
                escape: 1
            };
            var params6 = [];
            params6.push('global/js.html');
            params6.push('kissy=1.4.1');
            option5.params = params6;
            var callRet7
            callRet7 = callFnUtil(tpl, scope, option5, buffer, ["vmcommon"], 0, 19);
            if (callRet7 && callRet7.isBuffer) {
                buffer = callRet7;
                callRet7 = undefined;
            }
            buffer.write(callRet7, true);
            buffer.write('\r\n', 0);
            var option8 = {
                escape: 1
            };
            var params9 = [];
            params9.push('global/css.html');
            option8.params = params9;
            var callRet10
            callRet10 = callFnUtil(tpl, scope, option8, buffer, ["vmcommon"], 0, 20);
            if (callRet10 && callRet10.isBuffer) {
                buffer = callRet10;
                callRet10 = undefined;
            }
            buffer.write(callRet10, true);
            buffer.write('\r\n\r\n<script src="http://g.tbcdn.cn/kissy/k/1.4.1/import-style-min.js" data-config="{combine:true}"></script>\r\n<script id="J_ConfigScript" src="', 0);
            var id11 = scope.resolve(["config", "server"], 0);
            buffer.write(id11, true);
            buffer.write('/', 0);
            var id12 = scope.resolve(["config", "version"], 0);
            buffer.write(id12, true);
            buffer.write('/c/config/pkg.js" data-v="', 0);
            var id13 = scope.resolve(["config", "version"], 0);
            buffer.write(id13, true);
            buffer.write('" type="text/javascript"></script>\r\n<script src="', 0);
            var id14 = scope.resolve(["config", "server"], 0);
            buffer.write(id14, true);
            buffer.write('/', 0);
            var id15 = scope.resolve(["config", "version"], 0);
            buffer.write(id15, true);
            buffer.write('/deps.js"></script>\r\n<link href="http://g.tbcdn.cn/tbc/search-suggest/1.0.30/new_searchbox-min.css" rel="stylesheet"/>\r\n<script>KISSY.importStyle(\'mercury/p/', 0);
            var id16 = scope.resolve(["info", "jsmod"], 0);
            buffer.write(id16, true);
            buffer.write('/index\');</script>\r\n<script src="http://a.tbcdn.cn/p/snsdk/core.js"></script>\r\n', 0);
            return buffer;
        };
layoutHead.TPL_NAME = module.name;
layoutHead.version = "5.0.0";
return layoutHead
});