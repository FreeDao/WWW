define(['jquery'],function(){
    var cmtTpl = _.template($('#cmt-tpl').html()),
        getCmtsUrl = 'http://apps.wandoujia.com/api/v1/comments?packageName=' + ('undefined' !== typeof detailCfg ? detailCfg.packageName : $('body').data('pn')) + '&callback=?',
        holder = $('#comments-holder'),
        listMoreEl = $('#list-more'),
        originalHTML = listMoreEl.html(),
        loading = 0,
        total = holder.data('total'),
        currentCmtIndex = holder.children().length;
   
    var renderCmts = function(cmts, appendFlag){

            //add by zhangyaochun 7 20
            //为了效率，在最上面
            if(cmts.length === 0){
                listMoreEl.remove();
                return false;
            }

            var html = [];
            _.each(cmts, function(cmt, index){
                cmt.datetime = cmt.updateDataStr;
                html.push(cmtTpl(cmt));
            });

            if(cmts.length) {
                //如何数据多的话，每次都进来执行一次，加一层判定吧
                //if $('.no-comments') exist && is hide or not
                var noCommentsEl = $('.no-comments');
                if(noCommentsEl.length ===1 && noCommentsEl.is(':visible')){
                    noCommentsEl.hide();
                }
            }

            if(!appendFlag){
                holder.html(html.join(''));
            }else{
                holder.append(html.join(''));
            }
            
            if(holder.children().length >= total){
                listMoreEl.remove();
            }
        },
        
        loadCmts = function(start, max, appendFlag, onstart, onfinish){
            if(loading){
                return;
            }
            
            loading = 1;
            
            if (onstart) {
                onstart(); 
            }
            
            $.getJSON(getCmtsUrl,{
                start : start,
                max : max
            }).done(function(res){
                    renderCmts(res, appendFlag);
                    currentCmtIndex = currentCmtIndex + res.length;
                    loading = 0;
                    if (onfinish) {
                        onfinish(); 
                    }
                
                });
        };

    
    holder.delegate('li','mouseover', function(){
        $(this).find('.comment-meta').addClass('actived');
    }).delegate('li','mouseout', function(){
        $(this).find('.comment-meta').removeClass('actived');
    });
    
    listMoreEl.click(function(){
        var self = $(this);
        loadCmts(currentCmtIndex, 10, 1, function(){
            self.html('正在加载...');
        }, function(){
            self.html(originalHTML);
            if(currentCmtIndex >= total){
                listMoreEl.remove();
            }
        });
    });    

});