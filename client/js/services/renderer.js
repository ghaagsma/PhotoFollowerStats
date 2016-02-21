var renderer;

(function () {
    'use strict';

    if (!!renderer) {
        return logger.errorGlobalConflict('renderer');
    }

    let getElement = function (query) {
            let element = document.querySelector(query);
            if (!element) {
                throw 'No element matches query "' + query + '"';
            }
            return element;
        },
        getElements = function (query) {
            let elements = document.querySelectorAll(query);
            if (!elements || elements.length < 1) {
                throw 'No element matches query "' + query + '"';
            }
            return elements;
        };

    renderer = {
        render: function (query, template) {
            getElement(query).innerHTML = template;
        },
        renderAll: function (query, template) {
            let elements = getElements(query);
            for (let i = 0; i < elements.length; ++i) {
                elements[i].innerHTML = template;
            }
        },
        insert: function (query, template) {
            let element = getElement(query);
            element.insertAdjacentHTML('afterbegin', template);
        },
        append: function (query, template) {
            let element = getElement(query);
            element.insertAdjacentHTML('beforeend', template);
        }
    };
}());
