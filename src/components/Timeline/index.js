import React, { Component } from 'react';
import {Pivot, PivotItem, PivotLinkSize} from "office-ui-fabric-react";
import PostRoll from "../Post/PostRoll";

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
                    <PivotItem linkText="My feed" itemIcon="homeApp">
                        <div className = "container mt-2">
                            <PostRoll timeline="home" client={this.client}/>
                        </div>
                    </PivotItem>
                    <PivotItem linkText="This community" itemIcon="localCommunity">
                        <div className = "container mt-2">
                            <PostRoll timeline="local" client={this.client}/>
                        </div>
                    </PivotItem>
                    <PivotItem linkText="Public" itemIcon="public">
                        <p> </p>
                        <div className = "container mt-2">
                            <PostRoll timeline="public" client={this.client}/>
                        </div>
                    </PivotItem>
                </Pivot>
            </div>
        );
    }
}

export default Timeline;