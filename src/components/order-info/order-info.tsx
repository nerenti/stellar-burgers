import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import { RootState } from '../../services/store';
import { useParams } from 'react-router-dom';
import { getOrderByNumber } from '../../services/slices/orderSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();
  const ingredients = useSelector(
    (state: RootState) => state.ingredients.ingredients
  );
  const feedOrders = useSelector((state: RootState) => state.feed.orders);
  const orderData = useSelector((state: RootState) => state.order.order);
  const isLoading = useSelector((state: RootState) => state.order.isLoading);

  useEffect(() => {
    if (number) {
      // Сначала ищем заказ в ленте
      const orderFromFeed = feedOrders.find((o) => o.number === Number(number));

      if (orderFromFeed) {
        // Если нашли в ленте, используем его
        // Но в orderSlice нет экшена для установки order из ленты,
        // поэтому используем getOrderByNumber для получения полных данных
        dispatch(getOrderByNumber(Number(number)));
      } else {
        // Если не нашли в ленте, запрашиваем с сервера
        dispatch(getOrderByNumber(Number(number)));
      }
    }
  }, [dispatch, number, feedOrders]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    const ingredientsInfo: { [key: string]: TIngredient & { count: number } } =
      {};

    if (orderData.ingredients && Array.isArray(orderData.ingredients)) {
      orderData.ingredients.forEach((item: string) => {
        if (!ingredientsInfo[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            ingredientsInfo[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          ingredientsInfo[item].count++;
        }
      });
    }

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
