import React from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import Login from 'pages/Login';
import SignUp from 'pages/SignUp';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signUp" element={<SignUp />}></Route>
      </Routes>
    </div>
  );
}

export default App;
