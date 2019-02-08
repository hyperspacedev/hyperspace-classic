import React, {Component} from 'react';
import { Panel, PanelType, Link, Persona, PersonaSize, DetailsList, PrimaryButton } from 'office-ui-fabric-react';
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
            following: false,
            openPanel: false
        }

    }

    toggleProfilePanel() {
        this.setState({
            openPanel: !this.state.openPanel
        });
        this.getAllRecentStatuses();
        this.getFollowStatus();
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

    getFollowStatus() {
        let _this = this;
        this.client.get('/accounts/relationships', {id: this.state.account.id})
            .then(
                (resp) => {
                    _this.setState({
                        following: resp.data[0].following
                    })
                }
            );
        console.log(this.state.following);
    }

    returnFollowStatusText() {
        if (this.state.following) {
            return 'Unfollow';
        } else {
            return 'Follow';
        }
    }

    toggleFollow() {
        let _this = this;
        if (this.state.following) {
            this.client.post('/accounts/' + this.state.account.id.toString() + '/unfollow')
                .then((resp) => {
                    _this.setState({
                        following: resp.data[0].following
                    });
                })
        } else {
            this.client.post('/accounts/' + this.state.account.id.toString() + '/follow')
                .then((resp) => {
                    _this.setState({
                        following: resp.data[0].following
                    });
                })
        }
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

    getStyles() {
        return {
            content: {
                marginTop: 0
            },
            header: {
                backgroundImage: 'url(' + this.state.account.header + ')',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                margin: 0,
                height: 200
            },
            headerText: {
                color: 'transparent',
                height: 200,
                margin: 0
            }
        };
    }

    render() {
        return(<span>
            {this.createProfileLinkByName()}
            <Panel
                isOpen={this.state.openPanel}
                type={PanelType.medium}
                onDismiss={() => this.closeProfilePanel()}
                closeButtonAriaLabel="Close"
                styles={this.getStyles()}
                headerText="View profile"
            >
                <div className="mt-4">
                        {this.createProfilePersona()}
                        <PrimaryButton
                            text={this.returnFollowStatusText()}
                            onClick = {() => this.toggleFollow()}
                            className="mt-2"/>
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