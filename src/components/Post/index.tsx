import React, { Component } from 'react';
import { Persona, TooltipHost } from "office-ui-fabric-react";
import moment from 'moment';
import PostContent from './PostContent';
import PostDate from './PostDate';
import PostToolbar from './PostToolbar';
import PostSensitive from './PostSensitive';
import ProfilePanel from '../ProfilePanel';
import BoostCard from './BoostCard';
import { getInitials } from '@uifabric/utilities/lib/initials.js';
import {anchorInBrowser} from "../../utilities/anchorInBrowser";
import { getTrueInitials } from "../../utilities/getTrueInitials";
import Mastodon, { Status } from 'megalodon';
import ThreadPanel from '../ThreadPanel';
import Carousel from 'nuka-carousel';

interface IPostProps {
    client: Mastodon;
    nolink?: boolean | undefined;
    nothread?: boolean | undefined;
    bigShadow?: boolean | undefined;
    status: any;
    clickToThread?: boolean;
}

interface IPostState {
    noLink: boolean | undefined;
    noThread: boolean | undefined;
    clickToThread?: boolean;
    carouselIndex: number;
    id: string;
}

/**
 * Basic element for rendering a post on Mastodon
 * 
 * @param client The client used to get/post information from Mastodon
 * @param status The post to display and interact with
 * @param nolink Whether the post shouldn't link the author's profile panel
 * @param nothread Whether the post shouldn't include the 'Show thread' button
 */
class Post extends Component<IPostProps, IPostState> {
    client: any;
    threadRef: any;

    constructor(props: any) {
        super(props);
        this.client = this.props.client;

        this.threadRef = React.createRef();

        this.state = {
            noLink: this.props.nolink,
            noThread: this.props.nothread,
            clickToThread: this.props.clickToThread || false,
            carouselIndex: 0,
            id: "post_" + this.props.status.id
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

    getAuthorName(account: any) {
        let x;
        try {
            x = account.display_name;
            if (x === '') {
                x = account.acct;
            }
            getInitials(x, false);
        } catch (error) {
            x = account.acct;
        }
        return x
    }

    getPersonaText(index: any) {
        if (this.state.noLink) {
            return <b>{this.getAuthorName(this.props.status.account)}</b>;
        } else {
            return <ProfilePanel account={this.props.status.account} client={this.client} key={this.props.status.account.id.toString() + "_" + index.toString() + "_panel"}/>;
        }
    }

    correctPostLinks(content: any) {
        let temporaryDiv = document.createElement("div");
        temporaryDiv.innerHTML = content;

        let allAnchorTags = temporaryDiv.getElementsByTagName("a");

        for (let i=0; i < allAnchorTags.length; i++) {
            allAnchorTags[i].setAttribute("onclick", "openInBrowser(\"" + allAnchorTags[i].href + "\");")

        }

        return temporaryDiv.innerHTML;
    }

    isDescendant(parent: any, child: any) {
        var node = child.parentNode;
        while (node != null) {
            if (node == parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }

    isElement(element: any) {
        try {
            return (element.tagName !== undefined);
        } catch {
            return false;
        }
    }

    openThreadPanel(event: any) {
        let parent = event.target.parentNode;
        let unacceptableClasses = [
            "d-none", 
            "carousel-area", 
            "slider-control-", 
            "ms-Link", 
            "ms-Button", 
            "ms-Button-flexContainer", 
            "slider", 
            "ms-Panel-main", 
            "clickable-link", 
            "ms-DocumentCard-title", 
            "ms-DocumentCard-details", 
            "ms-DocumentCard"
        ]
        let unacceptableNodeTypes = ["A", "BUTTON"]

        let passClass = (() => {
            let test = true;
            if (typeof(event.target.className.includes) === "function" || event.target.className !== undefined || event.target.className !== "") {
                unacceptableClasses.forEach(element => {
                    if (event.target.className.includes(element) || parent.className.includes(element))
                        test = false;
                });
            }
            return test;
        })();

        let passNodes = (() => {
            let test = true;
            unacceptableNodeTypes.forEach(element => {
                if (parent.nodeName === element || event.target.nodeName === element)
                    test = false;
            })
            return test;
        })();

        if (
            event.target && this.isElement(event.target) && parent &&
            this.isDescendant(document.getElementById(this.state.id), event.target) &&
            !(this.isDescendant(document.getElementById(this.props.status.id + "-boost-card"), event.target)) &&
            (event.target.className.includes !== undefined) &&
            passNodes && passClass
            ) {
            this.threadRef.current.openThreadPanel();
        }
    }

    getBoostCard(status: Status) {
        if (status.reblog) {
            return (
                <div className='mt-1 ml-4 mb-1'>
                    <div key={status.id.toString() + "_boost"}>
                        { status.reblog.sensitive === true ?
                            <PostSensitive status={this.props.status.reblog} key={status.reblog.id.toString() + "_sensitive_boost"}/>:

                            <div className='ml-4 mb-2'>
                                <BoostCard id = {this.props.status.id + "-boost-card"} client={this.client} status={this.props.status.reblog as Status}/>
                            </div>
                        }
                    </div>
                </div>
            );
        }
    }

    prepareMedia(media: any) {
        if (media.length >= 2) {
            let id = "mediaControl";
            return (
                <div className = "col">
                    <Carousel
                        wrapAround={true}
                        autoplay={false}
                        slideIndex={this.state.carouselIndex}
                        afterSlide={(newIndex: number) => { this.setState({carouselIndex: newIndex})}}
                        width="100%"
                        heightMode="current"
                        initialSlideHeight={350}
                        className="carousel-area"
                    >
                    {
                            media.map((item: any) => {
                                return (
                                    <span>
                                        {
                                            (item.type === "image") ?
                                                <img className="rounded shadow-sm" src={item.url} alt={item.description} style={{width: "100%", minHeight: 350}}/>:
                                                <video className="rounded shadow-sm" src={item.url} autoPlay={false} controls={true} style={{width: "100%", minHeight: 350}}/>
                                        }
                                    </span>
                                );
                            })
                        }
                    </Carousel>
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
        return (
        <div 
            id={this.state.id}
            key={this.props.status.id + "_post"} 
            className={"container rounded p-3 ms-slideDownIn10 marked-area " + this.getBigShadow()}
            onClick={(e) => {
                if (this.state.clickToThread) {
                    this.openThreadPanel(e);
                }
            }}
        >
                {
                        <Persona {... {
                            imageUrl: this.props.status.account.avatar_static,
                            text: this.getPersonaText(this.props.status.id) as unknown as string,
                            imageInitials: getTrueInitials(this.props.status.account.display_name),
                            secondaryText: '@' + this.props.status.account.acct
                        } } />
                }

                <PostContent>
                    {

                        this.props.status.reblog ?
                            this.getBoostCard(this.props.status):

                            <div className='mb-2' key={this.props.status.id.toString() + "_contents"}>
                                { this.props.status.sensitive === true ?
                                    <PostSensitive status={this.props.status} key={this.props.status.id.toString() + "_sensitive"}/>:
                                    <div>
                                        <p dangerouslySetInnerHTML={{__html: this.props.status.content}} />
                                        {
                                            this.props.status.media_attachments.length ?
                                                <div className = "row">
                                                    {
                                                        this.prepareMedia(this.props.status.media_attachments)
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
                <PostDate status={this.props.status}/>
                <ThreadPanel
                    fromWhere={this.props.status.id}
                    client={this.client}
                    fullButton={null}
                    ref={this.threadRef}
                />
            </div>
        );
    }
}

export default Post;