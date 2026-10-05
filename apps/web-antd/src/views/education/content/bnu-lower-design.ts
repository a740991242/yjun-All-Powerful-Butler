import type { BnuPatternDesignVisual } from '../learning/bnu-pattern-design';
import type { Lesson, Question, Visual } from '../learning/types';
const id = 'bnu-lower-design';
const diagram = (
  scene: BnuPatternDesignVisual['scene'],
  variant: BnuPatternDesignVisual['variant'] = 'main',
): BnuPatternDesignVisual => ({ kind: 'bnu-pattern-design', scene, variant });
const task = (
  suffix: string,
  prompt: string,
  rule: Question['rule'],
  explanation: string,
  visual?: Visual,
): Question => ({
  id: `${id}-${suffix}`,
  knowledge: id,
  prompt,
  rule,
  explanation,
  hint: '先沿完整外边看，转向与内部线不替代轮廓；原图与本站示意分清，真实涂色、合作、创作如实记录。',
  ...(visual ? { visual } : {}),
});
const choose = (
  suffix: string,
  prompt: string,
  labels: string[],
  value: string,
  explanation: string,
  visual?: Visual,
): Question => ({
  ...task(suffix, prompt, { kind: 'choice', value }, explanation, visual),
  choices: labels.map((label) => ({ id: label, label })),
});
const actual = (suffix: string, prompt: string) =>
  task(
    suffix,
    prompt,
    { kind: 'manual' },
    '实际完成本项才确认；未做或只有网页答题请跳过。独立尝试不能自动算有同伴合作，材料、原图不可见或协助如实说明，不要求购买或学校资料。',
  );
const record = (suffix: string, prompt: string) =>
  task(
    suffix,
    prompt,
    { kind: 'reflection' },
    '保存真实原话，正确性为null；可以说明未做、困难或未确认，不冒完成，未来计划另记。',
  );
const targets = ['triangle', 'hexagon', 'trapezoid', 'parallelogram'] as const;
export const bnuLowerDesignLesson: Lesson = {
  id,
  textbookTitle: '动手做（三）',
  title: '合作设计、轮廓涂色与点子图',
  page: 84,
  version: 1,
  status: 'available',
  goal: '用认识的图形合作设计，按四个样形分别寻找完整轮廓并实际涂色，在点子图上创作并说明图形。',
  prerequisite:
    '能指认三角形、圆等轮廓，知道转向与大小不直接改变形状类别，实际做过和待做分清。',
  parentTip:
    '原84页三活动与四涂色区分别完成。本站比较卡不是原三六边形格，不据本站字母或卡数补原涂色总数；六边形、梯形、平行四边形可按完整轮廓比较，不要求先背名称。点阵尺寸是本站条件，不冒原教材格数；没有同伴可独立尝试并如实记待合作，材料可替代，不强制购买。',
  review: {
    date: '2026-10-06',
    reviewer: '实际查看公开扫描84页与来源记录',
    notes:
      '三原活动展开，四涂色区独立人工确认；本站比较图与原涂色格分清，程序验收另核。',
  },
  steps: [
    {
      title: '先看完整边界，再说用了什么图形',
      text: '回原84页上方，圆和三角形可以组成自己命名的图案，四个一样的三角形可以拼风车。设计不只有一个正确名称；选几片、摆在哪里和完整外边分别说明。四个一样不仅指都是三角形，还要实际叠比大小和形状；网页轮廓卡只是比较帮助，不保证能拼原风车。',
      activity: '实际准备合适材料，指边说明自己的设计想法。',
    },
    {
      title: '合作设计与说明分别做',
      text: '与实际在场的同伴商量选择和摆放，尝试一个图案，再各自说用到了哪些图形。谁提出什么、怎样配合按实际记录。没有同伴可以先独立试做，不能据独立作品确认合作发生；设计名称开放，不要求与原人物例子相同。',
      activity: '实际合作设计，再介绍所用形状与分工；未做可跳过。',
    },
    {
      title: '四个涂色区各看自己的样形',
      text: '原练1上左、上右、下左、下右四区的样形依次是三角轮廓、六边轮廓、一对平行边的四边轮廓、两对平行边的斜四边轮廓。可以按轮廓相同来找，不强记新名称。先指完整边界，不只看每个内部小三角；原已示范涂色仍属活动，不能把背景、外框和样形当新增材料。本站下面四组卡不是原格，也不提供原全图唯一数量。',
      activity: '回原四区分别找到样形位置与边界。',
    },
    {
      title: '上左：三角轮廓转了也可比较',
      text: '本站A作样形，B与D转向、大小或内部线不同，但沿完整外边都可归同类；C外边不同。内部虚线不改变D整个外边。回原上左区沿边找与样形同类的区域再涂，允许先选一处说明范围，不把网页选字母当实际涂色。',
      visual: diagram('triangle'),
      activity: '实际在原上左区逐处指完整三角轮廓，涂并复查。',
    },
    {
      title: '上右：可沿六段边逐段比较',
      text: '本站A、B、D完整外边同类，C不同；图卡转向不改变外边的连接关系。D里面分了区域，仍先看整个外边。回原上右区找样形轮廓，注意可能由几个小区域组成，不因里面有小三角就只涂每个小三角。六边形是辅助名称，不作为孩子完成轮廓匹配的前置。',
      visual: diagram('hexagon'),
      activity: '实际完成原上右样形区域的寻找与涂色，说明选定边界。',
    },
    {
      title: '下左：短底、长底与两条斜边一起看',
      text: '本站A、B、D外边同类，C不同；大小和摆向分别看，不能只凭一条斜边认相同。回原下左区对照完整样形，几个小区域合成的外边也要检查。可以指着边比较，不要求先记梯形的名称或背定义；原样形不因此变成一个三角形。',
      visual: diagram('trapezoid'),
      activity: '实际完成原下左区的轮廓寻找与涂色。',
    },
    {
      title: '下右：整个斜四边轮廓，不漏组合区域',
      text: '本站A、B、D可按整个轮廓归同类，C不同。沿四条外边逐段走，里面的线不算新的外边；斜放不直接变成三角形。回原下右区按样形找和涂，保留自己实际选定的区域，不把本站答案当原图总数。平行四边形名称可供成人说明，孩子可以沿边匹配。',
      visual: diagram('parallelogram'),
      activity: '实际完成原下右区的寻找与涂色，再检查外边。',
    },
    {
      title: '在点子图上创造，不只数点',
      text: '原练2用学过的图形在点子图设计图案，再说明用到哪些图形。本站给7行、每行7点的空白辅助格，没有已经画好的作品；可在纸上画同样点阵或用原格。先选点连边，封闭轮廓要回到起点；只连一段线还不是完整三角形。可以多种作品，尺寸不是原格条件，点本身不当已创作的圆作品。',
      visual: diagram('dot-grid'),
      activity: '实际在点子图创作，再沿自己作品完整边界说明用了什么图形。',
    },
    {
      title: '作品与合作检查，未来打算另写',
      text: '回看原四区自己的涂色、点子图作品与合作记录，说明一处实际发现或待改的边界。网页题做对不自动表示原涂色、同伴合作或创作完成。保存作品说明，不固定唯一画法和名称；还想试什么另列计划，不据本页认整单元或全年完成。',
      activity: '实际核查已有作品，未做也如实记录。',
    },
  ],
  questions: [
    task(
      'windmill-four',
      '原84页示例明确用几个一样的三角形拼风车？只按该给定条件。',
      { kind: 'number', value: 4 },
      '原对话明确四个一样的三角形，不加圆或背景。',
    ),
    choose(
      'same-pieces',
      '“四个一样的三角形”怎样核对更合适？',
      ['实际叠比形状与大小', '只要都叫三角形就必一样'],
      '实际叠比形状与大小',
      '同类别不保证同形同大，实际叠比后再说明。',
    ),
    choose(
      'cooperation',
      '目前只独立摆过图案，没有实际同伴参与，能确认已经合作吗？',
      ['不能，独立与待合作分别记录', '能，网页说合作就算'],
      '不能，独立与待合作分别记录',
      '合作是实际发生的行为。',
    ),
    ...targets.map((scene, i) =>
      choose(
        `match-${scene}`,
        `本站第${i + 1}组以A为样形。B、C、D中哪些完整外边与A属于同类？忽略大小、转向和内部虚线。`,
        ['B和D', '只有C', '全部都相同'],
        'B和D',
        '沿完整外边看B和D；C是另一种外边，内部线不改变整个外边。',
        diagram(scene),
      ),
    ),
    choose(
      'whole-boundary',
      '原格一个较大的样形区域里面有小三角线，应该怎样比较？',
      ['先看整个组合区域的完整外边', '只把每个小三角都算匹配'],
      '先看整个组合区域的完整外边',
      '先确定完整区域边界，不能漏掉组合轮廓。',
      diagram('hexagon'),
    ),
    choose(
      'name-not-gate',
      '还说不出六边形或梯形名称，但能沿边正确匹配，是否可以完成轮廓活动？',
      ['可以，先按完整轮廓比较', '不可以，必须背全部新名称'],
      '可以，先按完整轮廓比较',
      '本活动按样形匹配，不强制提前背新名称。',
    ),
    task(
      'site-zero',
      '本站这组完整A～D轮廓中，外边是圆形的有几张？不把点阵的点、背景或未知原区域计入。',
      { kind: 'number', value: 0 },
      '这组完整轮廓全部由直边围成，没有圆轮廓，所以0；原未知总数不能照此猜。',
      diagram('hexagon'),
    ),
    task(
      'grid-rows',
      '本站空白点阵有几行点？只按本站条件，不冒原教材格数。',
      { kind: 'number', value: 7 },
      '本站7行，逐行指点数，点阵只是创作辅助。',
      diagram('dot-grid'),
    ),
    choose(
      'closed',
      '自己只连了两条边、还没有回到起点，能当作完整三角形轮廓吗？',
      ['不能，还要形成封闭轮廓', '能，有斜线就算'],
      '不能，还要形成封闭轮廓',
      '三角形要有完整封闭的三条边。',
    ),
    choose(
      'click-not-color',
      '本站字母题答对是否就表示原四组已经实际涂色？',
      ['不是，还需真实涂色并分别记录', '是，自动算四组完成'],
      '不是，还需真实涂色并分别记录',
      '网页回答与真实涂色分别记录。',
    ),
    ...[
      actual(
        'actual-cooperate',
        '实际与同伴商量并合作设计一个图案。只独立尝试或未做请跳过，本项不冒合作。',
      ),
      actual(
        'actual-describe',
        '实际介绍已设计的图案，说用到哪些图形和实际分工；作品或合作未发生如实说明。',
      ),
    ],
    ...targets.map((_, i) =>
      actual(
        `actual-color-${i + 1}`,
        `实际完成原84页${['上左', '上右', '下左', '下右'][i]}区：对照该区样形找完整轮廓、涂色、逐处复查。原图不可见或仅网页选字母请跳过。`,
      ),
    ),
    actual(
      'actual-grid',
      '实际在原或替代点子图上用学过的图形设计图案，选择点、连完整边界；仅看空白网页格请跳过。',
    ),
    actual(
      'actual-grid-describe',
      '实际沿自己点子图作品的边说明用了哪些图形，不用预设唯一名称；没有作品请跳过。',
    ),
    record(
      'cooperation-record',
      '记实际合作或独立尝试、用了什么图形以及待合作部分，不自动认同伴参与。',
    ),
    record(
      'color-record',
      '四个原区分别记实际涂过的范围、一个边界发现或尚未核对的区域。不要猜全图唯一总数。',
    ),
    record(
      'grid-record',
      '用自己的话说明真实点子图作品、完整轮廓、帮助或困难；未画如实记录。',
    ),
    record('plan', '下一次想怎样改图案或合作？只记未来计划，不冒已做过。'),
  ],
  reviewQuestions: [
    choose(
      'review-hexagon',
      '新一组A样形已转向，D的内部线也变了。现在B、C、D哪些完整外边可与A归同类？',
      ['B和D', 'C和D', '只有B'],
      'C和D',
      '新图C和D与A完整外边同类，B不同；不是套旧字母位置。',
      diagram('hexagon', 'review'),
    ),
    task(
      'review-parts',
      '只看新D的两条内部虚线，把完整六段边轮廓分成几个区域？只数D内部，不加A、B、C。',
      { kind: 'number', value: 3 },
      '两条从同一外顶点连到其它顶点的内部线分出三块，整个外边仍原样。',
      diagram('hexagon', 'review'),
    ),
    task(
      'review-grid-rows',
      '本站换成较少行的新空白点阵，这次有几行？不是旧7行。',
      { kind: 'number', value: 5 },
      '新点阵5行，每行7点；不是原教材格数。',
      diagram('dot-grid', 'review'),
    ),
    choose(
      'review-parallelogram',
      '新斜四边A样形，C、D转向大小不同。哪些完整外边与A同类？',
      ['只有B', 'C和D', '全部都相同'],
      'C和D',
      '按完整轮廓看C和D，B是另一种。',
      diagram('parallelogram', 'review'),
    ),
    task(
      'review-zero',
      '这组明确完整的新A～D轮廓里，有几张外边是圆？',
      { kind: 'number', value: 0 },
      '各外边均直边，没有圆轮廓，所以0。',
      diagram('trapezoid', 'review'),
    ),
    choose(
      'review-actual',
      '只真实涂过上左区，其他三区未做，记录怎么写？',
      ['只确认上左，其余待做', '自动确认四区'],
      '只确认上左，其余待做',
      '每区实际行为分别记录，不由一项代替全部。',
    ),
  ],
};
