import type { BlockCardsVisual, Lesson, Question } from '../learning/types';

import { blockColors, blockGroups, blockShapes } from '../learning/block-cards';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-classification-applications';
const shapeNames = {
  cube: '正方体',
  cuboid: '长方体',
  cylinder: '圆柱',
  sphere: '球',
};
const colorNames = { red: '红色', blue: '蓝色', yellow: '黄色' };
export function blockModel(review: boolean): BlockCardsVisual {
  return {
    kind: 'block-cards',
    cards: review
      ? [
          { shape: 'sphere', color: 'yellow' },
          { shape: 'cuboid', color: 'blue' },
          { shape: 'cylinder', color: 'yellow' },
          { shape: 'cuboid', color: 'blue' },
          { shape: 'cube', color: 'red' },
          { shape: 'sphere', color: 'blue' },
          { shape: 'cuboid', color: 'yellow' },
          { shape: 'cylinder', color: 'blue' },
        ]
      : [
          { shape: 'cube', color: 'red' },
          { shape: 'cuboid', color: 'blue' },
          { shape: 'cube', color: 'blue' },
          { shape: 'cylinder', color: 'red' },
          { shape: 'sphere', color: 'yellow' },
          { shape: 'cube', color: 'red' },
          { shape: 'cuboid', color: 'red' },
          { shape: 'cylinder', color: 'blue' },
        ],
  };
}
export function sportsCards(review: boolean) {
  const attributes = review
    ? [
        'rabbit-jump',
        'monkey-run',
        'rabbit-jump',
        'deer-jump',
        'monkey-jump',
        'rabbit-run',
        'monkey-jump',
        'rabbit-jump',
        'deer-run',
      ]
    : [
        'monkey-run',
        'rabbit-run',
        'monkey-jump',
        'deer-run',
        'monkey-run',
        'rabbit-jump',
        'monkey-jump',
        'rabbit-run',
        'deer-jump',
      ];
  const activities = { run: '跑步', jump: '跳远' };
  const kinds = { monkey: '小猴', rabbit: '小兔', deer: '小鹿' };
  return attributes.map((value, index) => {
    const [kind, activity] = value.split('-') as [
      keyof typeof kinds,
      keyof typeof activities,
    ];
    const letter = String.fromCodePoint(65 + index);
    return {
      id: letter,
      kind,
      activity,
      label: `${letter} ${kinds[kind]}，参加${activities[activity]}`,
    };
  });
}
function tasks(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const result: Question[] = [];
  const visual = blockModel(review);
  for (const shape of blockShapes)
    result.push({
      id: `${prefix}-shape-${shape}`,
      knowledge: `${id}-shape-${shape}`,
      prompt: `按积木形状分类，${shapeNames[shape]}有几块？每张图卡表示1块。`,
      visual,
      rule: {
        kind: 'number',
        value: visual.cards.filter((c) => c.shape === shape).length,
      },
      hint: '按立体形状，别把一块的几个面或图卡框算成新积木，也别改按颜色。',
      explanation:
        '同一种形状可以有不同颜色，每块只计一次。正方体与长方体按本课小学分类分别记录。',
    });
  for (const color of blockColors)
    result.push({
      id: `${prefix}-color-${color}`,
      knowledge: `${id}-color-${color}`,
      prompt: `按积木颜色分类，${colorNames[color]}有几块？颜色文字与轮廓颜色对应。`,
      visual,
      rule: {
        kind: 'number',
        value: visual.cards.filter((c) => c.color === color).length,
      },
      hint: '这次只看指定颜色，形状不同也能同属一类。',
      explanation:
        '颜色类与形状类是不同标准，同一块可以在不同次分类中归到不同类，但一次分类内不重复。',
    });
  for (const criterion of ['shape', 'color'] as const) {
    const groups = blockGroups(visual, criterion);
    const max = Math.max(...groups.map((g) => g.letters.length));
    result.push({
      id: `${prefix}-${criterion}-most`,
      knowledge: `${id}-${criterion}-most`,
      prompt: `想知道哪种${criterion === 'shape' ? '形状' : '颜色'}积木最多，按这个标准比较，选全部最多的类别。`,
      visual,
      choices: groups.map((g) => ({
        id: g.value,
        label:
          criterion === 'shape'
            ? shapeNames[g.value as keyof typeof shapeNames]
            : colorNames[g.value as keyof typeof colorNames],
      })),
      rule: {
        kind: 'set',
        values: groups
          .filter((g) => g.letters.length === max)
          .map((g) => g.value),
      },
      hint: '先确认形状或颜色标准，再分别点数，最多可能并列。',
      explanation: '不同标准回答不同问题，不能用红色数量回答哪种立体最多。',
    });
  }
  const targetColor = review ? 'yellow' : 'red';
  const targetShape = review ? 'cylinder' : 'cube';
  for (const [criterion, target] of [
    ['shape', targetShape],
    ['color', targetColor],
  ] as const)
    result.push({
      id: `${prefix}-${criterion}-select`,
      knowledge: `${id}-${criterion}-select`,
      prompt: `按${criterion === 'shape' ? '形状' : '颜色'}分类，选出全部${criterion === 'shape' ? shapeNames[target as keyof typeof shapeNames] : colorNames[target as keyof typeof colorNames]}图卡的字母。`,
      visual,
      choices: visual.cards.map((_, i) => ({
        id: String.fromCodePoint(65 + i),
        label: String.fromCodePoint(65 + i),
      })),
      rule: {
        kind: 'set',
        values: visual.cards.flatMap((c, i) =>
          c[criterion] === target ? [String.fromCodePoint(65 + i)] : [],
        ),
      },
      hint: '选择全部符合这一标准的对象，别把另一种标准混进来。',
      explanation: '按题目指定的一个标准逐卡核对，不漏选或多选。',
    });
  const cards = sportsCards(review);
  for (const criterion of ['kind', 'activity'] as const) {
    const names =
      criterion === 'kind'
        ? { monkey: '小猴', rabbit: '小兔', deer: '小鹿' }
        : { run: '跑步', jump: '跳远' };
    const target = criterion === 'kind' ? 'monkey' : 'run';
    const matches = cards.filter((c) => c[criterion] === target);
    const choices = Object.entries(names).map(([key, label]) => ({
      id: key,
      label,
    }));
    const max = Math.max(
      ...choices.map(
        (c) => cards.filter((card) => card[criterion] === c.id).length,
      ),
    );
    result.push({
      id: `${prefix}-${criterion}-select`,
      knowledge: `${id}-${criterion}-select`,
      prompt: `以下原创运动卡，按${criterion === 'kind' ? '动物种类选全部小猴' : '参加活动选全部跑步者'}。每张代表1名虚构参加者。`,
      choices: cards.map((c) => ({ id: c.id, label: c.label })),
      rule: { kind: 'set', values: matches.map((c) => c.id) },
      hint: '同样九张卡，种类与参加的活动是两种标准。',
      explanation:
        '同种动物可以参加不同活动，同一活动也可以有不同动物，标准不能混用。',
    });
    const material = cards.map((c) => c.label).join('；');
    result.push(
      {
        id: `${prefix}-${criterion}-count`,
        knowledge: `${id}-${criterion}-count`,
        prompt: `按这次标准，${criterion === 'kind' ? '小猴' : '参加跑步的'}有多少名？`,
        material,
        rule: { kind: 'number', value: matches.length },
        hint: '逐张根据指定属性数，不把另一次分类结果照抄。',
        explanation: `本次示例符合条件的有${matches.length}名，不代表真实运动能力或动物比赛事实。`,
      },
      {
        id: `${prefix}-${criterion}-most`,
        knowledge: `${id}-${criterion}-most`,
        prompt: `同一份卡片中，哪${criterion === 'kind' ? '种动物' : '项活动参加者'}最多？保留所有并列最多。`,
        material,
        choices,
        rule: {
          kind: 'set',
          values: choices
            .filter(
              (c) =>
                cards.filter((card) => card[criterion] === c.id).length === max,
            )
            .map((c) => c.id),
        },
        hint: '根据所问对象决定按种类或活动分，再比较数量。',
        explanation: '这次类别最多取决于所选标准，卡片是原创虚构情境。',
      },
    );
  }
  const scope = [
    {
      key: 'criterion',
      prompt: review
        ? '想知道哪项活动参加者最多，应按什么分？'
        : '想知道哪种积木最多，应按什么分？',
      good: review ? '参加的活动' : '积木形状',
      bad: review ? '动物种类' : '积木颜色',
      hint: '从问题中找要比较的特点。',
      explanation: '先提出问题，再确定标准、分类记录和比较。',
    },
    {
      key: 'conservation',
      prompt: review
        ? '九张运动卡改按另一标准分，没有增减，总张数变吗？'
        : '八张积木卡从按形状改按颜色分，没有增减，总块数变吗？',
      good: '不变，每张/块仍只计一次',
      bad: '改变标准就自动增加对象',
      hint: '分类只重新归组，不增加实际对象。',
      explanation: '各类别数量可以变，原始对象总数不变；分组要不重不漏。',
    },
    {
      key: 'library',
      prompt: review
        ? '看到图书室分类方式与家里不同，怎样了解原因？'
        : '参观图书室后怎样提出分类建议？',
      good: '先观察并询问采用的标准，再结合找书需要说明建议',
      bad: '与自己摆法不同就直接判错',
      hint: '真实分类可能根据读者和管理需要决定，先了解规则。',
      explanation:
        '分类交流与建议保留不同合理方案，不把某一种书架安排强定为全国统一。',
    },
  ];
  for (const item of scope)
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
export const sujiaoClassificationApplicationsDraft: Lesson = {
  id,
  title: '分类综合：按问题选标准与整理图书',
  textbookTitle: '数据分类（一）·想想做做与练习五',
  page: 40,
  version: 1,
  status: 'preparing',
  goal: '同一批对象按不同标准分别分类记录，根据问题比较数量，提出自己的分类问题，实际观察图书分类并交流建议。',
  prerequisite: '认识四种基本立体，会逐项点数，知道分类标准应一致。',
  parentTip:
    '依据已读40～41页运动卡与积木多标准、提出问题和图书室观察交流范围；本站图卡/文字卡/数量全部原创，运动参加者是虚构情境，不是动物真实比赛能力。积木分开展示避免遮挡，颜色文字与图形冗余表达。真实图书室有各自安排，不能编造管理员回复；无条件实际参观/交流可跳过任务并保留待做，家庭图书整理另行注明。',
  steps: [
    {
      title: '按形状，回答哪种积木最多',
      text: '每张卡表示一个立体积木，为便于核对分开展示。想知道哪种形状最多，就按正方体、长方体、圆柱和球分别计数。不要把正方体的几个面当成好几块，也不要改按颜色回答形状问题。同形可以有不同颜色。',
      visual: blockModel(false),
      activity: '取安全积木或图卡，按四类立体形状分组、逐块记录，比较最多。',
    },
    {
      title: '同一批改按颜色，总数不变',
      text: '仍然使用这八张卡，改按红、蓝、黄分组，再记录各类有几块。同色可以形状不同。分类结果可以改变，总块数没有增减；每次都要各块只归一次，不把两次分类数量相加当成新增积木。颜色同时写成文字，不能只凭主题色猜。',
      visual: blockModel(false),
      activity: '把同样一批按颜色重新分类，比较两次的类别数量，核对不变总数。',
    },
    {
      title: '根据运动问题选择标准',
      text: '假想运动会里，同种动物可以参加不同活动，同一活动也可以有不同动物。问哪种动物最多，按动物种类；问哪项活动参加者最多，按参加的活动。先把问题说清，再逐项分类，不能照抄另一标准的结果。真实能力和喜好要询问，不能看外表猜。',
      activity:
        '写几张原创参加者卡，尝试按种类和活动分别统计，再说一个自己想了解的分类问题。',
    },
    {
      title: '观察图书分类，提出具体建议',
      text: '有条件时到实际图书室观察书架标识，并与管理员老师了解分类依据。先说看见了什么、听到了什么，再结合找书是否方便提出具体建议。没有真实观察或交流时不编造回复，可以先整理家庭图书并注明范围，实际图书室任务保留待做。不同合理标准可以保留，反思按自己的话记录。',
      activity:
        '实际观察并交流图书室分类规则，提出具体问题或建议；无条件时可跳过该实际任务。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '取同一批安全积木或图卡，先按形状再按颜色分类，两次分别记录数量，指出最多的类别并核对总对象数不变。',
      '准备原创运动参加者文字卡，按种类和活动分别分类，讲清两个问题各用什么标准；再提出一个自己的分类问题。',
      '有条件时实际观察图书室的分类标识，与管理员老师交流其标准并提出具体找书建议；没有真实参观或交流不要确认已完成。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '实际分、记、说或观察交流完成后才确认，无条件可以跳过。',
      explanation:
        '实际任务独立人工确认，不以客观题正确代替；不编造真实管理员回复。',
    })),
    ...[
      {
        key: 'question',
        prompt:
          '提出一个自己想了解的分类问题，说清对象范围和准备采用的标准；可以用家庭用品、图书或自己的文字卡。',
      },
      {
        key: 'reflection',
        prompt:
          '实际整理或观察时发现了什么？你有什么具体分类建议？注明是在家里、图书室，还是尚未实际观察；按自己的话记录。',
      },
    ].map((item): Question => ({
      id: `${id}-${item.key}`,
      knowledge: `${id}-${item.key}`,
      prompt: item.prompt,
      rule: { kind: 'reflection' },
      hint: '记录自己的问题、发现与建议，不写固定答案或编造实际经历。',
      explanation: '开放文字独立保存，correct=null，不计客观正确率。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读综合分类与原创双属性图卡范围核验',
    notes: `依据ISBN ${source.isbn}印刷40～41页，按动物种类/活动、积木形状/颜色选标准，提出分类问题和实际图书分类交流。本站图卡与文字情境原创，不复制原图文，复习换实际形状/颜色/活动分布和最多类别。真实观察、建议与开放问题人工或原话记录，不编造调查或管理员回复；泳池情境另课已提供，完整单元逐项审核仍待补，不以本课代替全单元，版次印次未知。`,
  },
};
