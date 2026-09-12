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
  await page.addInitScript(() => {
    localStorage.setItem('tv_lang', 'el');
    localStorage.setItem('tv_menu_view', 'list');
    localStorage.setItem('tv_ui_version', 'catalog-categories-motion-2026-09-12');
  });
  await page.goto('/');
  await expect(page.locator('#splash')).toBeHidden();
  await expect(page.locator('#root .sec').first()).toBeVisible();
}

async function openCategories(page) {
  await page.locator('#viewSwitch [data-view="guide"]').click();
  await expect(page.locator('#brandTransit')).not.toHaveClass(/on/, { timeout: 4000 });
  await expect(page.locator('body')).toHaveClass(/guided-view/);
  await expect(page.locator('.guide-menu-card').first()).toBeVisible();
}

test('classic menu has no overflow and uses the correct responsive layout', async ({ page }) => {
  for (const viewport of viewports) {
    await openMenu(page, viewport);
    const dimensions = await page.evaluate(() => {
      const dock = document.getElementById('catDock');
      const listNav = document.getElementById('listNav');
      const viewSwitch = document.getElementById('viewSwitch');
      return {
        inner: innerWidth,
        scroll: document.documentElement.scrollWidth,
        columns: getComputedStyle(document.querySelector('#root')).gridTemplateColumns,
        sections: document.querySelectorAll('#root .sec').length,
        listTabs: document.querySelectorAll('#listTabs .tab').length,
        dockOpacity: dock ? getComputedStyle(dock).opacity : '0',
        listNavDisplay: listNav ? getComputedStyle(listNav).display : 'none',
        viewSwitchDisplay: viewSwitch ? getComputedStyle(viewSwitch).display : 'none',
        guided: document.body.classList.contains('guided-view'),
        drinksOnly: [...document.querySelectorAll('#listTabs .tab')].map(t => t.textContent.trim()).filter(Boolean),
      };
    });
    expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.inner);
    expect(dimensions.sections).toBeGreaterThanOrEqual(2);
    expect(dimensions.guided).toBeFalsy();
    expect(dimensions.listTabs).toBe(5);
    expect(dimensions.drinksOnly.filter(n => /Ποτά|Αναψυκτικά|Μπύρες|Ρετσίνα|Κρασί|Ούζο/.test(n))).toEqual(['Ποτά']);
    expect(Number(dimensions.dockOpacity)).toBeLessThan(0.2);
    expect(dimensions.listNavDisplay).not.toBe('none');
    expect(dimensions.viewSwitchDisplay).not.toBe('none');
    if (viewport.width < 900) {
      expect(dimensions.columns === 'none' || dimensions.columns.split(' ').length === 1).toBeTruthy();
    }
  }
});

test('mobile controls meet the tap target and search handles empty results', async ({ page }) => {
  await openMenu(page, { width: 320, height: 568 });
  const selectors = [
    '[data-testid="wifi-open"]',
    '[data-testid="language-open"]',
    '#listTabs .tab',
    '#viewSwitch [data-view="guide"]',
  ];
  for (const selector of selectors) {
    const box = await page.locator(selector).first().boundingBox();
    expect(box, selector).toBeTruthy();
    expect(box.width, selector).toBeGreaterThanOrEqual(43);
    expect(box.height, selector).toBeGreaterThanOrEqual(43);
  }

  await page.getByTestId('menu-search').fill('ZZZ-NO-MATCH');
  await expect(page.getByText('Δεν βρέθηκε πιάτο')).toBeVisible();
  const clearBox = await page.getByTestId('search-clear').boundingBox();
  expect(clearBox).toBeTruthy();
  expect(clearBox.width).toBeGreaterThanOrEqual(43.9);
  expect(clearBox.height).toBeGreaterThanOrEqual(43.9);
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
  await expect(sheet).toHaveAttribute('aria-hidden', 'false');
  await page.keyboard.press('Escape');
  await expect(sheet).toHaveAttribute('aria-hidden', 'true');

  await trigger.click();
  await expect(sheet).toHaveAttribute('aria-hidden', 'false');
  await page.locator('#scrim').click({ position: { x: 8, y: 8 }, force: true });
  await expect(sheet).toHaveAttribute('aria-hidden', 'true');
});

test('sheet close X dismisses on the first press', async ({ page }) => {
  await openMenu(page, { width: 320, height: 568 });
  await page.getByTestId('wifi-open').click();
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

test('categories view opens animated cards and can move between dishes', async ({ page }) => {
  await openMenu(page, { width: 390, height: 844 });
  await openCategories(page);
  await expect(page.locator('#viewSwitch [data-view="guide"]')).toHaveClass(/on/);
  const dockOpacity = await page.locator('#catDock').evaluate(el => getComputedStyle(el).opacity);
  expect(Number(dockOpacity)).toBeGreaterThan(0.5);
  await expect(page.locator('#catDock .tab')).toHaveCount(5);
  await page.locator('.guide-menu-card[data-guide-pick]').first().click();
  await expect(page.locator('#brandTransit')).not.toHaveClass(/on/, { timeout: 4000 });
  await expect(page.locator('.guide-hero-dish').first()).toBeVisible();
  await expect(page.locator('.guide-card').first()).toBeVisible();
  await expect(page.getByTestId('guide-back')).toBeVisible();
  await expect(page.getByTestId('guide-next')).toBeVisible();
  const firstTitle = await page.locator('.guide-chapter h2').innerText();
  await page.getByTestId('guide-next').click();
  await expect(page.locator('#brandTransit')).not.toHaveClass(/on/, { timeout: 4000 });
  await expect(page.locator('.guide-chapter h2')).not.toHaveText(firstTitle);
  await page.locator('#catDock .tab').nth(0).click();
  await expect(page.locator('#brandTransit')).not.toHaveClass(/on/, { timeout: 4000 });
  await expect(page.locator('.guide-chapter h2')).toBeVisible();
  await page.getByTestId('guide-back').click();
  await expect(page.locator('#brandTransit')).not.toHaveClass(/on/, { timeout: 4000 });
  await expect(page.locator('.guide-menu-card').first()).toBeVisible();
  await page.locator('#viewSwitch [data-view="list"]').click();
  await expect(page.locator('#brandTransit')).not.toHaveClass(/on/, { timeout: 4000 });
  await expect(page.locator('body')).not.toHaveClass(/guided-view/);
  await expect(page.locator('#root .sec').first()).toBeVisible();
  const listDockOpacity = await page.locator('#catDock').evaluate(el => getComputedStyle(el).opacity);
  expect(Number(listDockOpacity)).toBeLessThan(0.2);
});

test('category icons use Greek PNGs in the catalogue list', async ({ page }) => {
  await openMenu(page, { width: 390, height: 844 });
  const listIcon = page.locator('#listTabs .tab').first().locator('.greek-ic');
  await expect(listIcon).toBeVisible();
  const food = await listIcon.evaluate(el => el.style.getPropertyValue('--food'));
  expect(food).toContain('media/dishes/');
});

test('reduced motion disables animated sheet transitions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openMenu(page);
  await page.getByTestId('wifi-open').click();
  const transition = await page.locator('#wifiSheet').evaluate(el => getComputedStyle(el).transitionDuration);
  expect(['0s', '0.01ms']).toContain(transition);
});
