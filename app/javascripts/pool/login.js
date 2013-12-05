(function() {
    $(document).ready(function() {
        SnapPea.Account.checkUserLoginAsync({jsonp: !!($.browser.msie && $.browser.version.split(".")[0] < 7)})
        .then(function() {
            DeviceCenter._signScanner.publish('ready');
        }).fail(function() {
            DeviceCenter._signScanner.publish('welcome');
        });

        $('body').on('click', '.login-button', function(e) {
            e.preventDefault();
            SnapPea.AccountHook.open({
                name: 'login',
                popup: !($.browser.msie && $.browser.version.split(".")[0] < 7),
                callback: function() {
                    SnapPea.Account.checkUserLoginAsync({jsonp: !!($.browser.msie && $.browser.version.split(".")[0] < 7)})
                    .then(function() {
                        DeviceCenter._signScanner.publish('ready');
                        if (typeof window.updateUserStatus === 'function') {
                            window.updateUserStatus();
                        }
                    }).fail(function() {
                    });
                }
            });
        });
    });
})();