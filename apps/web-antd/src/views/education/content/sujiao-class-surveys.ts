import type { Lesson, Question, SurveyTableVisual } from '../learning/types';

import { fold } from '../learning/fold';
import { required } from '../learning/required';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
import { blankSurveyTable } from './sujiao-surveys';
const id = 'sj-lower-class-surveys';
export function classSurveyExample(
  index: number,
  review: boolean,
): SurveyTableVisual {
  const data = review
    ? [
        [6, 4],
        [7, 3],
        [0, 10],
        [5, 5],
      ]
    : [
        [4, 5],
        [3, 6],
        [2, 7],
        [0, 9],
      ];
  const labels = [
    ['男生', '女生'],
    ['与本次比较对象同龄', '与本次比较对象不同龄'],
    ['出生月份与本次比较对象相同', '出生月份与本次比较对象不同'],
    ['本次回答喜欢踢足球', '本次回答不喜欢踢足球'],
  ][index];
  const values = data[index];
  if (!labels || !values) throw new Error('unsupported class survey example');
  return {
    kind: 'survey-table',
    rows: labels.map((label, i) => ({
      label,
      marks: { symbol: review ? 'tick' : 'circle', count: required(values[i]) },
      count: index % 2 === 0 ? null : required(values[i]),
    })),
  };
}
function tasks(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const result: Question[] = [];
  for (let index = 0; index < 4; index++) {
    const visual = classSurveyExample(index, review);
    const counts = visual.rows.map((r) => required(r.marks).count);
    for (const [rowIndex, row] of visual.rows.entries())
      result.push({
        id: `${prefix}-${index}-read-${rowIndex}`,
        knowledge: `${id}-${index}-read-${rowIndex}`,
        prompt: `本次原创调查示例中，“${row.label}”有几人？未填数量时按一人一个符号点数。`,
        visual,
        rule: { kind: 'number', value: required(counts[rowIndex]) },
        hint: '先看问题和类别标签，再点数符号或读取对应数量；未填数量不直接当0。',
        explanation: `这一行已记录${counts[rowIndex]}人。示例不代表你的班级，每人只记一次，符号大小不代表人数。`,
      });
    const max = Math.max(...counts);
    result.push(
      {
        id: `${prefix}-${index}-most`,
        knowledge: `${id}-${index}-most`,
        prompt: '本次这一份记录中，哪类人数最多？选择所有并列最多的类别。',
        visual,
        choices: visual.rows.map((r, i) => ({ id: String(i), label: r.label })),
        rule: {
          kind: 'set',
          values: counts.flatMap((n, i) => (n === max ? [String(i)] : [])),
        },
        hint: '比较实际人数，可能并列，不只按记录占的空间判断。',
        explanation:
          '不同问题的分类标准不同，比较本次各类数量；数量相等时完整保留并列最多。',
      },
      {
        id: `${prefix}-${index}-total`,
        knowledge: `${id}-${index}-total`,
        prompt: '本次约定每人只归一类，已全部询问并记录，共有几人？',
        visual,
        rule: { kind: 'number', value: fold(counts, 0, (sum, n) => sum + n) },
        hint: '只有范围完整且不重不漏，类别合计才是本次人数。',
        explanation:
          '这里是本站原创已完成示例，类别合计是示例范围人数，不把家庭或小组结果当全班。',
      },
    );
  }
  const scope = [
    {
      key: 'age',
      prompt: review
        ? '想了解多少人与这次比较对象同龄，什么信息要先明确？'
        : '问“多少人与我同龄”，应该怎样确定条件？',
      good: '明确这次比较对象与年龄口径，再按同龄或不同龄记录',
      bad: '不用比较对象，按个子高矮猜年龄',
      explanation:
        '同龄是相对明确比较对象的条件，不用身高或衣服代替年龄；实际信息先由本人/家长或老师核对。',
    },
    {
      key: 'month',
      prompt: review
        ? '同出生月份调查时，出生年份或日期不同是否就一定属于不同月份？'
        : '问“多少人与我出生月份相同”，要比较什么？',
      good: review
        ? '不是，只比较已明确的出生月份'
        : '只比较已明确的出生月份，不要求完整生日',
      bad: review
        ? '是，必须同年同月同日才算同月份'
        : '必须同年同月同日才算同月份',
      explanation:
        '本题标准是月份，不是完整生日，也不把同月份与同龄当作同一个条件；网页只记录分类数量。',
    },
    {
      key: 'preference',
      prompt: review
        ? '有人不会踢足球，能直接把他算成“不喜欢踢足球”吗？'
        : '想了解谁喜欢踢足球，能按会不会踢或衣服样子猜吗？',
      good: '不能，按本次实际询问的喜好回答记录',
      bad: '可以，能力或外表直接等于喜好',
      explanation:
        '喜好与能力是不同条件，不能凭外表或能力猜本次回答；没有回答保留待问，不当作不喜欢。',
    },
    {
      key: 'range',
      prompt: review
        ? '一名还没询问的人，应直接加入不符合那类吗？'
        : '只问了家庭或小组，能写成全班调查完成吗？',
      good: review
        ? '不能，保留待询问，核实后再归类'
        : '不能，注明实际范围；全班任务保留待做',
      bad: review ? '可以，没问就默认不符合' : '可以，家里结果就当全班',
      explanation:
        '未回答不等于不符合，实际范围不能虚构。示例全部记录的合计与真实未完成记录分开。',
    },
    {
      key: 'marks',
      prompt: review
        ? '符号都画完了，怎样核对是否对应实际人数？'
        : '每人一圈或勾，哪种记录方式符合本次单选分类？',
      good: '逐人核对一次记录，检查遗漏和重复',
      bad: '只画一个大圈表示这一类很多人',
      explanation:
        '逐项符号一人一记，圈/勾大小不改变人数；分类标准一致且每人只归一类。',
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
      hint: '先明确问题、比较对象、范围和实际回答，再归类和核对。',
      explanation: item.explanation,
    });
  return result;
}
export const sujiaoClassSurveysDraft: Lesson = {
  id,
  title: '班级调查：人数、同龄、月份与喜好',
  textbookTitle: '数据分类（一）·调查同学',
  page: 39,
  version: 1,
  status: 'preparing',
  goal: '围绕班级人数、同龄、同出生月份和足球喜好提出调查问题，明确比较对象与实际范围，逐项记录并读表比较。',
  prerequisite: '会按一个标准分类，会逐项点数并区分空白与0。',
  parentTip:
    '依据已读印刷39页班级分类、圈/勾表示、数量表及年龄/出生月份/足球喜好问题。所有人数原创，不冒充真实班级。男女分类按老师已有明确统计口径，不凭穿着外表推断。年龄/月份只用于明确条件，不在网页记录姓名、完整生日或个人名单；真实条件可请家长/老师协助核对。没有全班调查条件可选家庭/小组并注明范围，全班任务保留待做；不编造回答。',
  steps: [
    {
      title: '班级人数：一人一项记录',
      text: '先明确调查对象范围，本图男女人数为本站原创示例，不能当成你的班级。实际分类依老师明确统计口径，不凭外表猜。每人画一个圈或勾，再填数量；换符号不改变人数。未填数量按已完整的逐项符号读，不自动当0。',
      visual: classSurveyExample(0, false),
      activity:
        '用老师明确的示例或实际统计，逐人对应一个符号，核对范围与数量。',
    },
    {
      title: '同龄：先明确比较对象',
      text: '问题是与谁同龄？先说清本次比较对象与年龄口径，再按同龄/不同龄两类记录。身高不代替年龄；同龄与出生月份相同也不是一个条件。示例结果只属于这次范围，不证明全班都如此。',
      visual: classSurveyExample(1, false),
      activity:
        '与家长确定一个比较对象，选择实际可核对的小组，按同龄条件询问与记录。',
    },
    {
      title: '同月份：只比较本题要求的月份',
      text: '出生月份相同只比较月份，不要求同年同月同日，也不从月份直接推同龄。这里是原创已完成记录的示例。真实调查可请老师/家长核对是否同月份，网页只保存两类数量，不需要姓名或完整生日；不知道的先保留待问。',
      visual: classSurveyExample(2, false),
      activity:
        '先说明比较对象和月份条件，再记录实际得到的两类数量，不保存个人生日名单。',
    },
    {
      title: '喜好：先问本人，再比较数量',
      text: '本次问喜欢不喜欢踢足球，不能用会不会踢、穿着或外表猜喜好。每人本次只归一类；没有回答不默认不喜欢。已确认没有某类才记0，数量相同如实保留并列。圈勾与数量表是一人一记录，不把一个大符号当很多人。',
      visual: classSurveyExample(3, false),
      activity:
        '询问一个实际可完成的小范围喜好问题，记录本人回答，并说明最多或并列。',
    },
    {
      title: '自己的调查与示例分开',
      text: '先提出问题，注明实际范围和比较对象，再询问、纸面逐项记录与核对后填这张两类空表。没有记录保留空白，确认没有某类才填0。家庭/小组不改称全班，数字只本地保存；网页填表与真实调查完成分别确认，发现与问题按自己的话记录。',
      visual: blankSurveyTable(),
      activity:
        '选择一次真实可完成的两类调查，说明范围，记录数量并口述过程；全班调查无条件就保留待做。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      {
        prompt:
          '选一个真实两类问题，明确比较对象与实际范围，询问后在纸上每人画一个符号，并把这两类数量填入空表。没有询问完不要确认完成。',
        visual: blankSurveyTable(),
      },
      {
        prompt:
          '把每个实际对象与记录逐项核对，补遗漏或修正重复，说明未知空白与已确认0的区别，不把家庭/小组冒充全班。',
      },
      {
        prompt:
          '向家长或老师口述自己的问题、条件、调查范围、各类数量与最多/并列；说明若全班未调查应保留待做。',
      },
    ].map((item, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      ...item,
      rule: { kind: 'manual' },
      hint: '真实询问、纸面记录、核对或表达后才确认；没有条件可以跳过。',
      explanation:
        '本地填表不自动证明调查做过，示例与真实范围分别记录，不要求个人名单。',
    })),
    ...[
      {
        key: 'question',
        prompt:
          '提出一个自己想了解的同学调查问题，说清比较对象、分类条件和准备调查的范围；不需要姓名或完整生日。',
      },
      {
        key: 'reflection',
        prompt:
          '这次实际调查有什么发现、遗漏或待询问？记自己的话，注明用了家庭、小组还是全班，或还没有实际调查。',
      },
    ].map((item): Question => ({
      id: `${id}-${item.key}`,
      knowledge: `${id}-${item.key}`,
      prompt: item.prompt,
      rule: { kind: 'reflection' },
      hint: '原话记录问题和发现，不编造全班调查或本人回复。',
      explanation: '开放文字保存correct=null，不计客观正确率或代替真实任务。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '班级人数与年龄/月分/喜好问题范围核验',
    notes: `依据ISBN ${source.isbn}已读印刷39页。原创小数量班级示例，逐项圈勾、数量表、同龄/同月份比较条件与实际喜好询问，复习改变人数、最多/0/并列。实际范围和比较对象明确，不凭外表猜、不保存个人名单/完整生日，真实调查独立人工确认。儿童多活动观察图另课已提供，完整第三单元覆盖审核仍待做，版次印次未知。`,
  },
};
