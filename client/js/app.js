(function () {
    'use strict';

    init();

    // *****************************************
    // Helper Methods
    // *****************************************

    function init() {
        // Debug flag for logging
        logger.setDebug(true);

        // Show loader while retrieving data
        renderer.render('#main', globalTemplates.loader());

        // Get data from existing session
        let token = storage.getAccessToken(),
            user = storage.getUser();

        // Request and receive the user data from Electron main process
        if (!token || !user) {
            serverMessages.listen(serverMessages.USER_AUTHORIZED,
                function (event, data) {
                    setAccessToken(data);
                    userController.init();
                });
            serverMessages.send(serverMessages.AUTHORIZE_USER);
        } else {
            userController.init();
        }
    }

    function setAccessToken(data) {
        if (!data || !data.access_token || !data.user) {
            return renderError();
        }
        storage.setAccessToken(data.access_token);
        storage.setUser(data.user);
    }

    function renderError() {
        renderer.render(
            '#main',
            dashboardTemplates.error()
        );
    }
}());
