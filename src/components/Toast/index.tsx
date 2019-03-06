import React, {Component} from 'react';
import {getDarkMode} from '../../utilities/getDarkMode';

export class Toast extends Component<any, any> {

    getStyles() {
        if (getDarkMode() == "dark") {
            return {
                marginTop: 64,
                paddingTop: 16,
                paddingLeft: 24,
                paddingBottom: 4,
                backgroundColor: "#333",
                color: "#f4f4f4"
            }
        } else {
            return {
                marginTop: 64,
                paddingTop: 16,
                paddingLeft: 24,
                paddingBottom: 4,
                backgroundColor: "#fff",
                color: "#333"
            }
        }
    }

    render() {
        return (
            <div className = {"shadow rounded marked-area" + getDarkMode()} style = {this.getStyles()}>
                <p><b>{this.props.text}</b></p>
            </div>
        );
    }
}