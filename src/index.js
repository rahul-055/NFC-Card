import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import configureStore from './store';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import axios from 'axios';
import './assets/css/style.css'

axios.interceptors.request.use(
    (req) => {
        const accessToken = localStorage.getItem("acwtoken");
        req.headers.Authorization = accessToken;
        return req;
    },
    (err) => {
        return Promise.reject(err);
    }
);

// For POST requests
axios.interceptors.response.use(
    (res) => {
        return res;
    },
    (err) => {
        if (err.response) {
            if (err.response.status === 403) {
                localStorage.removeItem('acwtoken');
                window.location = '/';
            }
        }
        return Promise.reject(err);
    }
);
ReactDOM.render(
    <Provider store={configureStore()}>
        <App />
    </Provider>,
    document.getElementById('root')
);
// registerServiceWorker();
// ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
