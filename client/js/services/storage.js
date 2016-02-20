var storage;

(function () {
    'use strict';

    if (!!storage) {
        return;
    }

    storage = {
        get: function (key) {
            return window.localStorage.getItem(key);
        },
        set: function (key, value) {
            return window.localStorage.setItem(key, value);
        },
        getObject: function (key) {
            let json = storage.get(key);
            return !!json ? JSON.parse(json) : null;
        },
        setObject: function (key, value) {
            let json = JSON.stringify(value);
            return storage.set(key, json);
        }
    };
}());
