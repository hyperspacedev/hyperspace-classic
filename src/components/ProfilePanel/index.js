import React, {Component} from 'react';
import { Panel, PanelType, Link, Persona, PersonaSize, DetailsList } from 'office-ui-fabric-react';
import Post from '../Post';
import {getInitials} from '@uifabric/utilities/lib/initials';

class ProfilePanel extends Component {

    client;

    constructor(props) {
        super(props);

        this.client = this.props.client;

        this.state = {
            account: this.props.account,
            account_statuses: [],
            openPanel: false
        }

    }

    toggleProfilePanel() {
        this.setState({
            openPanel: !this.state.openPanel
        });
        this.getAllRecentStatuses()
    }

    closeProfilePanel() {
        this.setState({
           openPanel: false,
            account_statuses: []
        });
    }

    createProfileLinkByName() {
        return (
            <span>
                <Link onClick={() => this.toggleProfilePanel()} style={{
                    fontWeight: 'bold'
                }}>{this.checkDisplayName(this.state.account)}</Link>
            </span>
        );
    }

    useCertainInitials(account) {
        try {
            getInitials(account.display_name);
        } catch {
            return 'MU';
        }
    }

    checkDisplayName(account) {
        if (account.display_name === "") {
            return account.username;
        } else {
            return account.display_name;
        }
    }

    getProfileMetadata(account) {
        return account.followers_count.toString() + ' followers, ' + account.following_count.toString() + ' following, ' + account.statuses_count + ' posts';
    }

    createProfilePersona() {
        return (
            <Persona
                {...
                    {
                        imageUrl: this.state.account.avatar,
                        imageInitials: this.useCertainInitials(this.state.account),
                        text: this.checkDisplayName(this.state.account),
                        secondaryText: '@' + this.state.account.username,
                        tertiaryText: this.getProfileMetadata(this.state.account)
                    }
                }
                size={PersonaSize.size72}
            />
        );
    }

    getAllRecentStatuses() {
        let _this = this;
        this.client.get('/accounts/' + this.state.account.id + '/statuses', {limit: 150})
            .then((resp) => {
                _this.setState({
                    account_statuses: resp.data
                });
            });
    }

    showRecentStatuses() {
        if (this.state.account_statuses.length > 0) {
            return (
                <div className="my-2">
                    {
                        this.state.account_statuses.map((post) => {
                            return(
                                <div className="my-2">
                                    <Post key={post.id} client={this.client} status={post} nolink={true}/>
                                </div>);
                        })
                    }
                </div>
            );
        } else {
            return <p className="my-2">No posts found.</p>;
        }
    }

    render() {
        return(<span>
            {this.createProfileLinkByName()}
            <Panel
                isOpen={this.state.openPanel}
                type={PanelType.medium}
                onDismiss={() => this.closeProfilePanel()}
                closeButtonAriaLabel="Close"
            >
                <div
                    className="profile-container-header"
                    style={{backgroundImage: 'url(' + this.state.account.header + ')'}}/>
                <div className="mt-4">
                    {this.createProfilePersona()}
                    <div
                        dangerouslySetInnerHTML={{__html: this.state.account.note}}
                        className="mt-2"
                    />
                </div>
                <div className="my-2">
                    {this.showRecentStatuses()}
                </div>
            </Panel>
        </span>);
    }

}

export default ProfilePanel;