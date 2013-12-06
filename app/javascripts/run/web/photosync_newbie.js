$(function() {

$('.photosync-newbie #btn_signup').click(function(e) {
    e.preventDefault();
    try{_gaq.push(['_trackEvent', 'photosync', 'landing', 'signup']);}catch(ex){}
    setTimeout(function(){
        window.location='https://account.wandoujia.com/v1/user/?do=register&callback='+encodeURIComponent(window.location);
    }, 200);
});
$('.photosync-newbie #btn_signin').click(function(e) {
    e.preventDefault();
    try{_gaq.push(['_trackEvent', 'photosync', 'landing', 'login']);}catch(ex){}
    setTimeout(function(){
        window.location='https://account.wandoujia.com/v1/user/?do=login&callback='+encodeURIComponent(window.location);
    }, 200);
});
$('.photosync-newbie #btn_download').click(function(e) {
    try{_gaq.push(['_trackEvent', 'download', 'phoenix2beta', 'photosync']);}catch(ex){}
});
$('.photosync-newbie #btn_weibo').click(function(e) {
    e.preventDefault();
    try{_gaq.push(['_trackEvent', 'photosync', 'landing', 'weibo']);}catch(ex){}
    setTimeout(function(){
        window.location='http://weibo.com/wandoulab';
    }, 200);
});

});