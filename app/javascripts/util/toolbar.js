define(['jquery'], function(jquery){

    var page = $('body').data('page'),
        tag = $('.sort-form').data('tag'),
        currentType = $('.toolbar').data('type');

    /**
     * @info change by zhangyaochun 5-17
     *      filterFn其实就是原来下面的方法体，只是做了小改动
     *      1、去掉原来多余的变量self和if、for句柄的以及param的重置;
     *      2、由于不是下拉框，改变了ads变量取值的source
     */    
     function filterFn(){
        var cate = $('.sort-form').data('cate'),
            ads = $('#filter-ads-hidden').val(),  //目前的策略是取隐藏域的值，比较直观方便查看
            alias = $('.toolbar').data('alias'),
            param = location.search,
            url;

        if((currentType === 'mostCommented' || currentType === 'total' || currentType === 'weekly' || currentType === 'noteworthy')  && alias !== '') {
            currentType += '/' + alias;
        }

        switch(page) {
            case 'search' :
                url = '/search/?key=' + key + '&';
                break;
            case 'top' :
                url = '/top/' + currentType + '?';
                break;
            default :
                url = '/tag/' + tag + '/' + currentType + '?';
        }

        if(cate) {
            url += 'category=' + cate + '&';
        }

        url += ads + '&';

        if($('#privacy').is(':checked')) {
            url += 'privacy=1&';
        } else {
            url += 'privacy=0&';
        }

        if($('#zh').is(':checked')) {
            url += 'zh=1&';
        } else {
            url += 'zh=0&';
        }

        if(page !== 'search') {
            if($('#verified').is(':checked')) {
                url += 'verified=1&';
            } else {
                url += 'verified=0&';
            }
        }

        if(typeof param !== 'undefined' && param.length > 0) {
            var params = (location.href).split('?')[1].split('&');            
              for(var i = 0,len = params.length; i< len; i++){
                //这边变量改为了param_arr
                var param_arr = params[i].split('='),
                    paraKey = param_arr[0],
                    paraVal = param_arr[1];
               if( ! _.contains(['verified','ads','zh', 'privacy', 'key', 'page', 'category'],paraKey)){
                  url += paraKey;
                  if(paraVal){
                        url += '=' + paraVal + '&';
                    } else {
                        url += '&';
                    }
               }
            }
        }

        var subUrl = url.substr(url.length-1,1);
        if(subUrl === '?' || subUrl === '&') {
            url = url.substring(0, url.length-1);
        }

        location.href = url;
     }


    //过滤事件绑定
    //去掉了内置fn，和select的绑定
    $('.sort-form input').on('change', filterFn);


    /**
     * @info 增加对新增的dropdown的设计   
     */
    var $dropDownWrap = $('.select-wrap'),
        $dropDown = $dropDownWrap.find('.options');
 
    //事件处理1：body---只是隐藏打开的浮层操作
    $('body').on('click',function(){
        var curState = $dropDownWrap.attr('data-toggle');
            
        if(curState == 'down'){
            $dropDownWrap.attr('data-toggle','up');
            $dropDown.hide();
        }
        
    });


    /**事件处理2：点击切换显示和隐藏
     *    1、放在父节点，增大点击区域，可以点击文字和右侧的箭头
     *    2、父几点有一个data-toggle来表示当前是否打开下拉 up | down ----方便body click的时候判定，省去无用hide
     *   click事件放在dom ready里面 changed by zhangyaochun 8-28
     */
    $(function(){

        $dropDownWrap.on('click',function(e){
            var curState = $dropDownWrap.attr('data-toggle'),
                changedState = 'down';

            if(curState == 'down'){
               changedState = 'up';     
            } 
            
            $dropDownWrap.attr('data-toggle',changedState);
            $dropDown.toggle();
            e.stopPropagation();
        });

    });


    /**事件处理3：显示的dropdown的li的两个事件处理
     *    1、hover处理：
     *         切换active的class
     *    2、click处理：
     *         改变一下文案和隐藏域的值
     *         公用 filterFn 
     */
    $dropDown.find('li').hover(function(e){
         $dropDown.find('li').removeClass('active');
         $(this).addClass('active');
    }).click(function(){
         //点击操作
         var curText = $(this).text(),
             curValue = $(this).val();
         //置一下显示内容
         $dropDownWrap.find('.filter-ads-type').text(curText);
         //主动改一下隐藏域
         $dropDownWrap.find('#filter-ads-hidden').val('ads='+curValue);

         filterFn();
    });
        

    //排序click事件绑定
    $('.sort-type').click(function() {
        var self = $(this),
            target = self.data('target'),
            param = location.search,
            reload = self.data('reload'),
            url = target + (target.indexOf('?') < 0 ? '?' : '&');

        if(typeof param !== 'undefined' && param.length > 0) {
            var params = (location.href).split('?')[1].split('&');            
              for(var i = 0,len = params.length; i< len; i++){
                var param = params[i].split('='),
                    paraKey = param[0],
                    paraVal = param[1];
               if( ! _.contains(['page', 'superior'],paraKey)){
                  url += paraKey;
                  if(paraVal){
                        url += '=' + paraVal + '&';
                    } else {
                        url += '&';
                    }
               }
            };
        }

        var subUrl = url.substr(url.length-1,1);
        if(subUrl === '?' || subUrl === '&') {
            url = url.substring(0, url.length-1);
        }

        if(!self.hasClass('current') || reload == 1) {
            location.href = url;
        }

    });


});