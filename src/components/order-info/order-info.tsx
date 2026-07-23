import { FC, useMemo, useEffect, useState } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector } from '../../services/store';
import { RootState } from '../../services/store';
import { useParams } from 'react-router-dom';
import { getOrderByNumberApi } from '@api';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const ingredients = useSelector(
    (state: RootState) => state.ingredients.ingredients
  );
  const feedOrders = useSelector((state: RootState) => state.feed.orders);
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const order = feedOrders.find((o) => o.number === Number(number));

    if (order) {
      setOrderData(order);
      setIsLoading(false);
    } else if (number) {
      getOrderByNumberApi(Number(number))
        .then((res) => {
          if (res.orders && res.orders.length > 0) {
            setOrderData(res.orders[0]);
          }
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [number, feedOrders]);

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
