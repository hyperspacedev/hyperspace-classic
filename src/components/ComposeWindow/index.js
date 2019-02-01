import React, { Component } from 'react';
import {TextField, CommandBar, Dialog, DialogFooter, DialogType, PrimaryButton, DefaultButton, ChoiceGroup} from "office-ui-fabric-react";
import {initializeIcons} from "@uifabric/icons";

initializeIcons();

class ComposeWindow extends Component {

    client;

    constructor(props) {
        super(props);

        this.state = {
            status: '',
            hideDialog: true
        }

        this.client = this.props.client;
        this.toggleVisibilityDialog = this.toggleVisibilityDialog.bind(this);
    }

    updateStatus(e) {
        this.setState({
            status: e.target.value
        });
    }

    postStatus() {
        this.client.post('/statuses', {
            status: this.state.status
        })
    }

    getItems(){
        return [
            {
                key: 'upload',
                name: 'Upload media',
                iconProps: {
                    iconName: 'FabricPictureLibrary'
                }
            },
            {
                key: 'visibility',
                name: 'Set visibility',
                iconProps: {
                    iconName: 'Hide2'
                },
                onClick: () => this.toggleVisibilityDialog()
            },
            {
                key: 'spoiler',
                name: 'Mark spoiler',
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

    _onChoiceChanged(e) {
        console.log('Choice option change: ' + e.target.id.replace('ChoiceGroup44-', ''));
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
                                key: 'message',
                                id: 'message',
                                text: 'Direct message'
                            },
                            {
                                key: 'followers',
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
                        onChange={e => this._onChoiceChanged(e)}
                    />
                    <DialogFooter>
                        <PrimaryButton onClick={() => this.toggleVisibilityDialog()} text="Save" />
                        <DefaultButton onClick={() => this.toggleVisibilityDialog()} text="Cancel" />
                    </DialogFooter>
                </Dialog>
            </div>
        );
    }
}

export default ComposeWindow;