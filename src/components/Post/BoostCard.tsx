import React, {Component} from 'react';
import {
    DocumentCard,
    DocumentCardTitle,
    DocumentCardActivity,
    DocumentCardType,
    DocumentCardDetails,
    PositioningContainer
} from 'office-ui-fabric-react';
import moment from 'moment';
import ThreadPanel from '../ThreadPanel';
import ProfilePanel from '../ProfilePanel';
import {getTrueInitials} from '../../utilities/getTrueInitials';
import Mastodon, { Status } from 'megalodon';

interface IBoostCardProps {
    client: Mastodon;
    status: Status;
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

    stripElementsFromContent(content: string) {
        let temporaryDiv = document.createElement("div");
        temporaryDiv.innerHTML = content;
        return temporaryDiv.textContent || temporaryDiv.innerText || "";
    }

    getCardStyles(status: Status) {
        let documentCardStyles = {};

            let actualContent = this.stripElementsFromContent(status.content);

            if (status.media_attachments.length !== 0) {

                documentCardStyles = {
                    root: {
                        height: 355
                    }
                }

            } else if (actualContent.length > 150) {
                documentCardStyles = {
                    root: {
                        height: 200
                    }
                }
            }

            return documentCardStyles;
    }

    openChildThreadPanel() {
        this.threadRef.current.openThreadPanel();
    }

    render() {
        let post = this.state.status;
        return(
            <div id="boost-card">
                <ThreadPanel 
                    fromWhere={post.id} 
                    client={this.client} 
                    fullButton={null}
                    ref={this.threadRef}
                />
                <DocumentCard
                    type={DocumentCardType.compact}
                    styles={this.getCardStyles(post)}
                    onClick={() => this.openChildThreadPanel()}
                >
                    <DocumentCardDetails>
                        <DocumentCardTitle
                            title={
                                <div>
                                    <p>{this.stripElementsFromContent(post.content)}</p>
                                    {
                                        post.media_attachments.length ?
                                            <div className = "row">
                                                {
                                                    post.media_attachments.map( function(media: any) {
                                                        return(
                                                            <div className="col" key={'media' + media.id}>
                                                                {
                                                                    (media.type === "image") ?
                                                                        <img src={media.url} className = "shadow-sm rounded" alt={media.description} style = {{ width: '100%' }}/>:
                                                                        <video src={media.url} autoPlay={false} controls={true} className = "shadow-sm rounded" style = {{ width: '100%' }}/>
                                                                }
                                                            </div>
                                                        );
                                                    })
                                                }
                                            </div>:
                                            <span/>
                                    }
                                </div> as unknown as string
                            }
                            shouldTruncate={true}
                            showAsSecondaryTitle={true}
                            styles={this.getCardStyles(post)}
                        />
                        <DocumentCardActivity
                            activity={"Originally posted on " + moment(post.created_at).format("MMM Do, YYYY: h:mm A")}
                            people={[{ name: <ProfilePanel account={post.account} client={this.client}/> as unknown as string, profileImageSrc: post.account.avatar, initials:getTrueInitials(post.account.display_name)}]}
                        />
                    </DocumentCardDetails>
                </DocumentCard>
            </div>
        );
    }
}

export default BoostCard;