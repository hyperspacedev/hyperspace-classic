import React, { Component } from 'react';
import {Pivot, PivotItem, PivotLinkSize} from "office-ui-fabric-react";
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
                <Pivot linkSize={PivotLinkSize.large}>
                    <PivotItem linkText="My feed" itemIcon="home">
                        <div className = "container mt-2">
                            <PostRoll timeline="home" client={this.client}/>
                        </div>
                    </PivotItem>
                    <PivotItem linkText="This community" itemIcon="NetworkTower">
                        <div className = "container mt-2">
                            <PostRoll timeline="local" client={this.client}/>
                        </div>
                    </PivotItem>
                    <PivotItem linkText="Public" itemIcon="Globe">
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