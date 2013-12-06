define(['jquery'],function(){
    var tags = $('.verified-info .tag'),
        tagDetails =  $('.sec-detail').children(),
        firstTagWidth = tags.eq(0).outerWidth(),
        arrow = $('#split-arrow');

    function getSplitOffset(tag, index){
        tag = $(tag);
        return 20 * index + _.reduce(tags.filter(':lt(' + (index + 1) + ')'), function(memo, t){ 
            return memo + $(t).outerWidth();
        }, 0) - tag.outerWidth() / 2;
    }

    tags.each(function(idx, tag){
        $(tag).on('mouseenter', function(){
            arrow.css('margin-left', getSplitOffset(tag, idx));
            tagDetails.hide().eq(idx).show();
        });
    });
   
});

