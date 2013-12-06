/**
 *@name zhangyaochun
 *@info 专题页面新的filter
 *      左侧专题类型 + 右侧排序(条件和升降序)类型
 */
define(['jquery'], function(jquery){

    //缓冲方式优化内层selector
    var $specialbar = $('.specialbar');

    /**
     *@name filterSpecial
     *@info 优化几点：
     *      1、默认的取值方式，提高selector效率：
     *         type存在父元素sort-form上,而不是li.current再find a的取
     *         isAscend也存在父元素filter上
     *         sortType也存在父元素filter上,而不是.sort-type.current的取
     *      2、优化参数数据格式{Object}方式，取缔arguments区分
     *      3、调整isAscend,因为Boolean, false || "true"
     */
    function filterSpecial(opts){

        var type = opts.type || $specialbar.find('.sort-form').attr('data-type'),
            isAscend = opts.isAscend !== undefined ? opts.isAscend : $specialbar.find('.filter').attr('data-isascend'),
            sortType = opts.sortType || $specialbar.find('.filter').attr('data-sorttype'),
            postData = '';

        postData += 'sortType=' + sortType;
        
        //规则：type不为全部的时候才拼接上，否则丢弃key
        if(type != 'ALL'){
            postData += '&type=' + type;
        }

        //规则：sortType不为默认的时候才拼接上，否则丢弃key
        if(sortType != 'DEFAULT'){
            postData += '&isAscend=' + isAscend;
        }

        location.href = '/special?' + postData;

    }

    /**
     *@info 给左侧的专题名称绑定click事件
     *      左侧的注意几点：
     *      1、不能点击自己-会判定
     *      2、点击交互只改变参数中的type
     */
    $specialbar.find('.sort-tags').click(function(){

        var that = this,
            isActive = $(that).closest('li').hasClass('current'),
            type = $(that).attr('data-type');

        if(isActive){
            return false;
        }

        filterSpecial({
            type:type
        });
    
    });
   
    /**
     *@info 给右侧的排序绑上click事件
     *      右侧的注意几点：
     *      1、点击自己可以，切换升降序
     *      2、点击交互改变参数中isAscend 和 sortType
     *      3、参数isAscend变化规则：
     *         点击自己取反
     *@update 6-15 
     *      4、初始化进入页面的时候，第一次点击都是降序，后面的点击规则如3       
     */
    $specialbar.find('.sort-type').click(function(){
      
        var that = this,
            isAscend = !$(that).hasClass('arrow-up'),
            sortType = $(that).attr('data-type');

        if($specialbar.find('.filter').data('firstload')){
            isAscend = false;
        }    

        filterSpecial({
            sortType:sortType,
            isAscend:isAscend
        });

    });

});