import type { Lesson, Question } from '../learning/types';

export const lowerGardenThreePageAudit = {
  itemId: 'u3-4',
  pages: [34, 35, 36, 37, 38],
  recognize: '母页止斤寸丁千全元',
  write: '止寸千斤丁元',
  dictionaryExample: '厨',
  dictionaryInitial: 'C',
  dictionarySyllable: 'chu',
  dictionaryReading: 'chú',
  poem: '赠汪伦',
  poet: '李白',
  dynasty: '唐',
  reading: '谁和谁好',
  readingAuthor: '张玉庭',
  readingAdapted: false,
  sourceUrl: 'https://keben.app/book/0026',
  provider: '第三方原书公开预览',
  checkedAt: '2026-10-01',
  isbn: null,
  editionDate: null,
  printingDate: null,
};
const id = 'cl-u3-4';
type Pair = {
  key: string;
  prompts: [string, string];
  values: [string, string];
  labels: string[];
  explanation: string;
  material: string;
};
const recognition: [string, string, string][] = [
  ['母', '母亲中的第1个字是哪项？', '换词语：字母中的第2个字是哪项？'],
  ['页', '页面中的第1个字是哪项？', '换词语：书页中的第2个字是哪项？'],
  ['止', '停止中的第2个字是哪项？', '换词语：止步中的第1个字是哪项？'],
  ['斤', '公斤中的第2个字是哪项？', '换词语：斤两中的第1个字是哪项？'],
  ['寸', '尺寸中的第2个字是哪项？', '换词语：寸步中的第1个字是哪项？'],
  ['丁', '园丁中的第2个字是哪项？', '换词语：丁香中的第1个字是哪项？'],
  ['千', '千米中的第1个字是哪项？', '换词语：秋千中的第2个字是哪项？'],
  ['全', '全部中的第1个字是哪项？', '换词语：安全中的第2个字是哪项？'],
  ['元', '元旦中的第1个字是哪项？', '换词语：单元中的第2个字是哪项？'],
];
const pairs: Pair[] = [
  {
    key: 'dictionary-start',
    prompts: ['查厨chú，先找哪个大写字母？', 'C下面要找的无调音节是哪项？'],
    values: ['C', 'chu'],
    labels: ['C', 'chu', 'H'],
    explanation: '音序是首字母大写，不用偏旁或英文读音查本题。',
    material:
      '第34页厨chú的音序查字法：首字母C→音节chu→看索引指向的正文页→在正文按声调找二声厨。有的字典索引直接标chú；原页正文页码为××，需看手中实际字典。',
  },
  {
    key: 'dictionary-tone',
    prompts: ['厨chú在正文要找几声？', '本题给出的完整带调读音是什么？'],
    values: ['第二声', 'chú'],
    labels: ['第二声', 'chú', '第一声'],
    explanation: '字母、音节、声调分别看；部分字典索引有声调，依实际版式使用。',
    material:
      '第34页厨chú的音序查字法：首字母C→音节chu→看索引指向的正文页→在正文按声调找二声厨。有的字典索引直接标chú；原页正文页码为××，需看手中实际字典。',
  },
  {
    key: 'dictionary-page',
    prompts: [
      '音节索引里找到页码之后去哪里？',
      '教材××页能否直接当作手中所有字典的真实页码？',
    ],
    values: ['字典正文对应页', '不能，需要看实际字典'],
    labels: ['字典正文对应页', '不能，需要看实际字典', '所有字典都在同一页'],
    explanation: '索引页码是导航，不是同一固定数字；不补造字典页码。',
    material:
      '第34页厨chú的音序查字法：首字母C→音节chu→看索引指向的正文页→在正文按声调找二声厨。有的字典索引直接标chú；原页正文页码为××，需看手中实际字典。',
  },
  {
    key: 'lookup-0',
    prompts: ['用音序查母，首字母大写是哪项？', '换一步：母的无调音节是哪项？'],
    values: ['M', 'mu'],
    labels: ['M', 'mu', '按笔画数直接猜'],
    explanation:
      '按已知读音查字；查后组词是独立实际任务，屏幕选择不当真正查过。',
    material: '本题已给字与音节：母，mu。请按手中字典练习。',
  },
  {
    key: 'lookup-1',
    prompts: ['用音序查页，首字母大写是哪项？', '换一步：页的无调音节是哪项？'],
    values: ['Y', 'ye'],
    labels: ['Y', 'ye', '按笔画数直接猜'],
    explanation:
      '按已知读音查字；查后组词是独立实际任务，屏幕选择不当真正查过。',
    material: '本题已给字与音节：页，ye。请按手中字典练习。',
  },
  {
    key: 'lookup-2',
    prompts: ['用音序查止，首字母大写是哪项？', '换一步：止的无调音节是哪项？'],
    values: ['Z', 'zhi'],
    labels: ['Z', 'zhi', '按笔画数直接猜'],
    explanation:
      '按已知读音查字；查后组词是独立实际任务，屏幕选择不当真正查过。',
    material: '本题已给字与音节：止，zhi。请按手中字典练习。',
  },
  {
    key: 'lookup-3',
    prompts: ['用音序查斤，首字母大写是哪项？', '换一步：斤的无调音节是哪项？'],
    values: ['J', 'jin'],
    labels: ['J', 'jin', '按笔画数直接猜'],
    explanation:
      '按已知读音查字；查后组词是独立实际任务，屏幕选择不当真正查过。',
    material: '本题已给字与音节：斤，jin。请按手中字典练习。',
  },
  {
    key: 'lookup-4',
    prompts: ['用音序查寸，首字母大写是哪项？', '换一步：寸的无调音节是哪项？'],
    values: ['C', 'cun'],
    labels: ['C', 'cun', '按笔画数直接猜'],
    explanation:
      '按已知读音查字；查后组词是独立实际任务，屏幕选择不当真正查过。',
    material: '本题已给字与音节：寸，cun。请按手中字典练习。',
  },
  {
    key: 'lookup-5',
    prompts: ['用音序查丁，首字母大写是哪项？', '换一步：丁的无调音节是哪项？'],
    values: ['D', 'ding'],
    labels: ['D', 'ding', '按笔画数直接猜'],
    explanation:
      '按已知读音查字；查后组词是独立实际任务，屏幕选择不当真正查过。',
    material: '本题已给字与音节：丁，ding。请按手中字典练习。',
  },
  {
    key: 'lookup-6',
    prompts: ['用音序查千，首字母大写是哪项？', '换一步：千的无调音节是哪项？'],
    values: ['Q', 'qian'],
    labels: ['Q', 'qian', '按笔画数直接猜'],
    explanation:
      '按已知读音查字；查后组词是独立实际任务，屏幕选择不当真正查过。',
    material: '本题已给字与音节：千，qian。请按手中字典练习。',
  },
  {
    key: 'lookup-7',
    prompts: ['用音序查全，首字母大写是哪项？', '换一步：全的无调音节是哪项？'],
    values: ['Q', 'quan'],
    labels: ['Q', 'quan', '按笔画数直接猜'],
    explanation:
      '按已知读音查字；查后组词是独立实际任务，屏幕选择不当真正查过。',
    material: '本题已给字与音节：全，quan。请按手中字典练习。',
  },
  {
    key: 'lookup-8',
    prompts: ['用音序查元，首字母大写是哪项？', '换一步：元的无调音节是哪项？'],
    values: ['Y', 'yuan'],
    labels: ['Y', 'yuan', '按笔画数直接猜'],
    explanation:
      '按已知读音查字；查后组词是独立实际任务，屏幕选择不当真正查过。',
    material: '本题已给字与音节：元，yuan。请按手中字典练习。',
  },
  {
    key: 'poet',
    prompts: ['赠汪伦原页署名是谁？', '原页署名朝代是哪项？'],
    values: ['李白', '唐'],
    labels: ['李白', '唐', '贾岛'],
    explanation: '第35页唐李白公有领域古诗，保留署名。',
    material:
      '李白乘舟将欲行，忽闻岸上踏歌声。\n桃花潭水深千尺，不及汪伦送我情。',
  },
  {
    key: 'poem-event',
    prompts: ['诗中将要出发时乘坐什么？', '听到歌声的地方是哪项？'],
    values: ['舟', '岸上'],
    labels: ['舟', '岸上', '已经到家'],
    explanation: '诗中将欲行与送别分开，不补造具体旅行时间和目的地。',
    material:
      '李白乘舟将欲行，忽闻岸上踏歌声。\n桃花潭水深千尺，不及汪伦送我情。',
  },
  {
    key: 'poem-friendship',
    prompts: ['最后一句表达汪伦怎样的情感？', '深千尺在这里主要是什么表达？'],
    values: ['深厚的送别情谊', '夸张'],
    labels: ['深厚的送别情谊', '夸张', '实测水深记录'],
    explanation: '夸张表达情谊，不当测量值或现实入水活动，不按唯一感受判分。',
    material:
      '李白乘舟将欲行，忽闻岸上踏歌声。\n桃花潭水深千尺，不及汪伦送我情。',
  },
  {
    key: 'phone-start',
    prompts: ['模拟接听电话，先做哪项？', '模拟拨打电话，要先说清什么？'],
    values: ['主动问好', '自己是谁'],
    labels: ['主动问好', '自己是谁', '不说明来意就挂断'],
    explanation: '按第36页两条提示练习，说法可不同，不限定唯一台词。',
    material:
      '本站原创模拟卡，人物均虚构：小禾打给小树；接听者先问好，小禾介绍自己并说明找小树，接听者请稍等，小禾礼貌回应。练习不拨实际号码。',
  },
  {
    key: 'phone-purpose',
    prompts: ['模拟约同学：本次要说明哪项？', '模拟询问图书馆：本次要问哪项？'],
    values: ['约玩的来意', '开放时间'],
    labels: ['约玩的来意', '开放时间', '上传真实家庭号码'],
    explanation: '三种情境可自主组织；图书馆开放时间未知，不能补造。',
    material:
      '本站原创模拟卡，人物均虚构：小禾打给小树；接听者先问好，小禾介绍自己并说明找小树，接听者请稍等，小禾礼貌回应。练习不拨实际号码。',
  },
  {
    key: 'phone-wait',
    prompts: [
      '对方说稍等，合适的行动是哪项？',
      '第36页另外一种电话练习对象是哪项？',
    ],
    values: ['耐心等待', '长辈'],
    labels: ['耐心等待', '长辈', '不断大声催促'],
    explanation: '问候长辈、约同学、问开放时间分别练习，实际说听由人确认。',
    material:
      '本站原创模拟卡，人物均虚构：小禾打给小树；接听者先问好，小禾介绍自己并说明找小树，接听者请稍等，小禾礼貌回应。练习不拨实际号码。',
  },
  {
    key: 'reading-pair-0',
    prompts: [
      '共读37—38：原诗与藤配对的是哪项？',
      '反向看原诗：与瓜配对的是哪项？',
    ],
    values: ['瓜', '藤'],
    labels: ['瓜', '藤', '字典'],
    explanation: '按诗中四组关系读，不推成所有现实关系或唯一友谊规则。',
    material: '先和大人共读原书37—38页谁和谁好；现代全文、原画、录音外部共读。',
  },
  {
    key: 'reading-pair-1',
    prompts: [
      '共读37—38：原诗与蜜蜂配对的是哪项？',
      '反向看原诗：与花配对的是哪项？',
    ],
    values: ['花', '蜜蜂'],
    labels: ['花', '蜜蜂', '字典'],
    explanation: '按诗中四组关系读，不推成所有现实关系或唯一友谊规则。',
    material: '先和大人共读原书37—38页谁和谁好；现代全文、原画、录音外部共读。',
  },
  {
    key: 'reading-pair-2',
    prompts: [
      '共读37—38：原诗与白云配对的是哪项？',
      '反向看原诗：与风配对的是哪项？',
    ],
    values: ['风', '白云'],
    labels: ['风', '白云', '字典'],
    explanation: '按诗中四组关系读，不推成所有现实关系或唯一友谊规则。',
    material: '先和大人共读原书37—38页谁和谁好；现代全文、原画、录音外部共读。',
  },
  {
    key: 'reading-pair-3',
    prompts: [
      '共读37—38：原诗与我配对的是哪项？',
      '反向看原诗：与同学配对的是哪项？',
    ],
    values: ['同学', '我'],
    labels: ['同学', '我', '字典'],
    explanation: '按诗中四组关系读，不推成所有现实关系或唯一友谊规则。',
    material: '先和大人共读原书37—38页谁和谁好；现代全文、原画、录音外部共读。',
  },
  {
    key: 'reading-action',
    prompts: ['诗中蜜蜂来做什么？', '诗中我和同学一起去哪里？'],
    values: ['采蜜', '学校'],
    labels: ['采蜜', '学校', '要求孩子接触蜂群'],
    explanation: '诗中角色行为不当现实操作；不要求个人家庭身份或实际接触蜜蜂。',
    material: '共读原书37—38页，找各组描写的行动。',
  },
  {
    key: 'reading-imagination',
    prompts: [
      '原诗把藤瓜写成手拉手，这属于什么表达？',
      '云往哪里跑的描写能否代替所有实际天气观测？',
    ],
    values: ['拟人', '不能'],
    labels: ['拟人', '不能', '证明所有云都按地面风移动'],
    explanation:
      '文学拟人与现实植物、天气事实分开；不同伙伴可以有不同相处方式。',
    material: '原书谁和谁好用拟人呈现关系，实际共读后讨论。',
  },
  {
    key: 'writing',
    prompts: [
      '只比较止与母，本园地会写字是哪项？',
      '只比较元与页，本园地会写字是哪项？',
    ],
    values: ['止', '元'],
    labels: ['止', '元', '页'],
    explanation: '正文六写止寸千斤丁元，与字表同一集合但排列不同；旦不是元。',
    material: '先看第35页六个田字格，按规范示范实际写。',
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
    hint: '先看本题限定字词和原书信息，家长可以帮读。',
    explanation,
  };
}
function objective(review: boolean): Question[] {
  return [
    ...recognition.map(([c, main, next], i) =>
      choice(
        `char-${i}`,
        review ? next : main,
        recognition.map((r) => r[0]),
        c,
        '按指定词认字，实际读音需另行确认，会认与会写清单分开。',
        review,
      ),
    ),
    ...pairs.map((p) =>
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
}
const actual: [string, string][] = [
  ['recognize', '实际指读母页止斤寸丁千全元九字。'],
  [
    'dictionary-example',
    '按手中字典实际查厨chú，核对字母、音节、正文页和声调；缺字典可跳过。',
  ],
  [
    'dictionary-nine',
    '实际用音序查九个指定字，各组一个词；允许分次完成，不按屏幕选择认定查过。',
  ],
  ['write', '按第35页规范示范实际纸面写止寸千斤丁元六字。'],
  ['poem', '与大人实际朗读赠汪伦，交流送别和深厚情谊，不用屏幕选择评声音。'],
  ['phone-friend', '与伙伴用虚构角色模拟电话约同学玩，轮换拨打与接听角色。'],
  ['phone-elder', '用虚构角色模拟电话问候长辈，听完回应；不需真实姓名号码。'],
  [
    'phone-library',
    '模拟询问图书馆开放时间，说明问题、听取回应；不把虚构答复当实际开放时间。',
  ],
  ['reading-first', '与大人实际共读第37页藤瓜与蜜蜂花，交流拟人发现。'],
  ['reading-second', '实际继续共读第38页白云风、我同学，交流一组关系。'],
  ['exchange', '轮流说一个查字、古诗或共读发现，听伙伴回应，表达可不同。'],
];
export const lowerGardenThreeLesson: Lesson = {
  id,
  title: '语文园地三',
  textbookTitle: '语文园地三',
  page: 34,
  status: 'available',
  version: 1,
  goal: '认九字写六字，用音序查字并组词，读唐诗、模拟电话三情境、两页亲子共读。',
  prerequisite:
    '准备原书34—38页、字典与纸笔，家长可陪读；无材料可暂时跳过实际任务。',
  parentTip:
    '按实际五页全部栏目组织，保留旧识字补充和历史身份。本站字词问答与活动组织原创，现代全文原画声音外部共读，唐诗为公有领域文本；未知ISBN版印次不补造。实际任务人工确认、反思null、未来计划不当已完成，本课开放不证明整册全年或最终审校完成。',
  steps: [
    {
      title: '五页园地一起看',
      text: '34—38页包含音序查字法、九认六写、唐诗、打电话与两页共读。本站题目与活动组织原创，原书公开预览已核对，单个字表不能替代完整活动。',
      activity: '与大人查看五页栏目。',
    },
    {
      title: '先找字母，再找音节',
      text: '第34页厨chú的音序查字法：首字母C→音节chu→看索引指向的正文页→在正文按声调找二声厨。有的字典索引直接标chú；原页正文页码为××，需看手中实际字典。',
      activity: '与大人实际查厨，依手中字典核对页码。',
    },
    {
      title: '九个字，查后再组词',
      text: '母mǔ、页yè、止zhǐ、斤jīn、寸cùn、丁dīng、千qiān、全quán、元yuán。查九字并组词，读音已知用音序查；拼音选择不证明已经查过或读准。',
      activity: '实际指读九字，分次查字与组词。',
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: ['母', '页', '止', '斤', '寸', '丁', '千', '全', '元'],
      },
    },
    {
      title: '六会写与字形区分',
      text: '正文顺序止寸千斤丁元，字表顺序不同但同为六字。元与旦区分；按原书规范示范写，网页普通字体不作标准笔顺或描红。',
      activity: '观察示范，实际纸面写六字。',
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: ['止', '寸', '千', '斤', '丁', '元'],
      },
    },
    {
      title: '唐李白：赠汪伦',
      text: '[唐]李白\n李白乘舟将欲行，忽闻岸上踏歌声。\n桃花潭水深千尺，不及汪伦送我情。\n将欲行是将要出发，忽闻是忽然听见。用夸张比情谊，不把深千尺当实测水深；不增加必做背诵。',
      activity: '实际朗读，交流送别情谊。',
    },
    {
      title: '拨打和接听分角色',
      text: '第36页提示接听主动问好、拨打说清自己是谁；还要让对方听清来意和礼貌回应。本站卡人物虚构，台词开放，不要求拨电话或录真实身份。',
      activity: '轮换模拟拨打和接听。',
    },
    {
      title: '三种电话情境都试试',
      text: '约同学玩、问候长辈、问图书馆开放时间分别试。时间未给，不编成真实信息；模拟的安排与现实约定、真正做过的活动分开。',
      activity: '分别模拟三种情境并听伙伴回应。',
    },
    {
      title: '谁和谁好：先读37页',
      text: '原页作者张玉庭，未标有改动。先共读藤和瓜、蜜蜂和花，观察拟人与行动，不要求碰蜂群；现代全文原画录音外部共读。',
      activity: '实际与大人共读第37页，交流一处发现。',
    },
    {
      title: '再读38页：云风与同学',
      text: '白云和风、我和同学继续共读。文学关系不当全部现实气象或唯一友谊规则，不要求真实同学姓名、家庭结构或人人同样喜好。',
      activity: '实际共读第38页，轮流说听。',
    },
    {
      title: '记录发现与下一次计划',
      text: '查过字、实际读写说听分别由孩子或家长确认，不能靠选择题代替；开放感受不唯一判分，未来计划不当已经完成。',
      activity: '保留一个发现与未来计划。',
    },
  ],
  questions: [
    ...objective(false),
    ...actual.map(([key, prompt]): Question => ({
      id: `${id}-manual-${key}`,
      knowledge: `${id}-manual-${key}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '实际尝试后确认，缺书纸笔或示范可以暂时跳过。',
      explanation:
        '实际读写说听由孩子或家长确认，不自动评声音字迹，正确性null，计划不当完成。',
    })),
    ...[
      '记录一个查字、古诗、电话或共读发现。',
      '记录下次练习计划，明确不是已经完成。',
    ].map((prompt, i): Question => ({
      id: `${id}-reflect-${i}`,
      knowledge: `${id}-reflect-${i}`,
      prompt,
      rule: { kind: 'reflection' },
      hint: '自己的话，家长可代写。',
      explanation:
        '反思保留原话、正确性null，开放表达不唯一判分，未来计划不当活动完成。',
    })),
  ],
  reviewQuestions: objective(true),
  review: {
    date: '2026-10-01',
    reviewer: '下册园地三五页活动范围校验',
    notes:
      '实际查看第三方原书公开预览（https://keben.app/book/0026）34—38五页，九认六写、音序查字三步骤、唐李白赠汪伦、电话三情境与张玉庭两页共读分别核对。未知字典页码与出版元数据不补造；现代全文原画声音外部共读，实际任务人工确认、反思null、计划不当完成，旧历史保留，全年及最终审校另验。',
  },
};
