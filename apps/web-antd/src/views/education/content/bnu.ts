import type { Book, Lesson, Question } from '../learning/types';
import type { Textbook } from './textbooks';

import {
  bnuDifferenceLesson,
  bnuHiddenLesson,
  bnuTwoStepLesson,
} from './bnu-applications';
import { bnuBuildingInstructionsLesson } from './bnu-building';
import {
  bnuClassificationLesson,
  bnuRoomSortLesson,
} from './bnu-classification';
import { bnuClassroomLesson } from './bnu-classroom';
import { bnuComparisonLesson } from './bnu-comparison';
import { bnuDayRecordLesson } from './bnu-day';
import { bnuFinalClassificationLesson } from './bnu-final-classification';
import { bnuFinalNumberTalkLesson } from './bnu-final-numbers';
import { bnuFinalColorPatternsLesson } from './bnu-final-patterns';
import { bnuFinalPositionTimeLesson } from './bnu-final-position';
import { bnuFinalNumberPracticeLesson } from './bnu-final-practice';
import { bnuFinalSolidsLesson } from './bnu-final-solids';
import { bnuFiveAddLesson } from './bnu-five-add';
import {
  bnuFiveOrganizeLesson,
  bnuFiveSubtractLesson,
} from './bnu-five-finish';
import { bnuCountOrderLesson, bnuZeroLesson } from './bnu-numbers';
import { bnuOrganizeLesson } from './bnu-organize';
import {
  bnuSchoolGamesLesson,
  bnuSchoolHarvestLesson,
} from './bnu-school-activities';
import { bnuSixCardGameLesson } from './bnu-six-card-game';
import { bnuSixNineRelationsLesson } from './bnu-six-nine-relations';
import { bnuSixTenLesson } from './bnu-six-ten';
import { bnuSolidRecognitionLesson } from './bnu-solids';
import { bnuTenPartitionsLesson } from './bnu-ten';
import {
  bnuTenFactTablesLesson,
  bnuTenOrganizeGameLesson,
} from './bnu-ten-finish';
import { bnuBuildingTowerLesson } from './bnu-tower';

// Original textbook pages viewed in a third-party public reader, not publisher-hosted scans.
export const bnuUpperSource = {
  preview: 'https://keben.app/book/0061',
  publisherPortal: 'https://jiaoshi.bnupg.com/',
  checkedAt: '2026-10-04',
  coverApprovalYear: 2024,
  isbn: null,
  printing: null,
  readPrintedPages: [
    2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
    23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
    42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
    61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79,
    80, 81, 82, 83, 84, 85, 86, 87,
  ],
  contents: [
    ['school', '我上学啦', 2],
    ['u1', '生活中的数', 12],
    ['u2', '5以内数加与减', 29],
    ['classroom', '介绍我的教室', 40],
    ['u3', '整理与分类', 43],
    ['u4', '10以内数加与减', 48],
    ['games', '一起做游戏', 70],
    ['u5', '有趣的立体图形', 72],
    ['day', '记录我的一天', 78],
    ['final', '总复习', 81],
  ] as const,
};
const id = 'bnu-upper-school-observe';
function task(
  suffix: string,
  prompt: string,
  rule: Question['rule'],
  hint: string,
  explanation: string,
): Question {
  return {
    id: `${id}-${suffix}`,
    knowledge: id,
    prompt,
    rule,
    hint,
    explanation,
  };
}
function choice(
  suffix: string,
  prompt: string,
  value: string,
  labels: string[],
  explanation: string,
): Question {
  return {
    ...task(
      suffix,
      prompt,
      { kind: 'choice', value },
      '回看明确给出的对象与数量，不从例子推自己的情况。',
      explanation,
    ),
    choices: labels.map((label) => ({ id: label, label })),
  };
}
export const bnuSchoolLesson: Lesson = {
  id,
  textbookTitle: '我上学啦',
  title: '校园里的数量与认识新同伴',
  page: 2,
  version: 2,
  status: 'available',
  goal: '从校园物品和虚构自我介绍中找到数量，区分编号、数量与外形描述，并真实介绍自己。',
  prerequisite: '会逐个指认少量物品；无需先会写数字或做加减法。',
  parentTip:
    '对应北师大上册2～5页。本站情境与题目原创，不复制原画或人物对话。原书观察需要纸质教材或合法电子预览；不要求进校园。家庭、年龄和喜好可选择愿意说的内容，不收集真实姓名或地址。',
  review: {
    date: '2026-10-04',
    reviewer: '原书公开预览逐页阅读与程序核对',
    notes:
      '封面2024审核、目录两页及印刷2～8页已实际查看；本课仅对应2～5页。2026-10-04重看本地原书第3页补外形观察，不冒再次联网读取；第三方预览不冒出版社官方，ISBN与印次保持未知。',
  },
  steps: [
    {
      title: '先说清在数什么',
      text: '观察已有书本、笔盒或纸卡，选择一类物品逐个数。同一个物品只数一次，笔盒里的笔和笔盒本身不是同一类。图中有三本书，只数书本。',
      visual: { kind: 'count', count: 3 },
      activity: '拿出已有少量物品，明确类别后逐个点数；缺材料可画原创纸卡。',
    },
    {
      title: '数量与编号用途不同',
      text: '虚构的一年级2班有4张值日卡。“2班”是班级编号，不表示只有2名同学；数卡片时看实际4张。日期、班级和数量里的数字要结合用途理解。',
      visual: { kind: 'count', count: 4 },
      activity:
        '找一个身边数字，说明它是编号还是数量。不必透露自己的学校班级。',
    },
    {
      title: '介绍自己的数字',
      text: '虚构的小禾说有3本喜欢的书。数字3说明书的本数。介绍自己时可以说喜欢的东西或自己数过的物品，不必和小禾一样；未核对的数量可以先不说。',
      visual: { kind: 'count', count: 3 },
      activity: '选择愿意分享的一件事，先核对数量再说给家长或同伴听。',
    },
    {
      title: '认真听新同伴',
      text: '虚构的阿林刚认识4位新同伴。4位指新同伴，不包含阿林本人；若改问这组共有多少人，就必须重新明确是否包含本人。这一课先把所数对象说清楚，不要求用加法。',
      activity:
        '听一次对方的介绍，复述数字指什么，请对方核对。不从外表猜年龄或家庭成员。',
    },
    {
      title: '观察物品的外形',
      text: '对照原书第3页观察球和栏杆，用圆圆的、长长的、方方的描述所看到的外形。说外形不等于数物品，也不能推出物品轻重。本站图是原创平面圆片和长方片；纸片与能拿起的球、栏杆不是同一种物体，不把圆片叫成球体。此时先观察和表达，不要求背正式图形定义。',
      visual: {
        kind: 'plane-cards',
        cards: [
          { shape: 'circle', size: 1, turn: 0 },
          { shape: 'rectangle', size: 1, turn: 0 },
        ],
      },
      activity:
        '实际对照第3页指出球与栏杆，再观察家中安全物品或平面纸片，用自己的话描述外形；两类对象分别说明。',
    },
    {
      title: '回看原书与自己的发现',
      text: '对照原书2～3页找动物、班牌或形状，再读4～5页的介绍。原书图中找到的对象和自己的实际环境分别记录；原书角色说的话不当自己的经历。',
      activity:
        '看过原书后说出一个数量发现和一个数字用途，找不到可以保留疑问。',
    },
  ],
  questions: [
    {
      ...task(
        'q1',
        '只数图中的书本标记，有几本？',
        { kind: 'number', value: 3 },
        '一个标记对应一本，每个只数一次。',
        '三个标记对应三本书。',
      ),
      visual: { kind: 'count', count: 3 },
    },
    choice(
      'q2',
      '一年级2班有4张值日卡。“2班”的2在这里表示什么？',
      '班级编号',
      ['班级编号', '同学人数', '卡片数量'],
      '2用于区分班级，卡片数量需数卡片，不能由班号推人数。',
    ),
    {
      ...task(
        'q3',
        '原创场景明确有4张值日卡，只问卡片数量，填几？',
        { kind: 'number', value: 4 },
        '数的对象是卡片，不是班号。',
        '已明确给出4张卡片，数字2是另一个用途。',
      ),
      visual: { kind: 'count', count: 4 },
    },
    choice(
      'q4',
      '小禾说有3本喜欢的书，这里的3指什么？',
      '喜欢的书的本数',
      ['喜欢的书的本数', '小禾的年龄', '小禾的班号'],
      '数字意义随对象变化，句子明确说书的本数。',
    ),
    choice(
      'q5',
      '阿林认识了4位新同伴，只数这4位新同伴时，要不要再把阿林算进去？',
      '不要',
      ['要', '不要'],
      '所问对象仅新同伴，不能把阿林混入；改问全组需要重新看范围。',
    ),
    choice(
      'q6',
      '看见同伴个子高，能直接知道他几岁吗？',
      '不能',
      ['能', '不能'],
      '身高不能直接给出年龄，信息未知时不要猜成确定事实。',
    ),
    task(
      'actual-count',
      '实际选一类已有物品，逐个点数并核对；做过再确认。',
      { kind: 'manual' },
      '物品少量即可，明确类别，每个只数一次。',
      '只记录实际点数，不由网页答对代替。',
    ),
    task(
      'actual-number',
      '实际找一个身边数字，说清用途并与家长核对；做过再确认。',
      { kind: 'manual' },
      '可以用书页或虚构班牌，不需透露个人信息。',
      '只记录实际观察与说明，不自动评价理解。',
    ),
    task(
      'actual-introduce',
      '实际介绍一件愿意分享且含数量的事，再听同伴介绍并复述；做过再确认。',
      { kind: 'manual' },
      '可不谈家庭年龄；没有同伴时跳过交流任务。',
      '交流完成需真实参与，不从选择题推断已完成。',
    ),
    task(
      'actual-book',
      '实际对照原书2～5页找到一个数量和一个数字用途；看过再确认。',
      { kind: 'manual' },
      '使用纸书或合法预览，不把本站原创例子冒原图。',
      '没有教材可跳过，不自动确认原书已读。',
    ),
    task(
      'actual-shape',
      '实际观察第3页的球与栏杆，或已有安全物品/纸片，描述外形并说明所用对象；做过再确认，替代纸片不能记成已看原书。',
      { kind: 'manual' },
      '只观察可安全接触的已有物品，不需进校园或购买材料。',
      '真实观察独立记录，网页图片和答对不替代观察活动。',
    ),
    choice(
      'shape-description',
      '描述球圆圆的、栏杆长长的方方的，这里主要是在说什么？',
      '物品的外形',
      ['物品的外形', '同伴的人数', '物品的重量'],
      '这些话描述外形，不能直接给出人数或重量。',
    ),
    choice(
      'flat-round',
      '一张平面圆片和能拿起的球都可以说圆圆的，就能当作同一种物体吗？',
      '不能，纸片与球分别观察',
      ['能，完全同一种物体', '不能，纸片与球分别观察'],
      '共同的外形描述不表示平面纸片和立体球是同一种物体。',
    ),
    task(
      'reflection',
      '记录自己发现的一个数字用途或还不明白的问题。',
      { kind: 'reflection' },
      '写真实想法，家长可代录；不需要填写姓名。',
      '没有统一答案，不计客观正确率。',
    ),
  ],
  reviewQuestions: [
    {
      ...task(
        'r1',
        '换一张图，仍只数书本标记，现在有几本？',
        { kind: 'number', value: 5 },
        '逐个数新图，不沿用旧图数量。',
        '新图为五本，主练图为三本。',
      ),
      visual: { kind: 'count', count: 5 },
    },
    choice(
      'r2',
      '虚构一年级3班有2张活动卡，问卡片数量应该看哪条信息？',
      '2张活动卡',
      ['3班', '2张活动卡', '一年级'],
      '改换编号和数量仍须按所问对象读取。',
    ),
    choice(
      'r3',
      '小岚说自己有2个笔盒，2指什么？',
      '笔盒数量',
      ['年龄', '班号', '笔盒数量'],
      '新语境中数字2对应笔盒数量。',
    ),
    choice(
      'r4',
      '只问新认识的同伴人数，能把介绍者本人加入这个数量吗？',
      '不能',
      ['能', '不能'],
      '范围明确为新同伴，介绍者本人属于另一个对象。',
    ),
    choice(
      'r-shape',
      '换一个发现：孩子说纸条长长的，这能确定纸条比书本更重吗？',
      '不能，长长描述外形，轻重要另比较',
      ['能，长长一定更重', '不能，长长描述外形，轻重要另比较'],
      '外形描述不能推出两个对象的轻重。',
    ),
  ],
};
export const bnuUpperTextbook: Textbook = {
  id: 'bnu-math-p1-upper-2024',
  subject: 'math',
  volume: 'upper',
  edition: 'bnu-2024',
  resourceId: 'keben-0061',
  source: bnuUpperSource.preview,
  verifiedAt: bnuUpperSource.checkedAt,
  units: bnuUpperSource.contents.map(([key, title, page]) => ({
    id: key,
    title,
    items: [
      {
        id: `${key}-1`,
        title,
        page,
        kind: ['classroom', 'day', 'games', 'school'].includes(key)
          ? 'activity'
          : 'lesson',
      },
    ],
  })),
};
function lessonsForUnit(key: string, title: string, page: number): Lesson[] {
  if (key === 'school')
    return [bnuSchoolLesson, bnuSchoolGamesLesson, bnuSchoolHarvestLesson];
  if (key === 'u1')
    return [
      bnuCountOrderLesson,
      bnuZeroLesson,
      bnuSixTenLesson,
      bnuComparisonLesson,
      bnuOrganizeLesson,
    ];
  if (key === 'u2')
    return [bnuFiveAddLesson, bnuFiveSubtractLesson, bnuFiveOrganizeLesson];
  if (key === 'classroom') return [bnuClassroomLesson];
  if (key === 'u3') return [bnuRoomSortLesson, bnuClassificationLesson];
  if (key === 'day') return [bnuDayRecordLesson];
  if (key === 'games') return [bnuSixCardGameLesson];
  const pending: Lesson = {
    id: `bnu-upper-${key}-pending`,
    textbookTitle: title,
    title,
    page,
    goal: '教材目录已核对，正文课程尚未制作。',
    prerequisite: '',
    parentTip: '不使用其他版本课包改名替代。',
    version: 1,
    status: 'preparing',
    steps: [],
    questions: [],
    review: {
      date: bnuUpperSource.checkedAt,
      reviewer: '原书两页目录核对',
      notes: '目录核验不表示正文课程已经完成。',
    },
  };
  if (key === 'u5')
    return [
      bnuSolidRecognitionLesson,
      bnuBuildingInstructionsLesson,
      bnuBuildingTowerLesson,
    ];
  if (key === 'u4')
    return [
      bnuSixNineRelationsLesson,
      bnuTenPartitionsLesson,
      bnuTwoStepLesson,
      bnuDifferenceLesson,
      bnuHiddenLesson,
      bnuTenFactTablesLesson,
      bnuTenOrganizeGameLesson,
    ];
  if (key === 'final')
    return [
      bnuFinalNumberTalkLesson,
      bnuFinalNumberPracticeLesson,
      bnuFinalColorPatternsLesson,
      bnuFinalSolidsLesson,
      bnuFinalClassificationLesson,
      bnuFinalPositionTimeLesson,
    ];
  return [pending];
}
export const bnuUpperBook: Book = {
  id: bnuUpperTextbook.id,
  subject: 'math',
  volume: 'upper',
  edition: 'bnu-2024',
  title: '一年级数学上册 · 北师大版（2024审核）',
  source: bnuUpperSource.preview,
  verifiedAt: bnuUpperSource.checkedAt,
  units: bnuUpperSource.contents.map(([key, title, page]) => ({
    id: key,
    title,
    page,
    lessons: lessonsForUnit(key, title, page),
  })),
};
