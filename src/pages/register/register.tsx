import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { RootState } from '../../services/store';
import { registerUser } from '../../services/slices/userSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnyAction } from '@reduxjs/toolkit';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const error = useSelector((state: RootState) => state.user.loginUserError);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(registerUser({ name: userName, email, password })).then(
      (result: AnyAction) => {
        if (result.meta?.requestStatus === 'fulfilled') {
          // Получаем путь, с которого пришел пользователь, или "/" по умолчанию
          const from = location.state?.from?.pathname || '/';
          navigate(from, { replace: true });
        }
      }
    );
  };

  return (
    <RegisterUI
      errorText={error || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
