(function() {

    function isString(source) {
        return Object.prototype.toString.call(source) === "[object String]";
    }


    function parseJSON(source) {
        if (isString(source)) {
            if (window.JSON && window.JSON.parse) {
                return window.JSON.parse(source);
            } else {
                return (new Function("return" + source))();
            }
        }
        return null;
    }

    /** underscore template start  **/
    var noMatch = /.^/,
        templateSettings = {
            evaluate    : /<%([\s\S]+?)%>/g,
            interpolate : /<%=([\s\S]+?)%>/g,
            escape      : /<%-([\s\S]+?)%>/g
        };

    function unescape(code) {
        return code.replace(/\\\\/g, '\\').replace(/\\'/g, "'");
    };    

    // Escape a string for HTML interpolation.
    function escape(string) {
        return (''+string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;');
    };

    function template(str, data){
        var c  = templateSettings;
        var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' +
            'with(obj||{}){__p.push(\'' +
            str.replace(/\\/g, '\\\\')
               .replace(/'/g, "\\'")
               .replace(c.escape || noMatch, function(match, code) {
                 return "',escape(" + unescape(code) + "),'";
               })
               .replace(c.interpolate || noMatch, function(match, code) {
                 return "'," + unescape(code) + ",'";
               })
               .replace(c.evaluate || noMatch, function(match, code) {
                 return "');" + unescape(code).replace(/[\r\n\t]/g, ' ') + ";__p.push('";
               })
               .replace(/\r/g, '\\r')
               .replace(/\n/g, '\\n')
               .replace(/\t/g, '\\t')
               + "');}return __p.join('');";

        var func = new Function('obj', '_', tmpl);
          
        if (data) return func(data);
          return function(data) {
            return func.call(this, data);
        };
    }
    /** underscore template end  **/

    $(function () {
        //获取豌豆币的数目
        var wdj_auth = $.cookie('wdj_auth'),
            loading = $('.j-status-loading');

        SnapPea.Account.checkUserLoginAsync()
        .then(function() {
            $.ajax({
                url: 'https://pay.wandoujia.com/pay/web/query?wdj_auth=' + wdj_auth,
                dataType: 'jsonp',
                success: function(rs) {
                    if (rs.errorCode == "SUCCESS") {
                        var basicJson = parseJSON(rs.basicJson),
                            balance = 0;
                        if (basicJson && basicJson.balance) {
                            balance = basicJson.balance;
                        }
                        $('#wdb-num').text(balance);
                        loading.hide();
                        $('.j-status-logined').show();
                    }
                }
            });
        }).fail(function() {
            loading.hide();
            $('.j-status-logout').show();
        });


        //@info get dynamic date from special list
        //@author zhangyaochun
        var payGameStr = '<li class="app">\n    <a class="icon-area" href="http://www.wandoujia.com/apps/<%= packageName %>" title="<%= title %>">\n        <img src="<%= icons.px68 %>" width="68" height="68" alt="<%= title %>">\n    </a>\n\n    <div class="operate">\n        <a href="http://www.wandoujia.com/apps/<%= packageName %>" class="name">\n            <span class="txt"><%= title %></span>\n        </a>\n\n        <% if(apks[0] && apks[0].superior && apks[0].superior == 1){ %>\n        <a class="tag gooddev" href="http://developer.wandoujia.com/apps/review-guideline/" target="_blank" title="豌豆荚认证的优质开发者"></a>\n        <% } %>\n\n        <div class="likesCount"><%= likesCount %> 人喜欢</div>\n        <div class="downloadCount"><%= downloadCountStr %> 人下载</div>\n\n    </div>\n</li>',
            payGameTpl = template(payGameStr),
            opt_fields = 'opt_fields=apps.icons.px68,apps.installedCountStr,apps.likesCount,apps.downloadCountStr,apps.apks.*,apps.title,apps.packageName';
        
        $.ajax({
            url : 'http://apps.wandoujia.com/api/v1/special/gamesforwdb?start=0&max=4&'+opt_fields,
            dataType: 'jsonp',
            success : function(rs) {
                var data = rs.apps,
                    i = 0,
                    length = data.length,
                    str = '';

                for(;i<length;i++){
                    str += payGameTpl(data[i]);
                }

                $('.games-list').html(str);
            }
        });

    });


    //header的推出完成调用
    window.updateUserStatus = function () {
        var wdj_auth = $.cookie('wdj_auth');

        if (wdj_auth) {
            //登录后

            //还得查豌豆币余额
            $.ajax({
                url: 'https://pay.wandoujia.com/pay/web/query?wdj_auth=' + wdj_auth,
                dataType: 'jsonp',
                success: function(rs) {
                    if (rs.errorCode == "SUCCESS") {
                        var basicJson = parseJSON(rs.basicJson),
                            balance = 0;
                        if (basicJson && basicJson.balance) {
                            balance = basicJson.balance;
                        }
                        $('#wdb-num').text(balance);

                        $('.j-status-logined').show();
                        $('.j-status-logout').hide();
                    }
                }
            });


        } else {
            //注销后
            $('.j-status-logined').hide();
            $('.j-status-logout').show();
        }
    };

})();