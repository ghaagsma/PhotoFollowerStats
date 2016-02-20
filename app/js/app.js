(function () {
    'use strict';

    // Module to communicate with the server main process
    const ipcRenderer = require('electron').ipcRenderer;

    // Module to make api requests
    const request = require('superagent');

    // Get data from existing session
    let token = window.localStorage.getItem('igAccessToken'),
        user = getUserFromStorage();

    init();

    // *****************************************
    // Helper Methods
    // *****************************************

    function getUserFromStorage() {
        let userJson = window.localStorage.getItem('igUser');
        return !!userJson ? JSON.parse(userJson) : null;
    }

    function init() {
        // Request and receive the user data from Electron main process
        if (!token || !user) {
            ipcRenderer.on('user-authorized', function (event, data) {
                setUserData(data);
                onUserAuthorized();
            });
            ipcRenderer.send('authorize-user');
        } else {
            onUserAuthorized();
        }
    }

    function setUserData(data) {
        if (!data || !data.access_token || !data.user) {
            return renderError();
        }

        token = data.access_token;
        user = data.user;
        window.localStorage.setItem('igAccessToken', token);
        window.localStorage.setItem('igUser', JSON.stringify(user));
    }

    function renderError() {
        var element = document.querySelector('#main-view');
        element.innerHTML = 'Oops! There was an error getting the user data ' +
            'from Instagram. Please try again.';
    }

    function onUserAuthorized() {
        var element = document.querySelector('#main-view');
        element.innerHTML = getViewMarkupForUser();
        getData();
    }

    function getViewMarkupForUser() {
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
        request.get('https://api.instagram.com/v1/users/self/?access_token=' + token)
            .end(handleUserData);
        request.get('https://api.instagram.com/v1/users/self/followed-by/?access_token=' + token)
            .end(handleFollowedByData);
        request.get('https://api.instagram.com/v1/users/self/follows/?access_token=' + token)
            .end(handleFollowsData);
    }

    function handleUserData(err, response) {
        console.log('User data: ' + JSON.stringify(response.body));
        if (err) {
            // TODO
        }
    }

    function handleFollowedByData(err, response) {
        console.log('Followed by: ' + JSON.stringify(response.body));
    }

    function handleFollowsData(err, response) {
        console.log('Follows: ' + JSON.stringify(response.body));
    }
}());
