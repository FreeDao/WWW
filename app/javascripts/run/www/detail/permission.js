define(['jquery'],function(){
    var viewperm = $('#view-perms'),
        permsList = $('#perms-list'),
        originalTxt = viewperm.html(),
        toggleTxt = '- 收起权限要求';

    viewperm.on('click', function(){
        if(viewperm.html() == originalTxt){
            permsList.show();
            viewperm.html(toggleTxt).addClass('extended');
        }else{
            permsList.hide();
            viewperm.html(originalTxt).removeClass('extended');
        }
    });
});