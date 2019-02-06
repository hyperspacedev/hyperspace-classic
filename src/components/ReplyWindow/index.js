import React, {Component} from 'react';
import {
    Dialog,
    DialogFooter,
    DialogType,
    PrimaryButton,
    DefaultButton,
    ActionButton,
    TextField,
    Link
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
            original_status: this.getReplyOrMessage(this.props.status),
            reply_contents: '@' + this.props.status.account.acct + ': ',
            visibility: this.props.status.visibility
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
            in_reply_to_id: this.state.to,
            visibility: this.state.visibility
        });
        this.setState({
            hideDialog: true
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

    giveDialogBox() {
        return (
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
                <p>Note: your reply will be sent as a <b>{this.discernVisibilityNoticeKeyword()}.</b></p>
                <TextField
                    multiline={true}
                    rows={5}
                    resizable={false}
                    maxLength={500}
                    onBlur={e => this.updateStatus(e)}
                    placeholder="Type your reply here..."
                    defaultValue={this.state.reply_contents}
                />

                <DialogFooter>
                    <PrimaryButton onClick={() => this.postReply()} text="Reply" />
                    <DefaultButton onClick={() => this.toggleVisibilityDialog()} text="Cancel" />
                </DialogFooter>
            </Dialog>
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
                onClick={() => this.toggleVisibilityDialog()}
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
                <Link onClick={() => this.toggleVisibilityDialog()}><b>&nbsp;Reply</b></Link>
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