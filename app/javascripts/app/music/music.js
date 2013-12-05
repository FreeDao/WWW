/**
 * @desc 音乐搜索 onebox
 * @author leplay
 */
(function($) {
    $.fn.extend({
        musicOnebox: function(options) {

            var _key = $('.search-ipt').val();

            $.ajax({
                type : 'get',
                url : 'http://music.wandoujia.com/api?jsonp=?&word=' + _key,
                dataType : 'jsonp',
                success : function(data) {
                    if(typeof(data) == 'object') {
                        formatSong(data);
                        _gaq.push(['_trackEvent', 'Music Search Onebox', 'music', 'load']);
                        _gaq.push(['_trackEvent', 'Music Search Onebox', 'musicName', _key]);
                    }
                    else {
                        return;
                    }
                }
            });

            $('.music-btn').live('click', function() {
                var tmp = $(this).data('down').split(','),
                    rid = tmp[0].substring(10, tmp[0].length-1),
                    md5str = tmp[1].substring(1, tmp[1].length-1),
                    songName = tmp[2].substring(1, tmp[2].length-1),
                    art = tmp[3].substring(1, tmp[3].length-1),
                    size = tmp[4].substring(1, tmp[4].length-1),
                    album = tmp[5].substring(1, tmp[5].length-2);
                    commdown(rid,md5str,songName,art,size,album);
            });

            var formatSong = function(data) {
                kuwo = data['result'];
                $('.kuwo-count').text(data['result'].length);
                $('.kuwo-highlight').text(_key);
                $('#kuwo').show();

                var template = _.template('<tr><td class="music-name"><%= songname %></td><td class="music-artist"><%= artist %></td><td class="music-album"><%= album %></td><td class="music-download"><a class="music-btn" href="#" rel="download" data-down="<%= commdown %>">下载</a></td></tr>');

                for(i=0; i<kuwo.length; i++) {
                    playlist = template({songname: kuwo[i]['songname'], artist: kuwo[i]['singer'], album: kuwo[i]['album'], commdown: kuwo[i]['url']});
                    $('#kuwo tbody').append(playlist);
                }

            },

            commdown = function(rid,md5str,songName,art,size,album) {
                var mp3url="http://play.kuwo.cn/play/st/GetMusicPath?src=91&mid="+rid+"&ext=mp3&key="+md5str;
                var song={
                    "url": mp3url,
                    "title": songName,
                    "artist": art,
                    "album": album,
                    "format" : "mp3",
                    "from": "kuwo"
                };

                _gaq.push(['_trackEvent', 'Music Search Onebox', 'music', 'down']);
                _gaq.push(['_trackEvent', 'Music Search Onebox', 'musicDown', _key]);

                window.externalCall('portal','-musicurlarray',JSON.stringify([song]));
            };


        }
    });
})(jQuery);