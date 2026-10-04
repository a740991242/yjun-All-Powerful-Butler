import type { Lesson, Question, Visual } from '../learning/types';

import {
  twentyCompleteQuestions,
  twentyCompleteSourceTasks,
} from './math-twenty-complete-practice';
import {
  twentyBundleRemainingTasks,
  twentyIntervalQuestions,
  twentyIntervalSourceTasks,
  twentyLinksRemainingTasks,
  twentyNeighborQuestions,
  twentyNeighborSourceTasks,
} from './math-twenty-interval-practice';
import {
  twentyDescriptionQuestions,
  twentyPositionSourceTasks,
  twentyRepresentationSourceTasks,
} from './math-twenty-representation-practice';

const base = {
  textbookTitle: '11～20的认识',
  version: 1,
  status: 'available' as const,
  prerequisite:
    '先能逐个点数到10；纸笔、数卡和捆十材料按实际准备，缺材料可跳过。',
  parentTip:
    '参照人教上册73～87页组织原创例子和活动。页面图示不是原教材插画，数位图不是实际拨珠。每捆固定10根，捆数、散根数和总根数分开；数字0与没有作答分开。实际读写、整理、交流只人工记录，不自动评发音、字形或理解程度。',
  review: {
    date: '2026-10-03',
    reviewer: '官方教材73～87页实际阅读与原创任务程序核对',
    notes:
      '资源1221001101241图片79～93逐页实际查看。保留原数序、数位、比较、加减四课v1及题目ID，追加独立捆十、位置范围与关系整理课。教材图、原题及全文不发布；真实材料活动和个人反思分开记录。',
  },
};
function task(
  id: string,
  suffix: string,
  prompt: string,
  rule: Question['rule'],
  hint: string,
  explanation: string,
  visual?: Visual,
  labels?: string[],
): Question {
  return {
    id: `${id}-${suffix}`,
    knowledge: id,
    prompt,
    rule,
    hint,
    explanation,
    visual,
    choices: labels?.map((label) => ({ id: label, label })),
  };
}
function numeric(
  id: string,
  suffix: string,
  prompt: string,
  value: number,
  explanation: string,
  visual?: Visual,
): Question {
  return task(
    id,
    suffix,
    prompt,
    { kind: 'number', value },
    '先看清数量、单位和要问的范围，再用摆、数或算核对。',
    explanation,
    visual,
  );
}
function fields(
  id: string,
  suffix: string,
  prompt: string,
  values: number[],
  explanation: string,
  visual?: Visual,
): Question {
  return task(
    id,
    suffix,
    prompt,
    { kind: 'steps', values },
    '按题目指定次序分别填写，0不能省略，也不要把几个单位混在一起。',
    explanation,
    visual,
  );
}
function select(
  id: string,
  suffix: string,
  prompt: string,
  labels: string[],
  value: string,
  explanation: string,
): Question {
  return task(
    id,
    suffix,
    prompt,
    { kind: 'choice', value },
    '回看已知条件，先说理由，再选择。',
    explanation,
    undefined,
    labels,
  );
}
function activity(id: string, suffix: string, prompt: string): Question {
  return task(
    id,
    suffix,
    prompt,
    { kind: 'manual' },
    '按说明实际做；缺材料或还没做请跳过，计划另写在反思中。',
    '只记录这项活动是否实际完成，不自动判定纸笔、口述或操作质量，不计客观正确率。',
  );
}
function reflect(id: string, suffix: string, prompt: string): Question {
  return task(
    id,
    suffix,
    prompt,
    { kind: 'reflection' },
    '按真实经历记下发现、困难或尚未做的内容；可由家长代录。',
    '个人反思没有统一正确答案，不能用未来计划证明已经完成活动。',
  );
}
const bundle = 'mu-twenty-bundles';
const position = 'mu-twenty-positions';
const links = 'mu-twenty-links';
export const twentyPracticeLessons: Lesson[] = [
  {
    ...base,
    id: bundle,
    version: 3,
    page: 74,
    title: '捆十、摆数与两个数字的意义',
    goal: '亲自把十个一换成一个十，读摆10～20，区分数字、数位、材料数量和表示的数。',
    steps: [
      {
        title: '先估再数，十个作为一组',
        activity:
          '实际取两小把材料，分别先估再数并各圈10个；记录真实估计与根数。',
        text: '先可在自己的教材第73页选两类事物逐个数；环形排列标好起点，回到起点就停，不重复数。缺原书可跳过原图活动，本站图示不代替原图。再取一小把完整小棒或纸条，先说估计，再逐个数。选出正好10根，用圈或松绳标成一组；十根并没有变成一根，只是记作1个十。先试一堆，再换一堆，分别记录估计和实际根数，不把接近估计当正确率。',
      },
      {
        title: '添到十，再添到二十',
        text: '实际摆9根，添1根后数满10并组成一捆；再摆1捆和9根，添1根，散根满10又组成1捆。最后2捆共有20根。用纸画计数器演示个位九颗添一后换到十位，不保留十颗在个位；珠颗数和表示数量不同。',
        visual: { kind: 'place-value', value: 20 },
      },
      {
        title: '同一个数字在不同位置',
        text: '数位表左列十位、右列个位。11左边的1表示1个十，右边的1表示1个一；20中的2表示2个十，0表示没有散的一个一，但写数时不能删掉0。读出10和11～20，写到纸上，再用材料验证，不由网页选项判断读音或书写。',
        visual: { kind: 'place-value', value: 11 },
      },
      {
        title: '说组成，让同伴摆出来',
        text: '用十根一捆的材料实际摆12、14、17、19和20，每摆一个就恢复材料。再轮流说组成、听组成摆数或放数卡；两人核对捆和散根。一个人可先写要求、遮住再摆、最后揭开核对，如实记为独自核对，不冒充同伴交流。',
      },
      {
        title: '成对数与生活中的十',
        text: '选16个纸片两两配对，再选15个配对，看看有没有单出的一个。1、3、5……可以叫单数，2、4、6……可以叫双数。找生活中十个一组的例子；若观察玉米，只由成人准备允许使用的横截面，数自己的实际颗数，不假定所有玉米一定相同。',
      },
      {
        title: '原图逐组数，读画珠与摆数完整核对',
        text: '两个圈十图分别数，环形数点标起点；成对、成把的物品仍按指定单个单位计数。珠串、小棒和计数器各自读数，珠颗数不是表示的数量。原书五个指定数全部摆后复原；原计数器读写与画珠全部分别做，个位无珠仍写0。原图实际作品独立记录，不由本站原创示例确认已做，缺原书可暂跳。',
      },
      {
        title: '原三种组成与两图估计分别记录',
        text: '原第76页三幅小棒组成全部填，0个散根与未填分开。原第86页两物品图各先估再数，估计先保留，不用看到结果后的数字冒原估计；原图、本站示例与真实材料各自记录。',
      },
    ],
    questions: [
      fields(
        bundle,
        'q1',
        '每捆10根。1捆和6根分别是几个十、几个一、共多少根？依次填。',
        [1, 6, 16],
        '1个十和6个一合成16，材料总数是16根。',
        { kind: 'place-value', value: 16 },
      ),
      fields(
        bundle,
        'q2',
        '20的十位数字、个位数字依次填什么？',
        [2, 0],
        '2个十和0个一，写成20；0是实际答案，不是空白。',
        { kind: 'place-value', value: 20 },
      ),
      fields(
        bundle,
        'q3',
        '11左边的1、右边的1分别表示多少？依次填数量。',
        [10, 1],
        '左边在十位表示10，右边在个位表示1。',
        { kind: 'place-value', value: 11 },
      ),
      numeric(
        bundle,
        'q4',
        '每捆10根。2捆小棒一共有多少根？',
        20,
        '捆数是2，总根数是10和10合起来的20。',
      ),
      fields(
        bundle,
        'q5',
        '把19根添1根，再每10根捆一捆。最后几捆、几根散棒？依次填。',
        [2, 0],
        '新增后20根，整理成2捆，散棒为0。',
      ),
      select(
        bundle,
        'q6',
        '20删掉末尾的0写成2，表示的数量相同吗？',
        ['相同', '不同'],
        '不同',
        '20是两个十，2是两个一。',
      ),
      fields(
        bundle,
        'q7',
        '将16片纸两两配对，是几对、还单出几片？依次填。',
        [8, 0],
        '8对各2片是16片，没有单出纸片。',
      ),
      fields(
        bundle,
        'q8',
        '将15片纸两两配对，是几对、还单出几片？依次填。',
        [7, 1],
        '7对是14片，另有1片单出。',
      ),
      activity(
        bundle,
        'scene',
        '在自己可合法阅读的教材第73页选两类物体实际逐个数；说清环形排列怎样标起点避免漏数或重复。原教材场景不是本站数位图，缺原书可跳过。',
      ),
      activity(
        bundle,
        'estimate',
        '实际取两小把材料，每把先估再逐根数，记录两次估计、实际根数，并各选10个圈成一组。',
      ),
      activity(
        bundle,
        'exchange',
        '实际完成9添1捆十和19添1再捆十；在自己画的十位/个位计数器上分别演示换位，并说明珠数和表示数量不同。',
      ),
      activity(
        bundle,
        'read-write',
        '在纸上写10及11～20，依次读出，挑11和20用数位表解释各数字的意思；由家长实际核对，不由网页评分读写。',
      ),
      activity(
        bundle,
        'build',
        '按步骤依次摆12、14、17、19、20，每次复原；轮流或独自按组成摆数，并说清实际采用哪种方式。',
      ),
      activity(
        bundle,
        'pairs',
        '实际将16和15个纸片分别两两配对，观察单出的纸片；找一个十个一组的生活例子，可选观察真实玉米但不推断全部玉米。',
      ),
      reflect(
        bundle,
        'reflection',
        '我怎样分清一捆、一个十和十根？记录自己实际核对的例子；没做的活动另写待做。',
      ),
      ...twentyRepresentationSourceTasks.map(([key, prompt]): Question => ({
        ...activity(bundle, `actual-source-${key}`, prompt),
        knowledge: `${bundle}-actual-source-${key}`,
      })),
      ...twentyBundleRemainingTasks.map(([key, prompt]): Question => ({
        ...activity(bundle, `actual-source-${key}`, prompt),
        knowledge: `${bundle}-actual-source-${key}`,
      })),
    ],
    review: {
      ...base.review,
      date: '2026-10-04',
      notes:
        '实际重新查看官方留存图81/83/85/92对应印刷75/77/79/86，补八个独立原书完整人工任务。旧15主任务/4复习/五步骤保持，v2共23任务与六步骤，旧快照不改；不冒整册已完成。2026-10-04再核第76/86页，追加原三组成与两图估计两项；v3现7步骤25任务，前23任务/4复习/六步骤保持。',
    },
    reviewQuestions: [
      fields(
        bundle,
        'r1',
        '每捆10根，1捆和8根依次是几个十、几个一、共几根？',
        [1, 8, 18],
        '1个十和8个一是18。',
        { kind: 'place-value', value: 18 },
      ),
      fields(
        bundle,
        'r2',
        '10的十位和个位数字依次填。',
        [1, 0],
        '1个十，个位0不能省略。',
        { kind: 'place-value', value: 10 },
      ),
      fields(
        bundle,
        'r3',
        '14片两两配对，几对、单出几片？依次填。',
        [7, 0],
        '7对正好14片。',
      ),
      fields(
        bundle,
        'r4',
        '13片两两配对，几对、单出几片？依次填。',
        [6, 1],
        '6对12片，余1片。',
      ),
    ],
  },
  {
    ...base,
    id: position,
    version: 4,
    page: 78,
    title: '数序、之间与连两端的数量',
    goal: '按完整顺序辨认位置，区分编号差、两端之间、连两端共几个与推迟的天数。',
    steps: [
      {
        title: '排完整数卡与找书页',
        activity: '实际排0～20纸卡正倒读，再找自己书中的四个指定印刷页。',
        text: '自己在纸上写0～20数卡，排成从小到大的一行，再从20往0读。选一个数说前后相邻数；比较靠近10还是20，可以在等距数轴数间隔。找自己书中的第6、11、16、19印刷页；电子阅读器页序可能不同，先辨纸面页码。',
        visual: { kind: 'number-line', minimum: 0, maximum: 20, value: 16 },
      },
      {
        title: '数量与第几要分开',
        text: '摆20张自制编号卡，从左第一个为1。圈从左第12张，再圈右端的3张，两个要求的范围不同。从第8张到第12张并把两端都圈进去，是8、9、10、11、12五张，不能只算编号相减。',
      },
      {
        title: '只数两个位置之间',
        text: '按同一个方向排队，两人分别在第7和第13位。只数他们中间的8～12位，两本人都不算。可画完整编号圆点，再给两端打叉。若两人相邻，中间没有人，0是合法答案；换方向报第几，必须重新读条件。',
        visual: { kind: 'number-line', minimum: 0, maximum: 20, value: 13 },
      },
      {
        title: '同样的范围问题换个情境',
        text: '假想楼层连续编号、没有夹层，两家在第4层和第10层，中间只有5～9层，不算两家所在层。公交停靠也先问清是否包含上车站和下车站，站编号差不是中间站数。读书从第12页到第16页都读了，是五页，不是四页。',
      },
      {
        title: '推迟与画图检查',
        text: '原定星期二的活动推迟2天：过1天到星期三，过2天到星期四，原来那天不当第1个过去的日子。将书页、两人之间、楼层或站点任选两种，实际画两图并标出包含与不包含的端点，再解释自己的结果。',
      },
      {
        title: '六种描述和整条数卡分别核对',
        text: '中间的数不包含两端；某数后第1个从下一数开始。几个十和几个一的先后说法不改变组成，不同描述可以表示同一个数。先把完整连续数卡的所有空格填好，再将每条描述分别核对。原旗图左边省略了部分位置，应由给定编号推位置，不把可见首面当第1面；原三种圈法与六条列车描述另行实际记录。',
      },
      {
        title: '完整正倒序与原位置应用',
        text: '两行数卡分别按方向填全部空格，逐格回看。图前端省略的位置仍在全排中，不能把首个可见物当第1。排队转弯不自动改起点；人数/楼层/站点之间不含两端，阅读从首到末则包含两端。推迟逐天走，原当天不是过去的一天；原找页、连点、两行与各应用题全部独立处理。',
      },
      {
        title: '相邻两个空与两端距离分别检查',
        text: '大1和小1分别沿各自起点走一格；两个空的方向不能混用。比较接近10还是20，要在等距数轴上分别数到两端的间隔，起点不算已走一格。靠近10、靠近20、同样近三种情况都可能出现；15到10和20各走5格，同样近不能硬选一端。原第78页两空与接近活动分别回书核对，不用原创变式代替。',
      },
    ],
    questions: [
      fields(
        position,
        'q1',
        '17的前一个数、后一个数依次是什么？',
        [16, 18],
        '按从小到大的顺序，前16后18。',
        { kind: 'number-line', minimum: 0, maximum: 20, value: 17 },
      ),
      select(
        position,
        'q2',
        '18到10相隔8个单位，到20相隔2个单位。18更接近谁？',
        ['10', '20', '同样近'],
        '20',
        '2个间隔比8个间隔少，所以靠近20。',
      ),
      numeric(
        position,
        'q3',
        '20张编号卡按1～20从左排。右端的3张共有几张？',
        3,
        '问的是3张，不是从左第3张。',
      ),
      numeric(
        position,
        'q4',
        '一行编号从1开始。第8张到第12张都算上，共有几张？',
        5,
        '包括8、9、10、11、12五张。',
      ),
      numeric(
        position,
        'q5',
        '两人从同一端排第7和第13，中间几人？两本人不算。',
        5,
        '只数第8～12位，5人；差6包含了一个端点，不能当中间数。',
      ),
      numeric(
        position,
        'q6',
        '同一队伍两人排第11和第12，中间几人？',
        0,
        '相邻，没有中间位置，中间人数0。',
      ),
      numeric(
        position,
        'q7',
        '连续编号且无夹层的楼里，两家在第4层和第10层，两家之间有几层？',
        5,
        '不含4和10，只有5～9五层。',
      ),
      numeric(
        position,
        'q8',
        '同一公交线路按方向连续编号。第6站上车、第12站下车，只算中间停靠，几站？',
        5,
        '只算7～11站，共5站，不包含上车、下车两站。',
      ),
      numeric(
        position,
        'q9',
        '从书的第12页读到第16页，这五个页码对应的每页都读了，共读几页？',
        5,
        '12、13、14、15、16五页，连两端都算。',
      ),
      select(
        position,
        'q10',
        '原定星期二的活动推迟2天举行，会在星期几？',
        ['星期三', '星期四', '星期五'],
        '星期四',
        '经过1天到星期三，2天到星期四，不把原当天算过去的1天。',
      ),
      activity(
        position,
        'cards',
        '实际排0～20完整纸卡，正读和倒读；找自己书的第6、11、16、19印刷页，说明有没有和阅读器页序混淆。',
      ),
      activity(
        position,
        'range',
        '实际摆20张编号卡，分别圈从左第12张、最右3张、从第8到第12张，保留三次范围说明。',
      ),
      activity(
        position,
        'between',
        '画完整第7～13位并圈出中间的人，再画第11和第12相邻情况；口头说明为什么不算两本人。',
      ),
      activity(
        position,
        'connect',
        '在纸上自己画20个编号点，再按1～20依次连接；写11～20全序和20～11倒序并逐项核对，不借网页填好表代替。',
      ),
      activity(
        position,
        'explain',
        '按最后一步任选两个情境，各实际画一图、标出端点是否计入，用自己的话解释；有同伴时交流，没有时如实独自核对。',
      ),
      reflect(
        position,
        'reflection',
        '我怎样判断要不要算上两端？记录实际画过的例子，另记尚未完成的活动。',
      ),
      ...twentyDescriptionQuestions(false),
      ...twentyPositionSourceTasks.map(([key, prompt]): Question => ({
        ...activity(position, `actual-source-${key}`, prompt),
        knowledge: `${position}-actual-source-${key}`,
      })),
      ...twentyIntervalQuestions(false),
      ...twentyIntervalSourceTasks.map(([key, prompt]): Question => ({
        ...activity(position, `actual-source-${key}`, prompt),
        knowledge: `${position}-actual-source-${key}`,
      })),
      ...twentyNeighborQuestions(false),
      ...twentyNeighborSourceTasks.map(([key, prompt]): Question => ({
        ...activity(position, `actual-source-${key}`, prompt),
        knowledge: `${position}-actual-source-${key}`,
      })),
    ],
    review: {
      ...base.review,
      date: '2026-10-04',
      notes:
        '实际查看官方图86对应印刷80，追加六条独立数字描述与完整三空数卡的原创练习及新条件复习，两项原旗图/列车完整人工任务。旧16主任务/4复习/五步骤保持，v2共25任务/11复习/六步骤，旧快照不改；不同描述可同数。2026-10-04再核78/82/83/84/86原题，追加两九格完整填空、省略前端位置及跨周推迟四客观/复习与九原书manual；v3现7步骤38任务/15复习，旧25任务/11复习/六步保持。再次核对第78页，v4追加两空相邻数、近10/近20/同样近四题及换条件或换所求复习，两原书任务独立人工记录；现8步骤44任务/19复习，旧v3前38任务/15复习/七步与快照保持。',
    },
    reviewQuestions: [
      numeric(
        position,
        'r1',
        '同一方向两人排第9和第16，中间几人？不含本人。',
        6,
        '只数10～15六人。',
      ),
      numeric(
        position,
        'r2',
        '第9页到第16页都读了，共读几页？',
        8,
        '含9～16八页。',
      ),
      numeric(
        position,
        'r3',
        '第8站上车，第9站下车，两个端点之外中间停几站？',
        0,
        '相邻站之间没有其它编号站。',
      ),
      select(
        position,
        'r4',
        '星期三的活动推迟3天，在哪天？',
        ['星期五', '星期六', '星期日'],
        '星期六',
        '经过周四1天、周五2天、周六3天。',
      ),
      ...twentyDescriptionQuestions(true),
      ...twentyIntervalQuestions(true),
      ...twentyNeighborQuestions(true),
    ],
  },
  {
    ...base,
    id: links,
    version: 3,
    page: 81,
    title: '加减联系、按条件整理与成长记录',
    goal: '由十和几联系加减，认识算式名称，依据整体部分与所求解题，实际整理知识并分别反思。',
    steps: [
      {
        title: '同一份材料看加和减',
        activity:
          '实际摆14根，分别恢复后取散棒、取整捆，记录同一份材料的加减联系。',
        text: '摆1捆和4根，共14根，分清10和4这两部分。说10+4=14，再取走散根说14−4=10，再取走整捆说14−10=4；每次先恢复原材料。加法两部分交换仍是14，减法不能照样交换。',
        visual: { kind: 'place-value', value: 14 },
      },
      {
        title: '读算式的名称和各单位',
        text: '例如12+5=17，12与5都是加数，17是和；17−5=12，17是被减数、5是减数、12是差。实际添5根或拿走5根看个位变化，十位保留一个十。讲数值和所问的单位，不把总数与部分重复合并。',
      },
      {
        title: '问总数和问另一部分',
        text: '袋里有12颗棋子，袋外有4颗，问全部就合起来。若全部16颗、袋外4颗，问袋内就是求另一部分。画长条或摆材料，分别先说已知、再说问题、再列式并核对单位。另摆14对11个纸片，一一配对后再说相差多少，不由纸片面积判断。',
      },
      {
        title: '连算、比较和补缺数',
        text: '先算左边两个数，写中间结果，再接着算。比较一个算式和一个数时，先求值再比；填缺少的加数时，想已有量加到目标还差多少。计算过程若看到0，按零记录，不把它当未回答。',
      },
      {
        title: '自己设计算式小路和分类图',
        text: '自己写15个不进位、不退位的20以内算式排成三行五列，设计一条边相邻的小路，让得数每步比前一步大1。标起点、每个得数和所走方向，找不到路径也如实记录；不冒充原书的路线。另画一幅分区图，把6个自己写的算式按得数分类，用数字标签辅助颜色，再做自己的知识关联图：数位、数序、加减与位置范围各放实际例子。',
      },
      {
        title: '逐项说发现和待做',
        text: '分别记录：我怎样按十和一读写数；我怎样用数序与端点解决问题；我怎样说明加减或核对方法。实际作品可以和同伴交流，但自己的计划不作已完成证据，不用网页成绩自动评这三方面。',
      },
      {
        title: '整组配对、独立计算与连算',
        text: '两组六条独立算式分别开始，不接上一题结果。四组等值配对先算每式再比较，交换加数仍可能相等，加减式也可能相等。六条连算每条先写中间量再接第二步，六处比较先算两边再判断，三处缺加数分别代回。本站完整组为原创数字，原书全组另行记录，不用少量代表题代替。',
        activity:
          '实际纸写两组六式、四对等值式、六条连算中间量、六处比较及三缺数，逐条核对与说明帮助；原页任务分开，未做暂跳。',
      },
      {
        title: '原书完整路线与每个涂色区域',
        text: '第86页原路线为四行五列，全部二十式与先前自制三行五列不同；回原页逐步检查结果大1的路径。第87页每个区域独立算式后依指定得数涂色，同结果的不同区域不漏。自制路线或六式分区只是原创练习，不自动表示原书游戏做完。缺原书可待做，实际记录与未来计划分开。',
        activity:
          '回原页保存完整路线和全部涂色区域的实际作品；没有原书或尚未处理可暂跳，不据网页正确自动确认。',
      },
      {
        title: '原整体部分与一一配对完整处理',
        text: '同一原小棒图要填完整三式；原糖果求合计、原蜡笔求另一部分各自先读条件和所求，再填算式/单位并回看。原松果松鼠一一对应后只数未配对部分求相差，不把图面积或间距当数量。实际作品独立记录，网页答对不自动确认。',
      },
    ],
    questions: [
      fields(
        links,
        'q1',
        '1捆每捆10根和4根散棒。10+4、14−4、14−10依次是多少？',
        [14, 10, 4],
        '同一份材料联系合计与两部分，三个结果依次14、10、4。',
        { kind: 'place-value', value: 14 },
      ),
      select(
        links,
        'q2',
        '12+5=17中，17的名称是？',
        ['加数', '和', '差'],
        '和',
        '加法结果叫和。',
      ),
      select(
        links,
        'q3',
        '17−5=12中，17的名称是？',
        ['被减数', '减数', '差'],
        '被减数',
        '17是原总量，即被减数；减去5，差12。',
      ),
      numeric(
        links,
        'q4',
        '袋内12颗、袋外4颗棋子，两部分没有重复。全部几颗？',
        16,
        '12+4=16颗。',
        { kind: 'bars', parts: [12, 4], unknown: 2 },
      ),
      numeric(
        links,
        'q5',
        '棋子全部16颗，其中袋外4颗，剩余全在袋内。袋内几颗？',
        12,
        '16−4=12颗，4颗已经包含在总数16里。',
        { kind: 'bars', parts: [12, 4], unknown: 0 },
      ),
      numeric(
        links,
        'q6',
        '14张蓝纸片、11张白纸片各一组，蓝的比白的多几张？',
        3,
        '逐张配对，14−11=3张。',
      ),
      fields(
        links,
        'q7',
        '6+4+7，从左往右依次填中间结果和最终结果。',
        [10, 17],
        '先6+4=10，再10+7=17。',
      ),
      fields(
        links,
        'q8',
        '16−6−10，从左往右依次填中间结果和最终结果。',
        [10, 0],
        '先16−6=10，再10−10=0。',
      ),
      select(
        links,
        'q9',
        '18−4与14比较，应选哪个符号？',
        ['>', '<', '='],
        '=',
        '18−4=14，两边相等。',
      ),
      numeric(
        links,
        'q10',
        '10加几等于17？只填缺少的加数。',
        7,
        '已有10，添7到17。',
      ),
      activity(
        links,
        'materials',
        '按第一步实际摆14根、分别恢复后取散根和取整捆，写1个加法和2个减法；用自己的话说明各部分和合计。',
      ),
      activity(
        links,
        'names',
        '实际摆12添5和17拿走5，每次恢复原数量；在纸上圈出两个加数、和，以及被减数、减数、差并口头说明。',
      ),
      activity(
        links,
        'stories',
        '实际画或摆“合计、另一部分、相差”各一个原创问题，写已知、所求、算式和单位，并用图或实物核对。',
      ),
      activity(
        links,
        'route',
        '自己写完整三行五列算式，实际设计并检查边相邻、得数逐步大1的小路；保留实际尝试，未找到也如实说明，不冒称原书游戏已完成。',
      ),
      activity(
        links,
        'classify',
        '实际为6个自己写的算式画分区图，按得数分类，同时写数字标签；不能仅用颜色提示，也不以涂色范围判断算式正确。',
      ),
      activity(
        links,
        'map',
        '实际做包含数位、数序、加减和端点范围的知识关联图，每类放一个自己的例子；有同伴则交流，独自核对如实记。',
      ),
      reflect(
        links,
        'reflection-place',
        '我在读写数、十和一方面实际有什么发现或困难？写一个自己的证据。',
      ),
      reflect(
        links,
        'reflection-range',
        '我解决数序和端点范围问题时用了什么？记录实际做过的例子，未做另记。',
      ),
      reflect(
        links,
        'reflection-method',
        '我怎样说明加减关系、检查结果？记录自己的方法与下一步计划，计划不能当已完成。',
      ),
      ...twentyCompleteQuestions(false),
      ...twentyCompleteSourceTasks.map(([key, prompt]): Question => ({
        ...activity(links, `actual-source-${key}`, prompt),
        knowledge: `${links}-actual-source-${key}`,
      })),
      ...twentyLinksRemainingTasks.map(([key, prompt]): Question => ({
        ...activity(links, `actual-source-${key}`, prompt),
        knowledge: `${links}-actual-source-${key}`,
      })),
    ],
    reviewQuestions: [
      fields(
        links,
        'r1',
        '10+7、17−7、17−10依次是多少？',
        [17, 10, 7],
        '由10与7联系总数17及两部分。',
        { kind: 'place-value', value: 17 },
      ),
      numeric(
        links,
        'r2',
        '盒里原来19个扣子，取到桌上6个，余下全在盒里。盒里几个？',
        13,
        '19−6=13，不把6重复加到总数里。',
      ),
      fields(
        links,
        'r3',
        '15−5+3，中间和最终结果依次填。',
        [10, 13],
        '先15−5=10，再10+3=13。',
      ),
      select(
        links,
        'r4',
        '19−6和12比较，应选什么符号？',
        ['>', '<', '='],
        '>',
        '19−6=13，比12大。',
      ),
      ...twentyCompleteQuestions(true),
    ],
    review: {
      ...base.review,
      date: '2026-10-04',
      notes:
        '重新查看官方留存图片84～93对应印刷78～87，补两组各六计算、四组等值配对、六连算、六比较与三缺数原创完整练习，原书对应整组与四行五列路线及所有涂色区域各自人工记录。旧19题、4复习和前六步保持，v2共57主任务及35复习，v1历史快照不改；本课不代表全部教材或教师审校已完成。2026-10-04再核81/83原题，追加原三式、两整体部分故事及一一配对四manual；v3现9步骤61任务/35复习，旧57任务/35复习/八步保持。',
    },
  },
];
