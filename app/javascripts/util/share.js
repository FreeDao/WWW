function socialShare(site, sharelink, sharetitle, sharepic) {

    if(site === "weibo") {
        if(parent.wonder !== undefined) {
            window.externalCall('common', '_open_internet_link_', 'http://v.t.sina.com.cn/share/share.php?url='+ sharelink + '&title=' + sharetitle + '&pic=' + sharepic);
        }
        else {
            window.open('http://v.t.sina.com.cn/share/share.php?url='+ sharelink + '&title=' + sharetitle + '&pic=' + sharepic, 'newwindow', 'toolbar=no,status=no,menubar=no,location=no,top=100,left=300,height=633,width=634,scrollbars=yes');
        }
    }
    else if(site === "renren") {
        if(parent.wonder !== undefined) {
            window.externalCall('common', '_open_internet_link_', 'http://www.connect.renren.com/share/sharer?url='+ sharelink + '&title=' + sharetitle);
        }
        else {
            window.open('http://www.connect.renren.com/share/sharer?url='+ sharelink + '&title=' + sharetitle, 'newwindow', 'toolbar=no,status=no,menubar=no,location=no,top=100,left=300,height=633,width=634,scrollbars=no');
        }
    }
    else {
        return false;
    }

}