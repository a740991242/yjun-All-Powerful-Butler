import type { GeoboardShiftVisual, Lesson, Question } from '../learning/types';

import { boardShape } from '../learning/geoboard-shift';
import { required } from '../learning/required';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-geoboard-shift';
export function shiftExamples(review: boolean): GeoboardShiftVisual[] {
  return (
    review
      ? [
          [4, -1],
          [4, 0],
          [3, 2],
          [3, 0],
        ]
      : [
          [3, 1],
          [3, -1],
          [3, 0],
          [4, 1],
        ]
  ).map(([width, shift]) => ({
    kind: 'geoboard-shift',
    width,
    shift,
  })) as GeoboardShiftVisual[];
}
function tasks(review: boolean): Question[] {
  const models = shiftExamples(review);
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const names = { rectangle: '长方形', parallelogram: '平行四边形' };
  return [
    ...models.map((visual, index): Question => ({
      id: `${prefix}-${index}-shape`,
      knowledge: `${id}-${index}-shape`,
      prompt: review
        ? '换了围图条件，观察完整外轮廓，它是哪种图形？'
        : '观察原图四条边围出的完整外轮廓，它是哪种图形？不是只看上边。',
      visual,
      choices: [
        { id: 'rectangle', label: '长方形' },
        { id: 'parallelogram', label: '平行四边形' },
      ],
      rule: { kind: 'choice', value: boardShape(visual) },
      hint: '检查上边两点是否分别在下边两点的正上方，四个拐角是否像长方形角。',
      explanation: `本图是${names[boardShape(visual)]}。图示宽比上下两排间距长，不把直角轮廓称为正方形；当前题图固定，不使用讲解中的移动结果。`,
    })),
    ...models.slice(0, 2).map((visual, index): Question => ({
      id: `${prefix}-${index}-move`,
      knowledge: `${id}-${index}-move`,
      prompt:
        visual.shift === 0
          ? '新图已经是长方形，上边两点一起向右移一格、下边不动，会变成哪种图形？'
          : `这张${review ? '新' : '原'}图要改围成长方形，下边两点不动，上边两点应该怎样一起移动？`,
      visual,
      choices:
        visual.shift === 0
          ? [
              { id: 'parallelogram', label: '平行四边形' },
              { id: 'rectangle', label: '仍是长方形' },
            ]
          : [
              { id: 'left', label: '一起向左移一格' },
              { id: 'right', label: '一起向右移一格' },
            ],
      rule: {
        kind: 'choice',
        value: (() => {
          if (visual.shift === 0) return 'parallelogram';
          return visual.shift > 0 ? 'left' : 'right';
        })(),
      },
      hint: '要让上边两点分别对齐下边两点，两点移动方向和格数相同。',
      explanation:
        visual.shift === 0
          ? '只移动上边两点，原来的竖边变成斜边，完整轮廓变成平行四边形。'
          : '上边两点一起移动一格，使它们分别在下边两点的正上方，才能得到本题长方形。',
    })),
    ...[
      {
        key: 'pair',
        prompt: review
          ? '改围时只移A、B留原处，能当作本课整条上边一起移动吗？'
          : '本课改围时应怎样移动上边端点？',
        choices: review
          ? [
              { id: 'pair', label: '不能，两点须同向移同样格数' },
              { id: 'single', label: '能，移一个点就一样' },
            ]
          : [
              { id: 'pair', label: 'A、B一起同向移同样格数' },
              { id: 'single', label: '只移动A，B不动' },
            ],
        answer: 'pair',
        hint: '检查两个端点，不只看一个点。',
        explanation:
          '本课按钮移动上边两个端点；只移动一个点是另一种操作，不能冒充整边平移。',
      },
      {
        key: 'lower',
        prompt: review
          ? '上边端点移到新钉点时，下边C、D应怎样？'
          : '本课只移动上边两点，下边C、D怎样？',
        choices: [
          { id: 'fixed', label: '留在原钉点' },
          { id: 'move', label: '随上边一起移动' },
        ],
        answer: 'fixed',
        hint: '读清只移动哪一边。',
        explanation:
          '本课C、D固定；把四点一起移动只会整体换位置，不是这里的改围。',
      },
      {
        key: 'material',
        prompt: review
          ? '改变橡皮筋围住的钉点，可以叫把纸片剪成两片再拼吗？'
          : '钉点板改围与剪纸再拼，是同一种材料操作吗？',
        choices: [
          { id: 'no', label: '不是，改围改变围住的钉点' },
          { id: 'yes', label: '是，移动按钮就是剪纸' },
        ],
        answer: 'no',
        hint: '想一想手中用的是橡皮筋还是纸和剪刀。',
        explanation:
          '本课改围操作使用钉点板和橡皮筋，不画剪线、不把图示移动冒充剪纸拼组。',
      },
      {
        key: 'unit',
        prompt: review
          ? '换一块钉点板后，每格可以不测量就当作1厘米吗？'
          : '图中等距钉点每一格一定是1厘米吗？',
        choices: [
          { id: 'no', label: '不是，等距不代表厘米单位' },
          { id: 'yes', label: '是，所有钉点板一格都1厘米' },
        ],
        answer: 'no',
        hint: '图只说明间距相等，没有实际厘米刻度。',
        explanation: '可以数移动了几格，不能由网页格距直接推出实际厘米数。',
      },
    ].map((item): Question => ({
      id: `${prefix}-${item.key}`,
      knowledge: `${id}-${item.key}`,
      prompt: item.prompt,
      choices: item.choices,
      rule: { kind: 'choice', value: item.answer },
      hint: item.hint,
      explanation: item.explanation,
    })),
  ];
}
export const sujiaoGeoboardShiftDraft: Lesson = {
  id,
  title: '钉点板改围：斜边变直角',
  textbookTitle: '图形的初步认识（二）·改围图形',
  page: 31,
  version: 1,
  status: 'preparing',
  goal: '完整观察围图，固定下边两点、同时移动上边两点，将本课平行四边形改围成长方形并检查。',
  prerequisite: '认识长方形和平行四边形，能在等距钉点板上逐格移动。',
  parentTip:
    '本课是改围，不是剪纸。原创7列5排钉点板只开放上边两点整边移动，不能推广到任意四边形；真实橡皮筋可能伸缩，不声称长度不变，不教授面积公式。材料缺少可跳过实物确认。',
  steps: [
    {
      title: '看完整轮廓',
      text: '先看A、B、C、D四点和四条边。图中上边向右偏，左右两条边是斜边；下边C、D固定。上边宽3格，上下相隔2格，不能只看一条边猜整个形状。',
      visual: required(shiftExamples(false)[0]),
      activity: '指出上下两边和两个斜边，再说下边哪两个点不能动。',
    },
    {
      title: '上边两个点一起移动',
      text: 'A、B一起向左移一格，分别到D、C的正上方，再观察四个拐角，完整围图成为长方形。不要只移A；两个端点同向、同格数移动。按钮反馈只供观察，不代替实际围图确认。',
      visual: required(shiftExamples(false)[0]),
      activity: '用按钮试一次，再用真实钉点板和橡皮筋改围；家长协助安全操作。',
    },
    {
      title: '向另一边偏也能检查',
      text: '这一步上边向左偏，从这一步原图开始，A、B一起向右移一格，再对齐下边两点。每个步骤的学具分别保存，上一页的操作不会替你改好这一页；可重置本步重新试。',
      visual: required(shiftExamples(false)[1]),
      activity:
        '先指出偏的方向，再说明为何应向右移动，不能机械地每次都按向左。',
    },
    {
      title: '改围与剪拼分清楚',
      text: '换成宽4格的围图，仍同时移动上边两点，检查完整四边形。若从长方形把上边两点移开，它又成为本课斜边轮廓。这是改变橡皮筋围住的钉点，不是切开纸片；格数不代表厘米，也不说明所有橡皮筋长度保持不变。',
      visual: required(shiftExamples(false)[3]),
      activity:
        '改围后再恢复原围图，口述操作条件；另做剪纸时须另外说明纸片与剪线。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '操作这张围图，把上边两点同时移到下边两点正上方；在真实钉点板上完成同样改围并口述四个拐角。',
      '先判断向左偏的围图，再同时移动上边两点改围成长方形；用实物说明两点为什么要一起移动。',
      '用较宽的围图改围、恢复，实物操作后说明下边保持不动，并区分改围和剪纸拼组。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      visual: required(shiftExamples(false)[required([0, 1, 3][index])]),
      rule: { kind: 'manual' },
      hint: '网页可操作，实物操作与口述后人工确认；没有材料可跳过。',
      explanation: '图示反馈不自动记为实物完成，也不替孩子口述。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt: '你怎样决定向左还是向右移动？怎样检查改围结果？记自己的话。',
      rule: { kind: 'reflection' },
      hint: '可说上边偏向、两点对齐或四个拐角。',
      explanation: '反思原话独立保存，不设唯一答案。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读改围范围与原创钉点板条件检查',
    notes: `依据ISBN ${source.isbn}印刷第31页改围问题及第29页钉点板活动。本站围图和端点移动为原创，只支持指定上边两点同向移动、下边固定，不复制附页材料；人工实物确认独立。版权版次印次仍未核验，不能代表完整单元完成。`,
  },
};
