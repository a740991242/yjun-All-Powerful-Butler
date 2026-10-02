import type { Lesson, Question } from '../learning/types';

import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-three-piece-join';
function tasks(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const entries: [string, string, string, string, string][] = [
    [
      'all',
      review
        ? '复习：只用了A和B，C留在旁边，是否完成“用全部三片拼组”？'
        : 'A、B拼好了，C还在旁边，算完成本课三片拼组吗？',
      'no',
      '不算，要把三片都用上',
      '算，外形好看就行',
    ],
    [
      'overlap',
      review
        ? '复习：把两块三角形叠成一块，外边像长方形，可以当作无重叠拼组吗？'
        : 'B压在C上面，外边看着整齐，可以说三片没有重叠吗？',
      'no',
      '不能，还要检查内部是否重叠',
      '可以，只看外边就行',
    ],
    [
      'gap',
      review
        ? '复习：外边四角围成一个四边形，中间却空着一格，算完整填满吗？'
        : '三片的外侧看起来围成四边形，但中间有空隙，算完整拼好了吗？',
      'no',
      '不算，内部不能留空隙',
      '算，外侧能围出四边形就行',
    ],
    [
      'turn',
      review
        ? '复习：C转半圈以后，纸片大小仍和原来一样吗？'
        : 'B转四分之一圈，纸片大小会保持不变吗？',
      'yes',
      '会，转向不改变纸片大小',
      '不会，朝向不同大小就不同',
    ],
    [
      'seam',
      review
        ? '复习：指拼好后大图形的边时，需要把B、C之间的接缝也当外边吗？'
        : '数完整外轮廓的边时，里面的拼接线也算外边吗？',
      'no',
      '不算，沿完整外轮廓观察',
      '算，看到的线都算外边',
    ],
    [
      'quantity',
      review
        ? '复习：用同样三片从长方形改拼成平行四边形，纸片数量仍是三块吗？'
        : '把同样三片移动、转向，没有剪裁或添加，纸片仍是原来的三块吗？',
      'yes',
      '是，仍是原来的三片',
      '不是，外形改变就增加纸片',
    ],
    [
      'materials',
      review
        ? '复习：只要有一块长方形和两块同样大小的三角形，不论尺寸关系都能照搬本学具的拼法吗？'
        : '本学具能拼出的图形，是否代表所有长方形配任意两个同样大小三角形都能这样拼？',
      'no',
      '不能，还要核对各片的尺寸关系',
      '能，形状名称一样就足够',
    ],
  ];
  return [
    ...entries.map(([suffix, prompt, value, right, wrong]): Question => ({
      id: `${prefix}-${suffix}`,
      knowledge: `${id}-${suffix}`,
      prompt,
      rule: { kind: 'choice', value },
      choices: [
        { id: value, label: right },
        { id: value === 'yes' ? 'no' : 'yes', label: wrong },
      ],
      hint: '检查原材料、全部纸片、内部接缝和完整外轮廓。',
      explanation:
        '本课材料尺寸固定。只移动和转向，不增减纸片；三片都用上，检查不重叠、不留空隙，再看外轮廓。不同尺寸的材料要重新实际尝试。',
    })),
    {
      id: `${prefix}-count`,
      knowledge: `${id}-count`,
      prompt: review
        ? '复习：学具中A是一块，B、C各是一块，一共有几块纸片？'
        : '本学具共有几块纸片？内部的格线不是剪线。',
      rule: { kind: 'number', value: 3 },
      hint: '分别数A、B、C。',
      explanation: 'A、B、C共三块；格线只是对齐参照，移动和转向不增加纸片。',
    },
  ];
}
export const sujiaoThreePieceJoinDraft: Lesson = {
  id,
  title: '三片拼组：全部用上，再看外轮廓',
  textbookTitle: '图形的初步认识（二）·三片拼组探索',
  page: 29,
  version: 1,
  status: 'preparing',
  goal: '使用固定长方形和两块同样大小三角形，尝试完整拼组，区分接缝与外边，检查重叠、空隙和材料条件。',
  prerequisite: '认识长方形、三角形与平行四边形，能区别外轮廓和内部接缝。',
  parentTip:
    '网页使用本站原创固定尺寸材料，不与课本插图等同比例。纸片可移动、转向，不能拉伸或剪裁；不要求唯一拼法。实物剪裁由家长操作。',
  steps: [
    {
      title: '先说明三片材料',
      text: 'A宽2格、高1格；B、C各是一个1×1方格沿对角线分出的一半，形状大小完全一样。所有格子的长度一样，不是厘米。本站材料的比例与课本原插图不完全相同，不能把它当成所有尺寸纸片的结论。',
      visual: { kind: 'three-piece-join' },
    },
    {
      title: '先拼一个完整长方形',
      text: '保留A的初始位置。选择B，左移一次、下移一次；选择C，上移两次、左移两次。B、C合成一个正方形，与A并排，外面是长方形。把三片都用上，里面的接缝不是外边。可以重置后用自己的合法方法。',
      visual: { kind: 'three-piece-join' },
      activity: '尝试完成长方形，指一圈外轮廓，再指出两块三角形之间的接缝。',
    },
    {
      title: '换一种完整外轮廓',
      text: '每一步学具分别保存，这里先从初始摆法做一次长方形：B左移一次、下移一次；C上移两次、左移两次。然后选择B，上移一次，转两次，左移三次，下移一次；选择C，右移一次，转两次，左移一次。两块三角形分别在A两侧，完整外轮廓是平行四边形。每片大小没有变化。这里给一种可操作示例，合法拼法可以不同。',
      visual: { kind: 'three-piece-join' },
      activity:
        '在这一步学具中按说明先做长方形，再改变外形；观察转向和移动怎样改变外轮廓。',
    },
    {
      title: '不只看四角，也检查里面',
      text: '三片分开时也能想象一个外面的四边形，但不能据此说已经填满。检查三片全部参与、不重叠、不留空隙，再看完整外轮廓。网页不代替真实纸片操作；任意尺寸的材料能否拼出同一外形，需要重新核对。',
      visual: { kind: 'three-piece-join' },
      activity:
        '准备相同尺寸关系的纸片，实际拼两种外形；指出接缝、重叠或空隙，记录自己的方法。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '用真实纸片拼一个不重叠、不留空隙的长方形，全部用上；沿外轮廓指一圈，并指出内部接缝。',
      '仍用同样三片尝试一个平行四边形，说明移动或转向了哪片；可以采用与网页示例不同的合法方法。',
      '用纸片演示一次重叠或留空隙的摆法，再改正；说明为什么只看外边还不够。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      rule: { kind: 'manual' },
      visual: { kind: 'three-piece-join' },
      hint: '实际操作和解释后人工确认；没有材料可跳过，不把网页反馈当实物完成。',
      explanation:
        '实物作品和表达独立确认；开放拼组保留不同合法方法，不要求唯一摆法。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt: '拼组时你会先检查什么？记录一句自己的发现或疑问。',
      rule: { kind: 'reflection' },
      hint: '写自己的话，家长可以按原话代写。',
      explanation: '学习反思单独记录，不评对错。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读三片拼组范围与原创固定尺寸学具核验',
    notes: `依据印刷第29页三片拼组活动，ISBN ${source.isbn}。本站自定2×1长方形与两块单位直角三角形，不复制教材原图比例或文字。网页识别需全部非重叠材料填满凸外轮廓；实物单独确认。不代替等长小棒、练习四或整个单元；版权版次与印次仍未核验。`,
  },
};
