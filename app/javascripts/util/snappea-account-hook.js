/*global $, assure*/
(function (global) {
    var $ = global.$;

    var IFRAME_STYLE = [
        'border: none;',
        'border-radius: 10px;',
        'left: 50%;',
        'height: 417px;',
        'margin: -215px 0 0 -208px;',
        'position: fixed;',
        'top: 50%;',
        'width: 434px;'
    ].join('');

    var CTN_STYLE = [
        'background: #4C4C4C;',
        'background: url(http://img.wdjimg.com/account/overlay.png);',
        'background: rgba(0, 0, 0, .7);',
        'bottom: 0;',
        'left: 0;',
        'position: fixed;',
        'right: 0;',
        'top: 0;',
        'z-index: 999;'
    ].join('');

    var AccountHook = {};

    AccountHook.open = function (options, context) {
        options = options || {};

        options.name = options.name || '';
        options.callback = options.callback || function () { return; };

        if (!global.Messenger || options.popup === false) {
            global.document.location.href = 'http://www.wandoujia.com/account/web.html?callback=' + encodeURIComponent(global.document.location.href) + '#' + options.name;
            return;
        }

        var $ctn = $('<div>').attr('style', CTN_STYLE).appendTo('body');

        var $iframe = $('<iframe>').attr({
            src : 'http://www.wandoujia.com/account/?source=web&close=1#' + options.name,
            style : IFRAME_STYLE
        }).appendTo($ctn);

        var messenger = global.Messenger.initInParent($iframe[0]);

        messenger.onmessage = function (message) {
            var msg = message.split(':'),
                data = decodeURIComponent(msg[1]);

            switch (msg[0]) {
            case 'height':
                if (navigator.userAgent.toLowerCase().indexOf('msie') > -1) {
                    data = Number(data) + 4;
                }

                $iframe.css('height', data + 'px');
                break;

            case 'close':
                $ctn.remove();
                break;

            case 'done':
                $ctn.remove();
                options.callback.call(context || global);
                break;

            case 'redirect':
                global.document.location.href = data;
                break;
            }
        };

        $ctn.on('click', function () {
            $ctn.remove();
        });
    };

    var SnapPea = global.SnapPea || {};
    SnapPea.AccountHook = AccountHook;
    global.SnapPea = SnapPea;
}(this));
