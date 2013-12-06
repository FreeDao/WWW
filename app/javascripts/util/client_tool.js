/**
 * 浏览器调用客户端代码工具包
 * 
 * @author jintian
 */

(function(win){
    var tools = {
            //在客户端中显示加载示意图
            showLoading : function() {
                if(parent.tool && parent.tool.showPortalLoading) {
                    parent.tool.showPortalLoading();
                }
            },
            //隐藏在客户端中显示的加载示意图
            hideLoading : function() {
               if(parent.tool && parent.tool.hidePortalLoading) {
                    parent.tool.hidePortalLoading();
                }
            },
            getGuid : function() {
                return guid = (parent && parent.localStorage) ? parent.localStorage.getItem('guid') : '';
            },
            getApplication : function(){
                return (parent && parent.getApplication) ? parent.getApplication() : null;
            },
            getClientInfo : function(){
                if (parent && parent.getClientInfo) {
                    return parent.getClientInfo();
                } else {
                    return {
                        'osVersion ' : '',
                        'phoneModal' : ''
                    };
                }
            },
            getClientVersion : function() {
                var count = 0,
                    key,
                    clientVersion,
                    ua = navigator.userAgent.split(' ');
                for(key in ua) {
                    if (ua.hasOwnProperty(key)) {
                        count++;
                    }
                }
                return parseFloat(ua[count-1]);
            },
            smsSender : function(smsJSON) {
                if (parent && parent.smsSender) {
                    return parent.smsSender(smsJSON);
                } else {
                    return false;
                }
            },
            appDownload : function (paras) {
                if (parent && parent.appDownload) {
                    return parent.appDownload(paras);
                } else {
                    return false;
                }
            },
            shareApp : function (packageName, title) {
                Narya.IO.requestAsync({
                    url : 'wdj://social/share_app.json',
                    data : {
                        'app_package_name' : packageName,
                        'app_title' : title
                    }
                });
            },
            login : function(){
                this.accountCallback({type : 'LOGIN', detail : ''});
            },
            logout : function(){
                this.accountCallback({type : 'LOGOUT', detail : ''});
            },
            accountCallback : function(jsonObj) {
                var type = jsonObj.type;
                var url = '';
                switch(type) {
                    case 'LOGIN' :
                        url = 'wdj://account/login.json';
                        break;
                    case 'LOGOUT' :
                        url = 'wdj://account/logout.json';
                        break;
                    case 'BIND' :
                        url = 'wdj://account/bind.json';
                        break;
                    case 'BINDSINA' :
                        url = 'wdj://account/bindsina.json';
                        break;
                    case 'REGISTER':
                        url = 'wdj://account/register.json';
                        break;
                }

                var data = new Object;
                if(jsonObj.detail) {
                    data['detail'] = jsonObj.detail;
                }
                else if(jsonObj.plat) {
                    data['plat'] = jsonObj.plat;
                }

                Narya.IO.requestAsync({
                    url : url,
                    data : data
                });
            },
            isClient : function(){
                return (window.OneRingRequest !== undefined) && (window.OneRingStreaming !== undefined);   
            }
        };

    

    win.clientTool = tools;
    
})(window);
