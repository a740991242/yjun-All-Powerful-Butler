import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
import { upperCharacters } from './characters';

type Task = Omit<Question, 'id'>;
function choice(
  knowledge: string,
  prompt: string,
  labels: string[],
  value: string,
  explanation: string,
  material?: string,
): Task {
  return {
    knowledge,
    prompt,
    material,
    choices: labels.map((label) => ({ id: label, label })),
    rule: { kind: 'choice', value },
    hint: '重新看本题所示材料；需要读题帮助时请单独记录家长帮读。',
    explanation,
  };
}
function pack(
  id: string,
  title: string,
  page: number,
  goal: string,
  text: string,
  questions: Task[],
  review: Task[],
  manual: string,
  manualMaterial?: string,
): Lesson {
  return {
    id,
    title,
    page,
    textbookTitle: '上册基础 → 下册应用（平台原创衔接）',
    goal,
    prerequisite:
      '可以直接学习，也可以跳过；不要求完成上册，不作为进入下册的门槛。',
    parentTip:
      '平台原创衔接，不是教材新增单元或标准化测评。材料中的字不另增会认会写要求；家长可陪读。提示、帮读、重试与人工活动分别记录，不据选择题认定发音或书写掌握。',
    version: 1,
    status: 'available',
    steps: [
      { title: '从上册基础连接到下册', text },
      {
        title: '看清材料，再回答',
        text: '每道题都有自己的字词或材料。先找题目问什么，再回看材料；不记上一题的选项位置。阅读原文始终随题显示，可以反复回看。',
        activity: '家长可以读题；需要帮助时在练习里记录。',
      },
      {
        title: '说一说，单独记录',
        text: manual,
        activity:
          '实际认读与口头表达由家长确认；没有标准示范时可以跳过，不自动评价发音或表达质量。',
      },
    ],
    questions: [
      ...questions.map((q, index) => ({ ...q, id: `${id}-q${index + 1}` })),
      {
        id: `${id}-manual`,
        knowledge: `${id}-manual`,
        prompt: manual,
        material: manualMaterial,
        rule: { kind: 'manual' },
        hint: '可以回看材料，由家长陪同；不强制计时。',
        explanation: '只记录人工确认，不纳入客观首次正确率。',
      },
    ],
    reviewQuestions: review.map((q, index) => ({
      ...q,
      id: `${id}-r${index + 1}`,
    })),
    review: {
      date: '2026-09-30',
      reviewer: '原创衔接范围与题目校验',
      notes:
        '对应四册规划中的拼读、语境识字和阅读衔接能力；拼音规则复用已核验资料，识字目标限定上册已核验字表，短文与所有任务原创。不据此认定正式课文或两册全部教学内容已审校，仍待教师审阅。',
    },
  };
}
const phonics = pack(
  'ct-phonics',
  '语文衔接：辨形、标调与拼写',
  10,
  '回顾声母、韵母与带调写法，为下册词句认读准备；实际发音不自动评分。',
  '先看完整音节，再找声母、韵母和调号。b与d、p与q要看清方向；ai的声调在a上，ui的声调在i上。j、q、x后的ü会省去两点，实际韵母不因此变成u。in与ing比较末尾是否有g。这里练写法，实际读音参考教师标准示范。',
  [
    choice(
      'cu-initial-b-shape',
      '所示音节最前面的声母是哪一个？',
      ['b', 'd', 'p'],
      'b',
      'bāo最前面的声母是b。',
      'bāo',
    ),
    choice(
      'cu-initial-q-shape',
      '所示音节最前面的声母是哪一个？',
      ['p', 'q', 'g'],
      'q',
      'qí最前面的声母是q。',
      'qí',
    ),
    choice(
      'cu-vowel-ai-tone',
      '选择ai的第三声写法。',
      ['āi', 'ái', 'ǎi', 'ài'],
      'ǎi',
      'ai标调在a上，第三声写作ǎi。',
    ),
    choice(
      'cu-vowel-ui-tone',
      '选择ui的第四声写法。',
      ['uī', 'uí', 'uǐ', 'uì'],
      'uì',
      'ui标调在i上，第四声写作uì。',
    ),
    choice(
      'cu-u4-4-vowel-tone-mark-position',
      '所示音节中的韵母实际对应哪一个？',
      ['un', 'ün'],
      'ün',
      'qún省去ü的两点，仍对应ün。',
      'qún',
    ),
    choice(
      'cu-vowel-ing-shape',
      '所示音节对应哪个韵母？',
      ['in', 'ing', 'eng'],
      'ing',
      'tīng的韵母为ing，末尾ng不能漏写g。',
      'tīng',
    ),
  ],
  [
    choice(
      'cu-initial-b-shape',
      '从所示音节中找出开头的声母。',
      ['d', 'b', 'p'],
      'b',
      'bǐ的声母是b，不是方向相反的d。',
      'bǐ',
    ),
    choice(
      'cu-initial-q-shape',
      '从所示音节中找出开头的声母。',
      ['g', 'p', 'q'],
      'q',
      'qiū开头为q。',
      'qiū',
    ),
    choice(
      'cu-vowel-ai-tone',
      '选择ai的第四声写法。',
      ['āi', 'ái', 'ǎi', 'ài'],
      'ài',
      '第四声写作ài，调号仍标在a上。',
    ),
    choice(
      'cu-vowel-ui-tone',
      '选择ui的第二声写法。',
      ['uī', 'uí', 'uǐ', 'uì'],
      'uí',
      '第二声写作uí，调号在i上。',
    ),
    choice(
      'cu-u4-4-vowel-tone-mark-position',
      '新的所示音节仍对应哪个韵母？',
      ['ün', 'un'],
      'ün',
      'jūn中ü省去两点，仍对应ün。',
      'jūn',
    ),
    choice(
      'cu-vowel-ing-shape',
      '选择所示音节里的韵母。',
      ['eng', 'in', 'ing'],
      'ing',
      'míng的韵母是ing。',
      'míng',
    ),
  ],
  '参考教材或教师标准示范，尝试读一个所示音节，再指明声母、韵母和调号；由家长确认完成，没有示范可跳过。',
);

const wordRows = [
  [
    '天',
    '白云在天上。',
    '这里表示天空的是哪个字？',
    '今天不下雨。',
    '“今天”里表示一天的“天”是哪个字？',
    ['天', '人', '火'],
  ],
  [
    '日',
    '日出时，太阳慢慢升起来。',
    '“日出”的第一个字是哪一个？',
    '日落时，太阳慢慢落下。',
    '“日落”的第一个字是哪一个？',
    ['日', '月', '目'],
  ],
  [
    '月',
    '月亮挂在夜空中。',
    '“月亮”的第一个字是哪一个？',
    '一月是一年的第一个月。',
    '“一月”中第二个字是哪一个？',
    ['日', '月', '水'],
  ],
  [
    '水',
    '杯子里装着水。',
    '句中表示杯子里液体的字是哪一个？',
    '雨水落到地上。',
    '“雨水”的第二个字是哪一个？',
    ['火', '木', '水'],
  ],
  [
    '火',
    '火苗正在燃烧。',
    '“火苗”的第一个字是哪一个？',
    '消防员把火扑灭了。',
    '句中被扑灭的是哪个字表示的事物？',
    ['水', '火', '土'],
  ],
  [
    '人',
    '操场上有很多人。',
    '句中表示小朋友和老师的字是哪一个？',
    '工人正在做工。',
    '“工人”的第二个字是哪一个？',
    ['天', '人', '木'],
  ],
] as const;
const recognized = new Set(
  Object.values(upperCharacters).flatMap((scope) => [...scope.recognize]),
);
for (const [character] of wordRows)
  if (!recognized.has(character))
    throw new Error('educationLearning.invalidRecord');
const wordTasks = (review: boolean): Task[] =>
  wordRows.map(([character, material, prompt, other, otherPrompt, labels]) =>
    choice(
      `cu-recognize-u${required(character.codePointAt(0)).toString(16)}`,
      review ? otherPrompt : prompt,
      [...labels],
      character,
      `这里应选“${character}”。同一个字可以在不同词语里运用，回看题目给出的语境。`,
      review ? other : material,
    ),
  );
const words = pack(
  'ct-words',
  '语文衔接：把认识的字放进词句',
  2,
  '在短词句中辨认六个上册已学字，观察同字在不同词语中的运用。',
  '认字后还要联系词句理解。天可用在“天上”“今天”；日可用在“日出”“日落”；月可用在“月亮”“一月”。水、火、人也会出现在不同词句中。本组只回顾天、日、月、水、火、人六个上册已核验会认字，不新增会写要求。其余材料可由家长陪读。',
  wordTasks(false),
  wordTasks(true),
  '家长任选一个目标字，孩子尝试读出含这个字的两个短词，再用自己的话说一句；家长确认完成，不自动评判词句或发音。',
);

const mainStory =
  '早上，小禾把书放进书包。到了教室，她发现桌上有水。为了不让书沾湿，她先用布擦干桌子，再把书放到桌上。下课后，她把书放回书包。';
const reviewStory =
  '下午，小宁带着画纸来到活动室。她发现桌上有灰。为了不弄脏画纸，她先用布擦干净桌子，再把画纸铺在桌上。画完后，她把画纸收进文件袋。';
function readingTasks(review: boolean): Task[] {
  const story = review ? reviewStory : mainStory;
  const data: [string, string, string[], string, string][] = review
    ? [
        [
          'who',
          '材料主要写的是谁？',
          ['小禾', '小宁', '老师'],
          '小宁',
          '材料中的做事者是小宁。',
        ],
        [
          'where',
          '小宁带着画纸来到了哪里？',
          ['教室', '操场', '活动室'],
          '活动室',
          '材料写她来到活动室。',
        ],
        [
          'time',
          '材料写的是什么时候？',
          ['早上', '下午', '晚上'],
          '下午',
          '第一句写的是下午。',
        ],
        [
          'reason',
          '小宁为什么先擦桌子？',
          ['不弄脏画纸', '桌子太小', '要收文件袋'],
          '不弄脏画纸',
          '材料明确说明为了不弄脏画纸。',
        ],
        [
          'order',
          '哪一种顺序符合材料？',
          ['先铺画纸，再擦桌子', '先擦桌子，再铺画纸'],
          '先擦桌子，再铺画纸',
          '注意“先”和“再”连接的两个动作。',
        ],
        [
          'object',
          '画完后，小宁把画纸收进哪里？',
          ['书包', '文件袋', '水杯'],
          '文件袋',
          '材料最后一句写收进文件袋。',
        ],
      ]
    : [
        [
          'who',
          '材料主要写的是谁？',
          ['小禾', '小宁', '爸爸'],
          '小禾',
          '材料中的做事者是小禾。',
        ],
        [
          'where',
          '小禾到了哪里发现桌上有水？',
          ['教室', '操场', '活动室'],
          '教室',
          '材料写“到了教室”。',
        ],
        [
          'time',
          '材料开始写的是什么时候？',
          ['下午', '早上', '晚上'],
          '早上',
          '材料第一句写的是早上。',
        ],
        [
          'reason',
          '小禾为什么先擦干桌子？',
          ['书包太小', '不让书沾湿', '准备下课'],
          '不让书沾湿',
          '材料明确说明为了不让书沾湿。',
        ],
        [
          'order',
          '哪一种顺序符合材料？',
          ['先擦干桌子，再放书', '先放书，再擦干桌子'],
          '先擦干桌子，再放书',
          '注意“先”和“再”连接的动作。',
        ],
        [
          'object',
          '下课后，小禾把书放回哪里？',
          ['桌上', '水杯', '书包'],
          '书包',
          '材料最后一句说明放回书包。',
        ],
      ];
  return data.map(([skill, prompt, labels, answer, explanation]) =>
    choice(`ct-reading-${skill}`, prompt, labels, answer, explanation, story),
  );
}
const reading = pack(
  'ct-reading',
  '语文衔接：读短文、找信息与先后',
  26,
  '从找明显信息过渡到联系原因和事件先后，练习回看材料与口头复述。',
  `${
    mainStory
  }\n这是一篇平台原创短文，不是教材课文改写。先找人物、地点与时间，再看“为了”“先”“再”等词。答题时可以回看原文，不要求背住材料。`,
  readingTasks(false),
  readingTasks(true),
  '回看本组短文，用“先……再……最后……”说清人物做事的顺序；可以表达不同，但要联系材料，由家长确认，不自动评分复述。',
  mainStory,
);
export const chineseTransitions: Lesson[] = [phonics, words, reading];
