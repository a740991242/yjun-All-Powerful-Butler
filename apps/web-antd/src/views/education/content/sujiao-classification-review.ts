import type { Lesson, Question } from '../learning/types';

import { blockGroups } from '../learning/block-cards';
import {
  activityChildren,
  childActivitiesModel,
} from '../learning/child-activities';
import { cupCards, cupModel } from '../learning/cup-cards';
import { leafCards, natureModel } from '../learning/nature-cards';
import { poolModel, poolPeople } from '../learning/pool-scene';
import { required } from '../learning/required';
import { classSurveyExample } from './sujiao-class-surveys';
import { classificationModel } from './sujiao-classification';
import { blockModel } from './sujiao-classification-applications';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-classification-review';
function tasks(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const leaves = leafCards(review);
  const leafCounts = ['long', 'fan', 'lobed'].map(
    (shape) => leaves.filter((c) => c.shape === shape).length,
  );
  const cups = cupCards(review);
  const colorCounts = ['red', 'blue', 'yellow'].map(
    (color) => cups.filter((c) => c.color === color).length,
  );
  const blocks = blockModel(review);
  const blockColors = blockGroups(blocks, 'color');
  const most = Math.max(...blockColors.map((g) => g.letters.length));
  const activities = activityChildren(review);
  const running = activities.filter((c) => c.activity === 'run').length;
  const people = poolPeople(review);
  const rings = people.filter((p) => p.ring !== 'none').length;
  const month = classSurveyExample(2, review);
  const animals = classificationModel(review ? 'water' : 'fly', review, true);
  const q = (key: string): Pick<Question, 'id' | 'knowledge'> => ({
    id: `${prefix}-${key}`,
    knowledge: `${id}-${key}`,
  });
  const leafRecord = `长条${leafCounts[0]}片、扇形${leafCounts[1]}片、分裂叶形${leafCounts[2]}片`;
  const cupRecord = `红色${colorCounts[0]}只、蓝色${colorCounts[1]}只、黄色${colorCounts[2]}只`;
  const result: Question[] = [
    {
      ...q('leaf-record'),
      prompt: '按叶片外轮廓分类，哪份数量记录与这幅原图相符？',
      visual: natureModel('leaves', review),
      choices: [
        { id: 'good', label: leafRecord },
        {
          id: 'missing',
          label: `长条${required(leafCounts[0]) + 1}片、扇形${leafCounts[1]}片、分裂叶形${leafCounts[2]}片`,
        },
      ],
      rule: { kind: 'choice', value: 'good' },
      hint: '逐片按指定外轮廓核对，不把叶脉或叶柄另计片。',
      explanation:
        '记录需与原始对象一一对应；核对每类数量与合计，不因同色就按颜色回答。',
    },
    {
      ...q('cup-record'),
      prompt: '现在只按杯子颜色分，哪份记录与原图相符？',
      visual: cupModel(review),
      choices: [
        { id: 'good', label: cupRecord },
        {
          id: 'missing',
          label: `红色${colorCounts[0]}只、蓝色${colorCounts[1]}只、黄色${required(colorCounts[2]) - 1}只`,
        },
      ],
      rule: { kind: 'choice', value: 'good' },
      hint: '类别按颜色，杯身和把手不是这次标准，逐卡核对。',
      explanation: '一次分类标准一致，不多记或少记，同类不同字母各计一次。',
    },
    {
      ...q('block-most'),
      prompt: '按积木颜色整理，哪种颜色的数量最多？选择所有并列最多。',
      visual: blocks,
      choices: blockColors.map((g) => ({
        id: g.value,
        label: (() => {
          if (g.value === 'red') return '红色';
          return g.value === 'blue' ? '蓝色' : '黄色';
        })(),
      })),
      rule: {
        kind: 'set',
        values: blockColors
          .filter((g) => g.letters.length === most)
          .map((g) => g.value),
      },
      hint: '比较各颜色实际块数，不看立体的面数或形状类数量。',
      explanation: '问题按颜色比较，各块只记一次，不能把同一块几个面另计块。',
    },
    {
      ...q('activity-missing'),
      prompt: `有一份记录说本图跑步${running - 1}人，比正确人数少1人。应改为多少人？`,
      visual: childActivitiesModel(review),
      rule: { kind: 'number', value: running },
      hint: '按本次跑步活动逐个核对字母，不用上衣颜色或器材数代替。',
      explanation: '纠错要回到原图逐项核对，这里补少记的1人，不凭感觉写数。',
    },
    {
      ...q('pool-range'),
      prompt:
        '只按游泳圈颜色分类，红圈与蓝圈合起来涉及本图几人？每个有圈人物仅1圈。',
      visual: poolModel(review),
      rule: { kind: 'number', value: rings },
      hint: '先明确只看有圈部分，无圈不归红圈或蓝圈。',
      explanation:
        '部分范围与全部人物范围不同，圈信息也不能推断游泳能力或安全。',
    },
    {
      ...q('month-unknown'),
      prompt: '月份示例数量栏未填，但逐项符号已完整记录。第一行有几人？',
      visual: month,
      rule: {
        kind: 'number',
        value: required(required(month.rows[0]).marks).count,
      },
      hint: '先看类别标签与每项符号，不把空白数量直接当0。',
      explanation: '本例数量未填不代表没有对象；0只有已核对该类没有才成立。',
    },
    {
      ...q('same-symbol'),
      prompt: review
        ? '两类都用相同勾记录，第二类实际有几张动物卡？'
        : '两类都用相同圆记录，第二类实际有几张动物卡？',
      visual: animals,
      rule: { kind: 'number', value: required(animals.rows[1]).count },
      hint: '按类别行和逐项符号点数，同符号也能借标签分组。',
      explanation:
        '类别标签明确时，同样符号仍各表示一个对象，符号种数不是人数/卡数。',
    },
  ];
  const scopes = [
    {
      key: 'standard',
      prompt: review
        ? '把同一批杯子改按颜色分类，应怎样记录？'
        : '把同一批叶片改按形状分类，应怎样记录？',
      good: '重新按这次标准逐项分组，不增减原始对象',
      bad: '把两次分类合计相加当成新总数',
      explanation: '类别结果可能改变，总对象数没有增减就保持不变。',
    },
    {
      key: 'duplicate',
      prompt: review
        ? '同一个字母被分进两组，怎样核对？'
        : '同一对象画了两个符号，怎样修正？',
      good: '按本次标准核实一次归组和一次记录',
      bad: '都算进去，不用查原始对象',
      explanation:
        '从原对象到符号一一对应，重复或漏记先修正，不把错记录当真实数量。',
    },
    {
      key: 'actual',
      prompt: review
        ? '没有实际参观图书室或交流，能确认任务完成吗？'
        : '还没实际询问同学，填了示例人数，能确认调查完成吗？',
      good: '不能，注明尚未做过，真实任务保留待做',
      bad: '可以，网页示例正确就当实物活动做完',
      explanation:
        '网页示例、实际观察/询问/纸面记录分别完成，不编造管理员回复或调查范围。',
    },
    {
      key: 'expression',
      prompt: review
        ? '讲清一次分类过程，需要说哪些内容？'
        : '说明自己的调查结果，需要交代哪些内容？',
      good: '问题、对象范围、标准、记录和比较结果，以及未核对事项',
      bad: '只说人数多，不说明分类标准或范围',
      explanation:
        '过程与范围清楚才能理解结果，家庭/小组不冒充全班，未知如实保留。',
    },
    {
      key: 'reflection',
      prompt: review
        ? '记录分类发现与建议时，应怎样表达？'
        : '回答自提分类问题或评价自己学习时，应怎样记录？',
      good: '按自己的真实想法说，可以有不同合理问题或建议',
      bad: '必须照抄一个固定故事，才算唯一正确',
      explanation:
        '开放问题与反思没有唯一答案，保留原话，不按星数/故事给客观对错。',
    },
  ];
  for (const item of scopes)
    result.push({
      ...q(item.key),
      prompt: item.prompt,
      choices: [
        { id: 'good', label: item.good },
        { id: 'bad', label: item.bad },
      ],
      rule: { kind: 'choice', value: 'good' },
      hint: '从实际问题和过程核对，不把示例自动当成真实活动完成。',
      explanation: item.explanation,
    });
  return result;
}
export const sujiaoClassificationReviewDraft: Lesson = {
  id,
  title: '分类单元整理：选标准、核对与表达',
  textbookTitle: '数据分类（一）·评价与反思',
  page: 41,
  version: 1,
  status: 'preparing',
  goal: '综合选标准、逐项表示、核对漏记/重复、比较与范围，实际完成植物涂色等纸面活动并评价自己的分类与表达。',
  prerequisite:
    '已学习分类、记录表及植物/叶片/杯子/活动/调查/积木/泳池的相关课。',
  parentTip:
    '依据已读印刷37～41页活动与评价反思范围，图示和数量本站原创，复用各课只读模型但提问侧重跨情境核对与表达。纸面植物涂色明确只给树/花草涂色，猫/鸟不涂；颜色由孩子自主选择，不把作品强判唯一。各真实活动独立确认，不编造询问或管理员交流，开放评价按原话保存。不能因客观题正确或填写反思就自动确认实际任务已做。',
  steps: [
    {
      title: '先问问题，再明确对象与标准',
      text: '看图或调查前，先说明想知道什么、统计哪些对象，再选一个标准。叶片可按外轮廓或颜色，杯子按杯身、把手或颜色，活动按图中明确特点；条件不同要重新归组，总对象没有增减就不变。',
      visual: natureModel('leaves', false),
      activity: '从一个原创图选择问题，向家长说明对象与分类标准。',
    },
    {
      title: '原对象与逐项记录一一核对',
      text: '每人或每个对象只画一个圈/勾，再填数量。对照原始字母卡，检查重复或遗漏；同类不同字母各算一次。符号相同也能通过类别标签分组，符号大小不是数量。未填数字不自动当0；原始调查未完成如实待做。',
      visual: classificationModel('fly', false, true),
      activity: '用真实纸面分组和记录核对，每项对应一次，发现错误先修正。',
    },
    {
      title: '植物纸面涂色，分类与作品分开',
      text: '依据这份原创对象图，在纸上描画/由家长画简图，只给植物树和花草涂色，猫与鸟不涂。自己选择颜色，没有唯一配色；同类多张对象仍分别核对。完成涂色还要能说明为什么选择这些对象，不把颜色当植物辨类标准。',
      visual: natureModel('plants', false),
      activity:
        '实际完成原创植物辨类涂色，说明植物/动物标准并核对没有涂错或漏涂。',
    },
    {
      title: '讲清过程，评价自己的学习',
      text: '说明问题、对象范围、标准、怎样逐项记录和核对、各类数量与比较。真实调查、图书室交流与网页示例独立；无条件可以待做。想一想自己能否按标准分类并表示、能否讲清过程，分别记录已有进步与需要继续练习的地方，没有唯一反思答案。',
      activity: '向家长口述一次真实纸面分类过程，再记录自己的发现和下一步。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      {
        prompt:
          '实际在原创对象简图或纸卡上只给树和花草涂色，猫和鸟不涂；自选配色，说明植物/动物标准并核对漏涂或误涂。',
        visual: natureModel('plants', false),
      },
      {
        prompt:
          '用同一批原创叶片纸卡先按外轮廓再按颜色分，各次逐片画符号、填数量，核对不重不漏与总数不变。',
        visual: natureModel('leaves', false),
      },
      {
        prompt:
          '选杯子或积木原创图卡实际按问题归组，一对象一圈或勾表示结果，说明本次标准与最多/并列。',
        visual: cupModel(false),
      },
      {
        prompt:
          '有条件时完成一个真实两类调查，先定问题、比较对象和实际范围，再逐人询问、纸面表示与核对；无条件保留待做。',
      },
      {
        prompt:
          '有条件时实际观察图书室分类并向管理员了解标准，提出具体找书建议；没有真实观察/交流不要确认，不编造回复。',
      },
      {
        prompt:
          '口述一次自己实际完成的分类与记录，讲清问题、范围、标准、核对办法与结果；家长只确认真实表达过，不替写唯一答案。',
      },
    ].map((item, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      ...item,
      rule: { kind: 'manual' },
      hint: '真实涂色、分卡、记录、询问或口述完成后才确认，无条件可跳过。',
      explanation: '各实际任务独立确认，客观练习和填写反思不自动代替。',
    })),
    ...[
      {
        key: 'classification',
        prompt:
          '评价自己“按标准分类并表示结果”的学习：哪次实际做得好？哪里还要核对或继续练习？没有实际做过也请如实写。',
      },
      {
        key: 'expression',
        prompt:
          '评价自己“讲清分类过程”的学习：怎样说明问题、范围、标准和结果？写一个自己的发现、建议或下一步计划。',
      },
    ].map((item): Question => ({
      id: `${id}-${item.key}`,
      knowledge: `${id}-${item.key}`,
      prompt: item.prompt,
      rule: { kind: 'reflection' },
      hint: '按原话记录自己的评价，不照抄固定答案，不编造实际经历。',
      explanation: '开放评价保留多解，correct=null，不计客观正确率或评分星级。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '分类跨情境整理与纸面活动/评价范围核验',
    notes: `依据ISBN ${source.isbn}已读印刷37～41页。原创跨情境核对题，复习改变叶片/杯色/活动/圈/月份记录/动物记录的实际条件。植物实际涂色、逐项表示、询问和过程表达独立人工确认，颜色与开放评价不强判唯一；36～41页逐项覆盖记录见单元核对表，最终教师审校仍未完成，版次印次未知。`,
  },
};
