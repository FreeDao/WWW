/**
 * www.wandoujia.com 应用详情页面 js app 
 */

require.config({
    baseUrl: '/style/js/run/www',
    paths: {
        'jquery' : '../../lib/jquery-1.7.1',
        'underscore' : '../../lib/underscore',
        'cookie' : '../../util/jquery.cookie',
        'montage' : '../../app/montage/montage',
        'popup' : '../../app/popup/popup',
        'cookie' : '../../util/jquery.cookie',
        'suggestion' : '../../app/suggestion/suggestion',
        'photo' : '../../app/prettyPhoto/prettyPhoto',
        'dateFormat' : '../../util/data_formate',
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
        'photo': ['jquery'],
        'ga' : ['jquery'],
        'device' : ['jquery']
    }
});
require(['jquery','underscore','cookie', 'ga',
    'suggestion',
    'search-form',
    'detail/screenshot',
    'detail/security', 
    'detail/download', 
    'detail/desc',
    'detail/permission',
    'detail/comment',
    'detail/dashboard'
], function(){
});

