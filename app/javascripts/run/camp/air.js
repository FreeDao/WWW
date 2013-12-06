/**
* @desc 空气洗白白Campaign
* @author zhailin
*/

var reloadCounter = function() {
        $.ajax({
            type: "POST",
            url: "http://www.wandoujia.com/xibaibai/air/count/order",
            cache: false,
            success: function(msg) {
                scrollNumber(msg);
            }
        });
    },
    getCounter = function() {
        $.ajax({
            type: "GET",
            url: "http://www.wandoujia.com/xibaibai/air/count/order",
            cache: false,
            success: function(msg) {
                scrollNumber(msg);
            }
        });
    },
    scrollNumber = function(number) {
        var field = $('.counter');
        var out = field.find('span:first');
        number = addZero(number);
        field.find('span:last').text(number);
        out.animate({
            marginTop: '-103px'
        }, 400, function() {
            out.css('marginTop', 0).appendTo(field);
        });
    },
    addZero = function(num) {
        if (num >= 0 && num < 10) {
            return '0000000' + num;
        } else if (num >= 10 && num < 100) {
            return '000000' + num;
        } else if (num >= 100 && num < 1000) {
            return '00000' + num;
        } else if (num >= 1000 && num < 10000) {
            return '0000' + num;
        } else if (num >= 10000 && num < 99999) {
            return '000' + num;
        } else if (num >= 100000 && num < 999999) {
            return '00' + num;
        } else if (num >= 1000000 && num <= 9999999) {
            return '0' + num;
        } else if (num > 9999999) {
            return num;
        } else {
            return "13929570";
        }
    },
    videoBlock = $('.video-block'),
    html5Player = function () {
        $('body').on('click','.ld', function(){
            var videoPlayer = document.getElementById('videoPlayer');
            videoPlayer.src = 'http://v.wdjcdn.com/Final-720p-500.mp4';
            videoPlayer.load();
        }).on('click','.nd', function(){
            var videoPlayer = document.getElementById('videoPlayer');
            videoPlayer.src = 'http://v.wdjcdn.com/Final-720p-800.mp4';
            videoPlayer.load();
        }).on('click','.hd', function(){
            var videoPlayer = document.getElementById('videoPlayer');
            videoPlayer.src = 'http://v.wdjcdn.com/Final-720p-2000.mp4';
            videoPlayer.load();
        }).on('click','.yd', function(){
            $('.video-wrapper').remove();
            var video = $('#youku-video-template').html();
            $('body').append(video);
        });

        $('.video-img').on('click',function(){
            var video = $('#video-template').html();
            videoBlock.fadeIn(400,function () {
                $('body').append(video);
                var videoPlayer = document.getElementById('videoPlayer');
                document.onkeydown = function() {
                    var oEvent = window.event;
                    if (oEvent.keyCode == 32) {
                        if (videoPlayer.paused) {
                            videoPlayer.play();
                        } else {
                            videoPlayer.pause();
                        }
                        return false;
                    }
                };
            });
            _gaq.push(['_trackEvent', 'Xibaibai', 'Click', 'Video']);
        });
    },
    youkuPlayer = function () {
        $('.video-img').on('click',function(){
            var video = $('#youku-video-template').html();
            videoBlock.fadeIn(400,function () {
                $('body').append(video);
            });
            _gaq.push(['_trackEvent', 'Xibaibai', 'Click', 'Video']);
        });
    };

$(document).ready(function() {
    getCounter();
    setInterval('getCounter()',5000);
});

if(Modernizr.video){
    if (navigator.userAgent.indexOf('Firefox') >= 0 || navigator.userAgent.indexOf('Opera') >= 0){
        youkuPlayer();
    }else{
        html5Player();
    }
}else{
    youkuPlayer();
}

$('body').on('click','.video-block, .share-block-close, .video-close', function(){
    $('.video-wrapper').remove();
    $('.share-block').remove();
    videoBlock.fadeOut(400);
});

$('.btn-order').click(function () {
    if($.browser.msie && ($.browser.version == '6.0') && !$.support.style){
        $('body, html').animate({
            scrollTop: 0
        },1000);
    }
    var share = $('#share-template').html();
    videoBlock.fadeIn(400,function () {
        $('body').append(share);
    });
    reloadCounter();
    _gaq.push(['_trackEvent', 'Xibaibai', 'Click', 'Order']);
});