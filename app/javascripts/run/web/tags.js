/**
 * @desc www.wandoujia.com tags 静态页
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
    
    // GA tracking
    if(typeof _gaq != 'undefined' && _gaq){
        $('a[track]').live('click', function(e) {
            var trackCode = $(this).attr('track'),
                codes = trackCode.split('/');
            
            if(codes.length > 2){
                trackEvent({
                    category : codes[0],
                    action : codes[1],
                    label : codes[2]
                });
            }
        });
    }
    
    $('.search-box').submit(function(event){
       event.preventDefault();
       if($.trim($('.search-ipt').val()) === ''){
           return false;
       } 
       this.submit();
    });
    
    var win = $(window),
        backTop = $('.back-top'),
        toggleTopLink = function(){
            if(win.scrollTop() > 300 ){
                backTop.fadeIn(200);
            }else{
                backTop.fadeOut(200);
            }
        };
    toggleTopLink();
    win.on('scroll',toggleTopLink);

});
