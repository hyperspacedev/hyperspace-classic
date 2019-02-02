import React, {Component} from 'react';
import {ActionButton, TooltipHost} from "office-ui-fabric-react";

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

    checkIfUnlisted() {
        if (this.props.status.reblog) {
            return 'This status is a boost of another.';
        } else {
            let visibility = this.props.status.visibility;
            if (visibility === 'private') {
                return 'The author made this status visible to their followers only.';
            } else if (visibility === 'direct') {
                return 'The author made this status visible only to you.';
            } else {
                return 'We couldn\'t fetch the link for this post.';
            }
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
                            Reply ({this.state.replies})
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
                                    Unfavorite ({this.state.favorites})
                                </ActionButton>:
                                <ActionButton
                                    data-automation-id="test"
                                    iconProps={{ iconName: 'FavoriteStar' }}
                                    allowDisabledFocus={true}
                                    disabled={false}
                                    checked={false}
                                    onClick={() => this.toggle_favorite()}
                                >
                                    Favorite ({this.state.favorites})
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
                                    Unboost ({this.state.boosts})
                                </ActionButton>:
                                <ActionButton
                                    data-automation-id="test"
                                    iconProps={{ iconName: 'UnsyncOccurence' }}
                                    allowDisabledFocus={true}
                                    disabled={false}
                                    checked={false}
                                    onClick={() => this.toggle_boost()}
                                >
                                    Boost ({this.state.boosts})
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
                                    Link
                                </ActionButton>:
                                <TooltipHost content={this.checkIfUnlisted()}>
                                    <ActionButton
                                        data-automation-id="test"
                                        iconProps={{ iconName: 'RemoveLink' }}
                                        allowDisabledFocus={true}
                                        disabled={false}
                                        checked={false}
                                    >
                                        Link
                                    </ActionButton>
                                </TooltipHost>

                        }
                    </li>
                </ul>
            </div>
        );
    }
}

export default PostToolbar;