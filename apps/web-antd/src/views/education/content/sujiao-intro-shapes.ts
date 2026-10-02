import type {
  GridPathsVisual,
  Lesson,
  Question,
  RegionPairVisual,
} from '../learning/types';

import { fold } from '../learning/fold';
import { sujiaoUpperSource } from './sujiao-upper-source';

export const introMainRegions: RegionPairVisual = {
  kind: 'region-pair',
  sizes: [
    [2, 1],
    [3, 2],
  ],
};
export const introReviewRegions: RegionPairVisual = {
  kind: 'region-pair',
  sizes: [
    [4, 3],
    [2, 2],
  ],
};
export const introMainPaths: GridPathsVisual = {
  kind: 'grid-paths',
  paths: [
    {
      id: 'A',
      points: [
        [0, 0],
        [2, 0],
        [2, 2],
      ],
    },
    {
      id: 'B',
      points: [
        [0, 3],
        [3, 3],
      ],
    },
    {
      id: 'C',
      points: [
        [4, 0],
        [4, 2],
      ],
    },
  ],
};
export const introReviewPaths: GridPathsVisual = {
  kind: 'grid-paths',
  paths: [
    {
      id: 'A',
      points: [
        [0, 0],
        [1, 0],
        [1, 1],
      ],
    },
    {
      id: 'B',
      points: [
        [0, 3],
        [4, 3],
      ],
    },
    {
      id: 'C',
      points: [
        [5, 0],
        [5, 3],
      ],
    },
  ],
};

function tasks(review: boolean): Question[] {
  const prefix = `sj-upper-intro-shapes-${review ? 'r' : 'q'}`;
  const heights = review ? [2, 3] : [1, 2, 1];
  const blocks = fold(heights, 0, (a, b) => a + b);
  return [
    {
      id: `${prefix}-blocks`,
      knowledge: 'sj-intro-shapes-block-count',
      prompt: review
        ? '换一座积木：图中一共几块？只搭一块深，没有隐藏后排。'
        : '这座积木一共几块？只搭一块深，没有隐藏后排，每小格对应一块。',
      visual: { kind: 'cube-columns', heights },
      rule: { kind: 'number', value: blocks },
      hint: '按列点数所有积木，不把正面的列数当作积木块数。',
      explanation: `各列分别有${heights.join('、')}块，合起来${blocks}块。`,
    },
    {
      id: `${prefix}-columns`,
      knowledge: 'sj-intro-shapes-column-count',
      prompt: review
        ? '同一座新积木从左到右分为几列？问列数，不问块数。'
        : '图中积木从左到右分为几列？问列数，不问块数。',
      visual: { kind: 'cube-columns', heights },
      rule: { kind: 'number', value: heights.length },
      hint: '从左到右，每一竖列只数一次。',
      explanation: `${heights.length}列和${blocks}块是不同的计数对象。`,
    },
    {
      id: `${prefix}-paper-shape`,
      knowledge: 'sj-intro-shapes-paper-observation',
      prompt: review
        ? '这张原创纸片图有三条直边，是什么形状？'
        : '这张原创纸片图的四条边一样长，四个角都是直角，是什么形状？',
      visual: { kind: 'shape', shape: review ? 'triangle' : 'square' },
      choices: ['圆', '三角形', '正方形'].map((label) => ({
        id: label,
        label,
      })),
      rule: { kind: 'choice', value: review ? '三角形' : '正方形' },
      hint: '沿图形的外边看一圈；图是平面纸片，不是立体积木。',
      explanation: review
        ? '三条直边围成三角形。'
        : '四条等长的边、四个直角围成正方形。',
    },
    {
      id: `${prefix}-piece-count`,
      knowledge: 'sj-intro-shapes-piece-conservation',
      prompt: review
        ? '2块纸片换一种拼法，没有增加或剪开，现在用了几块？'
        : '拿2块纸片，移动、转向后拼图，没有增加或剪开，现在用了几块？',
      rule: { kind: 'number', value: 2 },
      hint: '位置改变，原来的纸片都还在。',
      explanation: '仍然是2块；新的整体外形不改变原纸片块数。',
    },
    {
      id: `${prefix}-boundary`,
      knowledge: 'sj-intro-shapes-boundary',
      prompt: review
        ? '拼图中间有接缝，要介绍整个图形的样子，应沿哪里观察？'
        : '两张纸拼成一个图形，介绍整个图形时应观察哪里？',
      choices: [
        { id: 'outside', label: '整个外轮廓' },
        { id: 'seam', label: '只看内部拼缝' },
      ],
      rule: { kind: 'choice', value: 'outside' },
      hint: '把整个拼图当作一个整体，沿最外面看一圈。',
      explanation: '内部拼缝与整体外边界不同，不能把拼缝当作额外外边。',
    },
    {
      id: `${prefix}-region`,
      knowledge: 'sj-intro-shapes-enclosure',
      prompt: review
        ? '换一对围图：同一钉点板上，哪个围起来的地方更大？A为实线，B为虚线。'
        : '同一钉点板上，哪个围起来的地方更大？A为实线，B为虚线。',
      visual: review ? introReviewRegions : introMainRegions,
      choices: [
        { id: 'A', label: 'A区域' },
        { id: 'B', label: 'B区域' },
      ],
      rule: { kind: 'choice', value: review ? 'A' : 'B' },
      hint: '观察哪个区域把另一个全部包含进去，还多围出一些地方。',
      explanation: review
        ? 'A包含整个B，还多围出一些地方，所以A更大。'
        : 'B包含整个A，还多围出一些地方，所以B更大。',
    },
    {
      id: `${prefix}-region-method`,
      knowledge: 'sj-intro-shapes-enclosure-method',
      prompt: review
        ? '虚线画得较粗，能只凭线粗就说虚线围的地方更大吗？'
        : '实线画得较粗，能只凭线粗就说实线围的地方更大吗？',
      choices: [
        { id: 'space', label: '不能，要看真正围起来的地方' },
        { id: 'thickness', label: '能，线粗就表示地方大' },
      ],
      rule: { kind: 'choice', value: 'space' },
      hint: '笔画粗细和围住的范围是不同的事情。',
      explanation: '只改变线粗不改变钉点间围住的范围，不教面积公式。',
    },
    {
      id: `${prefix}-shortest`,
      knowledge: 'sj-intro-shapes-path-length',
      prompt: review
        ? '换三条原创格边路径，哪条最短？每小格一样大。'
        : '观察三条原创格边路径，哪条最短？每小格一样大。',
      visual: review ? introReviewPaths : introMainPaths,
      choices: ['A', 'B', 'C'].map((label) => ({
        id: label,
        label: `${label}路径`,
      })),
      rule: { kind: 'choice', value: review ? 'A' : 'C' },
      hint: '沿每条线走过的小格边比较，不只看端点。',
      explanation: review
        ? 'A走2格边、B走4格边、C走3格边，所以A最短。'
        : 'A走4格边、B走3格边、C走2格边，所以C最短。',
    },
    {
      id: `${prefix}-bend`,
      knowledge: 'sj-intro-shapes-bent-path',
      prompt: review
        ? '新图A路径拐弯后继续，一共经过几条小格边？'
        : '图中A路径拐弯后继续，一共经过几条小格边？',
      visual: review ? introReviewPaths : introMainPaths,
      rule: { kind: 'number', value: review ? 2 : 4 },
      hint: '横着和竖着的部分都要算，不把拐角点额外算作一段。',
      explanation: review
        ? '横着1格边，再竖着1格边，一共2格边。'
        : '横着2格边，再竖着2格边，一共4格边。',
    },
  ];
}

export const sujiaoIntroShapesLesson: Lesson = {
  id: 'sj-upper-intro-shapes',
  textbookTitle: '数学游戏分享',
  title: '入学游戏：拼搭、拼图、围区域与路径',
  page: 5,
  status: 'available',
  version: 1,
  goal: '实际拼搭与拼图，介绍用了哪些材料与数量；通过包含比较围起来的地方，逐段比较路径，说明自己的不同办法。',
  prerequisite:
    '家长可以读题并介绍材料形状；准备安全积木、预剪纸片、纸笔。围图可在方格纸上画，不要求使用有尖钉的实物。',
  parentTip:
    '这是入学观察和实践，不替代后续正式图形单元或面积、测量教学。真实拼搭会有遮挡，要亲手检查每块；屏幕积木图明确没有隐藏后排。原创格边路径是观察和逐段比较的支架，不冒充原书相同两端点的直曲线场景。',
  steps: [
    {
      title: '搭出作品，数清材料',
      text: '先想搭什么，再选材料搭出一个作品，介绍用了哪些形状、各几块。屏幕图只有一块深，列数不是块数；真实作品要从不同方向看、必要时拆开确认，不只数看到的面。',
      visual: { kind: 'cube-columns', heights: [1, 2, 1] },
      activity: '实际用积木搭自己的作品，再点数和介绍所用材料。',
    },
    {
      title: '纸片拼图，看整体也看材料',
      text: '家长准备圆、三角形或长方形等纸片，孩子选一些拼出原创画面，介绍用了哪些形状、各几张。移动或转向不改变纸片数量；介绍整体外形时沿外轮廓观察，不只看内部拼缝。',
      visual: { kind: 'shape-join' },
      activity:
        '先试屏幕两张三角形的移动，再用实际纸片拼自己想要的画面并解释摆法。',
    },
    {
      title: '围起来的地方，能不能多一些',
      text: '同一块等距钉点板上，左下角对齐，两条闭合线围出不同地方。若B包含整个A，还多围出一些地方，B就更大。只看线粗、边上钉点多少或某一条边都不足以判断；不要求计算面积。',
      visual: introMainRegions,
      activity:
        '在同一方格纸上画一个闭合范围，再画一个包含它、还多围出地方的范围，指着说明。',
    },
    {
      title: '路径拐弯，仍要走完整条',
      text: '图中方格一样大，沿每条路径逐段观察，拐弯前后都要比较。图中三条线用于练习，不具有共同端点；实际可在纸上画两座自己的小屋，尝试直路与绕路，用线绳贴着整条路比较。',
      visual: introMainPaths,
      activity:
        '画共同起点和终点的两条原创路径，用同一根线绳逐条贴合比较，说明你喜欢的办法。',
    },
  ],
  questions: [
    ...tasks(false),
    {
      id: 'sj-intro-shapes-manual-build',
      knowledge: 'sj-intro-shapes-physical-build',
      prompt:
        '实际搭一个自己的积木作品，说是什么、用了哪些材料、各几块；从不同方向查看或拆开验证，听家长另一种搭法。',
      rule: { kind: 'manual' },
      hint: '不把看到的面数当作积木块数；隐藏部分要实际确认。',
      explanation: '实际搭建、计数和表达人工确认，不把屏幕图答对代替操作。',
    },
    {
      id: 'sj-intro-shapes-manual-collage',
      knowledge: 'sj-intro-shapes-physical-collage',
      prompt:
        '用家长准备的安全纸片拼一幅原创画面，介绍材料形状、每种张数和位置，换一种拼法再说有什么变化。',
      rule: { kind: 'manual' },
      hint: '纸片移动或转向不等于增加材料；无需复制教材画面。',
      explanation: '纸面拼图与创意表达人工确认，不自动给作品美观程度评分。',
    },
    {
      id: 'sj-intro-shapes-manual-region',
      knowledge: 'sj-intro-shapes-physical-region',
      prompt:
        '在方格纸上画两个闭合范围，第二个包含第一个且多围出一些地方，指着比较；再换一个形状试试，说还想问的问题。',
      rule: { kind: 'manual' },
      hint: '围线要闭合，使用同一张纸的相同格子。请家长查看；不必使用尖钉。',
      explanation: '实际围图和说明人工确认，不自动评价面积计算。',
    },
    {
      id: 'sj-intro-shapes-manual-path',
      knowledge: 'sj-intro-shapes-physical-path',
      prompt:
        '在纸上画两个固定地点，画直路与绕路；用同一根线绳沿整条路径贴合比较，向家长解释哪条短，说一个喜欢的活动或还想尝试的办法。',
      rule: { kind: 'manual' },
      hint: '两条路起点与终点相同，线绳保持同样松紧，沿全路而不跳过拐弯。',
      explanation: '真实路径比较、表达与反思人工确认，不由一道格边题替代。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: sujiaoUpperSource.checkedAt,
    reviewer: '同册原书范围核验与原创图形课包',
    notes: `已实际查看${sujiaoUpperSource.preview}同册印刷第5～8页，2024年7月第1版、2025年7月第2次印刷。本站积木、纸片、嵌套区域、路径和问答原创；格边图不复制原书路径场景。实际拼搭、拼图、围图和共同端点路径比较分别人工记录，不宣称后续正式图形单元或全册完成。`,
  },
};
