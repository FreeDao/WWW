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
        'toolbar' : '../../util/toolbar',
        'initDevice' : 'init-device',
        'placeholder' : '../../app/placeholder/placeholder'
    },
    shim: {
        'cookie': ['jquery'],
        'suggestion' : ['jquery'],
        'toolbar' : ['jquery', 'underscore'],
        'ga' : ['jquery'],
        'device' : ['jquery']
    }
});
require(['jquery','initDevice','underscore','cookie', 'ga', 
    'suggestion',
    'toolbar',
    'search-form',
    'nav-menu'
], function($, initDevice){
    initDevice.init();
});

