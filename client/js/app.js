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
        let token = storage.get('igAccessToken'),
            user = storage.getObject('igUser');

        setHeaderView();

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

    // Set header template in the view
    function setHeaderView() {
        let headerElement = document.querySelector('#header');
        headerElement.innerHTML = getHeaderTemplate();
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
                <div class="ig-user-summary">
                    <div class="ig-username">${user.username}</div>
                    <div class="ig-user-bio">${user.bio}</div>
                    <div class="ig-user-stats"></div>
                </div>
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
        logger.log('User data: ' + JSON.stringify(response.body));
        if (err || !response || !response.body || !response.body.data ||
            !response.body.data.counts) {
            // TODO
            return;
        }
        let element = document.querySelector('.ig-user-stats');
        element.innerHTML = getUserStatsTemplate(response.body.data.counts);
    }

    function getUserStatsTemplate(stats) {
        return `
            <div><span>${stats.media}</span> posts</div>
            <div><span>${stats.followed_by}</span> followers</div>
            <div><span>${stats.follows}</span> following</div>
        `;
    }

    function handleFollowedByData(err, response) {
        logger.log('Followed by: ' + JSON.stringify(response.body));
    }

    function handleFollowsData(err, response) {
        logger.log('Follows: ' + JSON.stringify(response.body));
    }
}());
