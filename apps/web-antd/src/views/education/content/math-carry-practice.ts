import type { Lesson, Question, Visual } from '../learning/types';

import {
  carryOrganizeCompleteQuestions,
  carryOrganizeSourceTasks,
  carryProcessCompleteQuestions,
  carryProcessSourceTasks,
  carryRelationsSourceTasks,
} from './math-carry-complete-practice';

const base = {
  textbookTitle: '20以内的进位加法',
  version: 1,
  status: 'available' as const,
  prerequisite:
    '先能分合10和读写20以内的数；纸笔、数卡、小棒按实际准备，缺材料可跳过。',
  parentTip:
    '参照人教上册88～102页编写原创例子。步骤题仅核对题目指定的凑十方法，不否定其他正确方法。纸面图、网页移动不是实物操作；完整口算、排卡、讨论与反思分别记录，不用少数网页题替代整页教材活动。',
  review: {
    date: '2026-10-03',
    reviewer: '官方教材88～102页实际阅读与原创任务程序核对',
    notes:
      '资源1221001101241图片94～108逐页实际查看。保留原9加几、8/7/6加几、小数加几三课v1，补独立过程、关系与整理课。只发布原创任务，不发布原教材扫描、图画或全文；学校采用版本仍需单独确认。',
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
    hint: '先看清所求和各部分，再按题目说明的顺序填写；0不是未作答。',
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
): Question {
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
): Question {
  return task(id, suffix, prompt, { kind: 'number', value }, explanation);
}
function choice(
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
    explanation,
    undefined,
    labels,
  );
}
function makeTen(
  id: string,
  suffix: string,
  left: number,
  right: number,
  target: 'left' | 'right',
): Question {
  const kept = target === 'left' ? left : right;
  const split = target === 'left' ? right : left;
  const needed = 10 - kept;
  const remaining = split - needed;
  if (needed < 0 || remaining < 0) throw new Error('Invalid make-ten task');
  return fields(
    id,
    suffix,
    `${left}+${right}：本题指定先把${kept}凑成10，将${split}拆开。图中先凑的${kept}放在上组，拆开的${split}放在下组，必要时先交换两组位置。依次填：拿出几个、剩下几个、先凑得多少、最后的和。`,
    [needed, remaining, 10, left + right],
    `${split}分成${needed}和${remaining}，${kept}+${needed}=10，10+${remaining}=${left + right}。这是本题指定的方法，不是唯一正确策略。`,
    { kind: 'ten-frame', left: kept, right: split },
  );
}
function manual(id: string, suffix: string, prompt: string): Question {
  return task(
    id,
    suffix,
    prompt,
    { kind: 'manual' },
    '只记录是否实际完成，不自动判断口算、纸笔、摆放或解释质量。缺材料或没做请跳过；未来计划另记。',
  );
}
function reflect(id: string, suffix: string, prompt: string): Question {
  return task(
    id,
    suffix,
    prompt,
    { kind: 'reflection' },
    '按真实经历记录，反思没有统一正确答案，不计客观正确率。',
  );
}
const process = 'mu-carry-process';
const relations = 'mu-carry-relations';
const organize = 'mu-carry-organize';
export const carryPracticeLessons: Lesson[] = [
  {
    ...base,
    id: process,
    version: 2,
    page: 89,
    title: '凑十过程与不同算法',
    goal: '分开记录拆数、凑十与最后结果，比较接着数和两种凑十方法。',
    steps: [
      {
        title: '数完一组，接着数另一组',
        activity: '实际摆两组材料，用接着数和凑十各算一次，恢复原两组再比较。',
        text: '摆9个纸片和6个纸片。先从9接着数10、11……，另一组每数一个就移到已数位置，避免重漏。恢复原两组，再从6中拿1个填满9的十格，留下5个。物品总数没有因移动而改变。自己的教材第88页引入图可合法阅读时再选两类点数，缺原书跳过原图任务。',
        visual: { kind: 'ten-frame', left: 9, right: 6 },
      },
      {
        title: '一步一个字段，不只填得数',
        text: '8缺2、7缺3、6缺4才能满10。将另一加数分为所需和剩余，分别记拿出量、剩余量、凑成的10和最后总数。凑成10与最后结果可能不同，也可能恰好相同；9+1剩余0要明确写0。',
        visual: { kind: 'ten-frame', left: 8, right: 5 },
      },
      {
        title: '同一个算式可以先凑不同的一组',
        text: '8+7可以从7中拿2先补满8，也可以从8中拿3先补满7；恢复原两组分别做。两种方法都得15，步骤不同不表示一种错误。网页步骤题会明确指定哪组先凑十，口述活动允许自己的其他正确方法。',
        visual: { kind: 'ten-frame', left: 8, right: 7 },
      },
      {
        title: '交换加数，再算小数加几',
        text: '4+9与9+4是同两组物品交换顺序，和不变。选择较大一组先凑十可少移动材料。也可用已经会的结果解释，不能为了统一形式把所有正确解法强行改成同一种。',
      },
      {
        title: '口算整组，分类和游戏分别实际做',
        text: '9、8分别加0～10；7分别加3～9，6分别加4～9，5加5～9、4加6～9、3加7～9、2加8～9。逐个读式、说得数并用材料或同伴核对，记录真实困难，不由少数网页题宣称整组熟练。用不同算式卡按相同和匹配，再用两边数卡交换一张，使两边的和相等。没有同伴可独自揭卡核对，如实记录。',
      },
      {
        title: '整组六关系与六个缺加数分别检查',
        text: '比较前先算两边，等于不能当大于或小于；六条分别核对。补加数由整体找缺少部分，再填回原式。相邻数卡的中间一张分别参与左右两组，并非把八数连加。连加的第一步和最后和分开，相关两加数式与它有同一整体。',
      },
      {
        title: '原圈画、轮盘与交换游戏分别实做',
        text: '89～95页的每组原练习按说明全部处理：两图、三组配对、九行圈十、三轮盘、四组换顺序、三枝计算、原全部卡、四次移动口算、七条相邻连接与原三数交换均回书核对；本站变式与原书实做分开保存，缺原书可待做。',
      },
    ],
    questions: [
      makeTen(process, 'q1', 9, 6, 'left'),
      makeTen(process, 'q2', 8, 5, 'left'),
      makeTen(process, 'q3', 7, 6, 'left'),
      makeTen(process, 'q4', 6, 7, 'left'),
      makeTen(process, 'q5', 4, 9, 'right'),
      makeTen(process, 'q6', 8, 7, 'left'),
      makeTen(process, 'q7', 8, 7, 'right'),
      makeTen(process, 'q8', 9, 1, 'left'),
      number(
        process,
        'q9',
        '8+7=15。同两组交换位置后，7+8等于多少？',
        15,
        '只交换加数位置，没有添走物品，和仍是15。',
      ),
      makeTen(process, 'q10', 5, 9, 'right'),
      manual(
        process,
        'scene',
        '实际阅读自己可合法使用的教材第88页引入图，选两类分别点数，写两组数量；缺原书请跳过，本站十格不是原图。',
      ),
      manual(
        process,
        'two-methods',
        '实际摆9和6，用接着数与凑十各做一次，恢复原两组再做；口述每次移动、剩余和总数，并与物品逐个数核对。',
      ),
      manual(
        process,
        'two-targets',
        '实际摆8和7，先补满8，恢复后再先补满7；各写拆数和中间式，说两种方法为何同得15。',
      ),
      manual(
        process,
        'oral',
        '按第5步全部指定口算范围，逐式口算并逐式核对，特别含加0、恰好10和加10；记录没把握的式子，不把“准备做”记成完成。',
      ),
      manual(
        process,
        'match',
        '制作8+5、9+4、7+6、6+6、8+4、9+3六张原创卡，实际按相同和分成两组，轮流或独自揭卡核对；把原卡恢复后再换一轮。',
      ),
      manual(
        process,
        'swap',
        '左边摆2、7两张卡，右边摆3、8；从每边各取一张互换，实际找到两边和相等的方法，并说两边总和变化。没找到或没实际做可如实跳过，不能只勾计划。',
      ),
      reflect(
        process,
        'method-reflection',
        '我实际用了哪些算法？哪一个步骤曾填错？记真实经历，没做的操作另写待做。',
      ),
      reflect(
        process,
        'oral-reflection',
        '整组口算中我仍不确定哪些算式？实际核对到哪里？不要用网页得分证明口算全部熟练。',
      ),
      ...carryProcessCompleteQuestions(false),
      ...carryProcessSourceTasks.map(([key, prompt]): Question => ({
        ...manual(process, `actual-source-${key}`, prompt),
        knowledge: `${process}-actual-source-${key}`,
      })),
    ],
    review: {
      ...base.review,
      date: '2026-10-04',
      notes: `${base.review.notes} 重新实际核对88～102页，保留v1题目、复习与步骤前缀，v2补完整原书活动独立人工记录和原创成套练习；原图不发布，旧快照/schema1保持。`,
    },
    reviewQuestions: [
      makeTen(process, 'r1', 9, 8, 'left'),
      makeTen(process, 'r2', 8, 4, 'left'),
      makeTen(process, 'r3', 3, 8, 'right'),
      makeTen(process, 'r4', 6, 4, 'left'),
      ...carryProcessCompleteQuestions(true),
    ],
  },
  {
    ...base,
    id: relations,
    version: 2,
    page: 96,
    title: '同一整体、不同分法与实际问题',
    goal: '先辨所求整体与部分，解释拿走后求原总数为什么用加法。',
    steps: [
      {
        title: '同一批事物，换标准分两部分',
        activity: '实际取14张双属性卡，按两种标准恢复重分，各列部分加整体。',
        text: '一组14张卡，6张圆形、8张方形，同时其中9张有点、5张没点。按形状分和按有没有点分都在数同一批14张。两种分法不能再相加成28，也不能把“6圆形”和“9有点”当作不重合的两组。卡片要实际具备所说两种属性。',
      },
      {
        title: '看问题，不凭“拿走”选减法',
        text: '盒里原有一些纸片，借走7张还剩8张，问原有多少：借走和剩下是原来整体的两部分，所以7+8。若已知原来15、借走7，问剩下，则是15−7。同一情境换所求，方法也会变。先复述已知、所求，再画图、列式、单位与答句，最后回看。',
      },
      {
        title: '表格数量有单位',
        text: '两栏分别是甲组和乙组数量，不同事物分行。9条鱼与4条鱼可以合成13条鱼；7朵花与6朵花合成13朵花。不把条和朵合成“26条鱼”。也要区分同一整体重复分类与真实两组不重合的数量。',
      },
      {
        title: '排队的人数别漏掉自己',
        text: '前面6人、后面8人，是不含自己的两部分。求全队要6+8+1；仅求其他人则6+8。图上标好自己，再一一对应检查，不能把自己漏掉或重复加两次。',
      },
      {
        title: '加数变化与回看',
        text: '同一加数不变，另一加数多2，和也多2；可实际添材料核对。用整体与已知部分求未知加数时，先说缺的是哪一部分。编自己的完整问题，再检查已知、所求、算式和单位是否一致，不把静态的两类描述成发生了进入或离开的事件。',
      },
      {
        title: '原三行数量表和各生活问题逐一回看',
        text: '三行体育用品按各自单位分别合并；不同物品不能混成一个总物品。同一批人按两标准分仍为同一整体。领走、吃掉、借走与剩下都须先辨所求，原前后排队人数不含自己时另计本人；各原例题和故事各自完成表示、算式、单位、答句与回看。',
      },
    ],
    questions: [
      fields(
        relations,
        'q1',
        '同14张卡按形状分为6和8，按点分为9和5。依次填两种分法得到的总张数。',
        [14, 14],
        '同一整体的两种分法都得14，不应把两个14再相加。',
      ),
      number(
        relations,
        'q2',
        '借走7张纸片后还剩8张，原来共有多少张？',
        15,
        '借走7和剩下8合起来才是原来整体，7+8=15。',
      ),
      number(
        relations,
        'q3',
        '吃掉4块饼干，还剩9块，原来有多少块？',
        13,
        '求原来整体，4+9=13，不是用“吃掉”直接判断减法。',
      ),
      number(
        relations,
        'q4',
        '屋里有6人，屋外有8人，他们是互不重复的两组，一共有多少人？',
        14,
        '6+8=14；只是两组的位置描述，不表示发生了新进入。',
      ),
      number(
        relations,
        'q5',
        '我前面有6人，后面有8人，都不含我，全队共有多少人？',
        15,
        '6+8还没含自己，再加1得到15。',
      ),
      fields(
        relations,
        'q6',
        '数量表：鱼为甲组9条乙组4条，花为甲组7朵乙组6朵。依次填鱼的总条数、花的总朵数。',
        [13, 13],
        '分行合并相同事物，两个13各有自己的单位，不混成26条鱼。',
      ),
      number(
        relations,
        'q7',
        '8+4换成8+6，第一个加数不变，和比原来多多少？',
        2,
        '另一个加数多2，和也多2，不是问新和14。',
      ),
      number(
        relations,
        'q8',
        '9+□=14，□应填几？',
        5,
        '14是整体，9是已知部分，另一部分5。',
      ),
      choice(
        relations,
        'q9',
        '拿走6支铅笔后还剩7支，问原来几支，应将6和7怎样计算？',
        ['加', '减'],
        '加',
        '求原来整体，要把拿走和剩下两部分合并。',
      ),
      number(
        relations,
        'q10',
        '甲盒7张、乙盒5张，是两盒互不重复的纸片，合起来共有多少张？',
        12,
        '真实两组不重合才可合并，7+5=12。',
      ),
      manual(
        relations,
        'classify',
        '制作14张卡：圆形中4有点2无点，方形中5有点3无点；实际先按形状分，再恢复按点分。写两条加法和各自总数，说明为何不是28。',
      ),
      manual(
        relations,
        'whole',
        '实际摆15张纸片，先拿出7张再看剩余；分别提出求原来总数与求剩余两个问题，画表示、列式、写单位与答句并逐个数回看。',
      ),
      manual(
        relations,
        'table',
        '实际画两组两行表：鱼9条与4条、花7朵与6朵，分行摆相应纸卡、算总数，说相同得数为何仍有不同单位。',
      ),
      manual(
        relations,
        'queue',
        '在纸上画15个标记，圈出自己，另数前6和后8；求全队和其他人分别列式，逐个点数核对，不安排真实危险场所排队。',
      ),
      manual(
        relations,
        'stories',
        '实际画或摆两组纸片，编两个已知和所求完整的加法问题；至少一个求拿走前整体，写算式、单位与答句，并解释静态分类和实际变动的不同。',
      ),
      reflect(
        relations,
        'whole-reflection',
        '哪些问题求整体、哪些求部分？我实际如何回看？没完成的材料活动另记。',
      ),
      reflect(
        relations,
        'application-reflection',
        '我真正提出或解决了什么生活问题？记录真实尝试，不把未来计划当作完成。',
      ),
      ...carryRelationsSourceTasks.map(([key, prompt]): Question => ({
        ...manual(relations, `actual-source-${key}`, prompt),
        knowledge: `${relations}-actual-source-${key}`,
      })),
    ],
    review: {
      ...base.review,
      date: '2026-10-04',
      notes: `${base.review.notes} 重新实际核对88～102页，保留v1题目、复习与步骤前缀，v2补完整原书活动独立人工记录和原创成套练习；原图不发布，旧快照/schema1保持。`,
    },
    reviewQuestions: [
      number(
        relations,
        'r1',
        '借走5张后还剩9张，原来多少张？',
        14,
        '原来整体是5+9=14。',
      ),
      number(
        relations,
        'r2',
        '我前面4人、后面7人，全队多少人？',
        12,
        '包含自己，4+7+1=12。',
      ),
      fields(
        relations,
        'r3',
        '同13张卡按颜色分为5和8，按形状分为6和7。依次填两次分类的总张数。',
        [13, 13],
        '同一整体换标准，仍是13。',
      ),
      number(
        relations,
        'r4',
        '7+4变成7+7，和比原来多多少？',
        3,
        '另一加数增加3，和增加3。',
      ),
    ],
  },
  {
    ...base,
    id: organize,
    version: 2,
    page: 100,
    title: '整理加法表、同和分法与拼棒',
    goal: '实际整理完整范围的算式卡，辨认恰好10、重复次序与共有边。',
    steps: [
      {
        title: '先说表格的范围',
        activity: '实际制作两加数1～9且和至少10的45张有序算式卡，按和整理。',
        text: '本次纸面表格只用1～9两个加数，保留左右次序，和至少10。9+1和1+9都在表里；恰好10也在，不能只保留大于10。按和10～18分9行，每行从左加数大到小排：10行9张、11行8张……18行1张，总45张。网页的通用加法表还显示和小于10的格，先依本次范围挑出相应卡；它不是教材原版图。',
        visual: {
          kind: 'arithmetic-grid',
          mode: 'sum-grid',
          hidden: [],
          marked: [10, 11, 18],
        },
      },
      {
        title: '横向与纵向分别观察',
        text: '纸表同一行和相同，一边加数少1、另一边多1；从每行第一张往下看，左加数都是9，右加数1到9，和10到18。口述后用实际材料验证，不能由表形状猜任意格。通用网页表行列安排不同，应明确当前观察的是自己整理的纸表。',
      },
      {
        title: '和为11～20，重新说明允许的加数',
        text: '现在改为两个正整数相加，和为11～20，不再限定每个加数最大9。按左加数1起，逐一找另一加数，包含左右交换；如20能有10+10、1+19等。不能把前一张1～9表格中没有20说成20无法拆成两个正数。纸卡完整列出，网页开放分合每次只核对自己的一种分法。',
      },
      {
        title: '补加数、选符号与配对游戏',
        text: '回看整体和已知部分找未知加数，比较不同式子同一个和。用卡片轮流口算、找同和伙伴，说明实际对了哪里和还不会哪里。只准备卡片不算玩完，独自核对也不冒充同伴游戏。',
      },
      {
        title: '拼棒先数共有边',
        text: '纸棒摆一个正方形需4根，分开两个需8根；让两个正方形相邻且正好共用一整条边，只需7根。两个三角形分开需6根，正好共一整条边需5根。每次明确形状和拼法后逐根数，不能说任意拼两个图形都可少一根。恢复后再组合自己的新图、提出数量问题，实际核对。',
      },
      {
        title: '计算方法与解决问题分开回顾',
        text: '分别记会用什么算法、解决了什么实际问题和仍待做什么。方法会说不代表整组口算熟练；完成网页不代表已经实际排卡、拼棒或与同伴交流。',
      },
      {
        title: '完整关系、两边未知与四个符号',
        text: '数与式、式与式都先计算两边；补加数在加号左右不改变整体与部分关系。选择加减符号要分别代回，不靠数字位置或关键词。主练习与复习更换条件，保留每条作答历史。',
      },
      {
        title: '原完整表、卡片和拼棒各自核对',
        text: '原表的补全部空、任指口算、第一行和第一列三要求分别实际做；99和101页十二式各全算。原三个小棒图与本站两个图形例子分开，先逐根数再提出新问题；原游戏、两组同和填式、四符号、六缺数与两方面成长记录分别完成，未做不自动确认。',
      },
      {
        title: '允许0的分法与正数分法分开',
        text: '前面只用两个正整数是本站原创练习的限定。教材第101页分组题未明写这个限制；补充活动用已学0～20的整数，允许0。和为11时从0+11、1+10到11+0，共12种；和为20时从0+20到20+0，共21种。逐组列完再核对，交换次序分别记；没有填的空格不等于0，也不扩展到负数。',
      },
    ],
    questions: [
      choice(
        organize,
        'q1',
        '两加数都为1～9，整理和至少10的表，9+1应放进表里吗？',
        ['放进', '不放进'],
        '放进',
        '至少10包括等于10。',
      ),
      number(
        organize,
        'q2',
        '两加数1～9，左右交换分别记，和为10的算式共有几条？',
        9,
        '1+9、2+8……9+1共9条，5+5只有一条。',
      ),
      number(
        organize,
        'q3',
        '两加数1～9，和为18的算式共有几条？',
        1,
        '只有9+9，不能重复计两次。',
      ),
      number(
        organize,
        'q4',
        '两加数都限定1～9，和为20的算式有几条？',
        0,
        '最大9+9=18，所以这个限定下0条；不等于20不能分成两个正数。',
      ),
      task(
        organize,
        'q5',
        '换范围：11分成两个正整数，两数允许大于9。依次填自己的一种分法。',
        { kind: 'partition', parts: 2, total: 11, minimum: 1 },
        '两个数均为正且合计11即可，1和10也允许；顺序交换也可。',
      ),
      task(
        organize,
        'q6',
        '20分成两个正整数，两数允许大于9。依次填自己的一种分法。',
        { kind: 'partition', parts: 2, total: 20, minimum: 1 },
        '例如10和10或1和19都满足条件，0和20不是两个正数。',
      ),
      fields(
        organize,
        'q7',
        '依次填1+9、2+8、8+9的和。注意前两个恰好10。',
        [10, 10, 17],
        '1+9=10，2+8=10，8+9=17。',
        {
          kind: 'arithmetic-grid',
          mode: 'sum-grid',
          hidden: [
            [0, 8],
            [1, 7],
            [7, 8],
          ],
          marked: [10, 17],
        },
      ),
      choice(
        organize,
        'q8',
        '8+6与9+5比较，前一式应选哪种关系？',
        ['大于', '等于', '小于'],
        '等于',
        '一加数多1另一少1，和都为14。',
      ),
      fields(
        organize,
        'q9',
        '纸表每行第一张分别是9+1到9+9。依次填第一张、最后一张的和。',
        [10, 18],
        '右加数从1到9，和从10到18。',
      ),
      choice(
        organize,
        'q10',
        '9 □ 5=14，□应填哪个符号？',
        ['+', '−'],
        '+',
        '9+5=14，而9−5=4。',
      ),
      fields(
        organize,
        'q11',
        '同长纸棒摆两个正方形。依次填：两图分开时用几根，正好共用一整条边时用几根。',
        [8, 7],
        '分开4+4=8，共一条边少重复用1根，为7。',
      ),
      fields(
        organize,
        'q12',
        '同长纸棒摆两个三角形。依次填：分开用几根，正好共用一整条边用几根。',
        [6, 5],
        '分开3+3=6，共一整边用5；不适用于任意摆法。',
      ),
      manual(
        organize,
        'full-table',
        '实际制作完整45张卡：两加数1～9、和至少10、左右交换分开记。按和10～18分行并按第1步排列，逐行口算核对9、8……1张及总45，不能用网页几题代替全部完成。',
      ),
      manual(
        organize,
        'patterns',
        '在实际排好的45张纸表中，逐行比较左右加数变化、和不变，再沿各行第一张从9+1到9+9看变化；用材料验证至少两个例子，并实际解释规律。',
      ),
      manual(
        organize,
        'all-partitions',
        '另画和11～20十行，两加数允许1以上正整数，不限制9。每行从左加数1列到和少1，实际写全每种分法，包括20的10+10与1+19，交换次序分别记，自己或同伴逐行核对。',
      ),
      manual(
        organize,
        'game',
        '实际制作8+7、9+6、7+8、6+7、8+5、9+4六张卡，逐张口算后找同和伙伴，再揭卡核对；单人完成注明独自核对，未实际玩只准备好不能当完成。',
      ),
      manual(
        organize,
        'sticks',
        '实际用纸条或安全小棒分别摆两正方形分开/共整边、两三角形分开/共整边，恢复后逐根数；再组合一个自己的图，提出用棒数量问题并实际核对，不复制原教材插画。',
      ),
      reflect(
        organize,
        'calculation-reflection',
        '我实际掌握或仍需练习什么计算方法？分开记录网页题与真实口算、排卡的经历。',
      ),
      reflect(
        organize,
        'problem-reflection',
        '我实际解决了什么数量问题，怎样回看？拼棒或游戏未做的部分另写待做。',
      ),
      ...carryOrganizeCompleteQuestions(false),
      ...carryOrganizeSourceTasks.map(([key, prompt]): Question => ({
        ...manual(organize, `actual-source-${key}`, prompt),
        knowledge: `${organize}-actual-source-${key}`,
      })),
    ],
    review: {
      ...base.review,
      date: '2026-10-04',
      notes: `${base.review.notes} 重新实际核对88～102页，保留v1题目、复习与步骤前缀，v2补完整原书活动独立人工记录和原创成套练习；原图不发布，旧快照/schema1保持。`,
    },
    reviewQuestions: [
      number(
        organize,
        'r1',
        '两加数1～9、交换顺序分开记，和为12的算式有几条？',
        7,
        '3+9至9+3共7条。',
      ),
      task(
        organize,
        'r2',
        '17分成两个正整数，不限制加数最大9，填自己的一种分法。',
        { kind: 'partition', parts: 2, total: 17, minimum: 1 },
        '两个正数合计17即可。',
      ),
      fields(
        organize,
        'r3',
        '同长纸棒摆3个正方形：依次填全分开用棒数、排成一行且相邻正好共整边用棒数。',
        [12, 10],
        '分开12，排成一行只有两条共有边，用12−2=10。',
      ),
      number(
        organize,
        'r4',
        '7+□=16，□是多少？',
        9,
        '已知部分7，另一部分9，7+9=16。',
      ),
      ...carryOrganizeCompleteQuestions(true),
    ],
  },
];
