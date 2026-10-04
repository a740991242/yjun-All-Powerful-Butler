/* Component preview only; this does not verify a released course or learning records.
 * Separate headless contexts, with no access to the user's browser profile.
 */
import { chromium } from 'playwright';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const width of [375, 768, 1200]) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(
      'http://localhost:5666/education/primary/p1/math/bnu-2024/lower',
      { waitUntil: 'networkidle' },
    );
    if (page.url().includes('login')) {
      await page.getByPlaceholder('请输入用户名').fill('yj88888888');
      await page.getByPlaceholder('密码', { exact: true }).fill('yyds123456');
      await page.locator('button').filter({ hasText: '登录' }).click();
      await page.waitForURL((url) => !url.pathname.includes('/login'));
      await page.goto(
        'http://localhost:5666/education/primary/p1/math/bnu-2024/lower',
        { waitUntil: 'networkidle' },
      );
      await page
        .getByRole('button', { name: '进入课程', exact: true })
        .first()
        .waitFor();
    }
    await page.evaluate(async () => {
      const sourcePath = '/src/views/education/learning/ArithmeticGrid.vue';
      const response = await fetch(sourcePath);
      const code = await response.text();
      const specifier = code.match(
        /from\s*["']([^"']*\/vue\.js[^"']*)["']/,
      )?.[1];
      if (!specifier)
        throw new Error(
          'Vue dependency not found in the observed component module',
        );
      const vue = await import(specifier);
      const { default: component } = await import(sourcePath);
      const { bnuLowerSubtractionSource: source } =
        await import('/src/views/education/content/bnu-lower-subtraction-source.ts');
      const parent = [...document.querySelectorAll('.ant-card')]
        .map((node) => node.__vueParentComponent)
        .find(Boolean);
      if (!parent)
        throw new Error('Live Ant Design application context not found');
      const host = document.createElement('div');
      host.id = 'subtraction-component-preview';
      host.style.cssText =
        'position:fixed;top:130px;bottom:16px;left:16px;right:16px;z-index:1000;overflow:auto;padding:16px;background:hsl(var(--background));border:1px solid hsl(var(--border));';
      document.body.append(host);
      const vnode = vue.createVNode(component, {
        visual: {
          kind: 'arithmetic-grid',
          mode: 'bnu-subtract',
          hidden: source.blankPositions.map((position) => [...position]),
        },
      });
      vnode.appContext = { ...parent.appContext, provides: parent.provides };
      vue.render(vnode, host);
    });
    const grid = page.locator('[data-arithmetic-grid="bnu-subtract"]');
    await grid.waitFor();
    async function inspect(label) {
      const text = await grid.innerText();
      const formulas = text.match(/\d{2}−\d/g) || [];
      if (formulas.length !== 26)
        throw new Error(`Expected 26 givens, got ${formulas.length}`);
      for (const formula of ['10−1', '10−9', '18−9'])
        if (!formulas.includes(formula)) throw new Error(`Missing ${formula}`);
      const cells = grid.locator('tbody td');
      const labels = await cells.allTextContents();
      const blankPattern = label.startsWith('en')
        ? /^Blank [A-S]$/
        : /^空格 [A-S]$/;
      const blanks = labels
        .map((value) => value.trim())
        .filter((value) => blankPattern.test(value));
      if (blanks.length !== 19 || new Set(blanks).size !== 19)
        throw new Error(
          `Expected 19 distinct letters: ${JSON.stringify(blanks)}`,
        );
      const small = await cells.evaluateAll((nodes) =>
        nodes.some((node) => {
          const span = node.querySelector('span');
          return (
            span && Number.parseFloat(getComputedStyle(span).fontSize) < 20
          );
        }),
      );
      if (small) throw new Error('Source table text below 20px');
      const scroller = grid.locator('.ant-table-content');
      await scroller.evaluate((node) => {
        node.scrollLeft = 0;
      });
      await page.screenshot({
        path: `/tmp/butler-subtract-grid-${label}-left-${width}.png`,
      });
      await scroller.evaluate((node) => {
        node.scrollLeft = node.scrollWidth;
      });
      const axisProblems = await grid.evaluate((node) => {
        const axisCells = [
          ...node.querySelectorAll('.ant-table-cell-fix-left'),
        ];
        const transparent = axisCells.some((cell) => {
          const color = getComputedStyle(cell).backgroundColor;
          return color === 'transparent' || color === 'rgba(0, 0, 0, 0)';
        });
        const header = node.querySelector(
          'thead .ant-table-cell-fix-left span',
        );
        const range = document.createRange();
        const text = header?.firstChild;
        let brokenWord = false;
        if (text?.nodeType === Node.TEXT_NODE) {
          const content = text.textContent || '';
          for (const match of content.matchAll(/[A-Za-z]+/g)) {
            range.setStart(text, match.index);
            range.setEnd(text, match.index + match[0].length);
            if (range.getClientRects().length > 1) brokenWord = true;
          }
        }
        return { transparent, brokenWord };
      });
      if (axisProblems.transparent)
        throw new Error('Fixed row headings show scrolled cells underneath');
      if (axisProblems.brokenWord)
        throw new Error('An English axis heading breaks within a word');
      await page.screenshot({
        path: `/tmp/butler-subtract-grid-${label}-right-${width}.png`,
      });
      const outside = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      );
      if (outside) throw new Error('Page has horizontal overflow');
    }
    await inspect('zh');
    await page
      .locator('button[aria-haspopup="menu"]')
      .filter({ has: page.locator('svg.lucide-languages') })
      .click();
    await page.getByText('English', { exact: true }).click();
    await grid.getByText('Whole / difference', { exact: true }).waitFor();
    const dark = await page.evaluate(() =>
      document.documentElement.classList.contains('dark'),
    );
    await page.locator('.theme-toggle svg').click();
    await page.waitForFunction(
      (was) => document.documentElement.classList.contains('dark') !== was,
      dark,
    );
    await page.waitForTimeout(500);
    await inspect('en-theme');
    await page.evaluate(() => {
      const node = document.querySelector(
        '[data-arithmetic-grid="bnu-subtract"]',
      );
      const component = node.__vueParentComponent;
      component.props.visual = {
        kind: 'arithmetic-grid',
        mode: 'bnu-subtract',
        hidden: [[2, 4]],
      };
    });
    await grid
      .getByText(
        /This view hides 1 expressions with letters and displays the other 44/,
      )
      .waitFor();
    const reviewText = await grid.innerText();
    if ((reviewText.match(/\d{2}−\d/g) || []).length !== 44)
      throw new Error('Single-blank review diagram lost its 44 givens');
    if (reviewText.includes('12−7'))
      throw new Error('Review diagram reveals the hidden expression');
    await page.screenshot({
      path: `/tmp/butler-subtract-grid-review-${width}.png`,
    });
    if (errors.length > 0) throw new Error(errors.join('\n'));
    console.log(
      JSON.stringify({
        width,
        givens: 26,
        blanks: 19,
        languages: 2,
        themeChanged: true,
      }),
    );
    await context.close();
  }
} finally {
  await browser.close();
}
