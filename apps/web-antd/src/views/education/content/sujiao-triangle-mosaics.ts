import type {
  Lesson,
  Question,
  TriangleMosaicPiece,
  TriangleMosaicVisual,
  TriangleMoveVisual,
} from '../learning/types';

import { required } from '../learning/required';
import {
  moveTriangleMosaic,
  triangleMosaicShape,
} from '../learning/triangle-mosaic';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-triangle-mosaics';
export const trianglePatterns: TriangleMosaicPiece[][] = [
  [
    { x: 2, y: 1, turn: 2 },
    { x: 3, y: 1, turn: 3 },
    { x: 3, y: 2, turn: 0 },
    { x: 2, y: 2, turn: 1 },
  ],
  [
    { x: 1, y: 1, turn: 0 },
    { x: 1, y: 1, turn: 2 },
    { x: 2, y: 1, turn: 0 },
    { x: 2, y: 1, turn: 2 },
  ],
  [
    { x: 1, y: 1, turn: 0 },
    { x: 1, y: 1, turn: 2 },
    { x: 2, y: 1, turn: 0 },
    { x: 1, y: 2, turn: 0 },
  ],
  [
    { x: 0, y: 1, turn: 2 },
    { x: 1, y: 1, turn: 0 },
    { x: 1, y: 1, turn: 2 },
    { x: 2, y: 1, turn: 0 },
  ],
];
export function triangleModel(
  pieces: TriangleMosaicPiece[],
  seams = true,
): TriangleMosaicVisual {
  return { kind: 'triangle-mosaic', pieces: structuredClone(pieces), seams };
}
export function turnTrianglePattern(
  pieces: TriangleMosaicPiece[],
): TriangleMosaicPiece[] {
  const rotated = pieces.map((p) => ({
    x: -p.y - 1,
    y: p.x,
    turn: (p.turn + 1) % 4,
  }));
  const minX = Math.min(...rotated.map((p) => p.x));
  const minY = Math.min(...rotated.map((p) => p.y));
  return rotated.map((p) => ({ ...p, x: p.x - minX + 1, y: p.y - minY }));
}
function fromCells(rows: string[]): TriangleMosaicPiece[] {
  return rows.flatMap((row, y) =>
    [...row].flatMap((c, x) =>
      c === '1'
        ? [
            { x, y, turn: 0 },
            { x, y, turn: 2 },
          ]
        : [],
    ),
  );
}
export const triangleOutlines = [
  [
    { x: 0, y: 0, turn: 2 },
    { x: 1, y: 0, turn: 3 },
    ...fromCells(['00', '11', '11']),
  ],
  fromCells(['10', '11']),
  fromCells(['111', '101', '111']),
  fromCells(['100', '110', '111']),
];
const reviewOutlines = [
  fromCells(['1111']),
  fromCells(['100', '110', '110']),
  fromCells(['111', '100', '110']),
  fromCells(['1000', '1100', '1111']),
];
const directions = ['up', 'left', 'down', 'right'] as const;
const reviewDirections = ['up', 'right', 'down', 'left'] as const;
const directionNames = {
  up: '向上移动一格',
  left: '向左移动一格',
  down: '向下移动一格',
  right: '向右移动一格',
  rotate: '转四分之一圈',
};
export function triangleComparison(
  index: number,
  review: boolean,
): TriangleMoveVisual {
  const pieces = required(trianglePatterns[1]).map((p) => ({
    ...p,
    y: p.y + (review ? 1 : 0),
  }));
  const selected = review ? 3 - index : index;
  const after = moveTriangleMosaic(
    { selected, pieces },
    required((review ? reviewDirections : directions)[index]),
  );
  return {
    kind: 'triangle-move',
    before: triangleModel(pieces),
    after: triangleModel(after.pieces),
  };
}
function tasks(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const shapes = ['square', 'rectangle', 'triangle', 'parallelogram'];
  const shapeNames = ['正方形', '长方形', '三角形', '平行四边形'];
  const questions: Question[] = trianglePatterns.map((pieces, index) => {
    const model = triangleModel(review ? turnTrianglePattern(pieces) : pieces);
    return {
      id: `${prefix}-shape-${index}`,
      knowledge: `${id}-shape-${index}`,
      prompt: review
        ? '材料不变，转向并换位置后，完整轮廓是哪类？'
        : '四片拼成的完整轮廓是哪类？不是问每片材料是什么。',
      visual: model,
      choices: shapes.map((shape, i) => ({
        id: shape,
        label: required(shapeNames[i]),
      })),
      rule: {
        kind: 'choice',
        value: required(
          triangleMosaicShape({ selected: 0, pieces: model.pieces }),
        ),
      },
      hint: '沿完整外边看，不能只看一片；正方形转向后仍是正方形。',
      explanation: '全部四片恰好拼满图示轮廓，材料片形与整体外形分别观察。',
    };
  });
  for (let i = 0; i < 4; i++) {
    const action = required((review ? reviewDirections : directions)[i]);
    const comparison = triangleComparison(i, review);
    const letter = String.fromCodePoint(65 + (review ? 3 - i : i));
    questions.push(
      {
        id: `${prefix}-piece-${i}`,
        knowledge: `${id}-piece-${i}`,
        prompt:
          '比较移动前后，哪片改变了位置？字母表示同一片，不按左右次序重新编号。',
        visual: comparison,
        choices: ['A', 'B', 'C', 'D'].map((label) => ({ id: label, label })),
        rule: { kind: 'choice', value: letter },
        hint: '逐片比较字母、位置和朝向，其余片应保持不动。',
        explanation: `只有${letter}改变，其他三片位置和朝向不变。`,
      },
      {
        id: `${prefix}-direction-${i}`,
        knowledge: `${id}-direction-${i}`,
        prompt: `比较两图，${letter}做了哪一种操作？`,
        visual: comparison,
        choices: Object.entries(directionNames).map(([key, label]) => ({
          id: key,
          label,
        })),
        rule: { kind: 'choice', value: action },
        hint: '两图同一尺度，朝向没变时比较该片位置，不把位置移动当成转向。',
        explanation: `${letter}${directionNames[action]}，没有转向；其他片保持原样。`,
      },
    );
  }
  for (const [i, pieces] of (review
    ? reviewOutlines
    : triangleOutlines
  ).entries())
    questions.push({
      id: `${prefix}-count-${i}`,
      knowledge: `${id}-count-${i}`,
      prompt: review
        ? '换了轮廓，按左上1片三角形参考，要多少片才能拼满？'
        : '内部没有画拼缝，按左上1片三角形参考，需要几片同样的三角形？空洞不放片。',
      visual: triangleModel(pieces, false),
      rule: { kind: 'number', value: pieces.length },
      hint: '一小方格能由两片这种三角形拼满；斜边处检查是否只有半格。不要把参考片加入数量。',
      explanation: `给定图实际需要${pieces.length}片。按同样大小的参考片检查覆盖，空洞与外边空位不算；这里不教面积公式。`,
    });
  const scope = [
    {
      key: 'cut',
      prompt: review
        ? '正方形沿两条对角线都剪开，得到多少片同样的三角形？'
        : '本活动正方形沿两条对角线剪开，得到几片同样大小三角形？',
      good: '四片',
      bad: '两片',
      hint: '两条剪线都完成，不是只剪一条。',
      explanation:
        '两条对角线把正方形分成四片全等直角三角形；网页只是改变整体摆放方向。',
    },
    {
      key: 'supply',
      prompt: review
        ? '四片只移动、转向，不加片也不剪片，材料会变多吗？'
        : '四片从长方形改拼三角形，只换摆法，会增加材料片数吗？',
      good: '不会，仍是四片',
      bad: '会，外形变就多一片',
      hint: '逐片点数，检查没有增减。',
      explanation: '形状或位置变化不改变实际材料片数。',
    },
    {
      key: 'one',
      prompt: review
        ? '一轮移动后有两片位置改变，还符合“每次只移动一片”吗？'
        : '任务要求每次只移动一片，可以同时移两片再说只做了一次吗？',
      good: '不符合，逐次只改变一片',
      bad: '可以，最后摆好就行',
      hint: '比较操作前后，其余各片应保持原样。',
      explanation:
        '每次选一片，移动或转向，记录这一轮；下一轮可以选择同一片或另一片。',
    },
    {
      key: 'outline',
      prompt: review
        ? '图案中有洞，洞里也需要放三角片吗？'
        : '只看最外面的包围长方框，空洞和凹角外位置也都算材料吗？',
      good: '不算，只填完整图案覆盖的地方',
      bad: '算，框内都算',
      hint: '按完整边界看真正填住哪里。',
      explanation:
        '洞与凹角外空位不是作品材料，不能只数包围框；开放作品允许多种合法摆法。',
    },
  ];
  for (const item of scope)
    questions.push({
      id: `${prefix}-${item.key}`,
      knowledge: `${id}-${item.key}`,
      prompt: item.prompt,
      choices: [
        { id: 'good', label: item.good },
        { id: 'bad', label: item.bad },
      ],
      rule: { kind: 'choice', value: 'good' },
      hint: item.hint,
      explanation: item.explanation,
    });
  return questions;
}
export const sujiaoTriangleMosaicsDraft: Lesson = {
  id,
  title: '三角形拼组：四片变形与逐片移动',
  textbookTitle: '图形的拼组·用三角形拼',
  page: 33,
  version: 1,
  status: 'preparing',
  goal: '用四片同样三角形拼不同轮廓，比较每次只移动一片的变化，按参考片观察更多三角形组成的图案。',
  prerequisite: '认识正方形、长方形、三角形和平行四边形，会逐片点数到16。',
  parentTip:
    '依据已读33～34页实践，材料关系为正方形沿两条对角线分出四片全等直角三角形；网页正方形倾斜显示，尺寸与作品原创，不冒充教材原图。剪刀由家长协助，纸片可以先准备好；没有实物可跳过人工任务。网页操作与实物确认分开，不教面积公式。',
  steps: [
    {
      title: '一个正方形，分成四片',
      text: '准备正方形纸，沿两条对角线标折痕，请家长协助沿两条线剪开，得到四片同样大小三角形。只剪一条线只能得到两片，材料不同。网页把原正方形转着放，完整外形仍是正方形；四片字母用于追踪同一片，不重新编号。',
      visual: triangleModel(required(trianglePatterns[0])),
      activity:
        '用真实正方形折出两条对角线，家长协助剪成四片，重拼原正方形，逐片比较大小。',
    },
    {
      title: '全部四片，换不同摆法',
      text: '每片都用一次，不剪小、不重叠、不添片。先选择字母，再逐格移动或转向，试着拼长方形、三角形和平行四边形。可以暂时分开纸片，拼好后检查完整边界没有空隙。其它合法创意轮廓也保留，不强判成标准图形。每步学具独立保存。',
      visual: triangleModel(required(trianglePatterns[1])),
      activity:
        '用全部四片实物拼至少两种完整轮廓，每次检查没有空隙或重叠，说材料与整体的区别。',
    },
    {
      title: '每次只动一片，记下改变',
      text: '从长方形开始，每一轮选一片移动或转向，其他三片保持不动。比较前后图，字母跟随同一片，不因位置换了重新按左右编号。网页允许多个移动步骤，实物任务要逐次记录；前后对照题保持原图只读，不通过改题图猜答案。',
      visual: triangleComparison(0, false),
      activity:
        '从四片拼成的长方形出发，连续做三轮每次只动一片，逐次画草图或口述哪片怎样改变。',
    },
    {
      title: '更多三角片，创作与计数',
      text: '更多片可以拼房子、动物或自己的图案，先想准备多少片。左上参考片与拼图区共同比例，一小方格能由两片拼满，斜边处可能只需要一片。内部不画拼缝时也要检查真正被图案覆盖的地方，空洞和参考片不加进数量。给定原图计数与开放作品分别记录。',
      visual: triangleModel(required(triangleOutlines[0]), false),
      activity:
        '用更多同样三角片做自己的图案，展示它表示什么，逐片核对数量，与家长交流另一种摆法。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      {
        prompt:
          '准备正方形沿两条对角线分出的四片实物，使用全部四片拼至少两种完整轮廓，不重叠、不增减，检查拼满。',
        visual: triangleModel(required(trianglePatterns[0])),
      },
      {
        prompt:
          '从四片长方形出发连续做三轮，每轮只改变一片的位置或朝向，其余三片不动；逐次画或口述前后变化。',
        visual: triangleModel(required(trianglePatterns[1])),
      },
      {
        prompt:
          '用更多同样大小三角形做自己的图案，说明表示什么、实际用了几片，并展示或和家长互相核对。',
        visual: triangleModel(required(triangleOutlines[0]), false),
      },
    ].map((item, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      ...item,
      rule: { kind: 'manual' },
      hint: '只确认实际完成的实物、展示与口述，网页操作不代替；没有材料可以跳过。',
      explanation: '保留多种合法作品，人工记录独立于客观题正确率。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '哪一次只移动一片的变化让你觉得有趣？你怎样核对图案的用片数？记自己的话。',
      rule: { kind: 'reflection' },
      hint: '可以说自己移动哪片、完整轮廓变化或怎样处理空位。',
      explanation: '反思原话单独保存，不评唯一答案。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读三角片实践与原创几何条件检查',
    notes: `依据ISBN ${source.isbn}印刷33～34页，四片正方形双对角线切分关系、逐片移动、更多三角片作品与参考片计数。本站轮廓、坐标、题目原创，内部不重叠，复习改变图形位置/朝向、移动纸片与方向、无拼缝图用片数。版次印次仍待核验，不代表混合图形实践或全年规划完成。`,
  },
};
