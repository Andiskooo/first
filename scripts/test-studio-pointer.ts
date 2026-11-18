/**
 * Pointer-drag placement. Native HTML5 drag-and-drop never fires for a real
 * mouse gesture on a <button> in Firefox, and it is skipped entirely for touch.
 * These cases drive the library with Playwright's mouse and with Chrome's
 * touch and pen input, in small steps, against `next start` (production).
 */
import { spawn, type ChildProcess } from 'node:child_process';
import { chromium, firefox, type Browser, type Page } from 'playwright-core';

const PORT = 3461;
const URL = `http://127.0.0.1:${PORT}/studio`;

async function waitForServer(child: ChildProcess): Promise<void> {
  const started = Date.now();
  let log = '';
  child.stdout?.on('data', (chunk) => { log += chunk.toString(); });
  child.stderr?.on('data', (chunk) => { log += chunk.toString(); });
  while (Date.now() - started < 30000) {
    try {
      const response = await fetch(URL);
      if (response.ok) return;
    } catch {
      // not up yet
    }
    if (child.exitCode != null) throw new Error(`next start exited ${child.exitCode}\n${log}`);
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(`studio did not start\n${log}`);
}

async function cardCenter(page: Page, id: string): Promise<{ x: number; y: number }> {
  const handle = page.locator(`[data-part-card="${id}"]`);
  await handle.scrollIntoViewIfNeeded();
  const box = await handle.boundingBox();
  if (!box) throw new Error(`no card ${id}`);
  return { x: box.x + box.width / 2, y: box.y + Math.min(box.height - 8, 24) };
}

async function canvasPoint(page: Page, fx: number, fy: number): Promise<{ x: number; y: number }> {
  const box = await page.locator('[data-studio-canvas]').boundingBox();
  if (!box) throw new Error('no canvas');
  return { x: box.x + box.width * fx, y: box.y + box.height * fy };
}

async function mouseDrag(page: Page, from: { x: number; y: number }, to: { x: number; y: number }) {
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  const steps = 14;
  for (let i = 1; i <= steps; i += 1) {
    await page.mouse.move(from.x + ((to.x - from.x) * i) / steps, from.y + ((to.y - from.y) * i) / steps);
  }
  await page.mouse.up();
}

async function cdpDrag(
  page: Page,
  from: { x: number; y: number },
  to: { x: number; y: number },
  kind: 'touch' | 'pen',
) {
  const client = await page.context().newCDPSession(page);
  const steps = 14;
  if (kind === 'touch') {
    const point = (x: number, y: number) => [{ x, y, id: 1, radiusX: 1, radiusY: 1, force: 1 }];
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: point(from.x, from.y) });
    for (let i = 1; i <= steps; i += 1) {
      await client.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: point(from.x + ((to.x - from.x) * i) / steps, from.y + ((to.y - from.y) * i) / steps),
      });
    }
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    return;
  }
  const common = { button: 'left' as const, pointerType: 'pen' as const };
  await client.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: from.x, y: from.y, pointerType: 'pen' });
  await client.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: from.x, y: from.y, clickCount: 1, ...common });
  for (let i = 1; i <= steps; i += 1) {
    await client.send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: from.x + ((to.x - from.x) * i) / steps,
      y: from.y + ((to.y - from.y) * i) / steps,
      ...common,
    });
  }
  await client.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: to.x, y: to.y, clickCount: 1, ...common });
}

async function prepare(page: Page) {
  await page.addInitScript(() => localStorage.setItem('ecotek_locale', 'en'));
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.locator('[data-part-card="heat-pump"]').waitFor();
}

async function nodeCount(page: Page): Promise<number> {
  return page.locator('.react-flow__node').count();
}

async function openExample(page: Page, name: string) {
  await page.getByRole('button', { name: 'Examples', exact: true }).click();
  await page.getByRole('menuitem', { name }).click();
}

async function runPanel(browser: Browser) {
  const sizes = [
    { width: 3840, height: 2160, scale: 1, phone: false, shot: false },
    { width: 3840, height: 2160, scale: 2, phone: false, shot: false },
    { width: 1920, height: 1080, scale: 1, phone: false, shot: true },
    { width: 1920, height: 1080, scale: 2, phone: false, shot: false },
    { width: 390, height: 844, scale: 2, phone: true, shot: false },
  ] as const;
  for (const size of sizes) {
    const page = await browser.newPage({
      viewport: { width: size.width, height: size.height },
      deviceScaleFactor: size.scale,
      hasTouch: true,
    });
    await page.addInitScript(() => localStorage.setItem('ecotek_locale', 'en'));
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const layout = await page.evaluate(() => {
      const library = document.querySelector('.studio-library');
      const style = library ? getComputedStyle(library) : null;
      return {
        width: window.innerWidth,
        present: document.querySelector('.studio-root')?.getAttribute('data-present'),
        display: style?.display,
        libraryWidth: library?.getBoundingClientRect().width,
        libraryHeight: library?.getBoundingClientRect().height,
      };
    });
    console.log('layout', size.width, size.scale, layout);
    const flag = await page.locator('.studio-root').getAttribute('data-present');
    if (flag !== 'false') throw new Error(`${size.width}x${size.height} auto-enabled large display (${flag})`);
    const canvas = await page.locator('[data-studio-canvas]').boundingBox();
    const minWidth = size.phone ? size.width * 0.8 : size.width * 0.72;
    const minHeight = size.height * (size.phone ? 0.4 : 0.55);
    if (!canvas || canvas.width < minWidth || canvas.height < minHeight) {
      throw new Error(`${size.width} canvas ${canvas?.width}x${canvas?.height}`);
    }
    if (await page.locator('.studio-inspector').count() !== 0) {
      throw new Error(`${size.width} inspector is open before a selection`);
    }
    const run = await page.getByRole('button', { name: 'Run', exact: true }).boundingBox();
    if (!run || run.height < 28 || run.height > 46) throw new Error(`${size.width} run button height ${run?.height}`);
    if (!size.phone) {
      await page.locator('[data-part-card="heat-pump"]').waitFor({ state: 'visible', timeout: 8000 });
      if (!layout.libraryWidth || layout.libraryWidth > 220) {
        throw new Error(`${size.width} library width ${layout.libraryWidth}`);
      }
      await page.getByRole('button', { name: 'Hide library' }).click();
      const wide = await page.locator('[data-studio-canvas]').boundingBox();
      if (!wide || wide.width < size.width * 0.9) throw new Error(`${size.width} collapsed canvas ${wide?.width}`);
      await page.getByRole('button', { name: 'Show library' }).click();
      await page.getByRole('button', { name: 'Large display' }).click();
      const enlarged = await page.locator('.studio-root').getAttribute('data-present');
      const runLarge = await page.getByRole('button', { name: 'Run', exact: true }).boundingBox();
      if (enlarged !== 'true' || !runLarge || runLarge.height > 46) {
        throw new Error(`${size.width} large display inflated the toolbar (${runLarge?.height})`);
      }
      await page.getByRole('button', { name: 'Large display' }).click();
    }
    if (size.shot) {
      await openExample(page, 'Direct example');
      await page.waitForTimeout(500);
      await page.getByRole('button', { name: 'Run', exact: true }).click();
      await page.waitForTimeout(700);
      if (await page.locator('.studio-inspector').count() !== 0) throw new Error('inspector opened on Run');
      if (await page.locator('.studio-sim').count() !== 1) throw new Error('simulation readout is missing');
      await page.screenshot({ path: '/opt/cursor/artifacts/studio-run-1920.png' });
      const pump = page.locator('.react-flow__node').filter({ hasText: 'WP' }).first();
      const box = await pump.boundingBox();
      if (!box) throw new Error('heat pump is not on the canvas');
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      await page.locator('.studio-inspector').waitFor({ state: 'visible' });
      await page.waitForTimeout(250);
      await page.screenshot({ path: '/opt/cursor/artifacts/studio-part-1920.png' });
      await page.getByRole('button', { name: 'Close', exact: true }).click();
      if (await page.locator('.studio-inspector').count() !== 0) throw new Error('close did not hide the inspector');
    }
    if (size.width === 3840 && size.scale === 1) {
      await openExample(page, 'Mixer example');
      await page.waitForTimeout(500);
      const before = await nodeCount(page);
      await cdpDrag(page, await cardCenter(page, 'radiator'), await canvasPoint(page, 0.72, 0.62), 'touch');
      await page.waitForTimeout(400);
      if (await nodeCount(page) !== before + 1) throw new Error('4k touch drag did not add a part');
    }
    await page.close();
  }
  console.log('PASS 3840, 1920, and mobile touch layouts');
}

async function runChromium() {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  try {
    const mousePage = await browser.newPage({ viewport: { width: 1480, height: 920 } });
    await prepare(mousePage);
    await mouseDrag(mousePage, await cardCenter(mousePage, 'heat-pump'), await canvasPoint(mousePage, 0.35, 0.45));
    await mousePage.waitForTimeout(250);
    if (await nodeCount(mousePage) < 1) throw new Error('mouse drag did not place the heat pump');

    await mouseDrag(mousePage, await cardCenter(mousePage, 'valve-3way'), await canvasPoint(mousePage, 0.55, 0.4));
    await mouseDrag(mousePage, await cardCenter(mousePage, 'mixer'), await canvasPoint(mousePage, 0.7, 0.48));
    await mousePage.waitForTimeout(200);
    const labels = await mousePage.locator('.react-flow__node').allInnerTexts();
    if (!labels.some((text) => text.includes('V3'))) throw new Error('mouse drag missed the three-way valve');
    if (!labels.some((text) => text.includes('MV'))) throw new Error('mouse drag missed the mixer');

    const beforeTap = await nodeCount(mousePage);
    const fan = await cardCenter(mousePage, 'fancoil');
    await mousePage.mouse.click(fan.x, fan.y);
    await mousePage.waitForTimeout(200);
    const armed = await mousePage.locator('body').innerText();
    if (!armed.includes('Tap the canvas')) throw new Error('a still click did not arm tap-to-place');
    const spot = await canvasPoint(mousePage, 0.4, 0.7);
    await mousePage.mouse.click(spot.x, spot.y);
    await mousePage.waitForTimeout(200);
    if (await nodeCount(mousePage) !== beforeTap + 1) throw new Error('tap-to-place did not add the fan coil');

    const beforePen = await nodeCount(mousePage);
    await cdpDrag(mousePage, await cardCenter(mousePage, 'thermostat'), await canvasPoint(mousePage, 0.48, 0.25), 'pen');
    await mousePage.waitForTimeout(250);
    if (await nodeCount(mousePage) !== beforePen + 1) throw new Error('pen drag did not place the thermostat');
    await mousePage.close();

    const touchPage = await browser.newPage({ viewport: { width: 1480, height: 920 }, hasTouch: true });
    await prepare(touchPage);
    await cdpDrag(touchPage, await cardCenter(touchPage, 'heat-pump'), await canvasPoint(touchPage, 0.32, 0.42), 'touch');
    await cdpDrag(touchPage, await cardCenter(touchPage, 'valve-3way'), await canvasPoint(touchPage, 0.5, 0.4), 'touch');
    await cdpDrag(touchPage, await cardCenter(touchPage, 'mixer'), await canvasPoint(touchPage, 0.66, 0.5), 'touch');
    await cdpDrag(touchPage, await cardCenter(touchPage, 'radiator'), await canvasPoint(touchPage, 0.58, 0.68), 'touch');
    await touchPage.waitForTimeout(300);
    const touchLabels = await touchPage.locator('.react-flow__node').allInnerTexts();
    if (touchLabels.length < 4) throw new Error(`touch drag placed ${touchLabels.length} parts`);
    if (!touchLabels.some((text) => text.includes('MV'))) throw new Error('touch drag missed the mixer');
    await touchPage.screenshot({ path: '/opt/cursor/artifacts/studio-touch-drag.png' });
    await touchPage.close();
    console.log('PASS chromium mouse, touch, and pen');
    await runPanel(browser);
  } finally {
    await browser.close();
  }
}

async function runFirefox(browser: Browser) {
  const page = await browser.newPage({ viewport: { width: 1480, height: 920 } });
  try {
    await prepare(page);
    await mouseDrag(page, await cardCenter(page, 'pump'), await canvasPoint(page, 0.4, 0.45));
    await mouseDrag(page, await cardCenter(page, 'tee'), await canvasPoint(page, 0.55, 0.55));
    await page.waitForTimeout(300);
    const count = await nodeCount(page);
    if (count < 2) throw new Error(`firefox mouse drag placed ${count} parts`);
    console.log('PASS firefox mouse');
  } finally {
    await page.close();
  }
}

async function main() {
  const server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: true,
  });
  try {
    await waitForServer(server);
    await runChromium();
    try {
      const browser = await firefox.launch({ headless: true });
      try {
        await runFirefox(browser);
      } finally {
        await browser.close();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (/Executable doesn't exist|browserType.launch/.test(message)) {
        console.log('SKIP firefox: browser is not installed');
      } else {
        throw error;
      }
    }
  } finally {
    if (server.pid) {
      try { process.kill(-server.pid, 'SIGTERM'); } catch { server.kill('SIGTERM'); }
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
