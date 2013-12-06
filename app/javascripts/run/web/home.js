/**
 * @desc www.wandoujia.com首页
 * @author jintian
 */
$(function(){

    //wandou-son campaign

    var imgNumber = 0,
        imgTemplate = '<img src="http://img.wdjimg.com/image/xiaodi/child4.png" alt="豌小豆登场" class="wdson-4-child"><img src="http://img.wdjimg.com/image/xiaodi/child5.png" alt="豌小豆登场" class="wdson-5-child"><img src="http://img.wdjimg.com/image/xiaodi/child6.png" alt="豌小豆登场" class="wdson-6-child"><img src="http://img.wdjimg.com/image/xiaodi/child7.png" alt="豌小豆登场" class="wdson-7-child">',
        wdson = $('.wdson'),
        wdsonImgWp = $('.wdson-img-wp'),
        wdsonWp = $('.wdson-wp'),
        wdsonCloseBtn = $('.wdson-close-btn'),
        wdsonReallyClose = $('.wdson-really-close'),
        wdsonRightArrow = $('.wdson-right-arrow'),
        wdsonLeftArrow = $('.wdson-left-arrow'),
        wdsonRepeatArrow = $('.wdson-repeat-arrow'),
        wdsonArrow = $('.wdson-arrow'),
        wdsonLastChild = $('.wdson-last-child');

    $(document).ready(function() {
        $('.wdson').animate({
            opacity: 1,
            left: '-=10'
        }, 700);
    });

    $('.wdson, .button-green').on('click', function () {
        if ($('.wdson-img-wp img').index() < 6) {
            wdsonImgWp.append(imgTemplate);
        }
        $('.wdson-img-wp img').hide();
        showImg();
        wdsonWp.fadeIn(400);
    });

    wdsonCloseBtn.on('click', function () {
        wdsonWp.fadeOut(400);
        imgNumber = 0;
    });

    wdsonCloseBtn.hover(function () {
        wdsonReallyClose.show();
    }, function () {
        wdsonReallyClose.hide();
    });

    wdsonRightArrow.on('click', function () {
        imgNumber += 1;
        showImg();
    });

    wdsonLeftArrow.on('click', function () {
        imgNumber -= 1;
        showImg();
    });

    wdsonRepeatArrow.on('click', function () {
        imgNumber = 0;
        showImg();
    });

    $(document).on('keydown', function(e) {
        if (e.which == 37 && imgNumber > 0) {
            imgNumber -= 1;
            showImg();
        } else if (e.which == 39 && imgNumber < 6) {
            imgNumber += 1;
            showImg();
        } else if (e.which == 27) {
            wdsonWp.fadeOut(400);
            imgNumber = 0;
        }
    });
    
    function showImg () {
        if (imgNumber == 0) {
            wdsonLeftArrow.hide();
            wdsonLastChild.hide();
            wdsonRepeatArrow.hide();
            wdsonRightArrow.show();
            wdsonArrow.removeClass('wdson-arrow-double');
        } else if (imgNumber == 6){
            wdsonLeftArrow.hide();
            wdsonRightArrow.hide();
            wdsonRepeatArrow.show();
            wdsonLastChild.show();
            wdsonArrow.removeClass('wdson-arrow-double');
        } else if (imgNumber > 0 && imgNumber < 6) {
            wdsonArrow.addClass('wdson-arrow-double');
            wdsonLeftArrow.show();
            wdsonRightArrow.show();
            wdsonRepeatArrow.hide();
            wdsonLastChild.hide();
        }
        $('.wdson-img-wp img').fadeOut(200);
        $('.wdson-img-wp img').eq(imgNumber).fadeIn(200);
    }
    
    // 搜索提示
    $('.search-ipt').suggestion();
    
    var trackEvent = function(opt) {
        if(typeof _gaq != 'undefined' && _gaq){
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
    if(typeof _gaq != 'undefined' && _gaq){
        $('a[data-track]').live('click', function(e) {
            var trackCode = $(this).data('track'),
                codes = trackCode.split('/');
            
            if(codes.length > 2){
                trackEvent({
                    category : codes[0],
                    action : codes[1],
                    label : codes[2]
                });
            }
        });
    }

    $('.search-box').submit(function(event){
       event.preventDefault();
       if($.trim($('.search-ipt').val()) === ''){
           return false;
       } 
       this.submit();
    });

    $('.search-btn').click(function(){
        $('.search-box').submit();
    });

    $('input').placeholder();




    var tip = $('.international-tip'),
        html5StorageSupported = 'localStorage' in window && window['localStorage'] !== null;

    function updateHello(lang) {
        var hello;
        switch(lang) {
            case 'PT' :
                hello = 'Oi!';
                break;
            case 'ES' :
                hello = 'Hola!';
                break;
            case 'DE' :
                hello = 'Hallo!';
                break; 
            default :
                hello = '';
        }
        if(hello) {
            $('.hello').text(hello);
        }
    }

    function checkLang() {
        var al = tip.data('lang');

        if(!al) {
            return false;
        }

        var tmp = al.split(','),
            lang,
            state;

        for(var i=0; i<tmp.length; i++) {

            if(Array.prototype.indexOf && tmp.indexOf(';') >= 0) {
                lang = tmp[i].split(';')[0];
            } else {
                lang = tmp[i];
            }

            if(lang.indexOf('zh') >= 0 || lang === 'c') {
                return false;
                break;
            } 
        }

        return true;

    }

    function checkIp() {
        var ip = tip.data('ip'),
            state = false;
        if(!ip || ip==='::1') {
            return false;
        }


        $.ajax({
            async: false,
            url: 'http://api.hostip.info/country.php?ip=' + ip,
            success: function(data) {
                if(data !== 'ZH' && data !== 'XX') {
                    state = true;
                    updateHello(data);
                } else {
                    state = false;
                }
            }
        });

        return state;

    }

    if (html5StorageSupported && !localStorage.getItem('international-user')) {

        if(checkLang() && checkIp()) {
            tip.show();
            _gaq.push(['_trackEvent', 'tips', 'display', 'international']);
        }

        $('.close').click(function() {
            localStorage.setItem('international-user', 'yes');
            _gaq.push(['_trackEvent', 'tips', 'hide', 'international']);
            tip.hide();
        });

    }


});
