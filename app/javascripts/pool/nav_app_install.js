/**
 * 导航页面的应用安装初始化
 * @author jintian
 */

$.fn.downloadApp = function(targets, options){
    if(!targets){
        return;
    }
    var downloadObjs = [],
        i,
        printLog = 1,
        redirectPrefix = 'http://apps.wandoujia.com/redirect',
        log = function(str){
            if('undefined' !== typeof console && console.log && printLog){
                console.log(str);
            }
        };

    for(i = targets.length; i-- ;){
        var item = $(targets[i]),
            appLink = item.attr('url');
        if(!appLink){
            return log('App download url is null.');
        }
        
        var trackCode = item.attr('pos'),
        appName = item.attr('name'),
        queryWord = item.attr('q'),
        from = item.attr('from'),
        iscampaign = item.attr('iscampaign'),
        providerId = item.attr('pid'),
        appId = item.attr('appid'), 
        pn = item.attr('pn'), 
        flag = $.cookie('wd_flag'), 
        uid = $.cookie('wd_uid');

        if(!trackCode){
            log('Can not find "pos" codes.');
        }
        else {
            var gaTrack = trackCode.split('/'),
                category = gaTrack.shift(),
                label = gaTrack.shift();
            if(typeof gaTag != 'undefined') {
                category = "test" + category;
            }
            _gaq.push(['_trackEvent', category, 'install', label]);
        }
        var param = "";
        var guid = clientTool ? clientTool.getGuid() : "";

        if (iscampaign) {
            param = 'guid=' + guid + '&pos=' + trackCode;
        }
        else if(providerId == "9" || providerId == "18") {
            param = 'guid=' + guid;
        }

        var downloadUrl;
        if(appLink.indexOf(redirectPrefix) >= 0){
            downloadUrl = appLink; 
        }else if(options && options == 'search'){
            var timestamp = Date.parse(new Date()); 
            appLink += (!param) ? "" : ((appLink.indexOf('?') >= 0 ? '&' : '?') + param);
            downloadUrl = appLink + (appLink.indexOf('?') >= 0 ? '&' : '?')
            + 'timestamp=' + timestamp
            + ( uid ? ( '&uid=' + uid ) : '' )
            + ( flag ? ( '&flag=' + flag ) : '' )
            + ( from ? ( '&from=' + from ) : '' )
            + '&pos=' + trackCode + ( queryWord ? ( '&q=' + queryWord ) : '' )
            + (appId ? ('&appid=' + appId) : '')
        }
        else{
            appLink += (!param) ? "" : ((appLink.indexOf('?') >= 0 ? '&' : '?') + param);
            downloadUrl = redirectPrefix + '?url=' 
            + encodeURIComponent(appLink) 
            + ( uid ? ( '&uid=' + uid ) : '' )
            + ( flag ? ( '&flag=' + flag ) : '' )
            + ( from ? ( '&from=' + from ) : '' )
            + '&pos=' + trackCode + ( queryWord ? ( '&q=' + queryWord ) : '' )
            + (appId ? ('&appid=' + appId) : '')
            + (pn ? ('&pn=' + pn) : '');
        }


        if(options && options == "essential") {
            downloadObjs.push({
                downloadUrl: downloadUrl,
                name: appName,
                source: "app_interface"
            });
        }
        else {
            downloadObjs.push({
                downloadUrl: downloadUrl,
                name: appName
            });
        }
    }
    
    if(window.externalCall) {
        window.externalCall("application", "appdownload", JSON.stringify(downloadObjs));
    } else {
        log(JSON.stringify(downloadObjs));
    }
};

//游戏数据包下载
//title 规则: [游戏名] - [高通]数据包
//Narya.Doraemon.downloadAsync (app 包含 downloadUrl, title, icon, format)

$.fn.downloadAppWithGameContent = function(targets, gameTargets, options) {
    if(options && options == 0) {
        $.fn.downloadApp(targets, 'search');
    }else{
        $.fn.downloadApp(targets);
    }
    // 如果没有数据包图标，就显示客户端默认图标
    if (typeof gameTargets['icon'] == 'undefined') {
        gameTargets['icon'] = "images/icon_default_app_36X36.png";
    }
    if(parent && (window.OneRingRequest !== undefined) && (window.OneRingStreaming !== undefined)) {
        Narya.Doraemon.downloadAsync(gameTargets['type'], gameTargets['downloadUrl'], gameTargets['title'], gameTargets['icon'], gameTargets['format']);
    }
    else {
        console.log(JSON.stringify(gameTargets));
    }
}

$.fn.initGameContentDownload = function(options) {
    $('.gamecontent-download').live('click',function() {
        var brand = 
        {
            'general' : '通用版',
            'qc' : '高通版',
            'nvidia' : 'nVidia 版',
            'ti' : '德州仪器版',
            'mali' : 'Mali 版'
        };

        var item = $(this);
        if(item.attr('disabled')) {
            return;
        }

        item.attr('disabled',true);


        if($.fn.appTargets) {

            if($('#dlc-list input').is(':checked') && $('#dlc-list input:checked').val() != 'none') {
                $.fn.downloadAppWithGameContent($.fn.appTargets, (function(){
                    var checkedItem = $('#dlc-list input:checked'),
                        defaultValue = checkedItem.val(),
                        gps = checkedItem.parent().parent().index(),
                        target = $($('#dlc-list li')[gps]).find('.dlc-radios');
                    statGameContentSetup(defaultValue);
                    return {
                        type : 'app-data',
                        downloadUrl : target.attr('url'),
                        title : $.fn.appTargets.attr('name') + ' ' + brand[defaultValue] + '数据包',
                        icon : $('.img-wp').length>0 ? $('.img-wp img').attr('src') : $.fn.appTargets.parent().find('img').attr('src'),
                        format : 'zip'
                    };
                })(), 0);
            }
            else {
                statGameContentSetup('none');
                if(options && options == 0) {
                    $.fn.downloadApp($.fn.appTargets, 'search');
                }else{
                    $.fn.downloadApp($.fn.appTargets);
                }
            }
        }

        closePopup();
    });
};

// 统计数据包下载的情况
var statGameContentOpen = function(){
        new Image().src = 'http://wa.wandou.in/__utm.gif?v=1.0&e=detail/gameContent/open&p=nav';
};
var statGameContentSetup = function(type){
        new Image().src = 'http://wa.wandou.in/__utm.gif?v=1.0&e=detail/gameContent/setup/' + type + ' &p=nav';
};
var statGameContentClose = function(){
        new Image().src = 'http://wa.wandou.in/__utm.gif?v=1.0&e=detail/gameContent/close&p=nav';
};

var insertGameItem = function(btn) {
    $('#dlc-list li').not('.dlc-apk').remove();
    var brands = {
        'general' : {
                'name' : '通用数据包',
                'description' : '此数据包兼容市面上大多数手机，如下载后仍无法运行游戏，可能是你的手机当前还不支持此游戏。',
            },
        'qc' : {
                'name' : '高通版数据包',
                'description' : '支持采用高通 Adreno GPU 的手机。如小米、三星S5830、HTC Incredible S 等。',
            },
        'mali' : {
                'name' : 'Mali 版数据包',
                'description' : '支持采用 Mali-400 MP GPU 的手机。如三星 i9100、i9220、魅族 MX 手机。',
            },
        'ti' : {
                'name' : '德州仪器版数据包',
                'description' : '支持采用 PowerVR GPU 的手机。如 MOTO Defy、三星 i9000、Galaxy Nexus、魅族 M9 等。',
            },
        'nvidia' : {
                'name' : 'nVidia 版数据包',
                'description' : '支持采用 Tegra GPU 的手机。如 MOTO A4G、LG 2X 等。',
            },
    };

    var part = [];
        part[part.length] = '<li><label class="dlc-title"><input id="dlc-',
        part[part.length] = '" class="dlc-radios" type="radio" name="dlc-select" value="',
        part[part.length] = '" url="',
        part[part.length] = '" />',
        part[part.length] = ' (',
        part[part.length] = ')</label><p class="meta">',
        part[part.length] = "</p></li>";

    for(i=0;i<10;i++) {
        var type = btn.data('type' + i),
            url = btn.data('url' + i),
            size = btn.data('size' + i);
        if(typeof(type) != 'undefined') {
            $('.dlc-apk').before(part[0] + type + part[1] + type + part[2] + url + part[3] + brands[type]['name'] + part[4] + size + part[5] + brands[type]['description']) + part[6];
        }
        else {
            break;
        }
    }
};


$.fn.initDownload = function(options){
    var config = $.extend({
        trigger : $('.btn-download'),
        relatedEl : function(){
            return this;
        }
    }, options);

    config.trigger.bind({
        'click' : function(){

            var item = $(this),
                tempText = item.html(),
                hasGameContent = item.attr('hasGameContent');

            if(!hasGameContent || (window.OneRingRequest === undefined) || (window.OneRingStreaming === undefined)) {
                if(item.attr('disabled')){
                    return;
                }
                item.attr('disabled',true);
                if(item.html() && $.trim(item.text()) == '安 装'){
                    item.html('安装中').addClass('disabled-btn');
                }
                // 3秒内安装按钮重复点击无效
                setTimeout(function(){
                    item.attr('disabled',false);
                    if(item.html()){
                        item.html(tempText).removeClass('disabled-btn');
                    }
                    
                },3000);

                if(options) {
                    $.fn.downloadApp(config.relatedEl.call(item), options);
                }else {
                    $.fn.downloadApp(config.relatedEl.call(item));
                }
                item.attr('disabled', true);
            }
            else
            {
                if(hasGameContent == 1)
                {
                    $.fn.appTargets = item;
                    insertGameItem(item);
                    $.fn.popup();
                    $.fn.setPopup({
                        content : function(){
                            return $('#dlc-dialog').html();
                        },
                        onClose : statGameContentClose,
                        opacity: 0.0
                    });
                    statGameContentOpen();
                    $.fn.showPopup(item);
                    if(options && options == 'search') {
                        $.fn.initGameContentDownload(0);
                    }else {
                        $.fn.initGameContentDownload();
                    }
                }
                else
                {
                    if(item.attr('disabled')){
                        return;
                    }
                    item.attr('disabled',true);
                    if(item.html()){
                        item.html('安装中').addClass('disabled-btn');
                    }
                    // 3秒内安装按钮重复点击无效
                    setTimeout(function(){
                        item.attr('disabled',false);
                        if(item.html()){
                            item.html(tempText).removeClass('disabled-btn');
                        }
                        
                    },3000);

                    if(options) {
                        $.fn.downloadApp(config.relatedEl.call(item), options);
                    }else {
                        $.fn.downloadApp(config.relatedEl.call(item));
                    }
                    item.attr('disabled', true);
                }
            }
        }
    });
};
