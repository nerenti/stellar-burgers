import { RootState } from './store';

export const selectBuns = (state: RootState) =>
  state.ingredients.ingredients.filter((item) => item.type === 'bun');

export const selectMains = (state: RootState) =>
  state.ingredients.ingredients.filter((item) => item.type === 'main');

export const selectSauces = (state: RootState) =>
  state.ingredients.ingredients.filter((item) => item.type === 'sauce');
