import React, { Component } from 'react';

class Navbar extends Component {
    render() {
        return (
            <nav className="navbar navbar-expand-md navbar-light navbar-app fixed-top">
                <a className="navbar-brand" href="/index.html"><img src="hyperspace48.png" style={{ width: '24px'}}/>&nbsp;<b>Hyperspace</b></a>
            </nav>
        );
    }
}

export default Navbar;