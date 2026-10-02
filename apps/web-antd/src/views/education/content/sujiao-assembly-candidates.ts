import type {
  AssemblyCandidatesVisual,
  Lesson,
  Question,
} from '../learning/types';

import { required } from '../learning/required';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-assembly-candidates';
export const assemblyLayouts: AssemblyCandidatesVisual['layout'][] = [
  'rect-triangle',
  'square-slant',
  'squares-triangle',
  'four-squares',
];
export const assemblyModel = (
  layout: AssemblyCandidatesVisual['layout'],
  review: boolean,
): AssemblyCandidatesVisual => ({
  kind: 'assembly-candidates',
  layout,
  variant: review ? 'review' : 'main',
});
function tasks(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  return [
    ...assemblyLayouts.flatMap((layout, index): Question[] => {
      const values = (() => {
        if (review) return index < 2 ? ['B'] : ['B', 'C'];
        return index < 2 ? ['A'] : ['A', 'B'];
      })();
      const visual = assemblyModel(layout, review);
      return [
        {
          id: `${prefix}-${index}-fit`,
          knowledge: `${id}-${index}-fit`,
          prompt: review
            ? '换了候选朝向和顺序，哪些完整轮廓能用指定纸片拼成？选出全部，不只选一个。'
            : '指定纸片每片各用一次，可以整格移动、四分之一圈转向，哪些完整轮廓能拼成？选出全部。不能重叠、留空隙、翻面或剪裁。',
          visual,
          choices: ['A', 'B', 'C'].map((letter) => ({
            id: letter,
            label: letter,
          })),
          rule: { kind: 'set', values },
          hint: '可以先用同样比例纸片试拼。检查每片都用上，完整边界叠齐；只看大小或形状名字不够。',
          explanation: `在本题明确材料和操作范围内，${values.join('、')}能拼。${(() => {
            if (index === 2)
              return '两块正方形与一块三角形可以有两种不同完整轮廓。';
            return index === 3
              ? '四块小正方形可拼两种不同轮廓；等大小三角形不能靠这些整格、直角转向的小正方形填满。'
              : '另外的轮廓不能由这组纸片按本题规则无重叠、无空隙填满。';
          })()}不把本站固定比例结论推广到任意同名纸片。`,
        },
        {
          id: `${prefix}-${index}-pieces`,
          knowledge: `${id}-${index}-pieces`,
          prompt: review
            ? '新材料区一共给了几片？数纸片，不数候选或顶点。'
            : '材料区一共给了几片？每片只数一次，候选轮廓不算材料。',
          visual,
          rule: { kind: 'number', value: required([2, 2, 3, 4][index]) },
          hint: '只数标着数字的材料片，不数A/B/C候选。',
          explanation: `本题给${[2, 2, 3, 4][index]}片，必须全部各用一次。候选是要拼出的边界，不是额外可用纸片。`,
        },
      ];
    }),
    ...[
      {
        key: 'all',
        prompt: review
          ? '试拼时剩下一片没用，但外形看起来一样，可以算完成吗？'
          : '题目说每片各用一次，少用一片但看起来像目标，能算拼成吗？',
        answer: 'no',
        good: '不能，指定纸片要全部用上',
        bad: '可以，只要外形像',
        hint: '重新点数每片是否实际使用。',
        explanation: '少用、重复使用或另加材料都改变了题目条件。',
      },
      {
        key: 'overlap',
        prompt: review
          ? '把多出的材料压在已拼图形下面，轮廓对了，算按规则完成吗？'
          : '把一片盖在另一片上，外轮廓相同，就能算无重叠拼成吗？',
        answer: 'no',
        good: '不能，内部不能重叠',
        bad: '能，只看外轮廓就行',
        hint: '检查内部分布，不只看外围。',
        explanation: '所有材料要无重叠、无空隙填满轮廓，藏在下面不能算。',
      },
      {
        key: 'category',
        prompt: review
          ? '两组材料都叫三角形，大小比例不同，能直接套同一拼法结论吗？'
          : '只知道材料都叫正方形或三角形，不核对比例，就能套本课结论吗？',
        answer: 'no',
        good: '不能，还要核对实际大小、比例与规则',
        bad: '能，只要形状名字相同',
        hint: '长短和比例不同，会改变能否拼合。',
        explanation:
          '本课结论只对给定尺寸和操作范围成立，不冒充教材实物的未知尺寸。',
      },
      {
        key: 'multiple',
        prompt: review
          ? '两种不同完整轮廓都按条件拼成，可以都选吗？'
          : '同组纸片能拼出两种不同候选轮廓时，可以都选吗？',
        answer: 'yes',
        good: '可以，保留所有符合条件的候选',
        bad: '不可以，必须只选一个',
        hint: '读清“选出全部”。',
        explanation:
          '能拼的轮廓可能不止一个；不能因图样不同就把另一个合法结果判错。',
      },
    ].map((item): Question => ({
      id: `${prefix}-${item.key}`,
      knowledge: `${id}-${item.key}`,
      prompt: item.prompt,
      choices: [
        { id: item.answer, label: item.good },
        { id: item.answer === 'no' ? 'yes' : 'no', label: item.bad },
      ],
      rule: { kind: 'choice', value: item.answer },
      hint: item.hint,
      explanation: item.explanation,
    })),
  ];
}
export const sujiaoAssemblyCandidatesDraft: Lesson = {
  id,
  title: '指定纸片拼候选：每片都用上',
  textbookTitle: '图形的初步认识（二）·指定材料拼组判断',
  page: 30,
  status: 'preparing',
  version: 1,
  goal: '读清指定材料和操作条件，通过试拼选出全部能填满的候选轮廓，区分看起来相像与真正无空隙拼成。',
  prerequisite:
    '会识别简单平面图形，理解同类不一定大小相同，能按规则转向纸片。',
  parentTip:
    '依据已读第30页指定材料判断范围，本站四组均为原创固定比例，不复制原图、不冒充原教材尺寸。网页只展示材料和候选，不自动替孩子拼；家长按图给的共同间隔准备纸片，不要求计算面积、角度或背六边形名称。整格移动和四分之一圈转向是本题明确条件，不推广到全部自由拼法。',
  steps: [
    {
      title: '材料与候选分开',
      text: '数字1、2表示这组可用纸片；A、B、C是要拼出的完整边界，不是额外纸片。长方形宽1间隔、高2间隔；三角形两条直角边分别1和2间隔。每片都用一次，不剪短、不拉长、不翻面，只整格移动或转四分之一圈。图卡外框不是纸片大小。',
      visual: assemblyModel('rect-triangle', false),
      activity:
        '按同一比例准备两片，先数材料，再试拼候选A；沿外边逐段检查，不只看名字。',
    },
    {
      title: '完整边界相同还要检查内部',
      text: '用正方形与斜边四边形全部拼好，检查每片放在哪里。不能把多出部分压在另一片下，也不能只围出边界而里面有空隙。候选只画外轮廓，不提前画分片；自己试拼后再指着说明。',
      visual: assemblyModel('square-slant', false),
      activity:
        '用图示尺寸的正方形和斜边四边形试拼，指出接边，不用遮盖的方法凑轮廓。',
    },
    {
      title: '同组材料可能有多种结果',
      text: '两块同样的小正方形和一块单位直角三角形，可以换摆法得到不同完整轮廓。题目要求选出全部能拼的候选，不是每次只圈一个。先保存一种摆法，再尝试另一个候选，不能因新图样不同就说错。',
      visual: assemblyModel('squares-triangle', false),
      activity:
        '同一组三片分别试拼A、B，保留每一种合法摆法，口述哪里换了位置。',
    },
    {
      title: '大小相近不能代替试拼',
      text: '四块同样的小正方形可以换整格位置拼不同图样。一个候选即使围住的地方与四片合起来一样多，也不保证能按指定规则填满；还要检查斜边和拐角是否能真正对齐。这里不要求孩子算面积，用真实试拼和逐边观察说明。',
      visual: assemblyModel('four-squares', false),
      activity:
        '全部四片分别试拼候选，不能重叠、剪开或半格移动；与家长讨论哪个边界对不齐。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '按共同间隔准备长方形与三角形，全部使用试拼候选A；沿完整外轮廓检查，每片内部不能重叠，口述条件。',
      '准备两块相同正方形和一块直角三角形，用同一组三片分别完成两个合法候选；保留两种摆法并说明变化。',
      '用四块相同小正方形，按本课整格移动与四分之一圈转向的规则试拼候选；说出不允许剪裁、重叠或留下空隙。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      visual: assemblyModel(
        required(assemblyLayouts[required([0, 2, 3][index])]),
        false,
      ),
      rule: { kind: 'manual' },
      hint: '真实纸片由家长安全准备，实物操作与口述后人工确认；没有材料可跳过。',
      explanation: '网页选对不能代替实际试拼；按真实材料记录合法方法。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt: '为什么不能只看候选像不像？你检查了哪些拼组条件？记自己的话。',
      rule: { kind: 'reflection' },
      hint: '可谈材料数量、比例、完整边界、空隙或重叠。',
      explanation: '反思原话单独记录，不评唯一标准答案。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '指定拼组范围与原创候选几何检查',
    notes: `依据ISBN ${source.isbn}印刷第30页指定图形拼组判断。本站四组原创固定尺寸、共同尺度与三个候选，允许整格移动和四分之一圈转向，不复制教材图样或声称原图比例。全部用片、无重叠无空隙，可能多解；复习换候选顺序与朝向。实物确认独立，版权版次印次仍待核验，不代表附页指定碎片或完整单元完成。`,
  },
};
