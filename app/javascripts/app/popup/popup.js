/**
 * @desc 功能相对简单的弹出层
 * @author jintian
 */
(function($){
    $.extend($.fn, {
        popup : function(source){
        var config = $.extend({
                // 弹出层的默认内容
                content : function(){
                    return 'popup content';
                } ,
                // 触发弹出层的事件
                triggerEvent : 'click' ,
                // 是否显示遮罩
                showMask : 1 ,
                popopClass : '',
                // 遮罩的透明度
                opacity : .6 ,
                // 弹出层的标题
                title : '',
                // 是否点击遮罩层关闭对话框
                clickToHide : 1 ,
                // 是否显示关闭按钮
                closeBtn : '',
                delay : 400,
                setDisabled : function(){
                    return 0;
                },
                maskOpacity : 0.4
            }, source),
            
            doc = $(document),
            body = $('body'),
            win = $(window),
            self = this,
            isIE6 = $.browser.msie && $.browser.version == '6.0',
            
            // 重置弹出层的位置和遮罩的大小
            resize = function(flag){
                if(self.layer){
                    self.layer.css({
                        'height' : doc.height(),
                        'width' : doc.width(),
                        'opacity' : config.maskOpacity
                    });
                    if(flag){
                        return;
                    }
                }
                if(self.popupWp){
                    self.popupWp.css({
                        'top' : (win.height() - self.popupWp.outerHeight()) / 2 / (0.618 / 0.5) + (isIE6 ? doc.scrollTop() : 0),
                        'left' : (win.width() - self.popupWp.outerWidth()) / 2
                    });
                    
                }
            },
            // 关闭弹出层，执行回调
            close = function(){

                if(config.closeAnimate){
                    $('.detailPop').animate({
                        height : 0
                    },500,'easeOutBack',function(){
                        $('.detailPop').fadeOut();
                        $('.popup-layer').fadeOut();
                        $('.detailPop').remove();
                    });
                }else{
                    self.layer.fadeOut(200);
                    self.popupWp.html('').remove();
                }

                if(config.onClose){
                    config.onClose();
                }
                if(isIE6){
                    $('body').css({
                        'height' : 'auto'
                    });
                    $('html').css({
                        'overflow' : 'auto'
                    });
                }
                
            },
            // 创建背景遮罩
            buildMask = function(){
                if(!self.layer){
                    self.layer = $('<div id="popup-layer" class="popup-layer"></div>').hide();
                    resize(self.layer);
                    self.layer.css({
                        'opacity' : config.opacity
                    }).appendTo(body).fadeIn(config.delay);
                }else{
                    self.layer.fadeIn(config.delay);
                }
                if(config.clickToHide){
                    self.layer.bind('click',function(){
                        close();
                    });
                }
            },
            /**
             * @desc 创建弹出层的内容
             * @param target {Object} 出发弹出层的对象
             */
            buildContent = function(target){
                var temp = '<div class="' +  (config.popopClass ?  config.popopClass : 'popup-main ' )+  '">',
                    content = '';
                if(config.content){
                    content += config.content.call(target);
                }else{
                    content += 'Put some texts here.';
                }
                if(config.title){
                    temp += '<h3 class="popup-title">' + config.title + '</h3>';
                }
                if(!config.closeBtn){
                    temp += '<a href="javascript:;" class="popop-close">&times;</a>';
                }
                temp += '<div class="pop-content" id="pop-content">' + content + '</div></div>';

                self.popupWp = $(temp).appendTo('body').css({
                    top : 0,
                    left : 0
                });

                resize();

                if(config.showAnimate){
                    $('.detailPop').css({
                        opacity: 0,
                        top : $(window).scrollTop() + 45
                    });
                    $('.detailPop').animate({
                        opacity : 1
                    },100,'easeInCubic');

                    $('.popup-layer').fadeIn();
                }else{
                    self.popupWp.show();
                }

                
                
                if(config.onOpen){
                    config.onOpen.call(target);
                }
                
                self.popupWp.find('.popop-close').bind('click',close);
                
                
                if($.browser.msie && $.browser.version == '6.0'){
                    self.popupWp.css({
                        'position' : 'absolute'
                    });
                    $('html').css({
                        'overflow' : 'hidden'
                    });
                    $('body').css({
                        'height' : '100%',
                        'overflow' : 'auto'
                    });
                }
            },
            
            // 显示弹出层内容
            openLayer = function(trigger){
                if(config.showMask){
                    buildMask();
                    setTimeout(function() {
                        buildContent(trigger);
                    }, config.delay + 10);
                }else{
                    buildContent(trigger);
                }
            };
            
            window.closePopup = close;
            
            $.fn.disabledPopup = function(){
                return config.setDisabled();
            };
    
            $.fn.setPopup = function(options){
                config = $.extend(config,options);
            };
    
            $.fn.showPopup = function(target){
                if($.fn.disabledPopup()){
                    return;
                }
                openLayer(target);

            };
        }
    });
})(jQuery);
