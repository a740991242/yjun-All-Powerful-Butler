import type { BnuTangramVisual } from '../learning/bnu-tangram';
import type { Lesson, Question, Visual } from '../learning/types';

const id = 'bnu-lower-tangram-patterns';
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
    hint: '回原81页所指图框看完整片边，不从物品名或颜色猜形；实际拼摆、合作和想象分别记录。',
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
    '实际完成本项才确认；只看网页、只想好或没有材料请跳过。纸卡替代、成人协助、未合作如实记录，不自动认原书实做完成。',
  );
const record = (suffix: string, prompt: string) =>
  task(
    suffix,
    prompt,
    { kind: 'reflection' },
    '保存开放原话，正确性为null；合理名称和故事不限定一种，未看或未拼如实写，未来计划另存。',
  );

/** Each frame is located independently in the original two-by-three array; names stay open. */
export const bnuLowerTangramPatternFrames = [
  {
    key: 'top-left',
    location: '上排左',
    guide: '从左端外轮廓开始，逐片看中间和右端；把整体朝向与单片朝向分开。',
  },
  {
    key: 'top-middle',
    location: '上排中',
    guide: '从最上方的一片开始，再看下方相接部分；竖着排列不是新形状类别。',
  },
  {
    key: 'top-right',
    location: '上排右',
    guide: '先看上方片与下方横排片，再看它们是否边接；空白图框不是新增的一片。',
  },
  {
    key: 'bottom-left',
    location: '下排左',
    guide: '沿从上部到下部弯折的外轮廓看，最后再核右端；中间接缝不能当新纸片。',
  },
  {
    key: 'bottom-middle',
    location: '下排中',
    guide: '先看顶部宽的拼组，再看中间和底部；一片斜放不因朝向改变名称。',
  },
  {
    key: 'bottom-right',
    location: '下排右',
    guide: '从最高处看向中间，再看最下方与左右伸出部分；每片完整边界分别核对。',
  },
] as const;

export const bnuLowerTangramPatternsLesson: Lesson = {
  id,
  textbookTitle: '动手做（二）',
  title: '六幅试拼、开放命名与合作故事',
  page: 81,
  version: 1,
  status: 'available',
  goal: '从咏鹅选图实际拼说，按原序逐幅完成六种试拼与开放命名，再真实想故事、合作、拼摆和讲述。',
  prerequisite:
    '认识原编号七片和三类形状，能保持单片形状大小并区分拼成整体与材料。',
  parentTip:
    '回教材资源查看原80页咏鹅图和81页六框及合作示例；本课不打包原插画。本站鹅头选片仅展示原对话的平行四边形与三角形这两类，不冒原鹅头姿势比例；鱼头1/2是两个大三角的原创接法，不冒全鱼或原配色。六幅原试拼各自定位、操作、命名，合理名称不预设唯一答案；原题未要求每幅全用七片。乌鸦喝水仅故事例子，不限定故事；单人练说与真实合作分清，不要求同伴姓名或学校资料。',
  review: {
    date: '2026-10-06',
    reviewer: '实际查看公开扫描80～82页；原页内容核对与原创教学制作',
    notes:
      '原81三活动、六框逐一接入；本页六框逐项对应，与82练习独立；不由本课认整册或全年完成。',
  },
  steps: [
    {
      title: '从咏鹅图选一部分，拼好再说',
      text: '回原80页咏鹅画面，从房子、鹅或小鱼中选一个喜欢的部分，实际取片尝试。先指选定部位，再逐片沿完整边看，转动片子而不拉伸。原81两段话说的是鹅头和鱼头，不能拿头部的选片推断整只动物全部用哪些片；草云水等背景不算材料。',
      activity: '实际选定原画一个部分，拼一拼并说明自己所选的部分和材料。',
    },
    {
      title: '两段对话：头部、整体、单片分清',
      text: '原对话说平行四边形与三角形拼在一起组成鹅头；本站图只把3号与4号这两类摆在一起供指认，不复制原鹅头姿势或比例，也不把每个三角片都限定4号。另一个对话说小鱼头用两个大三角拼成。回原画核对头部，实际看完整边，不凭鱼或鹅的名称、颜色猜。',
      visual: diagram('goose-head'),
      activity: '回原画核对两段对话，分别指出鹅头所说两类与鱼头所说两大三角。',
    },
    {
      title: '两个大三角可以拼出一个整体',
      text: '本站1号与2号摆出一个三角整体，是两大三角拼组的例子。原材料仍两片，不变成一片；图只说明选片与接合，不冒整只小鱼。把头部、身体、背景分别看，物品名相同也不保证全部部件都同一类。',
      visual: diagram('fish-head'),
      activity: '实际比较两片与拼成整体，回原图看鱼头与整鱼的范围差别。',
    },
    ...bnuLowerTangramPatternFrames.map((frame, i) => ({
      title: `第${i + 1}幅：原${frame.location}框`,
      text: `回原81页试一试第${i + 1}幅（${frame.location}），不要跳到其它框。${frame.guide}先挑片，再转摆、查边，最后说自己觉得像什么和理由。图名开放，不先公布唯一名称；原图所用片实际逐片核对，不补“必须七片全用”的规则。完成这一幅不自动代表其它五幅也做过。`,
      activity: `实际试拼第${i + 1}幅，分别记录自己的命名、用片与修改；未看到该原图可待做。`,
    })),
    {
      title: '想一个故事，例子不是唯一选择',
      text: '原最后一项与同伴合作想一个故事，用七巧板拼图；乌鸦喝水是示例，也可选另一个喜欢的故事。先想角色和要表现的事情，再决定取哪些片；听过、想好、拼出、讲过是不同阶段。可以回原乌鸦图指不同部位用什么形状，不把瓶子与水线等场景道具一律加成七巧板片。',
      activity: '实际想出准备表现的故事与角色，区分自己想象和原示例。',
    },
    {
      title: '合作和拼摆各自真实完成',
      text: '与同伴商量各自想法和怎样摆，听对方建议，再实际拼出选定故事的图案。可分工取片、查边或讲述，不预设必须几人或谁负责某角色。不要求记录身份；没有同伴可单人尝试并如实记，不能勾选已经合作。每片保持形状大小，真实材料与本站图示分清。',
      activity: '实际交流想法并拼故事图；合作与拼图两项分别确认。',
    },
    {
      title: '指图讲故事，再记发现和下一次',
      text: '用拼好的图案讲自己的故事，指出角色部位和所用片，说一次真实修改。合理叙述和作品名称不只准一种；续编说明是想象。记录六幅试拼哪里做过、哪里还待做，未来想再拼什么另存计划，不把网页分数当全部实做或掌握。',
      activity: '实际指自己的故事作品讲述，保留开放原话，不强制上传照片。',
    },
  ],
  questions: [
    choose(
      'head-range',
      '原鱼头对话说明两个大三角，能直接推出整只鱼也只有这两片吗？',
      ['不能，头部与整鱼范围不同', '能，鱼名相同就同范围'],
      '不能，头部与整鱼范围不同',
      '先按选定部位观察，不能把部分材料当全部。',
    ),
    choose(
      'goose-categories',
      '原鹅头对话说明合用哪两类图形？',
      ['平行四边形与三角形', '正方形与圆形', '两个圆形'],
      '平行四边形与三角形',
      '按原对话与完整片边核对，本站3/4仅两类选片示例。',
      diagram('goose-head'),
    ),
    task(
      'fish-pieces',
      '本站完整鱼头选片示意只给1/2，材料共有几片？不按合成外轮廓数。',
      { kind: 'number', value: 2 },
      '原编号1/2各一片，共两片材料。',
      diagram('fish-head'),
    ),
    task(
      'site-zero',
      '同一完整只给1/2的选片清单中，平行四边形纸片有几片？没有隐藏片。',
      { kind: 'number', value: 0 },
      '给定两片均三角形，平行四边形0；未填不当0。',
      diagram('fish-head'),
    ),
    choose(
      'open-name',
      '原试一试问像什么，合理指出依据的不同名称可以保留吗？',
      ['可以，不限定唯一名字', '不可以，只准老师固定名字'],
      '可以，不限定唯一名字',
      '开放表达看实际图案与说明，不预置唯一名称。',
    ),
    choose(
      'all-seven',
      '原每幅试拼是否都明确要求七片全部用完？',
      ['没有，不补限制', '有，任何少用都错'],
      '没有，不补限制',
      '按实际图中用片核对，不能从七巧板总数补每幅规则。',
    ),
    choose(
      'six-independent',
      '只完成原上排左一幅，能确认六幅都试拼过吗？',
      ['不能，其它五幅分别待做', '能，同类任务算全做'],
      '不能，其它五幅分别待做',
      '六幅分别操作与记录，不能一幅代替六幅。',
    ),
    choose(
      'story-choice',
      '合作故事只能乌鸦喝水，不允许其它故事吗？',
      ['不是，乌鸦喝水是例子', '是，其它故事都错误'],
      '不是，乌鸦喝水是例子',
      '先实际想故事再拼，例子不限定唯一。',
    ),
    choose(
      'cooperation-proof',
      '一个人点网页并想好故事，能自动证明已经合作和拼摆吗？',
      ['不能，真实动作分开记录', '能，想好就等于合作拼好'],
      '不能，真实动作分开记录',
      '思考、合作、拼摆和讲述各自独立。',
    ),
    choose(
      'shape-preserved',
      '为了像一个物品，能把七巧板某片拉长后说原片形状仍不变吗？',
      ['不能，保持原片形状大小', '能，像物品即可'],
      '不能，保持原片形状大小',
      '转摆不拉伸，纸卡改裁与原片任务分清。',
    ),
    actual(
      'actual-favourite',
      '实际回咏鹅原图选喜欢的一个部分拼说，核对选定范围及片形；未看原图或未拼请跳过。',
    ),
    ...bnuLowerTangramPatternFrames.map((frame, i) =>
      actual(
        `actual-frame-${i + 1}`,
        `实际回原81页第${i + 1}幅（${frame.location}）逐片观察、取片试拼并说明像什么；只完成其它框不能确认本框。`,
      ),
    ),
    actual(
      'actual-story-invent',
      '实际想一个准备表现的故事与角色，不限乌鸦喝水；只有下次计划请跳过。',
    ),
    actual(
      'actual-story-cooperate',
      '实际与同伴讨论故事及摆法，听取对方想法；单人练习请跳过，不填姓名。',
    ),
    actual(
      'actual-story-assemble',
      '实际用材料拼出选定故事图案，查片形和接合；只有想好或网页答题请跳过。',
    ),
    actual(
      'actual-story-tell',
      '实际指自己拼好的图讲故事并说明所用图形，想象续编如实说明；未讲请跳过。',
    ),
    record(
      'favourite-record',
      '记录原画所选部位、选片与实际发现；本站示意与原画比例不混，未看如实写。',
    ),
    ...bnuLowerTangramPatternFrames.map((frame, i) =>
      record(
        `frame-record-${i + 1}`,
        `单独记第${i + 1}幅（${frame.location}）自己认为像什么、依据、用片及实际调整；开放命名不照抄固定名称，未做如实写。`,
      ),
    ),
    record(
      'story-record',
      '记录真实故事、角色、选片、合作方式和讲述，观察与续编分清；没有同伴或未拼如实写。',
    ),
    record(
      'reflection',
      '回顾六幅分别完成了哪些，还有哪些要核对？不自动评星或认定整课完成。',
    ),
    record('plan', '记录下一次想试的故事或摆法；未来计划不当这次已做。'),
  ],
  reviewQuestions: [
    task(
      'review-selected-id',
      '换成转半圈的完整1/2选片图，1号有几片？这次问指定编号。',
      { kind: 'number', value: 1 },
      '1号仍一片，不照抄材料总数2。',
      diagram('fish-head', 'review'),
    ),
    task(
      'review-goose-zero',
      '另换完整只给3/4的两片图，5号有几片？没有隐藏材料。',
      { kind: 'number', value: 0 },
      '完整清单没有5号，指定编号数量为0。',
      diagram('goose-head', 'review'),
    ),
    choose(
      'review-goose-triangle',
      '同一转向3/4选片图，4号的完整边界属于哪类？',
      ['正方形', '三角形', '圆形'],
      '三角形',
      '朝向改变，原4号三角形类别保持。',
      diagram('goose-head', 'review'),
    ),
    choose(
      'review-remaining',
      '新记录里只做完上排三幅、下排未试，应怎样记？',
      ['三幅已试，下排三幅待做', '六幅全部完成'],
      '三幅已试，下排三幅待做',
      '每框独立，真实范围不扩大。',
    ),
    choose(
      'review-rename',
      '同伴给自己的新作品起不同合理名字并指图解释，需要因不是原示例名而判错吗？',
      ['不需要，保留合理表达', '需要，作品只能原示例名'],
      '不需要，保留合理表达',
      '开放名称看依据，示例不是固定唯一答案。',
    ),
    choose(
      'review-next-time',
      '新故事还没拼，只说下次与家人试，应记为哪一种？',
      ['未来计划，未记已合作拼好', '本次合作拼摆已完成'],
      '未来计划，未记已合作拼好',
      '计划与实际阶段分开。',
    ),
  ],
};
