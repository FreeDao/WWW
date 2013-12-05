/**
 * @desc 搜索结果页面逻辑
 * @author jintian 
 */
$(function(){

    if(globeConfig.logined){
            
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
                _self.html($.trim(linkText) + '中').addClass('disabled-btn-m');
            }
            // 3秒内安装按钮重复点击无效
            setTimeout(function(){
                _self.attr('disabled',false);
                if(linkText){
                    _self.html(linkText).removeClass('disabled-btn-m');
                }
            },3000);
            if(globeConfig.logined){
                // 登录的时候实用应用推送
                AppPush.init(_self);
            }
        }).popup();
 
    }
});
