import React, {Component} from 'react';
import { Panel, PanelType, Link, Persona, PersonaSize, PrimaryButton } from 'office-ui-fabric-react';
import Post from '../Post';
import {anchorInBrowser} from "../../utilities/anchorInBrowser";
import { getTrueInitials } from "../../utilities/getTrueInitials";

/**
 * A panel that display profile information of a given user.
 * 
 * @param client The client used to get and post information with.
 * @param account The account to get information about.
 */
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

    componentDidMount() {
        anchorInBrowser();
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
            <div>
                <Persona
                    {...
                        {
                            imageUrl: this.state.account.avatar,
                            imageInitials: getTrueInitials(this.state.account.display_name),
                            text: this.checkDisplayName(this.state.account),
                            secondaryText: '@' + this.state.account.username,
                            tertiaryText: this.getProfileMetadata(this.state.account)
                        }
                    }
                    size={PersonaSize.size72}
                    styles={
                        {
                            primaryText: {
                                color: 'white !important',
                                fontWeight: 'bold',
                                textShadow: '0px 0px 4px #333'
                            },
                            secondaryText: {
                                color: 'white !important',
                                fontWeight: 'bolder',
                                textShadow: '0px 0px 2px #333'
                            },
                            tertiaryText: {
                                color: '#f4f4f4 !important',
                                fontWeight: 'bolder',
                                textShadow: '0px 0px 2px #333'
                            }
                        }
                    }
                />
                <PrimaryButton
                    text={this.returnFollowStatusText()}
                    onClick = {() => this.toggleFollow()}
                    className="mt-4 shadow-sm"
                    disabled={this.checkFollowNotSelf()}
                    aria-describedby="cannotFollow"
                />
            </div>
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
    }

    checkFollowNotSelf() {
        return this.state.account.id === JSON.parse(localStorage.getItem('account')).id;
    }

    returnFollowStatusText() {
        if (this.checkFollowNotSelf()) {
            return 'Can\'t follow self';
        }
         else {
             if (this.state.following) {
                return 'Unfollow';
            } else {
                return 'Follow';
            }
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
            closeButton: {
                color: 'transparent',
                "&:hover": {
                    color: 'transparent !important'
                },
                "&:active": {
                    color: 'transparent !important'
                },
                backgroundImage: 'url(\'close.svg\')',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '50%'
            },
            content: {
                marginTop: 0
            },
            header: {
                backgroundColor: 'black',
                backgroundImage: 'url(' + this.state.account.header + ')',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'none',
                marginTop: '0 !important',
                height: 200,
                paddingLeft: '0 !important',
                paddingRight: '0 !important',
                boxShadow: '0px 0px 4px #333'
            },
            headerText: {
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                height: 200,
                margin: 0,
                verticalAlign: 'middle',
                paddingTop: 48,
                paddingLeft: 20,
                paddingRight: 20,
                filter: 'blur(0px)'
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
                headerText={this.createProfilePersona()}
                isLightDismiss={true}
            >
                <div className="mt-4">
                        <div
                            dangerouslySetInnerHTML={{__html: this.state.account.note}}
                            className="mt-2"
                        />
                </div>
                <hr/>
                <div className="my-2">
                    {this.showRecentStatuses()}
                </div>
            </Panel>
        </span>);
    }

}

export default ProfilePanel;