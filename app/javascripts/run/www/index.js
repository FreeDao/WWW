/**
 * www.wandoujia.com 首页 js app 
 */

require.config({
    baseUrl: '/style/js/run/www',
    paths: {
        'jquery' : '../../lib/jquery-1.7.1',
        'underscore' : '../../lib/underscore',
        'suggestion' : '../../app/suggestion/suggestion',
        'text':'../../util/text',
        'cookie' : '../../util/jquery.cookie',
        'carousel' : '../../app/carousel/carousel',
        'ga' : '../../util/ga_tracking',
        'q' : '../../lib/q',
        'login-kit' : '../../util/login-kit',
        'device' : '../../util/device_tool',
        'initDevice' : 'init-device',
        'dateFormat' : '../../util/data_formate',
        'placeholder' : '../../app/placeholder/placeholder',
        'appCard' : 'index/appCard',
        'hotApp' : 'index/hotApp',
        'hotApps' : 'index/hot_apps'
    },
    shim: {
        'cookie': ['jquery'],
        'suggestion' : ['jquery'],
        'cookie' : ['jquery'],
        'photo': ['jquery'],
        'ga' : ['jquery'],
        'device' : ['jquery'],
        'hotApps' : ['jquery', 'underscore']
    }
});
require(['jquery', 'initDevice', 'underscore','cookie', 'ga', 'suggestion',
    'appCard',
    'hotApp',
    'hotApps',
    'index/banner',
    'index/loadMore',
    'app-rank',
    'search-form',
    'nav-menu'
], function($, initDevice){
    initDevice.init();
});

