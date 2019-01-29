import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Tabs, Tab } from 'react-bootstrap-tabs';
import * as axios from 'axios';
import 'jquery';
import 'popper.js';
import * as moment from 'moment';
import './assets/css/bootstrap.css';
import './assets/css/bootstrap-grid.css';
import './assets/css/bootstrap-reboot.css';
import './assets/css/default.css'; // This must be compiled first!

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

class ComposeWindow extends Component {
  render() {
    return (
        <div className="container shadow rounded my-2">
          <div className="row">
            <div className="col p-4 post">
              <div className="media">
                <div className="media-body">
                  <h5 className="mt-0">
                    <b>Make a new post</b>
                  </h5>
                  <p>
                    <textarea className="form-control" id="exampleFormControlTextarea1" rows="3"
                              placeholder="What's on your mind?"/>
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <ul className="nav toolbar-area">
                    <li className="nav-item toolbar">
                      <i className="material-icons md-18">camera_alt</i>
                    </li>
                    <li className="nav-item toolbar">
                      <i className="material-icons md-18">public</i> Public
                    </li>
                    <li className="nav-item toolbar">
                      <i className="material-icons md-18">warning</i>
                    </li>
                    <li className="nav-item toolbar">
                      <i className="material-icons md-18">tag_faces</i>
                    </li>
                  </ul>
                </div>
                <div className="col">
                  <button className="btn btn-sm btn-accent float-right pl-4 pr-4">Toot</button>
                </div>
              </div>

            </div>
          </div>
        </div>
    );
  }
}

class Avatar extends Component {
  render() {
    return (
        <i className="material-icons md-24"><img alt="person" className="mr-3 rounded-circle shadow-sm avatar" src={this.props.src}/></i>
    );
  }
}

class PostAuthor extends Component {
  name;
  handle;
  render() {
    return (
      <h5 className="mt-0">
        <b>{this.props.name}</b>
        <span className="text-muted"> @{this.props.handle}</span>
      </h5>
    );
  }
}

class PostContent extends Component {
  render() {
    return (
        <div className="post-content">{this.props.children}</div>
    );
  }
}

class PostDate extends Component {
  render() {
    return (
        <small class = "text-muted">{this.props.date}</small>
    );
  }
}

class PostToolbar extends Component {
    replies;
    favorites;
    boosts;
    render() {
        return (
            <div className="col">
                <ul className="nav toolbar-area">
                    <li className="nav-item toolbar">
                        <i className="material-icons md-18">reply</i> {this.props.replies}
                    </li>
                    <li className="nav-item toolbar">
                        <i className="material-icons md-18">favorite</i> {this.props.favorites}
                    </li>
                    <li className="nav-item toolbar">
                        <i className="material-icons md-18">share</i> {this.props.boosts}
                    </li>
                </ul>
            </div>
        );
    }
}

class Post extends Component {
  render() {
    return (
        <div className="container shadow-sm rounded my-2">
          <div className="row">
            <div className="col p-4 post">
              <div className="media">
                {this.props.children[0]}
                <div className="media-body">
                  {this.props.children.slice(1, this.props.children.length - 2)}
                </div>
              </div>
              <div className="row">
                  {this.props.children.slice(3, this.props.children.length - 1)}
                <div className="col">
                  <span className="float-right">{this.props.children[this.props.children.length - 1]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

class PostSensitive extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            status: this.props.status
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {
        return (
            <div>
                <div className="alert alert-warning" role="alert">
                    <p>The author of this post has marked the following content as a spoiler or a warning.</p>
                    <Button size="sm" color="warning" onClick={this.toggle}><i className="material-icons">warning</i> {this.state.status.spoiler_text ? this.state.status.spoiler_text: "Proceed"}</Button>
                </div>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>{this.state.status.spoiler_text}</ModalHeader>
                    <ModalBody>
                        <div className="container-fluid">
                            <div>
                                <div>
                                    <p dangerouslySetInnerHTML={{__html: this.state.status.content}} />
                                    {
                                        this.state.status.media_attachments.length ?
                                            <div className = "row">
                                                {
                                                    this.state.status.media_attachments.map( function(media) {
                                                        return(
                                                            <div className="col">
                                                                <img src={media.url} className = "shadow-sm rounded" alt={media.description} style = {{ width: '100%' }}/>
                                                            </div>
                                                        );
                                                    })
                                                }
                                                <br/>
                                            </div>:
                                            <span></span>
                                    }
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

class PostRoll extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statuses: []
        }
    }

    componentWillMount() {
        let _this = this;
        axios.default
            .get(this.props.timeline)
            .then(function(result) {
                _this.setState({
                    statuses: result.data
                });
            })
    }

    render() {
        return (
            <div>
                {this.state.statuses.length > 0 ? <div>{this.state.statuses.map(function (status) {
                        return (<Post>
                                <Avatar src = {status.account.avatar}/>
                                <PostAuthor name={status.account.display_name} handle={status.account.acct}/>
                                <PostContent>
                                    {
                                        status.sensitive === true ?
                                            <PostSensitive status={status}/>:
                                            <div>
                                                <p dangerouslySetInnerHTML={{__html: status.content}} />
                                                {
                                                    status.media_attachments.length ?
                                                        <div className = "row">
                                                            {
                                                                status.media_attachments.map( function(media) {
                                                                    return(
                                                                        <div className="col">
                                                                            <img src={media.url} className = "shadow-sm rounded" alt={media.description} style = {{ width: '100%' }}/>
                                                                        </div>
                                                                    );
                                                                })
                                                            }
                                                        </div>:
                                                        <span></span>
                                                }
                                            </div>
                                    }

                                </PostContent>
                                <PostToolbar
                                    replies={
                                        status.in_reply_to_id ?
                                            <span>1</span>: <span></span>
                                    }
                                    favorites={status.favourites_count}
                                    boosts={status.reblogs_count}
                                />
                                <PostDate date={moment(status.created_at).format('MM/DD/YYYY [at] h:mm a')}/>
                            </Post>
                        );
                    })}</div>:
                <p>Nothing found!</p>}

            </div>
        );
    }
}

class Timeline extends Component {
    render() {
        return (
            <div style={{ width: '100%'}}>
                <Tabs className="nav-pills nav-fill timeline-nav">
                    <Tab label="Home">
                        <div className = "container">
                            <PostRoll timeline="https://mastodon.social/api/v1/timelines/home"/>
                        </div>
                    </Tab>
                    <Tab label="Local">
                        <div className = "container">
                            <PostRoll timeline="https://mastodon.social/api/v1/timelines/public?local=true"/>
                        </div>
                    </Tab>
                    <Tab label="Global">
                        <p> </p>
                        <div className = "container">
                            <PostRoll timeline="https://mastodon.social/api/v1/timelines/public"/>
                        </div>
                    </Tab>
                </Tabs>
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

class App extends Component {
  render() {
    return (
        <div>
          <nav>
            <Navbar></Navbar>
          </nav>
          <div className = "container app-container">
            <div className = "row">
              <div className = "col-sm-12 col-md-8">
                <ComposeWindow className="fixed-top"/>
                <hr/>
                <div className="container">
                    <Timeline/>
                </div>
              </div>
              <div className="col-sm-12 col-md-4 d-sm-none d-md-block m-0 p-0 shadow rounded profile-container">
                <ProfileContainer
                    avatar = "https://preview.redd.it/o3jotqc1m2d21.png?width=640&crop=smart&auto=webp&s=21415f9a52ac9cbf46280e0707866f57912e8a2b"
                    headerImage = "https://images.unsplash.com/photo-1548540841-acd06bd9702e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80"
                    name = "Asriel Dreemurr"
                    handle = "@asriel@dreemurr.io"
                    bio = "Mistakes have been made! Sysadmin for pretty much everything on dreemurr.io"
                />
                <hr/>
                <div className="container" style={{textAlign: 'center'}}>
                    <small style={{textAlign: 'center'}}>
                        <b>Hyperspace (alpha)</b>
                        <p>A fluffy client for Mastodon written in React.</p>
                    </small>
                </div>
              </div>
            </div>
          </div>
        </div>

    );
  }
}

export default App;
