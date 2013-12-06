define(['jquery', 'suggestion','placeholder'],function(){
    var searchForm = $('.search-ipt'),
        searchIpt = $('.search-ipt');
    // 搜索提示
    searchIpt.suggestion().placeholder();

});