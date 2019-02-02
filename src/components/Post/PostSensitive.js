import React, {Component} from 'react';
import {CompoundButton, Dialog, DialogType} from "office-ui-fabric-react";

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

    render() {
        let status = this.state.status;
        return (
            <div className="mt-2">
                <CompoundButton primary={false} secondaryText={status.spoiler_text} onClick={this.toggle}>
                    Show spoiler
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
                >
                </Dialog>
            </div>
        );
    }
}

export default PostSensitive;