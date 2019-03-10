import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    console.warn("You're running Hyperspace in developer mode. Expect delays in streaming of timelines.");
    document.title = "Hyperspace 🔧";
}

ReactDOM.render(<App/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
