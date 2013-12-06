define(['jquery'],function(){
    var maxHeight = $('.app-rank .app').eq(0).height(),
        minHeight = $('.app-rank .mini').eq(0).height(),
        processing = 0;

    $('.app-rank .app').on('mouseenter', function(){
        if(processing){
            return;
        }
        var self = $(this),
            container = self.closest('.app-rank');

        var current = container.stop(true,true).find('.app:not(.mini)');

        if(current[0] == self[0]){
            return;
        }
        processing = 1;
        current.animate({
            height : minHeight
        }, 200, function(){
            processing = 0;
        });

        self.animate({
            height : maxHeight
        }, 200, function(){
            processing = 0;
        });
        current.addClass('mini');
        self.removeClass('mini');

    });
});