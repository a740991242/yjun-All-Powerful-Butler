import type { Lesson, PeriodicFlagsVisual, Question } from '../learning/types';

import { flagAt, flagCounts } from '../learning/periodic-flags';
import { required } from '../learning/required';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-periodic-flags';
function model(review: boolean): PeriodicFlagsVisual {
  return {
    kind: 'periodic-flags',
    pattern: review ? ['B', 'C', 'A'] : ['A', 'B', 'C'],
    total: review ? 16 : 14,
    shown: review ? 9 : 6,
  };
}
const choices = [
  { id: 'A', label: 'A 红旗' },
  { id: 'B', label: 'B 蓝旗' },
  { id: 'C', label: 'C 黄旗' },
];
function tasks(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const visual = model(review);
  const groupCount = review ? 5 : 4;
  const tail = review ? 1 : 2;
  return [
    ...[visual.shown, visual.shown + 1, visual.total - 1].map(
      (index, i): Question => ({
        id: `${prefix}-colour-${i}`,
        knowledge: `${id}-colour-${i}`,
        prompt: `按前三面一组依次重复，从左往右第${index + 1}面（${(() => {
          if (i === 0) return '第一面待涂旗';
          return i === 1 ? '第二面待涂旗' : '最后一面旗';
        })()}）应该是哪类？`,
        visual,
        choices,
        rule: { kind: 'choice', value: required(flagAt(visual, index)) },
        hint: '从左开始，先找完整的三面组，再处理不满一组的余下位置。不能跳过待涂旗的位置。',
        explanation: `按${visual.pattern.join('、')}重复排列，第${index + 1}面应是${flagAt(visual, index)}类。未涂位置仍占一个位置。`,
      }),
    ),
    {
      id: `${prefix}-total`,
      knowledge: `${id}-total`,
      prompt: review
        ? '这排复习图一共有几面旗？已涂与待涂的都数，一面只数一次。'
        : '图中这一排一共有几面旗？已涂与待涂的都数，一面只数一次。',
      visual,
      rule: { kind: 'number', value: visual.total },
      hint: '从最左一面逐面数到最右一面，不按颜色种类数，也不只数已涂旗。',
      explanation: `一共有${visual.total}面，待涂旗不是不存在。颜色种类与旗子总数不同。`,
    },
    {
      id: `${prefix}-visible`,
      knowledge: `${id}-visible`,
      prompt: review
        ? '复习图中已经涂好、带A/B/C字母的旗有几面？这里暂不计待涂旗。'
        : '图中已经涂好、带A/B/C字母的旗有几面？这里暂不计待涂旗。',
      visual,
      rule: { kind: 'number', value: visual.shown },
      hint: '只数有颜色和字母的旗；注意本题所数对象与总旗数不同。',
      explanation: `已涂${visual.shown}面。这不是整排总数。`,
    },
    {
      id: `${prefix}-uncoloured`,
      knowledge: `${id}-uncoloured`,
      prompt: review
        ? '复习图中还有几面带问号的旗待涂？'
        : '图中还有几面带问号的旗待涂？',
      visual,
      rule: { kind: 'number', value: visual.total - visual.shown },
      hint: '逐个数问号，或用全排数量减去已涂数量；问号不表示0。',
      explanation: `${visual.total}−${visual.shown}=${visual.total - visual.shown}面待涂。`,
    },
    {
      id: `${prefix}-categories`,
      knowledge: `${id}-categories`,
      prompt: review
        ? '按复习图规则完成全排后，依次填A红旗、B蓝旗、C黄旗各有几面。包含现在还未涂的旗。'
        : '按图中规则完成全排后，依次填A红旗、B蓝旗、C黄旗各有几面。包含现在还未涂的旗。',
      visual,
      rule: { kind: 'steps', values: flagCounts(visual) },
      hint: '每个完整三面组，三类各一面；还要检查最后不满一组的余下旗，不能漏掉。',
      explanation: `依次${flagCounts(visual).join('、')}面，三类合起来是${visual.total}面。只数完整组会漏掉尾部。`,
    },
    {
      id: `${prefix}-repeat`,
      knowledge: `${id}-repeat`,
      prompt: review
        ? '复习顺序中，第1面与第4面属于什么关系？'
        : '按本图规则，第1面与第4面属于什么关系？',
      visual,
      choices: [
        { id: 'same', label: '同一类，每三面又回到组内第一面' },
        { id: 'different', label: '不同类，只要位置不同类别就不同' },
      ],
      rule: { kind: 'choice', value: 'same' },
      hint: '把第一组三面和第二组三面对应起来。',
      explanation:
        '位置不同但类别可以相同。每三面重复一次，第1、4面对应各组第一面。',
    },
    {
      id: `${prefix}-groups-tail`,
      knowledge: `${id}-groups-tail`,
      prompt: `${groupCount}个完整三面组，再接${tail}面旗，一共有几面？这里不使用乘法，按组接着加，再加余下旗。`,
      rule: { kind: 'number', value: groupCount * 3 + tail },
      hint: '从一组三面开始，每多一组就再加3，最后还要加不满组的旗。',
      explanation: `${Array.from({ length: groupCount }, () => '3').join('+')}+${tail}=${groupCount * 3 + tail}。不能只报组数，也不能漏掉余下旗。`,
    },
    {
      id: `${prefix}-recolour`,
      knowledge: `${id}-recolour`,
      prompt: review
        ? '复习图里只把最后一面换一种颜色，没有增减旗子，总旗数会改变吗？'
        : '只把图中最后一面换一种颜色，没有增减旗子，总旗数会改变吗？',
      visual,
      choices: [
        { id: 'yes', label: '会，换颜色就多了一面' },
        { id: 'no', label: '不会，颜色改变但旗子没有增减' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '颜色、是否符合排列规则与总数，是三个需要分别检查的问题。',
      explanation:
        '数量不变，但新颜色可能破坏原来的重复规则。不能把换颜色当成添加旗子。',
    },
  ];
}
export const sujiaoPeriodicFlagsDraft: Lesson = {
  id,
  title: '综合活动：彩旗重复与总数',
  textbookTitle: '练习一·彩旗排列',
  page: 7,
  version: 1,
  status: 'preparing',
  goal: '按明确的三面重复规则续涂，区分颜色类数、旗子总数、已涂和待涂数量，检查不满组的尾部。',
  prerequisite: '能数19以内数量，会辨认A/B/C三类，能按从左往右位置找物品。',
  parentTip:
    '先让孩子指着前三面说一组的顺序，再往后看。组数与旗数不同；不把三种颜色当三面旗，不漏待涂旗和尾部。',
  steps: [
    {
      title: '明确这一排的重复规则',
      text: '本站活动明确前三面为一组，按组内顺序反复接下去。A红、B蓝、C黄用字母和颜色共同区分；不能只凭颜色深浅。',
      visual: model(false),
    },
    {
      title: '未涂的旗仍占位置',
      text: '图里每个问号都是已画好的待涂旗，不表示0或不存在。从左往右数位置，先找完整组三面，再看剩下的位置。',
      visual: model(false),
    },
    {
      title: '完整组与最后余下的旗',
      text: '一组中A/B/C各一面，但最后可能不满一组。先数完整组，再逐面检查尾部；总数、各类数和待涂数要分开提问。',
      visual: model(true),
    },
    {
      title: '改变顺序不等于改变数量',
      text: '换顺序或换颜色没有添旗、拿旗时，总数量不变，但可能不再符合原来的重复规则。数图和判断规则分开；实际续涂与解释由人工确认。',
      activity:
        '纸上画一排旗，按三面一组涂色；完成后指旗说明规则和最后不满组的旗。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '亲手画一排14面旗，先涂ABC两组，再按相同规则续涂到最后，逐旗指着说明。',
      '把全排A/B/C分别数清，再数总数，检查三类合起来是否等于总数，说明尾部为什么不能漏。',
      '保留旗数，换成BCA顺序重新涂一排，比较规则和各类数量；说清哪些改变、哪些没变。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '需要真实画旗、续涂、指旗与说明，再由孩子或家长确认。',
      explanation: '实际操作独立记录，网页选择正确不自动表示已完成纸面续涂。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读三类彩旗重复范围与原创图示检查',
    notes: `依据下册印刷第7页三类彩旗重复、续涂与计总数范围，ISBN ${source.isbn}。本站明确周期条件，采用14/16面、ABC/BCA顺序与不同已涂段；没有复制原图或原题全文。版权日期待核验，保留未注册草稿；非明确规则的任意多解排列不强制此模式。`,
  },
};
