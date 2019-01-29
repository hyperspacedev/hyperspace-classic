import React, { Component } from 'react';
import {Tab, Tabs} from "react-bootstrap-tabs";
import PostRoll from "../Post/index.js";

class Timeline extends Component {
    render() {
        return (
            <div style={{ width: '100%'}}>
                <Tabs className="nav-pills nav-fill timeline-nav">
                    <Tab label="Home">
                        <div className = "container">
                            <PostRoll timeline="https://mastodon.social/api/v1/timelines/home"/>
                        </div>
                    </Tab>
                    <Tab label="Local">
                        <div className = "container">
                            <PostRoll timeline="https://mastodon.social/api/v1/timelines/public?local=true"/>
                        </div>
                    </Tab>
                    <Tab label="Global">
                        <p> </p>
                        <div className = "container">
                            <PostRoll timeline="https://mastodon.social/api/v1/timelines/public"/>
                        </div>
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

export default Timeline;