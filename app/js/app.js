(function () {
    'use strict';

    // Module to make api requests
    const request = require('superagent');

    // Debug flag for logging
    let debug = true;

    init();

    // *****************************************
    // Helper Methods
    // *****************************************

    function log(message) {
        if (debug) {
            console.log(message);
        }
    }

    function init() {
        // Get data from existing session
        let token = storage.get('igAccessToken'),
            user = storage.getObject('igUser');

        // Request and receive the user data from Electron main process
        if (!token || !user) {
            serverMessages.listen(serverMessages.USER_AUTHORIZED,
                function (event, data) {
                    setUserData(data);
                    onUserAuthorized();
                });
            serverMessages.send(serverMessages.AUTHORIZE_USER);
        } else {
            onUserAuthorized();
        }
    }

    function setUserData(data) {
        if (!data || !data.access_token || !data.user) {
            return renderError();
        }
        storage.set('igAccessToken', data.access_token);
        storage.setObject('igUser', data.user);
    }

    function renderError() {
        var element = document.querySelector('#main-view');
        element.innerHTML = 'Oops! There was an error getting the user data ' +
            'from Instagram. Please try again.';
    }

    function onUserAuthorized() {
        var element = document.querySelector('#main-view');
        element.innerHTML = getViewMarkupForUser(storage.getObject('igUser'));
        getData();
    }

    function getViewMarkupForUser(user) {
        return `
            <div class="ig-user">
                <img class="ig-profile-pic"
                     src="${user.profile_picture}"
                     alt="User profile picture" />
                <div class="ig-username">${user.username}</div>
                <div>${user.bio}</div>
            </div>
            <div id="ig-data"></div>
        `;
    }

    function getData() {
        let token = storage.get('igAccessToken');

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
        log('User data: ' + JSON.stringify(response.body));
        if (err) {
            // TODO
        }
    }

    function handleFollowedByData(err, response) {
        log('Followed by: ' + JSON.stringify(response.body));
    }

    function handleFollowsData(err, response) {
        log('Follows: ' + JSON.stringify(response.body));
    }
}());
