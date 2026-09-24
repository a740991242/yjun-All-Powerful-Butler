import { expect, it } from 'vitest';
const files = import.meta.glob(
  '../../locales/langs/{en-US,zh-CN}/{engineering,opportunities,dataStatus,dates,investmentCalendar}.json',
  { eager: true, import: 'default' },
);
it('provides matching localized keys and interpolation parameters', () => {
  for (const name of [
    'engineering',
    'opportunities',
    'dataStatus',
    'dates',
    'investmentCalendar',
  ]) {
    const en = files[`../../locales/langs/en-US/${name}.json`] as Record<
      string,
      string
    >;
    const zh = files[`../../locales/langs/zh-CN/${name}.json`] as Record<
      string,
      string
    >;
    expect(Object.keys(en).toSorted()).toEqual(Object.keys(zh).toSorted());
    for (const [key, text] of Object.entries(en)) {
      expect(text.trim()).not.toBe('');
      expect(zh[key]?.trim()).not.toBe('');
      expect(text.match(/\{\w+\}/g) ?? []).toEqual(
        zh[key]?.match(/\{\w+\}/g) ?? [],
      );
    }
  }
});
