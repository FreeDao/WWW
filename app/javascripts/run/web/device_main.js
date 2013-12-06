$(function() {
    var wrapper = $('.wrapper');
    if (wrapper.hasClass('device-management')) {
        DeviceCenterWidget.require(['www/device/management'], function(DevicesManagement) {
            DevicesManagement();
        });
    }
    else if (wrapper.hasClass('device-pushed-apps')) {
        DeviceCenterWidget.require(['www/device/apps'], function(PushedApps) {
            PushedApps();
        });
    }
});