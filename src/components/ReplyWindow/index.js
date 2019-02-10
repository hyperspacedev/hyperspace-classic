import React, {Component} from 'react';
import {
    Dialog,
    DialogFooter,
    DialogType,
    Panel,
    PanelType,
    CommandBar,
    PrimaryButton,
    DefaultButton,
    ActionButton,
    TextField,
    Link, Icon, SelectionMode, DetailsListLayoutMode, DetailsList, ChoiceGroup, Toggle, Callout
} from 'office-ui-fabric-react';
import filedialog from 'file-dialog';
import EmojiPicker from 'emoji-picker-react';
import 'emoji-picker-react/dist/universal/style.scss';

class ReplyWindow extends Component {

    client;

    constructor(props) {
        super(props);

        this.state = {
            hideReplyPanel: true,
            to: this.props.status.id,
            reply_count: this.props.status.replies_count,
            author: this.props.status.account.display_name,
            author_id: this.props.status.account.acct,
            original_status: this.getReplyOrMessage(this.props.status),
            reply_contents: '@' + this.props.status.account.acct + ': ',
            visibility: this.props.status.visibility,
            media: [],
            media_data: [],
            spoiler_text: '',
            sensitive: false,
            hideSpoilerDialog: true,
            hideEmojiPicker: true,
            hideVisibilityDialog: true
        };

        this.client = this.props.client;
    }

    getReplyOrMessage(status) {
        if (status.visibility === "direct") {
            return status.account.display_name + ' messaged you: ' + status.content;
        } else {
            return status.account.display_name + ' originally posted: ' + status.content;
        }
    }

    toggleVisibilityDialog() {
        this.setState({
            hideVisibilityDialog: !this.state.hideVisibilityDialog
        })
    }

    openPanel() {
        this.setState({
            hideReplyPanel: false
        })
    }

    closeReplyPanel() {
        this.setState({
            hideReplyPanel: true
        })
    }

    updateStatus(e) {
        this.setState({
            reply_contents: e.target.value
        });
    }

    postReply() {
        this.client.post('/statuses', {
            status: this.state.reply_contents,
            in_reply_to_id: this.state.to,
            visibility: this.state.visibility,
            sensitive: this.state.sensitive,
            spoiler_text: this.state.spoiler_text,
            media_ids: this.state.media
        });
        this.setState({
            hideReplyPanel: true
        })
    }

    replyOrThread() {
        if (this.state.author_id === JSON.parse(localStorage.getItem('account')).acct) {
            if (this.state.reply_count <= 0) {
                return 'Start thread';
            } else {
                return 'Continue thread';
            }
        } else {
            return 'Reply'
        }
    }

    discernVisibilityNoticeKeyword() {
        if (this.state.visibility === "direct") {
            return 'private message';
        } else {
            return this.state.visibility + ' status';
        }
    }

    postMediaForStatus() {
        let _this = this;
        filedialog({
            multiple: false,
            accept: 'image/*, video/*'
        }).then((images) => {
            let uploadData = new FormData();

            uploadData.append('file', images[0]);

            _this.client.post('/media', uploadData)
                .then((resp) => {
                    console.log('Media uploaded!');
                    let id = resp.data.id;
                    let media_id_array = _this.state.media;
                    let media_data_array = this.state.media_data;
                    media_id_array.push(id);
                    media_data_array.push(resp.data);
                    _this.setState({
                        media: media_id_array,
                        media_data: media_data_array
                    })
                })
        })
    }

    getMediaItemColumns() {
        return [
            {
                key: 'fileIcon',
                fieldName: 'fileIcon',
                value: 'File Icon',
                iconName: 'attachedFile',
                iconClassName: 'media-file-header-icon',
                isIconOnly: false,
                minWidth: 16,
                maxWidth: 16,
                isPadded: true

            },
            {
                key: 'fileUrl',
                fieldName: 'fileUrl',
                iconName: 'linkApp',
                iconClassName: 'media-file-header-icon',
                value: 'File URL',
                minWidth: 24,
                isPadded: true,
                isIconOnly: false
            }
        ];
    }

    getMediaItemRows() {
        let rows = [];
        if (this.state.media_data.length === 0) {
            let c = {
                'fileIcon': <span><Icon iconName='helpApp' className="media-file-icon"/></span>,
                'fileUrl': 'No media uploaded'
            };
            let rows = [];
            rows.push(c);
            return rows;
        } else {
            for (let i in this.state.media_data) {
                let c = {
                    'fileIcon': <span><Icon iconName='attachedFile' className="media-file-icon"/></span>,
                    'fileUrl': <a href={this.state.media_data[i].url}>{this.state.media_data[i].url}</a>
                };
                rows.push(c);
            }
        }

        return rows;
    }

    getVisibilityIcon() {
        if (this.state.visibility === 'public') {
            return 'public';
        } else if (this.state.visibility === 'unlisted') {
            return 'unlisted';
        } else if (this.state.visibility === 'private') {
            return 'private';
        } else {
            return 'directMessage';
        }
    }

    getSpoilerText() {
        if (this.state.sensitive) {
            return (<span className="my-1 ml-2"><Icon iconName = "warningApp"/> <b>Warning: </b>{this.state.spoiler_text} </span>);
        } else {
            return (<span/>);
        }
    }

    getItems(){
        return [
            {
                key: 'media',
                name: 'Upload media',
                iconProps: {
                    iconName: 'uploadMedia',
                    className: 'toolbar-icon'
                },
                className: 'toolbar-icon',
                onClick: () => this.postMediaForStatus()
            },
            {
                key: 'visibility',
                name: 'Change visibility',
                iconProps: {
                    iconName: this.getVisibilityIcon(),
                    className: 'toolbar-icon'
                },
                className: 'toolbar-icon',
                onClick: () => this.toggleVisibilityDialog()
            },
            {
                key: 'emoji',
                name: 'Add emoji',
                iconProps: {
                    iconName: 'emojiPicker',
                    className: 'toolbar-icon'
                },
                className: 'toolbar-icon',
                id: 'emojiPickerReplyButton',
                onClick: () => this.toggleEmojiPicker()
            }
        ];
    };

    getOverflowItems() {
        return [
            {
                key: 'spoiler',
                name: this.setWarningButtonText(),
                iconProps: {
                    iconName: 'warningApp',
                    className: 'toolbar-icon'
                },
                className: 'toolbar-icon',
                onClick: () => this.toggleSpoilerDialog()
            }
        ];
    }

    _onChoiceChanged(event, option) {
        let _this = this;
        _this.setState({
            visibility: option.key
        });
    }

    toggleSpoilerDialog() {
        this.setState({
            hideSpoilerDialog: !this.state.hideSpoilerDialog
        })
    }

    onSpoilerVisibilityChange(event, checked) {
        this.setState({
            sensitive: !!checked
        });
        if (checked === false) {
            this.setState({
                spoiler_text: ''
            })
        }
    }

    onSpoilerTextChange(e) {
        this.setState({
            spoiler_text: e.target.value
        })
    }

    setVisibilityContentText() {
        let text = <p>Choose who gets to see your reply.</p>;
        let altText = '';
        if (this.state.visibility === "direct") {
            altText = <p><b style={{ fontWeight: 700}}>Note: you need to add the recipient/recipients by typing their username/handle to send the message.</b></p>
        }

        return <span>{text}{altText !== '' ? altText: <span/>}</span>;
    }

    setWarningButtonText() {
        if (this.state.sensitive) {
            return 'Change warning';
        } else {
            return 'Add warning';
        }
    }

    setWarningHeaderText() {
        if (this.state.sensitive) {
            return 'Change or remove your warning';
        } else {
            return 'Add a warning';
        }
    }

    setWarningContentText() {
        if (this.state.sensitive) {
            return 'Change or remove the warning on your post. This may be used to hide a spoiler or provide a warning of the contents of your post that may not be appropriate for all audiences.';
        } else {
            return 'Add a content warning to your post. This may be used to hide a spoiler or provide a warning of the contents of your post that may not be appropriate for all audiences.';
        }
    }

    toggleEmojiPicker() {
        this.setState({
            hideEmojiPicker: !this.state.hideEmojiPicker
        })
    }

    addEmojiToStatus(e) {
        let emojiInsert = String.fromCodePoint("0x" + e);
        console.log(e);
        this.setState({
            reply_contents: this.state.reply_contents + emojiInsert
        });
    }

    getTypeOfWarning(event, option) {
        if (option.key ==='none') {
            let text = this.state.spoiler_text.replace('NSFW: ', '').replace('Spoiler: ', '');
            this.setState({
                spoiler_text: text
            })
        } else if (option.key === 'nsfw') {
            this.setState({
                spoiler_text: 'NSFW: ' + this.state.spoiler_text.replace('Spoiler: ', '')
            })
        } else if (option.key === 'spoiler') {
            this.setState({
                spoiler_text: 'Spoiler: ' + this.state.spoiler_text.replace('NSFW: ', '')
            })
        }
    }

    giveVisibilityDialog() {
        return (
        <Dialog
            hidden={this.state.hideVisibilityDialog}
            onDismiss={() => this.toggleVisibilityDialog()}
            dialogContentProps={{
                type: DialogType.largeHeader,
                title: 'Set your visibility',
                subText: this.setVisibilityContentText()
            }}
            modalProps={{
                isBlocking: false,
                containerClassName: 'ms-dialogMainOverride'
            }}
            minWidth={500}
        >
            <ChoiceGroup
                options={[
                    {
                        key: 'direct',
                        id: 'message',
                        text: 'Direct message'
                    },
                    {
                        key: 'private',
                        id: 'followers',
                        text: 'Followers only',
                    },
                    {
                        key: 'unlisted',
                        id: 'unlisted',
                        text: 'Public (unlisted)',
                    },
                    {
                        key: 'public',
                        id: 'public',
                        text: 'Public (fediverse)',
                        checked: true
                    }
                ]}
                onChange={(event, option) => this._onChoiceChanged(event, option)}
            />
            <DialogFooter>
                <PrimaryButton onClick={() => this.toggleVisibilityDialog()} text="Set" />
            </DialogFooter>
        </Dialog>
        );
    }

    giveEmojiDialog() {
        return (<Callout
            ariaLabelledBy={'callout-label-1'}
            ariaDescribedBy={'callout-description-1'}
            role={'alertdialog'}
            gapSpace={0}
            hidden={this.state.hideEmojiPicker}
            target={document.getElementById('emojiPickerReplyButton')}
        >
            <EmojiPicker onEmojiClick={(e) => this.addEmojiToStatus(e)} emojiResolution={64}/>
        </Callout>);
    }

    giveSpoilerDialog() {
        return (<Dialog
            hidden={this.state.hideSpoilerDialog}
            onDismiss={() => this.toggleSpoilerDialog()}
            dialogContentProps={{
                type: DialogType.largeHeader,
                title: this.setWarningHeaderText(),
                subText: this.setWarningContentText()
            }}
            modalProps={{
                isBlocking: true,
                containerClassName: 'ms-dialogMainOverride'
            }}
            minWidth={500}
        >
            <Toggle
                defaultChecked={this.state.sensitive}
                label="Add a warning"
                onText="On"
                offText="Off"
                onChange={(event, checked) => this.onSpoilerVisibilityChange(event, checked)}
            />
            <ChoiceGroup
                disabled={!this.state.sensitive}
                options={[
                    {
                        key: 'none',
                        id: 'nospecial',
                        text: "Don't mark specifically",
                        checked: true
                    },
                    {
                        key: 'nsfw',
                        id: 'nsfw',
                        text: "Mark as NSFW"
                    },
                    {
                        key: 'spoiler',
                        id: 'spoiler',
                        text: "Mark as a spoiler"
                    }
                ]}
                onChange={(event, option) => this.getTypeOfWarning(event, option)}
            />
            <TextField
                multiline={true}
                rows={5}
                resizable={false}
                label="Warning text"
                onBlur={(e) => this.onSpoilerTextChange(e)}
                defaultValue={this.state.spoiler_text}
            />
            <DialogFooter>
                <PrimaryButton onClick={() => this.toggleSpoilerDialog()} text="Save" />
            </DialogFooter>
        </Dialog>);
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

    giveDialogBox() {
        return (
            <Panel
                isOpen={!this.state.hideReplyPanel}
                onDismiss={() => this.closeReplyPanel()}
                headerText={"Reply to " + this.state.author}
                type={PanelType.medium}
                styles={this.getPanelStyles()}
                onRenderFooterContent={() => {return (
                            <div>
                                <PrimaryButton
                                    onClick={() => this.postReply()}
                                    style={{marginRight: '8px'}}
                                    text="Post reply"
                                />
                                <DefaultButton
                                    onClick={() => this.closeReplyPanel()}
                                    text="Cancel"
                                />
                            </div>
                        )
                    ;}
                }
            >
                <div dangerouslySetInnerHTML={{__html: this.state.original_status}}/>
                <p>Note: your reply will be sent as a <b>{this.discernVisibilityNoticeKeyword()}.</b></p>
                <p className="mt-1">{this.getSpoilerText()}</p>
                <CommandBar
                    items={this.getItems()}
                    overflowItems={this.getOverflowItems()}
                    ariaLabel={'Use left and right arrow keys to navigate between commands'}
                    overflowButtonProps={{ menuIconProps: {iconName: 'overflowMenu', iconClassName: 'toolbar-icons'}, className: 'toolbar-icon', name: 'More' }}
                />
                <TextField
                multiline={true}
                rows={5}
                resizable={false}
                maxLength={500}
                onBlur={e => this.updateStatus(e)}
                placeholder="Type your reply here..."
                defaultValue={this.state.reply_contents}
                />
                <DetailsList
                    columns={this.getMediaItemColumns()}
                    items={this.getMediaItemRows()}
                    selectionMode={SelectionMode.none}
                    layoutMode={DetailsListLayoutMode.justified}
                />

                {this.giveVisibilityDialog()}
                {this.giveSpoilerDialog()}
                {this.giveEmojiDialog()}

            </Panel>
        );
    }

    giveFullActionButton() {
        return (<div>
            <ActionButton
                data-automation-id="test"
                iconProps={{ iconName: 'replyApp', className: 'post-toolbar-icon' }}
                allowDisabledFocus={true}
                disabled={false}
                checked={false}
                onClick={() => this.openPanel()}
                className='post-toolbar-icon'
            >
                {this.replyOrThread()} ({this.state.reply_count})
            </ActionButton>
            {this.giveDialogBox()}
        </div>);
    }

    giveSmallButton() {
        return (
            <span>
                <Link onClick={() => this.openPanel()}><b>&nbsp;Reply</b></Link>
                {this.giveDialogBox()}
            </span>
        );
    }

    render() {
        if (this.props.fullButton === true) {
            return this.giveFullActionButton();
        } else {
            return this.giveSmallButton();
        }
    }
}

export default ReplyWindow;