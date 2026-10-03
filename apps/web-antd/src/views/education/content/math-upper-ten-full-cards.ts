import type { Lesson, Question } from '../learning/types';

const id = 'mu-ten-full-cards';
function task(
  suffix: string,
  prompt: string,
  rule: Question['rule'],
  explanation: string,
  labels?: string[],
): Question {
  return {
    id: `${id}-${suffix}`,
    knowledge: id,
    prompt,
    rule,
    explanation,
    hint: '每条独立计算，含0和同数相减不能漏；按本站明确次序填写，纸卡和原书操作另记。',
    choices: labels?.map((label) => ({ id: label, label })),
  };
}
function fields(
  suffix: string,
  prompt: string,
  values: number[],
  explanation: string,
) {
  return task(suffix, prompt, { kind: 'steps', values }, explanation);
}
function manual(suffix: string, prompt: string) {
  return task(
    suffix,
    prompt,
    { kind: 'manual' },
    '实际做完本项才确认，没做、部分、替代与计划分别如实记录，可跳过；网页算对不冒原书纸笔或交流已完成。',
  );
}
const additions = Array.from({ length: 11 }, (_, sum) => {
  const terms = Array.from({ length: sum + 1 }, (_, b) => `${sum - b}+${b}`);
  return fields(
    `add${sum}`,
    `本站和${sum}一组：${terms.join('、')}，按此顺序独立填每条结果，不累计。`,
    terms.map(() => sum),
    '两个加数交换仍保留不同式，组内和固定，0加几也保留。',
  );
});
const subtractions = Array.from({ length: 11 }, (_, original) => {
  const terms = Array.from(
    { length: original + 1 },
    (_, removed) => `${original}−${removed}`,
  );
  return fields(
    `sub${original}`,
    `本站原量${original}一组：${terms.join('、')}，按此顺序独立填每条剩下数。`,
    terms.map((_, removed) => original - removed),
    '每条从本原量重新减对应数，同数相减得0，不能沿上一条累计。',
  );
});
const increasing = Array.from({ length: 11 }, (_, n) => n);
export const upperTenFullCardsLesson: Lesson = {
  id,
  version: 1,
  page: 64,
  status: 'available',
  textbookTitle: '6～10的认识和加、减法',
  title: '十内完整算式卡与排列规律',
  goal: '完整计算0～10的66条加法和66条减法含0，分组不漏不重复；核对第一列、末项与自己的排列，实际制作和任指解释。',
  prerequisite:
    '已理解0与10内分合；准备允许的纸笔/小卡，题多可分次继续，不强制计时，陪学人可逐条读题。',
  parentTip:
    '依据实际查看的印刷64页完整表设计原创分组及任务；本站文字组不复制教材表排版。所有合法式均列，原书补表、自己排卡/交流另实做，网页正确率不冒掌握。',
  review: {
    date: '2026-10-03',
    reviewer: '已读完整表与132条有限集合核对',
    notes:
      '公开第三方0013阅读器69对应印刷64已实际查看。加法/减法各66含0，完整制作、任指、第一列与自主规律分别对应；第三方非官方，ISBN/版印未知，不发布扫描，旧u2十课与快照保持，教师最终审校未核验。',
  },
  steps: [
    {
      title: '完整加法从0到10',
      text: '本站按和0～10分11组，各组有1到11条，总共66条。每组从和+0到0+和，第一加数逐次减1、第二加数添1。2+8与8+2是两条不同式，5+5只一条；0+0和0+10都不能漏。每条独立从自己的两个数开始，不连续累计。',
      activity: '实际写全部66张加法卡，按和分组检查各组张数。',
    },
    {
      title: '完整减法不能得到负数',
      text: '本站按原量0～10分11组，去掉量从0到原量，结果都在0～10。各组有1到11条，共66条；10−0直到10−10，独立得10到0，不是连续拿走0再1再2。相同数相减和0−0都为0，未知和空白不是0。',
      activity: '实际制作全部66张减法卡，每条指明原有与去掉量。',
    },
    {
      title: '首项末项要看排列',
      text: '本站各加法组第一条为和+0，各减法组第一条为原量−0，第一列结果均依次0～10。加法末项为0+和，依次0～10；减法末项为原量−原量，全部0。换一种排列后首末条件必须重新读，不能永远认最右边必是0。',
      activity:
        '实际观察原64页第一列和自己的完整排卡，说首末关系与另一条规律。',
    },
    {
      title: '任指、补全与自主排列',
      text: '真实任指卡口算并说方法，网页按顺序填写不替代随机任指。先检查自己的132张卡无重复漏项，再自己换一种可解释的排列；原教材表有空格，实际逐格补全是另一项纸笔任务。没有制作或交流如实记，可分次继续。',
      activity: '实际完整补原表、任指并换排列，记录自己的例子和真正交流情况。',
    },
  ],
  questions: [
    ...additions,
    ...subtractions,
    fields(
      'addFirst',
      '本站按和0～10顺序，加法每组首项为和+0。依次填11个首项结果。',
      increasing,
      '加0不变，从0到10都包含。',
    ),
    fields(
      'subFirst',
      '本站按原量0～10顺序，减法每组首项为原量−0。依次填11个首项结果。',
      increasing,
      '减0不变，首列仍0到10。',
    ),
    fields(
      'addLast',
      '本站按和0～10顺序，加法每组末项为0+和。依次填11个末项结果。',
      increasing,
      '末项加法不是全0，而是0加对应和。',
    ),
    fields(
      'subLast',
      '本站原量0～10各减法组末项为同数相减。依次填11个末项结果，0也明确填写。',
      increasing.map(() => 0),
      '每组最后原量全部去掉得0。',
    ),
    manual(
      'm1',
      '实际制作完整66张加法卡和66张减法卡，逐条检查0范围、每组1～11张、交换与同式去重；实际没写全或部分完成如实记，网页填写不冒已做纸卡。',
    ),
    manual(
      'm2',
      '实际完整补原64页两张表所有空格，说原表排列，再任指多张卡口算与解释；不把本站分组布局称原版表图。',
    ),
    manual(
      'm3',
      '实际计算原表第一列、自己的首末项，并另外提出一种排列/规律，写自己的例子说明；只照抄本站标题不当自己发现。',
    ),
    manual(
      'm4',
      '实际与陪学人或可参与同伴整理/互指交流，展示自己的132张检查结果；独自口述、替代材料和未来计划分别记录，不能自动把数字正确当合作完成。',
    ),
    task(
      'reflection1',
      '记录你怎样真实检查完整132条与0/重复/漏项，哪些尚需帮助或未做，计划另记。',
      { kind: 'reflection' },
      '反思correct为null，不按积极措辞评分。',
    ),
    task(
      'reflection2',
      '写自己实际采用的排列或发现及一个例子；只是看过或计划重排如实写。',
      { kind: 'reflection' },
      '个人发现和计划分开，不给掌握度。',
    ),
  ],
  reviewQuestions: [
    fields(
      'r1',
      '和7一组换序0+7、1+6、2+5、3+4、4+3、5+2、6+1、7+0，逐项独立填结果。',
      [7, 7, 7, 7, 7, 7, 7, 7],
      '换排列后仍每条和7。',
    ),
    fields(
      'r2',
      '原量8一组换序8−8、8−7、8−6、8−5、8−4、8−3、8−2、8−1、8−0，逐项填结果。',
      [0, 1, 2, 3, 4, 5, 6, 7, 8],
      '这次去掉量递减，结果递增，不能套主课倒序。',
    ),
    fields(
      'r3',
      '换序看四条首/末项：10−10、0+10、10−0、0−0，依次填结果。',
      [0, 10, 10, 0],
      '看实际算式，不按字段位置猜0。',
    ),
    fields(
      'r4',
      '独立计算6+0、0+6、6−0、6−6，填四个结果。',
      [6, 6, 6, 0],
      '前三不增减，末项全部去掉0。',
    ),
  ],
};
