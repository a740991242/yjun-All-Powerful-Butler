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
  'u8-1': [
    ['棉', '棉花中的第1个字是哪项？', '换词语：棉衣中的第1个字是哪项？'],
    ['姑', '姑娘中的第1个字是哪项？', '换词语：姑姑中的第1个字是哪项？'],
    ['娘', '姑娘中的第2个字是哪项？', '换词语：新娘中的第2个字是哪项？'],
    ['病', '生病中的第2个字是哪项？', '换词语：病人中的第1个字是哪项？'],
    ['她', '她们中的第1个字是哪项？', '换词语：她的中的第1个字是哪项？'],
    ['治', '治病中的第1个字是哪项？', '换词语：治理中的第1个字是哪项？'],
    ['燕', '燕子中的第1个字是哪项？', '换词语：飞燕中的第2个字是哪项？'],
    ['帮', '帮忙中的第1个字是哪项？', '换词语：帮助中的第1个字是哪项？'],
    ['害', '害虫中的第1个字是哪项？', '换词语：害怕中的第1个字是哪项？'],
    ['别', '别人中的第1个字是哪项？', '换词语：分别中的第2个字是哪项？'],
    ['干', '树干中的第2个字是哪项？', '换词语：干活中的第1个字是哪项？'],
    ['惊', '惊奇中的第1个字是哪项？', '换词语：惊喜中的第1个字是哪项？'],
    ['奇', '惊奇中的第2个字是哪项？', '换词语：奇怪中的第1个字是哪项？'],
  ],
};
const entries: Entry[] = [
  {
    itemId: 'u8-1',
    title: '棉花姑娘',
    pages: [98, 99, 100, 101],
    recognize: '棉姑娘病她治燕帮害别干惊奇',
    write: '她还身久空干星',
    author: '李春明',
    sourceCredit: '李春明，选作课文时有改动',
    newRadicals: ['病字头'],
    additionalReadings: '',
    reciteRequired: false,
    goal: '认识十三字和病字头、写七字，朗读对话，连四组说明请求顺序，按三组叠词开放仿说。',
    pairs: [
      {
        key: 'helper',
        prompts: [
          '故事开头棉花姑娘先请谁帮忙？',
          '换到结尾：最后谁捉光了棉花叶上的蚜虫？',
        ],
        values: ['燕子', '七星瓢虫'],
        labels: ['燕子', '七星瓢虫', '小鱼'],
        explanation:
          '先请求燕子、再啄木鸟、再青蛙；七星瓢虫随后自己飞来，区分先后与最终帮助。',
        material:
          '先共读原书98—101页，再看本站原创信息卡；现代全文原画声音在原书或合法资源阅读。',
      },
      {
        key: 'sequence',
        prompts: [
          '燕子和啄木鸟，棉花姑娘先请求谁？',
          '换先后：啄木鸟和青蛙，棉花姑娘后请求谁？',
        ],
        values: ['燕子', '青蛙'],
        labels: ['燕子', '青蛙', '两项同时'],
        explanation:
          '沿98—99页对话找请求顺序，不把最后飞来的瓢虫也说成先前请求过。',
        material:
          '先共读原书98—101页，再看本站原创信息卡；现代全文原画声音在原书或合法资源阅读。',
      },
      {
        key: 'habitat-0',
        prompts: [
          '按本课：捉空中飞的害虫对应谁？',
          '换方向：燕子在课文中说会捉哪处的害虫？',
        ],
        values: ['燕子', '空中'],
        labels: ['燕子', '空中', '树干里'],
        explanation:
          '对应本课的燕子和空中，不据课文断定所有动物只有这一种食物。',
        material:
          '先共读原书98—101页，再看本站原创信息卡；现代全文原画声音在原书或合法资源阅读。',
      },
      {
        key: 'habitat-1',
        prompts: [
          '按本课：捉树干里的害虫对应谁？',
          '换方向：啄木鸟在课文中说会捉哪处的害虫？',
        ],
        values: ['啄木鸟', '树干里'],
        labels: ['啄木鸟', '树干里', '水田里'],
        explanation: '啄木鸟对应树干里的害虫。',
        material:
          '先共读原书98—101页，再看本站原创信息卡；现代全文原画声音在原书或合法资源阅读。',
      },
      {
        key: 'habitat-2',
        prompts: [
          '按本课：捉水田里的害虫对应谁？',
          '换方向：青蛙在课文中说会捉哪处的害虫？',
        ],
        values: ['青蛙', '水田里'],
        labels: ['青蛙', '水田里', '空中'],
        explanation: '青蛙对应水田里的害虫。',
        material:
          '先共读原书98—101页，再看本站原创信息卡；现代全文原画声音在原书或合法资源阅读。',
      },
      {
        key: 'habitat-3',
        prompts: [
          '按本课：捉棉花叶子上的害虫对应谁？',
          '换方向：七星瓢虫在本故事捉哪里的害虫？',
        ],
        values: ['七星瓢虫', '棉花叶子上'],
        labels: ['七星瓢虫', '棉花叶子上', '树干里'],
        explanation: '本故事七星瓢虫吃蚜虫；不是所有瓢虫都吃同一种食物。',
        material:
          '先共读原书98—101页，再看本站原创信息卡；现代全文原画声音在原书或合法资源阅读。',
      },
      {
        key: 'name',
        prompts: [
          '小虫子为什么叫七星瓢虫？',
          '换到结尾：棉花姑娘病好后吐出什么？',
        ],
        values: ['身上七个斑点像星星', '雪白的棉花'],
        labels: ['身上七个斑点像星星', '雪白的棉花', '真的长着七颗天上的星星'],
        explanation: '按故事解释名字中的比喻，结尾结果与名字由来分开。',
        material:
          '先共读原书98—101页，再看本站原创信息卡；现代全文原画声音在原书或合法资源阅读。',
      },
      {
        key: 'radical',
        prompts: [
          '第100页病字新标出的偏旁名称是哪项？',
          '换问部件：本页病字头对应哪项？',
        ],
        values: ['病字头', '疒'],
        labels: ['病字头', '疒', '广字头'],
        explanation: '病上红标疒称病字头，不用看病字猜医疗办法。',
        material:
          '先共读原书98—101页，再看本站原创信息卡；现代全文原画声音在原书或合法资源阅读。',
      },
      {
        key: 'reading',
        prompts: [
          '本课树干的干按语境读哪项？',
          '换到原创词卡：干净的干读哪项？',
        ],
        values: ['gàn', 'gān'],
        labels: ['gàn', 'gān', '两词总同音'],
        explanation: '树干gàn、干净gān；语境对比，不把同字全部读一音。',
        material:
          '先共读原书98—101页，再看本站原创信息卡；现代全文原画声音在原书或合法资源阅读。',
      },
      {
        key: 'writing',
        prompts: [
          '本课病和她中，会写的是哪项？',
          '换字：星和惊中，会写的是哪项？',
        ],
        values: ['她', '星'],
        labels: ['她', '星', '所有会认字都必须写'],
        explanation: '七会写她还身久空干星与十三会认分列。',
        material:
          '先共读原书98—101页，再看本站原创信息卡；现代全文原画声音在原书或合法资源阅读。',
      },
      {
        key: 'abab',
        prompts: ['按原例：碧绿碧绿描述哪项？', '换原例：雪白雪白描述哪项？'],
        values: ['叶子', '棉花'],
        labels: ['叶子', '棉花', '三个原例都是同一物品'],
        explanation:
          '原例还有火红火红的太阳；开放补新名词另由实际说完成，不设唯一答案。',
        material:
          '先共读原书98—101页，再看本站原创信息卡；现代全文原画声音在原书或合法资源阅读。',
      },
      {
        key: 'result',
        prompts: [
          '棉花姑娘病好后叶子怎样？',
          '换词语：原书第101页火红火红描述哪项？',
        ],
        values: ['碧绿碧绿', '太阳'],
        labels: ['碧绿碧绿', '太阳', '黑色石头'],
        explanation: '前问按故事结尾，后问按第三组原例，不能混淆。',
        material:
          '先共读原书98—101页，再看本站原创信息卡；现代全文原画声音在原书或合法资源阅读。',
      },
    ],
    steps: [
      {
        title: '十三会认与病字头',
        text: '本课认棉姑娘病她治燕帮害别干惊奇，写她还身久空干星。第100页病上红标疒称病字头；本课没有另列熟字新音。实际认读与选择题分开，网页字体不作规范描红。',
        activity: '实际指读十三字，并指认病字头。',
        visual: {
          kind: 'characters',
          grid: 'tian',
          characters: [
            '棉',
            '姑',
            '娘',
            '病',
            '她',
            '治',
            '燕',
            '帮',
            '害',
            '别',
            '干',
            '惊',
            '奇',
          ],
        },
      },
      {
        title: '共读98页：先请燕子',
        text: '准备李春明改选原书，实际读98页。棉花姑娘叶子上有蚜虫，她请求燕子帮助；燕子解释自己会捉空中飞的害虫。拟人对话可尝试请求和礼貌回应的语气，不据故事指导看病。现代全文原画声音外部共读。',
        activity: '实际共读98页，找到第一次请求。',
      },
      {
        title: '共读99页：再请谁，谁飞来',
        text: '实际读99页。先啄木鸟、再青蛙；两者分别说捉树干里、水田里的害虫。随后七星瓢虫自己飞来捉蚜虫，不能说棉花姑娘先请求过它。把请求顺序和最终帮助分开。',
        activity: '实际共读99页，辨清三次请求与最后帮助。',
      },
      {
        title: '共读100页：名字与结果',
        text: '继续实际读100页，七个斑点像星星解释七星瓢虫的名字，不是身上有真正的天体。棉花姑娘病好，叶子碧绿、棉花雪白。只按本故事找信息，不推广所有瓢虫或承诺现实植物一定这样恢复。',
        activity: '实际共读100页，说明名字由来和结尾。',
      },
      {
        title: '朗读对话',
        text: '按第101页要求朗读课文、读好对话。分别尝试棉花姑娘请求与动物回应，关注问话、停顿和礼貌语气；家长可示范，实际发音人工确认。本课没有必背要求。',
        activity: '实际朗读98—100页及对话。',
      },
      {
        title: '四组连线与说先后',
        text: '第101页四组按课文对应：燕子—空中、啄木鸟—树干里、青蛙—水田里、七星瓢虫—棉花叶子上。先请求燕子、啄木鸟、青蛙，最后七星瓢虫捉光蚜虫；连线后自己说过程，不拿实际动物试验。',
        activity: '实际在原书或自制文字卡连四组，并说请求顺序。',
      },
      {
        title: '三组叠词，自己补名词',
        text: '按原例读碧绿碧绿的叶子、雪白雪白的棉花、火红火红的太阳。观察两字重复一次的ABAB样子，每组还留一处空白，分别想一个合适的事物。本站原创示例可以说雪白雪白的纸，不冒充原书唯一答案；不同合理词语可接受。',
        activity: '实际读三组，并分别补说三个新词组。',
      },
      {
        title: '七字写一写',
        text: '按第100页田字格及逐笔示范，写她还身久空干星。还在请别人帮忙语境读hái；干在树干中读gàn，另用干净gān对比。本课会认字不全部变成会写字，实际纸面写与声音确认分开。',
        activity: '实际纸面写七字，并读语境里的还与干。',
        visual: {
          kind: 'characters',
          grid: 'tian',
          characters: ['她', '还', '身', '久', '空', '干', '星'],
        },
      },
      {
        title: '说收获与下一次',
        text: '交流本次如何找请求顺序、如何对应动物和位置、叠词怎样补名词；可说还不清楚的地方。听对方一句反馈，再记录实际发现与未来想练的内容，不用未来计划代替本次阅读。',
        activity: '实际交流发现并倾听。',
      },
    ],
    actual: [
      ['recognize', '实际指读十三会认字。'],
      ['radical', '实际指认病字头疒及病字。'],
      ['read-first', '实际共读98页。'],
      ['read-second', '实际共读99页。'],
      ['read-third', '实际共读100页。'],
      ['read', '实际朗读完整课文，读好对话。'],
      ['matching', '实际连四组动物与捉虫位置。'],
      ['sequence', '实际说先请求谁、再请求谁、最后谁帮忙。'],
      ['abab-read', '实际读三组ABAB词组。'],
      ['abab-green', '实际给碧绿碧绿补说一个合适的新名词。'],
      ['abab-white', '实际给雪白雪白补说一个合适的新名词。'],
      ['abab-red', '实际给火红火红补说一个合适的新名词。'],
      ['write', '实际纸面写她还身久空干星。'],
      ['reading', '实际读树干gàn与干净gān、请别人帮忙hái。'],
      ['exchange', '实际交流本次发现，并倾听反馈。'],
    ],
    reflections: [
      '这次读对话、连线或补叠词有什么实际发现？',
      '下次还想练什么？这是未来计划，不当本次完成。',
    ],
  },
];
export const lowerCottonSource = {
  sourceUrl: 'https://keben.app/book/0026',
  provider: '第三方原书公开预览',
  checkedAt: '2026-10-01',
  isbn: null,
  editionDate: null,
  printingDate: null,
};
export const lowerCottonPageAudits = entries.map((e) => ({
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
      notes: `实际查看第三方原书公开预览（${lowerCottonSource.sourceUrl}）第${e.pages.join('—')}页，认${e.recognize}与写${e.write}分别核对，来源按原书脚注，ISBN版印次仍未知。本站讲解、字词问答与活动组织原创，现代全文原画声音外部共读；朗读与实际活动分别人工确认、反思null、计划不当完成，旧补充身份与历史不改写，不以本单元课文开放声明下册或全年完成。`,
    },
  };
}
export const lowerCottonLessons: Record<string, Lesson> = Object.fromEntries(
  entries.map((e) => [e.itemId, makeLesson(e)]),
);
