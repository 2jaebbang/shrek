import axios from 'axios';
import React, { VFC, useCallback, useState } from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useSWR from 'swr';
import fetcher from 'utils/fetcher';
import {
  AddButton,
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceButton,
  WorkspaceModal,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from './styles';
import gravatar from 'gravatar';
import loadable from '@loadable/component';
import Menu from 'components/Menu';
import { Link } from 'react-router-dom';
import { IChannel, IUser } from 'types/db';
import Modal from 'components/Modal';
import { Button, Input, Label } from 'pages/SignUp/styles';
import useInput from 'hooks/useInput';
import CreateChannelModal from 'components/CreateChannelModal';
import InviteWorkspaceModal from 'components/InviteWorkspaceModal';
import InviteChannelModal from 'components/InviteChannelModal';
import ChannelList from 'components/ChannelList';
import DMList from 'components/DMList';

const Channel = loadable(() => import('pages/Channel'));
const DirectMessage = loadable(() => import('pages/DirectMessage'));

const Workspace: VFC = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);

  const params = useParams<{ workspace?: string }>();
  const { workspace } = params;

  const {
    data: userData,
    error,
    revalidate,
    mutate,
  } = useSWR<IUser | false>('/users', fetcher, { dedupingInterval: 2000 });

  const { data: channelData } = useSWR<IChannel[]>(userData ? `/workspaces/${workspace}/channels` : null, fetcher);

  const { data: memberData } = useSWR<IUser[]>(userData ? `/workspaces/${workspace}/members` : null, fetcher);

  const onLogout = useCallback(() => {
    axios.post('/users/logout', null, { withCredentials: true }).then(() => {
      mutate(false, false);
    });
  }, []);

  //?????????????????????
  const onClickUserProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);

  //?????????????????? ????????????
  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  //?????????????????? ??????
  const onCreateWorkspace = useCallback(
    async (e) => {
      e.preventDefault();

      //?????????????????? ?????? ??? ????????? ??????
      if (!newWorkspace || !newWorkspace.trim()) {
        return;
      }
      if (!newUrl || !newUrl.trim()) {
        return;
      }
      axios
        .post(
          '/workspaces',
          {
            workspace: newWorkspace,
            url: newUrl,
          },
          { withCredentials: true },
        )
        .then((response) => {
          revalidate();
          setShowCreateWorkspaceModal(false);
          setNewWorkspace('');
          setNewUrl('');
        })
        .catch((error) => {
          console.log('error');
          console.dir(error);
          toast.configure();
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newWorkspace, newUrl],
  );

  //????????? ??????
  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
    setShowInviteWorkspaceModal(false);
    setShowInviteChannelModal(false);
  }, []);

  const toggleWorkspaceModal = useCallback(() => {
    setShowWorkspaceModal((prev) => !prev);
  }, []);

  //?????? ??????
  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal(true);
  }, []);

  //?????????????????? ??????
  const onClickInviteWorkspace = useCallback(() => {
    setShowInviteWorkspaceModal(true);
  }, []);

  //???????????? ???????????? /login?????? ??????
  if (!userData) {
    return <Navigate replace to="/login" />;
  }
  return (
    <div>
      <Header>
        <RightMenu />
        <span>
          <ProfileImg
            onClick={onClickUserProfile}
            src={gravatar.url(userData.email, { s: '28px', d: 'retro' })}
            alt={userData.email}
          />
          {showUserMenu && (
            <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUserProfile}>
              <ProfileModal>
                <img src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} />
                <div>
                  <span id="profile-name">{userData.nickname}</span>
                  <span id="profile-active">Active</span>
                </div>
              </ProfileModal>
              <LogOutButton onClick={onLogout}>????????????</LogOutButton>
            </Menu>
          )}
        </span>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {userData.Workspaces?.map((ws) => {
            return (
              <Link key={ws.id} to={`/workspace/${123}/channel/??????`}>
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName onClick={toggleWorkspaceModal}>Shrek</WorkspaceName>
          <MenuScroll>
            {showWorkspaceModal && (
              <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
                <WorkspaceModal>
                  <h2>Shrek</h2>
                  <button onClick={onClickInviteWorkspace}>????????????????????? ????????? ??????</button>
                  <button onClick={onClickAddChannel}>?????? ?????????</button>
                  <button onClick={onLogout}>????????????</button>
                </WorkspaceModal>
              </Menu>
            )}
            <ChannelList />
            <DMList />
            {channelData?.map((v) => (
              <div>{v.name}</div>
            ))}
          </MenuScroll>
        </Channels>
        <Chats>
          <Routes>
            <Route path="/channel/:channel" element={<Channel />}></Route>
            <Route path="/dm/:id" element={<DirectMessage />}></Route>
          </Routes>
        </Chats>
      </WorkspaceWrapper>
      <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Label id="workspace-label">
            <span>?????????????????? ??????</span>
            <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
          </Label>
          <Label id="workspace-url-label">
            <span>?????????????????? url</span>
            <Input id="workspace-url" value={newUrl} onChange={onChangeNewUrl} />
          </Label>
          <Button type="submit">????????????</Button>
        </form>
      </Modal>
      <CreateChannelModal
        show={showCreateChannelModal}
        onCloseModal={onCloseModal}
        setShowCreateChannelModal={setShowCreateChannelModal}
      ></CreateChannelModal>
      <InviteWorkspaceModal
        show={showInviteWorkspaceModal}
        onCloseModal={onCloseModal}
        setShowInviteWorkspaceModal={setShowInviteWorkspaceModal}
      />
      <InviteWorkspaceModal
        show={showInviteWorkspaceModal}
        onCloseModal={onCloseModal}
        setShowInviteWorkspaceModal={setShowInviteWorkspaceModal}
      />
      <InviteChannelModal
        show={showInviteChannelModal}
        onCloseModal={onCloseModal}
        setShowInviteChannelModal={setShowInviteChannelModal}
      />
    </div>
  );
};

export default Workspace;
