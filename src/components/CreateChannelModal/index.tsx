import Modal from 'components/Modal';
import useInput from 'hooks/useInput';
import { Button, Input, Label } from 'pages/SignUp/styles';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import fetcher from 'utils/fetcher';
import { IChannel, IUser } from 'types/db';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: (flag: boolean) => void;
}
const CreateChannelModal: FC<Props> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
  const params = useParams<{ workspace?: string }>();
  const { workspace } = params;
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');

  const {
    data: userData,
    error,
    revalidate,
    mutate,
  } = useSWR<IUser | false>('api/users', fetcher, { dedupingInterval: 2000 });

  const { data: channelData, revalidate: revalidateChannel } = useSWR<IChannel[]>(
    userData ? `/workspaces/${workspace}/channels` : null,
    fetcher,
  );

  const onCreateChannel = useCallback(
    (e) => {
      e.preventDefault();
      if (!newChannel || !newChannel.trim()) {
        return;
      }
      axios
        .post(
          `/workspaces/${workspace}/channels`,
          {
            name: newChannel,
          },
          { withCredentials: true },
        )
        .then(() => {
          revalidateChannel();
          setShowCreateChannelModal(false);
          setNewChannel('');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newChannel, setNewChannel, setShowCreateChannelModal, workspace],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="channel-label">
          <span>채널 이름</span>
          <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
        </Label>
        <Button>생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
