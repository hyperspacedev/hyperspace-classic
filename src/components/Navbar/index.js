import React, { Component } from 'react';
import {DefaultButton} from 'office-ui-fabric-react';

class Navbar extends Component {

    logOut() {
        let prompt = window.confirm("Are you sure you want to log out? You'll need to remove Hyperspace from your list of authorized apps and log in again.");
        if (prompt) {
            localStorage.clear();
            window.location.reload();
        }
    }

    render() {
        return (
            <nav className="navbar navbar-expand-md navbar-light navbar-app fixed-top">
                <a className="navbar-brand"><img src="hyperspace48.png" style={{ width: '24px'}}/>&nbsp;<b>Hyperspace</b></a>
                <ul className="navbar-nav ml-auto">
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