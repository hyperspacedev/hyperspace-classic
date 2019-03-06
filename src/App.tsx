import React, {Component} from 'react';
import ComposeWindow from './components/ComposeWindow';
import Navbar from './components/Navbar';
import Timeline from './components/Timeline';
import ProfileContainer from './components/ProfileContainer';
import RegisterWindow from './components/RegisterWindow';
import NotificationPane from './components/NotificationPane';
import {anchorInBrowser} from './utilities/anchorInBrowser';
import Mastodon from 'megalodon';
import {loadTheme} from 'office-ui-fabric-react';
import {getDarkMode} from './utilities/getDarkMode';
import {ToastProvider} from 'react-awesome-toasts';
import './components/CustomIcons';
import 'popper.js';
import './assets/css/bootstrap.css';
import './assets/css/bootstrap-grid.css';
import './assets/css/bootstrap-reboot.css';
import 'office-ui-fabric-react/dist/css/fabric.min.css';
import './assets/css/default.css';
import { Toast } from './components/Toast';

loadTheme({
    palette: {
        themePrimary: '#5c2d91',
        themeLighterAlt: '#f7f4fb',
        themeLighter: '#dfd3ed',
        themeLight: '#c6b0de',
        themeTertiary: '#936fbd',
        themeSecondary: '#6b3e9f',
        themeDarkAlt: '#532983',
        themeDark: '#46226e',
        themeDarker: '#331951',
        neutralLighterAlt: '#f8f8f8',
        neutralLighter: '#f4f4f4',
        neutralLight: '#eaeaea',
        neutralQuaternaryAlt: '#dadada',
        neutralQuaternary: '#d0d0d0',
        neutralTertiaryAlt: '#c8c8c8',
        neutralTertiary: '#c2c2c2',
        neutralSecondary: '#858585',
        neutralPrimaryAlt: '#4b4b4b',
        neutralPrimary: '#333333',
        neutralDark: '#272727',
        black: '#1d1d1d',
        white: '#ffffff',
    }
});

class App extends Component<any, any> {

    client: any;

    constructor(props: any) {
        super(props);

        this.checkLocalStorage = this.checkLocalStorage.bind(this);
        this.createMastodonApp = this.createMastodonApp.bind(this);

        if (this.checkLocalStorage()) {

            this.createMastodonApp();

            this.state = {
                account: ''
            };

            this.getAccountDetails();

        }
    }

    checkLocalStorage() {
        return localStorage.getItem("baseurl") != null && localStorage.getItem("access_token") != null;
    }

    createMastodonApp() {
        let token = localStorage.getItem('access_token');
        let url = localStorage.getItem('baseurl');
        this.client = new Mastodon(token || "", url + '/api/v1');
    }

    getAccountDetails() {
        let _this = this;
        if (this.client != null) {
            this.client.get("/accounts/verify_credentials")
                .then((resp: any) => {
                    localStorage.setItem("account", JSON.stringify(resp.data));
                    _this.setState({
                        account: resp.data
                    });
                });
        }
    }

    componentWillMount() {
        this.getAccountDetails();
        if (!('Notification' in window))
            console.log('Notifications aren\'t supported on this browser.');
        else {
            let x = Notification.requestPermission
        }
            
    }

    componentDidMount() {
        anchorInBrowser();
    }

    hideMacScrollbars() {
        if (navigator.userAgent.includes("Electron") && navigator.appVersion.indexOf("Mac") !== -1) {
            return 'hidden-scroll';
        } else {
            return '';
        }
    }

    getActualApp() {
        return (
            <div>
                        <nav>
                            <Navbar/>
                        </nav>
                        <div className = "container app-container">
                        <div className = "row">
                        <div className = "col-sm-12 col-lg-8">
                            {
                                this.client ?
                                    <div>
                                        <ComposeWindow client={this.client}/>
                                        <hr/>
                                    </div>:
                                    <span/>
                            }

                            <div className="container">
                                <Timeline client={this.client}/>
                            </div>
                        </div>
                        <div className = "col-sm-12 col-md-4 d-none d-lg-block m-0 p-0 profile-container">
                            <div>
                                {
                                    this.client ? <div>
                                            {
                                                localStorage.getItem('account') ?
                                                    <ProfileContainer client={this.client} who={JSON.parse(localStorage.getItem('account') || "")}/>:
                                                    <div className="p-4">
                                                        <h3>Hang tight!</h3>
                                                        <p>Reload Hyperspace for your profile card to update.</p>
                                                    </div>

                                            }
                                        <NotificationPane client = {this.client}/>
                                    </div>:
                                        <span/>
                                }
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
        );
    }

    renderMacTitleBar() {
        if (navigator.userAgent.includes("Electron") && navigator.appVersion.indexOf("Mac") !== -1) {
            return (
                <div className = "m-0 p-0 mac-title-bar-login ">
                    <p>Hyperspace</p>
                </div>
        );
        }
    }


    render() {
        return (
            <ToastProvider component={Toast} position="top-right">
            <div className={getDarkMode() + " " + this.hideMacScrollbars()}>
                {
                    this.checkLocalStorage() ? 
                    this.getActualApp():
                    
                    <div 
                        className = "app-container sign-in"
                        style={{ backgroundImage: "url('images/background.jpg')" }}>
                        {this.renderMacTitleBar()}
                            <div className = "col-sm-12 col-md-10 col-lg-6 col-xl-5 mx-auto rounded sign-in-container">
                                <div
                                    style = {{backgroundImage: "url('images/background.jpg')" }}
                                    className = "sign-in-bg"
                                >
                                </div>
                                <div className = "rounded shadow p-2 my-2 sign-in-content">
                                    <RegisterWindow/>
                                </div>
                                
                            </div>
                            <div className = "links-area mb-4" style = {{ textAlign: "center" }}>
                                <span className = "welcome-links">
                                    <a href="https://www.gnu.org/copyleft/lesser.html">License</a> 
                                    <a href="https://github.com/alicerunsonfedora/hyperspace">GitHub</a> 
                                    <a href="https://patreon.com/marquiskurt">Patreon</a> 
                                    <a href="https://matrix.to/#/#hyperspace-general:matrix.org">Matrix</a>
                                </span>
                            </div>
                    </div>
                }
            </div>
            </ToastProvider>
        );
  }
}

export default App;
