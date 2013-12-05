+function($){

  "use strict";

  var Modal = function (element, options) {
    this.options   = options;
    this.$element  = $(element);
    this.$backdrop = null;
    this.isShown   = null;
  };

  Modal.DEFAULTS = {
      backdrop: true,  //默认支持mask
      keyboard: true,  //默认支持键盘
      show: true
  };


  //显示
  Modal.prototype.show = function (_relatedTarget) {
    var that = this,
        e = $.Event('show.modal', { relatedTarget: _relatedTarget });

    this.$element.trigger(e);

    if(this.isShown || e.isDefaultPrevented()){
      return;
    }  

    this.isShown = true;

    this.escape();

    //给关闭按钮绑定事件
    this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this));

    this.backdrop(function(){

      var transition = $.support.transition && that.$element.hasClass('fade');

      if(!that.$element.parent().length){
         that.$element.appendTo(document.body); // don't move modals dom position
      }

      that.$element.show();

      if(transition){
        that.$element[0].offsetWidth // force reflow
      }

      that.$element.addClass('in').attr('aria-hidden', false);

      var e = $.Event('shown.modal',{
          relatedTarget: _relatedTarget
      });

      transition ?
        that.$element.one($.support.transition.end, function () {
            that.$element.focus().trigger(e);
          })
          .emulateTransitionEnd(300) :
        that.$element.focus().trigger(e);
    
    });

  }

  Modal.prototype.hide = function (e) {
    if(e){
      e.preventDefault();
    }  

    e = $.Event('hide.bs.modal');

    this.$element.trigger(e);

    if(!this.isShown || e.isDefaultPrevented()){
      return;
    }  

    this.isShown = false;

    this.escape();

    this.$element.removeClass('in').attr('aria-hidden', true).off('click.dismiss.modal');

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one($.support.transition.end, $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal();
  }

  

  Modal.prototype.escape = function(){
    if(this.isShown && this.options.keyboard){
      this.$element.on('keyup.dismiss.bs.modal',$.proxy(function(e){
        e.which == 27 && this.hide();
      }, this));
    }else if(!this.isShown){
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  //hideModal 其实是remove
  Modal.prototype.hideModal = function(){
    var that = this;

    //关闭的事件入口
    that.$element.trigger('hidden.modal');

    that.$element.remove();
            
    that.backdrop(function(){
        that.removeBackdrop();
    });

  }

  Modal.prototype.removeBackdrop = function(){
    this.$backdrop && this.$backdrop.remove();
    this.$backdrop = null;
  }


  //创建阴影mask
  Modal.prototype.backdrop = function (callback) {
    var that = this,
        animate = that.$element.hasClass('fade') ? 'fade' : '';

    if (this.isShown && this.options.backdrop) {

      var doAnimate = $.support.transition && animate;

      //绑$backdrop
      this.$backdrop = $('<div class="modal-mask ' + animate + '" />').appendTo(document.body);

      //给backdrop加上点击浮层调用hide
      this.$backdrop.on('click',$.proxy(this.hide, this));


      this.$element.on('click.dismiss.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this));

      if(doAnimate){
        this.$backdrop[0].offsetWidth; // force reflow
      }  

      this.$backdrop.addClass('in');

      if(!callback){
        return;
      }  

      doAnimate ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback();

    } else if (!this.isShown && this.$backdrop) {
      
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback();

    } else if (callback) {
      callback();
    }
  }




  $.fn.modal = function(option, _relatedTarget){
    
    return this.each(function(){
      
      var $this = $(this),
          data = $this.data('bs.modal'),
          options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option);

      if(!data){
          $this.data('bs.modal', (data = new Modal(this, options)))
      }
          
      if(typeof option == 'string'){
          data[option](_relatedTarget);
      }else if(options.show){
          data.show(_relatedTarget);
      }

    });

  }

  $.fn.modal.Constructor = Modal;


}(window.jQuery);
