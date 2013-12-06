/**
 * 
 * @desc beta版本体验下载langing page业务
 * @author jintian
 */
$(function(){
	
	// bind event on download button 
	$('#wd-btn').bind('click',function(e){
		e.preventDefault();
		// 添加下载次数统计
        _gaq.push(['_trackEvent', "download", "client2", "page_beta"]);
		$('#wd-form').submit();   				
		
	});
	
});