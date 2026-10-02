import type { Lesson, Question, SurveyTableVisual } from '../learning/types';

import { fold } from '../learning/fold';
import { required } from '../learning/required';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-surveys';
export function surveyExample(
  index: number,
  review: boolean,
): SurveyTableVisual {
  const values = review
    ? [
        [7, 5],
        [4, 8],
        [0, 6],
        [4, 4, 2],
      ]
    : [
        [5, 4],
        [7, 3],
        [6, 0],
        [4, 2, 3],
      ];
  const labels = required(
    [
      ['会打乒乓球', '不会打乒乓球'],
      ['喜欢踢足球', '本次未选踢足球'],
      ['有把手杯', '无把手杯'],
      ['最喜欢苹果', '最喜欢香蕉', '最喜欢梨'],
    ][index],
  );
  return {
    kind: 'survey-table',
    rows: labels.map((label, i) => ({
      label,
      marks: {
        symbol: review ? 'circle' : 'tick',
        count: required(required(values[index])[i]),
      },
      count: index === 0 ? null : required(required(values[index])[i]),
    })),
  };
}
export const blankSurveyTable = (): SurveyTableVisual => ({
  kind: 'survey-table',
  rows: [
    { label: '符合本次条件', marks: null, count: null },
    { label: '不符合本次条件', marks: null, count: null },
  ],
});
function tasks(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const result: Question[] = [];
  for (let index = 0; index < 4; index++) {
    const visual = surveyExample(index, review);
    for (const [rowIndex, row] of visual.rows.entries())
      result.push({
        id: `${prefix}-${index}-read-${rowIndex}`,
        knowledge: `${id}-${index}-read-${rowIndex}`,
        prompt: `示例中“${row.label}”这一类有多少项？表中1个符号表示1个对象，数量未填时按符号数。`,
        visual,
        rule: { kind: 'number', value: required(row.marks).count },
        hint: '先定位类别行，再点数这一行或读取对应数量；空白数量不能当0。',
        explanation: `本次示例这一类为${required(row.marks).count}项。示例不是真实班级调查结果，0只表示已核对该类没有。`,
      });
    const counts = visual.rows.map((r) => required(r.marks).count);
    const most = Math.max(...counts);
    result.push(
      {
        id: `${prefix}-${index}-most`,
        knowledge: `${id}-${index}-most`,
        prompt: '这一份示例中，哪类数量最多？所有并列最多的类别都选择。',
        visual,
        choices: visual.rows.map((r, i) => ({ id: String(i), label: r.label })),
        rule: {
          kind: 'set',
          values: counts.flatMap((count, i) =>
            count === most ? [String(i)] : [],
          ),
        },
        hint: '逐类比较数量，可能并列；不能只凭记录行占的空间。',
        explanation: '最多按实际数量比较，并列最多时都保留。',
      },
      {
        id: `${prefix}-${index}-total`,
        knowledge: `${id}-${index}-total`,
        prompt: '本次约定每个对象只归一类且已全部记录，共调查多少个对象？',
        visual,
        rule: { kind: 'number', value: fold(counts, 0, (a, b) => a + b) },
        hint: '先核对分类不重不漏，再合计每类实际数量。',
        explanation:
          '只有调查范围完整且每人只归一次，类别合计才对应本次对象总数。',
      },
    );
  }
  const scope = [
    {
      key: 'question',
      prompt: review
        ? '想了解多少人会打乒乓球，怎样确定分类？'
        : '想了解多少人喜欢踢足球，怎样确定分类？',
      good: review
        ? '先问会不会打乒乓球，再按答案分类'
        : '先问本次是否选择喜欢踢足球，再按答案分类',
      bad: '按衣服颜色猜测能力或喜好',
      hint: '要根据实际问题问本人，不凭外表猜。',
      explanation: '能力或喜好需要本人回答，不以外表判断；范围和条件先说清。',
    },
    {
      key: 'range',
      prompt: review
        ? '只调查小组，结果能直接当全班人数吗？'
        : '只问了家里几个人，可以把结果写成全班调查吗？',
      good: '不能，注明实际调查范围',
      bad: '可以，随便写全班',
      hint: '记录的对象必须与调查范围一致。',
      explanation: '示例、家庭/小组和全班范围不同，不能把小范围结果当全班。',
    },
    {
      key: 'zero',
      prompt: review
        ? '“不会”这一类没有填，能直接当成0吗？'
        : '还没询问某类对象，表格空白能当0吗？',
      good: '不能，先完成调查与核对',
      bad: '可以，空白一律等于0',
      hint: '区分没有对象与没有记录。',
      explanation: '只有完成调查并确认没有该类对象才记0。未调查/漏记先补记录。',
    },
    {
      key: 'one',
      prompt: review
        ? '按最喜欢一种水果调查，一人回答了两项就两边都算，会有什么问题？'
        : '约定每人只选一个最喜欢水果，同一人被记了两次，要怎样处理？',
      good: '按约定核实一次选择，避免重复记录',
      bad: '不用核对，两次都算更方便',
      hint: '先约定单选还是多选；本次是单选。',
      explanation:
        '单选分类每人只归一次；多选兴趣不能把类别合计直接说成独立人数。',
    },
    {
      key: 'marks',
      prompt: review
        ? '记录时怎样检查符号和人数对应？'
        : '“✓”逐项调查记录中，一人应记几项？',
      good: '一人对应一项，逐个核对',
      bad: '觉得多就画大勾，不用逐人记',
      hint: '符号大小不代表人数。',
      explanation: '逐项记录便于检查重复与遗漏，图形或勾都是一对象一符号。',
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
export const sujiaoSurveysDraft: Lesson = {
  id,
  title: '调查与表示结果：逐项记录和读表比较',
  textbookTitle: '数据分类（一）·调查与记录',
  page: 39,
  version: 1,
  status: 'preparing',
  goal: '确定调查问题、范围和单选约定，逐项记录并读分类表，实际调查与示例分开，核对空白、0和重复。',
  prerequisite:
    '会按明确标准分类，会逐项点数及20以内数量比较；真实调查较多人时由家长协助。',
  parentTip:
    '依据已读39～41页调查范围，本站小数量示例原创，不复制班级原数量，不要求姓名、生日等个人信息。不能凭外表推断能力/喜好；单选分类与多选兴趣分开。真实调查可使用家庭或小组对象，但必须注明实际范围，不标成全班。积木分类与图书室交流已在分类综合课独立提供，本课不自动确认那些实际任务。',
  steps: [
    {
      title: '先问问题、范围与条件',
      text: '先说想了解什么，例如会不会打乒乓球或本次最喜欢哪一种水果。再明确调查家庭、小组还是全班；不同范围不混用。本次水果调查约定每人只选一种，如果想做多选兴趣，要另外说明合计不一定等于人数。不要凭外表猜答案。',
      activity:
        '与家长讨论一个实际可完成的问题，明确对象范围和每人一次回答的约定。',
    },
    {
      title: '一人一项，再把结果填入数量表',
      text: '示例人数是本站原创，不代表你的班级。每人画一个勾或一个圆，先读类别标签再逐项点数。本图数量栏未填，需要按符号数；未填不等于没人。如果核对后确实没有某类对象，再记0。检查有没有一人被记录两次或完全没记。',
      visual: surveyExample(0, false),
      activity: '为实际回答逐个画符号，再填对应数量，不凭感觉写数。',
    },
    {
      title: '读表比较，保留并列与0',
      text: '每一行对应一个明确类别。可以比较哪类最多，同样多就如实说并列。类别合计只有在范围完整、不重复不遗漏时才表示本次总对象数，不能把多选兴趣各类直接相加当人数。大小或空白不是人数的可靠依据。',
      visual: surveyExample(3, false),
      activity:
        '用自己的完整记录比较各类数量，并核对总数是否与实际调查对象一致。',
    },
    {
      title: '记录自己的真实调查',
      text: '这张空表供实际调查时记录两类数量，先在自己的文字反思中说明问题和范围；不需要姓名。确实没有某类记0，还没记录保持空白。表中示例符号与这次真实数字分开，网页填表不自动确认调查做完。各步和各题独立保存、可以清空；实际数较大请家长协助。',
      visual: blankSurveyTable(),
      activity:
        '在纸上完成一个真实两类单选调查，填网页数量，再说明记录过程与发现。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      {
        prompt:
          '先确定一个真实问题、对象范围与每人一次回答的条件，询问实际对象，用符号逐项记录并填写这张两类表。只有真正调查完成才确认。',
        visual: blankSurveyTable(),
      },
      {
        prompt:
          '核对原始调查对象与每个符号一一对应，把类别数量填入纸面表；有遗漏/重复先改，未调查的空白不当0。',
      },
      {
        prompt:
          '向家长或同伴讲清调查标准、范围、各类数量与最多/并列；讨论换另一个问题后分类会怎样改变。',
      },
    ].map((item, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      ...item,
      rule: { kind: 'manual' },
      hint: '真实询问、画记录、核对和表达完成才确认；没有合适对象可以跳过。',
      explanation: '网页表和实际调查完成独立记录，不以示例答案代替真实数据。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '记录自己调查的问题和实际范围，再说怎样核对记录、发现了什么；不需要写姓名。',
      rule: { kind: 'reflection' },
      hint: '可以说明用了家庭/小组、两类各多少、有没有空白或并列。',
      explanation: '原话独立保存，无唯一结果，不计客观正确率。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读调查活动与原创记录表条件核验',
    notes: `依据ISBN ${source.isbn}印刷39～41页，确定问题、按条件调查、圈/勾逐项表示、数量表、实际会不会运动及水果单选范围。本课小数量例子原创；复习改变各类数量、最多与0所在类别。能力不由外表推定，示例不冒充真实班级，真实数据仅本地保存无姓名。积木分类与图书室交流另在分类综合课提供，不自动确认完成；版次印次仍未核验。`,
  },
};
