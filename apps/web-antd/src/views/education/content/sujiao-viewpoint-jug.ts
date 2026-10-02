import type { Lesson, Question, Visual } from '../learning/types';

import { required } from '../learning/required';
import { jugScene } from '../learning/viewpoint-jug';
import { sujiaoLowerSource as source } from './sujiao-lower-source';

const id = 'sj-lower-viewpoint-jug';
function tasks(review: boolean): Question[] {
  const variant = review ? 'review' : 'main';
  const visual: Visual = { kind: 'viewpoint-jug', variant };
  const scene = jugScene(variant);
  const base = (key: string, prompt: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
    visual,
    hint: '先找位置与朝向，再看壶嘴和壶把是否被壶身挡住。画面左右按观察者判断，不按位置图左右或旧候选编号。',
  });
  const choice = (
    key: string,
    prompt: string,
    choices: { id: string; label: string }[],
    value: string,
    explanation: string,
  ): Question => ({
    ...base(key, prompt),
    choices,
    rule: { kind: 'choice', value },
    explanation,
  });
  const letters = ['A', 'B', 'C', 'D'];
  const positions = letters.map((letter) => ({
    id: letter,
    label: `${letter}位置`,
  }));
  return [
    ...letters.map((letter, i): Question => {
      const answer = String(
        scene.candidates.indexOf(required(scene.views[i])) + 1,
      );
      return choice(
        `observer-${letter}`,
        `${review ? '茶壶已转四分之一圈，候选也重排。' : '茶壶位置按图固定。'}${letter}朝中心平视，看到哪幅候选图？`,
        [1, 2, 3, 4].map((n) => ({ id: String(n), label: `候选图${n}` })),
        answer,
        `按本次位置判断可见部件及左右，对应候选${answer}。旋转后要重新观察。`,
      );
    }),
    choice(
      'spout-observer',
      '哪个位置正对壶嘴，壶把在壶身后被挡住？',
      positions,
      review ? 'A' : 'D',
      '正对壶嘴看，背后的壶把被不透明壶身挡住，不表示没有壶把。',
    ),
    choice(
      'handle-observer',
      '哪个位置正对壶把，壶嘴在壶身后被挡住？',
      positions,
      review ? 'C' : 'B',
      '与壶嘴侧相对的位置正对壶把。远侧壶嘴被挡住。',
    ),
    choice(
      'side-order',
      `${review ? 'B和D' : 'A和C'}都看到壶嘴与壶把，画面左右一定相同吗？`,
      [
        { id: 'no', label: '不同，两侧观察的画面左右相反' },
        { id: 'yes', label: '相同，只要部件一样左右就一样' },
      ],
      'no',
      '从相对两侧看，同样的两个部件在画面上的左右会交换。',
    ),
    choice(
      'picture-side',
      `在${review ? 'D' : 'A'}的位置，壶嘴在候选画面的哪边？`,
      [
        { id: 'left', label: '画面左边' },
        { id: 'right', label: '画面右边' },
      ],
      review ? 'left' : 'right',
      '画面左右是面对茶壶的观察者的左右，不能直接照搬俯视图的左右。',
    ),
    {
      ...base(
        'one-object',
        '四幅候选描述同一把茶壶的不同视图。实际是几把茶壶？',
      ),
      rule: { kind: 'number', value: 1 },
      explanation: '四个视图来自一把茶壶，视图数不是物体数。',
    },
    choice(
      'hidden-part',
      `在${review ? 'C' : 'B'}的位置看不见壶嘴，能说明这把壶没有壶嘴吗？`,
      [
        { id: 'no', label: '不能，壶嘴被壶身挡住了' },
        { id: 'yes', label: '能，没看见就是没有' },
      ],
      'no',
      '看不见与不存在不同，换位置或核对已知条件。',
    ),
    choice(
      'plan-not-photo',
      '中间位置图从上方表示壶嘴、壶把和观察位置，它就是A平视拍到的照片吗？',
      [
        { id: 'no', label: '不是，俯视位置示意与平视照片不同' },
        { id: 'yes', label: '是，任何方向看到的图都一样' },
      ],
      'no',
      '位置图用来找站位与朝向，候选是本课条件下的平视简图。',
    ),
    choice(
      'condition-limit',
      '换成透明壶，或站高处斜看，能直接套用本课所有遮挡结论吗？',
      [
        { id: 'no', label: '不能，条件变了要重新观察' },
        { id: 'yes', label: '能，所有壶与角度都一样' },
      ],
      'no',
      '本课限定不透明壶、相对的嘴把与固定平视高度；其他物体和角度另观察。',
    ),
  ];
}
export const sujiaoViewpointJugDraft: Lesson = {
  id,
  title: '观察茶壶：遮挡与画面左右',
  textbookTitle: '观察物体·茶壶视图匹配',
  page: 79,
  version: 1,
  status: 'preparing',
  goal: '按位置辨认壶嘴、壶把的遮挡与画面左右，匹配四视图，旋转后重新判断。',
  prerequisite: '能辨认自己的左右；可准备安全的空塑料壶、玩具壶或原创纸模型。',
  parentTip: `依据ISBN ${source.isbn}印刷79页茶壶位置与视图匹配，本站使用原创不透明简化模型，不复制原图或人物。壶嘴壶把相对，轴向远侧部件被挡，侧向两部件都可见但左右不同；固定平视高度。复习旋转物体并重排候选，不以编号记忆。本课不是全部观察单元，未知版权版次印次仍未核验。`,
  steps: [
    {
      title: '先找站位与朝向',
      text: 'A上方、B右方、C下方、D左方，箭头都向中心。中间是俯视位置图，四幅候选是平视简图，不能把两种视角混作同一照片。',
      visual: { kind: 'viewpoint-jug', variant: 'main' },
      activity: '实际摆安全模型，固定四个观察位置。',
    },
    {
      title: '远侧部件会被挡住',
      text: 'D正对壶嘴，远侧壶把被壶身挡住；B正对壶把，远侧壶嘴被挡住。这里不透明且观察高度固定，没看到并不等于没有。',
      visual: { kind: 'viewpoint-jug', variant: 'main' },
      activity: '实际从两个相对位置观察，说明看见和被挡住的部件。',
    },
    {
      title: '都看见，左右仍不同',
      text: 'A与C都看到嘴把。A面对茶壶时，画面嘴右把左；C面对茶壶时，画面嘴左把右。先站在观察者的位置想自己的左右，再匹配候选。',
      visual: { kind: 'viewpoint-jug', variant: 'main' },
      activity: '实际从另外两侧观察，分别画嘴把位置，不只写“都有”。',
    },
    {
      title: '转壶后重新观察',
      text: '复习把壶顺时针转四分之一圈，嘴在上方，把在下方。观察者不动，候选也重排，必须重新判断部件与画面左右，不沿用旧编号。',
      visual: { kind: 'viewpoint-jug', variant: 'review' },
      activity: '实际转模型并逐位置再看；屏幕简图不代替实际操作。',
    },
    {
      title: '保留真实发现',
      text: '实际壶的形状、透明度、观察高度不同，遮挡可能不同。本课简图只说明给定条件。使用安全空模型，不需要热水、玻璃壶或购买物品；没操作可以暂跳，未来计划另记。',
      activity: '口述或画图记录两个位置的真实发现，允许与简化模型不同。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际摆安全空模型，标明四个固定观察位置和嘴把朝向。',
      '实际从嘴侧与把侧平视，口述可见和被挡住的部件。',
      '实际从另两侧观察并分别画简图，说出各自画面左右。',
      '实际旋转模型但不移动观察位置，再次观察记录；未操作可暂跳。',
    ].map((prompt, i): Question => ({
      id: `${id}-manual-${i}`,
      knowledge: `${id}-manual-${i}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '实际完成后独立确认，不用匹配答题代替。',
      explanation: '实际操作人工确认，未做不计完成。',
    })),
    {
      id: `${id}-own-observation`,
      knowledge: `${id}-own-observation`,
      prompt:
        '记录实际使用的模型与两个位置所见，未观察可如实记录，不编造发现。',
      rule: { kind: 'reflection' },
      hint: '按真实发现记录。',
      explanation: '开放记录不按标准作品评分。',
    },
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '你怎样区分位置图左右与观察者画面左右？记录发现或下次计划，计划不是已完成操作。',
      rule: { kind: 'reflection' },
      hint: '保留自己的说明与待核对处。',
      explanation: '反思不自动确认实际任务。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读茶壶原页与原创视图条件核验',
    notes: `ISBN ${source.isbn}印刷79页范围；原创遮挡模型和旋转复习，未知版印次不补造，不代表完整单元。`,
  },
};
