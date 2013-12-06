/*
 * 应用评论模块，适用的场合包括:
 * 1. 普通浏览器访问的 wandoujia.com 上的应用详情
 * 2. 客户端（包含1.x、2.x）网页中的 app3.wandou.in
 *
 * @require  underscore.js ,backbone.js 
 * @author jintian
 */
function accountCallback(jsonObj) {
    var type = jsonObj.type;
    var url = '';
    switch(type) {
        case 'LOGIN' :
            url = 'wdj://account/login.json';
            break;
        case 'LOGOUT' :
            url = 'wdj://account/logout.json';
            break;
        case 'BINDSINA' :
            url = 'wdj://account/bindsina.json';
            break;
        case 'REGISTER':
            url = 'wdj://account/register.json';
            break;
    }

    Narya.IO.requestAsync({
        url : url,
        data : {
            detail : jsonObj.detail
        }
    });
}
        
(function(w){
    
    // 评论app 会使用到的常量配置
    var config = {
        // 评论框展开后的高度
        inputHeight : 60, 
        
        // 评论每个分页展示的评论数量 
        pageSize : 10,
        
        /*
         * 获取当前应用和所有评论信息的地址，这个接口会包含一下数据：
         * 1. 总的评论数量
         * 2. 按给定页码和显示数量的评论 json (结构参考下面的 Comment)
         * 3. 该评论的喜欢和不喜欢的信息
         * 4. 当前用户曾经发表过的评论和评星数据 
         * 5. 当前用户信息，是否已经登录，
         */ 
        fetchSavedDataUrl : 'http://comment.wandoujia.com/comment/comment!getCommentSummary.action?callback=handleCommentData&target=' + detailCfg.packageName,

        // 获取单条评论的接口
        fetchSingleDataUrl : 'http://comment.wandoujia.com/comment/comment!getSingleComment.action?callback=handleSingleData&target=' + detailCfg.packageName + '&id=' + cmtid,

        // 获取回复信息的接口
        fetchReplyDataUrl : '/comment/comment!getReply.action?callback=handleReplyData&target=' + detailCfg.packageName,

        // 创建喜欢或者不喜欢状态的接口
        createEnjoyUrl : '/comment/comment!createEnjoy.action?callback=handleEnjoy&target=' + detailCfg.packageName,

        // 发布评论接口，这些使用相对路径的接口是为了能在不同主域下实现 ajax（通过反向代理）
        createCommentUrl : '/comment/comment!createComment.action',

        // 发表回复接口
        createReplyUrl: '/comment/comment!reply.action',

        // 举报一条评论的接口
        reportCommentUrl : '/comment/comment!informComment.action',

        // 赞一条评论的接口
        agreeCommentUrl : '/comment/comment!agree.action',
        
        // 取消赞接口
        cancelAgreeCommentUrl : '/comment/comment!cancelAgreement.action',
        
        // cookie key, 用于记录用户是否曾经点击过通过到新浪微博
        SYNC_WEIBO_KEY : 'sync_weibo'
        
    };
    
    // 当前浏览器是否是客户端的判断
    // 如果是客户端登录、注销等交互都会采用客户端独有方式
    isClient = (window.OneRingRequest !== undefined) && (window.OneRingStreaming !== undefined),
    
    isClient2 = 0,
    
    // 当前用户是否登录
    // wdj_auth 是wandoujia.com 下的cookie，client_user 是wandou.in下的cookie
    logined = globeConfig.logined,

    // 初始化发布评论表单显示的视图
    postView = null,
    
    // 初始化发布回复表单
    postreplyView = null,

    // 处理评论表单中的各种状态视图
    metaView = null ;
    
    if(isClient){
        w.excuteAccount = accountCallback;
    }

    /**
     * @class Comment 单条评论
     * @extends Backbone.Model
     */
    var Comment = Backbone.Model.extend({
        // 评论的id，与服务端的 id 一致
        idAttribute : 'id',
        defaults : function (){
            return {
                // 评论的作者
                authorName : '',
                // 评论发表日期
                time2Current : '',
                // 该评论的作者是否喜欢这个应用
                enjoy : '',
                // 评论的内容
                content : '',
                // 该评论被他人赞成的数量
                agreeCount : 0,
                // 回复数量
                replyCount : 0,
                // 是否热门评论
                hot : false,
                // 是否被人赞过
                agree : false,
                // 是否已经被当前用户举报过
                reported : false,
                
                isClient2 : isClient2
            }
        },
        
        // 赞成该评论
        agree : function(){
            this.set('agreeCount', this.get('agreeCount') + 1);
            this.set('agree', true);
        },
        
        // 取消赞成该评论
        cancelAgree : function(){
            var agreeCount = this.get('agreeCount') - 1;
            this.set('agreeCount', agreeCount < 0 ? 0 : agreeCount);
            this.set('agree', false);
        },

        report : function(){
            this.set('reported', true);        
        }

    }),
    
    /**
     * @class Comments 多个评论的集合
     * @extends Backbone.Collection
     */
    Comments = Backbone.Collection.extend({
        model : Comment
    }),

    /**
     * @class CommentView 每个评论的视图，决定跟评论有关的UI渲染、事件处理逻辑
     * @extends Backbone.View
     */
    CommentView = Backbone.View.extend({
        // 每条评论使用 li 来做容器
        tagName : 'li',
        // 需要为li 加上清除浮动来满足低端浏览器
        className : 'clearfix',
        
        // 渲染一条评论时使用的模板，这个模板放在 html 中
        template: _.template($('#comment-tpl').html()),
        
        events : {
            // 举报评论事件
            'click .report' : 'report',
            // 赞一条评论事件
            'click .agree-action' : 'agree',
            // 取消赞
            'click .cancel-agree' : 'cancelAgree',
            // 查看回复
            'click .reply-action' : 'reply',
            // 收起回复
            'click .hide-reply' : 'hideReply',
            //分享评论
            'click .share-action' : 'share'
        },
       
        // 每个view 被创建时执行的内容
        initialize : function(){
            // 把 这个view 对应的 comment id 缓存起来备用
            this.id = this.model.id;
        },
        
        // 赞一条评论，这些跟后端交互的操作都需要事先判断是否已经登录
        agree: function(){
            var _self = this,
                 _cid = $('#reply-wp').data('id');
            // 如果已经登录
            metaView.auth(function(){
                // 如果回复区域在当前 comment 下，则需要暂时转移回复，以免因为重新渲染而消失
                if( _cid == _self.id){
                    $('.comments').append($('.replies'));
                }
                // 请求赞接口，忽略请求失败的情况
                $.ajax({url: config.agreeCommentUrl + '?id=' + _self.id, type : 'POST' });
                _self.model.agree();
                // 重新渲染这条评论
                _self.render();
                // 重新渲染会导致回复内容消失，所以需重新插入
                if( _cid == _self.id){
                    $($('#' + _self.id).parents('li.clearfix')).append($('.replies'));
                }
            });
        },

        // 取消赞
        cancelAgree : function(){
            var _self = this,
                 _cid = $('#reply-wp').data('id');
            metaView.auth(function(){
                // 如果回复区域在当前 comment 下，则需要暂时转移回复，以免因为重新渲染而消失
                if( _cid == _self.id){
                    $('.comments').append($('.replies'));
                }
                $.ajax({url: config.cancelAgreeCommentUrl + '?id=' + _self.id, type : 'POST' });
                _self.model.cancelAgree();
                _self.render();
                // 重新渲染会导致回复内容消失，所以需重新插入
                if(_cid  == _self.id){
                    $($('#' + _self.id).parents('li.clearfix')).append($('.replies'));
                }
            });
        },

        reply : function() {
            var _self = this,
                _wp = $('#reply-wp'),
                _es = $('.replies'),
                _replyHidden = _es.is(':hidden') == true,
                _isCurrentId = _wp.data('id') != _self.id;
          
            // 判断评论框显示/隐藏状态
            if(_replyHidden){
                _wp.empty().data('id', _self.id);
                $('#' + _self.id).parents('li.clearfix').append(_es);
                $.get(config.fetchReplyDataUrl + '&id=' + _self.id);
                _es.show();
            }else if(!_replyHidden && _isCurrentId){
                _wp.empty().data('id', _self.id);
                $('#' + _self.id).parents('li.clearfix').append(_es);
                $.get(config.fetchReplyDataUrl + '&id=' + _self.id);
            }else{
                $('body').append(_es.hide());
                _es.hide();
            }
        },

        hideReply : function() {
            $('.replies').hide();
        },


        // 举报一条评论，举报完隐藏该按钮
        report : function(e){
            var _self = this,
                 _cid = $('#reply-wp').data('id');
            _self.model.report();
            metaView.auth(function(){
                // 如果回复区域在当前 comment 下，则需要暂时转移回复，以免因为重新渲染而消失
                if(_cid == _self.id){
                    $('.comments').append($('.replies'));
                }
                $.get(config.reportCommentUrl + '?id=' + _self.id);
                _self.render();
                // 重新渲染会导致回复内容消失，所以需重新插入
                if(_cid == _self.id){
                    $($('#' + _self.id).parents('li.clearfix')).append($('.replies'));
                }
            });
        },
        // 使用模板渲染
        render: function() {
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        },

        share : function(){
            var _self = this,
            sharelink = encodeURIComponent($('#share-' + _self.id).data('link')),
            sharetitle = encodeURIComponent($('#share-' + _self.id).data('title')),
            sharepic  = encodeURIComponent($('.carousel-items img:eq(0)')[0].src);
            socialShare("weibo", sharelink, sharetitle, sharepic);
        }

    }),

    /**
     * @class PostView 表单初始化的时候和输入框状态的相应
     * @extends Baclbone.View
     */
    PostView = Backbone.View.extend({
        
        // 整个表单的容器
        el : '.comments-box',

        initialize : function(){
            var ipt = $('#comment-form .content');
            this.input = ipt;
            
            // 如果未评论过，则需要为他显示提示文字
            if(!ipt.val()){
                this.clear();
            }else{
                // 如果该用户评论过，则按钮变成修改评论
                $('.submit-comment').html('修改评论');
            }
        },
        
        events : {
            // 第一次聚焦输入框的时候，做一些 resize
            'focus #comment-form .content' : 'resize',
            // 处理 hint 信息
            'blur #comment-form .content' : 'clear',
            // 提交处理
            'click .submit-comment' : 'submit'
        },
        
        submit : function(e){
            // 如果上一次请求尚未成功则阻止提交
            if(this.procressing){
                return; 
            }
            var content = this.input.val();
            
            // 如果未输入，或者输入的内容是默认的文案，阻止提交，并显示错误文案
            if(!content || content == this.input.data('hint') || content.length > 500){
                helper.trigger('msg', '请输入少于500字的评论', 'alert', 1);
                return;
            }
            // 显示正在发布
            helper.trigger('msg','正在努力地发表评论...','alert');
            
            $.ajax({
                url : config.createCommentUrl,
                data : {
                    // 评论的app 的 packageName
                    target : detailCfg.packageName,
                    
                    // 是否同步到新浪微博
                    sync : metaView.model.get('sync'),
                    
                    // 评论的内容
                    content : this.input.val(),
                    
                    // 同步到微博的图片地址
                    screenShotsUrl : $('#screenshots-url').val(),
                    
                    // 该应用的名称
                    appTitle : $('#app-title').val()
                },
                success : function(data){
                    if(data.errorCode == 0){
                        e.target.innerHTML = '修改评论';
                        // 提成功则请求错误提示
                        helper.trigger('clearmsg', 'alert');
                        
                        // 如果服务端返回了需要显示的错误信息(比如同步到微博失败)
                        if(data.detail){
                            helper.trigger('msg', data.detail,'alert',1);
                        }
                        
                        // 刷新到第一屏，让用户可以看到自己发布的评论，当然如果是修改评论可能会看不到自己的评论
                        helper.trigger('refresh', 1);
                    }else{
                        // 发布失败则显示错误提示
                        helper.trigger('msg', data.detail,'alert',1);
                    }
                    postView.procressing = 0;
                    
                },
                failure : function(data){
                    helper.trigger('msg', '发布失败，请稍后重试','alert',1);
                },
                type : 'POST'  
            });
            
            this.procressing = 1;
        },
        
        // 重置输入框的高度和文案
        resize : function(){
            
            var ipt = this.input;
            
            if(!ipt.setted && logined){
                ipt.height(config.inputHeight);
            }
            ipt.setted = 1;
            if($.trim(ipt.val()) == ipt.data('hint')){
                ipt.val('').removeClass('hint');
            }
        },
        
        clear : function(){
            var ipt = this.input;
            if(!$.trim(ipt.val())){
                ipt.val(ipt.data('hint')).addClass('hint');
            }
        }
        
    }),


    /**
     * @class Reply 单条回复
     * @extends Backbone.Model
     */
    Reply = Backbone.Model.extend({

        // 评论的id，与服务端的 id 一致
        idAttribute : 'id',
        defaults : function (){
            return {
                // 评论的作者
                authorName : '',
                // 评论发表日期
                time2Current : '',
                // 该评论的作者是否喜欢这个应用
                enjoy : '',
                // 评论的内容
                content : '',
                // 该评论被他人赞成的数量
                agreeCount : 0,
                // 回复数量
                replyCount : 0,
                // 是否热门评论
                hot : false,
                // 是否被人赞过
                agree : false,
                // 是否已经被当前用户举报过
                reported : false,

                isClient2 : isClient2
            }
        },

        report : function(){
            this.set('reported', true);
        }

    }),

    /**
     * @class Replies 多个评论的集合
     * @extends Backbone.Collection
     */
    Replies = Backbone.Collection.extend({
        model : Reply
    }),

    /**
     * @class ReplyView 每个回复的视图，决定跟评论有关的UI渲染、事件处理逻辑
     * @extends Backbone.View
     */
    ReplyView = Backbone.View.extend({
        // 每条回复使用 li 来做容器
        tagName : 'li',
        // 需要为li 加上清除浮动来满足低端浏览器
        className : 'clearfix',

        // 渲染一条回复时使用的模板，这个模板放在 html 中
        template: _.template($('#reply-tpl').html()),

        events : {
            // 举报回复事件
            'click .reply-report' : 'report'
        },


        // 每个view 被创建时执行的内容
        initialize : function(){
            // 把这个view 对应的 comment id 缓存起来备用
            this.id = this.model.id;
        },

        // 举报一条回复，举报完隐藏该按钮
        report : function(e){
            var _self = this;
            _self.model.report();
            metaView.auth(function(){
                $.get(config.reportCommentUrl + '?id=' + _self.id);
                _self.render();
            });
        },
        // 使用模板渲染
        render: function() {
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        }

    }),

    /**
     * @class PostReplyView 表单初始化的时候和输入框状态的相应
     * @extends Backbone.View
     */
    PostReplyView = Backbone.View.extend({
        // 整个表单的容器
        el : '.reply-box',

        initialize : function(){
            var ipt = $('#reply-form .content');
            this.input = ipt;
        },

        events : {
            'click .submit-reply' : 'submit'
        },

        submit : function(e){
            var _self = this;
            // 如果上一次请求尚未成功则阻止提交
            if(this.procressing){
                return;
            }
            var content = this.input.val();

            // 如果未输入，或者输入的内容是默认的文案，阻止提交，并显示错误文案
            if(!content || content.length > 200){
                helper.trigger('replymsg', '请输入少于200字的回复', 1);
                return;
            }

            $.ajax({
                url : config.createReplyUrl,
                data : {
                    // 回复的app 的 packageName
                    target : detailCfg.packageName,

                    // 回复的内容
                    content : this.input.val(),

                    // 回复对应评论的 id
                    id : $('#reply-wp').data('id')
                },
                success : function(data){
                    if(data.errorCode == 0){
                        $('#reply-form textarea').val('');
                        helper.trigger('replyrefresh', $('#reply-wp').data('id'));
                    }else if(!logined){
                        helper.trigger('replymsg', '请先登录', 1);
                    }else{
                        helper.trigger('replymsg', '发布失败，请稍后重试', 1);
                    }
                    postreplyView.procressing = 0;

                },
                failure : function(data){
                    helper.trigger('replymsg', '发布失败，请稍后重试', 1);
                },
                type : 'POST'
            });

            postreplyView.procressing = 1;

        }


    }),


    /**
     * @class Comments 多个评论的集合
     * @extends Backbone.Collection
     */
    Comments = Backbone.Collection.extend({
        model : Comment
    }),


    /**
     * @class Meta 用户对与评论的发表过的数据 & 这个评论本身被人喜欢的数据
     * @extends Backbone.Model
     */
    Meta = Backbone.Model.extend({
        defaults : function(){
            return {
                // 用户名
                username : '',
                
                // 发布评论的时候是否同步到新浪微博
                sync : false,
                
                // 对于这个评论的态度：喜欢还是不喜欢，如果是空字符串，则是没有态度
                likeStatus : '',
                
                // 用户发表过的评论
                comment : '',
                
                // 用户发表的评论的id
                commentId : 0,
                
                // 用户是否绑定过新浪微博
                activeSina : false,
                
                // 评论被人喜欢的数量
                likeCount : 0,
                
                // 评论被人不喜欢的数量
                dislikeCount : 0
            }
        },
        // 切换喜欢、不喜欢、和不予置评状态
        toggleLike : function(type, flag){
            this.set('likeStatus', flag);
        },
        // 切换同步和不同步到新浪微博
        toggleSync : function(){
            this.set('sync', !this.get('sync'));
        }
    }),
    
    // 这个 Collection 没有实际用途，但是Backbone 需要他
    MetaCollection = Backbone.Collection.extend({
        model : Meta
    }),
    
    metaCollection = new MetaCollection,
    
    /**
     * @class MetaView 针对Meta的事件处理、UI处理
     */
    MetaView = Backbone.View.extend({
        el : '.comments-box',
        
        initialize : function(){
            // 如果曾经选过同步到微博，则默认选中
            if($.cookie(config.SYNC_WEIBO_KEY) == "true" && this.model.get('activeSina')){
                $('.weibo-sync-icon').addClass('actived'); 
                this.model.toggleSync();  
            }
            
            // 如果喜欢或者不喜欢操作成果后，更新UI
            metaCollection.on('enjoydone', this.updateEnjoy, this);
            
            this.input = $('#comment-form .content');
            
            // 显示一些服务端保存的数据
            this.showSavedData();
        },
        
        events : {
            'click .show-like' : 'like',
            'click .show-dislike' : 'dislike',
            'click #logout-link' : 'logout',
            'click #login-link' : 'login',
            'click .sync-weibo' : 'toggleSync'
        },
        
        /*
         * 更新用户对应用的喜欢和不喜欢状态
         * @param {JSON} data 服务端返回的处理结果
         */ 
        updateEnjoy : function(data){
            // 更新喜欢和不喜欢的总数
            this.model.set('likeCount', data.extra.likeCount);
            this.model.set('dislikeCount', data.extra.dislikeCount);
            this.render();
        },
        bindWeibo : function(callback){
            // 如果该用户已经绑定过微博，则直接执行回调
            if(this.model.get('activeSina')){
                callback.call(this);
            }else{
                // 否则直接打开绑定页面
                
                // 如果是客户端，使用客户端的弹出层
                if(isClient){
                    excuteAccount({type : 'BINDSINA', detail :'http://account-http.wandoujia.com/v1/user/?do=bind&platform=sina&callback=javascript:_close();' });
                }else{
                    // 如果是在普通浏览器，直接跳转，加 timeout 是为了兼容 IE6
                    var t = setTimeout(function(){
                        location.href = 'https://account.wandoujia.com/v1/user/?do=bind&platform=sina&callback=' + location.href;
                        clearTimeout(t);
                    },20);
                }
                
            }
              
        },
        // 切换同步到微博状态
        toggleSync : function(){
            // 需要绑定微博才能切换
            this.bindWeibo(function(){
                var syncIcon = $('.weibo-sync-icon'),
                    flag = syncIcon.hasClass('actived');
                if(flag){
                    syncIcon.removeClass('actived');
                }else{
                    syncIcon.addClass('actived');
                }
                this.model.toggleSync();
                // 在cookie 中记录同步的状态
                $.cookie(config.SYNC_WEIBO_KEY, !flag);
                    
            });
        },
        showSavedData : function(){
            var attrs = this.model.attributes,
                enjoy  = attrs.likeStatus,
                comment = attrs.comment,
                username = attrs.username;
            
            // 显示发表过的评论
            if(comment){
                this.input.val(attrs.comment);
                $('#comment-id').val(attrs.commentId);
            }
            
            $('.comments-box').fadeIn(200);
            
            // 如果存在应用名称，则显示分享到微博链接
            if(detailCfg.appName){
                $('#share-weibo').fadeIn(200);
            }
            // 如果已经登录
            if(logined){
                $('.submit-tip').hide();
                $('#user-operate .name').html(username);
                $('#user-operate').fadeIn(100);
                if(!postView){
                    // 显示评论表单（默认只显示了提示登录的链接）
                    postView = new PostView;
                }
            }
            postreplyView = new PostReplyView;
        },
        
        /*
         * 登录判断
         * @param {Function} callback 如果已经登录则执行该回调
         */
        auth : function(callback){
            if(!logined){
                this.login();
            }else{
                callback.call(this);
            }
        },
        
        // 登录也需要区分是普通浏览器还是客户端
        login : function(){
            if(isClient){ 
                accountCallback({type : 'LOGIN', detail : ''});
            }else{
                setTimeout(function(){
                    location.href = "https://account.wandoujia.com/v1/user/?do=login&callback=" + encodeURIComponent(location.href);    
                },20);
                
            }
        },
        logout : function(){
            if(isClient){
                accountCallback({type : 'LOGOUT', detail : ''});
            }else{
                setTimeout(function(){
                    location.href = "https://account.wandoujia.com/v1/user/?do=logout&callback=" + encodeURIComponent(location.href);
                },20);
            }
        },
        
        // 如果当前用户修改评论，修改评星，而且该评论是在第一个（或者当前）分页中，则会高亮他正在操作的行  
        highlightRow : function(id){
            var row = $('#' + id).closest('li');
            if(!row.length){
                return;
            }
            row.css({
                backgroundColor: '#fbf9d1'
            });
            var t = setTimeout(function(){
                row.stop(true, true).animate({ 
                    backgroundColor: "#ffffff" 
                }, 2000);
                clearTimeout(t);
            },1000);
        },
        
        // 在用户点击评论上方的喜欢和不喜欢的时候，同步 论列表中的喜欢的状态
        syncListLikeStatus : function(flag){
            var commentId = $('#comment-id').val(),
                target = $('#like-' + commentId);
            if(target.length){
                target[0].className = flag === '' ? '' : ( flag ? 'like-icon' : 'dislike-icon' );
            }
            this.highlightRow(commentId);
        },   
        
        // 喜欢该应用，或者取消喜欢， flag 为 空串则是不予置评，为 true 是喜欢，为 false 是不喜欢
        like : function(){
            this.auth(function(){
                var flag = $('.show-like .icon').hasClass('like-nuked-icon');
                flag = flag ? flag : '';
                $.ajax({url: config.createEnjoyUrl + '&enjoy=' + flag, type: 'POST' });  
                
                this.model.toggleLike('like', flag);
            });
        },
        
        // 不喜欢该应用，或者取消不喜欢
        dislike : function(){
            this.auth(function(){
                var flag = $('.show-dislike .icon').hasClass('dislike-nuked-icon');
                flag = flag ? false : '';
                $.ajax({url: config.createEnjoyUrl + '&enjoy=' + flag, type : 'POST' });
                
                this.model.toggleLike('dislike', flag);
            });
        },
        
        // 与用户数据和评论喜欢数据相关的渲染逻辑 
        render : function(){
            var status = this.model.get('likeStatus'),
                likeIcon = $('.show-like .icon')[0],
                dislikeIcon  = $('.show-dislike .icon')[0];
            if(likeIcon && likeIcon){
                if('' !== status){
                    if(status){
                        likeIcon.className = 'like-icon icon';  
                        dislikeIcon.className = 'dislike-nuked-icon icon';     
                    }else{
                        likeIcon.className = 'like-nuked-icon icon';
                        dislikeIcon.className = 'dislike-icon icon';
                    }
                }else{
                    likeIcon.className = 'like-nuked-icon icon'; 
                    dislikeIcon.className = 'dislike-nuked-icon icon'; 
                }
            }
                $('#like-count').html(this.model.get('likeCount'));
                $('#dislike-count').html(this.model.get('dislikeCount'));
                $('#like-counts').fadeIn(200);
                this.syncListLikeStatus(status);
            
            
        }
    });
    
    /**
     * @class 分页的链接抽象
     */
    var Pagination = Backbone.Model.extend({
        defaults : function(){
            return {
                // 链接的蚊子
                linkText : '',
                // 链接的地址
                href : 'javascript:;',
                className : ''
            }
        }
    }),
    
    /**
     * @class Paginations 分页链接集合
     * @extends Backbone.Collection
     */
    Paginations = Backbone.Collection.extend({
        model : Pagination,
        // 当前处于哪个分页
        current : 1,
        // 总页数
        totalCount : 1
    }),
    
    paginations = new Paginations;
    
    /**
     * @class PaginationView 分页链接渲染逻辑
     * @extends Backbone.View
     */    
    PaginationView = Backbone.View.extend({
        // 依然使用模板
        template: _.template($('#pagination-tpl').html()),
        
        render : function(){
            return this.template(this.model.toJSON());
        }
    }),
    
    /**
     * 通过分页的总数，每个显示的个数，当前的页数来生成 paginations 需要的 数据
     * @param {Integer} count 条目总数
     */
    calPages = function(count){
            // 总页数
        var pageCount = Math.ceil(count / config.pageSize),
            // 当前页
            current = parseInt(paginations.current),
            // 暂存结果
            result = [],
            // 第一个 “..." 链接出现的标志，一个分页里最多只有两个 ”...“ 的链接
            firstDot = 0,
            // 最后一个 "..." 链接出现的标志
            lastDot = 0;
        for(var x = pageCount ; x > 0 ; x--){
            // 单个分页链接数据
            var page = {};
            
            // 如果不是第一页，不是最后一页，并且总数大于6页,6页是因为我们希望最大的连续可点击链接是6个，最小的情况就是6页
            if(x !==1 && x !== pageCount && pageCount > 6 && 
                // 当前页大于4，小于总数 - 4 时，如果 x 是 在 当前 +- 2范围内的显示为 ...
                (( current > 3 && (current <= pageCount - 3) && (current - 2 > x || current + 2 < x)) 
                    // 如果是在头3个后者后三个
                    || (current <= 3 && x > 5) || (current > pageCount - 3 && x <= pageCount - 5) 
                )
            ){
                // 以上这些情况是不需要显示这个链接的，所以会被提换成 ... 
                if(x < current - 2 && !firstDot){   
                    // 只在当前页 +- 2的地方显示成 ...
                    page.linkText = '...';
                    page.className = 'first dots';
                    firstDot = 1;
                }else if(x > current + 2 && !lastDot){
                    page.linkText = '...';
                    page.className = 'last dots';
                    lastDot = 1;
                }
            } else{
                // 除了以上情况就是显示正常的链接
                page.linkText = x;
                page.className = current == x ? ' current' : '';
            }
            if(page.linkText){
                result.push(page);
            }
        }
    
        // 添加回到上一页
        if(current > 1){
            result.push({
                linkText : '上一页',
                className : 'prev-page'
            });
        }
        
        result = result.reverse();
        
        // 添加进入下一页 
        if(current < pageCount){
            result.push({
                linkText : '下一页',
                className : 'next-page'
            });
        }  
           
        // 存储总页数
        paginations.totalCount = pageCount;
        return result;
    };
    
    // 使用一个辅助类来组织上面的对象
    var helper = {};
    _.extend(helper, Backbone.Events);
    
    /**
     * 处理用户发表的信息，应用的喜欢信息
     * @param {JSON} data
     */
    var handleMeta = function(data){
        var user = data.user,
            enjoyData = data.enjoySummary,
            savedComment = data.savedComment;
            
        // 从服务端填充到前端
        metaCollection.add([
            {
                username : user.username,
                activeSina : user.activeSina,
                likeStatus : savedComment.enjoy,
                comment : savedComment.content,
                likeCount : enjoyData.likeCount,
                dislikeCount : enjoyData.dislikeCount,
                commentId : savedComment.id
            }
        ]);
        
        // 准备这些数据
        metaView = new MetaView({
            model : metaCollection.at(0)
        });
        // 渲染meta
        metaView.render();
        
    };
    
    
    /**
     * 服务端数据到达的时候触发
     * @param {JSON} data
     */
    helper.on('arrived', function(data){
        if(data){
            if(!metaView){
                handleMeta(data);
            }
                
                // 评论模型
            var models = data.comments,
                // 展示评论                
                comments = new Comments(models),
                commentCount = data.count;
            
            // 如果无评论
            if(!commentCount){
                $('#comment-wp .loading').html('暂无评论');
                helper.procressing = 0;
                return;
            }
            
            $('#comment-wp').html('');
            
            comments.each(function(cmt){
                if(logined || cmt.attributes.enjoy){
                    var view = new CommentView({ model : cmt });
                    $('#comment-wp').append(view.render().el);
                }
            });
            
            if($('#comment-wp li').length == 1){
                $('.cmt-summary').hide();
            }

            $('#show-count').show();
            
            $('#comment-count').html(commentCount);

            if(commentCount > config.pageSize){
                paginations.reset()
                    .add(calPages( commentCount )),
                    pageHTML = '';
                
                paginations.each(function(page){
                    var pageView = new PaginationView({ model : page });
                    pageHTML += pageView.render();
                });
                
                $('.pagination').fadeIn(10).find('.pagination-wp').html(pageHTML);
            }

            // 评论加载完成之后，请求单条评论，并隐藏列表中与单条评论相同的那条评论
            if(cmtid !== ''){
                $('#' + cmtid).parent().parent().not('.single').hide();
                $.getScript(config.fetchSingleDataUrl);
            }

            var currentCommentId = data.savedComment.id;

            // 此处需要再次更新commentId，因为 metaView 只会 render 一次
            $('#comment-id').val(currentCommentId); 
            metaView.highlightRow(currentCommentId);
            helper.procressing = 0;

        }
    });

    helper.on('single', function(data){
        if(data){
            var models = data,
                  comments = new Comments(models);

            comments.each(function(cmt){
                var view = new CommentView({ model : cmt });
                $('#comment-wp').prepend(view.render().el);
                $(view.render().el).addClass('single');
            });
        }
    });

    helper.on('replies', function(data){
        if(data){
            if(!metaView){
                handleMeta(data);
            }
            
            var count = data.length;
            // 为数组增加顺序数据，用于显示回复楼层
            for(i = 0;i < count;i++){
                data[i].index = i+1;
            }
            
            if(count > 0){
                var replyCount = $('#reply-wp').closest('li').find('.reply-count');
                if(replyCount.length){
                    replyCount.html(count);
                }else {
                    $('#reply-wp').closest('li').find('.reply-action').append('( <span class="reply-count"> ' + count + '</span> ) ')
                }
            }
                // 回复模型
            var models = data,
                // 展示回复
                replies = new Replies(models),
                replyCount = data.length;


            replies.each(function(cmt){
                var view = new ReplyView({ model : cmt });
                $('#reply-wp').append(view.render().el);
            });

            helper.procressing = 0;
        }
    });

    helper.on('msg', function(msg, type, autohide){
        var msgWp = $('#comment-' + type);
        msgWp.html(msg).show();
        if(autohide){
            var t = setTimeout(function(){
                msgWp.stop(true,true).fadeOut(1000, function(){
                    msgWp.empty();
                });
                clearTimeout(t);
            },3000);
        }
    });

    helper.on('clearmsg', function(type){
        $('#comment-' + type).empty().hide();
    });

    helper.on('replymsg', function(msg, autohide){
        var msgWp = $('#reply-alert');
        msgWp.html(msg).show();
        if(autohide){
            var t = setTimeout(function(){
                msgWp.stop(true,true).fadeOut(1000, function(){
                    msgWp.empty();
                });
                clearTimeout(t);
            },3000);
        }
    });

    helper.on('refresh', function(page){
        if(helper.procressing){
            return;
        }
        paginations.current = page;
        
        // 复原评论的回复 dom，以免刷新之后该容器丢失
        $('body').append($('.replies').hide());
        
        setTimeout(function(){
            $.getScript(config.fetchSavedDataUrl + '&pageNum=' + (parseInt(page) - 1) + '&pageSize=' + (!logined ? 60 : config.pageSize));
        },20);

        helper.procressing = 1;
    });

    helper.on('replyrefresh', function(id){
        if(helper.procressing){
            return;
        }

        $('#reply-wp').html('');

        setTimeout(function(){
            $.getScript(config.fetchReplyDataUrl + '&id=' + id);
        },20);

        helper.procressing = 1;
    });

    $('.pagination').delegate('.page-item','click', function(e){
        var self = $(this),
            current = paginations.current,
            to  = self.hasClass('prev-page') ? (current - 1) : (self.hasClass('next-page') ? (current + 1) : self.text());
        
        to = parseInt(to < 1 ? 1 : ( to > paginations.totalCount ? paginations.totalCount : to));

        // 翻页会重新渲染页面，所以要将回复区域转移
        $('.replies').hide().insertAfter('#comment-tpl');
        $('#reply-wp').data('id','');

        if(to && !isNaN(to)){
            helper.trigger('refresh', to);
        }

    });

    $('#comment-wp').delegate('li', 'mouseenter', function(){
        $(this).find('.report').show();    
    }).delegate('li', 'mouseleave', function(){
        $(this).find('.report').hide();  
    });

    w.handleCommentData =  function(data){
        helper.trigger('arrived', data);
    };

    w.handleSingleData =  function(data){
        helper.trigger('single', data);
    };

    w.handleReplyData = function(data){
        helper.trigger('replies', data);
    };

    w.handleEnjoy = function(data){
        metaCollection.trigger('enjoydone', data);
    };

    
    // 给客户端使用的用户状态更新回调
    w.updateUserStatus = function(){
        location.reload(true);
    };
    helper.trigger('refresh', 1);
    
})(this);
