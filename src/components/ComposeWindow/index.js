import React, { Component } from 'react';

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

export default ComposeWindow;