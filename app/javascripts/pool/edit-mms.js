
    // var upload = require('upload');
    // $('#upload-file').upload({
    //     // forceIframe : 1
    // });


    $('input[disabled]').each(function() {
        var lockedTpl = '<span class="locked"></span>';
        $(this).css('background', '#eee');
        $(this).parent().append(lockedTpl);
    });

    $('.locked').hover(function(e) {
        var r_left = $(this).position().left + 77,
            a_top = $(this).offset().top + 30;
        e.stopPropagation;
        $('.locked-tip').css({'top': a_top + 'px', 'left': r_left + 'px'}).show("fast");
    }, function() {
        $('.locked-tip').hide('slow');
    });

    // 展开/收缩下拉列表
    $('input.usingnow').focus(function() {
            $(document).on("click", clickListener);
    });
    $('li.usingnow, .select-arrow').click(function() {
            $(document).on("click", clickListener);
    });

    function clickListener(e) {
        var item = $(e.target);

        if(item.is('.select-arrow')) {
            item = item.parent();
        }

        if (item.is('li.usingnow')) {
            $('.options').hide();
            item.next('.options').show();
        }
        else if ((item.hasClass('usingnow')) && (item.attr('disabled') !== "disabled")) {
            $('.options').hide();
            item.parent('li').next('.options').show();
        }
        else if (item.parent().parent().is('.options')) {
            var userChoise = $.trim(item.contents().filter(function() { return this.nodeType == 3; }).text());
            if (item.parents('.options').prev('li').hasClass('usingnow')) {
                var select_arrow = '<span class="select-arrow"></span>',
                    input_id = item.parents('.options').prev('.usingnow').find('input').attr('id'),
                    input_name = item.parents('.options').prev('.usingnow').find('input').attr('name'),
                    _input = '<input type="hidden" autocomplete="off" name="' + input_name + '" id="' + input_id + '" value="' + userChoise + '" />';
                item.parents('.options').prev('.usingnow').html(userChoise + select_arrow + _input);
            }
            else {
                item.parents('.options').prev('li').children('.usingnow').val(userChoise);
            }

            $('.options').hide();
            if (item.hasClass('website')) {
                $('.open-link').attr('href', userChoise);
            }
            $(document).off("click", clickListener);
        }
        else {
            $('.options').hide();
            $(document).off("click", clickListener);
        }

    }



    //点击下拉选项之后的操作
    $('.options ul li').click(function() {
        var userChoise = $.trim($(this).contents().filter(function(){ return this.nodeType == 3; }).text());
        if ($(this).hasClass('current-val')) {
            $(this).parents('.options').prev('li').children('.usingnow-form').val(null);
        }
        else {
            $(this).parents('.options').prev('li').children('.usingnow').val(userChoise);
            $(this).parents('.options').prev('li').children('.usingnow-form').val(userChoise);
        }
        $('.options').hide();
        if($(this).hasClass('website')) {
            $('.open-link').attr('href', userChoise);
        }

    });


    //单选按钮的操作
    $('.radio').click(function() {
        if($(this).hasClass('radio-app')) {
            $('.radio-app, .radio-game').removeClass('chosen');
            $(this).addClass('chosen');
            $('.cat-app, .cat-game').addClass('disabled');
            $('.cat-app').removeClass('disabled');
        }
        else if($(this).hasClass('radio-game')) {
            $('.radio-app, .radio-game').removeClass('chosen');
            $(this).addClass('chosen');
            $('.cat-app, .cat-game').addClass('disabled');
            $('.cat-game').removeClass('disabled');
        }
        else {
            var detail = $(this).parents('.detail'),
                 listItem = $(this).parents('.desc-title'),
                 idx = detail.children('.desc-title').index(listItem),
                 form_id = detail.find('input').attr('id') || detail.find('textarea').attr('id');

            detail.find('.radio').removeClass('chosen');
            $(this).addClass('chosen');

            if($(this).data('value')) {
                var icon_key = $(this).data('value');
            }


            if ($(detail.children('.app-desc-content'))[idx]) {
                detail.find('textarea').removeAttr('id');
                detail.find('input').attr('id', form_id);
                var content = $($(detail.children('.app-desc-content'))[idx]).html(),
                    tmpId = $($(detail.children('.app-desc-content'))[idx]).data('id');
                detail.find('input').val(content).data('id', tmpId);
            }
            else if ($(detail.children('.image-content'))[idx]) {
                $('#icon').val(icon_key);
            }
            else {
                detail.find('input').removeAttr('id').removeAttr('name');
                detail.find('textarea').attr({'id': form_id, 'name': form_id, 'data-id': 0});
            }
        }
    });


    // 文本框获取焦点后的操作
    $('.my-desc').focus(function() {
        var item = $(this),
            detail = item.parents('.detail'),
            idx = item.parent().index('li.clearfix'),
            id = detail.find('input').attr('id') || item.attr('id');
        detail.find('.radio').removeClass('chosen');
        $($('li.clearfix')[idx-1]).find('.radio').addClass('chosen');
        detail.find('input').removeAttr('id').removeAttr('name');
        item.attr({'id': id, 'name': id, 'data-id': 0});
    });


    //分类
    var categories = $.trim($('#category0').val()) + $.trim($('#category1').val());

    // 截图部分拖拽排序的操作
    var scrNum = $('#sortable li').size(),
        scrKeys = "";
    $('.screen-checkbox').each(function() {
        if($(this).is(':checked')) {
            scrKeys += $(this).val();
        }
    });

    $( "#sortable" ).sortable({
        stop: function() {
            for (i=0; i<scrNum; i++) {
                $($('#sortable li')[i]).find('input').attr({'name': 'screenshots[' + i +']', 'id': 'screenshots' + i});
                $($('#sortable li')[i]).find('label').attr('for', 'screenshots' + i);
            }
        }
    });
    $( "#sortable").disableSelection();


    // 提交表单的操作
    $('.btn-save').click(function() {

        $('.editor-form').css('opacity', '0.3');
        $('.submit-msg').text('请稍候…').slideDown();

        var check = 1;

        //如果用户修改 title/tagline/developerName/developerWebsite/tag 后的操作
        $('#title, #tagline, #developerName, #developerWebsite, #tag').each(function() {
                //current value
            var cv = $(this).parents('.app-content').find('.current-val'),
                text = cv.text(),
                //user input value
                uv = $(this).parent().children('input:first-child').val();
            if (uv != "" && text.length != 0 && uv != text.substring(0, text.length - 4)) {
                $(this).val(uv);
            }

        });

        //判断截图选中状态、顺序是否变化
        var tmpKeys = "";
        $('.screen-checkbox').each(function() {
            if($(this).is(':checked')) {
                tmpKeys += $(this).val();
            }
        });
        if(tmpKeys == scrKeys) {
            $('.screen-checkbox').removeClass('screen-checkbox');
        }



        if($('#tagline').val().length > 10) {
            $('.submit-msg').html('').text('副标题字数不能超过 10 个字');
            $('.editor-form').css('opacity', '1');
            check = 0;
        }

        if($('#developerWebsite').val().length > 0) {
            var website = $('#developerWebsite').val(),
                pattern = "^((https|http)?://)"
                    + "(([0-9]{1,3}.){3}[0-9]{1,3}"
                    + "|"
                    + "([0-9a-za-z_!~*'()-]+.)*"
                    + "([0-9a-za-z][0-9a-za-z-]{0,61})?[0-9a-za-z]."
                    + "[a-za-z]{2,6})"
                    + "(:[0-9]{1,4})?"
                    + "((/?)|"
                    + "(/[0-9a-za-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
            checkUrl = new RegExp(pattern, "gi");
            if(checkUrl.test(website)) {
                check = 1;
            }
            else {
                $('.submit-msg').html('').text('官方网址格式不正确');
                $('.editor-form').css('opacity', '1');
                check = 0;
            }
        }

        if(check) {
            if ($('.description .chosen').hasClass('current-val') || $('#description').val() == "") {
                $('#description').val(null).data('id', -1);
            }
            if ($('.changelogs .chosen').hasClass('current-val') || $('#changelog').val() == "") {
                $('#changelog').val(null).data('id', -1);
            }
            if ($('.icon .chosen').hasClass('current-val')) {
                $('#icon').val(null);
            }

            submitForm();
        }
   });


    function submitForm() {

        var pn = $('#packageName').val(),
            title = $('#title').val(),
            versionCode = $('#versionCode').val(),
            tagline = $('#tagline').val(),
            developerName = $('#developerName').val(),
            developerWebsite = $('#developerWebsite').val(),
            descriptionId = $('#description').data('id'),
            description = $('#description').val(),
            changelogId = $('#changelog').data('id'),
            changelog = $('#changelog').val(),
            icon = $('#icon').val(),
            tag = $('#tag').val();

        if(descriptionId > 0) {
            description = null;
        }
        if(changelogId > 0) {
            changelog = null;
        }

        var data = {
            "packageName": pn,
            "title": title,
            "versionCode": versionCode,
            "tagline": tagline,
            "developerName": developerName,
            "developerWebsite": developerWebsite,
            "descriptionId": descriptionId,
            "description": description,
            "changelogId": changelogId,
            "changelog": changelog,
            "icon": icon,
            "tag": tag
        };

        if(categories != $('#category0').val() + $('#category1').val()) {
            var arr = [];
            var tmp = "";
            for (var i = 0; i < 2; i++) {
                tmp = $.trim($('#category'+i).val());
                if (tmp && tmp != "无") {
                    arr.push(tmp);
                }
            }
            for (var i = 0, j = arr.length; i < j; i++) {
                data["categories["+i+"]"] = arr[i];
            }
        }

        for(var i=0; i<scrNum; i++) {
            if($($('.screen-checkbox')[i]).is(":checked")) {
                var tmp = "screenshots[" + i +"]";
                data[tmp] = $($('.screen-checkbox')[i]).val();
            }
        }

        $.ajax({
            type: "POST",
            url: "edit",
            data: data
        }).done(function(msg) {
            if(msg.errorCode == 0) {
                $('.submit-msg').html('你编辑的内容会在审核后生效。5 秒后将自动回到 <a href="/apps/' + pn +'">应用详情</a> 页…');
                setTimeout("location.href='/apps/" + pn + "'", 5000);
            }
            else {
                $('.submit-msg').text('提交不成功：' + msg.errorMsg);
                $('.editor-form').css('opacity', '1');
                $('input[type=checkbox]').addClass('screen-checkbox');
            }

        });
    }
