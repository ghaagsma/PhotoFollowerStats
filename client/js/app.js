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
                    onUserAuthorized();
                });
            serverMessages.send(serverMessages.AUTHORIZE_USER);
        } else {
            onUserAuthorized();
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

    function onUserAuthorized() {
        let token = storage.getAccessToken(),
            user = storage.getUser();

        renderer.render('#main', dashboardTemplates.user(user));

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
        renderer.insert('#ig-user-media', user.counts.media);
        renderer.insert('#ig-user-followed-by', user.counts.followed_by);
        renderer.insert('#ig-user-follows', user.counts.follows);
        renderer.addClass('.ig-user-stats', 'in');
    }

    function handleFollowedByData(err, response) {
        logger.log('Followed by: ' + JSON.stringify(response.body));
    }

    function handleFollowsData(err, response) {
        logger.log('Follows: ' + JSON.stringify(response.body));
    }
}());
