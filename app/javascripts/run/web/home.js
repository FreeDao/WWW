/**
 * @desc www.wandoujia.com首页
 * @author jintian
 */
$(function() {

    var status = 0;

    function getParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
            queryResult = location.search.substr(1).match(reg);
        return queryResult ? unescape(queryResult[2]) : null;
    }

    var campaign = getParam('utm_campaign'),
        source = $.cookie('__utmz') || '',
        isPmt = !! campaign || source.indexOf('_pmt') >= 0,
        src = getParam('src') || getParam('utm_source'),
        durl;

    if (!isPmt) {
        if (src !== null) {
            durl = 'http://dl.wandoujia.com/files/third/WanDouJiaSetup_' + (src ? src : 'ad') + '.exe';
        }
    } else {
        if (!campaign) {
            if (source.indexOf('utmccn=app_pmt') > 0) {

                var semDurl = 'a20';

                if (source.indexOf('utmcsr=bdpmt_essentialapp') > 0) {
                    semDurl = 'bdpmt_essentialapp';
                }
                if (source.indexOf('utmcsr=bdpmt_mm') > 0) {
                    semDurl = 'bdpmt_mm';
                }
                if (source.indexOf('utmcsr=bdpmt_hotgame') > 0) {
                    semDurl = 'bdpmt_hotgame';
                }
                if (source.indexOf('utmcsr=bdpmt_exact') > 0) {
                    semDurl = 'bdpmt_exact';
                }
                if (source.indexOf('utmcsr=bdpmt_rovio') > 0) {
                    semDurl = 'bdpmt_rovio';
                }
                if (source.indexOf('utmcsr=bdpmt_competingapp') > 0) {
                    semDurl = 'bdpmt_competingapp';
                }
                if (source.indexOf('utmcsr=bdpmt_websites') > 0) {
                    semDurl = 'bdpmt_websites';
                }
                if (source.indexOf('utmcsr=bdpmt_keywords') > 0) {
                    semDurl = 'bdpmt_keywords';
                }
                if (source.indexOf('utmcsr=bdpmt_interests') > 0) {
                    semDurl = 'bdpmt_interests';
                }

                durl = 'http://apps.wandoujia.com/redirect?pos=www/download/home&url=http://dl.wandoujia.com/files/third/WanDouJiaSetup_' + semDurl + '.exe';

            } else if (source.indexOf('utmccn=adwords_pmt') > 0) {
                durl = 'http://apps.wandoujia.com/redirect?pos=www/download/home&url=http://dl.wandoujia.com/files/third/WanDouJiaSetup_a19.exe';
            } else if (source.indexOf('utmccn=sogou_pmt') > 0) {
                durl = 'http://apps.wandoujia.com/redirect?pos=www/download/home&url=http://dl.wandoujia.com/files/third/WanDouJiaSetup_a18.exe';
            }


        } else {
            if (campaign === 'app_pmt') {
                durl = 'http://apps.wandoujia.com/redirect?pos=www/download/home&url=http://dl.wandoujia.com/files/third/WanDouJiaSetup_a20.exe';
            } else if (campaign === 'adwords_pmt') {
                durl = 'http://apps.wandoujia.com/redirect?pos=www/download/home&url=http://dl.wandoujia.com/files/third/WanDouJiaSetup_a19.exe';
            } else if (campaign === 'sogou_pmt') {
                durl = 'http://apps.wandoujia.com/redirect?pos=www/download/home&url=http://dl.wandoujia.com/files/third/WanDouJiaSetup_a18.exe';
            }

        }
    }

    if (durl !== undefined) {
        $('#download-windows').attr('href', durl);
    }


    $(window).scroll(function() {
        if ($(document).scrollTop() > 420 && status === 0) {
            status = 1;
            $.ajax({
                url: 'http://apps.wandoujia.com/api/v1/apps?type=superiorFirst&max=9&ads_count=0&pos=t/www&tag=全部软件,全部游戏&opt_fields=apps.packageName,apps.title,apps.ad,apps.icons.px48',
                dataType: 'jsonp',
                success: function(resp) {
                    _.each(resp, function(apps, index) {
                        var li = '';
                        var i = index;
                        _.each(apps['apps'], function(app, index) {
                            if (!app.ad) {
                                li += '<li class="app-item"><a href="http://www.wandoujia.com/apps/' + app.packageName + '"><img alt="' + app.title + '" src="' + app.icons.px48 + '"><span class="name">' + app.title + '</span></a></li>';
                            }

                            if (index === apps['apps'].length - 1 && index <= 8) {
                                $('.app-box').eq(i).find('ul').append(li);
                            }
                        });


                    });
                }
            });
        }
    });

    // 搜索提示
    $('.search-ipt').suggestion();

    var trackEvent = function(opt) {
        if (typeof _gaq != 'undefined' && _gaq) {
            var _act, _cat, _lbl, _val;
            if (opt) {
                _cat = opt.category || "";
                _act = opt.action || "";
                _lbl = opt.label || "";
                _val = opt.value || 0;
                return _gaq.push(['_trackEvent', _cat, _act, _lbl, _val]);
            }
        }
    };

    // GA tracking
    if (typeof _gaq !== 'undefined' && _gaq) {
        $('a[data-track]').live('click', function(e) {
            var trackCode = $(this).data('track'),
                codes = trackCode.split('/');

            if (codes.length > 2) {
                trackEvent({
                    category: codes[0],
                    action: codes[1],
                    label: codes[2]
                });
            }
        });
    }

    $('.search-box').submit(function(event) {
        event.preventDefault();
        if ($.trim($('.search-ipt').val()) === '') {
            return false;
        }
        this.submit();
    });

    $('.search-btn').click(function() {
        $('.search-box').submit();
    });

    $('input').placeholder();




    var tip = $('.international-tip'),
        html5StorageSupported = 'localStorage' in window && window.localStorage !== null;

    function updateHello(lang) {
        var hello;
        switch (lang) {
            case 'PT':
                hello = 'Oi!';
                break;
            case 'ES':
                hello = 'Hola!';
                break;
            case 'DE':
                hello = 'Hallo!';
                break;
            default:
                hello = '';
        }
        if (hello) {
            $('.hello').text(hello);
        }
    }

    function checkLang() {
        var al = navigator.language || '';

        if (!al) {
            return false;
        }


        var tmp = al.split(','),
            lang,
            state;

        for (var i = 0; i < tmp.length; i++) {

            if (Array.prototype.indexOf && tmp.indexOf(';') >= 0) {
                lang = tmp[i].split(';')[0];
            } else {
                lang = tmp[i];
            }

            if (lang.indexOf('zh') >= 0 || lang === 'c') {
                return false;
            }
        }

        return true;

    }

    function checkIp() {
        var state = false;
        $.ajax({
            async: false,
            url: 'http://ipinfo.io/json',
            dataType: 'jsonp',
            success: function(data) {
                var country = data.country;
                if (country !== 'ZH' && country !== 'XX') {
                    state = true;
                    updateHello(country);
                }
            }
        });
        return state;

    }

    if (html5StorageSupported && !localStorage.getItem('international-user')) {
        if (checkLang() && checkIp()) {
            tip.show();
            _gaq.push(['_trackEvent', 'tips', 'display', 'international']);
        }
    }


    $('.international-tip .close').click(function() {
        localStorage.setItem('international-user', 'yes');
        _gaq.push(['_trackEvent', 'tips', 'hide', 'international']);
        tip.hide();
    });


});