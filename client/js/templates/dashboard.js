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
                    <div class="ig-user-stats">
                        <div><span>${user.counts.media}</span> posts</div>
                        <div><span>${user.counts.followed_by}</span> followers</div>
                        <div><span>${user.counts.follows}</span> following</div>
                    </div>
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
