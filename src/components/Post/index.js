import React, { Component } from 'react';
import {
    Persona,
    DocumentCard,
    DocumentCardActivity,
    DocumentCardTitle,
    DocumentCardType,
    DocumentCardDetails,
    CompoundButton,
    ActionButton,
    Dialog,
    DialogType
} from "office-ui-fabric-react";
import * as moment from 'moment';
import { Status } from 'megalodon';

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
            <div>
                <ul className="nav">
                    <li>
                        <ActionButton
                            data-automation-id="test"
                            iconProps={{ iconName: 'Reply' }}
                            allowDisabledFocus={true}
                            disabled={false}
                            checked={false}
                            onClick={() => this.toggle_favorite()}
                        >
                            {this.state.replies}
                        </ActionButton>
                    </li>
                    <li toggle={this.toggle}>
                        {
                            this.state.favorited === (true) ?
                                <ActionButton
                                    data-automation-id="test"
                                    iconProps={{ iconName: 'FavoriteStarFill' }}
                                    allowDisabledFocus={true}
                                    disabled={false}
                                    checked={false}
                                    onClick={() => this.toggle_favorite()}
                                >
                                    {this.state.favorites}
                                </ActionButton>:
                                <ActionButton
                                    data-automation-id="test"
                                    iconProps={{ iconName: 'FavoriteStar' }}
                                    allowDisabledFocus={true}
                                    disabled={false}
                                    checked={false}
                                    onClick={() => this.toggle_favorite()}
                                >
                                    {this.state.favorites}
                                </ActionButton>
                        }

                    </li>
                    <li>
                        {
                            this.state.boosted === (true) ?
                                <ActionButton
                                    data-automation-id="test"
                                    iconProps={{ iconName: 'SyncOccurence' }}
                                    allowDisabledFocus={true}
                                    disabled={false}
                                    checked={false}
                                    onClick={() => this.toggle_boost()}
                                >
                                    {this.state.boosts}
                                </ActionButton>:
                                <ActionButton
                                    data-automation-id="test"
                                    iconProps={{ iconName: 'UnsyncOccurence' }}
                                    allowDisabledFocus={true}
                                    disabled={false}
                                    checked={false}
                                    onClick={() => this.toggle_boost()}
                                >
                                    {this.state.boosts}
                                </ActionButton>
                        }

                    </li>
                    <li>
                    {
                        this.state.url ?
                            <ActionButton
                                data-automation-id="test"
                                iconProps={{ iconName: 'Link' }}
                                allowDisabledFocus={true}
                                disabled={false}
                                checked={false}
                                href={this.state.url}
                            >
                            </ActionButton>:
                            <ActionButton
                                data-automation-id="test"
                                iconProps={{ iconName: 'RemoveLink' }}
                                allowDisabledFocus={true}
                                disabled={false}
                                checked={false}
                            >
                            </ActionButton>

                    }
                    </li>
                </ul>
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
        let status = this.state.status;
        return (
            <div className="mt-2">
                <CompoundButton primary={false} secondaryText={status.spoiler_text} onClick={this.toggle}>
                    Show spoiler
                </CompoundButton>
                <Dialog
                    hidden={!this.state.modal}
                    onDismiss={this.toggle}
                    dialogContentProps={{
                        type: DialogType.normal,
                        title: status.spoiler_text,
                        subText:
                            <div>
                                <div dangerouslySetInnerHTML={{__html: status.content}}/>
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
                                            <br/>
                                        </div>:
                                        <span/>
                                }
                            </div>
                    }}
                >
                </Dialog>
            </div>
        );
    }
}

class Post extends Component {
    id;

    constructor(props) {
        super(props);
        this.id = this.props.key;
    }

    render() {
        return (<div className="container shadow-sm rounded p-3">
                {
                        <Persona {... {
                            imageUrl: this.props.status.account.avatar,
                            text: <a href={this.props.status.account.url} style={{ color: '#212529' }}>{this.props.status.account.display_name}</a>,
                            secondaryText: '@' + this.props.status.account.acct
                        } } />
                }
                <PostContent>
                    {

                        this.props.status.reblog ?
                            <div className='mt-1 ml-4 mb-1'>
                                <div>
                                    { this.props.status.sensitive === true ?
                                        <PostSensitive status={this.props.status}/>:

                                        <div className='ml-4 mb-2'>
                                            <DocumentCard type={DocumentCardType.compact} onClickHref={this.props.status.reblog.url}>
                                                <DocumentCardDetails>
                                                    <DocumentCardTitle
                                                        title={
                                                            <div>
                                                                <div dangerouslySetInnerHTML={{__html: this.props.status.reblog.content}}/>
                                                                {
                                                                    this.props.status.reblog.media_attachments.length ?
                                                                        <div className = "row">
                                                                            {
                                                                                this.props.status.reblog.media_attachments.map( function(media) {
                                                                                    return(
                                                                                        <div className="col" key={'media' + media.id}>
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
                                                            </div>
                                                        }
                                                        shouldTruncate={true}
                                                        showAsSecondaryTitle={true}
                                                    />
                                                    <DocumentCardActivity
                                                        activity={"Originally posted on " + moment(this.props.status.reblog.date).format("MMM Do, YYYY: h:mm A")}
                                                        people={[{ name: this.props.status.reblog.account.acct, profileImageSrc: this.props.status.reblog.account.avatar}]}
                                                    />
                                                </DocumentCardDetails>
                                            </DocumentCard>
                                        </div>}
                                </div>
                            </div>:

                            <div className='mb-2'>
                                { this.props.status.sensitive === true ?
                                    <PostSensitive status={this.props.status}/>:
                                    <div>
                                        <p dangerouslySetInnerHTML={{__html: this.props.status.content}} />
                                        {
                                            this.props.status.media_attachments.length ?
                                                <div className = "row">
                                                    {
                                                        this.props.status.media_attachments.map( function(media) {
                                                            return(
                                                                <div key={'media' + media.id} className="col">
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
                    client={this.props.client}
                    status={this.props.status}
                />
                <PostDate date={moment(this.props.status.created_at).format('MM/DD/YYYY [at] h:mm A')}/>
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

        }

        this.streamListener.on('update', (status: Status) => {
            let old_statuses = _this.state.statuses;
            old_statuses.unshift(status);
            _this.setState({
                statuses: old_statuses
            });
            this.forceUpdate()
        });

        this.streamListener.on('connection-limit-exceeded', err => {
            console.error(err)
        });
    }

    render() {
        let _this = this;
        return (
            <div>
                {this.state.statuses.length > 0 ? <div>{this.state.statuses.map(function (status) {
                        return (<div key={status.id} className="my-3"><Post client={_this.client} status={status}/></div>);
                    })}</div>:
                    <div className="row p-4">
                        <div className = "row">
                            <div className = "col">
                                <h3>Couldn't get timeline</h3>
                                <p>And the fediverse isn't the same without you. Check to make sure you have given Hyperspace access to your account and that you are not being throttled.</p>
                            </div>
                        </div>

                    </div>}

            </div>
        );
    }
}

export default PostRoll;