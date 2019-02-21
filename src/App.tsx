import React, {Component} from 'react';
import ComposeWindow from './components/ComposeWindow';
import Navbar from './components/Navbar';
import Timeline from './components/Timeline';
import ProfileContainer from './components/ProfileContainer';
import RegisterWindow from './components/RegisterWindow';
import NotificationPane from './components/NotificationPane';
import {anchorInBrowser} from './utilities/anchorInBrowser.js';
import Mastodon from 'megalodon';
import {loadTheme} from 'office-ui-fabric-react';
import {getDarkMode} from './utilities/getDarkMode';
import './components/CustomIcons';
import 'jquery';
import 'popper.js';
import './assets/css/bootstrap.css';
import './assets/css/bootstrap-grid.css';
import './assets/css/bootstrap-reboot.css';
import 'office-ui-fabric-react/dist/css/fabric.min.css';
import './assets/css/default.css';
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

class App extends Component {

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
        let notif = Notification;
        //let notif = window.Notification || window.mozNotification || window.webkitNotification;
        if ('undefined' === typeof notif)
            console.log('Notifications aren\'t supported on this browser.');
        else
            notif.requestPermission();
    }

    componentDidMount() {
        anchorInBrowser();
    }

    hideMacScrollbars() {
        if (navigator.userAgent.includes("Electron") && navigator.appVersion.indexOf("Mac") !== -1) {
            return 'hidden-scroll';
        }
    }

    render() {
        return (
            <div className={getDarkMode() + " " + this.hideMacScrollbars()}>
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
                        {
                            this.checkLocalStorage() ? <Timeline client={this.client}/>: <RegisterWindow/>
                        }
                    </div>
                  </div>
                  <div className = "col-sm-12 col-md-4 d-none d-lg-block m-0 p-0 profile-container">
                  {
                            this.checkLocalStorage() ?
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
                                </div>:
                                <div>
                                    <div className = "container rounded shadow-sm mt-4 p-4 marked-area">
                                        <span className = "ml-auto" style={{textAlign: "center"}}><img src="logomark.svg" width="100%" alt="Hyerspace logo"/></span>
                                        <h4>What is Hyperspace?</h4>
                                        <p>
                                            Hyperspace is a client for the <a href="https://joinmastodon.org">Mastodon</a> social network. It allows users to sign in to their Mastodon account and view timelines, post statuses (toots), and interact with others in the federated universe (fediverse).
                                        </p>
                                        <small className="text-muted">
                                            Hyperspace is free software licensed under the <a href="https://www.gnu.org/copyleft/lesser.html">GNU Lesser General Public License</a>. Some libraries used are licensed uder other free software licenses such as the GPL and MIT licenses.
                                        </small>
                                    </div>
                                </div>
                        }
                  </div>
                </div>
              </div>
            </div>

        );
  }
}

export default App;
