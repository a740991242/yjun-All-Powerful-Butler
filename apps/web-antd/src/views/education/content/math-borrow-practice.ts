import type { Lesson, Question, Visual } from '../learning/types';

import {
  borrowCompleteBranches,
  borrowCompleteChains,
  borrowCompleteClassifications,
  borrowCompleteComparisons,
  borrowCompleteHidden,
  borrowCompleteMissing,
  borrowCompletePairs,
  borrowCompleteQueues,
  borrowOrganizeSourceTasks,
  borrowProcessSourceTasks,
  borrowRelationSourceTasks,
} from './math-borrow-complete-practice';

const base = {
  textbookTitle: '20以内的退位减法',
  version: 1,
  status: 'available' as const,
  prerequisite:
    '先会分合10、20以内的数与加减；纸笔和纸片按实际准备，缺材料可跳过。',
  parentTip:
    '参照人教下册8～22页编写原创任务。网页中间步骤只核对明确指定的方法，不否定其他正确算法；纸面、实物与同伴活动分开记录，未做请跳过，反思不计正确率。',
  review: {
    date: '2026-10-03',
    reviewer: '官方教材8～22页实际阅读与原创任务程序核对',
    notes:
      '资源1221001102241图片14～28逐页实际查看。保留原三课v1和36式表格，补方法、关系与完整45式课包。不发布原扫描、插画或原题集合，学校版本仍需另行确认。',
  },
};
function task(
  id: string,
  suffix: string,
  prompt: string,
  rule: Question['rule'],
  explanation: string,
  visual?: Visual,
  labels?: string[],
): Question {
  return {
    id: `${id}-${suffix}`,
    knowledge: id,
    prompt,
    rule,
    visual,
    choices: labels?.map((label) => ({ id: label, label })),
    hint: '先读整体、部分和所求，再按指定顺序填写；0不是空白。',
    explanation,
  };
}
function fields(
  id: string,
  suffix: string,
  prompt: string,
  values: number[],
  explanation: string,
  visual?: Visual,
) {
  return task(
    id,
    suffix,
    prompt,
    { kind: 'steps', values },
    explanation,
    visual,
  );
}
function number(
  id: string,
  suffix: string,
  prompt: string,
  value: number,
  explanation: string,
) {
  return task(id, suffix, prompt, { kind: 'number', value }, explanation);
}
function choice(
  id: string,
  suffix: string,
  prompt: string,
  labels: string[],
  value: string,
  explanation: string,
) {
  return task(
    id,
    suffix,
    prompt,
    { kind: 'choice', value },
    explanation,
    undefined,
    labels,
  );
}
function select(
  id: string,
  suffix: string,
  prompt: string,
  labels: string[],
  values: string[],
  explanation: string,
) {
  return task(
    id,
    suffix,
    prompt,
    { kind: 'set', values },
    explanation,
    undefined,
    labels,
  );
}
function manual(id: string, suffix: string, prompt: string) {
  return task(
    id,
    suffix,
    prompt,
    { kind: 'manual' },
    '只记录实际完成，不自动评判口算、纸笔、操作或交流质量。缺材料、只准备或未完成请跳过；未来计划另记。',
  );
}
function reflect(id: string, suffix: string, prompt: string) {
  return task(
    id,
    suffix,
    prompt,
    { kind: 'reflection' },
    '按真实经历记录，反思没有统一答案，不计客观正确率。',
  );
}
const process = 'ml-borrow-process';
const relations = 'ml-borrow-relations';
const organize = 'ml-borrow-organize';
export const borrowPracticeLessons: Lesson[] = [
  {
    ...base,
    version: 2,
    review: {
      ...base.review,
      date: '2026-10-04',
      notes:
        '资源1221001102241图片14～28全部15页实际复核。补完整组对应的原创比较、连算、缺数、分支与原书独立实践；保留旧v1题目和学习快照，不以网页正确冒原活动实做或最终审校。',
    },
    id: process,
    page: 9,
    title: '退位减法过程与不同算法',
    goal: '比较平十、破十、想加算减，分别保存中间过程与得数。',
    steps: [
      {
        title: '先说整体与拿走的部分',
        activity: '实际摆16张拿走9张，每种方法恢复原整体后再做。',
        text: '原来16张纸片，拿走9张，求剩余。先确认整体16与拿走9，不把“拿走”当“剩下”。可合法阅读自己的教材引入图时实际提问，缺原图请跳过原图活动；本站纸片例子是原创。',
        visual: { kind: 'count', count: 16 },
      },
      {
        title: '平十：先减到10，再减剩余',
        text: '16−9，把要减的9分成6和3，先16−6=10，再10−3=7。指定字段分别是先减6、再减3、中间10、最终7。先减的6来自16的个位，不是随意拆9。',
        visual: { kind: 'number-line', minimum: 0, maximum: 20, value: 16 },
      },
      {
        title: '破十：从10中减，再加个位',
        text: '恢复16张纸片，把16分成10和6，先10−9=1，再1+6=7。两种方法同得7，步骤不同；不能把平十的中间步骤填到破十字段。网页移动只代表图示，不冒充已实际摆纸片。',
        visual: { kind: 'break-ten', left: 16, right: 9 },
      },
      {
        title: '想加算减与同一整体',
        text: '想9+7=16，所以16−9=7。若整体13的两部分是7和6，则13−7=6、13−6=7；两条式子都从原整体13开始，不在剩下6中再拿走6。可用加法回看所得部分。',
      },
      {
        title: '先判断够不够减，再完整口算',
        text: '18−8个位够减，不需要退位；10−9原个位0也明确写0。实际逐项口算10～19减9、11～18减8，再计算11减2/3/4/5、12减3/4/5、13减4/5。范围中19−9等对照式不是退位表成员。记录真实没把握的题，不以几道网页题代替整组完成。',
      },
      {
        title: '原整组摆算、圈图与配对分别完成',
        text: '原两条小棒、两幅圈图、两组轮盘与移动条都回自己的条件，全部位置分别算。原加减对应和全部三个分合组各式独立核对，缺材料如实记未做，不从本站原创变式推原图完成。',
      },
      {
        title: '缺加数与同起点三分支',
        text: '缺加数放在左边或右边都须代回；加法与对应减法两空分别保存。分支中每条都恢复同一被减数，不能沿分支连续拿走；减数每多1，差少1。本站补六组缺数对和六组三分支，原组纸笔另记。',
      },
    ],
    questions: [
      fields(
        process,
        'q1',
        '16−9按平十法。依次填：先减几个、再减几个、中间得数、最后得数。',
        [6, 3, 10, 7],
        '9=6+3，16−6=10，10−3=7。',
      ),
      fields(
        process,
        'q2',
        '16−9按破十法。依次填：16拆成的整十、原个位、10减9所得、最终得数。',
        [10, 6, 1, 7],
        '16=10+6，10−9=1，1+6=7。',
        { kind: 'break-ten', left: 16, right: 9 },
      ),
      fields(
        process,
        'q3',
        '想加算减：依次填9+□=16与16−9=□中的数。',
        [7, 7],
        '9+7=16，16−9=7。',
      ),
      fields(
        process,
        'q4',
        '12−8按破十法。依次填：整十、原个位、10减8所得、最终得数。',
        [10, 2, 2, 4],
        '12=10+2，10−8=2，2+2=4。',
      ),
      fields(
        process,
        'q5',
        '同一个整体13分成7和另一部分。依次填7+□=13、13−7=□、13−6=□。每式恢复整体13。',
        [6, 6, 7],
        '两部分7与6；不能把两条减法当作连续拿走。',
      ),
      fields(
        process,
        'q6',
        '11−4按平十法。依次填：先减几个、再减几个、中间得数、最后得数。',
        [1, 3, 10, 7],
        '4=1+3，11−1=10，10−3=7。',
      ),
      fields(
        process,
        'q7',
        '12−3按破十法。依次填：整十、原个位、10减3所得、最终得数。',
        [10, 2, 7, 9],
        '12=10+2，10−3=7，7+2=9。',
      ),
      choice(
        process,
        'q8',
        '18−8的个位够减吗？本题是否需要退位？',
        ['需要', '不需要'],
        '不需要',
        '个位8减8够减，18−8=10。',
      ),
      fields(
        process,
        'q9',
        '10−9按破十法。依次填：10减9所得、原来的个位、最后得数。',
        [1, 0, 1],
        '10=10+0，10−9=1，1+0=1；0不是空白。',
      ),
      select(
        process,
        'q10',
        '17−8，选出所有正确的算法。',
        [
          'A：17−7=10，再10−1=9',
          'B：10−8=2，再7+2=9',
          'C：8+9=17，所以17−8=9',
          'D：先17−7，再把结果减8',
        ],
        ['A：17−7=10，再10−1=9', 'B：10−8=2，再7+2=9', 'C：8+9=17，所以17−8=9'],
        'A将8拆7和1，B破十，C想加算减；D累计减了15。',
      ),
      manual(
        process,
        'two-methods',
        '实际摆16张纸片减9，用平十与破十各做一次，每次恢复16再做；分别口述拆数、中间值和最后数量，逐个数回看。',
      ),
      manual(
        process,
        'inverse',
        '实际用两组9和7纸片拼成16，再恢复整体分别拿走9与7；写一条加法、两条减法并说明对应部分。',
      ),
      manual(
        process,
        'same-whole',
        '实际摆13张分成7与6，分别从原13求另一部分；每次恢复原整体，不持续拿走，写算式和单位。',
      ),
      manual(
        process,
        'paper',
        '在纸上按指定平十和破十各解释12−8一次，写每个中间式及得数；两种正确方法分别核对，不只检查最后4。',
      ),
      manual(
        process,
        'oral',
        '实际完成第5步的全部口算范围，逐式核对，特别比较10−9、18−8和19−9；记录真实错误与不会的式子，不能只浏览就确认完成。',
      ),
      manual(
        process,
        'explain',
        '实际向同伴或独自录下自己的口述，解释平十、破十和想加算减各一个例子；独自完成如实注明，不冒同伴已听或已同意。',
      ),
      reflect(
        process,
        'method-reflection',
        '我实际用了哪些方法？区分会说、能算和已摆材料的情况，未做另记。',
      ),
      reflect(
        process,
        'difficulty-reflection',
        '我哪里仍会漏减或忘记合并？记录真实困难，下一步计划不要当作已完成。',
      ),
      ...borrowCompleteMissing(false),
      ...borrowCompleteBranches(false),
      ...borrowProcessSourceTasks.map(([suffix, prompt]) => ({
        ...manual(process, `actual-source-${suffix}`, prompt),
        knowledge: `${process}-actual-source-${suffix}`,
      })),
    ],
    reviewQuestions: [
      fields(
        process,
        'r1',
        '14−8按平十法，依次填先减、再减、中间和最后得数。',
        [4, 4, 10, 6],
        '8=4+4，14−4=10，10−4=6。',
      ),
      fields(
        process,
        'r2',
        '17−9按破十法，依次填整十、原个位、10减9所得、最终得数。',
        [10, 7, 1, 8],
        '10−9=1，1+7=8。',
      ),
      fields(
        process,
        'r3',
        '依次填6+□=14、14−6=□。',
        [8, 8],
        '6+8=14，14−6=8。',
      ),
      choice(
        process,
        'r4',
        '15−5是否需要退位？',
        ['需要', '不需要'],
        '不需要',
        '个位5够减5，不必退位。',
      ),
      ...borrowCompleteMissing(true),
      ...borrowCompleteBranches(true),
    ],
  },
  {
    ...base,
    version: 2,
    review: {
      ...base.review,
      date: '2026-10-04',
      notes:
        '资源1221001102241图片14～28全部15页实际复核。补完整组对应的原创比较、连算、缺数、分支与原书独立实践；保留旧v1题目和学习快照，不以网页正确冒原活动实做或最终审校。',
    },
    id: relations,
    page: 17,
    title: '读题、整体与部分及退位应用',
    goal: '识别所求、无关条件、静态分类、原来数量和包含自己的队伍。',
    steps: [
      {
        title: '读已知与所求，辨认无关条件',
        activity: '实际画两种分类与读表，逐个回看同一个整体，未做请跳过。',
        text: '3个孩子共同做14件纸作品，其中红色8件，问其他颜色几件。3是人数，不能从作品数量中减3；14−8=6。已知经过几天也不等于吃了几个，先分清单位和对象。',
      },
      {
        title: '剩余、未完成与静态部分',
        text: '原13张送7张求剩余，用13−7；目标14件已完成8件求还需，用14−8。同一时刻14张分红8与蓝6是分类，不是新增或拿走。已拿走6还剩7求原来，需6+7，不是一律见本单元就用减法。',
      },
      {
        title: '隐藏部分，先确认条件完整',
        text: '整体15件，外面6件，其余在盒内；盒内15−6=9。不能只看外面6猜里面。相同16张卡可按红9/蓝7或里6/外10分别分类，总数仍16，不把两次分类相加成32。',
      },
      {
        title: '分行读表，保留单位',
        text: '下表是原创纸面商店，原有与售出逐行配对，A卡片、B贴纸单位张，C书签单位枚。只展示条件不填答案；减去其他行的售出数会错。网页读表不代表真实售卖或已实际画表。',
        visual: { kind: 'stock-table', variant: 'within-twenty' },
      },
      {
        title: '自己、间隔与回看',
        text: '全队16人，自己左边7人，右边16−7−1=8人，整体含自己。一排9个标记，每两个相邻之间一个空隙，共8个。自己编题须已知和所求完整，用部分加另一部分回看整体；实际画点、编题和交流另行记录。',
      },
      {
        title: '原书完整情境与三阶段读题',
        text: '原场景、车辆表、隐藏图、团扇和自己提问分别实际完成，写条件、所求、算式、单位、答句并回看。人数、天数和别的分类信息不能直接当当前部分；看不清原图数量保留待核对。',
      },
      {
        title: '同整体换分类，队伍包含自己',
        text: '同一份材料按颜色与位置分别分类，两次都恢复原整体，不把两已知部分连减。队伍右边用整体减左边再减自己1；处在队尾右边0合法，0和未填分清。本站新题与原天鹅、原队伍另记。',
      },
    ],
    questions: [
      number(
        relations,
        'q1',
        '3个孩子共同做14件纸作品，其中红色8件，其余蓝色。蓝色有几件？',
        6,
        '14−8=6件；3是人数不是件数。',
      ),
      number(
        relations,
        'q2',
        '原来17个水果，过了3天还剩8个，没有新增。吃了几个？',
        9,
        '17−8=9个；3天不是吃的数量。',
      ),
      choice(
        relations,
        'q3',
        '同一时刻14张纸片，红色8张、蓝色6张，这是什么关系？',
        ['整体与部分', '全部都是新增数量'],
        '整体与部分',
        '14是同一整体，8和6是静态两部分，未说明新增。',
      ),
      number(
        relations,
        'q4',
        '原有13张卡，送出7张，没有新增，还剩几张？',
        6,
        '13−7=6张。',
      ),
      number(
        relations,
        'q5',
        '总共15件，盒外6件，其余都在盒内。盒内几件？',
        9,
        '15−6=9件，整体与外面已知。',
      ),
      number(
        relations,
        'q6',
        '计划做14件，已完成8件，还需要做几件才达目标？',
        6,
        '14−8=6件，是未完成量。',
      ),
      fields(
        relations,
        'q7',
        '同16张卡按颜色红9张，其余蓝；按位置盒内6张，其余外。依次填蓝色和盒外张数。',
        [7, 10],
        '16−9=7，16−6=10；两次都从16开始。',
      ),
      fields(
        relations,
        'q8',
        '按表中A、B、C行依次填售出后剩余数量，A、B用张，C用枚。',
        [5, 6, 7],
        '12−7=5张，14−8=6张，16−9=7枚。',
        { kind: 'stock-table', variant: 'within-twenty' },
      ),
      number(
        relations,
        'q9',
        '14个正方形纸框和5个三角形纸框。取6个正方形框拼一个纸面立方体展开示意，正方形框还剩几个？',
        8,
        '14−6=8个，三角形5个不是正方形；6个框是一个示意的用量，不是6个立方体。',
      ),
      fields(
        relations,
        'q10',
        '全队16人，包括我。我左边7人。依次填：自己占几人、右边几人。',
        [1, 8],
        '16−7−1=8人，不能漏掉自己。',
      ),
      number(
        relations,
        'q11',
        '一排9个标记，每两个相邻标记之间一个空隙。空隙共有几个？',
        8,
        '9个标记之间8个相邻空隙，没有两端额外空隙。',
      ),
      number(
        relations,
        'q12',
        '拿走6张后还剩7张，没有新增，原来几张？',
        13,
        '拿走和剩下合成原来，6+7=13张。',
      ),
      manual(
        relations,
        'table',
        '实际画第4步表格，逐行标原有/售出/剩余并保留单位，列三个算式再用加法回看；是纸面模拟，不冒真实交易。',
      ),
      manual(
        relations,
        'classify',
        '实际制作16张卡：盒内红4蓝2，盒外红5蓝5。先按颜色分，再恢复按位置分，记录9/7与6/10、两次总16，不能合成32。',
      ),
      manual(
        relations,
        'frames',
        '实际画14个正方形框和5个三角形框，圈出6个正方形框，再数剩余；只做安全纸面示意，不需购买、切割或真实搭建。',
      ),
      manual(
        relations,
        'own-story',
        '实际编一个求剩余和一个求原来整体的问题，条件完整、单位相同，写算式、答句并回看；纸上另画含自己队伍核对人数。',
      ),
      reflect(
        relations,
        'read-reflection',
        '我实际怎样读出已知和所求、排除无关条件？纸面或交流未做请另记。',
      ),
      reflect(
        relations,
        'problem-reflection',
        '我在哪种问题仍会漏掉自己或误用加减？记真实经历与待做，不冒全部熟练。',
      ),
      ...borrowCompleteClassifications(false),
      ...borrowCompleteQueues(false),
      ...borrowRelationSourceTasks.map(([suffix, prompt]) => ({
        ...manual(relations, `actual-source-${suffix}`, prompt),
        knowledge: `${relations}-actual-source-${suffix}`,
      })),
    ],
    reviewQuestions: [
      number(
        relations,
        'r1',
        '2个孩子合做15件作品，其中红色7件，其余蓝色。蓝色几件？',
        8,
        '15−7=8件；人数2无关。',
      ),
      number(
        relations,
        'r2',
        '取走8张后还剩5张，没有新增，原来几张？',
        13,
        '8+5=13张，求原整体。',
      ),
      fields(
        relations,
        'r3',
        '新表A、B、C依次填剩余，注意原有和售出同行，张/张/枚。',
        [5, 6, 9],
        '13−8=5，15−9=6，17−8=9。',
        { kind: 'stock-table', variant: 'within-twenty-review' },
      ),
      fields(
        relations,
        'r4',
        '全队15人包括我，左边6人。依次填自己人数和右边人数。',
        [1, 8],
        '15−6−1=8，整体含自己。',
      ),
      ...borrowCompleteClassifications(true),
      ...borrowCompleteQueues(true),
    ],
  },
  {
    ...base,
    version: 2,
    review: {
      ...base.review,
      date: '2026-10-04',
      notes:
        '资源1221001102241图片14～28全部15页实际复核。补完整组对应的原创比较、连算、缺数、分支与原书独立实践；保留旧v1题目和学习快照，不以网页正确冒原活动实做或最终审校。',
    },
    id: organize,
    page: 20,
    title: '完整45式退位表与同差应用',
    goal: '明确完整表范围，比较规律、多种同差与两步计算，实际整理另行记录。',
    steps: [
      {
        title: '完整表包括10减几',
        activity: '实际制作45张纸卡并逐式口算核对，部分完成如实记录。',
        text: '被减数10～18，减数从9到1，只保留个位不够减的式子：10行9条、11行8条……18行1条，共45条。横杠表示此格不属退位范围，不是得数0。原36式模型仍用于原任务，不能当成完整表。自己逐张制作和口算核对另记实际完成。',
        visual: {
          kind: 'arithmetic-grid',
          mode: 'borrow-complete',
          hidden: [],
        },
      },
      {
        title: '一列与一行分开观察',
        text: '第一列减数固定9，被减数10到18，得数1到9。12行减数9到3，结果3到9；不属本表的12−2也可正确计算，只是个位够减。被减数不变、减数减少1，差增加1；减数不变、被减数增加1，差增加1。',
      },
      {
        title: '同一个差可以有很多式子',
        text: '13−6、15−8、16−9都得7。卡片按得数配成多张组，不强行只保留一对。同差寻找必须核对全部给出的选项，不能只看第一个正确式子。实际揭卡与游戏单独记录。',
      },
      {
        title: '遮数与两数相差5',
        text: '12−5=7，若□−6也等于7，被减数应13。给一组数选相差5的所有两数，例如7与2、8与3。先明确选择范围，顺序是大数减小数；不能把只找到一组当找全。',
      },
      {
        title: '两步分别算，0明确写',
        text: '14−8+5先得6，再得11；13−6−7先得7，再得0。0仍是已填写数。17、9、8可组成原17送9剩8、静态总17两部分9和8、或9+8求总数；必须把情境和所求说完整。',
      },
      {
        title: '回顾算法与解决问题',
        text: '计算方法、完整口算、整理纸表、提出问题和实际分享分开回看。移动固定减数9的小卡，可逐项算10、13、16、11、15、18、12、17、14、19减9，含19−9非退位对照。真实未做或部分完成要说明，不由点击课包宣称整组掌握。',
      },
      {
        title: '完整轮盘、配对、表格与口算',
        text: '原三轮盘、移动7条、左右两组配对、十五卡游戏、七食物连线和十二式口算全部核对。原表四要求各自完成，不把已给格当未填；原右两列按同得数配对包含5，不能套左组6/7/8目标。',
      },
      {
        title: '两边比较与遮数逐空回看',
        text: '先算两边结果再选大于、小于或等于，符号可以重复。遮数先读未知在哪个位置，缺加数用整体减已知部分，未知被减数用差加减数，再分别代回。原六比较和三个遮数组独立实做。',
      },
      {
        title: '三组连算与全部同差搭配',
        text: '本站补三组六条连算，每题先算第一步再最终结果，最终0不能留空。找差5须核对全部给定数，不另加跨排条件，原白菜同一排也可选。原11/15/22页整组、自己写同差式和原成长两方面另记实际，未做不冒完成。',
      },
    ],
    questions: [
      fields(
        organize,
        'q1',
        '依次填表内A、B、C、D隐藏式子的得数。',
        [1, 9, 8, 9],
        'A10−9=1，B10−1=9，C13−5=8，D18−9=9。',
        {
          kind: 'arithmetic-grid',
          mode: 'borrow-complete',
          hidden: [
            [0, 0],
            [0, 8],
            [3, 4],
            [8, 0],
          ],
        },
      ),
      number(
        organize,
        'q2',
        '被减数10～18、减数1～9，只保留个位不够减的所有式子，共有多少条？',
        45,
        '每行9、8……1条，共45条，包含10减几。',
      ),
      fields(
        organize,
        'q3',
        '表第一列减9，依次填10−9、14−9、18−9。',
        [1, 5, 9],
        '被减数增加、减数9不变，差1到9。',
      ),
      fields(
        organize,
        'q4',
        '12行按减数9到3排，依次填第一式12−9和最后式12−3的得数。',
        [3, 9],
        '第一3，最后9；不包含个位够减的12−2。',
      ),
      choice(
        organize,
        'q5',
        '减数固定9，被减数增加1，差怎样变？',
        ['增加1', '减少1', '不变'],
        '增加1',
        '减去同样9，被减数多1则差多1。',
      ),
      fields(
        organize,
        'q6',
        '被减数固定13，依次填13−5、13−4、13−3。最后一式个位够减，也能计算。',
        [8, 9, 10],
        '减数依次少1，差依次多1；13−3不属退位表。',
      ),
      select(
        organize,
        'q7',
        '选出所有得数7的式子。',
        ['13−6', '15−8', '16−9', '14−6'],
        ['13−6', '15−8', '16−9'],
        '前三式得7，14−6=8。',
      ),
      fields(
        organize,
        'q8',
        '12−5=7。依次填□−6=7的被减数、9−□=7的减数。',
        [13, 2],
        '13−6=7，9−2=7。',
      ),
      select(
        organize,
        'q9',
        '用给出的数2、3、7、8、12、13，选出所有差为5的式子。',
        ['7−2', '8−3', '12−7', '13−8', '13−7'],
        ['7−2', '8−3', '12−7', '13−8'],
        '四组相差5，13−7=6；必须选全四组。',
      ),
      fields(
        organize,
        'q10',
        '14−8+5，依次填第一步得数、最终得数。',
        [6, 11],
        '先14−8=6，再6+5=11。',
      ),
      fields(
        organize,
        'q11',
        '13−6−7，依次填第一步得数、最终得数。',
        [7, 0],
        '先得7，再7−7=0；0不是空白。',
      ),
      select(
        organize,
        'q12',
        '用17、9、8表达数量关系，选出所有完整且正确的故事。',
        [
          '原17张送9张剩8张',
          '同一时刻总17张红9张蓝8张',
          '红9张蓝8张，合计17张',
          '原9张送8张剩17张',
        ],
        [
          '原17张送9张剩8张',
          '同一时刻总17张红9张蓝8张',
          '红9张蓝8张，合计17张',
        ],
        '前三个分别减少、静态分类、合并；9−8=1不是17。',
      ),
      select(
        organize,
        'q13',
        '选出所有得数8的式子。',
        ['11−3', '12−4', '13−5', '14−5'],
        ['11−3', '12−4', '13−5'],
        '前三式得8，14−5=9。',
      ),
      manual(
        organize,
        'full-table',
        '实际制作45张卡：被减数10～18、减数9～1且个位不够减，按第1步排表；逐式口算、逐行核对9到1条。可分次做，未排全或未核全如实记部分并跳过完成确认。',
      ),
      manual(
        organize,
        'moving-strip',
        '实际制作固定减数9与第6步十个被减数的移动条，逐项口算、核对，区分19−9非退位；再独立移动减7核对同一列十数。不只浏览网页。',
      ),
      manual(
        organize,
        'same-difference',
        '实际制作13−6、15−8、16−9、11−3、12−4、13−5六张卡，按相同差分两组，实际揭卡核对；独自完成注明，不冒同伴游戏。',
      ),
      manual(
        organize,
        'own-equations',
        '在纸上各写至少两条差为7和差为8的不同式子，限定被减数10～18、减数1～9，逐条算回看，不把重复同式当新一种。',
      ),
      manual(
        organize,
        'stories',
        '实际用17、9、8编一个减少问题与一个静态部分问题，另画包含自己的队伍问题，写算式单位答句并实际解释；分享未做如实注明。',
      ),
      reflect(
        organize,
        'method-reflection',
        '我实际用了哪些计算方法、完成了多少排卡与口算？实际程度与未来安排分开。',
      ),
      reflect(
        organize,
        'relations-reflection',
        '我真正解决了哪些数量问题，怎样检查？游戏、材料或分享没做的部分另记。',
      ),
      ...borrowCompleteComparisons(false),
      ...borrowCompleteChains(false),
      ...borrowCompleteHidden(false),
      ...borrowCompletePairs(false),
      ...borrowOrganizeSourceTasks.map(([suffix, prompt]) => ({
        ...manual(organize, `actual-source-${suffix}`, prompt),
        knowledge: `${organize}-actual-source-${suffix}`,
      })),
    ],
    reviewQuestions: [
      fields(
        organize,
        'r1',
        '依次填新表A、B、C隐藏式子的得数。',
        [5, 4, 6],
        '10−5=5，12−8=4，15−9=6。',
        {
          kind: 'arithmetic-grid',
          mode: 'borrow-complete',
          hidden: [
            [0, 4],
            [2, 1],
            [5, 0],
          ],
        },
      ),
      select(
        organize,
        'r2',
        '选出所有得数6的式子。',
        ['11−5', '13−7', '15−9', '13−6'],
        ['11−5', '13−7', '15−9'],
        '前三式得6，13−6=7。',
      ),
      fields(
        organize,
        'r3',
        '14−6−8，依次填第一步和最后得数。',
        [8, 0],
        '14−6=8，8−8=0。',
      ),
      select(
        organize,
        'r4',
        '用数1、4、6、9、11、14，选出所有差为5的式子。',
        ['9−4', '14−6', '11−6', '6−1', '14−9'],
        ['9−4', '11−6', '6−1', '14−9'],
        '9−4、11−6、6−1、14−9均为5，14−6=8。',
      ),
      ...borrowCompleteComparisons(true),
      ...borrowCompleteChains(true),
      ...borrowCompleteHidden(true),
      ...borrowCompletePairs(true),
    ],
  },
];
