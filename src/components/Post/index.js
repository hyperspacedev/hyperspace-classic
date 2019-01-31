import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import * as moment from 'moment';
import { Status } from 'megalodon';

class Avatar extends Component {
    render() {
        return (
            <i className="material-icons md-24"><img alt="person" className="mr-3 rounded-circle shadow-sm avatar" src={this.props.src}/></i>
        );
    }
}

class PostAuthor extends Component {
    render() {
        return (
            <h5 className="mt-0 post-author">
                <a href={this.props.url}><b>{this.props.name}</b></a>
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

    client;

    constructor(props) {
        super(props);

        this.client = this.props.client;

        this.state = {
            id: this.props.status.id,
            replies: this.props.status.replies_count,
            favorites: this.props.status.favourites_count,
            boosts: this.props.status.reblogs_count,
            favorited: this.props.status.favourited,
            boosted: this.props.status.reblogged,
            favorite_toggle: this.props.status.favourited,
            url: this.props.status.url
        }

        this.toggle_favorite = this.toggle_favorite.bind(this);
        this.toggle_boost = this.toggle_boost.bind(this);
    }

    toggle_favorite() {
        if (this.state.favorited) {
            this.client.post('/statuses/' + this.state.id + '/unfavourite')
                .then((status) => {
                    this.setState({
                        favorited: status.data.favourited,
                        favorites: status.data.favourites_count
                    });
                });
        } else {
            this.client.post('/statuses/' + this.state.id + '/favourite')
                .then((status) => {
                    this.setState({
                        favorited: status.data.favourited,
                        favorites: status.data.favourites_count
                    });
                });
        }
    }

    toggle_boost() {
        if (this.state.reblogged) {
            this.client.post('/statuses/' + this.state.id + '/unreblog')
                .then((status) => {
                    this.setState({
                        boosted: status.data.reblogged,
                        boosts: status.data.reblogs_count
                    });
                });
        } else {
            this.client.post('/statuses/' + this.state.id + '/reblog')
                .then((status) => {
                    this.setState({
                        boosted: status.data.reblogged,
                        boosts: status.data.reblogs_count
                    });
                });
        }
    }

    render() {
        return (
            <div className="col">
                <ul className="nav toolbar-area">
                    <li className="nav-item toolbar">
                        <button className = 'btn btn-sm btn-outline-dark'><i className="material-icons md-18">reply_all</i> {this.state.replies}</button>
                    </li>
                    <li className="nav-item toolbar" toggle={this.toggle}>
                        {
                            this.state.favorited === (true) ?
                                <button onClick={() => this.toggle_favorite()} className = 'btn btn-sm btn-outline-warning'><i className="material-icons md-18">favorite</i> {this.state.favorites}</button>:
                                <button onClick={() => this.toggle_favorite()} className = 'btn btn-sm btn-outline-dark'><i className="material-icons md-18">favorite</i> {this.state.favorites}</button>
                        }

                    </li>
                    <li className="nav-item toolbar">
                        {
                            this.state.boosted === (true) ?
                                <button onClick={() => this.toggle_boost()} className = 'btn btn-sm btn-outline-danger'><i className="material-icons md-18">cached</i> {this.state.boosts}</button>:
                                <button onClick={() => this.toggle_boost()} className = 'btn btn-sm btn-outline-dark'><i className="material-icons md-18">cached</i> {this.state.boosts}</button>
                        }

                    </li>
                    {
                        this.state.url ?
                            <li className="nav-item toolbar">
                                <a className = 'btn btn-sm btn-outline-dark' href={this.state.url} target="_blank" rel="nofollow noreferrer"><i className="material-icons md-18">open_in_new</i></a>
                            </li>:
                            <li className="nav-item toolbar">
                                <a className = 'btn btn-sm btn-outline-light' id="disabled-external" disabled target="_blank" rel="nofollow noreferrer"><i className="material-icons md-18" style={{ color: '#a2a2a2'}}>open_in_new</i></a>
                            </li>
                    }

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
        let _this = this;
        return (
            <div>
                {this.state.statuses.length > 0 ? <div>{this.state.statuses.map(function (status) {
                        return (<Index>
                                <Avatar src = {status.account.avatar}/>
                                <PostAuthor name={status.account.display_name} handle={status.account.acct} url={status.account.url}/>
                                <PostContent>
                                    {

                                        status.reblog ?
                                            <div className='mb-2'>
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
                                                            <div dangerouslySetInnerHTML={{__html: status.content}} />
                                                            {
                                                                status.reblog.media_attachments.length ?
                                                                    <div className = "row">
                                                                        {
                                                                            status.reblog.media_attachments.map( function(media) {
                                                                                return(
                                                                                    <div className="col">
                                                                                        {
                                                                                            (media.type === "image") ?
                                                                                                <img src={media.url} className = "shadow-sm rounded" alt={media.description} style = {{ width: '100%' }}/>:
                                                                                                <video src={media.url} autoPlay={false} controls={true} className = "shadow-sm rounded" alt={media.description} style = {{ width: '100%' }}/>
                                                                                        }
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

                                        <div className='mb-2'>
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
                                                                            {
                                                                                (media.type === "image") ?
                                                                                    <img src={media.url} className = "shadow-sm rounded" alt={media.description} style = {{ width: '100%' }}/>:
                                                                                        <video src={media.url} autoPlay={false} controls={true} className = "shadow-sm rounded" alt={media.description} style = {{ width: '100%' }}/>
                                                                            }
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
                                    client={_this.client}
                                    status={status}
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