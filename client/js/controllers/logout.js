var logoutController;

(function () {
    'use strict';

    if (!!logoutController) {
        return logger.errorGlobalConflict('logoutController');
    }

    logoutController = {
        logout: function () {
            window.localStorage.clear();
            serverMessages.listen(serverMessages.USER_UNAUTHORIZED,
                function (event, data) {
                    window.location.reload();
                });
            serverMessages.send(serverMessages.UNAUTHORIZE_USER);
        }
    };
}());
