import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';

const id = 'cu-u1-5-comparison';
const numerals = ['六', '七', '八', '九', '十'];
function choice(
  suffix: string,
  knowledge: string,
  prompt: string,
  labels: string[],
  value: string,
  hint: string,
  explanation: string,
): Question {
  return {
    id: `${id}-${suffix}`,
    knowledge,
    prompt,
    choices: labels.map((label) => ({ id: label, label })),
    rule: { kind: 'choice', value },
    hint,
    explanation,
  };
}
const pairs = [
  {
    letters: ['人', '天'],
    first: '天',
    second: '人',
    feature: '有两条横画',
    absent: '由撇和捺组成，没有横画',
    word: '天气',
    other: '大人',
  },
  {
    letters: ['口', '田'],
    first: '田',
    second: '口',
    feature: '外框里面还有一条横线和一条竖线',
    absent: '外框里面没有横线或竖线',
    word: '田地',
    other: '开口',
  },
  {
    letters: ['日', '目'],
    first: '目',
    second: '日',
    feature: '外框里面有两条横线',
    absent: '外框里面有一条横线',
    word: '目光',
    other: '日光',
  },
];
const tasks = (review: boolean): Question[] => [
  ...numerals.map((character, index) => ({
    ...choice(
      `${review ? 'r' : 'q'}-number-${index}`,
      `cu-recognize-u${required(character.codePointAt(0)).toString(16)}`,
      review
        ? '看这张数字汉字卡，哪个数字与它表示的数量相同？'
        : '先数小圆片，再选出表示这个数量的汉字。',
      review ? ['6', '7', '8', '9', '10'] : numerals,
      review ? String(index + 6) : character,
      review
        ? '先请家长读字，再想它表示多少。'
        : '可以一个一个数；数过的小圆片不要重复数。',
      review
        ? `字卡“${character}”表示数量${index + 6}。`
        : `图中共有${index + 6}个小圆片，数量可以写作“${character}”。`,
    ),
    visual: review
      ? {
          kind: 'characters' as const,
          characters: [character],
          grid: 'tian' as const,
        }
      : { kind: 'count' as const, count: index + 6 },
    material: review
      ? '新的练习方向：根据数字汉字卡判断它表示的数量。'
      : '原创圆片用于表示数量；认读汉字与数学口算分开。',
  })),
  ...pairs.flatMap((pair, index) => [
    {
      ...choice(
        `${review ? 'r' : 'q'}-shape-${index}`,
        `${id}-shape-${index}`,
        review
          ? `看看这两个字，哪个字${pair.absent}？`
          : `看看这两个字，哪个字${pair.feature}？`,
        pair.letters,
        review ? pair.second : pair.first,
        '先看字的外形，再看横线和竖线；这道题比较字形，不猜笔顺。',
        `“${pair.first}”${pair.feature}；“${pair.second}”${pair.absent}。`,
      ),
      visual: {
        kind: 'characters' as const,
        characters: pair.letters,
        grid: 'tian' as const,
      },
    },
    {
      ...choice(
        `${review ? 'r' : 'q'}-word-${index}`,
        `${id}-word-${index}`,
        review
          ? `补全词语“${pair.other.replace(pair.second, '□')}”。`
          : `补全词语“${pair.word.replace(pair.first, '□')}”。`,
        pair.letters,
        review ? pair.second : pair.first,
        '请家长读完整词语，再观察这两个字的区别。',
        `补完整是“${review ? pair.other : pair.word}”，这里应选“${review ? pair.second : pair.first}”。`,
      ),
      visual: {
        kind: 'characters' as const,
        characters: pair.letters,
        grid: 'tian' as const,
      },
    },
  ]),
  choice(
    `${review ? 'r' : 'q'}-riddle`,
    `${id}-riddle-clues`,
    review
      ? '原创谜语：从云里落下的小水滴，落地让路面变湿。猜一猜是什么。'
      : '原创谜语：寒冷时从云中慢慢飘落的白色小片，天气暖了会融化。猜一猜是什么。',
    ['雪', '雨', '落叶'],
    review ? '雨' : '雪',
    '把颜色、形态和变化等线索联系起来；猜谜不只看一个词。',
    review
      ? '小水滴从云中落下、让路面变湿，线索指向雨。'
      : '白色小片、寒冷时飘落、暖时融化，线索指向雪。',
  ),
];
export const gardenOneComparison: Lesson = {
  id,
  textbookTitle: '语文园地一',
  title: '语文园地一：数字、字形比较与纸笔（原创活动）',
  page: 15,
  version: 1,
  status: 'available',
  goal: '认读六至十，观察三组形近字的区别；在教材示范下练习六、七、八、十，用线索说明猜谜理由。',
  prerequisite:
    '请家长陪读题目与谜语；数量图可逐个数，不要求孩子独立阅读全部说明。',
  parentTip:
    '仅覆盖已核验第15页活动范围，不代替园地一第16至18页。字卡供辨形，不是描红范本；笔顺与纸笔书写使用教材或教师标准示范，朗读和表达人工确认。',
  steps: [
    {
      title: '数字也能用汉字写',
      text: '6、7、8、9、10可以分别用六、七、八、九、十记录。请家长逐字示范读音，孩子跟读；再数圆片，把数量与字对应。',
      visual: { kind: 'characters', characters: numerals, grid: 'tian' },
      activity: '分别拿出6至10个安全的小物品，数一数，再指认对应汉字。',
    },
    {
      title: '看清形近字的不同',
      text: '人和天：天有两条横画，人没有横画。口和田：田的外框里有横线和竖线，口的框里没有。日和目：日的框里有一条横线，目有两条。先观察字形，再联系词语，不根据字体大小判断。',
      visual: {
        kind: 'characters',
        characters: ['人', '天', '口', '田', '日', '目'],
        grid: 'tian',
      },
      activity: '每组分别指读，再向家长说明你看到了哪处不同。',
    },
    {
      title: '把字放进词语',
      text: '大人、天气；开口、田地；日光、目光。请家长读这些原创词语，孩子指字。认清字形后，还要看词语的意思，不能只看字长得像。',
      activity: '选一组词，试着说一个生活中的句子。',
    },
    {
      title: '纸笔练习要有标准示范',
      text: '第15页会写字是六、七、八、十。请准备教材或教师示范，观察笔画和在田字格中的位置，再练习。本站普通字体只供辨认，不用它当作描红或笔顺动画。',
      activity:
        '有示范时练习这四个字；先观察，再写，再与示范比较。缺示范时可跳过并稍后补做。',
    },
    {
      title: '猜一猜，还要说理由',
      text: '第15页包含猜谜与认读活动。教材的谜语请回到教材读；本站另编谜语练习找线索。家长先读，孩子猜，再说出支持答案的线索；还可以自己编一个短谜语。',
      activity:
        '亲子阅读教材第15页，练习朗读和猜谜；不播放未授权教材录音，也不自动评分朗读。',
    },
  ],
  questions: [
    ...tasks(false),
    {
      id: `${id}-read`,
      knowledge: `${id}-oral`,
      prompt:
        '请家长打乱六、七、八、九、十的顺序指字，孩子认读；再读大人、天气、开口、田地、日光、目光。需要时可以示范后重读。',
      material: '六　七　八　九　十\n大人　天气　开口　田地　日光　目光',
      rule: { kind: 'manual' },
      hint: '少量分次认读，先指字再读词。',
      explanation: '人工确认记录完成，不能据此自动判定读音正确或已经掌握。',
    },
    {
      id: `${id}-write`,
      knowledge: `${id}-writing`,
      prompt:
        '有教材第15页或教师规范示范时，在纸上练习六、七、八、十，请家长查看。没有示范可跳过，不用屏幕普通字体冒充描红范本。',
      material: '会写范围：六、七、八、十。',
      rule: { kind: 'manual' },
      hint: '先看示范，再动笔；注意坐姿、握笔和字的位置。',
      explanation: '纸笔活动人工确认，系统不自动判断真实笔顺、字形或书写质量。',
    },
    {
      id: `${id}-express`,
      knowledge: `${id}-oral-reason`,
      prompt:
        '请家长读这则原创谜语，孩子猜一猜，再说出两条支持答案的线索；也可以用自己的话编一个短谜语。',
      material: '寒冷时从云中慢慢飘落的白色小片，天气暖了会融化。',
      rule: { kind: 'manual' },
      hint: '可以从“我猜是……，因为……”开始说。',
      explanation:
        '合理表达由孩子或家长确认，不因说法不同自动判错；选择题答对不替代实际表达。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-09-30',
    reviewer: '官方第15页活动范围核验与原创任务校验',
    notes:
      '来源：人教社2024审定六三学制上册官方资源1211001101241，印刷第15页（阅读器21）：https://book.pep.com.cn/1211001101241/files/mobile/21.jpg 。实际重新查看已保存的官方页面，核对数字六至十、会写六七八十、人/天、口/田、日/目字形比较及猜谜活动。只覆盖这一页，不宣称整个园地已审校；谜语、数量图和词语题均为原创，不复制教材插画、韵文或笔顺图。尚待教师最终人工审校。',
  },
};
