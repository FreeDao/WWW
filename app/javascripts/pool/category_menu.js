/**
 * 
 * @desc www.wandoujia.com 应用类目菜单
 * @author jintian
 */
$(function(){
    var catAppTrigger = $('.nav-apps'),
        catsWp = $('.menu-cat'),
        tracking = 0;
    catAppTrigger.parent().mouseenter(function(){
        catAppTrigger.addClass('nav-actived');
        catsWp.show();
        
        if(typeof _gaq !== 'undefined' && _gaq && !tracking) {
            tracking = 1;
            _gaq.push(['_trackEvent', 'cat_menu', 'cat_menu_view', 'web']);
            var t = setTimeout(function(){
                tracking = 0;
            },1000);
            
        }
    }).mouseleave(function(){
        
        var t = setTimeout(function(){
            catAppTrigger.removeClass('nav-actived');
            catsWp.hide();
        },200);
    });	
	
});