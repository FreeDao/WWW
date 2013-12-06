$(function(){
	var phoneIpt = $('.px-phone'),
        defaultText = phoneIpt.data('txt'),
        sendBtn = $('#send-phone'),
        msgSended = $('#msg-sended'),
        numError = $('#num-error'),

        vaildPhone = function(){
            var txt = phoneIpt.val();
            if(!txt.match(/1[\d]{10}/)){
                numError.fadeIn();
                setTimeout(function(){
                    numError.stop(true,true).fadeOut();
                },3000);
                return false;
            }else{
                numError.stop(true,true).fadeOut();
                return true;
            }
        },

        sending = 0,
        
        sendMsg = function(){
            if(sending || !vaildPhone()){
                return;
            }
            sending = 1;
            sendBtn.html('正在发送...');

            $.get('/sms?action=send&phone=' + phoneIpt.val()).done(function(result){
                if(result == '0'){
                    sending = 0;
                    sendBtn.html('发送到手机');
                    msgSended.fadeIn();
                    setTimeout(function(){
                        msgSended.stop(true,true).fadeOut();
                    },5000);
                    (_gaq || []).push(['_trackEvent','msg','downloadp3',sendBtn.data('controller')]);
                }
            });

        };

    phoneIpt.val(defaultText);

    phoneIpt.focus(function(){
        msgSended.stop(true,true).fadeOut();

        var txt = phoneIpt.addClass('active').val();
        if($.trim(txt) && txt == defaultText){
            phoneIpt.val('');
        }
    }).blur(function(){
        var txt = phoneIpt.removeClass('active').val();
        if($.trim(txt) == ''){
            phoneIpt.val(defaultText);
        }else{
            vaildPhone();
        }

    }).keydown(function(event){
        if(event.keyCode == 13){
            sendMsg();
        }
    });
    sendBtn.click(sendMsg);
});