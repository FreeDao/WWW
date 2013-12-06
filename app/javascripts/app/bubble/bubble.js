(function($){
    $.extend($.fn, {
        bubble : function( settings ){
            var config = $.extend({
                //触发bubble的事件类型
                triggerEvent : 'mouseenter',
                
                //关闭bubble的事件类型
                hideEvent : 'mouseleave',
                
                // bubble的容器 jQuery对象
                bubbleWrapper : null,
                
                // 生成bubble内容
                setContent : function () {
                    
                },
                // 计算bubble位置时相对的元素
                relativedEl : function(){
                    return this;  
                },
                // 水平偏移量
                horizontalOffset : 0,
                // 垂直偏移量
                verticalOffset : 0,
                // 鼠标移进bubble是否要保持bubble展示
                focusShow : 0,
                // 计算箭头方向的时候相对边沿的容器，默认为window
                wallEl : '',
                className : '',
                autoBind : 1 ,
                animateOrientation : 'top'
            }, settings),

            // bubble 对象
            bubble,
            body = $('body'),
            self = this,
            
            arrHorPos,
            arrVerPos,
            
            procressing = 0;


            // 如果没有提供bubble 则创建
            if(!config.bubbleWrapper){
                if($('.bubble').length){
                    bubble = $('.bubble');
                }else{
                    var temp = '<div class="bubble ' + config.className  + '" style="display:none;">' + 
                                    '<div class="content"></div>' + 
                                    '<span class="arrow"></span>' +
                                    '<span class="arrow-inner"></span>' + 
                                '</div>';
                    bubble = $(temp).appendTo(body);
                } 
            }else{
                bubble = config.bubbleWrapper;
            }
            
            function buildContent(target){
                var wp = bubble.find('.content');
                if(wp.length){
                    wp.html(target.data('config').setContent.call(target));
                }
            }
            
            var curTarget;
            
            function showBubble(directlyShow){
                if(!curTarget){
                    return;
                }
                
                var curTop = parseFloat(bubble.css('top')),
                    curLeft = parseFloat(bubble.css('left')),
                    targetZIndex = parseInt(curTarget.css('z-index')),
                    bubbleZIndex = parseInt(bubble.css('z-index')),
                    target = this;

                if(directlyShow){
                    bubble.stop(true,true).hide().show();
                }else{
                    var animateProp = {
                            display : 'block',
                            opacity : 0
                        },
                        animatedProp = {
                            opacity : 1
                        };
                    if(config.animateOrientation == 'left'){
                        animateProp['left'] = arrHorPos == 'left' ? (curLeft - 10) : (curLeft + 10);
                        animatedProp['left'] = curLeft;
                    }else{
                        animateProp['top'] = arrVerPos == 'top' ? (curTop - 10) : (curTop + 10);
                        animatedProp['top'] = curTop;
                    }
                    
                    if(!config.focusShow){
                        target.data('blockHide', 2);
                        setTimeout(function(){
                            target.data('blockHide', 0);
                        },200);
                    }

                    bubble.stop(true,true)
                        .hide()
                        .css(animateProp).animate(animatedProp, 200);
                    
                }
                
            }
            
            function hideBubble(){
                var target = this;
                if(target && target != window && target.data('blockHide')){
                    return;
                }
                bubble.stop(true,true).hide();   
            }
            
            function locateBubble(target, relativeEl, animateFlag){
                var pos = relativeEl.offset(),
                    bWidth = bubble.width(),
                    dWidth = $(window).width(),
                    dHeight = $(window).height(),
                    config = target.data('config');
                curTarget = relativeEl;
                
                if(config.wallEl){
                    dWidth = dWidth - ($(window).width() - config.wallEl.width()) / 2;
                }
                
                // bubble 小箭头的指向和位置
                arrHorPos = 'left';
                arrVerPos = 'top';
                
                var horPos = pos.left + relativeEl.outerWidth() + config.horizontalOffset,
                    verPos = pos.top + relativeEl.outerHeight() + config.verticalOffset - $(document).scrollTop();

                if(horPos + bubble.outerWidth() > dWidth){
                    arrHorPos = 'right';
                }
                
                if(verPos + bubble.outerHeight() > dHeight){
                    arrVerPos = 'bottom';
                }

                var props = {};
                if(arrHorPos == 'right'){
                    props = {
                        left : pos.left - bubble.outerWidth() - bubble.find('.arrow').outerWidth() - config.horizontalOffset ,
                        top : (arrVerPos === 'top' ? (pos.top - config.verticalOffset) : (pos.top - bubble.outerHeight() + relativeEl.outerHeight() + config.verticalOffset)) 
                    };
                    
                }else{
                    props = {
                       left : pos.left + relativeEl.outerWidth() + bubble.find('.arrow').outerWidth() + config.horizontalOffset,
                       top : (arrVerPos === 'top' ? (pos.top - config.verticalOffset) : (pos.top - bubble.outerHeight() + relativeEl.outerHeight() + config.verticalOffset))
                    };
                }
                if(animateFlag){
                    bubble.animate(props, 200);
                }else{
                    bubble.css(props);
                }
                
                bubble[0].className = 'bubble '+ config.className + ' arrow-' + arrHorPos + ' ' + arrHorPos + '-' + arrVerPos;
            }
            
            if(config.focusShow){
                bubble.hover(function(){
                    showBubble(1);
                },function(){
                    hideBubble();
                });
            }
            
            $.fn.locateBubble = function(target, animateFlag){
                var relativedEl = target.data('config').relativedEl.call(target);
                locateBubble(target, relativedEl, animateFlag);
            }
            
            $.fn.showBubble = function(target){

                buildContent(target);
                $.fn.locateBubble(target);
                showBubble.call(target);
            };
            
            $.fn.hideBubble = function(target){
                hideBubble.call(target);
            };
            
            return this.each(function(){
                var target = $(this);
                target.data('config', config);

                if(config.autoBind){

                    if(target.is(':hover')) {
                        $.fn.showBubble(target);
                    }

                    target.attr('title','').bind({
                        'mouseenter' : function(){
                            $.fn.showBubble(target);
                        },
                        'mouseleave' : function(){
                            target.data('blockHide', 0);
                            $.fn.hideBubble(target);
                        }
                     });
                }
            });
        }
    });
})(jQuery);
