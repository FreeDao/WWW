/**
 * www.wandoujia.com 首页 js app 
 */

require.config({
    baseUrl: '/style/js/run/www',
    paths: {
        'jquery' : '../../lib/jquery-1.7.1',
        'underscore' : '../../lib/underscore',
        'suggestion' : '../../app/suggestion/suggestion',
        'cookie' : '../../util/jquery.cookie',
        'carousel' : '../../app/carousel/carousel',
        'ga' : '../../util/ga_tracking',
        'q' : '../../lib/q',
        'login-kit' : '../../util/login-kit',
        'device' : '../../util/device_tool',
        'toolbar' : '../../util/toolbar',
        'initDevice' : 'init-device',
        'placeholder' : '../../app/placeholder/placeholder'
    },
    shim: {
        'cookie': ['jquery'],
        'suggestion' : ['jquery'],
        'cookie' : ['jquery'],
        'photo': ['jquery'],
        'toolbar' : ['jquery', 'underscore'],
        'ga' : ['jquery'],
        'device' : ['jquery']
    }
});
require(['jquery','initDevice','underscore','cookie', 'ga', 'suggestion',
    'search-form', 'toolbar',
    'nav-menu'
], function($, initDevice){
    initDevice.init();
});
