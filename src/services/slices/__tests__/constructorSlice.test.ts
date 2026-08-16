import constructorReducer, {
  initialState,
  setBun,
  addIngredient,
  removeIngredient,
  clearConstructor,
  moveIngredientUp,
  moveIngredientDown,
  TConstructorState
} from '../constructorSlice';
import { TConstructorIngredient, TIngredient } from '../../../utils/types';

describe('Редьюсер constructorSlice', () => {
  // Общие тестовые данные для всех тестов
  const mockBun: TIngredient = {
    _id: 'bun1',
    name: 'Краторная булка',
    type: 'bun',
    proteins: 80,
    fat: 60,
    carbohydrates: 400,
    calories: 420,
    price: 1250,
    image: 'bun.jpg',
    image_large: 'bun_large.jpg',
    image_mobile: 'bun_mobile.jpg'
  };

  const mockIngredient1: TConstructorIngredient = {
    _id: '1',
    name: 'Соус',
    type: 'sauce',
    proteins: 5,
    fat: 10,
    carbohydrates: 15,
    calories: 100,
    price: 50,
    image: 'sauce.jpg',
    image_large: 'sauce_large.jpg',
    image_mobile: 'sauce_mobile.jpg',
    id: 'unique1'
  };

  const mockIngredient2: TConstructorIngredient = {
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
    image_mobile: 'meat_mobile.jpg',
    id: 'unique2'
  };

  const mockIngredient3: TConstructorIngredient = {
    _id: '3',
    name: 'Сыр',
    type: 'main',
    proteins: 20,
    fat: 25,
    carbohydrates: 10,
    calories: 250,
    price: 80,
    image: 'cheese.jpg',
    image_large: 'cheese_large.jpg',
    image_mobile: 'cheese_mobile.jpg',
    id: 'unique3'
  };

  // Блок 1: Тесты с неизвестными экшенами
  describe('Обработка неизвестных экшенов', () => {
    test('должен вернуть начальное состояние при неизвестном экшене и undefined', () => {
      const unknownAction = { type: 'UNKNOWN_ACTION' };
      const result = constructorReducer(undefined, unknownAction);
      expect(result).toEqual(initialState);
    });

    test('должен вернуть текущее состояние при неизвестном экшене', () => {
      const currentState: TConstructorState = {
        bun: mockBun,
        ingredients: [mockIngredient1, mockIngredient2]
      };
      const unknownAction = { type: 'UNKNOWN_ACTION' };
      const result = constructorReducer(currentState, unknownAction);
      expect(result).toEqual(currentState);
    });
  });

  // Блок 2: Тесты для установки булки
  describe('Экшен setBun', () => {
    test('должен добавить булку в конструктор', () => {
      const action = setBun(mockBun);
      const result = constructorReducer(initialState, action);
      expect(result).toEqual({
        ...initialState,
        bun: mockBun
      });
    });

    test('должен заменить существующую булку на новую', () => {
      const currentState: TConstructorState = {
        bun: mockBun,
        ingredients: [mockIngredient1]
      };
      const newBun: TIngredient = {
        ...mockBun,
        _id: 'bun2',
        name: 'Новая булка'
      };
      const action = setBun(newBun);
      const result = constructorReducer(currentState, action);
      expect(result.bun).toEqual(newBun);
      expect(result.ingredients).toEqual([mockIngredient1]);
    });
  });

  // Блок 3: Тесты для добавления ингредиентов
  describe('Экшен addIngredient', () => {
    test('должен добавить ингредиент в конструктор', () => {
      const action = addIngredient(mockIngredient1);
      const result = constructorReducer(initialState, action);
      expect(result).toEqual({
        ...initialState,
        ingredients: [mockIngredient1]
      });
    });

    test('должен добавить несколько ингредиентов последовательно', () => {
      let state = constructorReducer(
        initialState,
        addIngredient(mockIngredient1)
      );
      state = constructorReducer(state, addIngredient(mockIngredient2));
      expect(state.ingredients).toEqual([mockIngredient1, mockIngredient2]);
    });
  });

  // Блок 4: Тесты для удаления ингредиентов
  describe('Экшен removeIngredient', () => {
    test('должен удалить ингредиент из конструктора по id', () => {
      const currentState: TConstructorState = {
        bun: mockBun,
        ingredients: [mockIngredient1, mockIngredient2, mockIngredient3]
      };
      const action = removeIngredient(mockIngredient2.id);
      const result = constructorReducer(currentState, action);
      expect(result.ingredients).toEqual([mockIngredient1, mockIngredient3]);
      expect(result.bun).toEqual(mockBun);
    });

    test('не должен изменять состояние при удалении несуществующего ингредиента', () => {
      const currentState: TConstructorState = {
        bun: mockBun,
        ingredients: [mockIngredient1, mockIngredient2]
      };
      const action = removeIngredient('non-existent-id');
      const result = constructorReducer(currentState, action);
      expect(result.ingredients).toEqual([mockIngredient1, mockIngredient2]);
    });
  });

  // Блок 5: Тесты для перемещения ингредиентов
  describe('Экшен moveIngredientUp', () => {
    test('должен переместить ингредиент на одну позицию вверх', () => {
      const currentState: TConstructorState = {
        bun: mockBun,
        ingredients: [mockIngredient1, mockIngredient2, mockIngredient3]
      };
      const action = moveIngredientUp(mockIngredient2.id);
      const result = constructorReducer(currentState, action);
      expect(result.ingredients).toEqual([
        mockIngredient2,
        mockIngredient1,
        mockIngredient3
      ]);
    });

    test('не должен перемещать первый элемент вверх', () => {
      const currentState: TConstructorState = {
        bun: mockBun,
        ingredients: [mockIngredient1, mockIngredient2, mockIngredient3]
      };
      const action = moveIngredientUp(mockIngredient1.id);
      const result = constructorReducer(currentState, action);
      expect(result.ingredients).toEqual([
        mockIngredient1,
        mockIngredient2,
        mockIngredient3
      ]);
    });
  });

  describe('Экшен moveIngredientDown', () => {
    test('должен переместить ингредиент на одну позицию вниз', () => {
      const currentState: TConstructorState = {
        bun: mockBun,
        ingredients: [mockIngredient1, mockIngredient2, mockIngredient3]
      };
      const action = moveIngredientDown(mockIngredient2.id);
      const result = constructorReducer(currentState, action);
      expect(result.ingredients).toEqual([
        mockIngredient1,
        mockIngredient3,
        mockIngredient2
      ]);
    });

    test('не должен перемещать последний элемент вниз', () => {
      const currentState: TConstructorState = {
        bun: mockBun,
        ingredients: [mockIngredient1, mockIngredient2, mockIngredient3]
      };
      const action = moveIngredientDown(mockIngredient3.id);
      const result = constructorReducer(currentState, action);
      expect(result.ingredients).toEqual([
        mockIngredient1,
        mockIngredient2,
        mockIngredient3
      ]);
    });
  });

  // Блок 6: Тесты для очистки конструктора
  describe('Экшен clearConstructor', () => {
    test('должен полностью очистить конструктор', () => {
      const currentState: TConstructorState = {
        bun: mockBun,
        ingredients: [mockIngredient1, mockIngredient2, mockIngredient3]
      };
      const action = clearConstructor();
      const result = constructorReducer(currentState, action);
      expect(result).toEqual(initialState);
    });

    test('не должен изменять состояние при очистке пустого конструктора', () => {
      const action = clearConstructor();
      const result = constructorReducer(initialState, action);
      expect(result).toEqual(initialState);
    });
  });

  // Блок 7: Комплексный тест
  describe('Полная последовательность действий', () => {
    test('должен корректно обработать полную последовательность: добавление булки → добавление ингредиентов → перемещение → удаление → очистка', () => {
      let state = constructorReducer(initialState, setBun(mockBun));
      expect(state.bun).toEqual(mockBun);

      state = constructorReducer(state, addIngredient(mockIngredient1));
      state = constructorReducer(state, addIngredient(mockIngredient2));
      state = constructorReducer(state, addIngredient(mockIngredient3));
      expect(state.ingredients).toEqual([
        mockIngredient1,
        mockIngredient2,
        mockIngredient3
      ]);

      state = constructorReducer(state, moveIngredientUp(mockIngredient2.id));
      expect(state.ingredients).toEqual([
        mockIngredient2,
        mockIngredient1,
        mockIngredient3
      ]);

      state = constructorReducer(state, moveIngredientDown(mockIngredient2.id));
      expect(state.ingredients).toEqual([
        mockIngredient1,
        mockIngredient2,
        mockIngredient3
      ]);

      state = constructorReducer(state, removeIngredient(mockIngredient1.id));
      expect(state.ingredients).toEqual([mockIngredient2, mockIngredient3]);

      state = constructorReducer(state, clearConstructor());
      expect(state).toEqual(initialState);
    });
  });
});
