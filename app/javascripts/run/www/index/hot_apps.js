define(['jquery', 'underscore','hotApp'], function($, underscore,hotApp) {

    var flag = 0,
        page = $('body').data('page');

    if(page !== 'wwwindex') {
        tips = require('tips');
    }

    var tagName = [],
        hotTemplate = _.template(hotApp.Tpl),
        optFields = '&opt_fields=apps.packageName,apps.title,apps.icons.px48,apps.apks.paidType,apps.apks.permissionLevel,apps.apks.size,apps.apks.versionName,apps.apks.downloadUrl.*,apps.apks.securityStatus,apps.apks.adsType',
        getTagApps = function(tags) {
            if(flag === 1) {
                return false;
            }
            var result = {};
            $.ajax({
                url : 'http://apps.wandoujia.com/api/v1/apps?type=superiorFirst&max=3&privacy=1&ads=1&verified=0&zh=0&ads_count=0&tag=' + tags + optFields,
                dataType : 'jsonp',
                success : function(data) {
                    flag = 1;
                    if(data.length > 0) {
                        data.forEach(function(i, index) {
                                var idx = index;
                                tag = i.apps;
                            tag.forEach(function(j) {
                                result.app = j;
                                if (page === 'gameindex' || idx > 6 ) {
                                    result.area = 'hotgame';
                                } else {
                                    result.area = 'hotapp';
                                }
                                var $el = $(hotTemplate(result));
                                $('.hotcat .apps').eq(idx).append($el);
                            });
                        });

                        $('.hotgames, .hotapps').show();

                        if(typeof tips !== 'undefined') {
                            $('.mini.app').each(function(){
                                tips.createBubble(this,{
                                    pos: {
                                        target:'topleft', tooltip: 'bottomleft'
                                    }
                                });
                            });
                        }
                    }

                },
                error : function (request, status, error) {
                    flag = 0;
                }
            });
        };


    $('.hotcat').each(function() {
        var self = $(this);
        tagName.push(self.find('.hotcat-title').text());
    });

    if(tagName.length > 0) {
        $(window).scroll(function() {
            getTagApps(tagName.join(','));
            flag = 1;
        });
    }
});
