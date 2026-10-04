import type { Book, Lesson, Question } from '../learning/types';
import type { Textbook } from './textbooks';

import { bnuLowerAdditionTableLesson } from './bnu-lower-addition-table';
import { bnuLowerBlocksLesson } from './bnu-lower-blocks';
import { bnuLowerChoresLesson } from './bnu-lower-chores';
import { bnuLowerFarmLesson } from './bnu-lower-farm';
import { bnuLowerPlaceValueLesson } from './bnu-lower-place-value';
import { bnuLowerRabbitsLesson } from './bnu-lower-rabbits';
import {
  bnuLowerFindTracesLesson,
  bnuLowerShadowTheatreLesson,
  bnuLowerTracePrintLesson,
} from './bnu-lower-shapes';
import { bnuLowerUnitOneHarvestLesson } from './bnu-lower-unit-one-harvest';
import { bnuLowerUnitOnePracticeLesson } from './bnu-lower-unit-one-practice';

/** Public scanned pages were read; approval year is not a printing date. */
export const bnuLowerSource = {
  preview: 'https://keben.szxuexiao.com/html/10757.html',
  contentsPreview: 'https://keben.szxuexiao.com/html/10758.html',
  firstUnitPreview: 'https://keben.szxuexiao.com/html/10759.html',
  secondUnitPreview: 'https://keben.szxuexiao.com/html/10760.html',
  publisherPortal: 'https://jiaoshi.bnupg.com/',
  checkedAt: '2026-10-04',
  coverApprovalYear: 2024,
  isbn: null,
  printing: null,
  readPrintedPages: [
    2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
    23,
  ],
  contents: [
    ['u1', '20以内数与加法', 2],
    ['u2', '图形大变身（一）', 18],
    ['classroom', '设计教室装饰图', 24],
    ['u3', '20以内数与减法', 27],
    ['u4', '100以内数的认识', 44],
    ['games', '填数游戏', 60],
    ['u5', '100以内数加与减（一）', 62],
    ['u6', '有趣的平面图形（一）', 76],
    ['comic', '画数学连环画', 87],
    ['final', '总复习', 90],
  ] as const,
};

const id = 'bnu-lower-ancient-count-one';
function question(
  suffix: string,
  prompt: string,
  rule: Question['rule'],
  explanation: string,
): Question {
  return {
    id: `${id}-${suffix}`,
    knowledge: id,
    prompt,
    rule,
    hint: '先看每个标记约定代表几个，再把十和一分别数清；一捆内有10根。',
    explanation,
  };
}
function choice(
  suffix: string,
  prompt: string,
  value: string,
  labels: string[],
  explanation: string,
): Question {
  return {
    ...question(suffix, prompt, { kind: 'choice', value }, explanation),
    choices: labels.map((label) => ({ id: label, label })),
  };
}
function manual(suffix: string, prompt: string): Question {
  return question(
    suffix,
    prompt,
    { kind: 'manual' },
    '实际做过才确认；尚未做或只有计划请跳过。网页答对不能代替实物操作、纸面作图和交流。',
  );
}

export const bnuLowerAncientCountLesson: Lesson = {
  id,
  textbookTitle: '古人计数（一）',
  title: '逐一对应、十根成捆与十一到二十',
  page: 2,
  version: 2,
  status: 'available',
  goal: '用一个标记对应一个对象，实际把10个一组成1个十，读出十和一共同表示的11～20。',
  prerequisite: '能逐一数到10，认识数字0～10。',
  parentTip:
    '对应北师大版下册印刷第2～3页，课程标记和例子原创。大标记代表10、小标记代表1须先约定，不是所有大石头天然代表10。屏幕数位图不代替实际捆小棒；打结故事按教材的计数情境介绍，不把它当已独立考证的历史事实。',
  review: {
    date: '2026-10-05',
    reviewer: '公开扫描封面、目录与第2～3页逐项核对',
    notes:
      '核对一根对应一只、11根、10个一组成1个十、11/19/20、石头与圈记、三组圈十点数、三种材料计数、12/15作图和8再添3打结故事。第3页蔬果12/13/17与珠串14、单位方块18、小棒16放大逐项复核，课中明确计数范围；原图实际圈点仍独立人工，不把原创图当原插图；ISBN和印次未知。',
  },
  steps: [
    {
      title: '一件物品配一个标记',
      text: '本站例子：每张纸卡对应一根小棒，有几张卡就摆几根。一件不能摆两根，也不能漏摆。最后数小棒得到的数，才与所数卡片的数量对应。教材用羊和小棒作同样的计数活动。',
      activity: '实际选11张纸卡，每张配一根小棒，逐个对应再核对。',
    },
    {
      title: '十个一组成一个十',
      text: '数出10根，捆成一捆。捆里的10根没有消失，1捆代表1个十。将1捆拆开仍是10根；捆数与小棒根数的单位不同，不能把1捆误数成1根。',
      visual: { kind: 'place-value', value: 10 },
      activity: '实际点出10根捆好，再拆开重新点数，说明捆数和根数。',
    },
    {
      title: '一个十和一个一是十一',
      text: '十根的一捆旁放1根，共11根。读作十一。本站数位图十位标记每个代表10，个位标记每个代表1；图上的两种标记数量不是小棒总根数。',
      visual: { kind: 'place-value', value: 11 },
      activity: '实际表示11，先说有几个十、几个一，再读出总数。',
    },
    {
      title: '十九与二十分别看',
      text: '1个十和9个一合起来是19；再添1个一，10个散着的一也可组成1个十。这样共有2个十，是20，此时散着的一有0个。20不是2根，也不是20捆。',
      visual: { kind: 'place-value', value: 19 },
      activity: '实际摆19，再添1并整理为两捆，每捆10根；核对总数。',
    },
    {
      title: '先约定标记再数',
      text: '本站纸面记号约定：大圈代表10，小圈代表1。1个大圈和3个小圈表示13。改用大方框和小方框也要说明约定；只看到一大一小两块石头，没给约定，不能确定它们一定表示11。',
      activity: '自己说明约定，分别画出12和15，再逐一指给家人看。',
    },
    {
      title: '回到教材点数与作图',
      text: '第3页草莓圈内10个、外2个，共12；胡萝卜13个，圈10后余3；白菜17个，圈10后余7。三组各自计数，不混成一个总数。珠串圈成的一组10颗、外4颗，共14；蓝色两条中的单位方块分别10与8，共18，不是只数成2条；小棒1捆10根、外6根，共16，不是7根。这里每组都先说明单位和十的分组，再接着数。按原书约定分别画12和15，标记个数与表示的数不同。',
      activity: '对照合法教材逐组完成圈十、点数和作图，说明十与一的关系。',
    },
    {
      title: '不同材料也能计数',
      text: '教材故事用结作标记：已有8个标记，又添3个，每个对应一个对象，共11个。本站只用纸上8个点再添3个点模拟，不需要拿绳子接触动物；自己的计划和已经实际完成的活动分开记录。',
      activity: '用纸面标记模拟8再添3，逐个核对，说说标记代表的对象。',
    },
  ],
  questions: [
    question(
      'one-to-one',
      '本站有11张纸卡，每张对应1根小棒，一共应摆多少根？',
      { kind: 'number', value: 11 },
      '每张只对应1根，11张对应11根。',
    ),
    question(
      'bundle',
      '本站每捆10根小棒，1捆共有多少根？',
      { kind: 'number', value: 10 },
      '1捆是1个十，即10根。',
    ),
    question(
      'eleven',
      '本站1捆10根，另有1根散棒，共有多少根？',
      { kind: 'number', value: 11 },
      '10根与1根合起来为11根。',
    ),
    question(
      'nineteen',
      '本站1捆10根，另有9根散棒，共有多少根？',
      { kind: 'number', value: 19 },
      '1个十和9个一为19。',
    ),
    question(
      'twenty',
      '本站2捆小棒，每捆10根，没有散棒，共有多少根？',
      { kind: 'number', value: 20 },
      '2个十是20根，不是2根。',
    ),
    question(
      'zero-ones',
      '本站20根全部整理成2捆，每捆10根，捆外散棒有多少根？',
      { kind: 'number', value: 0 },
      '两捆正好用完20根，捆外有0根；0是明确的数量，不是没有填。',
    ),
    question(
      'symbol-twelve',
      '本站约定大方框代表10，小方框代表1。1个大方框和2个小方框表示多少？',
      { kind: 'number', value: 12 },
      '先按约定，大方框为10，再数2个一，共12。',
    ),
    question(
      'symbol-fifteen',
      '同样约定大方框代表10，小方框代表1。1个大方框和5个小方框表示多少？',
      { kind: 'number', value: 15 },
      '1个十和5个一为15，不能只数成6个标记。',
    ),
    choice(
      'unknown-symbol',
      '只知道有一大一小两块石头，没有约定每块代表多少，能确定一定表示11吗？',
      '不能，需要先给出约定',
      ['能，大石头一定代表10', '不能，需要先给出约定'],
      '大小本身不能确定计数意义；教材情境与本站练习先给约定。',
    ),
    choice(
      'bundle-unit',
      '1捆有10根，旁边还有1根散棒。若问小棒共有多少根，哪个回答正确？',
      '11根',
      ['2根', '11根', '11捆'],
      '捆和根不同，先把这一捆按10根计。',
    ),
    question(
      'story',
      '本站纸面模拟：8个点，再添3个点，每点代表1件，一共有多少件？',
      { kind: 'number', value: 11 },
      '接着点数9、10、11，11个点对应11件。',
    ),
    ...(
      [
        ['strawberries', '草莓', 2, 12],
        ['carrots', '胡萝卜', 3, 13],
        ['cabbages', '白菜', 7, 17],
        ['beads', '珠串中的珠子', 4, 14],
        ['blocks', '两条中的单位小方块', 8, 18],
        ['sticks', '小棒', 6, 16],
      ] as const
    ).flatMap(([key, label, rest, total]) => [
      question(
        `source-count-${key}`,
        `第3页${label}先数出一组10，组外还有${rest}，这一组图合计多少？按物品逐个计，不只数条或捆。`,
        { kind: 'number', value: total },
        `10和${rest}个一合计${total}；每组单独计数，不能混入别的材料。`,
      ),
      question(
        `source-parts-${key}`,
        `第3页${label}的计数过程，依次填：组成一个十的单个数量、十外余下的单个数量、这组总数量。`,
        { kind: 'steps', values: [10, rest, total] },
        `先取10个一作一组，组外${rest}个一，总共${total}；这里首空问单个数量10，不是组数1。`,
      ),
    ]),
    manual(
      'actual-correspond',
      '实际对照教材第2页羊群图，每只对应一根小棒，逐只核对并说出数量；做过再确认。',
    ),
    manual(
      'actual-bundle',
      '实际点出10根并捆成一捆，拆开重新数，说清1捆与10根；做过再确认。',
    ),
    manual('actual-eleven', '实际摆1捆10根与1根散棒，逐一核对11；做过再确认。'),
    manual(
      'actual-nineteen',
      '实际摆1捆10根与9根散棒，逐一核对19；做过再确认。',
    ),
    manual(
      'actual-twenty',
      '实际由19添1，整理成每捆10根的两捆，并核对20；做过再确认。',
    ),
    manual(
      'actual-symbol',
      '实际说明大圈代表10、小圈代表1的约定，用纸笔表示11并解释；做过再确认。',
    ),
    manual(
      'actual-three-groups',
      '实际对照第3页三组蔬果图，每组各圈出10个，再数剩余，分别说出三组总数；全部做过再确认。',
    ),
    manual(
      'actual-three-materials',
      '实际对照第3页珠子、方块条和小棒三图，分别点数并说清十与一；全部做过再确认。',
    ),
    manual(
      'actual-draw-twelve',
      '实际在纸上先说明大方框代表10、小方框代表1，画出12并核对；做过再确认。',
    ),
    manual(
      'actual-draw-fifteen',
      '按相同约定实际画出15并核对，与12的表示比较；做过再确认。',
    ),
    manual(
      'actual-story',
      '实际用纸上8个点再添3个点模拟教材计数故事，逐个核对并解释；做过再确认。',
    ),
    question(
      'reflection',
      '记录自己实际操作时怎样区分一捆和一根；还没做可如实写“未做”。',
      { kind: 'reflection' },
      '记录不自动判正确，也不代替实际任务确认。',
    ),
    question(
      'plan',
      '记录下一次准备怎样练习十与一，计划不能当作已经完成。',
      { kind: 'reflection' },
      '未来计划单独保存，不自动证明操作完成。',
    ),
  ],
  reviewQuestions: [
    question(
      'review-remainder',
      '换一个问法：14张纸卡先取10张圈成一组，组外剩几张？',
      { kind: 'number', value: 4 },
      '总14已含圈内10，组外4；这次求余下的部分，不是再求总数14。',
    ),
    question(
      'review-eighteen',
      '换一组：大圈代表10，小圈代表1；1个大圈与8个小圈表示多少？',
      { kind: 'number', value: 18 },
      '按本题约定，10和8合起来为18。',
    ),
    question(
      'review-zero',
      '换一组：恰有10根，全部捆成1捆，捆外散棒有多少根？',
      { kind: 'number', value: 0 },
      '已知全部用完，散棒为0根。',
    ),
    choice(
      'review-unit',
      '换一组：1捆有10根，旁边7根散棒，小棒共有多少根？',
      '17根',
      ['8根', '17根', '17捆'],
      '1捆按10根计，共17根。',
    ),
  ],
};

export const bnuLowerTextbook: Textbook = {
  id: 'bnu-math-p1-lower-2024',
  subject: 'math',
  volume: 'lower',
  edition: 'bnu-2024',
  resourceId: 'bnu-lower-public-scan-2024',
  source: bnuLowerSource.preview,
  verifiedAt: bnuLowerSource.checkedAt,
  units: bnuLowerSource.contents.map(([key, title, page]) => ({
    id: key,
    title,
    items: [
      {
        id: `${key}-1`,
        title,
        page,
        kind: ['classroom', 'comic', 'games'].includes(key)
          ? 'activity'
          : 'lesson',
      },
    ],
  })),
};

function pending(key: string, title: string, page: number): Lesson {
  return {
    id: `bnu-lower-${key}-pending`,
    textbookTitle: title,
    title,
    page,
    version: 1,
    status: 'preparing',
    goal: '目录已核对，尚未发布的正文课程继续制作。',
    prerequisite: '',
    parentTip: '独立下册内容，不用其他版本或上册改名替代。',
    steps: [],
    questions: [],
    review: {
      date: bnuLowerSource.checkedAt,
      reviewer: '两页原书目录核对',
      notes: '目录和页码事实不表示正文课程完成。',
    },
  };
}

const authoredLessons: Record<string, Lesson[]> = {
  u1: [
    bnuLowerAncientCountLesson,
    bnuLowerPlaceValueLesson,
    bnuLowerBlocksLesson,
    bnuLowerFarmLesson,
    bnuLowerChoresLesson,
    bnuLowerRabbitsLesson,
    bnuLowerAdditionTableLesson,
    bnuLowerUnitOneHarvestLesson,
    bnuLowerUnitOnePracticeLesson,
  ],
  u2: [
    bnuLowerTracePrintLesson,
    bnuLowerFindTracesLesson,
    bnuLowerShadowTheatreLesson,
  ],
};

export const bnuLowerBook: Book = {
  id: bnuLowerTextbook.id,
  subject: 'math',
  volume: 'lower',
  edition: 'bnu-2024',
  title: '一年级数学下册 · 北师大版（2024审核）',
  source: bnuLowerSource.preview,
  verifiedAt: bnuLowerSource.checkedAt,
  units: bnuLowerSource.contents.map(([key, title, page]) => ({
    id: key,
    title,
    page,
    lessons: authoredLessons[key] ?? [pending(key, title, page)],
  })),
};
