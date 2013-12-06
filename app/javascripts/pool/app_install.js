/**
 * @desc 应用一键安装和应用推送
 * @author jintian
 */
(function(win){

    $(function(){
        $('.dl-btn').each(function(index, btn){
            var btn = $(btn);
            btn.data('url', 'http://apps.wandoujia.com/apps/' + btn.data('packagename') + '/download');
        });
    });

    //应用的一键安装逻辑，里面有大量硬编码的id 和class
    win.AppInstall = (function(){
            // 弹出层中的处理逻辑
        var hideDownload = function(){
                $('#popup-download').addClass('disabled-btn-big')
                    .html('已经开始下载，请安装后继续');
                $('#next-step').removeClass('disabled-btn');
            },
            // 重置下载按钮的样式
            resetDownload = function(argument) {
                $('#popup-download').removeClass('disabled-btn-big').html('');
                $('#next-step').addClass('disabled-btn');
            },
            // 创建iframe来下载app
            downloadApp = function(name, url){
                var wdjUrl = 'wandoujia://type=apk&name=' + name + '&url=' + url +'==',
                    downFrame = $('<iframe src="'+ wdjUrl + '" width="0" height="0" frameborder="0"></iframe>').appendTo($('body')),
                    t = setTimeout(function(){
                        downFrame.remove();
                        clearTimeout(t);
                    },500);

                    if(typeof _gaq != 'undefined' && _gaq){
                        _gaq.push(['_trackEvent', "install_success", "oneclick", name.substring(0,10) ]);
                    }
            };
           
        return { 
            // 构造弹出层的内容
            buildContent : function(trigger){
                var hasInstall = parseInt($.cookie('wdj_installed')),
                    wdjUrl = 'wandoujia://type=apk&name=' + trigger.attr('title') + '&url=' + (trigger.data('url') || trigger.attr('href')) +'==',
                    content = '<div class="install-title">安装 ' + trigger.attr('title') +　'</div><div class="install-bd">',
                    appName = trigger.attr('title');

                if(typeof downloadUrl !== 'string') {
                    downloadUrl = "http://www.wandoujia.com/download.html?type=online";
                }

                // 如果用户选择了已经安装豌豆荚
                if(hasInstall){
                    content += '<div class="install-intro">' +
                                '<div class="installed-desc"></div>' +
                                '<strong>已开始安装</strong><p class="txt">如果豌豆荚没有开始下载应用，请<a href="' +
                                wdjUrl + '" track="install/installbox/retry" >重试</a>，或<a href="' + downloadUrl + '" target="_blank" track="download/client1x/installbox">重新安装豌豆荚</a></p></div>' + 
                                '<div class="install-action cf">' +
                                    '<a href="javascript:;" class="n-button" id="finish-btn">完成</a>' +
                               '</div>';
                    // 开始下载
                    setTimeout(function(){
                        downloadApp(trigger.attr('title'), trigger.data('url') || trigger.attr('href'));
                    },200);
                }else{
                    // 尚未安装时显示的界面
                    var icon = $(trigger.closest('li,.app-item').find('img')[0] || trigger),
                        appImg = icon.attr('iconsrc') || icon.attr('src');
                    content += '<div class="install-app cf"><img class="img" src="' + appImg + '" /><div class="procressing"></div></div>' + 
                                '<div class="install-intro"><strong>你的电脑安装豌豆荚了吗？</strong><p class="txt">帮你的手机连接电脑，安装应用，最简单最好用的 Android 手机助手</p>' + 
                                '<a class="download-btn" hidefocus="true" id="popup-download" href="' + downloadUrl +'" target="_blank" track="download/client1x/installbox"></a>' +
                               　'</div>' +
                               '<div class="install-action cf">' +
                                '<label for="has-install" class="check-stauts"><input id="has-install" type="checkbox"/>我已安装完成豌豆荚</label>' +
                                '<a href="javascript:;" class="n-button disabled-btn" title="请先安装豌豆荚" id="next-step" track="install/installbox/nextstep">下一步</a>' +
                               '</div>';
                }
                return content;
            },
            // popup显示之后执行的回调
            handlePopupOpen : function (trigger) {
                // 箭头的小动画
                var widths = [22, 44, 66, 89, 113, 145 ],
                    flag = 0;
                window.widthInerval = setInterval(function(){
                    if(flag >= widths.length ){
                        flag = 0;
                    }
                    $('.procressing').width(widths[flag]);
                    flag += 1;
                },200);
                
                // 点击安装按钮置灰
                $('.popup-main #popup-download').bind('click',hideDownload);
                // 完成安装
                $('.popup-main').delegate('#finish-btn', 'click',function(){
                    closePopup();
                });
                // 下一步
                $('.popup-main #next-step').bind('click',function(){
                    var self = $(this);
                    if(self.hasClass('disabled-btn')){
                        return false;
                    }else{
                        //直接跳转至完成界面
                        $('#pop-content').html(AppInstall.buildContent(trigger));
                    }
                });
                
                // 用户勾选已经安装状态
                $('#has-install').live('click',function(){
                    if(this.checked){
                        // 如果用户选择了已经安装豌豆荚，则添加一条cookie记录 wdj_installed=1, 取消勾选时设置为0
                        $.cookie('wdj_installed',1);
                        $('#next-step').removeClass('disabled-btn');
                    }else{
                        $.cookie('wdj_installed',0);
                        resetDownload();
                    }
                });
              
            },
            init : function(trigger){
                $.fn.setPopup({
                    content : function(){
                        return AppInstall.buildContent(trigger);
                    },
                    onOpen : function() {
                        AppInstall.handlePopupOpen(trigger);      
                    },
                    closeBtn : 1,
                    onClose :　function(){
                        if(widthInerval){
                            clearInterval(widthInerval);
                        }
                    }
                });
                $.fn.showPopup(trigger);
                if(typeof _gaq != 'undefined' && _gaq){
                    _gaq.push(['_trackEvent', "install", "oneclick", name.substring(0,10) ]);
                }
            }
        };
    })();
    // 应用推送
    win.AppPush = (function(){
        // 确定和完成按钮
        $('.finish-btn').live('click',function(){
            closePopup();    
        });
        // 重试按钮        
        $('#retry').live('click',function(){
            DeviceCenter.pushService({
                data : currentAppForPushing
            });
        });
        // 退出登录的链接
        var logoutLink = 'https://account.wandoujia.com/v1/user/?do=logout&callback=' + location.href;
        
        return {
            // 成功推送应用时显示的提示
            successContent : function(trigger){
                var content = '<div class="install-title">应用推送</div><div class="install-bd">',
                    appName = trigger.attr('title');
                content += '<div class="mobile-tip"></div>'+
                           '<div class="success-tip">' + 
                           '<strong class="title">正在推送「' + appName +　'」到您的 ' + currentMobile + ' ⋯</strong>' + 
                           '<span class="tip">请打开手机完成安装。</span>' +
                           '<div class="mobile-tip"></div>' +
                           '</div>'+
                           '<div class="install-action clearfix">' +
                           '<a href="javascript:;" class="n-button finish-btn" title="确定">确定</a>' +
                           '</div></div>';
                return content;
            },
            // 当手机上的登录状态更新了之后重新刷新当前界面
            flushStatus : function(){
                 if(currentMobile){
                     $('.operation-tip').after('<div class="flush-status">您的手机是'+ currentMobile +',我们将把应用推送到这台手机上。</div>');
                     $('.offline-tip').addClass('offline-flush');
                     $('.offline-first').addClass('offline-flush');
                     $('.disabled-btn').removeClass('disabled-btn').addClass('finish-btn');
                 } 
            },
            // status 为手机是否曾经登录的状态
            mobileOffline : function(trigger, status){
                var content = '',
                    appName = trigger.attr('title');
                
                content += '<div class="offline-tip'+ (status ? '' : ' offline-first') + '">'+
                            (status ? '<div class="title">手机未连接</div>' : '<div class="title">欢迎使用豌豆荚 <span class="highlight">应用推送</span></div>' ) +
                            (status ? ('<div class="tip">你的' + $('#device-info .name').text() + '没有连接，无法向它推送应用。</div>' ) : 
                                ('<div class="tip">你需要在手机上安装豌豆荚并登录。</div>')) +
                            '<div class="tip">请对照下面的步骤完成操作：</div>' +    
                           '</div>' +
                           '<ul class="operation-tip">' +
                            (status ? '<li>将手机连接上 Wi-Fi 网络</li>' : '<li>手机浏览器打开 <a href="http://wandoujia.com">wandoujia.com</a> 下载安装豌豆荚Android版</li>' ) +
                            '<li>手机上启动豌豆荚</li>' + 
                            '<li>按菜单(menu)键, 选择登录, 使用你的豌豆荚帐号 '+ globeConfig.email +' 登录</li>' + 
                           '</ul>' +
                            '<div class="confirm-action clearfix">' +
                            '<a href="javascript:;" class="n-button ' + (status ? 'finish-btn' : 'disabled-btn') + '">确定</a>' +
                           '</div>';
                return content;
            },
            init : function(item){
                // 如果手机上的客户端处于在线状态，直接push app
                currentAppForPushing =  {
                    url : item.data('url') || item.attr('href'),
                    name : item.attr('name')  || item.attr('title'),
                    packageName: item.data('packagename'),
                    versionCode: item.data('versioncode')
                };
                DeviceCenter.pushService({
                    data : currentAppForPushing,
                    success : function(){
                        if(typeof _gaq != 'undefined' && _gaq){
                            _gaq.push(['_trackEvent', "install_success", "push", currentAppForPushing.name.substring(0,10) ]);
                        }

                    },
                    error : function(){
                        if(typeof _gaq != 'undefined' && _gaq){
                            _gaq.push(['_trackEvent', "install_fail", "push", currentAppForPushing.name.substring(0,10) ]);
                        }
                    },
                    slient : true
                });
            }
        };
    })();
    
    // 当前用户的手机名
    window.currentMobile = '';
    // 手机是否曾经登录过
    window.mobileEverLogin = 0;
    
    window.currentAppForPushing = {};
    
    // 设备信息
    DeviceCenterWidget.require(['devicecenter'], function(DeviceCenter){
        
        window.DeviceCenter = DeviceCenter;
        
        // 设备从未登录变为登录时的回调
        DeviceCenter.subscribe('current:online',function(){
            // 判断在线回调 
            AppPush.flushStatus();
        });        
        
        DeviceCenter.subscribe('current:offline',function(data){
            //判断不在线回调  
        });
        
        // 用户注册了新的账号，并且更换设备（包括第一次登录）
        DeviceCenter.subscribe('current:change',function(data){
            // 设备信息更新执行
            if(typeof data == 'undefined' || !data){
                return;
            }
            currentMobile = data.model;
            if(currentMobile){
                mobileEverLogin = 1;
            }
            AppPush.flushStatus();
        });
        
        DeviceCenter.render('#device-info');
        
    });
     //升级提示
    //TODO：delete
    $('#know-it').click(function(){
        $('.alert-info').remove()
        $.cookie('donts',1);
    });
})(window);
