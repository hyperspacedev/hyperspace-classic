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
    Link, Icon, SelectionMode, DetailsListLayoutMode, DetailsList, ChoiceGroup, Toggle, Callout, Spinner, SpinnerSize
} from 'office-ui-fabric-react';
import {getDarkMode} from "../../utilities/getDarkMode";
import filedialog from 'file-dialog';
import EmojiPicker from 'emoji-picker-react';
import 'emoji-picker-react/dist/universal/style.scss';
import Mastodon from 'megalodon';
import {Visibility} from '../../types/Visibility';
import {anchorInBrowser} from '../../utilities/anchorInBrowser';

interface IReplyWindowProps {
    client: Mastodon;
    status: any;
    className?: string;
    fullButton: boolean;
    to?: number;
}

interface IReplyWindowState {
    hideReplyPanel: boolean;
    to: number;
    reply_count: number;
    author: string;
    author_id: string;
    original_status: any;
    reply_contents: string;
    visibility: Visibility | string | undefined;
    media: [];
    media_data: [];
    spoiler_text: string;
    sensitive: boolean | undefined;
    hideSpoilerDialog: boolean;
    hideEmojiPicker: boolean;
    hideVisibilityDialog: boolean;
    media_uploading: boolean;
}

/**
 * Offspring of the ComposeWindow component. Displays a status and
 * offers a compose window for crafting a reply to the post.
 * 
 * @param client The client used to post the reply with
 * @param status The status to reply to
 */
class ReplyWindow extends Component<IReplyWindowProps, IReplyWindowState> {

    client: any;

    constructor(props: any) {
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
            hideVisibilityDialog: true,
            media_uploading: false
        };

        this.client = this.props.client;
    }

    componentDidUpdate() {
        anchorInBrowser();
    }

    getReplyOrMessage(status: any) {
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

    updateStatus(e: any) {
        this.setState({
            reply_contents: e.target.value
        });
    }

    updateVisibility(to: Visibility) {
        this.setState({
            visibility: to
        })
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
        if (this.state.author_id === JSON.parse(localStorage.getItem('account') || "").acct) {
            return 'Continue';
        } else {
            return 'Reply';
        }
    }

    discernVisibilityNoticeKeyword() {
        if (this.state.visibility === "direct") {
            return 'direct message';
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

            _this.setState({
                media_uploading: true
            })

            _this.client.post('/media', uploadData)
                .then((resp: any) => {
                    console.log('Media uploaded!');
                    let id = resp.data.id;
                    let media_id_array = _this.state.media;
                    let media_data_array = this.state.media_data;
                    media_id_array.push(id as never);
                    media_data_array.push(resp.data as never);
                    _this.setState({
                        media: media_id_array,
                        media_data: media_data_array,
                        media_uploading: false
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
                name: '',
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
                name: '',
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
                    'fileIcon': <span style={{textAlign: "center"}}><img src={(this.state.media_data[Number(i)] as any).url} style={{ width: "auto", height: 22}}/></span>,
                    'fileUrl': <a href={(this.state.media_data[Number(i)] as any).url}>{(this.state.media_data[Number(i)] as any).url}</a>
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
                subMenuProps: {
                    items: [
                      {
                        key: 'directMessage',
                        name: 'Direct message',
                        iconProps: {
                          iconName: 'directMessage',
                          className: 'toolbar-menu-icon'
                        },
                        onClick: () => this.updateVisibility("direct")
                    },
                      {
                        key: 'private',
                        name: 'Followers only',
                        iconProps: {
                          iconName: 'private',
                          className: 'toolbar-menu-icon'
                        },
                        onClick: () => this.updateVisibility("private")
                      },
                      {
                        key: 'unlisted',
                        name: 'Unlisted',
                        iconProps: {
                          iconName: 'unlisted',
                          className: 'toolbar-menu-icon'
                        },
                        onClick: () => this.updateVisibility("unlisted")
                      },
                      {
                        key: 'public',
                        name: 'Public',
                        iconProps: {
                          iconName: 'public',
                          className: 'toolbar-menu-icon'
                        },
                        onClick: () => this.updateVisibility("public")
                      }
                    ]
                  }
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

    toggleSpoilerDialog() {
        this.setState({
            hideSpoilerDialog: !this.state.hideSpoilerDialog
        })
    }

    onSpoilerVisibilityChange(event: any, checked: boolean) {
        this.setState({
            sensitive: !!checked
        });
        if (checked === false) {
            this.setState({
                spoiler_text: ''
            })
        }
    }

    onSpoilerTextChange(e: any) {
        this.setState({
            spoiler_text: e.target.value
        })
    }

    setVisibilityContentText() {
        let text = <p>Choose who gets to see your reply.</p>;
        let altText = '';
        if (this.state.visibility === "direct") {
            altText = <p><b style={{ fontWeight: 700}}>Note: you need to add the recipient/recipients by typing their username/handle to send the message.</b></p> as unknown as string
        }

        return <span>{text}{altText !== '' ? altText: <span/>}</span>;
    }

    setWarningButtonText() {
        if (this.state.sensitive) {
            return 'Change/remove warning';
        } else {
            return 'Set warning';
        }
    }

    setWarningHeaderText() {
        return 'Set a warning';
    }

    setWarningContentText() {
        return 'Set a content warning to your post. This may be used to hide a spoiler or provide a warning of the contents of your post that may not be appropriate for all audiences.';
    }

    toggleEmojiPicker() {
        this.setState({
            hideEmojiPicker: !this.state.hideEmojiPicker
        })
    }

    addEmojiToStatus(e: any) {
        let emojiInsert = String.fromCodePoint(Number("0x" + e));
        console.log(e);
        this.setState({
            reply_contents: this.state.reply_contents + emojiInsert
        });
    }

    sendStatusViaKeyboard(event: any) {
        if ((event.metaKey || event.ctrlKey) && event.keyCode == 13) {
            this.postReply();
        }
    }

    getTypeOfWarning(event: any, option: any) {
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

    giveEmojiDialog() {
        return (<Callout
            ariaLabelledBy={'callout-label-1'}
            ariaDescribedBy={'callout-description-1'}
            role={'alertdialog'}
            gapSpace={0}
            hidden={this.state.hideEmojiPicker}
            onDismiss={() => this.toggleEmojiPicker()}
            target={document.getElementById('emojiPickerReplyButton')}
        >
            <EmojiPicker 
                onEmojiClick={(e: Event) => this.addEmojiToStatus(e)} 
                assetPath="./images/emoji"
                emojiResolution={128}
            />
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
                containerClassName: 'ms-dialogMainOverride',
                className: getDarkMode()
            }}
            minWidth={500}
        >
            <Toggle
                defaultChecked={this.state.sensitive}
                label="Set a warning on my post"
                onText="On"
                offText="Off"
                onChange={(event, checked) => this.onSpoilerVisibilityChange(event, checked as boolean)}
            />
            <ChoiceGroup
                disabled={!this.state.sensitive}
                options={[
                    {
                        key: 'nsfw',
                        id: 'nsfw',
                        text: "Mark as NSFW"
                    },
                    {
                        key: 'spoiler',
                        id: 'spoiler',
                        text: "Mark as a spoiler"
                    },
                    {
                        key: 'none',
                        id: 'nospecial',
                        text: "Don't mark specifically",
                        checked: true
                    }
                ]}
                onChange={(event, option) => this.getTypeOfWarning(event, option)}
                className="mt-2"
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

    stripOriginalStatus(status: any) {
        let tempDiv = document.createElement('div');
        tempDiv.innerHTML = status;
        return (tempDiv.textContent || tempDiv.innerText || "");
    }

    giveDialogBox() {
        return (
            <div id = "do-not-trigger">
            <Panel
                isOpen={!this.state.hideReplyPanel}
                onDismiss={() => this.closeReplyPanel()}
                headerText={"Reply to " + this.state.author}
                type={PanelType.medium}
                styles={this.getPanelStyles()}
                className={getDarkMode()}
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
                <div id="compose-window" className = "p-3 rounded">
                    <div dangerouslySetInnerHTML={{__html: this.stripOriginalStatus(this.state.original_status)}}/>
                    <p className="mt-2">Note: your reply will be sent as a <b>{this.discernVisibilityNoticeKeyword()}.</b></p>
                    {
                        this.state.sensitive?
                        <p className="compose-window-warning">{this.getSpoilerText()}</p>:
                        <span/>
                    }
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
                    data-emojiable={true}
                    data-enable-grammarly={false}
                    onChange={e => this.updateStatus(e)}
                    placeholder="Type your reply here..."
                    defaultValue={this.state.reply_contents}
                    onKeyDown={(event) => this.sendStatusViaKeyboard(event)}
                    title={"Type your reply here and click 'Post reply' or press Ctrl/⌘ + Enter."}
                    />
                    <DetailsList
                        columns={this.getMediaItemColumns()}
                        items={this.getMediaItemRows()}
                        selectionMode={SelectionMode.none}
                        layoutMode={DetailsListLayoutMode.justified}
                    />
                    {this.state.media_uploading ? <Spinner className = "my-3" size={SpinnerSize.medium} label="Uploading media..." ariaLive="assertive" labelPosition="right" />: <span/>}
                </div>

                {this.giveSpoilerDialog()}
                {this.giveEmojiDialog()}

            </Panel>
            </div>
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
                className={'post-toolbar-icon ' + this.props.className}
            >
                <span className="d-none d-md-block">{this.replyOrThread()} ({this.state.reply_count})</span>
            </ActionButton>
            {this.giveDialogBox()}
        </div>);
    }

    giveSmallButton() {
        return (
            <span>
                <Link
                    onClick={() => this.openPanel()}
                    className={this.props.className}
                ><b>Reply</b></Link>
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