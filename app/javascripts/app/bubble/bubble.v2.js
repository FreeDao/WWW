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
                wallEl : ''
            }, settings),
            
            // bubble 对象
            bubble,
            body = $('body'),
            procressing = 0;
            
            // 如果没有提供bubble 则创建
            if(!config.bubbleWrapper){
                if($('.bubble').length){
                    bubble = $('.bubble');
                }else{
                    var temp = '<div class="bubble" style="display:none;">' + 
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
                    wp.html(config.setContent.call(target));
                }
            }
            
            var showTimeout,
                hideTimeout;
            
            function showBubble(){
                if(hideTimeout){
                    clearTimeout(hideTimeout);
                }
                if(showTimeout){
                    return;
                }
                showTimeout = setTimeout(function(){
                    bubble.show();
                    showTimeout = null;
                }, 20);
            }
            
            function hideBubble(){
                hideTimeout = setTimeout(function(){
                    bubble.hide();   
                    hideTimeout = null; 
                },20);
            }
            
            function locateBubble(target){
                var pos = target.offset(),
                    bWidth = bubble.width(),
                    dWidth = $(window).width(),
                    dHeight = $(window).height();

                if(config.wallEl){
                    dWidth = dWidth - ($(window).width() - config.wallEl.width()) / 2;
                }
                
                // bubble 小箭头的指向和位置
                var arrHorPos = 'left',
                    arrVerPos = 'top',
                    horPos = pos.left + target.outerWidth() + config.horizontalOffset,
                    verPos = pos.top + target.outerHeight() + config.verticalOffset - $(document).scrollTop();

                if(horPos + bubble.outerWidth() > dWidth){
                    arrHorPos = 'right';
                }
                
                if(verPos + bubble.outerHeight() > dHeight){
                    arrVerPos = 'bottom';
                }
                
                if(arrHorPos == 'right'){
                    bubble.css({
                       left : pos.left - bubble.outerWidth() - bubble.find('.arrow').outerWidth() - config.horizontalOffset ,
                       top : (arrVerPos === 'top' ? (pos.top - config.verticalOffset) : (pos.top - bubble.outerHeight() + target.outerHeight() + config.verticalOffset)) 
                    });
                }else{
                    bubble.css({
                       left : pos.left + target.outerWidth() + bubble.find('.arrow').outerWidth() + config.horizontalOffset,
                       top : (arrVerPos === 'top' ? (pos.top - config.verticalOffset) : (pos.top - bubble.outerHeight() + target.outerHeight() + config.verticalOffset))
                    });
                }
                
                bubble[0].className = 'bubble arrow-' + arrHorPos + ' ' + arrHorPos + '-' + arrVerPos;
                
                showBubble();
            }
            
            if(config.focusShow){
                bubble.hover(function(){
                    showBubble();
                },function(){
                    hideBubble();
                });
            }
            bubble.hover(function(){
                
            });
            
            return this.each(function(){
                var target = $(this),
                    relativedEl = config.relativedEl.call(target);
                    
                 target.attr('title','').bind({
                     'mouseenter' : function(event){
                         buildContent(target);
                         locateBubble(relativedEl);
                     },
                     'mouseleave' : function(){
                         hideBubble();
                     }
                 });
            });
        }
    });
})(jQuery);
