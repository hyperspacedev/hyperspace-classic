import React, { Component } from 'react';
import {
    Persona,
    PersonaSize,
    Label,
    DetailsList,
    DetailsListLayoutMode,
    SelectionMode
} from 'office-ui-fabric-react';
import { getTrueInitials } from "../../utilities/getTrueInitials";

class ProfileUser extends Component {
    who;
    persona;

    constructor(props) {
        super(props);

        this.who = this.props.who;

        this.persona = {
            imageUrl: this.who.avatar,
            imageInitials: getTrueInitials(this.who.display_name),
            text: <b>{this.who.display_name}</b>,
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
            }];

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

/**
 * A basic container for displaying the logged-in user's information
 * 
 * @param who The logged-in user to display information about
 */
class ProfileContainer extends Component {
    who;

    componentWillMount() {
        this.who = this.props.who;
    }

    render() {
        return (
            <div name = "profile-container" className="profile-container shadow rounded marked-area">
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