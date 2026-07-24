import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { RootState } from '../../services/store';
import { Preloader } from '@ui';
import { ReactNode } from 'react';

type ProtectedRouteProps = {
  children: ReactNode;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false
}: ProtectedRouteProps) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  const isAuthChecked = useSelector(
    (state: RootState) => state.user.isAuthChecked
  );
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Если роут только для неавторизованных, а пользователь авторизован
  if (onlyUnAuth && isAuthenticated) {
    // Передаем location.state?.from для редиректа на исходную страницу
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  // Если роут требует авторизации, а пользователь не авторизован
  if (!onlyUnAuth && !isAuthenticated) {
    // Сохраняем текущий путь для редиректа после входа
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
