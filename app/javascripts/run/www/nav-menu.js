define(['jquery'],function($){
    /**
     * @name zhangyaochun
     * 优化了维护成本，设计如下：
     * path_obj的key为path，value为dom的className
     */
    var path = location.pathname,
        path_obj = {
           '/apps' : '.cat-apps',
           '/tag/app' : '.cat-app',
           '/tag/game' : '.cat-game',
           '/special' : '.cat-special',
           '/top' : '.cat-top',
           '/award' : '.cat-award' 
        };
    $(path_obj[path]).addClass('current');
});
