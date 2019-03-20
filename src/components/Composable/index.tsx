import React, { Component } from 'react';
import { CommandBar, TextField, Callout, Spinner, SpinnerSize, DetailsList, DetailsListLayoutMode, Icon, SelectionMode, Link, DefaultButton, Dropdown, IDropdownOption } from 'office-ui-fabric-react';
import EmojiPicker from '../EmojiPicker';
import Mastodon from 'megalodon';
import { Status } from '../../types/Status';
import { Visibility } from '../../types/Visibility';
import { Attachment } from '../../types/Attachment';
import { PollWizard, PollWizardOption } from '../../types/Poll';
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
    showDescriptionEditor: {[key: string]: boolean};
    isReply: boolean;
    replyId?: string;
    poll?: PollWizard;
    imageDescription: string;
    expire_key: string;
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
            showDescriptionEditor: {},
            isReply: false,
            imageDescription: '',
            expire_key: ''
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

    updateImageDescriptionText(e: any) {
        this.setState({
            imageDescription: e.target.value
        });
    }

    createPoll() {
        if (this.state.poll === undefined) {
            let temporaryPoll: PollWizard = {
                expires_at: '0',
                multiple: false,
                options: [{title: 'Option 1'}, {title: 'Option 2'}]
            }
            this.setState({
                poll: temporaryPoll
            });
        }
    }

    addPollItem() {
        if (this.state.poll !== undefined && this.state.poll.options.length < 4) {
            let newOption = {title: 'New option'}
            let options = this.state.poll.options;
            let poll = this.state.poll;
            options.push(newOption);
            poll.options = options;
            poll.multiple = true;
            this.setState({
                poll: poll
            })
        }
    }

    editPollItem(position: number, newTitle: any) {
        if (this.state.poll !== undefined) {
            let poll = this.state.poll;
            let options = this.state.poll.options;
            options.forEach((option: PollWizardOption) => {
                if (position === options.indexOf(option)) {
                    option.title = newTitle.target.value;
                }
            });
            poll.options = options;
            this.setState({
                poll: poll
            });
            console.log(options);
        }
    }

    removePollItem(item: string) {
        if (this.state.poll !== undefined && this.state.poll.options.length > 2) {
            let options = this.state.poll.options;
            let poll = this.state.poll;
            options.forEach((option: PollWizardOption) => {
                if (item === option.title) {
                    options.splice(options.indexOf(option), 1);
                }
            });
            poll.options = options;
            if (options.length === 2) {
                poll.multiple = false;
            }
            this.setState({
                poll: poll
            })
        }
    }

    setPollExpires(date: IDropdownOption | undefined) {
        if (date !== undefined) {
            let lapse = date.key;
            this.setState({
                expire_key: lapse.toString()
            });
            let currentDate = new Date();
            let newDate = new Date();
            switch(lapse) {
                case '30min':
                    newDate.setMinutes(currentDate.getMinutes() + 30);
                    break
                case '1hr':
                    newDate.setHours(currentDate.getHours() + 1);
                    break
                case '6hr':
                    newDate.setHours(currentDate.getHours() + 6);
                    break
                case '1day':
                    newDate.setDate(currentDate.getDate() + 1);
                    break
                case '3day':
                    newDate.setDate(currentDate.getDate() + 3);
                    break
                case '7day':
                    newDate.setDate(currentDate.getDate() + 7);
                    break
            }
            let poll = this.state.poll;
            if (poll !== undefined) {
                poll.expires_at = ((newDate.getTime() - currentDate.getTime()) / 1000).toString();
                this.setState({
                    poll: poll
                });
            }
        }
    }

    removePoll() {
        this.setState({
            poll: undefined
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
                    let calloutArray = _this.state.showDescriptionEditor;

                    calloutArray[attachment.id] = false;

                    idArray.push(attachment.id);
                    objectArray.push(attachment);


                    _this.setState({
                        mediaIds: idArray,
                        mediaObjects: objectArray,
                        showMediaLoader: false,
                        showDescriptionEditor: calloutArray
                    })
                });
        })
    }

    post() {
        let pollOptions: string[] = [];
        if (this.state.poll !== undefined) {
            this.state.poll.options.forEach((option: PollWizardOption) => {
                pollOptions.push(option.title);
            });
        }
        this.client.post('/statuses', {
            status: this.state.status,
            media_ids: this.state.mediaIds,
            visibility: this.state.visibility,
            sensitive: this.state.sensitive,
            spoiler_text: this.state.spoiler_text,
            in_reply_to_id: this.state.isReply? this.state.replyId: '',
            poll: this.state.poll? {
                options: pollOptions,
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
            showWarningBay: false,
            poll: undefined
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

    updateImageDescription(description: string, id: string) {
        this.client.put('/media/' + id, {
            description: description
        }).then((item: any) => {
            let image: Attachment = item.data;
            let oldObjects = this.state.mediaObjects;
            let calloutArray = this.state.showDescriptionEditor;

            calloutArray[id] = false;

            oldObjects.forEach((element) => {
                if (image.id === element.id) {
                    let index = oldObjects.indexOf(element);
                    oldObjects[index] = image;
                }
            })
            this.setState({
                mediaObjects: oldObjects,
                imageDescription: '',
                showDescriptionEditor: calloutArray
            })
        })
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

    toggleDescriptionEditor(id: string) {
        let calloutArray = this.state.showDescriptionEditor;
        calloutArray[id] = !this.state.showDescriptionEditor[id];
        this.setState({
            showDescriptionEditor: calloutArray
        });
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
                onClick: () => this.changeVisibility('direct'),
                title: 'Marks the post as a direct message. Requires a username in the contents of the post to send to that person.'
            },
            {
                key: 'private',
                name: 'Followers only',
                iconProps: {
                    iconName: 'private',
                    className: 'toolbar-menu-icon'
                },
                onClick: () => this.changeVisibility('private'),
                title: 'Marks the post as followers-only (private).'
            },
            {
                key: 'unlisted',
                name: 'Unlisted',
                iconProps: {
                    iconName: 'unlisted',
                    className: 'toolbar-menu-icon'
                },
                onClick: () => this.changeVisibility('unlisted'),
                title: 'Marks the post as unlisted. Will not appear in the public timeline, but is available for public viewing.'
            },
            {
                key: 'public',
                name: 'Public',
                iconProps: {
                    iconName: 'public',
                    className: 'toolbar-menu-icon'
                },
                onClick: () => this.changeVisibility('public'),
                title: 'Marks the post as public.'
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
                title: 'Upload photos and videos or a file.',
                subMenuProps: {
                    items: [
                        {
                            key: 'media',
                            name: 'Photos/videos',
                            iconProps: {
                                iconName: 'uploadMedia',
                                className: 'toolbar-menu-icon'
                            },
                            onClick: () => this.uploadMedia(),
                            title: 'Upload photos or videos.',
                            disabled: this.state.poll !== undefined
                        },
                        {
                            key: 'file',
                            name: 'Files',
                            secondaryText: 'Coming soon',
                            iconProps: {
                                iconName: 'uploadFile',
                                className: 'toolbar-menu-icon'
                            },
                            title: 'Upload a file with a temporary download link (via Firefox Send).',
                            disabled: true
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
                onClick: () => this.toggleEmojiPicker(),
                title: 'Insert emojis into the post.'
            },
            {
                key: 'poll',
                name: 'Add poll',
                iconProps: {
                    iconName: 'poll',
                    className: 'toolbar-icon'
                },
                className: 'toolbar-icon',
                title: 'Add a poll with options and an expiration date.',
                disabled: this.state.mediaIds.length !== 0,
                onClick: () => this.createPoll()
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
                },
                title: 'Set the visibility of the post and who sees it.'
            },
            {
                key: 'warning',
                name: 'Warning',
                iconProps: {
                    iconName: 'warningApp',
                    className: 'toolbar-icon'
                },
                className: 'toolbar-icon',
                onClick: () => this.toggleWarningBay(),
                title: 'Set a content warning on the post, requiring users to click before viewing.'
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
                onClick: () => this.post(),
                title: 'Publish the post to Mastodon.'
            }
        ]
    }

    imageDescriptionCallout(id: string) {
        return (
            <Callout
                gapSpace={0}
                hidden={!this.state.showDescriptionEditor[id]}
                target={document.getElementById(id)}
                calloutMaxWidth={356}
                key={id}
                onDismiss={() => this.toggleDescriptionEditor(id)}
            >
                <div className = "pl-4 pr-4 pt-4">
                    <p>Set a description for this image. This description will be used by screen readers or other apps and can be viewed when hovering over an image or video in Hyperspace.</p>
                    <TextField onChange={(e) => this.updateImageDescriptionText(e)}></TextField>
                    <p style={{textAlign: 'right'}}><DefaultButton className="mt-4" text="Update description" onClick={() => this.updateImageDescription(this.state.imageDescription, id)}/></p>
                </div>
            </Callout>
        )
    }

    getPollOptions() {
        let items: any[] = [];
        if (this.state.poll !== undefined) {
            this.state.poll.options.forEach((element, index) => {
                let item = {
                    'option': <TextField resizable={false} multiline={false} maxLength={420} defaultValue={element.title} onChange={(e) => this.editPollItem(index, e)}/>,
                    'removeButton': <DefaultButton onClick={() => this.removePollItem(element.title)} text="Remove"/>
                }
                items.push(item);
            });
        }
        return items;
    }

    getExpirationDates() {
        return [
            {key: '30min', text: '30 minutes'},
            {key: '1hr', text: '1 hour'},
            {key: '6hr', text: '6 hours'},
            {key: '1day', text: '1 day'},
            {key: '3day', text: '3 days'},
            {key: '7days', text: '7 days'}
        ];
    }

    pollEditor() {
        let columns = [
            {
                key: 'option',
                name: 'Poll option',
                fieldName: 'option',
                minWidth: 256
            },
            {
                key: 'removeButton',
                name: '',
                fieldName: 'removeButton',
                minWidth: 100
            }
        ];
        if (this.state.poll)
            return (
                <div>
                    <DetailsList
                    isHeaderVisible={false}
                    layoutMode={DetailsListLayoutMode.justified}
                    selectionMode={SelectionMode.none}
                    items={this.getPollOptions()}
                    columns={columns}
                />
                    <div className="pl-2 pr-2 pt-2 pb-3">
                        <div style={{ display: 'flex'}}>
                            <DefaultButton style={{ marginRight: 8}} text="Add option" onClick={() => this.addPollItem()}/>
                            <DefaultButton style={{ marginRight: 8}} text="Remove poll" onClick={() => this.removePoll()}/>
                            <Dropdown
                                dropdownWidth={200}
                                placeholder = "Select an expiration date"
                                options={this.getExpirationDates()}
                                required={true}
                                onChange={(event, option) => this.setPollExpires(option)}
                                selectedKey={this.state.expire_key? this.state.expire_key: '1day'}
                            />
                        </div>
                    </div>
                </div>
            );
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

    getMediaItemRows() {
        let rows: any[] = [];
        if (this.state.mediaObjects.length === 0) {
            let c = {
                'imageIcon': <span><Icon iconName='uploadMedia' className="media-file-icon"/></span>,
                'fileUrl': 'No media uploaded'
            };
            let rows = [];
            rows.push(c);
            return rows;
        } else {
            this.state.mediaObjects.forEach((item: Attachment) => {
                let element = {
                    'imageIcon': <span style={{ textAlign: 'center' }}><img src={item.url} style={{ width: "auto", height: 22}}/></span>,
                    'fileUrl': <span id={item.id}><a href={item.url}>{item.description? item.description: 'No description'}</a> (<Link onClick={() => this.toggleDescriptionEditor(item.id)}>Describe</Link>) {this.imageDescriptionCallout(item.id)}</span>
                }
                rows.push(element);
            });
        }

        return rows;
    }

    mediaBay() {
        let columns = [
            {
                key: 'imageIcon',
                fieldName: 'imageIcon',
                name: '',
                value: 'Media file',
                iconName: 'uploadMedia',
                iconClassName: 'media-file-header-icon',
                isIconOnly: false,
                minWidth: 16,
                maxWidth: 16,
                isPadded: true
            },
            {
                key: 'fileUrl',
                name: '',
                fieldName: 'fileUrl',
                iconName: 'linkApp',
                iconClassName: 'media-file-header-icon',
                value: 'File URL',
                minWidth: 24,
                isPadded: true,
                isIconOnly: false
            }
        ];
        if (this.state.mediaIds.length > 0)
            return (
                <DetailsList
                    isHeaderVisible={false}
                    items={this.getMediaItemRows()}
                    columns={columns}
                    selectionMode={SelectionMode.none}
                    layoutMode={DetailsListLayoutMode.justified}
                />
            );
    }

    render() {
        return (
            <div id="compose-window" className={getDarkMode()}>
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
                    title="Type your status here and click 'Post' or press Ctrl/⌘ + Enter to send it."
                />
                {this.warningInput()}
                {this.pollEditor()}
                {this.mediaBay()}
                {this.state.showMediaLoader ? <Spinner className = "my-3" size={SpinnerSize.medium} label="Uploading media..." ariaLive="assertive" labelPosition="right" />: <span/>}
                {this.emojiCallout()}
            </div>
        );
    }

}

export default Composable;
