import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
import { sujiaoUpperSource as source } from './sujiao-upper-source';

const id = 'sj-upper-part-tables';

function tasks(review: boolean): Question[] {
  const rows8 = review ? [7, 2, 5, 1, 6, 3, 4] : [1, 2, 3, 4, 5, 6, 7];
  const rows9 = review ? [8, 3, 6, 1, 7, 2, 5, 4] : [1, 2, 3, 4, 5, 6, 7, 8];
  const targets = review ? [9, 7, 8] : [7, 8, 9];
  const existing = review ? [6, 2, 5] : [4, 2, 5];
  const pairs = review ? 3 : 4;
  const base = (key: string, prompt: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
  });
  return [
    ...[
      [8, rows8],
      [9, rows9],
    ].map(([total, first]): Question => {
      if (typeof total !== 'number' || !Array.isArray(first))
        throw new Error('Invalid part table');
      return {
        ...base(
          `full-table-${total}`,
          `每行总数都是${total}，分成两份，每份至少1个。第一份按行依次是${first.join('、')}；按这个行序填全第二份，不能只填一种。`,
        ),
        rule: { kind: 'steps', values: first.map((n) => total - n) },
        hint: '每行单独从总数中分出第一份，余下才是第二份。交换两份仍要记录各自的位置。',
        explanation: `第二份依次${first.map((n) => total - n).join('、')}；每行两份合起来${total}。没有新增或取走物品。`,
      };
    }),
    {
      ...base(
        'paired-units',
        `每2根小棒摆成1双，共摆${pairs}双。示意图每个点代指1根小棒，每框1双。依次填有几双、有几根。`,
      ),
      visual: {
        kind: 'count-groups',
        groups: Array.from({ length: pairs }, () => 2),
      },
      rule: { kind: 'steps', values: [pairs, pairs * 2] },
      hint: '数双是数成对的组，数根是逐根数；同一批东西，单位不同。',
      explanation: `${pairs}双是${pairs * 2}根，不把“双数”与“根数”相加。`,
    },
    {
      ...base(
        'three-completions',
        `三幅独立图，目标数依次${targets.join('、')}，已画数依次${existing.join('、')}。逐图填还需添画的数量。`,
      ),
      rule: {
        kind: 'steps',
        values: targets.map((n, i) => n - required(existing[i])),
      },
      hint: '每图从已有数接着数到自己的目标，不能把三图的数合在一起。',
      explanation: `分别添${targets.map((n, i) => n - required(existing[i])).join('、')}；添画数不是最终总数。`,
    },
    {
      ...base(
        'comparison-chain',
        review
          ? '摆了9个蓝片、7个白片、4个紫片。蓝比白多，白比紫多。蓝和紫相比怎样？'
          : '摆了8个红片、6个黄片、3个绿片。红比黄多，黄比绿多。红和绿相比怎样？',
      ),
      choices: [
        { id: 'more', label: review ? '蓝片更多' : '红片更多' },
        { id: 'same', label: '同样多' },
        { id: 'less', label: review ? '蓝片更少' : '红片更少' },
      ],
      rule: { kind: 'choice', value: 'more' },
      hint: '实际逐一配对比较，另一组配完后这组还有剩余。',
      explanation: review
        ? '9大于7，7大于4，9也大于4；蓝片更多。'
        : '8大于6，6大于3，8也大于3；红片更多。',
    },
    {
      ...base(
        'swap-keeps-total',
        review
          ? '9个圆片先分2与7，交换两盘后左盘7、右盘2。总数是多少？'
          : '8个圆片先分3与5，交换两盘后左盘5、右盘3。总数是多少？',
      ),
      rule: { kind: 'number', value: review ? 9 : 8 },
      hint: '交换位置没有添片或取走，仍数同一批。',
      explanation: '两份的位置改变，合起来的总数不变；表中两行要分别记录。',
    },
    {
      ...base(
        'distribution-need-not-equal',
        review
          ? '把7个纸片分给两人，每人至少1个，题目没说同样多。分成2个和5个可以吗？'
          : '把6个纸片分给两人，每人至少1个，题目没说同样多。分成2个和4个可以吗？',
      ),
      choices: [
        { id: 'yes', label: '可以，每人有纸片，合起来等于原总数' },
        { id: 'no', label: '不可以，分两份必须同样多' },
      ],
      rule: { kind: 'choice', value: 'yes' },
      hint: '按题目的条件检查，不擅自增加“平均分”的条件。',
      explanation: '分成两份不必相等；如果题目另要求同样多，要重新核对。',
    },
    {
      ...base(
        'positive-table-boundary',
        review
          ? '9分成0与9，两份合起来确实是9。这一行属于本次“每份至少1个”的分解表吗？'
          : '8分成0与8，两份合起来确实是8。这一行属于本次“每份至少1个”的分解表吗？',
      ),
      choices: [
        { id: 'outside', label: '不属于，0不满足每份至少1个' },
        { id: 'inside', label: '属于，合起来相等就一定符合全部条件' },
      ],
      rule: { kind: 'choice', value: 'outside' },
      hint: '总数正确和满足本表的全部条件是两件事。',
      explanation: '带0的分法并非算错，只不在本次两份都是正数的表内。',
    },
  ];
}

export const sujiaoUpperPartTablesLesson: Lesson = {
  id,
  title: '6～9动手数：成对计数与完整分解表',
  textbookTitle: '认识6～9·练习三',
  page: 39,
  version: 1,
  status: 'available',
  goal: '实际表示6～9，分清双与根，完成不同目标的补图，摆写8和9的全部两正部分分解。',
  prerequisite:
    '认识0～9；准备纸笔、9个圆片或安全小棒、两盘及每珠表示1的儿童计数架。缺少材料的实际任务保留待做。',
  parentTip: `对应ISBN ${source.isbn}印刷第37～39页已读活动，本站情境为原创，不复制教材图。每颗计数珠表示1，备用区不计，不套传统算盘上珠5规则。分解表限定两份至少1个，交换的有序分法分别记；并非所有分法都不能含0。网页答对不代表实际摆写完成。`,
  steps: [
    {
      title: '逐颗拨出6、7、8、9',
      text: '约定儿童计数杆的一端为计数区，备用珠在另一端，留出间隔。每颗移入的珠表示1。先清空，再逐颗拨6、7、8、9颗，每次读数、写数，再恢复。没有实际计数架就先做其它部分，不假装已经拨过。',
      activity:
        '实际完成四次拨珠与读写，检查5后再添1、2、3、4颗分别到6、7、8、9。',
    },
    {
      title: '双与根分开数，配对比较',
      text: '取8根小棒，每2根为1双，摆成4双。数双得到4，拆开逐根数得到8，两者是同一批东西的不同单位。另摆8个红纸片、6个黄纸片、3个绿纸片，分别一对一配对比较。',
      activity:
        '实际摆双、数根，再比较红黄、黄绿、红绿；每次恢复原量，配完后看谁还有剩余，写8>6、6>3、8>3。',
    },
    {
      title: '逐图接着画到目标',
      text: '画三个独立圈，目标依次7、8、9。分别先画4个三角形、2个方形、5个圆，再分别补到各自目标。记录已有、补画、最后三栏，逐图核对；不能只填写还差多少就说已补画。',
      activity:
        '实际补三幅图，记录4+3=7、2+6=8、5+4=9，说清补画数与最终总数不同。',
    },
    {
      title: '8和9完整分成两份',
      text: '取8个圆片分到两盘，每盘至少1个。第一盘从1到7逐次增加1，第二盘从7到1逐次减少1，记录七行1与7、2与6、3与5、4与4、5与3、6与2、7与1。另取9个，第一盘1～8，对应第二盘8～1，记录八行。每次移动同一片，总量不变。',
      activity:
        '分别实际摆全七行与八行，每摆一行就在纸面记录，再合回8或9核对。找交换后对应的行；4与4交换不产生新行。',
    },
    {
      title: '不同分法与表的范围',
      text: '用纸片模拟给两人分6个、再分7个。每人至少1个，自己寻找不同分法；没有要求平均分，不必同样多。纸面分解表只列两份至少1个，所以0与8或0与9不在本表，不能说这些分法的总数算错。',
      activity:
        '每个总数实际找至少两种不同有序分法，逐次恢复原总量并核对两人数量，向家人解释为什么条件不要求相等。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      [
        'actual-beads',
        '用每颗表示1的儿童计数架，明确计数区与备用区，每次清空后实际拨出6、7、8、9，逐颗读数写数，再从5添1～4颗核对。没有学具暂跳，纸面画珠或网页答对不能冒称实际拨珠。',
      ],
      [
        'actual-pairs-comparison',
        '实际用8根安全小棒摆4双，数双再拆开数根；另摆8红、6黄、3绿纸片，红黄、黄绿、红绿分别一对一配对，每次恢复原量，实际写出三个比较符号并说明剩余。请家人查看数量和单位。',
      ],
      [
        'actual-three-completions',
        '实际画三圈目标7、8、9，先有4个三角、2个方形、5个圆，分别补齐。保留三图，逐图记已有/补画/最后数量并说明，不用填写缺数代替真实补画。',
      ],
      [
        'actual-table-8',
        '实际取8个圆片，两盘每盘至少1个。第一盘依次1～7，逐行移动、记录对应第二盘7～1，填全七行后每行合回8核对。比较3与5、5与3的位置交换，4与4只记一行；请家人看真实操作和完整记录。',
      ],
      [
        'actual-table-9',
        '另实际取9个圆片，第一盘依次1～8，第二盘8～1，摆写全八行，每次合回9核对。圈出交换后对应的行，说每次第一盘添1、第二盘少1而总数不变。不能用8的表改标题当已摆9。',
      ],
      [
        'actual-distribution',
        '用纸片模拟分给两人：先6个，再7个，每人至少1个。每个总数独立实际寻找并记录至少两种有序分法，每次恢复原量，核对两人合计。解释分两份不一定同样多；仅计划下次分不算已经完成。',
      ],
    ].map(([key, prompt]): Question => ({
      id: `${id}-${required(key)}`,
      knowledge: `${id}-${required(key)}`,
      prompt: required(prompt),
      rule: { kind: 'manual' },
      hint: '实际做过、留下记录并交流后再确认，未做如实暂跳；未来计划另记。',
      explanation: '人工确认实际操作与表达，不自动评为已掌握。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-02',
    reviewer: '同版第37～39页活动范围与原创教学核对',
    notes:
      '8/9复习改变整表行序，成对组数、补图目标及已有量、比较与分配情境均变化。六项实际任务独立记录，最终教师审校未核验，第二单元其它缺口继续保留。',
  },
};
