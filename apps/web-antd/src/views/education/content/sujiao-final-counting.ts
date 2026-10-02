import type { NumberLineGridVisual } from '../learning/final-counting';
import type { Lesson, Question } from '../learning/types';

import { sujiaoLowerSource as source } from './sujiao-lower-source';

const id = 'sj-lower-final-counting';
export function finalLineGrid(
  review = false,
  blank = false,
): NumberLineGridVisual {
  const points = review ? [57, 34, 66, 42, 60, 49] : [36, 62, 53, 47, 60, 41];
  return {
    kind: 'number-line-grid',
    minimum: review ? 20 : 30,
    maximum: review ? 80 : 70,
    points: blank ? [] : points,
  };
}
function tasks(review: boolean): Question[] {
  const total = review ? 30 : 40;
  const line = finalLineGrid(review);
  const common = (key: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
  });
  const questions: Question[] = [];
  for (const size of [5, 10] as const) {
    const visual = { kind: 'book-groups' as const, size, groups: total / size };
    questions.push(
      {
        ...common(`groups-${size}`),
        prompt: `原创书卡按每组${size}本放一框。共有几组完整的${size}本？问组数，不问总本数。`,
        visual,
        rule: { kind: 'number', value: total / size },
        hint: '每个边框是一组，再核对每组数量。',
        explanation: `共有${total / size}组，每组${size}本；组数和总本数单位不同。`,
      },
      {
        ...common(`books-${size}`),
        prompt: `这批书卡${size}本${size}本地数，一共有多少本？`,
        visual,
        rule: { kind: 'number', value: total },
        hint: '按每组的本数依次累加，不把每组数量当总量。',
        explanation: `${total / size}组的${size}本合起来是${total}本。`,
      },
    );
  }
  questions.push(
    {
      ...common('five-accumulation'),
      prompt: `每次再数5本，已经数到${total - 15}本。接下来三次累计各是多少？按先后填写，不写组编号。`,
      rule: { kind: 'steps', values: [total - 10, total - 5, total] },
      hint: '每次在上次累计本数上加5。',
      explanation: `依次${total - 10}、${total - 5}、${total}本；每次拿5本不代表总量一直是5。`,
    },
    {
      ...common('ten-accumulation'),
      prompt: `同一批${total}本书卡改成10本一组。按顺序写每组数完后的累计本数。`,
      rule: {
        kind: 'steps',
        values: Array.from({ length: total / 10 }, (_, i) => (i + 1) * 10),
      },
      hint: '第一次10，之后每次增加10，到本批总量为止。',
      explanation: `分组方法改变，每本书仍只数一次，总数${total}本不改变。`,
    },
    {
      ...common('six-points'),
      prompt:
        '读原创等距直线上A～F六点代表的数，按字母顺序填写。不是从左到右填写；每个小间隔为1。',
      visual: line,
      rule: { kind: 'steps', values: line.points },
      hint: '从最近的带数字长刻度起，数到对应字母位置；一个间隔代表1。',
      explanation: `按字母为${line.points.join('、')}。点位字母与数的大小先后不是同一种顺序。`,
    },
    {
      ...common('ordered-points'),
      prompt:
        '按点位从左到右，把A～F代表的六个数从小到大排序，六点都要包含且不重复。',
      visual: line,
      choices: line.points.map((_, i) => ({
        id: String.fromCodePoint(65 + i),
        label: String.fromCodePoint(65 + i),
      })),
      rule: {
        kind: 'sequence',
        values: line.points
          .map((value, index) => ({
            value,
            label: String.fromCodePoint(65 + index),
          }))
          .toSorted((a, b) => a.value - b.value)
          .map((item) => item.label),
      },
      hint: '点越靠左，代表的数越小；不要直接按字母排序。',
      explanation: `数从小到大为${[...line.points].toSorted((a, b) => a - b).join('、')}，对应点位顺序逐一核对。`,
    },
    {
      ...common('point-range'),
      prompt: review
        ? '选择全部代表不小于60的点，包括60。'
        : '选择全部代表小于50的点，不包括50。',
      visual: line,
      choices: line.points.map((_, i) => ({
        id: String.fromCodePoint(65 + i),
        label: String.fromCodePoint(65 + i),
      })),
      rule: {
        kind: 'set',
        values: line.points.flatMap((n, i) =>
          (review ? n >= 60 : n < 50) ? [String.fromCodePoint(65 + i)] : [],
        ),
      },
      hint: '当前条件和点位都要重看，边界是否包含要分清。',
      explanation: '逐点读数并核对当前范围；不能沿用上一题选择的字母。',
    },
    {
      ...common('interval-count'),
      prompt: `这条直线从${line.minimum}到${line.maximum}，每个小间隔为1，共有多少个小间隔？不要把两端刻度重复计作间隔。`,
      visual: finalLineGrid(review, true),
      rule: { kind: 'number', value: line.maximum - line.minimum },
      hint: '每两个相邻刻度间算一个间隔；用右端数减左端数核对。',
      explanation: `${line.maximum}减${line.minimum}是${line.maximum - line.minimum}，刻度端点数量比间隔数量多1。`,
    },
  );
  for (const item of [
    {
      key: 'regroup-total',
      prompt:
        '同一批书，先5本一组后10本一组，每本恰好数一次。总本数会因为组数变少而变少吗？',
      good: '不会，组变大且组数变少，但仍是同一批书',
      bad: '会，框数变少，总本数必定变少',
    },
    {
      key: 'unknown-not-zero',
      prompt: '没有实际数过书，能把空白的总本数字段填写0并说已经数完吗？',
      good: '不能，没数过是待做；实际没有书才有依据记0',
      bad: '能，空白和0完全一样',
    },
  ])
    questions.push({
      ...common(item.key),
      prompt: item.prompt,
      choices: [
        { id: 'good', label: item.good },
        { id: 'bad', label: item.bad },
      ],
      rule: { kind: 'choice', value: 'good' },
      hint: '依据实际数量与当前条件，不把组数、总量和缺少记录混为一谈。',
      explanation: '分组不能改变物品数量，未观察不产生0；实际记录与计划分开。',
    });
  return questions;
}
export const sujiaoFinalCountingDraft: Lesson = {
  id,
  title: '期末数书与数轴：先标点再排序',
  textbookTitle: '期末复习：分组计数与直线上表示各数',
  page: 90,
  version: 1,
  status: 'preparing',
  goal: '用五本和十本两种方式数同一批书，区分组数和本数；实际把六个数分别标在等距直线上，再按位置排序并核对。',
  prerequisite: '认识100以内数，能以5和10递增计数，准备纸笔和书或纸书卡。',
  parentTip:
    '依据已读ISBN来源印刷90页练习第1和第3项。书卡和轴值原创，不复制书架或教材六数。给定例子完整分组；实际书量若不能整分，末组余数另记并合计，不硬填完整组，也不要求购买或搬重书。可用真实纸卡替代并如实记材料。网页读点和排序不自动确认实际画线标点。纸面先画等距小刻度、标六数并核对，再排序；未知不当0、反思null、未来计划不当完成，旧课记录不变。',
  steps: [
    {
      title: '五本一组，数的是同一批',
      text: '原创40本书卡分成8组，每组5本。依次累计5、10、15、20、25、30、35、40；8是组数，40是总本数。每本只能数一次，不漏数，也不把框数写作本数。',
      visual: { kind: 'book-groups', size: 5, groups: 8 },
      activity:
        '实际用同一批书或纸书卡，五本五本地分组，记录完整组数、末组余数和总本数。',
    },
    {
      title: '改成十本一组，总量不变',
      text: '还是这批40本卡，合并成4组，每组10本。累计10、20、30、40；组数从8变4，总本数仍40。真实数量不一定40或整分，剩几本要另数，不根据示例替自己记录。',
      visual: { kind: 'book-groups', size: 10, groups: 4 },
      activity:
        '实际重新分同一批材料，十本十本地数，记组数和余数，再核对两次总本数是否相同。',
    },
    {
      title: '先画等距直线，再逐个标数',
      text: '准备原创六数36、62、53、47、60、41，不先按大小重排。纸上画30至70等距直线，每小间隔代表1，长刻度标30、40、50、60、70。先从30往右数6小格找到36，逐一标其余五数并写数字，每数只标一次。端点刻度不是多一个间隔。',
      visual: finalLineGrid(false, true),
      activity:
        '实际画直线并标出六个给定数，逐点写数字；家长检查间隔是否等距、六个数是否都标对。',
    },
    {
      title: '读六点，不把字母当大小',
      text: '这是原创标点核对图，A表示36、B表示62、C表示53、D表示47、E表示60、F表示41。字母用于点位身份，点的大小顺序由位置决定，不能直接写A到F。实际图可以写数字，不要求使用字母。',
      visual: finalLineGrid(),
      activity: '把自己纸面六点逐个与原数核对，错误点修正并保留真实过程。',
    },
    {
      title: '标点完成后，再写大小关系',
      text: '六点从左到右为36、41、47、53、60、62，写36＜41＜47＜53＜60＜62。一定先标点再排序，单独排对数字不代表做过标点。换数字与端点后重新读刻度。两次数书、实际标点和纸面排序分别确认，尚未做的如实待做。',
      activity:
        '实际在已标六点的纸下面写完整大小关系，再检查六数无遗漏无重复，说出排序依据。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际用同一批书或纸书卡五本五本地数，记录完整组数、余数与总本数；如实注明材料，不把网页卡数量当自己实际书量。',
      '实际把刚才同一批材料改按十本分组，记录完整组和余数，合计后核对两次总数；不改变材料数量，不漏不重。',
      '实际在纸上画30到70的等距直线，每个小间隔为1，先逐一标出36、62、53、47、60、41并写数，再核对全部六点位置；没有纸面操作则待做。',
      '在实际完成的六点直线下方从小到大写完整六数大小关系，与各点位置逐一对应，不以网页排序正确替代真实标点与纸面排序。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '真实分组、画线与排序完成后分别确认，没有条件可暂时跳过。',
      explanation: '独立实际任务不由网页成绩或未来计划自动确认。',
    })),
    ...[
      '五本与十本分组时，哪些数量变了，哪些没变？写真实材料和记录，未做如实说明。',
      '你怎样找到直线上一个数的位置，怎样避免多算端点？记录实际核对办法或困难。',
      '先标点再排序时你改过什么？下一次计划单列，不冒称已经画过。',
    ].map((prompt, index): Question => ({
      id: `${id}-reflection-${index}`,
      knowledge: `${id}-reflection-${index}`,
      prompt,
      rule: { kind: 'reflection' },
      hint: '原话记录，不要求固定答案。',
      explanation: 'correct=null，不自动产生能力分数或确认实际操作。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '期末90页分组数书与六数标点核对',
    notes: `依据ISBN ${source.isbn}印刷90页第1/3项，书卡、数轴和六数原创；复习改变总本数、分组数、端点、点位和范围条件。五本十本实际数同一批、实际标六数再排序独立人工，旧课ID版本快照保持；其它期末缺口与最终教师审校保留，版次与印次仍未核验。`,
  },
};
