define(['jquery', 'cookie','detail/sem', 'initDevice'],function($, cookie, sem, initDevice){

        //豌豆荚是否安装
    var wdInstalled = (navigator.plugins && navigator.plugins['Wandoujia Plugin']) || $.cookie('last_launch'),
        logined = config ? config.logined : false,
        isWindows = navigator.userAgent.indexOf('Windows') > 0,
        pushBtn = $('#push-btn'),
        appName = $.trim($('.app-title').text()),
        installBtn = $('#install-btn'),

        installtipWrap = $('.installtip-wrap'),

        downloadURLPrefix = 'http://apps.wandoujia.com/apps/',
        pn = $('body').data('pn'),
        apkURL = downloadURLPrefix + pn + '/download',
        installURL = apkURL + '?pos=www/detail',
        pushURL = apkURL + '?pos=www/push';

    if(!sem.isPMT){
        // 如果已经登录则显示 push 安装
        if(logined){
            installBtn.hide();
            pushBtn.show();
        }else{
            // 如果已经安装了豌豆荚，则打开豌豆荚下载;或者是否合作渠道的流量，比如网吧
            // 6-25 fix bug by zhangyaochun for if $.cookie('__utmz') return undefined 
            if(wdInstalled || ($.cookie('__utmz') && $.cookie('__utmz').indexOf('shunwang') > 0)){
                installBtn.show()
                    .attr('href','wandoujia://type=apk&wdj=1&name=' + appName + '&url=' + installURL + '==');
                pushBtn.hide();
            }else{
                installBtn.attr('href', installURL)
                    .html('下 载');
            }
        }


        //add install tip by zhangyaochun 6-15
        //sem流量 use this href
        installtipWrap.find('.down').attr('href','http://dl.wandoujia.com/files/third/WanDouJiaSetup_a14.exe');
    }

    // 二维码下载逻辑
    function initQRHelp(){
        var helpIcon = $('.icon-help'),
            helpContent = $('#qr-howto'),
            helpShowing = 0,
            hideHelp = function(){
                if(!helpShowing){
                    return;
                }
                helpContent.hide();
                helpShowing = 0;
            };

        helpContent.on('click', function(event){
            event.stopPropagation();
        });
        helpIcon.on('click', function(event){
            event.stopPropagation();
            helpContent.show();
            helpShowing = 1;
        });
        $('body').on('click', hideHelp);
    }
    initQRHelp();

    // set directly download url
    $('#dl-link').attr('href', apkURL);

    initDevice.init(function(DeviceCenter){
        pushBtn.on('click', function(){
            DeviceCenter.pushService({
                data : {
                    url : pushURL,
                    name : appName,
                    packageName: pn,
                    versionCode: pushBtn.data('vc')
                }
            });
        });
    });



    //add install tip by zhangyaochun 6-15
    //close wrap
    installtipWrap.find('.close').click(function(){
        $('.installtip-wrap').hide();
    });

});