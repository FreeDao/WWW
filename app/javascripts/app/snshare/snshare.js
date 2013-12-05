;(function (factory) {
    'use strict';
    
    if (typeof define === 'function' && define.amd) {
        define([
            'jquery'
        ], factory);
    } else {
        // Browser globals:
        factory(window.jQuery);
    }
}(function ($) {
    'use strict';

    var snshare = function(settings){


        var apiUrl = {
                'weibo' : 'http://service.weibo.com/share/share.php?appkey=1483181040&relateUid=1727978503',
                'qzone' : 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey',
                'tqq' : 'http://share.v.t.qq.com/index.php?c=share&a=index&appkey=100273333',
                'renren' : 'http://widget.renren.com/dialog/share'
            },
            
            encode = encodeURIComponent,
            
            meta = {
                title : document.title,
                url : location.href,
                summary : '',
                type : ''
            },
        
            fetchMeta = function(el){
                if(!el){
                    return {};
                }
                var data = {
                    'title' : el.data('title'),
                    'summary' : el.data('summary'),
                    'type' : el.data('type')
                };
                if(el.data("type") == "qzone") {
                    data['pics'] =  el.data('pic');
                    data['url'] = el.data('url');
                }
                else if(el.data('type') == "renren") {
                    data['pic'] =  el.data('pic');
                    data['resourceUrl'] = el.data('url');
                }
                else {
                    data['pic'] = el.data('pic');
                    data['url'] = el.data('url');
                }


                return $.extend(meta , data);
            },
            
            share = function(){
                var target  = $(this),
                    meta = fetchMeta(target),
                    params = [],
                    api = '';
                    
                for(var key in meta){
                    if( key == 'type' && apiUrl[meta[key]]){
                        api = apiUrl[meta[key]];
                        continue;   
                    }
                    if( typeof meta[key] == 'Array'){
                        params.push(key + '=' + encode(meta[key].join(',')));
                        continue;
                    }
                    if (meta[key]){
                        params.push(key + '=' + encode(meta[key]));
                    }
                }
                var targetUrl =  api + (api.indexOf('?') >= 0 ? '&' : '?') + params.join('&');
                
                
                if(typeof externalCall !== 'undefined' && externalCall){
                    var shareLink = $('<a href="' + targetUrl + '" target="_default" style="display:none;">Share</a>').appendTo($('body'));
                    shareLink[0].click();
                }else{
                    var shareLink = $('<a href="' + targetUrl + '" target="_blank" style="display:none;">Share</a>').appendTo($('body'));
                    shareLink[0].click();
                }
            },
            
            targets = $('.share');

        targets.click(share);
    }
    snshare();
}));