import React from 'react'
import { store } from './store/store.js'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom/client'
import App from './App.js'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store = { store }>
        <App/>
    </Provider>
    
    );

