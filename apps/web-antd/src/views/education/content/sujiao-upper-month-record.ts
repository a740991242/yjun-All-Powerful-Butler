import type { MonthWeatherVisual } from '../learning/month-weather';
import type { Lesson, Question } from '../learning/types';

import { monthWeatherRecords } from '../learning/month-weather';
import { required } from '../learning/required';
import { sujiaoUpperSource as source } from './sujiao-upper-source';
const id = 'sj-upper-month-record';
const visual = (review = false): MonthWeatherVisual => ({
  kind: 'month-weather',
  variant: review ? 'review' : 'main',
});
function tasks(review: boolean): Question[] {
  const records = monthWeatherRecords(review ? 'review' : 'main');
  const counts = [1, 2, 3].map(
    (code) => records.filter((r) => r.code === code).length,
  );
  const q = (
    key: string,
    prompt: string,
    rule: Question['rule'],
    explanation: string,
  ): Question => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
    rule,
    hint: '一格一天、一次分类；每组左至右，先按1晴/2多云/3雨分类，再按所求合并。日期不当数量，模拟不当实际。',
    explanation,
  });
  const choice = (
    key: string,
    prompt: string,
    right: string,
    wrong: string,
  ): Question => ({
    ...q(key, prompt, { kind: 'choice', value: 'read-record' }, right),
    choices: [
      { id: 'read-record', label: right },
      { id: 'guess', label: wrong },
    ],
  });
  return [
    ...[0, 1, 2].map((group) => ({
      ...q(
        `group-${group}`,
        `按图第${group + 1}组十条从左到右逐格记录类别代号，依次填十空：1晴、2多云、3雨，不填日期或累计天数。`,
        {
          kind: 'steps',
          values: records
            .slice(group * 10, (group + 1) * 10)
            .map((r) => r.code),
        },
        '逐格与图上同一天对应，每条只属于一类；十个代号是分类结果，不是十个天数相加。',
      ),
      visual: visual(review),
    })),
    {
      ...q(
        'all-counts',
        '看完整三组记录，依次填晴、多云、雨各有几天。别只数屏幕首排，要把三组都数完。',
        { kind: 'steps', values: counts },
        `三类分别${required(counts[0])}、${required(counts[1])}、${required(counts[2])}天；用三组各十格逐条勾查完整，不要求先学三十加法。`,
      ),
      visual: visual(review),
    },
    {
      ...q(
        'combine',
        review
          ? '本图多云与雨合起来几天？只合并这两类，晴不加入。'
          : '本图晴与多云合起来几天？只合并这两类，雨不加入。',
        {
          kind: 'number',
          value: review
            ? required(counts[1]) + required(counts[2])
            : required(counts[0]) + required(counts[1]),
        },
        review ? '7+10=17，多云和雨合17天。' : '12+7=19，晴和多云合19天。',
      ),
      visual: visual(review),
    },
    {
      ...q(
        'compare',
        review ? '本图晴天与雨天，哪类较多？' : '本图雨天与多云，哪类较多？',
        { kind: 'choice', value: 'first' },
        review ? '晴13天、雨10天，晴较多。' : '雨11天、多云7天，雨较多。',
      ),
      visual: visual(review),
      choices: [
        { id: 'first', label: review ? '晴较多' : '雨较多' },
        { id: 'second', label: review ? '雨较多' : '多云较多' },
        { id: 'same', label: '一样多' },
      ],
    },
    choice(
      'every-day',
      review
        ? '一张卡只能分一类，雨的图标里面有云，就把同一天同时计入多云和雨吗？'
        : '每格一天，雨图标带云，能把同一天分别计多云一次、雨一次吗？',
      '不能，每条按本表约定类别一次',
      '能，同一天有两种图形就算两天',
    ),
    choice(
      'same-kind',
      review
        ? '两天都晴，是否因为类别相同只算一次晴？'
        : '三天都是晴，就把相同图标合并只算一个晴天吗？',
      '不能，不同日期各是一条记录',
      '能，相同天气只数一个图标类型',
    ),
    choice(
      'simulation',
      review
        ? '变式图改变了天气排列，能说这是昨天真实观察的新苏州天气吗？'
        : '本站原创模拟图能作为真实苏州天气观测发布吗？',
      '不能，模拟必须说明模拟；真实观察需真实日期和来源',
      '能，网页画了图就算真实观察',
    ),
    choice(
      'complete-month',
      review
        ? '手机里先看见第一组十条，还未读其余两组，可以声称已统计完整30天月份吗？'
        : '只抄18条记录，能声称这张30条模拟表的整月记录已全部统计吗？',
      '不能，要核对三组各十条，一条不少一条不重',
      '能，几条记录就代表整月',
    ),
  ];
}
const manual = (key: string, prompt: string): Question => ({
  id: `${id}-${key}`,
  knowledge: `${id}-${key}`,
  prompt,
  rule: { kind: 'manual' },
  hint: '保存真实纸面记录与核对痕迹，未做暂跳；真实观察与模拟以及未来计划分开。',
  explanation: '实际记录、分类、合并和说明各自人工，网页答题不代替。',
});
export const sujiaoUpperMonthRecordLesson: Lesson = {
  id,
  title: '三十条整月记录：逐日分类与合并',
  textbookTitle: '练习八·整月天气记录',
  page: 86,
  version: 1,
  status: 'available',
  goal: '完整三组各十条一日一类，分类计数、合并指定两类，核对遗漏重复并区分模拟和真实观察。',
  prerequisite:
    '会本范围加法与分类，备纸笔和三十张记录卡；家长辅助读20～30日期标签，不要求三十加减。',
  parentTip: `ISBN ${source.isbn}同版86页已实际查看，原生month-weather固定main/review两字段显示本站原创30天模拟三组记录，晴/多云/雨明确类别。主图12/7/11，变化13/7/10，指定两类主19新17均不超过19；30为整月记录数量和日期标签，不作先教三十位值或合计算式。每条一天一类，雨带云不双计，同类不同日不并成一条。四项真实纸面/分类/合并/解释独立人工，未来计划与真实观察分开，反思null，旧ID会话备份保持；最终教师审校未核验。`,
  steps: [
    {
      title: '完整月份，每格一天',
      text: '这份原创模拟表有30条，三组各十条，每格是不同一天，从第一组左边开始再第二组、第三组。手机换行不改变记录顺序或数量。日期20～30可由家长帮助读，它们是记录标签，今天不学30的加减；每个格都要看到，十八条不能冒整月。',
      visual: visual(),
      activity:
        '实际在纸上做三组各十个日期格，一天一格不重不漏，标明“原创30天模拟月份”；可按本站记录或把12晴/7多云/11雨自行另排，家长帮助核对日期。不得把它说成实际苏州天气。',
    },
    {
      title: '类别约定，逐日分类',
      text: '代号1是晴、2是多云、3是雨，不是该类天数。逐格看类别并记录，雨图虽带云也按雨类一次；不同日期同为晴，每天仍各数一条，不把同类图只算一种。逐条打勾，三组十条各有对应分类，遗漏或一日双计都会错。',
      visual: visual(),
      activity:
        '实际用纸表逐条写1/2/3代号或颜色标记，再把每条归一类，分别列晴/多云/雨日期。对照每个格已勾一次，图中类别代码不要当日期或数量。',
    },
    {
      title: '全表计数，不只数首排',
      text: '把三组全部读完，晴12天、多云7天、雨11天。每类逐条接数，最后对应一日一条；检查完整可用三组十格勾齐，不要求写12+7+11的三十算式。另一个模拟排列会改变计数，要重新读，不能抄旧数。',
      visual: visual(),
      activity:
        '实际把自己纸表按三类分别点数记录，和逐日勾查对照；若自行另排数量仍按自己的实际表核对，不凭示例当已做。',
    },
    {
      title: '合并所求两类，其它不加入',
      text: '本表晴12与多云7合起来19天，雨11不加入。新表晴13、多云7、雨10，若问多云与雨合起来，就是7+10=17，晴不加入。先读指定类别，不因为表上还有一个数就把三类都加上。',
      visual: visual(),
      activity:
        '实际对主表圈出晴和多云两类，写12+7=19天与答句；再在新表圈多云和雨，写7+10=17天并逐卡数被选日期，不选晴。两表恢复各自记录，不能沿上一题总数。',
    },
    {
      title: '模拟记录与真实观察分开',
      text: '本站示例和你自编的30天表都是模拟练习，不声称实际发生。若做真实观察，记录年月日、地点、实际天气与帮助，不知道的留待核对，不能填未来预报当已观测。30天月份与31天月份不能硬套；全年目标是学会记录方法，真实未来观察计划单列，今天未做如实写。',
      activity:
        '实际展示完整纸表、逐日勾记、三类计数和两类合并，说明模拟/实际的区别与一次改正。可另列未来观察计划，不把计划当完成记录。',
    },
  ],
  questions: [
    ...tasks(false),
    manual(
      'actual-full-record',
      '实际纸做30格模拟月份表（三组各十），完整日期不漏不重，填本站12晴/7多云/11雨的排列或同数量自己的新排列。标明模拟，20～30标签可请家长帮助核对；30条材料不要求先学30加减。保留完整表，不能18条冒整月。',
    ),
    manual(
      'actual-classify',
      '实际把完整纸表每条标1晴/2多云/3雨或同义标记，按三类分别列日期并计数。每格勾一次，同一天雨带云不双计，同类别不同日期不能合成一条；三组各十格全核对，保留自己的分类痕迹。',
    ),
    manual(
      'actual-combine',
      '实际在主30条表仅圈晴12和多云7，记录12+7=19天和答句并逐卡核对；在变化13晴/7多云/10雨表仅圈多云7和雨10，记7+10=17天。两表所求类别与模拟性质分清，不把第三类加进或套前题结果。',
    ),
    manual(
      'actual-explain',
      '实际展示自己的完整三组表、分类勾查、三类数和指定两类合并，说明每条一天、模拟不实际与一次遗漏/重复的检查方法。若尚未发生错误如实说检查未发现；未来实际观察另列计划，未做不确认。',
    ),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '写今天真实纸表分类或核对的一例，怎样避免漏天/双计或混入第三类，帮助/困难与改正；未做如实写，未来观察计划另列。',
      rule: { kind: 'reflection' },
      hint: '实际记录与模拟来源说明清楚，计划另写。',
      explanation: '反思correct null，不自动评星。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-02',
    reviewer: '同版整月条数与本站分类/合并逐条核对',
    notes:
      '2024年7月第1版、2025年7月第2次印刷86页已实际查看。完整30条模拟与每条分类/指定两类合并，不复制教材扫描；真实天气尚需实际观察，教师最终审校未核验。',
  },
};
