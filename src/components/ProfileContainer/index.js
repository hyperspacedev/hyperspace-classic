import React, { Component } from 'react';
import {
    Persona,
    PersonaSize,
    Label,
    DetailsList,
    DetailsListLayoutMode,
    SelectionMode
} from 'office-ui-fabric-react';

class ProfileUser extends Component {
    who;
    persona;

    constructor(props) {
        super(props);

        this.who = this.props.who;

        this.persona = {
            imageUrl: this.who.avatar,
            text: this.who.display_name,
            secondaryText: '@' + this.who.acct,
            tertiaryText: this.who.followers_count.toString() + ' followers, ' + this.who.following_count.toString() + ' following, ' + this.who.statuses_count + ' posts'
        }
    }
    render() {
        return (
            <Persona
                {... this.persona}
                size={PersonaSize.size72}
            />
        );
    }
}

class ProfileList extends Component {

    columns;
    rows;
    profile;

    constructor(props) {
        super(props);

        this.profile = this.props.who;

        this.columns = [
            {
                key: 'key',
                fieldName: 'key',
                data: "string",
                maxWidth: 24,
                isPadded: true

            },
            {
                key: 'value',
                fieldName: 'value',
                data: 'string',
                isPadded: true
            }]

        this.rows = [];

        for (let item in this.props.who.fields) {
            let value = this.props.who.fields[item].value.replace("class=\"invisible\"", '');
            this.rows.push({'key': this.props.who.fields[item].name, 'value': <p dangerouslySetInnerHTML={{__html: value}}/>})
        }
    }

    render() {
        return(
            <DetailsList
                columns={this.columns}
                items={this.rows}
                selectionMode={SelectionMode.none}
                layoutMode={DetailsListLayoutMode.justified}
            />
            );
    }
}

class ProfileContainer extends Component {
    who;

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.who = this.props.who;
    }

    render() {
        return (
            <div className="profile-container shadow rounded">
                <div className="profile-container-header"
                     style={{
                         backgroundImage: 'url("' + this.who.header + '")'
                     }}>
                </div>
                <div className="container">
                    <div className="my-4">
                        <ProfileUser
                            who={this.who}
                        />
                    </div>
                    <Label>{this.who.source.note}</Label>
                    <ProfileList who={this.who}/>
                </div>
            </div>
        );
    }
}

export default ProfileContainer;