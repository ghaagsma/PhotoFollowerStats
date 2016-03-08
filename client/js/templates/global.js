var globalTemplates;

(function () {
    'use strict';

    globalTemplates = {
        loader: function (color) {
            // Color optional: "white", "primary", "dark"
            return `
            <div class="loader ${color}">
                <div class="bounce1"></div>
                <div class="bounce2"></div>
            </div>
            `;
        }
    };
}());
