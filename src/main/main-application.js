import jsonLoader from 'jsonloader';
import path from 'path';
import MainWindow from './window/main-window.js';
import AuthenticationWindow from './window/authentication-window.js';
import app from 'app';
import ipc from 'ipc';
import IpcConstants from '../utils/constants/ipc-constants';
import TwitterAuthConstants from '../utils/constants/twitter-auth-constants';
import TwitterClient from '../utils/twitter-client';
import InitialWindow from './window/initial-window';

export default class MainApplication
{
    constructor() {
        this.window = null;
        this.windowSize = this._getDefaultWindowSize();
    }

    start() {
        app.on('ready', this._onReady.bind(this));
        ipc.on(IpcConstants.INITIALIZE_WITH_LOGIN, (event, windowSize) => {
            this._startAuthentication(windowSize);
        });
        ipc.on(IpcConstants.INITIALIZE_WITH_KEY, (event, loginKeys, windowSize) => {
            this._checkLoginKeys(loginKeys, windowSize);
        });
    }

    _onReady() {
        this._loadCredential();
        this.initialWindow = new InitialWindow();
    }

    _startAuthentication(windowSize) {
        this._updateWindowSize(windowSize);
        setTimeout(() => {
            this.authenticationWindow = new AuthenticationWindow();
            this.authenticationWindow.on(TwitterAuthConstants.GET_ACCESS_TOKEN, (accessToken, accessTokenSecret) => {
                this.initialWindow.send(IpcConstants.UPDATE_LOGIN_KEYS, accessToken, accessTokenSecret);
                this._openMainWindow({
                    accessToken: accessToken,
                    accessTokenSecret: accessTokenSecret
                });
            });
            this.authenticationWindow.show(this._credential)
        }, 1000);
    }

    _checkLoginKeys(accessKeys, windowSize) {
        this._updateWindowSize(windowSize);
        let client = new TwitterClient(
                    accessKeys.accessToken,
                    accessKeys.accessTokenSecret,
                    this._credential.consumerKey,
                    this._credential.consumerSecret
                );
        client.verifyCredential().then(({response}) => {
            setTimeout(() => {
                this._openMainWindow(accessKeys);
            }, 1000);
        }).catch(({error}) => {
            // failed to login.
            setTimeout(() => {
                this._startAuthentication({});
            }, 1000);
        });
    }

    _loadCredential() {
        let credentialFilePath = path.resolve(__dirname, '../../', 'resources', 'authentication', 'twitter-credential.json');
        let credential = new jsonLoader(credentialFilePath);
        this._credential = {consumerKey: credential.consumerKey, consumerSecret: credential.consumerSecret, callback:credential.callback};
    }

    _openMainWindow(accessKeys) {
        this.initialWindow.hide();
        // update initial window size
        this.initialWindow.send(IpcConstants.UPDATE_WINDOW_SIZE, this.windowSize.width, this.windowSize.height);

        this.mainWindow = new MainWindow(
            this.windowSize.width,
            this.windowSize.height
        );
        ipc.on(IpcConstants.REQUIRE_CREDENTIALS, (event) => {
            this.mainWindow.send(IpcConstants.LOGIN_TWITTER, {
                consumerKey: this._credential.consumerKey,
                consumerSecret: this._credential.consumerSecret,
                accessToken: accessKeys.accessToken,
                accessTokenSecret: accessKeys.accessTokenSecret
            });
        });

        this.mainWindow.start();
    }

    _getDefaultWindowSize() {
        return {width: 400, height: 700};
    }

    _updateWindowSize(windowSize) {
        if (windowSize && windowSize.height && windowSize.width) {
            this.windowSize.height = windowSize.height;
            this.windowSize.width = windowSize.width;
        }
    }
}
