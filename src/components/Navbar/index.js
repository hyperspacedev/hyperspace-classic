import React, { Component } from 'react';

class Navbar extends Component {
    render() {
        return (
            <nav className="navbar navbar-expand-md navbar-light navbar-app fixed-top">
                <a className="navbar-brand" href="/index.html"><b>Hyperspace</b></a>
            </nav>
        );
    }
}

export default Navbar;