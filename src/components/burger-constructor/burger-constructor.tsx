import { FC, useEffect } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { RootState } from '../../services/store';
import { createOrder, clearOrder } from '../../services/slices/orderSlice';
import { clearConstructor } from '../../services/slices/constructorSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector(
    (state: RootState) => state.burgerConstructor
  );
  const orderRequest = useSelector((state: RootState) => state.order.isLoading);
  const orderModalData = useSelector((state: RootState) => state.order.order);
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  // Очищаем конструктор сразу после успешного создания заказа
  useEffect(() => {
    // Если заказ создан (orderModalData не null) и загрузка завершена (orderRequest false)
    if (orderModalData && !orderRequest) {
      dispatch(clearConstructor());
    }
  }, [orderModalData, orderRequest, dispatch]);

  const price = (() => {
    if (!constructorItems) return 0;
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsPrice = Array.isArray(constructorItems.ingredients)
      ? constructorItems.ingredients.reduce(
          (sum: number, item: TConstructorIngredient) => sum + item.price,
          0
        )
      : 0;
    return bunPrice + ingredientsPrice;
  })();

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const ingredients = [
      constructorItems.bun._id,
      ...(constructorItems.ingredients || []).map(
        (item: TConstructorIngredient) => item._id
      ),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredients));
  };

  const closeOrderModal = () => {
    if (orderRequest) return;
    dispatch(clearOrder());
    // Конструктор уже очищен через useEffect, дополнительно не очищаем
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
