import React, { Component } from 'react';
import {Tab, Tabs} from "react-bootstrap-tabs";
import PostRoll from "../Post/index.js";

class Timeline extends Component {
    render() {
        return (
            <div style={{ width: '100%'}}>
                <Tabs className="nav-pills nav-fill timeline-nav">
                    <Tab label="Your Feed">
                        <div className = "container">
                            <PostRoll timeline="home"/>
                        </div>
                    </Tab>
                    <Tab label="Local">
                        <div className = "container">
                            <PostRoll timeline="local"/>
                        </div>
                    </Tab>
                    {/*<Tab label="Global">*/}
                        {/*<p> </p>*/}
                        {/*<div className = "container">*/}
                            {/*<PostRoll timeline="public"/>*/}
                        {/*</div>*/}
                    {/*</Tab>*/}
                </Tabs>
            </div>
        );
    }
}

export default Timeline;