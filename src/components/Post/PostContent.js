import React, {Component} from 'react';

class PostContent extends Component {
    render() {
        return (
            <div className="post-content">{this.props.children}</div>
        );
    }
}

export default PostContent;