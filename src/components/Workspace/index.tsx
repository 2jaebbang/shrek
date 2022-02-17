import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import useSWR from 'swr';
import fetcher from 'utils/fetcher';
import {
  Channels,
  Chats,
  Header,
  MenuScroll,
  ProfileImg,
  RightMenu,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from './styles';
import gravatar from 'gravatar';
import loadable from '@loadable/component';
import Menu from 'components/Menu';

const Channel = loadable(() => import('pages/Channel'));
const DirectMessage = loadable(() => import('pages/DirectMessage'));

const Workspace: FC = ({ children }) => {
  const { data, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher, { dedupingInterval: 10000 });
  const onLogout = useCallback(() => {
    axios.post('http://localhost:3095/api/users/logout', null, { withCredentials: true }).then(() => {
      mutate(false, false);
    });
  }, []);

  //데이터가 없을경우 /login으로 이동
  if (!data) {
    return <Navigate replace to="/login" />;
  }
  return (
    <div>
      <Header>
        <RightMenu />
        <span>
          <ProfileImg src={gravatar.url(data.email, { s: '28px', d: 'retro' })} alt={data.email} />
          <Menu>프로필메뉴</Menu>
        </span>
      </Header>
      <button onClick={onLogout}>로그아웃</button>
      <WorkspaceWrapper>
        <Workspaces>test</Workspaces>
        <Channels>
          <WorkspaceName>Shrek</WorkspaceName>
          <MenuScroll>MenuScorll</MenuScroll>
        </Channels>
        <Chats>
          <Routes>
            <Route path="/channel" element={<Channel />}></Route>
            <Route path="/dm/:id" element={<DirectMessage />}></Route>
          </Routes>
        </Chats>
      </WorkspaceWrapper>
    </div>
  );
};

export default Workspace;
