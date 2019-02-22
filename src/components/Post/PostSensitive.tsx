import React, {Component} from 'react';
import {CompoundButton, Dialog, DialogType} from "office-ui-fabric-react";
import {ColorClassNames} from '@uifabric/styling';
import {anchorInBrowser} from "../../utilities/anchorInBrowser";
import {getDarkMode} from "../../utilities/getDarkMode";
import { Status } from 'megalodon';

interface IPostSensitiveProps {
    status: any;
}

interface IPostSensitiveState {
    modal: boolean | null;
    status: Status;
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
            status: this.props.status
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
            return [ColorClassNames.redDarkBackground, ColorClassNames.redDarkBackgroundHover, ColorClassNames.white, ColorClassNames.whiteHover].toString();
        } else if (spoiler.includes('Spoiler: ')) {
            return [ColorClassNames.yellowBackground, ColorClassNames.yellowBackgroundHover].toString();
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
                                        <div className = "row">
                                            {
                                                status.media_attachments.map( function(media: any) {
                                                    return(
                                                        <div className="col" key={status.id.toString() + "_media_" + media.id.toString()}>
                                                            <img src={media.url} className = "shadow-sm rounded" alt={media.description} style = {{ width: '100%' }}/>
                                                        </div>
                                                    );
                                                })
                                            }
                                            <br/>
                                        </div>:
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