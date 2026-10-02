import type { SolidPatternVisual } from '../learning/solid-pattern';
import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
import { solidPatternAt, solidPatternGroup } from '../learning/solid-pattern';
import { sujiaoUpperSource as source } from './sujiao-upper-source';

const id = 'sj-upper-solid-patterns';
const model = (
  pattern: SolidPatternVisual['pattern'],
  review: boolean,
): SolidPatternVisual => ({
  kind: 'solid-pattern',
  pattern,
  variant: review ? 'review' : 'main',
});
const names = {
  cuboid: '长方体',
  cube: '正方体',
  cylinder: '圆柱',
  sphere: '球',
};
const patternNames = {
  alternating: '两件交替',
  'three-shapes': '三形状重复',
  'ball-sizes': '大小球重复',
};
function itemName(
  item: { shape: keyof typeof names; size: 'large' | 'small' },
  sizes: boolean,
): string {
  if (sizes) return item.size === 'large' ? '大球' : '小球';
  return names[item.shape];
}
function tasks(review: boolean): Question[] {
  return [
    ...(['alternating', 'three-shapes', 'ball-sizes'] as const).flatMap(
      (pattern) =>
        [7, 8, 9].map((position): Question => {
          const visual = model(pattern, review);
          const item = solidPatternAt(visual, position);
          const sizes = pattern === 'ball-sizes';
          return {
            id: `${id}-${review ? 'r' : 'q'}-${pattern}-${position}`,
            knowledge: `${id}-${pattern}-${position}`,
            prompt: `看${review ? '新' : '主课'}${patternNames[pattern]}这一排，第${position}个位置接着摆什么？序号从最左1开始，不能把后三位置都当新组第一件。`,
            visual,
            choices: sizes
              ? [
                  { id: 'large', label: '大球' },
                  { id: 'small', label: '小球' },
                ]
              : Object.entries(names).map(([shape, name]) => ({
                  id: shape,
                  label: name,
                })),
            rule: { kind: 'choice', value: sizes ? item.size : item.shape },
            hint: '先找最小的完整重复小组，再按位置找组内第几件，大小球都还是球。',
            explanation: `第${position}件是${itemName(item, sizes)}。重复组是${solidPatternGroup(
              visual,
            )
              .map((p) => itemName(p, sizes))
              .join('、')}；位置和组内位置分清。`,
          };
        }),
    ),
    {
      id: `${id}-${review ? 'r' : 'q'}-group-lengths`,
      knowledge: `${id}-group-lengths`,
      prompt:
        '按本课两件交替、三形状重复、大小球这三排的顺序，填各排最小完整重复小组有几件。不是填整排物体总数。',
      rule: { kind: 'steps', values: [2, 3, 3] },
      hint: '长方体和正方体交替按两件重复；三个形状和一球配另两同大小球各按三件。',
      explanation:
        '三种最小重复小组分别2、3、3件；不能把每排都设为三件或仅看最后一件。',
    },
  ];
}
export const sujiaoUpperSolidPatternsLesson: Lesson = {
  id,
  title: '三种续摆：两件交替、三形状与大小球',
  textbookTitle: '图形的初步认识（一）·规律续摆',
  page: 61,
  version: 1,
  status: 'available',
  goal: '分别判断三种最小重复小组，填第7/8/9位置，并实际续摆；大小球同形状，换开头与形状需重新判断。',
  prerequisite:
    '认识四种立体形状与0～9，准备长方体、正方体、圆柱、球安全模型及大小球。没有实物时实际任务待做，纸上圆可作符号记录但不冒实物球。',
  parentTip: `ISBN ${source.isbn}同版印刷61页，三类规律已实际读到。本站顺序与问答原创，两个交替、三个不同形状、一个大球两个小球分别实物续摆；复习开头/三形状组合/大小顺序更换。只比较同排大小，不教比率或球径测量；同形状大小变不等于形状变。九位置一排可内部横滚，空位置与无障碍标签都不泄露答案；实际/帮助/未来计划分开。`,
  steps: [
    {
      title: '两件交替，不是每组三件',
      text: '长方体、正方体交替，前六件是长、正、长、正、长、正。最小重复小组两件；第7长、第8正、第9又是下一组开头长。后三个待摆位置不自动变成一组。先指每个完整模型，不用露出面替模型。',
      visual: model('alternating', false),
      activity:
        '实际先摆六件，接着摆第7/8/9并分出最小两件组，再换正方体开头重新摆，保留真实顺序记录。',
    },
    {
      title: '三形状重复，按组内位置继续',
      text: '圆柱、正方体、球三件一组，前六件是两组。第7圆柱、第8正方体、第9球，刚好又一组；不能只知道第7就把三处都填圆柱。换成长方体、圆柱、正方体时重新按新组，不固记三形状必须原顺序。',
      visual: model('three-shapes', false),
      activity:
        '实际摆两组三形状，再接完整第三组，边摆边说第7/8/9及组内1/2/3；再换三形状顺序摆并核对。',
    },
    {
      title: '大球小球，形状相同而大小不同',
      text: '大球、小球、小球三件一组，前六件两组，第7大球、第8小球、第9小球。它们都叫球，不能用圆柱或圆片代替小球后说仍是同一大小球规律。两个小球仍各占一个位置，不合成一件。',
      visual: model('ball-sizes', false),
      activity:
        '实际准备大小球摆大/小/小两组，再接第7/8/9，比较同排大小；只有纸面记录需注明，真实球活动仍待做。',
    },
    {
      title: '换小大大，新开头要重新判断',
      text: '另一排小球、大球、大球重复。第7小、第8大、第9大，不能沿用上一排第7大。只换同排大小顺序，球形状没有换；记录自己的大小条件与摆法，不从颜色或屏幕绘制尺寸推真实直径。',
      visual: model('ball-sizes', true),
      activity:
        '实际改成小/大/大两组，再接第三组，分别说新第7/8/9，保留旧排与新排记录，不把未来打算当已做。',
    },
    {
      title: '三种规律分开说依据',
      text: '两件交替的小组2件，三形状和大小球的小组3件。先找完整小组再看具体位置，不只看最后一个物体。今天真实摆了哪一排、遇到什么帮助或困难如实写；尚未做可以待做，网页正确不替代实际续摆。',
      activity:
        '向家人分别指三排解释最小重复组与第7/8/9，记录真实比较、帮助和未完成部分；下次计划另写。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      [
        'actual-alternating',
        '实际用长方体/正方体摆六件交替，续摆第7/8/9并分清两件组；换正方体开头再摆并接三位置。记录真实模型、顺序与帮助，未实际摆不能凭网页答案确认。',
      ],
      [
        'actual-three-shapes',
        '实际摆圆柱/正方体/球两组，再接完整第7/8/9；另用长方体/圆柱/正方体重新摆并续组，分别说整排位置与组内位置，不沿用旧顺序。',
      ],
      [
        'actual-ball-sizes',
        '实际用大/小球摆大/小/小两组并续第三组，再换小/大/大两组续摆。球都是球，两小球各占一位置；纸画圆只作记录不冒实物操作，无大小球暂跳。',
      ],
      [
        'actual-explanation',
        '实际向家人指三排说各自最小小组长度、每个待摆位置的依据及真实帮助/困难；不把三处都当一组首项，也不编造未发生的交流。未来计划另记。',
      ],
    ].map(([key, prompt]): Question => ({
      id: `${id}-${required(key)}`,
      knowledge: `${id}-${required(key)}`,
      prompt: required(prompt),
      rule: { kind: 'manual' },
      hint: '真实续摆并核对才确认，无材料暂跳；计划不当完成。',
      explanation: '人工只记录实际活动，不自动判为掌握。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '写今天真实续摆的一排、怎样找到小组和待摆位置、遇到的帮助/困难。未做如实写，未来准备另记。',
      rule: { kind: 'reflection' },
      hint: '写真实例子，不要求全部都已掌握。',
      explanation: '反思正确性null，不自动打星。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-02',
    reviewer: '三类立体规律分别核对',
    notes:
      '2024年7月第1版、2025年7月第2次印刷同版61页已读。复习交替开头、三形状和大小球序列改变；同一球模型同比例缩小，不用平面圆或别的形状替代。真实续摆独立，最终教师审校未核验。',
  },
};
