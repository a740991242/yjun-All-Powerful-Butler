import type { Lesson, Question, Visual } from '../learning/types';

const id = 'bnu-lower-final-geometry';
const visual = (
  scene: 'diagonal' | 'dots' | 'parallel' | 'robot' | 'square-part' | 'train',
  variant: 'main' | 'review' = 'main',
): Visual => ({ kind: 'bnu-final-geometry', scene, variant });
const planes: Visual = {
  kind: 'plane-cards',
  cards: [
    { shape: 'rectangle', size: 2, turn: 0 },
    { shape: 'circle', size: 1, turn: 0 },
    { shape: 'square', size: 1, turn: 45 },
    { shape: 'triangle', size: 2, turn: 90 },
  ],
};
const q = (
  key: string,
  prompt: string,
  rule: Question['rule'],
  explanation: string,
  figure?: Visual,
): Question => ({
  id: `${id}-${key}`,
  knowledge: id,
  prompt,
  rule,
  explanation,
  hint: '先区分平面图形与立体物体，核对完整边界、方向和所问范围；本站示例不代教材原图或真实操作。',
  ...(figure ? { visual: figure } : {}),
});
const choices = (
  key: string,
  prompt: string,
  correct: string,
  options: [string, string][],
  explanation: string,
  figure?: Visual,
): Question => ({
  ...q(key, prompt, { kind: 'choice', value: correct }, explanation, figure),
  choices: options.map(([id, label]) => ({ id, label })),
});
const clear = (
  key: string,
  prompt: string,
  labels: [string, string],
  explanation: string,
  figure?: Visual,
) =>
  choices(
    key,
    prompt,
    'clear',
    [
      ['clear', labels[0]],
      ['other', labels[1]],
    ],
    explanation,
    figure,
  );
const actual = (key: string, prompt: string) =>
  q(
    key,
    prompt,
    { kind: 'manual' },
    '真实完成这一项才确认；网页识别不自动确认纸面作画、原书核对、折纸或展示。可请家人协助或安全替代并说明，未做可跳过。',
  );
const record = (key: string, prompt: string) =>
  q(
    key,
    prompt,
    { kind: 'reflection' },
    '保留实际作品、方法和未核清之处的原话，correct为null，不定唯一设计或评统一表现；计划另列。',
  );
const faceChoices: [string, string][] = [
  ['rectangle', '长方形'],
  ['square', '正方形'],
  ['triangle', '三角形'],
  ['circle', '圆'],
];
const cube: Visual = { kind: 'solid-face-traces', solid: 'cube' };
const prism: Visual = { kind: 'solid-face-traces', solid: 'triangular-prism' };
const cuboid: Visual = { kind: 'solid-face-traces', solid: 'cuboid-distinct' };
const cylinder: Visual = { kind: 'shape', shape: 'cylinder' };
export const bnuLowerFinalGeometryLesson: Lesson = {
  id,
  title: '图形取面、三种折分与自己的拼图',
  textbookTitle: '总复习：图形与几何',
  page: 93,
  version: 1,
  status: 'available',
  goal: '回忆描述并画学过的图形，逐幅观察三个人物拼图，核对机器人与火车的四类图形，联系立体物体和平面面形，分别折分一张长方形，并完成三种点子图作画和自主创作。',
  prerequisite:
    '认识长方形、正方形、三角形、圆，以及正方体、长方体、圆柱；准备纸笔、七巧板或纸卡，折纸不要求剪刀。',
  parentTip:
    '93～94七项原活动分别保留。网页机器人/火车是边界明确的本站原创练习，不把数量代填原书；原图模糊分界须结合纸书核对并如实记录。三人物、四面连线、三种折分与三种作画各项分别做；附页未给厘米，不用扫描比例量实际尺寸。通用教学不以学校或指定审校人为前置。',
  review: {
    date: '2026-10-06',
    reviewer: '实际查看公开扫描印刷93、94页及附页97图3',
    notes:
      '七原活动逐项映射；原93页火车放大逐件核对为5/1/1/4；机器人计数分界未核清项保留，不冒全册/全年或人工最终审校。',
  },
  steps: [
    {
      title: '回顾学过的四类平面图形',
      text: '按边与轮廓说长方形、正方形、三角形和圆。正方形转斜仍是正方形；大小、颜色和方向不单独决定类别。本站四卡为重新绘制的例子，A长方形、B圆、C斜正方形、D转向三角形。',
      visual: planes,
      activity: '实际用自己的语言分别描述四类图形。',
    },
    {
      title: '自己画图，不能只说名称',
      text: '在纸上分别画这四类图形，圈没有直边和角，三角形闭合有三条直边，正方形四边同长且四角为直角，长方形核对直角和对边。可先描安全纸卡，再独立画；记录实际完成的情况。',
      activity: '实际分别画四类，并说明自己的核对方法。',
    },
    {
      title: '三个人物分别找材料，再自主设计',
      text: '观察原93页溜冰、踢球、跳舞三个图案，分别指认三角形、正方形和平行四边形材料；平行四边形这项是七巧板已有材料，不因为四条边就叫长方形。原人物轮廓与材料片分清，选用七巧板或纸卡自己再设计一幅，名称和故事允许不同。本站展开七片只是材料参照，不冒原三个人物的姿势或编号。',
      visual: { kind: 'bnu-tangram', scene: 'spread', variant: 'main' },
      activity: '分别观察三图，再实际设计自己的图案。',
    },
    {
      title: '机器人：原书核对与本站例子分开',
      text: '原93页机器人要求分别找长方形、正方形、三角形、圆，按完整轮廓核对，眼鼻和细小连接处也先确定边界。模糊之处到清楚的纸书核对，不猜唯一数。本站示例另设15长方形、2正方形、2三角形、6圆：两根天线、两耳、一颈、两上臂、两下臂、两短裤片、两腿和两脚共15长方形；头与身体两个正方形，鼻与胸内两个三角形，眼/手/天线顶各两个圆。内部胸片和身体外框各是独立画出的轮廓，不再虚构其它材料。',
      visual: visual('robot'),
      activity: '在实际教材机器人图中逐类标记核对，并单独记录原图结果。',
    },
    {
      title: '火车：只按所画边界计数',
      text: '原93页火车已放大逐件核对：后车身、车窗、前车身、前蓝块和烟囱为5个长方形，驾驶室为1个正方形，前导向为1个三角形，4个车轮为圆。每个完整轮廓只计一次，边框不拆成额外细长材料，也不把整个车头外接轮廓重复加算。本站原创火车保留相同分类数量，但比例和画法不同；核对教材时仍要逐件指出部件，不能只背本站答案。',
      visual: visual('train'),
      activity: '实际核对教材火车的四类图形，说明自己采用的分界。',
    },
    {
      title: '正方体：从物体的面得到图形',
      text: '第94页连线先区分物体与面。正方体有平的正方形面，可以描其中一个面得到正方形；物体并不变成一张纸。本站面迹图展示同一个物体的不同面，不把画了几个面当多个正方体。',
      visual: cube,
      activity: '实际找正方体面并与原连线核对。',
    },
    {
      title: '三棱柱：三角形来自平的端面',
      text: '原题三角形可以从三棱柱的三角形端面得到，侧面还有长方形。透视画面和实际面形不同，不能拿斜画轮廓看着像别的形状就改实际面。只描平的面，不拿圆锥尖端或物体阴影混代。',
      visual: prism,
      activity: '实际指出三棱柱端面，并核对对应图形。',
    },
    {
      title: '长方体：不要推广所有面都同样',
      text: '原连线长方形可来自长方体平面。本站模型三条棱长不同，各面都是长方形；另有两条棱同长的长方体可能有正方形面，不能一句话认所有长方体都没有或都有正方形面。具体物体要实际看。',
      visual: cuboid,
      activity: '实际找到长方体一个平面并核对连线。',
    },
    {
      title: '圆柱：描平的底面得到圆',
      text: '圆来自圆柱平的底面。图上底面因透视画成椭圆，真实底面仍是圆；曲侧面、滚出的线和影子不能代替平底面的轮廓。原四形与四物体各连线核对，不只确认这一项就说全做完。',
      visual: cylinder,
      activity: '实际核对四项连线，逐个说明所取的面。',
    },
    {
      title: '从一张完整长方形分出两个三角形',
      text: '用附页图3长方形或自己的长方形纸，先连接一组相对角并折出这条分界，再展开核对两个三角形。本题说分区，不强制剪开；非正方形两侧虽是全等三角形，也不能说沿对角线翻折两半必能完全叠合。本站示意长宽比例另设，坐标是绘图单位，不是原书厘米。',
      visual: visual('diagonal'),
      activity: '实际折分并展开，分别描说两个三角形。',
    },
    {
      title: '另取一张：分成两个长方形',
      text: '重新从完整长方形开始，取一条与长边平行的中间折痕，展开得两个较扁长方形。本站A/B外部边界和中间折痕可核对，不把折痕当第三片或用上一项已经剪断的纸冒新任务。其它合法折法可说明，不限制唯一方式。',
      visual: visual('parallel'),
      activity: '实际完成两个长方形的分区，说明每一块边界。',
    },
    {
      title: '再重新开始：一个正方形和一个长方形',
      text: '按纸的短边在长边上取同长一段，利用折叠对齐作标记，再折出垂直分界，展开核对一块四边同长、四角直角的正方形，余下一块长方形。本站A为正方形、B为长方形，不依像素量实际厘米。纸若长边恰是短边的两倍，会余下另一个正方形，不能不检查就称剩余长方形；这里按原小学分类不把正方形重复计为长方形。',
      visual: visual('square-part'),
      activity: '实际第三次折分，核对两块形状和完整覆盖。',
    },
    {
      title: '空白点子图：三种作画分别完成',
      text: '第94页点子图6行11列，本站只重画同排列，不预填笔画或尺寸。分别画长方形、正方形、三角形并核对闭合边界；点可作为顶点位置，线的中间经过的点不是新增角，背景点不算图形材料。纸面可有不同大小位置，三形不要求本站唯一坐标。',
      visual: visual('dots'),
      activity: '在纸上点子图分别完成三形，核对并保留作品。',
    },
    {
      title: '用学过的平面图形创作自己的拼图',
      text: '原第94页示例用于观察生活场景和材料运用，不要求照抄完整现代插画。选择纸片安全拼出自己的图案，说明所用形状和故事，再向实际在场的人展示。外轮廓不同于材料形状，作品不必须像本站机器人或火车；没展示就如实待做。',
      activity: '实际创作并真实展示自己的图形拼图。',
    },
    {
      title: '记录方法、疑问与下一步',
      text: '写实际说画、找图形、取面、三次折分、三种作画和创作展示的收获。未核清的教材细小分界保留原话，不用本站数字代填。计划另列，网页正确题数不证明已经完成全部纸面活动。',
      activity: '记录实际方法和待做事项。',
    },
  ],
  questions: [
    choices(
      'plane-circle',
      '四卡中圆是哪一张？',
      'B',
      [
        ['A', 'A'],
        ['B', 'B'],
        ['C', 'C'],
        ['D', 'D'],
      ],
      'B是完整圆轮廓。',
      planes,
    ),
    choices(
      'plane-square',
      '四卡中转斜后仍是正方形的是？',
      'C',
      [
        ['A', 'A'],
        ['B', 'B'],
        ['C', 'C'],
        ['D', 'D'],
      ],
      'C的四边同长、角仍为直角，旋转不改类别。',
      planes,
    ),
    choices(
      'plane-triangle',
      '四卡中三角形是哪一张？',
      'D',
      [
        ['A', 'A'],
        ['B', 'B'],
        ['C', 'C'],
        ['D', 'D'],
      ],
      'D三条直边闭合，方向不影响。',
      planes,
    ),
    choices(
      'plane-rectangle',
      '四卡中按小学本题分类的长方形是哪一张？',
      'A',
      [
        ['A', 'A'],
        ['B', 'B'],
        ['C', 'C'],
        ['D', 'D'],
      ],
      'A为长方形；C在本题单列为正方形，不重复分类。',
      planes,
    ),
    clear(
      'tangram-types',
      '观察三个人物的七巧板材料，哪种说法清楚？',
      ['三角形、正方形、平行四边形分别看完整片边界', '所有四边形都叫长方形'],
      '平行四边形不一定有直角，不能只按边数归长方形。',
    ),
    q(
      'robot-counts',
      '只数本站机器人完整所画轮廓，依次填长方形、正方形、三角形、圆的个数。',
      { kind: 'steps', values: [15, 2, 2, 6] },
      '本站两天线杆/耳/上臂/下臂/短裤/腿/脚各2和颈1为15长方形，头身2方、鼻胸2三角、眼手顶各2圆。不能代填原书。',
      visual('robot'),
    ),
    q(
      'train-counts',
      '只数本站火车，依次填长方形、正方形、三角形、圆。',
      { kind: 'steps', values: [5, 1, 1, 4] },
      '本站五长方形、驾驶室一方、前导向一三角、四轮圆；整体外轮廓不再计一块。',
      visual('train'),
    ),
    clear(
      'boundaries',
      '教材原图有一处边界看不清，怎样记录？',
      ['保留待核对，找清楚原书再确认；本站数另记', '直接把本站示例数填进原图'],
      '两个图的条件分开，未知不猜0或抄另图。',
    ),
    choices(
      'cube-face',
      '描正方体一个平面通常得到哪类图形？',
      'square',
      faceChoices,
      '正方体的平面是正方形；看具体物体。',
      cube,
    ),
    choices(
      'prism-face',
      '描三棱柱平的端面得到哪类？',
      'triangle',
      faceChoices,
      '端面是三角形，侧面另看。',
      prism,
    ),
    choices(
      'cuboid-face',
      '本站三条棱长不同的长方体面迹对应哪类？',
      'rectangle',
      faceChoices,
      '这个具体模型各面为长方形，不推广所有长方体没有正方形面。',
      cuboid,
    ),
    choices(
      'cylinder-face',
      '描圆柱平的底面得到哪类？',
      'circle',
      faceChoices,
      '圆柱平底面为圆，曲侧面和透视椭圆不代实际面形。',
      cylinder,
    ),
    clear(
      'not-all-squares',
      '哪个说法不乱推广？',
      ['长方体是否有正方形面，要看具体棱长', '每个长方体都必有两个正方形面'],
      '两棱同长的具体长方体可能有正方形面，不能所有都肯定。',
    ),
    q(
      'diagonal-count',
      '本站分区图A中，长方形被分成几个三角形？',
      { kind: 'number', value: 2 },
      '一条对角分界，两个完整三角形；不把整个长方形再计三角片。',
      visual('diagonal'),
    ),
    q(
      'parallel-count',
      '本站分区图B有几个长方形分区？',
      { kind: 'number', value: 2 },
      'A/B为两个分区，折痕不是第三块。',
      visual('parallel'),
    ),
    choices(
      'square-part',
      '本站分区图C哪块是正方形？',
      'A',
      [
        ['A', 'A'],
        ['B', 'B'],
      ],
      'A边长160绘图单位，B边长80与160；不是教材厘米。',
      visual('square-part'),
    ),
    q(
      'dot-arrangement',
      '空白点子图先数行，再数列，依次填两个数量。',
      { kind: 'steps', values: [6, 11] },
      '每行11个点、共有6行；行列顺序不同，点不是画好的形状。',
      visual('dots'),
    ),
    q(
      'site-zero',
      '本站新火车图已去掉前导向三角片；现在有几个三角形材料？',
      { kind: 'number', value: 0 },
      '该新图没有三角材料，0为已核对的有效数量，不是未填；不说原教材火车也没有。',
      visual('train', 'review'),
    ),
    actual(
      'actual-say',
      '实际用自己的语言分别描述长方形、正方形、三角形和圆。',
    ),
    actual('actual-draw-four', '实际在纸上画四类图形并核对各自轮廓。'),
    actual('actual-sport-1', '实际观察原93页“溜冰”图，逐片指认形状并说明。'),
    actual('actual-sport-2', '实际观察原93页“踢球”图，逐片指认形状并说明。'),
    actual('actual-sport-3', '实际观察原93页“跳舞”图，逐片指认形状并说明。'),
    actual(
      'actual-tangram-design',
      '实际用七巧板或纸卡设计自己的图案，说明材料形状。',
    ),
    actual(
      'actual-original-robot',
      '实际在清楚的教材机器人图中标记、核对长方形/正方形/三角形/圆四项；模糊处如实保留待核对。',
    ),
    actual(
      'actual-original-train',
      '实际在清楚的教材火车图中标记、核对四类图形，说明分界，不抄本站数量。',
    ),
    actual(
      'actual-face-matching',
      '实际核对原94页四个平面图形与四个物体的连线，各说明所描的平面。',
    ),
    actual(
      'actual-fold-1',
      '实际从完整长方形纸折出两个三角形分区，展开核对，不强制剪开。',
    ),
    actual(
      'actual-fold-2',
      '重新取完整长方形，实际折分为两个长方形并说明边界。',
    ),
    actual(
      'actual-fold-3',
      '再从完整长方形实际折分一正方形和一长方形，核对余片和完整覆盖。',
    ),
    actual('actual-dot-rectangle', '实际在纸上点子图画长方形并检查闭合直角。'),
    actual(
      'actual-dot-square',
      '实际在纸上点子图画正方形，核对同长四边和直角。',
    ),
    actual(
      'actual-dot-triangle',
      '实际在纸上点子图画三角形，核对三条直边闭合。',
    ),
    actual(
      'actual-collage-create',
      '实际创作自己的平面图形拼图，说明材料与整体轮廓。',
    ),
    actual(
      'actual-collage-show',
      '向真实在场的人展示作品并听回应；没展示则不确认。',
    ),
    record(
      'shape-record',
      '记录实际描述、画图和三人物观察的方法，未做可如实写待做。',
    ),
    record(
      'collage-record',
      '分别记录原机器人/火车四类数量及采用的边界，本站数另列；未核清项可写待核对。',
    ),
    record(
      'fold-record',
      '记录三次实际折分与三种作画的结果和疑问，不把计划写成已做。',
    ),
    record(
      'learning-record',
      '记录自己的创作与实际展示反馈；没有作品或回应如实写。',
    ),
    record('future-plan', '另写下一步想补做或核对的事，不算本次已完成。'),
  ],
  reviewQuestions: [
    choices(
      'review-square',
      '新四卡中正方形是哪张？',
      'B',
      [
        ['A', 'A'],
        ['B', 'B'],
        ['C', 'C'],
        ['D', 'D'],
      ],
      'B转45度仍四边同长、四角直角。',
      {
        kind: 'plane-cards',
        cards: [
          { shape: 'triangle', size: 1, turn: 90 },
          { shape: 'square', size: 2, turn: 45 },
          { shape: 'rectangle', size: 1, turn: 90 },
          { shape: 'circle', size: 2, turn: 0 },
        ],
      },
    ),
    q(
      'review-robot',
      '新机器人去掉两天线杆和两个顶圆，依次填长方形、正方形、三角形、圆。',
      { kind: 'steps', values: [13, 2, 2, 4] },
      '本站15长方形减2为13，6圆减2为4，其它不变。',
      visual('robot', 'review'),
    ),
    q(
      'review-train',
      '新火车去掉前导向三角，其它保留，依次填四类数量。',
      { kind: 'steps', values: [5, 1, 0, 4] },
      '只有三角片被移除，0不空缺。',
      visual('train', 'review'),
    ),
    q(
      'review-diagonal',
      '转向后分区图A中，每一个三角形有几条直边？',
      { kind: 'number', value: 3 },
      '每一块仍三条直边；所问是每块边数，不是两块总边数或片数。',
      visual('diagonal', 'review'),
    ),
    choices(
      'review-rectangle',
      '转向后的分区图C，哪个分区是长方形而不是正方形？',
      'B',
      [
        ['A', 'A'],
        ['B', 'B'],
      ],
      'B仍80×160绘图单位，旋转不改边长关系。',
      visual('square-part', 'review'),
    ),
    q(
      'review-dots',
      '本站新点阵先数行再数列，依次填。',
      { kind: 'steps', values: [5, 9] },
      '新条件5行9列，不能抄旧6行11列。',
      visual('dots', 'review'),
    ),
    q(
      'review-no-square-face',
      '本站三条棱长不同的长方体有几个正方形面？',
      { kind: 'number', value: 0 },
      '各面的邻边长度不同，这个具体模型没有正方形面；不是所有长方体都没有。',
      cuboid,
    ),
    clear(
      'review-fold-done',
      '只看网页分区图、没有实际折纸，怎样记录？',
      ['网页已观察，实际折纸待做', '把三次实际折纸全确认完成'],
      '观察示例与真实操作分开，新情境不自动确认。',
    ),
  ],
};
export const bnuLowerFinalGeometryMapping = [
  {
    page: 93,
    sourceActivity: 'recall-describe-and-draw-plane-shapes',
    steps: [1, 2],
    objective: [
      'plane-circle',
      'plane-square',
      'plane-triangle',
      'plane-rectangle',
    ],
    manual: ['actual-say', 'actual-draw-four'],
    records: ['shape-record'],
  },
  {
    page: 93,
    sourceActivity: 'three-tangram-patterns-and-own-design',
    steps: [3],
    objective: ['tangram-types'],
    manual: [
      'actual-sport-1',
      'actual-sport-2',
      'actual-sport-3',
      'actual-tangram-design',
    ],
    records: [],
  },
  {
    page: 93,
    sourceActivity: 'robot-and-train-find-four-shape-types',
    steps: [4, 5],
    objective: ['robot-counts', 'train-counts', 'boundaries', 'site-zero'],
    manual: ['actual-original-robot', 'actual-original-train'],
    records: ['collage-record'],
  },
  {
    page: 94,
    sourceActivity: 'four-plane-to-solid-face-connections',
    steps: [6, 7, 8, 9],
    objective: [
      'cube-face',
      'prism-face',
      'cuboid-face',
      'cylinder-face',
      'not-all-squares',
    ],
    manual: ['actual-face-matching'],
    records: [],
  },
  {
    page: 94,
    sourceActivity: 'appendix-three-rectangle-fold-three-ways',
    steps: [10, 11, 12],
    objective: ['diagonal-count', 'parallel-count', 'square-part'],
    manual: ['actual-fold-1', 'actual-fold-2', 'actual-fold-3'],
    records: ['fold-record'],
  },
  {
    page: 94,
    sourceActivity: 'draw-three-shapes-on-dots',
    steps: [13],
    objective: ['dot-arrangement'],
    manual: [
      'actual-dot-rectangle',
      'actual-dot-square',
      'actual-dot-triangle',
    ],
    records: [],
  },
  {
    page: 94,
    sourceActivity: 'create-own-plane-shape-collage',
    steps: [14, 15],
    objective: [],
    manual: ['actual-collage-create', 'actual-collage-show'],
    records: ['learning-record', 'future-plan'],
  },
].map((m) => ({ ...m, lesson: id }));
