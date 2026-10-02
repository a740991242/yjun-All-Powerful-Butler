import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
import { sujiaoUpperSource as source } from './sujiao-upper-source';

const id = 'sj-upper-exploration-review';
const storySource = 'https://jcj.moa.gov.cn/lzwh/201411/t20141119_4214303.htm';
function tasks(review: boolean): Question[] {
  const counts = review ? [9, 7, 5, 3, 1] : [1, 3, 5, 7, 9];
  const triangle = review ? 3 : 4;
  const difference = review ? 2 : 3;
  const circle = triangle + difference;
  const base = (key: string, prompt: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
  });
  return [
    {
      ...base(
        'five-counts',
        review
          ? '把五张板反向摆好：涂色格从9开始，每张比前一张少2格。依次写五张的涂色格数。每板两行，每行5格。'
          : '五张板各有两行，每行5格。前三张分别涂1、3、5格，后两张按每次多2格续涂。依次写全五张的涂色格数。',
      ),
      rule: { kind: 'steps', values: counts },
      hint: '每张单独数，跨行仍接着数；涂满第一行后才进入第二行。',
      explanation: `涂色格依次${counts.join('、')}，每次${review ? '少' : '多'}2格。`,
    },
    {
      ...base(
        'five-empty-counts',
        `五张两行五格板分别涂${counts.join('、')}格。逐张数未涂色格，填全五个数。不要把涂色与未涂色混在一起。`,
      ),
      rule: { kind: 'steps', values: counts.map((n) => 10 - n) },
      hint: '可以画格子直接数空格；本题不要求先学10的减法。',
      explanation: `未涂格依次${counts.map((n) => 10 - n).join('、')}；涂色和空白分开逐格核对。`,
    },
    {
      ...base('change', `涂色格数依次${counts.join('、')}，相邻两张相差几格？`),
      rule: { kind: 'number', value: 2 },
      hint: '对应比较相邻两板，数新增或减少的格。',
      explanation: '每次相差2格，不是只看最后一张。',
    },
    {
      ...base(
        'same-symbols',
        `同样符号表示同一个数：△＋△＝${triangle * 2}，○－△＝${difference}。先填△，再填○，都在0～9。`,
      ),
      rule: { kind: 'steps', values: [triangle, circle] },
      hint: '用小纸片试两个一样多的组，再从圆表示的数量取走一组；两条都要成立。',
      explanation: `△是${triangle}、○是${circle}；${triangle}＋${triangle}＝${triangle * 2}，${circle}－${triangle}＝${difference}。`,
    },
    {
      ...base(
        'substitute-both',
        `试得△＝${triangle}、○＝${circle}。代回两条，先填△＋△的结果，再填○－△的结果。`,
      ),
      rule: { kind: 'steps', values: [triangle * 2, difference] },
      hint: '同一个△在三个位置都用相同数，不能临时换成另一个数。',
      explanation: '两条都代回核对，只满足其中一条不够。',
    },
    {
      ...base(
        'unequal-triangles',
        `${triangle - 1}＋${triangle + 1}也等于${triangle * 2}。能因此把两个△分别写成这两个不同数吗？`,
      ),
      choices: [
        { id: 'no', label: '不能，同一个△必须同一个数' },
        { id: 'yes', label: '能，只要加起来对就行' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '加起来对，还要遵守同符号同数的条件。',
      explanation: '不同数相加虽得到同一和，不能替代两个相同符号。',
    },
    {
      ...base(
        'story-three-and-three',
        '本课讲的六尺巷礼让故事中，两家各让三尺。按故事的数，两边合起来是几尺？这不是现场测量题。',
      ),
      rule: { kind: 'number', value: 6 },
      hint: '先说明是故事里给出的两部分，再合并3与3。',
      explanation: '故事中3＋3＝6；不把故事数量说成今天实地量得的数据。',
    },
    {
      ...base(
        'name-not-measurement',
        '在地图或书里看见名字带数字，就能说数字一定是今天实际测量的长度吗？',
      ),
      choices: [
        { id: 'no', label: '不能，先看来源和名称含义，不编造解释' },
        { id: 'yes', label: '能，名字里的数一定等于实际长度' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '名字与现场测量是两件事，不知道含义可以如实说不知道。',
      explanation: '数字地名可用来观察数，含义与测量需要各自证据。',
    },
  ];
}

export const sujiaoUpperExplorationReviewLesson: Lesson = {
  id,
  title: '五板续涂、同符号探索与三项自评',
  textbookTitle: '6～9·探索与评价',
  page: 52,
  version: 1,
  status: 'available',
  goal: '实际续涂五张两行五格板，观察有数字的地名，用同一个数验证同符号的两个条件；分别用真实证据自评三个学习方面。',
  prerequisite:
    '准备纸笔、涂色笔与9张纸片，家人协助看记录；地名可从手边地图或书中找，不要求外出。',
  parentTip: `对应ISBN ${source.isbn}印刷52页。五板每板两行五格，逐格数空白，不把10的减法作为先修。六尺巷故事依据农业部网站2014-11-19刊载的中央纪委监察部网站介绍，采用简短原创转述；不引用全诗、不换算尺、不推断现今宽度。来源：${storySource}。实际活动独立人工，三项自评correct为null，不自动打星或推断掌握。`,
  steps: [
    {
      title: '两行五格，一张也不漏',
      text: '在纸上画五张板，每张两行、每行5格。按从左到右、先上后下涂：第1张1格，第2张3格，第3张5格，再续涂第4张7格、第5张9格。第4张上行全涂、下行涂2格；第5张上行全涂、下行涂4格。不是把五板缩成一板或每行四格。',
      activity:
        '实际画全五板并涂1、3、5、7、9格，逐板分别数涂色与未涂格，写在板旁，再反向观察每次少2格。',
    },
    {
      title: '数字地名，先找来源',
      text: '六尺巷在安徽桐城。公开介绍流传的礼让故事：张家与邻居吴家为边界发生争执，张英劝家人退让；张家让三尺，邻居也让三尺，于是有了六尺巷的故事。这里用故事中的3＋3＝6谈合并与互相礼让，不声称今天实地量过。其他名字里的数字也不能都当作长度。',
      activity:
        '实际从地图、书或身边标牌找一个另有数字的地名，写名称、其中数字、真实看到的来源；知道含义需指出来源，不知道如实写不知道。向家人讲本课故事，并区分故事与测量。',
    },
    {
      title: '同符号同数，两条一起检查',
      text: '△＋△＝8，○－△＝3。用0～9试数或摆纸片：两个同样多的4合成8，所以△用4；再找取走4剩3的数，○用7。把4放回三个△，把7放回○，检查4＋4＝8和7－4＝3。3＋5虽然等于8，但两个△不能一个3一个5。',
      activity:
        '实际摆两个相同4片组和7片组，分别合并、恢复再取走，记录两式。另试△＋△＝6、○－△＝2，两条都代回，不凭网页结果确认动手完成。',
    },
    {
      title: '分别留下三个方面的真实证据',
      text: '第一方面：纸上写0～9，指着读，另比较3与7、8与6，说理由。第二方面：实际摆一组9以内合并和一组取走，各写算式，讲自己的条件、问题、算法和答案，不能只背屏幕例题。第三方面：请家人说一段简单摆片指令，实际听后复述、做完大胆说明，认真写所用数；记录实际表现与接受的帮助。',
      activity:
        '三个方面分别操作与记录，遇到不熟保留第一次尝试，写出真实帮助；未做的部分暂跳，不把以后准备练习当今天做过。',
    },
    {
      title: '三项独立自评，不自动打星',
      text: '分别回看：认读写0～9与比较；理解加减、算9以内并讲故事；专心听、大胆说、认真写。每项用一个今天实际做过的例子说明，写自己独立做到什么、得到什么帮助、还不熟什么。下一次计划另写；自评没有自动正确答案，不从计算分数自动给星。',
      activity:
        '依次保存三项自评，没实际证据可写尚未做，正确性记null。家人能补观察但不能替孩子编造完成记录。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      [
        'actual-five-boards',
        '实际画五张两行每行5格板，逐张涂1/3/5/7/9，记录每张涂与未涂格数，正向比较多2格、反向比较少2格。请家人核对全部五板，未真实画涂不能凭填空确认。',
      ],
      [
        'actual-numbered-name',
        '实际在地图、书或标牌找一个另有数字的地名，记录名称、数字、看到的来源；含义未知如实记不知道，不编造历史或测量。实际向家人讲六尺巷故事并说明故事中的数不是自己实测。',
      ],
      [
        'actual-symbols',
        '实际用纸片试△＋△＝8、○－△＝3，恢复后分别验证两式；另试△＋△＝6、○－△＝2，记录同符号同数和两次完整代回。只有屏幕填对未摆片暂跳。',
      ],
      [
        'actual-evaluation-numbers',
        '实际在纸上写并指读完整0～9，比较3与7、8与6并说明，留下真实记录及得到的帮助；未读或未写不算已做。',
      ],
      [
        'actual-evaluation-arithmetic',
        '实际自选9以内两组物品，做一次合并、一次取走，各写算式并讲自己的条件、问题、算法和答案。记录实际两例和帮助，不用背本课例题代替自主故事。',
      ],
      [
        'actual-evaluation-habits',
        '实际听家人的一次摆片指令，复述再摆、主动说理由并认真写数；记录专心听、大胆说、认真写各自的真实例子与帮助，没有发生的行为不编造。',
      ],
    ].map(([key, prompt]): Question => ({
      id: `${id}-${required(key)}`,
      knowledge: `${id}-${required(key)}`,
      prompt: required(prompt),
      rule: { kind: 'manual' },
      hint: '实际做完、留下记录并核对后再确认；未做暂跳，未来计划另记。',
      explanation: '记录真实活动，不自动评为掌握，也不从屏幕答对推断实际完成。',
    })),
    ...[
      [
        'reflection-numbers',
        '认、读、写0～9和比较大小：用今天纸面读写或比较的真实例子说明独立做到什么、接受什么帮助、还不熟什么。未做写尚未做，未来计划另记。',
      ],
      [
        'reflection-arithmetic',
        '理解加减、计算9以内和讲计算故事：分别说今天实际合并/取走与自己的故事证据、帮助和困难。未做如实写尚未做，计划不当实际。',
      ],
      [
        'reflection-habits',
        '专心听、大胆说、认真写：分别回看今天真实听指令、主动说明、写数的表现与帮助，缺少的证据如实记；下一次目标另写。',
      ],
    ].map(([key, prompt]): Question => ({
      id: `${id}-${required(key)}`,
      knowledge: `${id}-${required(key)}`,
      prompt: required(prompt),
      rule: { kind: 'reflection' },
      hint: '写真实例子、帮助与困难；不要求声称都已掌握。',
      explanation: '独立自评correct为null，没有自动答案或星级。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-02',
    reviewer: '同版探索与三项独立评价核对',
    notes: `复习改为五板反向顺序及不同同符号两条件，仍需完整代回。数字地名故事简短转述来源：${storySource}。实际活动与自评独立，最终教师审校未核验。`,
  },
};
