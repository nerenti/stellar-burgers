import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { RootState } from '../../services/store';
import { loginUser } from '../../services/slices/userSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnyAction } from '@reduxjs/toolkit';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const error = useSelector((state: RootState) => state.user.loginUserError);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password })).then((result: AnyAction) => {
      if (result.meta?.requestStatus === 'fulfilled') {
        // Получаем путь, с которого пришел пользователь, или "/" по умолчанию
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    });
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
