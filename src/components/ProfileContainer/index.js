import React, { Component } from 'react';

class ProfileUser extends Component {
    render() {
        return(
            <div className = "profile-container-bio">
                <p className="h5"><b>{this.props.name}</b></p>
                <p>{this.props.handle}</p>
                <small>{this.props.bio}</small>
            </div>
        );
    }
}

class ProfileContainer extends Component {
    render() {
        return (
            <div className="profile-container">
                <div className="profile-container-header"
                     style={{
                         backgroundImage: 'url("' + this.props.headerImage + '")'
                     }}>
                    <div className="py-4"
                    >
                        <i className = "material-icons profile-container-avatar">
                            <img
                                src={this.props.avatar}
                                className="shadow-sm rounded-circle profile-container-avatar-image"
                                alt="person"
                                style={{textAlign: 'center'}}
                            />
                        </i>
                    </div>
                </div>
                <div className="container">
                    <div className="my-4">
                        <ProfileUser
                            name={this.props.name}
                            handle={this.props.handle}
                            bio={this.props.bio}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default ProfileContainer;