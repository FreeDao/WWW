DeviceCenterWidget.define('www/device/apps', ['mustache', 'devicecenter', 'data/ga'], function(Mustache, DeviceCenter, GA) {

var template = '{{#apps}}' +
    '<li class="item clearfix" data-name="{{title}}" data-version="{{versionName}}" data-versioncode="{{versionCode}}" data-size="{{sizeExp}}" data-desc="{{description}}" data-down="{{downloadCnt}}" data-packagename="{{packageName}}">' + 
        '<a target="_blank" title="" href="http://www.wandoujia.com/apps/{{packageName}}" class="icon"><img src="{{icon}}" alt="{{title}}"/></a>' + 
        '<div class="name">{{title}}</div>' +
        '<div class="actions">' +
            '<span class="btn-push" data-url="{{url}}" data-versioncode="{{versionCode}}" data-packagename="{{packageName}}" data-title="{{title}}"><em class="on">推送</em><em class="off">推送中</em></span>' +
            '<span class="btn-open-menu"><span><em></em></span></span>' +
        '</div>' +
    '</li>' +
'{{/apps}}';



var buildBubbleContent = function(target){
    // 一般把app的信息绑定到 app的icon 链接上
    var item = this.closest('.item'),
        // app 名字
        name = item.data('name'),
        // app 版本号
        version = item.data('version'),
        // app 下载次数
        down = item.data('down'),
        // app 大小
        size = item.data('size'),
        // app的描述
        desc = item.data('desc');
        // 因为bubble 是自适应宽度，由内容来决定宽度，所以名字不能太长，需要截断
        name = name && name.length > 12 ? name.substr(0, 12) : name;
        version = version && version.length > 10 ? version.substr(0, 10) : version;
    
    return  ( name ? ( '<h5 class="title">' + name + '<small>' + version + '</small>' + '</h5>') : '' ) + 
            ( size ? ( '<span class="meta">' + size + '</span>') : '' ) + 
            ( down ? ( '<span class="meta">' + down + '次安装</span>') : '') + 
            ( desc ? ( '<div class="desc">' + desc + '</div>' ) : '' );
    
};

var openShareLink = function(appName, appUrl){
    var sharePic = $('.carousel-items img:eq(0)'),
        wandouId = '1727978503',
        url = 'http://service.weibo.com/share/share.php?url=' + appUrl + 
            '&appkey=1483181040' + 
            '&title=' + encodeURIComponent('我在 #豌豆荚# 发现了一款应用「' + appName + '」') + 
            '&ralateUid=' + wandouId;
            // + ( sharePic.length ? ( '&pic=' + sharePic[0].src ) : '' ) 
    if('undefined' !== typeof externalCall){
        externalCall('common', '_open_internet_link_', url);    
    }else{
        window.open( url,
        'mb' ,
        [ 'toolbar=0,status=0,resizable=1,width=640,height=430,left=',
            ( screen.width - 640 ) / 2,
            ',top=' ,
            ( screen.height - 430 ) / 2 
        ].join(''));
    }
    
};


var fetchAppsList = function() {
    var deferred = $.Deferred();
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: '/offlinepush/my',
        cache: false,
        success: function(resp) {
            if (resp.error === 0) {
                deferred.resolve(resp.data);
            }
            else {
                deferred.reject();
            }
        },
        error: function() {
            deferred.reject();
        }
    });
    return deferred.promise();
};

var deleteAppFromList = function(packageName) {
    var deferred = $.Deferred();
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: '/offlinepush/remove',
        cache: false,
        data: {
            packageName: packageName
        },
        success: function(resp) {
            if (resp.error === 0) {
                deferred.resolve();
            }
            else {
                deferred.reject();
            }
        },
        error: function() {
            deferred.reject();
        }
    });
    return deferred.promise();
};

var displayNoApp = function() {
    $('.dcw-pa-apps-list').html('<span class="noapp">没有找到您推送过的应用，或者您较早前推送过的应用没有记录 :(<br>再去 <a href="http://www.wandoujia.com/apps">全部应用</a> 看看有什么新应用吧。</span>');
};

return function() {

$.when(fetchAppsList()).
    then(function(data) {
        if (data.length) {
            $('.dcw-pa-apps-list').html(Mustache.to_html(template, {
                apps: data
            }));
            $('.dcw-pa-apps-list > .item > .icon').bubble({
                setContent : buildBubbleContent,
                relativedEl : function(){
                    return this.find('img');
                },
                // verticalOffset : 100,
                horizontalOffset : 5
            });
        }
        else {
            displayNoApp();
        }
    });

var appsList = $('.dcw-pa-apps-list');
var actionsMenu = $('#app-actions');

var closeActionsMenu = function(e) {
    var target = $(e.target);
    if (!target.closest('.btn-open-menu').length) {
        actionsMenu.hide();
        $(document).off('click', closeActionsMenu);
    }
};

appsList.
    on('click', '.item .actions .btn-push:not(.disable)', function() {
        var btn = $(this);
        DeviceCenter.pushService({
            data: {
                url: btn.data('url'),
                name: btn.data('title'),
                packageName: btn.data('packagename'),
                versionCode: btn.data('versioncode')
            },
            slient: true,
            success: function() {
                GA.event('install_success:repush:' + btn.data('title'));
            }
        });
        btn.addClass('disable');
        setTimeout(function() {
            btn.removeClass('disable');
        }, 2000);
    }).
    on('click', '.item .actions .btn-open-menu', function() {
        var btn = $(this);
        actionsMenu.
            data('item', btn.closest('.item')).
            show().
            position({
                my: 'left top',
                at: 'left bottom',
                of: btn
            });
        $(document).on('click', closeActionsMenu);
    });

actionsMenu.on('click', 'ul > li', function() {
    var currentItem = actionsMenu.data('item');
    var action = $(this).data('action');
    switch (action) {
        case 'delete':
            if (confirm('确实要从列表中删除吗? 应用将不会在设备中卸载。')) {
                $.when(deleteAppFromList(currentItem.data('packagename'))).then(function() {
                    currentItem.remove();
                    actionsMenu.removeData('item');
                    if (!$('.dcw-pa-apps-list > .item').length) {
                        displayNoApp();
                    }
                    GA.event('manage:delete_app:' + currentItem.data('name'));
                });
            }
            break;
        case 'share':
            openShareLink(currentItem.data('name'), currentItem.find('a.icon').attr('href'));
            GA.event('manage:share_app:' + currentItem.data('name'));
            break;
        default:
    }
});

};

});