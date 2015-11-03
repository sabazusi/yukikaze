import jsonLoader from 'jsonloader'
import path from 'path'
import MainWindow from './window/main-window.js'
import AuthenticationWindow from './window/authentication-window.js'
import app from 'app'
import ipc from 'ipc'

export default class MainApplication
{
    constructor() {
        this.window = null;
    }

    start() {
        ipc.on('log', this._log);
        ipc.on('authenticate-twitter', this._authentication.bind(this));
        ipc.on('require-consumer-keys', this._sendConsumerKeys.bind(this));
        app.on('ready', this._onReady.bind(this));
    }

    _onReady() {
        this.twitterClient = null;
        this._loadCredential();
        this.mainWindow = new MainWindow();
    }

    _loadCredential() {
        let credentialFilePath = path.resolve(__dirname, '../../', 'resources', 'authentication', 'twitter-credential.json');
        let credential = new jsonLoader(credentialFilePath);
        this._credential = {consumerKey: credential.consumerKey, consumerSecret: credential.consumerSecret, callback:credential.callback};
    }

    _authentication() {
        console.log('authentication start.');
        let credential = this._credential;
        let mainWindow = this.mainWindow;

        setTimeout(function(){
            this.authenticationWindow = new AuthenticationWindow();
            this.authenticationWindow.on('get-access-token', function(accessToken, accessTokenSecret){
                mainWindow.send('consumer-and-access-keys', accessToken, accessTokenSecret, credential);
            });
            this.authenticationWindow.show(credential);
        }, 1000);

    }

    _sendConsumerKeys(e) {
        this.mainWindow.send('consumer-keys', this._credential);
    }

    _log(event, args) {
        console.log("[Renderer]" + args);
    }
}