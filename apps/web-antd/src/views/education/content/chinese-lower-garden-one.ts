import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
export const lowerGardenOnePageAudit = {
  itemId: 'u1-5',
  pages: [10, 11, 12, 13, 14],
  recognize: '识组计算减式图形卡合唱团',
  write: '文卡片合',
  writingReuse: '田四白',
  poet: '孟浩然',
  dynasty: '唐',
  modernAuthor: '樊发稼',
  modernAdapted: true,
  reading: '妞妞赶牛',
  readingKind: '传统绕口令',
  readingAuthor: null,
  sourceUrl: 'https://keben.app/book/0026',
  provider: '第三方原书公开预览',
  checkedAt: '2026-10-01',
  isbn: null,
  editionDate: null,
  printingDate: null,
};
const lowerGardenOneSource = lowerGardenOnePageAudit;
const recognitionRows: Record<string, [string, string, string][]> = {
  'u1-5': [
    ['识', '识字中的第1个字是哪项？', '相识中的第2个字是哪项？'],
    ['组', '组词中的第1个字是哪项？', '小组中的第2个字是哪项？'],
    ['计', '计算中的第1个字是哪项？', '计划中的第1个字是哪项？'],
    ['算', '计算中的第2个字是哪项？', '算式中的第1个字是哪项？'],
    ['减', '减法中的第1个字是哪项？', '减少中的第1个字是哪项？'],
    ['式', '算式中的第2个字是哪项？', '式子中的第1个字是哪项？'],
    ['图', '图形中的第1个字是哪项？', '图画中的第1个字是哪项？'],
    ['形', '图形中的第2个字是哪项？', '形状中的第1个字是哪项？'],
    ['卡', '卡片中的第1个字是哪项？', '卡车中的第1个字是哪项？'],
    ['合', '合唱中的第1个字是哪项？', '合作中的第1个字是哪项？'],
    ['唱', '合唱中的第2个字是哪项？', '唱歌中的第1个字是哪项？'],
    ['团', '合唱团中的第3个字是哪项？', '团圆中的第1个字是哪项？'],
  ],
};
type Pair = {
  key: string;
  prompts: [string, string];
  values: [string, string];
  labels: string[];
  explanation: string;
  material: string;
};
type Entry = {
  itemId: string;
  title: string;
  pages: number[];
  recognize: string;
  write: string;
  pairs: Pair[];
  steps: Lesson['steps'];
  actual: [string, string][];
  reflections: string[];
};
const entries: Entry[] = [
  {
    itemId: 'u1-5',
    title: '语文园地一',
    pages: [10, 11, 12, 13, 14],
    recognize: '识组计算减式图形卡合唱团',
    write: '文卡片合',
    pairs: [
      {
        key: 'word-0',
        prompts: [
          '第10页词语识字的第一个字是哪项？',
          '反向查词：第10页九词中，哪词以识开头？',
        ],
        values: ['识', '识字'],
        labels: ['识', '识字', '不在本页词语中'],
        explanation:
          '在本页九词的限定范围找字词，识字首字为识；实际朗读与找其他课本里的词另行确认。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'word-1',
        prompts: [
          '第10页词语组词的第一个字是哪项？',
          '反向查词：第10页九词中，哪词以组开头？',
        ],
        values: ['组', '组词'],
        labels: ['组', '组词', '不在本页词语中'],
        explanation:
          '在本页九词的限定范围找字词，组词首字为组；实际朗读与找其他课本里的词另行确认。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'word-2',
        prompts: [
          '第10页词语读课文的第一个字是哪项？',
          '反向查词：第10页九词中，哪词以读开头？',
        ],
        values: ['读', '读课文'],
        labels: ['读', '读课文', '不在本页词语中'],
        explanation:
          '在本页九词的限定范围找字词，读课文首字为读；实际朗读与找其他课本里的词另行确认。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'word-3',
        prompts: [
          '第10页词语计算的第一个字是哪项？',
          '反向查词：第10页九词中，哪词以计开头？',
        ],
        values: ['计', '计算'],
        labels: ['计', '计算', '不在本页词语中'],
        explanation:
          '在本页九词的限定范围找字词，计算首字为计；实际朗读与找其他课本里的词另行确认。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'word-4',
        prompts: [
          '第10页词语减法的第一个字是哪项？',
          '反向查词：第10页九词中，哪词以减开头？',
        ],
        values: ['减', '减法'],
        labels: ['减', '减法', '不在本页词语中'],
        explanation:
          '在本页九词的限定范围找字词，减法首字为减；实际朗读与找其他课本里的词另行确认。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'word-5',
        prompts: [
          '第10页词语列算式的第一个字是哪项？',
          '反向查词：第10页九词中，哪词以列开头？',
        ],
        values: ['列', '列算式'],
        labels: ['列', '列算式', '不在本页词语中'],
        explanation:
          '在本页九词的限定范围找字词，列算式首字为列；实际朗读与找其他课本里的词另行确认。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'word-6',
        prompts: [
          '第10页词语图形的第一个字是哪项？',
          '反向查词：第10页九词中，哪词以图开头？',
        ],
        values: ['图', '图形'],
        labels: ['图', '图形', '不在本页词语中'],
        explanation:
          '在本页九词的限定范围找字词，图形首字为图；实际朗读与找其他课本里的词另行确认。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'word-7',
        prompts: [
          '第10页词语卡片的第一个字是哪项？',
          '反向查词：第10页九词中，哪词以卡开头？',
        ],
        values: ['卡', '卡片'],
        labels: ['卡', '卡片', '不在本页词语中'],
        explanation:
          '在本页九词的限定范围找字词，卡片首字为卡；实际朗读与找其他课本里的词另行确认。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'word-8',
        prompts: [
          '第10页词语合唱团的第一个字是哪项？',
          '反向查词：第10页九词中，哪词以合开头？',
        ],
        values: ['合', '合唱团'],
        labels: ['合', '合唱团', '不在本页词语中'],
        explanation:
          '在本页九词的限定范围找字词，合唱团首字为合；实际朗读与找其他课本里的词另行确认。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'nasal-0',
        prompts: [
          '只比较见和长，本页读音韵母为an的是？',
          '仍比较见和长，韵母为ang的是？',
        ],
        values: ['见', '长'],
        labels: ['见', '长', '无法区分'],
        explanation:
          '按原页语境：见归an、长归ang。长在这里读cháng；字形选择不能自动评实际前后鼻音。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'nasal-1',
        prompts: [
          '只比较万和王，本页读音韵母为an的是？',
          '仍比较万和王，韵母为ang的是？',
        ],
        values: ['万', '王'],
        labels: ['万', '王', '无法区分'],
        explanation:
          '按原页语境：万归an、王归ang。长在这里读cháng；字形选择不能自动评实际前后鼻音。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'nasal-2',
        prompts: [
          '只比较言和羊，本页读音韵母为an的是？',
          '仍比较言和羊，韵母为ang的是？',
        ],
        values: ['言', '羊'],
        labels: ['言', '羊', '无法区分'],
        explanation:
          '按原页语境：言归an、羊归ang。长在这里读cháng；字形选择不能自动评实际前后鼻音。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'nasal-3',
        prompts: [
          '只比较半和上，本页读音韵母为an的是？',
          '仍比较半和上，韵母为ang的是？',
        ],
        values: ['半', '上'],
        labels: ['半', '上', '无法区分'],
        explanation:
          '按原页语境：半归an、上归ang。长在这里读cháng；字形选择不能自动评实际前后鼻音。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'letter-0',
        prompts: [
          '汉语拼音字母表：小写a对应哪个大写？',
          '换方向：大写A对应哪个小写？',
        ],
        values: ['A', 'a'],
        labels: ['A', 'a', 'B', 'b'],
        explanation:
          '按第11页汉语拼音字母表配对，不当英语字母读音课程；字体样式不替代原书观察与规范读音。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'letter-1',
        prompts: [
          '汉语拼音字母表：小写b对应哪个大写？',
          '换方向：大写B对应哪个小写？',
        ],
        values: ['B', 'b'],
        labels: ['B', 'b', 'C', 'c'],
        explanation:
          '按第11页汉语拼音字母表配对，不当英语字母读音课程；字体样式不替代原书观察与规范读音。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'letter-2',
        prompts: [
          '汉语拼音字母表：小写c对应哪个大写？',
          '换方向：大写C对应哪个小写？',
        ],
        values: ['C', 'c'],
        labels: ['C', 'c', 'D', 'd'],
        explanation:
          '按第11页汉语拼音字母表配对，不当英语字母读音课程；字体样式不替代原书观察与规范读音。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'letter-3',
        prompts: [
          '汉语拼音字母表：小写d对应哪个大写？',
          '换方向：大写D对应哪个小写？',
        ],
        values: ['D', 'd'],
        labels: ['D', 'd', 'E', 'e'],
        explanation:
          '按第11页汉语拼音字母表配对，不当英语字母读音课程；字体样式不替代原书观察与规范读音。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'letter-4',
        prompts: [
          '汉语拼音字母表：小写e对应哪个大写？',
          '换方向：大写E对应哪个小写？',
        ],
        values: ['E', 'e'],
        labels: ['E', 'e', 'F', 'f'],
        explanation:
          '按第11页汉语拼音字母表配对，不当英语字母读音课程；字体样式不替代原书观察与规范读音。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'letter-5',
        prompts: [
          '汉语拼音字母表：小写f对应哪个大写？',
          '换方向：大写F对应哪个小写？',
        ],
        values: ['F', 'f'],
        labels: ['F', 'f', 'G', 'g'],
        explanation:
          '按第11页汉语拼音字母表配对，不当英语字母读音课程；字体样式不替代原书观察与规范读音。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'letter-6',
        prompts: [
          '汉语拼音字母表：小写g对应哪个大写？',
          '换方向：大写G对应哪个小写？',
        ],
        values: ['G', 'g'],
        labels: ['G', 'g', 'H', 'h'],
        explanation:
          '按第11页汉语拼音字母表配对，不当英语字母读音课程；字体样式不替代原书观察与规范读音。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'letter-7',
        prompts: [
          '汉语拼音字母表：小写h对应哪个大写？',
          '换方向：大写H对应哪个小写？',
        ],
        values: ['H', 'h'],
        labels: ['H', 'h', 'I', 'i'],
        explanation:
          '按第11页汉语拼音字母表配对，不当英语字母读音课程；字体样式不替代原书观察与规范读音。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'letter-8',
        prompts: [
          '汉语拼音字母表：小写i对应哪个大写？',
          '换方向：大写I对应哪个小写？',
        ],
        values: ['I', 'i'],
        labels: ['I', 'i', 'J', 'j'],
        explanation:
          '按第11页汉语拼音字母表配对，不当英语字母读音课程；字体样式不替代原书观察与规范读音。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'letter-9',
        prompts: [
          '汉语拼音字母表：小写j对应哪个大写？',
          '换方向：大写J对应哪个小写？',
        ],
        values: ['J', 'j'],
        labels: ['J', 'j', 'K', 'k'],
        explanation:
          '按第11页汉语拼音字母表配对，不当英语字母读音课程；字体样式不替代原书观察与规范读音。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'letter-10',
        prompts: [
          '汉语拼音字母表：小写k对应哪个大写？',
          '换方向：大写K对应哪个小写？',
        ],
        values: ['K', 'k'],
        labels: ['K', 'k', 'L', 'l'],
        explanation:
          '按第11页汉语拼音字母表配对，不当英语字母读音课程；字体样式不替代原书观察与规范读音。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'letter-11',
        prompts: [
          '汉语拼音字母表：小写l对应哪个大写？',
          '换方向：大写L对应哪个小写？',
        ],
        values: ['L', 'l'],
        labels: ['L', 'l', 'M', 'm'],
        explanation:
          '按第11页汉语拼音字母表配对，不当英语字母读音课程；字体样式不替代原书观察与规范读音。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'letter-12',
        prompts: [
          '汉语拼音字母表：小写m对应哪个大写？',
          '换方向：大写M对应哪个小写？',
        ],
        values: ['M', 'm'],
        labels: ['M', 'm', 'N', 'n'],
        explanation:
          '按第11页汉语拼音字母表配对，不当英语字母读音课程；字体样式不替代原书观察与规范读音。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'letter-13',
        prompts: [
          '汉语拼音字母表：小写n对应哪个大写？',
          '换方向：大写N对应哪个小写？',
        ],
        values: ['N', 'n'],
        labels: ['N', 'n', 'O', 'o'],
        explanation:
          '按第11页汉语拼音字母表配对，不当英语字母读音课程；字体样式不替代原书观察与规范读音。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'letter-14',
        prompts: [
          '汉语拼音字母表：小写o对应哪个大写？',
          '换方向：大写O对应哪个小写？',
        ],
        values: ['O', 'o'],
        labels: ['O', 'o', 'P', 'p'],
        explanation:
          '按第11页汉语拼音字母表配对，不当英语字母读音课程；字体样式不替代原书观察与规范读音。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'letter-15',
        prompts: [
          '汉语拼音字母表：小写p对应哪个大写？',
          '换方向：大写P对应哪个小写？',
        ],
        values: ['P', 'p'],
        labels: ['P', 'p', 'Q', 'q'],
        explanation:
          '按第11页汉语拼音字母表配对，不当英语字母读音课程；字体样式不替代原书观察与规范读音。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'letter-16',
        prompts: [
          '汉语拼音字母表：小写q对应哪个大写？',
          '换方向：大写Q对应哪个小写？',
        ],
        values: ['Q', 'q'],
        labels: ['Q', 'q', 'R', 'r'],
        explanation:
          '按第11页汉语拼音字母表配对，不当英语字母读音课程；字体样式不替代原书观察与规范读音。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'letter-17',
        prompts: [
          '汉语拼音字母表：小写r对应哪个大写？',
          '换方向：大写R对应哪个小写？',
        ],
        values: ['R', 'r'],
        labels: ['R', 'r', 'S', 's'],
        explanation:
          '按第11页汉语拼音字母表配对，不当英语字母读音课程；字体样式不替代原书观察与规范读音。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'letter-18',
        prompts: [
          '汉语拼音字母表：小写s对应哪个大写？',
          '换方向：大写S对应哪个小写？',
        ],
        values: ['S', 's'],
        labels: ['S', 's', 'T', 't'],
        explanation:
          '按第11页汉语拼音字母表配对，不当英语字母读音课程；字体样式不替代原书观察与规范读音。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'letter-19',
        prompts: [
          '汉语拼音字母表：小写t对应哪个大写？',
          '换方向：大写T对应哪个小写？',
        ],
        values: ['T', 't'],
        labels: ['T', 't', 'U', 'u'],
        explanation:
          '按第11页汉语拼音字母表配对，不当英语字母读音课程；字体样式不替代原书观察与规范读音。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'letter-20',
        prompts: [
          '汉语拼音字母表：小写u对应哪个大写？',
          '换方向：大写U对应哪个小写？',
        ],
        values: ['U', 'u'],
        labels: ['U', 'u', 'V', 'v'],
        explanation:
          '按第11页汉语拼音字母表配对，不当英语字母读音课程；字体样式不替代原书观察与规范读音。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'letter-21',
        prompts: [
          '汉语拼音字母表：小写v对应哪个大写？',
          '换方向：大写V对应哪个小写？',
        ],
        values: ['V', 'v'],
        labels: ['V', 'v', 'W', 'w'],
        explanation:
          '按第11页汉语拼音字母表配对，不当英语字母读音课程；字体样式不替代原书观察与规范读音。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'letter-22',
        prompts: [
          '汉语拼音字母表：小写w对应哪个大写？',
          '换方向：大写W对应哪个小写？',
        ],
        values: ['W', 'w'],
        labels: ['W', 'w', 'X', 'x'],
        explanation:
          '按第11页汉语拼音字母表配对，不当英语字母读音课程；字体样式不替代原书观察与规范读音。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'letter-23',
        prompts: [
          '汉语拼音字母表：小写x对应哪个大写？',
          '换方向：大写X对应哪个小写？',
        ],
        values: ['X', 'x'],
        labels: ['X', 'x', 'Y', 'y'],
        explanation:
          '按第11页汉语拼音字母表配对，不当英语字母读音课程；字体样式不替代原书观察与规范读音。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'letter-24',
        prompts: [
          '汉语拼音字母表：小写y对应哪个大写？',
          '换方向：大写Y对应哪个小写？',
        ],
        values: ['Y', 'y'],
        labels: ['Y', 'y', 'Z', 'z'],
        explanation:
          '按第11页汉语拼音字母表配对，不当英语字母读音课程；字体样式不替代原书观察与规范读音。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'letter-25',
        prompts: [
          '汉语拼音字母表：小写z对应哪个大写？',
          '换方向：大写Z对应哪个小写？',
        ],
        values: ['Z', 'z'],
        labels: ['Z', 'z', 'A', 'a'],
        explanation:
          '按第11页汉语拼音字母表配对，不当英语字母读音课程；字体样式不替代原书观察与规范读音。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'alphabet-order',
        prompts: [
          '字母表中A后紧接哪个大写？',
          '换位置：字母表中Y后紧接哪个大写？',
        ],
        values: ['B', 'Z'],
        labels: ['B', 'Z', 'A', 'Y'],
        explanation: '按26字母表顺序观察，不把表内视觉分行当不同字母表。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'alphabet-last',
        prompts: ['字母表第一项的大写是？', '字母表最后一项的小写是？'],
        values: ['A', 'z'],
        labels: ['A', 'z', 'Z', 'a'],
        explanation: '同一表的大小写配对和先后位置分开。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'writing',
        prompts: [
          '只比较文和识，哪字是本园地新增会写？',
          '只比较合和团，哪字是本园地新增会写？',
        ],
        values: ['文', '合'],
        labels: ['文', '合', '识', '团'],
        explanation: '新增会写文卡片合，田四白是已有字笔顺复用。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'stroke',
        prompts: [
          '第12页田四白共同提示哪条顺序？',
          '这条提示中，最后做的是什么？',
        ],
        values: ['先外后内再封口', '封口'],
        labels: ['先外后内再封口', '封口', '随意从内部开始'],
        explanation: '按原书规范示范观察，不用一条规则取代整字逐笔示范。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'poet',
        prompts: ['春晓原页署名作者是谁？', '署名朝代是哪项？'],
        values: ['孟浩然', '唐'],
        labels: ['孟浩然', '唐', '李峤'],
        explanation: '第12页署唐孟浩然，古诗可保留原文署名。',
        material: '春眠不觉晓，处处闻啼鸟。\n夜来风雨声，花落知多少。',
      },
      {
        key: 'poem-sound',
        prompts: ['按春晓，处处闻联系什么声音？', '按春晓，夜来联系什么声音？'],
        values: ['啼鸟', '风雨声'],
        labels: ['啼鸟', '风雨声', '汽车声'],
        explanation: '只按诗句找声音，不要求实际夜间出门观察。',
        material: '春眠不觉晓，处处闻啼鸟。\n夜来风雨声，花落知多少。',
      },
      {
        key: 'poem-info',
        prompts: ['诗中是否给出花落的准确数量？', '诗题的春指哪个季节？'],
        values: ['没有给出准确数量', '春季'],
        labels: ['没有给出准确数量', '春季', '准确给出十朵'],
        explanation:
          '花落知多少是疑问，不填造数量；晓联系清晨，不等于固定钟点。',
        material: '春眠不觉晓，处处闻啼鸟。\n夜来风雨声，花落知多少。',
      },
      {
        key: 'reading-region-0',
        prompts: [
          '先读第11页祖国多么广大：大兴安岭对应哪项景象？',
          '换方向：原诗雪花飞舞对应哪个地方？',
        ],
        values: ['雪花飞舞', '大兴安岭'],
        labels: ['雪花飞舞', '大兴安岭', '原诗给出准确日期'],
        explanation:
          '按樊发稼改选诗中对照景象找信息，不推广每年每地固定天气，不要求旅行或录入住址。',
        material:
          '先与家长共读原书第11页现代诗，再按指定地点/景象找信息；本站不提供全文原画录音。',
      },
      {
        key: 'reading-region-1',
        prompts: [
          '先读第11页祖国多么广大：长江两岸对应哪项景象？',
          '换方向：原诗柳枝发芽对应哪个地方？',
        ],
        values: ['柳枝发芽', '长江两岸'],
        labels: ['柳枝发芽', '长江两岸', '原诗给出准确日期'],
        explanation:
          '按樊发稼改选诗中对照景象找信息，不推广每年每地固定天气，不要求旅行或录入住址。',
        material:
          '先与家长共读原书第11页现代诗，再按指定地点/景象找信息；本站不提供全文原画录音。',
      },
      {
        key: 'reading-region-2',
        prompts: [
          '先读第11页祖国多么广大：海南岛对应哪项景象？',
          '换方向：原诗鲜花盛开对应哪个地方？',
        ],
        values: ['鲜花盛开', '海南岛'],
        labels: ['鲜花盛开', '海南岛', '原诗给出准确日期'],
        explanation:
          '按樊发稼改选诗中对照景象找信息，不推广每年每地固定天气，不要求旅行或录入住址。',
        material:
          '先与家长共读原书第11页现代诗，再按指定地点/景象找信息；本站不提供全文原画录音。',
      },
      {
        key: 'help-request',
        prompts: [
          '原创对话卡中，哪句把想借的物品说清楚？',
          '换角色：哪句是得到帮助后的感谢？',
        ],
        values: ['请问，可以借我一支彩笔吗？', '谢谢你！'],
        labels: ['请问，可以借我一支彩笔吗？', '谢谢你！', '你必须借给我！'],
        explanation:
          '本站原创卡示范表达作用，真实请求可用多种礼貌说法，对方可以拒绝，不把唯一例句强加实际表达。',
        material:
          '本站原创虚构对话：小禾问“请问，可以借我一支彩笔吗？”；对方说“可以”；小禾说“谢谢你！”；对方说“不客气”。不记录真实姓名。',
      },
      {
        key: 'help-response',
        prompts: ['原创对话中，哪句回应感谢？', '哪句可以用于礼貌询问？'],
        values: ['不客气', '请问'],
        labels: ['不客气', '请问', '必须答应所有要求'],
        explanation:
          '礼貌词按使用场合观察，真实回应可不同；不能保证只要礼貌就一定得到帮助。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'help-book',
        prompts: [
          '原书第13页拿书情境中，请谁帮拿书？',
          '同页借彩笔情境中，想借什么？',
        ],
        values: ['爸爸', '彩笔'],
        labels: ['爸爸', '彩笔', '足球'],
        explanation:
          '只找原书图文信息，不照搬为所有家庭人物分工，不要求学生攀爬书柜。',
        material: '先共读对应原书页，再看本题指定信息。',
      },
      {
        key: 'tongue-place',
        prompts: [
          '先读第14页：妞妞赶牛联系哪个地点？',
          '换一个信息：牛牛想吃哪种植物？',
        ],
        values: ['河边', '柳'],
        labels: ['河边', '柳', '松树'],
        explanation: '按传统绕口令信息找，绕口令不当现实赶牛或靠水活动指令。',
        material: '先与家长共读第14页传统绕口令妞妞赶牛，全文原图在原书。',
      },
      {
        key: 'tongue-action',
        prompts: ['绕口令中妞妞想护哪种植物？', '按结尾，牛牛后来怎样？'],
        values: ['柳', '扭头走'],
        labels: ['柳', '扭头走', '原书说明必须投石'],
        explanation:
          '按故事信息分辨人物目的与结尾，捡石头的情节不当学生模仿动作。',
        material: '先共读第14页传统绕口令，再按指定信息回看。',
      },
    ],
    steps: [
      {
        title: '五页园地一起看',
        text: '本园地印刷10—14页，包括识字加油站、字词句、书写、古诗、口语交际和亲子共读。目录或单页识字补充不能代替这五页。第三方公开预览来源，不补造ISBN版印次。',
        activity: '与家长看五页栏目。',
      },
      {
        title: '课本里的九个词',
        text: '识字、组词、读课文、计算、减法、列算式、图形、卡片、合唱团为本页九词。可以在实际课本寻找，不把某个词限定只属于一门学科。',
        activity: '实际读九词，再找一个课本里的例子。',
      },
      {
        title: '会认与会写分开',
        text: '本页会认识组计算减式图形卡合唱团共十二字，会写文卡片合四字。网页选择只记录选择，实际读音和书写分别尝试。',
        activity: '实际指读十二字。',
        visual: {
          kind: 'characters',
          grid: 'tian',
          characters: [
            '识',
            '组',
            '计',
            '算',
            '减',
            '式',
            '图',
            '形',
            '卡',
            '合',
            '唱',
            '团',
          ],
        },
      },
      {
        title: '前鼻音与后鼻音',
        text: '原页见万言半归an，长王羊上归ang，长在本处读cháng。先听规范示范再读，纸面按本页语境分组，不把字形答对当声音已准确。',
        activity: '实际读八字，纸面分两组写已有字。',
        visual: {
          kind: 'characters',
          grid: 'tian',
          characters: ['见', '万', '言', '半', '长', '王', '羊', '上'],
        },
      },
      {
        title: '汉语拼音字母表',
        text: '第11页为26个字母的大小写配对，A到Z与a到z对应。读一读记一记按汉语拼音字母表示范；不是英语字母课，页面字体形状可能不同。',
        activity: '实际指表、配对并尝试按顺序记忆。',
      },
      {
        title: '地域景象对照',
        text: '祖国多么广大作者樊发稼，选入有改动。先读原书现代诗，再找大兴安岭、长江两岸、海南岛不同景象，用对照理解广大。不以诗中描述推断当前全国天气。',
        activity: '实际朗读诗，口述一个景象对照。',
      },
      {
        title: '四个新写字',
        text: '按第10页原书范字实际写文卡片合，观察位置和规范示范。网页普通字体不是笔顺动画或描红范本。',
        activity: '纸面尝试四字，请家长看过程。',
        visual: {
          kind: 'characters',
          grid: 'tian',
          characters: ['文', '卡', '片', '合'],
        },
      },
      {
        title: '已有字的封口顺序',
        text: '第12页田四白提示先外后内再封口，三字为复用而非新增会写。逐笔观察原书或教师示范，不只看成字。',
        activity: '实际写田四白，说明最后封口的动作。',
        visual: {
          kind: 'characters',
          grid: 'tian',
          characters: ['田', '四', '白'],
        },
      },
      {
        title: '古诗春晓',
        text: '唐孟浩然《春晓》：\n春眠不觉晓，处处闻啼鸟。\n夜来风雨声，花落知多少。\n晓为清晨；声音与花落疑问分别找信息，不猜精确钟点或落花数量。原画与录音仍在外部教材。',
        activity: '实际朗读和尝试积累古诗，家长可示范。',
      },
      {
        title: '请你帮个忙',
        text: '第13页借彩笔、请爸爸拿书、足球情境用于请求帮助。先说明需要，再礼貌询问，得到帮助后回应；请请问您您好谢谢不客气按场合用。本站虚构卡是原创示例，合理实际表达不唯一判分。',
        activity: '轮流请求和回应，交换角色。',
      },
      {
        title: '说清楚并听回应',
        text: '实际请求帮助可被拒绝，听清回应再协商或换合理办法。第三幅足球图未给唯一完整请求句，不补造原书台词；不要求接触陌生人、攀爬或去河边实践。',
        activity: '对原书一个情境各说一种请求与合理回应。',
      },
      {
        title: '和大人读绕口令',
        text: '第14页妞妞赶牛为传统绕口令，原页未署个人作者。先慢读，比较妞牛扭等声音，再按自己情况练节奏；实际声音由家长听，不以文字选择自动判读音。故事情节不当赶牛或投石指令。',
        activity: '实际共读，再说听到的绕口词。',
      },
      {
        title: '记录实际发现',
        text: '记录一个字词、拼音、诗歌或请求帮助发现，再写下一次练习计划。家长可代写，未来计划不当已完成，不要求录音或个人身份。',
        activity: '保留发现和下一次计划。',
      },
    ],
    actual: [
      ['words', '实际朗读第10页九词，在自己的课本里找一个词例。'],
      ['recognize', '实际打乱顺序指读识组计算减式图形卡合唱团十二字。'],
      ['nasal', '听规范示范后实际读见万言半长王羊上，再按an/ang纸面分组。'],
      ['letters', '实际指第11页26字母大小写配对，按汉语拼音示范读表。'],
      ['remember', '实际尝试记一记汉语拼音字母表顺序，可回看。'],
      ['modern', '实际与家长朗读第11页祖国多么广大。'],
      ['contrast', '实际说明诗中不同地方景象的一处对照。'],
      ['write', '按第10页示范实际写文卡片合四字。'],
      ['stroke', '按第12页示范实际写田四白，观察先外后内再封口。'],
      ['poem', '实际朗读并尝试积累第12页唐孟浩然春晓。'],
      ['request', '实际用原书情境或原创虚构卡礼貌请求帮助，说明需要。'],
      ['response', '实际听对方回应再作合理回应，与家长交换角色。'],
      ['reading', '实际与家长慢读第14页妞妞赶牛，比较绕口词与节奏。'],
    ],
    reflections: [
      '记录一个实际学习发现。',
      '记录下一次练习计划，明确不是已经完成。',
    ],
  },
];
function makeLesson(e: Entry): Lesson {
  const id = `cl-${e.itemId}`;
  const choice = (
    key: string,
    prompt: string,
    labels: string[],
    value: string,
    explanation: string,
    review: boolean,
    material?: string,
  ): Question => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
    material,
    choices: labels.map((label) => ({ id: label, label })),
    rule: { kind: 'choice', value },
    hint: '先看指定字词与原书信息，需要时请家长帮读。',
    explanation,
  });
  const objective = (review: boolean): Question[] => [
    ...required(recognitionRows[e.itemId]).map((r, i) =>
      choice(
        `char-${i}`,
        r[review ? 2 : 1],
        required(recognitionRows[e.itemId]).map((x) => x[0]),
        r[0],
        '按指定词语认字，会认与会写清单分开，实际声音需另行确认。',
        review,
      ),
    ),
    ...e.pairs.map((p) =>
      choice(
        p.key,
        p.prompts[review ? 1 : 0],
        p.labels,
        p.values[review ? 1 : 0],
        p.explanation,
        review,
        p.material,
      ),
    ),
  ];
  return {
    id,
    title: e.title,
    textbookTitle: e.title,
    page: required(e.pages[0]),
    status: 'available',
    version: 1,
    goal: `按原书认${e.recognize}、写${e.write}，完成园地各栏目、朗读、纸面与表达。`,
    prerequisite: `准备第${e.pages.join('—')}页原书与田字格纸，可由家长陪读。`,
    parentTip:
      '本课正式教学与旧识字补充独立，认写范围按实际正文核对；来源按原书脚注，机构编写与改选来源不当个人作者，ISBN版印次未知。现代全文原画声音在外部原书或合法示范中查看，实际任务人工确认、反思null、计划不当完成，教师最终审校与全年规划仍需验收。',
    steps: e.steps,
    questions: [
      ...objective(false),
      ...e.actual.map(([key, prompt]): Question => ({
        id: `${id}-manual-${key}`,
        knowledge: `${id}-manual-${key}`,
        prompt,
        rule: { kind: 'manual' },
        hint: '实际尝试后确认，缺书、示范或纸笔可以暂时跳过。',
        explanation:
          '实际读背写说与客观答案分开，不自动评发音字迹，正确性null；计划不当已完成。',
      })),
      ...e.reflections.map((prompt, i): Question => ({
        id: `${id}-reflect-${i}`,
        knowledge: `${id}-reflect-${i}`,
        prompt,
        rule: { kind: 'reflection' },
        hint: '自己的话，家长可代写。',
        explanation:
          '保留原话、正确性null，开放表达不唯一判分，未来计划不当完成。',
      })),
    ],
    reviewQuestions: objective(true),
    review: {
      date: '2026-10-01',
      reviewer: '下册原书课文与活动范围校验',
      notes: `实际查看第三方原书公开预览（${lowerGardenOneSource.sourceUrl}）第${e.pages.join('—')}页，认${e.recognize}与写${e.write}分别核对，来源按原书脚注，ISBN版印次仍未知。本站讲解、字词问答与活动组织原创，现代全文原画声音外部共读；朗读与实际活动分别人工确认、反思null、计划不当完成，旧补充身份与历史不改写，不以两课声明下册或全年完成。`,
    },
  };
}
export const lowerGardenOneLesson = makeLesson(required(entries[0]));
