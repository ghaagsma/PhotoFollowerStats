(function () {
    'use strict';

    // Electron Module
    const electron = require('electron');

    // Module to control application life.
    const app = electron.app;

    // Module to create native browser window.
    const BrowserWindow = electron.BrowserWindow;

    // Module to communicate to the client UI application
    const ipcMain = electron.ipcMain;

    // Module to make api requests
    const request = require('superagent');

    // Application options
    const options = {
        siteUrl: 'https://photofollowerstats.io',
        igClientId: '099d52a94f8c45cf85409744e3a1ab01',
        igClientSecret: 'c691d06800614f2a95597f9d72cd62ca'
    };

    // Keep a global reference of the window object, if you don't, the window will
    // be closed automatically when the JavaScript object is garbage collected.
    let mainWindow;

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    app.on('ready', createWindow);

    // Quit when all windows are closed.
    app.on('window-all-closed', function () {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', function () {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (mainWindow === null) {
            createWindow();
        }
    });

    function createWindow() {
        // Create the browser window.
        mainWindow = new BrowserWindow({
            width: 800,
            height: 600
        });

        initializeApp();

        // Emitted when the window is closed
        mainWindow.on('closed', function () {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            mainWindow = null;
        });
    }

    function initializeApp() {
        // Authorize the user when client requests authorization
        ipcMain.on('authorize-user', authorize);

        // Load the index.html of the app
        mainWindow.loadURL('file://' + __dirname + '/app/index.html');

        // Open the DevTools
        mainWindow.webContents.openDevTools();
    }

    function authorize(event) {
        let authWindow = new BrowserWindow({ // TODO: Handle window closed case
                width: 800,
                height: 600,
                show: false
            }),
            authorizationCallback = function (data) {
                authWindow.destroy();
                event.sender.send('user-authorized', data);
            },
            igUrl = 'https://api.instagram.com/oauth/authorize/' +
            '?response_type=code&scope=follower_list',
            authUrl = igUrl + '&client_id=' + options.igClientId +
            '&redirect_uri=' + options.siteUrl;

        // Handle the response from Instagram
        authWindow.webContents.on('will-navigate', function (event, url) {
            onUserAuthorized(url, authorizationCallback);
        });
        authWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
            onUserAuthorized(newUrl, authorizationCallback);
        });

        // Load Instragram oauth page
        authWindow.loadURL(authUrl);
        authWindow.show();
    }

    function onUserAuthorized(url, callback) {
        var raw_code = /code=([^&]*)/.exec(url) || null,
            code = (raw_code && raw_code.length > 1) ? raw_code[1] : null,
            raw_error = /\?error=([^&]*)/.exec(url),
            error = (raw_error && raw_error.length > 1) ? raw_error[1] : null;

        // If there is a code, proceed to get token from Instagram
        if (code) {
            getInstagramToken(code, callback);
        } else if (error) {
            // TODO: Render error in mainWindow
            console.log('Instagram authorization error occurred.');
            authWindow.destroy();
        }
    }

    // Trade IG authorization code for an IG access token and user data
    function getInstagramToken(code, callback) {
        request.post('https://api.instagram.com/oauth/access_token').type('form').send({
            client_id: options.igClientId
        }).send({
            client_secret: options.igClientSecret
        }).send({
            code: code
        }).send({
            grant_type: 'authorization_code'
        }).send({
            redirect_uri: options.siteUrl
        }).end(function (err, response) {
            if (response && response.ok) {
                callback(response.body);
            } else {
                // Error - Show messages.
                console.log('Error getting Instagram token');
                console.log(JSON.stringify(err));
            }
        });
    }
}());
