var getHeaderTemplate;

(function () {
    'use strict';

    getHeaderTemplate = function () {
        return `
        <div class="header-content">
            <div class="logo">
                Photo Follower Stats
            </div>
            <div class="logout" onclick="logoutController.logout()">
                Log Out
            </div>
        </div>
        `;
    };
}());
