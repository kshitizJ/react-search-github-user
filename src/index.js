import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { GithubProvider } from './context/context';
import { Auth0Provider } from '@auth0/auth0-react';

// kshitiz-jain.us.auth0.com
// k0IRY26k7aWmdCr9Gkj90IIL1pkwBuGw

ReactDOM.render(
    <React.StrictMode>
        <Auth0Provider
            domain="kshitiz-jain.us.auth0.com"
            clientId="k0IRY26k7aWmdCr9Gkj90IIL1pkwBuGw"
            redirectUri={window.location.origin}
            cacheLocation="localstorage"
        >
            <GithubProvider>
                <App />
            </GithubProvider>
        </Auth0Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
