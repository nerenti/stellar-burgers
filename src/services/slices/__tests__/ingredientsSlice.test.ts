import ingredientsReducer, {
  initialState,
  fetchIngredients,
  TIngredientState
} from '../ingredientsSlice';
import { TIngredient } from '../../../utils/types';

// Мокаем API
jest.mock('../../../utils/burger-api', () => ({
  getIngredientsApi: jest.fn()
}));

import { getIngredientsApi } from '../../../utils/burger-api';

describe('Редьюсер ingredientsSlice', () => {
  // Общие тестовые данные
  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Булка',
      type: 'bun',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 150,
      price: 50,
      image: 'bun.jpg',
      image_large: 'bun_large.jpg',
      image_mobile: 'bun_mobile.jpg'
    },
    {
      _id: '2',
      name: 'Мясо',
      type: 'main',
      proteins: 30,
      fat: 15,
      carbohydrates: 5,
      calories: 300,
      price: 100,
      image: 'meat.jpg',
      image_large: 'meat_large.jpg',
      image_mobile: 'meat_mobile.jpg'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Блок 1: Тесты с неизвестными экшенами
  describe('Обработка неизвестных экшенов', () => {
    test('должен вернуть начальное состояние при неизвестном экшене и undefined', () => {
      const unknownAction = { type: 'UNKNOWN_ACTION' };
      const result = ingredientsReducer(undefined, unknownAction);
      expect(result).toEqual(initialState);
    });

    test('должен вернуть текущее состояние при неизвестном экшене', () => {
      const currentState: TIngredientState = {
        ingredients: mockIngredients,
        isLoading: false,
        error: null
      };
      const unknownAction = { type: 'UNKNOWN_ACTION' };
      const result = ingredientsReducer(currentState, unknownAction);
      expect(result).toEqual(currentState);
    });
  });

  // Блок 2: Тесты для асинхронных экшенов
  describe('Асинхронный экшен fetchIngredients', () => {
    // Блок 2.1: Тесты для состояния pending
    describe('fetchIngredients.pending', () => {
      test('должен установить состояние загрузки', () => {
        const action = { type: fetchIngredients.pending.type };
        const result = ingredientsReducer(initialState, action);
        expect(result).toEqual({
          ...initialState,
          isLoading: true,
          error: null
        });
      });
    });

    // Блок 2.2: Тесты для состояния fulfilled
    describe('fetchIngredients.fulfilled', () => {
      test('должен загрузить ингредиенты и снять состояние загрузки', () => {
        const action = {
          type: fetchIngredients.fulfilled.type,
          payload: mockIngredients
        };
        const result = ingredientsReducer(
          { ...initialState, isLoading: true },
          action
        );
        expect(result).toEqual({
          ingredients: mockIngredients,
          isLoading: false,
          error: null
        });
      });
    });

    // Блок 2.3: Тесты для состояния rejected
    describe('fetchIngredients.rejected', () => {
      test('должен обработать ошибку с сообщением', () => {
        const errorMessage = 'Ошибка сети';
        const action = {
          type: fetchIngredients.rejected.type,
          error: { message: errorMessage }
        };
        const result = ingredientsReducer(
          { ...initialState, isLoading: true },
          action
        );
        expect(result).toEqual({
          ...initialState,
          isLoading: false,
          error: errorMessage
        });
      });

      test('должен использовать сообщение об ошибке по умолчанию, если оно не передано', () => {
        const action = {
          type: fetchIngredients.rejected.type,
          error: {}
        };
        const result = ingredientsReducer(
          { ...initialState, isLoading: true },
          action
        );
        expect(result).toEqual({
          ...initialState,
          isLoading: false,
          error: 'Ошибка при загрузке ингредиентов'
        });
      });
    });

    // Блок 2.4: Комплексные тесты для асинхронного запроса
    describe('Полный цикл загрузки', () => {
      test('должен корректно обработать последовательность pending → fulfilled', () => {
        let state = ingredientsReducer(initialState, {
          type: fetchIngredients.pending.type
        });
        expect(state.isLoading).toBe(true);
        expect(state.error).toBe(null);

        state = ingredientsReducer(state, {
          type: fetchIngredients.fulfilled.type,
          payload: mockIngredients
        });
        expect(state.isLoading).toBe(false);
        expect(state.ingredients).toEqual(mockIngredients);
        expect(state.error).toBe(null);
      });

      test('должен корректно обработать последовательность pending → rejected', () => {
        let state = ingredientsReducer(initialState, {
          type: fetchIngredients.pending.type
        });
        expect(state.isLoading).toBe(true);
        expect(state.error).toBe(null);

        const errorMessage = 'Ошибка загрузки';
        state = ingredientsReducer(state, {
          type: fetchIngredients.rejected.type,
          error: { message: errorMessage }
        });
        expect(state.isLoading).toBe(false);
        expect(state.ingredients).toEqual([]);
        expect(state.error).toBe(errorMessage);
      });
    });

    // Блок 2.5: Интеграционный тест с реальным вызовом thunk
    describe('Интеграционный тест thunk', () => {
      test('должен корректно выполнить асинхронный запрос fetchIngredients', async () => {
        const mockGetIngredientsApi = getIngredientsApi as jest.Mock;
        mockGetIngredientsApi.mockResolvedValue(mockIngredients);

        const dispatch = jest.fn();
        const thunk = fetchIngredients();
        await thunk(dispatch, () => ({}), undefined);

        expect(mockGetIngredientsApi).toHaveBeenCalled();
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({ type: fetchIngredients.pending.type })
        );
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: fetchIngredients.fulfilled.type,
            payload: mockIngredients
          })
        );
      });

      test('должен обработать ошибку при выполнении асинхронного запроса', async () => {
        const error = new Error('Network error');
        const mockGetIngredientsApi = getIngredientsApi as jest.Mock;
        mockGetIngredientsApi.mockRejectedValue(error);

        const dispatch = jest.fn();
        const thunk = fetchIngredients();
        await thunk(dispatch, () => ({}), undefined);

        expect(mockGetIngredientsApi).toHaveBeenCalled();
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({ type: fetchIngredients.pending.type })
        );
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: fetchIngredients.rejected.type
          })
        );
      });
    });
  });
});
