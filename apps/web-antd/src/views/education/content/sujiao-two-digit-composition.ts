import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
import { sujiaoLowerSource as source } from './sujiao-lower-source';

const id = 'sj-lower-two-digit-composition';
function tasks(review: boolean): Question[] {
  const values = review ? [40, 42, 49, 50, 73, 98] : [20, 21, 29, 30, 64, 99];
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const q = (key: string) => ({
    id: `${prefix}-${key}`,
    knowledge: `${id}-${key}`,
  });
  return [
    ...values.map((value, index): Question => ({
      ...q(`compose-${index}`),
      prompt: `${Math.floor(value / 10)}个十和${value % 10}个一合起来是多少？`,
      visual: { kind: 'place-value', value },
      rule: { kind: 'number', value },
      hint: '一捆是10根，先按十数，再接着数散棒；不要把捆数当根数。',
      explanation: `${Math.floor(value / 10) * 10}和${value % 10}合起来是${value}。个位没有散棒时写0占位。`,
    })),
    ...[required(values[0]), required(values[4]), required(values[5])].map(
      (value, index): Question => ({
        ...q(`digits-${index}`),
        prompt: `数字${value}的十位数字、个位数字分别是多少？依次填写。`,
        visual: { kind: 'place-value', value },
        rule: { kind: 'steps', values: [Math.floor(value / 10), value % 10] },
        hint: '按每10个一组成一个十的标准分组，十位在左，个位在右。拆捆后的散棒数不是个位数字。',
        explanation: `十位写${Math.floor(value / 10)}，个位写${value % 10}。十位数字表示几个十，不表示几根。`,
      }),
    ),
    ...[review ? 39 : 19, review ? 49 : 29].map((value, index): Question => ({
      ...q(`cross-ten-${index}`),
      prompt: `${value}根小棒再添1根，一共有多少根？`,
      visual: { kind: 'place-value', value },
      rule: { kind: 'number', value: value + 1 },
      hint: '原来散棒9根，添1根就有10根，可以换成1捆十，原有整捆也要计入。',
      explanation: `${value}添1是${value + 1}，由${Math.floor(value / 10)}个十和10个一换成${Math.floor(value / 10) + 1}个十。换捆不丢掉原有小棒。`,
    })),
    {
      ...q('all-ones'),
      prompt: `${values[4]}根小棒全部拆开，按一个一个数，一共有几个一？`,
      rule: { kind: 'number', value: required(values[4]) },
      hint: '问全部单根总数，不是个位上余下的散棒数。',
      explanation: `全按一根一根数是${values[4]}个一，拆开不改变总数。`,
    },
    {
      ...q('whole-tens'),
      prompt: `${review ? 80 : 60}根小棒，每10根扎1捆，可以扎成几捆？没有剩余。`,
      rule: { kind: 'number', value: review ? 8 : 6 },
      hint: '按10根一组数，问题问捆数，不是根数。',
      explanation: `${review ? 80 : 60}里面有${review ? 8 : 6}个十，根数与捆数使用不同单位。`,
    },
    {
      ...q('read-nonzero'),
      prompt: `数字${values[4]}应该怎样读？`,
      choices: [
        { id: 'forward', label: review ? '七十三' : '六十四' },
        { id: 'reverse', label: review ? '三十七' : '四十六' },
      ],
      rule: { kind: 'choice', value: 'forward' },
      hint: '先读几个十，再读几个一，不把十位与个位交换。',
      explanation: `${values[4]}有${Math.floor(required(values[4]) / 10)}个十和${required(values[4]) % 10}个一，两个数字的位置有不同含义。`,
    },
    {
      ...q('read-zero'),
      prompt: `数字${values[0]}应该怎样读？`,
      choices: [
        { id: 'ten', label: review ? '四十' : '二十' },
        { id: 'extra-zero', label: review ? '四十零' : '二十零' },
      ],
      rule: { kind: 'choice', value: 'ten' },
      hint: '整十数个位写0占位，读数时末尾不另读零。',
      explanation: `${values[0]}是${required(values[0]) / 10}个十，没有剩下的单个一；写0占位，读作${review ? '四十' : '二十'}。`,
    },
  ];
}

export const sujiaoTwoDigitCompositionDraft: Lesson = {
  id,
  title: '20的形成与两位数的组成',
  textbookTitle: '认识20～99·数位与组成',
  page: 43,
  version: 1,
  status: 'preparing',
  goal: '理解十个一换一个十，认识整十数及20～99的组成、读写，分清数字位置、根数与捆数。',
  prerequisite:
    '已认识11～19与10个一组成1个十；准备小棒、松紧带、纸笔，有计数器时可实际拨珠。',
  parentTip:
    '依据已读43～44页范围制作原创讲解和练习。网页用小棒分组，不冒充教材计数器原图；计数器拨珠需实际完成。十位与个位的0及数字含义分别说明，拆捆不改总数。数表、估数、大小比较和单元整理在后续课程，不据本课宣称全单元完成。',
  steps: [
    {
      title: '先看19，再添1',
      text: '19有1个十和9个一。实际再添1根，散棒变成10根，可以扎成1捆；与原来1捆合起来是2个十，即20。添棒改变总数，随后换捆只改变分组，这两步不要混同。',
      visual: { kind: 'place-value', value: 19 },
      activity:
        '实际摆19根，再添1根；数清20根，把10根散棒扎成1捆。网页这幅图仍表示19，不会自动增加1根。',
    },
    {
      title: '20有2个十，个位写0',
      text: '20有2个十，没有剩余的单个一。十位写2，个位写0占位，读作二十，不读二十零。网页可以拆一捆再重扎，操作前后仍是20根；拆后出现10根散棒不代表个位数字改为10。',
      visual: { kind: 'place-value', value: 20 },
      activity:
        '网页试拆捆和换捆，再实际核对20根；纸上写20，说明2和0各表示什么。',
    },
    {
      title: '两个十和几个一',
      text: '20继续添1根是21，再添1根是22。29有2个十和9个一；按标准分组，十位写2，个位写9，读作二十九。读写数要认清位置，29与92是不同的数。',
      visual: { kind: 'place-value', value: 29 },
      activity:
        '实际从20逐根添到29，边添边说数，在纸上写三个不同的数并说明组成。',
    },
    {
      title: '29添1，形成30',
      text: '29再添1，散棒10根换1捆，与原来2捆合起来是3个十，即30。接着按十数，可说四十、五十，直到九十；从90逐个添一，可以认识91～99，本课不引入百位。',
      visual: { kind: 'place-value', value: 30 },
      activity:
        '实际摆29再添1到30，用整捆依次表示30、40等整十数；根数和捆数分别说。',
    },
    {
      title: '读写组成，与全部单个一',
      text: '64有6个十和4个一，十位写6，个位写4，读作六十四。全部拆开是64个一，不只有4个一。99按标准分组是9个十和9个一。对照教材或教师示范练写，不由屏幕字体自动评价笔顺。',
      visual: { kind: 'place-value', value: 64 },
      activity:
        '选择20～99中的几个数，实际摆、读、写并说明组成；有计数器时分别在十位和个位拨珠。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际摆19根再添1根，把10根散棒扎成一捆，说出20根与2捆；再摆29添1到30，由家长核对。',
      '选一个20～99的数，实际按每10根一捆摆出，拆捆再重扎并核对根数不变；有计数器时按十位、个位实际拨珠并说明位置。',
      '对照教材或教师示范，在纸上写一个整十数和两个个位非0的两位数，读出来并说明十位、个位、根数与捆数。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '实物、拨珠和纸面书写由家长实际查看；网页操作或答对不自动代替。无条件可待做。',
      explanation: '只确认实际完成过的任务，不自动评价书写笔顺或教材掌握。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '写下你怎样区分十位数字、个位数字与全部单个一；实际摆拨哪里还不清楚，准备怎样核对？没有做过也如实记录。',
      rule: { kind: 'reflection' },
      hint: '按自己的真实想法记录，不必照抄唯一说法。',
      explanation:
        '开放记录保存原话，correct=null，不确认实际任务或增加客观正确率。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '两位数数位范围与原创活动核验',
    notes: `依据ISBN ${source.isbn}已读印刷43～44页。小棒分组、题目和数值原创；复习改变整十、组成、跨十与读数条件。实际摆拨、纸面书写独立确认，版次印次未知。本课不代替数表、估数、比较、练习六或完整单元。`,
  },
};
