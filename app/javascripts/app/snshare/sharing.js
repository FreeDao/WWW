/*global jQuery:true*/
(function($) {
'use strict';

var editorTemplate = '<div class="wdss-editor" style="display:none;">' +
                        '<div class="mask"></div>' +
                        '<div class="dialog">' +
                            '<div class="hd">分享 <span class="title">{0}</span></div>' +
                            '<div class="bd">' +
                                '<textarea class="content" placeholder="说点什么吧（可选）">{1}</textarea>' +
                                '<div class="warning">请选择一个分享到的地方</div>' +
                            '</div>' +
                            '<div class="ft">' +
                                '<span class="wdss-container">' +
                                    '<span class="wdss-label">分享到：</span>' +
                                    '<span class="wdss-platform-indicator">' +
                                        '<a data-wdshare-platform="weibo"><i class="weibo"></i></a>' +
                                        '<a data-wdshare-platform="qzone"><i class="qzone"></i></a>' +
                                        '<a data-wdshare-platform="tqq"><i class="tqq"></i></a>' +
                                        '<a data-wdshare-platform="renren"><i class="renren"></i></a>' +
                                    '</span>' +
                                '</span>' +
                                '<span class="submit btn-green">分享</span>' +
                            '</div>' +
                            '<div class="close">&times;</div>' +
                        '</div>' +
                    '</div>';
var statisticTemplate = '<a class="wdss-statistic">' +
                            '<span class="brief">{0}K</span>' +
                            '<span class="full">累计分享 {1} 次</span>' +
                        '</a>';

var template = function(tpl) {
    var data = Array.prototype.slice.call(arguments, 1);
    var reg = /\{(\d+)\}/;
    var index;
    while (reg.test(tpl)) {
        index = tpl.match(reg)[1];
        tpl = tpl.replace('{' + index + '}', data[index] || '');
    }
    return tpl;
};

var bindContext = function(fn, context) {
    var args = Array.prototype.slice.call(arguments, 1);
    if (typeof Function.prototype.bind === 'function') {
        return Function.prototype.bind.apply(fn, args);
    }
    else {
        return function() {
            return fn.apply(context, args.slice(1).concat(Array.prototype.slice.call(arguments)));
        };
    }
};

var createObject = function(obj) {
    if (typeof Object.create === 'function') {
        return Object.create(obj);
    }
    else {
        var F = function() {};
        F.prototype = obj;
        return new F();
    }
};

var defer = function(fn, context) {
    var args = Array.prototype.slice.call(arguments, 2);
    setTimeout(function() {
        fn.apply(context, args);
    }, 0);
};

var extractDataAttr = function(el, options) {
    var data = {};
    var key, value;
    for (key in options) {
        value = el.getAttribute('data-wdshare-' + key);
        if (value) {
            data[key] = value;
        }
    }
    return data;
};

var formatNumber = function(number) {
    number = parseInt(number, 10);
    var abbr;
    if (number < 1000) {
        abbr = number;
    }
    else if (number >= 1000 && number <= 1000 * 1000) {
        abbr = (number / 1000).toFixed(1);
    }
    else {
        abbr = (number / 1000 / 1000).toFixed(1);
    }
    return abbr;
};

var productToPlatform = {
    weibo: 'sina',
    renren: 'renren',
    qzone: 'qq',
    tqq: 'qq'
};

var uniqueID = (function(base) {
    return function() {
        base += 1;
        return 'wdShare-id-' + base;
    };
})(0);

// Status center, sync with server
var Communicator = $.extend($({}), {
    request: null,
    looper: null,
    status: {
        sina: false,
        renren: false,
        qq: false
    },
    isEnabled: function(platform){
        return this.status[platform];
    },
    queryStatus: function(){
        // Only one request kept in a period.
        if (this.request) {
            return this.request;
        }
        this.request = $.Deferred();
        $.ajax({
            dataType: 'jsonp',
            url: 'https://account.wandoujia.com/v1/user/?do=profile&fields=activesina,activerenren,activeqq',
            context: this
        }).done(function(status) {
            if (status === 0) {
                this.request.reject('not login');
                return;
            }
            var prevStatus, curStatus;
            var platform;
            for (platform in this.status) {
                prevStatus = this.status[platform];
                curStatus = this.status[platform] = status['active' + platform] !== '0';
                if (prevStatus !== curStatus) {
                    // Status changed, looper's job done.
                    if (this.looper) {
                        this.looper.resolve();
                    }
                    this.trigger(curStatus ? 'enable' : 'disable', platform);
                }
            }
            this.request.resolve($.extend({}, this.status));
        }).fail(function() {
            this.request.reject('fail');
        }).always(function() {
            this.request = null;
        });
        return this.request;
    },
    loopStatus: function() {
        // Only one looper in a period.
        if (this.looper) {
            // Refresh start time
            this.looper.start = new Date().getTime();
            return this.looper;
        }
        var looper = this.looper = $.Deferred();
        // Start time, recoding for timeout
        looper.start = new Date().getTime();
        var interval = 3000;
        var fn = bindContext(function() {
            this.queryStatus().always(function() {
                // looper should be resolved during queryStatus's 'done' callback along with status changing
                if (looper.state() === 'resolved' || looper.state() === 'rejected') {
                    return;
                }
                // looper can only be reject by timeout
                if (new Date().getTime() - looper.start >= 60000) {
                    looper.reject('timeout');
                }
                else {
                    // no status change, no timeout, keep looping.
                    timer = setTimeout(fn, interval);
                }
            });
        }, this);
        var timer = setTimeout(fn, interval);
        looper.always(bindContext(function() {
            this.looper = null;
        }, this));
        return looper;
    }
});

var editor = $.extend($({}), {
    options: {
        // validation function
        check: function() { return true; },
        title: '',
        content: ''
    },
    init: function(options){
        if (this.$el) {
            return this;
        }
        // Override options
        $.extend(this.options, options);
        // Insert Editor HTML into bottom of body
        this.$el = $(template(editorTemplate, this.options.title, this.options.content)).appendTo(document.body);
        this.$content = this.$el.find('.content');
        this.el = this.$el[0];
        // for browser not supporting placeholder
        if (!('placeholder' in document.createElement('input'))) {
            $('<div class="tip">' + this.$content.attr('placeholder') + '</div>').insertBefore(this.$content);
        }
        // Binding events
        this.$el.on('click.wdss-editor', '.submit', bindContext(function(e) {
            if (this.options.check()) {
                var defer = $.Deferred();
                $(e.currentTarget).text('分享中');
                defer.done(bindContext(function() {
                    this.$content.val('');
                    this.close();
                }, this));
                this.trigger('send', [this.$content.val(), defer]);
            }
            else {
                this.warningOn();
            }
        }, this));
        return this;
    },
    open: function(title, content){
        this.$el.find('.dialog .hd .title').text(title || this.options.title);
        if (!this.$content.val()) {
            this.$content.val(content || this.options.content);
        }
        this.$el.find('.submit').text('分享');
        this.$el.show();
        $(document).on('click.wdss-editor', '.wdss-editor .mask, .wdss-editor .dialog .close', bindContext(this.close, this));
        return this;
    },
    close: function(){
        this.$el.hide();
        $(document).off('.wdss-editor');
        return this;
    },
    warningOn: function(){
        this.$el.find('.warning').addClass('on');
    },
    warningOff: function(){
        this.$el.find('.warning').removeClass('on');
    },
    destroy: function(){
        this.close();
        this.$el.remove();
        this.$el = this.el = this.$content = this.options = null;
        return this;
    }
});

var indicator = {
    options: {
        el: null,
        count: null,
        // trigger will not toggle enable/disable status.
        trigger: false,
        title: '',
        content: '',
        type: 'app',
        'package': ''
    },
    init: function(options) {
        if (this.$el) {
            return this;
        }
        if (!options.el) {
            $.error('You have to indicate an element for applying this component.');
        }
        this.id = uniqueID();
        this.options = $.extend({}, this.options, extractDataAttr(options.el, this.options), options);
        this.el = this.options.el;
        this.$el = $(this.el);
        // indicator status may not sync with server status.
        this.platformStatus = {};

        this.$el.on('click.wdss-indicator', '[data-wdshare-platform]', bindContext(function(e) {
            var platform = $(e.currentTarget).data('wdshare-platform');

            if (this.options.trigger) {
                this.trigger('open-editor', [platform, this.options.title, this.options.content, this.options.type, this.options.package]);
                e.preventDefault();
            }
            if (this.platformStatus[platform]) {
                // generally, if a platform indicator is enabled, the server status is bound.
                defer(this.disable, this, platform);
            }
            else {
                // enable a platform has to assure server status is bound.
                // only user interaction can trigger the binding popup,
                // or this should be populated in 'enable' method

                if (!Communicator.isEnabled(productToPlatform[platform])) {
                    // if status changes, 'enable' event will be triggered, then enable method be called.
                    Communicator.loopStatus();
                }
                else {
                    defer(this.enable, this, platform);
                }
            }
        }, this));

        this.on('enable.wdss-indicator disable.wdss-indicator', bindContext(function(e, platform) {
                // UI modification actions.
                if (!this.options.trigger) {
                    this.icon(platform).toggleClass('off', e.type === 'disable');
                }
            }, this)).
            on('enable.wdss-indicator', bindContext(function(e, platform) {
                if (platform === 'tqq') {
                    this.enable('qzone');
                }
            }, this)).
            on('disable.wdss-indicator', bindContext(function(e, platform) {
                if (platform === 'qzone' && this.isEnabled('tqq')) {
                    this.disable('tqq');
                }
            }, this));

        Communicator.on('enable.' + this.id + ' disable.' + this.id, bindContext(function(e, platform) {
            var action = e.type === 'enable' ? 'enable' : 'disable';
            switch (platform) {
                case 'sina':
                    this[action]('weibo');
                    break;
                case 'qq':
                    this[action]('qzone')[action]('tqq');
                    break;
                case 'renren':
                    this[action]('renren');
                    break;
            }
        }, this));
        this.reset();
        Communicator.queryStatus();

        if (this.options.count) {
            this.$el.find('.wdss-platform-indicator').after(template(statisticTemplate, formatNumber(this.options.count), this.options.count));
        }
        return this;
    },
    destroy: function(){
        Communicator.off('.' + this.id);
        this.off('.wdss-indicator');
        this.$el.off('.wdss-indicator');
        this.$el.remove();
        this.$el = this.el = this.options = null;
        return this;
    },
    status: function(){
        var result = [];
        for (var platform in this.platformStatus) {
            if (this.isEnabled(platform)) {
                if (platform === 'weibo') {
                    result.push('sina');
                }
                else {
                    result.push(platform);
                }
            }
        }
        return result;
    },
    isEnabled: function(platform) {
        return this.platformStatus[platform];
    },
    enable: function(platform) {
        this.icon(platform).removeAttr('href target');
        this.platformStatus[platform] = true;
        this.trigger('enable', platform);
        return this;
    },
    disable: function(platform) {
        if (!Communicator.isEnabled(productToPlatform[platform])) {
            if($.cookie('wdj_auth')) {
                this.icon(platform).attr({
                    href: 'http://account.wandoujia.com/v1/user/?do=bind&callback=close&platform=' + productToPlatform[platform],
                    target: '_blank'
                });
            } else {
                this.icon(platform).attr({
                    href: 'http://account.wandoujia.com/v1/user/?do=login&callback=close&platform=' + productToPlatform[platform],
                    target: '_blank'
                });
            }

        }    

        this.platformStatus[platform] = false;
        this.trigger('disable', platform);
        return this;
    },
    reset: function(){
        if (Communicator.isEnabled('sina')) {
            this.enable('weibo');
        }
        else {
            this.disable('weibo');
        }
        if (Communicator.isEnabled('renren')) {
            this.enable('renren');
        }
        else {
            this.disable('renren');
        }
        if (Communicator.isEnabled('qq')) {
            this.enable('qzone').enable('tqq');
        }
        else {
            this.disable('qzone').disable('tqq');
        }
    },
    icon: function(platform) {
        return this.$el.find(platform ? ('[data-wdshare-platform="' + platform + '"]') : '[data-wdshare-platform]');
    }
};

var sharePlugin = $.extend($({}), {
    packageName: '',
    type: '',
    request: null,
    options: {
        trigger: '[data-wdshare-trigger]'
    },
    init: function(options){
        $.extend(this.options, options);
        // init components
        this.editor = editor.init({
            check: bindContext(function() {
                return !!this.indicator.wdSharingIndicator('status').length;
            }, this)
        });
        this.indicator = this.editor.$el.find('.wdss-container').wdSharingIndicator();
        this.triggers = $(this.options.trigger).wdSharingIndicator({ trigger: true });

        this.triggers.wdSharingIndicator('on', 'open-editor.wdss-plugin', bindContext(function(e, platform, title, content, type, packageName) {
            this.packageName = packageName;
            this.type = type;
            this.editor.open(title, content);
            if (Communicator.isEnabled(productToPlatform[platform])) {
                this.indicator.wdSharingIndicator('enable', platform);
            }
        }, this));
        this.indicator.wdSharingIndicator('on', 'enable.wdss-plugin', bindContext(function() {
            this.editor.warningOff();
        }, this));
        this.editor.on('send', bindContext(function(e, content, defer) {
            var params = {
                'source_platform': 'web',
                'target_platforms': this.indicator.wdSharingIndicator('status').join(','),
                'user_comment': content,
                'content': this.packageName,
                'content_type': this.type
            };
            if (this.request) {
                this.request.abort();
            }
            this.request = $.ajax({
                url: 'http://social-services.wandoujia.com/sharejsonp',
                data: params,
                dataType: 'jsonp'
            }).done(bindContext(function() {
                this.indicator.wdSharingIndicator('reset');
                defer.resolve();
            }, this)).always(bindContext(function() {
                this.request = null;
                defer.reject();
            }, this));
        }, this));

        return this;
    },
    destroy: function() {
        this.triggers.wdSharingIndicator('off', '.wdss-plugin').wdSharingIndicator('destroy');
        this.indicator.wdSharingIndicator('off', '.wdss-plugin').wdSharingIndicator('destroy');
        this.editor.off('.wdss-plugin').destroy();
        this.triggers = this.indicator = this.editor = null;
    }
});

// apply a plugin object to jQuery prototype
var pluginFactory = function(namespace, plugin, createNew) {
    $.fn[namespace] = function(method) {
        var returnValue = [];
        var args = Array.prototype.slice.call(arguments, 1);
        this.each(function() {
            var instance = $.data(this, namespace);
            var options, ret;
            if ( typeof method === 'object' || !method ) {
                if (createNew) {
                    if (instance) {
                        instance.destroy();
                    }
                    instance = $.extend($({}), createObject(plugin));
                }
                else if (!instance) {
                    instance = plugin;
                }
                options = method || {};
                options.el = this;
                instance.init.apply(instance, [options].concat(args));
                $.data(this, namespace, instance);
            }
            else if (instance) {
                if (instance[method]) {
                    ret = instance[method].apply(instance, args);
                    if (ret !== instance) {
                        returnValue.push(ret);
                    }
                }
                else {
                    $.error( 'Method ' +  method + ' does not exist on jQuery.' + namespace );
                }
            }
            else {
                $.error('Please create ' + namespace+ ' with .' + namespace + '(options) first.');
            }
        });
        return returnValue.length ? returnValue[0] : this;
    };
};

pluginFactory('wdSharingIndicator', indicator, true);
pluginFactory('wdShare', sharePlugin);

})(jQuery);