import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import loadable from '@loadable/component';

const Login = loadable(() => import('pages/Login'));
const SignUp = loadable(() => import('pages/SignUp'));
const Workspace = loadable(() => import('components/Workspace'));
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signUp" element={<SignUp />}></Route>
        <Route path="/workspace/*" element={<Workspace />}></Route>
      </Routes>
    </div>
  );
}

export default App;
