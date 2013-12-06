$('.weibo-share').click(function() {
    sharelink = encodeURIComponent($(this).data('link'));
    sharetitle = encodeURIComponent($(this).data('title'));
    sharepic = encodeURIComponent($(this).data('pic'));
    socialShare("weibo", sharelink, sharetitle, sharepic);
});

$('.renren-share').click(function() {
    sharelink = encodeURIComponent($(this).data('link'));
    sharetitle = encodeURIComponent($(this).data('title'));
    sharepic = "";
    socialShare("renren", sharelink, sharetitle, sharepic);

});

