$(function(){

    $('.dc-notifier').hide();

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

    // 根据用户的登录状态初始化相应的应用安装逻辑
    $('.push-install').click(function(event){
        event.preventDefault();
        var _self = $(this);
        if(typeof globeConfig == 'undefined' || !globeConfig || _self.attr('disabled')){
            return;
        }
        _self.attr('disabled',true);
        var linkText = _self.html();
        if(linkText){
            _self.html(linkText + '中').addClass('disabled-btn-b');
        }
        // 3秒内安装按钮重复点击无效
        setTimeout(function(){
            _self.attr('disabled',false);
            if(linkText){
                _self.html(linkText).removeClass('disabled-btn-b');
            }
        },3000);
        
        if(globeConfig.logined){
            // 登录的时候实用应用推送
            AppPush.init(_self);
        }else{
            // 未登录用户使用一键安装
            AppInstall.init(_self);
        }
        
    }).popup();


    /**
     * 为bubble提供内容，this 指向触发bubble 显示动作的元素
     * 提供给初始化bubble的时候使用
     */
    var buildBubbleContent = function(target){
        // 一般把app的信息绑定到 app的icon 链接上
        var item = this.parent().parent().find('.app-img'),
            // app 名字
            name = item.data('name'),
            // app 版本号
            version = item.data('version'),
            // app 下载次数
            down = item.data('size'),
            // app 大小
            size = item.data('down'),
            // app的描述
            desc = item.data('desc');
            // 因为bubble 是自适应宽度，由内容来决定宽度，所以名字不能太长，需要截断
            name = name && name.length > 12 ? name.substr(0, 12) : name;
            version = version && version.length > 10 ? version.substr(0, 10) : version;

        return  ( name ? ( '<h5 class="title">' + name + '<small>' + version + '</small>' + '</h5>') : '' ) +
                ( down ? ( '<span class="meta">' + down + '</span>') : '' ) +
                ( size ? ( '<span class="meta">' + size + '次下载</span>') : '') +
                ( desc ? ( '<div class="desc">' + desc + '</div>' ) : '' );

    };

    // 初始化 app 的bubble，需要提供bubble的内容，和bubble相对位置计算的元素
    $('.apps .app-item .app-img img').bubble({
        setContent : buildBubbleContent,
        // // 垂直位置的偏移量，块级app可以小一点
        // verticalOffset : 50,
        horizontalOffset : 0
    });


});