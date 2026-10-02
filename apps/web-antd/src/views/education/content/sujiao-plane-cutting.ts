import type {
  Lesson,
  Question,
  RectangleCutVisual,
  Visual,
} from '../learning/types';

import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-plane-cutting';
function model(
  width: 4 | 6,
  cut: RectangleCutVisual['cut'],
): RectangleCutVisual {
  return { kind: 'rectangle-cut', width, cut };
}
const shapes = [
  { id: 'rectangle', label: '长方形' },
  { id: 'square', label: '正方形' },
  { id: 'triangle', label: '三角形' },
  { id: 'circle', label: '圆' },
];
function tasks(review: boolean): Question[] {
  const width = review ? 6 : 4;
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  function choice(
    suffix: string,
    prompt: string,
    value: string,
    choices: { id: string; label: string }[],
    explanation: string,
    visual?: Visual,
  ): Question {
    return {
      id: `${prefix}-${suffix}`,
      knowledge: `${id}-${suffix}`,
      prompt,
      rule: { kind: 'choice', value },
      choices,
      hint: '观察指定材料、剪线的起止和完整轮廓；不能把一种材料的结论直接套到所有材料。',
      explanation,
      ...(visual ? { visual } : {}),
    };
  }
  return [
    ...(['horizontal', 'vertical', 'diagonal'] as const).map((cut): Question =>
      choice(
        `shape-${cut}`,
        `${review ? '复习纸片' : '本图纸片'}沿粗虚线剪开，A、B两块各是什么形状？不把字母算成边。`,
        (() => {
          if (cut === 'diagonal') return 'triangle';
          return cut === 'vertical' && width === 4 ? 'square' : 'rectangle';
        })(),
        shapes,
        (() => {
          if (cut === 'diagonal')
            return '这条剪线连接一对相对顶点，剪成两个三角形。';
          return (() => {
            if (cut === 'vertical' && width === 4)
              return '原图宽4段、高2段，竖着从宽的正中剪开后，每块宽2段、高2段，都是正方形。';
            return cut === 'vertical'
              ? '原图宽6段、高2段，竖着从宽的正中剪开后，每块宽3段、高2段，都是长方形。'
              : `宽${width}段、高2段，从高的正中横剪，每块宽${width}段、高1段，是长方形。`;
          })();
        })(),
        model(width, cut),
      ),
    ),
    {
      id: `${prefix}-pieces`,
      knowledge: `${id}-pieces`,
      prompt: `${review ? '复习图' : '本图'}沿粗虚线只剪这一刀，分成几块？没有增加纸片。`,
      visual: model(width, 'diagonal'),
      rule: { kind: 'number', value: 2 },
      hint: '看剪线两边的区域，不把顶点、刻度或字母当纸片。',
      explanation: '剪线把完整纸片分成A、B两块；刻度只是比较边长的参照。',
    },
    choice(
      'same',
      `${review ? '复习图' : '本图'}从一个角剪到相对角，剪成的A、B形状大小完全一样吗？`,
      'yes',
      [
        { id: 'yes', label: '完全一样，可以转向后重合' },
        { id: 'no', label: '不一样，朝向不同就不一样' },
      ],
      '两个三角形可以转半圈后重合。朝向不同不代表形状大小不同；实际纸片应叠放检查。',
      model(width, 'diagonal'),
    ),
    choice(
      'any-rectangle',
      review
        ? '另一张长方形纸不知道长宽关系，竖着对折剪开就一定能得到两个正方形吗？'
        : '本图竖着对折能剪出两个正方形，能据此说每一种长方形都可以吗？',
      'no',
      [
        { id: 'no', label: '不能，还要看原纸片的长宽关系' },
        { id: 'yes', label: '能，只要是长方形就可以' },
      ],
      '两个完全一样的纸片不一定是正方形。只有原宽正好是高的两倍，这种竖着对折剪法才得到两个正方形。',
    ),
    choice(
      'any-slant',
      review
        ? '在长方形纸上随便画一条斜线，都能剪成两个完全一样的三角形吗？'
        : '本图角到相对角的剪法得到两个完全一样的三角形，换成任意斜线也一定可以吗？',
      'no',
      [
        { id: 'no', label: '不能，剪线的位置和端点有条件' },
        { id: 'yes', label: '能，只要斜着剪就可以' },
      ],
      '这里指定连接相对顶点。任意斜线可能不产生两个三角形，或两块不能重合。',
    ),
    choice(
      'parallelogram',
      `${review ? '复习轮廓' : '图中完整轮廓'}在本课中叫什么？它有四条直边，两组对边分别平行，角不是直角。`,
      'parallelogram',
      [...shapes, { id: 'parallelogram', label: '平行四边形' }],
      '本图是平行四边形。观察整条外轮廓，不把里面的拼接线当外边；本课先认识名称，不用面积公式。',
      { kind: 'shape', shape: 'parallelogram' },
    ),
    choice(
      'join',
      review
        ? '用两块同样大小的三角形重新拼图，没有剪掉或补上纸，纸的总数量会因为外轮廓改变而多出来吗？'
        : '把两块三角形纸重新拼成另一种外轮廓，没有增减纸，纸会变多吗？',
      'no',
      [
        { id: 'no', label: '不会，排列和外轮廓可以改变，但没有增减纸' },
        { id: 'yes', label: '会，图形名称不同就多了一块纸' },
      ],
      '移动、转向改变摆放；不产生新纸片。讨论覆盖的地方时还要检查重叠和空隙，不仅看外边。',
    ),
    choice(
      'fold',
      review
        ? '正方形纸对折再对折，却没有说明每次沿哪条线折，能只凭这句话确定最后是哪种形状吗？'
        : '只说“正方形纸折两次”，没有说明折线，能给所有折法唯一的图形名称吗？',
      'no',
      [
        { id: 'no', label: '不能，需要说明或实际观察折线与折法' },
        { id: 'yes', label: '能，所有折两次的结果都一样' },
      ],
      '横竖对折与沿对角线折可能得到不同轮廓。开放折法应实际操作、讨论，不强制同一个答案。',
    ),
  ];
}
export const sujiaoPlaneCuttingDraft: Lesson = {
  id,
  title: '图形剪拼：看剪线、比重合与认识平行四边形',
  textbookTitle: '图形的初步认识（二）·活动3及剪拼探索',
  page: 28,
  version: 1,
  status: 'preparing',
  goal: '按指定材料和剪线观察结果，用重合比较两块图形，认识平行四边形，保留不同折拼方法。',
  prerequisite:
    '认识长方形、正方形、三角形与圆，知道同类不一定形状大小完全一样。',
  parentTip:
    '剪裁由家长安全操作。刻度是相同长度的小段，不是厘米测量。具体剪法有条件，不能把例子扩成所有长方形、所有斜线；开放拼图不强制唯一摆法。',
  steps: [
    {
      title: '先说明纸片和剪线',
      text: '这张原创长方形图宽4个同样长的小段，高2段。粗虚线从高的正中横着剪，得到两块长方形。A、B标纸片，边上的短刻度是比较长短的参照，不是新纸片，也不是厘米。',
      visual: model(4, 'horizontal'),
    },
    {
      title: '一种剪法要看长宽条件',
      text: '同一张宽4段、高2段的纸从宽的正中竖剪，每块宽2段、高2段，可以得到两个正方形。换成宽6段、高2段，竖剪后每块宽3段、高2段，得到两个长方形。不能只记“竖剪就是正方形”。',
      visual: model(6, 'vertical'),
      activity:
        '由家长准备两种长宽关系的长方形纸，分别竖着对折剪开，比较形状；不要要求每一种都剪成正方形。',
    },
    {
      title: '角到相对角，再叠放比较',
      text: '连接一对相对顶点剪开，得到两个三角形；将其中一块转半圈可以重合。网页画出轮廓，真实纸片是否完全一样还要叠放检查。“任意斜剪”不等于这条指定剪线。',
      visual: model(4, 'diagonal'),
      activity: '家长沿相对顶点剪纸，孩子转向并叠放两块，比较边和角。',
    },
    {
      title: '拼组可以得到新的外轮廓',
      text: '两块三角形可以尝试不同拼法，像图中两组对边分别平行的四边形，在本课叫平行四边形。拼组时不重叠、不留空隙，再看完整外轮廓。下面的网页学具是从正方形沿对角线分出的两块，不是前面长方形剪出的纸片；可以选择、移动和转向，实际拼组仍单独确认。',
      visual: { kind: 'shape-join' },
      activity:
        '用从正方形分出的两块同样大小三角形，尝试拼正方形、三角形或平行四边形；保留自己的合法方法。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '在两种不同长宽关系的长方形纸上分别横剪、竖剪或连接相对顶点剪，实际叠放检查完全一样，并说明哪种竖剪得到正方形。',
      '用安全纸片或钉点板做两个不同的平行四边形，指完整外轮廓，说明改动了哪里；不要求唯一作品。',
      '把正方形沿对角线分成两块同样大小三角形，尝试两种不重叠、不留空隙的拼法；网页学具供观察，真实作品独立确认。',
    ].map((prompt, i): Question => ({
      id: `${id}-manual-${i}`,
      knowledge: `${id}-manual-${i}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '实际操作与指图解释后，由孩子或家长人工确认。剪刀由家长处理；没有实物时可以跳过。',
      explanation:
        '自由构造可以有多种合法答案，网页不自动判纸面作品完成或正确。',
      ...(i === 2 ? { visual: { kind: 'shape-join' as const } } : {}),
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '你发现哪种剪法需要先检查纸片或剪线？记一句自己的发现，家长可以按原话代写。',
      rule: { kind: 'reflection' },
      hint: '记录自己的发现或疑问，不需要固定句子。',
      explanation: '反思单独保存，不评对错，不替代实物活动。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读活动3剪拼范围与原创图示检查',
    notes: `依据下册印刷第28～30页已读范围，ISBN ${source.isbn}。宽4/6段、高2段为明确条件的原创图例；两块正方形条件、相对顶点剪线与多解折拼分开，不复制原图文。现有学具是正方形分出的三角形，不冒充长方形剪片。版次与印次仍未核验；本课不代替全部练习四或整单元。`,
  },
};
