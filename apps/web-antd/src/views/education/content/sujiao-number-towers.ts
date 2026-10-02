import type {
  Lesson,
  NumberTowerVisual,
  Question,
  TowerRows,
} from '../learning/types';

import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-number-towers';
function tower(rows: TowerRows): NumberTowerVisual {
  return { kind: 'number-tower', rows };
}
function tasks(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const models: TowerRows[] = review
    ? [
        [[null], [null, null], [2, 3, 4]],
        [[null], [null, 8], [7, 4, null]],
        [[18], [10, null], [null, null, null]],
        [[null], [5, null], [5, 0, 4]],
        [[null], [null, null], [1, 4, 2]],
      ]
    : [
        [[null], [null, null], [3, 4, 5]],
        [[null], [null, 6], [8, 2, null]],
        [[16], [9, null], [null, null, null]],
        [[null], [4, null], [4, 0, 3]],
        [[null], [null, null], [2, 3, 4]],
      ];
  return [
    ...models.map((rows, index): Question => ({
      id: `${prefix}-fill-${index}`,
      knowledge: `${id}-fill-${index}`,
      prompt: `第${index + 1}座数塔。上面一格等于下面相邻两格之和，按A开始的标记顺序填完；${index === 2 ? '这座数塔可能有多种答案，填一种即可。' : '逐层检查所有相邻关系。'}`,
      visual: tower(rows),
      rule: { kind: 'tower', rows: structuredClone(rows) },
      hint: '下面两格都知道时用加法；上格与下面一格知道时可以用减法。填好后从底层向上检查。',
      explanation:
        index === 2
          ? '顶层等于中层两格之和，中层确定后，底层仍可有不同填法。只要每组相邻关系成立且每格是0～19的整数，都是合法答案。'
          : '中层左格是底层左格与中格之和；中层右格是底层中格与右格之和；顶层再把中层两格相加。底层中格在两次相加中各用一次。',
    })),
    {
      id: `${prefix}-zero`,
      knowledge: `${id}-zero`,
      prompt: `底层从左到右是${review ? '3、0、4' : '2、0、3'}。中层已给出，顶层待填，顶层是几？`,
      visual: tower(
        review ? [[null], [3, 4], [3, 0, 4]] : [[null], [2, 3], [2, 0, 3]],
      ),
      rule: { kind: 'number', value: review ? 7 : 5 },
      hint: '加0后原数不变，但这个格仍然要检查。',
      explanation: review ? '3+0=3，0+4=4，3+4=7。' : '2+0=2，0+3=3，2+3=5。',
    },
    {
      id: `${prefix}-middle`,
      knowledge: `${id}-middle`,
      prompt: review
        ? '底层1、4、2，求顶层时，中间的4参与了几次相加？'
        : '底层2、3、4，求顶层时，中间的3参与了几次相加？',
      choices: [
        { id: 'once', label: '只用一次' },
        { id: 'twice', label: '左右相邻组各用一次，共两次' },
      ],
      rule: { kind: 'choice', value: 'twice' },
      hint: '分别看底层左边两格和右边两格。',
      explanation: '中间格属于两组相邻格。顶层不能只把底层三个数加一次。',
    },
    {
      id: `${prefix}-many`,
      knowledge: `${id}-many`,
      prompt: review
        ? '顶层18，中层左格10。有人说底层只能是一种填法，这个说法对吗？'
        : '顶层16，中层左格9。有人说底层只能是一种填法，这个说法对吗？',
      choices: [
        { id: 'yes', label: '对，顶层确定就只有一种' },
        { id: 'no', label: '不对，可以试出不同的合法底层' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '保持中层两个和不变，试着改变底层中格，再调整两边。',
      explanation: review
        ? '底层10、0、8与9、1、7都得到中层10、8，顶层18。'
        : '底层9、0、7与8、1、6都得到中层9、7，顶层16。',
    },
  ];
}
export const sujiaoNumberTowersDraft: Lesson = {
  id,
  title: '综合探索：相邻数塔与多种填法',
  textbookTitle: '练习三与单元复习·数塔探索',
  page: 20,
  goal: '理解相邻两格相加的规则，利用加减法补空格，并检查多种合法答案。',
  prerequisite: '能完成20以内加减法，分清上层、下层和相邻位置。',
  parentTip:
    '先让孩子指明每个上格对应哪两个下格，不把底层三数只加一次；多解题不要只认家长想到的一种。',
  version: 1,
  status: 'preparing',
  steps: [
    {
      title: '先看相邻两格',
      text: '这里的规则是上面一格等于下面相邻两格之和。看完整例子：底层2、4、3，中层6、7，顶层13。中间的4在左右两组中各用一次。',
      visual: tower([[13], [6, 7], [2, 4, 3]]),
    },
    {
      title: '从已知处逐格推',
      text: '两格都知道就相加；知道上格与下面一格就相减。先找条件够用的地方，不要求总从底层或顶层开始。',
      visual: tower([[null], [null, 6], [8, 2, null]]),
    },
    {
      title: '同一上层可以有不同底层',
      text: '顶层16，中层9、7。底层9、0、7与8、1、6都满足规则。条件不足时不把一个例子当作唯一标准答案。',
      visual: tower([[16], [9, 7], [null, null, null]]),
    },
    {
      title: '完成后再检查',
      text: '逐一核对三组相邻加法。0可以填，空格不是0。自己摆数卡与说明思路是另外的实际活动，不能只点确认。',
      activity: '画三层数塔，摆卡片并向家长说明每次检查的两格。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '用纸画三层数塔，选择底层三个数使全部结果不超过19，写完中层和顶层，并指着每组说明。',
      '为中层9、7的数塔实际摆出两种不同的底层，检查每种都得到顶层16。',
      '自己改动底层的一张卡，重新算相关上格，说明哪些格需要一起改变。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '需要实际摆卡、画图或口述后由家长确认。',
      explanation: '人工活动独立记录，不自动作为客观答对。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '原创课包范围核对',
    notes: `依据公开预览下册印刷第20页的数塔探索范围，ISBN ${source.isbn}；原创数字与图示，不复制原题或插图。版权版次与印次待核验，保持未注册草稿。`,
  },
};
