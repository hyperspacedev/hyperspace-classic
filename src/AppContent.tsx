import React from 'react';
import Composable from './components/Composable';
import Navbar from './components/Navbar';
import NotificationPane from './components/NotificationPane';
import ProfileContainer, { ProfileUser } from './components/ProfileContainer';
import Timeline from './components/Timeline';
import DarkModeToggle from './components/DarkModeToggle';
import LogoutButton from './components/LogoutButton';
import { Account } from './types/Account';
import { Modal, Icon, IconButton, TooltipHost, TeachingBubble } from 'office-ui-fabric-react';
import { getDarkMode } from './utilities/getDarkMode';
import { HotKeys } from 'react-hotkeys';
/**
 * Base component that renders the app's content if the user is signed in.
 */
class AppContent extends React.Component<any, any> {

    private _composeButton: HTMLElement | any;

    constructor(props: any) {
        super(props);

        this.state = {
            composableOpen: false,
            teachBubbleVisible: false
        }
    }

    componentDidMount() {
        if (!localStorage.getItem('seen-new-features')) {
            this.setState({
                teachBubbleVisible: true
            })
        }
    }

    seenNewFeatures() {
        localStorage.setItem('seen-new-features', 'true');
        this.setState({
            teachBubbleVisible: false
        })
    }

    openModal() {
        this.setState({
            composableOpen: true
        })
    }

    closeModal() {
        this.setState({
            composableOpen: false
        })
    }
    
    render() {

        const handlers = {
            'newPost': () => this.openModal()
        }

        return (
        <HotKeys handlers={handlers} focused>
            <div className={getDarkMode()}>
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

                            <div className="container">
                                <Timeline client={this.props.client} />
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-4 d-none d-lg-block m-0 p-0 profile-container">
                            <div>
                                {this.props.client ? <div>
                                    {localStorage.getItem('account') ? <ProfileContainer client={this.props.client} who={JSON.parse(localStorage.getItem('account') || "") as Account} /> : <div className="p-4">
                                        <h3>Hang tight!</h3>
                                        <p>Reload Hyperspace for your profile card to update.</p>
                                    </div>}
                                    <NotificationPane client={this.props.client} />
                                </div> : <span />}
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.teachBubbleVisible? <TeachingBubble
                    hasCloseIcon={true}
                    hasSmallHeadline={true}
                    targetElement={this._composeButton}
                    headline="Write new posts here."
                    onDismiss={() => this.seenNewFeatures()}
                >
                    Press this button or press 'N' on your keyboard to quickly access the Composer from anywhere on the main timeline!
                </TeachingBubble>: null}
                <button ref={composeButton => (this._composeButton = composeButton!)} title = "Compose a new post. (n)" className = "compose-window-float-button" onClick={() => this.openModal()}><Icon iconName="postStatus"/></button>
                <Modal
                    isOpen={this.state.composableOpen}
                    containerClassName={"compose-window-float"}
                    className={getDarkMode()}
                    onDismiss={() => this.closeModal()}
                    isBlocking={false}
                >
                    <div>
                        <h2 className="mb-3 compose-window-header">Compose new post</h2>
                        <Composable client={this.props.client}/>
                        <IconButton className="close-button" onClick={() => this.closeModal()} title="Close" iconProps={{ iconName: 'cancel' }}/>
                    </div>
                </Modal>
            </div>
        </HotKeys>
        );
    }
}

export default AppContent;