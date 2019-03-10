import React, { Component } from 'react';
import {
    TextField,
    CommandBar,
    Dialog,
    DialogFooter,
    DialogType,
    PrimaryButton,
    ChoiceGroup,
    DetailsList,
    DetailsListLayoutMode,
    SelectionMode,
    Icon,
    Toggle,
    Callout,
    Spinner,
    SpinnerSize
} from "office-ui-fabric-react";
import {getDarkMode} from '../../utilities/getDarkMode';
import filedialog from 'file-dialog';
import EmojiPicker from 'emoji-picker-react';
import 'emoji-picker-react/dist/universal/style.scss';
import Mastodon, {Status} from 'megalodon';
import {Visibility} from '../../types/Visibility';

interface IComposeWindowProps {
    client: Mastodon;
}

interface IComposeWindowState {
    status: string;
    media: [];
    media_data: [];
    visibility: Visibility | string;
    spoiler_text: string;
    sensitive: boolean;
    hideSpoilerDialog: boolean | undefined;
    hideEmojiPicker: boolean | undefined;
    media_uploading: boolean;
}

/**
 * Window for creating statuses. Generally used for composing new statuses
 * rather than replies.
 * 
 * @param client The Mastodon client to perform posting actions with
 */
class ComposeWindow extends Component<IComposeWindowProps, IComposeWindowState> {

    client: any;

    constructor(props: any) {
        super(props);

        this.state = {
            status: '',
            media: [],
            media_data: [],
            media_uploading: false,
            visibility: 'public',
            spoiler_text: '',
            sensitive: false,
            hideSpoilerDialog: true,
            hideEmojiPicker: true
        };

        this.client = this.props.client;
    }

    updateStatus(e: any) {
        this.setState({
            status: e.target.value
        });
    }

    updateVisibility(to: Visibility) {
        this.setState({
            visibility: to
        })
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
                name: '',
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
                    'fileUrl': <a href={(this.state.media_data[Number(i)] as any).url}>{(this.state.media_data[Number(i)] as any).url}</a>
                };
                rows.push(c);
            }
        }

        return rows;
    }

    postStatus() {
        this.client.post('/statuses', {
            status: this.state.status,
            media_ids: this.state.media,
            visibility: this.state.visibility,
            sensitive: this.state.sensitive,
            spoiler_text: this.state.spoiler_text
        });

        this.setState({
            media: [],
            media_data: [],
            status: '',
            visibility: 'public',
            sensitive: false,
            spoiler_text: ''
        });
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
                name: 'Set visibility',
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
                id: 'emojiPickerButton',
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

    getFarItems(){
        return [
            {
                key: 'post',
                name: 'Post status',
                iconProps: {
                    iconName: 'postStatus',
                    className: 'toolbar-icon'
                },
                className: 'toolbar-icon',
                onClick: () => this.postStatus()
            }
        ];
    };

    toggleSpoilerDialog() {
        this.setState({
            hideSpoilerDialog: !this.state.hideSpoilerDialog
        })
    }

    onSpoilerVisibilityChange(event: any, checked: boolean | undefined) {
        this.setState({
            sensitive: !!checked
        })
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

    addEmojiToStatus(e: any) {
        let emojiInsert = String.fromCodePoint(("0x" + e) as unknown as number);
        console.log(e);
        this.setState({
            status: this.state.status + emojiInsert
        });
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

    sendStatusViaKeyboard(event: any) {
        if ((event.metaKey || event.ctrlKey) && event.keyCode == 13) {
            this.postStatus();
        }
    }

    render() {
        return (
            <div id = "compose-window" className = "marked-area shadow-sm rounded p-1">
                <CommandBar
                    items={this.getItems()}
                    overflowItems={this.getOverflowItems()}
                    farItems={this.getFarItems()}
                    ariaLabel={'Use left and right arrow keys to navigate between commands'}
                    overflowButtonProps={{ menuIconProps: {iconName: 'overflowMenu', iconClassName: 'toolbar-icons'}, className: 'toolbar-icon', name: 'More' }}
                />
                <TextField
                    multiline={true}
                    rows={5}
                    resizable={false}
                    maxLength={500}
                    onChange={e => this.updateStatus(e)}
                    placeholder="What's on your mind?"
                    data-emojiable={true}
                    data-enable-grammarly={false}
                    defaultValue={this.state.status}
                    onKeyDown = {(event) => this.sendStatusViaKeyboard(event)}
                    title={"Type your status here and click 'Post status' or press Ctrl/⌘ + Enter."}
                />
                <p className="mt-1">{this.getSpoilerText()}</p>
                <DetailsList
                    columns={this.getMediaItemColumns()}
                    items={this.getMediaItemRows()}
                    selectionMode={SelectionMode.none}
                    layoutMode={DetailsListLayoutMode.justified}
                />

                {this.state.media_uploading ? <Spinner className = "my-3" size={SpinnerSize.medium} label="Uploading media..." ariaLive="assertive" labelPosition="right" />: <span/>}

                {/* Spoiler Dialog */}
                <Dialog
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
                </Dialog>

                {/* Emoji Callout */}
                <Callout
                    ariaLabelledBy={'callout-label-1'}
                    ariaDescribedBy={'callout-description-1'}
                    role={'alertdialog'}
                    gapSpace={0}
                    hidden={this.state.hideEmojiPicker}
                    onDismiss={() => this.toggleEmojiPicker()}
                    target={document.getElementById('emojiPickerButton')}
                >
                    <EmojiPicker 
                        onEmojiClick={(e: Event) => this.addEmojiToStatus(e)} 
                        assetPath="./images/emoji"
                        emojiResolution={128}
                    />
                </Callout>
            </div>
        );
    }
}

export default ComposeWindow;