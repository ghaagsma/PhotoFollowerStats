(function () {
    'use strict';

    const electron = require('electron');

    // Module to control application life.
    const app = electron.app;

    // Module to create native browser window.
    const BrowserWindow = electron.BrowserWindow;

    // Module to make api requests
    const superagent = require('superagent');

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
            height: 600,
            show: false
        });

        initializeOauth();
        mainWindow.show();

        // Emitted when the window is closed
        mainWindow.on('closed', function () {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            mainWindow = null;
        });
    }

    function initializeOauth() {
        // Load the Instagram authentication page
        var igUrl = 'https://api.instagram.com/oauth/authorize/?response_type=code';
        var authUrl = igUrl + '&client_id=' + options.igClientId +
            '&redirect_uri=' + options.siteUrl;
        mainWindow.loadURL(authUrl);

        // Handle the response from Instagram
        mainWindow.webContents.on('will-navigate', function (event, url) {
            onUserAuthenticated(url);
        });
        mainWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
            onUserAuthenticated(newUrl);
        });
    }

    function onUserAuthenticated(url) {
        var raw_code = /code=([^&]*)/.exec(url) || null,
            code = (raw_code && raw_code.length > 1) ? raw_code[1] : null,
            raw_error = /\?error=([^&]*)/.exec(url),
            error = (raw_error && raw_error.length > 1) ? raw_error[1] : null;

        // If there is a code, proceed to get token from Instagram
        if (code) {
            getInstagramToken(code);
        } else if (error) {
            // TODO: Render error view
            console.log('Oops! Something went wrong and we couldn\'t' +
                'log you in using Instagram. Please try again.');
            mainWindow.destroy();
        }
    }

    function getInstagramToken(code) {
        var requestBody = {
            client_id: options.igClientId,
            client_secret: options.igClientSecret,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: options.siteUrl
        };
        console.log('Request body: ' + requestBody);

        superagent.post('https://api.instagram.com/oauth/access_token', requestBody)
            .end(function (err, response) {
                if (response && response.ok) {
                    console.log('token: ' + response.body.access_token);
                    initializeApp();
                } else {
                    // Error - Show messages.
                    console.log('Error getting Instagram token');
                    console.log(err);
                }
            });
    }

    function initializeApp() {
        // Load the index.html of the app
        mainWindow.loadURL('file://' + __dirname + '/app/index.html');

        // Open the DevTools
        mainWindow.webContents.openDevTools();
    }
}());
