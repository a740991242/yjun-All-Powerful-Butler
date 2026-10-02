import type {
  ClassificationRecordVisual,
  Lesson,
  Question,
} from '../learning/types';

import { required } from '../learning/required';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-classification';
export const animalCards = (review: boolean) =>
  review
    ? [
        { id: 'A', label: 'A 燕子', fly: true, water: false },
        { id: 'B', label: 'B 金鱼', fly: false, water: true },
        { id: 'C', label: 'C 兔子', fly: false, water: false },
        { id: 'D', label: 'D 小狗', fly: false, water: false },
        { id: 'E', label: 'E 海豚', fly: false, water: true },
        { id: 'F', label: 'F 另一条金鱼', fly: false, water: true },
        { id: 'G', label: 'G 蝴蝶', fly: true, water: false },
      ]
    : [
        { id: 'A', label: 'A 燕子', fly: true, water: false },
        { id: 'B', label: 'B 金鱼', fly: false, water: true },
        { id: 'C', label: 'C 兔子', fly: false, water: false },
        { id: 'D', label: 'D 鸽子', fly: true, water: false },
        { id: 'E', label: 'E 海豚', fly: false, water: true },
        { id: 'F', label: 'F 蝴蝶', fly: true, water: false },
      ];
export function classificationModel(
  criterion: 'fly' | 'water',
  review: boolean,
  same = false,
): ClassificationRecordVisual {
  const cards = animalCards(review);
  const positive = cards.filter((c) => c[criterion]).length;
  return {
    kind: 'classification-record',
    rows: [
      {
        label: criterion === 'fly' ? '会飞' : '能在水中生活',
        mark: review ? 'tick' : 'circle',
        count: positive,
      },
      {
        label: criterion === 'fly' ? '不会飞' : '不能在水中生活',
        mark: (() => {
          if (same) return review ? 'tick' : 'circle';
          return 'triangle';
        })(),
        count: cards.length - positive,
      },
    ],
  };
}
function tasks(review: boolean): Question[] {
  const cards = animalCards(review);
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const result: Question[] = [];
  for (const criterion of ['fly', 'water'] as const) {
    const visual = classificationModel(criterion, review);
    const yes = required(visual.rows[0]);
    const no = required(visual.rows[1]);
    result.push({
      id: `${prefix}-${criterion}-select`,
      knowledge: `${id}-${criterion}-select`,
      prompt: `按“${criterion === 'fly' ? '能不能飞' : '能不能在水中生活'}”分类，选出所有${yes.label}的动物卡。这里只统计给定卡片，同种动物不同卡仍各算一张。`,
      choices: cards.map((c) => ({ id: c.id, label: c.label })),
      rule: {
        kind: 'set',
        values: cards.filter((c) => c[criterion]).map((c) => c.id),
      },
      hint: '看清这次标准，只选符合的全部卡片，不改按大小或动物名字分。',
      explanation:
        '按本题指定能力分类；不会飞与能在水中生活不是同一条件，两次分组可以不同。',
    });
    for (const [index, row] of visual.rows.entries())
      result.push({
        id: `${prefix}-${criterion}-count-${index}`,
        knowledge: `${id}-${criterion}-count-${index}`,
        prompt: `记录中“${row.label}”这一类有几张动物卡？每个符号表示1张。`,
        visual,
        rule: { kind: 'number', value: row.count },
        hint: '先读类别标签，再逐个数本组符号，不加另一组。',
        explanation: `这一类有${row.count}张。符号形状不影响数量，每张只记一次。`,
      });
    result.push(
      {
        id: `${prefix}-${criterion}-compare`,
        knowledge: `${id}-${criterion}-compare`,
        prompt: '比较分类记录，哪一类卡片更多？同样多也要如实记录。',
        visual,
        choices: [
          { id: 'yes', label: yes.label },
          { id: 'no', label: no.label },
          { id: 'equal', label: '同样多' },
        ],
        rule: {
          kind: 'choice',
          value: (() => {
            if (yes.count === no.count) return 'equal';
            return yes.count > no.count ? 'yes' : 'no';
          })(),
        },
        hint: '逐个点数或一一对应，不能凭符号大小或图示占地方多少判断。',
        explanation: `两类分别为${yes.count}张和${no.count}张，比较数量而不是类别图标。`,
      },
      {
        id: `${prefix}-${criterion}-total`,
        knowledge: `${id}-${criterion}-total`,
        prompt: '这次给定动物卡全部分入两类、不重复不遗漏，总共记录几张？',
        visual,
        rule: { kind: 'number', value: cards.length },
        hint: '把两个互不重复类别的实际记录合起来核对。',
        explanation: `共${cards.length}张。换分类标准不会凭空新增或拿走卡片。`,
      },
    );
  }
  const cups = review
    ? [
        { id: 'A', label: 'A 蓝色有把手杯', handle: true, red: false },
        { id: 'B', label: 'B 红色无把手杯', handle: false, red: true },
        { id: 'C', label: 'C 红色有把手杯', handle: true, red: true },
        { id: 'D', label: 'D 黄色无把手杯', handle: false, red: false },
        { id: 'E', label: 'E 另一只红色无把手杯', handle: false, red: true },
      ]
    : [
        { id: 'A', label: 'A 红色有把手杯', handle: true, red: true },
        { id: 'B', label: 'B 蓝色无把手杯', handle: false, red: false },
        { id: 'C', label: 'C 黄色有把手杯', handle: true, red: false },
        { id: 'D', label: 'D 另一只红色有把手杯', handle: true, red: true },
      ];
  for (const criterion of ['handle', 'red'] as const)
    result.push({
      id: `${prefix}-cup-${criterion}`,
      knowledge: `${id}-cup-${criterion}`,
      prompt: `按“${criterion === 'handle' ? '有没有把手' : '颜色'}”分类，选出所有${criterion === 'handle' ? '有把手的' : '红色的'}杯子。`,
      choices: cups.map((c) => ({ id: c.id, label: c.label })),
      rule: {
        kind: 'set',
        values: cups.filter((c) => c[criterion]).map((c) => c.id),
      },
      hint: '这次只采用题目要求的标准；杯子颜色和把手是不同特点。',
      explanation:
        '同一批杯子按不同特点可以得到不同分组，每次仍需全部归类且不重复。',
    });
  const simple = [
    {
      key: 'change',
      prompt: review
        ? '同一批杯子改按颜色分，原来按把手得到的分组一定不变吗？'
        : '同一批动物由会不会飞改按水中生活能力分，各类结果一定一样吗？',
      good: '不一定，标准变了，分组可以改变',
      bad: '一定一样，不能换标准',
      hint: '先说本次想了解哪种特点。',
      explanation:
        '物品没有增减，但不同标准对应不同分类结果；不能混用两种标准。',
    },
    {
      key: 'complete',
      prompt: review
        ? '一张卡既记在第一类又记在第二类，记录是否需要检查？'
        : '同一标准下把一张卡记录两次，会不会多算？',
      good: '要检查，每张只归一次',
      bad: '不用，记两次更清楚',
      hint: '用一对一核对每张与一个符号。',
      explanation:
        '本课每次互不重复的分类记录应不重不漏。开放多标签调查需另定标准，不混进本次计数。',
    },
    {
      key: 'omission',
      prompt: review
        ? '分类后有一张卡还留在桌上，没有计入任一组，这样记录完整吗？'
        : '两组记录合起来少一张，应该怎样做？',
      good: '逐张核对有没有遗漏',
      bad: '不用检查，随意改一个数',
      hint: '回到原始卡片，检查各张记录。',
      explanation: '记录结果要能逐个对应真实对象，不能用猜测补数。',
    },
    {
      key: 'criterion',
      prompt: review
        ? '想知道有把手杯有几只，应该按什么标准分？'
        : '想知道会飞动物卡有几张，应该按什么标准分？',
      good: review ? '有没有把手' : '能不能飞',
      bad: review ? '杯子颜色' : '动物大小',
      hint: '根据想知道的问题选对应特点。',
      explanation: '先提出问题，确定一致标准，再分类、记录并核对。',
    },
    {
      key: 'one-mark',
      prompt: review ? '记录中一个“✓”表示什么？' : '记录中一个“○”表示什么？',
      good: '这一类的1张卡',
      bad: '一个类别的全部卡',
      hint: '本课约定一个符号对应一个对象。',
      explanation: '符号是一对一记录，不能把一个图标当整组。',
    },
    {
      key: 'same-mark',
      prompt: review
        ? '两类都用“✓”记录，只要标签清楚、每项对应1张，能分清数量吗？'
        : '两类都用“□”记录，只要标签清楚、每项对应1张，能分清数量吗？',
      good: '能，分别看每类标签和记录',
      bad: '不能，符号必须不同',
      hint: '同符号仍可用类别标签分组。',
      explanation: '可以用不同符号，也可以两类用同符号，关键是约定与分组清楚。',
    },
    {
      key: 'mark-shape',
      prompt: review
        ? '某组把“○”改为“✓”，个数不变，实际数量会变吗？'
        : '某组把“△”改为“□”，个数不变，实际数量会变吗？',
      good: '不会，只改变记录符号',
      bad: '会，符号不同就改变数量',
      hint: '数的是对应对象，不是图标外形。',
      explanation: '同样一对一符号数量，换形状不改变对象数。',
    },
    {
      key: 'blank',
      prompt: review
        ? '某类确实没有对象，这一行没有符号，数量填什么？'
        : '逐张核对某类没有卡片，这组记录空白，数量应填什么？',
      good: '0',
      bad: '空白表示数量不知道，一律猜1',
      hint: '题目已经确认确实没有该类对象。',
      explanation: '没有该类对象时数量为0；与未调查或漏记造成空白不同。',
    },
  ];
  for (const item of simple)
    result.push({
      id: `${prefix}-${item.key}`,
      knowledge: `${id}-${item.key}`,
      prompt: item.prompt,
      choices: [
        { id: 'good', label: item.good },
        { id: 'bad', label: item.bad },
      ],
      rule: { kind: 'choice', value: 'good' },
      hint: item.hint,
      explanation: item.explanation,
    });
  return result;
}
export const sujiaoClassificationDraft: Lesson = {
  id,
  title: '分类与记录：先定标准，再逐项核对',
  textbookTitle: '数据分类（一）·按标准分类与表示结果',
  page: 37,
  version: 1,
  status: 'preparing',
  goal: '按明确标准分类，用一个符号表示一个对象，核对不重复不遗漏，比较换标准后的结果。',
  prerequisite: '会逐个点数、比较数量，认识0表示没有。',
  parentTip:
    '依据已读37～38页活动，本站动物和杯子选择为原创文字卡，不复制教材插图或原数量；动物能力按所列常见种类讨论，不泛化所有鸟会飞或海豚是鱼。安全纸卡/塑料用品代替接触野生动物与玻璃杯；标准、分类、图示记录、真实操作分别说明。班级调查和练习五在调查、分类应用、泳池分类及整理课中分别练习。',
  steps: [
    {
      title: '先问想知道什么',
      text: '想知道会飞和不会飞各有多少，先按能不能飞分；想知道能在水中生活各有多少，就改按另一标准。两次不混用。可先把纸卡分堆，再分别点数；同种动物两张卡仍算两个对象，不把种类数当卡片数。',
      activity:
        '准备几张常见动物文字卡，与家长说清一种标准，实际分堆并逐张核对。',
    },
    {
      title: '一个符号表示一个对象',
      text: '图示是原创动物卡分类记录。先读类别标签，再数每个符号；每张卡画一个符号。不重记同一张，也不漏记，记录可以用圆、三角形或勾，形状本身不是数量。每类点完，再核对两类合起来是否与原卡数相同。',
      visual: classificationModel('fly', false),
      activity: '把实际分好的纸卡逐张对应一个符号，检查原卡和符号一一对应。',
    },
    {
      title: '换标准，结果可以不同',
      text: '同样动物卡改按能不能在水中生活分类，重新分堆并记录。海豚在水中生活，但不能因这个标准把它归成鱼类。杯子可以按有没有把手分，也可以按颜色分；不同分组不是谁随意分错，要先核对双方采用的标准。',
      visual: classificationModel('water', false),
      activity:
        '同一批安全用品先按一种特点分，再按另一特点分，比较每类数量和不变的总数。',
    },
    {
      title: '符号相同也能记录，表达过程',
      text: '两类都用相同符号，只要标签清楚且一符号一对象，也能表示结果。数0需要确实调查到没有对象，不把未调查的空白当0。用自己的话说：按什么标准、分成哪些类、各有多少、怎样检查没漏没重复。也可观察植物和不同叶形，用安全图片或落叶分类，不损坏植物。',
      visual: classificationModel('fly', false, true),
      activity:
        '自己画两类同符号记录并讲清过程；可另用安全落叶或图片按形状整理。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '用安全纸卡或用品按一种明确标准实际分类，逐张核对每个对象只归一次；说清各类和数量。',
      '把同一批物品改按另一标准重新分，分别表示两次结果，比较各类数量与不变的总数。',
      '为实际分类画一对象一符号的记录，再试两类使用相同符号；逐项核对不遗漏不重复，并用自己的话讲过程。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '先真实分、数、画、说再确认，网页选对不代替操作；无材料可跳过。',
      explanation: '实际分类记录独立人工确认，多种合理标准可以保留。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt: '换标准后你发现了什么？怎样检查记录没有遗漏或重复？记自己的话。',
      rule: { kind: 'reflection' },
      hint: '可以说标准、逐张对应、标签或总数核对。',
      explanation: '反思原话独立保存，不评唯一句子。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读分类正文与原创分类记录范围核验',
    notes: `依据ISBN ${source.isbn}印刷37～38页，明确标准、动物二分、不同或同符号逐项表示、不重不漏、换水中生活标准、植物与落叶/杯子分类。本站文字卡与数量原创，不复制插图；复习改变卡片、对象数量、各类比例与标准应用。39～41页调查和练习五虽已读取，尚不宣称本课完成这些活动。版权版次印次仍待核验。`,
  },
};
