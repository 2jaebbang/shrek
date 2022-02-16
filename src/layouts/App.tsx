import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import loadable from '@loadable/component';
import { QueryClient, QueryClientProvider } from 'react-query';

const Login = loadable(() => import('pages/Login'));
const SignUp = loadable(() => import('pages/SignUp'));
const queryClient = new QueryClient();

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signUp" element={<SignUp />}></Route>
        </Routes>
      </QueryClientProvider>
    </div>
  );
}

export default App;
