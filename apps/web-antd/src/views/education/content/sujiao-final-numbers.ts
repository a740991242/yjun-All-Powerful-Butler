import type { Lesson, Question } from '../learning/types';

import { sujiaoUpperSource as source } from './sujiao-upper-source';

const id = 'sj-upper-final-numbers';
function tasks(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const numbers = review ? [18, 2, 16, 10, 8] : [13, 5, 19, 0, 10];
  const choices = numbers.map((n) => ({ id: String(n), label: String(n) }));
  const value = review ? 14 : 17;
  const lower = review ? 11 : 12;
  const upper = review ? 16 : 17;
  return [
    {
      id: `${prefix}-category`,
      knowledge: `${id}-category`,
      prompt:
        '按“比10小”与“10和十几”分两类。选出下面所有属于“10和十几”的数，可以多选。',
      choices,
      rule: {
        kind: 'set',
        values: numbers.filter((n) => n >= 10).map(String),
      },
      hint: '10属于第二类，0属于比10小的一类；十几有一个十和几个一。',
      explanation: `${numbers
        .filter((n) => n >= 10)
        .toSorted((a, b) => a - b)
        .join(
          '、',
        )}属于“10和十几”。这是题目约定的一种分类，实际整理还可以有其他规则。`,
    },
    {
      id: `${prefix}-strict`,
      knowledge: `${id}-strict`,
      prompt: '同样这些数中，选出所有严格大于10的数，可以多选。',
      choices,
      rule: {
        kind: 'set',
        values: numbers.filter((n) => n > 10).map(String),
      },
      hint: '严格大于10不包括10自己，不把“10和十几”这整类都选上。',
      explanation: `${numbers
        .filter((n) => n > 10)
        .toSorted((a, b) => a - b)
        .join('、')}大于10，10与10相等，不能选。`,
    },
    {
      id: `${prefix}-order`,
      knowledge: `${id}-order`,
      prompt: '将这些不同的数从小到大排列，依次在五个位置选择，每个数选一次。',
      choices,
      rule: {
        kind: 'sequence',
        values: [...numbers].toSorted((a, b) => a - b).map(String),
      },
      hint: '从最小的数开始，0如果在题目中，就排在正数前面；不要照题目显示顺序直接填入。',
      explanation: `从小到大是${[...numbers].toSorted((a, b) => a - b).join('、')}。`,
    },
    {
      id: `${prefix}-extremes`,
      knowledge: `${id}-extremes`,
      prompt: `在${numbers.join('、')}中，依次填最大的数、最小的数。`,
      rule: {
        kind: 'steps',
        values: [Math.max(...numbers), Math.min(...numbers)],
      },
      hint: '题目要求先最大、后最小，顺序不能交换。',
      explanation: `最大${Math.max(...numbers)}，最小${Math.min(...numbers)}。`,
    },
    {
      id: `${prefix}-composition`,
      knowledge: `${id}-composition`,
      prompt:
        '观察小棒图，一捆是10根，一根是1个一。这个数量由几个十和几个一组成？依次填十的个数、一的个数。',
      visual: { kind: 'place-value', value },
      rule: { kind: 'steps', values: [1, value - 10] },
      hint: '先数完整的一捆十，再数单根小棒；问的是组成，不是全部有多少根。',
      explanation: `1个十和${value - 10}个一组成${value}，两个空依次填1、${value - 10}。`,
    },
    {
      id: `${prefix}-ten-ones`,
      knowledge: `${id}-ten-ones`,
      prompt: review
        ? '8个一再添2个一。依次填现在共有几个一、这些一可以捆成几个十。'
        : '9个一再添1个一。依次填现在共有几个一、这些一可以捆成几个十。',
      rule: { kind: 'steps', values: [10, 1] },
      hint: '十个一可以捆成一个十；“几个一”和“几个十”的单位不同。',
      explanation: review
        ? '8+2=10，有10个一，可以捆成1个十。'
        : '9+1=10，有10个一，可以捆成1个十。',
    },
    {
      id: `${prefix}-zero`,
      knowledge: `${id}-zero`,
      prompt: review
        ? '盒子里原来有3根小棒，全部拿走。盒子里现在没有小棒，该用哪个数表示数量？'
        : '盒子里原来有4根小棒，全部拿走。盒子里现在没有小棒，该用哪个数表示数量？',
      rule: { kind: 'number', value: 0 },
      hint: '数量没有了，仍可以用一个数表示；不是1。',
      explanation:
        '现在有0根小棒，写0。这里说的是数量，不把所有情境中的0都解释成同一种用途。',
    },
    {
      id: `${prefix}-gaps`,
      knowledge: `${id}-gaps`,
      prompt: review
        ? '按每次增加1的顺序：14、□、16、□、18。依次填两个空格。'
        : '按每次增加1的顺序：11、□、13、□、15。依次填两个空格。',
      rule: { kind: 'steps', values: review ? [15, 17] : [12, 14] },
      hint: '相邻的数每次增加1，每个空格只占一个位置。',
      explanation: review ? '依次填15、17。' : '依次填12、14。',
    },
    {
      id: `${prefix}-nearest`,
      knowledge: `${id}-nearest`,
      prompt: review
        ? '在3、7、8中，哪一个数最接近10？只填这个数。'
        : '在2、6、9中，哪一个数最接近10？只填这个数。',
      rule: { kind: 'number', value: review ? 8 : 9 },
      hint: '分别从每个数接着数到10，看哪个需要增加的次数最少。',
      explanation: review
        ? '3到10还差7，7到10还差3，8到10还差2，所以8最近。'
        : '2到10还差8，6到10还差4，9到10还差1，所以9最近。',
    },
    {
      id: `${prefix}-floor-order`,
      knowledge: `${id}-floor-order`,
      prompt: `这栋楼各层连续编号1～19，没有跳层。小安住${lower}楼，小雨住${upper}楼。依次填从1楼向上先到谁家的楼层、从19楼向下先到谁家的楼层。`,
      rule: { kind: 'steps', values: [lower, upper] },
      hint: '向上先遇到较低楼层，向下先遇到较高楼层。这里填楼层编号，不填人数。',
      explanation: `向上先到${lower}楼，向下先到${upper}楼。`,
    },
    {
      id: `${prefix}-floor-change`,
      knowledge: `${id}-floor-change`,
      prompt: `从${lower}楼向上到${upper}楼，电梯每经过相邻两层算上升一层，起点不算一次。一共上升几层？`,
      rule: { kind: 'number', value: upper - lower },
      hint: '从起点到下一个楼层才是第一次；数移动次数，不数起点和终点的标签个数。',
      explanation: `${upper}-${lower}=${upper - lower}，上升${upper - lower}层，起点不重复算。`,
    },
    {
      id: `${prefix}-units`,
      knowledge: `${id}-units`,
      prompt: `${value}中的十位数字1表示什么？`,
      choices: [
        { id: 'ten', label: '1个十，也就是10个一' },
        { id: 'one', label: '只有1个一' },
        { id: 'whole', label: `整个数量${value}` },
      ],
      rule: { kind: 'choice', value: 'ten' },
      hint: '数字相同，在不同数位上表示的单位不同；这里问十位上的1。',
      explanation: `${value}有1个十和${value - 10}个一，十位上的1表示一个十。`,
    },
  ];
}
function descendingTask(review: boolean): Question {
  const start = review ? 18 : 13;
  const end = review ? 9 : 7;
  return {
    id: `${id}-${review ? 'r' : 'q'}-floor-down`,
    knowledge: `${id}-floor-down`,
    prompt: `本站原创连续编号楼层示例：电梯从${start}楼下降到${end}楼，每经过相邻两层算下降一层，起点不算一次。一共下降几层？`,
    rule: { kind: 'number', value: start - end },
    hint: '先判断是下降；数相邻楼层之间的移动次数，不把起点也算一次。',
    explanation: `${start}−${end}=${start - end}，下降${start - end}层。若把两个端点的楼层标签都数进去，会多算一次；下降不是把两层编号相加。`,
  };
}
const sourceManual: [string, string][] = [
  [
    'three-images',
    '实际回同版教材第90页第1项，分别看散物、小棒和计数器三幅图，逐件或按十/个读数量，独立写全三处并核对单位。本站原创图不能代替原图已经读写；没原书或未读写可暂跳。',
  ],
  [
    'four-compositions',
    '实际回同版教材第90页第2项，完成全部四个小题的所有空，分别解释接近10、几个一换成一个十、十与一合成总量和十几的组成。每空对应所求单位，保留逐项核对与帮助；不把一个示例当四题已做。',
  ],
  [
    'five-number-order',
    '实际回同版教材第90页第3项，使用原题给出的五个数，分别填写最大、最小、严格大于10的个数，再完整写五数从小到大的顺序并核对四个小于号。相等于10不计入严格大于，本站另一组数不能代替原页。',
  ],
  [
    'floor-directions',
    '实际回同版教材第90页第4项，分别说明从低处上升先到谁家、从高处下降先到谁家，再算两家之间上升的层数。纸上保留原题连续楼层编号，用棋子分别演示上升与下降先后及两家移动，起点不算一次；原页三问均处理，没实际演示暂跳。',
  ],
];
const manual: [string, string][] = [
  [
    'classify',
    '准备0～19数字卡，先按比10小与10和十几分类，再试把0单列、1～19放另一类。说清每种规则，不只照抄一种分类。',
  ],
  [
    'bundle',
    '实际摆17根小棒，十根捆一捆，说明一个十与七个一；再将十个一换成一个十，并核对数量没有变化。',
  ],
  [
    'floor',
    '在纸上按顺序标出1～19楼，用棋子演示12楼到17楼，每次移动到相邻楼层计一次，核对五次而非六次。',
  ],
  [
    'reflect',
    '亲自写一组0～19的数，口头读出，按大小排列并说明十几的组成；请家长查看读、写与实际摆物，说一个还需要帮助的地方。',
  ],
];
export const sujiaoFinalNumbersLesson: Lesson = {
  id,
  textbookTitle: '期末复习：数的整理与应用',
  title: '期末复习：0～19的分类、数序与十个一',
  page: 88,
  status: 'available',
  version: 2,
  goal: '按明确规则整理0～19，区分大于10与10和十几，读写组成、比较与数序，联系楼层先后和移动次数。',
  prerequisite:
    '认识0～19和一个十、几个一，准备数字卡、19根安全小棒、纸笔；数位图只用于观察和讲解。',
  parentTip:
    '分类可以有多种合理规则，本课客观题按题目给定规则，实际另试其他规则。楼层例示连续编号不代表所有现实建筑；起点不是上升一次。读、写、摆物与口述人工确认，帮读或提示分别记录，不把一次题目完成当全年掌握。',
  steps: [
    {
      title: '先说明分类规则',
      text: '0～19可以按比10小与10和十几分两类，10在第二类；也可以把表示没有的数量0单列，1～19放另一类。整理前说清规则，同一个数只放在一类，不把某一种分法当成唯一分法。',
      activity: '实际用数字卡做两种分类，逐张核对，不漏放或重复。',
    },
    {
      title: '一个十和几个一',
      text: '十个一组成一个十。17由一个十和七个一组成，十位的1表示一个十。问几个十和几个一，应答组成；问总数，应答17。换捆只改变分组，不改变原有数量。',
      visual: { kind: 'place-value', value: 17 },
      activity: '实际捆十根小棒，再放七根；换捆前后重新数数并解释单位。',
    },
    {
      title: '数序、大小与接近10',
      text: '相邻数增加1，按从小到大排列要从最小数开始。10和十几这个分类包括10，但严格大于10不包括10。比较谁更接近10，可以分别数到10要增加几次，次数少的更近。',
      activity:
        '写一组数，口头读出、排序，再逐个接着数到10比较距离；请家长查看实际书写。',
    },
    {
      title: '楼层位置与移动次数',
      text: '例示各层连续从1编号。向上先到较低楼层，向下先到较高楼层。从12到17经过五次相邻层移动，起点12不是上升一次；不要把两端楼层都算进移动次数。',
      activity: '纸上画楼层，棋子实际移动，每到下一层记一次，再用差值核对。',
    },
    {
      title: '自己读、写、摆，再反思',
      text: '复习时分别检查是否读得出、写得清、能按规则整理，也能用实物说明十与个。页面看图答对不自动替代真实读写或摆物，说出仍需帮助的地方，再选择对应内容练习。',
      activity:
        '展示自己的数字卡、书写与捆棒，举例解释，让家长分别查看并记录。',
    },
    {
      title: '回原页，四组练习分别完成',
      text: '同版第90页第1至4项：三幅数量图分别读写；四个组成与接近问题所有空分别回答；五数的最大、最小、严格大于10个数和完整排列分别填写；楼层题分别处理上升先后、下降先后及两家间的移动次数。本站原创练习和原书实际任务分开，少量示例不能代替整组。下降移动次数同样数相邻层之间的变化，起点不算一次。',
      activity:
        '实际回第90页依次处理四组，保留全部空格、数序和三问的纸面作品；棋子演示两个方向的先后及移动。没有原书或尚未实际操作可暂跳，未来计划另记。',
    },
  ],
  questions: [
    ...tasks(false),
    ...manual.map(([key, prompt]): Question => ({
      id: `${id}-manual-${key}`,
      knowledge: `${id}-physical-${key}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '先实际读、写、摆和说明，再由家长查看确认。',
      explanation:
        '读写、摆物和反思独立人工确认，图示作答不能替代，也不自动产生掌握判断。',
    })),
    descendingTask(false),
    ...sourceManual.map(([key, prompt]): Question => ({
      id: `${id}-manual-source-${key}`,
      knowledge: `${id}-actual-source-${key}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '回原页逐项读写和实际操作，未完成可以暂跳，不能用本站客观题答对自动确认。',
      explanation:
        '原页实际任务独立人工确认，correct为null，不自动判掌握或评星；保留帮助与未完成部分。',
    })),
  ],
  reviewQuestions: [...tasks(true), descendingTask(true)],
  review: {
    date: '2026-10-04',
    reviewer: '同版期末正文核验与原创教学检查',
    notes: `依据实际查看ISBN ${source.isbn}、2024年7月第1版、2025年7月第2次印刷上册第88、90页（${source.preview}）的数分类、数序、组成、大小与楼层应用。原创数字、情境与讲解，明确分类与严格大于的边界和楼层编号约定，不复制教材图；2026-10-04重新查看88～94七页，补充第90页四组原书实际任务与原创下降计数。旧16主任务、12复习和前五步骤保留；新版21主任务、13复习，不改旧v1快照。本课不代表其余期末课或全年完成。`,
  },
};
