import type { FoldCutJoinVisual, Lesson, Question } from '../learning/types';

import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-fold-cut-join';
function model(
  index: number,
  stage: FoldCutJoinVisual['stage'],
  review: boolean,
): FoldCutJoinVisual {
  return {
    kind: 'fold-cut-join',
    width: review ? 6 : 4,
    cut: (index === 0) === review ? 'diagonal' : 'corner',
    stage,
  };
}
function tasks(review: boolean): Question[] {
  const common = (key: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
  });
  return [
    ...[0, 1].flatMap((i): Question[] => {
      const corner = model(i, 'cut', review).cut === 'corner';
      return [
        {
          ...common(`folded-${i}`),
          prompt:
            '这张纸只沿指定虚线折角，还没有剪。现在是几张独立的纸？重叠的纸层不算新纸。',
          visual: model(i, 'folded', review),
          rule: { kind: 'number', value: 1 },
          hint: '折起纸角仍与整张纸连着，先核对有没有剪断。',
          explanation: '仍是一整张纸，深浅表示重叠纸层，不是两张独立纸。',
        },
        {
          ...common(`pieces-${i}`),
          prompt:
            '展开后沿指定一条直线剪开，A、B分开摆。共有几片？不把空隙或颜色另算材料。',
          visual: model(i, 'cut', review),
          rule: { kind: 'number', value: 2 },
          hint: '点数实际分开的完整纸片。',
          explanation: '得到A、B两片，两片都保留，没有丢掉纸角。',
        },
        {
          ...common(`a-sides-${i}`),
          prompt: '只看剪后A这一片，它的完整外轮廓有几条直边？不是问A、B合计。',
          visual: model(i, 'cut', review),
          rule: { kind: 'number', value: corner ? 4 : 3 },
          hint: '从A的一处拐角走到下一处拐角是一条边，B另看。',
          explanation: corner
            ? '这次剪线连到底边内点，A留有四条边，是梯形；不能把它当三角形。'
            : '这次沿相对顶点连线剪，A只有三条边，是三角形。',
        },
        {
          ...common(`joined-sides-${i}`),
          prompt:
            '两片已经按图接齐。整个作品的完整外轮廓有几条直边？中间拼缝不算外边。',
          visual: model(i, 'joined', review),
          rule: { kind: 'number', value: 4 },
          hint: '只沿最外面走一圈，不走内部接缝。',
          explanation: '外轮廓有4条边。内部A、B接缝仍能看见，但不增加外边。',
        },
        {
          ...common(`shape-${i}`),
          prompt:
            '只看指定移片后接齐的整个外轮廓，它是哪种图形？不把其中A或B的形状当整体。',
          visual: model(i, 'joined', review),
          choices: [
            { id: 'parallelogram', label: '平行四边形' },
            { id: 'rectangle', label: '长方形' },
            { id: 'triangle', label: '三角形' },
          ],
          rule: { kind: 'choice', value: 'parallelogram' },
          hint: '找两组分别平行的对边；相邻角是否都是直角？',
          explanation:
            '两组对边分别平行，相邻角不是直角，是平行四边形。只适用于本题指定剪线与接法。',
        },
      ];
    }),
    {
      ...common('cut-end'),
      prompt:
        '当前展开图的指定剪线从左上角出发，另一端在哪里？按这次图读，不照搬前一种剪法。',
      visual: model(0, 'creased', review),
      choices: [
        { id: 'inside', label: '底边距左端2单位处，仍在边的内部' },
        { id: 'corner', label: '右下角' },
      ],
      rule: { kind: 'choice', value: review ? 'corner' : 'inside' },
      hint: '顺着虚线到另一端，看它在角上还是边的内部。',
      explanation: review
        ? '复习改为相对顶点连线，终点是右下角。'
        : '本图宽4、高2，终点在底边距左端2单位处，不是右下角。',
    },
    {
      ...common('folded-cut'),
      prompt: review
        ? '按本站过程，折着两层直接剪，等同于先展开再沿一条折痕剪整张纸吗？'
        : '本活动要先展开，再沿折痕剪。可以把仍折着的纸直接剪当成同一过程吗？',
      choices: [
        { id: 'no', label: '不能，剪时纸层条件改变了' },
        { id: 'yes', label: '能，任何折着剪都一样' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '先核对剪时纸是否展开。',
      explanation:
        '本示例是展开后剪，叠着剪可能产生其它切口，不能替代指定过程。',
    },
    {
      ...common('removed'),
      prompt: review
        ? '改用较宽纸后，仍把A、B都保留并接齐，丢掉了几片？'
        : 'A、B两片都保留，B只向右移并接齐，丢掉了几片？',
      rule: { kind: 'number', value: 0 },
      hint: '移动不是丢弃，也不是重新剪一片。',
      explanation: '丢掉0片，原材料都保留；不要求一年级计算面积公式。',
    },
    {
      ...common('unknown'),
      prompt: review
        ? '只知道“折过、剪过、拼过”，没有剪线与接法，能确定最终一定是平行四边形吗？'
        : '只说把长方形斜剪后拼起来，没有指定剪线和接法，能确定最终一定是平行四边形吗？',
      choices: [
        { id: 'ask', label: '不能确定，先补充剪线与接法' },
        { id: 'same', label: '一定是平行四边形' },
      ],
      rule: { kind: 'choice', value: 'ask' },
      hint: '本课两个示例的条件不能推广到任意剪拼。',
      explanation:
        '缺少条件不能推出唯一结果。其它合法剪拼作品可独立观察，不强判只有网页结果。',
    },
  ];
}
export const sujiaoFoldCutJoinDraft: Lesson = {
  id,
  title: '期末剪拼：折角、展开与移片',
  textbookTitle: '期末复习：折、剪、拼',
  page: 92,
  status: 'preparing',
  version: 1,
  goal: '按指定折痕展开剪纸、追踪两片的平移与完整外轮廓，区分纸层、纸片和拼缝，理解两种剪法与开放作品。',
  prerequisite:
    '已认识平面图形、折角与剪拼。准备长方形纸、纸笔；家长陪同使用适龄安全剪刀。',
  parentTip:
    '依据已读92页折剪拼活动，本站比例与分步图原创，不复制教材扫描或断言原图精确尺寸。沿指定线折起左下角，再展开剪；对角折可有纸角伸出，不意味着两半能完全叠齐。网页投影不代替实际操作；没有材料可暂跳人工任务。',
  steps: [
    {
      title: '第一种：沿指定线折起纸角',
      text: '第一张原创纸宽4、高2个共同长度单位。从左上角连到底边距左端2单位处，沿这条线把左下角翻到另一侧。深色是折起的纸层，仍与原纸连着；不是剪出的第二张纸。不要求孩子算长度或角度。',
      visual: model(0, 'folded', false),
      activity: '由家长准备符合比例的纸与折线，实际沿线折角并指出仍是一整张。',
    },
    {
      title: '展开后再剪',
      text: '展开恢复整张长方形，虚线是刚才折痕。只沿这条直线剪整张纸，不叠着剪，不增加剪口。线另一端在底边内部，不是右下角。剪后得到A、B两片，两片都保留。',
      visual: model(0, 'creased', false),
      activity: '实际展开指折痕，由家长陪同安全剪开，再逐片点数。',
    },
    {
      title: '先认材料，再移片',
      text: 'A是四边的梯形，B是三角形。分开摆的空隙只为了看清材料，不是新纸片。保持A不动，只把B整片向右移，不转动、不拉伸、不再剪，直到B的左边与A的右边接齐。',
      visual: model(0, 'cut', false),
      activity: '用实际剪出的两片指各自外边，尝试按要求移B。',
    },
    {
      title: '完整外轮廓与内部接缝',
      text: '两片接齐后，整体有四条外边，两组对边分别平行，相邻角不是直角，得到平行四边形。A、B拼缝在作品内部，不能把它另外算成外边；纸片都保留。',
      visual: model(0, 'joined', false),
      activity: '实际用手指沿完整外边一圈，再指内部接缝，分别说材料与作品。',
    },
    {
      title: '第二种：相对顶点连线',
      text: '另一张同样比例的纸，从左上角连到右下角，沿线折起左下角。折起层可能伸出另一层，这是沿指定线翻折，不说明长方形的两半完全叠齐。先展开，再沿此折痕剪，得到两片三角形。',
      visual: model(1, 'folded', false),
      activity: '实际对照两种折线终点：底边内部与右下角，分别展开再剪。',
    },
    {
      title: '第二种也先展开再剪',
      text: '展开后虚线确实连接左上角与右下角。沿这一条线剪整张纸，不叠着剪。与第一种底边内点不同，这次终点是一个顶点。',
      visual: model(1, 'creased', false),
      activity: '实际展开指两端位置，由家长陪同剪开。',
    },
    {
      title: '两片三角形，不沿用旧材料结论',
      text: '相对顶点连线把长方形分成A、B两片三角形，各有三条边。第一种A是四边形，这次不能照搬。保持A不动，把B整片向右移，不旋转、不再剪。',
      visual: model(1, 'cut', false),
      activity: '实际指两片三角形的三条边，开始按本次条件移B。',
    },
    {
      title: '同样移片，仍要核对条件',
      text: '第二种两片也可保持A不动，将B整片向右移到边接齐，形成另一个平行四边形。这里的斜边更斜，材料形状也不同；不是任意斜剪或任意拼法都得到同一结果。自己的不同合法作品可保留并描述。',
      visual: model(1, 'joined', false),
      activity:
        '实际按第二种移片，比较两件作品；再尝试自己的一种拼法，说清剪线与接法。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际准备第一种比例与指定线，折起纸角、展开并指出同一整张纸；由家长陪同沿折痕安全剪开，确认两片都保留。',
      '实际保持第一种A不动，B只向右移到边接齐，指完整外边与内部拼缝。没有完成实物时不要根据网页答案确认。',
      '实际用第二张纸沿相对顶点折角、展开剪开，再移B接齐；比较两种剪线、材料与作品。由家长陪同操作。',
      '实际用自己的剪线或接法尝试另一件作品，说清改变条件；保留不同合法结果，不强求与网页相同。',
    ].map((prompt, i): Question => ({
      id: `${id}-manual-${i}`,
      knowledge: `${id}-manual-${i}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '实际完成后独立人工确认；没有材料可暂时跳过。',
      explanation: '网页答题与实际折剪拼分别记录，不自动完成实物任务。',
    })),
    ...[
      '你怎样区分折起纸层、剪出的纸片和拼好的完整外轮廓？记录自己的理解或困难。',
      '你的剪线与接法是什么，得到怎样的作品？尚未实际做可说明还待尝试，没有唯一答案。',
    ].map((prompt, i): Question => ({
      id: `${id}-reflection-${i}`,
      knowledge: `${id}-reflection-${i}`,
      prompt,
      rule: { kind: 'reflection' },
      hint: '写真实想法，不照抄标准句。',
      explanation: '原话独立保存，correct为null，不替代实物确认。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读92页活动与原创折剪拼几何核验',
    notes: `依据ISBN ${source.isbn}印刷92页活动，四阶段原创比例；复习宽由4改6并交换两种剪线，A边数及剪线终点随条件改变。不复制扫描，不证明剩余期末与全册完成。`,
  },
};
