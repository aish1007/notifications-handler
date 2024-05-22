import React from 'react';
import { Outlet, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import App from '../App';
import Metric from '../pages/metric';
const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='/metric/:id' element={<Metric />} />
    </Routes>
  );
};

const RootRouter = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default RootRouter;
