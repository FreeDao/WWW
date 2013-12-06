/**
 * @desc 移动版的图片滚动展示
 * @require zepto
 */
(function($) {
    $.extend($.fn, {
        mCarousel : function(config){
            var config = $.extend({
                    // 是否自动生成导航区
                    useNav : 0,
                    // 是否自动播放
                    autoPlay : 0,
                    // 容器内的轮播对象className
                    itemCls : 'item',
                    // 是否在导航区显示数字
                    showNum : 0,
                    // 某认展示的对象索引，从0计数
                    defaultIdx : 0,
                    // 某认展示的对象的class标志
                    currentCls : 'current',
                    // 每个屏幕显示多少张图片
                    countPerScreen : 3,
                    // 展示多图时图片的缩放比例，为了能让用户可以看到下一张图片的边沿
                    zoomRate : 0.9,
                    // 单屏幕滚动的时候，如果滚动的距离超过这个数值就是自动滑动至下/上一张
                    slideRange : 10
                }, config),
                
                // 用于存储移动时的位置和偏移量
                moves = {},
                
                /**
                 * 构建导航区
                 * @param wrapper {Object} 动画容器
                 * @param count {Integer} 动画对象的个数
                 */
                buildNav = function(wrapper,count){
                    // 实用相对简单的html结构，没必要太复杂
                    var nav = '<div class="carousel-nav">',
                        count = wrapper.count;
                    for(var i = count; i--; ){
                        nav += '<a href="javascript:;" class="nav-item">' + (config.showNum ? (count - i) : '&nbsp;') + '</a>';
                    }
                    nav += '</div>';
                    nav = $(nav);
                    wrapper.append(nav);
                    return nav;
                },
                
                getOuterWidth = function(el){
                    return el[0].width + parseFloat(el.css('margin-left')) + parseFloat(el.css('margin-right'));;
                },
                
                /**
                 * @desc 为轮播做一些dom的初始化
                 */
                prepare = function(wrapper) {
                    var imgs = wrapper.imgs,
                        count = imgs.length;
                        items = wrapper.items;
                    items.wrapAll('<div class="carousel-wp cf"></div>');
                    wrapper.itemWp = wrapper.find('.carousel-wp');
                    
                    imgs.each(function(index, item){
                        img = $(item);
                        img.bind('load', function(){
                            count --;
                            if(count == 0){
                                resizeItems(wrapper); 
                                // 所有事件绑定
                                liveEvent(wrapper);
                                if(wrapper.count > 2 || config.useNav){
                                    // 立即播放当前索引
                                    play(wrapper, config.defaultIdx);
                                    
                                }
                                
                                $('.loading').hide();
                                imgs.show();
                            }
                        });
                        img.attr('src', img.attr('original')); 
                    });
                },
                
                /**
                 * @desc 重置轮播对象的尺寸
                 */
                resizeItems = function(wrapper){
                    // 设置播放的尺寸
                    var imgs = wrapper.imgs,
                        items = wrapper.items,
                        showCount = config.countPerScreen,
                        wWidth = wrapper.itemWp.width(),
                        iWidth = getOuterWidth(imgs),
                        widthFix = parseInt(imgs.css('margin-left')) + parseInt(imgs.css('margin-right'));
                        
                    if(!config.useNav){
                        imgs.css({
                            'max-height' : screen.height * 0.6
                        });
                    }
                    
                    imgs.last().css('margin',0);
                    
                    // 如果使用了导航器来切换
                    if(config.useNav){
                        wrapper.nav = buildNav(wrapper);
                        var sWidth = $(window).width(),
                            sHeight = $(window).height(),
                            heightLeft = sHeight - wrapper.nav.outerHeight();
                      
                        items.css({
                            width : sWidth - widthFix
                        });
                        wrapper.step = getOuterWidth(items);
                        
                        // 自动设置图片的高宽以适应屏幕尺寸
                        if(imgs.height() / imgs.width() > heightLeft / (sWidth - widthFix)){
                            imgs.css({
                               height : sHeight - wrapper.nav.outerHeight()
                            });
                        }else{
                            imgs.css({
                               width : sWidth - widthFix
                            });
                        }
                        if(wrapper.count > showCount){
                            wrapper.itemWp.width(wrapper.count * (getOuterWidth(items) + widthFix) - widthFix);
                        }
                    }else{
                        var widthEnough = (iWidth + widthFix) * wrapper.count < wWidth;
                        // 如果每屏的展示数量小于展示总数，则适当缩小宽度，让下一个图片边沿可以展示出来，缩小的比例为zoomRate
                        var rate = wrapper.count > showCount ? config.zoomRate : 1;
                            imgWidth = (wWidth / showCount - (widthFix + getOuterWidth(imgs) - imgs[0].width)) * rate;
                            
                        // 普通平铺模式的初始化
                        if(!widthEnough){
                            imgs.width(imgWidth);
                        }
                        if(!widthEnough && wrapper.count > showCount){
                            //+1是因为jquery计算宽度会取整数，实际计算会小几像素
                            wrapper.itemWp.width(wrapper.count * (imgWidth + widthFix + 1) - widthFix);    
                        }
                        
                    }
                    
                },
                /**
                 * @desc 移动动画逻辑
                 * @param dx {Integer} 移动的距离值
                 */
                moveTo = function(wrapper, dx){
                    var itemWp = wrapper.itemWp,
                        //  当前位置
                        cur = parseInt(itemWp.css('margin-left'));
                        // 最终需要移动到的位置
                        end = cur + dx,
                        //  单个展示的宽度
                        step = wrapper.step,
                        // 展示的数量减去 每个屏幕显示的数量
                        dCount = wrapper.count - config.countPerScreen,
                        minValue = itemWp.width() - wrapper.width();
                    end = end < (0 - minValue) ? (0 - minValue) : (end > 0 ? 0 : end);
                    
                    itemWp.css('margin-left' , end);
                },
                // 计算滑动的步数
                calIndex = function(wrapper){
                    var itemWidth =  wrapper.items.width(),
                        moveDistance = parseInt(wrapper.itemWp.css('margin-left')) + wrapper.current * itemWidth;
                    return moveDistance > itemWidth / 5 ? -1 : (moveDistance < - itemWidth / 5 ? 1 : 0);
                },
                
                /**
                 * @desc 读取全局的moves参数进行滚动处理
                 */
                moveByDx = function(wrapper){
                    var targetIndex = calIndex(wrapper);
                    if(targetIndex == 0){
                        play(wrapper, wrapper.current); 
                        return false;
                    }else{
                        var index = targetIndex > 0 ? (wrapper.current + 1) : (wrapper.current - 1);
                        index = index < 0 ? 0 : (index > (wrapper.count - 1)) ? (wrapper.count - 1) : index;
                        play(wrapper, index);
                        return true; 
                    }   
                },
                
                // 绑定事件
                liveEvent = function(wrapper){
                    var itemWp = wrapper.itemWp;
                    
                    itemWp.bind('touchstart',function(event){
                        var data = event.touches ?
                            event.touches[0] : event;
                        event.preventDefault();
                        moves.procressing = 1;
                        moves.x = data.pageX;
                    }).bind('touchmove',function(event){
                        // 修复android平台下touchmove在滑动的时候只能触发一次（或者很少的若干次）的bug
                        if( navigator.userAgent.match(/Android/i) && (wrapper.count > 3 || config.useNav)) {
                            event.preventDefault();
                        }
                        var data = event.touches ?
                            event.touches[0] :
                            event;
                        moves.dx = data.pageX - moves.x;
                        // move的时候不断刷新当前的x坐标
                        moves.x = data.pageX;
                        moveTo(wrapper,moves.dx);
                    }).bind('touchend',function(event){
                        if(config.useNav){
                            var moved = moveByDx(wrapper);
                        }
                        // 如果用户是 tap 操作，则直接打开图片上的链接
                        if(!moved && moves.dx > -3 && moves.dx < 3){
                            location.href = $(event.target).closest('a').attr('href');
                        }
                        moves.x = 0;
                        procressing = 0;
                    });
                    
                    if(wrapper.nav){
                        $(wrapper.nav.children()).each(function(index){
                            $(this).bind('click',function(){
                                play(wrapper, index);
                            });
                        });
                        setInterval(function(){
                            if(moves.dx && !wrapper.processing){
                                //moveByDx(wrapper);
                            }
                        },20);
                    }
                },
                
                /**
                 * @desc 播放动画逻辑,用指定的元素索引值滚动元素
                 * @param index {Integer} 播放对象的索引
                 */
                play = function (wrapper, index) {
                    wrapper.current = index;
                    wrapper.processing = 1;
                    if(wrapper.nav){
                        var navItems = wrapper.nav.children();
                        navItems.removeClass(config.currentCls);
                        $(navItems.eq(index)).addClass(config.currentCls);
                    }
                    
                    wrapper.itemWp.animate({
                        'margin-left' : 0 - wrapper.step * index 
                    },200,function(){
                        moves.dx = 0;
                        wrapper.processing = 0;
                    });
                    
                };
            
            return this.each(function(){
                    // 轮播对象的容器
                var wrapper = $(this),
                    // 轮播的对象们
                    // DOM结构会影响初始化过程和最终的效果
                    // items为容器的第一级子元素，一般是图片的父容器
                    items = wrapper.items = config.itemCls ? wrapper.find('.' + config.itemCls) : wrapper.children(),
                    // 真正展示的元素，一般为图片本身
                    imgs = wrapper.imgs = items.find('img'),
                    // 轮播对象数量
                    count = wrapper.count = items.length;
                    
                    // 延迟展示所有的对象
                    setTimeout(function(){
                        //进行必要的准备工作，DOM修改、重绘
                        prepare(wrapper);
                    },500);
                    
                
            });
        }
    });
})(Zepto);