function jscallback(json){

    var search = location.search.split('?')[1],
        fillCode = false;
    if (search) {
        var dcode = search.split('=');
        if (dcode[0] == 'dcode'){
            $('.code').val(dcode[1]);
            fillCode = true;
        }
    }

    if (json) {
        $.ajax({
            url: 'http://mario.wandoujia.com/api/v1/users/me',
            type: 'GET',   
            dataType: 'jsonp',
            timeout: 5000,
            success: function(json) {
                var authorities = json.authorities;
                for (var i = 0; i < authorities.length; i++) {
                    if (authorities[i] == 'ROLE_MARIO') {
                        $('.main').hide();
                        $('.success').show();
                    }
                };
            }
        });
        if (fillCode) {
            var code = $('.code').val();
            sendCode(code);
        }
    }

    $('.submit').click(function () {
        var code = $('.code').val(),
            weiboBindUrl = $('.bind-weibo-btn').attr('href'),
            weiboLoginUrl = $('.login-weibo-btn').attr('href');

        if (json) {
            if (json.activesina != "1") {
                $('.input-wrapper').hide();
                $('.bind-weibo').show();
                $('.bind-weibo-btn').attr('href', weiboBindUrl + '?dcode=' + code);
            } else {
                sendCode(code);
            }
        } else {
            $('.input-wrapper').hide();
            $('.login-weibo').show();
            $('.login-weibo-btn').attr('href', weiboLoginUrl + '?dcode=' + code);
        }
    });
}

function sendCode(code) {
    $('.submit').text('正在验证');
    $.ajax({
        type: "GET",
        url: "http://mario.wandoujia.com/api/v1/register",
        dataType: 'jsonp',
        timeout: 5000,
        data: {
                "code": code
            },
        success: function(json) {
            var authorities = json.authorities,
                fail = true;

            for (var i = 0; i < authorities.length; i++) {
                if (authorities[i] == 'ROLE_MARIO') {
                    $('.main').hide();
                    $('.success').show();
                    fail = false;
                }
            };

            if (fail) {
                $('.submit').text('抢先试用');
                $('.alert').show();
            }
        },
        error: function() {
            $('.submit').text('抢先试用');
            $('.alert').show();
        }
    });
}