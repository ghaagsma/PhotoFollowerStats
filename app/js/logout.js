var logout;

(function () {
    'use strict';

    // Module to communicate with the server main process
    const ipcRenderer = require('electron').ipcRenderer;

    logout = function () {
        window.localStorage.clear();
        ipcRenderer.send('logout-user');
    };
}());
