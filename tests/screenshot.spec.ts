import { test, expect } from '@playwright/test';

test.describe('UIFORGE Screenshot Tests', () => {
  test('take screenshots of main page and demo preview', async ({ page }) => {
    // Navigate to main page
    await page.goto('http://localhost:3000');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Screenshot 1: Main page
    await page.screenshot({
      path: 'screenshots/01-main-page.png',
      fullPage: true
    });
    console.log('Screenshot 1: Main page captured');

    // Click "デモを見る" button to show demo UIs
    const demoButton = page.locator('button:has-text("デモを見る")');
    await demoButton.click();

    // Wait for demo cards to appear
    await page.waitForTimeout(500);

    // Screenshot 2: Page with demo cards
    await page.screenshot({
      path: 'screenshots/02-demo-cards.png',
      fullPage: true
    });
    console.log('Screenshot 2: Demo cards captured');

    // Find and click "Preview" button on first card
    const previewButton = page.locator('.card-button').first();
    await previewButton.click();

    // Wait for modal to appear
    await page.waitForSelector('.modal-container');
    await page.waitForTimeout(500);

    // Screenshot 3: Preview modal
    await page.screenshot({
      path: 'screenshots/03-preview-modal.png',
    });
    console.log('Screenshot 3: Preview modal captured');

    // Check if iframe has content
    const iframe = page.locator('.preview-frame');
    await expect(iframe).toBeVisible();

    // Screenshot 4: Focus on iframe area
    const modalContent = page.locator('.modal-content');
    await modalContent.screenshot({
      path: 'screenshots/04-iframe-content.png'
    });
    console.log('Screenshot 4: Iframe content captured');

    // Click "Code" button to view code
    const codeButton = page.locator('.mode-button:has-text("Code")');
    await codeButton.click();
    await page.waitForTimeout(300);

    // Screenshot 5: Code view
    await page.screenshot({
      path: 'screenshots/05-code-view.png',
    });
    console.log('Screenshot 5: Code view captured');

    // Close modal
    const closeButton = page.locator('.close-button');
    await closeButton.click();
    await page.waitForTimeout(300);

    console.log('All screenshots captured successfully!');
  });
});
