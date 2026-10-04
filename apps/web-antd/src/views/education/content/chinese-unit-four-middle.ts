import type { LearningStep, Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
import { compoundVowelPacks } from './chinese-compound-vowels';

type Pair = {
  key: string;
  prompt: [string, string];
  labels: string[];
  reviewLabels?: string[];
  value: [string, string];
  material?: [string, string];
  explanation: string;
};
export type Body = {
  itemId: string;
  version?: number;
  title: string;
  pages: number[];
  writingPage?: number;
  wordPage?: number;
  scene: string;
  characters: [string, string, string][];
  words: string;
  syllables: string[];
  readingTitle: string;
  author?: string;
  sourceNote?: string;
  readingActivity?: string;
  focusSteps: LearningStep[];
  focusQuestions: Pair[];
  readingQuestions: Pair[];
  actualFocus: string;
};

const bodies: Body[] = [
  {
    itemId: 'u4-2',
    title: 'ao ou iu',
    pages: [47, 48],
    scene:
      '查看教材第47页帆船、海鸥与海豹的情境图，先说说看到什么，再参考标准示范认识ao、ou、iu。原画只在教材中查看；情境联想不代替实际发音，不需家庭照片或个人信息。',
    characters: [
      ['小', '小桥中的第一个字。', '大小中的第二个字。'],
      ['桥', '小桥中的第二个字。', '桥头中的第一个字。'],
      ['流', '流水中的第一个字。', '河流中的第二个字。'],
      ['柳', '垂柳中的第二个字。', '柳树中的第一个字。'],
    ],
    words: 'xiǎo qiáo小桥、liú shuǐ流水、chuí liǔ垂柳、táo huā桃花',
    syllables: ['xiǎo', 'niú'],
    readingTitle: '欢迎台湾小朋友',
    author: '马瑞文',
    focusSteps: [
      {
        title: '在音节里重新找韵母',
        text: '对照第47页的音节练习，读tiào、niǎo、shāo、yào、rào、zǎo；róu、tóu、lóu、yóu、zǒu、shōu、kǒu；qiú、diū、liù、niú、xiū、jiù。这些是不同的完整音节，不是把ao、ou、iu的位置背下来。niu中的韵母写作iu，调号在u上；不要与ui看反。这里显示普通字体，实际发音另由家长陪同参考规范示范。',
        visual: {
          kind: 'characters',
          grid: 'pinyin',
          characters: ['niǎo', 'kǒu', 'qiú', 'niú'],
        },
        activity:
          '从每组任选两个音节，先指出韵母与调号，再听示范尝试连贯读。没有规范示范可跳过实际发音。',
      },
    ],
    focusQuestions: [
      {
        key: 'fan-final',
        prompt: [
          '看完整音节，niǎo对应哪个本组韵母？',
          '换一个音节，kǒu对应哪个本组韵母？',
        ],
        labels: ['ao', 'ou', 'iu'],
        value: ['ao', 'ou'],
        material: ['niǎo', 'kǒu'],
        explanation:
          'niǎo对应ao，kǒu对应ou，重新看本题完整写法；这里观察拼写，不自动评判声音。',
      },
      {
        key: 'fan-tone',
        prompt: [
          '看所示音节，qiú的调号在什么字母上？',
          '换一个音节，niú的调号在什么字母上？',
        ],
        labels: ['i', 'u', 'q'],
        value: ['u', 'u'],
        material: ['qiú', 'niú'],
        explanation:
          'iu中的调号标在后一个元音u上；调号位置相同不表示声调序号也相同。',
      },
    ],
    readingQuestions: [
      {
        key: 'reading-visit',
        prompt: [
          '《欢迎台湾小朋友》中，小朋友被邀请到哪里参观？',
          '《欢迎台湾小朋友》中，船到哪里接小朋友？',
        ],
        labels: ['学校', '台湾', '书店'],
        value: ['学校', '台湾'],
        explanation:
          '回看原书中的参观地点与接小朋友的地点，这两个地点不能混在一起。文学情境不是网站实际旅行安排。',
      },
      {
        key: 'reading-greet',
        prompt: [
          '《欢迎台湾小朋友》中，哪种动作表达欢迎？',
          '《欢迎台湾小朋友》中，见面后哪种表达体现热情？',
        ],
        labels: ['握手', '说热情的话', '独自离开'],
        value: ['握手', '说热情的话'],
        explanation:
          '按原书找欢迎动作和热情表达。现实中可以挥手或问好，不强制与人身体接触。',
      },
    ],
    actualFocus:
      '在第47页三个音节组中各选两个，参考规范示范实际尝试读；再说说iu和ui哪里不同。家长确认尝试，没有示范可跳过。',
  },
  {
    itemId: 'u4-3',
    title: 'ie üe er',
    pages: [49, 50],
    scene:
      '与家长查看教材第49页椰树、月亮与人物情境，先听示范认识ie、üe、er，再看单独列出的ye、yue。情境联想不当真实发音评分，也不把汉语拼音读成英文字母名称。',
    characters: [
      ['开', '梅花开中的最后一个字。', '开门中的第一个字。'],
      ['雪', '雪花飘中的第一个字。', '白雪中的第二个字。'],
      ['夜', '夜色美中的第一个字。', '黑夜中的第二个字。'],
      ['色', '夜色美中的第二个字。', '颜色中的第二个字。'],
      ['美', '夜色美中的最后一个字。', '美好中的第一个字。'],
    ],
    words: 'méi huā kāi梅花开、xuě huā piāo雪花飘、yè sè měi夜色美',
    syllables: ['xiě', 'zuò', 'yè'],
    readingTitle: '月儿弯弯',
    author: '王清秀',
    focusSteps: [
      {
        title: '整体认读与韵母分别看',
        text: 'ye、yue是本课的整体认读音节，参考标准示范整体读，不机械拆成声母y加一个普通韵母。对应的ie、üe仍是本课韵母写法；yue中的u省去了ü的两点，不变成普通u。er自成音节，不当作e加声母r的两拼。',
        visual: {
          kind: 'characters',
          grid: 'pinyin',
          characters: ['ie', 'üe', 'er', 'ye', 'yue'],
        },
        activity:
          '先指韵母ie、üe，再指整体认读ye、yue；实际整体读音请家长参考规范示范。',
      },
      {
        title: '两点要看前面的声母',
        text: '与n、l相拼保留ü的两点：nüè、lüè。与j、q、x相拼省去两点：jué、quē、xuě，仍对应üe，不是ue变成另一个韵母。读dié、bié、xié、qiē、jiě、piě也要看ie顺序；调号在e上。省点规则与标调位置是两件事。',
        visual: {
          kind: 'characters',
          grid: 'pinyin',
          characters: ['nüè', 'lüè', 'jué', 'quē', 'xuě'],
        },
        activity:
          '把n/l与j/q/x分别放在两组纸卡，比较同一个üe怎样拼写；卡片不代替实际发音。',
      },
    ],
    focusQuestions: [
      {
        key: 'whole-ye',
        prompt: [
          '比较材料指定的ye与ie，这一对中哪项是整体认读音节？',
          '比较新材料指定的yue与üe，这一对中哪项是整体认读音节？',
        ],
        labels: ['ye', 'yue', 'ie', 'üe'],
        value: ['ye', 'yue'],
        material: [
          '比较ye与ie，选择这一对中的整体认读音节。',
          '比较yue与üe，选择这一对中的整体认读音节。',
        ],
        explanation:
          '本题指定的一对中，ye或yue是整体认读音节；ie、üe是韵母。不据选项位置拆读。',
      },
      {
        key: 'whole-final',
        prompt: ['yue省去两点前，对应哪个韵母？', 'ye对应本课哪个韵母？'],
        labels: ['ie', 'üe', 'er', 'u'],
        value: ['üe', 'ie'],
        material: ['yue', 'ye'],
        explanation: 'yue对应üe，ye对应ie；整体读法和对应拼写分别理解。',
      },
      {
        key: 'dots-nl',
        prompt: [
          'n与üè相拼，哪种写法保留两点？',
          '换成l与üè相拼，选择正确写法。',
        ],
        labels: ['nüè', 'nuè', 'lüè', 'luè'],
        value: ['nüè', 'lüè'],
        material: ['n + üè', 'l + üè'],
        explanation:
          'n、l与üe相拼时保留ü的两点，分别写nüè、lüè；不要照搬j/q/x省点规则。',
      },
      {
        key: 'dots-jqx',
        prompt: ['j与üé相拼，选择正确写法。', '换成q与üē相拼，选择正确写法。'],
        labels: ['jué', 'jüé', 'quē', 'qüē'],
        value: ['jué', 'quē'],
        material: ['j + üé', 'q + üē'],
        explanation: 'j、q、x后的ü省去两点，分别写jué、quē，韵母仍对应üe。',
      },
      {
        key: 'dots-final',
        prompt: ['xuě对应本课哪个韵母？', '换一个声母，lüè对应本课哪个韵母？'],
        labels: ['üe', 'ie', 'er', 'u'],
        value: ['üe', 'üe'],
        material: ['xuě', 'lüè'],
        explanation:
          'xuě省点、lüè保留点，都对应üe。字母表面是否有两点不能单独决定韵母。',
      },
    ],
    readingQuestions: [
      {
        key: 'reading-place',
        prompt: [
          '《月儿弯弯》中，月儿挂在什么地方？',
          '《月儿弯弯》中，山路通到什么地方？',
        ],
        labels: ['蓝天', '校园', '海里'],
        value: ['蓝天', '校园'],
        explanation:
          '按原书分别找月儿和山路的信息；诗中景物描写不推广所有现实山路都通往校园。',
      },
      {
        key: 'reading-water',
        prompt: [
          '《月儿弯弯》中，小溪从哪里出来？',
          '《月儿弯弯》中，大河流入哪里？',
        ],
        labels: ['青山', '海', '教室'],
        value: ['青山', '海'],
        explanation:
          '按本诗情境，小溪出青山，大河流入海；不要把两个不同景物的方向混同。',
      },
    ],
    actualFocus:
      '参考第49页或教师标准示范，实际尝试整体认读ye、yue，再读nüè、lüè、jué、quē、xuě，说明哪些保留两点。家长确认尝试，不自动评判读音。',
  },
];

export function makeFormal(body: Body): Lesson {
  const base = structuredClone(required(compoundVowelPacks[body.itemId]));
  const id = `cu-${body.itemId}`;
  const rekey = (q: Question): Question => ({
    ...q,
    id: q.id.replace(base.id, id),
    knowledge: `${id}-${q.knowledge}`,
  });
  const readingPage = required(body.pages.at(-1));
  const writingPage = body.writingPage ?? required(body.pages[0]);
  const wordPage = body.wordPage ?? readingPage;
  const reading = `先与家长共读教材印刷第${readingPage}页《${body.readingTitle}》，再回看课文找信息。本站不提供现代作品全文、原图或录音；没有原书可跳过，不凭常识或标题猜内容。`;
  const choose = (
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
    hint: '看本题完整材料，按指定的一组重新判断；阅读题先共读原书。',
    explanation,
  });
  const additions = (review: boolean) => {
    const index = review ? 1 : 0;
    return [
      ...body.characters.map((row, n) =>
        choose(
          `char-${n}`,
          required(row[index + 1]),
          body.characters.map((x) => x[0]),
          row[0],
          `这里认${row[0]}；本课汉字会写清单为空，不据认字题自动确认实际朗读或书写。`,
          review,
        ),
      ),
      ...body.focusQuestions.map((q) =>
        choose(
          q.key,
          q.prompt[index],
          review ? (q.reviewLabels ?? q.labels) : q.labels,
          q.value[index],
          q.explanation,
          review,
          q.material?.[index],
        ),
      ),
      ...body.readingQuestions.map((q) =>
        choose(
          q.key,
          q.prompt[index],
          review ? (q.reviewLabels ?? q.labels) : q.labels,
          q.value[index],
          q.explanation,
          review,
          q.material?.[index] ? `${reading}\n${q.material[index]}` : reading,
        ),
      ),
    ];
  };
  const manual = (
    key: string,
    prompt: string,
    material?: string,
  ): Question => ({
    id: `${id}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
    material,
    rule: { kind: 'manual' },
    hint: '实际尝试由家长陪同查看；没有原书或规范示范可暂时跳过。',
    explanation:
      '人工确认只记录实际尝试完成，不自动评判声音、书写质量或真实共读。',
  });
  return {
    ...base,
    version: body.version ?? base.version,
    id,
    title: body.title,
    textbookTitle: body.title,
    goal: `认识${body.title}与四声、拼读和书写，认${body.characters.map((r) => r[0]).join('')}；与家长共读${body.readingTitle}。`,
    parentTip: `依据第三方原书公开预览印刷${body.pages.join('—')}页核对，ISBN版次印次未见，教师最终审校仍待完成。本课只认${body.characters.map((r) => r[0]).join('')}，没有新增汉字会写；普通字体仅供辨认，实际发音、占格和笔顺以教材或教师规范示范为准。`,
    steps: [
      {
        title: '看情境，听标准示范',
        text: body.scene,
        activity:
          '任选一个本组写法指认，与家长听示范尝试读，不要求录音或上传图片。',
      },
      ...base.steps.slice(0, 4),
      ...body.focusSteps,
      {
        title: '音节书写看规范示范',
        text: `对照教材第${writingPage}页的四线格示范练写${body.syllables.join(' ')}，注意字母位置和调号。普通屏幕字体不是描红范本；韵母书写与完整音节书写分开查看。`,
        visual: {
          kind: 'characters',
          grid: 'pinyin',
          characters: body.syllables,
        },
        activity:
          '先观察规范示范，再纸笔尝试写；没有规范示范可跳过，由家长查看实际尝试。',
      },
      {
        title: '把目标字放回词语',
        text: `与家长读${body.words}，查看教材第${wordPage}页图与词的对应。只认${body.characters.map((r) => r[0]).join('')}，词语里出现的其他字不自动加入会认，汉字会写清单为空。`,
        visual: {
          kind: 'characters',
          grid: 'tian',
          characters: body.characters.map((r) => r[0]),
        },
        activity:
          '指认一个目标字，再换一个词找同一个字；不要求购买物品或填真实学校信息。',
      },
      {
        title: `共读${body.readingTitle}`,
        text: `${reading}${body.author ? `原书注明作者${body.author}，选作课文时有改动。` : '原页未见作者署名，不补造作者。'}${body.sourceNote ?? ''}共读后尝试读准已学音节，并找出题目指定的信息。`,
        activity:
          body.readingActivity ??
          '实际共读与信息题分别进行，回看课文找指定信息；文学情境按原书理解，不推定为所有现实情形。',
      },
      {
        title: '记下自己的发现',
        text: '说一说字母顺序、两点或调号哪里需要再看；也可以记录共读时还想问的问题。下一次的计划不记作已经完成。',
        activity:
          '用自己的话记录，不评价想法是否与示例一致，不填个人身份资料。',
      },
    ],
    questions: [
      ...base.questions.map((item) => rekey(item)),
      ...additions(false),
      manual('focus-read', body.actualFocus),
      manual(
        'syllable-write',
        `对照教材第${writingPage}页规范示范，用纸笔尝试写${body.syllables.join(' ')}，检查顺序、调号和四线格位置；家长确认尝试。`,
      ),
      manual(
        'words-read',
        `实际指认${body.characters.map((r) => r[0]).join('')}，尝试读本课词语；家长确认尝试，不要求写这些汉字。`,
        body.words,
      ),
      manual(
        'reading-read',
        `与家长实际共读第${readingPage}页《${body.readingTitle}》，交流自己找到的信息；没有原书可跳过。计划或答题不等于已共读。`,
        reading,
      ),
      {
        id: `${id}-reflect`,
        knowledge: `${id}-reflect`,
        prompt: '记录一个拼读、标调或字词发现，也可以写下还想练的地方。',
        rule: { kind: 'reflection' },
        hint: '保存自己的原话，不填真实学校或身份信息。',
        explanation:
          '开放反思没有唯一答案，不自动评判掌握，也不确认未来活动已发生。',
      },
    ],
    reviewQuestions: [
      ...required(base.reviewQuestions).map((item) => rekey(item)),
      ...additions(true),
    ],
    review: {
      date: '2026-10-01',
      reviewer: '已读正文与原创活动校验',
      notes: `第三方公开预览实际印刷${body.pages.join('—')}页，不冒充官方来源，ISBN版印次未知；现代作品外部共读，不打包全文原画录音。正式课和旧补充独立ID与快照，实际活动人工确认、反思null，教师最终审校与全年覆盖未完成。`,
    },
  };
}

export const formalUnitFourMiddle: Record<string, Lesson> = Object.fromEntries(
  bodies.map((body) => [body.itemId, makeFormal(body)]),
);
