import type { BnuTangramVisual } from '../learning/bnu-tangram';
import type { Lesson, Question, Visual } from '../learning/types';

const id = 'bnu-lower-tangram-recognize';
const diagram = (
  scene: BnuTangramVisual['scene'],
  variant: BnuTangramVisual['variant'] = 'main',
): BnuTangramVisual => ({ kind: 'bnu-tangram', scene, variant });
const names = {
  triangle: '三角形',
  parallelogram: '平行四边形',
  square: '正方形',
} as const;
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
    hint: '先看本题选定的完整纸片和原编号，形状与大小分开；缺少条件不猜0。本站示意与实际描拼分别记录。',
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
    '实际完成本项才确认；未做或只有计划请跳过。替代纸卡或成人协助如实说明，不自动认定已完成原书操作。',
  );
const record = (suffix: string, prompt: string) =>
  task(
    suffix,
    prompt,
    { kind: 'reflection' },
    '用自己的话记实际发现或尚未做过，不自动判正确或完成。',
  );

/** Printed page 80; publication verification is recorded separately. */
export const bnuLowerTangramRecognizeLesson: Lesson = {
  id,
  textbookTitle: '动手做（二）',
  title: '认识七巧板、比同形与描三类',
  page: 80,
  version: 1,
  status: 'available',
  goal: '按原编号逐片认形，完整填写四空，区分形状与大小并比较两对同形等大片，实际描说三种不同轮廓。',
  prerequisite: '认识三角形和正方形，能逐个点数并理解同一张纸转向不增加数量。',
  parentTip:
    '本课范围仅原80页；81～82的六幅试拼、合作故事与练习后续独立课程，不因本页图示完成就算三页全课完成。三角形任选已给三角片描，本站图3/5/7只是一个示例；不要求所有家庭有同款材料或学校资料。本站原创几何保持原编号与同一比例，不复制原插图、配色或厘米。故事背景回原书共读，不补造原页未署的作者、发明者或精确发明年代。',
  review: {
    date: '2026-10-06',
    reviewer:
      '实际查看第三方公开扫描80页与80～82来源记录；原页内容核对与原创教学制作',
    notes:
      '原编号和四空3/5/2/6核对；本页两原活动展开，本页两活动与后续81～82独立课分开，不由本页认全年完成。',
  },
  steps: [
    {
      title: '从原房子和动物图认识材料',
      text: '先回原80页咏鹅画面，观察小房子和小动物由哪些板子拼成。草、云、水线是场景，不把它们都加作七巧板纸片。本课不复制原插画，下面重画原编号的七片正方形布局；观察原画与看本站编号图是不同任务。旁边巧桌的背景读物可以与成人共读，不把故事年份当题目里的纸片数量。',
      visual: diagram('square'),
      activity: '实际回原画观察房子和动物，区分板子与场景；没有原书请待做。',
    },
    {
      title: '分开看仍是同样七片',
      text: '本站把七片移开成清单，原编号1～7保持。每片只有一个编号，转动和分散不增加片数；空隙不是新的一块。原装合的外框是整体，不能把这个大正方形再算作第八片。所有本站图使用同一比例，但不是实际厘米。',
      visual: diagram('spread'),
      activity: '实际逐片指编号，与原七片清单对照，不漏或重记。',
    },
    {
      title: '五片都是三角形，大小不一样',
      text: '1、2、4、6、7号各有完整三角轮廓，共五片。1、2较大，4、6较小，7居中；大中小是大小比较，不是三种形状。原编号不能按另一个七巧板常用编号替换，不能因为颜色不同把同类改名。',
      visual: diagram('spread'),
      activity: '实际从材料中取出全部五片三角形，逐片看完整边界，再比较大小。',
    },
    {
      title: '3号是原已给的平行四边形',
      text: '原书已告诉3号是平行四边形，沿这片完整四条边看。它与三角形不同，也不能把每个四边形都叫正方形。本站保持3号的斜四边轮廓，转向以后编号和形状都不变；不要求用角度数字证明。',
      visual: diagram('square'),
      activity: '实际找3号，沿它的完整边界指一圈并说名称。',
    },
    {
      title: '5号转着放仍是正方形',
      text: '5号在原装合图里斜放，但仍是正方形；不能因为斜放就叫平行四边形，也不按颜色猜。比较3号和5号各自的完整边界，拼缝与整套外框分清。七片分为三角形、平行四边形、正方形三种，不把大中小另加类别。',
      visual: diagram('square'),
      activity: '实际找5号转一转，再与3号比形；转同一片不另添片。',
    },
    {
      title: '拿起来转一转，比较两对',
      text: '1号和2号同形同大，4号和6号也同形同大。可以拿起对应两片，转一转、叠一叠，检查边能否完全对应。方向不同不表示不同形；只同为三角形也不表示大小一样，7号不能直接替代4号。网页同比例图供观察，不自动确认已实际叠合。',
      visual: diagram('spread'),
      activity:
        '实际分别比较1/2、4/6两对，保留自己观察，不用一对结果代替另一对。',
    },
    {
      title: '四个空完整填写并回图检查',
      text: '原第一句是三种图形，其中五个三角形；后一句1号和2号、4号和6号完全一样。四空依次3、5、2、6，每空所问不同：类别数、三角片数、配对编号、配对编号。填完四空再回原七片图检查，不把编号6当三角形总数。',
      visual: diagram('square'),
      activity: '实际回原书完成全部四空并核对；网页四题不自动记纸面已做。',
    },
    {
      title: '三块不同形状，不是三个不同大小',
      text: '原第二项从七巧板找三块不同形状，分别描一描、说一说。要有一个正方形、一个平行四边形和一个三角形；三角形可从1/2/4/6/7任选，不只准7号。本站拿3/5/7重排作一例。选大中小三个三角形仍只有一种形状，不满足本项三种不同形状。',
      visual: diagram('trace'),
      activity:
        '实际选三类各一片描出轮廓；材料不足可注明纸卡替代或待做，不要求购买。',
    },
    {
      title: '描出的轮廓分别说，记录还想试的',
      text: '描时固定板子沿完整外边走，拿开后看纸面轮廓，再分别说三种名称和所用编号。描图是平面轮廓，不是又增加一个真实七巧板部件；3号的斜边不能改画成直角方框。三类都实际描说后才确认；接下来原81～82的试拼和故事是后续内容，本页完成不当全部学会。',
      activity: '实际分别描和口述三类，记录所选三角片与发现；未来计划另记。',
    },
  ],
  questions: [
    ...(
      [
        ['1', 'triangle'],
        ['2', 'triangle'],
        ['3', 'parallelogram'],
        ['4', 'triangle'],
        ['5', 'square'],
        ['6', 'triangle'],
        ['7', 'triangle'],
      ] as const
    ).map(([number, shape]) => ({
      ...task(
        `piece-${number}`,
        `看完整编号图，${number}号这片是哪类？只看这一片的完整边界。`,
        { kind: 'choice', value: shape },
        `${number}号是${names[shape]}；朝向和颜色不改变类别。`,
        diagram('square'),
      ),
      choices: Object.entries(names).map(([id, label]) => ({ id, label })),
    })),
    task(
      'blank-kinds',
      '原四空第1空：七巧板由几种图形组成？大中小不另算类别。',
      { kind: 'number', value: 3 },
      '三角形、平行四边形、正方形三种。',
      diagram('square'),
    ),
    task(
      'blank-triangles',
      '原四空第2空：完整七片里有几个三角形？逐片数。',
      { kind: 'number', value: 5 },
      '1/2/4/6/7各一片，共5。',
      diagram('square'),
    ),
    task(
      'blank-large-pair',
      '原四空第3空：1号与哪一号完全一样？填写编号。',
      { kind: 'number', value: 2 },
      '1号与2号同形同大，拿起转动可叠合。',
      diagram('square'),
    ),
    task(
      'blank-small-pair',
      '原四空第4空：4号与哪一号完全一样？填写编号。',
      { kind: 'number', value: 6 },
      '4号与6号同形同大，不用7号代替。',
      diagram('square'),
    ),
    task(
      'total',
      '原七片分开后，一共几片？每编号一片，空隙不算。',
      { kind: 'number', value: 7 },
      '1到7各一片，分开不增加数量。',
      diagram('spread'),
    ),
    task(
      'site-zero',
      '本站另问：已给完整七片，其中圆形纸片有几片？条件完整，未填不当0。',
      { kind: 'number', value: 0 },
      '给定完整七片没有圆形纸片，圆形为0片；场景里的圆不额外计入材料。',
      diagram('square'),
    ),
    choose(
      'different-shapes',
      '任选大、中、小三块三角形，是否已经满足原描三种不同形状？',
      ['没有，大小不同仍同类', '有，三个大小就是三类'],
      '没有，大小不同仍同类',
      '需要三类各一块，任一三角片都可作三角形例子。',
    ),
    choose(
      'turn-square',
      '把5号正方形转成斜放，它就变成3号那种形状吗？',
      ['不会，只改变朝向', '会，斜放都同类'],
      '不会，只改变朝向',
      '同一片形状不因转动改变。',
      diagram('square'),
    ),
    choose(
      'same-category',
      '7号和4号都三角形，就一定是完全一样大小吗？',
      ['不一定，本套这两片大小不同', '一定，所有三角形等大'],
      '不一定，本套这两片大小不同',
      '形状类别与同形同大配对分别判断。',
      diagram('spread'),
    ),
    actual(
      'actual-source-scene',
      '实际回原80页观察小房子、小动物和材料图，区分纸片与草云水等场景；未看请跳过。',
    ),
    actual(
      'actual-large-pair',
      '实际取1/2两片转动叠合并检查同形同大；只看网页请跳过。',
    ),
    actual(
      'actual-small-pair',
      '实际另取4/6两片转动叠合并检查，不用1/2结果代替；未做请跳过。',
    ),
    actual(
      'actual-four-blanks',
      '实际在原页或纸面完成全部四空3/5/2/6并回材料检查；纸面方式如实说明。',
    ),
    actual(
      'actual-trace-square',
      '实际选正方形片固定描完整边界，再看拿开后的轮廓；未描请跳过。',
    ),
    actual(
      'actual-trace-parallelogram',
      '实际选平行四边形片描完整斜边轮廓，不改为直角方框；未描请跳过。',
    ),
    actual(
      'actual-trace-triangle',
      '实际任选本套一块三角形描完整轮廓并说明编号，不只准7号；未描请跳过。',
    ),
    actual(
      'actual-say-three',
      '实际分别指自己描出的三种轮廓，说各名称和所用编号；只描未说请跳过。',
    ),
    actual(
      'actual-background',
      '本站可选：实际与成人共读原页巧桌背景读物，未读或只有计划请跳过。',
    ),
    record(
      'compare-record',
      '记录实际比较两对的发现或未试，方向变化与边的对应分别说明。',
    ),
    record(
      'trace-record',
      '记录自己选的三类片和三角片编号、描后的发现；没有实物或未描如实写。',
    ),
    record(
      'reflection',
      '记录本页仍想核对的轮廓或收获，不自动评星或认定全部七巧板活动已掌握。',
    ),
    record('plan', '记录下一次想试的拼图；81～82后续或未来计划不当已完成。'),
  ],
  reviewQuestions: [
    task(
      'review-subset-count',
      '换成只给3/5/7三片并转半圈的完整图，这里共有几片？不照抄原七片总数。',
      { kind: 'number', value: 3 },
      '现在只给三片，原编号保留不表示这里有七片。',
      diagram('trace', 'review'),
    ),
    task(
      'review-subset-triangles',
      '同一新三片图里，三角形纸片有几片？不照抄原5。',
      { kind: 'number', value: 1 },
      '只给3/5/7，其中只有7号是三角形。',
      diagram('trace', 'review'),
    ),
    task(
      'review-subset-square',
      '同一新三片图里，正方形纸片有几片？',
      { kind: 'number', value: 1 },
      '只有5号，转半圈不改变形状。',
      diagram('trace', 'review'),
    ),
    task(
      'review-two-count',
      '再换完整只给1/2的拼组图，仍按材料片数数有几片？内部缝不可漏。',
      { kind: 'number', value: 2 },
      '1/2仍两片，整体外轮廓不是一片材料。',
      diagram('large-triangle', 'review'),
    ),
    task(
      'review-two-zero',
      '只给1/2的完整两片图里，7号纸片有几片？没有隐藏材料。',
      { kind: 'number', value: 0 },
      '图已给完整两片清单，没有7号，为0。',
      diagram('large-triangle', 'review'),
    ),
    choose(
      'review-replace-triangle',
      '新的三类描形任务，把选的7号换成4号，仍保留3/5，这样还满足三种不同形状吗？',
      ['满足，仍三类各一片', '不满足，必须只用7号'],
      '满足，仍三类各一片',
      '原三角形可任选一片，不固定示例7号。',
    ),
    choose(
      'review-not-proof',
      '同伴只说做过三个大小的三角形描图，就能确认已描原要求的三种不同形状吗？',
      ['不能，需要核对三类轮廓', '能，三块就够'],
      '不能，需要核对三类轮廓',
      '数量和不同形状类别是两项条件。',
    ),
  ],
};
