import React, { Component } from 'react';
import {Tab, Tabs} from "react-bootstrap-tabs";
import PostRoll from "../Post/index.js";

class Timeline extends Component {
    client;

    constructor(props) {
        super(props);
        this.client = this.props.client;
    }

    render() {
        return (
            <div style={{ width: '100%'}}>
                <Tabs className="nav-pills nav-fill timeline-nav">
                    <Tab label="Your Feed">
                        <div className = "container">
                            <PostRoll timeline="home" client={this.client}/>
                        </div>
                    </Tab>
                    <Tab label="Community">
                        <div className = "container">
                            <PostRoll timeline="local" client={this.client}/>
                        </div>
                    </Tab>
                    <Tab label="Fediverse">
                        <p> </p>
                        <div className = "container">
                            <PostRoll timeline="public" client={this.client}/>
                        </div>
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

export default Timeline;