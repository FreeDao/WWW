/**
 * @desc www.wandoujia.com首页
 * @author jintian
 */
$(function(){
    // 搜索提示
    $('.search-ipt').suggestion();
    
    // GA tracking
    var trackEvent = function(opt) {
        if(typeof _gaq != 'undefined' && _gaq){
            var _act, _cat, _lbl, _val;
            if (opt) {
                _cat = opt.category || "";
                _act = opt.action || "";
                _lbl = opt.label || "";
                _val = opt.value || 0;
                return _gaq.push(['_trackEvent', _cat, _act, _lbl, _val]);
            }
        }
    };
    
    if(typeof _gaq != 'undefined' && _gaq){
              
        $('a[track]').live('click', function(e) {
            var trackCode = $(this).attr('track'),
                codes = trackCode.split('/');
            
            if(codes.length > 2){
                trackEvent({
                    category : codes[0],
                    action : codes[1],
                    label : codes[2]
                });
            }
        });
    }
    
    $('.search-box').submit(function(event){
       event.preventDefault();
       if($.trim($('.search-ipt').val()) === ''){
           return false;
       } 
       this.submit();
    });
    
    $('.search-btn').click(function(){
        $('.search-box').submit();
    });

    
    if(!($.browser.msie && $.browser.version < 8)){
        $.getScript('https://apis.google.com/js/plusone.js');
    }
    
    
    $('#downloadbutton').click(function(){
        setTimeout(function () {
            var a = $('<a href="/windows/download?type=release" target="_blank"></a>').get(0),
                e = document.createEvent('MouseEvents');
            e.initEvent( 'click', true, true );
            a.dispatchEvent(e);
        }, 500);
    });
});

/**
 * @desc For http://www.wandoujia.com/api
 * @author ziming
 */

$(function() {

    if (!$('#api').length) return;

    var form = document.getElementById('code_form');
    var code = $('#code_panel');

    if (!code.text()) {
        code.parent().hide();
    }

    $('#btn_generate_code').click(function(e) {
        var radios = document.getElementsByName('button-image');
        var image;
        for (var i = 0, l = radios.length; i < l; i ++) {
            if (radios[i].checked) {
                image = radios[i].value;
                break;
            }
        }
        var name = document.getElementsByName('appname')[0].value || '在此放入您应用的中文名称';
        var url = document.getElementsByName('appurl')[0].value || '在此放入您 APK 的链接';
        code.text(
            '<a href="' + url + '" name="' + name + '" onclick="return wdapi_apkdl_m(this, \'source\');" title="通过豌豆荚下载">\n' +
            '    <img alt="豌豆荚一键安装" src="' + image + '"/>\n' +
            '</a>'
        );
        code.parent().show();
        e.preventDefault();
    });

});


/**
 * @desc For http://www.wandoujia.com/unsubscribe
 * @author jintian
 */

$(function() {

    if (!$('.unsub-btn').length) return;
    $('.unsub-btn').click(function(){
        $.post('/edm/unsubscribe');
        setTimeout(function(){
            $('.unsubscribe .txt').html('退订成功。');
        },400);
    });
   

});