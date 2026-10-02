import type { QuarterCircleVisual } from '../learning/quarter-circle';
import type { PairArrangement } from '../learning/two-piece-join';
import type { Lesson, Question, Shape } from '../learning/types';

import { pairJoinResult } from '../learning/two-piece-join';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-final-four-shapes';
const names: Partial<Record<Shape, string>> = {
  square: '正方形',
  rectangle: '长方形',
  parallelogram: '平行四边形',
  triangle: '三角形',
  circle: '圆',
};
const families = [
  'square',
  'rectangle',
  'parallelogram',
  'triangle',
  'circle',
] as const;
export function finalCurvedPieces(
  count: QuarterCircleVisual['count'] = 4,
  separate = false,
  review = false,
): QuarterCircleVisual {
  return {
    kind: 'quarter-circle',
    count,
    layout: separate ? 'separate' : 'assembled',
    turn: review ? 90 : 0,
  };
}
function tasks(review: boolean): Question[] {
  const common = (key: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
  });
  const arrangements: PairArrangement[] = review
    ? ['rectangle-square', 'square-rectangle', 'triangle-parallelogram']
    : ['triangle-square', 'rectangle-long', 'triangle-parallelogram'];
  const q: Question[] = arrangements.map((arrangement, index) => ({
    ...common(`whole-${index}`),
    prompt:
      '看当前原创材料按图贴合后的完整外轮廓，选择它的名称；不用原纸片名称或内部接缝作答案。',
    visual: { kind: 'two-piece-join', arrangement, reflected: review },
    choices: families.map((shape) => ({
      id: shape,
      label: names[shape] ?? shape,
    })),
    rule: { kind: 'choice', value: pairJoinResult(arrangement) },
    hint: '沿最外面的边看完整图形，材料和连接边改变后重新观察。',
    explanation: `当前完整外轮廓为${names[pairJoinResult(arrangement)]}，结论限于本图材料和拼接条件。`,
  }));
  const count = review ? 3 : 4;
  q.push(
    {
      ...common('circle-complete'),
      prompt:
        '当前弧片图沿直边贴合后，已经是没有空缺的完整圆吗？只看已放的材料，不补画缺片。',
      visual: finalCurvedPieces(count, false, review),
      choices: [
        { id: 'circle', label: '已经是完整圆' },
        { id: 'gap', label: '还存在缺片空缺，不是完整圆' },
      ],
      rule: { kind: 'choice', value: review ? 'gap' : 'circle' },
      hint: '看整圈外轮廓以及中心周围是否仍有未覆盖区域。',
      explanation: review
        ? '只放三片，还缺一片所在区域；不能把空缺当已经有材料。'
        : '四片同大弧片的直边贴合，整圈圆弧完整，内部直线只是接缝。',
    },
    {
      ...common('missing-piece'),
      prompt:
        '本例完整圆需要四片同样大小的弧片。按当前图已经放了的片数，还要补几片？',
      visual: finalCurvedPieces(review ? 3 : 2, false, review),
      rule: { kind: 'number', value: review ? 1 : 2 },
      hint: '完整所需片数减已经实际放入的片数；不把图中空缺当材料。',
      explanation: review
        ? '四片需要补一片；第四片要匹配原有弧片大小。'
        : '四片需要补两片，两片不能只靠旋转变为四片。',
    },
    {
      ...common('piece-count'),
      prompt: '当前弧片图实际放了几片纸片？问纸片数，不是完整目标图形数。',
      visual: finalCurvedPieces(count, false, review),
      rule: { kind: 'number', value: count },
      hint: '沿内部接缝分开数每片，空缺不算纸片。',
      explanation: `实际${count}片。组成一个目标形状与材料片数是不同数量。`,
    },
    {
      ...common('outer-straight'),
      prompt:
        '当前弧片图的整体外轮廓上，有几条作为外边的直线段？内部贴合接缝不计入。',
      visual: finalCurvedPieces(count, false, review),
      rule: { kind: 'number', value: review ? 2 : 0 },
      hint: '只跟着已放材料最外轮廓走；缺片两侧暴露的直边与内部接缝不同。',
      explanation: review
        ? '缺片时有两条暴露直边，所以当前整体不是完整圆。'
        : '完整圆的外轮廓没有直线段，图内四条半径位置是接缝，不是外边。',
    },
  );
  const curveIds = review ? ['B', 'D', 'H', 'J'] : ['G', 'H', 'I', 'J'];
  const rectangleIds = review ? ['G', 'I'] : ['E', 'F'];
  const pieces = Array.from({ length: 10 }, (_, i) => {
    const label = String.fromCodePoint(65 + i);
    let type = '同样大小等腰直角三角形纸片';
    if (curveIds.includes(label)) type = '同样大小带圆弧纸片';
    else if (rectangleIds.includes(label)) type = '2比1长方形纸片';
    return { id: label, label: `${label} ${type}` };
  });
  q.push(
    {
      ...common('select-curved'),
      prompt:
        '从本课十张原创材料卡中，选出全部四片同样大小带圆弧纸片，用来拼完整圆；直边材料不选。',
      choices: pieces,
      visual: finalCurvedPieces(4, true, review),
      rule: { kind: 'set', values: curveIds },
      hint: '按当前卡片说明选曲边材料，不凭上一次字母编号。',
      explanation: `四片为${curveIds.join('、')}，大小相匹配且都有圆弧；不是任意四张纸片。`,
    },
    {
      ...common('kit-total'),
      prompt:
        '同时保留四个目标图形：正方形用2片三角形、平行四边形另用2片三角形、长方形用2片长方形、圆用4片弧片，共准备几片？',
      rule: { kind: 'number', value: 10 },
      hint: '四个目标同时摆着，材料不能一片重复算作两个地方；依次累加。',
      explanation:
        '2＋2＋2＋4＝10片；两组三角片分别保留，不能同时重复使用同一片。',
    },
  );
  for (const item of [
    {
      key: 'matched-material',
      prompt:
        '同样带圆弧但大小不同的四片，能保证按本课方法拼成没有空缺的圆吗？',
      good: '不能保证，应选同样大小、来自同样圆的四片并核对贴合',
      bad: '能，任意带弧纸片只要四片就必成圆',
    },
    {
      key: 'straight-circle',
      prompt:
        '只有有限片直边三角形和长方形，能不剪不弯拼出外轮廓为真正圆弧的圆吗？',
      good: '不能，直边不能变成完整的圆弧；需要匹配的曲边材料',
      bad: '能，多放几条短直边就等于真正的圆弧',
    },
    {
      key: 'real-record',
      prompt:
        '网页看见拼图或打算明天剪材料，能把今天实际四个图形都拼过记为完成吗？',
      good: '不能，实际准备、四种拼组与记录分别完成后确认，计划另记',
      bad: '能，网页正确和下次计划都代表今天实际拼过',
    },
  ])
    q.push({
      ...common(item.key),
      prompt: item.prompt,
      choices: [
        { id: 'good', label: item.good },
        { id: 'bad', label: item.bad },
      ],
      rule: { kind: 'choice', value: 'good' },
      hint: '材料条件、真实圆弧和实际完成分别核对，不补造缺少的条件。',
      explanation: '原创示例限定同大材料；有限直边不当圆弧，计划不当真实操作。',
    });
  return q;
}
export const sujiaoFinalFourShapesDraft: Lesson = {
  id,
  title: '期末选四种图形：直边、曲边与完整拼组',
  textbookTitle: '期末复习：选附页材料拼四种目标图形',
  page: 94,
  version: 1,
  status: 'preparing',
  goal: '根据目标选择匹配纸片，实际分别拼正方形、长方形、平行四边形和圆，区别外轮廓、内部接缝、缺片和材料数。',
  prerequisite:
    '会命名相关平面图形，准备纸笔及匹配图形材料，家长可协助预裁曲边片。',
  parentTip:
    '依据已读94页第19项和附页1/2印刷95/97页。本站原创十片材料：四片同大等腰直角三角形、两片2比1同大长方形、四片从同样圆沿两条中心直线分开的等大弧片；不是教材扫描。四目标同时保留需十片，先后拆拼须如实说方式。家长可先画/裁或预备纸片，弧片保留真实圆弧而非多边形近似；圆由匹配四片贴合，缺片不自动补填，曲率或大小变了重新观察。纸质教材可在家长协助下从附页1/2选合适材料实际剪拼，并如实记录是否使用教材或原创替代，不把替代说为剪过教材。实际准备与四种拼组独立人工，开放反思null、计划不当完成，旧快照保持。',
  steps: [
    {
      title: '先选材料，四个目标分别准备',
      text: '本课原创材料十片：四片同大等腰直角三角形、两片同大长方形（长2宽1）和四片同大带圆弧纸片。两个三角片给正方形，另两个给平行四边形；两长方片和四弧片各给一个目标。四图同时保留，不能同一片放两处。也可先后拆拼，但说明实际方式。',
      visual: finalCurvedPieces(4, true),
      activity:
        '家长协助准备匹配纸片，注明教材附页或原创材料与同时/先后方式，不复制教材扫描。',
    },
    {
      title: '正方形：两片的整体外轮廓',
      text: '两片完全相同等腰直角三角形沿斜边贴合，形成正方形，内部对角线是接缝。不能因为每片叫三角形就把完整图也叫三角形。真实材料若变，重新核对适合拼法。',
      visual: {
        kind: 'two-piece-join',
        arrangement: 'triangle-square',
        reflected: false,
      },
      activity: '实际选匹配纸片拼正方形，不重叠不留空，沿外轮廓描或画并命名。',
    },
    {
      title: '长方形：完整边对齐',
      text: '本例两片2比1长方形沿短边贴合，组成更长的长方形。只看外轮廓，两片内部的接缝不变为额外外边。不能把一张材料重叠到另一张后冒称完成两片拼组。',
      visual: {
        kind: 'two-piece-join',
        arrangement: 'rectangle-long',
        reflected: false,
      },
      activity:
        '实际选合适纸片拼长方形，核对边对齐、无空缺，描或画整体并命名。',
    },
    {
      title: '平行四边形：改用另一组三角片',
      text: '另外两片同大等腰直角三角形沿图示直角边贴合，两片放在共享边相反两侧，整体为平行四边形。位置和拼接边都有条件，不能把任意两片三角形随便放都叫平行四边形。描最外面一圈，不把内部直线当外边。',
      visual: {
        kind: 'two-piece-join',
        arrangement: 'triangle-parallelogram',
        reflected: false,
      },
      activity:
        '实际用另一组匹配纸片拼平行四边形，观察完整外轮廓与接缝，描或画并命名。',
    },
    {
      title: '圆：曲边匹配，四片完整围合',
      text: '四片来自同样大小的圆，沿两条中心直线分开；每片两条直边和一段圆弧。直边依次贴合、中心对齐，四段匹配圆弧围成完整圆。只放三片会留空缺，不能把空缺当已有材料，也不能用很多短直边当真正圆弧。内部直线只是接缝，完整圆外轮廓无直边。',
      visual: finalCurvedPieces(),
      activity:
        '实际用匹配曲边纸片拼完整圆，不重叠不留空，沿外轮廓描或画并指出内部接缝。',
    },
    {
      title: '分别记录真实四图和材料',
      text: '分别记录准备材料、拼正方形、拼长方形、拼平行四边形和拼圆。纸质教材可按实际附页选合适片，本站示例不代表唯一材料清单。没有材料或尚未拼的如实待做，原创替代和教材剪拼方式如实写，不由网页正确自动确认实际完成。',
      activity:
        '与家长交流四种目标的材料、拼接边、外轮廓和一次调整，未来计划另列。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际在家长协助下准备匹配纸片，注明从纸质教材附页1/2选剪或本站原创材料，核对直边/曲边和大小，说明四目标同时保留还是先后拆拼；原创替代不冒称剪过教材。',
      '实际选匹配纸片拼一个完整正方形，无重叠无空缺，沿整体外轮廓描或画并命名，不把内部接缝作外边。',
      '实际选匹配纸片拼一个完整长方形，核对连接边对齐，无重叠无空缺，描或画整体外轮廓并命名。',
      '实际选匹配纸片拼一个完整平行四边形，确认材料/连接条件，描或画整体外轮廓并说明内部接缝；不只看网页模型就确认。',
      '实际选择大小匹配的带圆弧纸片拼完整圆，中心与直边贴合、圆弧完整围合，无缺片无重叠，描或画外轮廓并指出内部接缝；只有直边材料不能确认拼圆完成。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '真实准备和每种实际拼图分别确认，没有条件可暂时跳过。',
      explanation: '真实材料与操作独立，不由网页分数或未来计划自动确认。',
    })),
    ...[
      '你实际选什么材料，是否来自教材附页或原创替代？哪一处拼接需要调整？待做和计划另记。',
      '四种目标的整体外轮廓与内部接缝有什么不同？记真实观察，不要求固定句子。',
      '实际拼圆时怎样确认弧片匹配和没有缺片？还未做可如实写待做，计划不当已完成。',
    ].map((prompt, index): Question => ({
      id: `${id}-reflection-${index}`,
      knowledge: `${id}-reflection-${index}`,
      prompt,
      rule: { kind: 'reflection' },
      hint: '记录真实过程或未做原因，开放原话。',
      explanation: 'correct=null，不自动评价图形操作能力，也不代替实际确认。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '94页选四图与附页95/97实际材料范围核对',
    notes: `依据ISBN ${source.isbn}第94页第19项及附页1/2印刷95、97页；十片比例与拼图原创，四目标实际准备/拼组分别人工，圆用匹配曲边材料不由直边围图替代。复习换正方形/长方形材料与三片缺圆、材料卡ID、弧片旋转，拒绝旧完整圆答案和旧选择。来源图不复制、旧ID版本快照保持、版次与印次仍未核验；其他期末缺口与教师最终审校保留。`,
  },
};
