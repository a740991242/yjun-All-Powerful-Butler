import type { Lesson, Question } from '../learning/types';

import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-final-parade';
function tasks(review: boolean): Question[] {
  const visual = {
    kind: 'parade-frames' as const,
    variant: review ? ('review' as const) : ('main' as const),
  };
  const choices = ['ABC', 'ACB', 'BAC', 'BCA', 'CAB', 'CBA'].map((value) => ({
    id: value,
    label: [...value].join(' → '),
  }));
  const frames = ['A', 'B', 'C'].map((value) => ({
    id: value,
    label: `图片${value}`,
  }));
  const common = (key: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
  });
  const choice = (
    key: string,
    prompt: string,
    options: Question['choices'],
    value: string,
    explanation: string,
  ): Question => ({
    ...common(key),
    visual,
    prompt: `${review ? '新图一直向左行驶。' : '主图一直向右行驶。'}${prompt}`,
    choices: options,
    rule: { kind: 'choice', value },
    hint: '先确认箭头、同一花车和固定观众，再看车在观众哪一侧。图片编号不是时间，不能只看离观众远近。',
    explanation,
  });
  const yesNo = [
    { id: 'no', label: '不能' },
    { id: 'yes', label: '能' },
  ];
  return [
    choice(
      'order',
      '按从最早到最晚排列同一花车的三幅图。',
      choices,
      review ? 'CBA' : 'BAC',
      '主图B未到、A面前、C已过；复习C未到、B面前、A已过，重新看图。',
    ),
    choice(
      'first',
      '最早的图是哪一幅？',
      frames,
      review ? 'C' : 'B',
      '先在前进方向上尚未到P的那一侧，不能把画面位置最左永远当最早。',
    ),
    choice(
      'last',
      '最晚的图是哪一幅？',
      frames,
      review ? 'A' : 'C',
      '持续驶过P后继续向箭头方向前行，最后在已过P的一侧。',
    ),
    choice(
      'beside',
      '哪张图中花车正在固定观众P面前经过？',
      frames,
      review ? 'B' : 'A',
      '主图A、复习B图车与观众的横向位置相同；观众在路旁，不是车道障碍。',
    ),
    choice(
      'distance-only',
      'B、C都离P较远，只凭距离远就能断定哪张最早吗？',
      yesNo,
      'no',
      '两侧都能离P远，需结合方向与是否已过P，不把远近直接当时间。',
    ),
    choice(
      'same-drawing-size',
      '花车画得一样大，能据此说它没有移动吗？',
      yesNo,
      'no',
      '侧面示意固定画图大小；车的位置变化说明运动，不靠透视大小代替位置条件。',
    ),
    choice(
      'speed',
      '能根据本图算出花车实际每分钟走多少米吗？',
      yesNo,
      'no',
      '没有真实距离、时间和比例，图中坐标不作为米数或秒数。',
    ),
    choice(
      'changed-observer',
      '若另一次观众也移动、花车会掉头，能直接套用本图顺序吗？',
      yesNo,
      'no',
      '需核对实际过程，不能把固定观众、持续同方向条件搬到条件不明的新照片。',
    ),
    {
      ...common('one-float'),
      visual,
      prompt: '明确三张图是同一辆花车在三个时刻的记录，实际记录了几辆花车？',
      rule: { kind: 'number', value: 1 },
      hint: '图片数量与物体数量分清。',
      explanation: '同一辆花车被记录三次，仍是一辆，不是三辆。',
    },
    choice(
      'real-task',
      '只答对网页排序，尚未实际摆车或观察教材原图，可以确认实际任务吗？',
      yesNo,
      'no',
      '原图观察和实际摆车单独人工记录，尚未做如实跳过，未来计划不当完成。',
    ),
  ];
}
export const sujiaoFinalParadeDraft: Lesson = {
  id,
  title: '期末看花车：同一物体的先后',
  textbookTitle: '期末复习：花车经过的时序',
  page: 93,
  status: 'preparing',
  version: 1,
  goal: '结合固定观众与持续方向，排列同一花车的三个时刻，区分位置、远近、图片编号和实际时间。',
  prerequisite:
    '能辨认左右和箭头；准备一张花车纸卡、观众P纸卡和纸路，不需要观看真实道路游行。',
  parentTip:
    '依据已读取93页第15题，教材透视照片另观察。本站使用原创装饰花车侧面示意，不复制原画；实际模拟在桌面，不站到真实道路或要求拍摄他人。坐标不冒称实际距离时间，未知速度、拍摄间隔和位置不补造。',
  steps: [
    {
      title: '先核对同一物体和固定观察者',
      text: 'A、B、C是图名，不是时间。三图记录同一花车，P观众一直站在路旁，观察方向不变，花车持续向右，不掉头。花车位置不同不是三辆不同的车。',
      visual: { kind: 'parade-frames', variant: 'main' },
      activity:
        '实际在纸路旁放P卡，同一花车卡沿纸路向右走；P不进入车道、不移动。',
    },
    {
      title: '尚未到、正在经过、已经过',
      text: '主图B在P左侧尚未到，A到P面前，C到P右侧已经过。持续向右，所以B、A、C。两侧都可能离P远，不能仅凭远近判断。',
      visual: { kind: 'parade-frames', variant: 'main' },
      activity:
        '实际记录同一纸花车在这三个时刻的位置，给纸卡取名字、打乱后重排，说清所用条件。',
    },
    {
      title: '反方向必须重新看图',
      text: '另一次花车改成持续向左，观众仍固定。网页复习还会重排图名，先看方向和位置，不能背主课编号或认为左边的车永远最早。',
      visual: { kind: 'parade-frames', variant: 'review' },
      activity:
        '实际改成向左，另画三个时刻的新卡，打乱重排并解释，不用旧卡编号冒称新记录。',
    },
    {
      title: '教材透视照片另观察',
      text: '教材第93页第15题是花车从观众面前经过的三张图片，与本站侧面模型不同。和家长实际看原图，结合相同花车装饰、固定观众及背景的位置变化，先说观察依据，再给三图按时序编号。原图画面大小可受透视影响，不把本站固定画图大小或编号照搬；不要求测量速度或照片间隔。',
      activity:
        '实际打开自己适用教材93页第15题，与家长按图观察、排序并说理由。若暂时没有教材，记待做，不以本站原创图自动确认原图观察。',
    },
    {
      title: '如实记录过程与疑问',
      text: '桌面模拟与教材原图观察分开记录。若观众移动、车掉头或条件不明，需要重新核对；没有距离和时间不能计算实际速度。反思没有唯一答案，计划之后操作不等于已实际做。',
      activity: '说明本次真实记录的一组顺序和方向，再记下仍想核对的条件。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际摆同一花车卡与路旁固定P，向右记录三个时刻，打乱重排并口述尚未到、面前、已过。',
      '实际改成向左行驶，重新记录并重排三个时刻，说明为什么不能只背主课编号。',
      '实际观察适用教材93页第15题原图，与家长给三图按时间编号并解释相同花车、背景和观众的位置依据；无教材暂时待做。',
      '实际自己另取三个时刻的纸面记录，给图取新名字并向家长或同伴说明顺序、方向与固定参照，不上传作品或他人身份。',
    ].map((prompt, i): Question => ({
      id: `${id}-manual-${i}`,
      knowledge: `${id}-manual-${i}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '实际完成后由家长查看确认，未做可暂时跳过。',
      explanation: '网页成绩不自动确认实际操作或原图观察。',
    })),
    ...[
      '记录自己实际模拟的一组三卡顺序、方向和固定观众；没有实际做也如实说明。',
      '你在哪一步容易把远近或编号当时间？记录自己的真实理解和疑问。',
      '原图观察与模拟哪些已做，哪些是下一步计划？分开记录。',
    ].map((prompt, i): Question => ({
      id: `${id}-reflection-${i}`,
      knowledge: `${id}-reflection-${i}`,
      prompt,
      rule: { kind: 'reflection' },
      hint: '真实记录，没有唯一答案。',
      explanation: '反思correct为null，未来计划不确认为已完成。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '93页第15题范围与原创时序核对',
    notes: `实际查看ISBN ${source.isbn}印刷93页花车时序活动；本站原创侧面模型与教材原图观察分开，不代表全年或最终教师审校完成。`,
  },
};
