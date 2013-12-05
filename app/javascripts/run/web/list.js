/**
 * @desc Web 端共用(search/category/top)
 * @author jintian 
 */
$(function(){

    $('.search-ipt').suggestion();

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

    // label展示
    $('.search-label').hover(function(){
        $(this).next().show();
    },function(){
        $(this).next().hide();
    });

    $('.search-btn').click(function(){
        $('.search-box').submit();
    });

 
});
