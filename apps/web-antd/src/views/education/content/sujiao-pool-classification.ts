import type { Lesson, Question } from '../learning/types';

import { poolModel, poolPeople } from '../learning/pool-scene';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-pool-classification';
function tasks(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const people = poolPeople(review);
  const visual = poolModel(review);
  const result: Question[] = [];
  const criteria = [
    {
      key: 'role',
      title: '人物身份',
      groups: [
        { id: 'child', label: '孩子' },
        { id: 'adult', label: '成人' },
      ],
      matches: (person: (typeof people)[number], group: string) =>
        person.role === group,
    },
    {
      key: 'place',
      title: '所在位置',
      groups: [
        { id: 'pool', label: '泳池中' },
        { id: 'deck', label: '池边' },
      ],
      matches: (person: (typeof people)[number], group: string) =>
        person.place === group,
    },
    {
      key: 'ring',
      title: '有没有游泳圈',
      groups: [
        { id: 'with', label: '有游泳圈' },
        { id: 'without', label: '无游泳圈' },
      ],
      matches: (person: (typeof people)[number], group: string) =>
        (person.ring !== 'none') === (group === 'with'),
    },
  ];
  for (const criterion of criteria) {
    for (const group of criterion.groups) {
      const matching = people.filter((p) => criterion.matches(p, group.id));
      result.push(
        {
          id: `${prefix}-${criterion.key}-${group.id}-count`,
          knowledge: `${id}-${criterion.key}-${group.id}-count`,
          prompt: `按${criterion.title}分类，${group.label}的人有几名？每个字母只表示1人。`,
          visual,
          rule: { kind: 'number', value: matching.length },
          hint: '逐个人核对这次标准，不按另一个标准的结果作答。',
          explanation: `本图符合这次条件的有${matching.length}名，人物不同就分别计数，不能只数类别名称。`,
        },
        {
          id: `${prefix}-${criterion.key}-${group.id}-select`,
          knowledge: `${id}-${criterion.key}-${group.id}-select`,
          prompt: `按${criterion.title}分类，选择全部${group.label}人物的字母。`,
          visual,
          choices: people.map((p) => ({ id: p.id, label: p.id })),
          rule: { kind: 'set', values: matching.map((p) => p.id) },
          hint: '从题目读出要比较的特点，逐人选择，不漏选或多选。',
          explanation:
            '同一人物可以在不同次分类中有不同分组，但一次分类内只归一次。标注给出了本图特点，不凭外表推断年龄、性别或游泳能力。',
        },
      );
    }
    const max = Math.max(
      ...criterion.groups.map(
        (g) => people.filter((p) => criterion.matches(p, g.id)).length,
      ),
    );
    result.push({
      id: `${prefix}-${criterion.key}-most`,
      knowledge: `${id}-${criterion.key}-most`,
      prompt: `按${criterion.title}比较，哪组人物最多？选出全部并列最多。`,
      visual,
      choices: criterion.groups,
      rule: {
        kind: 'set',
        values: criterion.groups
          .filter(
            (g) =>
              people.filter((p) => criterion.matches(p, g.id)).length === max,
          )
          .map((g) => g.id),
      },
      hint: '先分别点数两组，再比较；相等时两组都选。',
      explanation:
        '所用标准不同，最多类别可能不同，不用一个标准的数量直接回答另一个问题。',
    });
  }
  const ringGroups = [
    { id: 'red', label: '红色游泳圈' },
    { id: 'blue', label: '蓝色游泳圈' },
  ];
  for (const group of ringGroups)
    result.push({
      id: `${prefix}-color-${group.id}`,
      knowledge: `${id}-color-${group.id}`,
      prompt: `只看有游泳圈的人，${group.label}有几个？每位有圈人物只画1个圈。`,
      visual,
      rule: {
        kind: 'number',
        value: people.filter((p) => p.ring === group.id).length,
      },
      hint: '先确定是统计圈的颜色，无圈的人不能归红或蓝。',
      explanation:
        '本题有圈人物每人一圈，圈颜色类合计等于有圈人数，不能把无圈算成一种圈颜色。',
    });
  const maxRings = Math.max(
    ...ringGroups.map((g) => people.filter((p) => p.ring === g.id).length),
  );
  result.push(
    {
      id: `${prefix}-color-most`,
      knowledge: `${id}-color-most`,
      prompt: '只比较红色与蓝色游泳圈，哪种颜色最多？保留全部并列最多。',
      visual,
      choices: ringGroups,
      rule: {
        kind: 'set',
        values: ringGroups
          .filter(
            (g) => people.filter((p) => p.ring === g.id).length === maxRings,
          )
          .map((g) => g.id),
      },
      hint: '按圈颜色点数，有圈与无圈是另一标准。',
      explanation:
        '圈颜色分类只针对有圈部分，范围与所有人物不同，最多可以并列。',
    },
    {
      id: `${prefix}-total`,
      knowledge: `${id}-total`,
      prompt: review
        ? '从按位置改为按有没有圈分，没有增减，全部仍有几人？'
        : '从按人物身份改为按位置分，没有增减，全部仍有几人？',
      visual,
      rule: { kind: 'number', value: people.length },
      hint: '每个字母算1人，两次分类不是两批人物。',
      explanation: '原始对象不变，只是重新归组，核对各组没有重复或遗漏。',
    },
  );
  const scopes = [
    {
      key: 'criterion',
      prompt: review
        ? '想知道池边有多少人，应按什么分？'
        : '想知道有圈与无圈哪组人更多，应按什么分？',
      good: review ? '所在位置' : '有没有游泳圈',
      bad: review ? '人物身份' : '红色与蓝色圈',
      explanation:
        '问题决定统计对象、标准和范围，不能把圈颜色分类当成有圈/无圈分类。',
    },
    {
      key: 'ability',
      prompt: review
        ? '人物没有游泳圈，能直接判断一定会游泳吗？'
        : '人物画了游泳圈，能直接判断一定不会游泳吗？',
      good: '不能，图中没有提供游泳能力信息',
      bad: '能，只凭有没有圈就确定',
      explanation:
        '图中只有标注的身份、位置与圈信息，真实能力需另行了解，圈也不自动证明安全。',
    },
    {
      key: 'scope',
      prompt: review
        ? '看到本图池边人物比以前多，能说明所有泳池都一样吗？'
        : '这幅原创泳池人物图的分类数量，能代表所有泳池的人数吗？',
      good: '不能，结果只属于这幅图的范围',
      bad: '能，所有泳池都按这个数量',
      explanation:
        '示例与真实全体范围不同；看图提出问题、分类与记录，不要求真实下水或编造观察经历。',
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
      hint: '只使用图中明确给出的特点和本题范围。',
      explanation: item.explanation,
    });
  return result;
}
export const sujiaoPoolClassificationDraft: Lesson = {
  id,
  title: '泳池图分类：先提问题，再分类记录',
  textbookTitle: '数据分类（一）·练习五',
  page: 41,
  version: 1,
  status: 'preparing',
  goal: '根据泳池人物示意提出分类问题，按身份、位置或圈信息分别分类记录，比较数量并说明统计范围。',
  prerequisite: '会逐项点数，知道一次分类标准一致、分组不重复不遗漏。',
  parentTip:
    '依据已读印刷41页泳池情境先提问题再分类表示的活动范围。本站人物、布局、字母和数值原创；身份由文字明确给出，不凭外貌猜性别或能力。圈信息不能判断会游泳与否或安全状况。所有实际任务是纸面图卡分类、画记录与口述，不安排真实泳池活动。自提问题有多种合理答案，保存孩子原话，不按唯一题目强判。',
  steps: [
    {
      title: '先观察，提出自己想了解的问题',
      text: '这幅原创示意有泳池中与池边两个分区，每个字母是一人，文字标出孩子/成人和圈信息。先说自己想知道什么，例如哪里的人更多，或者有圈与无圈各几人。问题要能从图中给出的特点回答；会不会游泳并没有提供，不能凭圈猜。',
      visual: poolModel(false),
      activity: '先观察并口述自己的分类问题，说清准备统计哪些人物。',
    },
    {
      title: '根据问题，选一个标准分类',
      text: '问孩子与成人数量，按人物身份；问哪里的人多，按所在位置；问有圈与无圈，按是否有圈。一次用一个标准，每人只归一次。按圈颜色分类时只看有圈人物，不把无圈当一种圈颜色。',
      visual: poolModel(false),
      activity: '选一个自己提出的问题，将字母图卡按对应标准实际分组。',
    },
    {
      title: '一人一记，比较包括并列',
      text: '各组每个人画一个圈或勾，再数有几人，比较哪组最多。相等时保留并列，不强选一组。换标准可以改变各类数量，但没有增减人物时总数不变；两次分类数量不能相加当成新增人物。',
      visual: poolModel(false),
      activity: '在纸上逐项表示分类结果，填写数量，核对各字母不漏不重。',
    },
    {
      title: '讲清过程与本图范围',
      text: '说明自己的问题、分类标准、各类数量与比较结果。如果问题需要图外信息，可以注明现在不知道并另行了解。反思记录自己的话，结果只属于这幅图；纸面分类与网页客观题分别完成，不需要去真实泳池。',
      activity: '口述这次纸面分类过程，说明图内已知与未知，以及自己的新问题。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '在纸上准备本图字母卡，按一个明确标准实际分组，逐人核对不遗漏或重复。',
      '针对同一个问题，在纸上各组一人一圈或勾表示，再填数量并核对合计；换另一标准后比较总数。',
      '口述自己的问题、分类标准、记录结果及本图范围；没有给出的能力信息明确说不知道。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '纸面分类、画记录或真实口述完成后才确认，不要求到泳池或下水。',
      explanation: '纸面/表达活动单独人工确认，网页答对不自动代替实际记录。',
    })),
    ...[
      {
        key: 'question',
        prompt:
          '针对这幅泳池人物图提出一个自己的分类问题，写清统计对象与准备采用的标准。若需要图外信息，请注明。',
      },
      {
        key: 'reflection',
        prompt:
          '这次分类和记录有什么发现？你还有什么问题？按自己的话记下，注明纸面活动是否实际做过。',
      },
    ].map((item): Question => ({
      id: `${id}-${item.key}`,
      knowledge: `${id}-${item.key}`,
      prompt: item.prompt,
      rule: { kind: 'reflection' },
      hint: '自提问题与发现可以不同，记录原话，不编造实际经历。',
      explanation:
        '开放问题与反思独立保存，correct=null，不计客观正确率或代替人工任务。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '泳池自主问题范围与原创多属性人物情境核验',
    notes: `依据ISBN ${source.isbn}已读印刷41页看图提问、分类与表示结果范围。人物、分布和字母原创，不复制教材原图或数量；复习改变身份/位置/圈分布和最多类别。自提问题多解保留，纸面记录与口述独立人工确认；不根据圈推断能力或安全、不安排实际泳池活动。完整第三单元逐项覆盖审核仍需完成，版次印次未知。`,
  },
};
