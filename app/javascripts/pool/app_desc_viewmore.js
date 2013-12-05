/**
 * 处理应用详情页的描述信息展示逻辑，如果该应用的详细描述超过 5 行（样式上限定高度为 100px ）
 * 则会显示出“展开”按钮，点击显示全部的应用描述，按钮变成“收起”，点击“收起”则回到原始状态
 * 
 * @author jintian
 */
$(function(){
    // 应用描述展示更多处理
    var desc = $('.description'),
        descHeight = desc.height();
    if(desc.length && descHeight < desc[0].scrollHeight){
        desc.after('<div class="desc-view-more"><a href="javascript:;" class="control extend">展开</a></div>');
        var control = $('.desc-view-more .control'); 
        control.click(function(){
            if(control.hasClass('extend')){
                desc.height('auto');
                control.removeClass('extend').html('收起');
            }else{
                desc.height(descHeight);
                control.addClass('extend').html('展开');
            }
        });
    } 
});
