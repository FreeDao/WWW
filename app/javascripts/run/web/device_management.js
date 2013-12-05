DeviceCenterWidget.define('www/device/management', ['devicecenter', 'data/user', 'data/cookie', 'config', 'util', 'data/ga'], function(DeviceCenter, User, Cookie, Config, Util, GA) {

return function() {

    $('.wrapper').first().append('<h2 class="dcw-dm-title">管理设备</h2><p class="dcw-dm-intro">这里列出了您使用豌豆荚 Android 版上登录过的设备，您可以向这些设备推送应用。<br>不再使用的设备，请您在手机上退出登录后在这里删除。</p><table class="dcw-dm-devices-grid"></table><div class="dcw-dm-new-device">添加新设备</div>');

    User.subscribe('init', function(devices) {
        renderGrid(devices);
    });
    User.subscribe('update', function(devices) {
        renderGrid(devices);
    });
    User.subscribe('online', function(deviceId) {
        $('.dcw-dm-devices-grid .device[data-did="' + deviceId + '"]').addClass('online');
    });
    User.subscribe('offline', function(deviceId) {
        $('.dcw-dm-devices-grid .device[data-did="' + deviceId + '"]').removeClass('online');
    });

    $('.dcw-dm-devices-grid').
        on('click', '.device .remove',  function() {
            var deviceEl = $(this).closest('.device[data-did]');
            var did = deviceEl.data('did');
            $.when(removeDevice(did), clearOfflinePushApps(did)).
                then(function() {
                    GA.event('manage:delete_device');
                    if (deviceEl.data('did') === User.getCurrentDevice().dev_id) {
                        Cookie.remove(Config.user.CURRENT_DEVICE_COOKIE + '_' + User.getAccountInfo().uid, {
                            path: '/',
                            domain: 'wandoujia.com'
                        });
                    }
                    // window.location = window.location;
                    Util.refreshWindow();
                });
        });
    $('.dcw-dm-new-device').on('click', function() {
        DeviceCenter.guide.start();
        GA.event('manage:add_device');
    });


    var renderGrid = function(devices) {
        var rowNum = Math.ceil(devices.length / 3);
        var i, j, device, smallicon;
        var html = [];
        for (i = 0; i < rowNum; i++) {
            html.push('<tr>');
            for (j = 0; j < 3; j++) {
                device = devices[i * 3 + j];
                if (device) {
                    html.push('<td><div class="device', device.online ? ' online' : '', '", data-did="', device.dev_id, '">');
                    if(device.phoneinfo) {
                        smallicon = device.phoneinfo.smallicon;
                    } else {
                        smallicon = '';
                    }
                    html.push('<div class="thumb"><img src="', smallicon, '" alt="', device.model, '"></div>');
                    html.push('<div class="name">', device.model, '</div>');
                    html.push('<div class="status"><span class="on">在线</span><span class="off">不在线</span></div>');
                    html.push('<div class="remove">删除设备</div>');
                    html.push('</div></td>');
                }
                else {
                    html.push('<td><div class="device"></div></td>');
                }
            }
            html.push('</tr>');
        }
        $('.dcw-dm-devices-grid').html(html.join(''));
    };

    var removeDevice = function(deviceId) {
        var deferred = $.Deferred();
        if (confirm('确定要删除这台设备吗?')) {
            $.ajax({
                dataType: 'jsonp',
                url: Config.service.ACCOUNT_URL,
                data: {
                    'do': 'device',
                    'del': deviceId
                },
                success: function(data) {
                    if (data) {
                        deferred.resolve();
                    }
                    else {
                        deferred.reject();
                    }
                },
                error: function() {
                    deferred.reject();
                }
            });
        }
        else {
            deferred.reject();
        }
        return deferred.promise();
    };

    var clearOfflinePushApps = function(deviceId) {
        var deferred = $.Deferred();
        $.ajax({
            type: 'post',
            url: Config.service.OFFLINE_CLEAR_URL,
            data: {
                did: deviceId
            },
            success: function(resp) {
                if (resp.error === 0) {
                    deferred.resolve();
                }
                else {
                    deferred.reject();
                }
            },
            error: function() {
                deferred.reject();
            }
        });
        return deferred.promise();
    };

    var devices = User.getDevice();
    if (devices.length) {
        renderGrid(devices);
    }

};

});

