import './index.css';
import '../node_modules/leaflet-geosearch/dist/geosearch.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './app/Redux/store';
import App from './app/App';

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
