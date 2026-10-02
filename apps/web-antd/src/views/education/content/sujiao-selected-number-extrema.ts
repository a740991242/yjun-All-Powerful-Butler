import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-selected-number-extrema';
function tasks(review: boolean): Question[] {
  const ones = review ? 3 : 6;
  const tens = review ? 7 : 6;
  const groups = review
    ? [
        [73, 23, 53],
        [79, 70, 74],
      ]
    : [
        [26, 66, 46],
        [60, 68, 63],
      ];
  const q = (key: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
  });
  const choice = (
    key: string,
    prompt: string,
    good: string,
    bad: string,
  ): Question => ({
    ...q(key),
    prompt,
    choices: [
      { id: 'good', label: good },
      { id: 'bad', label: bad },
    ],
    rule: { kind: 'choice', value: 'good' },
    hint: '先核对条件，再只比较题目给出的三个数。',
    explanation: good,
  });
  return [
    ...groups.flatMap((values, i): Question[] => {
      const sorted = [...values].toSorted((a, b) => a - b);
      return [
        {
          ...q(`sort-${i}`),
          prompt: `已选的三个不同两位数是${values.join('、')}，${i === 0 ? `个位都为${ones}` : `十位都为${tens}`}。只把这三个数按从小到大依次填出。`,
          rule: { kind: 'steps', values: sorted },
          hint: '每个已选数恰用一次，不能添其它符合数位条件的数。',
          explanation: `顺序${sorted.join('、')}；同个位先比十位，同十位再比个位。`,
        },
        {
          ...q(`extrema-${i}`),
          prompt: `只在已选的${values.join('、')}三个数中找，依次填最小、最大。`,
          rule: {
            kind: 'steps',
            values: [required(sorted[0]), required(sorted[2])],
          },
          hint: '先找最小再找最大，不能填所有符合条件的数中的极值。',
          explanation: `只比较所选三个数，最小${sorted[0]}，最大${sorted[2]}。`,
        },
        choice(
          `scope-${i}`,
          `已选${values.join('、')}。判断${i === 0 ? 90 + ones : tens * 10 + 9}是否是“所选三个中最大”，应怎样核对？`,
          i === 1 && sorted[2] === tens * 10 + 9
            ? '这个数已经在所选三个中，是最大；不是因为所有同十位数中最大就自动采用。'
            : '不能，它不在所选三个中；先核对所选清单。',
          i === 1 && sorted[2] === tens * 10 + 9
            ? '只要是所有同十位数的最大，就不用核对选了哪些。'
            : '可以，只要它满足相同数位条件就一定是所选三个的最大。',
        ),
      ];
    }),
    choice(
      'zero',
      `自己选三个十位都是${tens}的不同两位数，${tens * 10}可以选吗？`,
      '可以，它的十位符合条件、个位为0，仍是两位数。',
      '不可以，个位为0就不是两位数。',
    ),
    choice(
      'distinct',
      `想选三个不同的两位数，写成${required(groups[0])[0]}、${required(groups[0])[0]}、${required(groups[0])[2]}符合吗？`,
      '不符合，有重复；先补成三个不同且符合条件的数，再比较最大最小。',
      '符合，只要三个位置写了数就算三个不同的数。',
    ),
  ];
}
export const sujiaoSelectedNumberExtremaDraft: Lesson = {
  id,
  title: '自己选三个数：条件、排序与最大最小',
  textbookTitle: '认识20～99·选三数再比较',
  page: 49,
  version: 1,
  status: 'preparing',
  goal: '自己按相同个位或十位条件选三个不同的两位数，核对条件后求所选三个的最大最小，不混同全部候选数的极值。',
  prerequisite: '认识两位数与数位，会比较大小；准备纸笔或三张空白数字卡。',
  parentTip: `依据ISBN ${source.isbn}已读49页第4题两个条件及比较范围，本站原创示例和卡片。不固定孩子选哪三个数；网页示例比较客观判分，孩子自主选数、书写、圈最大最小与说明单独人工核对，允许不同合法清单。`,
  steps: [
    {
      title: '先选三个不同的同个位数',
      text: '指定个位6，示例选26、66、46，三个都是两位数、个位都是6且互不重复。先核对条件，不能只看写满三张卡。你也可以选16、36、86等其它合法清单，选哪些会影响最大最小。',
      activity:
        '实际自己选三个个位6的不同两位数，写在纸卡上，圈出每个个位并核对没有重复；不要只抄屏幕示例。',
    },
    {
      title: '比较自己所选的三个',
      text: '26、66、46从小到大为26、46、66，所以这三个中最小26、最大66。96也是个位6，但没选入这三张卡，不能把它当这三个中的最大。若你选了其它三数，必须按自己的清单重新比较，不固定套用26和66。',
      activity:
        '实际按自己刚写的三张卡排序，另写这三数的最小最大；家长核对答案都在孩子清单中并比较正确。',
    },
    {
      title: '换成同十位，重新选数和比较',
      text: '指定十位6，示例选60、68、63，从小到大60、63、68，最小60、最大68。60个位为0仍是两位数，允许选。69虽然也符合十位6，但未在这个示例清单中，不能代替最大68。复习换十位7、个位3，比较当前所选清单。',
      activity:
        '实际另选三个十位6的不同两位数，写出并核对，按自己的清单排序、圈最小最大；不沿用上一组答案。',
    },
    {
      title: '把选数、核对和比较连起来',
      text: '先说数位条件，再看三个是否都符合且不同，最后只比较所选三个。写三个例子与找全全部候选是不同任务。网页练习使用已给出的原创三数，真实自主选数要纸面完成并人工确认；实际未做保留待做，计划不当完成。',
      activity:
        '实际向家长说明两组自选清单和各自最大最小，指出一个未选但符合条件的数为何不能直接当所选最大。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际自己写三个个位6的不同两位数，逐项核对条件和不重复，再按这三个排序，写最小最大并说明；允许其它合法清单，家长按孩子实际所选核对，不套用示例答案。',
      '实际另写三个十位6的不同两位数，逐项核对并按这三个排序，写最小最大；说明个位0允许及未选数不能替代所选极值。家长核对真实纸面与口述，不能只确认网页已答。',
    ].map((prompt, i): Question => ({
      id: `${id}-manual-${i}`,
      knowledge: `${id}-manual-${i}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '自主纸面选数、排序、圈极值与口述实际做过才确认，没有操作待做。',
      explanation:
        '孩子自主选法允许多解，人工按其三数核对条件与极值，不自动由屏幕示例判断。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '记录自己选的三个数和比较发现，或如实写尚未操作及下一步计划；怎样避免把未选数当最大最小？',
      rule: { kind: 'reflection' },
      hint: '自己的清单可以不同，实际经历与计划分开。',
      explanation: '反思correct=null，不确认实际纸面操作或自动评价清单。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-02',
    reviewer: '同数位选数及局部极值范围核对',
    notes: `依据ISBN ${source.isbn}已读49页，复习改变三数、数位条件和极值，允许自主任务不同合法清单。版次印次未知，不宣称全册最终教师审校完成。`,
  },
};
