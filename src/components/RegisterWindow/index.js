import React, { Component } from 'react';
import {
    TextField,
    PrimaryButton,
    DefaultButton,
    Panel,
    PanelType
} from "office-ui-fabric-react";
import {getDarkMode} from "../../utilities/getDarkMode";
import Mastodon from 'megalodon';

/**
 * The window used for handling registration of Hyperspace
 * to the user.
 */
class RegisterWindow extends Component {

    constructor(props) {
        super(props);

        this.state = {
            instanceUrl: '',
            modal: false,
            clientId: '',
            clientSecret: '',
            authUrl: '',
            authCode: ''
        };

        this.toggle = this.toggle.bind(this);
        this._getErrorMessage = this._getErrorMessage.bind(this);
        this._getErrorMessagePromise = this._getErrorMessagePromise.bind(this);
    }

    toggle() {
        if (this.state.instanceUrl === '') {
            this.setState({
                instanceUrl: 'mastodon.social'
            })
        }
        this.createAuthApp();
        this.setState({
            modal: !this.state.modal
        });
    }

    closePanel() {
        this.setState({
            modal: false
        })
    }

    updateInstanceUrl(e) {
        let _this = this;
        _this.setState({
            instanceUrl: e.target.value
        })
    }

    _getErrorMessage(value: string) {
        return value.length > 0 ? '': 'This field cannot be blank.';
    }

    _getErrorMessagePromise(value: string): Promise<string> {
        return new Promise(resolve => {
            setTimeout(() => resolve(this._getErrorMessage(value)), 3000);
        });
    }

    updateAuthCode(e) {
        let _this = this;
        _this.setState({
            authCode: e.target.value
        })
    }


    createAuthApp() {
        let _this = this;
        const scopes = 'read write follow';
        const baseurl = 'https://' + _this.state.instanceUrl;

        Mastodon.registerApp('Hyperspace', {
            scopes: scopes
        }, baseurl).then(appData => {
            _this.setState({
                clientId: appData.client_id,
                clientSecret: appData.client_secret,
                authUrl: appData.url
            })
        });

        localStorage.setItem("baseurl", baseurl);
    }

    getAccessToken() {
        let _this = this;
        Mastodon.fetchAccessToken(_this.state.clientId, _this.state.clientSecret, _this.state.authCode, localStorage.getItem("baseurl"))
            .then((tokenData: Partial<{ accessToken: string }>) => {
                let token = tokenData.accessToken;
                console.log(token);
                localStorage.setItem("access_token", token);
                window.location.reload();
            })
            .catch((err: Error) => console.error(err))
    }

    getPanelStyles() {
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
            }
        }
    }

    render() {
        let _this = this;
        return (
            <div className = "container p-4">
                <h2>Sign in to Hyperspace</h2>
                <p>Welcome to Hyperspace, the fluffy client for Mastodon! We're more than happy to make your Mastodon experience pleasant, but we'll need you to sign in first.</p>
                <p>
                    Please sign in by entering your instance's domain.
                </p>
                <div>
                    <TextField
                        prefix="https://"
                        label="Host domain name"
                        description="The base URL of your Mastodon instance"
                        onBlur={e => this.updateInstanceUrl(e)}
                        required={true}
                        onGetErrorMessage={this._getErrorMessage}
                        validateOnFocusOut
                    />
                    <br/>
                    <PrimaryButton onClick={this.toggle}>Sign in</PrimaryButton>
                </div>

                <Panel
                    isOpen={this.state.modal}
                    type={PanelType.medium}
                    onDismiss={() => this.closePanel()}
                    headerText="Give authorization access"
                    closeButtonAriaLabel="Close"
                    styles={this.getPanelStyles()}
                    className={getDarkMode()}
                    onRenderFooterContent = { () => {return(
                        <div>
                            <PrimaryButton
                                onClick={() => this.getAccessToken()}
                                style={{ marginRight: '8px' }}
                                text="Authorize" />
                            <DefaultButton
                                onClick={() => this.closePanel()}
                                text="Cancel" />
                        </div>
                        );}
                    }
                >
                    <p>We'll need you to grant Hyperspace authorization to access your Mastodon account on <b>{_this.state.instanceUrl}</b>. Click 'Get Code' to authorize and then paste the authorization code here.</p>
                    <DefaultButton
                        href={this.state.authUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >Get code</DefaultButton>
                    <TextField
                        label="Authorization code"
                        onBlur={e => this.updateAuthCode(e)}
                    />
                </Panel>
            </div>
        );
    }
}

export default RegisterWindow;