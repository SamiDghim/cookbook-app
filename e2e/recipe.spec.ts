import { test, expect } from '@playwright/test';

test('can create and list a recipe', async ({ page }) => {
  await page.goto('/');
  // Add new recipe
  await page.getByRole('button', { name: /add new recipe/i }).click();
  await page.getByLabel('Recipe Title *').fill('Brownies');
  await page.getByLabel('Description *').fill('Chocolate!');
  // Ingredients: fill first ingredient
  await page.getByPlaceholder('Ingredient 1...').fill('Chocolate');
  // Steps: fill first step
  await page.getByPlaceholder('Step 1 instructions...').fill('Mix');
  await page.getByRole('button', { name: /save recipe/i }).click();
  await expect(page.getByText('Brownies')).toBeVisible();
});
