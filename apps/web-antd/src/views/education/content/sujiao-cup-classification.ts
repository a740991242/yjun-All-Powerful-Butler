import type { Lesson, Question } from '../learning/types';

import { cupCards, cupModel } from '../learning/cup-cards';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-cup-classification';
function tasks(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const cards = cupCards(review);
  const visual = cupModel(review);
  const result: Question[] = [];
  const criteria = [
    {
      key: 'body',
      title: '杯身外形',
      groups: [
        { id: 'straight', label: '直筒杯身' },
        { id: 'tapered', label: '上宽下窄杯身' },
      ],
      matches: (c: (typeof cards)[number], g: string) => c.body === g,
    },
    {
      key: 'handle',
      title: '有没有把手',
      groups: [
        { id: 'with', label: '有把手' },
        { id: 'without', label: '无把手' },
      ],
      matches: (c: (typeof cards)[number], g: string) =>
        c.handle === (g === 'with'),
    },
    {
      key: 'color',
      title: '颜色',
      groups: [
        { id: 'red', label: '红色' },
        { id: 'blue', label: '蓝色' },
        { id: 'yellow', label: '黄色' },
      ],
      matches: (c: (typeof cards)[number], g: string) => c.color === g,
    },
  ];
  for (const criterion of criteria) {
    for (const group of criterion.groups) {
      const matching = cards.filter((c) => criterion.matches(c, group.id));
      result.push(
        {
          id: `${prefix}-${criterion.key}-${group.id}-count`,
          knowledge: `${id}-${criterion.key}-${group.id}-count`,
          prompt: `按${criterion.title}分类，${group.label}的杯子有几只？`,
          visual,
          rule: { kind: 'number', value: matching.length },
          hint: '先确定这次标准，各卡表示一只杯，杯口和把手不另计。',
          explanation: `本题符合标准的有${matching.length}只。杯身外形、把手和颜色是不同标准，不直接照抄另一次结果。`,
        },
        {
          id: `${prefix}-${criterion.key}-${group.id}-select`,
          knowledge: `${id}-${criterion.key}-${group.id}-select`,
          prompt: `按${criterion.title}分类，选出全部${group.label}杯卡的字母。`,
          visual,
          choices: cards.map((c) => ({ id: c.id, label: c.id })),
          rule: { kind: 'set', values: matching.map((c) => c.id) },
          hint: '逐只按指定特点选择，形状问题先忽略把手和颜色。',
          explanation:
            '同样杯身外形可以颜色不同、把手情况不同；同色也不一定同外形。一次按指定标准不漏不重。',
        },
      );
    }
    const max = Math.max(
      ...criterion.groups.map(
        (g) => cards.filter((c) => criterion.matches(c, g.id)).length,
      ),
    );
    result.push({
      id: `${prefix}-${criterion.key}-most`,
      knowledge: `${id}-${criterion.key}-most`,
      prompt: `按${criterion.title}比较，哪类杯子最多？选出全部并列最多。`,
      visual,
      choices: criterion.groups,
      rule: {
        kind: 'set',
        values: criterion.groups
          .filter(
            (g) =>
              cards.filter((c) => criterion.matches(c, g.id)).length === max,
          )
          .map((g) => g.id),
      },
      hint: '先分类再逐卡点数，相等时保留全部并列类。',
      explanation:
        '比较的是杯子数量，不是颜色深浅、外轮廓面积、把手大小或容量。',
    });
  }
  result.push({
    id: `${prefix}-total`,
    knowledge: `${id}-total`,
    prompt: review
      ? '从按颜色改按杯身外形分，没有增减，全部仍有几只杯？'
      : '从按杯身外形改按颜色分，没有增减，全部仍有几只杯？',
    visual,
    rule: { kind: 'number', value: cards.length },
    hint: '同一批杯卡重新归组，不是新增一批，全部字母各一次。',
    explanation:
      '分类结果可以不同，总对象数没有增减就保持不变；两次分类数不能相加当成实际杯数。',
  });
  const scopes = [
    {
      key: 'criterion',
      prompt: review
        ? '想知道黄色杯子有几只，应选什么标准？'
        : '想知道上宽下窄杯身有几只，应选什么标准？',
      good: review ? '颜色' : '杯身外形',
      bad: review ? '杯身外形' : '有没有把手',
      explanation:
        '问题决定标准，不能用有没有把手代替杯身外形分类，也不能用颜色代替外形。',
    },
    {
      key: 'capacity',
      prompt: review
        ? '本图两只杯子外形相近，能确定装水一样多吗？'
        : '只看本图直筒与上宽下窄外形，能确定谁装水更多吗？',
      good: '不能，本图没有容量或真实尺寸信息',
      bad: '能，凭画出的外形就确定',
      explanation:
        '本课观察分类，不测容量或按厘米计量；真实容量需另行了解，不从示意图猜。',
    },
    {
      key: 'scope',
      prompt: review
        ? '同种外形的不同字母杯卡，统计时怎样做？'
        : '杯口轮廓和把手，统计杯子时怎样做？',
      good: review
        ? '各卡分别计一只，不只计一个类别'
        : '每张一只，不把杯口或把手另计成杯',
      bad: review
        ? '相同外形只算一只，忽略其它字母'
        : '把杯口和把手都当成新增杯',
      explanation: '所数对象是杯卡，每个字母恰一只杯，类别数与对象数要区分。',
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
      hint: '明确所数对象、图示给出的特点和本题范围。',
      explanation: item.explanation,
    });
  return result;
}
export const sujiaoCupClassificationDraft: Lesson = {
  id,
  title: '杯子分类：外形、把手与颜色分开看',
  textbookTitle: '数据分类（一）·想想做做',
  page: 38,
  version: 1,
  status: 'preparing',
  goal: '按杯身外形与颜色分别分类记录，再区分把手特征；根据问题选标准、比较并列最多并核对总数不变。',
  prerequisite: '会逐项点数和记录，知道一次分类标准一致。',
  parentTip:
    '依据已读印刷38页杯子先按形状再按颜色分类并分别表示的范围。本站原创杯卡与数值，杯身以直筒/上宽下窄两种外形观察，不把把手当杯身外形唯一标准，不教授圆台名词。示意图不测容量或实际尺寸。实际活动用纸卡或家长准备的安全空杯，按条件选材料，不必盛水。',
  steps: [
    {
      title: '杯身外形，先不看把手与颜色',
      text: '看杯身两侧和上下宽窄，本题分直筒与上宽下窄两类。先忽略把手与颜色，同种杯身可能有把手也可能没有，同种外形也能有不同颜色。每张卡只表示一只，杯口和把手不是额外杯子。',
      visual: cupModel(false),
      activity: '按杯身外形实际分卡，各只杯对应一个符号，分别记录。',
    },
    {
      title: '同一批改按颜色分',
      text: '保留同样一批杯卡，不增减，改按红、蓝、黄文字颜色分组。颜色与杯身外形不同，同色杯可以外形不同；重新分类各类数量可变，总数应不变。颜色文字与图示共同说明，不凭主题主色猜。',
      visual: cupModel(false),
      activity: '把同一批按颜色重分，各画一圈或勾，填数量并核对合计。',
    },
    {
      title: '把手是另外一种标准',
      text: '问有把手与无把手，才按把手特征分。本题直筒和上宽下窄都可能有把手，不能把有把手都叫同一种杯身外形。每次读清问题，按这次标准不重复、不遗漏，比较最多要保留并列。',
      visual: cupModel(false),
      activity: '再按把手分类，比较三次记录，说清每次标准与各类结果。',
    },
    {
      title: '根据问题记录，并说明已知范围',
      text: '说清自己想了解的是外形、把手还是颜色，然后分、逐项画符号、写数量并核对。看图不能确定容量或真实尺寸，不把分类当容量测量。纸面与实物活动完成后才确认，自主问题与发现按原话记。',
      activity: '用安全空杯或纸卡完成一次实际分类记录，向家长口述过程与范围。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '用纸卡或安全空杯按杯身外形实际分类，说明直筒与上宽下窄，先忽略颜色和把手，并逐项画符号。',
      '同一批材料再按颜色、把手分别分类，各次单独写数量，核对原始对象总数没有增减。',
      '口述自己选择的标准、每类数量与最多/并列，说明没有测容量或真实尺寸，不凭图猜容量。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '实际分类、画记录或口述后才确认，无条件可以暂时跳过。',
      explanation: '实际活动独立人工确认，网页答对不代替已经分卡与画记录。',
    })),
    ...[
      {
        key: 'question',
        prompt: '提出一个自己的杯子分类问题，写清本次材料范围与采用的标准。',
      },
      {
        key: 'reflection',
        prompt:
          '同一批杯子换标准后你有什么发现？哪里还需核对？记自己的话，并注明实际活动是否做过。',
      },
    ].map((item): Question => ({
      id: `${id}-${item.key}`,
      knowledge: `${id}-${item.key}`,
      prompt: item.prompt,
      rule: { kind: 'reflection' },
      hint: '自主问题与发现可不同，记录原话，不编造实际经历。',
      explanation:
        '开放记录独立保存correct=null，不计客观正确率，不代替人工任务。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '杯子外形/颜色与原创独立属性图卡核验',
    notes: `依据ISBN ${source.isbn}已读印刷38页。原创杯身外形与颜色分类记录，额外把手标准独立，不复制原图或数量，不用把手代替杯身外形。复习改变外形、颜色、把手分布与并列最多。真实分卡/记录/口述独立确认，开放文字多解保留；示意不测容量，完整第三单元覆盖审核仍需完成，版次印次未知。`,
  },
};
