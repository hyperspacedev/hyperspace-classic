import React, {Component} from 'react';
import {CompoundButton, Dialog, DialogType} from "office-ui-fabric-react";
import {ColorClassNames} from '@uifabric/styling';

class PostSensitive extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            status: this.props.status
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });

    }

    getAdditionalInformation(spoiler) {
        if (spoiler.includes('NSFW: ')) {
            return 'Careful! This content isn\'t safe for work.';
        } else if (spoiler.includes('Spoiler: ')) {
            return 'If you haven\'t experienced the topic beforehand, you shouldn\'t view this.';
        } else {
            return 'Proceed with caution.';
        }
    }

    flagColorOfButton(spoiler) {
        if (spoiler.includes('NSFW: ')) {
            return [ColorClassNames.redDarkBackground, ColorClassNames.redDarkBackgroundHover, ColorClassNames.white, ColorClassNames.whiteHover];
        } else if (spoiler.includes('Spoiler: ')) {
            return [ColorClassNames.yellowBackground, ColorClassNames.yellowBackgroundHover];
        } else {
            return [];
        }
    }

    primaryOrNot(spoiler) {
        if (spoiler.includes('NSFW: ')) {
            return true;
        } else {
            return false;
        }
    }

    render() {
        let status = this.state.status;
        return (
            <div className="mt-2">
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
                    dialogContentProps={{
                        type: DialogType.normal,
                        title: status.spoiler_text,
                        subText:
                            <div>
                                <div dangerouslySetInnerHTML={{__html: status.content}}/>
                                {
                                    status.media_attachments.length ?
                                        <div className = "row">
                                            {
                                                status.media_attachments.map( function(media) {
                                                    return(
                                                        <div className="col">
                                                            <img src={media.url} className = "shadow-sm rounded" alt={media.description} style = {{ width: '100%' }}/>
                                                        </div>
                                                    );
                                                })
                                            }
                                            <br/>
                                        </div>:
                                        <span/>
                                }
                            </div>
                    }}
                    minWidth={600}
                >
                </Dialog>
            </div>
        );
    }
}

export default PostSensitive;