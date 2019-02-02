import React, {Component} from 'react';

class PostDate extends Component {
    render() {
        return (
            <small className = "text-muted">{this.props.date}</small>
        );
    }
}

export default PostDate;