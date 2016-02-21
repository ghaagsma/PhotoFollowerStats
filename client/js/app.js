(function () {
    'use strict';

    // Module to make api requests
    const request = require('superagent');

    init();

    // *****************************************
    // Helper Methods
    // *****************************************

    function init() {
        // Debug flag for logging
        logger.setDebug(true);

        // Get data from existing session
        let token = storage.getAccessToken(),
            user = storage.getUser();

        // Request and receive the user data from Electron main process
        if (!token || !user) {
            serverMessages.listen(serverMessages.USER_AUTHORIZED,
                function (event, data) {
                    setAccessToken(data);
                    getData();
                });
            serverMessages.send(serverMessages.AUTHORIZE_USER);
        } else {
            getData();
        }
    }

    function setAccessToken(data) {
        if (!data || !data.access_token) {
            return renderError();
        }
        storage.setAccessToken(data.access_token);
    }

    function renderError() {
        renderer.render(
            '#main',
            dashboardTemplates.error()
        );
    }

    function getData() {
        let token = storage.getAccessToken(),
            user = storage.getUser();

        request.get(
            'https://api.instagram.com/v1/users/self/?access_token=' + token
        ).end(handleUserData);

        request.get(
            'https://api.instagram.com/v1/users/self/followed-by/?access_token=' + token
        ).end(handleFollowedByData);

        request.get(
            'https://api.instagram.com/v1/users/self/follows/?access_token=' + token
        ).end(handleFollowsData);
    }

    function handleUserData(err, response) {
        // logger.log('User data: ' + JSON.stringify(response.body));
        let user = response && response.body && response.body.data;
        if (err || !user || !user.counts) {
            return renderError();
        }
        setUser(user);
    }

    function setUser(user) {
        storage.setUser(user);
        renderer.render(
            '#main',
            dashboardTemplates.user(user)
        );
    }

    function handleFollowedByData(err, response) {
        logger.log('Followed by: ' + JSON.stringify(response.body));
    }

    function handleFollowsData(err, response) {
        logger.log('Follows: ' + JSON.stringify(response.body));
    }
}());
