var storage;

(function () {
    'use strict';

    if (!!storage) {
        return logger.errorGlobalConflict('storage');
    }

    let set = function (key, value) {
            return window.localStorage.setItem(key, value);
        },
        get = function (key) {
            return window.localStorage.getItem(key);
        },
        setObject = function (key, value) {
            let json = JSON.stringify(value);
            return set(key, json);
        },
        getObject = function (key) {
            let json = get(key);
            return !!json ? JSON.parse(json) : null;
        };

    storage = {
        setAccessToken: function (token) {
            return set('igToken', token);
        },
        getAccessToken: function () {
            return get('igToken');
        },
        setUser: function (user) {
            return setObject('igUser', user);
        },
        getUser: function () {
            return getObject('igUser');
        }
    };
}());
