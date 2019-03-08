import React, { Component } from 'react';
import {
    TextField,
    PrimaryButton,
    DefaultButton,
    Panel,
    PanelType
} from "office-ui-fabric-react";
import {getDarkMode} from "../../utilities/getDarkMode";
import {isMobileAgent, getMobileAgent} from "../../utilities/userAgent";
import Mastodon from 'megalodon';

interface IRegisterWindowState {
    instanceUrl: string;
    modal: boolean;
    reauth: boolean;
    reauth_from_cookie: boolean | null;
    clientId: string;
    clientSecret: string;
    authUrl: string;
    authCode: string;
}

/**
 * The window used for handling registration of Hyperspace
 * to the user.
 */
class RegisterWindow extends Component<any, IRegisterWindowState> {

    constructor(props: any) {
        super(props);

        this.state = {
            instanceUrl: '',
            modal: false,
            reauth: false,
            reauth_from_cookie: false,
            clientId: '',
            clientSecret: '',
            authUrl: '',
            authCode: ''
        };

        this.toggle = this.toggle.bind(this);
        this.dismiss = this.dismiss.bind(this);
        this._getErrorMessage = this._getErrorMessage.bind(this);
        this._getErrorMessagePromise = this._getErrorMessagePromise.bind(this);
    }

    componentDidMount() {
        if (localStorage.getItem("id") !== null) {
            this.setState({
                reauth_from_cookie: true,
                clientId: localStorage.getItem("id") || "",
                clientSecret: localStorage.getItem("secret") || "",
                authUrl: localStorage.getItem("authurl") || ""
            })
        } else {
            localStorage.removeItem("baseurl");
        }
    }

    toggle() {
        if (this.validateInstanceUrl(this.state.instanceUrl) || localStorage.getItem("baseurl") !== null) {
            this.createAuthApp();
            this.setState({
                modal: !this.state.modal
            });
        }
    }

    dismiss() {
        localStorage.removeItem("id");
        localStorage.removeItem("secret");
        localStorage.removeItem("authurl");
        localStorage.removeItem("baseurl");
        this.setState({
            reauth_from_cookie: false
        });
    }

    closePanel() {
        this.setState({
            modal: false,
            reauth: false
        })
    }
    

    updateInstanceUrl(e: any) {
        this.setState({
            instanceUrl: e.target.value || ""
        })
    }

    validateInstanceUrl(url: string) {
        if (url !== "" && url != undefined) {
            if (url.includes("@")) {
                let parts = url.split("@");
                if (parts[0] !== "" && parts[1] !== "") {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    trimInstanceUrl(url: string) {
        let trim = url.split("@");
        return trim[1];
    }

    _getErrorMessage(value: string) {
        if (value.length > 0) {
            if (this.validateInstanceUrl(value)) {
                return '';
            } else {
                return 'You must enter a valid username.';
            }
        } else {
            return 'You must enter a username.';
        }
    }

    _getErrorMessagePromise(value: string) {
        return new Promise(resolve => {
            setTimeout(() => resolve(this._getErrorMessage(value)), 3000);
        });
    }

    updateAuthCode(e: any) {
        let _this = this;
        _this.setState({
            authCode: e.target.value
        })
    }

    getMobilePWA() {
        let instructions = '';

        if (getMobileAgent() === "ios") {
            instructions = "Tap the Share icon in Safari and then tap 'Add to Home Screen' to add the icon to your home screen.";
        } else if (getMobileAgent() === "android") {
            instructions = "You may be already prompted to add Hyperspace to your home screen. Tap 'Add to Home Screen' to continue. If this option does not appear, try adding it through your browser's menu.";
        }

        if (isMobileAgent()) {

            // Detects if device is in standalone mode
            const isInStandaloneMode = () => ('standalone' in window.navigator) && ((window.navigator as any).standalone);

            // Checks if should display install popup notification:
            if (!isInStandaloneMode()) {
                return(
                    <div className = "container p-4 mt-4 marked-area shadow-sm rounded no-shadow" style = {{ color: "#333"}}>
                        <h5>Using a mobile device?</h5>
                        <small>{instructions}</small>
                    </div>
                );
            }

        }
        
    }

    showFirstStep() {
        if (!this.state.modal)
            return (
                <div className = "ms-fadeIn100">
                    {
                            this.state.reauth_from_cookie ?
                            <div className = "container rounded shadow p-3 my-3 marked-area no-shadow" style = {{color: '#333'}}>
                                <small>
                                    We noticed you didn't finish setting up Hyperspace. Did you want to continue from your last sign-in attempt?
                                </small>
                                <div className = "text-right">
                                <DefaultButton className = "shadow-sm" onClick={() => this.dismiss()} style = {{marginRight: 8}}>Start over</DefaultButton>
                                <PrimaryButton className = "shadow-sm" onClick={() => this.toggle()}>Continue</PrimaryButton>
                                </div>
                            </div>:<span/>
                    }
                    <p>
                        Howdy! Let's get started by entering your Mastodon username.
                    </p>
                    <div>
                        <TextField
                            prefix="@"
                            description="Your full Mastodon user handle, including the host (domain) name"
                            placeholder="user@examplemastodon.host"
                            onBlur={e => this.updateInstanceUrl(e)}
                            required={true}
                            onGetErrorMessage={this._getErrorMessage}
                            validateOnFocusOut
                            defaultValue={this.state.instanceUrl}
                            styles = {{
                                errorMessage: {
                                    fontWeight: 'bold',
                                    color: '#ef5865'
                                },
                                description: {
                                    color: "#f4f4f4"
                                },
                                wrapper: {
                                    color: "#f4f4f4",
                                    fontWeight: 'bolder'
                                }
                            }}
                        />
                        <div style = {{textAlign: 'right'}}>
                            <PrimaryButton className = "shadow" onClick={this.toggle} style={{marginRight: 8, marginTop: 4}}>Next</PrimaryButton>
                        </div>
                        {this.getMobilePWA()}
                    </div>
                </div>
            );
    }

    showSecondStep() {
        if (this.state.modal) {
            return (
                <div className = "ms-slideLeftIn40">
                    <p>To continue, you'll need to give Hyperspace authorization to access your account. Click 'Sign in on Mastodon' below and enter the authorization code generated by Mastodon.</p>
                        <DefaultButton
                            href={this.state.authUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className = "shadow-sm mb-2"
                        >Sign in on Mastodon</DefaultButton>
                        <TextField
                            description = "The authorization code provided by Mastodon"
                            onBlur={e => this.updateAuthCode(e)}
                            styles = {{
                                errorMessage: {
                                    fontWeight: 'bold',
                                    color: '#ef5865'
                                },
                                description: {
                                    color: "#f4f4f4"
                                },
                                wrapper: {
                                    color: "#f4f4f4",
                                    fontWeight: 'bolder'
                                }
                            }}
                        />
                    <div style = {{ textAlign: "right"}} className = "mt-4">
                        <PrimaryButton
                            onClick={() => this.getAccessToken()}
                            style={{marginRight: 8, marginTop: 4}}
                            className = "shadow"
                            text="Authorize"
                        />
                    </div>
                </div>
            )
        }
    }


    createAuthApp() {
        let _this = this;
        const scopes = 'read write follow';
        const baseurl = 'https://' + this.trimInstanceUrl(_this.state.instanceUrl);

        Mastodon.registerApp('Hyperspace', {
            scopes: scopes
        }, baseurl).then((appData: any) => {
            _this.setState({
                clientId: appData.client_id,
                clientSecret: appData.client_secret,
                authUrl: appData.url
            })
            localStorage.setItem("id", appData.client_id)
            localStorage.setItem("secret", appData.client_secret)
            localStorage.setItem("authurl", appData.url)
        });

        localStorage.setItem("baseurl", baseurl);
    }

    getAccessToken() {
        let _this = this;
        Mastodon.fetchAccessToken(_this.state.clientId, _this.state.clientSecret, _this.state.authCode, localStorage.getItem("baseurl") || "")
            .then((tokenData) => {
                let token = tokenData.accessToken;
                console.log(token);
                localStorage.setItem("access_token", token);
                localStorage.removeItem("id");
                localStorage.removeItem("secret");
                localStorage.removeItem("authurl");
                window.location.reload();
            })
            .catch((err) => console.error(err))
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
            <div style = {{width: '100%'}}>
                <div className = "container p-4 mt-4">
                    <div className = "mb-4" style = {{textAlign: 'center'}}>
                        <img src = "logomark.svg" style = {{ width: '60%'}}/>
                        <p><b>A fluffy client for Mastodon</b></p>
                    </div>
                    {this.showFirstStep()}
                    {this.showSecondStep()}
                        <div className = "mt-3" style = {{ textAlign: 'center', color: "#999"}}>
                            <small><a href="https://peertube.social/videos/watch/420bd961-458d-4e9b-b184-fe780b422437">Need help?</a> | <a href="https://joinmastodon.org/#getting-started">Register</a> | <a href="https://github.com/alicerunsonfedora/hyperspace/issues">Send feedback</a></small>
                        </div>
                    </div>
            </div>
        );
    }
}

export default RegisterWindow;