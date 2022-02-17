import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { Navigate } from 'react-router';
import useSWR from 'swr';
import fetcher from 'utils/fetcher';

const Workspace: FC = ({ children }) => {
  const { data, error, revalidate } = useSWR('http://localhost:3095/api/users', fetcher, { dedupingInterval: 10000 });
  const onLogout = useCallback(() => {
    axios.post('http://localhost:3095/api/users/logout', null, { withCredentials: true }).then(() => {
      revalidate();
    });
  }, []);

  //데이터가 없을경우 /login으로 이동
  if (!data) {
    return <Navigate replace to="/login" />;
  }
  return (
    <div>
      <button onClick={onLogout}>로그아웃</button>
      {children}
    </div>
  );
};

export default Workspace;
