import type { LearningStep, Lesson, Question } from '../learning/types';

import { required } from '../learning/required';

export const unitTwoPageAudits = [
  {
    itemId: 'u2-1',
    title: 'a o e',
    pages: [20, 21],
    recognize: '',
    write: '',
    topics: ['情境认字母', '三单韵母四声', '四线格书写示范'],
  },
  {
    itemId: 'u2-2',
    title: 'i u ü',
    pages: [22, 23],
    recognize: '',
    write: '',
    topics: ['情境认字母', '三单韵母四声', 'i标调与ü两点', '四线格示范'],
  },
  {
    itemId: 'u2-3',
    title: 'b p m f',
    pages: [24, 25],
    recognize: '爸妈',
    write: '',
    topics: ['声母辨认', '两拼与带调音节', '声母书写示范', '爸爸妈妈与轻声'],
  },
  {
    itemId: 'u2-4',
    title: 'd t n l',
    pages: [26, 27],
    recognize: '大马路土',
    write: '',
    topics: ['声母与两拼', 'n/l与ü相拼', '四线格示范', '生活词语', '读小白兔'],
  },
  {
    itemId: 'u2-5',
    title: '语文园地二',
    pages: [28, 29, 30, 31],
    recognize: '本学校班级姓名王',
    write: '九王',
    topics: [
      '学习用品信息',
      '声调与形近声母比较',
      '按韵母联系汉字',
      '古诗画',
      '小白兔和小灰兔共读',
    ],
  },
].map((entry) => ({
  ...entry,
  sourceUrl: 'https://keben.app/book/0025',
  provider: '第三方原书公开预览',
  checkedAt: '2026-10-01',
  isbn: null,
  editionDate: null,
  printingDate: null,
}));
const toneRows: Record<string, string[]> = {
  a: ['ā', 'á', 'ǎ', 'à'],
  o: ['ō', 'ó', 'ǒ', 'ò'],
  e: ['ē', 'é', 'ě', 'è'],
  i: ['ī', 'í', 'ǐ', 'ì'],
  u: ['ū', 'ú', 'ǔ', 'ù'],
  ü: ['ǖ', 'ǘ', 'ǚ', 'ǜ'],
};
function choose(
  id: string,
  knowledge: string,
  prompt: string,
  labels: string[],
  value: string,
  explanation: string,
  material?: string,
): Question {
  return {
    id,
    knowledge,
    prompt,
    material,
    choices: labels.map((label) => ({ id: label, label })),
    rule: { kind: 'choice', value },
    hint: '先看本题字母、声调或材料条件；需要时请家长读题，实际读音跟规范示范。',
    explanation,
  };
}
const manual = (
  id: string,
  knowledge: string,
  prompt: string,
  material?: string,
): Question => ({
  id,
  knowledge,
  prompt,
  material,
  rule: { kind: 'manual' },
  hint: '请准备教材或教师规范示范及实际材料；尚未完成可以跳过，稍后再做。',
  explanation:
    '人工确认实际活动，不自动评价发音、拼读、笔顺、占格或表达，不计客观正确率。',
});
const reflection = (id: string): Question => ({
  id: `${id}-reflection`,
  knowledge: `${id}-reflection`,
  prompt: '哪个字母、音节或活动还想再练？写自己的话，家长可代写。',
  rule: { kind: 'reflection' },
  hint: '可以写一个具体例子，不要求标准答案。',
  explanation: '保存原话、不自动评分，也不自动确认真实活动已完成。',
});
const auditNotes = (itemId: string) => {
  const audit = required(
    unitTwoPageAudits.find((entry) => entry.itemId === itemId),
  );
  return `实际查看${audit.provider}（${audit.sourceUrl}）新版封面、编写出版信息、目录及印刷第${audit.pages.join('、')}页，范围：${audit.topics.join('、')}。认字${audit.recognize || '无新增'}；会写汉字${audit.write || '无新增'}。ISBN、版权版次和印次未知，不称为官方入口。讲解与任务原创，不复制现代韵文全文、教材原画、笔顺图或录音；古诗《画》为公有领域作品。实际发音、书写与共读需规范示范和人工确认，尚待教师最终人工审校；课包开放不证明整册完成。`;
};
function visual(characters: string[]) {
  return { kind: 'characters' as const, characters, grid: 'pinyin' as const };
}
function vowelCourse(itemId: 'u2-1' | 'u2-2'): Lesson {
  const audit = required(
    unitTwoPageAudits.find((entry) => entry.itemId === itemId),
  );
  const id = `cu-${itemId}`;
  const vowels = itemId === 'u2-1' ? ['a', 'o', 'e'] : ['i', 'u', 'ü'];
  const objective = (review: boolean): Question[] => [
    ...vowels.map((vowel, index) => ({
      ...choose(
        `${id}-${review ? 'r' : 'q'}-shape-${index}`,
        `${id}-shape-${index}`,
        review
          ? '字卡上的带调写法对应哪个单韵母？'
          : `在本组三个字母中，选出${vowel}。`,
        vowels,
        vowel,
        `对应单韵母${vowel}。这是辨形题，不据选择结果确认发音正确。`,
        review ? required(required(toneRows[vowel])[index]) : undefined,
      ),
      visual: review
        ? visual([required(required(toneRows[vowel])[index])])
        : visual(vowels),
    })),
    ...vowels.flatMap((vowel, index) =>
      required(toneRows[vowel]).map((_, tone) => {
        const wanted = review ? (tone + 1) % 4 : tone;
        return {
          ...choose(
            `${id}-${review ? 'r' : 'q'}-tone-${index}-${tone}`,
            `${id}-tone-${index}-${tone}`,
            review
              ? '看这张带调字卡，它表示第几声？'
              : `选择${vowel}的第${wanted + 1}声写法。`,
            review
              ? ['第一声', '第二声', '第三声', '第四声']
              : required(toneRows[vowel]),
            review
              ? required(['第一声', '第二声', '第三声', '第四声'][wanted])
              : required(required(toneRows[vowel])[wanted]),
            `第${wanted + 1}声写作${required(toneRows[vowel])[wanted]}。判断写法与实际读音分开。`,
          ),
          visual: review
            ? visual([required(required(toneRows[vowel])[wanted])])
            : undefined,
        };
      }),
    ),
    choose(
      `${id}-${review ? 'r' : 'q'}-grid`,
      `${id}-grid`,
      review
        ? '纸笔练拼音时，应该对照哪一种示范？'
        : '四线三格一共有几条横线？',
      review
        ? ['教材或教师的规范书写', '随意放大屏幕字体描红']
        : ['四条', '三条', '两条'],
      review ? '教材或教师的规范书写' : '四条',
      '四条横线围出上中下三格；具体位置和笔顺对照教材，不以普通字体作范本。',
    ),
    choose(
      `${id}-${review ? 'r' : 'q'}-marks`,
      `${id}-marks`,
      (() => {
        if (itemId === 'u2-1')
          return review
            ? '看新字卡ē与ě，上方调号是否相同？'
            : 'á与à的上方调号是否相同？';
        return review
          ? '单独展示ǜ时，两点与调号如何写？'
          : 'i标调时，原有的小点如何处理？';
      })(),
      (() => {
        if (itemId === 'u2-1') return ['不同', '相同'];
        return review
          ? ['两点和调号都保留', '省去两点变成ù']
          : ['省去原有小点', '小点和调号都保留'];
      })(),
      (() => {
        if (itemId === 'u2-1') return '不同';
        return review ? '两点和调号都保留' : '省去原有小点';
      })(),
      (() => {
        if (itemId === 'u2-1')
          return review
            ? 'ē是第一声平放的调号，ě是第三声有折转的调号，两者不同；不沿用上一题的二声、四声材料。'
            : '二声调号向右上，四声向右下。';
        return 'i标调省去原小点；本课ü单独带调，两点与调号同时保留，后续拼写规则不在这里混入。';
      })(),
    ),
  ];
  const shapeText =
    itemId === 'u2-1'
      ? 'a、o、e是三个不同的单韵母。对照第20页情境观察人物、鸡和鹅，听标准示范认读字母。字母形状可联系图画，但不能用动物叫声或英语字母名称代替准确拼音。'
      : 'i、u、ü是三个不同的单韵母。对照第22页衣服、乌龟、鱼等情境，听规范示范认读；比较上方一点、没有两点与两点。这课不合并y w。';
  const steps: LearningStep[] = [
    {
      title: '观察教材情境',
      text: shapeText,
      activity: `打开教材第${audit.pages[0]}页，孩子说看到了什么，家长指字母并示范。`,
    },
    {
      title: '比较三个单韵母',
      text:
        itemId === 'u2-1'
          ? 'o是闭合的圈形，e有一横和开口，a与o不同。普通字体可能与教材手写字形不同，先辨认，再对照教材规范写法。'
          : '未标调i有小点，u没有两点，ü有两点。ü的两点属于字母，不是第二声调号；i标调时省去原小点。',
      visual: visual(vowels),
    },
    {
      title: '逐组观察四声',
      text: '第一声标记平放，第二声向右上，第三声有折转，第四声向右下。按每个字母的一至四声观察并跟读；调号走向只是辅助，不能代替声音。第三声实际语流变化由教师指导，本课不自动判断。',
      visual: visual(vowels.flatMap((vowel) => required(toneRows[vowel]))),
      activity:
        '按顺序指字卡，再参考规范示范跟读；一次选一个字母的四声，不用TTS冒充标准录音。',
    },
    {
      title: '四线三格与纸笔',
      text: `打开教材第${audit.pages[1]}页底部，四条横线围成上、中、下三格。观察每个字母的逐笔示范、起笔与位置，准备四线格纸练习。本站字卡只是辨认展示，不作规范占格、描红或笔顺动画。`,
      activity: '指一指四条线和三个格，再由家长看实际纸面示范后书写。',
    },
    {
      title: '认读、辨形与书写分开',
      text: '认字母和带调写法的选择题检查视觉对应，标准跟读和纸笔各有人工任务。看提示与家长帮读单独记录，完成不等于掌握。',
      activity: '选还想练的一行，请家长再示范；缺示范的实际活动可稍后完成。',
    },
  ];
  return {
    id,
    textbookTitle: audit.title,
    title: audit.title,
    page: required(audit.pages[0]),
    version: itemId === 'u2-1' ? 2 : 1,
    status: 'available',
    goal: '认读三个单韵母与四声，观察教材情境和四线格示范；辨形、跟读、书写分别练习。',
    prerequisite: '请家长陪读题目，准备教材或教师标准示范和四线格纸。',
    parentTip:
      '网站不提供教材录音或自动发音评分，不用屏幕字体冒充规范书写。没有示范时可以先做视觉练习，真实活动允许跳过。',
    steps,
    questions: [
      ...objective(false),
      manual(
        `${id}-manual-picture`,
        `${id}-picture`,
        `看教材第${audit.pages[0]}页原图，指出字母与图画的联系，听家长规范示范后认读${audit.title}。`,
      ),
      manual(
        `${id}-manual-tone`,
        `${id}-oral`,
        '参考规范示范，逐行认读三个单韵母的一至四声。由家长记录实际情况，不自动判断发音。',
        vowels.map((vowel) => required(toneRows[vowel]).join('　')).join('\n'),
      ),
      manual(
        `${id}-manual-write`,
        `${id}-writing`,
        `对照教材第${audit.pages[1]}页逐笔示范，在四线格纸练习本课三个字母与带调写法；家长观察笔顺、点和占格。缺少示范可跳过。`,
        audit.title,
      ),
      reflection(id),
    ],
    reviewQuestions: objective(true),
    review: {
      date: audit.checkedAt,
      reviewer: '原书两页拼音范围核验与原创任务校验',
      notes: auditNotes(itemId),
    },
  };
}
const initialRows: Record<
  string,
  { letter: string; main: string; review: string }[]
> = {
  'u2-3': [
    { letter: 'b', main: 'ā', review: 'ǐ' },
    { letter: 'p', main: 'á', review: 'ǔ' },
    { letter: 'm', main: 'ǐ', review: 'ù' },
    { letter: 'f', main: 'ǔ', review: 'ā' },
  ],
  'u2-4': [
    { letter: 'd', main: 'ǎ', review: 'ì' },
    { letter: 't', main: 'è', review: 'ǔ' },
    { letter: 'n', main: 'ǐ', review: 'á' },
    { letter: 'l', main: 'ù', review: 'é' },
  ],
};
function initialCourse(itemId: 'u2-3' | 'u2-4'): Lesson {
  const audit = required(
    unitTwoPageAudits.find((entry) => entry.itemId === itemId),
  );
  const id = `cu-${itemId}`;
  const rows = required(initialRows[itemId]);
  const objective = (review: boolean): Question[] => {
    const tasks: Question[] = rows.flatMap((row, index) => [
      choose(
        `${id}-${review ? 'r' : 'q'}-shape-${index}`,
        `${id}-shape-${index}`,
        review ? '选择所示音节最前面的声母。' : `选出声母${row.letter}。`,
        rows.map((row) => row.letter),
        row.letter,
        `这里的声母是${row.letter}。字形对应不证明实际发音。`,
        review ? row.letter + row.review : undefined,
      ),
      choose(
        `${id}-${review ? 'r' : 'q'}-blend-${index}`,
        `${id}-blend-${index}`,
        '按所示声母和带调韵母，选择正确连写的音节。',
        rows.map(
          (other) => other.letter + (review ? other.review : other.main),
        ),
        row.letter + (review ? row.review : row.main),
        `${row.letter}与${review ? row.review : row.main}连写作${row.letter + (review ? row.review : row.main)}，调号保留。实际拼读跟规范示范，不读英文字母名称。`,
        `${row.letter} + ${review ? row.review : row.main}`,
      ),
    ]);
    const wordCards: [string, number][] =
      itemId === 'u2-3'
        ? [
            ['爸爸', 1],
            ['妈妈', 0],
          ]
        : [
            ['大小', 0],
            ['小马', 1],
            ['道路', 1],
            ['泥土', 1],
          ];
    [...audit.recognize].forEach((character, index) =>
      tasks.push(
        choose(
          `${id}-${review ? 'r' : 'q'}-char-${index}`,
          `cu-recognize-u${required(character.codePointAt(0)).toString(16)}`,
          review
            ? `看材料中的词，选择从左往右第${required(wordCards[index])[1] + 1}个字。`
            : `选出本课会认字${character}。`,
          [...audit.recognize],
          character,
          `认读${character}并联系词语，本课未增加这些汉字的会写要求。`,
          review ? required(wordCards[index])[0] : undefined,
        ),
      ),
    );
    if (itemId === 'u2-3') {
      tasks.push(
        choose(
          `${id}-${review ? 'r' : 'q'}-neutral`,
          `${id}-neutral`,
          review
            ? 'mā ma里第二个ma没有调号，这里怎样理解？'
            : 'bà ba里第二个ba没有调号，这里怎样理解？',
          ['这里读轻声', '这里必定是第一声'],
          '这里读轻声',
          '爸爸、妈妈的第二个音节通常读轻声；具体读音跟规范示范，不能把所有无调号写法都机械判为轻声。',
          review ? 'mā ma' : 'bà ba',
        ),
        choose(
          `${id}-${review ? 'r' : 'q'}-parts`,
          `${id}-parts`,
          review ? 'p与á组成pá，哪部分是韵母？' : 'b与ā组成bā，哪部分是韵母？',
          review ? ['p', 'á'] : ['b', 'ā'],
          review ? 'á' : 'ā',
          '前面的b或p是声母，后面的带调a是韵母。',
        ),
      );
    } else {
      tasks.push(
        choose(
          `${id}-${review ? 'r' : 'q'}-umlaut`,
          `${id}-umlaut`,
          review ? 'l与ǜ相拼应如何写？' : 'n与ǚ相拼应如何写？',
          review ? ['lǜ', 'lù', 'lu'] : ['nǚ', 'nǔ', 'nu'],
          review ? 'lǜ' : 'nǚ',
          'n/l与ü相拼保留两点和调号，不能把ü写成u；与后续j/q/x规则分开。',
        ),
        choose(
          `${id}-${review ? 'r' : 'q'}-rabbit`,
          `${id}-rabbit-reading`,
          review
            ? '对照第27页《小白兔》，文中尾巴是大还是小？'
            : '对照第27页《小白兔》，文中耳朵是长还是短？',
          review ? ['小', '大'] : ['长', '短'],
          review ? '小' : '长',
          '请亲子回看原文指定部位，不能把耳朵的描述套到尾巴。',
          '先请家长陪读教材第27页刘御的《小白兔》。网站不展示现代韵文全文。',
        ),
      );
    }
    return tasks;
  };
  const steps: LearningStep[] = [
    {
      title: '观察情境与声母',
      text:
        itemId === 'u2-3'
          ? '看教材第24页人物活动与景物，联系b p m f。听规范示范认读；b/p弯曲位置不同，m有两段拱形，f有短横。图画联想不能替代准确的声音。'
          : '看教材第26页人物表演与景物，联系d t n l。d弯曲部分在竖的左侧，t有短横，n有一段拱形，l没有这条短横。实际n/l读音与舌位跟教师规范示范，不自动判断。',
      visual: visual(rows.map((row) => row.letter)),
      activity: `对照第${audit.pages[0]}页原图，孩子说图与字母的联系，再跟读。`,
    },
    {
      title: '两部分相连拼读',
      text: '两拼先认声母，再认韵母，连起来拼读，声母轻短。看带调写法时不要丢掉调号；实际读音必须听规范示范，网页只能检查写法对应。',
      visual: visual(rows.map((row) => row.letter + row.main)),
      activity: '请家长按原书示范陪读两拼音节，再换一个韵母重新尝试。',
    },
    {
      title: itemId === 'u2-3' ? '爸爸、妈妈与轻声' : 'n/l与ü相拼',
      text:
        itemId === 'u2-3'
          ? '对照第25页，借助bà ba与mā ma认爸、妈，联系家人称呼。爸爸和妈妈的第二个音节通常读轻声；没有调号不自动表示第一声。每个人的家庭情况不同，可以只认字词，不要求介绍真实家庭。'
          : '第26页有n/l与ü相拼的例子。写nǚ、lǜ要保留ü的两点和调号，不能混成nǔ、lù。两点属于韵母ü，后续别的声母拼写规则另学。',
      visual: visual(
        itemId === 'u2-3' ? ['bà', 'ba', 'mā', 'ma'] : ['nǚ', 'lǜ', 'nǔ', 'lù'],
      ),
    },
    {
      title: itemId === 'u2-3' ? '读词与认字' : '读词与小白兔',
      text:
        itemId === 'u2-3'
          ? '认爸、妈，跟家长指读爸爸、妈妈。可以重新示范；认字与准确发音分开，本课不新增这两个字的会写要求。'
          : '对照第27页读大地、马路、泥土，认大、马、路、土。再请家长读《小白兔》，孩子跟读或接读，找耳朵、尾巴的描述。其他还没学的拼音可由家长读，不把全文字词全列为本课新增会认。',
      activity: '实际亲子读词；需要时分次进行，d t n l课另有原书韵文陪读任务。',
    },
    {
      title: '对照四线格示范写声母',
      text: `对照教材第${itemId === 'u2-3' ? 25 : 26}页底部逐笔示范，用四线格纸练习${audit.title}。比较起笔、笔顺和占格；普通屏幕字体不是描红或标准笔顺图。本课会认汉字${audit.recognize}没有新增会写要求。`,
      activity: '家长看实际纸面，缺少规范示范时可稍后完成。',
    },
  ];
  return {
    id,
    textbookTitle: audit.title,
    title: audit.title,
    page: required(audit.pages[0]),
    version: 2,
    status: 'available',
    goal: `认声母、观察两拼音节，认${audit.recognize}，完成实际拼读和声母书写；课堂情境与读词分开练。`,
    prerequisite: '先认识六个单韵母及四声，家长陪读并准备教材或教师规范示范。',
    parentTip:
      '辨形与拼写只检查视觉对应；实际声音、舌位、送气和纸笔由家长或教师确认。原书图画、现代韵文和标准音频不在本站复制。',
    steps,
    questions: [
      ...objective(false),
      manual(
        `${id}-manual-picture`,
        `${id}-picture`,
        `对照第${audit.pages[0]}页情境认读本组声母，请家长规范示范；实际跟读后再确认。`,
        audit.title,
      ),
      manual(
        `${id}-manual-blend`,
        `${id}-oral`,
        '对照原书两拼示范，逐组跟读本组声母与单韵母组成的带调音节，不以选择题结果确认拼读掌握。',
        rows.map((row) => row.letter + row.main).join('　'),
      ),
      manual(
        `${id}-manual-words`,
        `${id}-words`,
        itemId === 'u2-3'
          ? '亲子指读爸、妈及爸爸、妈妈，跟规范示范体会第二个音节的轻声。无需提供真实家庭资料。'
          : '亲子指读大、马、路、土及大地、马路、泥土，再共读第27页《小白兔》，说一处原文描述。',
      ),
      manual(
        `${id}-manual-write`,
        `${id}-writing`,
        `按教材第${itemId === 'u2-3' ? 25 : 26}页规范示范，在四线格纸练习${audit.title}。请家长查看实际笔顺与占格，不增加汉字会写任务。`,
      ),
      reflection(id),
    ],
    reviewQuestions: objective(true),
    review: {
      date: audit.checkedAt,
      reviewer: '原书拼音、识字与读词范围核验',
      notes: auditNotes(itemId),
    },
  };
}
export const unitTwoChineseLessons: Record<string, Lesson> = {
  'u2-1': vowelCourse('u2-1'),
  'u2-2': vowelCourse('u2-2'),
  'u2-3': initialCourse('u2-3'),
  'u2-4': initialCourse('u2-4'),
};

const gardenId = 'cu-u2-5';
const picturePoem =
  '画\n远看山有色，\n近听水无声。\n春去花还在，\n人来鸟不惊。';
function gardenTwoTasks(review: boolean): Question[] {
  const id = `${gardenId}-${review ? 'r' : 'q'}`;
  const labels = ['本', '学', '校', '班', '级', '姓', '名', '王'];
  const wordCards = [
    ['本子', 0],
    ['学校', 0],
    ['学校', 1],
    ['班级', 0],
    ['班级', 1],
    ['姓名', 0],
    ['姓名', 1],
    ['王老师', 0],
  ] as const;
  const tasks: Question[] = labels.map((character, index) =>
    choose(
      `${id}-char-${index}`,
      `cu-recognize-u${required(character.codePointAt(0)).toString(16)}`,
      review
        ? `看材料中的词，选择从左往右第${required(wordCards[index])[1] + 1}个字。`
        : `在本课会认字中选出${character}。`,
      labels,
      character,
      `认读${character}，联系本、学校、班级、姓名和王这些教材用字词。`,
      review ? required(wordCards[index])[0] : undefined,
    ),
  );
  const card = review
    ? '原创虚构学习本封面：\n学校：星光小学\n班级：一年级（3）班\n姓名：小安'
    : '原创虚构学习本封面：\n学校：青禾小学\n班级：一年级（2）班\n姓名：小禾';
  const fields = review
    ? ['星光小学', '一年级（3）班', '小安']
    : ['青禾小学', '一年级（2）班', '小禾'];
  ['学校', '班级', '姓名'].forEach((field, index) =>
    tasks.push(
      choose(
        `${id}-field-${index}`,
        `${gardenId}-field-${index}`,
        `按这张虚构封面，哪一项是${field}？`,
        fields,
        required(fields[index]),
        `看清${field}这个标签，再找对应内容。示例不是任何真实学员资料，不要求输入自己的学校或姓名。`,
        card,
      ),
    ),
  );
  for (const [index, vowel] of ['a', 'o', 'i', 'u'].entries()) {
    const wanted = review ? (index + 2) % 4 : index;
    tasks.push(
      choose(
        `${id}-tone-${index}`,
        `${gardenId}-tone-${index}`,
        `本题找${vowel}的第${wanted + 1}声写法。`,
        required(toneRows[vowel]),
        required(required(toneRows[vowel])[wanted]),
        '先看韵母和指定声调，读音跟规范示范；调号不同，不能沿用旧题答案。',
      ),
    );
  }
  const rows: [
    string,
    string,
    string,
    string[],
    string,
    string,
    string,
    string?,
  ][] = [
    [
      'compare-bd',
      '看b和d，哪个字母弯曲部分在竖的右侧？',
      '看b和d，哪个字母弯曲部分在竖的左侧？',
      ['b', 'd'],
      'b',
      'd',
      'b弯曲部分在右，d在左；规范笔顺与占格仍对照原书。',
    ],
    [
      'compare-ft',
      '本题字卡写f，选择相同字母。',
      '本题字卡写t，选择相同字母。',
      ['f', 't'],
      'f',
      't',
      'f与t不同，先看字形，再跟规范示范认读。',
    ],
    [
      'vowel-a',
      '按提示：他tā、八bā、马mǎ，后面的单韵母是哪一个？',
      '按提示：妈mā、爸bà、大dà，后面的单韵母是哪一个？',
      ['a', 'i', 'u'],
      'a',
      'a',
      '这些音节的韵母是a；汉字与具体语境读音要对应。',
    ],
    [
      'vowel-i',
      '按提示：七qī、地dì、你nǐ，后面的韵母是哪一个？',
      '换一组音节：米mǐ、笔bǐ、梨lí，后面的单韵母是哪一个？',
      ['a', 'i', 'u'],
      'i',
      'i',
      review
        ? '米mǐ、笔bǐ、梨lí的韵母都对应i。新词只作原创拼写材料，家长可帮读，不增加本课汉字认写范围。'
        : '这里韵母是i；地在这里读dì，不把其它语境读音混入。',
    ],
    [
      'vowel-u',
      '按提示：目mù、土tǔ、足zú，后面的韵母是哪一个？',
      '换一组音节：图tú、壶hú、苦kǔ，后面的单韵母是哪一个？',
      ['a', 'i', 'u'],
      'u',
      'u',
      review
        ? '图tú、壶hú、苦kǔ的韵母都对应u。新词只作原创拼写材料，未学声母请家长帮读，不增加汉字认写范围。'
        : '这里韵母是u。尚未学过的声母由家长陪读，不假设孩子已经掌握。',
    ],
    [
      'poem-water',
      '《画》中近听水有没有声音？',
      '《画》中人来了，鸟有没有受到惊吓？',
      ['没有', '有'],
      '没有',
      '没有',
      '依据诗中的无声、不惊；这里描述画中景物，不推断所有真实河水或鸟都这样。',
      picturePoem,
    ],
    [
      'poem-flower',
      '《画》中春天过去后，什么还在？',
      '《画》中远看什么有颜色？',
      review ? ['山', '水', '鸟'] : ['花', '水声', '人'],
      '花',
      '山',
      '按本题诗句找到指定事物，再联系画中的景物理解。',
      picturePoem,
    ],
    [
      'poem-scene',
      '诗里水无声、花还在、鸟不惊，这些线索联系的是什么？',
      '这首诗的标题是什么？',
      review
        ? ['画', '咏鹅', '小白兔']
        : ['一幅画', '必须是眼前真实变化的景物'],
      '一幅画',
      '画',
      '诗中借画面景物写画的特点；作品观察与真实自然不同。',
      picturePoem,
    ],
    [
      'rabbit-seed',
      '共读教材第30—31页：小白兔向老山羊要了什么？',
      '共读第30—31页：小灰兔最初收下了什么？',
      ['菜子', '一车白菜', '胡萝卜'],
      '菜子',
      '一车白菜',
      '回看原文指定角色，不把两只兔的选择互换。',
      '请先亲子共读教材第30—31页《小白兔和小灰兔》，本站不展示故事全文。',
    ],
    [
      'rabbit-work',
      '共读第30—31页：谁种菜并照料白菜？',
      '共读第30—31页：谁把老山羊送的白菜吃完后又去要？',
      ['小白兔', '小灰兔', '两只都一样'],
      '小白兔',
      '小灰兔',
      '原文描写两只兔不同的行动与结果。描述故事行为，不用它评判真实人物身体能力或经济条件。',
      '请回看教材第30—31页人物行动。',
    ],
    [
      'rabbit-gift',
      '共读第31页：小白兔后来给老山羊送了什么？',
      '共读第31页：小白兔后来送出的白菜从哪里来？',
      review
        ? ['自己种的', '商店买的', '再次向老山羊要的']
        : ['一担白菜', '一盒铅笔', '一条鱼'],
      '一担白菜',
      '自己种的',
      '原文交代种菜、照料与送菜；不要补造没有写出的情节。',
      '请亲子回看教材第31页结尾。',
    ],
  ];
  for (const [
    skill,
    main,
    retry,
    choices,
    value,
    again,
    explanation,
    material,
  ] of rows)
    tasks.push(
      choose(
        `${id}-${skill}`,
        `${gardenId}-${skill}`,
        review ? retry : main,
        choices,
        review ? again : value,
        explanation,
        material,
      ),
    );
  tasks.push(
    choose(
      `${id}-erhua`,
      `${gardenId}-erhua`,
      review
        ? '换看写法：按第31页脚注，哪儿的儿化拼音怎样写？'
        : '按第31页脚注，哪儿里的儿怎样读？',
      review
        ? ['nǎr', 'nǎ ér', 'nǎ r独立读一个音节']
        : [
            '不单独发音，跟前面的音节连成儿化音',
            '单独读一个ér音节',
            '每个儿字都不发音',
          ],
      review ? 'nǎr' : '不单独发音，跟前面的音节连成儿化音',
      '这里只按哪儿这个词观察儿化：拼音在前面音节后加r，r不另作一个音节。其它词里的儿要按具体语境认读，不能一概省读。选择写法不证明实际发音正确。',
      '先与家长看原书第31页脚注及故事里的哪儿。原书说明儿化词中的儿不单独发音，在前面音节后加r，表示卷舌动作；实际读音对照教师规范示范。',
    ),
  );
  return tasks;
}
export const gardenTwoLesson: Lesson = {
  id: gardenId,
  title: '语文园地二',
  textbookTitle: '语文园地二',
  page: 28,
  version: 4,
  status: 'available',
  goal: '读学习用品信息、认八字写九王；比较声调和形近声母，联系汉字与韵母，读古诗与亲子故事。',
  prerequisite:
    '准备教材第28—31页和田字格纸，家长陪读；尚未学的拼音与文字由家长帮助。',
  parentTip:
    '虚构封面用于找信息，不要求填写真实学校、班级或姓名。字卡不替代笔顺示范；实际朗读、写字与故事交流单独记录。',
  steps: [
    {
      title: '学习本上的信息',
      text: '对照第28页学习用品封面，认识本、学校、班级、姓名和王。学校、班级、姓名是不同标签，先看标签再找内容。本课网页示例全部虚构，不要输入孩子真实资料。',
      visual: {
        kind: 'characters',
        characters: ['本', '学', '校', '班', '级', '姓', '名', '王'],
        grid: 'tian',
      },
      activity: '家长在纸上写一张虚构封面，孩子分别找到三个信息；不拍照上传。',
    },
    {
      title: '写九和王',
      text: '本园地新增会写九、王。对照第28页逐笔示范，在田字格纸描写后临写；看清笔顺与位置，不把九与无新增会写的其它字混在一起要求抄写。',
      visual: { kind: 'characters', characters: ['九', '王'], grid: 'tian' },
      activity: '家长看真实纸面，缺少规范示范可稍后完成。',
    },
    {
      title: '比较不同声调',
      text: '第28页比较带不同调号的音节。先看同一音节上方调号变在哪里，再参考规范示范跟读。一声平、二声升、三声折转、四声降是辅助观察，文字不能替代声音。',
      visual: visual(['dǎ', 'dà', 'mō', 'mǒ', 'bí', 'bǐ', 'pǔ', 'pù']),
      activity: '请家长逐对示范，孩子跟读；网站只检查写法，不自动听辨。',
    },
    {
      title: '比较声母与读词',
      text: '第29页比较b/d、f/t，再联系词语。b与d弯曲部分左右不同，f与t也不是同一个字母。请家长陪读原书词语，观察对应声母；普通字体不同不改变声母身份。',
      visual: visual(['b', 'd', 'f', 't']),
      activity: '对照原书读词，再任选一组解释看见的不同。',
    },
    {
      title: '从汉字读音找韵母',
      text: '原书把已认汉字与a、i、u联系。他tā、八bā、马mǎ联系a；七qī、地dì、你nǐ联系i；目mù、土tǔ、足zú联系u。这里只辨后面的韵母，家长帮助读尚未学的声母；地用本次dì语境，不泛化所有读音。',
      activity:
        '亲子完成第29页连线，再说一个已认识的字与韵母的联系；不新增会写要求。',
    },
    {
      title: '古诗《画》',
      text: `${picturePoem}\n先听示范，再跟读。观察诗中山、水、花、鸟的特点，联系画中的景物，不把“水无声”等描述推广为所有真实景物。教材此处未署作者，不补造作者归属。`,
      activity:
        '结合原书第29页画面朗读，尝试背诵；背诵作为本站积累活动，人工确认。',
    },
    {
      title: '和大人一起读兔子故事',
      text: '请亲子共读第30—31页《小白兔和小灰兔》。分别找两只兔最初要或收下什么、后来做什么、最后怎样；不把人物行动混起来。现代故事原文和插图请使用原书，本站不展示全文。',
      activity:
        '家长分段读，孩子指角色，再用自己的话说一段；不假设孩子独立读懂全部拼音。',
    },
    {
      title: '哪儿里的儿化音',
      text: '原书第31页脚注提示儿化词的读法。故事里的哪儿写作nǎr，儿不单独读成一个ér音节，而是跟前面音节连起来，拼音在前面音节后加r，表示卷舌动作。这里只观察哪儿这个词；不能把所有带儿的词都一概省读。文字和选择题不代替规范声音示范。',
      activity:
        '请家长或教师先规范示范哪儿，再让孩子按自己的情况尝试；可以慢读或稍后再练，不要求录音上传。',
    },
    {
      title: '说行动与结果',
      text: '把故事里的选择、照料、收获和送菜联系起来，说说自己发现了什么。可以有不同表达，依据故事具体行动讨论，不用寓言评判真实人物的能力或家庭条件。',
      activity: '孩子说完，家长回应；再记录还想练的字、音节或阅读活动。',
    },
  ],
  questions: [
    ...gardenTwoTasks(false),
    manual(
      `${gardenId}-manual-info`,
      `${gardenId}-info`,
      '在一张虚构纸面学习本封面上找到学校、班级、姓名标签，认读本学校班级姓名王；不记录真实儿童资料。',
    ),
    manual(
      `${gardenId}-manual-write`,
      `${gardenId}-writing`,
      '对照教材第28页逐笔示范，纸面描写后临写九、王，请家长查看笔顺与位置；没有示范可跳过。',
      '会写范围：九、王。',
    ),
    manual(
      `${gardenId}-manual-tone`,
      `${gardenId}-oral`,
      '对照教材第28—29页，请家长规范示范不同声调和b/d、f/t词语，孩子逐对跟读；不自动评价读音。',
    ),
    manual(
      `${gardenId}-manual-vowels`,
      `${gardenId}-connect`,
      '亲子完成第29页汉字与a/i/u的连线，再说一组字的韵母，未学声母请家长帮助。',
    ),
    manual(
      `${gardenId}-manual-poem`,
      `${gardenId}-poem`,
      '亲子朗读《画》，联系原书画面说一处诗句描写，再尝试背诵。家长记录实际完成，不自动评分。',
      picturePoem,
    ),
    manual(
      `${gardenId}-manual-story`,
      `${gardenId}-shared-reading`,
      '亲子实际读第30—31页《小白兔和小灰兔》，孩子分别说一处两只兔的行动，家长听完再回应；网页选择题不替代共读。',
    ),
    manual(
      `${gardenId}-manual-erhua`,
      `${gardenId}-erhua-oral`,
      '实际对照第31页脚注，请家长或教师规范示范故事中的哪儿，孩子尝试儿化跟读后再确认。没有示范或尚未尝试可以跳过；网页不自动评价卷舌动作或发音。',
    ),
    {
      id: `${gardenId}-story-note`,
      knowledge: `${gardenId}-story-note`,
      prompt:
        '用自己的话说说两只兔的行动与结果，你想问故事里的角色什么？家长可代写，不要求固定结论。',
      rule: { kind: 'reflection' },
      hint: '回看原文找依据，写一个具体行动或问题。',
      explanation: '保存开放表达，不自动评分或评价真实人物。',
    },
    reflection(gardenId),
  ],
  reviewQuestions: gardenTwoTasks(true),
  review: {
    date: '2026-10-04',
    reviewer: '原书园地四页栏目与第31页儿化脚注复核',
    notes: `${auditNotes('u2-5')} 2026-10-04重新查看此前正常公开预览保存的第31页，补哪儿儿化脚注说明、原创辨写题与实际跟读记录；未新增声音资源或改变其它词的读音。`,
  },
};
unitTwoChineseLessons['u2-5'] = gardenTwoLesson;
