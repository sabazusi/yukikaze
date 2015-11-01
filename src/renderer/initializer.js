import ipc from 'ipc'
import Rx from 'rx'
import Renderer from './renderer'

export default class ApplicationInitializer {
    constructor() {
    }

    run(twitterClient) {
        Rx.Observable.fromPromise(twitterClient.verifyCredential())
            .subscribe(({user, response}) => {
                console.log(user);
            }
        );
        setTimeout(this._start, 1000);
    }

    _start() {
        let preLoad = document.getElementById("preLoad");
        while(preLoad.firstChild){
            preLoad.removeChild(preLoad.firstChild);
        }
        new Renderer().render();
    }
}
