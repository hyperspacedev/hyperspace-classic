import React, { Component } from 'react';
import { CommandBar, TextField, Callout, Dialog, DialogBase, DialogFooter, Spinner, SpinnerSize, DetailsList, DetailsListLayoutMode, Icon } from 'office-ui-fabric-react';
import EmojiPicker from '../EmojiPicker';
import Mastodon from 'megalodon';
import { Status } from '../../types/Status';
import { Visibility } from '../../types/Visibility';
import { Attachment } from '../../types/Attachment';
import { Poll, PollOption } from '../../types/Poll';
import { anchorInBrowser } from '../../utilities/anchorInBrowser';
import { getDarkMode } from '../../utilities/getDarkMode';
import filedialog from 'file-dialog';

interface IComposableProps {
    client: Mastodon;
    reply_to?: Status;
}

interface IComposableState {
    status: string;
    mediaIds: string[];
    mediaObjects: Attachment[];
    visibility: Visibility;
    spoiler_text: string;
    sensitive: boolean;
    showMediaLoader: boolean;
    showEmojiPicker: boolean;
    showWarningBay: boolean;
    isReply: boolean;
    replyId?: string;
    poll?: Poll;
}

/**
 * Base class for a composable element. Used to create new statuses
 * and replies to old ones.
 * 
 * @param client The Mastodon client used to post statuses
 * @param reply_to The reply to attach a status to, if applicable
 */
class Composable extends Component<IComposableProps, IComposableState> {
    client: Mastodon;

    constructor(props: any) {
        super(props);

        this.client = this.props.client;
        
        this.state = {
            status: '',
            mediaIds: [],
            mediaObjects: [],
            visibility: "public",
            spoiler_text: '',
            sensitive: false,
            showEmojiPicker: false,
            showMediaLoader: false,
            showWarningBay: false,
            isReply: false
        }

        if (this.props.reply_to) {
            this.setState({
                isReply: true,
                replyId: this.props.reply_to.id
            });
        }
    }

    componentDidUpdate() {
        anchorInBrowser();
    }

    //Actions

    updateStatusText(e: any) {
        this.setState({
            status: e.target.value
        });
    }

    updateVisibility(newVisibility: Visibility) {
        this.setState({
            visibility: newVisibility
        });
    }

    uploadMedia() {
        let _this = this;
        filedialog({
            multiple: false,
            accept: 'image/*, video/*'
        })
        .then((images: any) => {
            let uploadFormData = new FormData();
            uploadFormData.append('file', images[0]);
            _this.setState({ showMediaLoader: true })

            _this.client.post('/media', uploadFormData)
                .then((resp: any) => {
                    let attachment: Attachment = resp.data;
                    let idArray = _this.state.mediaIds;
                    let objectArray = _this.state.mediaObjects;
                    
                    idArray.push(attachment.id);
                    objectArray.push(attachment);

                    _this.setState({
                        mediaIds: idArray,
                        mediaObjects: objectArray,
                        showMediaLoader: false
                    })
                });
        })
    }

    post() {
        this.client.post('/statuses', {
            status: this.state.status,
            media_ids: this.state.mediaIds,
            visibility: this.state.visibility,
            sensitive: this.state.sensitive,
            spoiler_text: this.state.spoiler_text,
            in_reply_to_id: this.state.isReply? this.state.replyId: '',
            poll: this.state.poll? {
                options: this.state.poll.options,
                expires_in: this.state.poll.expires_at,
                multiple: this.state.poll.multiple
            }: {}
        })

        this.setState({
            mediaIds: [],
            mediaObjects: [],
            status: '',
            visibility: "public",
            sensitive: false,
            spoiler_text: '',
            isReply: false,
            replyId: '',
            showWarningBay: false
        })
    }

    insertEmoji(e: any) {
        if (e.custom) {
            this.setState({
                status: this.state.status + e.colons
            });
        } else {
            this.setState({
                status: this.state.status + e.native
            });
        }
    }

    postViaKeyboard(event: any) {
        if ((event.metaKey || event.ctrlKey) && event.keyCode == 13) {
            this.post();
        }
    }

    changeVisibility(vis: Visibility) {
        this.setState({
            visibility: vis
        });
    }

    updateWarningText(e: any) {
        if (e.target.value != '') {
            this.setState({
                sensitive: true,
                spoiler_text: e.target.value
            })
        } else {
            this.setState({
                sensitive: false
            })
        }
    }

    // Rendering

    toggleEmojiPicker() {
        this.setState({
            showEmojiPicker: !this.state.showEmojiPicker
        });
    }

    toggleWarningBay() {
        this.setState({
            showWarningBay: !this.state.showWarningBay
        })
    }

    getWarning() {
        if (this.state.sensitive) {
            return (
                <p className = "compose-window-warning">
                    <span>
                        <Icon iconName = "warningApp"/>
                        <b>Warning: </b> {this.state.spoiler_text}
                    </span>
                </p>
            );
        } else {
            return <span/>;
        }
    }

    getVisibilityIcon() {
        if (this.state.visibility === "direct") {
            return 'directMessage';
        } else {
            return this.state.visibility;
        }
    }

    visibilitySubMenu() {
        return [
            {
                key: 'direct',
                name: 'Direct message',
                iconProps: {
                    iconName: 'directMessage',
                    className: 'toolbar-menu-icon'
                },
                onClick: () => this.changeVisibility('direct')
            },
            {
                key: 'private',
                name: 'Followers only',
                iconProps: {
                    iconName: 'private',
                    className: 'toolbar-menu-icon'
                },
                onClick: () => this.changeVisibility('private')
            },
            {
                key: 'unlisted',
                name: 'Unlisted',
                iconProps: {
                    iconName: 'unlisted',
                    className: 'toolbar-menu-icon'
                },
                onClick: () => this.changeVisibility('unlisted')
            },
            {
                key: 'public',
                name: 'Public',
                iconProps: {
                    iconName: 'public',
                    className: 'toolbar-menu-icon'
                },
                onClick: () => this.changeVisibility('public')
            }
        ]
    }

    getToolbarItems() {
        return [
            {
                key: 'upload',
                name: 'Upload',
                iconProps: {
                    iconName: 'uploadBase',
                    className: 'toolbar-icon'
                },
                className: 'toolbar-icons',
                subMenuProps: {
                    items: [
                        {
                            key: 'media',
                            name: 'Photos/videos',
                            iconProps: {
                                iconName: 'uploadMedia',
                                className: 'toolbar-menu-icon'
                            },
                            onClick: () => this.uploadMedia()
                        },
                        {
                            key: 'file',
                            name: 'Files',
                            secondaryText: 'Coming soon',
                            iconProps: {
                                iconName: 'uploadFile',
                                className: 'toolbar-menu-icon'
                            }
                        }
                    ]
                }
            },
            {
                key: 'emoji',
                name: 'Emoji',
                iconProps: {
                    iconName: 'emojiPicker',
                    className: 'toolbar-icon'
                },
                className: 'toolbar-icon',
                id: 'emojiPickerButton',
                onClick: () => this.toggleEmojiPicker()
            },
            {
                key: 'poll',
                name: 'Add poll',
                iconProps: {
                    iconName: 'poll',
                    className: 'toolbar-icon'
                },
                className: 'toolbar-icon'
            },
            {
                key: 'visibility',
                name: 'Visibility',
                iconProps: {
                    iconName: this.getVisibilityIcon(),
                    className: 'toolbar-icon'
                },
                className: 'toolbar-icon',
                subMenuProps: {
                    items: this.visibilitySubMenu()
                }
            },
            {
                key: 'warning',
                name: 'Warning',
                iconProps: {
                    iconName: 'warningApp',
                    className: 'toolbar-icon'
                },
                className: 'toolbar-icon',
                onClick: () => this.toggleWarningBay()
            }
        ]
    }

    postStatusButton() {
        return [
            {
                key: 'post',
                name: 'Post',
                iconProps: {
                    iconName: 'postStatus',
                    className: 'toolbar-icon'
                },
                className: 'toolbar-icon mainAction',
                onClick: () => this.post()
            }
        ]
    }

    emojiCallout() {
        return (
            <Callout
                gapSpace={0}
                hidden={!this.state.showEmojiPicker}
                onDismiss={() => this.toggleEmojiPicker()}
                target={document.getElementById('emojiPickerButton')}
            >
                <EmojiPicker client={this.client} onGetEmoji={(emoji: any) => this.insertEmoji(emoji)}/>
            </Callout>
        );
    }

    getWarningClass() {
        if (this.state.sensitive && this.state.spoiler_text.includes('NSFW: ')) {
            return 'compose-window-warning nsfw';
        } else {
            return 'compose-window-warning';
        }
    }

    warningInput() {
        if (this.state.showWarningBay) {
            return (
                <div className = {"ms-fadeIn100 p-3 " + this.getWarningClass()}>
                    <h5> <Icon iconName='warningApp'/> Warning</h5>
                    <p>Add a content warning to your post. This may be used to hide a spoiler or provide a warning of the contents that may not be appropriate for all audiences.</p>
                    <TextField
                        multiline={false}
                        resizable={false}
                        placeholder="Content warning"
                        onChange={(e) => this.updateWarningText(e)}
                        data-enable-grammarly={false}
                    />
                    <small>Tip: You can add 'Spoiler: ' or 'NSFW: ' to the beginning of your warning to let Hyperspace and other apps mark the warning.</small>
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                <CommandBar 
                    items={this.getToolbarItems()}
                    farItems={this.postStatusButton()}
                    overflowButtonProps={{menuIconProps: {iconName: 'overflowMenu', iconClassName: 'toolbar-icon'}, className: 'toolbar-icon', name: 'More'}}
                />
                <TextField
                    multiline={true}
                    rows={5}
                    maxLength={500}
                    resizable={false}
                    onKeyDown={(e) => this.postViaKeyboard(e)}
                    onChange={(e: any) => this.updateStatusText(e)}
                    placeholder="What's on your mind?"
                    data-enable-grammarly={false}
                    defaultValue={this.state.status}
                    title="Tyoe your status here and click 'Post' or press Ctrl/⌘ + Enter to send it."
                />
                {this.warningInput()}
                {this.emojiCallout()}
            </div>
        );
    }

}

export default Composable;