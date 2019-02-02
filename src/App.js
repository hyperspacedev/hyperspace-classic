import React, {Component} from 'react';
import ComposeWindow from './components/ComposeWindow';
import Navbar from './components/Navbar/';
import Timeline from './components/Timeline/';
import ProfileContainer from './components/ProfileContainer/';
import RegisterWindow from './components/RegisterWindow';
import Mastodon from 'megalodon';
import {loadTheme} from 'office-ui-fabric-react';
import 'jquery';
import 'popper.js';
import './assets/css/bootstrap.css';
import './assets/css/bootstrap-grid.css';
import './assets/css/bootstrap-reboot.css';
import './assets/css/default.css'; // This must be compiled first!

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

    client;

    constructor(props) {
        super(props);

        this.checkLocalStorage = this.checkLocalStorage.bind(this);
        this.createMastodonApp = this.createMastodonApp.bind(this);

        if (this.checkLocalStorage()) {

            this.createMastodonApp();

            this.state = {
                account: ''
            };
        }
    }

    checkLocalStorage() {
        if (localStorage.length > 1) {
            return true;
        } else {
            return false;
        }
    }

    createMastodonApp() {
        let token = localStorage.getItem('access_token');
        let url = localStorage.getItem('baseurl');
        let client = new Mastodon(token, url + '/api/v1');
        this.client = client;
    }

    componentWillMount() {
        if (this.client != null) {
            this.client.get("/accounts/verify_credentials")
                .then((resp) => {
                    localStorage.setItem("account", JSON.stringify(resp.data))
                });
        }
    }

    render() {
        return (
            <div>
              <nav>
                <Navbar/>
              </nav>
              <div className = "container app-container">
                <div className = "row">
                  <div className = "col-sm-12 col-md-8">
                      {
                          this.client ?
                              <div>
                                  <ComposeWindow className="fixed-top" client={this.client}/>
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
                    {
                        this.client ? <div className="col-sm-12 col-md-4 d-sm-none d-md-block m-0 p-0 shadow rounded profile-container">
                            <ProfileContainer who = {JSON.parse(localStorage.getItem("account"))}/>
                        </div>:
                            <span/>
                    }

                </div>
              </div>
            </div>

        );
  }
}

export default App;
