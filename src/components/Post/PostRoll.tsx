import Mastodon, {Status, Response} from "megalodon";
import React, {Component} from 'react';
import {Link, Spinner, SpinnerSize} from 'office-ui-fabric-react';
import Post from './index';


interface IPostRollProps {
    timeline?: string;
    client: Mastodon;
}

interface IPostRollState {
    statuses: Array<any>;
    statusCount: Number;
    loading: boolean;
}

/**
 * A timeline or list of posts from a given timeline
 * @param client The client used to get/post information from Mastodon
 * @param timeline The timeline to receive information from. Valid values include: (direct | home | local | public)
 */
class PostRoll extends Component<IPostRollProps, IPostRollState> {
    client: Mastodon;
    streamListener: any;
    constructor(props: any) {
        super(props);
        this.client = props.client;
        this.state = {
            statuses: [],
            statusCount: 150,
            loading: true
        }
    }

    componentDidMount() {
        let _this = this;
        let count = parseInt(String(this.state.statusCount));

        if (this.props.timeline === "home") {
            this.streamListener = this.client.stream('/streaming/user');

            this.streamListener.on('connect', () => {
                this.client.get('/timelines/home', {"limit": _this.state.statusCount, 'local': true})
                    .then((resp: any) => {
                        _this.setState({
                            statuses: resp.data,
                            statusCount: count ++,
                            loading: false
                        } as unknown as IPostRollState)
                    });
            });

        } else if (this.props.timeline === "local") {
            this.streamListener = this.client.stream('/streaming/public/local');

            this.streamListener.on('connect', () => {
                this.client.get('/timelines/public', {"limit": _this.state.statusCount, 'local': true})
                    .then((resp) => {
                        _this.setState({
                            statuses: resp.data,
                            statusCount: count ++,
                            loading: false
                        } as unknown as IPostRollState)
                    });
            });

        } else if (this.props.timeline === "public") {
            this.streamListener = this.client.stream('/streaming/public');

            this.streamListener.on('connect', () => {
                this.client.get('/timelines/public', {"limit": _this.state.statusCount, 'local': false})
                    .then((resp) => {
                        _this.setState({
                            statuses: resp.data,
                            statusCount: count ++,
                            loading: false
                        } as unknown as IPostRollState)
                    });
            });

        } else if (this.props.timeline === "messages") {
            this.streamListener = this.client.stream('/streaming/direct');

            this.streamListener.on('connect', () => {
                this.client.get('/conversations', {"limit": _this.state.statusCount, 'local': false})
                    .then((resp) => {
                        let data:any = resp.data;
                        let messages: any = [];
                        
                        data.forEach((message: any) => {
                            if (message.last_status !== null) {
                                console.log(status);
                                messages.push(message.last_status);
                            }
                        });

                        _this.setState({
                            statuses: messages,
                            statusCount: messages.length,
                            loading: false
                        } as unknown as IPostRollState);
                    });
            });
        }

        this.streamListener.on('update', (status: Status) => {
            let old_statuses = _this.state.statuses;
            old_statuses.unshift(status as never);
            _this.setState({
                statuses: old_statuses
            });
            this.forceUpdate()
        });

        this.streamListener.on('message', (msg:any) => {
            console.log(msg);
        });

        this.streamListener.on('connection-limit-exceeded', (err: Error) => {
            console.error(err)
        });

        this.streamListener.on('not-event-stream', (mes: any) => {
            console.log(mes)
        })

        this.streamListener.on('delete', (delId: Number) => {
            let roll = _this.state.statuses;
            for (let i in roll) {
                if (roll[Number(i)].id === delId) {
                    roll.splice(Number(i), 1);
                }
            }
            _this.setState({statuses: roll});
            this.forceUpdate();
        });
    }

    loadMore(from: string) {
        let _this = this;
        let last_status = this.state.statuses[this.state.statuses.length - 1].id;
        let where = "";
        let params = {"max_id": last_status, "local": false}

        if (from == "home") {
            where = "/timelines/home";
        } else if (from == "local") {
            where = "timelines/public";
            params = {"max_id": last_status, "local": true}
        } else if (from == "public") {
            where = "/timelines/public";
        } else if (from == "conversations") {
            where = "/conversations";
        }

        this.client.get(where, params)
            .then((resp) => {
                let data:any = resp.data;
                let messages: any = [];

                if (from == "messages") {
                    data.forEach((message: any) => {
                        if (message.last_status !== null) {
                            console.log(status);
                            messages.push(message.last_status);
                        }
                    });
                }

                _this.setState({
                    statuses: _this.state.statuses.concat(resp.data) || messages,
                    statusCount: 20 + _this.state.statuses.length
                } as unknown as IPostRollState);
            });
    }

    getClearTimelineText() {
        let header = "It's empty here...";
        let body = "It looks like there aren't any posts on this timeline. Why not get it going with a new post?";
        if (this.props.timeline === "messages") {
            header = "All clear!";
            body = "It looks like you have no new messages. Interact with some people to get the conversation going!"
        }
        return (<div className="ms-fadeIn100">
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

    getPostRoll() {
        let _this = this;
        console.log("Type: " + this.props.timeline)
        return (
            this.state.statuses.length > 0 ? 
                <div>
                    {this.state.statuses.map((status: Status) => {
                        console.log(status);
                            return ( 
                                <div key={status.id} className="my-3">
                                    <Post client={_this.client} status={status} nolink={false} nothread={false} clickToThread={true}/>
                                </div>
                            );
                        })}
                    <hr/>
                    <div id="end-of-post-roll" className="my-4" style={{textAlign: 'center'}}><Link onClick = {() => this.loadMore(this.props.timeline as string)}>Load more</Link></div>
                </div>:
                    <div id="timeline-error" className="row p-4">
                        <div className = "row">
                            <div className = "col">
                                {this.getClearTimelineText()}
                            </div>
                        </div>

                    </div>
        );
    }

    render() {
        let _this = this;
        return (
            <div>
                {this.state.loading? <Spinner className = "my-4" size={SpinnerSize.medium} label="Loading timeline..." ariaLive="assertive" labelPosition="right" />: this.getPostRoll()}
            </div>
        );
    }
}

export default PostRoll;