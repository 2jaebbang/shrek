import React, { useCallback, useState } from 'react';
import useInput from 'hooks/useInput';
import { Button, Error, Form, Header, Input, Label, LinkContainer } from 'pages/SignUp/styles';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import useSWR from 'swr';
import fetcher from 'utils/fetcher';

const LogIn = () => {
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const [logInError, setLogInError] = useState(false);
  const { data, error, mutate } = useSWR('/users', fetcher, { dedupingInterval: 10000 });

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setLogInError(false);
      axios
        .post(
          '/users/login',
          {
            email,
            password,
          },
          { withCredentials: true },
        )
        .then((response) => {
          mutate(response.data, false);
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },
    [email, password],
  );

  if (data === undefined) {
    return <div>로딩 중...</div>;
  }

  //데이터가 있을경우 (로그인했을 경우) workspace/channel로 이동
  if (data) {
    return <Navigate replace to="/workspace/sleact/channel/일반" />;
  }

  return (
    <div id="container">
      <div
        style={{
          border: '1px solid gray',
          borderRadius: '10px',
          width: '60%',
          margin: '100px auto',
          padding: '20px 0px',
          boxShadow: '25% 0px 20px 10px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Header>ReadMe</Header>
        <Form onSubmit={onSubmit}>
          <Label id="email-label">
            <div>
              <Input
                style={{ backgroundColor: '#F7F7F7' }}
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={onChangeEmail}
                placeholder="이메일 주소"
              />
            </div>
          </Label>
          <Label id="password-label">
            <div>
              <Input
                style={{ backgroundColor: '#F7F7F7' }}
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={onChangePassword}
                placeholder="비밀번호"
              />
            </div>
            {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
          </Label>
          <Button type="submit">로그인</Button>
        </Form>
        <LinkContainer>
          아직 회원이 아니신가요?&nbsp;
          <Link to="/signup">회원가입 하러가기</Link>
        </LinkContainer>
      </div>
    </div>
  );
};

export default LogIn;
