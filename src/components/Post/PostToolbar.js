import React, {Component} from 'react';
import {ActionButton, TooltipHost, Dialog, DialogType, DialogFooter, PrimaryButton, DefaultButton} from "office-ui-fabric-react";
import ReplyWindow from '../ReplyWindow';
import ThreadPanel from '../ThreadPanel';
import { getDarkMode } from '../../utilities/getDarkMode';

/**
 * A small toolbar including common actions for interacting with
 * a post.
 * 
 * @param client The client used to ineract with a post.
 * @param status The post to interact with.
 * @param nothread Whether to hide the 'Show thread' button
 */
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
            url: this.props.status.url,
            noThread: this.props.nothread,
            hideDeleteDialog: true
        };

        this.toggle_favorite = this.toggle_favorite.bind(this);
        this.toggle_boost = this.toggle_boost.bind(this);
    }

    openDeleteDialog() {
        this.setState({hideDeleteDialog: false})
    }

    deletePost() {
        this.client.del('/statuses/' + this.state.id)
        .then(() => {
            this.closeDeleteDialog();
        })
    }

    closeDeleteDialog() {
        this.setState({hideDeleteDialog: true})
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

    startReply() {
        return(<ReplyWindow to={this.state.id}/>);
    }

    getLinkAndCopy(link) {
        let temporaryDiv = document.createElement("textarea");
        temporaryDiv.value = link;
        document.body.appendChild(temporaryDiv);
        temporaryDiv.select();
        document.execCommand("copy");
        document.body.removeChild(temporaryDiv);

        new Notification("Link copied!", {
            body: "Feel free to paste this wherever you need it!"
        })
    }

    render() {
        return (
            <div>
                <ul className="nav" name="post-toolbar">
                    <li>
                        <ReplyWindow status={this.props.status} client={this.props.client} fullButton={true}/>
                    </li>
                    <li toggle={this.toggle}>
                        {
                            this.state.favorited === (true) ?
                                <ActionButton
                                    data-automation-id="test"
                                    iconProps={{ iconName: 'favoriteFill', className: 'post-toolbar-icon' }}
                                    allowDisabledFocus={true}
                                    disabled={false}
                                    checked={false}
                                    onClick={() => this.toggle_favorite()}
                                    className='post-toolbar-icon'
                                >
                                    <span className="d-none d-md-block">Unfavorite ({this.state.favorites})</span>
                                </ActionButton>:
                                <ActionButton
                                    data-automation-id="test"
                                    iconProps={{ iconName: 'favorite', className: 'post-toolbar-icon' }}
                                    allowDisabledFocus={true}
                                    disabled={false}
                                    checked={false}
                                    onClick={() => this.toggle_favorite()}
                                    className='post-toolbar-icon'
                                >
                                    <span className="d-none d-md-block">Favorite ({this.state.favorites})</span>
                                </ActionButton>
                        }

                    </li>
                    <li>
                        {
                            this.state.boosted === (true) ?
                                <ActionButton
                                    data-automation-id="test"
                                    iconProps={{ iconName: 'boostFill', className: 'post-toolbar-icon' }}
                                    allowDisabledFocus={true}
                                    disabled={false}
                                    checked={false}
                                    onClick={() => this.toggle_boost()}
                                    className='post-toolbar-icon'
                                >
                                    <span className="d-none d-md-block">Unboost ({this.state.boosts})</span>
                                </ActionButton>:
                                <ActionButton
                                    data-automation-id="test"
                                    iconProps={{ iconName: 'boost', className: 'post-toolbar-icon' }}
                                    allowDisabledFocus={true}
                                    disabled={false}
                                    checked={false}
                                    onClick={() => this.toggle_boost()}
                                    className='post-toolbar-icon'
                                >
                                    <span className="d-none d-md-block">Boost ({this.state.boosts})</span>
                                </ActionButton>
                        }

                    </li>
                    <li>
                        {
                            !this.state.noThread ? <ThreadPanel fromWhere={this.props.status.id} client={this.client} fullButton={true}/>: <span/>
                        }

                    </li>
                    <li>
                        {
                            this.state.url ?
                                <ActionButton
                                    data-automation-id="test"
                                    iconProps={{ iconName: 'linkApp', className: 'post-toolbar-icon' }}
                                    allowDisabledFocus={true}
                                    disabled={false}
                                    checked={false}
                                    onClick={() => this.getLinkAndCopy(this.state.url)}
                                    className='post-toolbar-icon'
                                >
                                    <span className="d-none d-md-block">Copy link</span>
                                </ActionButton>:
                                <TooltipHost content={this.checkIfUnlisted()}>
                                    <ActionButton
                                        data-automation-id="test"
                                        iconProps={{ iconName: 'unlinkApp', className: 'post-toolbar-icon' }}
                                        allowDisabledFocus={true}
                                        disabled={false}
                                        checked={false}
                                        className='post-toolbar-icon'
                                    >
                                        <span className="d-none d-md-block">Copy link</span>
                                    </ActionButton>
                                </TooltipHost>

                        }
                    </li>
                    <li>
                        {
                            (this.props.status.account.acct === JSON.parse(localStorage.getItem('account')).acct) && (!this.props.status.reblog) ?
                            <ActionButton
                                iconProps={{iconName: 'deletePost', className: 'post-toolbar-icon'}}
                                checked={false}
                                onClick={() => this.openDeleteDialog()}
                            >Delete</ActionButton>:
                            <span/>
                        }
                    </li>
                </ul>
                <Dialog
                    hidden={this.state.hideDeleteDialog}
                    onDismiss={this._closeDialog}
                    className={getDarkMode()}
                    dialogContentProps={{
                        type: DialogType.normal,
                        title: 'Delete this post?',
                        subText: "Are you sure you want to delete this? You can't undo this action."
                    }}
                    modalProps={{
                        isBlocking: true,
                        containerClassName: 'ms-dialogMainOverride'
                    }}
                    >
                    <DialogFooter>
                        <PrimaryButton onClick={() => this.deletePost()} text="Delete" />
                        <DefaultButton onClick={() => this.closeDeleteDialog()} text="Cancel" />
                    </DialogFooter>
                </Dialog>
            </div>
        );
    }
}

export default PostToolbar;