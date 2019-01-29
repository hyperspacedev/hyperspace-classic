import React, { Component } from 'react';

class Navbar extends Component {
    render() {
        return (
            <nav className="navbar navbar-expand-md navbar-light navbar-app fixed-top">
                <a className="navbar-brand" href="/index.html"><b>Hyperspace</b></a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul id="fediverse-nav" className="navbar-nav mr-auto">

                    </ul>
                    <span>
                    <i className="nav-link material-icons">notifications</i>
                    <i className="nav-link material-icons">settings</i>
                    <i className="nav-link material-icons">person</i>
                </span>
                </div>
            </nav>
        );
    }
}

export default Navbar;