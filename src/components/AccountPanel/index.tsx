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
    DefaultButton,
    Dialog,
    DialogFooter,
    DialogType,
    TextField,
    Spinner,
    SpinnerSize
 } from 'office-ui-fabric-react';
import Post from '../Post';
import {anchorInBrowser} from "../../utilities/anchorInBrowser";
import { getTrueInitials } from "../../utilities/getTrueInitials";
import {getDarkMode} from "../../utilities/getDarkMode";
import Mastodon, { Status } from 'megalodon';
import filedialog from 'file-dialog';

interface IAccountPanelProps {
    client: Mastodon;
    account: any;
    button?: boolean;
}

interface IAccountPanelState {
    account: any;
    account_statuses: [];
    openPanel: boolean;
    openBioDialog: boolean;
    openImageDialog: boolean;
    bioText: string;
    avatar: FormData | any;
    avatarPreview: any[];
    header: FormData | any;
    headerPreview: any[];
    media_uploading: boolean;
    statuses_loading: boolean;
}

/**
 * A panel that display profile information of the signed in user.
 * This is similar to ProfilePanel, but includes options that pertain
 * to the user specifically (edit bio, change images).
 * 
 * @param client The client used to get and post information with.
 * @param account The account to get information about.
 */
export class AccountPanel extends Component<IAccountPanelProps, IAccountPanelState> {

    client: Mastodon | any;

    constructor(props: any) {
        super(props);

        this.client = this.props.client;

        this.state = {
            account: this.props.account,
            account_statuses: [],
            openPanel: false,
            openBioDialog: false,
            openImageDialog: false,
            bioText: this.props.account.source.note,
            avatar: '',
            avatarPreview: [''],
            header: '',
            headerPreview: [''],
            media_uploading: false,
            statuses_loading: true
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

    cancelImageDialog() {
        this.setState({
            avatar: '',
            header: '',
            avatarPreview: [''],
            headerPreview: [''],
            openImageDialog: false
        })
    }

    createProfileLinkByName() {
        if (this.props.button) {
            return (
                <DefaultButton onClick = {() => this.toggleProfilePanel()}>View my profile</DefaultButton>
            )
        } else {
            return (
                <span>
                    <Link onClick={() => this.toggleProfilePanel()} style={{
                        fontWeight: 'bold'
                    }}>{this.checkDisplayName(this.state.account)}</Link>
                </span>
            );
        }
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
                    <PrimaryButton text="Edit bio" style={{marginRight: 8}} onClick={() => this.toggleBioDialog()}/>
                    <DefaultButton text="Change images" onClick={() => this.toggleImageDialog()}/>
                    {this.getEditBioDialog()}
                    {this.getChangeImagesDialog()}
                </div>
            </div>
        );
    }

    getAllRecentStatuses() {
        let _this = this;
        this.client.get('/accounts/' + this.state.account.id + '/statuses', {limit: 150})
            .then((resp: any) => {
                _this.setState({
                    account_statuses: resp.data,
                    statuses_loading: false
                });
            });
    }

    loadMore() {
        let _this = this;
        let last_status = (this.state.account_statuses[this.state.account_statuses.length - 1] as any).id;

        this.client.get('/accounts/' + this.state.account.id + '/statuses', {"max_id": last_status})
            .then( (resp: any) => {
                let data = resp.data;
                
                _this.setState({
                    account_statuses: (_this.state.account_statuses.concat(resp.data) as any)
                })

            })

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

    getEditBioDialog() {
        return (
            <Dialog
                isOpen={this.state.openBioDialog}
                onDismiss={() => this.toggleBioDialog}
                dialogContentProps={{
                    type: DialogType.largeHeader,
                    title: 'Edit your bio',
                    subText: 'Change what your bio says or type in a new bio here.'
                }}
                modalProps={{
                    isBlocking: false,
                    containerClassName: 'ms-dialogMainOverride',
                    className: getDarkMode()
                }}
                minWidth={500}
            >
                <TextField
                    multiline={true}
                    rows={5}
                    resizable={false}
                    maxLength={500}
                    onBlur={(e: any) => this.updateBioText(e)}
                    placeholder="Who are you?"
                    data-emojiable={false}
                    defaultValue={this.state.bioText}

                />
                <DialogFooter>
                    <PrimaryButton text="Save" onClick={() => this.publishBio()}/>
                    <DefaultButton text="Cancel" onClick={() => this.toggleBioDialog()}/>
                </DialogFooter>
            </Dialog>
        );
        
    }

    updateBioText(e: any) {
        this.setState({
            bioText: e.target.value as string
        });
    }

    publishBio() {
        let _this = this;
        this.client.patch('/accounts/update_credentials', {
            note: this.state.bioText
        })
            .then((acct: any) => {
                localStorage.setItem('account', JSON.stringify(acct.data));
                this.setState({
                    account: acct.data,
                    bioText: acct.data.source.note,
                    openBioDialog: false
                })
            });
    }

    getChangeImagesDialog() {
        return(
            <Dialog
                isOpen={this.state.openImageDialog}
                onDismiss={() => this.toggleImageDialog}
                dialogContentProps={{
                    type: DialogType.largeHeader,
                    title: 'Change your images',
                    subText: 'You can change your avatar, header image, or both by clicking on the respective image.'
                }}
                modalProps={{
                    isBlocking: false,
                    containerClassName: 'ms-dialogMainOverride',
                    className: getDarkMode()
                }}
                minWidth={700}
            >
                <div className="row p-4" style={
                        {
                            backgroundImage: "url('" + this.getBackgroundUrl() + "')",
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            textAlign: "center"
                        }
                    }
                    onClick={(event: any) => {
                        if (!(event.target.nodeName === "IMG")) {
                            this.uploadImage('header')
                        }
                    }}
                >
                    <div className = "mx-auto">
                        {
                            this.state.avatar !== '' ? 
                                this.renderNewAvatar(): 
                                <img 
                                    src={this.props.account.avatar_static}
                                    className="rounded-circle shadow-sm"
                                    style={{width: '50%'}}
                                    onClick={() => this.uploadImage("avatar")}
                                />
                        }
                        
                    </div>
                </div>
                {this.state.media_uploading ? <Spinner className = "my-3" size={SpinnerSize.medium} label="Updating profile..." ariaLive="assertive" labelPosition="right" />: <span/>}
                <DialogFooter>
                    <PrimaryButton text="Upload" onClick={() => this.changeImages()}/>
                    <DefaultButton text="Cancel" onClick={() => this.cancelImageDialog()}/>
                </DialogFooter>
            </Dialog>
        );
    }

    uploadImage(type: string) {
        if (type !== "avatar" && type !== "header")
            throw new Error("Expected 'avatar' or 'header' but got " + type);
        let _this = this;
        filedialog({
            multiple: false,
            accept: 'image/*'
        }).then((images: any) => {

            let upload = new FormData();
            upload.append(type, images[0]);

            let previewArray: any[] = [];
            previewArray.push(images[0]);

            if (type == "avatar") {
                _this.setState({
                    avatar: upload,
                    avatarPreview: previewArray
                })
            } else if (type === "header") {
                _this.setState({
                    header: upload,
                    headerPreview: previewArray
                })
            }
        })
    }

    changeImages() {
        let _this = this;
        _this.setState({
            media_uploading: true
        })
        this.client.patch('/accounts/update_credentials', this.state.avatar).then((acct: any) => {
            this.setState({
                account: acct.data,
                avatar: ''
            })
        })
        this.client.patch('/accounts/update_credentials', this.state.header).then((acct: any) => {
            localStorage.setItem('account', JSON.stringify(acct.data));
            this.setState({
                account: acct.data,
                header: '',
                media_uploading: false,
                openImageDialog: false
            })
        })
    }

    renderNewAvatar() {
        let url = window.URL.createObjectURL(this.state.avatarPreview[0] as File);
        return (
            <img
                src={url}
                onClick={() => this.uploadImage('avatar')}
                className="rounded-circle shadow-sm"
                style={{width: '50%'}}
            />
        )
    }

    getBackgroundUrl() {
        if (this.state.headerPreview[0] !== '') {
            let url =  window.URL.createObjectURL(this.state.headerPreview[0]);
            return url;
        } else {
            return this.props.account.header_static as string;
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
                    {
                        this.state.statuses_loading ? <Spinner className = "my-2" size={SpinnerSize.medium} label="Loading your statuses..." ariaLive="assertive" labelPosition="right" />: this.showRecentStatuses()
                    }
                    <hr/>
                    <div id="end-of-post-roll" className="my-4" style={{textAlign: 'center'}}><Link onClick = {() => this.loadMore()}>Load more</Link></div>
                </div>
            </Panel>
        </span>);
    }

}

export default AccountPanel;