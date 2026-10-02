import type { EmbeddedShapesVisual } from '../learning/embedded-shapes';
import type { Lesson, Question } from '../learning/types';

import { embeddedPieces, embeddedRegions } from '../learning/embedded-shapes';
import { required } from '../learning/required';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-final-embedded';
const visual = (
  pattern: number,
  highlight: null | number = null,
): EmbeddedShapesVisual => ({
  kind: 'embedded-shapes',
  pattern: pattern as EmbeddedShapesVisual['pattern'],
  highlight: highlight as EmbeddedShapesVisual['highlight'],
});
function tasks(review: boolean): Question[] {
  const common = (key: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
  });
  const numbers: Question[] = [0, 1, 2].map((i) => {
    const pattern = review ? i + 3 : i;
    return {
      ...common(`count-${i}`),
      prompt:
        '按右上角同尺度参考三角片，恰好拼满淡色图案需要多少片？点线只是方格，参考片不加入数量。',
      visual: visual(pattern),
      rule: { kind: 'number', value: required(embeddedPieces[pattern]).length },
      hint: '一小方格两片，斜边半格一片；只数覆盖范围，不数空位。',
      explanation: `此图需要${required(embeddedPieces[pattern]).length}片，同一尺度无重叠无空隙；不要求面积公式。`,
    };
  });
  const shapes: Question[] = [0, 1, 2, 3, 4, 5].map((i) => {
    const pattern = review ? 1 : 0;
    const region = required(required(embeddedRegions[pattern])[i]);
    return {
      ...common(`outline-${i}`),
      prompt:
        '观察粗虚线围出的完整区域，哪一个名称最准确？看整个轮廓，不把其中一片或方格当整体。',
      visual: visual(pattern, i),
      choices: [
        { id: 'square', label: '正方形（四边一样长，四角为直角）' },
        { id: 'rectangle', label: '长方形（相邻边不同长，四角为直角）' },
        { id: 'triangle', label: '三角形' },
        { id: 'parallelogram', label: '平行四边形（此图相邻边不成直角）' },
      ],
      rule: { kind: 'choice', value: region.shape },
      hint: '先沿粗虚线走一圈，看完整边与角；转向、位置和大小不改变类别。',
      explanation:
        '按本图完整轮廓核对；小轮廓和大轮廓都可以在同一图案中，描边不表示材料已有剪线。',
    };
  });
  const choice = (
    key: string,
    prompt: string,
    good: string,
    bad: string,
  ): Question => ({
    ...common(key),
    prompt,
    choices: [
      { id: 'good', label: good },
      { id: 'bad', label: bad },
    ],
    rule: { kind: 'choice', value: 'good' },
    hint: '分清整幅用片数、选择轮廓和实际活动范围。',
    explanation: good,
  });
  return [
    ...numbers,
    ...shapes,
    choice(
      'internal',
      '找出的图形边能位于大图案内部吗？',
      '可以，用完整描边表示范围，不必全部是原图外边。',
      '不行，只有整个图案外边才可以找。',
    ),
    choice(
      'different-size',
      '同一图案里找到一个小正方形，还要看更大范围吗？',
      '要，图案中可能还包含不同大小的完整正方形或其它图形。',
      '不用，找到一个小图形就等于全部找完。',
    ),
    choice(
      'actual-work',
      '网页选对名称，是否已实际摆片、描画并观察教材原图？',
      '尚未，实际任务分别做后确认，计划不当完成。',
      '是，网页选对自动完成所有实际任务。',
    ),
  ];
}
export const sujiaoFinalEmbeddedDraft: Lesson = {
  id,
  title: '期末找图形：单位片与大小轮廓',
  textbookTitle: '期末复习：数三角单位与找其它图形',
  page: 93,
  status: 'preparing',
  version: 1,
  goal: '对三幅原创图案分别按参考三角单位计数，找到内部不同大小的三角形、正方形及其它完整轮廓，区分材料片、网格和所选区域。',
  prerequisite:
    '认识三角形、正方形、长方形和平行四边形；准备纸笔、等大直角三角纸片，剪裁由家长协助。',
  parentTip:
    '依据实际读取93页第14题，本站三幅原创图案不同于教材原图。单位三角形为半方格的等腰直角三角形，参考片同尺度，不复制扫描。正方形与相邻边不等的长方形在本题选项分别命名，不讲集合包含或面积公式。',
  steps: [
    {
      title: '三幅图分别数单位片',
      text: '屋形、L形和阶梯是三幅独立原创图，不是原书三个图。按同尺度参考三角单位，一格两片、半格一片；三个图分别10、6、12片。内部没有画材料拼缝，不能直接数网页多边形或把参考片加进总数。',
      visual: visual(0),
      activity:
        '实际在方格纸画三个图案，分别用同样大小三角片覆盖，不重叠、不漏空位，点数核对。',
    },
    {
      title: '小正方形和大正方形',
      text: '屋形图案下方2乘2格方块中，能描一个1格小正方形，也能描完整2乘2格大正方形。大小不同仍都是正方形；大轮廓可能跨过数格，不限于已有外边或最小材料片。',
      visual: visual(0, 1),
      activity:
        '实际在同一张屋形方格图上用两种描边标出小、大正方形，指出每个完整轮廓；不要只点一个角。',
    },
    {
      title: '不同大小三角形与其它图形',
      text: '屋顶是一个三角形，下方方块里沿对角线也可描出更大的三角形。还可以在方块里描2乘1格长方形或斜的平行四边形。沿完整边走一圈核对，不把虚线当已有剪线；不是要求列全所有可能轮廓。',
      visual: visual(0, 4),
      activity:
        '实际描大小不同的两个三角形，再描一个长方形和一个平行四边形，说清选的是哪一片完整范围。',
    },
    {
      title: '换图案，重新找',
      text: 'L形与阶梯图同样可以找内部轮廓，不只给整个外形取名。方格提供相同尺度，选定范围可以不同；不要将整幅所需材料片数当成描边里有多少片。本课标注只展示合法例子，其它合法描法也保留。',
      visual: visual(2, 5),
      activity:
        '实际在L形和阶梯两图中各找至少两种已学轮廓，描边并和家长核对全部区域在图案内，没有借用空位。',
    },
    {
      title: '教材三图另外观察',
      text: '实际看适用教材93页第14题的三个图。分别按它的参考单位数片，再用描边指出不同大小或不同类型的图形，与家长说明依据。本站原创图数量不能照搬给原图；没有教材就记待做。计划以后操作与已经做完分开。',
      activity:
        '实际按原书三图逐个计数和描画找图；记录自己找到的合理轮廓，不要求与网页例子同样。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际在方格纸画本站三个原创图，分别用同尺度三角片覆盖并计数；不重叠、漏空位或加参考片。',
      '实际在屋形图描小和大正方形、大小不同的两个三角形、一个长方形和一个平行四边形，逐个指完整范围。',
      '实际在L形和阶梯两图各描至少两种已学图形，和家长核对区域完全在图案内；保留其它合理描法。',
      '实际看适用教材93页第14题原来的三个图，分别按它的参考片计数，再描边找不同图形并解释；无教材暂时跳过。',
    ].map((prompt, i): Question => ({
      id: `${id}-manual-${i}`,
      knowledge: `${id}-manual-${i}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '实际完成并由家长查看后确认；网页正确不能代替，未做可以跳过。',
      explanation: '计数、实际拼组、描画与原图观察各自如实记录。',
    })),
    ...[
      '数材料片与找轮廓有什么不同？记自己的真实理解。',
      '你实际找到了哪些不同大小的轮廓？没实际描画也如实记，允许不同合理作品。',
      '哪些实际活动已经做了，哪些只是下一步计划或还需要帮助？分开记录。',
    ].map((prompt, i): Question => ({
      id: `${id}-reflection-${i}`,
      knowledge: `${id}-reflection-${i}`,
      prompt,
      rule: { kind: 'reflection' },
      hint: '真实原话，没有唯一答案。',
      explanation: '反思correct=null，不自动评星或确认实际任务。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '93页第14题与原创轮廓核对',
    notes: `实际查看ISBN ${source.isbn}印刷93页单位三角计数与找已学图形范围；本站三幅原创新图、边界与单位分别核验，不复制原画，不证明全年或最终教师审校完成。`,
  },
};
