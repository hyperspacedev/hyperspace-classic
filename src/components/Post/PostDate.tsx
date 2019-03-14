import React, {Component} from 'react';
import {TooltipHost} from 'office-ui-fabric-react';
import moment from 'moment';

interface IPostDateProps {
    status: any;
}

interface IPostDateState {
    date: string;
    application: string;
    visibility: string;
}

class PostDate extends Component<IPostDateProps, IPostDateState> {

    constructor(props: any) {
        super(props);

        this.state = {
            date: this.props.status.created_at,
            application: this.getApplicationName(this.props.status.application),
            visibility: this.getVisibility(this.props.status.visibility)
        }
    }

    isApplicationNull(application: any): boolean {
        return application === "determination (unknown)" || application === null || application === undefined;
    }

    getApplicationName(application: any): string {
        if (application === null || application === undefined) {
            return 'determination (unknown)';
        } else {
            return application.name;
        }
    }

    getVisibility(visibility: string): string {
        if (visibility === 'public') {
            return 'Public';
        } else if (visibility === 'unlisted') {
            return 'Unlisted';
        } else if (visibility === 'private') {
            return 'Followers only';
        } else {
            return 'Direct message';
        }
    }

    parseDate(date: string): string {
        return moment(date).format('MMMM do, Y [at] h:mm A');
    }

    render() {
        return (
            <small className = "text-muted">
                <span>{this.parseDate(this.state.date)} via &nbsp;
                {
                    this.isApplicationNull(this.state.application) ?
                    <TooltipHost content="We couldn't identify the application used to make this post.">
                        <span><b>{this.state.application}</b></span>
                    </TooltipHost>:
                        <b>{this.state.application}</b>
                } 
                &nbsp;
                ({this.state.visibility})</span>
            </small>
        );
    }
}

export default PostDate;