import React, { Component } from 'react';
import {IconButton, DefaultButton, TooltipHost} from 'office-ui-fabric-react';

/**
 * Basic navigation bar. Contains logo, name, and log out button.
 */
class Navbar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            darkMode: Boolean(localStorage.getItem("prefers-dark-mode"))
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

    toggleDarkMode() {
        let newState = !this.state.darkMode;
        localStorage.setItem('prefers-dark-mode', String(newState));
        this.setState({
            darkMode: newState
        });
    }

    render() {
        return (
            <nav className="navbar navbar-expand-md navbar-light navbar-app fixed-top">
                <span className="navbar-brand"><img src="hyperspace48.png" style={{ width: '24px'}} alt="Hyperspace logo"/>&nbsp;<b>Hyperspace</b></span>
                <ul className="navbar-nav ml-auto">
                <TooltipHost content="Toggle light/dark mode. Reload the app for changes to take effect.">
                    <IconButton
                        name="dark-mode-button"
                        iconProps={{ 
                            iconName: this.getDarkModeIcon(),
                            styles: {
                                root: {
                                    width: 24,
                                    height: 24,
                                    color: 'white',
                                    marginRight: 16
                                }
                            }
                        }} 
                        onClick = {() => this.toggleDarkMode()}
                    />
                </TooltipHost>
                    {
                        localStorage.length > 0 ?
                            <DefaultButton text="Log out" onClick={() => this.logOut()}/>:
                            <span/>
                    }
                </ul>
            </nav>
        );
    }
}

export default Navbar;