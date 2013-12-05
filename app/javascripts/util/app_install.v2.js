;(function (factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define([
            'exports', 'jquery', 'popup', 'underscore', 'install'
        ], factory);
    } else {
        // Browser globals:
        factory(window.jQuery);
    }
}(function (exports, $, popup, underscore, install) {
    'use strict';

    var targets = '.btn-download',

        brands = {
            '-1' : {
                    'name' : '通用数据包',
                    'description' : '此数据包兼容市面上大多数手机，如下载后仍无法运行游戏，可能是你的手机当前还不支持此游戏。',
                 },
            '1' : {
                    'name' : 'nVidia 版数据包',
                    'description' : '支持采用 Tegra GPU 的手机。如 MOTO A4G、LG 2X 等。',
                 },
            '2' : {
                    'name' : '三星版数据包',
                    'description' : '支持采用三星 Exynos 4210/4212 CPU 的手机。如三星 i9100、i9220、魅族 MX 手机。',
                 },
            '4' : {
                    'name' : '德州仪器版数据包',
                    'description' : '支持采用 PowerVR GPU 的手机。如 MOTO Defy、三星 i9000、Galaxy Nexus、魅族 M9 等。',
                 },
            '8' : {
                    'name' : '高通版数据包',
                    'description' : '支持采用高通 Adreno GPU 的手机。如小米、三星S5830、HTC Incredible S 等。',
                 },
            '16' : {
                    'name' : '猎户座版数据包',
                    'description' : '支持采用猎户座 CPU 的手机。如 i9300、魅族 MX2 等。',
                 }
        },
        appBubbleTpl = _.template(install.installTpl),
        hasGameContent = function(installBtn){
            var gameContent = installBtn.data('gamecontent');
            gameContent = gameContent && gameContent != 0;
            return gameContent;
        },

        hasSecIssue = function (installBtn){
            return installBtn.data('block') == '1';
        },

        hasPmsIssue = function(installBtn){
            return installBtn.data('permission') != undefined;
        },

        hasPaymentIssue = function(installBtn){
            return installBtn.data('pay') != undefined;
        },

        hasICIssue = function (installBtn){
            return installBtn.data('compatible') != undefined;
        },

        log = function(str){
            if('undefined' !== typeof console && console.log){
                console.log(str);
            }
        },

        getInstallData = function(installBtn){
            var redirectPrefix = 'http://apps.wandoujia.com/redirect',
                item = installBtn,
                appLink = item.attr('href');

            if(!appLink){
                return log('App download url is null.');
            }

            var app = item.closest('.app'),
                iconEl = app.find('.icon'),
                appName = app.find('.name').text() || $('#app-title').text();

            var appName = $.trim(appName).replace('<em>','').replace('</em>',''),
                icon = iconEl.length ? iconEl.attr('src') :  $('.icon img').attr('src'),
                queryWord = item.data('q'),
                from = item.data('from'),
                iscampaign = item.data('iscampaign'),
                providerId = item.data('pid'),
                appId = item.data('appid'),
                pn = item.data('pn'),
                gameContent = item.data('gamecontent'),
                flag = $.cookie('wd_flag'), 
                uid = $.cookie('wd_uid');
            var param = '',
                guid = clientTool ? clientTool.getGuid() : '';

            if (iscampaign) {
                param = 'guid=' + guid;
            }
            else if(providerId == '9' || providerId == '18') {
                param = 'guid=' + guid;
            }

            appLink += (!param) ? '' : ((appLink.indexOf('?') >= 0 ? '&' : '?') + param);

            var returnObj = {
                downloadUrl: appLink 
                    + ( uid ? ( '&uid=' + uid ) : '' )
                    + ( flag ? ( '&flag=' + flag ) : '' )
                    + ( from ? ( '&from=' + from ) : '' )
                    + ( queryWord ? ( '&q=' + queryWord ) : '' )
                    + (appId ? ('&appid=' + appId) : '')
                    + (pn ? ('&pn=' + pn) : ''),
                name: appName,
                icon :  icon
            };

            //为 appInterface 页面增加 source 信息
            if($(item.closest('.app')).hasClass('ai-app')) {
                returnObj['source'] = 'app_interface';
            }

            return returnObj;

        },

        hasGameContentSelected = function(){
            return $('#dlc-list input').is(':checked') && $('#dlc-list input:checked').val() != 'none';
        },
        

        install = function(downloadObj, flag){
            switch(flag){
                // 游戏数据包下载
                case 1:
                    var checkedItem = $('#dlc-list input:checked'),
                        originalPack = $('.original-pack').text(),
                        defaultValue = checkedItem.val(),
                        icon = downloadObj.icon,
                        path = checkedItem.attr('path'),
                        downloadUrl = checkedItem.attr('url'),
                        gamePn = $('.install-bubble .app').data('pn'),
                        url = '';


                    if(defaultValue !== 'nope' && downloadUrl) {
                        var name = downloadObj.name + ' ' + defaultValue;
                        url = downloadUrl + '#name=' + encodeURIComponent(name) + '&icon=' + icon + '&content-type=application/zip&filepath=' + path + '&action=install';
                        $('<a href="' + url + '" download="' + name +'"></a>')[0].click();
                        _gaq.push(['_trackEvent', 'popupBtn', 'install', 'zip|' + gamePn]);
                    } else {
                        var name = downloadObj.name,
                            area = $('#popup-install-game').data('area');
                        url = downloadUrl;
                        $('<a href="' + url + '" download="' + name + '"></a>')[0].click();
                        _gaq.push(['_trackEvent', 'popupBtn', 'install', area]);
                    }

                    if(originalPack != defaultValue && typeof _gaq != 'undefined' && _gaq) {
                        _gaq.push(['_trackEvent', 'gamedata', 'change', originalPack + 'to' + defaultValue + '|' +  gamePn]);
                    }

                    break;

                // 正常单个 app 下载
                default:
                    $('<a href="' + downloadObj.downloadUrl + '" download="' + downloadObj.name + '"></a>')[0].click();
                    log(JSON.stringify(downloadObj));
                    break;
            }

            if($('#hide-popup').is(':checked')) {
                localStorage.setItem('hidePopup', 'please');
                _gaq.push(['_trackEvent', 'popup', 'hide', 'apps']);
            } else {
                localStorage.removeItem('hidePopup');
            }

            if($('#pop-content').length){
                closePopup();
            }

        },

        renderPopup = function(app){
            return appBubbleTpl(app);
        },

        getAppInfo = function(pn){
            var url = '/api/v1/apps/' + pn,
                opt_fields = [ 'title', 'tagline','packageName', 'installedCountStr', 'description',
                    'commentsCount', 'likesRate', 'apks.securityStatus', 'apks.verified','apks.securityDetail.*','apks.permissionLevel','apks.dangerousPermissions','apks.size', 'apks.adsType', 'likesCount','dislikesCount','icons.px78','posComments'],
                app;
                
            $.ajax({
                url : url + '?opt_fields=' + opt_fields.join(','),
                success : function(data) {
                    app = data;
                },
                async : false
            });
 
            return app;
        },

        getPopupHTML = function(installBtn){
            var appEl = $(installBtn).closest('.app'),
                app,
                page = $('body').data('page') || '',
                pn = appEl.data('pn');
            app = window.apps && window.apps[pn] ? window.apps[pn] : getAppInfo(pn);
            app.area = installBtn.data('track') !== undefined ? installBtn.data('track').split('-')[2] : 'installpopup';

            if(hasSecIssue(installBtn)){
                app.hasSecIssue = true;
            }

            if(hasPmsIssue(installBtn)){
                app.hasPmsIssue = true;
            }

            if(hasPaymentIssue(installBtn)){
                app.hasPaymentIssue = true;
            }

            if(hasGameContent(installBtn)){
                app.hasGameContent = true;
                app.gamedatas = getGameData(installBtn);
            }
            if(hasICIssue(installBtn)){
                app.hasICIssue = true;
                app.icIssues = getICIssues(installBtn);
            }
            //add by zhangyaochun fix install.txt can not read ${page}
            app.page = page;
            return renderPopup(app);
        },
        
        getGameData = function(installBtn){
            var gameData = [],
                isType = function isType(num){
                    return num == -1 || (num & (num - 1)) == 0;
                };

            for(var i = 0; i < 5; i++ ) {
                var type = installBtn.data('gtype' + i),
                    path = installBtn.data('gpath' + i),
                    url = installBtn.data('gurl' + i),
                    size = installBtn.data('gsize' + i),
                    apkUrl = installBtn.attr('href'),
                    gpu = installBtn.data('gpu');

                if(typeof url != 'undefined') {
                    gameData.push({
                        type: type,
                        path: path,
                        url: url,
                        size: size,
                        apkUrl: apkUrl,
                        bname: '数据包' + (i+1)
                    });

                    if(type & gpu && typeof gameData['selected'] === 'undefined') {
                        gameData['selected'] = gpu;
                    }

                    if(isType(type)) {
                        gameData[i]['bdesc'] = brands[type + '']['description']
                    } else {
                        var square;
                        gameData[i]['bdesc'] = '';

                        for(var j=4; j>=0; j--) {
                            square = Math.pow(2,j);
                            if(type > square && type&square) {
                                gameData[i]['bdesc'] += brands[square + '']['description'] + '<br />';
                            }
                        }
                    }

                } else {
                    break;
                }
            }
            return gameData;
        },

        getICIssues = function(installBtn){
            var issues = installBtn.data('compatible').split('|');
            issues.splice(0, 1);
            return issues;
        },
        
        changeToGameContent = function(){
            $('.ads-result,.security-result,#popup-install,#view-others').hide();
            $('#popup-install-game,.game-content').show();
        },

        showPopup = function(installBtn){
            $.fn.setPopup({
                content : function(){
                    return getPopupHTML(installBtn);
                },
                onClose : function(){
                    var pn = installBtn.closest('.app').data('pn');
                },
                onOpen : function(){
                    var btn = this;
                    $('.install-bubble').delegate('#popup-install', 'click', function(){
                        if(hasGameContent(installBtn) && $('.game-content:hidden').length ){
                            return changeToGameContent(installBtn);
                        } else {
                            var url = $(btn).attr('href'),
                                name = $(btn).attr('download');
                            $('<a href="' + url + '" download="' + name + '"></a>')[0].click();
                            if($('#hide-popup').is(':checked')) {
                                localStorage.setItem('hidePopup', 'please');
                            } else {
                                localStorage.removeItem('hidePopup');
                            }

                            if($('#pop-content').length){
                                closePopup();
                            }

                        }

                        if(hasGameContent(installBtn) && $('.game-content:hidden').length ){
                            install(getInstallData(btn));
                        }

                        //add by zhangyaochun 调用addInstalledPn便于更新状态
                        var pn = btn.closest('.app').data('pn');
                        addInstalledPn(pn, true);

                    }).delegate('#popup-install-game', 'click', function(){
                        install(getInstallData(btn), 1);

                        //add by zhangyaochun 调用addInstalledPn便于更新状态
                        var pn = btn.closest('.app').data('pn');
                        addInstalledPn(pn, true);

                    });

                },
                opacity: 0.2
            });
            $.fn.showPopup(installBtn);
        },

        dispatchInstall = function(installBtn){
            if((hasSecIssue(installBtn) || hasPmsIssue(installBtn) || hasPaymentIssue(installBtn) || hasGameContent(installBtn) || hasICIssue(installBtn)) && (typeof blockInstalPopup == 'undefined')){
                showPopup(installBtn);
            }else{
                return;
            }
        },

        installedPns = {},

        installedPnsCnt = 0,

        trackAppsCount = function(count) {
            if (count <= 20) {
                _gaq.push(['_setCustomVar', 1, 'installedApps', count, 1]);
            } else if(count > 100) {
                _gaq.push(['_setCustomVar', 1, 'installedApps', '100+', 1]);
            } else {
                _gaq.push(['_setCustomVar', 1, 'installedApps', Math.ceil(count/20)*20, 1]);
            }
        },

        fetchInstalledPns = function(callback) {
            var udid = $.cookie('wdj_DID') || $.cookie('udid');
            if (!udid) {
                return;
            }

            $.cookie('udid', udid);
            var url = '/api/v1/apps/device',
                opt_fields = [ 'sysApps.info.*,userApps.info.*' ];

            if (!isValidInstalledPns()) {
                $.ajax({
                    url : url + '?status=1&opt_fields=' + opt_fields.join(','),
                    success : function(data) {
                        if (data) {
                            if (data.userApps && data.userApps.length > 0) {
                                for (var i = 0, j = data.userApps.length; i < j; i++) {
                                    if (data.userApps[i].info && data.userApps[i].info['is']) {
                                        addInstalledPn(data.userApps[i].info['pn'], false);
                                    }
                                }
                                trackAppsCount(data.userApps.length);
                            }
                            if (data.sysApps && data.sysApps.length > 0) {
                                for (var i = 0, j = data.sysApps.length; i < j; i++) {
                                    if (data.sysApps[i].info && data.sysApps[i].info['is']) {
                                        addInstalledPn(data.sysApps[i].info['pn'], false);
                                    }
                                }
                            }
                            persistInstalledPns(true);
                            callback();
                        }
                    },
                    async : true
                });
            } else {
                loadInstalledPns();
                callback();
            }
        },

        installedPnsExpires = 1000 * 60 * 5, 

        isValidInstalledPns = function() {
            if (typeof sessionStorage == 'undefined' || !sessionStorage || sessionStorage.installedPns == undefined || sessionStorage.installedPnsTs == undefined || sessionStorage.installedPnsCnt == undefined || !sessionStorage.installedPnsCnt > 0) {
                return false;
            }
            var ts = new Date().getTime();
            if (ts - sessionStorage.installedPnsTs > installedPnsExpires) {
                return false;
            }
            return true;
        },

        addInstalledPn = function(pn, persist) {
            if (pn) {
                installedPns[pn] = true;
                installedPnsCnt++;
                if (persist) {
                    persistInstalledPns(false);
                }
            }
        },

        loadInstalledPns = function() {
            if (sessionStorage) {
                installedPnsCnt = sessionStorage.installedPnsCnt || 0;
                installedPns = sessionStorage.installedPns ? ($.parseJSON(sessionStorage.installedPns) || {}) : {};
            }
        },

        persistInstalledPns = function(updateTs) {
            if (sessionStorage) {
                sessionStorage.installedPnsCnt = installedPnsCnt;
                sessionStorage.installedPns = JSON.stringify(installedPns);
                if (updateTs) {
                    sessionStorage.installedPnsTs = new Date().getTime();
                }
            }
        },

        refreshInstalledPns = function(context) {
            if (installedPnsCnt > 0) {
                var dlBtns = $(targets, context), pn, dlBtn;
                for (var i = 0, j = dlBtns.length; i < j; i++) {
                    dlBtn = $(dlBtns[i]);
                    pn = dlBtn.closest('.app').data('pn');

                    if (pn && installedPns[pn]) {
                        dlBtn.addClass('installed').text('已安装');
                        if(hasGameContent(dlBtn)){
                            dlBtn.append('<span class="plus"></span>');
                        }
                    }
                }
            }
        };

    exports.refreshInstalledPns = refreshInstalledPns;

    $.fn.popup();

    $(document).delegate(targets, 'hover', function(event){
        var $target = $(event.target);

        if ($target.hasClass('installed')) {
            if (event.type === 'mouseenter') {
                $target.text('重新安装');
            }
            else {
                $target.text('已安装');
            }

            if(hasGameContent($target)){
                $target.append('<span class="plus"></span>');
            }
        }

    });

    $(document).delegate(targets, 'click', function(event){
        if(typeof $.fn.hideBubble !== 'undefined') {
            $.fn.hideBubble($(event.target));
        }
        var self = $(this);
        if(self.hasClass('installing')){
            return;
        }

        if((!hasSecIssue(self) && !hasPmsIssue(self) && !hasPaymentIssue(self) && !hasGameContent(self) && !hasICIssue(self)) || (typeof blockInstalPopup != 'undefined')){
            var loadingText = '安装中',
                currentText = self.html();

            self.addClass('installing');
            self.html(loadingText);

            var pn = self.closest('.app').data('pn');
            addInstalledPn(pn, true);

            var t = setTimeout(function(){
                self.removeClass('installing');
                self.html(currentText);
            },3000);


        } else {
            if(!localStorage.getItem('hidePopup') || hasGameContent(self)) {
                event.preventDefault();
                dispatchInstall(self);            
            }
        }

    });


    $(document).ready(function(){

        fetchInstalledPns(function(){
            refreshInstalledPns(document.body);
        });
        
        var udid = $.cookie('wdj_DID') || $.cookie('udid');

        var getGpuType = function() {
            if(udid) {
                $.ajax({
                    url : 'http://index.wandoujia.com/muce-index/udid/' + udid+ '/device',
                    success : function(res) {
                        if(typeof res !== 'undefined' && res !== null && res.gpuType !== $.cookie('gpuType')) {
                            $.cookie('gpuType', res.gpuType,  { expires: 300, path: '/'});
                        }
                    }
                });
            }
        };

        var getDeviceInfo = function() {
            var deviceName,
                gpuType,
                features,
                sdkVersion;
            if(typeof Narya !== 'undefined') {
                var getInfo = function() {
                   if(Narya.Device.get('deviceName')) {
                        deviceName =  Narya.Device.get('deviceName');
                        if(!localStorage.getItem('deviceName') || localStorage.getItem('deviceName') !== deviceName ) {
                            localStorage.setItem('deviceName', deviceName);
                        }
                    }
                   if(Narya.Device.get('features')) {
                        features =  parseInt(Narya.Device.get('features'));
                        if(!$.cookie('features') || $.cookie('features') !== features ) {
                            $.cookie('features', features,  { expires: 300, path: '/'});
                        }
                    }
                    if(Narya.Device.get('SDKVersion')) {
                        sdkVersion = Narya.Device.get('SDKVersion');
                        if(!$.cookie('sdk') || $.cookie('sdk') !== sdkVersion) {
                            $.cookie('sdk', sdkVersion,  { expires: 300, path: '/'});
                        }
                    }
                };

                getInfo();

                Narya.Device.on('change', function () {
                    getInfo();
                    getGpuType();
                });
            }
        };

        if(!$.cookie('gpuType')) {
            getGpuType();
        }


        window.setTimeout(getDeviceInfo, 5000);


    });

}));