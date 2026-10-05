import type {
  Lesson,
  PlaneCardsVisual,
  Question,
  Visual,
} from '../learning/types';

const id = 'bnu-lower-patterns';
const cards = (big: number, small: number): PlaneCardsVisual => ({
  kind: 'plane-cards',
  cards: [
    ...Array.from({ length: big }, (_, i) => ({
      shape: 'triangle' as const,
      size: 2 as const,
      turn: i % 2 === 0 ? (0 as const) : (90 as const),
    })),
    ...Array.from({ length: small }, (_, i) => ({
      shape: 'triangle' as const,
      size: 1 as const,
      turn: i % 2 === 0 ? (45 as const) : (135 as const),
    })),
  ],
});
const mainCards = cards(4, 4);
const reviewCards = cards(2, 4);
const circleCard: PlaneCardsVisual = {
  kind: 'plane-cards',
  cards: [{ shape: 'circle', size: 2, turn: 0 }],
};
function task(
  suffix: string,
  prompt: string,
  rule: Question['rule'],
  explanation: string,
  visual?: Visual,
): Question {
  return {
    id: `${id}-${suffix}`,
    knowledge: id,
    prompt,
    rule,
    explanation,
    hint: '先分清原图、选中的部分与本站卡；大小不另加类别，未知数量不猜0，实际描画如实记录。',
    ...(visual ? { visual } : {}),
  };
}
function choose(
  suffix: string,
  prompt: string,
  labels: string[],
  value: string,
  explanation: string,
  visual?: Visual,
): Question {
  return {
    ...task(suffix, prompt, { kind: 'choice', value }, explanation, visual),
    choices: labels.map((label) => ({ id: label, label })),
  };
}
const actual = (suffix: string, prompt: string) =>
  task(
    suffix,
    prompt,
    { kind: 'manual' },
    '实际完成本项才确认，未做或只有网页答题请跳过；原图不可见、纸卡替代、成人协助或待做如实说明，不要求购买材料或学校资料。',
  );
const record = (suffix: string, prompt: string) =>
  task(
    suffix,
    prompt,
    { kind: 'reflection' },
    '保存自己的原话，正确性为null，不自动认完成；未做如实记录，未来计划与已发生动作分开。',
  );

export const bnuLowerPatternsLesson: Lesson = {
  id,
  textbookTitle: '动手做（三）',
  title: '欣赏四图、选部分描与画',
  page: 83,
  version: 1,
  status: 'available',
  goal: '分别欣赏风车、小兔、鱼和万花筒，指认认识的形状，选择其中一部分真实描画并区分直边和曲线。',
  prerequisite:
    '认识三角形、圆、正方形，知道大小与朝向不直接改变类别；能说明实际做过与尚未做。',
  parentTip:
    '原四图回教材资源83页观察，不打包原插画；本站三角形卡只是4大4小计数认形清单，形状比例不冒原风车材料，也不能证明这些卡可拼原风车。圆卡供曲线观察，不是整兔。原只要求选图案一部分描画，不强制四幅整图全描或两种额外练习全部做；本站两项直边/曲线练习明确可选。未看原图可待做，不需要学校、指定审校人或购买材料。',
  review: {
    date: '2026-10-06',
    reviewer: '实际查看公开扫描83页与来源记录',
    notes:
      '两原活动完整展开，四图分别观察与选部分描画分开；原图观察、本站示意与实际描画分开，不冒整册全年完成。',
  },
  steps: [
    {
      title: '先找原四幅图的位置',
      text: '回原83页，按上排左风车、上排右小兔、下排左鱼、下排右万花筒分别欣赏。每幅找自己认识的图形，指完整边界说明。物品名称、颜色和图框不直接等于材料形状；四幅各观察，不能用看过风车代替其余三幅。本站不复制原画，下面只用独立图形卡帮助比较。',
      activity: '实际看原四图，分别说出认识的形状或还想核对的部分。',
    },
    {
      title: '风车对话：4大与4小，不是两种形状',
      text: '原对话说用4个大三角形和4个小三角形可以做一个风车。两种大小都属于三角形，材料数是4加4共8；这句话不是让我们把所有白区、外框或颜色块额外计入纸片。本站卡把4大4小列作清单，只作计数认形，不证明这些卡的角度比例能拼原风车。原风车的实际部件仍回原图核对。',
      visual: mainCards,
      activity: '实际观察原风车的各片边，区别原图与本站清单。',
    },
    {
      title: '分组数与总数，各问各的',
      text: '本站完整清单A～D为四张较大卡，E～H为四张较小卡；每卡仍三角形。问大的数量是4，问小的是4，问全部卡是8，问形状类别仍一种。转向不增加卡数。本站清单没有圆卡所以圆卡0；原万花筒数量没给全时不能照这个0猜。',
      visual: mainCards,
      activity: '逐卡指认并说明大小组数、总数与类别数的不同。',
    },
    {
      title: '小兔：只看所选头部，不推整兔',
      text: '原小兔图的头是圆的，原对话说画起来有点困难。选择一个头部沿曲线看，不把眼睛、耳朵、尾巴或整兔都混作同一个圆。本站单独圆卡只帮助观察连续弯曲的边，不冒原兔头的大小、姿势或整兔图。可以先慢慢描，再试自己画，困难如实记，不用画得像原插画才算有尝试。',
      visual: circleCard,
      activity: '实际回原兔图指一个头部，观察曲线与其它部位的区别。',
    },
    {
      title: '鱼：看部分的完整轮廓',
      text: '回原鱼图找自己认识的图形，选一条鱼或一个小部分，指完整边。不能因为整个图叫鱼，就认每一部分都是三角形；也不能把水色背景或方框当鱼身材料。实际观察后说明看到的形状，允许保留尚不确定的部分，不按名称猜数量或颜色类别。',
      activity: '实际观察原鱼图并指出自己认识的形状，不用其它图的答案代替。',
    },
    {
      title: '万花筒：找三角形与正方形',
      text: '原对话说有好多三角形，还有正方形。可以选择一小块，先沿完整轮廓找三角形，再找正方形；斜放的正方形不因方向改变类别。“好多”没有给唯一总数，也没说其它类别一定为0。原图框、重叠范围和重复花纹分清，想数更多可说明自己的选定范围，不预设全图唯一数量。',
      activity: '实际在原万花筒图分别指认识的三角形和正方形，说明选定范围。',
    },
    {
      title: '只选一部分，先说明选择',
      text: '原第二项选择图案中的一部分描一描、画一画，选自己喜欢或想练的部分即可；不是要求四幅整图全部描完。先指出选的是哪幅、哪部分和完整边界，再准备纸笔。没有原图可以先待做；本站卡替代练习如实标明，不冒已描原图。',
      activity: '实际选定原图一部分并说明范围，记录选择。',
    },
    {
      title: '描与画分别试，直边曲线不同',
      text: '沿所选部分实际描完整边界，再自己试画这部分，比较哪里要调整。原提醒风车的三角形线要画直，小兔头圆曲线较难，两种边分别看；不把圆画成带直角的方框。可以借助适合的纸卡或成人帮助如实记录，描完不自动等于自己画过。本站另外提供直边与圆曲线各一项可选练习，不增加原必须全做的要求。',
      activity:
        '实际先描再试画选定部分，分别核对完整轮廓；困难与协助如实说明。',
    },
    {
      title: '保留真实发现，下一次另记',
      text: '回看自己所选部分的描图与画图，说一个真实发现或还未完成的步骤。四幅原图欣赏、实际描、自己画与可选练习分别记录；点击正确答案不代替纸笔动作，也不自动评分绘画质量。下一次准备练什么另记计划，不据本页认第六单元或全年已完成。',
      activity: '实际检查已有作品或如实待做，记录发现和未来计划。',
    },
  ],
  questions: [
    task(
      'source-big',
      '原风车对话说需要几个大三角形？只按这段明确选片条件。',
      { kind: 'number', value: 4 },
      '原对话明确4个大三角形。',
    ),
    task(
      'source-small',
      '同一原对话说需要几个小三角形？',
      { kind: 'number', value: 4 },
      '另有4个小三角形，不把大组重复计入。',
    ),
    task(
      'source-total',
      '原对话4大与4小三角形合起来选了几片？',
      { kind: 'number', value: 8 },
      '4+4=8，大小不同仍分别一片。',
    ),
    task(
      'site-big',
      '本站完整A～H清单中，较大卡有几张？',
      { kind: 'number', value: 4 },
      'A～D四张，方向改变不增卡。',
      mainCards,
    ),
    task(
      'site-small',
      '同一本站完整清单中，较小卡有几张？',
      { kind: 'number', value: 4 },
      'E～H四张。',
      mainCards,
    ),
    task(
      'site-total',
      '同一本站完整清单共有几张卡？大小组不要重复数。',
      { kind: 'number', value: 8 },
      '八个字母各一张，共8。',
      mainCards,
    ),
    task(
      'site-zero',
      '本站明确只给完整八张三角形卡，其中圆形卡有几张？没有隐藏卡，未填不当0。',
      { kind: 'number', value: 0 },
      '完整清单没有圆卡，所以0；不能推广到未知原万花筒图。',
      mainCards,
    ),
    choose(
      'size-category',
      '4大与4小三角形因为大小不同，就成为两种形状类别吗？',
      ['不是，仍三角形这一类', '是，大小就是类别'],
      '不是，仍三角形这一类',
      '大小与形状类别分开。',
      mainCards,
    ),
    choose(
      'straight-edge',
      '原提醒组成风车的三角形，描画它的边应留意什么？',
      ['直边画直，沿完整边走', '把每边改成圆弧'],
      '直边画直，沿完整边走',
      '三角形直边与圆曲线不同。',
    ),
    choose(
      'circle-edge',
      '本站圆卡的外边怎样观察？',
      ['连续弯曲的一圈', '四条直边与四个角'],
      '连续弯曲的一圈',
      '沿完整曲线看，不改成方框。',
      circleCard,
    ),
    choose(
      'head-scope',
      '原小兔头是圆的，能直接推出耳朵、尾巴与整兔全部都是一个圆吗？',
      ['不能，部位与整体分清', '能，只要名字叫兔就都圆'],
      '不能，部位与整体分清',
      '原说明头部，不把它推广所有部位。',
    ),
    choose(
      'unknown-total',
      '只给原万花筒“好多三角形，还有正方形”，没给完整计数条件，就能确定三角形总数等于8或0吗？',
      ['不能，需要实际选范围核对', '能，照抄本站8或0'],
      '不能，需要实际选范围核对',
      '本站清单与原图不同，“好多”不是唯一数字。',
    ),
    choose(
      'part-not-all',
      '原选择一部分描画，是否必须把四幅整图全部描完？',
      ['不必，按所选部分完成', '必须，四整图一幅不能少'],
      '不必，按所选部分完成',
      '欣赏四图与选一部分描画是两个要求。',
    ),
    choose(
      'card-not-original',
      '本站三角形计数卡比例，就能证明这些卡一定拼成原风车吗？',
      ['不能，清单只帮计数认形', '能，同为三角形就一定拼好'],
      '不能，清单只帮计数认形',
      '原材料姿势与比例另看原图，不凭同类判拼合。',
    ),
    choose(
      'click-not-draw',
      '在网页选对圆的边，就能确认纸面已经描和画过吗？',
      ['不能，实际动作另记', '能，答对自动算纸笔完成'],
      '不能，实际动作另记',
      '知识回答与实际描画分开。',
    ),
    ...(['风车', '小兔', '鱼', '万花筒'] as const).map((name, i) =>
      actual(
        `actual-pattern-${i + 1}`,
        `实际回原83页第${i + 1}幅${name}图，欣赏并指认识的完整轮廓；未看该图或只看其它图请跳过。`,
      ),
    ),
    actual(
      'actual-select',
      '实际选定原图一个部分并指清范围，不必选四整图；没有原图或只想下次做请跳过。',
    ),
    actual(
      'actual-trace',
      '实际沿选定部分描完整边界，纸卡替代或成人协助如实说；只看网页请跳过。',
    ),
    actual(
      'actual-draw',
      '实际另试自己画所选部分，比较完整轮廓；只有描过而未自己画请跳过。',
    ),
    actual(
      'optional-straight',
      '本站可选练习：实际另练三角形直边描画并检查；不是原必须额外任务，未选或未做请跳过。',
    ),
    actual(
      'optional-curve',
      '本站可选练习：实际另练圆曲线描画并检查；不是原必须额外任务，未选或未做请跳过。',
    ),
    record(
      'selection-record',
      '记录实际选哪幅哪部分和选择理由，本站替代卡与原图分清；未选如实记。',
    ),
    record(
      'drawing-record',
      '分别记录描过与自己画过的情况、真实发现或协助，未做哪一步如实说；不自动评分画得像不像。',
    ),
    record(
      'reflection',
      '记录四图还有哪个轮廓想核对、哪些活动还待做，不自动评星或认定全册完成。',
    ),
    record('plan', '记录下一次想练的部分和方法；未来计划不当已描已画。'),
  ],
  reviewQuestions: [
    task(
      'review-count',
      '换成本站新的完整六卡清单，共有几张卡？不能照抄原八张。',
      { kind: 'number', value: 6 },
      '现在A～F各一张，共6。',
      reviewCards,
    ),
    task(
      'review-big',
      '同一新清单，较大卡有几张？',
      { kind: 'number', value: 2 },
      '新的大卡只有A/B两张。',
      reviewCards,
    ),
    task(
      'review-small',
      '同一新清单，较小卡有几张？',
      { kind: 'number', value: 4 },
      '新的小卡C～F四张。',
      reviewCards,
    ),
    task(
      'review-zero',
      '新完整六卡清单中，正方形卡有几张？没有隐藏卡。',
      { kind: 'number', value: 0 },
      '只给三角卡，正方形0；条件完整才填0。',
      reviewCards,
    ),
    choose(
      'review-turn',
      '在新清单把较小三角形转向，会自动变成新的形状类别吗？',
      ['不会，朝向与类别分清', '会，每种朝向一新类'],
      '不会，朝向与类别分清',
      '仍是三角形，转向不改变完整边界类别。',
      reviewCards,
    ),
    choose(
      'review-observation',
      '新记录只实际看过原鱼图，另外三图未看，可以确认四图都欣赏过吗？',
      ['不能，另外三图如实待做', '能，看到一图就算全部'],
      '不能，另外三图如实待做',
      '四幅原观察分别记录，不扩大实际范围。',
    ),
  ],
};
