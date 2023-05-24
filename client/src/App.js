import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';

import React, { useState, useEffect } from 'react';
import { verifyToken } from './auth';

import LandingPage from './components/pages/LandingPage/LandingPage';
import LoginPage from './components/pages/LoginPage';
import EmailPage from './components/pages/EmailPage';
import PasswordPage from './components/pages/PasswordPage';
import RegisterPage from './components/pages/RegisterPage';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/pages/Dashboard';
import Loader from './components/Loader';
import SettingsPage from './components/pages/SettingsPage';
import NewPost from './components/pages/NewPost/NewPost';


function App() {

  //verificar se user está autenticado
  const [state, setState] = useState({ isLoading: true, authenticated: false });
  useEffect(() => {
    async function checkAuth() {
      const isAuth = await verifyToken();
      if (isAuth) {
        setState({ isLoading: false, authenticated: isAuth });
      } else {
        // se não estiver autenticado, remover o item do localstorage, para evitar recarregamento infinito da página
        localStorage.removeItem('appToken');
        setState({ isLoading: false, authenticated: isAuth });
      }
    }
    checkAuth();
  }, []);
  useEffect(() => {
    console.log('estado mudado');
  }, [state]);

  // returns loading component
  if (state.isLoading) {
    return <Loader />
  }
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgotpassword" element={<EmailPage />} />
          <Route path="/changepassword" element={<PasswordPage />} />
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="*" element={<LandingPage />} />
          <Route path="/dashboard" element={
            <PrivateRoute isAuthenticated={state.authenticated}>
              <Dashboard />
            </PrivateRoute>}
          />
          <Route path="/settings" element={
            <PrivateRoute isAuthenticated={state.authenticated}>
              <SettingsPage />
            </PrivateRoute>}
          />
          <Route path="/newpost" element={
            <PrivateRoute isAuthenticated={state.authenticated}>
              <NewPost />
            </PrivateRoute>}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
