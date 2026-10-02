/* Production mode check with fresh profiles. Run after pnpm build:pages.
 * --complete verifies auxiliary completion with rule-derived UI fixtures;
 * it does not certify independent content accuracy or real manual activities. */
import * as fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

const repo = fileURLToPath(new URL('../../', import.meta.url)).replace(
  /\/$/,
  '',
);
const base = '/yjun-All-Powerful-Butler/';
const root = `${repo}/apps/web-antd/dist`;
// Rule values are fixtures for checking UI persistence, not independent content grading.
const complete = process.argv.includes('--complete');
function magicFixture(cells) {
  const given = cells.flat();
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  const fill = (values) => {
    const blank = values.indexOf(null);
    if (blank === -1) return values;
    for (let number = 1; number <= 9; number++) {
      if (values.includes(number)) continue;
      const candidate = [...values];
      candidate[blank] = number;
      if (
        lines.some(
          (line) =>
            line.every((index) => candidate[index] !== null) &&
            line.reduce((sum, index) => sum + candidate[index], 0) !== 15,
        )
      )
        continue;
      const solution = fill(candidate);
      if (solution) return solution;
    }
    return null;
  };
  const solution = fill(given);
  if (!solution) throw new Error('No 1–9 square fixture');
  return solution.filter((_value, index) => given[index] === null);
}
function firstCombination(fields, accept, distinct = false, selected = []) {
  if (selected.length === fields.length)
    return accept(selected) ? selected : null;
  for (const value of fields[selected.length]) {
    if (distinct && selected.includes(value)) continue;
    const result = firstCombination(fields, accept, distinct, [
      ...selected,
      value,
    ]);
    if (result) return result;
  }
  return null;
}
function numericFixture(rule) {
  let answer;
  switch (rule.kind) {
    case 'number-picks': {
      answer = firstCombination(rule.fields, () => true, rule.distinct);
      break;
    }
    case 'number-chain': {
      const range = Array.from(
        { length: rule.maximum - rule.minimum + 1 },
        (_, i) => rule.minimum + i,
      );
      const filled = firstCombination(
        rule.values.map((value) => (value === null ? range : [value])),
        (values) =>
          values.every(
            (value, index) =>
              index === 0 ||
              (rule.direction === 'ascending'
                ? values[index - 1] < value
                : values[index - 1] > value),
          ),
      );
      answer = filled?.filter((_value, index) => rule.values[index] === null);
      break;
    }
    case 'cross-balance': {
      answer = firstCombination(
        Array.from({ length: 5 }, () => rule.values),
        (values) => values[0] + values[4] === values[1] + values[3],
        true,
      );
      break;
    }
    case 'tower': {
      const given = rule.rows.flat();
      const range = Array.from({ length: 20 }, (_, i) => i);
      const bottom = firstCombination(
        [3, 4, 5].map((index) =>
          given[index] === null ? range : [given[index]],
        ),
        ([a, b, c]) => {
          const values = [a + 2 * b + c, a + b, b + c, a, b, c];
          return values.every(
            (value, index) =>
              value <= 19 && (given[index] === null || given[index] === value),
          );
        },
      );
      if (bottom) {
        const [a, b, c] = bottom;
        answer = [a + 2 * b + c, a + b, b + c, a, b, c].filter(
          (_value, index) => given[index] === null,
        );
      }
      break;
    }
    default: {
      throw new Error('Unknown numeric fixture');
    }
  }
  if (!answer) throw new Error(`No numeric fixture for ${rule.kind}`);
  return answer;
}
(async () => {
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://local');
      if (!url.pathname.startsWith(base)) {
        res.writeHead(404);
        res.end();
        return;
      }
      const rel =
        decodeURIComponent(url.pathname.slice(base.length)) || 'index.html';
      const file = path.resolve(root, rel);
      if (!file.startsWith(`${root}/`)) throw new Error('path');
      const bytes = await fs.readFile(file);
      const types = {
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.html': 'text/html',
        '.json': 'application/json',
        '.svg': 'image/svg+xml',
        '.png': 'image/png',
        '.woff2': 'font/woff2',
      };
      res.writeHead(200, {
        'Content-Type': types[path.extname(file)] || 'application/octet-stream',
      });
      res.end(bytes);
    } catch {
      res.writeHead(404);
      res.end();
    }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const url = origin + base;
  let browser;
  let p;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });

    for (const width of [375, 768, 1200]) {
      const ctx = await browser.newContext({
        viewport: { width, height: 1000 },
      });
      p = await ctx.newPage();
      await p.addInitScript(() => {
        window.__modeRead = () =>
          new Promise((resolve, reject) => {
            const request = indexedDB.open('butler-grade-one', 1);
            request.addEventListener('error', () => reject(request.error));
            request.addEventListener('success', () => {
              const db = request.result;
              const transaction = db.transaction('library', 'readonly');
              const item = transaction.objectStore('library').get('state');
              transaction.addEventListener('complete', () => {
                resolve(item.result);
                db.close();
              });
              transaction.addEventListener('abort', () => {
                reject(transaction.error);
                db.close();
              });
            });
          });
      });
      const errors = [];
      p.on('pageerror', (error) => errors.push(error.message));
      const read = () =>
        p.evaluate(
          () =>
            new Promise((resolve, reject) => {
              const request = indexedDB.open('butler-grade-one', 1);
              request.addEventListener('success', () => {
                const db = request.result;
                const transaction = db.transaction('library', 'readonly');
                const item = transaction.objectStore('library').get('state');
                item.addEventListener('success', () => {
                  resolve(item.result);
                  db.close();
                });
                item.addEventListener('error', reject);
              });
              request.addEventListener('error', reject);
            }),
        );
      const go = async (route) => {
        await p.goto(`${url}#${route}`, { waitUntil: 'domcontentloaded' });
        await p.locator('#__app-loading__').waitFor({ state: 'detached' });
        await p.waitForFunction(
          () =>
            [...document.querySelectorAll('button')].filter(
              (button) => button.textContent.trim() === '导出备份',
            ).length === 1,
        );
        await p
          .getByRole('button', { name: '导出备份', exact: true })
          .waitFor();
      };
      const finishMode = async (started) => {
        const buttons = (name) =>
          p
            .getByRole('button', { name, exact: true })
            .filter({ visible: true })
            .last();
        for (let index = 0; index < started.questions.length; index++) {
          await p.waitForFunction(
            async ({ id, index }) => {
              const state = await window.__modeRead();
              return (
                state.sessions.find((item) => item.id === id)?.questionIndex ===
                index
              );
            },
            { id: started.id, index },
          );
          const question = started.questions[index];
          const rule = question.rule;
          const submitName =
            rule.kind === 'reflection' ? '保存反思' : '提交答案';
          const form = p.locator('form').filter({
            has: p.getByRole('button', { name: submitName, exact: true }),
          });
          let answer;
          if (rule.kind === 'manual') {
            await buttons('暂时跳过').click();
          } else {
            switch (rule.kind) {
              case 'reflection': {
                answer =
                  '本次只验证网页作答与保存，未做纸笔或实物活动；这些活动仍待实际完成。';
                await form.getByRole('textbox').fill(answer);
                break;
              }
              case 'number': {
                answer = rule.value;
                await form.getByRole('spinbutton').fill(String(answer));
                break;
              }
              case 'choice': {
                answer = rule.value;
                const choice = question.choices.find(
                  (item) => item.id === answer,
                );
                if (!choice) throw new Error('missing fixture choice');
                await form
                  .getByRole('radio', { name: choice.label, exact: true })
                  .check();
                break;
              }
              case 'text': {
                [answer] = rule.accepted;
                await form.getByRole('textbox').fill(answer);
                break;
              }
              case 'steps': {
                answer = rule.values;
                for (const [position, value] of answer.entries())
                  await form
                    .getByRole('spinbutton')
                    .nth(position)
                    .fill(String(value));
                break;
              }
              case 'magic-grid': {
                answer = magicFixture(rule.cells);
                for (const [position, value] of answer.entries())
                  await form
                    .getByRole('spinbutton')
                    .nth(position)
                    .fill(String(value));
                break;
              }
              case 'tower':
              case 'number-chain':
              case 'number-picks':
              case 'cross-balance': {
                answer = numericFixture(rule);
                for (const [position, value] of answer.entries())
                  await form
                    .getByRole('spinbutton')
                    .nth(position)
                    .fill(String(value));
                break;
              }
              case 'set': {
                answer = rule.values;
                for (const id of answer) {
                  const choice = question.choices.find(
                    (item) => item.id === id,
                  );
                  if (!choice) throw new Error('missing fixture checkbox');
                  await form
                    .getByRole('checkbox', { name: choice.label, exact: true })
                    .check();
                }
                break;
              }
              case 'sequence': {
                answer = rule.values;
                for (const [position, id] of answer.entries()) {
                  const choice = question.choices.find(
                    (item) => item.id === id,
                  );
                  if (!choice) throw new Error('missing sequence fixture');
                  await form.getByRole('combobox').nth(position).click();
                  await p
                    .locator('.ant-select-dropdown')
                    .filter({ visible: true })
                    .last()
                    .getByText(choice.label, { exact: true })
                    .click();
                }
                break;
              }
              case 'partition': {
                answer = Array.from({ length: rule.parts }, (_, i) =>
                  i === rule.parts - 1
                    ? rule.total - rule.minimum * (rule.parts - 1)
                    : rule.minimum,
                );
                for (const [position, value] of answer.entries())
                  await form
                    .getByRole('spinbutton')
                    .nth(position)
                    .fill(String(value));
                break;
              }
              default: {
                throw new Error(
                  `Add an explicit UI fixture for ${question.id}/${rule.kind}`,
                );
              }
            }
            await p.waitForFunction(
              async ({ id, index, answer }) => {
                const state = await window.__modeRead();
                const response = state.sessions.find((item) => item.id === id)
                  ?.responses[index];
                return (
                  JSON.stringify(response?.draft) === JSON.stringify(answer)
                );
              },
              { id: started.id, index, answer },
            );
            if (index === 0) {
              await p.reload();
              await p
                .locator('#__app-loading__')
                .waitFor({ state: 'detached' });
              await buttons(submitName).waitFor();
              const refreshed = await read();
              if (
                JSON.stringify(
                  refreshed.sessions.find((item) => item.id === started.id)
                    .responses[index].draft,
                ) !== JSON.stringify(answer)
              )
                throw new Error('auxiliary draft lost');
            }
            await buttons(submitName).click();
          }
          await p.waitForFunction(
            async ({ id, index, manual }) => {
              const state = await window.__modeRead();
              const response = state.sessions.find((item) => item.id === id)
                ?.responses[index];
              return manual
                ? response?.skipped
                : response?.submissions.length > 0;
            },
            { id: started.id, index, manual: rule.kind === 'manual' },
          );
          const saved = await read();
          const response = saved.sessions.find((item) => item.id === started.id)
            .responses[index];
          if (rule.kind === 'manual') {
            if (!response.skipped || response.submissions.length > 0)
              throw new Error(
                `manual activity auto-confirmed: ${question.id}/${JSON.stringify(response)}`,
              );
          } else if (
            response.submissions[0].correct !==
            (rule.kind === 'reflection' ? null : true)
          )
            throw new Error('fixture UI submission mismatch');
          if (index < started.questions.length - 1) {
            if (rule.kind !== 'manual') await buttons('下一题').click();
            await p.waitForFunction(
              async ({ id, index }) => {
                const state = await window.__modeRead();
                return (
                  state.sessions.find((item) => item.id === id)
                    .questionIndex ===
                  index + 1
                );
              },
              { id: started.id, index },
            );
          }
        }
        await buttons('完成并保存记录').click();
        await p.getByText('本次学习已完成', { exact: true }).waitFor();
        await p.waitForFunction(async (id) => {
          const state = await window.__modeRead();
          return Boolean(
            state.sessions.find((item) => item.id === id)?.completedAt,
          );
        }, started.id);
        const state = await read();
        const finished = state.sessions.find((item) => item.id === started.id);
        if (
          finished.mode !== started.mode ||
          finished.responses.some(
            (response) =>
              !response.skipped && response.submissions.length === 0,
          )
        )
          throw new Error('mode completion snapshot');
        await p.reload();
        await p.locator('#__app-loading__').waitFor({ state: 'detached' });
        await p.getByText('本次学习已完成', { exact: true }).waitFor();
        const restored = await read();
        if (
          JSON.stringify(
            restored.sessions.find((item) => item.id === started.id),
          ) !== JSON.stringify(finished)
        )
          throw new Error('completed mode refresh changed record');
        return finished;
      };
      await p.goto(`${url}#/education/primary/p1/math/sujiao/upper`);
      await p.getByPlaceholder('请输入用户名').fill('yj88888888');
      await p.getByPlaceholder('密码', { exact: true }).fill('yyds123456');
      await p.locator('button').filter({ hasText: '登录' }).click();
      await p.waitForFunction(
        () =>
          [...document.querySelectorAll('button')].filter(
            (button) => button.textContent.trim() === '导出备份',
          ).length === 1,
      );
      await p.getByRole('button', { name: '导出备份', exact: true }).waitFor();
      const cases = [
        ['math', 'sujiao', 'upper', 'sujiao-math-p1-upper-2024', 9],
        ['math', 'sujiao', 'lower', 'sujiao-math-p1-lower-9787574312951', 11],
        ['math', 'pep-2024', 'upper', 'pep-math-p1-upper-2024', 5],
        ['math', 'pep-2024', 'lower', 'pep-math-p1-lower-2024', 6],
        ['chinese', 'pep-2024', 'upper', 'pep-chinese-p1-upper-2024', null],
        ['chinese', 'pep-2024', 'lower', 'pep-chinese-p1-lower-2024', null],
      ];
      const expected = [];
      for (const [subject, edition, volume, bookId, count] of cases) {
        const route = `/education/primary/p1/${subject}/${edition}/${volume}`;
        await go(route);
        const starts = p.getByRole('button', {
          name: '开始专项练习',
          exact: true,
        });
        const actual = await starts.count();
        if ((count !== null && actual !== count) || actual === 0)
          throw new Error(`specialties ${bookId}: ${actual}`);
        if (subject === 'math' && volume === 'upper') {
          await p
            .getByRole('button', { name: '进入数学下册衔接练习', exact: true })
            .click();
          await p.waitForURL(
            (current) =>
              current.hash === `#/education/primary/p1/math/${edition}/lower`,
          );
          const transitionCount = await p
            .getByRole('button', { name: '开始衔接练习', exact: true })
            .count();
          if (transitionCount !== 3) throw new Error('lower transitions');
          await go(route);
        }
        for (const size of complete ? [6] : [6, 12, 20]) {
          const input = p.locator('#specialty-count');
          await input.focus();
          await input.press('ArrowDown');
          await p
            .locator('.ant-select-dropdown')
            .filter({ visible: true })
            .last()
            .getByText(`${size}题`, { exact: true })
            .click();
          const card = starts.first().locator('..');
          const title = await card.locator('h3').innerText();
          const cardText = await card.innerText();
          const match = cardText.match(/题库\s*(\d+)\s*题/);
          if (!match) throw new Error('pool count missing');
          const length = Math.min(size, Number(match[1]));
          await starts.first().click();
          await p.waitForURL('**session=*');
          const id = new URLSearchParams(p.url().split('?')[1]).get('session');
          const state = await read();
          const session = state.sessions.find((item) => item.id === id);
          if (
            !session ||
            session.bookId !== bookId ||
            session.lessonTitle !== title ||
            session.mode !== 'practice' ||
            session.questions.length !== length ||
            session.completedAt ||
            session.responses.some(
              (response) => response.submissions.length > 0 || response.skipped,
            ) ||
            new Set(session.questions.map((item) => item.id)).size !== length
          )
            throw new Error(
              `practice snapshot ${bookId}/${size}: ${JSON.stringify(session)}`,
            );
          expected.push(complete ? await finishMode(session) : session);
          if (complete) {
            await go(route);
            continue;
          }
          await p.reload();
          await p.locator('#__app-loading__').waitFor({ state: 'detached' });
          const refreshedState = await read();
          if (
            JSON.stringify(
              refreshedState.sessions.find((item) => item.id === id),
            ) !== JSON.stringify(session)
          )
            throw new Error('refresh changed unfinished practice');
          await go(route);
        }
        const bridges = p.getByRole('button', {
          name: '开始衔接练习',
          exact: true,
        });
        const n = await bridges.count();
        for (let index = 0; index < n; index++) {
          const title = await bridges
            .nth(index)
            .locator('..')
            .locator('h3')
            .innerText();
          await bridges.nth(index).click();
          await p.waitForURL('**session=*');
          const id = new URLSearchParams(p.url().split('?')[1]).get('session');
          const transitionState = await read();
          const session = transitionState.sessions.find(
            (item) => item.id === id,
          );
          if (
            !session ||
            session.bookId !== bookId ||
            session.mode !== 'transition' ||
            session.lessonTitle !== title ||
            session.questions.length === 0 ||
            session.completedAt ||
            session.responses.some(
              (response) => response.submissions.length > 0 || response.skipped,
            )
          )
            throw new Error('transition snapshot');
          expected.push(complete ? await finishMode(session) : session);
          if (complete) {
            await go(route);
            continue;
          }
          await p.reload();
          await p.locator('#__app-loading__').waitFor({ state: 'detached' });
          const refreshedState = await read();
          if (
            JSON.stringify(
              refreshedState.sessions.find((item) => item.id === id),
            ) !== JSON.stringify(session)
          )
            throw new Error('refresh changed unfinished transition');
          await go(route);
        }
      }
      const final = await read();
      for (const session of expected)
        if (
          JSON.stringify(
            final.sessions.find((item) => item.id === session.id),
          ) !== JSON.stringify(session)
        )
          throw new Error('older snapshot changed');
      if (complete) {
        const downloadPromise = p.waitForEvent('download');
        await p.getByRole('button', { name: '导出备份', exact: true }).click();
        const download = await downloadPromise;
        const backup = JSON.parse(
          await fs.readFile(await download.path(), 'utf8'),
        );
        for (const session of expected)
          if (
            JSON.stringify(
              backup.data.sessions.find((item) => item.id === session.id),
            ) !== JSON.stringify(session)
          )
            throw new Error('completed modes backup changed');
      }
      await go('/education/primary/p1/math/sujiao/lower');
      await p.locator('#specialty-count').scrollIntoViewIfNeeded();
      await p.screenshot({ path: `/tmp/butler-modes-${width}.png` });
      if (errors.length > 0) throw new Error(JSON.stringify(errors));
      console.log(
        JSON.stringify({
          width,
          sessions: expected.length,
          errors,
          status: 'passed',
          scope: complete
            ? 'six first specialty groups and all twelve bridges: UI submissions, completion, refresh and backup; fixtures do not certify content accuracy or real manual activities'
            : 'mode entry, lengths, unfinished refresh; not completed learning',
        }),
      );
      await ctx.close();
    }
  } catch (error) {
    if (p) {
      console.log(p.url());
      const failureText = await p.locator('body').innerText();
      console.log(failureText.slice(-3500));
      await p.screenshot({
        path: '/tmp/butler-pages-final-failure.png',
        fullPage: true,
      });
    }
    throw error;
  } finally {
    await browser?.close();
    await new Promise((resolve) => server.close(resolve));
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
