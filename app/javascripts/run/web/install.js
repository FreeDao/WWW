$(function(){

    $('.search-ipt').suggestion();

    //通过连接的track属性统计点击次数
    if(typeof _gaq != 'undefined' && _gaq){
        $('a[track]').live('click', function(e) {
            var trackCode = $(this).attr('track'),
                codes = trackCode.split('/');
            //_gaq.push(['_trackPageview',trackCode ]);

            if(codes.length > 2){
                trackEvent({
                    category : codes[0],
                    action : codes[1],
                    label : codes[2]
                });
            }
        });
    }

    //搜索框
    $('.search-box').submit(function(event){
       event.preventDefault();
       if($.trim($('.search-ipt').val()) === ''){
           return false;
       }
       this.submit();
    });

    $('.search-btn').click(function(){
        $('.search-box').submit();
    });



    // 根据用户的登录状态初始化相应的应用安装逻辑
    $('.dl-btn').click(function(event){
        if(typeof globeConfig == 'undefined' || !globeConfig){
            return;
        }
        event.preventDefault();
        var _self = $(this);
        if(globeConfig.logined){
            // 登录的时候实用应用推送
            AppPush.init(_self);
        }else{
            // 未登录用户使用一键安装
            AppInstall.init(_self);
        }
    }).popup();

});