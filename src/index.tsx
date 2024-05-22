import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import RootRouter from './router/route';
import { NotificationProvider } from './context/NotificationContext';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.Fragment>
    <NotificationProvider>
      <RootRouter />
    </NotificationProvider>
  </React.Fragment>
);
