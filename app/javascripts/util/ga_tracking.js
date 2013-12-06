;(function (factory) {
    'use strict';
    
    if (typeof define === 'function' && define.amd) {
        define([
            'exports','jquery'
        ], factory);
    } else {
        // Browser globals:
        factory(window.jQuery);
    }
}(function (exports, $) {
    gaEvent = function(tracks){
        _gaq = _gaq || [];

        switch (tracks.length){
            case 3:
                _gaq.push(['_trackEvent', tracks[0], tracks[1] , tracks[2]]);
            case 4:
                _gaq.push(['_trackEvent', tracks[0], tracks[1] , tracks[2], Number(Math.floor(tracks[3]))]);
            default:;
        }
    };
    exports.gaEvent = gaEvent;
    $(document).delegate('a[data-track],span[data-track]', 'click', function(){
        var self = $(this),
            tracks = self.data('track');
        
        if(tracks && !self.data('gamecontent') && !self.data('block') && !self.data('permission') && !self.data('pay') && !self.data('compatible')) {
            gaEvent(tracks.split('-'));
        }

    });    
}));