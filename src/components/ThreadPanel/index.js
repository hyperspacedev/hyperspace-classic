import React, { Component } from 'react';
import {
    ActionButton,
    Link,
    Panel,
    PanelType
} from 'office-ui-fabric-react';
import Post from '../Post/index.js';

class ThreadPanel extends Component {

    client;

    constructor(props) {
        super(props);

        this.state = {
            status_thread_id: this.props.fromWhere,
            ancestors: [],
            status: '',
            descendants: [],
            hideThreadPanel: true
        }

        this.client = this.props.client;
    }

    openThreadPanel() {
        this.setState({
            hideThreadPanel: false
        });
        this.retrieveThread();
    }

    closeThreadPanel() {
        this.setState({
            hideThreadPanel: true
        });
    }

    retrieveThread() {
        let _this = this;

        //Get the original post
        this.client.get('/statuses/' + this.state.status_thread_id)
            .then( (resp) => {
                _this.setState({
                    status: resp.data
                })
            });

        // Then get the context of it
        this.client.get('/statuses/' + this.state.status_thread_id + '/context')
            .then( (resp) => {
                    _this.setState({
                        ancestors: resp.data.ancestors,
                        descendants: resp.data.descendants
                    })
                }
            );
    }

    displayAncestors() {
        if (this.state.ancestors.length > 0) {
            return (
                <div>
                    {
                        this.state.ancestors.map( (ancestor) => {
                            return(
                                <div className="m-2">
                                    <Post
                                        key={ancestor.id}
                                        client={this.client}
                                        status={ancestor}
                                        nolink={false}
                                        nothread={true}
                                    />
                                </div>
                            );
                        } )
                    }
                </div>
            )
        }
    }

    displayOriginalStatus() {
        if (this.state.status !== '') {
            return (
                <div>
                    <Post
                        key={this.state.status_thread_id}
                        client={this.client}
                        status={this.state.status}
                        nolink={false}
                        nothread={true}
                        bigShadow={true}
                    />
                </div>
            )
        }
    }

    displayDescendants() {
        if (this.state.descendants.length > 0) {
            return (
                <div>
                    {
                        this.state.descendants.map( (descendant) => {
                            return(
                                <div className="m-2">
                                    <Post
                                        key={descendant.id}
                                        client={this.client}
                                        status={descendant}
                                        nolink={false}
                                        nothread={true}
                                    />
                                </div>
                            );
                        } )
                    }
                </div>
            )
        }
    }

    getPanelStyles() {
        return {
            closeButton: {
                color: 'transparent',
                "&:hover": {
                    color: 'transparent !important'
                },
                "&:active": {
                    color: 'transparent !important'
                },
                backgroundImage: 'url(\'close.svg\')',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '50%'
            }
        }
    }

    getThreadPanel() {
        return(
            <Panel
                isOpen={!this.state.hideThreadPanel}
                type={PanelType.medium}
                onDismiss={() => this.closeThreadPanel()}
                closeButtonAriaLabel="Close"
                headerText="View thread"
                isLightDismiss={true}
                styles={this.getPanelStyles()}
            >
                <div>
                    {this.displayAncestors()}
                    {this.displayOriginalStatus()}
                    {this.displayDescendants()}
                </div>
            </Panel>
        );
    }


    getThreadButton() {
        return (
            <ActionButton
                iconProps={{ iconName: 'thread', className: 'post-toolbar-icon' }}
                allowDisabledFocus={true}
                disabled={false}
                checked={false}
                href={this.state.url}
                className='post-toolbar-icon'
                onClick={() => this.openThreadPanel()}
            > Show thread
            </ActionButton>
        );
    }

    getSmallThreadButton() {
        return (
            <Link onClick={() => this.openThreadPanel()}><b>View thread</b></Link>
        );
    }

    render() {
        return(
            <span>
                {
                    this.props.fullButton ?
                    this.getThreadButton(): this.getSmallThreadButton()
                }
                {this.getThreadPanel()}
            </span>
        );
    }
}

export default ThreadPanel;