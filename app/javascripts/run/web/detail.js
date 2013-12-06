/**
 * @desc web版应用详情页逻辑
 * @author jintian
 */

// 提供安装按钮hover，mousedown状态样式
(function(win){

    $(document).delegate('#popup-install','click', function(){
        var link = $(this);
        var t = setTimeout(function(){
            link.addClass('disabled-btn').html('已经开始下载');
            $('.step-one').hide();
            $('.step-two').show(); 
            clearTimeout(t);
        }, 500);

        setTimeout(function(){
            link.removeClass('disabled-btn').html('重新下载');
        }, 3000);
    });

    win.openShareLink = function(){
        if(!detailCfg.appName){
            return;
        }
        
        var sharePic = $('.carousel-items img:eq(0)'),
            wandouId = '1727978503',
            url = 'http://service.weibo.com/share/share.php?url=' + location.href 
                + '&appkey=1483181040'
                + '&title=' + encodeURIComponent('我在 #豌豆荚# 发现了一款应用「' + detailCfg.appName + '」')
                + ( sharePic.length ? ( '&pic=' + sharePic[0].src ) : '' ) 
                + '&ralateUid=' + wandouId;
        if('undefined' !== typeof externalCall){
            externalCall('common', '_open_internet_link_', url);    
        }else{
            win.open( url,
            'mb' ,
            [ 'toolbar=0,status=0,resizable=1,width=640,height=430,left=',
                ( screen.width - 640 ) / 2,
                ',top=' ,
                ( screen.height - 430 ) / 2 
            ].join(''));
        }
        
    };
})(window);

$(function(){

    // 搜索提示
    $('.search-ipt').suggestion();

    var installBtn = $('.push-install');
    // 根据用户的登录状态初始化相应的应用安装逻辑
    installBtn.click(function(event){
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
            $.fn.showPopup();
        }
        
    }).popup();

    $.fn.setPopup({
        content : function(){
            return $('#install-pop').val();
        },
        closeBtn : $('.popup-close'),
        onClose :　function(){

        },
        maskOpacity : .6,
        popopClass : 'green-popup'
    });

    if(!globeConfig.logined){
        $.fn.showPopup();    
    }
    var trackEvent = function(opt) {
        if(typeof _gaq != 'undefined' && _gaq){
            var _act, _cat, _lbl, _val;
            if (opt) {
                _cat = opt.category || "";
                _act = opt.action || "";
                _lbl = opt.label || "";
                _val = opt.value || 0;
                return _gaq.push(['_trackEvent', _cat, _act, _lbl, _val]);
            }
        }
    };
    
    //通过连接的track属性统计点击次数
    if(typeof _gaq != 'undefined' && _gaq){
        $('a[track]').live('click', function(e) {
            var trackCode = $(this).attr('track'),
                codes = trackCode.split('/');

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
    
    // 初始化图片的轮播展示
    var allImgLoaded = 0,
        itemImgs =  $('.carousel-items img');
    itemImgs.each(function(){
        var item = $(this);
        item.load(function(){
            var showCount = 3;
            $('.carousel-loading').hide();
            item.show();
            if(item.width() > item.height()){
                showCount = 1;
                item.height('300');
            }else{
                item.width('200');
            }
            allImgLoaded += 1;
            if(allImgLoaded == itemImgs.length && allImgLoaded > 3){
                
                $('.app-carousel').carousel({
                    itemContainer : '.carousel-items',
                    nextBtn : '.prev,.prev .arrow',
                    prevBtn : '.next,.next .arrow',
                    btnNav : 1,
                    showCount : showCount,
                    autoScroll : 0,
                    navTriggerTime : 500,
                    prevDisableClass : 'disabled',
                    nextDisableClass : 'disabled',
                    easeEffect : 'easeInSine'
                });
                $('.arrow').fadeIn();
            }
        });
        item.attr('src', item.attr('origin'));
    });
    if(itemImgs.length ==1){
        itemImgs.parent().css('margin','0 auto');
    }
    
    $('#share-weibo').click(function(){
        setTimeout(openShareLink,16);
    });

    var urlPrefix = 'http://apps.wandoujia.com/apps/';
    installBtn.attr('href',urlPrefix + installBtn.data('packagename') + '/download');
    

    // 安全检测信息 bubble 展示
    $('.check-item').bubble({
        setContent : function(){
            return $('#security-info').html();
        },
        wallEl : $('.detail-wrapper'),
        verticalOffset : 12
    });
    
    // 广告检测信息 bubble 展示
    $('.check-ads-item').bubble({
        setContent : function(){
            return $('#ads-info').html();
        },
        wallEl : $('.detail-wrapper'),
        verticalOffset : 12
    });
});
