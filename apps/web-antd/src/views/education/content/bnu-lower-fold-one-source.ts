/** Read-page facts, paired with independently verified original teaching. */
export const bnuLowerFoldOneSource = {
  resourceId: 'bnu-lower-public-scan-2024',
  source: 'https://keben.szxuexiao.com/html/10764.html',
  appendixSource: 'https://keben.szxuexiao.com/html/10766.html',
  checkedAt: '2026-10-05',
  status: 'source-checked',
  title: '动手做（一）',
  readPrintedPages: [78, 79, 97],
  pageImages: [
    { printedPage: 78, suffix: '082.jpg' },
    { printedPage: 79, suffix: '083.jpg' },
    { printedPage: 97, suffix: '101.jpg' },
  ],
  appendix: {
    page: 97,
    figureOne: ['square', 'square'],
    figureTwo: ['rectangle', 'isosceles-triangle', 'circle'],
    figureThree: ['long-rectangle'],
    boundary:
      '附页图1两个方形、图2长方形/等腰三角形/圆、图3另列长条长方形已实际看图；无印刷厘米尺寸，不以扫描像素量实际边长。不能将图2等腰三角形的对折方式推广所有三角形。',
  },
  squareHalves: {
    shownCuts: ['opposite-side-midpoints', 'opposite-corners'],
    resultKinds: ['two-congruent-rectangles', 'two-congruent-triangles'],
    boundary:
      '同一正方形两种折痕分别尝试，沿选定折痕剪成两片后重合比较；试另一剪法需另一张纸或如实记录材料复用，剪完不能假装恢复完整原纸。',
  },
  otherHalves: {
    rectanglePhotos: 3,
    trianglePhotos: 1,
    circlePhotos: 1,
    rectangleObliquePhoto: 'fold-line-and-overlap-need-further-operation-check',
    boundary:
      '照片三种摆向不自动就是三种能完全叠合的对折轴；长方形沿对角线剪后两三角形可经转动比同形，但非正方形时沿对角线翻折不保证两半重合。第三照片具体折痕还需对照操作核对，不用图片摆向补造第三条对称轴。等腰三角形取顶点到底边中点，圆过圆心直径；本项原材料与任意同名形状分清。',
  },
  copyPatterns: {
    count: 4,
    outlines: ['triangle', 'slanted-quadrilateral', 'mushroom', 'flag'],
    boundary:
      '第78页四图各有内部接缝，先核对所需剪片再照样拼；蘑菇上弧半圆与长方柄分清，旗杆两长方片与旗面三角片不合算一片。斜四边整体与内部三角片、拼片数量与外轮廓不同；同片先后复用须说明，不自动要求全部四作品同时保留。',
  },
  cooperate: {
    shownExamples: ['flower', 'fish'],
    boundary:
      '两图是合作与自主创作示例，不是唯一作品；圆形头可由半圆片接合、矩形身体由相邻片接合，内部缝不算外边。实际约定合作、拼摆、着色与说明材料分别确认，不因看图就自动确认合作。',
  },
  airplane: {
    visiblePanels: 7,
    readingOrder: [
      'upper-left',
      'upper-second',
      'upper-third',
      'upper-right',
      'lower-right',
      'lower-middle',
      'lower-left',
    ],
    boundary:
      '按箭头上排左到右，再右端向下，下排右到左，末图纸飞机；不按下排左到右颠倒。图中虚线折痕、纸层与外轮廓分清，照片/七幅示意不代替实际折纸；不用飞行成绩判掌握、不要求去道路或窗边投放。',
  },
  rectangleToSquare: {
    originalOperation: 'fold',
    boundary:
      '原练2要求折出正方形，不直接改成必须剪去余纸；本站指定2比1长方形中线折可作原创一个例子，任意比例要另试，不能由纸层增加说材料增加或凭像素测实际尺寸。',
  },
  fourTriangles: {
    originalMaterial: 'one-square',
    cutLines: 'both-diagonals',
    count: 4,
    shapes: 'four-congruent-right-isosceles-triangles',
    shownJoinedOutlines: ['triangle', 'trapezoid'],
    originalTask: 'open-exploration',
    boundary:
      '一张正方形两条对角线剪四片等大三角形，不误用横竖中线剪四小方形；四片全用、保持片形、无重叠无空缺、共享边需对应。原问还可拼哪些，三角形/梯形只是示例，不强判只有两种；内部接缝不另作外轮廓，真实尺寸与拼法靠纸片核对。',
  },
  activities: [
    { page: 78, key: 'square-two-equal-halves-cut-and-compare' },
    { page: 78, key: 'rectangle-triangle-circle-halves-cut-and-compare' },
    { page: 78, key: 'copy-all-four-cut-piece-patterns' },
    { page: 79, key: 'cooperate-create-color-and-describe' },
    { page: 79, key: 'fold-airplane-seven-panel-arrow-order' },
    { page: 79, key: 'fold-rectangle-into-square-without-mandatory-cut' },
    { page: 79, key: 'square-four-equal-triangles-open-recomposition' },
  ],
  boundary:
    '实际折/剪/比/拼与合作分别人工，未知折痕先核对不编造；安全纸笔、剪具成人协助或成人代剪如实说明，不要求新购。原附页几何与本站原创示意分开，不打包扫描；开放作品和反思null、未来计划另记，第三方来源/未知版印保持。来源核对不等于全部原照片折痕已确定、单元或全年完成。',
} as const;
