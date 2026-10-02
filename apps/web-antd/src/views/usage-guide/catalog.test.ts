import type { RouteRecordRaw } from 'vue-router';

import { expect, it } from 'vitest';

import enAi from '#/locales/langs/en-US/ai.json';
import enEducation from '#/locales/langs/en-US/education.json';
import enLearning from '#/locales/langs/en-US/educationLearning.json';
import enGuide from '#/locales/langs/en-US/guide.json';
import zhAi from '#/locales/langs/zh-CN/ai.json';
import zhEducation from '#/locales/langs/zh-CN/education.json';
import zhLearning from '#/locales/langs/zh-CN/educationLearning.json';
import zhGuide from '#/locales/langs/zh-CN/guide.json';
import routes from '#/router/routes/modules/tools';

import { selection, stages } from '../education/catalog';
import { articleFields, educationSections, guides } from './catalog';
function localeLeaves(value: unknown, prefix = ''): Record<string, string> {
  if (typeof value === 'string') return { [prefix]: value };
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error(`Invalid locale value: ${prefix}`);
  return Object.assign(
    {},
    ...Object.entries(value).map(([key, child]) =>
      localeLeaves(child, prefix ? `${prefix}.${key}` : key),
    ),
  );
}
it('covers every visible leaf menu with a bilingual detailed guide and valid destination', () => {
  function leaves(items: RouteRecordRaw[], parent = ''): string[] {
    return items.flatMap((item) => {
      if (item.meta?.hideInMenu) return [];
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
    [zhLearning, enLearning],
    [zhGuide, enGuide],
  ]) {
    if (!zh || !en) throw new Error('Missing locale');
    const chinese = localeLeaves(zh);
    const englishLeaves = localeLeaves(en);
    expect(Object.keys(chinese).toSorted()).toEqual(
      Object.keys(englishLeaves).toSorted(),
    );
    for (const key of Object.keys(chinese)) {
      const cn = Reflect.get(chinese, key);
      const english = Reflect.get(englishLeaves, key);
      expect(english).not.toMatch(/\p{Script=Han}/u);
      expect(cn.match(/\{\w+\}/g)?.toSorted() ?? []).toEqual(
        english.match(/\{\w+\}/g)?.toSorted() ?? [],
      );
    }
  }
});
it('keeps all six education operating topics bilingual and separately readable', () => {
  expect(educationSections).toEqual([
    'editions',
    'practice',
    'scoring',
    'tools',
    'reflection',
    'backup',
  ]);
  for (const section of educationSections)
    for (const locale of [zhGuide, enGuide]) {
      expect(
        Reflect.get(locale, `education_${section}Title`)?.length,
      ).toBeGreaterThan(2);
      expect(
        Reflect.get(locale, `education_${section}Text`)?.length,
      ).toBeGreaterThan(40);
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
