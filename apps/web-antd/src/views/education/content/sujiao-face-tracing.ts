import type {
  Lesson,
  Question,
  SolidFaceTracesVisual,
} from '../learning/types';

import { required } from '../learning/required';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-face-tracing';
const shapes = [
  { id: 'square', label: '正方形' },
  { id: 'rectangle', label: '长方形' },
  { id: 'triangle', label: '三角形' },
  { id: 'circle', label: '圆' },
];
function visual(solid: SolidFaceTracesVisual['solid']): SolidFaceTracesVisual {
  return { kind: 'solid-face-traces', solid };
}
function tasks(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const cases: [SolidFaceTracesVisual['solid'], string, string][] = review
    ? [
        ['cube', 'B', 'square'],
        ['cuboid-square-end', 'A', 'rectangle'],
        ['cuboid-distinct', 'C', 'rectangle'],
        ['cuboid-square-end', 'B', 'rectangle'],
        ['cuboid-distinct', 'B', 'rectangle'],
        ['cube', 'C', 'square'],
        ['triangular-prism', 'B', 'rectangle'],
        ['triangular-prism', 'A', 'triangle'],
      ]
    : [
        ['cube', 'A', 'square'],
        ['cuboid-distinct', 'A', 'rectangle'],
        ['cuboid-distinct', 'B', 'rectangle'],
        ['cuboid-distinct', 'C', 'rectangle'],
        ['cuboid-square-end', 'A', 'rectangle'],
        ['cuboid-square-end', 'C', 'square'],
        ['triangular-prism', 'A', 'triangle'],
        ['triangular-prism', 'B', 'rectangle'],
      ];
  return [
    ...cases.map(([solid, letter, answer], index): Question => ({
      id: `${prefix}-classify-${index}`,
      knowledge: `${id}-classify-${index}`,
      prompt: review
        ? `换一个选定面：${letter}平放描出的真实轮廓是哪一类？`
        : `选定面${letter}平放描出的轮廓是哪一类？看下方对应字母描图，不把上方透视当描图。`,
      visual: visual(solid),
      choices: shapes,
      rule: { kind: 'choice', value: answer },
      hint: '字母对应同一个面。看平放轮廓的边和角，整体积木与描出的平面图形不同。',
      explanation: `本题${letter}面平放描图是${required(shapes.find((s) => s.id === answer)).label}。斜着看到的投影可能变斜或变短，真实描面没有因此改变形状。`,
    })),
    {
      id: `${prefix}-different-rectangles`,
      knowledge: `${id}-different-rectangles`,
      prompt: review
        ? '换一种长方体：按本课分类，A、B、C中有几种不同大小的长方形描图？正方形另分组，能叠齐的不重复计种。'
        : '本长方体A、B、C都描成长方形。按形状大小是否完全一样来分，有几种不同长方形？不是问共几个面。',
      visual: visual(review ? 'cuboid-square-end' : 'cuboid-distinct'),
      rule: { kind: 'number', value: review ? 1 : 3 },
      hint: '比一比三个描图的边长，允许转动后叠放；都叫长方形不等于完全一样。',
      explanation: review
        ? '这次A、B同为2×3，只有一种长方形描图；C是2×2正方形，按本课另分组。'
        : '本例三个方向长度各不同，A为2×4、B为3×4、C为2×3，三种描图不能转向后完全重合。相对的面能重合，不再增加种类；这里最大可以有三种不同长方形，不是说每个长方体都有三种。',
    },
    {
      id: `${prefix}-same-rectangles`,
      knowledge: `${id}-same-rectangles`,
      prompt: review
        ? '换一种材料：A、B、C都是长方形但不能转向叠齐，共有几种不同大小的长方形描图？'
        : '这个长方体A、B描图能完全重合，C为另一类图形。按本课分类，有几种不同长方形描图？',
      visual: visual(review ? 'cuboid-distinct' : 'cuboid-square-end'),
      rule: { kind: 'number', value: review ? 3 : 1 },
      hint: '数不同种类大小，不把两个能重合的面算两种；本课长方形、正方形分组。',
      explanation: review
        ? '这次三种描图分别为2×4、3×4、2×3，都不能重合，共三种大小。'
        : 'A、B同为2×3，可以重合，只有一种长方形描图。C为2×2正方形，按一年级本课分类另分组；不能据此说所有长方体都是一样的。',
    },
    {
      id: `${prefix}-same-squares`,
      knowledge: `${id}-same-squares`,
      prompt: review
        ? '这次换成长方体：A、B不是正方形，C是正方形。图中有几种不同大小的正方形描图？'
        : '正方体A、B、C都描下来，按形状大小完全一样来合并，有几种不同正方形？',
      visual: visual(review ? 'cuboid-square-end' : 'cube'),
      rule: { kind: 'number', value: 1 },
      hint: '三个描图不等于三种不同大小；转向后叠放检查。',
      explanation: review
        ? '这次只有C属于正方形描图，有一种大小；A、B按本课分类为长方形。'
        : '同一个正方体各面形状大小完全相同，所以只有一种正方形描图。面有多个，形状大小的种类仍是一种。',
    },
    {
      id: `${prefix}-whole`,
      knowledge: `${id}-whole`,
      prompt: review
        ? '拿起积木后纸上只剩描线，纸上的方形轮廓是不是一个新的立体积木？'
        : '把积木的一个面描在纸上，纸上的轮廓和整个立体积木是同一种东西吗？',
      rule: { kind: 'choice', value: 'no' },
      choices: [
        { id: 'no', label: '不是，描图是平面轮廓，积木是立体物体' },
        { id: 'yes', label: '是，描一个面就多一个立体积木' },
      ],
      hint: '区分物体、选定面和纸面描线。',
      explanation:
        '描出的平面轮廓不是新积木；观察面不等于把整个物体当成同一种平面图形。',
    },
    {
      id: `${prefix}-hidden`,
      knowledge: `${id}-hidden`,
      prompt: review
        ? '三棱柱示意只选A、B，是不是证明它没有其他面？'
        : '图里只展示三棱柱的A、B两面，能说这个积木只有两个面吗？',
      visual: visual('triangular-prism'),
      rule: { kind: 'choice', value: 'no' },
      choices: [
        { id: 'yes', label: '能，图没显示的面就不存在' },
        { id: 'no', label: '不能，这里只选了两个面作比较' },
      ],
      hint: '选定的面、当前看得到的面和整个物体的所有面不是一回事。',
      explanation:
        '网页只选两个面来描，不代表全部面。实际转动积木还可以观察别的面；本题不要求背面数公式。',
    },
    {
      id: `${prefix}-turn`,
      knowledge: `${id}-turn`,
      prompt: review
        ? '把同一张长方形描图转半圈，能因此认定它变成另一种大小吗？'
        : '同一描图换朝向，看起来宽高方向交换，就一定变成另一种大小吗？',
      rule: { kind: 'choice', value: 'no' },
      choices: [
        { id: 'no', label: '不能，转向不改变形状大小，要叠放比较' },
        { id: 'yes', label: '能，朝向不同就算另一种大小' },
      ],
      hint: '可以转一转、叠一叠再判断。',
      explanation:
        '转向不改变形状大小。同种名称不保证能重合；朝向不同也不保证不能重合。',
    },
  ];
}
export const sujiaoFaceTracingDraft: Lesson = {
  id,
  title: '描面比较：同一积木，不同轮廓',
  textbookTitle: '图形的初步认识（二）·印面与不同大小比较',
  page: 25,
  version: 1,
  status: 'preparing',
  goal: '把立体物体、选定面和描图区分开，观察三棱柱的三角形面，比较同一长方体不同面的形状大小。',
  prerequisite: '认识长方形、正方形和三角形，能转向叠放比较形状大小。',
  parentTip:
    '选可安全平放的积木或纸盒，家长帮助压稳描边。模型采用原创固定比例；本课长方形和正方形按一年级分类分组。同一物体的面比较，不把透视变形当真实轮廓，实际描图单独确认。',
  steps: [
    {
      title: '立体示意与平放描图不同',
      text: '同一个正方体，选前面A、右面B、上面C。示意图里有的面斜着看，显得变斜或变短，但平放描图仍是一样大的正方形。面有多个，不代表不同大小有多种；描线不是新的积木。',
      visual: visual('cube'),
      activity:
        '选同一个正方体，描两个不同面，转向叠放比较；不拿两个不同大小的积木替代。',
    },
    {
      title: '同样叫长方形，大小也可能不同',
      text: '这个原创长方体三个方向长短都不同，选的三个面描图都叫长方形，但边长配对不同，转向后也不能完全重合。相对面能重合，不会再新增一种。这种材料最多可以出现三种不同长方形描图；不能说每个长方体都一定有三种。',
      visual: visual('cuboid-distinct'),
      activity:
        '在同一个长方体上描不同面，允许转动描图后叠放，记录哪些完全一样。',
    },
    {
      title: '长方体也可能有正方形面',
      text: '另一种长方体有两个方向同样长。A、B描图都是同样大小长方形，C描图为正方形。与前一个材料不同，这个例子只有一种长方形大小。要检查实际材料，不凭“长方体”名称给固定种数。',
      visual: visual('cuboid-square-end'),
      activity:
        '寻找带正方形面的盒子或积木，与前一个材料比较；没有这种材料可以跳过。',
    },
    {
      title: '三棱柱的不同面',
      text: '这种积木叫三棱柱，本课只用来找面，不要求背立体知识。选前面的A，平放可描出三角形；选右侧的B，平放可描出长方形。只显示A、B不代表仅有两面；转动实物继续观察，区别真实平面和立体示意。',
      visual: visual('triangular-prism'),
      activity:
        '家长提供安全三棱柱或对应纸模型，压稳一个三角形面和一个长方形面分别描边，比较轮廓。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '在同一个正方体上描两个不同面，叠放检查形状大小，说明两个描图不等于两种不同大小。',
      '在同一个长方体上找不同面分别描边，允许转向后比较。记录实际有几种大小，不要求一定出现三种。',
      '用安全三棱柱或纸模型描一个三角形面、一个长方形面，再转动找其他面；指出实物、选定面与纸上描图的区别。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '真实描边、转向叠放和解释后人工确认；没有材料可跳过。',
      explanation:
        '网页示例不是实物活动完成证明。按实际材料保留不同观察，不强制每个长方体同一答案。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt: '为什么不同面都叫长方形，却不一定一样大？记自己的发现或疑问。',
      rule: { kind: 'reflection' },
      hint: '可以谈选定面、转向、叠放或同一物体。',
      explanation: '保存原话，不评唯一答案，不代替实物描面。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读描面探索与原创立体、平放轮廓检查',
    notes: `依据印刷第24～25页找面与同物体印面探索，ISBN ${source.isbn}。固定原创立体比例与平放描图分开；正方体、两种长方体和三棱柱选定面，不复制教材图文。分类、完全重合、不同大小种数和面数分开，未显示面不当不存在；实物人工确认。版次印次仍未核验，不代替候选拼图和完整单元。`,
  },
};
