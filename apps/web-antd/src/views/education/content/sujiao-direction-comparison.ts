import type { Lesson, Question, QueueVisual } from '../learning/types';

import { queueNeighbours, queuePosition } from '../learning/queue';
import { required } from '../learning/required';
import { sujiaoUpperSource as source } from './sujiao-upper-source';

const id = 'sj-upper-direction-comparison';

function tasks(review: boolean): Question[] {
  const labels = ['小禾', '小安', '小林', '小宁', '小乐'];
  const uphill: QueueVisual = {
    kind: 'queue',
    labels,
    front: review ? 'left' : 'right',
  };
  const downhill: QueueVisual = { ...uphill, front: review ? 'right' : 'left' };
  const target = review ? '小宁' : '小林';
  const before = required(queuePosition(uphill, target));
  const changed: QueueVisual = {
    ...uphill,
    labels: labels.filter((label) => queuePosition(uphill, label) !== 1),
  };
  const newRank = required(queuePosition(changed, target));
  const floors = ['小禾', '小宁', '小乐', '小安', '小林'];
  const floor = review ? 4 : 2;
  const smaller = review ? 4 : 5;
  const greater = review ? 2 : 3;
  const open = review ? 3 : 4;
  const base = (key: string, prompt: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
  });
  const cards = [0, 1, 2, 3, 4, 5].map((n) => ({
    id: String(n),
    label: String(n),
  }));
  return [
    {
      ...base(
        'floor-rank',
        `这座模型楼共5层，无地下层。底层算第1层，从下向上，住户依次${floors.join('、')}。${required(floors[floor - 1])}住第几层？`,
      ),
      rule: { kind: 'number', value: floor },
      hint: '楼层约定从最下方1开始，不是从屋顶开始。名字只标身份，不标层数。',
      explanation: `从底层向上逐层数，该住户在第${floor}层。`,
    },
    {
      ...base(
        'floor-neighbours',
        `${required(floors[floor - 1])}住5层模型楼第${floor}层。先填下方有几层，再填上方有几层，不包括自己这层。`,
      ),
      rule: { kind: 'steps', values: [floor - 1, 5 - floor] },
      hint: '层数是位置，下面与上面各数一边，不包含自己的层。',
      explanation: `下方${floor - 1}层，上方${5 - floor}层。`,
    },
    {
      ...base(
        'moving-front',
        `这行卡片模拟同一坡上的队伍投影，大家正向${review ? '左边的坡顶' : '右边的坡顶'}上坡，箭头端为队首。小安前面有几人，不包括自己？`,
      ),
      visual: uphill,
      rule: {
        kind: 'number',
        value: required(queueNeighbours(uphill, '小安')).before,
      },
      hint: '先按运动方向找队首，再数目标前面；不能始终从左边数。',
      explanation: `当前队首在${review ? '左' : '右'}，小安排第${queuePosition(uphill, '小安')}，前面有${required(queueNeighbours(uphill, '小安')).before}人。`,
    },
    {
      ...base(
        'reverse-motion',
        `卡片位置没变。现在大家向${review ? '右边' : '左边'}的坡脚下坡，箭头标出新的队首。小安现在排第几？`,
      ),
      visual: downhill,
      rule: {
        kind: 'number',
        value: required(queuePosition(downhill, '小安')),
      },
      hint: '上坡与下坡的运动方向相反，按当前图的队首重新数；人数不变。',
      explanation: `下坡队首在另一端，小安现在排第${queuePosition(downhill, '小安')}。位置没换也可能排第几变化。`,
    },
    {
      ...base(
        'departing-front',
        `原队伍从${review ? '左' : '右'}为队首时，${target}排第${before}。第1人离开，其余顺序不变，这是新队伍。依次填原来排第几、现在排第几、现在前面有几人。`,
      ),
      visual: changed,
      rule: { kind: 'steps', values: [before, newRank, newRank - 1] },
      hint: '原位置与新位置分开记录，新前人数不包含目标自己。',
      explanation: `原第${before}，现第${newRank}，现前方${newRank - 1}人；队首离开后总人数也减少1。`,
    },
    {
      ...base(
        'all-smaller-with-zero',
        `只在0～5六张数字卡中，选出所有小于${smaller}的数，包括符合条件的0，不能选相等的。`,
      ),
      choices: cards,
      rule: {
        kind: 'set',
        values: cards.filter((c) => Number(c.id) < smaller).map((c) => c.id),
      },
      hint: '逐张核对，0也是数；所有符合条件的都要选。',
      explanation: `符合的是${cards
        .filter((c) => Number(c.id) < smaller)
        .map((c) => c.id)
        .join('、')}。`,
    },
    {
      ...base(
        'all-greater-bounded',
        `只在0～5六张卡中，选出所有大于${greater}的数。`,
      ),
      choices: cards,
      rule: {
        kind: 'set',
        values: cards.filter((c) => Number(c.id) > greater).map((c) => c.id),
      },
      hint: '相等不选，别写超出这组六张卡的数字。',
      explanation: `符合的是${cards
        .filter((c) => Number(c.id) > greater)
        .map((c) => c.id)
        .join('、')}。`,
    },
    {
      ...base(
        'multiple-open-comparison',
        `方框只能填0～5的数。${open}＞□有哪些合法填法？选全，不要求只选一个。`,
      ),
      choices: cards,
      rule: {
        kind: 'set',
        values: cards.filter((c) => Number(c.id) < open).map((c) => c.id),
      },
      hint: '逐个代入检查，4＞4或3＞3不是成立的大于关系。',
      explanation: `所有合法填法是${cards
        .filter((c) => Number(c.id) < open)
        .map((c) => c.id)
        .join('、')}；有多个解，0不能漏。`,
    },
  ];
}

export const sujiaoDirectionComparisonLesson: Lesson = {
  id,
  title: '位置与比较：楼层、运动方向和多种填法',
  textbookTitle: '几和第几·练习一',
  page: 17,
  version: 1,
  status: 'available',
  goal: '按底层向上数楼层；明确上坡、下坡和游动的队首，观察前人离开；包括0的完整范围比较，实际写出开放比较的多种合法答案。',
  prerequisite:
    '能数0～5；准备5张人物卡、0～5数字卡、纸笔，一位家人可共同选卡。',
  parentTip: `对应ISBN ${source.isbn}第16～17、23～24页已读范围。模型无地下层，底层第1层；卡片投影不表示真实坡度、距离或速度。真实动作采用桌面卡片，无需去楼梯、坡道或泳池。未实际做或交流可暂跳，网页答对不自动确认操作。未来计划另记。`,
  steps: [
    {
      title: '楼层从下往上',
      text: '画5层模型楼，底层写1，上方依次2、3、4、5。给每层放一张人物卡；从底层数某人住第几，数下面几层和上面几层，都不包括自己这层。不要从屋顶开始报楼层。',
      activity: '实际画楼、放卡，自选两名住户说楼层及上下层数，家人核对。',
    },
    {
      title: '先看当前运动方向',
      text: '同一坡上队伍向坡顶走，上坡方向那一端为前；转向坡脚走，前端变到另一边。用5张卡模拟，不用到真实坡道。泳道或车队也先明确向哪端运动，再判断谁在前；图画左右位置不是固定名次。',
      activity:
        '实际摆卡、画方向箭头，分别模拟上坡和下坡，再换为游向池边或车向终点，说指定卡的位置与前人数。',
    },
    {
      title: '第1人离开后重新数',
      text: '只取走当前队首卡，其余顺序不变。指定留在队伍中的同一人，记录原来与现在排第几，分别数前面人数。排第几包含他，前面人数不包含他；恢复后换方向再做一次。',
      activity:
        '实际两次摆卡取走队首，每次先恢复5人，记录总人数、新位置和前人数。',
    },
    {
      title: '和家人分清几张与第几张',
      text: '给5张不同卡排一行，双方约定数的起点。家人说取3张，取的是数量3；说取第3张，只取指定位置的1张。先放回，再换起点和指定位置，互换角色，说出拿了多少张。',
      activity:
        '实际与同伴选卡至少四轮，覆盖取几张、取第几张及左右起点；没有同伴这项待做，不冒称已一起玩。',
    },
    {
      title: '开放比较可以有多种答案',
      text: '数字范围约定0～5。4＞□可以填0、1、2、3，2＜□可以填3、4、5，5＝□只有5，1＜□可以填2、3、4、5。每个数字代回检查，严格大于小于不含相等；有多解的题不强制唯一答案。',
      activity:
        '实际取齐0～5数字卡，选全小于5和大于3的数；在纸上分别写四个开放式的全部合法填法，向家人逐一解释。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      [
        'actual-floors',
        '实际画5层模型楼，底层1至顶层5，各层放不同人物卡。自主选两名住户，从下往上数楼层及上下各几层，不包括自己层，保留图和口述记录。',
      ],
      [
        'actual-directions',
        '实际排5张人物卡，画上坡方向箭头后判断一名中间人物排第几、前面几人；位置不变改下坡箭头重数。再模拟同一泳道向一端游及反向游，或同路车队往返，按当前方向找前端。另取走队首、重数原来与现在位置及前人数；恢复5张后换方向再取一次。保留两次记录，不用真实登坡或游泳确认。',
      ],
      [
        'actual-partner-game',
        '实际和一名家人玩至少四轮选卡：取3张与取第3张先后各一次，再换起点指定另一数量与位置各一次，均先放回原队列。互换提要求与选卡角色，分别说拿到几张。没有同伴或未做待做，不能用计划或屏幕选项确认已一起玩。',
      ],
      [
        'actual-open-comparison',
        '实际拿0～5六张卡，选全小于5及大于3的数，含符合条件的0。在纸上给4＞□、2＜□、5＝□、1＜□逐一写全0～5范围内的合法填法，代回原式口述核对；有多解的至少保留两个不同答案，等号不虚构多个不同答案。',
      ],
    ].map(([key, prompt]): Question => ({
      id: `${id}-${required(key)}`,
      knowledge: `${id}-${required(key)}`,
      prompt: required(prompt),
      rule: { kind: 'manual' },
      hint: '实际做了才确认，未做暂跳；动作与表达人工查看，计划另记。',
      explanation: '真实桌面操作、纸笔和同伴活动不由网页分数自动完成。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-02',
    reviewer: '已读方向与开放比较范围核验',
    notes: `ISBN ${source.isbn}第16～17、23～24页，原创楼层、方向、人物与数值条件，复习改变方向、目标人物、楼层和严格比较范围；不声称整单元或最终教师审校完成。`,
  },
};
