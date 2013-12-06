define(['jquery', 'q', 'device', 'exports'],function($, Q, device, exports){
    

    exports.init = function(callback){
        // app push initlization
        DeviceCenterWidget.require(['devicecenter'], function(DeviceCenter){

            window.DeviceCenter = DeviceCenter;
    
            window.Q = Q;

            require(['login-kit']);

            DeviceCenter.render('#device-info');
            
            if('function' === typeof callback){
                callback(DeviceCenter);
            }
        });
    }
});