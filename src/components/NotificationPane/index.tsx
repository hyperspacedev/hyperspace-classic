import React, { Component } from 'react';
import { ActivityItem, Dialog, DialogType, DialogFooter, Link, PrimaryButton, DefaultButton, Spinner, SpinnerSize } from "office-ui-fabric-react";
import ReplyWindow from '../ReplyWindow';
import ProfilePanel from '../ProfilePanel';
import moment from 'moment';
import ThreadPanel from "../ThreadPanel";
import {anchorInBrowser} from "../../utilities/anchorInBrowser";
import Mastodon from 'megalodon';
import {Status} from '../../types/Status';


interface INotificationPaneProps {
    client: Mastodon;
}

interface INotificationPaneState {
    notifications: [];
    hideDeleteDialog: boolean | undefined;
    loading: boolean;
}

/**
 * Small area dedicated to displaying, responding to, and clearing notifications.
 * 
 * @param client The Mastodon client used to get, post, and delete notifications.
 */
class NotificationPane extends Component<INotificationPaneProps, INotificationPaneState> {

    client: any;
    notifListener: any;

    constructor(props: any){
        super(props);

        this.client = this.props.client;

        this.state = {
            notifications: [],
            hideDeleteDialog: true,
            loading: true
        }


    }

    componentDidMount() {
        let _this = this;

        this.notifListener = this.client.stream('/streaming/user');

        this.notifListener.on('connect', () => {
            this.client.get('/notifications', {limit: 7})
                .then((resp: any) => {
                    _this.setState({
                        notifications: resp.data,
                        loading: false
                    })
                });
        });

        this.notifListener.on('notification', (notification: any) => {
            let notif_set = _this.state.notifications;
            notif_set.unshift(notification as never);
            notif_set.splice(-1, 1);
            _this.setState({
                notifications: notif_set
            });

            this.sendDesktopNotification(notification)

        })

    }

    componentDidUpdate() {
        anchorInBrowser();
    }

    toggleDeleteDialog() {
        this.setState({
            hideDeleteDialog: !this.state.hideDeleteDialog
        })
    }

    getDeleteLink() {
        if (this.state.notifications.length > 0) {
            return (<Link className="mr-2" onClick={() => this.toggleDeleteDialog()}>Clear</Link>);
        }
    }

    getDeleteDialog() {
        return(
            <Dialog
                hidden={this.state.hideDeleteDialog}
                onDismiss={() => this.toggleDeleteDialog()}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: 'Clear all notifications',
                    subText: 'Are you sure you want to clear all of your notifications? This action cannot be undone.'
                }}
                modalProps={{
                    isBlocking: true
                }}
            >
                <DialogFooter>
                    <PrimaryButton onClick={() => this.deleteNotifications()} text="Clear"/>
                    <DefaultButton onClick={() => this.toggleDeleteDialog()} text="Cancel"/>
                </DialogFooter>
            </Dialog>
        );
    }

    deleteNotifications() {
        let _this = this;
        this.client.post('/notifications/clear')
            .then(() => {
                _this.setState({
                    notifications: []
                })
            });
        this.toggleDeleteDialog()
    }

    getAuthorLink(account: any) {
        return <ProfilePanel account={account} client={this.client}/>;
    }

    sendDesktopNotification(notification: any) {

        let title = notification.account.display_name;
        let body = "";
        if (notification.type === "follow") {
            title += " followed you.";
        } else if (notification.type === "mention") {
            if (notification.status.visibility === "direct") {
                title += " messaged you.";
            } else {
                title += " mentioned you in a status.";
            }
        } else if (notification.type === "favourite") {
            title += " favorited your status.";
        } else if (notification.type === "reblog") {
            title += " boosted your status."
        }

        if (notification.status !== null || notification.status !== undefined) {
            let tempDivElement = document.createElement('tempDiv');
            tempDivElement.innerHTML = notification.status.content;
            body = tempDivElement.textContent || tempDivElement.innerText || "";
        }

        let desktopNotification = new Notification(title, {
            body: body
        });

        desktopNotification.onclick= () => { window.focus(); };
    }

    getActivityDescription(type: string, status: Status) {
        if (type === "follow") {
            return <span> <b>followed</b> you.</span>;
        } else if (type === "favourite") {
            return <span> <b>favorited</b> your status.</span>;
        } else if (type === "mention") {
            if (status !== undefined && status.visibility === "direct") {
                return <span> <b>messaged</b> you.</span>;
            } else {
                return <span> <b>mentioned</b> you in a status.</span>;
            }
        } else if (type === "reblog") {
            return <span> <b>boosted</b> your status.</span>;
        }
    }

    getActivityComment(status: Status, type: string) {
        if (status === null || status === undefined) {
            return '';
        } else {
            return (
                <div>
                    <span className="my-2" dangerouslySetInnerHTML={{__html: status.content}}/>
                    {
                        type === "mention" ?
                            <span><ReplyWindow className="mr-2" status={status} client={this.client} fullButton={false}/><ThreadPanel fromWhere={status.id} client={this.client} fullButton={false}/></span>:
                            <span></span>
                    }
                </div>
            );
        }
    }

    getActivityDate(date: any) {
        return moment(date).format("MMM Do, YYYY [at] h:mm A");
    }

    createActivityList() {
        let _this = this;
        if (_this.state.notifications.length > 0) {
            return (_this.state.notifications.map((notification:any, index) => {
                let activityKey = [{
                    activityDescription: [
                        <span key={index}>
                            {this.getAuthorLink(notification.account)}
                            {this.getActivityDescription(notification.type, notification.status)}
                        </span>
                    ]
                }];
                return(
                    <ActivityItem
                        activityDescription={activityKey[0].activityDescription}
                        activityPersonas={[{
                            imageUrl: notification.account.avatar
                        }]}
                        comments={this.getActivityComment(notification.status, notification.type)}
                        timeStamp={this.getActivityDate(notification.created_at)}
                        className="mt-2"
                        key={index + Number(notification.id)}
                    />
                );
            }));
        } else {
            return (<div className="mt-2">
                <h6>All clear!</h6>
                <small>
                    You don't have any new notifications. Interact with others in the fediverse to get the conversation going!
                </small>
            </div>);
        }
    }

    render(){
        return (
            <div id="notification-pane" className = "container-fluid shadow rounded mt-4 p-4 marked-area">
                <div className="row">
                    <div className="col-10">
                        <h5><b>Notifications</b></h5>
                    </div>
                    <div className="col-2">
                        {this.getDeleteLink()}
                        {this.getDeleteDialog()}
                    </div>
                </div>
                {
                    this.state.loading? <Spinner className = "my-2" size={SpinnerSize.small} label="Loading notifications..." ariaLive="assertive" labelPosition="right" />:
                    this.createActivityList()
                }
            </div>
        );
    }

}

export default NotificationPane;