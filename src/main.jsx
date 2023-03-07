import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRoutes } from './AppRoutes';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AppRoutes/>
    </React.StrictMode>
)