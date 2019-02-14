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


class BoostCard extends Component {
    client;
    threadRef;

    constructor(props) {
        super(props);

        this.client = this.props.client;
        this.threadRef = React.createRef();

        this.state = {
            status: this.props.status
        }
    }

    stripElementsFromContent(content) {
        let temporaryDiv = document.createElement("div");
        temporaryDiv.innerHTML = content;
        return temporaryDiv.textContent || temporaryDiv.innerText || "";
    }

    getCardStyles(status) {
        let documentCardStyles = {};

            let actualContent = this.stripElementsFromContent(status.content);

            if (status.media_attachments.length !== 0) {
                documentCardStyles = {
                    root: {
                        height: 350
                    }
                }

            } else if (actualContent.length > 150) {
                documentCardStyles = {
                    root: {
                        height: 200
                    }
                }
            }
        return {documentCardStyles};
    }

    openChildThreadPanel() {
        this.threadRef.current.openThreadPanel();
    }

    render() {
        let post = this.state.status;
        return(
            <div>
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
                                                    post.media_attachments.map( function(media) {
                                                        return(
                                                            <div className="col" key={'media' + media.id}>
                                                                {
                                                                    (media.type === "image") ?
                                                                        <img src={media.url} className = "shadow-sm rounded" alt={media.description} style = {{ width: '100%' }}/>:
                                                                        <video src={media.url} autoPlay={false} controls={true} className = "shadow-sm rounded" alt={media.description} style = {{ width: '100%' }}/>
                                                                }
                                                            </div>
                                                        );
                                                    })
                                                }
                                            </div>:
                                            <span/>
                                    }
                                </div>
                            }
                            shouldTruncate={true}
                            showAsSecondaryTitle={true}
                            styles={this.getCardStyles(post)}
                        />
                        <DocumentCardActivity
                            activity={<span>Originally posted on {moment(PositioningContainer.date).format("MMM Do, YYYY: h:mm A")}</span>}
                            people={[{ name: <ProfilePanel account={post.account} client={this.client}/>, profileImageSrc: post.account.avatar, initials:getTrueInitials(post.account.display_name)}]}
                        />
                    </DocumentCardDetails>
                </DocumentCard>
            </div>
        );
    }
}

export default BoostCard;