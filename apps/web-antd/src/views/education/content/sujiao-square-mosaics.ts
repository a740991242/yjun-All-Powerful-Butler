import type { Lesson, Question, SquareMosaicVisual } from '../learning/types';

import { required } from '../learning/required';
import {
  mosaicCount,
  mosaicShape,
  rotateMosaic,
} from '../learning/square-mosaic';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-square-mosaics';
const cells = (rows: string[]) =>
  rows.map((row) => [...row].map((c) => c === '1'));
export const digitMosaics = [
  ['111', '101', '101', '101', '111'],
  ['010', '110', '010', '010', '111'],
  ['111', '001', '111', '100', '111'],
  ['111', '001', '111', '001', '111'],
  ['101', '101', '111', '001', '001'],
  ['111', '100', '111', '001', '111'],
  ['111', '100', '111', '101', '111'],
  ['111', '001', '010', '010', '010'],
  ['111', '101', '111', '101', '111'],
  ['111', '101', '111', '001', '111'],
].map((item) => cells(item));
const fourPatterns = [
  ['1111', '0000', '0000', '0000'],
  ['0100', '1110', '0000', '0000'],
  ['1000', '1000', '1100', '0000'],
  ['1100', '1100', '0000', '0000'],
].map((item) => cells(item));
const outlinePatterns = [
  ['010', '111', '010'],
  ['1000', '1100', '1110', '1111'],
  ['111', '101', '111'],
  ['1111', '1001', '1001', '1111'],
].map((item) => cells(item));
const reviewOutlines = [
  ['010', '111'],
  ['100', '110', '111'],
  ['1111', '1001', '1111'],
  ['111', '101', '101', '111'],
].map((item) => cells(item));
export function squareMosaicModel(
  pattern: boolean[][],
  seams: boolean,
): SquareMosaicVisual {
  return { kind: 'square-mosaic', cells: structuredClone(pattern), seams };
}
function tasks(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  return [
    ...fourPatterns.map((pattern, index): Question => {
      const visual = squareMosaicModel(
        review ? rotateMosaic(pattern) : pattern,
        true,
      );
      return {
        id: `${prefix}-${index}-shape`,
        knowledge: `${id}-${index}-shape`,
        prompt: review
          ? '四片换了位置和朝向，当前完整轮廓是哪一类？'
          : '观察四片正方形拼出的完整轮廓，它是哪一类？不是问每片是什么。',
        visual,
        choices: [
          { id: 'rectangle', label: '长方形' },
          { id: 'square', label: '正方形' },
          { id: 'other', label: '其它轮廓' },
        ],
        rule: { kind: 'choice', value: mosaicShape(pattern) },
        hint: '看完整外边，凹进去的角不能当成最外面的长方框。',
        explanation:
          '四片各自仍是正方形；拼出的完整外形可以是长方形、正方形或别的轮廓，类别与片数是两件事。',
      };
    }),
    ...(review ? reviewOutlines : outlinePatterns).map(
      (pattern, index): Question => {
        const visual = squareMosaicModel(pattern, false);
        return {
          id: `${prefix}-${index}-count`,
          knowledge: `${id}-${index}-count`,
          prompt: review
            ? '换了完整轮廓，按左上的1片参考，这幅图需要几片同样小正方形？没有拼缝也要逐排检查。'
            : '图中没有画内部拼缝。按左上的1片参考，要用几片同样的小正方形才能拼满？洞里不放片。',
          visual,
          rule: { kind: 'number', value: mosaicCount(pattern) },
          hint: '按同一片的大小想象每排有几片，再逐排数；凹角外面和中间空洞不算。',
          explanation: `本图用${mosaicCount(pattern)}片。完整外框里可能有空位，不能直接把外框所有位置都数成纸片；左上参考不是作品中的额外一片。`,
        };
      },
    ),
    ...digitMosaics.map((pattern, index): Question => {
      const selected = review
        ? rotateMosaic(required(digitMosaics[(index + 3) % 10]))
        : pattern;
      const visual = squareMosaicModel(selected, true);
      return {
        id: `${prefix}-digit-${index}`,
        knowledge: `${id}-digit-${index}`,
        prompt: review
          ? '换了一幅数字拼图并改变摆放方向，它实际用了几片？不必猜它表示哪个数字。'
          : `这幅原创“${index}”图案用了几片同样小正方形？数拼片，不是填它表示的数字。`,
        visual,
        rule: { kind: 'number', value: mosaicCount(selected) },
        hint: '按行数，每个实心位置一片；读出的数字不是材料片数。',
        explanation: `这幅图实际有${mosaicCount(selected)}片。表示某个数字的图案可以有不同摆法和不同用片数，本题只数给出的图，不要求全班采用同一种数字字形。`,
      };
    }),
    ...[
      {
        key: 'conserve',
        prompt: review
          ? '四片不增减、只换摆法，材料片数会变吗？'
          : '同样四片从长方形改拼成凹角图案，材料片数会变吗？',
        answer: 'no',
        good: '不会，仍是四片',
        bad: '会，形状变就多一片',
        hint: '逐片点数，检查没有增减或重叠。',
        explanation: '摆放改变外形，不改变实际材料片数。',
      },
      {
        key: 'digit-count',
        prompt: review
          ? '图案看起来像“8”，不用点数就能说用了8片吗？'
          : '拼出的图案像“3”，就能直接填用了3片吗？',
        answer: 'no',
        good: '不能，要数实际用的片',
        bad: '能，表示数字就是片数',
        hint: '图案表示的数与组成它的片数不同。',
        explanation:
          '不同图案可以表示同一个数，也可以用不同数量的小正方形，要按实际材料数。',
      },
      {
        key: 'frame',
        prompt: review
          ? '有洞的图案，洞里的空位也算放了纸片吗？'
          : '有凹角的图案，最外面长方框中的空位也算纸片吗？',
        answer: 'no',
        good: '不算，只数实际放片的位置',
        bad: '算，外框里面都算',
        hint: '看哪里真正被纸片填住。',
        explanation:
          '凹角外空位和中间洞没有纸片，不能当成已放；1片参考也不是额外用片。',
      },
      {
        key: 'open',
        prompt: review
          ? '别人用不同数量的同样正方形拼另一个“0”，必须按本课示例片数判错吗？'
          : '自己拼0～9的图案，只能使用本课给出的唯一摆法吗？',
        answer: 'no',
        good: '不是，保留自己的清楚图案并记录实际片数',
        bad: '是，所有作品必须照示例一样',
        hint: '开放作品要说明自己的摆法，客观题才按给出的原图数。',
        explanation: '开放创作不设唯一图案或用片数；给定图的计数仍按原图记录。',
      },
    ].map((item): Question => ({
      id: `${prefix}-${item.key}`,
      knowledge: `${id}-${item.key}`,
      prompt: item.prompt,
      choices: [
        { id: item.answer, label: item.good },
        { id: 'yes', label: item.bad },
      ],
      rule: { kind: 'choice', value: item.answer },
      hint: item.hint,
      explanation: item.explanation,
    })),
  ];
}
export const sujiaoSquareMosaicsDraft: Lesson = {
  id,
  title: '正方形拼图：四片变形与数字图案',
  textbookTitle: '图形的拼组·用正方形拼',
  page: 32,
  version: 1,
  status: 'preparing',
  goal: '用同样正方形创造不同轮廓，按参考片数无拼缝图，创作0～9数字图案并记录实际用片数。',
  prerequisite:
    '认识正方形、长方形，会逐个点数到16；图案用片超过10时可请家长协助逐排数。',
  parentTip:
    '来源为已读32～33页用正方形拼活动，本站字形和轮廓均原创。先用4片，不重叠、不增减；再分次或分工创作0～9并记录片数，开放图样不评唯一摆法。本课格距不代表厘米，不教授面积公式；带洞轮廓为本站补充观察，不冒充教材原图。网页状态与实物作品、同伴合作分别确认。',
  steps: [
    {
      title: '四片换摆法，片数不变',
      text: '材料是四片同样正方形，不剪、不叠。图中四片排成一行，整体是长方形。先取下一片，再点一个空位放回，试着改成凹角图案或正方形；所有四片放回后再判断完整外形。学具余片数只供操作，不能自动记成实物完成。',
      visual: squareMosaicModel(required(fourPatterns[0]), true),
      activity:
        '用四片真实同样正方形摆至少两种不同完整轮廓，每次都点数四片，指出整图与每片的区别。',
    },
    {
      title: '没有拼缝，也能按参考片数',
      text: '目标只画完整边界，左上的小正方形告诉你一片的大小。逐排想象该放几个同样大小片；凹进去或中间有洞的空位不放片。这里的长方框只帮助定位，不能把所有框内位置都算成用片；也不能把参考片再加进作品数量。',
      visual: squareMosaicModel(required(outlinePatterns[0]), false),
      activity:
        '用真实片在纸上描一幅边界，取走片后请家长按同一片的大小试填，再检查实际需要几片。',
    },
    {
      title: '数字图案不等于材料片数',
      text: '拼出的图案可以表示“2”，但组成它的小正方形不一定只有两片。先说自己想表示哪个数字，再逐行点数材料，把“表示的数字”和“实际用了几片”分别记录。同一个数字可以有不同清楚的摆法。每步学具独立保存，不自动接着上一页作品。',
      visual: squareMosaicModel(required(digitMosaics[2]), true),
      activity:
        '与家长或同伴分工，分次拼0～9，每个数字保留至少一种自己的图案，分别记录实际片数，不照示例数直接确认。',
    },
    {
      title: '保留作品，说说怎样数',
      text: '用有洞的数字图案练习观察，每个实际位置放一片；洞里面不算片。换个摆法可以改变材料数量，不能用一次示例的数量给所有作品判错。展示自己的作品，说明打算拼什么、怎样排列、怎样计数；同伴可以问问题，反思用自己的话记录。',
      visual: squareMosaicModel(required(digitMosaics[8]), true),
      activity:
        '选一幅自己喜欢的数字或原创图案展示，指着逐排数，说清空位和实际用片；与家长交换一种数法。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      {
        prompt:
          '操作四片学具，再用真实四片同样正方形摆两种不同完整轮廓；全部四片都放回，不重叠不增减，分别说完整外形。',
        visual: squareMosaicModel(required(fourPatterns[0]), true),
      },
      {
        prompt:
          '与家长或同伴分次、分工完成0～9数字图案，各保留至少一种自己的摆法，并逐个记录实际用片数；不同图样不强判示例数量。',
        visual: squareMosaicModel(required(digitMosaics[0]), true),
      },
      {
        prompt:
          '用同样片准备一个自己的完整边界，取走片请别人猜片数，再实际填满核对；展示作品并说明凹角或洞的空位不算。',
        visual: squareMosaicModel(required(outlinePatterns[0]), false),
      },
    ].map((item, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      ...item,
      rule: { kind: 'manual' },
      hint: '网页可操作，实际摆片、合作与口述另行人工确认；没有材料可跳过。',
      explanation:
        '点击或答对不代替真实创作。只确认实际完成的任务，开放图样保留多解。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '你怎样分清图案表示的数字与实际片数？换摆法时发现了什么？记自己的话。',
      rule: { kind: 'reflection' },
      hint: '可以说逐排数、参考片、空位或自己的另一种摆法。',
      explanation: '原话单独保存，不评唯一答案。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读正方形实践范围与原创网格条件检查',
    notes: `依据ISBN ${source.isbn}印刷32～33页，本站四片形状、数字0～9与凹洞轮廓原创。固定单位正方形、每格最多一片，给图计数和开放实物创作分开；客观题固定题图，即使查看提示也不开放编辑。版权版次印次仍待核验，不代表三角形/混合图案实践和整段活动已全部完成。`,
  },
};
