/**
 * @desc 输入框提示
 * @author jintian
 */
(function($) {
    $.fn.extend({
        suggestion: function(options) {
            var config = $.extend({
                source : 'http://suggest2.wandoujia.com/search_sug',
                formator : '',
                container : $('body'),
                form : '.search-box',
                inputActivdClass : 'actived-ipt'
            },options),
            
            itemTpl = '<li><span class="word">{key}</span></li>',
            
            wrapper = $('<div class="suggestion-wp"></div>').css({
                position : 'absolute'
            }),

            categorySearch = $('.category-search'),
            tagWidth = categorySearch.width() + 8,
            
            sugList,
            stopFlag = 0,
            relocated = 0,
            resized = 0,
            currentInput = '',
            currentKey = '';
            currentIndex = -1,
            forceVisiable = 0,
            fetchProcressing = 0,
            isIE6 = $.browser.msie && ($.browser.version == "6.0") && !$.support.style;
            
            Prepare = function(target){
                var buildWp = function () {
                    config.container.append(wrapper);
                    wrapper.html('<ul class="suggestion-list"></ul>');
                    sugList = wrapper.find('.suggestion-list');
                    sugList.delegate('li','hover',function(){
                        forceVisiable = 1;
                        sugList.children().removeClass('current');
                        $(this).addClass('current');  
                    }).delegate('li', 'mousedown', function(){
                        currentInput.val($(this).text());
                        targetForm = currentInput.closest(config.form);
                        $('<input type="hidden" name="input" value="' + key + '" />').appendTo(targetForm);
                        targetForm.submit();
                    }).mouseout(function(){
                        forceVisiable = 0;
                    });
                },
                
                toggleItem = function(flag){
                    var max = sugList.children().length - 1;
                    if(max == -1){
                        return;
                    }
                    if(flag){
                        currentIndex += 1;
                        currentIndex = currentIndex > max ? 0 : currentIndex; 
                    }else{
                        currentIndex -= 1;
                        currentIndex = currentIndex < 0 ? max : currentIndex; 
                    }
                    sugList.children().removeClass('current');
                    var currentItem = sugList.children(':eq('+ currentIndex +')');
                    currentItem.addClass('current');
                    currentInput.val(currentItem.text());
                },
                
                resize = function(){
                    if(resized){
                        return;
                    }
                    if(categorySearch.length) {
                        wrapper.width(target.outerWidth() - parseInt(wrapper.css('border-left-width')) - parseInt(wrapper.css('border-right-width')) - tagWidth);
                    }
                    else {
                        wrapper.width(target.outerWidth() - parseInt(wrapper.css('border-left-width')) - parseInt(wrapper.css('border-right-width')) );
                    }
                    resized = 1;  
                },
                
                locateWp = function () {
                    if(relocated || !currentInput){
                        return;
                    }
                    wrapper.css({
                        top : currentInput.offset().top + currentInput.outerHeight() - parseInt(currentInput.css('border-bottom-width')),
                        left : currentInput.offset().left
                    });
                    relocated = 1;
                },
                
                hideList = function(){
                    if(forceVisiable){
                        return;
                    }
                    sugList.empty();
                    wrapper.hide();
                    currentKey = '';
                    currentIndex = -1;
                },
                
                render = function(wordlist){
                    if(wordlist.length){
                        var tempHTML = '';
                        for(var x in wordlist){
                            tempHTML += itemTpl.replace(/{key}/,wordlist[x]);
                        }
                        sugList.html(tempHTML);
                    }
                    wrapper.show();
                    currentIndex = -1;
                },
                /**
                 * 处理服务端返回的数字关键字数据
                 * @param {Object} data 搜索服务返回的数据
                 */
                handleData = function(data){
                    fetchProcressing = 0;
                    if(typeof data == 'undefined' || !data || !data.at || stopFlag){
                        hideList();
                        return;
                    }
                    render(data.wl);
                    resize();
                    locateWp();
                },
                // 从服务端获取数据
                fetch = function(){
                    key = $.trim(target.val());
                    if(currentKey == key || fetchProcressing){
                        return;
                    }
                    if( key ){
                        fetchProcressing = 1;
                        $.getScript(config.source + '?key=' + key + '&cb=handleSugData');
                        currentKey = key;
                    }else{
                        hideList();
                    }
                },
                
                keyboardNav = function(e){
                    switch (e.keyCode) {
                        case 13 : {
                            if(currentIndex == -1){
                                return;
                            }
                            stopFlag = 1;
                            targetForm = currentInput.closest(config.form);
                            currentInput.val(sugList.children('.current').text());
                            hideList();
                            targetForm.submit();
                            break;
                        }
                        case 38 : {
                            toggleItem(0);
                            break;
                        }
                        case 40 : {
                            toggleItem(1);
                            break;
                        }
                        return;
                    }
                };
                
                // 用于jsonp的回调
                window.handleSugData = handleData;
                
                return {
                    // 绑定事件
                    liveEvents : function(){
                        target.bind({
                            'keydown' : function(e){
                                target.addClass(config.inputActivdClass);
                                currentInput = target;

                                if(e.keyCode != 38 && e.keyCode != 40){
                                    fetch();
                                }
                                if(!isIE6){
                                    keyboardNav(e);
                                }
                            },
                            'keyup' : function(e){
                                if(e.keyCode != 38 && e.keyCode != 40){
                                    fetch();
                                }

                                if(isIE6){
                                    keyboardNav(e);
                                }
                            },
                            'focus' : function(){
                                target.addClass(config.inputActivdClass);
                                currentInput = target;
                                fetch();
                                stopFlag = 0;
                            },
                            'blur' : function(){
                                target.removeClass(config.inputActivdClass);
                                hideList();
                                stopFlag = 1;
                                relocated = 0;
                            }
                        });
                        
                        $(window).resize(function(){
                            relocated = 0;
                            resized = 0;
                            resize();
                            locateWp();
                            if(!sugList.children().length){
                                hideList();
                            }
                        });
                    },
                    prepareDom : function() {
                        buildWp();
                    }
                    
                };
            };
            
            
            return this.each(function(){
                var trigger = $(this),
                    prepare = new Prepare(trigger);
                prepare.prepareDom();
                prepare.liveEvents();
            });
        }
    });
})(jQuery);
