/**
 * 导航中的游戏，应用类目页面业务
 * 
 * @author jintian
 */

$(function(){
    
    /**
     * 为bubble提供内容，this 指向触发bubble 显示动作的元素
     * 提供给初始化bubble的时候使用
     */
    var buildBubbleContent = function(target){
        // 一般把app的信息绑定到 app的icon 链接上
        var item = target ? target : this.parent(),
            // app 名字
            name = item.data('name'),
            // app 版本号
            version = item.attr('data-version'),
            // app 下载次数
            down = item.data('size'),
            // app 大小
            size = item.data('down'),
            // app的描述
            desc = item.data('desc');

            // 因为bubble 是自适应宽度，由内容来决定宽度，所以名字不能太长，需要截断
            name = name && name.length > 12 ? name.substr(0, 12) : name;
            version = version && version.length > 10 ? version.substr(0, 10) : version;
        
        return  ( name ? ( '<h5 class="title">' + name + '<small>' + version + '</small>' + '</h5>') : '' ) + 
                ( down ? ( '<span class="meta">' + down + '</span>') : '' ) + 
                ( size ? ( '<span class="meta">' + size + '次安装</span>') : '') + 
                ( (item.attr('data-adstype') == 2 || item.attr('data-adstype') == 3) ? ('<br /><span class="check-ads-item check-fail">包含通知栏广告</span>'):'') +
                ( desc ? ( '<div class="desc">' + desc + '</div>' ) : '' );
        
    };
    
    // 初始化 app 的bubble，需要提供bubble的内容，和bubble相对位置计算的元素
    $('.block-list .app-item img,.block-list .app-item .name').bubble({
        setContent : buildBubbleContent,
        relativedEl : function(){
            // parent 一般就是一个li元素，因为li位置相对固定，所以bubble不会闪动
            return this.parent().find('img');
        },
        // // 垂直位置的偏移量，块级app可以小一点
        // verticalOffset : 50,
        horizontalOffset : 10
    });

    $('.picked-box .app-item img,.picked-list .app-item .name').bubble({
        setContent : buildBubbleContent,
        relativedEl : function(){
            return this.parent().find('img');
        },
        horizontalOffset : 10
    });

    $('.install-list .app-item img,.install-list .app-item .name').bubble({
        setContent : buildBubbleContent,
        relativedEl : function(){
            return this.parent().find('img');
        },
        horizontalOffset : 10
    });

    $('.row-list .app-item .app-img').bubble({
        setContent : function(){
            return buildBubbleContent(this);
        },
        verticalOffset : 8,
        wallEl : $('.wrapper')
    });
    
});
