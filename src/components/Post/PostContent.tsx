import React, {Component} from 'react';
import {anchorInBrowser} from '../../utilities/anchorInBrowser';
import {emojifyHTML} from '../../utilities/emojify';
import { MastodonEmoji } from '../../types/Emojis';

interface IPostContentProps {
    contents: string;
    emojis?: [MastodonEmoji];
}

interface IPostContentState {
    contents: any;
}

class PostContent extends Component<IPostContentProps, IPostContentState> {

    constructor(props: any) {
        super(props);

        this.state = {
            contents: this.props.contents
        }
    }

    componentDidUpdate() {
        anchorInBrowser();
    }

    render() {
        //
        return (
            <div>
                <div className="post-content text-break" dangerouslySetInnerHTML={{__html: emojifyHTML(this.state.contents, this.props.emojis)}}></div>
            </div>
            
        );
    }
}

export default PostContent;