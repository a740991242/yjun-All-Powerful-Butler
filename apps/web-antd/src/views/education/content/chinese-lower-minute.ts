import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';

type Pair = {
  key: string;
  prompts: [string, string];
  values: [string, string];
  labels: string[];
  explanation: string;
  material: string;
};
type Entry = {
  itemId: string;
  goal: string;
  title: string;
  pages: number[];
  recognize: string;
  write: string;
  author: null | string;
  sourceCredit: string;
  newRadicals: string[];
  additionalReadings: string;
  pairs: Pair[];
  reciteRequired: boolean;
  steps: Lesson['steps'];
  actual: [string, string][];
  reflections: string[];
};
const recognitionRows: Record<string, [string, string, string][]> = {
  'u7-2': [
    ['钟', '闹钟中的第2个字是哪项？', '换词语：时钟中的第2个字是哪项？'],
    ['迟', '迟到中的第1个字是哪项？', '换词语：迟来中的第1个字是哪项？'],
    ['灯', '绿灯中的第2个字是哪项？', '换词语：灯光中的第1个字是哪项？'],
    ['等', '等候中的第1个字是哪项？', '换词语：等待中的第1个字是哪项？'],
    ['啊', '啊呀中的第1个字是哪项？', '换词语：好啊中的第2个字是哪项？'],
    ['决', '决定中的第1个字是哪项？', '换词语：决心中的第1个字是哪项？'],
    ['定', '决定中的第2个字是哪项？', '换词语：一定中的第2个字是哪项？'],
    ['已', '已经中的第1个字是哪项？', '换词语：早已中的第2个字是哪项？'],
    ['经', '已经中的第2个字是哪项？', '换词语：经过中的第1个字是哪项？'],
    ['位', '座位中的第2个字是哪项？', '换词语：一位中的第2个字是哪项？'],
    ['表', '手表中的第2个字是哪项？', '换词语：表面中的第1个字是哪项？'],
  ],
};
const entries: Entry[] = [
  {
    itemId: 'u7-2',
    title: '一分钟',
    pages: [81, 82, 83],
    recognize: '钟迟灯等啊决定已经位表',
    write: '灯站坐师车课老',
    author: '鲁兵',
    sourceCredit: '鲁兵，选作课文时有改动',
    newRadicals: [],
    additionalReadings: '背bēi',
    reciteRequired: false,
    goal: '认识十一字和熟字背bēi、写七字，朗读故事，按条件句说经过，实际试做并记录一分钟活动。',
    pairs: [
      {
        key: 'story-delay',
        prompts: [
          '本故事元元起床前想再睡多久？',
          '换到结尾：老师说元元迟到多久？',
        ],
        values: ['一分钟', '二十分钟'],
        labels: ['一分钟', '二十分钟', '没有给出时间'],
        explanation:
          '一分钟是多睡的时间，二十分钟是故事结尾迟到的时间；不是普遍换算公式。',
        material:
          '先共读原书81—83页，再看本站原创信息卡；全文在原书或合法资源阅读。',
      },
      {
        key: 'story-light',
        prompts: [
          '元元刚想走过路口时，灯变成哪项？',
          '换到车站：元元眼看快到时公交车怎样了？',
        ],
        values: ['红灯亮了', '车子开了'],
        labels: ['红灯亮了', '车子开了', '课文没讲这件事'],
        explanation: '两处错过按故事先后理解，不能通过现实闯红灯或追车来试做。',
        material:
          '先共读原书81—83页，再看本站原创信息卡；全文在原书或合法资源阅读。',
      },
      {
        key: 'story-choice',
        prompts: [
          '等不到公交车后，元元决定怎样去学校？',
          '换到结尾：元元的心情是哪项？',
        ],
        values: ['走到学校', '非常后悔'],
        labels: ['走到学校', '非常后悔', '开心得跳起来'],
        explanation:
          '决定走路是行动，后悔是本文心情，角色表现不用于评价真实孩子。',
        material:
          '先共读原书81—83页，再看本站原创信息卡；全文在原书或合法资源阅读。',
      },
      {
        key: 'sequence',
        prompts: [
          '再睡一分钟和错过绿灯，哪项在故事中先发生？',
          '换先后：错过公交车和到学校，哪项在故事中后发生？',
        ],
        values: ['再睡一分钟', '到学校'],
        labels: ['再睡一分钟', '到学校', '两项同时'],
        explanation: '沿81—82页线索找顺序。',
        material:
          '先共读原书81—83页，再看本站原创信息卡；全文在原书或合法资源阅读。',
      },
      {
        key: 'reading',
        prompts: [
          '本课背着书包的背读哪项？',
          '换语境：本站原创词卡后背的背读哪项？',
        ],
        values: ['bēi', 'bèi'],
        labels: ['bēi', 'bèi', '两处总同音'],
        explanation:
          '背bēi是本页熟字另列读音，不计入十一新认；后背bèi为原创对比。',
        material:
          '先共读原书81—83页，再看本站原创信息卡；全文在原书或合法资源阅读。',
      },
      {
        key: 'writing',
        prompts: [
          '灯与钟中，本课会写的是哪项？',
          '换字：课与经中，本课会写的是哪项？',
        ],
        values: ['灯', '课'],
        labels: ['灯', '课', '所有会认都要写'],
        explanation: '七会写灯站坐师车课老与十一会认分开。',
        material:
          '先共读原书81—83页，再看本站原创信息卡；全文在原书或合法资源阅读。',
      },
      {
        key: 'chain-0',
        prompts: [
          '按故事：要是早一分钟，就能怎样？',
          '换条件：要是赶上公交车，就能怎样？',
        ],
        values: ['赶上绿灯', '不会迟到'],
        labels: ['赶上绿灯', '不会迟到', '不必上课'],
        explanation:
          '按第83页课文条件链说明，不承诺所有现实路程早一分钟都不会迟到。',
        material:
          '先共读原书81—83页，再看本站原创信息卡；全文在原书或合法资源阅读。',
      },
      {
        key: 'chain-1',
        prompts: [
          '按故事：要是能赶上绿灯，就能怎样？',
          '换条件：要是能及时通过路口，就能怎样？',
        ],
        values: ['及时通过路口', '赶上公交车'],
        labels: ['及时通过路口', '赶上公交车', '没有关系'],
        explanation:
          '两处填句联系前文，意思相同的表达可以说；客观题只识别指定线索。',
        material:
          '先共读原书81—83页，再看本站原创信息卡；全文在原书或合法资源阅读。',
      },
      {
        key: 'measurement',
        prompts: [
          '要知道自己一分钟实际写了几个字，应看哪项？',
          '换活动：要知道一分钟实际走了几步，应看哪项？',
        ],
        values: ['实际计时并数写完的字', '实际计时并数走过的步'],
        labels: [
          '实际计时并数写完的字',
          '实际计时并数走过的步',
          '填任何别人给的固定数量',
        ],
        explanation: '真实活动需实际计时记录，不能把选择答案当已经操作。',
        material:
          '本站原创比较卡：写字计时看写字数量；走步计时看走步数量。数量由本次操作产生，没有预填标准值。',
      },
      {
        key: 'scope',
        prompts: [
          '故事的一分钟与二十分钟能推出什么？',
          '换卡：未计时的下次想写字属于哪项？',
        ],
        values: ['仅是本故事两个时间信息', '下一次的计划'],
        labels: ['仅是本故事两个时间信息', '下一次的计划', '已经实际做完'],
        explanation: '故事不是恒等式，计划不是测量或已完成的操作。',
        material:
          '本站原创比较卡：故事多睡一分钟、迟到二十分钟；“下次想写字”没有实际计时记录。',
      },
    ],
    steps: [
      {
        title: '十一新认，背另读',
        text: '本课认钟迟灯等啊决定已经位表，写灯站坐师车课老。第83页背bēi是熟字在背着书包的另一个读音，单独跟读，不增加十一字。第83页没有红标新偏旁；网页字体用于认字，不作规范描红。',
        activity: '实际指读十一字及熟字背。',
        visual: {
          kind: 'characters',
          grid: 'tian',
          characters: [
            '钟',
            '迟',
            '灯',
            '等',
            '啊',
            '决',
            '定',
            '已',
            '经',
            '位',
            '表',
          ],
        },
      },
      {
        title: '共读81页：早起与绿灯',
        text: '准备鲁兵改选原书，先实际读81页。元元多睡一分钟，起床准备上学，刚想通过路口红灯亮了。找先后与元元的话；故事里的叹气可尝试语气，不据故事判断真实孩子。现代全文原画声音外部共读。',
        activity: '实际共读81页，找开头变化。',
      },
      {
        title: '共读82页：公交与迟到',
        text: '继续实际读82页。等过路口后错过公交，继续等不到车，元元决定走到学校；老师说迟到二十分钟，元元后悔。多睡一分钟与迟到二十分钟只是本故事信息，不当普遍换算，不实际追车或闯红灯试验。',
        activity: '实际共读82页，说结尾。',
      },
      {
        title: '朗读完整故事',
        text: '按83页要求朗读课文。按句号、问话和元元两次叹气练停顿及语气，可以听家长示范后分段练；实际声音单独确认。本课没有必背要求。',
        activity: '实际朗读81—82页全文。',
      },
      {
        title: '四句条件链',
        text: '按83页结合课文说：早一分钟能赶上绿灯；赶上绿灯能及时通过路口；及时通过路口能赶上公交车；赶上公交车就不会迟到。原页中间两句有空白，分别说完整，措辞可以不同但意思要依据课文；原故事的条件不推广为现实交通保证。',
        activity: '实际说四句条件链，两处空白自己表达。',
      },
      {
        title: '七字写一写',
        text: '按83页田字格及逐笔示范，实际写灯站坐师车课老。课不要误成元；会认与会写范围分开，普通字体不能替代笔顺示范和纸面练习。',
        activity: '实际纸面写七字。',
        visual: {
          kind: 'characters',
          grid: 'tian',
          characters: ['灯', '站', '坐', '师', '车', '课', '老'],
        },
      },
      {
        title: '一分钟走步：试做、再记',
        text: '家长借助钟表或计时器，在安全的室内空地陪伴，计时一分钟慢走并数步；也可选择安全的坐姿动作，不适合时跳过。只记录本次实际活动名称、时间和数量，不跑步竞速，不与别人固定数量比较。这里的走步活动依据83页，组织方式由本站原创。',
        activity: '实际计时一分钟并数自己的步数。',
      },
      {
        title: '一分钟写字：试做、再记',
        text: '准备纸笔，家长计时一分钟，写已经学过的字并数本次写完几个字。没有预填数量，不限必须写哪个字；完成数量不说明字迹都正确，家长另看字形。没计时不能填写成实测。',
        activity: '实际计时一分钟写字并数数量。',
      },
      {
        title: '还可以做什么',
        text: '按原页“一分钟能……”自选一个安全活动；先选内容，再实际计时、观察、记录，可和前两项不同。未来想做的一项记为计划。最后交流本次发现，允许不同体验，不把故事后悔情绪当真实心理诊断。',
        activity: '实际做自选的一分钟活动，再交流。',
      },
    ],
    actual: [
      ['recognize', '实际指读十一会认字。'],
      ['reading', '实际读背着书包bēi，并与后背bèi对比。'],
      ['read-first', '实际共读81页。'],
      ['read-second', '实际共读82页。'],
      ['read', '实际朗读全文。'],
      ['chain', '实际说83页四句条件链，自己补中间两处。'],
      ['write', '实际纸面写灯站坐师车课老。'],
      ['walk', '实际计时一分钟走步，或选择适合的安全替代活动并说明。'],
      ['timed-write', '实际计时一分钟写字，并数写完的字。'],
      ['free', '实际计时一分钟做自选安全活动。'],
      ['exchange', '实际交流本次发现并倾听。'],
    ],
    reflections: [
      '记录走步或替代活动的名称、计时和实际数量；未操作请写未操作，不猜数。',
      '记录本次一分钟写字的实际数量；未计时请说明未计时，不填成实测。',
      '记录自选活动、实际计时和结果；没做可如实写未做。',
      '本次读故事、条件句或计时有什么发现？',
      '下次还想尝试什么？这是未来计划，不当本次完成。',
    ],
  },
];
export const lowerMinuteSource = {
  sourceUrl: 'https://keben.app/book/0026',
  provider: '第三方原书公开预览',
  checkedAt: '2026-10-01',
  isbn: null,
  editionDate: null,
  printingDate: null,
};
export const lowerMinutePageAudits = entries.map((e) => ({
  itemId: e.itemId,
  pages: e.pages,
  recognize: e.recognize,
  write: e.write,
  author: e.author,
  sourceCredit: e.sourceCredit,
  newRadicals: e.newRadicals,
  additionalReadings: e.additionalReadings,
  reciteRequired: e.reciteRequired,
}));
function makeLesson(e: Entry): Lesson {
  const id = `cl-${e.itemId}`;
  const choice = (
    key: string,
    prompt: string,
    labels: string[],
    value: string,
    explanation: string,
    review: boolean,
    material?: string,
  ): Question => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
    material,
    choices: labels.map((label) => ({ id: label, label })),
    rule: { kind: 'choice', value },
    hint: '先看指定字词与原书信息，需要时请家长帮读。',
    explanation,
  });
  const objective = (review: boolean): Question[] => [
    ...required(recognitionRows[e.itemId]).map((r, i) =>
      choice(
        `char-${i}`,
        r[review ? 2 : 1],
        required(recognitionRows[e.itemId]).map((x) => x[0]),
        r[0],
        '按指定词语认字，会认与会写清单分开，实际声音需另行确认。',
        review,
      ),
    ),
    ...e.pairs.map((p) =>
      choice(
        p.key,
        p.prompts[review ? 1 : 0],
        p.labels,
        p.values[review ? 1 : 0],
        p.explanation,
        review,
        p.material,
      ),
    ),
  ];
  return {
    id,
    title: e.title,
    textbookTitle: e.title,
    page: required(e.pages[0]),
    status: 'available',
    version: 1,
    goal: e.goal,
    prerequisite: `准备第${e.pages.join('—')}页原书与田字格纸，可由家长陪读。`,
    parentTip: `${e.sourceCredit}。请先准备原书、纸笔，陪孩子听示范、读一读、说一说。课文可分段练，实际读写完成后再确认；没有材料可暂时跳过，下一次想做的事另记为计划。`,
    steps: e.steps,
    questions: [
      ...objective(false),
      ...e.actual.map(([key, prompt]): Question => ({
        id: `${id}-manual-${key}`,
        knowledge: `${id}-manual-${key}`,
        prompt,
        rule: { kind: 'manual' },
        hint: '实际尝试后确认，缺书、示范或纸笔可以暂时跳过。',
        explanation:
          '实际读背写说与客观答案分开，不自动评发音字迹，正确性null；计划不当已完成。',
      })),
      ...e.reflections.map((prompt, i): Question => ({
        id: `${id}-reflect-${i}`,
        knowledge: `${id}-reflect-${i}`,
        prompt,
        rule: { kind: 'reflection' },
        hint: '自己的话，家长可代写。',
        explanation:
          '保留原话、正确性null，开放表达不唯一判分，未来计划不当完成。',
      })),
    ],
    reviewQuestions: objective(true),
    review: {
      date: '2026-10-01',
      reviewer: '下册原书课文与活动范围校验',
      notes: `实际查看第三方原书公开预览（${lowerMinuteSource.sourceUrl}）第${e.pages.join('—')}页，认${e.recognize}与写${e.write}分别核对，来源按原书脚注，ISBN版印次仍未知。本站讲解、字词问答与活动组织原创，现代全文原画声音外部共读；朗读与实际活动分别人工确认、反思null、计划不当完成，旧补充身份与历史不改写，不以本单元课文开放声明下册或全年完成。`,
    },
  };
}
export const lowerMinuteLessons: Record<string, Lesson> = Object.fromEntries(
  entries.map((e) => [e.itemId, makeLesson(e)]),
);
