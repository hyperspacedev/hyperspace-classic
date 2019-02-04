import React, { Component } from 'react';
import {
    Persona, DocumentCard, DocumentCardActivity, DocumentCardTitle, DocumentCardType, DocumentCardDetails, TooltipHost } from "office-ui-fabric-react";
import * as moment from 'moment';
import PostContent from './PostContent';
import PostDate from './PostDate';
import PostToolbar from './PostToolbar';
import PostSensitive from './PostSensitive';

class Post extends Component {
    id;

    constructor(props) {
        super(props);
        this.id = this.props.key;
    }

    getAuthorName(account) {
        let x;
        try {
            x = account.display_name;
            if (x === '') {
                x = account.acct;
            }
        } catch {
            x = account.acct;
        }
        return x
    }

    getApplicationName(status) {
        if (status.application === null || status.application === undefined) {
            return (
                <TooltipHost content="We couldn't identify the application used to post this status.">
                    <span><b>magic</b></span>
                </TooltipHost>
            );
        } else {
            return <span><b>{status.application.name}</b></span>;
        }
    }

    getVisibility(status) {
        if (status.visibility === 'public') {
            return 'Public';
        } else if (status.visibility === 'unlisted') {
            return 'Unlisted';
        } else if (status.visibility === 'private') {
            return 'Followers only';
        } else {
            return 'Direct message';
        }
    }

    render() {
        return (<div className="container shadow-sm rounded p-3">
                {
                        <Persona {... {
                            imageUrl: this.props.status.account.avatar,
                            text: <a href={this.props.status.account.url} style={{ color: '#212529' }}>{this.getAuthorName(this.props.status.account)}</a>,
                            secondaryText: '@' + this.props.status.account.acct
                        } } />
                }
                <PostContent>
                    {

                        this.props.status.reblog ?
                            <div className='mt-1 ml-4 mb-1'>
                                <div>
                                    { this.props.status.sensitive === true ?
                                        <PostSensitive status={this.props.status}/>:

                                        <div className='ml-4 mb-2'>
                                            <DocumentCard type={DocumentCardType.compact} onClick={() => {window.open(this.props.status.reblog.url)}}>
                                                <DocumentCardDetails>
                                                    <DocumentCardTitle
                                                        title={
                                                            <div>
                                                                <div dangerouslySetInnerHTML={{__html: this.props.status.reblog.content}}/>
                                                                {
                                                                    this.props.status.reblog.media_attachments.length ?
                                                                        <div className = "row">
                                                                            {
                                                                                this.props.status.reblog.media_attachments.map( function(media) {
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
                                                    />
                                                    <DocumentCardActivity
                                                        activity={"Originally posted on " + moment(this.props.status.reblog.date).format("MMM Do, YYYY: h:mm A")}
                                                        people={[{ name: this.props.status.reblog.account.acct, profileImageSrc: this.props.status.reblog.account.avatar}]}
                                                    />
                                                </DocumentCardDetails>
                                            </DocumentCard>
                                        </div>}
                                </div>
                            </div>:

                            <div className='mb-2'>
                                { this.props.status.sensitive === true ?
                                    <PostSensitive status={this.props.status}/>:
                                    <div>
                                        <p dangerouslySetInnerHTML={{__html: this.props.status.content}} />
                                        {
                                            this.props.status.media_attachments.length ?
                                                <div className = "row">
                                                    {
                                                        this.props.status.media_attachments.map( function(media) {
                                                            return(
                                                                <div key={'media' + media.id} className="col">
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
                                    </div>}
                            </div>
                    }

                </PostContent>
                <PostToolbar
                    client={this.props.client}
                    status={this.props.status}
                />
                <PostDate date={<span>{moment(this.props.status.created_at).format('MM/DD/YYYY [at] h:mm A')} via {this.getApplicationName(this.props.status)} ({this.getVisibility(this.props.status)})</span>}/>
            </div>
        );
    }
}

export default Post;