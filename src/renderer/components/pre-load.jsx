import React from 'react'
import ControlPanel from './control-panel'

export default class PreLoad extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
                <div className="application">
                    <ControlPanel/>
                    <div className="preLoading">
                        <img src="../../resources/loading.gif"/>
                    </div>
                    <div className="dummyTweetList">
                        <div className="tweet">
                            @username<br/>
                            <br/>
                            Tweets now loading.........
                        </div>
                        <div className="tweet">
                            @username<br/>
                            <br/>
                            Tweets now loading.........
                        </div>
                        <div className="tweet">
                            @username<br/>
                            <br/>
                            Tweets now loading.........
                        </div>
                        <div className="tweet">
                            @username<br/>
                            <br/>
                            Tweets now loading.........
                        </div>
                        <div className="tweet">
                            @username<br/>
                            <br/>
                            Tweets now loading.........
                        </div>
                    </div>
                </div>
               );
    }
}