define(['jquery'],function(){
    var viewmore = $('#more-desc'),
        desc = $('#desc'),
        txt = $('#more-desc .txt'),
        icon = $('#more-desc .toggle-icon'),
        descHeight = desc.height(),
        descMaxHeight = desc[0].scrollHeight;
        
    if(desc.length && descHeight < descMaxHeight){
        viewmore.show().click(function(){
            if(icon.hasClass('icon-extend')){
                desc.animate({
                    height : descMaxHeight
                }, 200);
                icon.removeClass('icon-extend').addClass('icon-retract');
                txt.html('收起');
            }else{
                $('.desc-cover').show();;
                
                desc.animate({
                    height : descHeight
                }, 200);

                txt.html('更多');
                icon.removeClass('icon-retract').addClass('icon-extend');
            }
        });
    }else{
        desc.height('auto');  
        viewmore.remove();
        $('.more-icon').remove();
    }
   
});
