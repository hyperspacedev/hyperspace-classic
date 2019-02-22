import React, { Component } from 'react';
import {Pivot, PivotItem, PivotLinkSize, IPivotItemProps, Icon} from "office-ui-fabric-react";
import PostRoll from "../Post/PostRoll";
import Mastodon from 'megalodon';

interface ITimelineProps {
    client: Mastodon;
}

/**
 * The main element for hosting timelines.
 * 
 * @param client The client used to get/post information with
 */
class Timeline extends Component<ITimelineProps> {
    client: any;

    constructor(props: ITimelineProps) {
        super(props);
        this.client = this.props.client;
    }

    getTextForTab(what: string) {
        let agent = navigator.userAgent;
        if (/windows phone/i.test(agent) || /android/i.test(agent) || /iPad|iPhone|iPod/i.test(agent))
            return ''
        else
            return what
    }

    render() {
        return (
            <div style={{ width: '100%'}}>
                <Pivot linkSize={PivotLinkSize.large}>
                    <PivotItem
                        headerText={this.getTextForTab('Home')} 
                        itemIcon="homeApp"
                    >
                        <div className = "container mt-2 ml-0">
                            <PostRoll timeline="home" client={this.client}/>
                        </div>
                    </PivotItem>
                    <PivotItem headerText={this.getTextForTab('Local')} itemIcon="localCommunity">
                        <div className = "container mt-2">
                            <PostRoll timeline="local" client={this.client}/>
                        </div>
                    </PivotItem>
                    <PivotItem headerText={this.getTextForTab('Public')} itemIcon="public">
                        <div className = "container mt-2">
                            <PostRoll timeline="public" client={this.client}/>
                        </div>
                    </PivotItem>
                    <PivotItem headerText={this.getTextForTab('Messages')} itemIcon="directMessage">
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