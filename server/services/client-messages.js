(function () {
    'use strict';

    // Module to communicate to the client
    const ipcMain = require('electron').ipcMain;

    var ClientMessages = function () {
        // Message names
        this.AUTHORIZE_USER = 'AUTHORIZE_USER';
        this.USER_AUTHORIZED = 'USER_AUTHORIZED';
        this.UNAUTHORIZE_USER = 'UNAUTHORIZE_USER';
        this.USER_UNAUTHORIZED = 'USER_UNAUTHORIZED';

        // Listen for messages from the client
        this.on = function (messageName, callback) {
            if (!messageName) {
                throw 'messageName required to listen for message';
            }
            if (!callback || typeof (callback) !== typeof (Function)) {
                throw 'callback function required to listen for message';
            }
            return ipcMain.on(messageName, callback);
        };

        // Listen for one-time message from the client
        this.listen = function (messageName, callback) {
            if (!messageName) {
                throw 'messageName required to listen for message';
            }
            if (!callback || typeof (callback) !== typeof (Function)) {
                throw 'callback function required to listen for message';
            }
            return ipcMain.once(messageName, callback);
        };
    };

    module.exports = new ClientMessages();
}());
