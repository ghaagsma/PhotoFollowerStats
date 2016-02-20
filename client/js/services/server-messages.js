var serverMessages;

(function () {
    'use strict';

    if (!!serverMessages) {
        return;
    }

    // Module to communicate with the server main process
    const ipcRenderer = require('electron').ipcRenderer;

    // Message names
    serverMessages = {
        AUTHORIZE_USER: 'AUTHORIZE_USER',
        USER_AUTHORIZED: 'USER_AUTHORIZED',
        UNAUTHORIZE_USER: 'UNAUTHORIZE_USER',
        USER_UNAUTHORIZED: 'USER_UNAUTHORIZED'
    };

    // Listen for message from the server
    serverMessages.listen = function (messageName, callback) {
        if (!messageName) {
            throw 'messageName required to listen for message';
        }
        if (!callback || typeof (callback) !== typeof (Function)) {
            throw 'callback function required to listen for message';
        }
        ipcRenderer.on(messageName, callback);
    };

    // Send a message to the server
    serverMessages.send = function (messageName, data) {
        if (!messageName) {
            throw 'messageName required to send message';
        }
        ipcRenderer.send(messageName, data);
    };
}());
