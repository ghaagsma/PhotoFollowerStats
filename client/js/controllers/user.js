var userController;

(function () {
    'use strict';

    if (!!userController) {
        return logger.errorGlobalConflict('userController');
    }

    // Module to make api requests
    const request = require('superagent');

    // *****************************************
    // Interface
    // *****************************************

    userController = {
        init: init
    };

    // *****************************************
    // Helper Methods
    // *****************************************

    function init() {
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
