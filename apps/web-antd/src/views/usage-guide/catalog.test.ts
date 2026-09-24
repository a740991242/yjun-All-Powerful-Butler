import type { RouteRecordRaw } from 'vue-router';

import { expect, it } from 'vitest';

import enAi from '#/locales/langs/en-US/ai.json';
import enEducation from '#/locales/langs/en-US/education.json';
import enGuide from '#/locales/langs/en-US/guide.json';
import zhAi from '#/locales/langs/zh-CN/ai.json';
import zhEducation from '#/locales/langs/zh-CN/education.json';
import zhGuide from '#/locales/langs/zh-CN/guide.json';
import routes from '#/router/routes/modules/tools';

import { selection, stages } from '../education/catalog';
import { articleFields, guides } from './catalog';
it('covers every visible leaf menu with a bilingual detailed guide and valid destination', () => {
  function leaves(items: RouteRecordRaw[], parent = ''): string[] {
    return items.flatMap((item) => {
      const path = item.path.startsWith('/')
        ? item.path
        : `${parent}/${item.path}`;
      return item.children?.length ? leaves(item.children, path) : [path];
    });
  }
  expect(guides.map((item) => item.route).toSorted()).toEqual(
    leaves(routes).toSorted(),
  );
  for (const guide of guides)
    for (const field of articleFields) {
      const key = `${guide.id}_${field}`;
      expect(Reflect.get(zhGuide, key)?.length).toBeGreaterThan(10);
      expect(Reflect.get(enGuide, key)?.length).toBeGreaterThan(10);
    }
  expect(routes.at(-1)?.path).toBe('/usage-guide');
});
it('provides matching keys and placeholders for all new locales', () => {
  for (const [zh, en] of [
    [zhAi, enAi],
    [zhEducation, enEducation],
    [zhGuide, enGuide],
  ]) {
    if (!zh || !en) throw new Error('Missing locale');
    expect(Object.keys(zh).toSorted()).toEqual(Object.keys(en).toSorted());
    for (const key of Object.keys(zh)) {
      const cn = Reflect.get(zh, key) as string;
      const english = Reflect.get(en, key) as string;
      expect(english).not.toMatch(/\p{Script=Han}/u);
      expect(cn.match(/\{\w+\}/g)?.toSorted() ?? []).toEqual(
        english.match(/\{\w+\}/g)?.toSorted() ?? [],
      );
    }
  }
});
it('accepts only grades belonging to their stage, including flexible higher education years', () => {
  expect(stages).toHaveLength(7);
  expect(selection('primary', 'p6').grade).toBe('p6');
  expect(selection('primary', 'd1').grade).toBeUndefined();
  expect(selection(['primary'], 'p1').stage).toBeUndefined();
  expect(selection('doctorate', 'other').grade).toBe('other');
  for (const stage of stages) {
    expect(Reflect.get(zhEducation, stage.id)).toBeTruthy();
    for (const grade of stage.grades)
      expect(Reflect.get(enEducation, grade)).toBeTruthy();
  }
});
