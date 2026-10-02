import type { Lesson, Question } from '../learning/types';

import {
  activityChildren,
  childActivitiesModel,
  childActivityKinds,
  shirtColors,
} from '../learning/child-activities';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-child-activities';
const names = {
  run: '跑步',
  football: '踢足球',
  rope: '跳绳',
  hoop: '拿圈',
  red: '红色上衣',
  blue: '蓝色上衣',
  green: '绿色上衣',
};
function tasks(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const children = activityChildren(review);
  const visual = childActivitiesModel(review);
  const result: Question[] = [];
  for (const criterion of ['activity', 'color'] as const) {
    const groups = criterion === 'activity' ? childActivityKinds : shirtColors;
    for (const group of groups) {
      const matches = children.filter((child) => child[criterion] === group);
      result.push(
        {
          id: `${prefix}-${criterion}-${group}-count`,
          knowledge: `${id}-${criterion}-${group}-count`,
          prompt: `按${criterion === 'activity' ? '本次活动' : '上衣颜色'}分类，${names[group]}的孩子有几名？每个字母只表示1人。`,
          visual,
          rule: { kind: 'number', value: matches.length },
          hint: '先读清本次标准，球/绳/圈/边框不计成人，同类不同字母仍各算1人。',
          explanation: `本图符合这一标准的有${matches.length}人，当前活动和颜色是不同特点，不能照抄另一分类数量。`,
        },
        {
          id: `${prefix}-${criterion}-${group}-select`,
          knowledge: `${id}-${criterion}-${group}-select`,
          prompt: `按${criterion === 'activity' ? '本次活动' : '上衣颜色'}分类，选择全部${names[group]}人物的字母。`,
          visual,
          choices: children.map((child) => ({ id: child.id, label: child.id })),
          rule: { kind: 'set', values: matches.map((child) => child.id) },
          hint: '图示与文字标注本次特点，按指定标准逐人核对，不漏选或多选。',
          explanation:
            '同一活动可以有不同颜色上衣，同色人物也可以做不同活动。拿圈只表示持圈，不凭图猜正在转圈或能力。',
        },
      );
    }
    const max = Math.max(
      ...groups.map(
        (group) =>
          children.filter((child) => child[criterion] === group).length,
      ),
    );
    result.push({
      id: `${prefix}-${criterion}-most`,
      knowledge: `${id}-${criterion}-most`,
      prompt: `按${criterion === 'activity' ? '本次活动' : '上衣颜色'}比较，哪类孩子最多？选择全部并列最多。`,
      visual,
      choices: groups.map((group) => ({ id: group, label: names[group] })),
      rule: {
        kind: 'set',
        values: groups.filter(
          (group) =>
            children.filter((child) => child[criterion] === group).length ===
            max,
        ),
      },
      hint: '比较各类人数，最多可能并列，不看人物大小、颜色深浅或器材数量。',
      explanation: '所比较的是这一标准下的人数，不是活动种数或球/绳/圈数量。',
    });
  }
  result.push({
    id: `${prefix}-total`,
    knowledge: `${id}-total`,
    prompt: review
      ? '从按上衣颜色改按活动分，没有增减人物，全部仍有几名孩子？'
      : '从按活动改按上衣颜色分，没有增减人物，全部仍有几名孩子？',
    visual,
    rule: { kind: 'number', value: children.length },
    hint: '同一批人物重新归组，不是增加一批；所有字母各计一次。',
    explanation: '类别数量可以改变，原始人物总数不变，不把两次分类数量相加。',
  });
  const scopes = [
    {
      key: 'criterion',
      prompt: review
        ? '想知道绿色上衣的孩子有几名，应按什么分？'
        : '想知道哪项活动的人最多，应按什么分？',
      good: review ? '本图上衣颜色' : '图示与文字标注的本次活动',
      bad: review ? '本次活动' : '只按上衣颜色',
      explanation: '根据问题选择一个标准，同一人物的不同特点不能混用。',
    },
    {
      key: 'preference',
      prompt: review
        ? '看到孩子本次拿圈，能直接判断拿圈是他最喜欢的活动吗？'
        : '看到孩子本次踢足球，能直接判断他最喜欢足球或一定擅长吗？',
      good: '不能，当前活动不直接说明喜好或能力',
      bad: '能，看见一次活动就能确定喜好和能力',
      explanation:
        '图中只明确当前活动，喜好与能力需另行了解，不凭外表推断，也不要求照图做运动。',
    },
    {
      key: 'record',
      prompt: review
        ? '同一张人物卡按活动归组两次，记录时怎样处理？'
        : '旁边画的球、绳和圈，统计人物时怎样处理？',
      good: review
        ? '核对每个人只归一次，不重复记'
        : '每字母1人，器材不另算成人',
      bad: review ? '两次都计，人数越多越好' : '把器材也计成新增孩子',
      explanation: '先明确所数对象是人物，逐人一圈/勾记录，检查不漏不重。',
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
      hint: '只用图中明确的信息，先确定对象和标准再统计。',
      explanation: item.explanation,
    });
  return result;
}
export const sujiaoChildActivitiesDraft: Lesson = {
  id,
  title: '儿童活动观察：按问题分类与记录',
  textbookTitle: '数据分类（一）·想想做做',
  page: 40,
  version: 1,
  status: 'preparing',
  goal: '观察儿童多种活动的原创示意，提出问题，按活动或上衣颜色分别分类、逐项记录并说明范围。',
  prerequisite: '会逐项点数，知道一次分类使用同一标准，符号一人一项。',
  parentTip:
    '依据已读印刷40页儿童活动观察、按问题分类并表示的范围。本站人物、数量、动作与布局原创；当前活动由文字和图示明确，不复制教材图文，不凭人物外貌猜性别/能力/喜好。拿圈只表示持圈，图示不证明正在转圈。实际任务是纸面分卡、画圈/勾、记录数量和口述，不要求体育模仿动作；真实运动另按学校/家长安排。',
  steps: [
    {
      title: '先观察，再说自己想知道什么',
      text: '每个字母代表一名孩子，图示与文字说明本次活动和上衣颜色。先看有哪些特点，再提出问题，例如哪项活动人数最多，或者哪种上衣颜色的人最多。器材和边框不是额外人物；当前活动不能直接说明最喜欢或擅长什么。',
      visual: childActivitiesModel(false),
      activity: '观察原图，口述自己想了解的一个分类问题及所数对象。',
    },
    {
      title: '按本次活动，逐人归组与记录',
      text: '问各项活动多少人，就按图示标注的跑步、踢足球、跳绳与拿圈归组，每人一次，画一圈或勾，再写人数。拿圈是本图明确状态，不猜正在转圈。检查原人物卡与记录对应，不漏记或重复，不把球/绳/圈另计成人。',
      visual: childActivitiesModel(false),
      activity: '把人物字母卡按活动实际分组，逐人记录并比较各类人数。',
    },
    {
      title: '同一批改按上衣颜色分',
      text: '保留原人物，改按红、蓝、绿文字上衣颜色归组。相同活动可以颜色不同，同色也可能活动不同。各类数量可以改变，总人数没有增减；两次分类不是两批孩子。比较最多时也可能并列，按实际记录回答。',
      visual: childActivitiesModel(false),
      activity: '同样卡片按上衣颜色重分，分别记录两次结果，核对总人数不变。',
    },
    {
      title: '自提问题，讲清分类过程与范围',
      text: '自己提出一个能用本图信息回答的问题，明确对象、标准，再分、记录、比较并口述。如果想知道喜好或能力，图中没有给出，可以注明需要另行询问。纸面记录完成才确认，反思原话保存；示例数量不推广为实际班级或所有孩子。',
      activity:
        '用纸面字母卡完成一次分类与逐项记录，说明问题、标准、结果及本图范围。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '准备本图人物字母纸卡，按一个明确活动标准实际分类，逐人核对不重复或遗漏，器材不另计成人。',
      '同一批纸卡先按活动再按上衣颜色分，各次一人一圈或勾记录并写人数，核对总数不变。',
      '口述自己的问题、所用标准、分类结果及示例范围；明确当前活动不能直接推出喜好或能力。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '实际纸面分类、画记录或口述完成后才确认，不要求照图运动，无条件可跳过。',
      explanation: '纸面/表达独立人工确认，网页答对不自动证明真实任务完成。',
    })),
    ...[
      {
        key: 'question',
        prompt:
          '针对这幅原创儿童活动图，提出一个自己的分类问题，说清对象与标准；需要图外信息时注明。',
      },
      {
        key: 'reflection',
        prompt:
          '同一批孩子换分类标准后有什么发现？你还有什么想了解的问题？记自己的话，注明纸面任务是否做过。',
      },
    ].map((item): Question => ({
      id: `${id}-${item.key}`,
      knowledge: `${id}-${item.key}`,
      prompt: item.prompt,
      rule: { kind: 'reflection' },
      hint: '自主问题和发现可不同，按原话保存，不编造实际活动。',
      explanation:
        '开放文字独立记录correct=null，不计客观正确率或代替人工确认。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '儿童多活动观察与原创条件分类范围核验',
    notes: `依据ISBN ${source.isbn}已读印刷40页儿童活动按问题分类表示范围，人物、动作、布局和数值原创。活动/上衣颜色独立，复习改变活动、颜色与最多；不凭图推断性别、喜好或能力。纸面分卡/逐项记录/表达与开放自提问题独立保存，不要求体育模仿。完整第三单元跨课覆盖验收仍待做，版次印次未知。`,
  },
};
