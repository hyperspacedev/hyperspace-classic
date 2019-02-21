import React, { Component } from 'react';
import {Icon, Toggle, TooltipHost, DefaultButton} from 'office-ui-fabric-react';

interface INavbarState {
    darkMode: any;
}

/**
 * Basic navigation bar. Contains logo, name, and log out button.
 */
class Navbar extends Component<any, INavbarState> {

    constructor(props: any) {
        super(props);

        this.state = {
            darkMode: (localStorage.getItem('prefers-dark-mode') === "true")
        }
    }

    logOut() {
        let prompt = window.confirm("Are you sure you want to log out? You'll need to remove Hyperspace from your list of authorized apps and log in again.");
        if (prompt) {
            localStorage.clear();
            window.location.reload();
        }
    }

    getDarkModeIcon() {
        if (localStorage.getItem('prefers-dark-mode') === "true") {
            return 'darkModeOn';
        } else {
            return 'darkModeOff';
        }
    }

    toggleDarkMode(event: any, checked: Boolean) {
        localStorage.setItem('prefers-dark-mode', String(!!checked));
        this.setState({
            darkMode: !!checked
        });
        window.location.reload();
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
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            {
                                localStorage.length > 0 ?
                                <ul className="navbar-nav ml-auto">
                                    <TooltipHost content="Toggle the dark or light theme.">
                                        <Toggle
                                                label={'Dark'}
                                                inlineLabel={true}
                                                defaultChecked={this.state.darkMode}
                                                styles={{root: {marginRight: 12}}}
                                                onChange={(event:any, checked:any) => this.toggleDarkMode(event, checked)}
                                            />
                                    </TooltipHost>
                                    <TooltipHost content="Log out of Hyperspace. You will need to adjust your account settings to revoke this app's access.">
                                        <DefaultButton text="Log out" onClick={() => this.logOut()}/>
                                    </TooltipHost>
                                    </ul>:
                                    <span/>
                            }
                </div> 
            </nav>
        );
    }
}

export default Navbar;