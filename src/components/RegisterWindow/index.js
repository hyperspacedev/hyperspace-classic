import React, { Component } from 'react';
import { Button, Input, InputGroup, InputGroupAddon, Modal, ModalHeader, ModalBody }  from 'reactstrap';
import Mastodon from 'megalodon';
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
        }

        this.toggle = this.toggle.bind(this);
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

    updateInstanceUrl(e) {
        let _this = this;
        _this.setState({
            instanceUrl: e.target.value
        })
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
        })

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


    render() {
        return (
            <div className = "container shadow-sm rounded p-4">
                <h2><b>Sign in to Hyperspace</b></h2>
                <p>Welcome to Hyperspace, the fluffy client for Mastodon! To get started, please sign in to your Mastodon account by typing your instance name here:</p>
                <div>
                    <InputGroup>
                    <Input placeholder = "Instance name (ex.: mastodon.social)" onBlur={e => this.updateInstanceUrl(e)}/>
                    <InputGroupAddon addonType="append">
                        <Button className="btn-accent" onClick={this.toggle}> Sign in</Button></InputGroupAddon>
                    </InputGroup>
                </div>

                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Sign in to <b>{this.state.instanceUrl}</b></ModalHeader>
                    <ModalBody>
                        <div className="container-fluid">
                            <div>
                                <div>
                                    <p>Great! You've selected the instance to sign in to. We'll need you to authorize Hyperspace access to your Mastodon account. To do so, click 'Get code' and then type in your authorization code in the field below.</p>
                                    <p>
                                        <a href={this.state.authUrl} target='_blank' rel="noopener noreferrer" className='btn btn-sm btn-accent'>Get code</a>
                                    </p>
                                    <p>
                                        <InputGroup>
                                            <Input placeholder = "Authorization code (ex.: 687970657273706163652e736572766572)" onBlur={e => this.updateAuthCode(e)}/>
                                            <InputGroupAddon addonType="append">
                                                <Button className="btn-accent" onclick={this.getAccessToken()}>Authorize</Button>
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </p>
                                    <small class = "text-muted">
                                        For your convenience, we'll store app data into your browser cookies.
                                    </small>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>

            </div>
        );
    }
}

export default RegisterWindow;