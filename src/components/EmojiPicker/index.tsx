import * as React from 'react';
import { Component } from 'react';
import {Picker, PickerProps, CustomEmoji} from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import Mastodon from 'megalodon';

interface EmojiPickerProps extends PickerProps {
    client: Mastodon;
    onGetEmoji: any;
}

class EmojiPicker extends React.Component<EmojiPickerProps, any> {

    retrieveFromLocalStorage() {
        return JSON.parse(localStorage.getItem("emojis") as string);
    }



    render() { 
        return ( 
            <Picker custom={this.retrieveFromLocalStorage()} emoji='' title='' onClick={this.props.onGetEmoji}/>
         );
    }
}
 
export default EmojiPicker;