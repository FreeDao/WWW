define(['jquery'],function(){
    var pn = $('body').data('pn'),
        data = [{                                                            // 微信30天的下载量
        params : {                                           
            pn : pn,
            // model : 'I9300',
            day : '7'
        },
        chartType : 'timeline',
        dataType : 'downloads',
        container : 'dashboard-dl',
        tooltipStr : ['次下载']
    },{                                                            // 微信30天的下载量
        params : {                                           
            pn : pn,
            max : 5,
            day : '7'
        },
        chartType : 'bar',
        dataType : 'favoriteModel',
        container : 'dashboard-model'
    }];
    if(!$.browser.msie){
        require(['http://s.wdjimg.com/idx/v1/dist/svg/dashboard.min.js?v=031501'], function(){
            Dashboard.require(['svg/dashboard'], function(dashboard) {
                dashboard.getInstance().draw(data);
            });
        });
    }else{
        $('.dashboard').remove();
    }
});