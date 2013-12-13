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


    $(function () {
        //获取豌豆币的数目
        var wdj_auth = $.cookie('wdj_auth'),
            loading = $('.j-status-loading');

        SnapPea.Account.checkUserLoginAsync()
        .then(function() {
            console.log(111)
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
            console.log(222)
            loading.hide();
            $('.j-status-logout').show();
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