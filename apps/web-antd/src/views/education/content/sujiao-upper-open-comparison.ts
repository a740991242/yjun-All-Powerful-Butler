import type { NumberChainRule } from '../learning/number-chain';
import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
import { sujiaoUpperSource as source } from './sujiao-upper-source';

const id = 'sj-upper-open-comparison';
function chain(
  values: (null | number)[],
  direction: NumberChainRule['direction'],
): NumberChainRule {
  return { kind: 'number-chain', minimum: 0, maximum: 9, values, direction };
}
function tasks(review: boolean): Question[] {
  const upper = review ? 6 : 8;
  const middle = review ? 6 : 7;
  const lower = review ? 7 : 5;
  const base = (key: string, prompt: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
  });
  return [
    {
      ...base(
        'greater-than',
        `只用0～9整数，填${lower}＜□A。填一种合法写法即可，不能与${lower}相等。`,
      ),
      rule: chain([lower, null], 'ascending'),
      hint: '先找比左边数大的数，再代回比较；可以有不同正确填法。',
      explanation: `A可填${Array.from({ length: 9 - lower }, (_, i) => lower + i + 1).join('、')}，范围外或相等不符合。`,
    },
    {
      ...base(
        'descending-pair',
        `只用0～9整数，填${upper}＞□A＞□B。从左到右填A、B，选择一种合法写法。A既要小于${upper}，又要大于B，两空一起核对。`,
      ),
      rule: chain([upper, null, null], 'descending'),
      hint: '先找比最左数小的A，再找比A小的B；两空不能各自只与最左数比较。',
      explanation: `例如A=${upper - 1}、B=${upper - 2}可以；A=1、B=0也可以。所有满足${upper}>A>B的0～9整数写法都接受，不只这两个例子。`,
    },
    {
      ...base(
        'two-groups-around',
        `只用0～9整数，填□A＜${middle}＜□B。按左右两空填A、B，每边都要满足自己的严格比较。`,
      ),
      rule: chain([null, middle, null], 'ascending'),
      hint: '左边比中间少，右边比中间多；不能只检查其中一边。0允许作为实际没有物品的数量。',
      explanation: `左边可0～${middle - 1}，右边可${middle + 1}～9，两边任意合法组合都接受，相等排除。`,
    },
    {
      ...base(
        'dependent-pair-check',
        review
          ? '6＞2＞4。虽然2和4都小于6，这个完整写法正确吗？'
          : '8＞3＞5。虽然3和5都小于8，这个完整写法正确吗？',
      ),
      choices: [
        { id: 'no', label: '不正确，中间数还必须大于最后数' },
        { id: 'yes', label: '正确，两空都小于最左数就行' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '分别读两个大于号，中间数在第二个比较中是左边。',
      explanation: review ? '2小于4，不满足2＞4。' : '3小于5，不满足3＞5。',
    },
    {
      ...base('zero-is-allowed', `在0～9范围内，${upper}＞1＞0是合法写法吗？`),
      choices: [
        { id: 'yes', label: '合法，0是允许的数，两个大于关系都满足' },
        { id: 'no', label: '不合法，所有空都不能写0' },
      ],
      rule: { kind: 'choice', value: 'yes' },
      hint: '这次范围包括0，不套用两正数分解表的不同约定。',
      explanation:
        '0允许且明确填写，未填写不能默认为0；这里没有每空至少1的条件。',
    },
    {
      ...base(
        'strict-excludes-equal',
        review ? '6＞4＞4符合严格大于条件吗？' : '8＞7＞7符合严格大于条件吗？',
      ),
      choices: [
        { id: 'no', label: '不符合，最后两个数相等' },
        { id: 'yes', label: '符合，大于也包括等于' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '＞与≥不同，本题只使用严格大于。',
      explanation: '每一个大于都要成立，相等不能通过。',
    },
    {
      ...base(
        'all-greater-candidates',
        `选出0～9中全部能填${lower}＜□的数，不能遗漏，不选相等。`,
      ),
      choices: Array.from({ length: 10 }, (_, n) => ({
        id: String(n),
        label: String(n),
      })),
      rule: {
        kind: 'set',
        values: Array.from({ length: 9 - lower }, (_, i) =>
          String(lower + i + 1),
        ),
      },
      hint: '沿完整0～9数序逐个检查，选择全部合法数。',
      explanation: `全部是${Array.from({ length: 9 - lower }, (_, i) => lower + i + 1).join('、')}；固定选项检查不能代替实际自主写。`,
    },
  ];
}

export const sujiaoUpperOpenComparisonLesson: Lesson = {
  id,
  title: '开放比较：两空联动与自主画数量',
  textbookTitle: '6～9·复习开放填数',
  page: 49,
  version: 1,
  status: 'available',
  goal: '在0～9范围自主写不同严格比较，联合检查两空；实际画出比7少与比7多的两组，数量0和未做分清。',
  prerequisite: '认识0～9与＜、＞；准备纸笔，能逐一点数和比较两组数量。',
  parentTip: `对应ISBN ${source.isbn}印刷49～50页已读开放填写与补画活动。本站原创例子按严格关系接受所有合法整数写法，不将示例当唯一答案。一次填一种、再实际自主多写，数字练习与纸面画两群分开；未来计划不自动确认已画。`,
  steps: [
    {
      title: '同一个空可以有多种正确填法',
      text: '只用0～9，5＜□可以填6、7、8、9，不能填5。先把合法范围读清，再逐数核对，不以老师举的6当唯一正确答案。0在本次范围中，但它不大于5。',
      activity:
        '实际在纸上自主写全5＜□四种写法，每个数都代回读一次；不要只点选网页候选数。',
    },
    {
      title: '8＞A＞B，两空有联系',
      text: '8＞A＞B要求8大于A、A又大于B。例如8＞7＞6、8＞4＞2、8＞1＞0都可以。8＞3＞5不行，虽然3和5都小于8，但3没有大于5。不要把两空当互不相关的选择。',
      activity:
        '实际自主写至少三种不同合法完整关系，至少一种包含0；分别检查两个大于号，再找一个不合法例子说明哪边失败。',
    },
    {
      title: 'A＜7＜B，两边分别满足',
      text: '左边A可以是0～6，右边B可以是8或9。例如3＜7＜8与0＜7＜9都可以；7＜7＜8失败在左边，3＜7＜7失败在右边。两边都是严格小于，相等不行。',
      activity:
        '实际自己选择至少两组不同左右数量，不强求跟示例一样，每组选完分别核对小于7和大于7。',
    },
    {
      title: '真的画两群，不能只填数字',
      text: '在纸上画三个独立框，中间先画7个圆，左框画你自己选的少于7的圆，右框画自己选的多于7且不超过9的圆。逐框数清，在下方写三个数量及两个小于号。若左边选0，框内不画圆并明确写0，不把没做或忘填当0。',
      activity:
        '实际完成至少两套不同三框图，每套都保留中间7个和两边自己选择的图，先逐一点数，再读两个比较关系。',
    },
    {
      title: '保留不同答案与自己的理由',
      text: '家人和你可能填不同数字，只要每个数都在0～9、两个比较都严格成立，就都正确。比较已经写出的条件，不争谁和示例更像。实际作品与说理由分开检查，需要帮助如实记，没做的留待做。',
      activity:
        '把自己三种链式写法和两套真实图给家人看，逐个说明哪里更少或更多；另外记下以后准备再试的写法，不把计划当已完成。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      [
        'actual-open-writings',
        '实际纸面独立写全0～9内5＜□的四种填法，再自主写至少三种不同8＞A＞B，至少一种B为0。每种完整代回读两个关系，另写一个不合法例子说明哪边失败。不能抄示例或点候选代替独立写。',
      ],
      [
        'actual-two-group-drawings',
        '实际纸面自选至少两套不同A＜7＜B数量，分别画三框，中间7圆，左边自己选的0～6圆，右边8或9圆。逐框点数，写数量与两个小于号；选0时空框旁明确写0。两套真实完成并保留，不只填数字。',
      ],
      [
        'actual-explanation',
        '实际把自己的多种链式写法和两套补画图给家人看，逐项解释两个比较为何都成立，指出自己的不合法例子失败在哪边。家人的不同合法答案也分别核对，帮助如实记录；未来准备写画不是实际已做。',
      ],
    ].map(([key, prompt]): Question => ({
      id: `${id}-${required(key)}`,
      knowledge: `${id}-${required(key)}`,
      prompt: required(prompt),
      rule: { kind: 'manual' },
      hint: '实际自主写、画、点数及交流后再确认，未做暂跳，计划另记。',
      explanation: '人工查看真实作品与说明，网页正确不自动确认画图或独立表达。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-02',
    reviewer: '已读两空联动与真实补画范围核对',
    notes:
      '复习改变上界8为6、中心7为6与下界5为7，全部合法写法按新条件联合判断。包含0与严格相等边界分别核对，保留旧课和会话，最终教师审校未核验，第二单元其它缺口保留。',
  },
};
