import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';

export const gardenSevenPageAudit = {
  itemId: 'u7-4',
  title: '语文园地七',
  pages: [90, 91, 92, 93, 94],
  recognize: '爷奶叔姐妹',
  write: '爸妈',
  sourceUrl: 'https://keben.app/book/0025',
  provider: '第三方原书公开预览',
  checkedAt: '2026-10-01',
  isbn: null,
  editionDate: null,
  printingDate: null,
  story: '猴子捞月亮',
  storySource: '陈鹤琴等编《儿童故事》',
  adapted: true,
  activities: [
    '亲属称呼与介绍',
    '五字认读两字书写',
    '四组字形比较与复写',
    '部件字义观察',
    '方位读背',
    '传统语句积累',
    '用多大的声音说话',
    '亲子共读',
  ],
};
const id = 'cu-u7-4';
const reading =
  '先与家长共读第93—94页《猴子捞月亮》，再按所问回看。原页脚注注明选自陈鹤琴等编《儿童故事》、有改动，不把编者来源当单一作者署名。本站不提供全文、原画或录音。井中看见月亮和后来发现天上月亮分开找证据，猴子的叫喊不确认月亮真的掉落；缺书可跳过，不要求接近水井、攀树或倒挂。';
export const gardenSevenProverbs = [
  '种瓜得瓜，种豆得豆。',
  '前人栽树，后人乘凉。',
  '千里之行，始于足下。',
  '百尺竿头，更进一步。',
] as const;
const proverbText = gardenSevenProverbs.join('\n');
const characters = [
  ['爷', '爷爷中的第一个字。', '爷爷中的第二个字。'],
  ['奶', '奶奶中的第一个字。', '奶奶中的第二个字。'],
  ['叔', '叔叔中的第一个字。', '叔叔中的第二个字。'],
  ['姐', '姐姐中的第一个字。', '姐姐中的第二个字。'],
  ['妹', '妹妹中的第一个字。', '妹妹中的第二个字。'],
];
export const gardenSevenFamilyWords = [
  '爷爷',
  '奶奶',
  '姥爷',
  '姥姥',
  '叔叔',
  '姑姑',
  '爸爸',
  '妈妈',
  '舅舅',
  '姨妈',
  '哥哥',
  '姐姐',
  '弟弟',
  '妹妹',
] as const;
type Pair = {
  key: string;
  prompts: [string, string];
  labels: string[];
  values: [string, string];
  explanation: string;
  material?: string;
};
const directionCard =
  '本站原创方向卡：孩子面向东，保持这一朝向，再判断自己的前、后、左、右。东是明确条件，不靠屏幕左右或凭太阳图猜精确方位。';
const voiceCard =
  '本站原创交流卡：情境A，在图书室近距离询问管理员，周围有人安静读书；情境B，在允许发言时向全班讲故事，听众需要听清。声音按距离、环境和对方反馈调整，不用吼叫，不设固定分贝答案。';
const pairs: Pair[] = [
  {
    key: 'family-word',
    prompts: ['按第90页，爷字在哪个称呼中？', '按第90页，妹字在哪个称呼中？'],
    labels: ['爷爷', '妹妹', '老师'],
    values: ['爷爷', '妹妹'],
    explanation:
      '按教材词语认字，不要求每个家庭都有所有成员，不录入真实姓名或家庭情况。',
  },
  {
    key: 'shape-one',
    prompts: [
      '第90页第一组，子旁边拿来比较的是哪个字？',
      '第90页第三组，儿旁边拿来比较的是哪个字？',
    ],
    labels: ['才', '四', '口'],
    values: ['才', '四'],
    explanation:
      '原页四组逐字观察，复习换一组；不要仅凭看起来相似认成同一个字。',
  },
  {
    key: 'shape-two',
    prompts: [
      '第90页第二组，云旁边拿来比较的是哪个字？',
      '第90页第四组，我旁边拿来比较的是哪个字？',
    ],
    labels: ['山', '心', '月'],
    values: ['山', '心'],
    explanation:
      '云山与我心分别比较，再按原书逐笔示范实际书写，选择题不能自动确认笔顺。',
  },
  {
    key: 'writing-scope',
    prompts: [
      '只比较爸与爷，哪个是本园地新增会写？',
      '只比较妈与奶，哪个是本园地新增会写？',
    ],
    labels: ['爸', '爷', '妈', '奶'],
    values: ['爸', '妈'],
    explanation:
      '新增会写爸妈；子才云山儿四我心为已有字复写，新增会认只有爷奶叔姐妹。',
  },
  {
    key: 'component',
    prompts: [
      '第91页明晚昨春这一组常见哪个部件？',
      '第91页妈奶姐妹这一组常见哪个部件？',
    ],
    labels: ['日', '女', '口'],
    values: ['日', '女'],
    explanation:
      '分别观察字形与意义联系，部件位置可不同，不能只凭部件推断所有字义或能力兴趣。',
  },
  {
    key: 'time',
    prompts: [
      '只比较昨与妈，哪项在第91页时间有关的一组？',
      '只比较春与姐，哪项在第91页时间有关的一组？',
    ],
    labels: ['昨', '妈', '春', '姐'],
    values: ['昨', '春'],
    explanation:
      '原页时间组是明晚昨春，春指季节，不能说这一组全部是昨天今天明天。',
  },
  {
    key: 'direction-front',
    prompts: [
      '按方向卡，孩子自己的前方是哪边？',
      '按方向卡，孩子自己的后方是哪边？',
    ],
    labels: ['东', '西', '北', '南'],
    values: ['东', '西'],
    explanation:
      '面向东是本题给定条件，前后对应东西；不以一张太阳画当全年精确指南针。',
    material: directionCard,
  },
  {
    key: 'direction-side',
    prompts: [
      '按方向卡，孩子自己的左方是哪边？',
      '按方向卡，孩子自己的右方是哪边？',
    ],
    labels: ['东', '西', '北', '南'],
    values: ['北', '南'],
    explanation:
      '保持孩子朝东，自己的左右分别为北南，不套用面对孩子的观察者左右。',
    material: directionCard,
  },
  {
    key: 'proverb-plant',
    prompts: [
      '按本页传统语句，种瓜后对应什么？',
      '按本页传统语句，种豆后对应什么？',
    ],
    labels: ['得瓜', '得豆', '任意不相关结果'],
    values: ['得瓜', '得豆'],
    explanation:
      '按传统语句成对积累，不把这一句话当完整农业操作或保证每次必定收成。',
    material: proverbText,
  },
  {
    key: 'proverb-first',
    prompts: [
      '按本页传统语句，千里之行从哪里开始？',
      '按本页传统语句，百尺竿头接下来怎样？',
    ],
    labels: ['始于足下', '更进一步', '无需任何尝试'],
    values: ['始于足下', '更进一步'],
    explanation: '联系从小步开始、继续努力的意思，不要求实际走千里或登高杆。',
    material: proverbText,
  },
  {
    key: 'voice',
    prompts: ['按交流卡情境A，怎样说更合适？', '按交流卡情境B，怎样说更合适？'],
    labels: ['轻声清楚地询问', '适当提高声音让全班听清', '尽力吼叫'],
    values: ['轻声清楚地询问', '适当提高声音让全班听清'],
    explanation:
      '按具体距离环境和允许发言条件选择，再实际听对方反馈；没有通用固定分贝，不自动评声音。',
    material: voiceCard,
  },
  {
    key: 'reading-caller',
    prompts: [
      '按原书，最先看井里并叫起来的是谁？',
      '按原书，最后抬头发现月亮还在天上的是谁？',
    ],
    labels: ['小猴子', '老猴子', '现实中的自己'],
    values: ['小猴子', '老猴子'],
    explanation: '分别按故事开头与结尾找人物，不能据叫喊断定月亮真的落井。',
    material: reading,
  },
  {
    key: 'reading-place',
    prompts: [
      '按故事开头，小猴子在哪里看见一个月亮？',
      '按故事结尾，老猴子抬头看见月亮在哪里？',
    ],
    labels: ['井里', '天上', '书包里'],
    values: ['井里', '天上'],
    explanation:
      '井中映像与天上月亮分开，月亮没有真的掉下；信息核对不要求到水井边。',
    material: reading,
  },
  {
    key: 'reading-position',
    prompts: [
      '按原书，挂在最下边的是谁？',
      '按原书，倒挂在树上并拉住大猴子脚的是谁？',
    ],
    labels: ['小猴子', '老猴子', '月亮'],
    values: ['小猴子', '老猴子'],
    explanation:
      '是故事动作，不照做攀树倒挂或伸手到井里，原书共读不算身体活动完成。',
    material: reading,
  },
  {
    key: 'reading-ending',
    prompts: [
      '按原书，小猴子碰到水时井中月亮怎样？',
      '按原书，后来看到天上月亮后，老猴子说怎样？',
    ],
    labels: ['不见了', '不用捞了', '真的捞到月球'],
    values: ['不见了', '不用捞了'],
    explanation:
      '水中映像变化与抬头发现分开，原文没有真的捞到月球；自己的续讲需另注明。',
    material: reading,
  },
];
function choice(
  key: string,
  prompt: string,
  labels: string[],
  value: string,
  explanation: string,
  review: boolean,
  material?: string,
): Question {
  return {
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
    material,
    choices: labels.map((label) => ({ id: label, label })),
    rule: { kind: 'choice', value },
    hint: '先看指定字词、原书信息或明确情境，再找依据。',
    explanation,
  };
}
function objective(review: boolean): Question[] {
  const i = review ? 1 : 0;
  return [
    ...characters.map((r, n) =>
      choice(
        `char-${n}`,
        required(r[i + 1]),
        characters.map((c) => required(c[0])),
        required(r[0]),
        '本园地新增认爷奶叔姐妹、写爸妈，其他称呼与活动字不自动扩大清单。',
        review,
      ),
    ),
    ...pairs.map((p) =>
      choice(
        p.key,
        p.prompts[i],
        p.labels,
        p.values[i],
        p.explanation,
        review,
        p.material,
      ),
    ),
  ];
}
function manual(key: string, prompt: string, material?: string): Question {
  return {
    id: `${id}-manual-${key}`,
    knowledge: `${id}-manual-${key}`,
    prompt,
    material,
    rule: { kind: 'manual' },
    hint: '实际尝试后家长确认，缺原书、示范或纸笔可跳过。',
    explanation: '不自动评声音笔顺表达，计划不当已完成。',
  };
}
export const gardenSevenLesson: Lesson = {
  id,
  title: '语文园地七',
  textbookTitle: '语文园地七',
  page: 90,
  version: 1,
  status: 'available',
  goal: '认五字写爸妈，读亲属称呼、比较字形与部件，辨方位，积累语句、调节说话声音并共读故事。',
  prerequisite: '准备90—94页原书和田字格纸，可请家长陪读。',
  parentTip:
    '五页分别核对；称呼介绍允许虚构或选择愿意说的内容，不要求家庭成员齐全或录入真实身份。面向东方位题与太阳实际位置分开，不直接用太阳图辨精确方位。声音按真实听众反馈调整，不录音或自动评音量。现代作品全文原画录音外部共读，未知ISBN版印次不补造；教师最终审校待完成。',
  steps: [
    {
      title: '认五字，读亲属称呼',
      text: '第90页新增会认爷、奶、叔、姐、妹五字。读爷爷奶奶、姥爷姥姥、叔叔姑姑、爸爸妈妈、舅舅姨妈、哥哥姐姐弟弟妹妹，称呼按原书学习，不要求所有家庭都有这些成员；第二个叠字常按原书语境读轻声，先听规范示范。',
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: [...'爷奶叔姐妹'],
      },
      activity: '实际打乱五字顺序指读，再尝试读原书称呼词。',
    },
    {
      title: '选择愿意说的介绍',
      text: '原页鼓励介绍家人，可以只口头说自己愿意分享的称呼，也可以用虚构人物练习。不要求真实姓名、住址、学校或家庭关系记录；家人称呼按实际习惯交流，有不同情况可向家长提问，不评价家庭结构。',
      activity: '实际向家长介绍一个愿意说的称呼或虚构人物，听对方回应。',
    },
    {
      title: '按示范写爸妈',
      text: '本园地新增会写爸、妈两个字，对照第90页逐笔和田字格示范实际写。普通网页字体只供认字，不替代规范笔顺或描红，不把所有亲属称呼加入新增会写。',
      visual: { kind: 'characters', grid: 'tian', characters: [...'爸妈'] },
      activity: '实际在田字格纸尝试两字，家长查看字形笔顺位置。',
    },
    {
      title: '比较四组并复写',
      text: '第90页比子与才、云与山、儿与四、我与心，观察原页标出的笔画和字形位置，再按逐笔示范写一写。这八个字是已有字复用，不新增会写数；相似笔画不表示字义或字形相同，不用选择题确认已经写过。',
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: [...'子才云山儿四我心'],
      },
      activity: '实际比较四组，在纸面各尝试，再向家长说一处区别。',
    },
    {
      title: '部件和字义一起看',
      text: '第91页明晚昨春含日部件，联系时间，春是季节；妈奶姐妹含女部件，联系本组亲属称呼。部件位置不同，字义不能全部只靠一个部件猜出，也不据女部件推定能力、兴趣或家庭职责。',
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: [...'明晚昨春妈奶姐妹'],
      },
      activity: '实际读两组字，与家长交流一处字形或意义发现。',
    },
    {
      title: '读背方位语句',
      text: '第91页读一读背一背，按原书先听示范再读。原书借早晨面向太阳说明方位，网站客观卡明确给定面向东，不把太阳图当全年精确指南针；保持自己的朝向，前东后西左北右南，面对面观察者左右不能直接替换。实际辨方向可用安全文字卡，不要求外出看太阳。',
      activity:
        '实际读原书方位语句，再另行尝试背诵；用方向卡向家长说明一个方向。',
    },
    {
      title: '积累四条传统语句',
      text: `第91页日积月累列四条传统语句：\n${proverbText}\n先听示范再读，交流前人劳动惠及后来人、从小步开始和继续努力的意思。传统语句无个人作者署名不补造，不当完整农业指南或登高要求。`,
      activity: '实际读四条，再用自己的合理例子交流一句意思。',
    },
    {
      title: '先想说话情境',
      text: '第92页讨论什么时候大声、什么时候小声：图书室近距离询问要顾及他人；向多人讲故事需要让听众听清。先看是否允许发言、距离与环境，不能机械说所有室内都小声或任何公共场合都大声，不设固定分贝。',
      activity: '实际向家长说一个轻声或需要让多人听清的情境及理由。',
    },
    {
      title: '试说并听反馈',
      text: '按第92页想一想试一试，用安全的家庭角色练习询问或讲故事。先说清楚，再听对方是否听清、是否影响别人，调整音量，不要求吼叫。网站不录音、不自动评音量或发音；计划练习不当实际说过。',
      activity: '实际试说两种情境，听家长回应后调整，不能以选择题替代。',
    },
    {
      title: '共读猴子捞月亮',
      text: `${reading}先听家长示范再共读，按开头、猴子行动和结尾顺序找人物与所见。童话说话与动作不当现实可照做的示范。`,
      activity: '实际共读第93—94两页，找一处所问信息的原书依据。',
    },
    {
      title: '分清所见与判断',
      text: '小猴子在井里看见月亮后叫喊，后来伸手碰水，井中月亮不见；老猴子抬头看到月亮仍在天上，说不用捞了。井中是水面映像，叫喊不是月亮真落井的证据；自己的疑问或续讲另作开放讨论，不冒充印刷结尾，不要求实际水井实验。',
      activity: '实际向家长讲开头到结尾的变化，说明一处所见和判断不同。',
    },
    {
      title: '交流发现和下一步',
      text: '记录一个称呼、字形、方位、音量或故事发现，自己的感受可不同。还想练的字或活动写成下一次计划，不当已经完成；家长可代写，不录入个人身份资料。',
      activity: '实际交流后记录原话，反思不判对错。',
    },
  ],
  questions: [
    ...objective(false),
    manual('recognize', '实际打乱顺序指读爷奶叔姐妹五字，不扩大新增认写。'),
    manual(
      'family-words',
      '实际读第90页十四个亲属称呼词，听规范示范后再尝试。',
    ),
    manual(
      'introduce',
      '实际介绍愿意说的一个称呼或虚构人物，不录入真实姓名家庭情况。',
    ),
    manual('write', '按第90页规范示范实际写爸妈两字，家长看字形笔顺位置。'),
    manual(
      'compare-write',
      '实际按原书比子才云山儿四我心四组，在纸面复写并说一处区别。',
    ),
    manual(
      'components',
      '实际读明晚昨春、妈奶姐妹，交流字形和字义联系，不推定能力职责。',
    ),
    manual(
      'direction-read',
      '实际朗读第91页方位语句，再按面向东的方向卡说明一个方向。',
    ),
    manual(
      'direction-recite',
      '另行实际尝试背诵第91页方位语句，不把朗读记录当背过。',
    ),
    manual(
      'proverbs',
      '实际读本页四条传统语句，交流一句意思，自己的合理例子开放。',
      proverbText,
    ),
    manual(
      'voice',
      '实际试说轻声询问及向多人讲故事两种情境，听回应后调整音量，不自动评分。',
    ),
    manual(
      'read',
      '实际与家长共读第93—94页猴子捞月亮，找一处原书依据。',
      reading,
    ),
    manual(
      'retell',
      '实际讲故事开头到结尾的变化，区分井中映像、叫喊判断与天上月亮，不照做危险动作。',
      reading,
    ),
    {
      id: `${id}-reflect-discovery`,
      knowledge: `${id}-reflect-discovery`,
      prompt: '记录一个称呼、字形、方位、音量或故事发现，也可写一个疑问。',
      rule: { kind: 'reflection' },
      hint: '用自己的话，家长可代写。',
      explanation: '原话保留，正确性null，不把猜想当原文。',
    },
    {
      id: `${id}-reflect-plan`,
      knowledge: `${id}-reflect-plan`,
      prompt: '明确记录下一次想练的字、方位表达、音量或阅读计划。',
      rule: { kind: 'reflection' },
      hint: '计划与实际完成分开。',
      explanation: '未来计划不当实际活动完成，正确性null。',
    },
  ],
  reviewQuestions: objective(true),
  review: {
    date: '2026-10-01',
    reviewer: '原书五页与原创教学范围校验',
    notes:
      '实读90—94五页，五认两写、十四称呼、四组复写、部件字义、方位读背、四传统语句、音量交际和亲子共读分别覆盖。陈鹤琴等编来源不当单一作者署名，现代全文原画声音外部共读；未知ISBN版印次不补造。朝东条件明确、不用太阳图辨精确方位，音量依情境反馈且不自动评声音，真实资料不录入，不要求攀树水井。实际活动人工确认、反思null、计划不当完成，教师最终审校和全年仍待逐项验收。',
  },
};
