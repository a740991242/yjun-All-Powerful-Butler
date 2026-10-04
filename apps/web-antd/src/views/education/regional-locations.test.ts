import { expect, it } from 'vitest';

import en from '../../locales/langs/en-US/educationLearning.json';
import zh from '../../locales/langs/zh-CN/educationLearning.json';
import {
  regionalEditionEvidence,
  resolveRegionalEdition,
} from './regional-editions';
import {
  regionalCities,
  regionalProvinces,
  regionalSchools,
} from './regional-locations';
it('exposes areas without fabricating city, school or textbook assignments', () => {
  expect(regionalProvinces).toHaveLength(34);
  expect(new Set(regionalProvinces).size).toBe(34);
  expect(regionalCities('jiangsu')).toEqual(['suzhou']);
  expect(regionalSchools('jiangsu', 'suzhou')).toEqual([
    'wujiang-choudu-primary',
  ]);
  const original = regionalEditionEvidence()[0]!;
  for (const province of regionalProvinces) {
    if (province === 'jiangsu') continue;
    expect(regionalCities(province)).toEqual(
      province === 'shandong' ? ['yantai'] : [],
    );
    expect(regionalSchools(province, 'suzhou')).toEqual([]);
    expect(resolveRegionalEdition({ ...original, province }).status).toBe(
      'unknown',
    );
  }
  expect(regionalSchools('shandong', 'yantai')).toEqual([
    'longkou-mingde-school',
  ]);
  expect(regionalSchools('jiangsu', 'none')).toEqual([]);
  expect(regionalCities('made-up')).toEqual([]);
  const cities = regionalCities('jiangsu');
  cities.push('test-city');
  expect(regionalCities('jiangsu')).toEqual(['suzhou']);
});

it('provides translated area labels for every selector option', () => {
  for (const record of regionalEditionEvidence()) {
    for (const key of [
      `regionalCity_${record.city}`,
      `regionalSchool_${record.school}`,
    ]) {
      expect(zh[key as keyof typeof zh]).toBeTruthy();
      expect(en[key as keyof typeof en]).toBeTruthy();
    }
  }
  expect(zh.qingdaoEdition).toContain('待核验');
  expect(en.qingdaoEdition).toContain('unverified');
  for (const id of regionalProvinces) {
    const key = `regionalProvince_${id}` as keyof typeof zh;
    expect(zh[key]).toBeTruthy();
    expect(en[key as keyof typeof en]).toBeTruthy();
    expect(zh[key]).not.toBe(en[key as keyof typeof en]);
  }
});
