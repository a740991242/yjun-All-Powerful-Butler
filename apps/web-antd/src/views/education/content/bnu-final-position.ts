import type { BnuFinalPositionVisual } from '../learning/bnu-final-position';
import type { Lesson, Question } from '../learning/types';
const id = 'bnu-upper-final-position-time';
const visual = (
  scene: BnuFinalPositionVisual['scene'],
  variant: BnuFinalPositionVisual['variant'] = 'main',
): BnuFinalPositionVisual => ({ kind: 'bnu-final-position', scene, variant });
function q(
  suffix: string,
  prompt: string,
  rule: Question['rule'],
  explanation: string,
  diagram?: Question['visual'],
  material?: string,
): Question {
  return {
    id: `${id}-${suffix}`,
    knowledge: id,
    prompt,
    rule,
    explanation,
    hint: '先说参照物和观察方向；认钟分别看长短针，附页分类先恢复全部九张。',
    ...(diagram ? { visual: diagram } : {}),
    ...(material ? { material } : {}),
  };
}
function choice(
  suffix: string,
  prompt: string,
  value: string,
  labels: string[],
  explanation: string,
  diagram?: Question['visual'],
): Question {
  return {
    ...q(suffix, prompt, { kind: 'choice', value }, explanation, diagram),
    choices: labels.map((label) => ({ id: label, label })),
  };
}
function pick(
  suffix: string,
  prompt: string,
  values: string[],
  explanation: string,
  variant: BnuFinalPositionVisual['variant'] = 'main',
): Question {
  return {
    ...q(
      suffix,
      prompt,
      { kind: 'set', values },
      explanation,
      visual('annex', variant),
    ),
    choices: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'].map((label) => ({
      id: label,
      label,
    })),
  };
}
function actual(suffix: string, prompt: string): Question {
  return q(
    `actual-${suffix}`,
    `${prompt}；实际做过再确认，未做或没有原书/同伴/合适材料可待做。`,
    { kind: 'manual' },
    '屏幕答对不自动确认真实作图、连线、拨钟或交流。替代方式如实记，未来计划另列。',
  );
}
const directions = ['上面', '下面', '左边', '右边'];
const times = ['12时', '3时半', '8时半', '10时半'];
export const bnuFinalPositionTimeLesson: Lesson = {
  id,
  textbookTitle: '总复习 · 综合与实践',
  title: '位置作图、四钟连线与附页学具',
  page: 86,
  version: 1,
  status: 'available',
  goal: '完整说明固定参照的位置、完成四方向作图与全部位置填空、认读四钟，并联系附页九卡两轮分类。',
  prerequisite: '认识上下左右与前后、整时半时、简单平面图形与分类标准。',
  parentTip:
    '对应86页全部回顾/应用，87页附页九卡作为前面分类学具连接，不另编正式单元。本站原创等价图保留原参照与两排四列，手机图内横滚不改排列；空格字母不显示填法，原右星已示。钟面复用原0/30分契约，长短针与时段分清。实际介绍前后需要说明面对方向，二维上方不自动叫前面。记录自己的事情可待核对，不套同伴日程；珍惜时间也包含休息和游戏，不统一评忙碌程度。学具画卡/成人协助剪卡与原书剪裁分记，安全已有材料即可。',
  review: {
    date: '2026-10-04',
    reviewer: '原书86全项及87附页逐件对应',
    notes:
      '重新实际查看本地第三方0061阅读器90/91对应印刷86/87。原四钟12/3半/8半/10半，附页九卡颜色和形状各三件。ISBN版印次未知，原创图不打包原照片。',
  },
  steps: [
    {
      title: '先说明参照物和画面方向',
      text: '回顾用上下左右前后介绍位置。屏幕图按读者看到的画面固定上/下/左/右，先说相对于什么；花是这一题参照物。实际介绍前后时要说面对哪里，不能把图上方都叫物体前面。原右边星已给，A在上、B在左、C在下是待填位置；字母不是图形答案。',
      activity: '实际选一个参照物介绍上下左右与前后，说明面对方向。',
      visual: visual('flower-blank'),
    },
    {
      title: '原四方向全部作图',
      text: '以原花为参照，右边画星、上方画正方形、左边画三角形、下方画圆。右星是教材示范，纸上还要完整补其余三处。教学完成示意用于核对，不表示自己已经画过；网页按A/B/C顺序选择，纸面作图与屏幕选择分别记录。',
      activity: '实际对原花完成全部作图，逐一说明方向和形状。',
      visual: visual('flower-filled'),
    },
    {
      title: '两排四列，全部相对位置',
      text: '原上排从左到右太阳、气球、月亮、房屋；下排台灯、笔筒、风车、钟。以画面读者方向看：气球在太阳右，房屋在钟上，台灯在笔筒左，笔筒在气球下。参照物改变关系要重读；手机横滚只改变看到的部分，不变两排四列，不把图画上下自动说成实物前后。',
      activity: '实际看原八物件完成示范和全部三个填空，说清每个参照物。',
      visual: visual('items'),
    },
    {
      title: '四个钟面全部连线',
      text: '原四钟按从左到右编号A/B/C/D，分别12时、3时半、8时半、10时半；原文字标签顺序不同，不能按标签位置机械配对。整时长针指12；半时长针指6，短针在前一时数与下一时数之间。本站窄屏可换行，仍按A～D读。短针不是半时时指向后一整点；钟面本身不说明日期或上午下午。',
      activity:
        '实际完成原四钟全部连线，再分别口述长短针；实际拨出四时刻另记。',
      visual: visual('clocks'),
    },
    {
      title: '自己的时间与真实交流',
      text: '回顾认钟、记录时间和珍惜时间。选自己实际观察的一件整时或半时事情记录日期、时段与时间；没观察可待做，不能为完成而编日程。向同伴说明一个位置和一个时刻，听到回应再记交流。合理安排学习、休息、游戏可讨论，不用统一日程、谁更忙或答题快慢给自己评星。未来打算和已经发生分开。',
      activity: '实际观察记录、位置/时刻交流及合理安排讨论分别如实记。',
    },
    {
      title: '附页九学具，恢复后换标准',
      text: '87页是学具附页，不是新单元。九张按行编号A～I：黄圆/蓝方/黄三角，蓝圆/绿三角/蓝三角，绿方/绿圆/黄方。圆/正方形/三角形各三张，黄/蓝/绿也各三张；两种标准得到不同组。先按颜色完整分三组，恢复全部九张再按形状分，检查每张不漏不重复。可用已画纸卡，剪裁请成人协助；原卡与本站图分别记录。',
      activity: '实际准备全部九卡，按颜色完整分，恢复后按形状完整重分并交流。',
      visual: visual('annex'),
    },
  ],
  questions: [
    choice(
      'q1',
      '以钟为参照，原图房屋在钟的哪个方向？',
      '上面',
      directions,
      '房屋和钟同列，房屋在上排。',
      visual('items'),
    ),
    {
      ...q(
        'flower-fill',
        '原右星已示，按A上方、B左边、C下方顺序选择应画的图形。',
        { kind: 'sequence', values: ['正方形', '三角形', '圆'] },
        '参照花，三个待填位置全部完成，字母不作答案。',
        visual('flower-blank'),
      ),
      choices: ['正方形', '三角形', '圆', '星'].map((label) => ({
        id: label,
        label,
      })),
    },
    choice(
      'flower-star',
      '原图已给的星相对于花在哪边？',
      '右边',
      directions,
      '右星是示范，不另外把它当待填的A/B/C。',
      visual('flower-blank'),
    ),
    choice(
      'reference',
      '说明“房屋在上面”时，要先说清什么？',
      '相对于哪件物品',
      ['相对于哪件物品', '只说物件颜色', '不必有参照物'],
      '相对位置要明确参照和观察方向。',
    ),
    choice(
      'balloon',
      '以太阳为参照，原图气球在哪边？',
      '右边',
      directions,
      '上排太阳左、气球右，是原示范也要核对。',
      visual('items'),
    ),
    choice(
      'lamp',
      '以笔筒为参照，原图台灯在哪边？',
      '左边',
      directions,
      '下排台灯在笔筒左。',
      visual('items'),
    ),
    choice(
      'cup',
      '以气球为参照，原图笔筒在哪边？',
      '下面',
      directions,
      '同列气球上、笔筒下。',
      visual('items'),
    ),
    choice(
      'front',
      '二维图里房屋在钟上面，能直接说真实房屋就在钟的前面吗？',
      '不能，前后要说明实际面对方向',
      ['不能，前后要说明实际面对方向', '能，上面永远等于前面'],
      '画面上下与实际前后不是同一条件。',
      visual('items'),
    ),
    ...times.map((time, index) =>
      choice(
        `clock-${index + 1}`,
        `认读原${String.fromCodePoint(65 + index)}号钟面，应连哪个时刻？`,
        time,
        times,
        '先看长针，再看短针；完整认读全部四个，不按原标签排列猜。',
        visual('clocks'),
      ),
    ),
    choice(
      'half-between',
      '原B号3时半，短针应在什么位置？',
      '3与4之间',
      ['3与4之间', '正好指4', '正好指6'],
      '长针在6，短针走过3但还没到4。',
      visual('clocks'),
    ),
    q(
      'long-hands',
      '按原A/B/C/D顺序填长针指向的钟面数字。',
      { kind: 'steps', values: [12, 6, 6, 6] },
      '整时指12，三个半时指6；所填是钟面数字，不是四个时刻的小时。',
      visual('clocks'),
    ),
    choice(
      'period',
      '只看这些普通钟面，能确定是今天上午还是下午吗？',
      '不能，还需要日期和时段信息',
      ['不能，还需要日期和时段信息', '能，3时半永远只能下午'],
      '记录具体事情时另说明日期/时段。',
      visual('clocks'),
    ),
    pick(
      'annex-circle',
      '附页九卡按形状，完整选出圆的编号。',
      ['A', 'D', 'H'],
      '同形三张，颜色不同不影响本轮形状标准。',
    ),
    pick(
      'annex-square',
      '恢复九卡，按形状完整选出正方形编号。',
      ['B', 'G', 'I'],
      '三个正方形不是三个立方体。',
    ),
    pick(
      'annex-triangle',
      '恢复九卡，按形状完整选出三角形编号。',
      ['C', 'E', 'F'],
      '各卡是独立对象。',
    ),
    pick(
      'annex-yellow',
      '恢复九卡，改按颜色完整选出黄色编号。',
      ['A', 'C', 'I'],
      '颜色与形状标准分开。',
    ),
    pick(
      'annex-blue',
      '恢复九卡，按颜色完整选出蓝色编号。',
      ['B', 'D', 'F'],
      '不同形状也可同颜色。',
    ),
    pick(
      'annex-green',
      '恢复九卡，按颜色完整选出绿色编号。',
      ['E', 'G', 'H'],
      '检查全部三张，不只举一个例子。',
    ),
    q(
      'annex-shape-counts',
      '按圆、正方形、三角形顺序填各类卡数。',
      { kind: 'steps', values: [3, 3, 3] },
      '每形状三张，共九张；类别三与对象九分清。',
      visual('annex'),
    ),
    q(
      'annex-color-counts',
      '恢复九卡，按黄色、蓝色、绿色顺序填各类卡数。',
      { kind: 'steps', values: [3, 3, 3] },
      '颜色各三张，标准变了但同一批九张没有增减。',
      visual('annex'),
    ),
    actual('position', '实际以一个明确参照和面对方向介绍上下左右前后'),
    actual('flower', '实际完成原花周围全部作图并核对，右星与三个待补位置分清'),
    actual(
      'items',
      '实际对原八物件说明气球/太阳、房屋/钟、台灯/笔筒、笔筒/气球全部关系并填空',
    ),
    actual('clock-match', '实际完成原四钟全部连线并口述长短针'),
    actual(
      'clock-dial',
      '实际用钟拨出四时刻并口述；若仅画纸钟请如实记替代，不冒实物拨钟',
    ),
    actual(
      'record',
      '实际观察并记录自己一件整时或半时事情，注明日期/时段，未知待核对',
    ),
    actual(
      'exchange',
      '实际交流一个位置与一个时刻，并讨论合理安排学习休息游戏、听到回应',
    ),
    actual(
      'annex',
      '实际准备全部九学具卡，先按颜色完整分，再恢复按形状完整重分；画卡替代如实记',
    ),
    q(
      'evaluate-position',
      '如实记录介绍位置时会用的关系和还需要帮助的地方；未尝试可待做。',
      { kind: 'reflection' },
      '个人评价correct:null，不按客观分自动评星。',
    ),
    q(
      'evaluate-time',
      '如实记录认钟/记录时间的收获和困难，不要求与同伴能力相同。',
      { kind: 'reflection' },
      '开放评价不判统一对错。',
    ),
    q(
      'record',
      '记录自己实际选的事情、日期/时段/时间；尚未观察可如实记待做。',
      { kind: 'reflection' },
      '个人记录不编造标准日程，实际做过另确认。',
    ),
    q(
      'plan',
      '准备怎样合理安排下一次学习、休息或游戏？说明这是未来计划，与实际已经做过分开。',
      { kind: 'reflection' },
      '珍惜时间不评谁更忙，不把打算当已完成。',
    ),
  ],
  reviewQuestions: [
    {
      ...q(
        'review-flower',
        '新图星改在花左边；按新A上方画圆、B右边画正方形、C下方画三角形，依次选择。',
        { kind: 'sequence', values: ['圆', '正方形', '三角形'] },
        '参照和空格位置已更换，不能套原上方正方形/左三角/下圆。',
        visual('flower-blank', 'review'),
      ),
      choices: ['正方形', '三角形', '圆', '星'].map((label) => ({
        id: label,
        label,
      })),
    },
    choice(
      'review-items',
      '新排列以钟为参照，房屋在钟哪个方向？',
      '下面',
      directions,
      '新上排钟，下排同列房屋；主图上面不再成立。',
      visual('items', 'review'),
    ),
    choice(
      'review-clock',
      '新A号钟面应读哪个时刻？',
      '5时半',
      ['5时半', '5时', '12时', '12时半'],
      '新长针6、短针5与6之间。',
      visual('clocks', 'review'),
    ),
    pick(
      'review-annex',
      '新排列恢复九卡，按绿色这一标准完整选出编号。',
      ['A', 'E', 'H'],
      '绿方A/绿圆E/绿三角H，原图E/G/H不能套新编号。',
      'review',
    ),
  ],
};
