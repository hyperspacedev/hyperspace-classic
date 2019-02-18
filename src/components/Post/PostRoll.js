import {Status} from "megalodon";
import React, {Component} from 'react';
import Post from './index.js';

/**
 * A timeline or list of posts from a given timeline
 * @param client The client used to get/post information from Mastodon
 * @param timeline The timeline to receive information from. Valid values include: (direct | home | local | public)
 */
class PostRoll extends Component {
    client;
    streamListener;
    constructor(props) {
        super(props);
        this.client = this.props.client;
        this.state = {
            statuses: [],
            statusCount: 150
        }
    }

    componentDidMount() {
        let _this = this;

        if (this.props.timeline === "home") {
            this.streamListener = this.client.stream('/streaming/user');

            this.streamListener.on('connect', () => {
                this.client.get('/timelines/home', {"limit": _this.state.statusCount, 'local': true})
                    .then((resp) => {
                        _this.setState({
                            statuses: resp.data,
                            statusCount: _this.state.statusCount + 1
                        })
                    });
            });

        } else if (this.props.timeline === "local") {
            this.streamListener = this.client.stream('/streaming/public/local');

            this.streamListener.on('connect', () => {
                this.client.get('/timelines/public', {"limit": _this.state.statusCount, 'local': true})
                    .then((resp) => {
                        _this.setState({
                            statuses: resp.data,
                            statusCount: _this.state.statusCount + 1
                        })
                    });
            });

        } else if (this.props.timeline === "public") {
            this.streamListener = this.client.stream('/streaming/public');

            this.streamListener.on('connect', () => {
                this.client.get('/timelines/public', {"limit": _this.state.statusCount, 'local': false})
                    .then((resp) => {
                        _this.setState({
                            statuses: resp.data,
                            statusCount: _this.state.statusCount + 1
                        })
                    });
            });

        } else if (this.props.timeline === "messages") {
            this.streamListener = this.client.stream('/streaming/direct');

            this.streamListener.on('connect', () => {
                this.client.get('/conversations', {"limit": _this.state.statusCount, 'local': false})
                    .then((resp) => {
                        let data = resp.data;
                        let messages = [];
                        for (let i in data) {
                            messages.push(data[i].last_status);
                        }

                        _this.setState({
                            statuses: messages,
                            statusCount: messages.length
                        });
                    });
            });
        }

        this.streamListener.on('update', (status: Status) => {
            let old_statuses = _this.state.statuses;
            old_statuses.unshift(status);
            _this.setState({
                statuses: old_statuses
            });
            this.forceUpdate()
        });

        this.streamListener.on('message', msg => {
            console.log(msg);
        });

        this.streamListener.on('connection-limit-exceeded', err => {
            console.error(err)
        });

        this.streamListener.on('not-event-stream', mes => {
            console.log(mes)
        })
    }

    getClearTimelineText() {
        let header = "It's empty here...";
        let body = "It looks like there aren't any posts on this timeline. Why not get it going with a new post?";
        if (this.props.timeline === "messages") {
            header = "All clear!";
            body = "It looks like you have no new messages. Interact with some people to get the conversation going!"
        }
        return (<div>
            <h3>{header}</h3>
            <p>{body}</p>
            <small>
                <p>If you think this is an error, try checking the following: </p>
                <ul>
                    <li>You have a stable internet connection.</li>
                    <li>You have allowed Hyperspace access to your account.</li>
                    <li>You aren't being throttled on your account (429).</li>
                </ul>
            </small>
        </div>);
    }

    render() {
        let _this = this;
        return (
            <div>
                {this.state.statuses.length > 0 ? 
                <div>
                    {this.state.statuses.map(function (status) {
                            return (<div key={status.id} className="my-3"><Post client={_this.client} status={status} nolink={false} nothread={false}/></div>);
                        })}
                    <hr/>
                    <div name = "end-of-post-roll" className="my-4" style={{textAlign: 'center'}}>It appears you've reached... an end.</div>
                </div>:
                    <div name = "timeline-error" className="row p-4">
                        <div className = "row">
                            <div className = "col">
                                {this.getClearTimelineText()}
                            </div>
                        </div>

                    </div>}

            </div>
        );
    }
}

export default PostRoll;