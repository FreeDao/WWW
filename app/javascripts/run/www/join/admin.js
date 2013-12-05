$(function(){

    function loadAndShowJob ( id ) {
        $('#job-content').load('../php/getJobList.php?category='+id);
    }

    //查看一个职位分类下的职位列表
    $('.job-category-item').on('click',function(){
        var id = $(this).attr('data-category-id');
        loadAndShowJob(id);
    });

    var defaultLoadId = $('.job-category-item').eq(0).attr('data-category-id');
    loadAndShowJob(defaultLoadId);

    function loadAndEditJob ( id ) {
        $('#job-content').load('../php/getJob.php?jobId='+id);
    }

    //编辑一项职位信息
    $('.edit-job-btn').live('click',function(){
        var id = $(this).attr('data-job-id');
        loadAndEditJob(id);
    });

    //删除一项职位信息
    var delJobClickFlag = false;
    $('.del-job-btn').live('click',function(){
        setTimeout(function(){
            if(delJobClickFlag){return;}
            alert('双击删除');
        },500);
    });

    $('.del-job-btn').live('dblclick',function(){
        delJobClickFlag = true;
        var id = $(this).attr('data-job-id');
        $(this).parent().parent().remove();
        $.ajax({
            type: 'get',
            url: '../php/delJob.php?id='+id,
            async: false,
            contentType: 'application/json',
            success: function(data) {
                alert('删除成功');
            },
            error: function(e) {
                alert('删除失败');
            }
        });
    });

    //提交编辑的职位信息
    $('#editJob').live('submit',function(){
        alert('保存了，但是不一定成功保存。');
    });

    $('#add-job-info-btn').on('click',function(){
        $('#job-content').empty();
        $('.add-new-job-form').clone().appendTo('#job-content').show();
    });

    $('#add-job-category-btn').on('click',function(){
        $('#job-content').empty();
        $('.manage-job-category').clone().appendTo('#job-content').show();
    });

    //删除一项职位类别信息
    var delJobCategoryClickFlag = false;
    $('.del-job-category-btn').live('click',function(){
        setTimeout(function(){
            if(delJobCategoryClickFlag){return;}
            alert('双击删除');
        },500);
    });

    $('.del-job-category-btn').live('dblclick',function(){
        delJobCategoryClickFlag = true;
        var id = $(this).attr('data-job-category-id');
        $(this).parent().parent().remove();
        $.ajax({
            type: 'get',
            url: '../php/delJobCategory.php?id='+id,
            async: false,
            contentType: 'application/json',
            success: function(data) {
                alert('删除成功');
                window.location.reload();
            },
            error: function(e) {
                alert('删除失败');
            }
        });
    });

    //编辑一项职位信息
    $('.edit-job-category-btn').live('click',function(){
        alert('这个功能还没时间开发');
    });
});

