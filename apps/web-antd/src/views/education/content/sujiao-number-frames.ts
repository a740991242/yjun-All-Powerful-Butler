import type { NumberFrameVisual } from '../learning/number-frame';
import type { Lesson, Question } from '../learning/types';

import { numberFrameCells } from '../learning/number-frame';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-number-frames';
export function frameExamples(review: boolean): NumberFrameVisual[] {
  return [
    ...(review ? [10, 36, 70, 77] : [0, 27, 80, 88]).map(
      (anchor, known): NumberFrameVisual => ({
        kind: 'number-frame',
        layout: 'square',
        anchor,
        known,
      }),
    ),
    ...(review ? [33, 54, 66, 62, 77] : [22, 43, 55, 71, 88]).map(
      (anchor, known): NumberFrameVisual => ({
        kind: 'number-frame',
        layout: 'cross',
        anchor,
        known,
      }),
    ),
  ];
}
function tasks(review: boolean): Question[] {
  return [
    ...frameExamples(review).map((visual, index): Question => ({
      id: `${id}-${review ? 'r' : 'q'}-fill-${index}`,
      knowledge: `${id}-fill-${index}`,
      prompt: `这是0～99数表中的${visual.layout === 'square' ? '方形' : '十字'}局部框。只给一个数，请按${visual.layout === 'square' ? 'A、B、C' : 'A、B、C、D'}的顺序填写待填数。`,
      visual,
      rule: {
        kind: 'steps',
        values: numberFrameCells(visual)
          .filter((c) => !c.known)
          .map((c) => c.value),
      },
      hint: '先找到给定数的位置：同排向右多1、向左少1，同列向下多10、向上少10。字母顺序不是从给定数出发的路线；不跨排。',
      explanation: `按字母顺序分别为${numberFrameCells(visual)
        .filter((c) => !c.known)
        .map((c) => c.value)
        .join('、')}。给定数可能在框的任何位置，不能总把它当左上或中心。`,
    })),
    {
      id: `${id}-${review ? 'r' : 'q'}-vertical`,
      knowledge: `${id}-vertical`,
      prompt: review
        ? '观察这个十字框，从上格到中格，数字怎样变化？'
        : '观察这个方形框，从左上到左下，数字怎样变化？',
      visual: review
        ? { kind: 'number-frame', layout: 'cross', anchor: 54, known: 2 }
        : { kind: 'number-frame', layout: 'square', anchor: 50, known: 0 },
      choices: [
        { id: 'ten', label: '多10' },
        { id: 'one', label: '多1' },
      ],
      rule: { kind: 'choice', value: 'ten' },
      hint: '同一列往下一排，比较的是竖向位置，不是字母排序。',
      explanation: '在这张0～99表里，竖向相邻多10。',
    },
    {
      id: `${id}-${review ? 'r' : 'q'}-horizontal`,
      knowledge: `${id}-horizontal`,
      prompt: review
        ? '从右格找同排中格，应怎样推数？'
        : '从中格找同排左格，应怎样推数？',
      visual: {
        kind: 'number-frame',
        layout: 'cross',
        anchor: review ? 72 : 61,
        known: review ? 3 : 2,
      },
      choices: [
        { id: 'less', label: '少1' },
        { id: 'more', label: '多1' },
        { id: 'ten', label: '少10' },
      ],
      rule: { kind: 'choice', value: 'less' },
      hint: '同排向左是少1，先认清给定位置，不把左和上混同。',
      explanation: '横向左邻少1；上方才是少10。',
    },
  ];
}
export const sujiaoNumberFramesDraft: Lesson = {
  id,
  title: '方形与十字框数：从给定格推数',
  textbookTitle: '认识20～99·局部框数',
  page: 46,
  version: 1,
  status: 'preparing',
  goal: '按真实0～99数表的相对行列关系，从不同给定位置推数，按字母填写而不把空格当0。',
  prerequisite:
    '已观察0～99数表，知道横向相邻差1、竖向差10；准备纸笔及纸面数表。',
  parentTip:
    '依据已读第46页方形/十字框数范围，框图与数值原创。方形两排两列，十字五格，边界必须能放入原数表；给定格可能在任何位置。网页不提供移动框的学具，不把静态作答当实际纸面框数完成；不是完整练习六或单元。',
  steps: [
    {
      title: '方形框有两排两列',
      text: '方形框每排两个格。若左上给14，右上比它多1，左下比它多10，右下可以从右上往下或从左下往右得到。两条路线应得到同一个数。框来自原表同排同列，不允许把排末和下一排首拼成一排。',
      visual: { kind: 'number-frame', layout: 'square', anchor: 14, known: 0 },
      activity: '在实际纸面数表用两排两列纸框圈一处，逐格说原位置与横竖变化。',
    },
    {
      title: '给定数不一定在左上',
      text: '这个方形框给定数在右下。找左邻少1、找上邻少10，再核对左上到右下的两条路线。先读给定格在哪，不把图中第一个字母当作给定数的后一个数。',
      visual: { kind: 'number-frame', layout: 'square', anchor: 43, known: 3 },
      activity: '实际在纸上保留右下一个数，遮住其它三格，再推数并与原表核对。',
    },
    {
      title: '十字框按上、左、中、右、下排列',
      text: '十字框有五格，上下与中格同列，左右与中格同排。中心55的上方45、下方65、左方54、右方56。若给定数在某个端格，要先认出它的位置，再找中格及其它格，不能总把给定数当中心。',
      visual: { kind: 'number-frame', layout: 'cross', anchor: 55, known: 2 },
      activity:
        '实际做五格十字纸框，选择一处数表位置，改变哪一格可见并解释推法。',
    },
    {
      title: '字母顺序与两条路线核对',
      text: '图上未给数的格依原位置按A、B、C、D标记，表单按字母顺序填写。字母不是沿路线一步一步加数的指令。推完后回到原表检查每个格；0若给出就是已知数，空白字母不表示0。方形与十字都须完整放在0～99表内。',
      visual: { kind: 'number-frame', layout: 'cross', anchor: 71, known: 3 },
      activity:
        '实际换一个给定位置，口述每个待填格怎样找到，再用原表逐项核对。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '在实际0～99纸面表上圈两排两列，保留不同位置的一个数，推另外三格；分别用横竖两条路线核对右下格。',
      '实际做五格十字纸框，在原表内圈一处，保留中心或端格一个数；遮住其它格，推数后揭开核对。',
      '实际在纸上按字母记录待填答案，再逐格指着解释方向与变化，确认没有把空格当0或跨排。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '真实圈框、遮格、纸面记录与口述完成后才人工确认。',
      explanation: '网页静态框图不自动确认纸面活动，无条件可待做。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '给定数换到不同位置后，你怎样先认位置再推其它格？记录一个发现或还需核对的地方。',
      rule: { kind: 'reflection' },
      hint: '按真实想法记录，没有唯一答案。',
      explanation: '开放文字null，不评分或替代实际活动。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '局部数框原范围与原创几何核验',
    notes: `依据ISBN ${source.isbn}已读第46页相关范围。框布局与数字原创，给定位置遍历方形四格及十字五格，复习更换真实数值。版权版次印次未知，不代表完整单元。`,
  },
};
