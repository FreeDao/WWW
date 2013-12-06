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
    rotation = 0,
    // 旋转空间的大小
    radius,
    // 每个 item 转转的度数
    theta,
    // rotate 的属性值
    rotateFn;
    
    $.fn.carousel.init3D = function(){
        var self = this,
            items = self.items,
            navItems = self.navItems;
        
        var carouselSize = self.config.orientation === 'top' ? $(items).height() : $(items).width(),
            count = self.items.length,
            i;
       
        items = self.items;
        theta = 360 / count;
        rotateFn = self.config.orientation === 'top' ? 'rotateX' : 'rotateY',
        radius = Math.round( ( carouselSize / 2) / Math.tan( Math.PI / count )  );

        for ( i = 0; i < count; i++ ) {
            var item = self.items.eq(i),
                angle = theta * i;
            
            item[0].style[ transformProp ] = rotateFn + '(' + angle + 'deg) translateZ(' + radius + 'px)';
        }
        
        rotation = Math.round( rotation / theta ) * theta;

        items.parent().get(0).style[ transformProp ] = 'translateZ(-' + radius + 'px) ' + rotateFn + '(0deg)';
        
        setTimeout( function(){
            $('body').addClass('ready');
        }, 0);
    };
    
    $.fn.carousel.transforms3D = function(index){
        var items = this.items,
            item = $(items[index]),
            angle = theta * index,
            navItems = this.navItems,
            increment = index === 0 ? 0 : (index > this.current ? -1 : 1);
        items.css({
           opacity : 0 
        });
        item.css({
            opacity : 1
        });
        rotation = theta * index * -1;
        
        navItems.removeClass('current');
        navItems.eq(index).addClass('current');
    
        item[0].style[ transformProp ] = rotateFn + '(' + angle + 'deg) translateZ(' + radius + 'px)';
        item.parent().get(0).style[ transformProp ] = 'translateZ(-' + radius + 'px) ' + rotateFn + '(' + rotation + 'deg)';
        
        this.index = index;
    };
    
}));
