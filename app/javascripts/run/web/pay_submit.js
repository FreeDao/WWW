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

    //验证是否是数字

    function checkNum(str) {
        if (str.search(/^\d+$/) !== -1) {
            return true;
        } else {
            return false;
        }
    }


    $(function() {

        //加上强制验证，如果没有cookie的话，不能进入这个页面
        var wdj_auth = $.cookie('wdj_auth');
        if (!wdj_auth) {
            location.href = "http://www.wandoujia.com/pay";
        }


        //查一下余额
        if (SnapPea.Account.isLogined() && wdj_auth) {
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
                        $('#balance').text(balance + " 豌豆币");
                    }
                }
            });
        }

        //需要请求order_id
        if (SnapPea.Account.isLogined() && wdj_auth) {
            $.ajax({
                url: 'https://pay.wandoujia.com/pay/web/create?wdj_auth=' + wdj_auth,
                dataType: 'jsonp',
                success: function(rs) {
                    if (rs.errorCode == "SUCCESS") {
                        var basicJson = parseJSON(rs.basicJson),
                            orderId = "";
                        if (basicJson && basicJson.orderId) {
                            orderId = basicJson.orderId;
                        }
                        $('#order_id').val(orderId);
                    }
                }
            });
        }


        //快速充值
        $('.quick-num').click(function() {
            var that = $(this),
                money = that.data("money");

            $('.quick-num').removeClass('current');
            that.addClass('current');

            //关闭如果显示的自定义的提示
            $('.custom-choose-tips').fadeOut();
            $('#custom-money').val("");

            $('#money').val(money);

        });

        //自定义金额change
        $('#custom-money').change(function() {
            $('.quick-num').removeClass('current');
        });


        //选择银行
        $('[name="bank-type"]').click(function() {
            var curVal = $(this).val();
            if (curVal == 'ALIPAY') {
                $('#charge_type').val("ALIPAYWEB");
            } else {
                $('#charge_type').val("BANKPAYWEB");
            }
            $('#channel_inst').val(curVal);
        });


        //选择支付方式
        $('.pay-type').click(function() {
            var that = $(this),
                parent = that.closest('.pay-area');
            if (that.hasClass('open')) {
                //当前是打开的
                that.removeClass('open');
                parent.removeClass('area-active');

            } else {
                $('.pay-type').removeClass('open');
                that.addClass('open');

                $('.pay-area').removeClass('area-active');
                parent.addClass('area-active');
            }
        });


        //提交按钮
        $('#wdb-buy').click(function() {

            var customMoney = $('#custom-money').val(),
                money = $('#money').val(),
                orderId = $('#order_id').val(),
                channel_inst = $('#channel_inst').val(),
                charge_type = $('#charge_type').val();

            //看是否填了自定义金额
            if (customMoney) {
                //12-9 需要验证是否是数字
                if (!checkNum(customMoney)) {
                    $('.custom-choose-tips').fadeIn();
                    return false;
                }
                money = customMoney;
            }

            data = 'money=' + money + '&wdj_auth=' + wdj_auth + '&charge_type=' + charge_type + '&orderId=' + orderId;

            //如果是选择银行，加参数
            if (channel_inst != 'ALIPAY') {
                data += '&channel_inst=' + channel_inst;
            }

            //上一次的提示关掉
            $(".alert").fadeOut();


            $('#wdb-buy').attr('href', 'https://pay.wandoujia.com/pay/web/charge?' + data);

            showPopup();

        });
    });


    //header的推出完成调用
    window.updateUserStatus = function() {
        //还是看cookie吧，没有就表示推出了，然后转向支付首页
        var cookie = $.cookie('wdj_auth');
        if (!cookie) {
            location.href = "http://www.wandoujia.com/pay";
        }
    };


    function showPopup(data) {
        //需要先执行以下，然后生成$.fn.setPopup，不然undefined
        $.fn.popup();

        $.fn.setPopup({
            popopClass: 'wdb-modal popup-main',
            content: function() {
                return $('.wdb-modal')[0].innerHTML;
            },
            onOpen: function() {

                //点击已完成付款按钮需要查询接口
                $('.finish-btn').click(function() {

                    var wdj_auth = $.cookie('wdj_auth'),
                        orderId = $('#order_id').val();

                    $.ajax({
                        url: 'https://pay.wandoujia.com/pay/web/order/query?wdj_auth=' + wdj_auth + '&orderId=' + orderId,
                        dataType: 'jsonp',
                        success: function(rs) {
                            if (rs.errorCode == "SUCCESS") {
                                //成功了就跳到首页去吧
                                location.href = "http://www.wandoujia.com/pay";

                            } else {
                                //给个提示吧
                                $(".alert").fadeIn();

                                //清空href
                                $('#wdb-buy').attr('href', 'javascript:void(0);');

                            }

                            closePopup();
                        }
                    });

                });

            },
            onClose: function() {
                //12-9 关闭后需要刷新uid
                var wdj_auth = $.cookie('wdj_auth'),
                    orderId = $('#order_id').val();

                $.ajax({
                    url: 'https://pay.wandoujia.com/pay/web/order/query?wdj_auth=' + wdj_auth + '&orderId=' + orderId,
                    dataType: 'jsonp',
                    success: function(rs) {
                        if (rs.errorCode == "SUCCESS") {
                            //成功了就跳到首页去吧
                            location.href = "http://www.wandoujia.com/pay";

                        } else {
                            //给个提示吧
                            $(".alert").fadeIn();

                            //清空href
                            $('#wdb-buy').attr('href', 'javascript:void(0);');

                            //重新请求order_id
                            $.ajax({
                                url: 'https://pay.wandoujia.com/pay/web/create?wdj_auth=' + wdj_auth,
                                dataType: 'jsonp',
                                success: function(rs) {
                                    if (rs.errorCode == "SUCCESS") {
                                        var basicJson = parseJSON(rs.basicJson),
                                            orderId = "";
                                        if (basicJson && basicJson.orderId) {
                                            orderId = basicJson.orderId;
                                        }
                                        $('#order_id').val(orderId);
                                    }
                                }
                            });

                        }


                    }
                });



            },
            opacity: 0.2
        });

        $.fn.showPopup();
    }

})();