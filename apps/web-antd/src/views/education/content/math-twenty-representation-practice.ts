import type { Question } from '../learning/types';

const position = 'mu-twenty-positions';
export function twentyDescriptionQuestions(review: boolean): Question[] {
  const shift = review ? 1 : 0;
  const start = 12 + shift;
  const descriptions: readonly (readonly [string, number])[] = [
    [`${start}和${start + 2}中间的数`, start + 1],
    [`1个十和${2 + shift}个一`, start],
    [`比${start + 6}小1的数`, start + 5],
    [`从${start + 1}后面的第1个数开始数，第3个数`, start + 4],
    [`1个十和${8 + shift}个一`, start + 6],
    [`${5 + shift}个一和1个十`, start + 3],
  ];
  const question = (
    key: string,
    prompt: string,
    rule: Question['rule'],
  ): Question => ({
    id: `${position}-${review ? 'r' : 'q'}-description-${key}`,
    knowledge: `${position}-description-${key}`,
    prompt,
    rule,
    hint: '先按完整数序读条件；后面的第1个不包含起点，几个十和几个一合成一个数。',
    explanation:
      '分别核对已知条件与所求，不能用一次连线替代全部描述；相同数可以对应不同描述。',
  });
  return [
    ...descriptions.map(([text, value], i): Question => ({
      ...question(
        String(i),
        `自制数字卡${start}～${start + 6}完整排列。为“${text}”选对应的数；每条独立核对。`,
        { kind: 'choice', value: String(value) },
      ),
      choices: Array.from({ length: 7 }, (_, n) => ({
        id: String(start + n),
        label: String(start + n),
      })),
    })),
    {
      ...question(
        'strip',
        '这些自制数卡按从小到大连续排，依照图中字母次序填全部空格。',
        { kind: 'steps', values: [start, start + 3, start + 6] },
      ),
      visual: {
        kind: 'number-strip',
        values: [null, start + 1, start + 2, null, start + 4, start + 5, null],
      },
    },
  ];
}
export const twentyRepresentationSourceTasks = [
  [
    'ten-groups',
    '实际回第75页做一做第2项，两个原物品图分别圈出10个，再逐个数散出的数量并填完整十和一组成；每个物品只数一次，两图不能只做一图。本站实际两把材料不替代原图。',
  ],
  [
    'draw-counters',
    '实际回第75页做一做第3项，先说明已画示例怎样对应数量，再给另两幅原花图各画完整十位/个位珠并写数；环形标起点防重漏，不把表示10误画成个位10颗。',
  ],
  [
    'tadpoles',
    '实际回第79页练一练第1项，在原蝌蚪图圈10只后接着数，完整记录总只数；背景气泡和水草不计为蝌蚪，不用本站原创小棒数量替代原图。',
  ],
  [
    'five-numbers',
    '实际回第79页练一练第2项，五个指定数全部分别摆出，读数并解释十和一，每次恢复材料后再摆下一数。原五个数与本站旧步骤的五个原创数不同，不互相替代。',
  ],
  [
    'group-counts',
    '实际回第79页练一练第3项，樱桃、香蕉、花三组全部分别数清。按本题指定单位数单个物品，不把一对、一把或一排当一个；保存三份结果与核对过程，未看清原图可待核对。',
  ],
  [
    'three-representations',
    '实际回第79页练一练第4项，原珠串、小棒、计数器三幅图各自读数并写数。圈十与散颗、十根一捆与散根、十位珠与个位珠分别解释，不因外观看起来同样多就合并任务。',
  ],
  [
    'read-counters',
    '实际回第77页做一做第1项，两幅原计数器分别写数并读出，说明个位没有珠时为何仍要写0；实际读音和字形由陪学者核对，不由网页分数自动确认。',
  ],
  [
    'complete-counters',
    '实际回第86页练一练第2项，先核对已给的17示例，再在其余三个原计数器全部画珠并核对对应数，0表示该位没有珠但不是未做；纸面作品与本站数位示例分别记录。',
  ],
] as const;
export const twentyPositionSourceTasks = [
  [
    'flag-ranges',
    '实际回第80页练一练第6项，按原图第6面与第20面定位，分别完成从左第10面、最右4面、从第10面到第15面连两端共几面三个要求。图左省略号不是0面，先根据给定编号恢复位置；一面与四面范围不能混同。',
  ],
  [
    'train-descriptions',
    '实际回第80页练一练第7项，先按连续顺序填完整三处原车厢空格，再核对六条数字描述全部连线；不同描述可以对应同一车厢，不强制六个不同答案。本站自制数卡与原列车分别记录，未处理原书可暂跳。',
  ],
] as const;
