/**
 * @desc 应用描述首页
 * @author jintian
 */

$(function(){
    
    // 搜索提示
    $('.search-ipt').suggestion();
    
    var trackEvent = function(opt) {
        if(typeof _gaq != 'undefined' && _gaq){
            var _act, _cat, _lbl, _val;
            if (opt) {
                _cat = opt.category || "";
                _act = opt.action || "";
                _lbl = opt.label || "";
                _val = opt.value || 0;
                return _gaq.push(['_trackEvent', _cat, _act, _lbl, _val]);
            }
        }
    };
    //通过连接的track属性统计点击次数
    if(typeof _gaq != 'undefined' && _gaq){
        $('a[track]').live('click', function(e) {
            var trackCode = $(this).attr('track'),
                codes = trackCode.split('/');
            //_gaq.push(['_trackPageview',trackCode ]);
            
            if(codes.length > 2){
                trackEvent({
                    category : codes[0],
                    action : codes[1],
                    label : codes[2]
                });
            }
        });
    }
    
    //搜索框
    $('.search-box').submit(function(event){
       event.preventDefault();
       if($.trim($('.search-ipt').val()) === ''){
           return false;
       } 
       this.submit();
    });
    $('.search-btn').click(function(){
        $('.search-box').submit();
    });

});