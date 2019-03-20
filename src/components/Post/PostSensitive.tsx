import React, {Component} from 'react';
import {CompoundButton, Dialog, DialogType} from "office-ui-fabric-react";
import {ColorClassNames} from '@uifabric/styling';
import {anchorInBrowser} from "../../utilities/anchorInBrowser";
import {getDarkMode} from "../../utilities/getDarkMode";
import { Status } from '../../types/Status';
import { Attachment } from '../../types/Attachment';
import Carousel from 'nuka-carousel';

interface IPostSensitiveProps {
    status: Status;
}

interface IPostSensitiveState {
    modal: boolean | null;
    status: Status;
    carouselIndex: number;
}


/**
 * A button that links to a post's content that may contain sensitive
 * content.
 * 
 * @param status The status to ineract with and hide behind a dialog
 */
class PostSensitive extends Component<IPostSensitiveProps, IPostSensitiveState> {
    constructor(props: any) {
        super(props);
        this.state = {
            modal: false,
            status: this.props.status,
            carouselIndex: 0
        };

        this.toggle = this.toggle.bind(this);
    }

    componentDidMount() {
        anchorInBrowser();
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });

    }

    getAdditionalInformation(spoiler: string) {
        if (spoiler.includes('NSFW: ')) {
            return 'Careful! This content isn\'t safe for work.';
        } else if (spoiler.includes('Spoiler: ')) {
            return 'If you haven\'t experienced the topic beforehand, you shouldn\'t view this.';
        } else {
            return 'Proceed with caution.';
        }
    }

    flagColorOfButton(spoiler: string) {
        if (spoiler.includes('NSFW: ')) {
            return 'cw-button-nsfw';
        } else if (spoiler.includes('Spoiler: ')) {
            return 'cw-button-spoiler';
        } else {
            return "";
        }
    }

    primaryOrNot(spoiler: string) {
        if (spoiler.includes('NSFW: ')) {
            return true;
        } else {
            return false;
        }
    }

    prepareMedia(media: [Attachment]) {
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
                    >
                    {
                            media.map((item: Attachment) => {
                                return (
                                    <div key={this.props.status.id + "_sensitive_carousel"} className = "shadow-sm rounded post-carousel-item">
                                        <div className="item-bg" style={{backgroundImage: 'url("' + item.url + '")'}}/>
                                        <div className="item-content-container">
                                            {
                                                (item.type === "image") ?
                                                    <img src={item.url} alt={item.description? item.description: ''} className="item-content" title={item.description? item.description: ''}/>:
                                                    <video src={item.url} autoPlay={false} controls={true} style={{width: "auto", height: '100%'}} title={item.description? item.description: ''} className="item-content"/>
                                            }
                                        </div>
                                    </div>
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
                        <img src={media[0].url} className = "shadow-sm rounded" alt={media[0].description? media[0].description: ''} style = {{ width: '100%' }}/>:
                        <video src={media[0].url} autoPlay={false} controls={true} className = "shadow-sm rounded" style = {{ width: '100%' }}/>
                }
            </div>
            );
        }
    }

    render() {
        let status = this.state.status;
        return (
            <div className="mt-2" key={this.state.status.id.toString() + "_sensitive_inner"}>
                <CompoundButton
                    primary={this.primaryOrNot(status.spoiler_text)}
                    secondaryText={this.getAdditionalInformation(status.spoiler_text)}
                    onClick={this.toggle}
                    text={status.spoiler_text || "Content warning"}
                    className={this.flagColorOfButton(status.spoiler_text)}
                >

                </CompoundButton>
                <Dialog
                    hidden={!this.state.modal}
                    onDismiss={this.toggle}
                    modalProps={{
                        className: getDarkMode()
                    }}
                    dialogContentProps={{
                        type: DialogType.normal,
                        title: status.spoiler_text,
                        subText:
                            <div>
                                <div dangerouslySetInnerHTML={{__html: status.content}}/>
                                {
                                    status.media_attachments.length ?
                                        this.prepareMedia(status.media_attachments):
                                        <span/>
                                }
                            </div> as unknown as string
                    }}
                    minWidth={600}
                >
                </Dialog>
            </div>
        );
    }
}

export default PostSensitive;