import React, {Component} from 'react';
import {TooltipHost, Toggle, Icon} from 'office-ui-fabric-react';
import { getDarkMode } from '../../utilities/getDarkMode';

interface IDarkModeToggleState {
    darkMode: boolean;
}

class DarkModeToggle extends Component<any, IDarkModeToggleState> {

    constructor(props: any) {
        super(props);

        this.state = {
            darkMode: (localStorage.getItem('prefers-dark-mode') === "true")
        }

    }

    getIcon() {
        if (this.state.darkMode) {
            return 'darkModeOn';
        } else {
            return 'darkModeOff';
        }
    }

    toggle(event: any, checked: Boolean) {
        localStorage.setItem('prefers-dark-mode', String(!!checked));
        this.setState({
            darkMode: !!checked
        })
        window.location.reload();
    }

    render() {
        return (
            <TooltipHost content="Toggle the dark or light theme.">
                <Toggle
                        label={<Icon iconName={this.getIcon()}/> as unknown as string}
                        inlineLabel={true}
                        defaultChecked={this.state.darkMode || undefined}
                        styles={{root: {marginRight: 12}}}
                        onChange={(event:any, checked:any) => this.toggle(event, checked)}
                        className={"toggle"}
                    />
            </TooltipHost>
        );
    }

}

export default DarkModeToggle;