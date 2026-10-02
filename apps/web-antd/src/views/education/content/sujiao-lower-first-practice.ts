import type { Lesson, Question } from '../learning/types';

import { sujiaoLowerSource as source } from './sujiao-lower-source';

const id = 'sj-lower-first-practice';

function tasks(review: boolean): Question[] {
  const addends = review
    ? [7, 2, 9, 4, 10, 0, 6, 1, 8, 5, 3]
    : [10, 0, 3, 8, 1, 6, 4, 9, 2, 7, 5];
  const minuends = review
    ? [13, 18, 11, 16, 10, 19, 14, 17, 12, 15]
    : [19, 10, 14, 12, 17, 11, 18, 13, 16, 15];
  const sameSum = review ? 15 : 14;
  const subtrahend = review ? 7 : 8;
  const inputs = review ? [15, 13, 12] : [16, 14, 11];
  const base = (key: string, prompt: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
  });
  return [
    {
      ...base(
        'whole-add-list',
        `每个输入都加9。输入顺序是${addends.join('、')}，按这个顺序填全部11个结果，每个数包括0和10都算一次。`,
      ),
      rule: { kind: 'steps', values: addends.map((n) => 9 + n) },
      hint: '逐项对应输入与空格，加0不添物，加10添一个十；不要擅自改成从小到大顺序。',
      explanation: `按题目输入顺序，结果依次${addends.map((n) => 9 + n).join('、')}。每一项重新从9加这个输入，不把上个结果继续加。`,
    },
    {
      ...base(
        'whole-subtract-list',
        `每个输入都减9。输入顺序是${minuends.join('、')}，按这个顺序填全部10个结果，包括10和19的边界。`,
      ),
      rule: { kind: 'steps', values: minuends.map((n) => n - 9) },
      hint: '每项重新看原数，19减9可取走9个一，10减9只有1个一剩下。',
      explanation: `结果依次${minuends.map((n) => n - 9).join('、')}。输入位置不同，不能只填排好顺序的1～10。`,
    },
    {
      ...base(
        'balanced-results',
        review
          ? '依次算9＋6、8＋7、7＋8，三个空填各自的和。'
          : '依次算8＋6、7＋7、6＋8，三个空填各自的和。',
      ),
      rule: { kind: 'steps', values: [sameSum, sameSum, sameSum] },
      hint: '一个部分减少1，另一个部分增加1；每次仍需检查两个部分合起来。',
      explanation: `三个和都是${sameSum}，两个部分一减一增同样多，总量不变。`,
    },
    {
      ...base(
        'balanced-reason',
        review
          ? '把9件与6件中的1件从第一组移到第二组，变成8件与7件。为什么总量不变？'
          : '把8件与6件中的1件从第一组移到第二组，变成7件与7件。为什么总量不变？',
      ),
      choices: [
        { id: 'move', label: '只是移到另一组，没有新添或拿离这两组' },
        { id: 'remove', label: '第一组少1，总量一定少1，不用看第二组' },
        { id: 'add', label: '第二组多1，总量一定多1，不用看第一组' },
      ],
      rule: { kind: 'choice', value: 'move' },
      hint: '同时检查两部分，移动不是增减整个集合。',
      explanation: '两个部分一减一增抵消，总量守恒；只改变一组时则需重新判断。',
    },
    {
      ...base(
        'balanced-missing',
        review
          ? '9＋6＝8＋□，空格填几，让两边结果相等？'
          : '8＋6＝7＋□，空格填几，让两边结果相等？',
      ),
      rule: { kind: 'number', value: 7 },
      hint: '左边先求总数，右边已知部分少1，另一部分要补1。',
      explanation: review ? '9＋6＝15，8＋7＝15。' : '8＋6＝14，7＋7＝14。',
    },
    {
      ...base(
        'equivalent-add',
        review
          ? '依次填9＋1＋7和9＋8的结果，第一道从左往右算。'
          : '依次填9＋1＋5和9＋6的结果，第一道从左往右算。',
      ),
      rule: { kind: 'steps', values: review ? [17, 17] : [15, 15] },
      hint: '把第二部分拆成1和余下部分，两部分合回原数。',
      explanation: review
        ? '1＋7＝8，先凑十后加7，结果都为17。'
        : '1＋5＝6，先凑十后加5，结果都为15。',
    },
    {
      ...base(
        'equivalent-subtract',
        review
          ? '依次填14－4－3与14－7的结果，第一道从左往右算。'
          : '依次填15－5－3与15－8的结果，第一道从左往右算。',
      ),
      rule: { kind: 'steps', values: [7, 7] },
      hint: '先减到10，再减尚未取走的部分；两次取走合计应等于原减数。',
      explanation: review
        ? '先去4再去3，合计去7，两种都剩7。'
        : '先去5再去3，合计去8，两种都剩7。',
    },
    {
      ...base(
        'subtract-inputs',
        `三个输入${inputs.join('、')}，每个都减${subtrahend}，按输入顺序填输出。`,
      ),
      rule: { kind: 'steps', values: inputs.map((n) => n - subtrahend) },
      hint: '每次从对应原数独立减，不能在上个输出上继续减。',
      explanation: `输出依次${inputs.map((n) => n - subtrahend).join('、')}，拿走部分与剩下部分可以合回对应输入检查。`,
    },
    {
      ...base(
        'blank-not-zero',
        review
          ? '减9复习表的一个空格尚未填写，可以把空白当0说已经填完吗？'
          : '加9输入表的一个空格尚未填写，可以把空白当0说已经填完吗？',
      ),
      choices: [
        { id: 'yes', label: '可以，没填写就是0' },
        { id: 'no', label: '不可以，待填与实际结果0不同' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '空白是尚未作答，需要计算对应输入，不能拿缺失当数字。',
      explanation: '空白不代表0；零是有明确数量意义的数，不能自动补上。',
    },
  ];
}

export const sujiaoLowerFirstPracticeDraft: Lesson = {
  id,
  title: '第一单元练习：完整输入表、圈十与移物规律',
  textbookTitle: '进位加法和退位减法·想想做做与练习',
  page: 16,
  version: 1,
  status: 'preparing',
  goal: '完整对应加9与减9输入，实际圈十和划去物品，分清分步与独立计算，验证两部分一增一减的总量。',
  prerequisite: '会20以内进位加法与退位减法；准备纸笔和19件安全学具。',
  parentTip: `对应ISBN ${source.isbn}印刷第3、5、7、9、11、13、15～16页已读活动范围，数字和故事为原创。完整输入表要逐项对应，11个或10个输入不得漏边界；每道实物减法恢复原数量再开始。圈与划是实际纸面操作，不能用网页数字代替；自主提问由孩子先说，未做待做，计划另记。`,
  steps: [
    {
      title: '把全部输入逐项对应',
      text: '加9表包含0～10所有输入，减9表包含10～19所有输入，题目可打乱顺序。沿同一位置找输入再写输出，每一项独立算，不连续累计。加0仍是9，加10得19；10减9得1，19减9得10。',
      activity:
        '实际画两张输入输出表，自己打乱输入顺序，每个合法输入只用一次，填全并逐项相加或相减核对。',
    },
    {
      title: '圈出十，不改变物品总数',
      text: '在纸面画两组9与4个点，圈原来9个和第二组1个成为10，另有3个，共13；再分别试8与6、7与5。圈只是说明分组，不能多画或擦去物品；凑十后剩余部分还要计入。',
      activity: '实际画三组加法点图，圈十后写计算，说圈里与圈外各几个。',
    },
    {
      title: '圈十后划去，剩余包括未动的部分',
      text: '另画14个点，圈其中10个，再只在这个圈内划去9个；圈内剩1个加未动4个，剩5。另画13个减8、12个减7；每道重新画原数量，不在上一道剩余上继续减。',
      activity:
        '三道减法分别圈十、划去、数剩余、写算式；取走与剩余合起来核对原数量。',
    },
    {
      title: '两部分一增一减，一共多少',
      text: '摆8件和6件，把第一组1件移到第二组成为7与7，再移1件成为6与8。每次两组分别变化，但都没有添新物或拿离两组，所以合计一直14。若实际拿走一件或新添一件，则不是这条相同条件。',
      activity:
        '真实移两次，记录三种分组和总数；再恢复后真正取走1件作对照，说明条件怎样变了。',
    },
    {
      title: '先自己提问，再算与检查',
      text: '自己画两群小动物或两组物品，总数11～19，不抄教材图。先说一个求总数问题，写一条加法；再标总数与一部分，分别提出两个求另一部分的问题，写两条减法。也可画原有与拿走的情境先提问，说明每条算式求什么；允许不同合理问题。',
      activity:
        '保留自己的图、问题、带单位解答，实际向家人解释并核对，未来想画的另记计划。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '纸面实际画加9表，自主打乱0～10十一项输入，每项只用一次，写全输出并逐项核对；加0、加10都不能省。',
      '纸面实际画减9表，自主打乱10～19十项输入，每项只用一次，写全输出并用加法合回检查，10与19都不能省。',
      '实际分别画9＋4、8＋6、7＋5三组点图，圈十、数圈外、写结果；另分别画14－9、13－8、12－7，圈十后在圈内划去指定数量，合回未动部分。每道恢复原数量独立做，保留六幅图和口述。',
      '实际摆8件与6件，从第一组向第二组移1件、再移1件，记录三组数量和总数；恢复8与6后真正拿离1件作对照，说清只是移组与取走的区别。',
      '实际自画总数11～19的两群物品，先提出求总数问题，再分别提出两个求部分的问题，写一条加法和两条减法及单位，向家人解释所求与条件；也可另画拿走情境自主提问。未交流可如实注明，不能用抄例子或计划确认完成。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '实际纸面或摆物、表达分别由人工查看，未做暂跳，未来计划不是已完成。',
      explanation: '本活动独立人工记录，网页填数正确不自动完成纸笔与摆物。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-02',
    reviewer: '已读第一单元完整输入与操作范围核验',
    notes: `ISBN ${source.isbn}第3、5、7、9、11、13、15～16页活动，原创输入次序和组合；复习重排全表输入、改变保持总量的组合和减法条件。实际任务单独确认，版权版次印次未知，最终教师审校待完成。`,
  },
};
