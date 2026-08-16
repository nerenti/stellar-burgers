import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch } from '../../services/store';
import { addIngredient, setBun } from '../../services/slices/constructorSlice';
import { v4 as uuidv4 } from 'uuid';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const handleAdd = () => {
      if (!ingredient) return;

      if (ingredient.type === 'bun') {
        dispatch(setBun(ingredient));
      } else {
        const newIngredient = {
          ...ingredient,
          id: uuidv4()
        };
        dispatch(addIngredient(newIngredient));
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count || 0}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
