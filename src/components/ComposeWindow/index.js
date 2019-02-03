import React, { Component } from 'react';
import {
    TextField,
    CommandBar,
    Dialog,
    DialogFooter,
    DialogType,
    PrimaryButton,
    DefaultButton,
    ChoiceGroup,
    DetailsList,
    DetailsListLayoutMode,
    SelectionMode,
    Icon
} from "office-ui-fabric-react";
import {initializeIcons} from "@uifabric/icons";
import filedialog from 'file-dialog';

initializeIcons();

class ComposeWindow extends Component {

    client;

    constructor(props) {
        super(props);

        this.state = {
            status: '',
            media: [],
            media_data: [],
            visibility: 'public',
            hideDialog: true
        };

        this.client = this.props.client;
        this.toggleVisibilityDialog = this.toggleVisibilityDialog.bind(this);
    }

    updateStatus(e) {
        this.setState({
            status: e.target.value
        });
    }

    postMediaForStatus() {
        let _this = this;
        filedialog({
            multiple: false,
            accept: 'image/*'
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
                iconName: 'Page',
                isIconOnly: false,
                minWidth: 16,
                maxWidth: 16,
                isPadded: true

            },
            {
                key: 'fileUrl',
                fieldName: 'fileUrl',
                iconName: 'Link',
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
                'fileIcon': <span><Icon iconName='SurveyQuestions'/></span>,
                'fileUrl': 'No media uploaded'
            };
            let rows = [];
            rows.push(c);
            return rows;
        } else {
            for (var i in this.state.media_data) {
                let c = {
                    'fileIcon': <span><Icon iconName='Picture'/></span>,
                    'fileUrl': <a href={this.state.media_data[i].url}>{this.state.media_data[i].url}</a>
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
            visibility: this.state.visibility
        });

        this.setState({
            media: [],
            media_data: [],
            status: '',
            visibility: 'public'
        });
    }

    getVisibilityIcon() {
        if (this.state.visibility === 'public') {
            return 'Globe';
        } else if (this.state.visibility === 'unlisted') {
            return 'Unlock';
        } else if (this.state.visibility === 'private') {
            return 'Lock';
        } else {
            return 'Message';
        }
    }

    getItems(){
        return [
            {
                key: 'media',
                name: 'Upload media',
                iconProps: {
                    iconName: 'FabricPictureLibrary'
                },
                onClick: () => this.postMediaForStatus()
            },
            {
                key: 'visibility',
                name: 'Set visibility',
                iconProps: {
                    iconName: this.getVisibilityIcon()
                },
                onClick: () => this.toggleVisibilityDialog()
            },
            {
                key: 'spoiler',
                name: 'Add warning',
                iconProps: {
                    iconName: 'Warning'
                },
                onClick: () => console.log('Download')
            }
        ];
    };

    getFarItems(){
        return [
            {
                key: 'post',
                name: 'Post status',
                iconProps: {
                    iconName: 'Edit'
                },
                onClick: () => this.postStatus()
            }
        ];
    };

    toggleVisibilityDialog() {
        this.setState({
            hideDialog: !this.state.hideDialog
        });
    }

    _onChoiceChanged(event, option) {
        let _this = this;
        _this.setState({
            visibility: option.key
        });
    }

    render() {
        return (
            <div>
                <CommandBar
                    items={this.getItems()}
                    farItems={this.getFarItems()}
                    ariaLabel={'Use left and right arrow keys to navigate between commands'}
                />
                <TextField
                    multiline={true}
                    rows={5}
                    resizable={false}
                    maxLength={500}
                    onBlur={e => this.updateStatus(e)}
                    placeholder="What's on your mind?"
                />
                <DetailsList
                    columns={this.getMediaItemColumns()}
                    items={this.getMediaItemRows()}
                    selectionMode={SelectionMode.none}
                    layoutMode={DetailsListLayoutMode.justified}
                />


                <Dialog
                    hidden={this.state.hideDialog}
                    onDismiss={() => this.toggleVisibilityDialog()}
                    dialogContentProps={{
                        type: DialogType.largeHeader,
                        title: 'Set your visibility',
                        subText: 'Choose who gets to see your status. By default, new statuses are posted publicly.'
                    }}
                    modalProps={{
                        isBlocking: false,
                        containerClassName: 'ms-dialogMainOverride'
                    }}
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
            </div>
        );
    }
}

export default ComposeWindow;