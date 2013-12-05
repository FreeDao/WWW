var WIDTH = '564',
    HEIGHT = '421',
    html5VideoUrl = 'http://v.wdjcdn.com/join.mp4',
    flashVideoUrl = 'http://player.youku.com/player.php/sid/XNDYwNzkwNDE2/v.swf',
    html5Video = '<div class="video-player"><video controls="controls" width="' + WIDTH + '" height="' + HEIGHT + '" poster="http://img.wdjimg.com/image/logo/join-poster.png?v=123"><source src="' + html5VideoUrl + '" type="video/mp4" /></video></div>',
    flashVideo = '<embed src="' + flashVideoUrl + '" quality="high" width="' + WIDTH + '" height="' + HEIGHT + '" align="middle" allowscriptaccess="sameDomain" allowfullscreen="true" type="application/x-shockwave-flash">',
    videoWrapper = $('.video-wrapper');

if(Modernizr.video){
    if (navigator.userAgent.indexOf('Firefox') >= 0 || navigator.userAgent.indexOf('Opera') >= 0){
        videoWrapper.prepend(flashVideo);
    }else{
        videoWrapper.prepend(html5Video);
    }
}else{
    videoWrapper.prepend(flashVideo);
}