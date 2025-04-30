import { test, expect } from '@playwright/test';

test('display 712 questions', async ({ page }) => {
  await page.goto('https://rubrr.s3-main.oktopod.app/');
  await page
    .getByRole('link', { name: '✨ Plus de 712 questions' })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Toutes les questions' })
  ).toBeVisible();
});

test('tag selected is displayed above ', async ({ page }) => {
  await page.goto('https://rubrr.s3-main.oktopod.app/');
  await page.getByRole('link', { name: 'Micro Services' }).click();
  //await page.locator('span').filter({ hasText: 'Micro Services' })
  await expect(
    page.locator('span').filter({ hasText: 'Micro Services' })
  ).toBeVisible();
});

test('go to search mongodb question', async ({ page }) => {
  await page.goto('https://rubrr.s3-main.oktopod.app/');
  await page
    .getByRole('link', { name: '✨ Plus de 712 questions' })
    .click();
  await page.getByRole('textbox').click();
  await page.getByRole('textbox').fill('mongodb');
  await page.getByRole('button', { name: 'Rechercher' }).click();
  await page
    .getByRole('row', { name: 'Qu’est ce que mongodb ? NoSql' })
    .getByRole('cell')
    .nth(1)
    .click();
  await expect(
    page.getByRole('heading', { name: 'Qu’est ce que mongodb ?' })
  ).toBeVisible();
});

test('should display an error message when response is too small', async ({
  page,
}) => {
  await page.goto('https://rubrr.s3-main.oktopod.app/');
  await page.getByRole('textbox').click();
  await page.getByRole('textbox').fill('d');
  await page.getByRole('button', { name: 'Répondre' }).click();
  await expect(
    page
      .getByRole('paragraph')
      .filter({ hasText: 'Une réponse est nécessaire' })
  ).toBeVisible();
});
