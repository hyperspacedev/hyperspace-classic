import React, {Component} from 'react';
import { Panel, PanelType, DefaultButton, ActionButton, Link } from 'office-ui-fabric-react';
import {getDarkMode} from "../../utilities/getDarkMode";
import Mastodon from 'megalodon';
import {anchorInBrowser} from '../../utilities/anchorInBrowser';
import Composable from '../Composable';
import { Status } from '../../types/Status';
import { emojifyHTML } from '../../utilities/emojify';

interface IReplyWindowProps {
    client: Mastodon;
    status: Status;
    className?: string;
    fullButton: boolean;
    to?: number;
}

interface IReplyWindowState {
    hideReplyPanel: boolean;
    reply_count: number;
    author: string;
    author_id: string;
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
    replyRef: any;

    constructor(props: any) {
        super(props);

        this.state = {
            hideReplyPanel: true,
            reply_count: this.props.status.replies_count,
            author: this.props.status.account.display_name,
            author_id: this.props.status.account.acct
        };

        this.client = this.props.client;
        this.replyRef = React.createRef();
        this.closeWhenDonePosting = this.closeWhenDonePosting.bind(this);
    }

    componentDidMount() {
        anchorInBrowser();

        
    }

    closeWhenDonePosting() {
        this.closeReplyPanel();
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


    replyOrThread() {
        if (this.state.author_id === JSON.parse(localStorage.getItem('account') || "").acct) {
            return 'Continue';
        } else {
            return 'Reply';
        }
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
                }
            }
        }
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
                isLightDismiss={true}
                onRenderFooterContent={() => {return (
                            <div>
                                <DefaultButton
                                    onClick={() => this.closeReplyPanel()}
                                    text="Close"
                                />
                            </div>
                        )
                    ;}
                }
            >
                <p><b>{this.state.author} said: </b></p>
                <div className = "post-content" dangerouslySetInnerHTML={{__html: emojifyHTML(this.props.status.content, this.props.status.emojis)}}></div>
                <Composable client={this.client} reply_to={this.props.status} onSubmit={this.closeWhenDonePosting}/>
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
