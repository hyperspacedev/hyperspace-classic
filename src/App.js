import React, {Component} from 'react';
import ComposeWindow from './components/ComposeWindow';
import Navbar from './components/Navbar/';
import Timeline from './components/Timeline/';
import ProfileContainer from './components/ProfileContainer/';
import RegisterWindow from './components/RegisterWindow';
import Mastodon from 'megalodon';
import 'jquery';
import 'popper.js';
import './assets/css/bootstrap.css';
import './assets/css/bootstrap-grid.css';
import './assets/css/bootstrap-reboot.css';
import './assets/css/default.css'; // This must be compiled first!

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

            let _this = this;

            this.client.get("/accounts/verify_credentials")
                .then((resp) => {
                    _this.setState({
                        account: resp.data
                    });
                    localStorage.setItem("account", JSON.stringify(resp.data))

                })
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
        console.log(client);

        let _this = this;

        if (client === undefined) {
            throw "Init failed!";
        } else {
            _this.client = client;
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
                    <ComposeWindow className="fixed-top" client={this.client}/>
                    <hr/>
                    <div className="container">
                        {
                            this.checkLocalStorage() ? <Timeline client={this.client}/>: <RegisterWindow/>
                        }
                    </div>
                  </div>
                    {
                        this.client ? <div className="col-sm-12 col-md-4 d-sm-none d-md-block m-0 p-0 shadow rounded profile-container">
                            <ProfileContainer
                                avatar = {JSON.parse(localStorage.getItem("account")).avatar}
                                headerImage = {JSON.parse(localStorage.getItem("account")).header_static}
                                name = {JSON.parse(localStorage.getItem("account")).display_name}
                                handle = {<p>@ {JSON.parse(localStorage.getItem("account")).username}</p>}
                                bio = {JSON.parse(localStorage.getItem("account")).source.note}
                            />
                            <hr/>
                            <div className="container" style={{textAlign: 'center'}}>
                                <small style={{textAlign: 'center'}}>
                                    <b>Hyperspace (alpha)</b>
                                    <p>A fluffy client for Mastodon written in React.</p>
                                </small>
                            </div>
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
