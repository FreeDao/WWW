var doc = $(document),
    win = $(window),

    pageCol = 4,

    resizeCols = function(app){
        var allApps = $('.app-s'),
            index = allApps.index(app),
            baseIndex = Math.floor(index / pageCol) * pageCol,
            targetApps = baseIndex == 0 ? allApps.filter(':lt(' + pageCol + ')') : allApps.filter(':gt(' +  (baseIndex - 1) + '):lt(' + pageCol + ')');

        targetApps.css('height', 'auto');
        targetApps.css('height', $(_.max(targetApps, function(app){
            return $(app).height();
        })).height());
    },
    resizeAll = function(){
        _.each( $('.app-s:nth-child(' + pageCol + 'n)'), function(app, index){
            resizeCols($(app));
        });
    };

$(function(){
    resizeAll();
    win.on('resize',resizeAll);
});