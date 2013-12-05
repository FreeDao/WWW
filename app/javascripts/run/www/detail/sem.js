define(['jquery','popup','cookie','exports'],function($, popup, cookie,exports){
    function getParam(name){  
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),  
            queryResult = location.search.substr(1).match(reg);  
        return queryResult ? unescape(queryResult[2]) : null;  
    }   
   
    var source = getParam('utm_source'),
        campaign = getParam('utm_campaign'),
        pn = $('body').data('pn'),
        pcSource = '',
        isPMT = 0,
        wdjURL = '',
        wdjURLPrefix = 'http://apps.wandoujia.com/redirect?pos=www/download/detail_pop&url=http://dl.wandoujia.com/files/third/WanDouJiaSetup_';
        campaignCookie = '',
        utmzCookie = '',
        sourceCookie = '',
        sourceArr = [
                       'bdpmt_essentialapp',
                       'bdpmt_mm',
                       'bdpmt_hotgame',
                       'bdpmt_exact',
                       'bdpmt_rovio',
                       'bdpmt_competingapp',
                       'bdpmt_websites',
                       'bdpmt_keywords',
                       'bdpmt_interests'
                      ];

      
        utmzCookie = $.cookie('__utmz');

        if($.cookie('__utmz')) {
            _.each($.cookie('__utmz').split('|'), function(item){
                if(item.indexOf('utmccn') >= 0){
                    campaignCookie = item.split('=')[1];
                }

                //check for utmcsr
                if(item.indexOf('utmcsr') >= 0){
                    sourceCookie = item.split('=')[1];    
                }
            });
        }

        campaign = campaign || campaignCookie;

        source = source || sourceCookie;


        switch (campaign){
            case 'app_pmt':
                isPMT = 1;

                /*
                 *@name zhangyaochun
                 *@date 6-24
                 *@info 确认在原来app_pmt的基础上来区分百度sem
                 */

                if($.inArray(source,sourceArr) > -1){
                    pcSource = source;
                }else{
                    pcSource = 'a20';
                }
 


                break;
            case  'adwords_pmt':  
                pcSource = 'a19';
                isPMT = 1;
                break;

            case  'sogou_pmt':  
                pcSource = 'a18';
                isPMT = 1;
                break;
            case  'union_pmt':  
                pcSource = 'a15';
                isPMT = 1;
                break;
            default:
                pcSource = 'detail';
        }

        wjdURL = wdjURLPrefix + pcSource + '.exe';
        
        if(isPMT){
            $.fn.popup();
            $.fn.setPopup({
                content : function(){
                    return $('#install-popup').val();
                },
                closeBtn : $('.popup-close'),
                onClose :　function(){

                },
                maskOpacity : .6,
                popopClass : 'green-popup',
                onOpen : function(){
                    // 如果是 adwords 流量，则显示额外的帮助链接
                    if(pcSource === 'a19'){
                        $('#adwords-cnt').show();
                    }
                    $('#popup-install').attr('href', wjdURL);
                }
            });

            $.fn.showPopup(); 

            $('.qrcode img').attr('src', 'http://img.wdjimg.com/mms/qrcode/' + pn + '/qrbinded');
            $('#install-btn').attr('href', 'http://apps.wandoujia.com/apps/' + pn + '/qrbinded?pos=www/sem/' + pcSource).
                attr('data-track','download-client-detail_btn');
        }
    exports.isPMT = isPMT; 
});