/**
 *@name zhangyaochun
 *@info www.wandoujia.com 专题列表依赖 
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
    'search-form','nav-menu','special-filter'
], function($, initDevice){
    initDevice.init();
});
