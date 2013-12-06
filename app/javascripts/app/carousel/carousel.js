/**
 * @include jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 */
jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});

/**
 * a simple jquery carousel plugin
 * More information: https://github.com/aobo711/jQuery-Carousel
 * 
 * Open source under the BSD License
 * Copyright © 2010 zjtian711@gmail.com
 * 
 * This is a jQuery animation plugin that focus on carousel effects,
 * especialy for banner showcases, it use changing opacity smoothly
 * as default effect, and supports any other effects through custom function
 * 
 */
(function($) {
    $.extend($.fn, {
        carousel : function(setting) {
            //merge config
            var config = this.config = $.extend({
                itemContainer : "#itemContainerId" ,   //carousel contents wrapper
                prevBtn : "#prevBtnId",    //forward and up buttons id
                nextBtn : "#nextBtnId",    //backward and down buttons id
                prevDisableClass : "prev-disable",   //available forward and up buttons class
                nextDisableClass : "next-disable",  //unavailable forward and up buttons class
                autoScroll : true,  //auto play animation
                defaultIndex : 0,   //the default animation index, starting from 0
                delayTime : 6000, //animation interval events, the number of milliseconds
                animTime : 500, //animation execution time 
                navTriggerTime : 200,  //the animation triggered by switching navigation
                orientation : "left",  //The direction of animation,up|down|left|right
                scrollCount : 1,    //animation steps 
                showCount : 1,  //The amount of content displayed on the screen
                useNav : false, //Whether to use the navigation small button,configuration through a custom HTML generator{navHTMLBuilder} 
                navCurrentClass : "current",    //Current navigation buttons classname
                navContainer : "#navContainerId",   //navigation dom id
                navEvent : "mouseover", //navigation trigger event
                easeEffect : "swing",   //default animation effect
                customChange : defaultChange,   //custom switching function
                customInit : null,  //switching function of the initialization function defined
                btnNav : false, //whether to use the navigation buttons,
                onChange : null, //callback when item changes
                repeat : 0  // repeat animation when ends
            }, setting || {}),
            
            self = this,
            
            //animation params using for controling orientation
            animParams = self.animParams = {
                left : { relatedProp : "left" ,opposite :"right"},
                right : { relatedProp : "left" , opposite :"left"},
                top : { relatedProp : "top" , opposite :"bottom"},
                bottom : { relatedProp : "top" , opposite :"top"}
            };
            /**
             * build navigation when option 'useNav' is true 
             */
            function buildNav(wrapper){
                var c = self.config, a =[],b =[];
                c.navContainer = c.navContainer.replace("#","");
                for(var x = 0;x < wrapper.count; x++){
                    a.push("<a href=\"javascript:void(0)\" "+ (x > self.count - c.showCount ? "class=\"unreachable\"" : "") + " id=\"" + config.navContainer + "-" + x +"\">"+ (x + 1)+ "</a>");
                }
                var nav = $('<div class="carousel-nav" id="' + c.navContainer + '"></div>').css("position","absolute").html(a.join(""));

                wrapper.append(nav);
                return nav;
            }

            function finalSize(el) {
                el = $(el);
                return {
                    'height' : el.outerHeight() + parseInt(el.css('margin-top')) + parseInt(el.css('margin-bottom')),
                    'width' : el.outerWidth() + parseInt(el.css('margin-left')) + parseInt(el.css('margin-right'))
                };
            }

            /**
             * navigate to the specific item
             * @param {int} i - item index
             */
            function navTo(wrapper, i){
                if(wrapper.nav.length == 0 && !config.btnNav) return;
                wrapper.navItems.eq(wrapper.index).removeClass(config.navCurrentClass);
                wrapper.navItems.eq(i).addClass(config.navCurrentClass);
                wrapper.index = i;
            };

            /**
             * an default function used in switching the contents by moving positions  
             * 
             * @param {int} i - item index
             */
            function defaultChange(i){
                if( this.stopFlag) {return 0;}
                var parmas = animParams[config.orientation],
                    horizontal = parmas.relatedProp === "left",
                    propertyTo = 0,
                    animTime = arguments[1][1] ? config.navTriggerTime : config.animTime,
                    indexFlag = arguments[1][2],
                    items = this.items,
                    itemContainer = this.itemContainer,
                    tempIndex = indexFlag ? this.index : (i - 1);

                for(var x in items){
                    if(x <= tempIndex){
                        var size = finalSize(items[x]);
                        propertyTo = propertyTo - (horizontal ? size.width : size.height);  
                    }
                }
                var animProperty = horizontal ?{ left: propertyTo }: {top : propertyTo};
                itemContainer.stop();
                itemContainer.animate(animProperty , animTime,config.easeEffect);
            }

            //calculate the item index, it's necessary to make sure the index is legal
            function calIndex(wrapper, i, flag){
                var s = parseInt(config.scrollCount);
                if(flag){
                    return clearIndex(wrapper, parseInt(i)+ s > wrapper.count -1 ? 0 : parseInt(i)+ s );
                }else{
                    return clearIndex(wrapper, i - s);
                }
            }

            //reset the index within a permissible range
            function clearIndex(wrapper, index){
                if(index >= wrapper.count - config.showCount ){
                    return wrapper.count - config.showCount;
                }
                if(index < 0){
                    return config.repeat ? wrapper.count + index : 0
                }
                return index;
            }

            //check whether it needs to play animation
            function checkIndex(wrapper,index){
                return wrapper.count - index >= config.showCount && index >= 0 && index !== wrapper.index;
            }

            function refreshNavBtn(wrapper, index){
                var c =this.config,t=this;
                if(index == 0){
                    wrapper.nextBtn.addClass(config.nextDisableClass);
                }else{
                    wrapper.nextBtn.removeClass(config.nextDisableClass);
                }
                if(index == (wrapper.count - config.showCount)){
                    wrapper.prevBtn.addClass(config.prevDisableClass);
                }else{
                    wrapper.prevBtn.removeClass(config.prevDisableClass);
                }
            }
            /**
             * change the carousel to  specific status
             * it will call interface config.customChange 
             * @param i{int} - item index
             */ 
            function changeTo(wrapper, i){
                if(!checkIndex(wrapper,i) || (wrapper.config.navEvent === 'click' ? 0 : wrapper.stopFlag)){
                    return;
                }
                if(wrapper.index == i && i!= 0) return;
                i = i >= wrapper.count ? 0 : i ;
                config.customChange.call(wrapper, i, arguments);
                navTo(wrapper, i);
                refreshNavBtn(wrapper, i);
                wrapper.index = i;
                if(config.onChange){
                    config.onChange.call(wrapper, i);
                }
            };

            //end main functions
            return this.each(function(){

                var wrapper = $(this),
                //start main functions
                //initialization
                
                //the carousel container
                wrapper = wrapper.css("position","relative");
                wrapper.config = self.config;
                
                //the contents, and it's necessary to set position to relative 
                var itemContainer = wrapper.itemContainer = $(config.itemContainer,wrapper).css("position","relative"),
                
                //an array, all content item collections
                items = wrapper.items = itemContainer.children(),
                
                //navigation wrapper
                nav = $(config.navContainer) ,
                
                //navigation items array
                navItems = config.navItems ? $(config.navItems) : nav.children(),
                
                //the count of items
                count = wrapper.count = items.length,
                
                //preview button element    
                prevBtn = wrapper.prevBtn = $(config.prevBtn),
                
                //next button element
                nextBtn = wrapper.nextBtn = $(config.nextBtn);
                
                //cache the current animation index
                wrapper.index = config.defaultIndex;
                
                var tempWidth = 0,
                    tempHeight = 0;
                for(var i = items.length;i--;){
                    var size = finalSize($(items[i]));
                    tempWidth += size.width;
                    tempHeight += $(items[i]).height();
                }

                if(navItems.length == 0 && nav.length == 0 && config.useNav){
                    nav = buildNav(wrapper);
                    navItems = nav.children();   
                }

                wrapper.navItems = navItems;
                wrapper.nav = nav;
                
                if(config.customInit){
                    config.customInit.call(wrapper);
                }else{
                    //deal with orientation options
                    if( config.customChange === defaultChange ){
                        if(animParams[config.orientation].relatedProp === "left"){
                            itemContainer.css("width" , tempWidth);
                            items.css("float","left");
                        }else {      
                            itemContainer.css("height" , tempHeight);
                        }
                    }
                }
                
                changeTo(wrapper, config.defaultIndex);
                
                navTo(wrapper, wrapper.index);
                //end initialization
                refreshNavBtn(wrapper,wrapper.index);
                
                //live events
                if(navItems.length != 0){
                    navItems.bind(config.navEvent ,function(){
                        var navItem = this,
                            index = parseInt(navItem.id.replace(config.navContainer + "-",""));
                            if(isNaN(index)){
                                for(var i = navItems.length;i-- ;){
                                    if(navItems[i] === navItem){
                                        index = i;
                                    }
                                }
                            }
                        changeTo(wrapper, index,1,items);
                    }).hover(function(){
                        wrapper.stopFlag = 1;
                    },function(){
                        wrapper.stopFlag = 0;
                    });
                }
                itemContainer.bind("mouseover",function(){
                    wrapper.stopFlag = 1;
                }).bind("mouseout",function(){
                    wrapper.stopFlag = 0;
                });
                
                //if you set 'btnNav' true, it needs to live some events on the buttons
                if(config.btnNav){
                    prevBtn.bind("click" , function(){
                        if(this.className.indexOf(config.prevDisableClass) >= 0 && !config.repeat) return;
                        var prevIndex = calIndex(wrapper, wrapper.index,1);
                        changeTo(wrapper, prevIndex, 1);
                        refreshNavBtn(wrapper, prevIndex);
                    });
                    nextBtn.bind("click" , function(){
                        if(this.className.indexOf(config.nextDisableClass) >= 0 && !config.repeat) return;
                        var nextIndex = calIndex(wrapper, wrapper.index,0);
                        changeTo(wrapper, nextIndex, 0);

                        refreshNavBtn(wrapper, nextIndex);
                    });
                }
                
                //bind auto scroll
                if(config.autoScroll){
                    var interval = setInterval(function(){
                        changeTo(calIndex(wrapper.index,true), items);
                    },config.delayTime);
                }
                //end live events
            });
        }
    }); 

    /**
     * an carousel effect, uses changing opacity as transition effect
     */
    window.opacityChange = function(i){
        var self = this, 
            animParams = self.animParams,
            config = self.config;
        if( self.stopFlag) {return 0;}
            animTime = arguments[1] ? config.navTriggerTime : config.animTime,
            currentItem = $(self.items[self.index]),
            targetItem = $(self.items[i]);
        
        currentItem.css({zIndex: 1});
        targetItem.stop().css({
            opacity : 0     
        }).animate(
            {opacity : 1}, animTime , config.easeEffect ,function(){
                currentItem.css({opacity : 0});
            }   
        ).css({zIndex : 2});
    }
    
    /**
     * necessary initialize function for 'opacityChange'
     */
    window.opacityInit = function (){
        var self = this;
        self.items.css({
            position: "absolute",
            zIndex : 1,
            opacity : 0
        });
        $(self.items[self.config.defaultIndex]).css({
            opacity : 1,
            zIndex : 2
        });
    }
})(jQuery);



