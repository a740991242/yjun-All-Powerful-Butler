import type { Lesson, Question, Visual } from '../learning/types';

import { required } from '../learning/required';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-motion-sequences';
const scenes = ['slide', 'meet', 'turn'] as const;
function tasks(review: boolean): Question[] {
  const common = (key: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
  });
  const visual = (scene: (typeof scenes)[number]): Visual => ({
    kind: 'motion-sequences',
    scene,
    variant: review ? 'review' : 'main',
  });
  const orders = review ? ['BCA', 'CAB', 'BCA'] : ['CAB', 'BCA', 'BAC'];
  const name = ['下滑', '两车相遇并继续行驶', '模型只转半圈'];
  const choices = ['ABC', 'ACB', 'BAC', 'BCA', 'CAB', 'CBA'].map((value) => ({
    id: value,
    label: [...value].join(' → '),
  }));
  const letters = ['A', 'B', 'C'].map((letter) => ({
    id: letter,
    label: `图片${letter}`,
  }));
  return [
    ...scenes.flatMap((scene, i): Question[] => [
      {
        ...common(`order-${scene}`),
        prompt: `${review ? '复习换了方向或候选顺序。' : ''}按图给定的${name[i]}过程，三幅图片从最早到最晚怎样排列？字母不是时间。`,
        visual: visual(scene),
        choices,
        rule: { kind: 'choice', value: required(orders[i]) },
        hint: '先确认运动方向和过程条件，再找每幅图的位置或机头朝向。不要按网页排列背字母。',
        explanation: `这次顺序${[...required(orders[i])].join(' → ')}。下滑从坡顶向坡底，相遇要区分未到/并排/已过，转动按限定半圈的起点与方向判断。`,
      },
      {
        ...common(`first-${scene}`),
        prompt: `本次${name[i]}过程中，最早是哪幅？先读当前条件。`,
        visual: visual(scene),
        choices: letters,
        rule: { kind: 'choice', value: required(required(orders[i])[0]) },
        hint: '下滑先在顶部；相遇先还没经过对方；转动看题目明确的起始机头朝向。',
        explanation: `本次最早是图片${required(orders[i])[0]}，图中字母不是默认发生顺序。`,
      },
      {
        ...common(`last-${scene}`),
        prompt: `本次${name[i]}过程中，最后是哪幅？不能把最远或最下面固定当所有情境的最后。`,
        visual: visual(scene),
        choices: letters,
        rule: { kind: 'choice', value: required(required(orders[i])[2]) },
        hint: '根据这一过程的方向、末端条件判断；相遇后的左右关系和转动的机头朝向分别观察。',
        explanation: `本次最后是图片${required(orders[i])[2]}，不同运动不能只套用同一种远近规则。`,
      },
    ]),
    {
      ...common('one-person'),
      prompt:
        '三幅下滑位置图都注明来自同一人，这个过程实际有几个人？不把照片数当人数。',
      visual: visual('slide'),
      rule: { kind: 'number', value: 1 },
      hint: '先看“同一人”的条件。',
      explanation: '一人在三个时刻的位置，实际1个人，不是3个人。',
    },
    {
      ...common('two-cars'),
      prompt:
        '三幅相遇图都是同样车1与车2的三个时刻。实际共有几辆车？不把不同图重复相加。',
      visual: visual('meet'),
      rule: { kind: 'number', value: 2 },
      hint: '每幅都是同一对车。',
      explanation: '实际只有车1与车2，共2辆；不是六辆。',
    },
    {
      ...common('distance'),
      prompt:
        '两车在相遇前和相遇后都可能相距较远。只凭“离得远”，能确定图片一定发生在相遇前吗？',
      visual: visual('meet'),
      choices: [
        { id: 'no', label: '不能，还要看方向和两车所在的左右关系' },
        { id: 'yes', label: '能，距离远就一定在相遇前' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '比较车1、车2在并排相遇之前和之后是否已交换左右位置。',
      explanation:
        '相遇前接近、相遇后离开，都可能离得远；需结合行驶方向与位置关系。',
    },
    {
      ...common('camera'),
      prompt:
        '这组模型图明确是物体在原处转动、观察位置固定。能说一定是拍摄者绕着不动的模型换位置了吗？',
      visual: visual('turn'),
      choices: [
        { id: 'no', label: '不能，本图给定的是模型转动' },
        { id: 'yes', label: '能，样子改变一定是拍摄者移动' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '区分物体转动与观察者移动，不只看最后样子。',
      explanation: '本图观察位置不动、模型转动；观察者绕物体是另一种条件。',
    },
    {
      ...common('cycles'),
      prompt:
        '另一次没有给起始朝向和转动方向，还可能多转整圈，仅三张未编号照片能直接照搬本课唯一顺序吗？',
      choices: [
        { id: 'ask', label: '不能，先补充起点、方向和转动范围' },
        { id: 'same', label: '能，飞机图永远按这一顺序' },
      ],
      rule: { kind: 'choice', value: 'ask' },
      hint: '本课限制只转半圈，不能把条件删除后仍沿用答案。',
      explanation: '多转、反向或未知起点都可能改变过程；未知不是本课默认半圈。',
    },
    {
      ...common('return'),
      prompt: review
        ? '另一次可能从底部爬回坡顶，未说明过程，可以只按高度就判时间吗？'
        : '另一次人可能爬回或折返，没说明运动过程，可以照搬顶部到下面的顺序吗？',
      choices: [
        { id: 'ask', label: '不能，先核对实际方向与是否折返' },
        { id: 'same', label: '能，顶部永远最早' },
      ],
      rule: { kind: 'choice', value: 'ask' },
      hint: '持续下滑是本题已知条件，不是所有照片的默认条件。',
      explanation: '若返回或折返，位置高低不能单独决定早晚；先补条件。',
    },
  ];
}
export const sujiaoMotionSequencesDraft: Lesson = {
  id,
  title: '运动过程：下滑、相遇与转动',
  textbookTitle: '观察物体·三种运动过程排序',
  page: 82,
  status: 'preparing',
  version: 1,
  goal: '按明确的持续方向与起止条件排列下滑、两车相遇后行驶和模型转动的过程，区分编号、距离、物体数量和观察位置。',
  prerequisite:
    '已做接近、离开、经过排序，能看箭头；准备桌面玩具、纸斜坡、纸卡和安全飞机模型或纸箭头。',
  parentTip: `依据ISBN ${source.isbn}实际读82页下滑、两车相遇后行驶及转盘飞机排序；本站图形、帧位置与方向原创。飞机是同一低多边形三维几何绕竖直轴转动、固定观察投影，不用不同朝向的独立贴图冒充转动，也不是原书照片。儿童不需计算角度、坐标、距离或速度，图示不替代实物。只在桌面模拟，由家长陪同。`,
  steps: [
    {
      title: '先读持续运动与参照条件',
      text: 'A、B、C只给图片取名，不表示早晚。同一物体在三个时刻可能画出三次，不等于三个实物。先确认方向、是否折返、观察位置和起点；未知条件先问清楚。',
      visual: { kind: 'motion-sequences', variant: 'main', scene: 'slide' },
      activity:
        '实际准备纸斜坡和同一小纸人，把图片卡打乱，不在真实道路做活动。',
    },
    {
      title: '持续下滑：从顶部到末端',
      text: '主图同一人从左上持续滑到右下，没有爬回。C在顶部，A在中间，B到末端，所以C、A、B。图1标同一个人，不是时间编号；纸坡上的三个位置不当实际米数或速度。',
      visual: { kind: 'motion-sequences', variant: 'main', scene: 'slide' },
      activity: '实际用纸人或小块沿纸斜坡持续向下移三次，画三卡并重排。',
    },
    {
      title: '两车相遇：先接近，再并排，再分开',
      text: '车1一直向右，车2一直向左，各沿自己的平行车道，避免相撞。主图B尚未经过，C并排相遇，A已经过对方后继续行驶，所以B、C、A。相遇前后都可相距较远，不能只按距离排。',
      visual: { kind: 'motion-sequences', variant: 'main', scene: 'meet' },
      activity:
        '实际在纸上画两条平行车道，用两辆玩具或纸车持续反向移动，记录三时刻，不把两车合并成一车。',
    },
    {
      title: '模型转动：物体动，观察位置不动',
      text: '主图固定观察位置，机头先朝画面左，沿给定方向转过朝向观察者，最后朝画面右，只转半圈，没有额外整圈。B是朝左，A朝向观察者，C朝右，所以B、A、C。位置没移但朝向会变，转动与拍摄者绕物体不是同一条件。',
      visual: { kind: 'motion-sequences', variant: 'main', scene: 'turn' },
      activity:
        '实际固定观察位置，在桌面缓慢转安全模型或纸箭头，记录机头起点、经过和终点；纸箭头记录只反映朝向，不冒充立体照片。',
    },
    {
      title: '方向变了，不能背旧字母',
      text: '复习下滑改为右上到左下、两车方向交换、模型反向只转半圈，三张位置图也重排。仍先读新条件，再找每幅样子；同样是运动过程，不一定有相同编号答案。',
      visual: { kind: 'motion-sequences', variant: 'review', scene: 'turn' },
      activity: '实际选一种过程改变方向，拍或画新的三张卡再重排。',
    },
    {
      title: '缺条件时保留不确定',
      text: '如果人会爬回、车会掉头，或模型多转整圈，就不能只凭一张照片高度、距离或朝向断定先后。先补方向与范围，不假设未知条件。实际作品可采用自己的卡名，描述过程比背固定字母更重要。',
      activity:
        '实际与家长口述三种过程各需要确认什么条件，记录一个容易混淆之处。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际用同一小纸人沿纸斜坡持续下移，记录顶部、中途和末端三卡并打乱重排，说明人数不是照片数。',
      '实际在两条桌面平行纸车道，用同一对车模拟接近、并排相遇后继续行驶，画三卡重排，口述方向与左右关系。',
      '实际固定观察位置，缓慢转安全模型或纸箭头，只做限定半圈并记录三卡；再反向做一组，说明物体转动与观察者移动区别。',
    ].map((prompt, i): Question => ({
      id: `${id}-manual-${i}`,
      knowledge: `${id}-manual-${i}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '实际完成桌面操作/记录/口述后独立确认；没有材料可以暂时跳过。',
      explanation: '网页顺序答对不能代替实际任务。',
    })),
    ...[
      '记录你实际做的一组三卡顺序、方向与是否折返，可以用自己的卡名；未做可说明还待尝试。',
      '高度、距离与朝向中，你最容易混淆什么？写下判断前要核对的一项条件。',
    ].map((prompt, i): Question => ({
      id: `${id}-reflection-${i}`,
      knowledge: `${id}-reflection-${i}`,
      prompt,
      rule: { kind: 'reflection' },
      hint: '保留真实原话，没有唯一标准句。',
      explanation: '反思correct为null，不替代实际确认。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读82页三种过程与原创运动条件核验',
    notes: `ISBN ${source.isbn}印刷82页相关范围；复习改变真实运动方向、模型转动起点与帧排列。只补本课范围，不证明茶壶观察或完整单元/全册完成。`,
  },
};
