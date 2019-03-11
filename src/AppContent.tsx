import React from 'react';
import ComposeWindow from './components/ComposeWindow';
import Navbar from './components/Navbar';
import NotificationPane from './components/NotificationPane';
import ProfileContainer, { ProfileUser } from './components/ProfileContainer';
import Timeline from './components/Timeline';
import DarkModeToggle from './components/DarkModeToggle';
import LogoutButton from './components/LogoutButton';

/**
 * Base component that renders the app's content if the user is signed in.
 */
class AppContent extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }
    
    render() {
        return (<div>
            <nav>
                <Navbar />
            </nav>
            <div className="container app-container">
                <div className="row">
                    <div className="col-sm-12 col-lg-8">
                        <div className="d-sm-block d-lg-none mb-3 p-3 marked-area shadow-sm rounded ms-fadeIn100">
                            {
                                localStorage.getItem("account")? 
                                <ProfileUser client={this.props.client} who={JSON.parse(localStorage.getItem("account") || "")} />:
                                <span/>
                            }
                            <div className="my-2 pl-2 pr-2">
                                <span style = {{display: "flex"}}>
                                    <DarkModeToggle />
                                    <LogoutButton />
                                </span>
                            </div>
                        </div>
                        {this.props.client ? <div className="ms-fadeIn100">
                            <ComposeWindow client={this.props.client} />
                            <hr />
                        </div> : <span />}

                        <div className="container">
                            <Timeline client={this.props.client} />
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-4 d-none d-lg-block m-0 p-0 profile-container">
                        <div>
                            {this.props.client ? <div>
                                {localStorage.getItem('account') ? <ProfileContainer client={this.props.client} who={JSON.parse(localStorage.getItem('account') || "")} /> : <div className="p-4">
                                    <h3>Hang tight!</h3>
                                    <p>Reload Hyperspace for your profile card to update.</p>
                                </div>}
                                <NotificationPane client={this.props.client} />
                            </div> : <span />}
                        </div>
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default AppContent;