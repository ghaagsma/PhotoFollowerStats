var dashboardTemplates;

(function () {
    'use strict';

    dashboardTemplates = {
        user: function (user) {
            return `
            <div class="ig-user">
                <img class="ig-profile-pic"
                     src="${user.profile_picture}"
                     alt="User profile picture" />
                <div class="ig-user-summary">
                    <div class="ig-username">${user.username}</div>
                    <div class="ig-user-bio">${user.bio}</div>
                    <ul class="ig-user-stats">
                        <li><span id="ig-user-media"></span> posts</li>
                        <li><span id="ig-user-followed-by"></span> followers</li>
                        <li><span id="ig-user-follows"></span> following</li>
                    </ul>
                </div>
            </div>
            `;
        },
        error: function () {
            return '<div>Oops! There was an error getting information from ' +
                'Instagram. Please <a href="">try again</a>.</div>';
        }
    };
}());
