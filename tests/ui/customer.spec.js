const { test, expect } = require('@playwright/test');

const viewports = [
  { width: 320, height: 568 },
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
];

async function openMenu(page, viewport = viewports[2]) {
  await page.setViewportSize(viewport);
  await page.addInitScript(() => localStorage.setItem('tv_lang', 'el'));
  await page.goto('/');
  await expect(page.locator('#splash')).toBeHidden();
  await expect(page.locator('#root .sec').first()).toBeVisible();
}

test('classic menu has no overflow and uses the correct responsive layout', async ({ page }) => {
  for (const viewport of viewports) {
    await openMenu(page, viewport);
    const dimensions = await page.evaluate(() => {
      const dock = document.getElementById('catDock');
      const dockBox = dock && getComputedStyle(dock).display !== 'none' ? dock.getBoundingClientRect() : null;
      return {
        inner: innerWidth,
        scroll: document.documentElement.scrollWidth,
        columns: getComputedStyle(document.querySelector('#root')).gridTemplateColumns,
        sections: document.querySelectorAll('#root .sec').length,
        dockTabs: document.querySelectorAll('#catDock .tab').length,
        dockTop: dockBox ? dockBox.top : null,
        dockBottom: dockBox ? dockBox.bottom : null,
        dockOpacity: dock ? getComputedStyle(dock).opacity : '0',
      };
    });
    expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.inner);
    expect(dimensions.sections).toBeGreaterThanOrEqual(1);
    expect(dimensions.dockTabs).toBeGreaterThanOrEqual(2);
    expect(Number(dimensions.dockOpacity)).toBeGreaterThan(0.9);
    expect(dimensions.dockTop).toBeLessThan(viewport.height);
    expect(dimensions.dockBottom).toBeGreaterThan(viewport.height - 8);
    expect(dimensions.columns === 'none' || dimensions.columns.split(' ').length === 1).toBeTruthy();
  }
});

test('mobile controls meet the tap target and search handles empty results', async ({ page }) => {
  await openMenu(page, { width: 320, height: 568 });
  const selectors = [
    '[data-testid="social-open"]',
    '[data-testid="wifi-open"]',
    '[data-testid="language-open"]',
    '[data-testid="search-clear"]',
    '#catDock .tab',
  ];
  for (const selector of selectors) {
    const box = await page.locator(selector).first().boundingBox();
    expect(box.width, selector).toBeGreaterThanOrEqual(43.9);
    expect(box.height, selector).toBeGreaterThanOrEqual(43.9);
  }

  await page.getByTestId('menu-search').fill('ZZZ-NO-MATCH');
  await expect(page.getByText('Δεν βρέθηκε πιάτο')).toBeVisible();
  await page.getByTestId('search-clear').click();
  await expect(page.locator('#root .sec').first()).toBeVisible();
});

test('Wi-Fi sheet closes by button, Escape, and backdrop while restoring focus', async ({ page }) => {
  await openMenu(page, { width: 320, height: 568 });
  const trigger = page.getByTestId('wifi-open');
  await trigger.click();
  const sheet = page.locator('#wifiSheet');
  await expect(sheet).toHaveAttribute('aria-hidden', 'false');
  await expect(sheet.getByText('TSIGOURA 5G')).toBeVisible();
  expect(await sheet.evaluate(el => el.scrollWidth <= el.clientWidth)).toBeTruthy();
  await sheet.getByTestId('sheet-close').click();
  await expect(sheet).toHaveAttribute('aria-hidden', 'true');
  await expect(trigger).toBeFocused();

  await trigger.click();
  await page.keyboard.press('Escape');
  await expect(sheet).toHaveAttribute('aria-hidden', 'true');
  await expect(trigger).toBeFocused();

  await trigger.click();
  await page.locator('#scrim').click({ position: { x: 4, y: 4 } });
  await expect(sheet).toHaveAttribute('aria-hidden', 'true');
});

test('sheet close X dismisses on the first press', async ({ page }) => {
  await openMenu(page, { width: 390, height: 844 });
  const trigger = page.getByTestId('wifi-open');
  await trigger.click();
  const sheet = page.locator('#wifiSheet');
  await expect(sheet).toHaveAttribute('aria-hidden', 'false');
  await sheet.getByTestId('sheet-close').dispatchEvent('pointerdown');
  await expect(sheet).toHaveAttribute('aria-hidden', 'true');
});

test('customer UI never exposes operational status messages', async ({ page }) => {
  await openMenu(page);
  const text = await page.locator('body').innerText();
  expect(text).not.toContain('Το μενού ενημερώθηκε ζωντανά');
  expect(text).not.toContain('ADMIN_PIN');
  expect(text).not.toContain('Vercel');
  expect(text).not.toContain('KV_REST');
});

test('guided dock switches categories and opens a printed dish row', async ({ page }) => {
  await openMenu(page, { width: 390, height: 844 });
  await expect(page.locator('.g-row').first()).toBeVisible();
  await expect(page.locator('.guide-card')).toHaveCount(0);
  await expect(page.locator('.guide-hero-dish')).toHaveCount(0);
  const firstTitle = await page.locator('.guide-kicker h2').innerText();
  const tabs = page.locator('#catDock .tab');
  expect(await tabs.count()).toBeGreaterThanOrEqual(2);
  await tabs.nth(1).click();
  await expect(page.locator('.guide-kicker h2')).not.toHaveText(firstTitle);
  await expect(page.locator('.g-row').first()).toBeVisible();
  await page.locator('.g-copy').first().click();
  await expect(page.locator('#dishSheet')).toHaveAttribute('aria-hidden', 'false');
  await page.locator('#dishSheet [data-x]').click();
  await expect(page.locator('#dishSheet')).toHaveAttribute('aria-hidden', 'true');
});

test('reduced motion disables animated sheet transitions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openMenu(page);
  await page.getByTestId('wifi-open').click();
  const transition = await page.locator('#wifiSheet').evaluate(el => getComputedStyle(el).transitionDuration);
  expect(['0s', '0.01ms']).toContain(transition);
});
