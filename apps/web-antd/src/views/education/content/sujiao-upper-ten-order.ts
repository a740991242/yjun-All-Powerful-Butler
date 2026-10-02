import type { NumberChainRule } from '../learning/number-chain';
import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
import { sujiaoUpperSource as source } from './sujiao-upper-source';
const id = 'sj-upper-ten-order';
const chain = (
  values: (null | number)[],
  direction: NumberChainRule['direction'],
): NumberChainRule => ({
  kind: 'number-chain',
  minimum: 0,
  maximum: 10,
  values,
  direction,
});
function tasks(review: boolean): Question[] {
  const anchor = review ? 9 : 10;
  const high = review ? 7 : 9;
  const middle = review ? 6 : 8;
  const q = (
    key: string,
    prompt: string,
    rule: Question['rule'],
    explanation: string,
  ): Question => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
    rule,
    hint: '先读起点、终点、方向和0～10范围，再检查每一个严格比较；相等不能通过。',
    explanation,
  });
  return [
    q(
      'full-0-10',
      review
        ? '从10开始倒着数，依次写完整10到0的十一个数。首空包含起点10，末空包含终点0，不只填中间几个。'
        : '从0开始顺着数，依次写完整0到10的十一个数。首空包含起点0，末空包含终点10，不只填中间几个。',
      {
        kind: 'steps',
        values: Array.from({ length: 11 }, (_, i) => (review ? 10 - i : i)),
      },
      review
        ? '每次少1，10、9、8、7、6、5、4、3、2、1、0。'
        : '每次多1，0、1、2、3、4、5、6、7、8、9、10。',
    ),
    q(
      'full-1-10',
      review
        ? '按从小到大顺序写完整1到10十个数，包含起点和终点。本题没有0，不多填一个。'
        : '倒数记录要求从10到1停止，依次写完整十个数，包含起点10和终点1；这次不接着写0。',
      {
        kind: 'steps',
        values: Array.from({ length: 10 }, (_, i) => (review ? i + 1 : 10 - i)),
      },
      review
        ? '1、2、3、4、5、6、7、8、9、10，十个数。'
        : '10、9、8、7、6、5、4、3、2、1，停在1，不把末尾加0。',
    ),
    q(
      'around-descending',
      `只用0～10整数填□A＞${high}＞□B，从左到右填A、B。填一种合法写法即可，两边都严格成立；不同合法答案都接受。`,
      chain([null, high, null], 'descending'),
      `A可${high + 1}～10，B可0～${high - 1}，两空各在合法范围且完整关系成立；相等或范围外不通过。`,
    ),
    q(
      'around-ascending',
      `只用0～10整数填□A＜${middle}＜□B，从左到右填A、B。左右两空都检查，不把同一个数当唯一答案。`,
      chain([null, middle, null], 'ascending'),
      `A可0～${middle - 1}，B可${middle + 1}～10，任意合法组合接受；0可表示没有物品。`,
    ),
    q(
      'dependent-descending',
      `只用0～10整数填${anchor}＞□A＞□B，依次填A、B。两空都比${anchor}小还不够，中间A还要比B大。`,
      chain([anchor, null, null], 'descending'),
      `例如${anchor}>${anchor - 1}>0，也可${anchor}>2>1；完整核对两个关系，所有合法写法接受，不固定示例。`,
    ),
    {
      ...q(
        'strict-equal',
        `有人写${anchor}＞${anchor - 1}＞${anchor - 1}，这个完整严格比较正确吗？`,
        { kind: 'choice', value: 'no' },
        '第二个大于号两边相等，所以失败。',
      ),
      choices: [
        { id: 'no', label: '不正确，第二个比较是相等' },
        { id: 'yes', label: '正确，两空都小于最左数就够了' },
      ],
    },
    {
      ...q(
        'outside-range',
        `题目只许0～10，有人写${review ? 12 : 11}＞${high}＞0。大小关系虽成立，这个答案能接受吗？`,
        { kind: 'choice', value: 'no' },
        `${review ? 12 : 11}不在0～10，大小成立仍不符合本题范围。`,
      ),
      choices: [
        { id: 'no', label: '不能，最左数超出允许范围' },
        { id: 'yes', label: '能，只要两个大于号成立' },
      ],
    },
    {
      ...q(
        'zero-allowed',
        `只用0～10，0＜${middle}＜${middle + 2}是合法完整写法吗？`,
        { kind: 'choice', value: 'yes' },
        '0在本题范围内，两个严格关系都成立。0不是未填，也不套用两正数分合表的限制。',
      ),
      choices: [
        { id: 'yes', label: '合法，0允许且两个比较成立' },
        { id: 'no', label: '不合法，所有空都必须正数' },
      ],
    },
  ];
}
export const sujiaoUpperTenOrderLesson: Lesson = {
  id,
  title: '完整正倒数与十以内两空比较',
  textbookTitle: '10的顺序·练习七开放比较',
  page: 72,
  version: 1,
  status: 'available',
  goal: '按给定起终点完整正倒数，在0～10联合判两空严格比较，范围/相等/0与未答分别检查。',
  prerequisite:
    '认识0～10和＜＞，准备0～10数字卡、纸笔及安全小物件。完整数序包含0与否按题目终点判断。',
  parentTip: `ISBN ${source.isbn}同版64/72页已实际查看。复用原生number-chain并把范围明示0～10，接受全部合法整数组合，不只候选或示例；相等、越界、未填拒绝。完整11数/10数记录分清，顺序反向不等于数值改变。实际纸面与数字卡、开放多写、说理由各自人工，计划分开、反思null，旧0～9课规则/快照保持。`,
  steps: [
    {
      title: '从零到十，起点终点都算一个数',
      text: '完整0到10是0、1、2、3、4、5、6、7、8、9、10，共十一个数；这里数的是列出的数，不是十个间隔。0是数序起点，也是没有物品的数量。按题目包含起点和终点，不能只写最后三步。',
      visual: { kind: 'number-line', minimum: 0, maximum: 10, value: 10 },
      activity:
        '实际把0～10十一张卡从小到大排齐，逐张指读，纸上写完整序列；缺卡补写，不跳过0。',
    },
    {
      title: '倒着读，停在哪个数按要求',
      text: '从10倒到0每次少1，十一数一个不漏。若要求10倒到1，末尾1就停止，恰好十个数；多写0也不符合这次记录。倒序改变读的方向，不改变卡上数字值。复习又改回1到10，要重新看起终点。',
      activity:
        '实际将同十一张卡反向指读10到0，另写10到1到此停止；请家人换起终点自己说范围。',
    },
    {
      title: 'A大于九，九又大于B',
      text: '只用0～10，A＞9＞B，A只有10，B可0～8。10＞9＞0与10＞9＞8都合法；9＞9＞0失败在左边，10＞9＞9失败在右边。复习中心改7，A可8～10，B可0～6，不固记A一定10。',
      activity:
        '实际纸面自主写至少三种不同合法完整关系，其中一种B为0；每个数字查范围，逐个大于号核对，另写相等或越界不合法例子说明。',
    },
    {
      title: 'A小于八，八又小于B',
      text: '0～10内A＜8＜B，A可0～7，B可9或10。0＜8＜9、7＜8＜10都可；选一种不代表别的合法写法错了。复习中心改6，左右范围重新判断，不复制原表。',
      activity:
        '实际用数字卡或纸面自己写至少三套不同A＜8＜B，再改A＜6＜B至少三套；0允许但要明确写出，分别查两边。',
    },
    {
      title: '两空相邻时，中间关系也不能漏',
      text: '10＞A＞B，A与B都小于10还不够。10＞3＞5失败在3没有大于5；10＞2＞1、10＞1＞0可。数序、范围和每个比较一起看，写一种合法只是练习，真实多写及解释另记。尚未实际写可待做，未来计划不当完成。',
      activity:
        '实际自主写至少三种10＞A＞B含一组B为0，另写两空都小于10但A不大于B的反例；给家人指出失败在哪边，记录帮助/困难。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      [
        'actual-full-count',
        '实际排齐0～10十一张卡，完整顺读0到10、倒读10到0并纸上记录；另写10到1停在1。指明起终点和数的个数，不把间隔数当列出数；缺卡可自写，未实际做暂跳。',
      ],
      [
        'actual-around',
        '实际纸面自主写至少三种A＞9＞B，含B为0；再三种A＜8＜B，含A为0；变中心7/6各再写至少两种，每数0～10且两边严格成立。不只点候选或抄固定例子。',
      ],
      [
        'actual-dependent',
        '实际自己写至少三种10＞A＞B，其中一组B为0；再改最左9写至少两种。另写两空都小于最左数但A不大于B的反例，以及一个相等反例，逐边检查。',
      ],
      [
        'actual-explain',
        '实际向家人用自己的完整数序、开放写法和反例解释起终点、范围、两个比较与0/未填区别，核对彼此不同合法答案。真实原话/帮助/困难如实记录，未来打算另记。',
      ],
    ].map(([key, prompt]): Question => ({
      id: `${id}-${required(key)}`,
      knowledge: `${id}-${required(key)}`,
      prompt: required(prompt),
      rule: { kind: 'manual' },
      hint: '真实排卡、写出多种和解释完成再确认，未做暂跳，计划分开。',
      explanation: '实际操作与开放作品独立人工，网页答对不代替。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '写今天真实正倒数或比较的一例、怎样核对范围和两个关系、遇到的帮助/困难。未做如实写，未来计划另记。',
      rule: { kind: 'reflection' },
      hint: '真实例子不要求全部掌握。',
      explanation: '反思correct null，不自动评星。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-02',
    reviewer: '完整数序与开放联合条件核对',
    notes:
      '2024年7月第1版、2025年7月第2次印刷64/72页实际查看。复习完整数序方向和中心/最左固定数改变，所有合法组合接受。纸面多写独立，最终教师审校未核验。',
  },
};
