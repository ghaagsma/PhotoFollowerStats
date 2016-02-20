var logout;

(function () {
    'use strict';

    logout = function () {
        window.localStorage.clear();
        serverMessages.listen(serverMessages.USER_UNAUTHORIZED,
            function (event, data) {
                window.location.reload();
            });
        serverMessages.send(serverMessages.UNAUTHORIZE_USER);
    };
}());
