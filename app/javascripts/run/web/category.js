/**
 * @desc 分类页面逻辑
 * @author jintian 
 */
$(function(){

    // 根据用户的登录状态初始化相应的应用安装逻辑
    $('.dl-btn').click(function(event){
        event.preventDefault();
        var _self = $(this);
        if(typeof globeConfig == 'undefined' || !globeConfig || _self.attr('disabled')){
            return;
        }
        _self.attr('disabled',true);
        var linkText = _self.html();
        if(linkText){
            _self.html($.trim(linkText) + '中').addClass('disabled-btn-b');
        }
        // 3秒内安装按钮重复点击无效
        setTimeout(function(){
            _self.attr('disabled',false);
            if(linkText){
                _self.html(linkText).removeClass('disabled-btn-b');
            }
        },3000);
        if(globeConfig.logined){
            // 登录的时候实用应用推送
            AppPush.init(_self);
        }else{
            // 未登录用户使用一键安装
            AppInstall.init(_self);
        }
    }).popup();

    //为IE6 特别初始化热门应用的安装按钮
    if($.browser.msie && $.browser.version){
        $('.row-list li').hover(function(){
            var item = $(this);
            item.find('.app-install').show();
            item.find('.app-meta').hide();
        },function(){
            var item = $(this);
            item.find('.app-meta').show();
            item.find('.app-install').hide();
        });
    }
});
