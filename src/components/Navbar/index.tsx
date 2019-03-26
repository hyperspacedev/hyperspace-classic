import React, { Component } from 'react';
import DarkModeToggle from '../DarkModeToggle';
import LogoutButton from '../LogoutButton';

interface INavbarState {
    composableOpen: boolean;
}

/**
 * Basic navigation bar. Contains logo, name, and log out button.
 */
class Navbar extends Component<any, INavbarState> {

    constructor(props: any) {
        super(props);

        this.state = {
            composableOpen: false
        }
    }

    getNavBar() {
        if (localStorage.getItem('prefers-dark-mode') === "true") {
            return 'navbar-dark';
        } else {
            return 'navbar-light';
        }
    }

    renderMacTitleBarOnNavPadding() {
        if (navigator.userAgent.includes("Electron") && navigator.appVersion.indexOf("Mac") !== -1) {
            return {
                paddingTop: 32
            };
        }
    }

    renderMacTitleBar() {
        if (navigator.userAgent.includes("Electron") && navigator.appVersion.indexOf("Mac") !== -1) {
            return (
                <div className = "m-0 p-0 mac-title-bar">
                    <p>Hyperspace</p>
                </div>
        );
        }
    }

    render() {
        return (
            <nav 
                className={"navbar navbar-expand-lg navbar-app fixed-top " + this.getNavBar()}
                style={this.renderMacTitleBarOnNavPadding()}
            >
                {this.renderMacTitleBar()}
                <span className="navbar-brand"><img src="hyperspace48.png" style={{ width: '24px'}} alt="Hyperspace logo"/>&nbsp;hyperspace</span>
                <div className = "collapse navbar-collapse">
                    <ul className="navbar-nav ml-auto">
                        <DarkModeToggle/>
                        <LogoutButton/>
                    </ul>
                </div>
            </nav>
            
        );
    }
}

export default Navbar;