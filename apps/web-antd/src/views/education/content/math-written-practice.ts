import type { Lesson } from '../learning/types';

export const writtenPracticeLessons: Lesson[] = [
  {
    id: 'ml-written-compare',
    textbookTitle: '100以内的笔算加、减法',
    title: '展开计算、简写与顺序比较',
    page: 57,
    version: 1,
    status: 'available',
    prerequisite: '会数位、100以内加减与基本竖式，能区分个位数字和几个一。',
    goal: '联系分位计算和简写竖式，说明进退位标记，比较计算顺序而不否定合法算法。',
    parentTip:
      '依据实际核读的官方56～68页编写原创数值。展开过程与简写相互对应；先十位不是一律非法，但进退位后必须修正。纸笔、摆棒和口述只按实际记录，未做可跳过。',
    review: {
      date: '2026-10-03',
      reviewer: '官方正文核读与原创方法独立核对',
      notes:
        '官方资源1221001102241图片62～74实际查看。本课对应57～59、62～63、66、68页的方法比较，不冒充整章课后覆盖或教师最终审校。',
    },
    steps: [
      {
        title: '分位计算与简写表示同一数量',
        text: '42+25可以先求40+20得60、2+5得7，再合成67。也可先算个位再算十位。不进位时先十位再合回个位是合法算法，顺序不同不能直接判错。简写竖式把60的6写在十位、7写在个位，不把60整个挤到十位。',
        activity: '实际把展开记录与简写竖式连起来，指明相同数位。',
        visual: { kind: 'column', left: 42, right: 25, operator: '+' },
      },
      {
        title: '进来的小1表示一个十',
        text: '38+26先有50和14个一。14个一换成1个十、4个一，和原50合成64。小1记的是1个十，不是1个一，也不是增加的新物品。若先把3+2写成5个十，后来进1就必须把十位改为6；从个位开始便于避免回改。',
        activity: '实际写展开和简式，指着进1说明单位。',
        visual: { kind: 'column', left: 38, right: 26, operator: '+' },
      },
      {
        title: '退位改变原来的十分组',
        text: '63−28把6个十和3个一换为5个十和13个一，数量仍63。个位13−8得5，十位5−2得3，结果35。若十位先算6−2得4，后来退1就必须修正成3，不能还用4。70−26先换成6个十、10个一，0不是不能减。',
        activity: '实际拆一捆并核对总量不变，再算各数位。',
        visual: { kind: 'column', left: 63, right: 28, operator: '-' },
      },
      {
        title: '一位数对齐与结果里的0',
        text: '8+47中8仍是8个一，放在哪一行都对个位，不能按80相加。47−42得5，写结果5即可，不必在前面保留十位0；70等两位数的个位0要保留。有没有必要写0，要看数位位置，不能一律省略。',
        activity: '实际写一位数在前的加法与结果一位数的减法。',
        visual: { kind: 'column', left: 8, right: 47, operator: '+' },
      },
      {
        title: '比较便利性并检查原关系',
        text: '标准简写从个位开始便于处理进退位，但分位展开或先十位后完整修正也可算对。检查时说清数量与单位，用和减一个加数，或差加减数，回到原来的量。填数正确不等于已经完成纸笔或口述。',
        activity: '实际比较两种记录，说出自己的理由；尚不明白可以如实记录。',
      },
    ],
    questions: [
      {
        id: 'ml-written-compare-q1',
        knowledge: 'ml-written-compare',
        prompt:
          '42+25分位展开：依次填十的部分之和（按原数量）、个位之和、合起来的结果。',
        rule: { kind: 'steps', values: [60, 7, 67] },
        hint: '十的部分是40和20，不是数字4和2。',
        explanation: '40+20=60，2+5=7，合起来67。',
        visual: { kind: 'column', left: 42, right: 25, operator: '+' },
      },
      {
        id: 'ml-written-compare-q2',
        knowledge: 'ml-written-compare',
        prompt: '计算42+25，先算40+20，再算2+5，最后合起来。这种方法怎样？',
        rule: { kind: 'choice', value: '合法，数量和单位对应' },
        choices: [
          { id: '合法，数量和单位对应', label: '合法，数量和单位对应' },
          { id: '先十位一律算错', label: '先十位一律算错' },
          { id: '只算十位就结束', label: '只算十位就结束' },
        ],
        hint: '检查每部分是否完整计算并合回原数量。',
        explanation: '这题没有进位，先十的部分再个位是合法算法。',
      },
      {
        id: 'ml-written-compare-q3',
        knowledge: 'ml-written-compare',
        prompt:
          '38+26：依次填换十前的个一数、原十的部分之和（按数量）、换出的十数、结果个位、结果十位、结果。',
        rule: { kind: 'steps', values: [14, 50, 1, 4, 6, 64] },
        hint: '原十的部分之和还未包含个位换来的十；最终十位要包含它。',
        explanation: '14个一换1十4一，50+10+4=64。原50不是最终60。',
        visual: { kind: 'column', left: 38, right: 26, operator: '+' },
      },
      {
        id: 'ml-written-compare-q4',
        knowledge: 'ml-written-compare',
        prompt: '38+26有哪些完整合法算法？选全。',
        rule: {
          kind: 'set',
          values: ['先个位，进1后十位得6', '先十的部分50，再合14得64'],
        },
        choices: [
          { id: '先个位，进1后十位得6', label: '先个位，进1后十位得6' },
          { id: '先十的部分50，再合14得64', label: '先十的部分50，再合14得64' },
          { id: '十位先写5，进1后仍不改', label: '十位先写5，进1后仍不改' },
          { id: '把14整个写在个位', label: '把14整个写在个位' },
        ],
        hint: '进位不改变总数量，但要在十位计入换来的十。',
        explanation:
          '两种正确算法完整保留14个一。错误不是先十位本身，而是漏掉修正或数位记录错误。',
      },
      {
        id: 'ml-written-compare-q5',
        knowledge: 'ml-written-compare',
        prompt: '38+26简写竖式中，记在十位处的小1表示什么？',
        rule: { kind: 'choice', value: '从个位换来的1个十' },
        choices: [
          { id: '从个位换来的1个十', label: '从个位换来的1个十' },
          { id: '多出来的1个一', label: '多出来的1个一' },
          { id: '新增加的1件物品', label: '新增加的1件物品' },
        ],
        hint: '想10个一换成什么单位。',
        explanation: '小1表示1个十，换捆不凭空增加物品。',
      },
      {
        id: 'ml-written-compare-q6',
        knowledge: 'ml-written-compare',
        prompt:
          '63−28：依次填退位后原数的个十数、个一数、结果十位、结果个位、结果。前两空在减28之前记录。',
        rule: { kind: 'steps', values: [5, 13, 3, 5, 35] },
        hint: '退位后总数量仍63；再分别减2个十和8个一。',
        explanation: '63换为5十13一，13−8=5，5−2=3，得35。',
        visual: { kind: 'column', left: 63, right: 28, operator: '-' },
      },
      {
        id: 'ml-written-compare-q7',
        knowledge: 'ml-written-compare',
        prompt:
          '70−26：依次填退位后原数的个十数、个一数、结果十位、结果个位、结果。前两空在减26之前记录。',
        rule: { kind: 'steps', values: [6, 10, 4, 4, 44] },
        hint: '0个一可从十位换来10个一，但十位要少1。',
        explanation: '70换为6十10一，再减2十6一得到4十4一。',
        visual: { kind: 'column', left: 70, right: 26, operator: '-' },
      },
      {
        id: 'ml-written-compare-q8',
        knowledge: 'ml-written-compare',
        prompt: '47−42得5。怎样写结果合适？',
        rule: { kind: 'choice', value: '写5即可，前面的十位0可省' },
        choices: [
          { id: '写5即可，前面的十位0可省', label: '写5即可，前面的十位0可省' },
          { id: '把5写成50', label: '把5写成50' },
          { id: '所有位置的0都可省', label: '所有位置的0都可省' },
        ],
        hint: '一位数前的0不改变数值，两位数个位的0却有占位作用。',
        explanation: '结果5不必保留前导0；不能据此把70写成7。',
      },
      {
        id: 'ml-written-compare-q9',
        knowledge: 'ml-written-compare',
        prompt:
          '8+47分位展开：依次填个位之和、原十的部分之和（按数量）、最终结果。',
        rule: { kind: 'steps', values: [15, 40, 55] },
        hint: '8是一位数，表示8个一，写在第一行也不变成80。',
        explanation: '8+7=15，0+40=40，40+15=55。',
        visual: { kind: 'column', left: 8, right: 47, operator: '+' },
      },
      {
        id: 'ml-written-compare-q10',
        knowledge: 'ml-written-compare',
        prompt: '8+47中哪些说法正确？选全。',
        rule: {
          kind: 'set',
          values: ['8要对准7所在的个位', '先写哪一行不改变各数的值'],
        },
        choices: [
          { id: '8要对准7所在的个位', label: '8要对准7所在的个位' },
          { id: '先写哪一行不改变各数的值', label: '先写哪一行不改变各数的值' },
          { id: '8写在第一行就对十位', label: '8写在第一行就对十位' },
        ],
        hint: '对齐看数位，不看第一行或第二行。',
        explanation: '一位数对个位，与放在哪一行无关。',
      },
      {
        id: 'ml-written-compare-q11',
        knowledge: 'ml-written-compare',
        prompt: '63−28，先写十位6−2得4，接着发现个位要退1。哪种处理正确？',
        rule: { kind: 'choice', value: '十位再少1，改成3，个位得5' },
        choices: [
          {
            id: '十位再少1，改成3，个位得5',
            label: '十位再少1，改成3，个位得5',
          },
          { id: '保留十位4，个位得5', label: '保留十位4，个位得5' },
          { id: '先十位，所以永远不能算对', label: '先十位，所以永远不能算对' },
        ],
        hint: '退位改变了原十位数量，需要回改；标准从个位开始便于避免回改。',
        explanation: '完整修正可得到35。漏掉退1才会错误得到45。',
      },
      {
        id: 'ml-written-compare-q12',
        knowledge: 'ml-written-compare',
        prompt: '42+25=67，用减法检查：分别填67−25、67−42。每式从原条件开始。',
        rule: { kind: 'steps', values: [42, 25] },
        hint: '每次从完整的和减去其中一个部分，不连续减。',
        explanation: '67−25=42、67−42=25，分别回到另一个加数。',
      },
      {
        id: 'ml-written-compare-q13',
        knowledge: 'ml-written-compare',
        prompt:
          '34+25简写：依次填向十位进的十数、结果个位、结果十位。不进位要明确填0。',
        rule: { kind: 'steps', values: [0, 9, 5] },
        hint: '4+5没有满十；没有进位与空着未填不同。',
        explanation: '不进位记0，个位9、十位5，合起来59。',
        visual: { kind: 'column', left: 34, right: 25, operator: '+' },
      },
      {
        id: 'ml-written-compare-original-add',
        knowledge: 'ml-written-compare',
        prompt:
          '实际合法阅读教材57～59页，对照原例的分位展开与简写，分别列式计算原做一做并检查一位数对齐和进位。指原图说明，不把本站数值当原书。没有教材可跳过原图活动。',
        rule: { kind: 'manual' },
        hint: '先实际阅读和计算，未做或只准备请跳过。',
        explanation: '原教材活动与网页作答独立；不自动确认纸笔完成。',
      },
      {
        id: 'ml-written-compare-paper-add',
        knowledge: 'ml-written-compare',
        prompt:
          '实际在纸上给42+25和38+26各写分位展开与简写竖式，连出十、个位对应处，说明何时进1和小1单位。',
        rule: { kind: 'manual' },
        hint: '写两种记录，并实际指着讲解；仅看屏幕不能确认。',
        explanation: '按真实书写和说明确认，未做可跳过。',
      },
      {
        id: 'ml-written-compare-original-sub',
        knowledge: 'ml-written-compare',
        prompt:
          '实际合法阅读教材62～63页，分别计算例题与做一做，画出或摆出退位前后的十和一，检查原总量不变。另读66页展开与简式对应、68页两项方法成长问题。没有教材可跳过原图活动。',
        rule: { kind: 'manual' },
        hint: '实际完成阅读、计算和说明，未做跳过。',
        explanation: '本任务不替代其它页完整课后练习或自动给成长评星。',
      },
      {
        id: 'ml-written-compare-paper-sub',
        knowledge: 'ml-written-compare',
        prompt:
          '实际用纸画或小棒表示63−28和70−26，每题重新摆原数，拆一十后检查原总量，再拿去减数，写两种记录核对。',
        rule: { kind: 'manual' },
        hint: '换捆不改变原量，实际减去后才变数量。',
        explanation: '网页填数不确认真实材料操作，未做可跳过。',
      },
      {
        id: 'ml-written-compare-order',
        knowledge: 'ml-written-compare',
        prompt:
          '实际给不进位加法、进位加法、退位减法各选一例，尝试先个位与先十位两种完整算法；在需要回改处做记号，说明哪种记录更方便。',
        rule: { kind: 'manual' },
        hint: '自己的数值与方法，只要完整保留数量即可讨论；不要把先十位一律判错。',
        explanation:
          '尝试和解释按实际记录，计划另写，不要求把不便利的方法当标准简写。',
      },
      {
        id: 'ml-written-compare-align',
        knowledge: 'ml-written-compare',
        prompt:
          '实际写8+47和47−42，指着一位数对齐处讲解；再用5与70比较哪些0可省、哪些0不能省。',
        rule: { kind: 'manual' },
        hint: '分别实际书写并说明位置，不由正确数字代替口述。',
        explanation: '记录真实纸笔与表达，未做可跳过。',
      },
      {
        id: 'ml-written-compare-reflect-unit',
        knowledge: 'ml-written-compare',
        prompt:
          '如实记录：你实际怎样解释进位小1或退去1的单位？还不清楚的地方也写下来。',
        rule: { kind: 'reflection' },
        hint: '可以家长代写原话，未做讲解就如实写未做；未来计划另外记。',
        explanation: '反思不评分，不当作实物或口述已完成。',
      },
      {
        id: 'ml-written-compare-reflect-order',
        knowledge: 'ml-written-compare',
        prompt:
          '如实记录：你实际比较过哪些计算顺序？哪里需要回改、为什么从个位开始方便？未做或不明白可如实写。',
        rule: { kind: 'reflection' },
        hint: '自己的观察和疑问，不照抄示例冒完成。',
        explanation: '保存原话，correct为null，计划不算完成。',
      },
    ],
    reviewQuestions: [
      {
        id: 'ml-written-compare-review1',
        knowledge: 'ml-written-compare',
        prompt:
          '53+26分位展开：依次填十的部分之和（按数量）、个位之和、合起来的结果。',
        rule: { kind: 'steps', values: [70, 9, 79] },
        hint: '换了数值，分别计算十和一再合起来。',
        explanation: '50+20=70，3+6=9，得79。',
        visual: { kind: 'column', left: 53, right: 26, operator: '+' },
      },
      {
        id: 'ml-written-compare-review2',
        knowledge: 'ml-written-compare',
        prompt:
          '46+36：依次填换十前的个一数、原十的部分之和（按数量）、换出的十数、结果个位、结果十位、结果。',
        rule: { kind: 'steps', values: [12, 70, 1, 2, 8, 82] },
        hint: '最后的十位要计入换来的十。',
        explanation: '12个一换1十2一，70+10+2=82。',
        visual: { kind: 'column', left: 46, right: 36, operator: '+' },
      },
      {
        id: 'ml-written-compare-review3',
        knowledge: 'ml-written-compare',
        prompt:
          '84−39：依次填退位后原数的个十数、个一数、结果十位、结果个位、结果。前两空在减39之前记录。',
        rule: { kind: 'steps', values: [7, 14, 4, 5, 45] },
        hint: '退位后先核对原量84，再减39。',
        explanation: '7十14一减3十9一，余4十5一，即45。',
        visual: { kind: 'column', left: 84, right: 39, operator: '-' },
      },
      {
        id: 'ml-written-compare-review4',
        knowledge: 'ml-written-compare',
        prompt:
          '9+61分位展开：依次填个位之和、原十的部分之和（按数量）、最终结果。',
        rule: { kind: 'steps', values: [10, 60, 70] },
        hint: '一位数对个位，结果个位0要保留。',
        explanation: '9+1=10、0+60=60，60+10=70。',
        visual: { kind: 'column', left: 9, right: 61, operator: '+' },
      },
    ],
  },
];
