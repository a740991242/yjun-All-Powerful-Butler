import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';

type Pair = {
  key: string;
  prompts: [string, string];
  values: [string, string];
  labels: string[];
  reviewLabels?: string[];
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
  'u8-4': [
    ['吵', '吵闹中的第1个字是哪项？', '换词语：争吵中的第2个字是哪项？'],
    ['现', '现在中的第1个字是哪项？', '换词语：出现中的第2个字是哪项？'],
    ['顶', '头顶中的第2个字是哪项？', '换词语：屋顶中的第2个字是哪项？'],
    ['胖', '胖乎乎中的第1个字是哪项？', '换词语：肥胖中的第2个字是哪项？'],
    ['票', '车票中的第2个字是哪项？', '换词语：门票中的第2个字是哪项？'],
    ['户', '门户中的第2个字是哪项？', '换词语：户口中的第1个字是哪项？'],
    ['交', '交通中的第1个字是哪项？', '换词语：交给中的第1个字是哪项？'],
    ['父', '父亲中的第1个字是哪项？', '换词语：父母中的第1个字是哪项？'],
  ],
};
const entries: Entry[] = [
  {
    itemId: 'u8-4',
    title: '语文园地八',
    pages: [109, 110, 111, 112, 113],
    recognize: '吵现顶胖票户交父',
    write: '页户交父',
    author: null,
    sourceCredit: '画鸡署明唐寅；小熊住山洞署胡木仁，选作课文时有改动',
    newRadicals: [],
    additionalReadings: '',
    reciteRequired: false,
    goal: '认识八字、写四字，按增减部件识字，填八词，开放说写四种心情，读画鸡与三页小熊住山洞。',
    pairs: [
      {
        key: 'add-0',
        prompts: [
          '按本页：口与少组合观察得到哪个字？',
          '换观察方向：吵包含哪个指定部件？',
        ],
        values: ['吵', '口'],
        labels: ['吵', '口', '全部字都如此'],
        explanation:
          '加部件只是本页字形识记例子，不当算术运算或每字的字源证明。',
        material:
          '先看原书109—113页，再看本站原创信息卡；现代全文原图声音外部阅读。',
      },
      {
        key: 'add-1',
        prompts: [
          '按本页：丁与页组合观察得到哪个字？',
          '换观察方向：顶包含哪个指定部件？',
        ],
        values: ['顶', '页'],
        labels: ['顶', '页', '全部字都如此'],
        explanation:
          '加部件只是本页字形识记例子，不当算术运算或每字的字源证明。',
        material:
          '先看原书109—113页，再看本站原创信息卡；现代全文原图声音外部阅读。',
      },
      {
        key: 'add-2',
        prompts: [
          '按本页：王与见组合观察得到哪个字？',
          '换观察方向：现包含哪个指定部件？',
        ],
        values: ['现', '见'],
        labels: ['现', '见', '全部字都如此'],
        explanation:
          '加部件只是本页字形识记例子，不当算术运算或每字的字源证明。',
        material:
          '先看原书109—113页，再看本站原创信息卡；现代全文原图声音外部阅读。',
      },
      {
        key: 'add-3',
        prompts: [
          '按本页：月与半组合观察得到哪个字？',
          '换观察方向：胖包含哪个指定部件？',
        ],
        values: ['胖', '半'],
        labels: ['胖', '半', '全部字都如此'],
        explanation:
          '加部件只是本页字形识记例子，不当算术运算或每字的字源证明。',
        material:
          '先看原书109—113页，再看本站原创信息卡；现代全文原图声音外部阅读。',
      },
      {
        key: 'minus-0',
        prompts: [
          '按本页：飘去掉风这一部件后看哪个字？',
          '换方向：飘由票与哪个部件组成？',
        ],
        values: ['票', '风'],
        labels: ['票', '风', '任意部件'],
        explanation: '按原例比较保留与去掉的字形部件，不当数字减法。',
        material:
          '先看原书109—113页，再看本站原创信息卡；现代全文原图声音外部阅读。',
      },
      {
        key: 'minus-1',
        prompts: [
          '按本页：校去掉木这一部件后看哪个字？',
          '换方向：校由交与哪个部件组成？',
        ],
        values: ['交', '木'],
        labels: ['交', '木', '任意部件'],
        explanation: '按原例比较保留与去掉的字形部件，不当数字减法。',
        material:
          '先看原书109—113页，再看本站原创信息卡；现代全文原图声音外部阅读。',
      },
      {
        key: 'minus-2',
        prompts: [
          '按本页：房去掉方这一部件后看哪个字？',
          '换方向：房由户与哪个部件组成？',
        ],
        values: ['户', '方'],
        labels: ['户', '方', '任意部件'],
        explanation: '按原例比较保留与去掉的字形部件，不当数字减法。',
        material:
          '先看原书109—113页，再看本站原创信息卡；现代全文原图声音外部阅读。',
      },
      {
        key: 'minus-3',
        prompts: [
          '按本页：爸去掉巴这一部件后看哪个字？',
          '换方向：爸由父与哪个部件组成？',
        ],
        values: ['父', '巴'],
        labels: ['父', '巴', '任意部件'],
        explanation: '按原例比较保留与去掉的字形部件，不当数字减法。',
        material:
          '先看原书109—113页，再看本站原创信息卡；现代全文原图声音外部阅读。',
      },
      {
        key: 'fill-0',
        prompts: ['原例填字：中□应选哪项？', '换原例填字：水□应选哪项？'],
        values: ['午', '牛'],
        labels: ['午', '牛', '两个字任意填'],
        explanation: '看词义和字形分别填原例；实际把两处写完整另列任务。',
        material:
          '先看原书109—113页，再看本站原创信息卡；现代全文原图声音外部阅读。',
      },
      {
        key: 'fill-1',
        prompts: ['原例填字：□气应选哪项？', '换原例填字：剪□应选哪项？'],
        values: ['力', '刀'],
        labels: ['力', '刀', '两个字任意填'],
        explanation: '看词义和字形分别填原例；实际把两处写完整另列任务。',
        material:
          '先看原书109—113页，再看本站原创信息卡；现代全文原图声音外部阅读。',
      },
      {
        key: 'fill-2',
        prompts: ['原例填字：□们应选哪项？', '换原例填字：出□应选哪项？'],
        values: ['人', '入'],
        labels: ['人', '入', '两个字任意填'],
        explanation: '看词义和字形分别填原例；实际把两处写完整另列任务。',
        material:
          '先看原书109—113页，再看本站原创信息卡；现代全文原图声音外部阅读。',
      },
      {
        key: 'fill-3',
        prompts: ['原例填字：□食应选哪项？', '换原例填字：□米应选哪项？'],
        values: ['主', '玉'],
        labels: ['主', '玉', '两个字任意填'],
        explanation: '看词义和字形分别填原例；实际把两处写完整另列任务。',
        material:
          '先看原书109—113页，再看本站原创信息卡；现代全文原图声音外部阅读。',
      },
      {
        key: 'fill-other-0',
        prompts: ['换到另一处原例：水□应填哪项？', '再换原例：中□应填哪项？'],
        values: ['牛', '午'],
        labels: ['牛', '午', '两个字任意填'],
        explanation: '中午水牛、力气剪刀、人们出入、主食玉米分别按语境判断。',
        material:
          '先看原书109—113页，再看本站原创信息卡；现代全文原图声音外部阅读。',
      },
      {
        key: 'fill-other-1',
        prompts: ['换到另一处原例：剪□应填哪项？', '再换原例：□气应填哪项？'],
        values: ['刀', '力'],
        labels: ['刀', '力', '两个字任意填'],
        explanation: '中午水牛、力气剪刀、人们出入、主食玉米分别按语境判断。',
        material:
          '先看原书109—113页，再看本站原创信息卡；现代全文原图声音外部阅读。',
      },
      {
        key: 'fill-other-2',
        prompts: ['换到另一处原例：出□应填哪项？', '再换原例：□们应填哪项？'],
        values: ['入', '人'],
        labels: ['入', '人', '两个字任意填'],
        explanation: '中午水牛、力气剪刀、人们出入、主食玉米分别按语境判断。',
        material:
          '先看原书109—113页，再看本站原创信息卡；现代全文原图声音外部阅读。',
      },
      {
        key: 'fill-other-3',
        prompts: ['换到另一处原例：□米应填哪项？', '再换原例：□食应填哪项？'],
        values: ['玉', '主'],
        labels: ['玉', '主', '两个字任意填'],
        explanation: '中午水牛、力气剪刀、人们出入、主食玉米分别按语境判断。',
        material:
          '先看原书109—113页，再看本站原创信息卡；现代全文原图声音外部阅读。',
      },
      {
        key: 'writing',
        prompts: ['本园地四会写中，页与顶选哪项？', '换字：户与胖中会写哪项？'],
        values: ['页', '户'],
        labels: ['页', '顶'],
        reviewLabels: ['户', '胖'],
        explanation: '四写页户交父，顶只是会认，不误扩四字清单。',
        material:
          '先看原书109—113页，再看本站原创信息卡；现代全文原图声音外部阅读。',
      },
      {
        key: 'poem-colour',
        prompts: [
          '画鸡中头上的冠是什么颜色？',
          '换到身体：诗中满身是什么颜色？',
        ],
        values: ['红', '雪白'],
        labels: ['红', '雪白', '黑'],
        explanation: '两处描写按唐寅画鸡原句，所画一只鸡不推广所有鸡颜色。',
        material:
          '先看原书109—113页，再看本站原创信息卡；现代全文原图声音外部阅读。',
      },
      {
        key: 'poem-cap',
        prompts: [
          '诗中红冠需要另戴上去吗？',
          '换后句：诗中鸡一叫，千门万户是什么动作？',
        ],
        values: ['不用另戴', '开门'],
        labels: ['不用另戴', '开门', '戴着人的帽子'],
        explanation: '冠在这里指鸡冠，开门按诗意理解，不能说戴了人的帽子。',
        material:
          '先看原书109—113页，再看本站原创信息卡；现代全文原图声音外部阅读。',
      },
      {
        key: 'poem-number',
        prompts: ['千门万户在这里应怎样理解？', '换到题名：这首诗描写哪项？'],
        values: ['很多人家的夸张说法', '画中的鸡'],
        labels: ['很多人家的夸张说法', '画中的鸡', '已经逐户数过的准确数字'],
        explanation: '诗的夸张不当测量，也不据诗推每家实际起床时间。',
        material:
          '先看原书109—113页，再看本站原创信息卡；现代全文原图声音外部阅读。',
      },
      {
        key: 'poem-author',
        prompts: ['画鸡原书署名是谁？', '换朝代：原书标明哪项？'],
        values: ['唐寅', '明'],
        labels: ['唐寅', '明', '胡木仁'],
        explanation: '唐寅为诗人署名；胡木仁为另一个共读故事作者，不混淆。',
        material:
          '先看原书109—113页，再看本站原创信息卡；现代全文原图声音外部阅读。',
      },
      {
        key: 'story-season',
        prompts: [
          '111页春天让小熊不舍砍的景物是哪项？',
          '换到夏天：小熊不舍的是什么？',
        ],
        values: ['花', '绿叶'],
        labels: ['花', '绿叶', '石子'],
        explanation: '本故事春花夏叶，不推广每种树与每个地区都同一变化。',
        material:
          '先看原书109—113页，再看本站原创信息卡；现代全文原图声音外部阅读。',
      },
      {
        key: 'story-autumn',
        prompts: ['112页秋天树上有什么？', '换到冬天：树上谁的家可能受影响？'],
        values: ['果子', '小鸟的家'],
        labels: ['果子', '小鸟的家', '小鱼的家'],
        explanation: '秋果冬鸟巢按故事对应。',
        material:
          '先看原书109—113页，再看本站原创信息卡；现代全文原图声音外部阅读。',
      },
      {
        key: 'story-home',
        prompts: [
          '开头小熊一家住在哪里？',
          '换到最后一年又一年：新房盖好了吗？',
        ],
        values: ['山洞', '没有盖新房'],
        labels: ['山洞', '没有盖新房', '已经建好的新木屋'],
        explanation: '开头想建新房是计划，结尾没有砍树，没把计划当已建成。',
        material:
          '先看原书109—113页，再看本站原创信息卡；现代全文原图声音外部阅读。',
      },
      {
        key: 'story-gifts',
        prompts: ['结尾动物送来什么？', '换问原因：为什么感谢小熊一家？'],
        values: ['鲜花和果子', '没有砍树'],
        labels: ['鲜花和果子', '没有砍树', '要求他们马上砍树'],
        explanation: '故事里的感谢与礼物，不当真实动物一定会赠物。',
        material:
          '先看原书109—113页，再看本站原创信息卡；现代全文原图声音外部阅读。',
      },
      {
        key: 'story-time',
        prompts: [
          '故事怎样表达过了很久？',
          '换到冬天：熊爸爸刚举起哪项时听到鸟声？',
        ],
        values: ['一年又一年', '斧头'],
        labels: ['一年又一年', '斧头', '准确二十天'],
        explanation:
          '书中没给具体几年，不补固定数字；只读故事，不实际持斧砍树。',
        material:
          '先看原书109—113页，再看本站原创信息卡；现代全文原图声音外部阅读。',
      },
      {
        key: 'story-source',
        prompts: [
          '小熊住山洞的原书作者署名是哪项？',
          '换阅读范围：故事应连续读到哪页？',
        ],
        values: ['胡木仁', '113页'],
        labels: ['胡木仁', '113页', '只读111页就结束'],
        explanation: '原脚注胡木仁、选作有改动；共读跨111—113三页，不漏结尾。',
        material:
          '先看原书109—113页，再看本站原创信息卡；现代全文原图声音外部阅读。',
      },
    ],
    steps: [
      {
        title: '八会认与四会写',
        text: '第109页认识吵现顶胖票户交父，写页户交父。页是会写、顶是会认，不要把四会写误为顶户交父；本园地没有新红标偏旁。网页字体用于辨形，不当规范描红。',
        activity: '实际指读八会认字。',
        visual: {
          kind: 'characters',
          grid: 'tian',
          characters: ['吵', '现', '顶', '胖', '票', '户', '交', '父'],
        },
      },
      {
        title: '四组加部件识字',
        text: '按原例观察口与少组合成吵，丁与页组合成顶，王与见组合成现，月与半组合成胖。指清左右位置，再实际读四字；这里只用加部件帮助记字形，不当数字加法或所有汉字的字源规律。',
        activity: '实际摆文字卡或指原页，读四组加部件例子。',
      },
      {
        title: '四组减部件识字',
        text: '按原例观察飘去风留票，校去木留交，房去方留户，爸去巴留父。分别指去掉和留下的部分，再读剩下的字；去部件不当算术减法，不自行改变新认写字范围。',
        activity: '实际指认四组去掉与留下的部件。',
      },
      {
        title: '四组易混字，八处填词',
        text: '午牛、刀力、人入、玉主四组分别比较笔画与位置，再在原例填中午、水牛、力气、剪刀、人们、出入、主食、玉米。先读词再填字，并实际把八处写完整；选择题只核指定字，不自动评实际字迹。',
        activity: '实际填八处原例并读完整词语。',
      },
      {
        title: '四种心情，开放说一说',
        text: '第110页高兴、生气、害怕、难过四词先实际读。再选一种或几种，用自己的话说什么事情会有这种心情；可用虚构纸偶经历，不要求说真实姓名、住址或私人事情，也不要求四种都亲身经历。表情图只是线索，不据图诊断真实孩子。',
        activity: '实际读四词，再开放说一种或几种心情。',
      },
      {
        title: '把心情写一写',
        text: '沿上一项实际说的内容，选一件事写一两句，家长可帮助写尚未学会的字。本站原创示例：纸偶找到掉落的书签，很高兴。示例不是教材原文或唯一答案；说与写分别确认，未来想做的事情不当本次真实经历。',
        activity: '实际纸面写一句或几句心情表达，可使用虚构角色。',
      },
      {
        title: '四字纸面写',
        text: '按109页田字格和逐笔示范，实际写页户交父。识字用到的八字、易混字和情绪词不因此全部加入新增会写清单；普通网页字形不能替代笔顺示范。',
        activity: '实际纸面写页户交父。',
        visual: {
          kind: 'characters',
          grid: 'tian',
          characters: ['页', '户', '交', '父'],
        },
      },
      {
        title: '日积月累：画鸡',
        text: '【明】唐寅《画鸡》：头上红冠不用裁，满身雪白走将来。平生不敢轻言语，一叫千门万户开。按原页公有领域古诗读停顿、找红冠和雪白两处描写；千门万户是很多人家的夸张，不是逐户数出的数量。写的是画中鸡，不推所有鸡颜色。先实际读，熟读后可选背诵，背诵单独确认，不补成原页明确必背指令；原画和录音外部查看。',
        activity: '实际读古诗，可选熟读后背诵并另行确认。',
      },
      {
        title: '共读111页：春花夏叶',
        text: '准备胡木仁改选原书，实际读111页。小熊一家住山洞，熊爸爸想砍树建房；春天看花、夏天看绿叶，小熊不舍砍。建房是想法，还没有完成；拟人对话和活动按故事理解，现代全文原图声音外部共读。',
        activity: '实际共读111页，说春夏两处变化。',
      },
      {
        title: '共读112页：秋果冬鸟巢',
        text: '继续实际读112页。秋天树上果子多，小熊不忍砍；冬天熊爸爸举起斧头，听到鸟声，小熊想到小鸟的家。四季对应按本故事，不当所有地方物候；只阅读，不实际持斧、攀树或碰鸟巢。',
        activity: '实际共读112页，说秋冬不砍的理由。',
      },
      {
        title: '共读113页：仍住山洞',
        text: '实际读113页结尾。一年又一年，小熊一家没有砍树，仍住山洞；动物感谢他们，送鲜花和果子。原书没有给准确几年，不补数字；不把想建房记为已建新房，也不把童话住山洞当现实住房建议。',
        activity: '实际共读113页，说最后结果与动物感谢原因。',
      },
      {
        title: '交流读书与实际发现',
        text: '把春花、夏叶、秋果、冬鸟巢到最后不砍树的经过说给家长听，再倾听一条反馈。也可说识字、填词或心情说写的发现；表达开放，不唯一判分，未做如实说明，下一次计划另列。',
        activity: '实际交流三页故事与本次学习发现。',
      },
    ],
    actual: [
      ['recognize', '实际指读八会认字。'],
      ['add', '实际指读四组加部件识字。'],
      ['minus', '实际指读四组减部件识字。'],
      ['fill', '实际填八处原例，读八个完整词语。'],
      ['feelings-read', '实际读高兴、生气、害怕、难过四词。'],
      ['feelings-say', '实际开放说一种或几种心情，可用虚构角色。'],
      ['feelings-write', '实际纸面写一句或几句心情表达，家长可帮助。'],
      ['write', '实际纸面写页户交父。'],
      ['poem-read', '实际读唐寅画鸡。'],
      [
        'poem-recite',
        '选做：熟读后实际背诵画鸡；未做可跳过，不当原页必背要求。',
      ],
      ['read-first', '实际共读111页。'],
      ['read-second', '实际共读112页。'],
      ['read-third', '实际共读113页。'],
      ['story-exchange', '实际说四季故事及最后结果、动物感谢的原因。'],
      ['exchange', '实际交流本次发现并倾听反馈。'],
    ],
    reflections: [
      '这次识字、填词、心情说写或共读有什么实际发现？可以只写学习方法，不写私人经历。',
      '下一次还想练什么？这是未来计划，不当本次完成。',
    ],
  },
];
export const lowerGardenEightSource = {
  sourceUrl: 'https://keben.app/book/0026',
  provider: '第三方原书公开预览',
  checkedAt: '2026-10-01',
  isbn: null,
  editionDate: null,
  printingDate: null,
};
export const lowerGardenEightPageAudits = entries.map((e) => ({
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
        review ? (p.reviewLabels ?? p.labels) : p.labels,
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
    version: 2,
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
      notes: `实际查看第三方原书公开预览（${lowerGardenEightSource.sourceUrl}）第${e.pages.join('—')}页，认${e.recognize}与写${e.write}分别核对，来源按原书脚注，ISBN版印次仍未知。本站讲解、字词问答与活动组织原创，现代全文原画声音外部共读；朗读与实际活动分别人工确认、反思null、计划不当完成，旧补充身份与历史不改写，不以本单元课文开放声明下册或全年完成。`,
    },
  };
}
export const lowerGardenEightLessons: Record<string, Lesson> =
  Object.fromEntries(entries.map((e) => [e.itemId, makeLesson(e)]));
