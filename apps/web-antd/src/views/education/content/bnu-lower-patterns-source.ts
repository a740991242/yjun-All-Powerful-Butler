/** Printed page 83 was actually viewed; source preparation is not a released lesson. */
export const bnuLowerPatternsSource = {
  resourceId: 'bnu-lower-public-scan-2024',
  source: 'https://keben.szxuexiao.com/html/10764.html',
  checkedAt: '2026-10-06',
  status: 'source-checked-teaching-mapped',
  title: '动手做（三）',
  readPrintedPages: [83],
  pageImages: [{ printedPage: 83, suffix: '087.jpg' }],
  patterns: [
    { key: 'windmill', title: '风车', location: '上排左' },
    { key: 'rabbits', title: '小兔', location: '上排右' },
    { key: 'fish', title: '鱼', location: '下排左' },
    { key: 'kaleidoscope', title: '万花筒', location: '下排右' },
  ],
  appreciate: {
    requested: '欣赏四幅图案，找出认识的图形',
    windmillDialogue: { largeTriangles: 4, smallTriangles: 4 },
    kaleidoscopeDialogue: ['triangle', 'square'],
    boundary:
      '原风车对话给4大三角和4小三角作为做法，大小与类别分清，不从图框或背景额外增纸片；不把对话选片当全部白色区域计数。万花筒原话好多三角形和正方形，未给唯一总数；不能从重复花纹、颜色或整幅方框补固定数量。四幅分别观察，不用一幅代替全部。',
  },
  traceAndDraw: {
    requested: '选择图案中的一部分，描一描、画一画',
    windmillAdvice: '组成风车的三角形，线要画直',
    rabbitAdvice: '小兔的头是圆的，画起来有点困难',
    boundary:
      '原要求选部分，不强制把四幅整图全部描完；三角形直边与兔头圆曲线分别尝试，描原图与自己画分开。只兔头为圆不推整兔各部位都是圆，不把眼睛尾巴或整个外框混为头部。实际纸笔动作人工，普通字体或点击图形不代替描画。材料、成人协助或待做如实记，不要求学校或购买；记录null与将来计划分开。',
  },
  activities: [
    { page: 83, key: 'appreciate-all-four-patterns-and-identify-known-shapes' },
    {
      page: 83,
      key: 'choose-part-trace-and-draw-straight-and-curved-boundaries',
    },
  ],
  boundary:
    '只已实际看83页，84～86与后续另读，不根据旧版记忆补内容。两活动已映射教学，来源读取不替代程序或教学验收；原扫描不打包，本站重画几何与原书姿势配色比例分清，开放发现不固定唯一名称。',
} as const;
