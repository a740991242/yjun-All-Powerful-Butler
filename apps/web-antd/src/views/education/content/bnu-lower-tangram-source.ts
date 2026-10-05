/** Facts from actually viewed printed pages; no course is released by this preparation. */
export const bnuLowerTangramSource = {
  resourceId: 'bnu-lower-public-scan-2024',
  source: 'https://keben.szxuexiao.com/html/10764.html',
  checkedAt: '2026-10-06',
  status: 'source-checked-teaching-mapped',
  title: '动手做（二）',
  readPrintedPages: [80, 81, 82],
  pageImages: [
    { printedPage: 80, suffix: '084.jpg' },
    { printedPage: 81, suffix: '085.jpg' },
    { printedPage: 82, suffix: '086.jpg' },
  ],
  numberedSquare: {
    pieceIds: [1, 2, 3, 4, 5, 6, 7],
    categories: ['triangle', 'parallelogram', 'square'],
    categoryCount: 3,
    triangleIds: [1, 2, 4, 6, 7],
    parallelogramId: 3,
    squareId: 5,
    congruentPairs: [
      [1, 2],
      [4, 6],
    ],
    blanks: [3, 5, 2, 6],
    boundary:
      '原图编号不可按颜色或另一个七巧板惯用编号替换；3号是原已给平行四边形，1/2两大三角、4/6两小三角，7中三角与5方形不同。四空依次三类/五三角/2号/6号。面积与图示像素不当儿童公式或实际厘米。',
  },
  trace: {
    count: 3,
    shapes: ['square', 'parallelogram', 'triangle'],
    boundary:
      '找三块不同形状的板子，各描一描、说一说；选三块都是三角形但大小不同不满足不同形状。描出的平面轮廓与纸片数量分开。',
  },
  poetryScene: {
    title: '咏鹅',
    elements: ['house', 'geese', 'small-fish'],
    boundary:
      '原画小房子和小动物由七巧板拼成，选择喜欢的一部分观察与拼摆；草、云、水线等场景不补算为七巧板纸片。原书此页未署个人作者，不补造书内署名；原插图不打包。',
  },
  favouritePattern: {
    givenObservations: [
      'goose-head-parallelogram-and-triangle',
      'fish-head-two-large-triangles',
    ],
    boundary:
      '原81页两段对话分别说平行四边形与三角形合成鹅头、两个大三角形拼成小鱼头；整只动物、选定头部与单片不同，不由物品名推所有部件形状。实际回原画核对，不把本站重画比例冒原比例。',
  },
  tryPatterns: {
    count: 6,
    arrangement: 'two-rows-three-columns',
    boundary:
      '六幅全部试拼观察，图案像什么是开放表达，不强判只准一种名称；每幅所选片和用片事实实际核对。题面未要求每幅必须全用七片，不擅自补此限制，也不从颜色或外接框增加片数。',
  },
  story: {
    example: '乌鸦喝水',
    boundary:
      '与同伴合作想一个故事，用七巧板拼出图案；乌鸦喝水为原示例，不是唯一故事，想故事/合作/拼摆/说明分别真实记录，不因单人点网页就确认合作。故事信息、自由续编与现实事实分开。',
  },
  largerTriangles: {
    requestedCount: 2,
    originalMaterial: 'triangular-tangram-pieces',
    boundary:
      '用七巧板中的三角形拼出两个更大的三角形；原题未列唯一选片或强制所有五三角全用，不补约束。本站可以分别用一对大三角与一对小三角各拼一个，注明原创例子；须保片形，内部缝不作外轮廓，按实际边接合核对。',
  },
  peopleStory: {
    figureCount: 3,
    boundary:
      '回82页三幅人物讲图中故事，并说人物用哪些图形；足球是场景道具，不按圆球额外加作七巧板一片。人物动作和故事可合理描述，不把想象当唯一原文或运动技能证明。',
  },
  waitingForHare: {
    figureCount: 3,
    boundary:
      '原三幅图对应守株待兔情境，实际拼一拼、讲一讲；人物/树/兔分别观察，不能以示例当必须同一叙述，也不要求现实等待或接触动物。故事与实际生活事实分开。',
  },
  freeCreation: {
    examples: ['apple', 'coconut-tree'],
    boundary:
      '发挥想象拼喜欢的图案并展示给同学；苹果与椰树为原示例，不限这两种，不要求真实水果或同学身份录入。创作、展示与将来计划分别记录。',
  },
  activities: [
    { page: 80, key: 'recognize-scene-and-fill-four-numbered-tangram-blanks' },
    { page: 80, key: 'trace-and-describe-three-different-piece-shapes' },
    { page: 81, key: 'choose-and-assemble-a-favourite-poetry-scene-pattern' },
    { page: 81, key: 'assemble-all-six-open-naming-examples' },
    { page: 81, key: 'cooperate-invent-story-and-compose-pattern' },
    { page: 82, key: 'compose-two-larger-triangles' },
    { page: 82, key: 'describe-three-people-stories-and-piece-shapes' },
    { page: 82, key: 'compose-and-tell-three-waiting-for-hare-patterns' },
    { page: 82, key: 'create-a-favourite-pattern-and-show-classmates' },
  ],
  boundary:
    '三页已实际看图，九活动已逐页映射，来源读取不代替程序或教学验收；原编号与素材不改，实际描/拼/合作/展示人工，开放故事反思null、计划另记。原创图示保片形，不打包扫描；教师最终试用与全年目标另核。',
} as const;
