import { regionalEditionEvidence } from './regional-editions';

/** Navigation areas only: these IDs do not assign a textbook or establish a local curriculum. */
export const regionalProvinces = [
  'beijing',
  'tianjin',
  'hebei',
  'shanxi',
  'inner-mongolia',
  'liaoning',
  'jilin',
  'heilongjiang',
  'shanghai',
  'jiangsu',
  'zhejiang',
  'anhui',
  'fujian',
  'jiangxi',
  'shandong',
  'henan',
  'hubei',
  'hunan',
  'guangdong',
  'guangxi',
  'hainan',
  'chongqing',
  'sichuan',
  'guizhou',
  'yunnan',
  'tibet',
  'shaanxi',
  'gansu',
  'qinghai',
  'ningxia',
  'xinjiang',
  'hong-kong',
  'macau',
  'taiwan',
] as const;

export function regionalCities(province: string) {
  return [
    ...new Set(
      regionalEditionEvidence()
        .filter((row) => row.province === province)
        .map((row) => row.city),
    ),
  ];
}
export function regionalSchools(province: string, city: string) {
  return [
    ...new Set(
      regionalEditionEvidence()
        .filter((row) => row.province === province && row.city === city)
        .map((row) => row.school),
    ),
  ];
}
