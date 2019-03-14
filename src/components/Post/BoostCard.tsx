import React, {Component} from 'react';
import { DocumentCardActivity } from 'office-ui-fabric-react';
import moment from 'moment';
import ThreadPanel from '../ThreadPanel';
import PostContent from '../Post/PostContent';
import ProfilePanel from '../ProfilePanel';
import {getTrueInitials} from '../../utilities/getTrueInitials';
import Mastodon from 'megalodon';
import { Status } from '../../types/Status';

interface IBoostCardProps {
    client: Mastodon;
    status: Status;
    id: string;
}

interface IBoostCardState {
    status: Status;
}

/**
 * Small card element that displays a status. Usually used to display a reblogged
 * status.
 *
 * @param client The Mastodon client used to view information about the status
 * @param status The status to display within the card itself
 */
class BoostCard extends Component<IBoostCardProps, IBoostCardState> {
    client: any;
    threadRef: any;

    constructor(props: any) {
        super(props);

        this.client = this.props.client;
        this.threadRef = React.createRef();

        this.state = {
            status: this.props.status
        }
    }

    openChildThreadPanel() {
        if (this.threadRef.current.getHiddenPanelState())
            this.threadRef.current.openThreadPanel()
    }

    prepareMedia(media: any) {
        if (media.length >= 2) {
            let id = "mediaControl";
            return (
                <div className = "col">
                {
                    media[0].type == "image" ?
                    <div className = "shadow-sm rounded" style = {
                        {
                            backgroundImage: "url('" + media[0].url + "')",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            height: 250
                        }
                    }>
                        <div className = "pl-4 pr-4" style = {{paddingTop: 32, paddingBottom: 32, backgroundColor: "rgba(0,0,0,0.8)", height: "100%", color: "#f4f4f4"}}>
                            <h5>This person has posted a slideshow.</h5>
                            <p>Click this boost card to view the slideshow.</p>
                        </div>
                    </div>:
                    <video className="rounded shadow-sm" src={media[0].url} autoPlay={false} controls={true} style={{width: "100%", minHeight: 350}}/>
                }
                </div>
            );
        } else {
            return (
            <div className = "col">
                {
                    (media[0].type === "image") ?
                        <img src={media[0].url} className = "shadow-sm rounded" alt={media[0].description} style = {{ width: '100%' }}/>:
                        <video src={media[0].url} autoPlay={false} controls={true} className = "shadow-sm rounded" style = {{ width: '100%' }}/>
                }
            </div>
            );
        }
    }

    render() {
        let post = this.state.status;
        return(
            <div id = {this.props.id}>
                <div id="boost-card" className = "boost-card" title={"Originally posted by " + post.account.acct} onClick = {() => this.openChildThreadPanel()}>
                    <ThreadPanel
                        fromWhere={post.id}
                        client={this.client}
                        fullButton={null}
                        ref={this.threadRef}
                    />
                    <PostContent contents={post.content}/>
                    {post.media_attachments.length ?
                        <div className = "media">{this.prepareMedia(post.media_attachments)}</div>:<span/>
                    }
                    <DocumentCardActivity
                        activity={"Posted on " + moment(post.created_at).format("MMM Do, YYYY: h:mm A")}
                        people={[{ name: <ProfilePanel account={post.account} client={this.client}/> as unknown as string, profileImageSrc: post.account.avatar, initials:getTrueInitials(post.account.display_name)}]}
                    />
                </div>
            </div>
        );
    }
}

export default BoostCard;
