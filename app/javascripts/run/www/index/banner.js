define(['jquery', 'carousel'],function(){
    $('.home-banner').carousel({
        itemContainer : $('.banner-images'),
        btnNav : 1,
        repeat : 1,
        autoScroll : 1,
        useNav : 1,
        customChange : opacityChange,
        customInit : opacityInit
    }).on('mouseenter', function(){
        $(this).addClass('active');
    }).on('mouseleave', function(){
        $(this).removeClass('active');
    });
});