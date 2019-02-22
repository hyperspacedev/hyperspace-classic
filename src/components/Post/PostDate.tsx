import React, {Component} from 'react';

interface IPostDateProps {
    date: String;
}

class PostDate extends Component<IPostDateProps> {
    render() {
        return (
            <small className = "text-muted">{this.props.date}</small>
        );
    }
}

export default PostDate;