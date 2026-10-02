import type {
  Lesson,
  PlaneCardsVisual,
  PlaneShape,
  Question,
} from '../learning/types';

import { sujiaoLowerSource as source } from './sujiao-lower-source';

const id = 'sj-lower-plane-review';
const families = ['circle', 'square', 'rectangle', 'triangle'] as const;
const names: Record<PlaneShape, string> = {
  circle: '圆',
  square: '正方形',
  rectangle: '长方形',
  triangle: '三角形',
};
function cards(review: boolean): PlaneCardsVisual {
  const shapes: PlaneShape[] = review
    ? [
        'triangle',
        'rectangle',
        'circle',
        'square',
        'triangle',
        'rectangle',
        'square',
        'circle',
        'triangle',
        'rectangle',
      ]
    : [
        'circle',
        'square',
        'triangle',
        'rectangle',
        'square',
        'circle',
        'rectangle',
        'triangle',
        'circle',
        'square',
      ];
  return {
    kind: 'plane-cards',
    cards: shapes.map((shape, index) => ({
      shape,
      size: index % 2 ? 1 : 2,
      turn: index % 2 ? 45 : 0,
    })),
  };
}
function tasks(review: boolean): Question[] {
  const visual = cards(review);
  const partition = {
    kind: 'partitioned-square' as const,
    layout: review ? ('triangles' as const) : ('rectangles' as const),
  };
  const base = (key: string, prompt: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
  });
  const choice = (
    key: string,
    prompt: string,
    options: string[],
    value: string,
    explanation: string,
  ): Question => ({
    ...base(key, prompt),
    choices: options.map((label, index) => ({ id: String(index), label })),
    rule: { kind: 'choice', value },
    hint: '明确看每一片、完整外轮廓，还是实物的某个面，不把不同范围混在一起。',
    explanation,
  });
  return [
    ...families.map((shape): Question => ({
      ...base(
        `count-${shape}`,
        `${review ? '换了摆图' : '这组图卡'}只按形状分类，有几个${names[shape]}？大小、朝向不同仍分别数，每张只算一次。`,
      ),
      visual,
      rule: {
        kind: 'number',
        value: visual.cards.filter((card) => card.shape === shape).length,
      },
      hint: '先按轮廓找全同类，再逐张记号；不按大小或字母分类。',
      explanation: `同类有${visual.cards.filter((card) => card.shape === shape).length}张。转向和大小不改变类别，同一张不能重复计数。`,
    })),
    {
      ...base(
        'piece-total',
        '字母A～E各标一整片。拼成完整图后一共用了几片？不把外面的大图再当一片材料。',
      ),
      visual: partition,
      rule: { kind: 'number', value: 5 },
      hint: '按每片的完整边界分别数，外轮廓是拼成的结果。',
      explanation:
        'A～E五片全用上；内部接缝不是额外材料，大外轮廓也不是第六片。',
    },
    {
      ...base(
        'piece-rectangles',
        '只数单独纸片，按本课正方形另分组，有几片长方形？不数几片合起来的外轮廓。',
      ),
      visual: partition,
      rule: { kind: 'number', value: review ? 0 : 4 },
      hint: '逐片看四个角和长短边，中心纸片与外轮廓分开。',
      explanation: review
        ? 'A～D为三角形，E为正方形，本题长方形片为0。'
        : 'A～D为四块长方形，E为正方形，按本课另分组。',
    },
    {
      ...base(
        'piece-squares',
        '只数单独纸片，有几片正方形？先别把整幅外轮廓算进纸片数。',
      ),
      visual: partition,
      rule: { kind: 'number', value: 1 },
      hint: '中心纸片即使斜放，类别也不改变。',
      explanation: '只有E这片是正方形，整个外轮廓是拼后的结果，不再当材料片。',
    },
    {
      ...choice(
        'whole-outline',
        review
          ? '换成另一组材料后，沿最外面走一圈，完整外轮廓叫什么？'
          : '把内部接缝先放一边，沿最外面走一圈，完整外轮廓叫什么？',
        ['正方形', '三角形', '圆'],
        '0',
        '完整外轮廓为正方形；材料各是什么与合起来是什么分别观察。',
      ),
      visual: partition,
    },
    {
      ...base(
        'circle-straight',
        review
          ? '转动一张真正的圆形纸片，它的轮廓仍有几条直边？'
          : '圆形纸片的弯曲轮廓有几条直边？',
      ),
      rule: { kind: 'number', value: 0 },
      hint: '圆的轮廓是曲线；有限直线段围成的多边形不是真正圆。',
      explanation: '真正圆没有直边，转向不改变这个特点。',
    },
    choice(
      'actual-print',
      review
        ? '换一个未查看的长方体，没有看各面实际大小，就断定一定印出三种不同长方形，可以吗？'
        : '还没有印或比较手中的长方体，就把网页示例“三种不同长方形”当成实物固定结果，可以吗？',
      ['不可以，需要实际印、转向叠放比较', '可以，只要名称是长方体就一定三种'],
      '0',
      '材料不同，面形状大小的种数可能不同；没有材料或没做要记待做，不预填示例答案。',
    ),
    choice(
      'seams',
      review
        ? '数新拼图的外边，要把中心片与旁边片之间接缝也当外边吗？'
        : '数完整拼图的外边时，里面的拼接线也算外边吗？',
      ['不算，外边沿最外轮廓观察', '算，看到的线全是外边'],
      '0',
      '内部接缝和完整外边不是同一范围；数材料片时再看每片边界。',
    ),
    choice(
      'same-category',
      review
        ? '一大一小两个三角形都属于同类，只转向就必定完全重合吗？'
        : '一大一小两个正方形属于同类，只转向就必定完全重合吗？',
      ['不一定，还要形状大小完全一样', '必定，类别相同就够了'],
      '0',
      '转向不放大或缩小，大小不同不能只转向就完全重合。',
    ),
  ];
}

export const sujiaoPlaneReviewDraft: Lesson = {
  id,
  title: '图形整理：分类印面、完整拼图与分别回顾',
  textbookTitle: '图形的初步认识（二）·练习与评价',
  page: 31,
  version: 1,
  status: 'preparing',
  goal: '实际分类涂色计数、印不同面、制作完全一样轮廓，用全部指定片拼完整正方形，并分别评价认图、操作和观察。',
  prerequisite:
    '完成认图、描面、补图、剪拼、折纸与数图课；准备纸笔和安全积木，实物材料缺少的活动可待做。',
  parentTip: `依据ISBN ${source.isbn}印刷25、27、31页补齐实际活动与三项评价，图卡与两套五片正方形比例均为原创，不复制附页原图。真正印面与描边分开；选家长认可的可清洗材料和涂料，不给带电插座或尖锐物品涂色。没有印面材料保持待做，不能用纸上描边冒充印面。实物结果按实际材料，三项评价null、计划不当完成。`,
  steps: [
    {
      title: '先分类涂色，再分别计数',
      text: '把原创图卡画在纸上，同类使用同样的自选颜色，再分别数圆、正方形、长方形、三角形。颜色只是分类标记，换了颜色、大小或朝向不改变形状类别；同一张只数一次。网页输入只是图示计数，实际画、涂和核对另确认。',
      visual: cards(false),
      activity:
        '实际在纸上画图卡并分类涂色，逐张记号再计数，与家人核对是否重数或漏数。',
    },
    {
      title: '真正印不同面，不预填种数',
      text: '家长协助，用同一块安全积木的不同平整面轻轻印在纸上，说出各轮廓。再转向、叠放比较形状大小，把能完全叠齐的印迹归在一起；印了三次不等于三种大小。正方体的不同面同样大；长方体实际种数要检查材料，不能照搬网页。描边与印面是两种操作，未印如实待做。',
      activity:
        '家长准备可清洗、安全材料，实际印同一积木至少两个不同平整面，比较记录；没材料暂跳，不强制购买。',
    },
    {
      title: '制作完全一样的轮廓',
      text: '用同一个面重复描两个轮廓，或描同一张纸片，再允许转向后叠放比较。钉点板上先围自己喜欢的图，再围一个形状大小完全一样的，说明怎样检查。只是同类不够，网页选对也不代表已经制作或交流；剪裁由家长完成。',
      activity:
        '实际重复描同一面的两个轮廓，转向叠放；在安全钉点板另围一对完全一样的图，与家人说方法。',
    },
    {
      title: '全部材料拼成完整正方形',
      text: '第一套原创材料A～D为四个长方形，E为中心正方形，全部五片拼成外面的大正方形。另一套A～D为三角形、E仍是正方形，尺寸关系由第二张示意单独给定。两套材料不能混用比例；家长按同一图中的边界准备纸片。逐片核对全用上、无重叠、无空隙，内部接缝不当外边。中心片斜放仍是正方形。',
      visual: { kind: 'partitioned-square', layout: 'rectangles' },
      activity:
        '实际按本图准备五片全部拼回外轮廓，指出每片和拼后的整体，说明为什么不是六片。',
    },
    {
      title: '换材料检查，再分三方面回顾',
      text: '换第二套原创材料，仍需全部参与、无重叠无空隙，用真实纸片试拼并说明接缝与外轮廓。分别回顾：能否辨认五类图形；能否描、围、折、剪、拼学过的图形；是否仔细观察、实际动手。可写已做例子、还需帮助或尚未做，不由网页得分自动产生星级，未来想做的事单独写成计划。',
      visual: { kind: 'partitioned-square', layout: 'triangles' },
      activity:
        '实际换第二套纸片拼完整正方形并交流，再按三方面留下独立真实自评。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际把原创图卡画在纸上，按类别涂同样的自选颜色，分别计数并逐张记号核对；颜色不是图形定义。',
      '实际用同一块安全积木印至少两个不同平整面，家长协助使用可清洗材料；再转向叠放比较形状大小，保留真实种数。未印不能以描边替代确认。',
      '实际用同一个面重复描两个轮廓，允许转向叠放比较，再在安全钉点板围一对自己选择的完全一样图形，并向家人说明方法。没有钉点板可待做。',
      '家长按第一套原创示意的共同尺度准备四个长方形和中心正方形，实际五片全用上拼完整正方形，不重叠不留空隙，分别指片与整体。',
      '家长按第二套原创示意单独准备四个三角形与中心正方形，实际五片全用上试拼，核对接缝、外轮廓和中心片，再向家人说明。不能沿用第一套尺寸。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '实际完成后分别确认，没有材料可暂跳；未来计划与网页答案不代替实际操作。',
      explanation: '按该任务的真实完成记录，不自动断言掌握或补造实物结果。',
      ...(index >= 3
        ? {
            visual: {
              kind: 'partitioned-square' as const,
              layout:
                index === 3 ? ('rectangles' as const) : ('triangles' as const),
            },
          }
        : {}),
    })),
    ...(
      [
        [
          'recognition',
          '长方形、正方形、三角形、圆、平行四边形，你能辨认哪些、哪些还需帮助？记真实例子，尚未做可说明。',
        ],
        [
          'construction',
          '描、围、折、剪、拼学过的图形，你实际完成了哪些操作？还有哪些待做或需要帮助？',
        ],
        [
          'observation',
          '你怎样仔细观察、实际动手并核对结果？写一个真实过程；未来准备做的事请明确写成计划。',
        ],
      ] as const
    ).map(([key, prompt]): Question => ({
      id: `${id}-evaluation-${key}`,
      knowledge: `${id}-evaluation-${key}`,
      prompt,
      rule: { kind: 'reflection' },
      hint: '三方面独立保存，允许写尚未做或还需帮助。',
      explanation: '开放自评correct null，不用网页得分自动生成星级。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt: '记录这次分类、印面或拼图的新发现，或还需要核对的问题。',
      rule: { kind: 'reflection' },
      hint: '保留自己的话，不要求统一答案。',
      explanation: '反思null，与实际操作确认分开。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '逐页实际活动、材料边界与原创拼图核验',
    notes: `ISBN ${source.isbn}印刷25、27、31页相关活动，原创十张图卡与两套五片比例；复习换分类数量和材料布局，未复制附页。实际印面、围图、拼组人工确认，版次印次未知，最终教师审校待做。`,
  },
};
