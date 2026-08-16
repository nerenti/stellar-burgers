// tests/constructor.pl.tsx
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.routeFromHAR('./tests/hars/app.har', {
    url: '**/api/ingredients',
    update: false
  });

  await page.routeFromHAR('./tests/hars/app.har', {
    url: '**/api/auth/user',
    update: false
  });

  await page.routeFromHAR('./tests/hars/app.har', {
    url: '**/api/orders',
    update: false
  });
});

test.describe('Добавление ингредиентов в конструктор', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('text="Краторная булка N-200i"', { timeout: 10000 });
  });

  test('должен добавить булку в конструктор', async ({ page }) => {
    const bunCard = page
      .locator('li')
      .filter({ hasText: 'Краторная булка N-200i' });

    await expect(page.getByTestId('constructor-bun')).toHaveCount(0);
    await expect(page.getByTestId('constructor-bun-bottom')).toHaveCount(0);

    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(
      page.getByTestId('constructor-bun')
    ).toContainText('Краторная булка N-200i');

    await expect(
      page.getByTestId('constructor-bun-bottom')
    ).toContainText('Краторная булка N-200i');
  });

  test('должен добавить начинку в конструктор', async ({ page }) => {
    const bunCard = page
      .locator('li')
      .filter({ hasText: 'Краторная булка N-200i' });
    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    const mainCard = page
      .locator('li')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' });

    await expect(page.getByTestId('constructor-ingredients-list')).not.toContainText('Биокотлета из марсианской Магнолии');

    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByTestId('constructor-ingredients-list')).toContainText('Биокотлета из марсианской Магнолии');
  });

  test('должен добавить соус в конструктор', async ({ page }) => {
    const bunCard = page
      .locator('li')
      .filter({ hasText: 'Краторная булка N-200i' });
    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    const sauceCard = page
      .locator('li')
      .filter({ hasText: 'Соус Spicy-X' });

    await expect(page.getByTestId('constructor-ingredients-list')).not.toContainText('Соус Spicy-X');

    await sauceCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByTestId('constructor-ingredients-list')).toContainText('Соус Spicy-X');
  });

  test('должен добавить несколько ингредиентов в конструктор', async ({ page }) => {
    const bunCard = page
      .locator('li')
      .filter({ hasText: 'Краторная булка N-200i' });
    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    const mainCard = page
      .locator('li')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' });
    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    const sauceCard = page
      .locator('li')
      .filter({ hasText: 'Соус Spicy-X' });
    await sauceCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByTestId('constructor-ingredients-list')).toContainText('Биокотлета из марсианской Магнолии');
    await expect(page.getByTestId('constructor-ingredients-list')).toContainText('Соус Spicy-X');
    await expect(page.getByTestId('constructor-bun')).toContainText('Краторная булка N-200i');
    await expect(page.getByTestId('constructor-bun-bottom')).toContainText('Краторная булка N-200i');
  });
});

test.describe('Модальное окно ингредиента', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('text="Краторная булка N-200i"', { timeout: 10000 });
    
    const ingredientCard = page
      .locator('li')
      .filter({ hasText: 'Краторная булка N-200i' });
    
    await ingredientCard.getByRole('link').click();
  });

  test('должен открыть модальное окно ингредиента', async ({ page }) => {
    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('Краторная булка N-200i');
  });

  test('должен закрыть модальное окно по клику на крестик', async ({ page }) => {
    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    
    await page.getByTestId('modal-close').click();
    await expect(modal).toBeHidden();
  });

  test('должен закрыть модальное окно по клику на оверлей', async ({ page }) => {
    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    
    await page.getByTestId('modal-overlay').click({ position: { x: 10, y: 10 } });
    await expect(modal).toBeHidden();
  });

  test('должен отобразить правильные данные ингредиента в модальном окне', async ({ page }) => {
    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    
    await expect(modal).toContainText('Краторная булка N-200i');
    await expect(modal).toContainText('80');
    await expect(modal).toContainText('24');
    await expect(modal).toContainText('420');
    await expect(modal).toContainText('53');
  });

  test('должен показать данные конкретного ингредиента при клике', async ({ page }) => {
    await page.getByTestId('modal-close').click();
    await expect(page.getByTestId('modal')).toBeHidden();

    const mainCard = page
      .locator('li')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' });
    await mainCard.getByRole('link').click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    
    await expect(modal).toContainText('Биокотлета из марсианской Магнолии');
    await expect(modal).not.toContainText('Краторная булка N-200i');
  });
});

test.describe('Создание заказа', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer test-access-token',
        url: 'http://localhost:4000'
      },
      {
        name: 'refreshToken',
        value: 'test-refresh-token',
        url: 'http://localhost:4000'
      }
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('accessToken', 'Bearer test-access-token');
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    await page.goto('/');
    await page.waitForSelector('text="Краторная булка N-200i"', { timeout: 10000 });
  });

  test('должен создать заказ, показать номер и очистить конструктор', async ({ page }) => {
    const burgerConstructor = page.getByTestId('burger-constructor');

    const bunCard = page
      .locator('li')
      .filter({ hasText: 'Краторная булка N-200i' });
    
    const mainCard = page
      .locator('li')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' });
    
    const sauceCard = page
      .locator('li')
      .filter({ hasText: 'Соус Spicy-X' });

    const orderButton = page.getByTestId('order-button');

    await bunCard.getByRole('button', { name: 'Добавить' }).click();
    await mainCard.getByRole('button', { name: 'Добавить' }).click();
    await sauceCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(
      burgerConstructor.getByText('Краторная булка N-200i (верх)')
    ).toBeVisible();

    await expect(
      burgerConstructor.getByText('Краторная булка N-200i (низ)')
    ).toBeVisible();

    await expect(
      burgerConstructor.getByText('Биокотлета из марсианской Магнолии')
    ).toBeVisible();

    await expect(orderButton).toBeEnabled({ timeout: 5000 });
    await orderButton.click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible({ timeout: 10000 });
    
    const orderNumber = page.getByTestId('order-number');
    await expect(orderNumber).toBeVisible();
    
    const orderNumberText = await orderNumber.textContent();
    const orderNumberValue = parseInt(orderNumberText || '0', 10);
    expect(orderNumberValue).toBeGreaterThan(0);

    await expect(burgerConstructor.getByText('Выберите булки')).toHaveCount(2);
    await expect(burgerConstructor.getByText('Выберите начинку')).toBeVisible();

    await modal.getByTestId('modal-close').click();
    await expect(modal).toBeHidden();

    await expect(
      burgerConstructor.getByText('Краторная булка N-200i (верх)')
    ).toHaveCount(0);
    
    await expect(
      burgerConstructor.getByText('Биокотлета из марсианской Магнолии')
    ).toHaveCount(0);
  });

  test('должен показать ошибку при попытке создать заказ без булки', async ({ page }) => {
    const orderButton = page.getByTestId('order-button');
    
    const mainCard = page
      .locator('li')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' });
    
    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(orderButton).toBeDisabled();
  });
});

test.describe('Вспомогательные проверки', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('text="Краторная булка N-200i"', { timeout: 10000 });
  });

  test('должен отображать список всех ингредиентов', async ({ page }) => {
    await expect(page.locator('li').filter({ hasText: 'Краторная булка N-200i' })).toBeVisible();
    await expect(page.locator('li').filter({ hasText: 'Биокотлета из марсианской Магнолии' })).toBeVisible();
    await expect(page.locator('li').filter({ hasText: 'Соус Spicy-X' })).toBeVisible();
  });

  test('должен отображать цену конструктора', async ({ page }) => {
    await expect(page.getByTestId('total-price')).toContainText('0');

    const bunCard = page
      .locator('li')
      .filter({ hasText: 'Краторная булка N-200i' });
    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    const mainCard = page
      .locator('li')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' });
    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    const priceText = await page.getByTestId('total-price').textContent();
    const price = parseInt(priceText?.replace(/\s/g, '') || '0');
    expect(price).toBeGreaterThan(0);
  });

  test('должен показывать кнопку "Оформить заказ" только при наличии булки', async ({ page }) => {
    const orderButton = page.getByTestId('order-button');
    
    await expect(orderButton).toBeDisabled();

    const mainCard = page
      .locator('li')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' });
    await mainCard.getByRole('button', { name: 'Добавить' }).click();
    
    await expect(orderButton).toBeDisabled();

    const bunCard = page
      .locator('li')
      .filter({ hasText: 'Краторная булка N-200i' });
    await bunCard.getByRole('button', { name: 'Добавить' }).click();
    
    await expect(orderButton).toBeEnabled();
  });
});