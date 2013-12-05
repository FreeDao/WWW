+function($){ 

  "use strict";

  var Tab = function(element){
      this.element = $(element);
  };

  Tab.prototype.show = function(){
      
      var $this = this.element,
          $ul = $this.closest('ul'),
          //先取data-target
          selector = $this.attr('data-target');

      //没有就取href的，推荐href写法
      if(!selector){
          selector = $this.attr('href');
          selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '');
      }

      //判断是否已经是active状态
      if($this.parent('li').hasClass('active')){
          return;
      }

      var previous = $ul.find('.active:last a')[0];

      //自定义事件入口
      var e = $.Event('show.tab', {
          relatedTarget: previous
      });

      $this.trigger(e);


      if (e.isDefaultPrevented()){
          return;
      }

      //对应tab的内容部分
      var $target = $(selector);

      //处理li的active
      this.activate($this.parent('li'), $ul);


      //处理tab的内容部分的active
      this.activate($target, $target.parent(),function(){
          //自定义事件入口
          $this.trigger({
              type: 'shown.tab',
              relatedTarget: previous
          });

      });
  }


  Tab.prototype.activate = function(element,container,callback){

      var $active = container.find('> .active');
      var transition = callback
          && $.support.transition
          && $active.hasClass('fade');

      function next(){
          $active.removeClass('active');

          element.addClass('active');

          if(transition){
              element[0].offsetWidth; // reflow for transition
              element.addClass('in');
          }else{
              element.removeClass('fade');
          }

          callback && callback();
      
      }

      transition ?
        $active
          .one($.support.transition.end, next)
          .emulateTransitionEnd(150) :
        next();

      $active.removeClass('in');

  }



  //tab常规插件
  $.fn.tab = function(option){

    return this.each(function(){
        var $that = $(this),
            data  = $that.data('tab');

        if (!data){
            $that.data('tab', (data = new Tab(this)));
        }

        if(typeof option == 'string'){
            data[option]();
        }

    });

  }

  $.fn.tab.Constructor = Tab;

  //自动绑定初始化
  //data-toggle="tab"
  $(document).on('click','[data-toggle="tab"]',function (e) {
      e.preventDefault();
      $(this).tab('show');
  });

}(window.jQuery);
