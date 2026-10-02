import type { Lesson, Question } from '../learning/types';

import { sujiaoUpperSource as source } from './sujiao-upper-source';
const id = 'sj-upper-final-evaluation';
function tasks(review: boolean): Question[] {
  const q = (
    key: string,
    prompt: string,
    rule: Question['rule'],
    explanation: string,
  ): Question => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
    rule,
    hint: '本项独立核对；方向以明确的人为准，0与未填、全部数量与单个一分清。',
    explanation,
  });
  const nums = Array.from({ length: 20 }, (_, i) => i);
  return [
    q(
      'all-numbers',
      review
        ? '0～19全部数按从大到小写全二十值，19和0都要写。'
        : '0～19全部数按从小到大写全二十值，0和19都要写。',
      { kind: 'steps', values: review ? nums.toReversed() : nums },
      '二十个标签包含0，最大值19；网页完整填值不代替真实读写/点数记录。',
    ),
    {
      ...q(
        'ten-unit',
        review
          ? '计数器表示14，先填单个一、再填十的个数。'
          : '计数器表示17，先填十的个数、再填单个一。',
        { kind: 'steps', values: review ? [4, 1] : [1, 7] },
        '十位1表示一个十，不是只一件；个位4/7是单个一，全部仍14/17件。',
      ),
      visual: { kind: 'digit-counter', tens: 1, ones: review ? 4 : 7 },
    },
    {
      ...q(
        'compare',
        review
          ? '比较18和15，应该填哪个符号：18□15？'
          : '比较7和17，应该填哪个符号：7□17？',
        { kind: 'choice', value: review ? 'greater' : 'less' },
        '看实际数量大小，尖端朝较小数，不按字写得大或号码长判断。',
      ),
      choices: [
        { id: 'less', label: '＜' },
        { id: 'greater', label: '＞' },
        { id: 'equal', label: '＝' },
      ],
    },
    q(
      'arithmetic',
      review
        ? '五独立基础式按顺序填得数：①3+7；②9−5；③4+0；④8−8；⑤6−0。'
        : '五独立基础式按顺序填得数：①8+2；②10−4；③0+6；④7−7；⑤9−0。',
      { kind: 'steps', values: review ? [10, 4, 4, 0, 6] : [10, 6, 6, 0, 9] },
      '每式各自起点，0是有效结果不是未填；用组成、接数/倒数或加减关系说自己的方法。',
    ),
    q(
      'application',
      review
        ? '原有6支铅笔，真正拿走2支给朋友，还剩几支？只问剩余（支）。'
        : '左边3本、右边4本，都属于同一堆书的两部分，一共几本？只问合计（本）。',
      { kind: 'number', value: review ? 4 : 7 },
      review
        ? '6−2=4支，时间变化真的取走；移动同一支换位置不能也当少一支。'
        : '3+4=7本，两个不重叠部分合计，不把同本重复计数；记录单位本。',
    ),
    {
      ...q(
        'solid-feature',
        review
          ? '四理想形体中，选全部没有平面的形体。'
          : '四理想形体中，选全部有曲面的形体。',
        { kind: 'set', values: review ? ['sphere'] : ['cylinder', 'sphere'] },
        '球没有平面，圆柱有平面和曲面；依本题规则，换组不变形体。',
      ),
      choices: [
        { id: 'cube', label: '正方体' },
        { id: 'cuboid', label: '长方体' },
        { id: 'cylinder', label: '圆柱' },
        { id: 'sphere', label: '球' },
      ],
    },
    {
      ...q(
        'body-direction',
        review
          ? '固定纸标记B在你右手一侧的桌面，站原地转半圈后，标记没移动，现在在你的哪一侧？'
          : '固定纸标记B在你左手一侧的桌面，站原地转半圈后，标记没移动，现在在你的哪一侧？',
        { kind: 'choice', value: review ? 'left' : 'right' },
        '以转后的自己为观察者，转半圈左右换边；物未动也可改相对方向，不把屏幕左边当所有人的左边。',
      ),
      choices: [
        { id: 'left', label: '自己左侧' },
        { id: 'right', label: '自己右侧' },
        { id: 'same', label: '物没动，左右一定不变' },
      ],
    },
    {
      ...q(
        'independent',
        review
          ? '认识数已做，方向游戏未做，能把五项都记已完成吗？'
          : '网页题全答对，五项实际证据就都自动满星吗？',
        { kind: 'choice', value: 'separate' },
        '认识数、计算应用、形体、方向、认真操作表达分别留实际证据与自己的反思，允许一项完成另一项待做，不能复制或自动评星。',
      ),
      choices: [
        { id: 'separate', label: '不能，五项独立，待做与帮助如实记' },
        { id: 'auto', label: '能，一项或网页正确代替全部实际证据' },
      ],
    },
  ];
}
const entries = [
  [
    'numbers',
    '认识数与大小',
    '实际0～19全部点数/认读/纸写，含0；11～19各整理一十加单个一，说明十位1代表十；自己写至少三组不同大小/相等用＜＞＝表示并核对，保留真实作品、帮助或困难。',
    '写今天真实认读/写数/十与一或大小符号的一例及帮助改正，未做如实说；未来练习另列。',
  ],
  [
    'calculation',
    '10以内计算与实际应用',
    '实际独立计算8+2/10−4/0+6/7−7/9−0及新3+7/9−5/4+0/8−8/6−0，说至少一加一减方法；自编一个合并两部分和一个真实取走故事，写已知/所求/算式/单位/答句并画摆核对，不是抄例换名。保留两故事和帮助。',
    '写今天真实计算或自主故事的一例、方法/单位及改正帮助，未做如实说；未来计划另列。',
  ],
  [
    'solids',
    '辨认四种形体',
    '实际拿或看自己四种可核验模型，分别说长方体/正方体/圆柱/球，描述平面/曲面特点并对应生活中近似物，不把包装花纹/颜色/画图大小当形体。无某模型如实待做，可用真实纸模型注明替代，网页图不代替观察。',
    '写今天真实观察哪种模型/近似物、依据的特点和帮助困难，缺材料如实说；未来计划另列。',
  ],
  [
    'position',
    '上下来回与六方向',
    '实际以自己为明确观察者，家人帮摆纸卡在上/下/前/后/左/右各位，自己分别说明六关系；固定前方/左方卡不动，原地安全转半圈重新说后方/右方，换人观察另标人。保留原话和帮助，无同伴待做，纸上画图不冒实际换位。',
    '写今天真实六方向或转身观察的一例、以谁为准及帮助改正，未做如实说；未来计划另列。',
  ],
  [
    'expression',
    '认真操作、思考与表达',
    '实际从今天自己一项完整活动中，先说计划、按步骤操作、查漏或改错、用自己的话向家人说明为什么；家人记录实际一条表现/帮助，保存作品或记录，不能只说答对了。未来准备的活动另列。',
    '写今天真实认真操作/主动思考或表达的一例、自己怎样核对以及困难帮助；未做如实说，未来安排另列。',
  ],
] as const;
export const sujiaoUpperFinalEvaluationLesson: Lesson = {
  id,
  title: '期末自评：五方面分别留证据',
  textbookTitle: '期末复习·评价与反思',
  page: 94,
  version: 1,
  status: 'available',
  goal: '认识数/计算应用/四形体/六方向/操作思考表达五方面各真实证据与独立反思，保留帮助待做，未来计划分开，不自动评星。',
  prerequisite:
    '复习本学期0～19、10以内加减/故事、四形体及位置；备安全小棒/纸卡/模型、纸笔，与家人共同观察。',
  parentTip: `ISBN ${source.isbn}同版94页五项评价已实际查看。8客观仅复习，五manual各实际证据、五reflection各自文本correct null，网页全对不自动填五项满星，不以综合反思替五项。认识全部0～19和十位单位，计算含0/两真实不同结构故事，形体实物、六方向固定观察者和半圈转身、认真操作表达分别记录；未来计划分开，旧ID快照/备份保持，教师最终审校未核验。`,
  steps: [
    {
      title: '认识数与大小，一项自己的作品',
      text: '0～19全部数认、读、写、点数，0真实表示没有，空白是尚未填。十位1代表一十；11～19整理一十加几个一，数量不因成捆改变。用＜＞＝比较实际大小，每个判断核对。保存今天自己真实作品和帮助，不能拿一题正确代全部认读写。',
      visual: { kind: 'digit-counter', tens: 1, ones: 7 },
      activity: entries[0][2],
    },
    {
      title: '计算和应用，不只报答案',
      text: '独立10以内加减，含加0、减0和最后得0，每题复原起点。可以组成、接数/倒数或加减关系解释。自编静态两部分合计与时间上真实取走两种故事，各有已知/所求/算式/单位/答句并画摆核对；抄例只换名不算自己的故事。',
      activity: entries[1][2],
    },
    {
      title: '四形体，说实际观察的特点',
      text: '长方体、正方体有平面，圆柱有平面也有曲面，球有曲面没有平面。生活物只是近似模型，不看颜色/花纹判断。实际观察四模型逐个说名和特点，缺材料如实记待做；可以用纸模型注明，图示正确不代替自己的观察。',
      visual: {
        kind: 'solid-row',
        shapes: ['cuboid', 'cube', 'cylinder', 'sphere'],
      },
      activity: entries[2][2],
    },
    {
      title: '六方向，以谁为准要说明',
      text: '上/下与前/后/左/右分别描述。用自己或指定人作为观察者，换观察者或转身要重判断。前方与左方固定纸卡没动，自己原地转半圈后改在后方和右方；物不动不保证相对方向不变。实际安全换位，别用屏幕左右代替所有人的左右。',
      activity: entries[3][2],
    },
    {
      title: '操作表达与五份独立反思',
      text: '认真操作、主动思考与表达也需要真实例子：计划、执行、检查、发现问题或解释，不只一串正确率。五项各保存实际记录与一份自己的反思，可以有的完成、有的需帮助或待做；不复制一段话充五项，不自动评星，未完成与未来计划分开。',
      activity: entries[4][2],
    },
  ],
  questions: [
    ...tasks(false),
    ...entries.map(([key, title, prompt]): Question => ({
      id: `${id}-actual-${key}`,
      knowledge: `${id}-actual-${key}`,
      prompt: `${title}：${prompt}`,
      rule: { kind: 'manual' },
      hint: '本项真实作品/观察完成后独立确认，未做暂跳，帮助如实记，未来计划另列。',
      explanation: '五项实际证据各自人工，不由网页正确自动确认。',
    })),
    ...entries.map(([key, title, , prompt]): Question => ({
      id: `${id}-reflection-${key}`,
      knowledge: `${id}-reflection-${key}`,
      prompt: `${title}：${prompt}`,
      rule: { kind: 'reflection' },
      hint: '本方面真实例子、帮助/待做与未来计划分别写，不复制其它方面。',
      explanation: '每项reflection correct null，不自动判对错或评星。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-02',
    reviewer: '五方面各真实证据与独立反思核对',
    notes:
      '2024年7月第1版、2025年7月第2次印刷94页已实际查看，五项分别对应manual和reflection，未来计划分开；教师最终审校未核验。',
  },
};
