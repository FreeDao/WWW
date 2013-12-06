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
        'q' : '../../lib/q',
        'login-kit' : '../../util/login-kit',
        'device' : '../../util/device_tool',
        'initDevice' : 'init-device',
        'placeholder' : '../../app/placeholder/placeholder'
    },
    shim: {
        'cookie': ['jquery'],
        'suggestion' : ['jquery'],
        'ga' : ['jquery'],
        'device' : ['jquery']
    }
});
require(['jquery','initDevice','underscore','cookie','ga','suggestion',
    'search-form'
], function($, initDevice){
    initDevice.init();

    //fix special detail page can not set nav current
    //by zhangyaochun 06-13
    $('.cat-special').addClass('current');
    
});
