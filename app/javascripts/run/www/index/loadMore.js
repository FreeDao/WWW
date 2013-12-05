define(['jquery','underscore','dateFormat','ga','appCard'], function($,underscore,dateFormat,ga,appCard) {
    var FEED_INCRECEMENT = 18;

    var _cardTemplate = _.template(appCard.appCardTpl);
    var _pageName = $('body').data('page');
    var cursor    = $('#rec-apps').data('cursor') || 0;
    var adsCursor = $('#rec-apps').data('adscursor') || 0;
    var getFeedCounts  = function() {
        return $('.rec-apps .app-item').size();
    };

    var feedApi  = function(start, adsStart){
        var api = 'http://apps.wandoujia.com/api/v1/feeds/?start='+start+'&max='+FEED_INCRECEMENT+'&ads_start='+adsStart+'&opt_fields=count,cursor,adsCursor,data.app.tags.*,data.reason.*,data.app.title,data.app.installedCountStr,data.app.likesRate,data.app.apks.paidType,data.app.apks.permissionLevel,data.app.apks.size,data.app.apks.versionName,data.app.editorComment.*,data.app.likesCount,data.app.dislikesCount,data.app.apks.superior,data.app.apks.langType,data.app.extensionPacks.*,data.app.icons.*,data.app.packageName,data.app.apks.downloadUrl.*,data.app.apks.securityStatus,data.app.apks.adsType,data.app.packageName,data.app.detailParam,data.app.imprUrl,data.app.ad&pos=w/index/feed';
        if($('.loadmore').hasClass('gameindex')) {
            return api + '&area=game';
        } else {
            return api;
        }
    }

    var load = function(){
        var button = $('.loadmore a'),
            origTxt = button.text();

        button.text('加载中...').addClass('loading');

        $.ajax({
            url: feedApi(cursor, adsCursor),
            type: 'GET',
            cache: false,
            async: true,
            crossDomain: true,
            dataType: 'jsonp',
            timeout: 3000,
            error: function(){
                button.text('加载失败，请重试').removeClass('loading');
                ga.gaEvent([_pageName,'load','error'])
            },
            success: function(response){
                ga.gaEvent([_pageName,'load','success']);
                cursor = (response.cursor||0);
                adsCursor = (response.adsCursor||0);
                if( (Number(response.count)||0) > 0){
                    if (response.data.length > 0){
                        response.data.forEach(function(i){
                            i.area = 'feed';
                            if(typeof i.reason !== 'undefined' && i.reason.date) {
                                i.reason.date = dateFormat.date2current(i.reason.date);
                            }
                            $('.rec-apps').append(_cardTemplate(i));
                        });
                        if ($('.rec-apps li').length < 108 && response.data.length>=FEED_INCRECEMENT) {
                            button.text(origTxt).removeClass('loading');
                            //window.history.pushState('', '', '?feeds='+getFeedCounts());
                            return;
                        };
                    }
                }
                //window.history.pushState('', '', '?feeds='+getFeedCounts());
                button.text('没有更多了');
            }
        });
    }

    var loadMore = function(){

        //ie6-8 can't use forEach method for array
        if ( !Array.prototype.forEach ) {
            Array.prototype.forEach = function(fn, scope) {
                for(var i = 0, len = this.length; i < len; ++i) {
                    fn.call(scope, this[i], i, this);
                }
            }
        }

        $('.loadmore').on('click', 'a:not(.loading)', function() {

            ga.gaEvent([_pageName,'load','load']);

            load();

        });
    }();

});
