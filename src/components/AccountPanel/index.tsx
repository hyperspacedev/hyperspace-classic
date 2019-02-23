import React, {Component} from 'react';
import { Panel, 
    PanelType, 
    Link, 
    Persona, 
    PersonaSize, 
    PrimaryButton, 
    DetailsList, 
    DetailsListLayoutMode,
    SelectionMode, 
    DefaultButton } from 'office-ui-fabric-react';
import Post from '../Post';
import {anchorInBrowser} from "../../utilities/anchorInBrowser";
import { getTrueInitials } from "../../utilities/getTrueInitials";
import {getDarkMode} from "../../utilities/getDarkMode";
import Mastodon, { Status } from 'megalodon';

interface IAccountPanelProps {
    client: Mastodon;
    account: any;
}

interface IAccountPanelState {
    account: any;
    account_statuses: [];
    openPanel: boolean;
    openBioDialog: boolean;
    openImageDialog: boolean;
}

/**
 * A panel that display profile information of the signed in user.
 * This is similar to ProfilePanel, but includes options that pertain
 * to the user specifically.
 * 
 * @param client The client used to get and post information with.
 * @param account The account to get information about.
 */
export class AccountPanel extends Component<IAccountPanelProps, IAccountPanelState> {

    client: any;

    constructor(props: any) {
        super(props);

        this.client = this.props.client;

        this.state = {
            account: this.props.account,
            account_statuses: [],
            openPanel: false,
            openBioDialog: false,
            openImageDialog: false
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
    }

    closeProfilePanel() {
        this.setState({
           openPanel: false,
            account_statuses: []
        });
    }

    toggleBioDialog() {
        this.setState({
            openBioDialog: !this.state.openBioDialog
        });
    }

    toggleImageDialog() {
        this.setState({
            openImageDialog: !this.state.openImageDialog
        })
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

    createProfileTable(account: any) {
        let columns = [
            {
                key: 'key',
                fieldName: 'key',
                name: '',
                minWidth: 1,
                data: "string",
                maxWidth: 76,
                isPadded: true

            },
            {
                key: 'value',
                fieldName: 'value',
                data: 'string',
                name: '',
                minWidth: 1,
                maxWidth: 128,
                isPadded: true
            }];
        let rows = [];
        
        for (let item in account.fields) {
            let value = account.fields[item].value.replace("class=\"invisible\"", '');
            rows.push({'key': account.fields[item].name, 'value': <p dangerouslySetInnerHTML={{__html: value}}/>})
        }

        if (rows.length > 0) {
            return (
                <div id="profile-table">
                    <DetailsList
                        columns={columns}
                        items={rows}
                        selectionMode={SelectionMode.none}
                        layoutMode={DetailsListLayoutMode.justified}
                        className={"shadow-sm rounded"}
                    />
                </div>
            );
        }
        
    }

    checkDisplayName(account: any) {
        if (account.display_name === "") {
            return account.username;
        } else {
            return account.display_name;
        }
    }

    getProfileMetadata(account: any) {
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
                            text: this.checkDisplayName(this.state.account) + " (you)",
                            title: 'Despite everything, it\'s still you.',
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
                <div className="mt-4">
                    <PrimaryButton text="Edit bio" style={{marginRight: 8}} onClick={() => this.toggleBioDialog}/>
                    <DefaultButton text="Change images" onClick={() => this.toggleImageDialog}/>
                </div>
            </div>
        );
    }

    getAllRecentStatuses() {
        let _this = this;
        this.client.get('/accounts/' + this.state.account.id + '/statuses', {limit: 150})
            .then((resp: any) => {
                _this.setState({
                    account_statuses: resp.data
                });
            });
    }

    showRecentStatuses() {
        let key = 0;
        if (this.state.account_statuses.length > 0) {
            return (
                <div className="my-2">
                    {
                        this.state.account_statuses.map((post: Status) => {
                            return(
                                <div className="my-2" key={this.props.account.id.toString() + "_post_" + post.id.toString()}>
                                    <Post key={key++} client={this.client} status={post} nolink={true} clickToThread={true}/>
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
                headerText={this.createProfilePersona() as unknown as string}
                isLightDismiss={true}
                className={getDarkMode()}
            >
                <div className="mt-4">
                        <div
                            dangerouslySetInnerHTML={{__html: this.state.account.note}}
                            className="mt-2"
                        />
                        {this.createProfileTable(this.state.account)}
                </div>
                <hr/>
                <div className="my-2">
                    {this.showRecentStatuses()}
                </div>
            </Panel>
        </span>);
    }

}

export default AccountPanel;