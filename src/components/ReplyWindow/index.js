import React, {Component} from 'react';
import {
    Dialog,
    DialogFooter,
    DialogType,
    PrimaryButton,
    DefaultButton,
    ActionButton,
    TextField, CommandBar
} from 'office-ui-fabric-react';
import {Status} from 'megalodon';

class ReplyWindow extends Component {

    client;

    constructor(props) {
        super(props);

        this.state = {
            hideDialog: true,
            to: this.props.status.id,
            reply_count: this.props.status.replies_count,
            author: this.props.status.account.display_name,
            author_id: this.props.status.account.acct,
            original_status: this.props.status.account.display_name + ' originally posted: ' + this.props.status.content,
            reply_contents: '@' + this.props.status.account.acct + ': '
        }

        this.client = this.props.client;
    }

    toggleVisibilityDialog() {
        this.setState({
            hideDialog: !this.state.hideDialog
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
            in_reply_to_id: this.state.to
        })
        this.setState({
            hideDialog: true
        })
    }

    replyOrThread() {
        if (this.state.author_id == JSON.parse(localStorage.getItem('account')).acct) {
            if (this.state.reply_count <= 0) {
                return 'Start thread';
            } else {
                return 'Continue thread';
            }
        } else {
            return 'Reply'
        }
    }

    render() {
        return (
            <div>
                <ActionButton
                    data-automation-id="test"
                    iconProps={{ iconName: 'replyApp' }}
                    allowDisabledFocus={true}
                    disabled={false}
                    checked={false}
                    onClick={() => this.toggleVisibilityDialog()}
                >
                    {this.replyOrThread()} ({this.state.reply_count})
                </ActionButton>
                <Dialog
                    hidden={this.state.hideDialog}
                    onDismiss={() => this.toggleVisibilityDialog()}
                    dialogContentProps={{
                        type: DialogType.largeHeader,
                        title: 'Reply to ' + this.state.author,
                        subText: <div dangerouslySetInnerHTML={{__html: this.state.original_status}}></div>
                    }}
                    modalProps={{
                        isBlocking: false,
                        containerClassName: 'ms-dialogMainOverride'
                    }}
                    minWidth={500}
                >
                    {/*<CommandBar*/}
                        {/*items={this.getItems()}*/}
                        {/*farItems={this.getFarItems()}*/}
                        {/*ariaLabel={'Use left and right arrow keys to navigate between commands'}*/}
                    {/*/>*/}
                    <TextField
                        multiline={true}
                        rows={5}
                        resizable={false}
                        maxLength={500}
                        onBlur={e => this.updateStatus(e)}
                        placeholder="What's on your mind?"
                        defaultValue={this.state.reply_contents}
                    />

                    <DialogFooter>
                        <PrimaryButton onClick={() => this.postReply()} text="Reply" />
                        <DefaultButton onClick={() => this.toggleVisibilityDialog()} text="Cancel" />
                    </DialogFooter>
                </Dialog>
            </div>
        );
    }
}

export default ReplyWindow;