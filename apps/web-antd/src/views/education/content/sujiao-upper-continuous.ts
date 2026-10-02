import type { Lesson, Question } from '../learning/types';

import { fold } from '../learning/fold';
import { required } from '../learning/required';
import { sujiaoUpperSource as source } from './sujiao-upper-source';

const id = 'sj-upper-continuous';
function landings(start: number, changes: number[]) {
  return fold<number, number[]>(changes, [], (values, change) => [
    ...values,
    (values.length === 0 ? start : required(values.at(-1))) + change,
  ]);
}

function tasks(review: boolean): Question[] {
  const firstStart = review ? 4 : 5;
  const firstChanges = review ? [2, -5, 6, -3, 4, -7] : [3, -6, 2, 5, -8, 7];
  const secondStart = review ? 8 : 9;
  const secondChanges = review ? [-5, 6, -7, 4, -6, 5] : [-3, -5, 8, -9, 3, 6];
  const first = landings(firstStart, firstChanges);
  const second = landings(secondStart, secondChanges);
  const pattern = review
    ? '星、月、月、星、月、月、【甲】、月、【乙】'
    : '圆、圆、方、圆、圆、方、【甲】、圆、【乙】';
  const names = review ? ['星', '月', '花'] : ['圆', '方', '三角'];
  const base = (key: string, prompt: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
  });
  return [
    ...[
      ['first-path', firstStart, firstChanges, first],
      ['second-path', secondStart, secondChanges, second],
    ].map(([key, start, changes, values]): Question => {
      if (
        typeof key !== 'string' ||
        typeof start !== 'number' ||
        !Array.isArray(changes) ||
        !Array.isArray(values)
      )
        throw new Error('Invalid continuous path');
      return {
        ...base(
          key,
          `从${start}开始，依次${changes.map((n) => (n >= 0 ? `加${n}` : `减${-n}`)).join('、')}。填全六次变化后的当前数，第二次起每次接着上一落点算，不回原起点。`,
        ),
        rule: { kind: 'steps', values },
        hint: '每做一次，在纸上记新的当前数，再用它开始下一步；记录六个数，不只最后一个。',
        explanation: `六次当前数依次${values.join('、')}，每次都在0～9范围。起点不放进六个变化后结果里。`,
      };
    }),
    {
      ...base(
        'fifth-step-start',
        `第一条路径从${firstStart}开始，前四次变化是${firstChanges
          .slice(0, 4)
          .map((n) => (n >= 0 ? `加${n}` : `减${-n}`))
          .join('、')}。第五次开始前的当前数是多少？`,
      ),
      rule: { kind: 'number', value: required(first[3]) },
      hint: '第5次的起点是第4次结束数，不是第5次结束数。',
      explanation: `前四次落点依次${first.slice(0, 4).join('、')}，所以第五次从${required(first[3])}继续。`,
    },
    {
      ...base(
        'start-is-not-output',
        `第二条路径开始数${secondStart}。六步完成后的记录，要把原起点另算成“第1步结果”吗？`,
      ),
      choices: [
        { id: 'no', label: '不算，每个结果是一次变化完成后的当前数' },
        { id: 'yes', label: '算，把起点放在六个结果的第一格' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '还没执行变化的数是起点；执行一次才产生第1次结果。',
      explanation: '起点可以单独标记，但六个结果栏要记录六次变化之后的数。',
    },
    ...[
      ['hidden-seven', '甲', 7, required(names[0])],
      ['hidden-nine', '乙', 9, required(names[1])],
    ].map(([key, letter, position, value]): Question => {
      if (
        typeof key !== 'string' ||
        typeof letter !== 'string' ||
        typeof position !== 'number' ||
        typeof value !== 'string'
      )
        throw new Error('Invalid hidden position');
      return {
        ...base(
          key,
          `九项规律是：${pattern}。每三项按同一组重复，第${position}项【${letter}】是什么？从第1项数，不把盖住的项删掉。`,
        ),
        choices: names.map((name) => ({ id: name, label: name })),
        rule: { kind: 'choice', value },
        hint: '遮住的项仍占原来的位置；先找到三项一组，再确定在组内第几项。',
        explanation: `第${position}项是${value}，隐藏只是看不见，不改变九项顺序或组内位置。`,
      };
    }),
    {
      ...base(
        'hidden-in-group',
        `九项规律：${pattern}。先填甲在第三组的第几项，再填乙在第三组的第几项。`,
      ),
      rule: { kind: 'steps', values: [1, 3] },
      hint: '第三组仍包含第7、第8、第9项；隐藏处占位，没有向前挤。',
      explanation: '甲是第三组第1项，乙是第三组第3项；它们在整排是第7和第9项。',
    },
    {
      ...base(
        'two-paths-reset',
        review
          ? '做完第一条路径最后到1。第二条规定从8开始，应从1继续还是重新从8开始？'
          : '做完第一条路径最后到8。第二条规定从9开始，应从8继续还是重新从9开始？',
      ),
      choices: [
        {
          id: 'reset',
          label: review ? '重新从第二条规定的8开始' : '重新从第二条规定的9开始',
        },
        { id: 'continue', label: '把第一条终点直接当第二条起点' },
      ],
      rule: { kind: 'choice', value: 'reset' },
      hint: '同一条的各步连续，新的独立路径按新的规定起点开始。',
      explanation: '先分清是否同一条路径；不能把两条独立路径连成一条。',
    },
  ];
}

export const sujiaoUpperContinuousLesson: Lesson = {
  id,
  title: '连续六步与九项隐藏规律',
  textbookTitle: '6～9·练习四与练习五',
  page: 48,
  version: 1,
  status: 'available',
  goal: '完成两条各六次的连续计算，逐步保存当前数；判断九项重复图案隐藏的第7、第9项，不改变被遮项的位置。',
  prerequisite:
    '会9以内加减与三项一组重复；准备纸笔、9张自己画的形状卡和遮盖用的空白纸。',
  parentTip: `对应ISBN ${source.isbn}印刷45、48页已读活动范围，本站用原创纸片路径与圆圆方图案。只使用0～9中间量，不比孩子速度，不要求实地跳跃。实际路径游戏、独立第二路径和遮盖规律分别人工；屏幕答对不能当实际动手已完成。`,
  steps: [
    {
      title: '当前数就是下一步的起点',
      text: '把起点单独写在左边，右边画六个结果格，每格记录一次变化后的当前数。加表示添，减表示取；第二步用第一步结束时的数，不能每步都从原起点重新算。每个中间数都要核对，不只看最后结果。',
      activity:
        '用纸片作第一路径，从5依次+3、−6、+2、+5、−8、+7，每次实际添取后记当前数。',
    },
    {
      title: '两条六步路径，各自独立开始',
      text: '第一路径：5→8→2→4→9→1→8，对应+3、−6、+2、+5、−8、+7。另一路径从9开始：9→6→1→9→0→3→9，对应−3、−5、+8、−9、+3、+6。第二条重新摆9个，不能把第一条最后8个当第二条起点。',
      activity:
        '实际分别操作两条，各记六个变化后数量。原起点单独标，不占第一个结果格；到0时写0，不能留空。',
    },
    {
      title: '用记录解释哪一步发生了变化',
      text: '第一路径第4次结束是9，所以第5次从9减8到1。第二路径第4次结束0，下一次添3得到3。结果写错时回看上一格与本步变化，实际重新从本条起点核对；不要擦掉第一次记录后说从来没有错。',
      activity:
        '请家人选一条路径中的一步，实际指记录说开始数、添取数、结束数；可以慢慢数，不设速度排名。',
    },
    {
      title: '隐藏图案仍然占位置',
      text: '自画九张卡，按圆、圆、方，重复三组。第1～3一组，第4～6一组，第7～9一组。用纸遮住第7、第9张，但卡留在原位；第7是第三组第一项圆，第9是第三组第三项方。遮盖不是删除，不把可见的第8张向前挤。',
      activity:
        '实际摆九卡，只覆盖不移走第7/9，先独立说预测与三项一组的理由，再揭开分别核对，记录猜测和实际。',
    },
    {
      title: '换一组规律，再说全排位置',
      text: '另画星、月、月重复三组，也是九项。覆盖第7、第9，分别是星、月。完整排第7和第9，与第三组第1和第3是不同说法但对应同两张；图案变了，要重新按本组规律，不沿用圆圆方的答案。',
      activity:
        '实际另摆星月月九卡再做覆盖预测/揭开，向家人分别说整排第几和第三组第几；没有实际操作或交流暂跳，未来想玩另记。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      [
        'actual-first-path',
        '实际用纸片从5开始，连续+3、−6、+2、+5、−8、+7，完整六次每次真实添取再逐格记当前数。起点另标，保留六结果；请家人任选一步，指记录解释前数、变化和后数。未实际完成不能凭网页六空答对确认。',
      ],
      [
        'actual-second-path',
        '另实际从9重新摆起，连续−3、−5、+8、−9、+3、+6，完整六次记录。到0明确写0，下一步从0继续；不沿用上一条终点。与家人核对每一步，不比速度，没做暂跳。',
      ],
      [
        'actual-hidden-pattern',
        '实际自画圆圆方九卡三组，覆盖第7/9但不移卡，先记录预测及组内理由，再逐张揭开检查。另摆星月月九卡重复操作，两套都分别说整排第7/9与第三组第1/3。请家人看真实摆卡与记录，未来计划不当完成。',
      ],
    ].map(([key, prompt]): Question => ({
      id: `${id}-${required(key)}`,
      knowledge: `${id}-${required(key)}`,
      prompt: required(prompt),
      rule: { kind: 'manual' },
      hint: '实际完成、留下记录和交流后再确认，未做暂跳；网页答对不代替真实摆片。',
      explanation: '人工记录真实游戏与说明，不自动评为已经掌握。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-02',
    reviewer: '同版连续六步与隐藏两位置活动核对',
    notes:
      '复习两条起点/六次变化/全部中间量及隐藏图案分组更换；组内第1/3不变只是位置概念，图案须重新判断。保留旧两步课和会话，最终教师审校未核验，不代表整个第二单元完成。',
  },
};
