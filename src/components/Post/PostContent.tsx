import React, {Component} from 'react';

class PostContent extends Component {
    render() {
        return (
            <div className="post-content text-break">{this.props.children}</div>
        );
    }
}

export default PostContent;