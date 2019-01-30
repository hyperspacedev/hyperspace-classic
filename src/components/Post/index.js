import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import * as moment from 'moment';
import * as axios from 'axios';
import { Status } from 'megalodon';

class Avatar extends Component {
    render() {
        return (
            <i className="material-icons md-24"><img alt="person" className="mr-3 rounded-circle shadow-sm avatar" src={this.props.src}/></i>
        );
    }
}

class PostAuthor extends Component {
    name;
    handle;
    render() {
        return (
            <h5 className="mt-0">
                <b>{this.props.name}</b>
                <span className="text-muted"> @{this.props.handle}</span>
            </h5>
        );
    }
}

class PostContent extends Component {
    render() {
        return (
            <div className="post-content">{this.props.children}</div>
        );
    }
}

class PostDate extends Component {
    render() {
        return (
            <small className = "text-muted">{this.props.date}</small>
        );
    }
}

class PostToolbar extends Component {
    replies;
    favorites;
    boosts;
    render() {
        return (
            <div className="col">
                <ul className="nav toolbar-area">
                    <li className="nav-item toolbar">
                        <i className="material-icons md-18">reply</i> {this.props.replies}
                    </li>
                    <li className="nav-item toolbar">
                        <i className="material-icons md-18">favorite</i> {this.props.favorites}
                    </li>
                    <li className="nav-item toolbar">
                        <i className="material-icons md-18">share</i> {this.props.boosts}
                    </li>
                </ul>
            </div>
        );
    }
}

class Index extends Component {
    render() {
        return (
            <div className="container shadow-sm rounded my-2">
                <div className="row">
                    <div className="col p-4 post">
                        <div className="media">
                            {this.props.children[0]}
                            <div className="media-body">
                                {this.props.children.slice(1, this.props.children.length - 2)}
                            </div>
                        </div>
                        <div className="row">
                            {this.props.children.slice(3, this.props.children.length - 1)}
                            <div className="col">
                                <span className="float-right">{this.props.children[this.props.children.length - 1]}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class PostSensitive extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            status: this.props.status
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });

    }

    render() {
        return (
            <div>
                <div className="alert alert-warning" role="alert">
                    <p>The author of this post has marked the following content as a spoiler or a warning.</p>
                    <Button size="sm" color="warning" onClick={this.toggle}><i className="material-icons">warning</i> {this.state.status.spoiler_text ? this.state.status.spoiler_text: "Proceed"}</Button>
                </div>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>{this.state.status.spoiler_text}</ModalHeader>
                    <ModalBody>
                        <div className="container-fluid">
                            <div>
                                <div>
                                    <p dangerouslySetInnerHTML={{__html: this.state.status.content}} />
                                    {
                                        this.state.status.media_attachments.length ?
                                            <div className = "row">
                                                {
                                                    this.state.status.media_attachments.map( function(media) {
                                                        return(
                                                            <div className="col">
                                                                <img src={media.url} className = "shadow-sm rounded" alt={media.description} style = {{ width: '100%' }}/>
                                                            </div>
                                                        );
                                                    })
                                                }
                                                <br/>
                                            </div>:
                                            <span/>
                                    }
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

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

    componentWillMount() {
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
            })

            this.streamListener.on('update', (status: Status) => {
                let old_statuses = _this.state.statuses;
                old_statuses.unshift(status);
                _this.setState({
                    statuses: old_statuses
                })
                this.forceUpdate()
            })

            this.streamListener.on('connection-limit-exceeded', err => {
                console.error(err)
            })

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
            })

            this.streamListener.on('update', (status: Status) => {
                let old_statuses = _this.state.statuses;
                old_statuses.unshift(status);
                _this.setState({
                    statuses: old_statuses
                })
                this.forceUpdate()
            })

            this.streamListener.on('connection-limit-exceeded', err => {
                console.error(err)
            })
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
            })

            this.streamListener.on('update', (status: Status) => {
                let old_statuses = _this.state.statuses;
                old_statuses.unshift(status);
                _this.setState({
                    statuses: old_statuses
                })
                this.forceUpdate()
            })

            this.streamListener.on('connection-limit-exceeded', err => {
                console.error(err)
            })
        }

    }

    componentWillUpdate() {

    }

    render() {
        return (
            <div>
                {this.state.statuses.length > 0 ? <div>{this.state.statuses.map(function (status) {
                        return (<Index>
                                <Avatar src = {status.account.avatar}/>
                                <PostAuthor name={status.account.display_name} handle={status.account.acct}/>
                                <PostContent>
                                    {

                                        status.reblog ?
                                            <div>
                                                <span className="media rounded">
                                                    <img src = {status.reblog.account.avatar} className="rounded-circle shadow-sm mr-2" style = {{ width: '24px', height: '24px'}}/>
                                                    <span className="media-body">
                                                        <b>Boosted from: </b> {status.reblog.account.display_name} <small class = "text-muted">(@ {status.reblog.account.username})</small>
                                                    </span>
                                                </span>
                                                <div>
                                                    { status.sensitive === true ?
                                                        <PostSensitive status={status}/>:
                                                        <div>
                                                            <p dangerouslySetInnerHTML={{__html: status.content}} />
                                                            {
                                                                status.media_attachments.length ?
                                                                    <div className = "row">
                                                                        {
                                                                            status.media_attachments.map( function(media) {
                                                                                return(
                                                                                    <div className="col">
                                                                                        <img src={media.url} className = "shadow-sm rounded" alt={media.description} style = {{ width: '100%' }}/>
                                                                                    </div>
                                                                                );
                                                                            })
                                                                        }
                                                                    </div>:
                                                                    <span/>
                                                            }
                                                        </div>}
                                                </div>
                                            </div>:

                                        <div>
                                            { status.sensitive === true ?
                                            <PostSensitive status={status}/>:
                                            <div>
                                                <p dangerouslySetInnerHTML={{__html: status.content}} />
                                                {
                                                    status.media_attachments.length ?
                                                        <div className = "row">
                                                            {
                                                                status.media_attachments.map( function(media) {
                                                                    return(
                                                                        <div className="col">
                                                                            <img src={media.url} className = "shadow-sm rounded" alt={media.description} style = {{ width: '100%' }}/>
                                                                        </div>
                                                                    );
                                                                })
                                                            }
                                                        </div>:
                                                        <span/>
                                                }
                                            </div>}
                                        </div>
                                    }

                                </PostContent>
                                <PostToolbar
                                    replies={
                                        status.replies_count ?
                                            <span>{status.replies_count}</span>: <span/>
                                    }
                                    favorites={status.favourites_count}
                                    boosts={status.reblogs_count}
                                />
                                <PostDate date={moment(status.created_at).format('MM/DD/YYYY [at] h:mm a')}/>
                            </Index>
                        );
                    })}</div>:
                    <div className="row p-4">
                        <div class = "row">
                            <div class = "col">
                                <h3>That's not fair!</h3>
                                <p>An error occurred when trying to get this timeline.</p>
                            </div>
                        </div>

                    </div>}

            </div>
        );
    }
}

export default PostRoll;