import React, {Component} from 'react';
import {DefaultButton, TooltipHost} from 'office-ui-fabric-react';

/**
 * Simple button to log out the user.
 */
class LogoutButton extends Component<any, any> {

    logOut() {
        let prompt = window.confirm("Are you sure you want to log out? You'll need to remove Hyperspace from your list of authorized apps and log in again.");
        if (prompt) {
            localStorage.clear();
            window.location.reload();
        }
    }

    render() {
        return (
            <TooltipHost content="Log out of Hyperspace. You will need to adjust your account settings to revoke this app's access.">
                <DefaultButton text="Log out" onClick={() => this.logOut()}/>
            </TooltipHost>
        );
    }
}

export default LogoutButton;