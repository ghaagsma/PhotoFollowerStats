(function () {
    'use strict';

    const ipcRenderer = require('electron').ipcRenderer;

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
            ipcRenderer.on('user-authorized', function (event, arg) {
                setUserData(arg);
                initializeView();
            });
            ipcRenderer.send('authorize-user');
        } else {
            initializeView();
        }
    }

    function setUserData(data) {
        if(!data || !data.access_token || !data.user) {
            // TODO: Handle erroneous user data
        }

        token = data.access_token;
        user = data.user;
        window.localStorage.setItem('igAccessToken', token);
        window.localStorage.setItem('igUser', JSON.stringify(user));
    }

    function initializeView() {
        var element = document.querySelector('#main-view');
        element.innerHTML = getViewMarkupForUser(user);
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
            <div id="ig-data">Loading...</div>
        `;
    }
}());
