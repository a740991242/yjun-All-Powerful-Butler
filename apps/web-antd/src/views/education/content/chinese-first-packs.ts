import type { Lesson, Question } from '../learning/types';

function choose(
  lessonId: string,
  suffix: string,
  knowledge: string,
  prompt: string,
  labels: string[],
  value: string,
  hint: string,
  explanation: string,
  material?: string,
): Question {
  return {
    id: `${lessonId}-${suffix}`,
    knowledge,
    prompt,
    material,
    choices: labels.map((label) => ({ id: label, label })),
    rule: { kind: 'choice', value },
    hint,
    explanation,
  };
}

const phonicsId = 'cu-u2-1-shape-tone';
const phonicsKnowledge = 'cu-phonics-single-vowel-tone';
const phonicsChoice = (
  suffix: string,
  prompt: string,
  labels: string[],
  value: string,
  hint: string,
  explanation: string,
) =>
  choose(
    phonicsId,
    suffix,
    phonicsKnowledge,
    prompt,
    labels,
    value,
    hint,
    explanation,
  );

/** Original visual tasks linked to the verified a o e table-of-contents item.
 * Neither listening assessment nor a reproduction of the textbook lesson.
 */
export const firstPhonics: Lesson = {
  id: phonicsId,
  textbookTitle: 'a o e',
  title: 'a o e：辨形与四声标记（原创补充）',
  page: 20,
  goal: '辨认a、o、e及其带调写法，观察四声标记；本包评价视觉辨形，不评价发音。',
  prerequisite:
    '家长读题；这是教材课目对应的原创补充，不替代教材中的示范与书写指导。',
  parentTip:
    '声调走向图只作辅助说明。请用教师或正式教学资源的标准示范陪读；本站不播放普通TTS充当拼音示范。',
  version: 1,
  status: 'available',
  steps: [
    {
      title: '先看三个字母',
      text: '这里比较的是小写拼音字母a、o、e。o像一个闭合的圈；e中间有一横并有开口；a与o不同，右边还有一笔。字体外观可能略有差异，纸笔书写以教材和教师示范为准。',
      visual: {
        kind: 'characters',
        characters: ['a', 'o', 'e'],
        grid: 'pinyin',
      },
      activity:
        '请家长打乱顺序指字母，孩子指出a、o、e。方框展示用于辨认，不作为描红或精确占格范本。',
    },
    {
      title: '四声标记，逐个比较',
      text: '一声ā：标记是横线，示意平；二声á：标记向右上，示意升；三声ǎ：标记有折转，示意先降后升；四声à：标记向右下，示意降。图示不能代替实际读音，第三声在实际语流中的变化不在本包判断。',
      visual: {
        kind: 'characters',
        characters: ['ā', 'á', 'ǎ', 'à'],
        grid: 'pinyin',
      },
      activity: '用手指在空中比划四个标记的形状，再按顺序指出ā、á、ǎ、à。',
    },
    {
      title: '换一个字母，标记仍可比较',
      text: 'o的四声写作ō、ó、ǒ、ò；e的四声写作ē、é、ě、è。先找字母，再看它上方的声调标记。本包没有听音选字题；选择正确形状不代表已经发音正确。',
      visual: {
        kind: 'characters',
        characters: ['ō', 'ó', 'ǒ', 'ò', 'ē', 'é', 'ě', 'è'],
        grid: 'pinyin',
      },
    },
    {
      title: '看图辨形与亲子朗读分开',
      text: '接下来选择字母或带调写法；需要帮助时可以看提示。最后的亲子活动由孩子或家长确认完成，系统不自动给朗读打分。',
      activity:
        '家长参考可靠示范陪读；如果没有标准示范，可以先完成辨形，不必勉强做发音评价。',
    },
  ],
  questions: [
    phonicsChoice(
      'q1',
      '选出小写字母a。',
      ['o', 'e', 'a'],
      'a',
      '比较右边是否还有一笔。',
      'a、o、e是不同的字母，这里要选a。',
    ),
    phonicsChoice(
      'q2',
      '选出小写字母e。',
      ['a', 'e', 'o'],
      'e',
      '观察中间的一横和开口。',
      'e有中间的一横，与闭合的o不同。',
    ),
    phonicsChoice(
      'q3',
      'a上方是横线的一声写法是哪一个？',
      ['á', 'à', 'ā', 'ǎ'],
      'ā',
      '找上方平放的横线。',
      'ā的上方是横线，表示第一声。',
    ),
    phonicsChoice(
      'q4',
      'o的第三声写法是哪一个？',
      ['ò', 'ō', 'ǒ', 'ó'],
      'ǒ',
      '第三声的标记有先降后升的折转形状。',
      'ǒ是o的第三声写法；这里判断的是标记形状。',
    ),
    phonicsChoice(
      'q5',
      'e上方标记向右下的第四声写法是哪一个？',
      ['ě', 'è', 'é', 'ē'],
      'è',
      '从左向右观察标记的走向。',
      'è上方的标记向右下，表示第四声。',
    ),
    {
      id: `${phonicsId}-q6`,
      knowledge: phonicsKnowledge,
      prompt:
        '按ā、á、ǎ、à的顺序指出四声标记，再与家长参考标准示范尝试跟读。没有示范时可跳过；完成情况由家长确认，不进行自动发音评分。',
      material: 'ā　á　ǎ　à',
      rule: { kind: 'manual' },
      hint: '先看标记形状，再请家长帮助；不把图示当成声音。',
      explanation: '这项活动只记录人工确认完成；不纳入首次独立正确率。',
    },
  ],
  reviewQuestions: [
    phonicsChoice(
      'r1',
      '三个字母中，哪个是闭合的圈形o？',
      ['e', 'a', 'o'],
      'o',
      '观察是否闭合。',
      '这里选择o，不靠读音判定。',
    ),
    phonicsChoice(
      'r2',
      '选出a的第二声写法。',
      ['ǎ', 'ā', 'á', 'à'],
      'á',
      '第二声的标记向右上。',
      'á是a的第二声写法。',
    ),
    phonicsChoice(
      'r3',
      '选出o的第一声写法。',
      ['ó', 'ǒ', 'ò', 'ō'],
      'ō',
      '第一声上方是横线。',
      'ō是o的第一声写法。',
    ),
    phonicsChoice(
      'r4',
      '选出o的第四声写法。',
      ['ō', 'ó', 'ò', 'ǒ'],
      'ò',
      '寻找向右下的标记。',
      'ò是o的第四声写法。',
    ),
    phonicsChoice(
      'r5',
      '选出e的第二声写法。',
      ['ē', 'é', 'è', 'ě'],
      'é',
      '寻找向右上的标记。',
      'é是e的第二声写法。',
    ),
    phonicsChoice(
      'r6',
      '选出e的第三声写法。',
      ['è', 'ē', 'ě', 'é'],
      'ě',
      '寻找有折转的标记。',
      'ě是e的第三声写法。',
    ),
  ],
  review: {
    date: '2026-09-30',
    reviewer: '原创任务与拼音字符校验',
    notes:
      '对应官方目录第20页a o e；任务、说明与图示为原创补充，不宣称已逐页审校教材正文。标记保留Unicode声调；不提供听辨、发音评分或笔顺动画，尚待教师人工审校。',
  },
};

const readingId = 'cu-u5-1-original-reading';
const readingKnowledge = 'cu-reading-explicit-information';
const story =
  '放学后，小雨和爸爸来到公园。\n小雨先把水杯放在长椅上，再到树下看蚂蚁。\n天快黑了，爸爸说：“我们回家吧。”\n小雨拿起水杯，和爸爸一起回家。';
const readingChoice = (
  suffix: string,
  prompt: string,
  labels: string[],
  value: string,
  hint: string,
  explanation: string,
) =>
  choose(
    readingId,
    suffix,
    readingKnowledge,
    prompt,
    labels,
    value,
    hint,
    explanation,
    story,
  );

export const firstReading: Lesson = {
  id: readingId,
  textbookTitle: '秋天',
  title: '公园里的水杯：找信息与说一说（原创阅读）',
  page: 60,
  goal: '听家长陪读原创短文，找人物、地点与先后顺序；对应阅读板块能力，不复述或替代《秋天》。',
  prerequisite:
    '请家长陪读全文和题目；不要求孩子独立认读所有字，也不将材料用字列入教材新增识字范围。',
  parentTip:
    '短文是平台原创材料。孩子可以回看原文寻找答案；读题与朗读由家长协助，不评价发音或独立阅读水平。',
  version: 1,
  status: 'available',
  steps: [
    {
      title: '一起读原创短文',
      text: story,
      activity:
        '请家长逐句读，孩子可以跟读或倾听。读不出的字先由家长帮助，不要求抄写。',
    },
    {
      title: '人物与地点在句子里',
      text: '第一句告诉我们：小雨和爸爸来到公园。回答“谁”时找人物，回答“在哪里”时找地点。可以指着原文回答，不必凭记忆猜。',
    },
    {
      title: '先做什么，再做什么',
      text: '第二句中的“先”“再”说明顺序：先放水杯，再看蚂蚁。最后一句说明离开时拿起了水杯。',
      activity: '用手势演示放下、观察、拿起三个动作，并说说先后。',
    },
    {
      title: '自己的表达由自己和家长确认',
      text: '说说离开公园前你会检查什么。可以有不同的合理答案，系统不会因用词不同判错。',
      activity: '家长听孩子说完；朗读与表达完成情况单独记录。',
    },
  ],
  questions: [
    readingChoice(
      'q1',
      '谁和小雨一起来到公园？',
      ['爸爸', '老师', '妈妈'],
      '爸爸',
      '回看第一句。',
      '第一句写的是小雨和爸爸。',
    ),
    readingChoice(
      'q2',
      '小雨把水杯放在哪里？',
      ['树下', '书包里', '长椅上'],
      '长椅上',
      '找第二句中“把水杯放在”后面的词。',
      '小雨先把水杯放在长椅上。',
    ),
    readingChoice(
      'q3',
      '放好水杯后，小雨做了什么？',
      ['去买水', '到树下看蚂蚁', '马上回家'],
      '到树下看蚂蚁',
      '观察第二句中的“再”。',
      '放好水杯后，小雨到树下看蚂蚁。',
    ),
    readingChoice(
      'q4',
      '回家前，小雨拿起了什么？',
      ['水杯', '雨伞', '帽子'],
      '水杯',
      '回看最后一句。',
      '最后一句说小雨拿起水杯，和爸爸一起回家。',
    ),
    {
      id: `${readingId}-q5`,
      knowledge: readingKnowledge,
      prompt:
        '与家长一起朗读短文，可以跟读；由孩子或家长确认是否完成，不自动判断读音。',
      material: story,
      rule: { kind: 'manual' },
      hint: '一次读一句，不认识的字请家长帮助。',
      explanation: '朗读是人工确认活动，不纳入自动判分成绩。',
    },
    {
      id: `${readingId}-q6`,
      knowledge: readingKnowledge,
      prompt:
        '说一说：离开公园前，你会检查什么？请家长听完后确认完成；合理表达可以不同。',
      material: story,
      rule: { kind: 'manual' },
      hint: '想想随身带来的物品，也可以联系自己的经历。',
      explanation: '这是一项开放表达活动，系统不按固定句子打分。',
    },
  ],
  reviewQuestions: [
    readingChoice(
      'r1',
      '故事里的地点是哪里？',
      ['学校', '公园', '商店'],
      '公园',
      '找第一句的地点。',
      '第一句说来到公园。',
    ),
    readingChoice(
      'r2',
      '两人什么时候来到公园？',
      ['放学后', '上课时', '起床前'],
      '放学后',
      '回看第一句开头。',
      '故事开头写的是放学后。',
    ),
    readingChoice(
      'r3',
      '谁提出回家？',
      ['小雨', '老师', '爸爸'],
      '爸爸',
      '找第三句中“说”前的人物。',
      '爸爸说：“我们回家吧。”',
    ),
    readingChoice(
      'r4',
      '下面哪件事发生得更早？',
      ['拿起水杯回家', '把水杯放在长椅上'],
      '把水杯放在长椅上',
      '比较第二句和最后一句。',
      '先把水杯放在长椅上，离开前再拿起水杯。',
    ),
  ],
  review: {
    date: '2026-09-30',
    reviewer: '原创材料与题目一致性校验',
    notes:
      '对应上册第60页起阅读板块，非《秋天》正文改编。全文、任务和解释均为原创；人物、地点、时间、动作与顺序答案来自所示材料，不增补教材识字或书写要求，尚待教师人工审校。',
  },
};
