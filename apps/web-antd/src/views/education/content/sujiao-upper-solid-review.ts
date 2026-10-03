import type { Lesson, Question, SolidBuildVisual } from '../learning/types';

import { required } from '../learning/required';
import { solidBuildCount } from '../learning/solid-build';
import { sujiaoUpperSource as source } from './sujiao-upper-source';

const id = 'sj-upper-solid-review';
function models(review: boolean): SolidBuildVisual[] {
  return (
    review
      ? [
          [
            'cuboid',
            'cylinder',
            'sphere',
            'cube',
            'cuboid',
            'cylinder',
            'sphere',
            'cuboid',
            'cylinder',
          ],
          [
            'cylinder',
            'cube',
            'sphere',
            'cube',
            'cylinder',
            'cuboid',
            'cube',
            'cuboid',
            'cube',
          ],
        ]
      : [
          [
            'cylinder',
            'cube',
            'cuboid',
            'cuboid',
            'cylinder',
            'sphere',
            'sphere',
            'cube',
            'cuboid',
          ],
          [
            'cube',
            'sphere',
            'cylinder',
            'cuboid',
            'cube',
            'cylinder',
            'cuboid',
            'sphere',
            'cylinder',
          ],
        ]
  ).map((shapes): SolidBuildVisual => ({
    kind: 'solid-build',
    shapes: shapes.map((shape) => {
      if (
        shape !== 'cube' &&
        shape !== 'cuboid' &&
        shape !== 'cylinder' &&
        shape !== 'sphere'
      )
        throw new Error('Invalid solid');
      return shape;
    }),
  }));
}
function tasks(review: boolean): Question[] {
  const base = (key: string, prompt: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
  });
  return [
    ...models(review).flatMap((visual, index): Question[] => [
      {
        ...base(
          `composition-${index}`,
          `原创分解作品${index === 0 ? '甲' : '乙'}：按正方体、长方体、圆柱、球顺序填每类部件数。全部部件都画出，留缝为看清，不增补后排。`,
        ),
        visual,
        rule: {
          kind: 'steps',
          values: (['cube', 'cuboid', 'cylinder', 'sphere'] as const).map(
            (shape) => solidBuildCount(visual, shape),
          ),
        },
        hint: '从上到下逐个找同类，每个完整部件只计一次，不数面数。',
        explanation: `四类依次${(['cube', 'cuboid', 'cylinder', 'sphere'] as const).map((shape) => solidBuildCount(visual, shape)).join('、')}个；实际搭建另看真实材料。`,
      },
      {
        ...base(
          `total-${index}`,
          `作品${index === 0 ? '甲' : '乙'}的分解示意共有几个部件？不把作品整体再加1。`,
        ),
        visual,
        rule: { kind: 'number', value: visual.shapes.length },
        hint: '每个完整物体一块，归类后合并核对。',
        explanation: `共${visual.shapes.length}个完整部件；部件数、面数、类别数各不同。`,
      },
    ]),
    {
      ...base(
        'one-object',
        review
          ? '一块长方体转过来又露出另一个面，物体数增加了吗？'
          : '一块正方体有多个面，能把每个可见面各算一个部件吗？',
      ),
      choices: [
        { id: 'no', label: '不能，仍是同一整个物体' },
        { id: 'yes', label: '能，每个面各是一块' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '移动或转向不凭空产生新部件。',
      explanation: '数整个物体，多个面属于同一个部件。',
    },
    {
      ...base(
        'height-needs-evidence',
        review
          ? '换了一套更矮的圆柱和更高的长方体，能沿用上次哪三块最高的结论吗？'
          : '只知道七块模型的形状名称，没看大小或试摆，就能确定哪三块稳稳搭得最高吗？',
      ),
      choices: [
        {
          id: 'observe',
          label: '不能，比较这次的大小、摆法、稳不稳并实际试搭',
        },
        { id: 'guess', label: '能，只按形状名称固定选三种' },
      ],
      rule: { kind: 'choice', value: 'observe' },
      hint: '形状名不提供真实高度；换材料或方向须重新比较。',
      explanation:
        '实际最高取决于材料和允许的摆放，稳定性也要观察，不能宣称一种形状永远最高。',
    },
  ];
}

export const sujiaoUpperSolidReviewLesson: Lesson = {
  id,
  title: '立体作品：数部件、选三块搭高与独立自评',
  textbookTitle: '图形的初步认识（一）·练习六与评价',
  page: 60,
  status: 'available',
  version: 2,
  goal: '对两幅原创分解作品按四种立体分类点数，观察生活物品并用积木模仿，另完成原书两幅图的填数与照样搭建；实际从七块选三块比较搭高，分别记录辨认、拼搭、仔细观察认真做三个方面。',
  prerequisite:
    '认识四种立体形状与0～9；准备七块安全模型、平整桌面，含方块/长盒/直圆柱/球及不同大小；无模型暂留待做。',
  parentTip: `对应ISBN ${source.isbn}印刷56、60～61页。原创两作品各九部件，分解间隙只为看清，不表示实物悬空。生活物品模仿和原书两图填搭另行尝试，不用原创图答案代替。实际选三块允许不同合理结果，需相同桌面、位置参照和材料，比较稳定高度而非只背形状。实际证据与三项reflection null分别保存；不自动打星。图示不复制教材，也不冒已照教材原图搭完。`,
  steps: [
    {
      title: '两幅作品，分开数完整部件',
      text: '按正方体、长方体、圆柱、球各找一次，再检查全部部件。甲和乙是两幅独立原创作品，不能把甲的数量沿用乙；空隙为看清部件，不表示真实可以悬空。一部件的几个面不另计，整个作品也不另加1。',
      visual: required(models(false)[0]),
      activity:
        '实际指每个完整部件记录甲的四类，再看下一幅重新计数；原教材组合图另需观察，不冒用原创图答案。',
    },
    {
      title: '第二幅重新分类，再自主搭一件',
      text: '乙的部件顺序和四类数量改变了，每类重新找。从上到下逐个指，每个部件归到一类；总块数相同并不代表每类相同。实际用模型创作一件喜欢的作品，分别指出各类和整个作品，能搭稳才算实际摆出的结构。',
      visual: required(models(false)[1]),
      activity:
        '实际记录乙四类，并用自己的安全模型搭作品，数各类和总块；没有的类写0，不能猜隐藏部件。',
    },
    {
      title: '选生活物品，用模型模仿',
      text: '第56页的活动先选一个生活中的物品，再用积木模仿它的样子，并说明用了哪些形状。先观察整体和主要部分，决定哪些模型合适；不只自由搭一件与所选物品无关的作品。积木模型是近似表示，不表示尺寸、功能或每个细节都一样。',
      activity:
        '实际选一件安全的生活物品，在家长陪同下观察，再用安全积木模仿。指着实物和模型解释哪些部分相对应、用了哪些形状、哪里不同；没有材料或未尝试就保留待做。',
    },
    {
      title: '原书两幅作品：先填全，再照样搭',
      text: '第60页练习六第5题有两幅组合图。先逐个辨认完整部件，每幅分别记录正方体、长方体、圆柱、球的数量，完成两幅共八处填写；再照两幅图分别尝试搭建。本站甲乙分解图是另一组原创练习，不能用它们的数替原图的数，也不以自由作品替代照样搭。',
      activity:
        '与家长打开原书第60页，逐幅指部件、完成八处填写，再分别照样搭并说明实际用料和稳定情况。材料不相同可记录近似替代及差异；未核清的部分标待核对，不猜隐藏物体，也不把尚未搭建记为已做。',
    },
    {
      title: '七块选三块，实际比较搭高',
      text: '准备七块安全模型并标A～G，先观察大小。每次从中选恰好三块，在同一桌面稳稳堆高，全部三块都用上，不借第四块或扶着说已稳。长方体可换摆向、圆柱可竖或横，先比较可平放的面；球难稳时如实记录，不能按名字断言绝对结果。',
      activity:
        '实际至少试三种选法或摆向，用纸在相同位置标顶端，记录所选三块、方向、是否稳和高度比较。保留更高/相同/更矮的真实结果，说明当前观察范围内哪个最高，不夸称试遍所有。',
    },
    {
      title: '三项分别留下真实证据',
      text: '辨认：实际看四种模型，转动或触摸后说名字和理由，颜色大小不替形状。拼搭：实际做一个作品，说明用了哪些形状和各几块，按参照物讲位置，检查稳定。认真做：先看材料与要求，逐个检查数、摆与说明，记录一次发现错误和重新核对；没有错误也如实描述检查过程。',
      activity:
        '三个方面分别记录今天真实做到的事与家人帮助；网页填对不代替动手，未来想做另写。',
    },
    {
      title: '辨认、拼搭、认真做各自评价',
      text: '分别用今天真实例子说能辨认四种立体、能用四种模型拼搭、能仔细看认真做的表现。说清独立做到和仍需帮助，不因为全答对就自动给星。未实际做可写尚未做；下次想认识的新形状或新作品是计划，不当今天完成。',
      activity:
        '保存三项独立反思，正确性null；家人补观察可以，但不替孩子虚构实际活动。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      [
        'actual-two-compositions',
        '实际逐个指两幅原创分解作品，分别记录四类和总块；用自己的模型搭一件喜欢的作品，指部件归类，说明局部与整体。原教材图若另看需单独记录，不拿原创答案当原图已做。',
      ],
      [
        'actual-three-high',
        '实际标好七块A～G，每次选恰好三块，同一桌面至少比较三种选法或方向，标记顶端，记录三个都用/能否稳/高矮及理由。没试遍不声称全局最优，没模型暂跳。',
      ],
      [
        'actual-evaluation-recognition',
        '实际观察、转动或触摸四种安全模型，分别认读长方体/正方体/圆柱/球并说形状依据，记录真实帮助；只做屏幕选择不能确认。',
      ],
      [
        'actual-evaluation-building',
        '实际搭自己的作品，说明各类几块、总块与至少一个参照位置，检查稳不稳；记录真实材料/行为和帮助，计划或示意图不当实物。',
      ],
      [
        'actual-evaluation-care',
        '实际先看要求再逐个核对材料、数块和摆法，记录一次真实检查过程，错误与纠正如实保留，没有错不编造。向家人说明检查依据与帮助。',
      ],
    ].map(([key, prompt]): Question => ({
      id: `${id}-${required(key)}`,
      knowledge: `${id}-${required(key)}`,
      prompt: required(prompt),
      rule: { kind: 'manual' },
      hint: '实际完成并留下记录才确认，没条件暂跳；未来计划单独写。',
      explanation: '人工只记真实操作，不自动评为掌握。',
    })),
    ...[
      [
        'reflection-recognition',
        '辨认四种立体：写今天实际认读/转动/触摸的例子，独立做到什么与哪里需要帮助；未做写尚未做，未来计划另记。',
      ],
      [
        'reflection-building',
        '用四种立体拼搭：写今天实际作品、各类/位置与稳定检查的例子和帮助；没有真实搭建不写已完成。',
      ],
      [
        'reflection-care',
        '仔细看、认真做：写今天真实核对数块与摆法的行为、纠正或困难、得到的帮助。下一次计划另记，不自动打星。',
      ],
    ].map(([key, prompt]): Question => ({
      id: `${id}-${required(key)}`,
      knowledge: `${id}-${required(key)}`,
      prompt: required(prompt),
      rule: { kind: 'reflection' },
      hint: '用真实例子自评，没做如实说，不要求都掌握。',
      explanation: '自评正确性null，不自动给答案或星级。',
    })),
    {
      id: `${id}-actual-life-imitation`,
      knowledge: `${id}-actual-life-imitation`,
      prompt:
        '实际完成第56页生活物品模仿：先选并观察一个生活物品，用安全积木模仿其主要部分，指着实物和模型说用了哪些形状、对应哪里和哪些地方不同。不是只自由创作；未尝试或缺材料可暂跳。',
      rule: { kind: 'manual' },
      hint: '先观察所选物品，再搭模型；材料和尺寸可不同，如实说明近似处与差异。',
      explanation: '真实观察、模仿搭建与解释人工确认，网页图题不代替动手。',
    },
    {
      id: `${id}-actual-source-two-compositions`,
      knowledge: `${id}-actual-source-two-compositions`,
      prompt:
        '实际完成原书第60页练习六第5题：两幅图分别指完整部件，按正方体、长方体、圆柱、球完成共八处填数，再分别照样尝试搭建并说明用料、替代差异和稳定情况。本站甲乙图的数不能当原图答案；未知处待核对，未搭不记已搭。',
      rule: { kind: 'manual' },
      hint: '先各填完整，再各照样搭；家长帮助核对原图，材料不足或未做可暂跳。',
      explanation:
        '两幅原图完整填写和照样搭建单独人工记录，不自动用原创题答案确认。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-04',
    reviewer: '同版生活模仿、原图填搭、组合计数与评价核对',
    notes:
      '同版2024年7月第1版、2025年7月第2次印刷正文已核验；两幅作品均换部件组成，不能沿用主课四类数；总块不变仍需按新图核对。实际选三搭高与辨认/拼搭/认真做分别记录。2026-10-04重核第56、60页，另补生活物品模仿和原书两图八处填写及照样搭建，旧14题不改写。最终教师审校未核验。',
  },
};
