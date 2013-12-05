;(function (factory) {
    'use strict';
    
    if (typeof define === 'function' && define.amd) {
        define([
            'jquery'
        ], factory);
    } else {
        // Browser globals:
        factory(window.jQuery);
    }
}(function ($) {
    'use strict';
    
    $.extend($.fn, {
        upload : function(options){
            var opt = $.extend({
                    progressBar :  $('#progress-bar'),
                    uploadStatus : $('#upload-status'),
                    fileContainer : $('#file-list'),
                    errorContainer : $('#upload-error'),
                    action : '/upload/upload.php',
                    forceIframe : 0,
                    frameId : 'upload-frame',
                    uploadFormId : 'upload-form',
                    accepts : /(\.|\/)(gif|jpe?g|png)$/,
                    maxLength : 5 * 1024 * 1024,
                    hideTimeout : 2000
                }, options);
            
            var TYPE_NO_ACCEPT = 1,
                LENGTH_TOO_LARGE = 2;
            
            $.support.xhrFileUpload = !!(window.XMLHttpRequestUpload && window.FileReader);
            $.support.xhrFormDataFileUpload = !!window.FormData;
                
            var isXHRUpload = !options.forceIframe && ((!options.multipart && $.support.xhrFileUpload) || $.support.xhrFormDataFileUpload),
                files = [],
                body = $('body'),
                totalEl = opt.uploadStatus.find('.total'),
                completeEl = opt.uploadStatus.find('.complete'); 
                
            var _handleSuccess = function(data){
                    opt.fileContainer.append('<li><img src="' + data + '" /></li>');
                },
                
                _onProgress = function(event){
                    if (event.lengthComputable) {
                        opt.progressBar.show();

                        opt.progressBar[0].max = event.total;
                        opt.progressBar[0].value = event.loaded;
                    } else {
                        
                    }
                },
                
                _onUpload = function(){
                    var procressTimeout = setTimeout(function(){
                        opt.progressBar.stop(true).fadeOut(1000);
                        clearTimeout(procressTimeout);
                    },opt.hideTimeout);
                    
                    var complete = parseInt(completeEl.html());
                    completeEl.html(complete + 1);
                    
                    if(completeEl.html() == totalEl.html()){
                        var completeTimeout = setTimeout(function(){
                            opt.uploadStatus.fadeOut(1000);
                            clearTimeout(completeTimeout);
                        }, opt.hideTimeout);
                    }
                },
                
                _beforeUpload = function(){
                    opt.uploadStatus.show();  
                    completeEl.html(0);  
                    totalEl.html(files.length);
                },
                
                _xhrUpload = function(){
                    if(!files.length){
                        return;
                    }
                    
                    var file = files[0],
                        xhr = new XMLHttpRequest();
                    
                    xhr.open('post', opt.action, true);
                    
                    xhr.setRequestHeader('Content-Type', 'multipart/form-data');
                    xhr.setRequestHeader('X-File-Name', file.name);
                    xhr.setRequestHeader('X-File-Size', file.size);
                    xhr.setRequestHeader('X-File-Type', file.type);

                    xhr.onreadystatechange = function(){
                        if (xhr.readyState == xhr.DONE) {
                            if (xhr.status == 200 && xhr.responseText) {
                                var data =  xhr.responseText;
                                _handleSuccess(data);
                                xhr = null;
                                
                                files.shift();
                                _xhrUpload();
                                
                            }else{
                                
                            }
                        }
                    };
            
                    xhr.upload.addEventListener('progress', _onProgress, false);

                    xhr.addEventListener('load', _onUpload , false);
                    
                    xhr.send(file);
                        
                },
                
                _addFile = function(name, value, form){
                    form.append('<input type="file" style="display:none;" name="' + name + '" value="' + value + '" />');
                },
                
                _formUpload = function(file){
                    var uploadForm = $('#' + opt.uploadFormId),
                        uploadFrame = $('#' + opt.frameId);
                         
                    _addFile('file',file, uploadForm);
                    uploadForm.submit();
                    uploadFrame.unbind('load').load(function(){
                        var response = this.contentWindow.document.body.innerHTML;
                        if(response){
                            _handleSuccess(response);    
                        }
                    });
                },
                
                _handleError = function(errors){
                    var message = '';
                    for(var i = errors.length; i--;){
                        var error = errors[i];
                        switch (error.type){
                            case TYPE_NO_ACCEPT:
                                message += '<span>' + error.name + '该文件格式不支持;&nbsp;</span>';
                                break;
                            case LENGTH_TOO_LARGE:
                                message += '<span>' + error.name + '该文件太大了，超过' + (opt.maxLength / 1024 / 1024) +' MB;&nbsp;</span>';
                                break;
                            default:; 
                        }
                    }
                    
                    opt.errorContainer.html(message).show();
                    
                    var errorTimeout = setTimeout(function(){
                        opt.errorContainer.stop(true, true).fadeOut(1000);
                        clearTimeout(errorTimeout);
                    }, opt.hideTimeout * 3);
                },
                
                _validFiles = function(){
                    var result = [],
                        pass = [];
                    for(var i = 0; i < files.length; i++){
                        var file = files[i];
                        var name = typeof file == 'string' ? file : file.name,
                            size = file.size || file.fileSize;
                        if(!name.match(opt.accepts)){
                            result.push({
                                'type' : TYPE_NO_ACCEPT,
                                'name' : name
                            });
                        }else if(isXHRUpload && size > opt.maxLength){
                            result.push({
                                'type' : LENGTH_TOO_LARGE,
                                'name' : name
                            });
                        }else{
                            pass.push(files[i]);
                        }
                    }
                    
                    return {
                        'pass' : pass,
                        'errors' : result   
                    };
                },
                
                _upload = function(){
                    var validResult = _validFiles(files),
                        passFiles = validResult.pass,
                        errors = validResult.errors;

                    if(errors.length){
                        _handleError(errors);
                        if(!passFiles.length){
                            return false;
                        }
                    }
                    
                    files = passFiles;

                    if(isXHRUpload){
                        _beforeUpload(files);
                        _xhrUpload(passFiles);
                    }else{
                        _formUpload(files[0]);
                    }
                },
                
                _setUpUploadForm = function(target){
                    var uploadForm = $('<form />').attr({
                        id : opt.uploadFormId,
                        target : opt.frameId,
                        method : 'post',
                        enctype : 'multipart/form-data',
                        action : opt.action
                    });
                    target.wrap(uploadForm);
                },
                
                _setUpIframe = function(){
                    var uploadFrame = $('<iframe name="' + opt.frameId + '" id="' + opt.frameId + '" src="http://localhost/upload/blank.html"></iframe>').css({
                        opacity : 1,
                        height: 0,
                        width:0
                    });
                    
                    body.append(uploadFrame);
                },
                
                _fileListToArray = function(fileList){
                    var result = [];
                    for(var i =0;i< fileList.length;i++){
                        result.push(fileList[i]);
                    }
                    return result;
                },
                _liveEvents = function(target){
                    target.change(function(event) {
                        if(isXHRUpload){
                            files = _fileListToArray(event.target.files);    
                        }else{
                            files = [event.target.value];
                        }
                        
                        if(files && files.length){
                            _upload();
                        }
                    });
                },
                
                _init = function(target){
                    if(isXHRUpload){
                        
                    }else{
                        _setUpIframe();
                        _setUpUploadForm(target);
                    }   
                    
                    _liveEvents(target);
                };
                
            return this.each(function(){
                
                _init($(this));
                
            });
            
        }
    });
}));

