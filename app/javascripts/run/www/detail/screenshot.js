define(['jquery', 'montage', 'photo'],function(){
    
    $(document).ready(function(){
        var screenshots = $('.screenshot img').hide(),
            count = screenshots.length,
            cnt = 0;
            
            screenshots.each(function(i) {
                var img = $(this);
                $('<img/>').load(function() {
                    ++ cnt;
                    if( cnt === count ) {
                        screenshots.show();
                        setTimeout(function(){
                            $('.screenshot .images-wp').montage({
                                fillLastRow  : true,
                                alternateHeight : true,
                                alternateHeightRange : {
                                    min : count > 5 ? 200 : 250,
                                    max : 180
                                }
                            }).height($('.screenshot img').eq(0).height());

                        }, 20);
                    }
                }).attr('src', img.attr('src'));
            });

        $('.photo-trigger').prettyPhoto({
            hook :'data-hook',
            social_tools : '',
            show_title : false,
            allow_resize : true
        });
    });
});

