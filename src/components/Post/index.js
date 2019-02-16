import React, { Component } from 'react';
import { Persona, TooltipHost } from "office-ui-fabric-react";
import * as moment from 'moment';
import PostContent from './PostContent';
import PostDate from './PostDate';
import PostToolbar from './PostToolbar';
import PostSensitive from './PostSensitive';
import ProfilePanel from '../ProfilePanel';
import BoostCard from './BoostCard';
import { getInitials } from '@uifabric/utilities/lib/initials.js';
import {anchorInBrowser} from "../../utilities/anchorInBrowser";
import { getTrueInitials } from "../../utilities/getTrueInitials";

/**
 * Basic element for rendering a post on Mastodon
 * 
 * @param client The client used to get/post information from Mastodon
 * @param status The post to display and interact with
 * @param nolink Whether the post shouldn't link the author's profile panel
 * @param nothread Whether the post shouldn't include the 'Show thread' button
 */
class Post extends Component {
    id;
    client;

    constructor(props) {
        super(props);
        this.id = this.props.key;
        this.client = this.props.client;

        this.state = {
            noLink: this.props.nolink,
            noThread: this.props.nothread
        }
    }

    componentDidMount() {
        anchorInBrowser();
    }

    getBigShadow() {
        if (this.props.bigShadow) {
            return 'shadow'
        } else {
            return 'shadow-sm'
        }
    }

    getAuthorName(account) {
        let x;
        try {
            x = account.display_name;
            if (x === '') {
                x = account.acct;
            }
            getInitials(x);
        } catch (error) {
            console.err(error);
            x = account.acct;
        }
        return x
    }

    getApplicationName(status) {
        if (status.application === null || status.application === undefined) {
            return (
                <TooltipHost content="We couldn't identify the application used to post this status.">
                    <span><b>determination (Web)</b></span>
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

    getPersonaText() {
        if (this.state.noLink) {
            return <b>{this.getAuthorName(this.props.status.account)}</b>;
        } else {
            return <ProfilePanel account={this.props.status.account} client={this.client}/>;
        }
    }

    correctPostLinks(content) {
        let temporaryDiv = document.createElement("div");
        temporaryDiv.innerHTML = content;

        let allAnchorTags = temporaryDiv.getElementsByTagName("a");

        for (let i=0; i < allAnchorTags.length; i++) {
            allAnchorTags[i].setAttribute("onclick", "openInBrowser(\"" + allAnchorTags[i].href + "\");")

        }

        return temporaryDiv.innerHTML;
    }

    // It currently isn't possible to get boosts to work using openInBrowser,
    // so this forces it manually.
    openBoostCardCorrectly(event, link) {
        if (navigator.userAgent.includes("Electron")) {
            let shell = require('electron').shell;
            event.preventDefault();
            shell.openExternal(link);
          } else {
            window.open(link);
          }
    }

    getBoostCard(status) {
        if (status.reblog) {
            return (
                <div className='mt-1 ml-4 mb-1'>
                    <div>
                        { status.sensitive === true ?
                            <PostSensitive status={this.props.status}/>:

                            <div className='ml-4 mb-2'>
                                <BoostCard client={this.client} status={this.props.status.reblog}/>
                            </div>
                        }
                    </div>
                </div>
            );
        }
    }

    render() {
        return (<div name="post" className={"container rounded p-3 marked-area " + this.getBigShadow()}>
                {
                        <Persona {... {
                            imageUrl: this.props.status.account.avatar,
                            text: this.getPersonaText(),
                            imageInitials: getTrueInitials(this.props.status.account.display_name),
                            secondaryText: '@' + this.props.status.account.acct
                        } } />
                }
                <PostContent>
                    {

                        this.props.status.reblog ?
                            this.getBoostCard(this.props.status):

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
                    nothread={this.props.nothread}
                />
                <PostDate date={<span>{moment(this.props.status.created_at).format('MM/DD/YYYY [at] h:mm A')} via {this.getApplicationName(this.props.status)} ({this.getVisibility(this.props.status)})</span>}/>
            </div>
        );
    }
}

export default Post;