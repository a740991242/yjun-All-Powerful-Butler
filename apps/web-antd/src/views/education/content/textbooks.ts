import type { Subject, Volume } from '../learning/types';

import { sujiaoUpperTextbook } from './sujiao';
import { sujiaoLowerTextbook } from './sujiao-lower';

export interface TextbookItem {
  id: string;
  title: string;
  page: number;
  kind: 'activity' | 'garden' | 'lesson' | 'reading' | 'reference';
}
export interface TextbookUnit {
  id: string;
  title: string;
  items: TextbookItem[];
}
export interface Textbook {
  id: string;
  subject: Subject;
  volume: Volume;
  edition: 'pep-2024' | 'sujiao';
  resourceId: string;
  source: string;
  verifiedAt: string;
  units: TextbookUnit[];
}

type Entry = [title: string, page: number, kind?: TextbookItem['kind']];
function unit(id: string, title: string, entries: Entry[]): TextbookUnit {
  return {
    id,
    title,
    items: entries.map(([name, page, kind = 'lesson'], index) => ({
      id: `${id}-${index + 1}`,
      title: name,
      page,
      kind,
    })),
  };
}
function book(
  subject: Subject,
  volume: Volume,
  resourceId: string,
  units: TextbookUnit[],
): Textbook {
  return {
    id: `pep-${subject}-p1-${volume}-2024`,
    subject,
    volume,
    resourceId,
    edition: 'pep-2024',
    source: `https://book.pep.com.cn/${resourceId}/mobile/index.html`,
    verifiedAt: '2026-09-30',
    units,
  };
}

/** Six-three school system, verified official contents. This is not a claim of ready lessons. */
export const textbooks: Textbook[] = [
  book('chinese', 'upper', '1211001101241', [
    unit('school', '我上学了', [
      ['我是中国人', 2, 'activity'],
      ['我爱我们的祖国', 4, 'activity'],
      ['我是小学生', 6, 'activity'],
      ['我爱学语文', 7, 'activity'],
    ]),
    unit('u1', '第一单元 · 识字', [
      ['天地人', 8],
      ['金木水火土', 9],
      ['口耳目手足', 11],
      ['日月山川', 13],
      ['语文园地一', 15, 'garden'],
      ['快乐读书吧 · 读书真快乐', 19, 'reading'],
    ]),
    unit('u2', '第二单元 · 汉语拼音', [
      ['a o e', 20],
      ['i u ü', 22],
      ['b p m f', 24],
      ['d t n l', 26],
      ['语文园地二', 28, 'garden'],
    ]),
    unit('u3', '第三单元 · 汉语拼音', [
      ['g k h', 32],
      ['j q x', 34],
      ['z c s', 36],
      ['zh ch sh r', 38],
      ['y w', 40],
      ['语文园地三', 42, 'garden'],
    ]),
    unit('u4', '第四单元 · 汉语拼音', [
      ['ai ei ui', 45],
      ['ao ou iu', 47],
      ['ie üe er', 49],
      ['an en in un ün', 51],
      ['ang eng ing ong', 54],
      ['语文园地四', 56, 'garden'],
    ]),
    unit('u5', '第五单元 · 阅读', [
      ['秋天', 60],
      ['江南', 62],
      ['雪地里的小画家', 64],
      ['四季', 66],
      ['语文园地五', 68, 'garden'],
    ]),
    unit('u6', '第六单元 · 识字', [
      ['对韵歌', 73],
      ['日月明', 74],
      ['小书包', 76],
      ['升国旗', 78],
      ['语文园地六', 80, 'garden'],
    ]),
    unit('u7', '第七单元 · 阅读', [
      ['小小的船', 84],
      ['影子', 86],
      ['两件宝', 88],
      ['语文园地七', 90, 'garden'],
    ]),
    unit('u8', '第八单元 · 阅读', [
      ['比尾巴', 95],
      ['乌鸦喝水', 97],
      ['雨点儿', 99],
      ['语文园地八', 101, 'garden'],
    ]),
    unit('reference', '书后工具', [
      ['识字表', 105, 'reference'],
      ['写字表', 108, 'reference'],
      ['笔画名称表', 109, 'reference'],
      ['常用偏旁名称表', 110, 'reference'],
    ]),
  ]),
  book('chinese', 'lower', '1211001102241', [
    unit('u1', '第一单元 · 识字', [
      ['春夏秋冬', 2],
      ['姓氏歌', 4],
      ['小青蛙', 6],
      ['猜字谜', 8],
      ['语文园地一', 10, 'garden'],
      ['快乐读书吧 · 读读童谣和儿歌', 15, 'reading'],
    ]),
    unit('u2', '第二单元 · 阅读', [
      ['热爱中国共产党', 16],
      ['吃水不忘挖井人', 18],
      ['我多想去看看', 20],
      ['语文园地二', 22, 'garden'],
    ]),
    unit('u3', '第三单元 · 阅读', [
      ['小公鸡和小鸭子', 26],
      ['树和喜鹊', 29],
      ['怎么都快乐', 31],
      ['语文园地三', 34, 'garden'],
    ]),
    unit('u4', '第四单元 · 阅读', [
      ['静夜思', 39],
      ['夜色', 40],
      ['端午粽', 42],
      ['语文园地四', 44, 'garden'],
    ]),
    unit('u5', '第五单元 · 识字', [
      ['动物儿歌', 48],
      ['古对今', 50],
      ['操场上', 52],
      ['人之初', 54],
      ['语文园地五', 56, 'garden'],
    ]),
    unit('u6', '第六单元 · 阅读', [
      ['古诗二首 · 池上、小池', 61],
      ['浪花', 64],
      ['荷叶圆圆', 66],
      ['要下雨了', 69],
      ['语文园地六', 73, 'garden'],
    ]),
    unit('u7', '第七单元 · 阅读', [
      ['文具的家', 78],
      ['一分钟', 81],
      ['动物王国开大会', 84],
      ['小猴子下山', 90],
      ['语文园地七', 93, 'garden'],
    ]),
    unit('u8', '第八单元 · 阅读', [
      ['棉花姑娘', 98],
      ['咕咚', 102],
      ['小壁虎借尾巴', 105],
      ['语文园地八', 109, 'garden'],
    ]),
    unit('reference', '书后工具', [
      ['识字表', 114, 'reference'],
      ['写字表', 117, 'reference'],
      ['常用偏旁名称表', 120, 'reference'],
    ]),
  ]),
  book('math', 'upper', '1221001101241', [
    unit('games', '数学游戏', [['数学游戏', 1, 'activity']]),
    unit('u1', '5以内数的认识和加、减法', [['5以内数的认识和加、减法', 12]]),
    unit('u2', '6～10的认识和加、减法', [['6～10的认识和加、减法', 34]]),
    unit('u3', '认识立体图形', [['认识立体图形', 67]]),
    unit('u4', '11～20的认识', [['11～20的认识', 73]]),
    unit('u5', '20以内的进位加法', [['20以内的进位加法', 88]]),
    unit('u6', '复习与关联', [['复习与关联', 103]]),
  ]),
  book('math', 'lower', '1221001102241', [
    unit('u1', '认识平面图形', [['认识平面图形', 1]]),
    unit('u2', '20以内的退位减法', [['20以内的退位减法', 8]]),
    unit('u3', '100以内数的认识', [['100以内数的认识', 23]]),
    unit('u4', '100以内的口算加、减法', [['100以内的口算加、减法', 43]]),
    unit('u5', '100以内的笔算加、减法', [['100以内的笔算加、减法', 56]]),
    unit('u6', '数量间的加减关系', [['数量间的加减关系', 69]]),
    unit('shopping', '欢乐购物街', [['欢乐购物街', 77, 'activity']]),
    unit('u7', '复习与关联', [['复习与关联', 83]]),
  ]),
];

export function findTextbook(
  subject: unknown,
  edition: unknown,
  volume: unknown,
) {
  if (subject === 'math' && edition === 'sujiao') {
    if (volume === 'upper') return sujiaoUpperTextbook;
    if (volume === 'lower') return sujiaoLowerTextbook;
  }
  return textbooks.find(
    (item) =>
      item.subject === subject &&
      item.edition === edition &&
      item.volume === volume,
  );
}
