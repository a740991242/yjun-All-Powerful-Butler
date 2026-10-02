import type { Lesson, Question } from '../learning/types';

import {
  leafCards,
  leafColors,
  leafShapes,
  natureModel,
  plantCards,
} from '../learning/nature-cards';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-nature-classification';
const shapes = { long: '长条形', fan: '扇形', lobed: '分裂叶形' };
const colors = { red: '红色', green: '绿色', yellow: '黄色' };
function tasks(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const result: Question[] = [];
  const plants = plantCards(review);
  const vegetation = plants.filter(
    (c) => c.object === 'tree' || c.object === 'flower',
  );
  const plantVisual = natureModel('plants', review);
  const plantChoices = [
    { id: 'plant', label: '植物' },
    { id: 'animal', label: '动物' },
  ];
  result.push(
    {
      id: `${prefix}-plants-select`,
      knowledge: `${id}-plants-select`,
      prompt: '从这些图卡中选出全部植物的字母。每张只表示一个对象。',
      visual: plantVisual,
      choices: plants.map((c) => ({ id: c.id, label: c.id })),
      rule: { kind: 'set', values: vegetation.map((c) => c.id) },
      hint: '先看对象是什么，再按植物与动物分别归类，别按颜色或是否能飞。',
      explanation:
        '图中的树和花草是植物，猫和鸟是动物；同种对象不同卡片仍分别计数，不把会不会移动当植物的唯一判断方法。',
    },
    {
      id: `${prefix}-plants-count`,
      knowledge: `${id}-plants-count`,
      prompt: '按植物与动物分类，图卡中植物有几个？',
      visual: plantVisual,
      rule: { kind: 'number', value: vegetation.length },
      hint: '逐张确认植物卡，各卡只计一次。',
      explanation: `本图植物卡有${vegetation.length}张；这不是植物种数，不把几片叶子另当几株植物。`,
    },
    {
      id: `${prefix}-plants-most`,
      knowledge: `${id}-plants-most`,
      prompt: '按植物与动物两类比较，哪类数量最多？选出全部并列最多的类别。',
      visual: plantVisual,
      choices: plantChoices,
      rule: {
        kind: 'set',
        values: (() => {
          if (vegetation.length === 4) return ['plant', 'animal'];
          return vegetation.length > 4 ? ['plant'] : ['animal'];
        })(),
      },
      hint: '先分别点数两类，若数量相等就都选。',
      explanation: '最多可能是并列；同类不同对象分别记录，不只数类别名称。',
    },
    {
      id: `${prefix}-plants-total`,
      knowledge: `${id}-plants-total`,
      prompt: '这份图卡全部分完，植物与动物合起来有几个对象？',
      visual: plantVisual,
      rule: { kind: 'number', value: plants.length },
      hint: '完整图卡各一次，分类不增减原始对象。',
      explanation: '植物与动物分组数合计应与原图卡总数相同，不重复不遗漏。',
    },
  );
  const leaves = leafCards(review);
  const leafVisual = natureModel('leaves', review);
  for (const criterion of ['shape', 'color'] as const) {
    const groups = criterion === 'shape' ? leafShapes : leafColors;
    const labels = { ...shapes, ...colors };
    for (const group of groups) {
      const matching = leaves.filter((c) => c[criterion] === group);
      const name = labels[group];
      result.push(
        {
          id: `${prefix}-${criterion}-${group}-count`,
          knowledge: `${id}-${criterion}-${group}-count`,
          prompt: `按树叶${criterion === 'shape' ? '外轮廓形状' : '颜色'}分类，${name}有几片？`,
          visual: leafVisual,
          rule: { kind: 'number', value: matching.length },
          hint: '只按这次指定标准判断，叶脉、叶柄与卡框不是额外树叶。',
          explanation: `本次符合指定标准的有${matching.length}片，同类不同字母各计一次。`,
        },
        {
          id: `${prefix}-${criterion}-${group}-select`,
          knowledge: `${id}-${criterion}-${group}-select`,
          prompt: `按树叶${criterion === 'shape' ? '形状' : '颜色'}分类，选择全部${name}树叶的字母。`,
          visual: leafVisual,
          choices: leaves.map((c) => ({ id: c.id, label: c.id })),
          rule: { kind: 'set', values: matching.map((c) => c.id) },
          hint: '逐卡核对指定特点，别把另一标准混进来，不漏选或多选。',
          explanation:
            '形状与颜色是两个不同的分类标准；本图示意外轮廓，不靠它鉴定树种。',
        },
      );
    }
    const choices = groups.map((group) => ({
      id: group,
      label: labels[group],
    }));
    const max = Math.max(
      ...groups.map((g) => leaves.filter((c) => c[criterion] === g).length),
    );
    result.push({
      id: `${prefix}-${criterion}-most`,
      knowledge: `${id}-${criterion}-most`,
      prompt: `同一批树叶按${criterion === 'shape' ? '外轮廓形状' : '颜色'}分，哪类最多？选择全部并列最多。`,
      visual: leafVisual,
      choices,
      rule: {
        kind: 'set',
        values: groups.filter(
          (g) => leaves.filter((c) => c[criterion] === g).length === max,
        ),
      },
      hint: '根据问题确定标准，再逐片记录和比较。',
      explanation:
        '分组改变可能使最多类别改变；并列最多要完整保留，不按颜色深浅或图形面积判断数量。',
    });
  }
  result.push({
    id: `${prefix}-leaves-total`,
    knowledge: `${id}-leaves-total`,
    prompt: review
      ? '树叶从按颜色改按形状分，没有增减，全部仍有几片？'
      : '树叶从按形状改按颜色分，没有增减，全部仍有几片？',
    visual: leafVisual,
    rule: { kind: 'number', value: leaves.length },
    hint: '同一批卡片改归组，不是增加一批树叶。',
    explanation: '不同标准各类数量可以变，总对象数保持不变。',
  });
  const scopes = [
    {
      key: 'criterion',
      prompt: review
        ? '想知道哪种颜色的叶片最多，应选什么标准？'
        : '想知道哪种叶片外轮廓最多，应选什么标准？',
      good: review ? '叶片颜色' : '叶片外轮廓形状',
      bad: review ? '叶片外轮廓形状' : '叶片颜色',
      explanation: '问题先确定比较特点，不能用另一标准的数量直接回答。',
    },
    {
      key: 'unknown',
      prompt: review
        ? '真实叶片特点看不清，怎样记录？'
        : '真实观察暂时分不清一张对象卡，怎样处理？',
      good: '保留待核对，询问或观察清楚再归类',
      bad: '随便归一类，直接确认全做完了',
      explanation:
        '不确定不冒充已确认，也不能直接当成没有。真实观察可以核对和修正。',
    },
    {
      key: 'scope',
      prompt: review
        ? '家里八张树叶示意卡的数量，能代表公园所有树叶吗？'
        : '这些原创植物图卡的分类结果，能代表所有植物的数量吗？',
      good: '不能，结果只属于这份图卡的范围',
      bad: '能，图卡数就是所有真实对象数',
      explanation:
        '示例、家庭观察和全体自然对象范围不同，不把本题外轮廓归类当植物学鉴定。',
    },
  ];
  for (const item of scopes)
    result.push({
      id: `${prefix}-${item.key}`,
      knowledge: `${id}-${item.key}`,
      prompt: item.prompt,
      choices: [
        { id: 'good', label: item.good },
        { id: 'bad', label: item.bad },
      ],
      rule: { kind: 'choice', value: 'good' },
      hint: '先明确实际问题、范围和已经确认的特点。',
      explanation: item.explanation,
    });
  return result;
}
export const sujiaoNatureClassificationDraft: Lesson = {
  id,
  title: '植物与树叶分类：观察特点，分别记录',
  textbookTitle: '数据分类（一）·想想做做',
  page: 38,
  version: 1,
  status: 'preparing',
  goal: '区分图卡中的植物与动物；按叶片外轮廓或颜色分别分类、逐项记录并比较并列最多，说明观察范围。',
  prerequisite: '会逐项点数，知道一次分类只采用一个标准。',
  parentTip:
    '依据已读印刷38页植物辨类、树叶分类与表示结果活动范围。本站图卡和数值原创，树叶三种外轮廓是示意分类，不用于鉴定物种，不把颜色与植物/动物属性混淆。家长可读题和说明；实际观察只选安全图卡或已有落叶，不采摘未知植物，不入口，触碰与清理由家长安排。未知对象保留待核对，不编造观察经历。',
  steps: [
    {
      title: '先看是什么，再选植物',
      text: '树和花草属于植物，猫和鸟属于动物。图中每张卡表示一个对象，同类有好几张仍分别计数。按植物与动物分，不按颜色、大小或会不会飞来代替。示例只说明这些卡片，不证明所有植物有同一种形状。',
      visual: natureModel('plants', false),
      activity:
        '说出各卡表示的对象，把植物卡圈出或单独摆放，核对没有漏选或重复。',
    },
    {
      title: '树叶先按外轮廓分',
      text: '本题叶片示意有长条形、扇形和分裂叶形三类。先按外轮廓分，各片做一个符号记录，再数各类几片。叶柄和叶脉不是新叶片，同形不同颜色也可归同一形状类。图示只是本题分类，不要求认识树种。',
      visual: natureModel('leaves', false),
      activity:
        '用图卡或安全材料按外轮廓分，分别记录数量与最多类别，包括并列。',
    },
    {
      title: '同一批改按颜色分',
      text: '保留原来的八片，不增不减，改按红、绿、黄文字颜色分类，再各做一个符号。两次类别数量可能不同，总数应相同。颜色不能只靠主题色猜，图卡同时有颜色文字；边框、叶脉和叶柄不另计片。',
      visual: natureModel('leaves', false),
      activity: '把同一批重新按颜色归组，比较两次记录，并核对总片数。',
    },
    {
      title: '自己观察、记录并说明范围',
      text: '在家长带领下用安全卡片或已有材料观察，先定问题和标准，再分类、逐项画圈或勾、填数量并说明结果。看不清的特点保留待核对；记录属于这次材料，不能推广为全公园或全部植物。真实活动完成后才确认，自己的发现按原话记。',
      activity:
        '选择一次真实小组材料，进行分类和记录，口述分类过程及实际范围。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际用安全图卡区分植物与动物，逐项核对植物卡没有遗漏或重复，并说明分类标准。',
      '用同一批安全叶片示意卡或已有材料，先按外轮廓再按颜色分，各画逐项符号并写数量，核对总数不变。',
      '口述这次真实分类过程、材料范围、最多与并列情况；不确定的特点标记待核对，不编造观察。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '实际看、分、记录或表达完成后再确认；没有条件可暂时跳过。',
      explanation:
        '真实活动单独人工确认，网页客观题答对不等于已经做过观察和记录。',
    })),
    ...[
      {
        key: 'question',
        prompt:
          '提出一个自己想了解的植物或树叶分类问题，说清这次对象范围与准备采用的标准。',
      },
      {
        key: 'reflection',
        prompt:
          '这次分类有什么发现或不确定的地方？记录自己的话，并注明实际观察过还是准备以后观察。',
      },
    ].map((item): Question => ({
      id: `${id}-${item.key}`,
      knowledge: `${id}-${item.key}`,
      prompt: item.prompt,
      rule: { kind: 'reflection' },
      hint: '按自己的话记录，保留待核对与未实际做过的情况，不编造经历。',
      explanation:
        '开放问题和反思不设唯一答案，独立保存correct=null，不计客观正确率。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '植物/树叶分类范围与原创双属性图卡核验',
    notes: `依据ISBN ${source.isbn}已读印刷38页。原创图卡与数量不复制教材图片或原题，植物/动物和叶片形状/颜色标准分开、逐项计数并保留并列。复习改变对象顺序与类别数量。实际观察/记录/表达独立人工确认，图示不用于物种鉴定；泳池综合情境另课已提供，完整单元逐项审核仍待做，版次印次未知。`,
  },
};
