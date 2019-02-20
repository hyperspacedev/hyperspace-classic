import React, { Component } from 'react';
import {Pivot, PivotItem, PivotLinkSize} from "office-ui-fabric-react";
import PostRoll from "../Post/PostRoll";

/**
 * The main element for hosting timelines.
 * 
 * @param client The client used to get/post information with
 */
class Timeline extends Component {
    client;

    constructor(props) {
        super(props);
        this.client = this.props.client;
    }

    render() {
        return (
            <div style={{ width: '100%'}}>
                <Pivot linkSize={PivotLinkSize.large}>
                    <PivotItem linkText={<span className="d-none d-lg-block">My feed</span>} itemIcon="homeApp">
                        <div className = "container mt-2">
                            <PostRoll timeline="home" client={this.client}/>
                        </div>
                    </PivotItem>
                    <PivotItem linkText={<span className="d-none d-lg-block">This community</span>} itemIcon="localCommunity">
                        <div className = "container mt-2">
                            <PostRoll timeline="local" client={this.client}/>
                        </div>
                    </PivotItem>
                    <PivotItem linkText={<span className="d-none d-lg-block">Public</span>} itemIcon="public">
                        <div className = "container mt-2">
                            <PostRoll timeline="public" client={this.client}/>
                        </div>
                    </PivotItem>
                    <PivotItem linkText={<span className="d-none d-lg-block">Conversations</span>} itemIcon="directMessage">
                        <div className = "container mt-2">
                            <PostRoll timeline="messages" client={this.client}/>
                        </div>
                    </PivotItem>
                </Pivot>
            </div>
        );
    }
}

export default Timeline;