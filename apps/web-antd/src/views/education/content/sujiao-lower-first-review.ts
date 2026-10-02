import type { Lesson, Question } from '../learning/types';

import { sujiaoLowerSource as source } from './sujiao-lower-source';

const id = 'sj-lower-first-review';

function tasks(review: boolean): Question[] {
  const ducks = review ? 7 : 8;
  const geese = review ? 9 : 6;
  const male = review ? 6 : 4;
  const chickens = review ? 8 : 9;
  const books = review ? 18 : 16;
  const read = review ? 8 : 7;
  const base = (key: string, prompt: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
  });
  const information = `鸡${chickens}只、鸭${ducks}只、鹅${geese}只。其中公鹅${male}只，其他鹅都是母鹅。`;
  return [
    {
      ...base(
        'choose-parts',
        `${information}只求鸭和鹅共有多少只，要选哪两条数量？全部选出。`,
      ),
      choices: [
        { id: 'chickens', label: `鸡${chickens}只` },
        { id: 'ducks', label: `鸭${ducks}只` },
        { id: 'geese', label: `鹅${geese}只` },
        { id: 'male', label: `公鹅${male}只` },
      ],
      rule: { kind: 'set', values: ['ducks', 'geese'] },
      hint: '看问题指定哪两类，公鹅已经包含在全部鹅中。',
      explanation:
        '选鸭和全部鹅；鸡不是本问题所求，公鹅不能作为另一群再加一次。',
    },
    {
      ...base('selected-total', `${information}鸭和鹅共有多少只？`),
      rule: { kind: 'number', value: ducks + geese },
      hint: '只合并题目所求的两类，不把所有看见的数都相加。',
      explanation: `${ducks}＋${geese}＝${ducks + geese}（只），鸡与公鹅数量不另外加入。`,
    },
    {
      ...base('nested-part', `${information}母鹅有多少只？`),
      rule: { kind: 'number', value: geese - male },
      hint: '全部鹅分成公鹅和母鹅，知道总数与其中一部分，求另一部分。',
      explanation: `${geese}－${male}＝${geese - male}（只）。鸭和鸡不是鹅的组成部分。`,
    },
    {
      ...base(
        'no-double-count',
        `${information}有人把鹅${geese}只和公鹅${male}只相加，说得到全部鹅。这种做法对吗？`,
      ),
      choices: [
        { id: 'yes', label: '对，题目出现的数都应相加' },
        { id: 'no', label: '不对，公鹅已经在全部鹅里面，重复数了' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '用一圈纸框表示全部鹅，在圈内再标出公鹅。',
      explanation: `全部鹅已经是${geese}只，公鹅只是其中${male}只，不能在总数外再添一次。`,
    },
    {
      ...base(
        'missing-price',
        `${information}仅凭这些条件，能算出买全部鹅花了多少钱吗？`,
      ),
      choices: [
        { id: 'yes', label: '能，把数量当金额' },
        { id: 'no', label: '不能，还没有鹅的价格等费用条件' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '只数不能直接变成元，缺少条件先指出，不猜金额。',
      explanation: '数量条件可以求只数，不能凭空补成原题的购买费用。',
    },
    {
      ...base(
        'needed-condition',
        `一本书有${books}页，想求还有多少页没读。还需要哪条条件？`,
      ),
      choices: [
        { id: 'read', label: '已经读了多少页' },
        { id: 'color', label: '封面是什么颜色' },
        { id: 'tomorrow', label: '明天计划读几页' },
      ],
      rule: { kind: 'choice', value: 'read' },
      hint: '求现在没读的页数，需要现在已读的页数，未来计划不算已经读完。',
      explanation:
        '总页数减实际已读页数才是当前未读页数，计划和封面颜色不能替代。',
    },
    {
      ...base(
        'unread',
        `这本书有${books}页，实际已经读了${read}页，明天还想继续读。现在有多少页没读？`,
      ),
      rule: { kind: 'number', value: books - read },
      hint: '只减已经读过的页数，不减明天的计划。',
      explanation: `${books}－${read}＝${books - read}（页），未来是否完成要另记。`,
    },
    {
      ...base(
        'open-equations',
        review
          ? '依次补成正确算式：5＋□＝14；16－□＝7；6＋□＝10。三个空独立填写。'
          : '依次补成正确算式：5＋□＝13；15－□＝7；6＋□＝8。三个空独立填写。',
      ),
      rule: { kind: 'steps', values: review ? [9, 9, 4] : [8, 8, 2] },
      hint: '等号两边须相等；每一题重新看条件，不能把上一题结果当下一题起点。',
      explanation: review
        ? '依次填9、9、4，代回得到5＋9＝14、16－9＝7、6＋4＝10。'
        : '依次填8、8、2，代回得到5＋8＝13、15－8＝7、6＋2＝8。',
    },
    {
      ...base(
        'multiple-answers',
        review
          ? '□＋□＝14，两个空都允许填0～9的整数，只能写出一种正确答案吗？'
          : '□＋□＝13，两个空都允许填0～9的整数，只能写出一种正确答案吗？',
      ),
      choices: [
        { id: 'one', label: '只能有一种，两个空总要填相同的数' },
        { id: 'many', label: '有多种，每种都要检查两数范围与和' },
      ],
      rule: { kind: 'choice', value: 'many' },
      hint: '两个空未指定相同数，逐种代回检查，不要求固定的唯一写法。',
      explanation: review
        ? '例如5＋9与6＋8都得14，交换两部分也可以；不要求本题列全。'
        : '例如4＋9与5＋8都得13，交换两部分也可以；不要求本题列全。',
    },
  ];
}

export const sujiaoLowerFirstReviewDraft: Lesson = {
  id,
  title: '第一单元回顾：选条件、自己提问与三项自评',
  textbookTitle: '进位加法和退位减法·练习与回顾',
  page: 21,
  version: 1,
  status: 'preparing',
  goal: '选择所需条件，分清全部与其中一部分，实际自主提问、写多种算式、做数卡游戏，并分别回顾计算、应用与表达。',
  prerequisite:
    '会20以内进位加法与退位减法；准备纸笔、19件安全学具，可请家人参与。',
  parentTip: `对应ISBN ${source.isbn}印刷第9、12、20～21页的活动范围，用本站原创数量与情境。提问须由孩子先说，允许不同合理问题；鸡鸭鹅模型不代表真实调查。公鹅包含在全部鹅里，不能重复相加。实际活动人工确认，三项自评null、未做和未来计划如实分开，不自动评星。`,
  steps: [
    {
      title: '三个数量，先选问题要用的两个',
      text: '原创场景：鸡9只、鸭8只、鹅6只。问鸭和鹅共有多少，只合并8和6，不用鸡9只。面对多条信息，先说问题，再圈出实际需要的条件；不是把所有数都加起来。',
      activity:
        '画三群并逐一标数量，由孩子提出一个问题，自己圈条件、列式解答，再换问题重新选条件。',
    },
    {
      title: '其中一部分不能在总数外再加',
      text: '6只鹅中有4只公鹅，其余是母鹅。公鹅在全部6只里，母鹅有6减4等于2只；6加4会重复数公鹅。纸面画一个圈表示全部鹅，在圈里分成两个部分，再合回去检查。',
      activity:
        '实际摆6件表示全部，其中4件贴标记，其余2件不贴；分别指总量、标记部分、未标记部分。',
    },
    {
      title: '补条件与自主写多种算式',
      text: '16页书求未读页数，还需实际已读页数；明天计划不算读完。补充条件须明确标“我补的条件”。□＋□＝13可以有不同写法；15－□＝□、6＋□＝□也分别尝试多种合法写法，代回检查，不强求统一答案。',
      activity:
        '实际写至少两种不同写法，每个空限制0～9，算完检查两边相等，再用一句话讲一种写法的数量意思。',
    },
    {
      title: '实际数卡游戏，按范围轮换运算',
      text: '制作0～10数卡，抽一张与9相加；再用10～19卡练减9。练7或8加几时只选和不超过19的卡；练十几减7或8时使用11～18卡。每次抽卡、报完整算式、摆物核对后放回，再轮换，记录错误和改正，不用网页答对代替真实游戏。',
      activity:
        '与家人实际各玩一轮9加几、十几减9、7或8加几、十几减7或8，至少各三次；没人参与可如实记独自抽卡，不冒称两人游戏。',
    },
    {
      title: '三个方面分别说实际情况',
      text: '分别回顾：进位加法与退位减法是否更熟练；是否能解决简单实际问题；是否认真思考并说明自己的想法。每项可说一个已经做过的例子、仍需帮助或尚未做。一次答对不自动变成三项都掌握，未来想做的事单列为计划。',
      activity:
        '留下三条真实自评，可由家长按原话代写，不把家长期望当孩子已经会了。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际画三群鸡9只、鸭8只、鹅6只，先由自己提出至少两个不同可回答的问题；每次圈对应条件、写算式和单位，再向家人说明。若没有交流对象，交流部分如实记尚未做。',
      '实际摆6件表示全部鹅，其中4件贴标表示公鹅，其余表示母鹅；指清全部与两部分，写求母鹅的减法，再合回检查，不重复计数公鹅。',
      '实际为“全书16页，求未读页数”补充一条合理的已读条件，标“我补的条件”，解答并说明未读与已读合回16；未来阅读计划另写，不当实际已读。',
      '纸面为□＋□＝13、15－□＝□、6＋□＝□分别自主写至少两种不同正确写法，每个空填0～9整数；逐种代回检查并解释一种。允许不同合法答案，不要求列全。',
      '实际制作数卡，分别玩9加几、十几减9、7或8加几、十几减7或8四类游戏，每类至少三次，遵守本课范围，报完整算式、摆物核对，保留错误与改正；网页答对不能确认本次游戏。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '真正完成后再确认，部分未做如实记录或暂跳，计划不算完成。',
      explanation: '只人工记录该实际活动，不能由客观题成绩自动确认。',
    })),
    ...(
      [
        [
          'calculation',
          '进位加法和退位减法，你在哪些计算更熟练，哪些还需要帮助？记一个真实例子，没练过也可如实说。',
        ],
        [
          'application',
          '用加减解决简单实际问题，你怎样选条件、提出问题和检查？记已做例子或需要的帮助，不把计划当已做。',
        ],
        [
          'expression',
          '你是否认真思考并说出自己的想法？记一次实际说明、提问或仍不敢说的情况，允许请求帮助。',
        ],
      ] as const
    ).map(([key, prompt]): Question => ({
      id: `${id}-evaluation-${key}`,
      knowledge: `${id}-evaluation-${key}`,
      prompt,
      rule: { kind: 'reflection' },
      hint: '三个方面分别保留真实原话，没有固定答案或自动星级。',
      explanation: '开放自评的正确状态为null，不自动判断单元掌握。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-02',
    reviewer: '已读第一单元活动范围与原创数据核验',
    notes: `对应ISBN ${source.isbn}已读印刷第9、12、20～21页活动，原创例子；复习更换三类数量、子类数量、读书条件及填空，旧结果不能直接复用。版权版次印次未知，最终教师审校尚待完成，本课不等于第一单元全部活动。`,
  },
};
