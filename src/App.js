import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap-tabs';
import ComposeWindow from './components/ComposeWindow';
import Navbar from './components/Navbar/';
import Timeline from './components/Timeline/';
import ProfileContainer from './components/ProfileContainer/';
import 'jquery';
import 'popper.js';
import './assets/css/bootstrap.css';
import './assets/css/bootstrap-grid.css';
import './assets/css/bootstrap-reboot.css';
import './assets/css/default.css'; // This must be compiled first!

class App extends Component {
  render() {
    return (
        <div>
          <nav>
            <Navbar></Navbar>
          </nav>
          <div className = "container app-container">
            <div className = "row">
              <div className = "col-sm-12 col-md-8">
                <ComposeWindow className="fixed-top"/>
                <hr/>
                <div className="container">
                    <Timeline/>
                </div>
              </div>
              <div className="col-sm-12 col-md-4 d-sm-none d-md-block m-0 p-0 shadow rounded profile-container">
                <ProfileContainer
                    avatar = "https://preview.redd.it/o3jotqc1m2d21.png?width=640&crop=smart&auto=webp&s=21415f9a52ac9cbf46280e0707866f57912e8a2b"
                    headerImage = "https://images.unsplash.com/photo-1548540841-acd06bd9702e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80"
                    name = "Asriel Dreemurr"
                    handle = "@asriel@dreemurr.io"
                    bio = "Mistakes have been made! Sysadmin for pretty much everything on dreemurr.io"
                />
                <hr/>
                <div className="container" style={{textAlign: 'center'}}>
                    <small style={{textAlign: 'center'}}>
                        <b>Hyperspace (alpha)</b>
                        <p>A fluffy client for Mastodon written in React.</p>
                    </small>
                </div>
              </div>
            </div>
          </div>
        </div>

    );
  }
}

export default App;
