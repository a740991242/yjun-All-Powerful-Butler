import type { LearningStep, Lesson, Question } from '../learning/types';

import { required } from '../learning/required';

/** Original teaching organized from visually inspected printed pages, not the mirror index. */
export const firstUnitPageAudits = [
  {
    itemId: 'u1-2',
    title: '金木水火土',
    pages: [9, 10],
    recognize: '一二三四五上下',
    write: '一二三上',
    activities: ['朗读与背诵', '普通话朗读', '田字格与笔画位置'],
  },
  {
    itemId: 'u1-3',
    title: '口耳目手足',
    pages: [11, 12],
    recognize: '口耳目手足站坐',
    write: '口耳目手',
    activities: ['身体部位与用途', '站坐行卧的姿态', '对照示范写字'],
  },
  {
    itemId: 'u1-4',
    title: '日月山川',
    pages: [13, 14],
    recognize: '日月山川水火田禾',
    write: '日火田禾',
    activities: [
      '事物与字形联系',
      '图画与象形字观察',
      '猜字连线',
      '对照示范写字',
    ],
  },
].map((entry) => ({
  ...entry,
  sourceUrl: 'https://keben.app/book/0025',
  sourceProvider: '第三方原书公开预览',
  checkedAt: '2026-10-01',
  editionDate: null,
  printingDate: null,
  isbn: null,
  coverage: 'inspected-lesson-pages' as const,
}));

type Row = [string, string, string];
const recognitionRows: Record<string, Row[]> = {
  'u1-2': [
    [
      '一',
      '只有一个苹果。“一个”的第一个字是？',
      '一只小鸟停在树枝上。“一只”的第一个字是？',
    ],
    [
      '二',
      '两块积木，用汉字表示数量二。选这个字。',
      '两本书的数量用哪个汉字表示？',
    ],
    [
      '三',
      '三个孩子一起看书。“三个”的第一个字是？',
      '桌上三支笔。“三支”的第一个字是？',
    ],
    [
      '四',
      '四朵花开放了。“四朵”的第一个字是？',
      '四把椅子排成一行。“四把”的第一个字是？',
    ],
    [
      '五',
      '五片叶子落下来。“五片”的第一个字是？',
      '五颗棋子放在盒里。“五颗”的第一个字是？',
    ],
    [
      '上',
      '书放在桌子上面。“上面”的第一个字是？',
      '架子的上层放着书。“上层”的第一个字是？',
    ],
    [
      '下',
      '小猫藏在桌子下面。“下面”的第一个字是？',
      '架子的下层放着盒子。“下层”的第一个字是？',
    ],
  ],
  'u1-3': [
    [
      '口',
      '用嘴说话，“口”可以表示嘴。选择这个字。',
      '张开口吃饭。“口”是哪个字？',
    ],
    [
      '耳',
      '耳朵听到音乐。“耳朵”的第一个字是？',
      '我们保护耳朵。“耳朵”的第一个字是？',
    ],
    ['目', '目可以表示眼睛。选出这个字。', '“双目”说的是两只眼睛。选出目。'],
    [
      '手',
      '小林伸手拿起画笔。“伸手”的第二个字是？',
      '洗手后再吃东西。“洗手”的第二个字是？',
    ],
    ['足', '足可以表示脚。选出这个字。', '踢足球用到脚。选出表示脚的足。'],
    [
      '站',
      '小林站起来问好。“站起来”的第一个字是？',
      '排队时站在自己的位置。“站”是哪个字？',
    ],
    [
      '坐',
      '小林坐在椅子上。“坐在”的第一个字是？',
      '坐下看书。“坐下”的第一个字是？',
    ],
  ],
  'u1-4': [
    [
      '日',
      '日可以表示太阳。选出这个字。',
      '“日出”指太阳升起。“日出”的第一个字是？',
    ],
    [
      '月',
      '月亮挂在夜空。“月亮”的第一个字是？',
      '今晚看见弯弯的月亮。选出月。',
    ],
    [
      '山',
      '远处有高高的山。选出表示山的字。',
      '山脚下有村庄。“山脚”的第一个字是？',
    ],
    ['川', '川可以表示河流。选出这个字。', '“山川”中的川指河流。选出川。'],
    ['水', '杯子里装着水。选出表示水的字。', '小溪里的水流向远方。选出水。'],
    [
      '火',
      '火能发出光和热。选出表示火的字。',
      '看到火焰要远离，不玩火。选出火。',
    ],
    [
      '田',
      '农民在田里种庄稼。选出表示田的字。',
      '田地里长着庄稼。“田地”的第一个字是？',
    ],
    ['禾', '禾可以表示谷类植物。选出禾。', '“禾苗”的第一个字是？'],
  ],
};
function choice(
  id: string,
  skill: string,
  prompt: string,
  labels: string[],
  value: string,
  explanation: string,
): Question {
  return {
    id,
    knowledge: skill,
    prompt,
    choices: labels.map((label) => ({ id: label, label })),
    rule: { kind: 'choice', value },
    hint: '请家长读题，联系字形和意思再判断。',
    explanation,
  };
}
function objective(itemId: string, review: boolean): Question[] {
  const id = `cu-${itemId}`;
  const rows = required(recognitionRows[itemId]);
  const tasks = rows.map(([character, main, retry], index) =>
    choice(
      `${id}-${review ? 'r' : 'q'}-char-${index}`,
      `cu-recognize-u${required(character.codePointAt(0)).toString(16)}`,
      review ? retry : main,
      rows.map((row) => row[0]),
      character,
      `这里选择“${character}”。请在生活语境中再认读一次。`,
    ),
  );
  const extras: Record<
    string,
    [string, string, string, string[], string, string][]
  > = {
    'u1-2': [
      [
        'position',
        '杯子放在书的上面。书在杯子的哪里？',
        '积木放在盒子的下面。盒子在积木的哪里？',
        ['上面', '下面'],
        review ? '上面' : '下面',
        '判断上下要先找题目指定的参照物。',
      ],
      [
        'horizontal',
        '田字格中，从左到右通过格子中间的线叫什么？',
        '横中线在田字格中沿哪个方向通过中间？',
        review ? ['左右方向', '上下方向'] : ['横中线', '竖中线'],
        review ? '左右方向' : '横中线',
        '横中线从左到右通过格子中间。',
      ],
      [
        'vertical',
        '田字格中，从上到下通过格子中间的线叫什么？',
        '竖中线在田字格中沿哪个方向通过中间？',
        review ? ['左右方向', '上下方向'] : ['横中线', '竖中线'],
        review ? '上下方向' : '竖中线',
        '竖中线从上到下通过格子中间。',
      ],
      [
        'stroke',
        '一、二、三共同用到哪种笔画？',
        '写二和三时，哪种笔画会重复出现？',
        ['横', '点', '撇'],
        '横',
        '一、二、三由横组成；位置和长短请对照教材写字示范。',
      ],
    ],
    'u1-3': [
      [
        'listen',
        '听家长讲故事，通常主要用哪个部位？',
        '听到有人叫自己，通常主要用哪个部位？',
        ['耳', '手', '足'],
        '耳',
        '耳用于听。每个人的身体情况可能不同，不据此判断能力。',
      ],
      [
        'look',
        '看图画，通常主要用哪个部位？',
        '观察花的颜色，通常主要用哪个部位？',
        ['目', '足', '耳'],
        '目',
        '目表示眼睛；眼睛用于看。',
      ],
      [
        'hold',
        '拿起铅笔，通常主要用哪个部位？',
        '把书翻到下一页，通常主要用哪个部位？',
        ['手', '耳', '目'],
        '手',
        '手可以拿东西和翻书，身体各部位也会共同配合。',
      ],
      [
        'posture',
        '坐在椅子上和站起来是同一种姿态吗？',
        '站着排队与坐着看书是同一种姿态吗？',
        ['是', '不是'],
        '不是',
        '站和坐是不同姿态；观察教材人物，再用自己的话说说。',
      ],
    ],
    'u1-4': [
      [
        'sun-moon',
        '白天常见的太阳，对应哪个字？',
        '表示太阳的日与表示月亮的月，哪一个表示太阳？',
        ['日', '月'],
        '日',
        '日可表示太阳，月可表示月亮。',
      ],
      [
        'field',
        '田与日都有外框。哪个字里面有横竖相交的笔画？',
        '日和田相比，哪个字的里面分成四个小区域？',
        ['田', '日'],
        '田',
        '田里面有横竖相交的笔画。不要只看外框认字。',
      ],
      [
        'picture',
        '看象形字时，怎样联系字与事物？',
        '古字与现在的字不完全一样，怎样观察更合适？',
        ['观察形状并联系事物', '只看字的颜色'],
        '观察形状并联系事物',
        '字形和事物之间有联系；颜色不是判断字义的依据。',
      ],
    ],
  };
  for (const [skill, main, retry, labels, value, explanation] of required(
    extras[itemId],
  ))
    tasks.push(
      choice(
        `${id}-${review ? 'r' : 'q'}-${skill}`,
        `${id}-${skill}`,
        review ? retry : main,
        labels,
        value,
        explanation,
      ),
    );
  return tasks;
}
const teaching: Record<string, LearningStep[]> = {
  'u1-2': [
    {
      title: '读歌谣，找熟悉的字',
      text: '请打开教材第9页。家长先用普通话示范歌谣，孩子听一遍，再逐句跟读。找一找表示数量、上下和日月的字。歌谣里的金、木等字不因此全部加入本课会认会写范围。',
      activity: '观察原书国画，说一说看见了什么；本站不复制原画。',
    },
    {
      title: '数量与上下',
      text: '认一至五，可以边指字边数安全的小物品。上与下要找参照物：书在桌上，小盒在桌下。请家长指认并示范读音，孩子再说自己的例子。',
    },
    {
      title: '认识田字格',
      text: '田字格用横中线和竖中线帮助观察笔画位置：横中线左右通过中间，竖中线上下通过中间，两线相交在中心。下面的字体只供认字，写字要对照教材示范。',
      visual: {
        kind: 'characters',
        characters: ['一', '二', '三', '上'],
        grid: 'tian',
      },
      activity: '在纸上画一个田字格，分别指出两条中线与中心。',
    },
    {
      title: '按示范写字',
      text: '本课写一、二、三、上。一二三用到横；上按竖、短横、长横的顺序写。请观察原书第10页笔画位置与长短，先描再临写，保持舒适坐姿和握笔，不以网页字体替代规范笔顺示范。',
    },
    {
      title: '朗读与背诵',
      text: '回到教材歌谣，用普通话逐句朗读，再尝试背诵。暂时不会时可以听示范再读；家长记录实际完成情况，系统不自动评价发音、背诵或写字。',
    },
  ],
  'u1-3': [
    {
      title: '观察身体部位',
      text: '打开教材第11页，观察人物活动。认口、耳、目、手、足，联系嘴、耳朵、眼睛、手和脚。可以指字，不必触碰脸或做不舒服的动作。',
    },
    {
      title: '说说能做的事',
      text: '口可以说话和吃东西，耳用于听，目表示眼睛，手可以拿东西，足可以表示脚。讲一件自己或家人做过的事，注意身体各部位会配合；不要用例子判断每个人的身体能力。',
    },
    {
      title: '站与坐',
      text: '认站、坐。请对照教材第12页的姿态短句，由家长示范朗读，再观察人物站坐的样子。联系站、坐、走和躺，体会姿态描写；不要求孩子模仿不适合的动作。',
      activity: '用自己的话描述站和坐的不同，再朗读原书短句。',
    },
    {
      title: '写口、耳、目、手',
      text: '对照教材第12页的逐笔示范，观察笔顺与田字格位置。口与目外框相似，里面不同；不要把足、站、坐增加为本课会写字。下面是认字字体，不是笔顺动画。',
      visual: {
        kind: 'characters',
        characters: ['口', '耳', '目', '手'],
        grid: 'tian',
      },
    },
    {
      title: '认读与交流',
      text: '打乱七个会认字，逐个指读。再对家长说口、耳、目、手、足能做哪些事。家长听完后补充或再次示范，实际交流与写字分别记录。',
    },
  ],
  'u1-4': [
    {
      title: '从事物到汉字',
      text: '打开教材第13页，逐组观察事物图画、古字形与今天的字，联系日、月、山、川、水、火、田、禾。先说看到了什么，再由家长示范读字。本站不复制教材插图或古字形。',
    },
    {
      title: '联系生活认字',
      text: '日与月联系太阳和月亮，川可以表示河流，禾可以表示谷类植物。想一想哪里见过山、水和田。观察火焰只能用安全的图片，不点火或玩火。',
      visual: {
        kind: 'characters',
        characters: ['日', '月', '山', '川', '水', '火', '田', '禾'],
        grid: 'tian',
      },
    },
    {
      title: '比较相近字形',
      text: '日和田都有外框，但里面不同；田有横竖相交的笔画，日里面有横。看清内部笔画再指认，不以字体颜色或外框大小判断。',
    },
    {
      title: '猜字与连线',
      text: '对照第14页的图画和古字形，观察羊、鸟、兔、树木、网与竹，再尝试找到对应字并连线。教材已有一个示例，可先解释它。兔、鸟、竹、羊、木、网是本活动材料，不新增为本课正式会认会写清单。',
      activity: '孩子先猜再说依据，家长陪同对照原图核对，允许重新观察。',
    },
    {
      title: '写日、火、田、禾',
      text: '对照第14页逐笔示范，观察各笔画在田字格的位置，描写后临写。请家长查看真实纸面，不根据选择题正确率判断写字已掌握。',
      visual: {
        kind: 'characters',
        characters: ['日', '火', '田', '禾'],
        grid: 'tian',
      },
    },
  ],
};
export const firstUnitChineseLessons: Record<string, Lesson> =
  Object.fromEntries(
    firstUnitPageAudits.map((audit) => {
      const id = `cu-${audit.itemId}`;
      const manual = (suffix: string, prompt: string): Question => ({
        id: `${id}-manual-${suffix}`,
        knowledge: `${id}-${suffix}`,
        prompt,
        rule: { kind: 'manual' },
        hint: '请家长陪同对照原书与实际活动；材料未准备好可以跳过，稍后再做。',
        explanation:
          '由孩子或家长确认实际完成，不自动判对，不计入客观题正确率。',
      });
      const oral = (() => {
        if (audit.itemId === 'u1-2')
          return '请家长示范教材第9页歌谣，孩子用普通话朗读，再尝试背诵。朗读与背诵都实际完成后再确认；尚未完成可以跳过。';
        return audit.itemId === 'u1-3'
          ? '请家长示范教材第12页姿态短句，孩子跟读；再说口、耳、目、手、足能做哪些事。实际朗读与表达完成后再确认。'
          : '对照教材第13页事物图与古字形，认读八字，任选两组说说字形与事物的联系。';
      })();
      const activity = (() => {
        if (audit.itemId === 'u1-2')
          return '在纸上画田字格，指出横中线、竖中线和中心，再对照教材第10页说说上的笔画位置。';
        return audit.itemId === 'u1-3'
          ? '观察原书人物或安全的生活场景，用自己的话比较站和坐的姿态，不要求模仿不适合的动作。'
          : '对照教材第14页图画与古字形，完成猜字连线并说依据；活动中的六个字不加入本课会写要求。';
      })();
      return [
        audit.itemId,
        {
          id,
          title: audit.title,
          textbookTitle: audit.title,
          page: required(audit.pages[0]),
          version: 1,
          status: 'available',
          goal: `认读${audit.recognize}，在纸面按示范写${audit.write}，完成本课观察、朗读与交流。`,
          prerequisite:
            '请家长陪读，准备对应纸质或官方电子教材及田字格纸；不要求尚未学拼音的孩子独立拼读。',
          parentTip: `教材第${audit.pages.join('—')}页原图与文字请对照原书。网页提供原创讲解与问答，没有教材标准录音、笔顺动画或自动写字评分。`,
          steps: required(teaching[audit.itemId]),
          questions: [
            ...objective(audit.itemId, false),
            manual(
              'read',
              `请打乱顺序指读：${audit.recognize}。家长记录是否实际认读，可重新示范，不进行自动语音评分。`,
            ),
            manual('oral', oral),
            manual('activity', activity),
            {
              ...manual(
                'write',
                `对照教材第${audit.pages[1]}页笔顺示范，在田字格纸描写后临写${audit.write}。家长查看笔顺与位置；缺少示范或纸笔可以跳过，不用普通字体代替笔顺教学。`,
              ),
              material: [...audit.write].join('　'),
            },
            {
              id: `${id}-reflection`,
              knowledge: `${id}-reflection`,
              prompt: '今天哪个字或活动还想再练？用自己的话说，家长可以代写。',
              rule: { kind: 'reflection' },
              hint: '可以写具体的字或一次活动，不要求唯一答案。',
              explanation: '保留孩子的反思原话，不自动评分。',
            },
          ],
          reviewQuestions: objective(audit.itemId, true),
          review: {
            date: audit.checkedAt,
            reviewer: '原书公开预览逐页范围核验与原创课包校验',
            notes: `实际读取${audit.sourceProvider}（${audit.sourceUrl}）封面、出版编写信息、三页目录及印刷第${audit.pages.join('—')}页。人民教育出版社、教育部组织编写与新版目录一致；预览未提供ISBN、版权版次和印次，保留未知，不将第三方入口称为官方。认读${audit.recognize}、写字${audit.write}；活动范围：${audit.activities.join('、')}。课程讲解与问题原创，原图、全文和录音未复制；纸面和朗读需家长陪同。本次只开放这份课包，不证明全册完成，尚待教师最终人工审校。`,
          },
        } satisfies Lesson,
      ];
    }),
  );
