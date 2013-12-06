;(function (factory) {
    'use strict';
    
    if (typeof define === 'function' && define.amd) {
        define([
            'jquery'
        ], factory);
    } else {
        // Browser globals:
        factory(window.jQuery);
    }
}(function ($) {
    'use strict';
    if(! $.fn.carousel ){
        return;
    }
    
    var prefixed = function( property ){
        var prefix = '';
        if($.browser.mozilla){
            prefix = 'Moz';
        }else if($.browser.ie){
            prefix = 'ms'
        }else if($.browser.webkit){
            prefix = 'Webkit'
        }
        return prefix + property; 
    },
    transformProp = prefixed('Transform'),
    rotateFn;
    
    $.fn.carousel.init2D = function(){
        var self = this,
            items = self.items,
            navItems = self.navItems;
        
        items = self.items;
        self.rotateFn = self.config.orientation === 'top' ? 'rotateX' : 'rotateY';
        
        
    };
    
    $.fn.carousel.transforms2D = function(index){
        var items = this.items,
            item = items.eq(index),
            navItems = this.navItems;
                    
        items.eq(this.index).removeClass('current');
        item.addClass('current');
        
        navItems.removeClass('current');
        navItems.eq(index).addClass('current');
        
        this.index = index;
    };
    
}));
