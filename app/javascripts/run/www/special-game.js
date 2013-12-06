/**
 * www.wandoujia.com 应用详情页面 js app 
 */

require.config({
    baseUrl: '/style/js/run/www',
    paths: {
        'jquery' : '../../lib/jquery-1.7.1',
        'underscore' : '../../lib/underscore',
        'cookie' : '../../util/jquery.cookie',
        'suggestion' : '../../app/suggestion/suggestion',
        'ga' : '../../util/ga_tracking',
        'device' : '../../util/device_tool',
        'initDevice' : 'init-device',
        'placeholder' : '../../app/placeholder/placeholder',
        'isotope' : '../../app/isotope/isotope'
    },
    shim: {
        'cookie': ['jquery'],
        'suggestion' : ['jquery'],
        'ga' : ['jquery'],
        'device' : ['jquery'],
        'isotope' : ['jquery']
    }
});
require(['jquery','initDevice','underscore','cookie', 'ga', 'suggestion',
    'search-form','isotope'
], function($, initDevice){
    initDevice.init();

    //layout
    $('#game-items').isotope({
      // options
      itemSelector : '.game',
      layoutMode : 'masonry'
    });

    $('#game-items .game').css('visibility','visible');

    //fix special detail page can not set nav current
    //by zhangyaochun 06-13
    $('.cat-special').addClass('current');
    
});
