import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { RootState } from '../../services/store';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const ingredients = useSelector(
    (state: RootState) => state.ingredients.ingredients
  );
  const isLoading = useSelector(
    (state: RootState) => state.ingredients.isLoading
  );

  // Используем useMemo для получения ингредиента из Redux
  const ingredientData = useMemo(() => {
    if (!id || !ingredients.length) return null;
    return ingredients.find((item) => item._id === id) || null;
  }, [id, ingredients]);

  if (isLoading || !ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
