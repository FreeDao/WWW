
 (function($) {
    var appData = new Array();
    appData[0] = new Array();
    appData[1] = new Array();
    appData[2] = new Array();
    //first tabcon
    appData[0][0] = {
            title : "年度最佳应用及游戏",
            apis : ["com.ideashower.readitlater.pro", "com.madfingergames.deadtrigger",]
    };
    appData[0][1] = {
            title : "年度优秀应用及游戏",
            apis : ["com.path", "com.instagram.android",  "com.rovio.angrybirdsspace.premium", "flipboard.cn",  "com.spryfox.tripletown", "com.android.chrome"]
    };
    appData[0][2] = {
        title : "年度应用及游戏提名",
        apis : ["com.citc.weather", "com.joelapenna.foursquared", "vz.com", "jp.naver.SJLINEPANG", "com.guoku", "com.niksoftware.snapseed", "tc.tangcha.book", "com.halfbrick.jetpackjoyride", "com.kiloo.subwaysurf", "com.google.android.googlequicksearchbox", "jp.naver.linetools", "com.douban.book.reader", "com.rovio.amazingalex.free", "com.omgpop.dstpaid", "com.tawkon", "com.chlova.kanqiula", "com.breadtrip", "com.threebanana.notes",  "com.facebook.katana", "com.imangi.templerun", "air.net.daum.pix", "com.miniclip.plagueinc"]
    };
    //second tabcon
    appData[1][0] = {
        title : "基础工具类特别推荐  ",
        apis : ["com.android.chrome"]
    };
    appData[1][1] = {
        title : "基础工具类下载量 Top 5",
        apis : ["com.qihoo360.mobilesafe", "com.miui.mihome2", "com.gau.go.launcherex", "com.UCMobile", "com.ijinshan.kbatterydoctor"]
    };
    appData[1][2] = {
        title : "生活必备类特别推荐  ",
        apis : ["com.iflytek.cmcc"]
    };
    appData[1][3] = {
        title : "生活必备类下载量 Top 5 ",
        apis : ["com.moji.mjweather", "com.taobao.taobao", "com.baidu.BaiduMap", "com.mymoney", "com.dianping.v1"]
    };
    appData[1][4] = {
        title : "影音播放类特别推荐  ",
        apis : []
    };
    appData[1][5] = {
        title : "影音播放类下载量 Top 5     ",
        apis : ["com.sds.android.ttpod", "com.qvod.player", "com.kugou.android", "com.melodis.midomiMusicIdentifier.freemium", "com.youku.phone"]
    };
    appData[1][6] = {
        title : "社交通讯类特别推荐  ",
        apis : ["com.path"]
    };
    appData[1][7] = {
        title : "社交通讯类下载量 Top 5 ",
        apis : ["com.tencent.mm", "com.tencent.mobileqq", "com.sina.weibo", "com.qzone", "com.immomo.momo"]
    };
    appData[1][8] = {
        title : "资讯阅读类特别推荐      ",
        apis : ["com.ideashower.readitlater.pro"]
    };
    appData[1][9] = {
        title : "资讯阅读类下载量 Top 5     ",
        apis : ["com.chaozh.iReaderFree", "com.qq.reader", "one.hh.oneclient", "com.sohu.newsclient", "com.netease.newsreader.activity"]
    };
    appData[1][10] = {
        title : "参考效率类特别推荐  ",
        apis : ["com.dropbox.android"]
    };
    appData[1][11] = {
        title : "参考效率类下载量 Top 5 ",
        apis : [ "com.sohu.inputmethod.sogou", "com.baidu.input", "com.dropbox.android","cn.wps.livespace", "com.youdao.dict"]
    };
    appData[1][12] = {
        title : "摄影摄像类特别推荐  ",
        apis : ["com.niksoftware.snapseed"]
    };
    appData[1][13] = {
        title : "摄影摄像类下载量 Top 5 ",
        apis : ["vStudio.Android.Camera360", "com.mt.mtxx.mtxx", "my.PCamera", "obg1.PhotafPro", "com.smile.gifmaker"]
    };
    //third tabcon
    appData[2][0] = {
        title : "休闲益智类特别推荐  ",
        apis : ["com.halfbrick.jetpackjoyride"]
    };
    appData[2][1] = {
        title : "休闲益智类下载量 Top 5 ",
        apis : ["org.cocos2dx.FishGame", "com.rovio.angrybirds", "com.tencent.qqgame", "com.outfit7.talkingtom2free", "com.fridgecat.android.atilt"]
    };
    appData[2][2] = {
        title : "动作竞技类特别推荐  ",
        apis : ["com.bfs.ninjump"]
    };
    appData[2][3] = {
        title : "动作竞技类下载量 Top 5 ",
        apis : ["com.imangi.templerun", "com.bfs.ninjump", "com.com2us.thirdblade.normal.freefull.google.global.android.common", "com.com2us.inotia3.normal.freefull.google.global.android.common", "com.kiloo.subwaysurf"]
    };

    var appItem = $(".sticky-list");
    var appBlock;
    var counter, index, ele;
    var ulContent = "";
    var apiAlbum = new Array();
    for(var counter = 0; counter < appData.length; counter++) {//get all the apis and push them into an array
        for(var index = 0; index < appData[counter].length; index++) {
            for(var ele = 0; ele < appData[counter][index].apis.length; ele++) {
                var item = appData[counter][index].apis;
                apiAlbum.push(item[ele]);
            }
        }
    }

    window.dataFunc = function(data) {//get all the app apis
        //console.log(data);
        var apiPos = 0, appInfo;
        var appJsonAddress, appApi, appLink, appimg, ele, apptitle, appsubtitle, appdw, liContent, apiLength, dataPiece;
        var appSize, appLike, appInstall;
        for(var i = 0; i < 3; i++) {//every tab content
            ulContent = "<ul>";
            for(var j = 0; j < appData[i].length; j++) {
                ulContent += "<li>";
                var headerValue = appData[i][j].title;
                ulContent += "<strong>" + headerValue + "</strong>";
                //sub header
                if(appData[i][j].apis) {//if sub list exist
                    ulContent += "<ul>";
                    //inner ul
                    if(appData[i][j].apis.length==0){
                        ulContent += "<ul><li class='emptyapp'>从缺</li></ul>";
                    } else{
                        for(var m = 0; m < appData[i][j].apis.length; m++) {
                            liContent = "";
                            appInfo = apiAlbum[apiPos];
                            dataPiece = data[apiPos];
                            //get the app info
                            appimg = dataPiece.icons.px48;
                            //the image

                            apptitle = dataPiece.title;
                            //the title
                            //appsubtitle = dataPiece.tagline ? dataPiece.tagline : "";//the subtitle
                            appdw = dataPiece.apks[0].downloadUrl.url;
                            //the download addr
                            appSize = dataPiece.apksOrigin[0].size;
                            appLike = "" + dataPiece.likesRate + "人喜欢";
                            appInstall = "" + dataPiece.installedCountStr + "次安装";
                            appLink = "http://m.wandoujia.com/apps/" + dataPiece.apks[0].packageName;
                            //the app info page address
                            liContent += "<li><a class='appimg img_box' href='" + appLink + "'>";
                            liContent += "<img src='http://img.wdjimg.com/image/rewind/bg.gif' imgsrc = '" + appimg + "'  class='deal-img lazyload' alt='" + apptitle + "'></a>";
                            liContent += "<div class='appname'><a href='" + appLink + "' data-pn='" + dataPiece.apks[0].packageName + "'>" + apptitle + "</a><p><span>" + appSize + "</span><span>" + appInstall + "</span></p></div>";
                            liContent += "<a class='dwbt' href='" + appdw + "'>下载</a></li>";
                            ulContent += liContent;
                            apiPos++;
                        }
                    }
                    
                    ulContent += "</ul>";
                    //inner ul ends
                } 
                ulContent += "</li>";
            }
            ulContent += "</ul>";
            appItem.eq(i).append(ulContent);
        }
    };
    //get all the app apis ends
    //data deal function
    var appJsonAddress = "http://apps.wandoujia.com/api/v1/apps?pns=" + apiAlbum.join() + "&opt_fields=title,icons.*,apks.*,apksOrigin.*,likesRate,installedCountStr&from=mobile&callback=dataFunc";
    $.getScript(appJsonAddress);

    //set the banner width and height
    var imgWidth = "" + document.body.scrollWidth;
    var imgHeight = parseInt(imgWidth * 247 / 720);
    $(".headerimg").attr({
        width : imgWidth,
        height : imgHeight
    });
    //banner image setting ends
})(jQuery); 
(function($) {
    //set the height of app list
    var headerHeight = $("header").length>0?$("header").outerHeight():0;
    var tabboxHeight = $(".tabbox").length>0?$(".tabbox").outerHeight():0;
    var dwnbtHeight = $(".beam_dwbt").length>0?$(".beam_dwbt").outerHeight():0;
    var allHeight = document.body.scrollHeight;
    var tabconHeight = allHeight-headerHeight-tabboxHeight-dwnbtHeight;
    // console.log("headerHeight:"+headerHeight+" tabboxHeight:"+tabboxHeight+" dwnbtHeight:"+dwnbtHeight);
    // $(".sticky-list").css("height",tabconHeight);
    //set the height of app list ends
    
    
    //lazyloader
    var scrollHeightValue = $(window).height();
    var lazyDistance = 200;
    var lazyloader = function(imglist) {
        
        var imgItems = imglist;
        // console.log(0);
        imgItems.each(function(index) {
            imgEle = imglist.eq(index);
            imgSrc = imgEle.attr("imgsrc");
            imgDocTop = imgEle.offset().top;
            imgScrollTop =document.body.scrollTop;
            if((imgDocTop - scrollHeightValue-imgScrollTop) < lazyDistance) {
                imgEle.addClass("loaded").attr("src", imgSrc);
            } });
        //array deal ends
    };
    var lazyloaderFunc = function() {
        if($(".tabcon_container .on ul").length > 0) {
            lazyloader($(".tabcon_container .on img.lazyload"));
            var imgArray, imgEle, imgSrc, imgScrollTop;
            document.body.scroll(function() {
                imgArray = $(this).find("img.lazyload").not(".loaded");
                lazyloader(imgArray);
            });
            clearInterval(lazyCheck);
        }
    };
    var lazyCheck = setInterval(lazyloaderFunc, 100);
    //lazyloader ends

    var conSwitch = $(".tabcon_container").find(".sticky-list");
    //tab switcher
    if($(".tabbox") && $(".tabcon_container")) {
        var tabbox = $(".tabbox");
        var tabcon = $(".tabcon_container");
        tabbox.find("li").click(function() {
            var ele = $(this);
            var tabindex = ele.index();
            var tabName = ele.data('tab');
            _gaq.push(['_trackEvent', '2012 Rewind Tab', 'click', tabName]);

            ele.addClass("on").siblings().removeClass("on");
            tabcon.find(".sticky-list").eq(tabindex).addClass("on").siblings().removeClass("on");
            lazyloader($(".tabcon_container .on img.lazyload"));


        });
    }
    //tab switcher ends
    

    $('.beam_dwbt a').click(function() {
        _gaq.push(['_trackEvent', '2012 Rewind M', 'download', 'P3']);
    });

    $('body').delegate('.appname a', 'click', function(e) {
        var name = $(this).text();
        var pn = $(this).data('pn');
        _gaq.push(['_trackEvent', '2012 Rewind M', 'click', name]);

        if(typeof window.campaignPlugin !== 'undefined') {
            e.preventDefault();
            window.campaignPlugin.openAppDetail(pn);
        }
    }).delegate('.dwbt', 'click', function(e){
        var name = $(this).parent().find('.appname a').text();
        var pn = $(this).parent().find('.appname a').data('pn');
        var url = $(this).attr('href');
        var icon = $(this).parent().find('img').attr('src');
        var size = $($(this).parent().find('span')[0]).text();
        _gaq.push(['_trackEvent', '2012 Rewind M', 'download', name]);

        if(typeof window.campaignPlugin !== 'undefined') {
            e.preventDefault();
            window.campaignPlugin.install(pn, url, name, icon, 1);
        }
    });

})(jQuery);
