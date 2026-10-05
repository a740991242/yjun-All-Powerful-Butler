import type { BnuTangramVisual } from '../learning/bnu-tangram';
import type { Lesson, Question, Visual } from '../learning/types';

const id = 'bnu-lower-tangram-practice';
const diagram = (
  scene: BnuTangramVisual['scene'],
  variant: BnuTangramVisual['variant'] = 'main',
): BnuTangramVisual => ({ kind: 'bnu-tangram', scene, variant });
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
    hint: '先分清本题给的材料片与拼成的整体；原故事图回教材看，自己的想象和实际操作分别说。',
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
    '只有实际完成这一项才确认；未做、只有网页答题或未来计划请跳过。纸卡替代、成人协助或未与同伴交流如实记录。',
  );
const record = (suffix: string, prompt: string) =>
  task(
    suffix,
    prompt,
    { kind: 'reflection' },
    '保存自己的原话，正确性为null，不把开放故事、待做或计划自动判为完成。',
  );

/** Printed page 82 in full; independent from the page 80 and 81 lessons. */
export const bnuLowerTangramPracticeLesson: Lesson = {
  id,
  textbookTitle: '动手做（二）',
  title: '拼大三角形、讲故事与自由创作',
  page: 82,
  version: 1,
  status: 'available',
  goal: '实际拼两个更大的三角形，逐幅讲三个人物与三幅守株待兔图，区分材料与道具，再自由创作并展示。',
  prerequisite:
    '已认识七巧板三类与原编号，知道同类三角形可以大小不同，实际拼摆时保持每片形状。',
  parentTip:
    '本课覆盖原82页四项练习；人物、守株待兔与苹果椰树原图通过教材资源回原页观察，不打包原扫描。本站两种大三角形是保持原编号和同比例的原创选片示例，不冒原题唯一答案或强制五个三角片全用。开放故事没有唯一动作或名称，足球只是原人物场景道具。没有教材或实物可如实待做，不要求学校、同学身份或购买材料；没有真实展示不自动确认展示。',
  review: {
    date: '2026-10-06',
    reviewer: '实际查看公开扫描82页；原页内容核对与原创教学制作',
    notes:
      '四项练习及三人、三故事图逐项接入；本页四练习与80～81独立；不由本课表示整册或全年已完成。',
  },
  steps: [
    {
      title: '先取三角片，原题要两个更大的三角形',
      text: '回原82页第1项：用七巧板中的三角形拼出两个更大的三角形。材料是1/2/4/6/7五个三角片，可以试不同选片和摆法。原题没有要求五片必须全部用完，也没有指定唯一编号组合。先实际取片，每片不剪、不拉伸，重叠藏片或只让尖角碰着不能当边已接好。',
      visual: diagram('spread'),
      activity: '实际取出三角片并检查边，找出准备试的两组；纸卡替代如实说明。',
    },
    {
      title: '本站第一例：1号与2号边对边',
      text: '本站把1号与2号的一整条边贴在一起。沿整体最外边看是更大的三角形，里面的线是两片接缝，不是外边；仍用两片材料，并不是变成了一片原材料。每片大小与前面编号图相同，图示像素不是厘米。实际可以拿起其中一片，检查接合是否完整，再放回。',
      visual: diagram('large-triangle'),
      activity: '实际拼第一组三角形，沿外轮廓走一圈，检查无内部重叠或空隙。',
    },
    {
      title: '本站第二例：4号与6号重新摆',
      text: '再用4号与6号拼一个相对于各自单片更大的三角形。第二例整体比第一例小，但相对于组成它的小片确实更大；“两个更大的”不要求两成品等大。两组分别完成、分别检查。本站这两例留7号未用，符合这里未要求全用的原题；其它实际合法选法也可说明，不限定这两个例子。',
      visual: diagram('small-triangle'),
      activity:
        '实际另拼第二组，再同时检查两个成品；只完成第一组不能确认两组全做。',
    },
    {
      title: '三个人物逐幅看，不从动作猜片形',
      text: '回原第2项的三幅人物，从左到右各看一幅：指完整纸片的边界，说所用图形，再讲你看到或想到的事情。头、手、脚是人物部位名称，不自动等于某种图形；斜放的正方形仍正方形。原中间附近的足球是场景道具，不额外当七巧板圆片。三幅都分别观察，不用看过一幅代替其余两幅；故事和动作描述可合理不同。',
      activity: '实际逐幅观察三个人物，分别指片说形和讲述；没有原图先待做。',
    },
    {
      title: '与同伴交流，自己的想法可以不同',
      text: '把三幅人物的故事讲给同伴听，听对方怎么看，可以指图解释不同想法。一个人练说也有价值，但不能自动记成已经与同伴交流；记清实际做法。本站不预设人物一定在做某项运动，也不把图上的动作当你已经掌握运动技能。',
      activity: '实际与同伴交换三幅人物的想法，未交流就如实留待做。',
    },
    {
      title: '守株待兔：人物、树、兔逐一拼',
      text: '回原第3项的三幅图，按原序分别观察人物、树和兔的拼片，再用材料实际拼一拼。不能只拼第一幅就勾选三幅都做过，也不能按颜色猜形。观察各片完整边，保持形状与大小，接缝和整体轮廓分清；实际试另一种朝向也可以记录，不要求复制扫描像素尺寸。',
      activity: '实际分别试拼人物、树、兔，记录哪里需要转动或调整。',
    },
    {
      title: '用三幅图讲故事，实际生活另分清',
      text: '把人物、树、兔联系起来讲守株待兔的故事，指图说角色和发生的事情。可与成人共读或用自己的话讲，合理叙述不强判唯一句子。故事情境不要求现实等待或接触兔子；自己续编的内容说明是想象，不当原文或实际经历。只听过故事与自己实际讲过分别记录。',
      activity:
        '实际用三幅图讲一遍故事，说明自己用了哪些图形；合作或单人如实记。',
    },
    {
      title: '自由创作，不限苹果与椰树',
      text: '第4项发挥想象，拼一个喜欢的图案；原苹果、椰树是示例，不是只准选这两种。先想自己要表现什么，再试摆并检查片边，给图案一个自己的名称，说明选了哪些片。原题没有强制每个图案全部用七片，按实际用片说；不同合理作品保留，不凭颜色或名称判唯一答案。',
      activity:
        '实际完成自己的新作品，保留选片、名称和修改过程；未来想法另记。',
    },
    {
      title: '展示与说明独立完成',
      text: '把已经拼好的作品展示给同学，说明名称、用了哪些片和一个自己的发现；没有同学在场，可如实记向家人展示或尚未展示，不要求录入姓名。拼好了与展示过是两件事。听建议后如果真的改过，再记录实际改变；下一次想改什么单独作为计划，不自动评星或认定全册完成。',
      activity:
        '实际展示并说明作品，记录对象角色即可；检查还有哪些本页活动未做。',
    },
  ],
  questions: [
    task(
      'first-pieces',
      '本站第一例完整只给1/2，材料有几片？不把成品外轮廓当材料。',
      { kind: 'number', value: 2 },
      '原编号1/2各一片，合成外轮廓仍有两片材料。',
      diagram('large-triangle'),
    ),
    choose(
      'first-outline',
      '沿本站第一例整体最外边看，外轮廓是什么形状？',
      ['三角形', '正方形', '圆形'],
      '三角形',
      '只沿最外边看，内部接缝不另作外边。',
      diagram('large-triangle'),
    ),
    task(
      'second-pieces',
      '本站第二例完整只给4/6，材料有几片？',
      { kind: 'number', value: 2 },
      '小片4/6各一片，仍两片。',
      diagram('small-triangle'),
    ),
    choose(
      'second-outline',
      '沿本站第二例整体最外边看，外轮廓是什么形状？',
      ['圆形', '三角形', '正方形'],
      '三角形',
      '转摆后两片拼成完整三角轮廓，不改变每片大小。',
      diagram('small-triangle'),
    ),
    task(
      'site-zero',
      '本站第二例只给4/6的完整清单，正方形材料有几片？没有隐藏材料。',
      { kind: 'number', value: 0 },
      '两片都是三角形，这份完整清单中正方形为0，不是未填写。',
      diagram('small-triangle'),
    ),
    choose(
      'relative-larger',
      '第二例成品比第一例小，就不能称为比自己的组成单片更大吗？',
      ['仍可以，相对各自单片比较', '不能，必须两成品等大'],
      '仍可以，相对各自单片比较',
      '每例整体比各自一片大，不要求两个整体等大。',
    ),
    choose(
      'all-five',
      '原第1项是否规定五个三角片必须全部用完？',
      ['没有，不擅自补限制', '有，少用就一定错'],
      '没有，不擅自补限制',
      '原题要求拼两个更大三角形，未规定全部五片必须用。',
    ),
    choose(
      'internal-seam',
      '拼好后里面两片相接的一条线，是否都算整体最外边？',
      ['不算，分清内部接缝', '算，所有线都外边'],
      '不算，分清内部接缝',
      '整体边界沿外轮廓看，里面相接的线是内部缝。',
      diagram('large-triangle'),
    ),
    choose(
      'football',
      '原三幅人物旁的足球，就要额外加成七巧板的一块圆片吗？',
      ['不要，道具与材料分开', '要，看到圆就加一片'],
      '不要，道具与材料分开',
      '足球是场景道具，七巧板原材料没有圆片。',
    ),
    choose(
      'story-open',
      '两个同伴对人物故事有不同合理想法，只能接受一个固定句子吗？',
      ['不必，可指图说明各自想法', '必须，只准固定答案'],
      '不必，可指图说明各自想法',
      '原讲故事开放，描述与图中证据、自己想象分清。',
    ),
    choose(
      'single-cooperation',
      '自己在家练讲故事，能自动记为已与同伴交流吗？',
      ['不能，实际方式如实记', '能，练过就算合作'],
      '不能，实际方式如实记',
      '单人练习与实际交流分别记录，不虚构同伴。',
    ),
    choose(
      'creation-choice',
      '原苹果与椰树示例，意味着自由创作只能这两个吗？',
      ['不是，可创作喜欢的其它图案', '是，其它名字都错'],
      '不是，可创作喜欢的其它图案',
      '示例帮助想象，不限定唯一作品。',
    ),
    choose(
      'show-separate',
      '已经拼好新作品，但尚未给任何人看，能确认展示完成吗？',
      ['不能，拼好与展示分开', '能，拼好自动算展示'],
      '不能，拼好与展示分开',
      '按实际动作分别记录。',
    ),
    actual(
      'actual-material',
      '实际取出三角片并检查，说明选片或纸卡替代；未准备请跳过。',
    ),
    actual(
      'actual-first-triangle',
      '实际拼出第一个比所用单片更大的三角形，查完整外轮廓、无重叠空隙；可不同于本站选片。',
    ),
    actual(
      'actual-second-triangle',
      '实际另拼第二个比所用单片更大的三角形，独立检查；只拼过第一组请跳过。',
    ),
    actual(
      'actual-check-two',
      '实际把两组三角形各与自己的组成单片比较并指完整外边，说明各自选片；未比较两组请跳过。',
    ),
    ...(['左', '中', '右'] as const).map((position, i) =>
      actual(
        `actual-person-${i + 1}`,
        `实际回原82页从左到右第${i + 1}幅（${position}）人物，指完整纸片说图形并讲这幅故事；缺原图或只做其它人物请跳过。`,
      ),
    ),
    actual(
      'actual-people-exchange',
      '实际与同伴交流三幅人物的故事和所用图形，听对方想法；只有单人练说请跳过。',
    ),
    ...(['人物', '树', '兔'] as const).map((label, i) =>
      actual(
        `actual-hare-${i + 1}`,
        `实际回守株待兔原第${i + 1}幅${label}图观察并用材料试拼，说明片形和转摆；只读故事或看网页请跳过。`,
      ),
    ),
    actual(
      'actual-hare-tell',
      '实际联系原三幅人物、树、兔图讲守株待兔故事，用自己的话说明角色和事情；未讲请跳过。',
    ),
    actual(
      'actual-create',
      '实际完成自己喜欢的新图案，说名称及选片；不限苹果椰树，只有未来想法请跳过。',
    ),
    actual(
      'actual-show',
      '实际把作品展示并说明给同学；家人替代对象如实记录，尚未展示请跳过，不填姓名。',
    ),
    record(
      'triangles-record',
      '记录实际两组三角形的选片、检查方法和发现；未做哪组如实写。',
    ),
    ...(['左', '中', '右'] as const).map((position, i) =>
      record(
        `person-record-${i + 1}`,
        `分别记原第${i + 1}幅（${position}）人物的故事与所用图形，指出观察和想象；未看到原图如实记，不照抄固定答案。`,
      ),
    ),
    record(
      'hare-record',
      '记录三幅守株待兔试拼和讲述的实际发现，自己的续编标为想象；未做如实写。',
    ),
    record(
      'creation-record',
      '记录作品名称、所用片、展示对象角色和真实反馈，未展示如实写；不要求姓名或照片。',
    ),
    record(
      'reflection',
      '回顾本页四项活动，还有哪一步待做或需核对？不自动评星或认定全部教材已学会。',
    ),
    record(
      'plan',
      '记录下一次想改的作品或想试的选片；计划另存，不算这次实际操作。',
    ),
  ],
  reviewQuestions: [
    task(
      'review-two-number',
      '换成转半圈的完整1/2图，2号纸片有几片？这次问指定编号，不问总材料数。',
      { kind: 'number', value: 1 },
      '原编号2只出现一片，转向不增片。',
      diagram('large-triangle', 'review'),
    ),
    task(
      'review-two-zero',
      '同一完整只给1/2的图，6号纸片有几片？不猜存在隐藏材料。',
      { kind: 'number', value: 0 },
      '这份清单里没有6号，为0。',
      diagram('large-triangle', 'review'),
    ),
    choose(
      'review-small-material',
      '另换转半圈的4/6拼组图，内部缝两边的原材料是哪类？',
      ['三角形', '圆形', '正方形'],
      '三角形',
      '两块原小三角保持形状，不从合成名推材料片数。',
      diagram('small-triangle', 'review'),
    ),
    choose(
      'review-other-pair',
      '同伴用了其它三角选片，只要确实各拼出两组更大三角形，就必须因不是本站两例判错吗？',
      ['不必，核对实际外轮廓和材料', '必须，编号例子就是唯一规则'],
      '不必，核对实际外轮廓和材料',
      '示例不是唯一答案，实际检查各组合法拼合。',
    ),
    choose(
      'review-imagination',
      '新的讲述加入原画没显示的后续情节，怎样记录？',
      ['说明是自己的想象续编', '写成原画已明确发生'],
      '说明是自己的想象续编',
      '合理创作可保留，不能冒充原图事实。',
    ),
    choose(
      'review-feedback',
      '同伴说下次想把作品转一下，还没动手，这次记录应放哪里？',
      ['未来计划，未当已经修改', '已完成修改并展示'],
      '未来计划，未当已经修改',
      '说出计划不等于实际发生。',
    ),
  ],
};
