import type {
  Book,
  Lesson,
  Question,
  Shape,
  Unit,
  Visual,
} from '../learning/types';

import { required } from '../learning/required';
import { borrowPracticeLessons } from './math-borrow-practice';
import { carryPracticeLessons } from './math-carry-practice';
import { finalPracticeLessons } from './math-final-practice';
import { hundredPracticeLessons } from './math-hundred-practice';
import { planePracticeLessons } from './math-plane-practice';
import { relationPracticeLessons } from './math-relations-practice';
import { mathReviewQuestions } from './math-review';
import { shapeJoinLesson } from './math-shape-join';
import { shoppingPracticeLesson } from './math-shopping-practice';
import { solidPracticeLessons } from './math-solid-practice';
import { mathSpecialties } from './math-specialties';
import { mathTransitions } from './math-transitions';
import { twentyPracticeLessons } from './math-twenty-practice';
import { textbooks } from './textbooks';

type Draft = Omit<Question, 'id' | 'knowledge'>;

function number(
  prompt: string,
  value: number,
  hint: string,
  explanation: string,
  visual?: Visual,
): Draft {
  return { prompt, rule: { kind: 'number', value }, hint, explanation, visual };
}
function choice(
  prompt: string,
  labels: string[],
  value: string,
  hint: string,
  explanation: string,
  visual?: Visual,
): Draft {
  return {
    prompt,
    choices: labels.map((label) => ({ id: label, label })),
    rule: { kind: 'choice', value },
    hint,
    explanation,
    visual,
  };
}
function lesson(
  id: string,
  textbookTitle: string,
  title: string,
  page: number,
  goal: string,
  text: string,
  activity: string,
  drafts: Draft[],
  visual?: Visual,
): Lesson {
  return {
    id,
    textbookTitle,
    title,
    page,
    goal,
    prerequisite: '可以用实物或学具操作；遇到困难时返回同单元前面的课程。',
    parentTip:
      '先让孩子操作并说明理由，再看提示。不要把家长给出的答案记为独立作答。',
    version: 1,
    status: 'available',
    steps: [
      { title: '观察与思考', text, visual },
      { title: '动手试一试', text: '先操作，再用自己的话说出想法。', activity },
    ],
    questions: drafts.map((item, index) => ({
      ...item,
      id: `${id}-q${index + 1}`,
      knowledge: id,
    })),
    review: {
      date: '2026-09-30',
      reviewer: '教材范围核验与原创题目程序校验',
      notes:
        '标题归属与知识范围依据人教社2024审定六三学制教材；讲解、情境和练习为本项目原创。细分课标题为平台教学组织，不冒充教材目录。',
    },
  };
}

function countLesson(
  id: string,
  textbookTitle: string,
  page: number,
  values: number[],
): Lesson {
  return lesson(
    id,
    textbookTitle,
    '一个不漏地数',
    page,
    '建立物体与数量的一一对应。',
    '每碰到一个物体就数一次。可以从左往右数，也可以逐个移动；同一个物体不能重复数。最后报出的数表示一共有几个。',
    '摆出几块积木，移动着数一次，再换个方向数一次，比较两次结果。',
    values.map((value) =>
      number(
        '图中一共有几个圆点？',
        value,
        '点一个，数一个，已经数过的不要再数。',
        `逐一点数，最后数到${value}，所以共有${value}个。`,
        { kind: 'count', count: value },
      ),
    ),
    { kind: 'count', count: values[0] ?? 3 },
  );
}
function sequenceLesson(
  id: string,
  textbookTitle: string,
  page: number,
  maximum: number,
): Lesson {
  const rows = (() => {
    if (maximum === 5)
      return [
        [1, 1],
        [2, 1],
        [3, 1],
        [4, 1],
        [3, -1],
        [2, -1],
      ];
    return maximum === 10
      ? [
          [5, 1],
          [6, 1],
          [8, 1],
          [9, 1],
          [8, -1],
          [10, -1],
        ]
      : [
          [11, 1],
          [13, 1],
          [16, 1],
          [19, 1],
          [15, -1],
          [20, -1],
        ];
  })();
  return lesson(
    id,
    textbookTitle,
    '前一个数与后一个数',
    page,
    '按照数的顺序接着数，并区分前一个和后一个。',
    '数序从左向右逐个增加1，向左逐个减少1。接着数时先记住已经数到的数，再说下一个，不必每次都从1开始。',
    '点击数序上的一个数，先说它的前一个和后一个，再移动一次检查。',
    rows.map(([value = 1, step = 1]) =>
      number(
        `${value}的${step > 0 ? '后' : '前'}一个数是多少？`,
        value + step,
        step > 0 ? '按顺序再往后数一个。' : '按顺序退回一个。',
        `${value}的${step > 0 ? '后' : '前'}一个数是${value + step}。`,
      ),
    ),
    {
      kind: 'number-line',
      minimum: maximum === 20 ? 10 : 0,
      maximum,
      value: (() => {
        if (maximum === 20) return 15;
        return maximum === 10 ? 7 : 3;
      })(),
    },
  );
}

function compareLesson(
  id: string,
  textbookTitle: string,
  page: number,
  pairs: [number, number][],
): Lesson {
  return lesson(
    id,
    textbookTitle,
    '一一对应比多少',
    page,
    '理解多、少、同样多和比较符号。',
    '把两组物体一个对一个排好。剩下物体的一组多，没有剩下的一组少；两组都没有剩下，就是同样多。大于号和小于号的开口朝较大的数。',
    '两人各摆一些棋子，一个对一个配对，说说哪边多或是否同样多。',
    pairs.map(([left, right]) =>
      choice(
        `第一组${left}个，第二组${right}个。选出比较符号：${left} □ ${right}。`,
        ['>', '<', '='],
        (() => {
          if (left > right) return '>';
          return left < right ? '<' : '=';
        })(),
        '一个对一个配对，再看哪组有剩下。',
        left === right
          ? '两组都没有剩下，所以同样多，用等号。'
          : `开口朝较大的数${Math.max(left, right)}。`,
        { kind: 'count', count: left, other: right },
      ),
    ),
  );
}
function partitionLesson(
  id: string,
  textbookTitle: string,
  page: number,
  totals: number[],
): Lesson {
  return lesson(
    id,
    textbookTitle,
    '分一分，合一合',
    page,
    '理解一个数可以分成两个部分；允许多种正确分法。',
    '把一堆物体分成两堆，物体总数不变。每堆至少一个，同一个总数常常有多种分法。把两堆合起来又是原来的总数。',
    '拿几块积木分成两堆，再换一种分法。把每次分法说给家长听。',
    totals.map((total) => ({
      prompt: `把${total}个圆点分成两组，每组至少1个。依次填写两组数量。`,
      rule: { kind: 'partition', parts: 2, minimum: 1, total },
      hint: `两组加起来要是${total}。`,
      explanation: `只要两个正整数的和是${total}，就是一种正确分法。交换两组也可以。`,
      visual: { kind: 'count', count: total },
    })),
  );
}

type Calculation = [left: number, operator: '+' | '-', right: number];
function arithmetic(
  id: string,
  textbookTitle: string,
  title: string,
  page: number,
  goal: string,
  text: string,
  calculations: Calculation[],
  model: 'break-ten' | 'column' | 'plain' | 'ten-frame' = 'plain',
): Lesson {
  function diagram([left, operator, right]: Calculation): undefined | Visual {
    if (model === 'column') return { kind: 'column', left, right, operator };
    if (model === 'ten-frame' && operator === '+')
      return { kind: 'ten-frame', left, right };
    if (model === 'break-ten' && operator === '-')
      return { kind: 'break-ten', left, right };
    return undefined;
  }
  const course = lesson(
    id,
    textbookTitle,
    title,
    page,
    goal,
    text,
    '选一道题，用小棒或数位图说明每一步为什么这样算，再把结果说完整。',
    calculations.map(([left, operator, right]) => {
      const value = operator === '+' ? left + right : left - right;
      return number(
        `${left} ${operator} ${right} = ？`,
        value,
        text,
        `${left}${operator}${right}=${value}。${text}`,
        diagram([left, operator, right]),
      );
    }),
    calculations[0] ? diagram(calculations[0]) : undefined,
  );
  if (id === 'ml-written-add' || id === 'ml-written-sub') {
    course.version = 3;
    course.steps.push({
      title: '把方法与结果分开检查',
      text:
        id === 'ml-written-add'
          ? '先算个位，记录是否进1；再算十位，把进的1加进去。没有进位时也要明确记录0，不是留空。'
          : '先判断个位够不够减。需要退位时，把十位的1个十换成10个一；个位和十位都要按换过的数量计算。没有退位时记录0。',
      activity:
        '选一道本课算式在纸上列竖式，指着相同数位说明对齐方式，讲出每一步。由孩子或家长确认实际书写与讲解；屏幕填数不评价笔迹和书写质量。',
    });
    course.questions.push(
      ...calculations.map(([left, operator, right], index): Question => {
        const leftOnes = left % 10;
        const rightOnes = right % 10;
        const exchange =
          operator === '+'
            ? Number(leftOnes + rightOnes >= 10)
            : Number(leftOnes < rightOnes);
        const ones =
          operator === '+'
            ? (leftOnes + rightOnes) % 10
            : leftOnes + exchange * 10 - rightOnes;
        const tens =
          operator === '+'
            ? Math.floor(left / 10) + Math.floor(right / 10) + exchange
            : Math.floor(left / 10) - exchange - Math.floor(right / 10);
        return {
          id: `${id}-method${index + 1}`,
          knowledge: id,
          prompt: `${left} ${operator} ${right}：依次填写${operator === '+' ? '向十位进的数' : '从十位退的数'}、结果个位数字、结果十位数字；不进或不退填0。`,
          rule: { kind: 'steps', values: [exchange, ones, tens] },
          hint: '先看个位，再考虑十位；三个空分别记录换位、个位结果和十位结果。',
          explanation: `换位记录为${exchange}，结果个位为${ones}，十位为${tens}，合起来是${tens * 10 + ones}。方法填数与整道算式结果分别记录，不代表已经完成纸笔书写。`,
          visual: diagram([left, operator, right]),
        };
      }),
      {
        id: `${id}-paper`,
        knowledge: id,
        prompt:
          '实际在纸上写一道本课竖式，检查数位对齐并说出计算步骤。完成后由孩子或家长确认；没做可以跳过。',
        rule: { kind: 'manual' },
        hint: '个位对个位，十位对十位；从个位开始。先做实际书写，再确认。',
        explanation:
          '这是实际书写与讲解的人工记录，不自动判对，不计入客观题正确率。',
      },
    );
    const addition = id === 'ml-written-add';
    course.steps.push({
      title: '一位数对齐与结果里的0',
      text: addition
        ? '57+8的一位数8写在个位，十位没有数字按0参与计算。个位7+8得15，写5并向十位进1，再算5+0+1得6。19+61的个位和是10，个位写0，十位还要加进来的1，结果80。0不能省略，也不能把15整个写在个位。'
        : '43−7的一位数7写在个位。个位不够，先把4个十换成3个十和13个一，再分别减。80−16的个位0不代表不能减：把8个十换成7个十和10个一，个位10−6得4，十位7−1得6。退位后不能仍用原来的8个十。',
      activity:
        '实际把一位数算式与含0算式各写一次，逐位指着讲。每道从原量重新开始；没有实际写与讲，可暂时跳过。',
    });
    const correctMethods = addition
      ? ['把8对在个位', '个位15写5并向十位进1']
      : ['80先换成7个十和10个一', '个位10−6得4，十位7−1得6'];
    course.questions.push(
      {
        id: `${id}-alignment`,
        knowledge: id,
        prompt: addition
          ? '列竖式算57+8，选出所有正确的写法和步骤。'
          : '列竖式算80−16，选出所有正确的步骤。',
        choices: [
          ...correctMethods,
          addition ? '把8对在十位' : '退位后十位仍按8−1计算',
          addition ? '把15整个写在个位' : '个位是0，所以不能减',
        ].map((label) => ({ id: label, label })),
        rule: { kind: 'set', values: correctMethods },
        hint: '数位对齐；进退位改变十和一的分组，不改变原来表示的数量。',
        explanation: addition
          ? '8表示8个一，必须对个位；15个一换成1个十和5个一。'
          : '原80等于7个十和10个一；取走1个十和6个一，剩6个十和4个一。',
        visual: diagram(addition ? [57, '+', 8] : [80, '-', 16]),
      },
      {
        id: `${id}-check`,
        knowledge: id,
        prompt: addition
          ? '已算57+8=65、19+61=80。分别用65−8、80−61验算，依次填两个结果。'
          : '已算80−16=64、43−7=36。分别用64+16、36+7验算，依次填两个结果。',
        rule: { kind: 'steps', values: addition ? [57, 19] : [80, 43] },
        hint: '重新计算验算式，看是否回到对应原数，不把验算当新的实物完成记录。',
        explanation: addition
          ? '65−8=57，80−61=19，两次都回到相应加数。'
          : '64+16=80，36+7=43，两次都回到相应被减数。',
      },
      {
        id: `${id}-zero-paper`,
        knowledge: id,
        prompt: addition
          ? '实际在纸上分别写57+8与19+61，指着一位数对齐处、进1和结果个位0讲清步骤。'
          : '实际在纸上分别写43−7与80−16，指着一位数对齐处、退位后的十与一讲清步骤。',
        rule: { kind: 'manual' },
        hint: '纸上写与实际讲分别完成后才确认；没做请跳过，不以网页填数替代。',
        explanation: '仅记录实际纸笔与讲解，不自动评分字迹或掌握程度。',
      },
      {
        id: `${id}-reflection`,
        knowledge: id,
        prompt:
          '如实记录数位对齐、进退位与验算中一次实际检查，仍不明白的地方可写；未来练习计划另记。',
        rule: { kind: 'reflection' },
        hint: '未做纸笔就如实说未做，不必写统一感想。',
        explanation: '反思保留原话，不计客观正确率，也不自动确认实际书写。',
      },
    );
    const reviewCalculations: Calculation[] = addition
      ? [
          [34, '+', 25],
          [37, '+', 28],
          [69, '+', 7],
          [27, '+', 43],
        ]
      : [
          [79, '-', 34],
          [63, '-', 28],
          [90, '-', 17],
          [54, '-', 8],
        ];
    const reviewValues = addition
      ? [
          [0, 9, 5],
          [1, 5, 6],
          [1, 6, 7],
          [1, 0, 7],
        ]
      : [
          [0, 5, 4],
          [1, 5, 3],
          [1, 3, 7],
          [1, 6, 4],
        ];
    course.reviewQuestions = [
      ...mathReviewQuestions(course),
      ...reviewCalculations.map((calculation, index): Question => ({
        id: `${id}-method-review${index + 1}`,
        knowledge: id,
        prompt: `${calculation[0]} ${calculation[1]} ${calculation[2]}：依次填${addition ? '进的十数' : '退的十数'}、结果个位数字、结果十位数字；不进或不退填0。`,
        rule: { kind: 'steps', values: required(reviewValues[index]) },
        hint: '换了算式，重新检查个位与十位；一位数对个位，0仍占位。',
        explanation: '方法分三项独立记录，结果十位与个位合回原式核对。',
        visual: diagram(calculation),
      })),
    ];
    course.review = {
      ...course.review,
      date: '2026-10-03',
      reviewer: '原创笔算步骤与记录边界程序核对',
      notes:
        '保留原六道结果题及v2前四道方法题ID与判分；补齐六道方法记录、一位数对齐、含0、验算、实际纸笔与反思，并保留原结果复习另加新过程题。该补充依据既有笔算范围，不声称完成教材逐页审校。',
    };
  }
  if (id === 'ml-oral-add' || id === 'ml-oral-sub') {
    const addition = id === 'ml-oral-add';
    course.version = 2;
    required(course.steps[0]).visual = {
      kind: 'place-value',
      value: addition ? 32 : 48,
    };
    required(course.steps[0]).activity =
      '看清这个数有几个十、几个一；实际摆出后读数，不把屏幕观察记作已经摆棒。';
    course.steps.push(
      {
        title: '换位前后，数量保持不变',
        text: addition
          ? '27加6：个位7加6是13个一。先有2个十、13个一，再把其中10个一换成1个十，成为3个十、3个一，即33。加整十数改变十的数量，如32加20是5个十、2个一，不把20当2个一。控件先显示原数；拆换后总数保持27，加6还需实际摆棒或纸画。'
          : '32减6：2个一不够减6，从3个十中拆1个十，成为2个十、12个一；12减6剩6个一，与2个十合成26。减整十数，如48减20，先减2个十，8个一保持，得28。控件拆十前后总数仍32，取走6还需实际操作或纸画。',
        visual: { kind: 'place-value', value: addition ? 27 : 32 },
        activity: addition
          ? '实际摆27并添6，换十后数清十与一；再摆32添20，分别说明单位。'
          : '实际摆32并拆十，再拿走6；再摆48拿走20，分别说明取走的单位。',
      },
      {
        title: '不同口算办法，分别核对过程',
        text: addition
          ? '27加6也可把27分成20和7：7加6是13，再加20得33；或把6分成3和3，27加3到30，再加3得33。不同办法都要保持加数总量，不把7加6的13写成两百多。'
          : '32减6也可把6分成2和4：先减2到30，再减4得26；或把32分成20和12，12减6得6，再加20得26。连续减去的两部分合起来必须是6，不能重复减6。',
        activity:
          '实际用纸棒或纸画试两种办法，分别说每一步和最后结果；只填网页题不自动代表讲解或实做完成。',
      },
    );
    course.questions.push(
      ...calculations.map(([left, operator, right], index): Question => {
        const ones = left % 10;
        const rightOnes = right % 10;
        const exchange =
          operator === '+'
            ? Number(ones + rightOnes >= 10)
            : Number(ones < rightOnes);
        const result = operator === '+' ? left + right : left - right;
        const values =
          operator === '+'
            ? [ones + rightOnes, exchange, Math.floor(result / 10), result]
            : [
                exchange,
                ones + 10 * exchange,
                Math.floor(left / 10) - exchange,
                result,
              ];
        return {
          id: `${id}-oral-method${index + 1}`,
          knowledge: id,
          prompt:
            operator === '+'
              ? `${left}+${right}：依次填换十前共有几个一、向十位换出的十数（不换填0）、最后共有几个十、结果。`
              : `${left}−${right}：依次填拆出的十数（不拆填0）、减之前可用几个一、拆十后减之前剩几个十、结果。`,
          rule: { kind: 'steps', values },
          hint: '每空都标明操作时刻；换位前后数量相同，取走或添上另算。0不是空白。',
          explanation:
            operator === '+'
              ? `换前${values[0]}个一，换${exchange}个十，最后${Math.floor(result / 10)}个十，结果${result}。`
              : `拆${exchange}个十，可用${values[1]}个一，减之前剩${values[2]}个十；还要按单位取走${right}，得${result}。`,
        };
      }),
      {
        id: `${id}-oral-alternative`,
        knowledge: id,
        prompt: addition
          ? '27+6，把6拆成两部分：先添几到30、再添几、最后结果？'
          : '32−6，把6拆成两部分：先减几到30、再减几、最后结果？',
        rule: { kind: 'steps', values: addition ? [3, 3, 33] : [2, 4, 26] },
        hint: '两部分合起来是6，不重复计算。',
        explanation: addition
          ? '6分3和3，先30，再33。'
          : '6分2和4，先30，再26。',
      },
      {
        id: `${id}-oral-strategies`,
        knowledge: id,
        prompt: addition
          ? '27+6，选出所有正确的口算办法。'
          : '32−6，选出所有正确的口算办法。',
        choices: (addition
          ? [
              'A：7+6=13，再20+13=33',
              'B：27+3=30，再30+3=33',
              'C：27+6=33，再33+6=39',
            ]
          : [
              'A：12−6=6，再20+6=26',
              'B：32−2=30，再30−4=26',
              'C：32−6=26，再26−6=20',
            ]
        ).map((label) => ({ id: label, label })),
        rule: {
          kind: 'set',
          values: addition
            ? ['A：7+6=13，再20+13=33', 'B：27+3=30，再30+3=33']
            : ['A：12−6=6，再20+6=26', 'B：32−2=30，再30−4=26'],
        },
        hint: '原算式只有一个6，别重复添或拿走。',
        explanation: 'A、B保持原数量，C重复用了6。',
      },
      {
        id: `${id}-oral-objects`,
        knowledge: id,
        prompt: addition
          ? '实际摆棒完成27添6换十，再完成32添20，分别说添的是几个一或十。'
          : '实际摆棒完成32拆十拿走6，再完成48拿走20，分别说拿走的是几个一或十。',
        rule: { kind: 'manual' },
        hint: '没有材料可纸画；未实际做请跳过。',
        explanation: '实做人工记录，不自动计对错。',
      },
      {
        id: `${id}-oral-explain`,
        knowledge: id,
        prompt:
          '实际用两种口算办法计算一题，把每步讲给家长或独自说清；屏幕填数不替代讲解。',
        rule: { kind: 'manual' },
        hint: '说明分成的两部分和原数的关系。',
        explanation: '只确认实际讲解，不自动判断质量。',
      },
      {
        id: `${id}-oral-reflection`,
        knowledge: id,
        prompt:
          '记录一次实际检查的办法与仍不明白的地方；没做活动请如实写，计划另记。',
        rule: { kind: 'reflection' },
        hint: '不需要写统一标准感想。',
        explanation: '反思不计客观正确率。',
      },
    );
    course.reviewQuestions = (
      addition
        ? [
            [8, 0, 4, 48],
            [12, 1, 6, 62],
            [1, 0, 7, 71],
            [5, 0, 9, 95],
          ]
        : [
            [0, 9, 5, 52],
            [1, 13, 4, 45],
            [1, 10, 7, 76],
            [0, 6, 7, 36],
          ]
    ).map((values, index) => ({
      id: `${id}-oral-review${index + 1}`,
      knowledge: id,
      prompt: addition
        ? `${required(['43+5', '54+8', '41+30', '75+20'][index])}：依次填换十前几个一、换出的十数、最后几个十、结果。`
        : `${required(['59−7', '53−8', '80−4', '76−40'][index])}：依次填拆出的十数、减之前可用几个一、拆十后减之前剩几个十、结果。`,
      rule: { kind: 'steps', values },
      hint: '新数需要重新核对每步，不沿用旧答案。',
      explanation: '按指定时刻分别记录十和一，再计算结果。',
    }));
    course.review = {
      ...course.review,
      date: '2026-10-03',
      reviewer: '原创口算方法与旧记录独立程序核对',
      notes:
        '保留原六道结果题稳定ID，补充十和一、进退位过程、不同算法、实做与反思。官方43～55页当前返回验证页，未读取；此改进依据现有课程与规划要求，不声称完成教材逐页或全部课后活动审校。',
    };
  }
  return course;
}

function placeValues(
  id: string,
  textbookTitle: string,
  page: number,
  values: number[],
): Lesson {
  const course = lesson(
    id,
    textbookTitle,
    '看数位，读写数',
    page,
    values.includes(100)
      ? '知道10个一是1个十、10个十是1个百，区分数位上的数字与小棒分组。'
      : '知道10个一是1个十，并区分十位和个位。',
    values.some((value) => value > 20)
      ? '10根小棒捆成一捆，就是1个十。写数时，右边是个位，左边是十位。某个数位没有单位就用0占位；100是10个十，也就是1个百。'
      : '10根小棒捆成一捆，就是1个十。写数时，右边是个位，左边是十位。某个数位没有单位就用0占位；20是2个十。',
    '把小棒每10根捆成一捆，摆出一个两位数，说说十位和个位各表示多少。',
    values.map((value) => ({
      prompt:
        value === 100
          ? '图中总数量是100。依次填写百位、十位、个位上的数字；不要把10个十误写成十位数字10。'
          : `图中总数量是${value}。依次填写十位数字、个位数字；分组方式变化不改变这个数。`,
      rule: {
        kind: 'steps',
        values:
          value === 100 ? [1, 0, 0] : [Math.floor(value / 10), value % 10],
      },
      hint: '10根可以换1捆，10捆可以换1百；先分清单位个数与数位上的数字。空数位用0占位。',
      explanation:
        value === 100
          ? '100写作百位1、十位0、个位0；10个十也能表示100，但十位数字不能写成10。'
          : `${value}的标准分组是${Math.floor(value / 10)}个十和${value % 10}个一；拆捆或换捆后总数量不变，数字仍写作${value}。`,
      visual: { kind: 'place-value', value },
    })),
    { kind: 'place-value', value: required(values[0]) },
  );
  course.version = 2;
  course.steps.splice(1, 0, {
    title: '拆开与换捆，数量不变',
    text: '先把1个十拆成10个一，再把10个一换回1个十。数一数操作前后的小棒，说明总数量为什么没变。屏幕上的单位个数是当前分组，不一定是写数时的数位数字。',
    visual: { kind: 'place-value', value: required(values[0]) },
    activity:
      '完成一次拆十和换十；再说说这个数写成数字时，十位和个位分别是什么。操作完成由孩子或家长确认，不自动等于答对。',
  });
  if (values.includes(100))
    course.steps.push({
      title: '100：十个十换成一个百',
      text: '100可以用1个百表示，也可以把这个百拆成10个十。再把一捆十拆开，会有9个十和10个一，总数量仍是100。写100时百位是1，十位和个位都是0；不能把十位写成10。',
      visual: { kind: 'place-value', value: 100 },
      activity: '拆开1个百，观察10个十；再换回1个百，检查总数量始终是100。',
    });
  return course;
}

const shapeNames: Record<Shape, string> = {
  circle: '圆',
  cube: '正方体',
  cuboid: '长方体',
  cylinder: '圆柱',
  parallelogram: '平行四边形',
  rectangle: '长方形',
  sphere: '球',
  square: '正方形',
  triangle: '三角形',
};
function shapes(
  id: string,
  textbookTitle: string,
  page: number,
  values: Shape[],
  solid: boolean,
): Lesson {
  const options = solid
    ? ['长方体', '正方体', '圆柱', '球']
    : ['长方形', '正方形', '三角形', '平行四边形', '圆'];
  return lesson(
    id,
    textbookTitle,
    solid ? '认一认立体图形' : '认一认平面图形',
    page,
    solid
      ? '辨认长方体、正方体、圆柱和球。'
      : '辨认常见平面图形，观察边与轮廓。',
    solid
      ? '立体物体有厚度，可以摸、转、滚。正方体的六个面一样，长方体的面是长方形或正方形；圆柱有两个平平的圆面；球的表面是弯曲的。'
      : '把立体物体的一个面沿边描下来，会得到平面图形。三角形有三条直边；四边形有四条直边；圆的边缘是弯曲的。不能只看图形摆放的方向。',
    solid
      ? '找一个盒子、一个圆柱形罐子和一个球，观察它们能否平稳叠放和滚动。'
      : '用纸片拼一个小房子，说说用了哪些图形。把纸片转一转，名称会变吗？',
    values.map((shape) =>
      choice(
        '图中的图形叫什么？',
        options,
        shapeNames[shape],
        '观察图形的面或轮廓，不要只看朝向。',
        `这是${shapeNames[shape]}。`,
        { kind: 'shape', shape },
      ),
    ),
  );
}

function relations(
  id: string,
  textbookTitle: string,
  page: number,
  lower: boolean,
): Lesson {
  const items: [string, number, string, number[], number][] = lower
    ? [
        [
          '书架上层有23本书，下层有15本书，一共有多少本？',
          38,
          '两层书是两个部分，求合起来的总数。',
          [23, 15],
          -1,
        ],
        [
          '原来有42张贴纸，用掉16张，还剩多少张？',
          26,
          '知道总数和用掉的部分，用减法求剩余。',
          [16, 26],
          1,
        ],
        [
          '送出18张卡片后还剩25张，原来有多少张？',
          43,
          '送出的和剩下的合起来才是原来的总数。',
          [18, 25],
          -1,
        ],
        [
          '红花有32朵，黄花有24朵，红花比黄花多多少朵？',
          8,
          '先一一配对，再求多出的部分。',
          [24, 8],
          1,
        ],
        [
          '盒里有50支笔，其中蓝笔27支，其余是黑笔，黑笔有多少支？',
          23,
          '从总数中去掉已知的一部分。',
          [27, 23],
          1,
        ],
        [
          '白珠比绿珠少7颗，绿珠28颗，白珠有多少颗？',
          21,
          '白珠是较少的部分，从28里减去7。',
          [21, 7],
          0,
        ],
      ]
    : [
        [
          '左边有3个积木，右边有2个，一共有多少个？',
          5,
          '把两部分合起来。',
          [3, 2],
          -1,
        ],
        [
          '一共有8个果子，拿走3个，还剩多少个？',
          5,
          '从总数里去掉拿走的部分。',
          [3, 5],
          1,
        ],
        [
          '盘里有4个果子，又放入3个，现在多少个？',
          7,
          '数量增加，把原有的和新放入的合起来。',
          [4, 3],
          -1,
        ],
        [
          '原来有9张纸，用了5张，还剩多少张？',
          4,
          '从原有数量中减去用掉的数量。',
          [5, 4],
          1,
        ],
        [
          '已经做了6朵花，还要做4朵，总共要做多少朵？',
          10,
          '已经做的和还要做的都是总数的一部分。',
          [6, 4],
          -1,
        ],
        [
          '有7只小鸟，飞走2只，还剩多少只？',
          5,
          '总数减去飞走的数量。',
          [2, 5],
          1,
        ],
      ];
  return lesson(
    id,
    textbookTitle,
    '先找数量关系，再列式',
    page,
    '区分总数、部分和相差数量，依据意义选择加减法。',
    '先说清楚哪些数是已知的、要求什么。两个部分合成总数用加法；从总数求一个部分用减法；求两个数量相差多少也用减法。不能看到“多”就用加法，看到“少”就用减法。',
    '摆两排积木提出一个“一共多少”和一个“相差多少”的问题，并解释算式。',
    items.map(([prompt, value, hint, parts, unknown]) =>
      number(prompt, value, hint, `${hint}答案是${value}。`, {
        kind: 'bars',
        parts,
        unknown: unknown < 0 ? parts.length : unknown,
      }),
    ),
  );
}

function shopping(): Lesson[] {
  const textbookTitle = '欢乐购物街';
  return [
    lesson(
      'ml-money',
      textbookTitle,
      '认识元、角、分与兑换',
      77,
      '理解1元=10角，1角=10分；在同一单位下计算。',
      '人民币金额中的元、角、分表示不同单位。1元等于10角，1角等于10分。先换成同一个单位，再比较或计算。图中金额卡是学具，不是真实纸币。',
      '用纸片写1元、5角、1角，试着用不同组合表示2元。不要拿真实钱币剪贴。',
      [
        number('1元等于多少角？', 10, '1元可以换10个1角。', '1元=10角。'),
        number('1角等于多少分？', 10, '单位之间的进率是10。', '1角=10分。'),
        number('3元等于多少角？', 30, '每1元换10角。', '3元=30角。'),
        number(
          '25角是2元多少角？只填写剩下的角数。',
          5,
          '先把20角换成2元。',
          '25角=2元5角。',
        ),
        number('4元6角一共多少角？', 46, '4元先换成40角。', '40角+6角=46角。'),
        choice(
          '2元和18角，哪个金额大？',
          ['2元', '18角', '同样多'],
          '2元',
          '把2元换成角。',
          '2元=20角，20角大于18角。',
        ),
      ],
    ),
    lesson(
      'ml-shop',
      textbookTitle,
      '付款、找零和购物选择',
      77,
      '用加减法计算小额购物，选择合适的支付金额。',
      '买两件物品先求总价；付款要够总价；付款金额减去总价得到找零。元和角混合时先换成角，算完再换回。',
      '给三件家里的物品贴上模拟价格，轮流当顾客和售货员，并检查找零。',
      [
        number(
          '一本练习本3元，一支笔2元，一共多少元？',
          5,
          '两件物品的价格相加。',
          '3+2=5元。',
          { kind: 'money', cents: [300, 200] },
        ),
        number(
          '买6元的盒彩笔，付10元，应找多少元？',
          4,
          '付款减去价格。',
          '10-6=4元。',
        ),
        number(
          '一个本子2元5角，一块橡皮5角，一共多少角？',
          30,
          '2元5角先换成25角。',
          '25+5=30角，即3元。',
        ),
        number(
          '买一件7元的玩具和一本8元的书，付20元，找回多少元？',
          5,
          '先算两件总价，再算找零。',
          '7+8=15元，20-15=5元。',
        ),
        choice(
          '有12元，能同时买8元的本子和5元的笔吗？',
          ['能', '不能'],
          '不能',
          '先求两件物品的总价。',
          '8+5=13元，比12元多，所以不能。',
        ),
        number(
          '把每张金额卡都换成角，全部加起来是多少角？',
          16,
          '1元是10角，另外两张分别是5角和1角。',
          '10+5+1=16角，即1元6角。',
          { kind: 'money', cents: [100, 50, 10] },
        ),
      ],
    ),
    shoppingPracticeLesson,
  ];
}

const upper: Record<string, Lesson[]> = {
  games: [
    countLesson('mu-count', '数学游戏', 1, [3, 5, 2, 4, 1, 6]),
    compareLesson('mu-compare', '数学游戏', 1, [
      [3, 5],
      [4, 2],
      [3, 3],
      [1, 4],
      [5, 2],
      [4, 4],
    ]),
    partitionLesson('mu-partition', '数学游戏', 1, [4, 5, 3, 6, 4, 5]),
  ],
  u1: [
    countLesson('mu-five', '5以内数的认识和加、减法', 12, [1, 2, 3, 4, 5, 3]),
    sequenceLesson('mu-five-sequence', '5以内数的认识和加、减法', 12, 5),
    compareLesson('mu-five-compare', '5以内数的认识和加、减法', 12, [
      [1, 2],
      [5, 4],
      [3, 3],
      [2, 4],
      [4, 1],
      [5, 5],
    ]),
    partitionLesson(
      'mu-five-partition',
      '5以内数的认识和加、减法',
      12,
      [2, 3, 4, 5, 4, 5],
    ),
    arithmetic(
      'mu-five-add',
      '5以内数的认识和加、减法',
      '合起来是加法',
      12,
      '理解加法表示合并和增加。',
      '把两组物体合起来，数一共有多少；用加号连接两部分，等号后面写总数。',
      [
        [1, '+', 1],
        [2, '+', 1],
        [1, '+', 3],
        [2, '+', 2],
        [3, '+', 2],
        [4, '+', 1],
      ],
    ),
    arithmetic(
      'mu-five-sub',
      '5以内数的认识和加、减法',
      '拿走后还剩多少',
      12,
      '理解减法表示去掉一部分。',
      '从原有物体里拿走一些，数剩下多少；原有数量减去拿走数量就是剩余数量。',
      [
        [2, '-', 1],
        [3, '-', 2],
        [4, '-', 1],
        [5, '-', 3],
        [5, '-', 4],
        [4, '-', 2],
      ],
    ),
    arithmetic(
      'mu-zero',
      '5以内数的认识和加、减法',
      '0也是一个数',
      12,
      '认识0与包含0的加减法。',
      '一个也没有可以用0表示。添上0个，数量不变；拿走0个，数量不变；全部拿走就剩0个。',
      [
        [0, '+', 3],
        [4, '+', 0],
        [5, '-', 0],
        [3, '-', 3],
        [1, '-', 1],
        [0, '+', 0],
      ],
    ),
    lesson(
      'mu-ordinal',
      '5以内数的认识和加、减法',
      '几个和第几个',
      12,
      '区分数量与顺序，明确从哪边开始数。',
      '“几个”问总数量，“第几个”问位置。说明从左还是从右数，同一个物体的位置可能不同。',
      '排5个不同颜色的物体，轮流说从左第几个和从右第几个。',
      [
        number(
          '从左到右排着红、黄、蓝、绿、白五张卡。蓝卡从左数第几个？',
          3,
          '左端红卡是第1个。',
          '红1、黄2、蓝3。',
        ),
        number(
          '同一排卡中，红卡从右数第几个？',
          5,
          '从白卡开始数。',
          '白1、绿2、蓝3、黄4、红5。',
        ),
        number(
          '这一排一共有几张卡？',
          5,
          '总数不随数的方向改变。',
          '共有5张。',
        ),
        number('黄卡从左数第几个？', 2, '红卡在黄卡前。', '黄卡第2个。'),
        number('绿卡从右数第几个？', 2, '白卡是右边第1个。', '绿卡第2个。'),
        number('白卡从左数第几个？', 5, '从红卡开始数。', '白卡第5个。'),
      ],
    ),
  ],
  u2: [
    countLesson('mu-ten', '6～10的认识和加、减法', 34, [6, 7, 8, 9, 10, 8]),
    sequenceLesson('mu-ten-sequence', '6～10的认识和加、减法', 34, 10),
    compareLesson('mu-ten-compare', '6～10的认识和加、减法', 34, [
      [6, 8],
      [9, 7],
      [10, 10],
      [8, 9],
      [7, 6],
      [10, 8],
    ]),
    partitionLesson(
      'mu-ten-partition',
      '6～10的认识和加、减法',
      34,
      [6, 7, 8, 9, 10, 10],
    ),
    arithmetic(
      'mu-ten-addsub',
      '6～10的认识和加、减法',
      '10以内加减练习',
      34,
      '运用分与合计算10以内加减法。',
      '知道两个部分就能合成总数；知道总数和一个部分就能求另一个部分。',
      [
        [4, '+', 3],
        [5, '+', 4],
        [6, '+', 4],
        [8, '-', 3],
        [9, '-', 5],
        [10, '-', 6],
      ],
    ),
    relations('mu-story', '6～10的认识和加、减法', 34, false),
    lesson(
      'mu-chain',
      '6～10的认识和加、减法',
      '连加、连减与加减混合',
      34,
      '按从左往右的顺序逐步计算。',
      '算式中有两个运算符，先算左边两个数，再用得到的结果接着算。每一步都要看清符号。',
      '先摆5根小棒，添2根，再拿走3根，说出每一步数量。',
      [
        [2, 3, 4, '+', '+'],
        [9, 2, 3, '-', '-'],
        [5, 2, 3, '+', '-'],
        [8, 4, 2, '-', '+'],
        [1, 4, 5, '+', '+'],
        [10, 3, 2, '-', '-'],
      ].map(([a, b, c, op1, op2]) => {
        const left = Number(a);
        const middle = Number(b);
        const right = Number(c);
        const first = op1 === '+' ? left + middle : left - middle;
        const last = op2 === '+' ? first + right : first - right;
        return {
          prompt: `${left}${op1}${middle}${op2}${right}，依次填第一步结果和最后结果。`,
          rule: { kind: 'steps', values: [first, last] },
          hint: '先算左边两个数。',
          explanation: `第一步是${first}，再${op2}${right}得到${last}。`,
        };
      }),
    ),
  ],
  u3: [
    shapes(
      'mu-solid',
      '认识立体图形',
      67,
      ['cuboid', 'cube', 'cylinder', 'sphere', 'cube', 'cylinder'],
      true,
    ),
    ...solidPracticeLessons,
  ],
  u4: [
    sequenceLesson('mu-twenty-sequence', '11～20的认识', 73, 20),
    placeValues(
      'mu-twenty-place',
      '11～20的认识',
      73,
      [11, 12, 15, 17, 19, 20],
    ),
    compareLesson('mu-twenty-compare', '11～20的认识', 73, [
      [11, 15],
      [18, 13],
      [20, 20],
      [14, 17],
      [19, 16],
      [12, 10],
    ]),
    arithmetic(
      'mu-twenty-addsub',
      '11～20的认识',
      '十几加几、减几',
      73,
      '计算不进位、不退位的十几加减几。',
      '把十几分成1个十和几个一，先算个位的一，再与10合起来。',
      [
        [12, '+', 3],
        [14, '+', 5],
        [16, '-', 4],
        [19, '-', 7],
        [10, '+', 8],
        [18, '-', 8],
      ],
    ),
    ...twentyPracticeLessons,
  ],
  u5: [
    arithmetic(
      'mu-carry-nine',
      '20以内的进位加法',
      '9加几：凑成10再算',
      88,
      '用凑十法计算9加几。',
      '9还差1凑成10，把另一个加数分成1和剩下的部分，先算9+1，再加剩下的部分。',
      [
        [9, '+', 2],
        [9, '+', 3],
        [9, '+', 4],
        [9, '+', 5],
        [9, '+', 7],
        [9, '+', 9],
      ],
      'ten-frame',
    ),
    arithmetic(
      'mu-carry-eight',
      '20以内的进位加法',
      '8、7、6加几',
      88,
      '选择合适的加数凑十。',
      '8差2凑十，7差3凑十，6差4凑十。分一个加数、凑成10，再加剩下的部分；也可以交换加数位置。',
      [
        [8, '+', 3],
        [8, '+', 6],
        [7, '+', 4],
        [7, '+', 7],
        [6, '+', 5],
        [6, '+', 8],
      ],
      'ten-frame',
    ),
    arithmetic(
      'mu-carry-small',
      '20以内的进位加法',
      '5、4、3、2加几',
      88,
      '借助交换加数和凑十进行计算。',
      '交换两个加数的位置，和不变。选较大的加数先凑十，再加剩下的部分。',
      [
        [5, '+', 6],
        [4, '+', 8],
        [3, '+', 9],
        [2, '+', 9],
        [5, '+', 8],
        [4, '+', 7],
      ],
      'ten-frame',
    ),
    ...carryPracticeLessons,
  ],
  u6: [
    relations('mu-review-story', '复习与关联', 103, false),
    arithmetic(
      'mu-review',
      '复习与关联',
      '数与计算综合复习',
      103,
      '联系数的组成与加减法。',
      '先观察算式范围，选用分合、凑十或数位方法，再说明计算理由。',
      [
        [3, '+', 4],
        [10, '-', 7],
        [15, '-', 3],
        [8, '+', 7],
        [9, '+', 6],
        [18, '-', 8],
      ],
    ),
    ...finalPracticeLessons,
  ],
};

const lower: Record<string, Lesson[]> = {
  u1: [
    shapes(
      'ml-flat',
      '认识平面图形',
      1,
      [
        'rectangle',
        'square',
        'triangle',
        'parallelogram',
        'circle',
        'triangle',
      ],
      false,
    ),
    shapeJoinLesson,
    ...planePracticeLessons,
  ],
  u2: [
    arithmetic(
      'ml-borrow-nine',
      '20以内的退位减法',
      '十几减9',
      8,
      '用破十法或想加算减计算十几减9。',
      '把十几分成10和几，先用10减9，再把剩余的几加回来；也可想9加几等于这个总数。',
      [
        [11, '-', 9],
        [12, '-', 9],
        [14, '-', 9],
        [16, '-', 9],
        [17, '-', 9],
        [18, '-', 9],
      ],
      'break-ten',
    ),
    arithmetic(
      'ml-borrow-eight',
      '20以内的退位减法',
      '十几减8、7、6',
      8,
      '理解退位减法的计算过程。',
      '个位不够减时，可以从10里减，再与原来的个位合起来。用加法检查减法结果。',
      [
        [12, '-', 8],
        [13, '-', 7],
        [11, '-', 6],
        [15, '-', 8],
        [14, '-', 6],
        [13, '-', 8],
      ],
      'break-ten',
    ),
    arithmetic(
      'ml-borrow-small',
      '20以内的退位减法',
      '十几减5、4、3、2',
      8,
      '联系加减法，巩固退位计算。',
      '先观察个位是否够减。不够减时把一个十拆成十个一，也可想加法求差。',
      [
        [12, '-', 5],
        [11, '-', 4],
        [12, '-', 3],
        [11, '-', 2],
        [13, '-', 5],
        [12, '-', 4],
      ],
      'break-ten',
    ),
    ...borrowPracticeLessons,
  ],
  u3: [
    placeValues(
      'ml-hundred-place',
      '100以内数的认识',
      23,
      [23, 40, 56, 70, 89, 99, 100],
    ),
    compareLesson('ml-hundred-compare', '100以内数的认识', 23, [
      [36, 42],
      [58, 53],
      [70, 70],
      [89, 90],
      [61, 16],
      [99, 98],
    ]),
    lesson(
      'ml-hundred-sequence',
      '100以内数的认识',
      '数的顺序与整十数',
      23,
      '按一、十接着数，理解跨整十数。',
      '从29再数一个是30，从99再数一个是100。每次多10，个位通常不变，十位增加1。',
      '在百数表中从28接着数到35；再从20开始十个十个数到100。',
      [
        [29, 30],
        [39, 40],
        [59, 60],
        [99, 100],
        [70, 80],
        [90, 100],
      ].map(([a, b], index) =>
        number(
          `${a}再加${index < 4 ? 1 : 10}是多少？`,
          b ?? 0,
          index < 4 ? '接着往后数一个。' : '再增加一个十。',
          `结果是${b}。`,
        ),
      ),
      { kind: 'number-line', minimum: 20, maximum: 40, value: 29 },
    ),
    lesson(
      'ml-hundred-chart',
      '100以内数的认识',
      '百数表：横看竖看',
      23,
      '用1到100的原创数表观察横排与竖列的数量关系。',
      '每行从左向右放10个数。同一行向右一格增加1，向左一格减少1；同一列向下一格增加10，向上一格减少10。行末与下一行开头是相邻的数，但不算同一行左右相邻。100在最后一行最后一格。',
      '在表中找到35，向右走一格，再向下走一格；说出每次数字怎样变化。再找10，观察它右边已经没有同一行的格子。',
      [
        number(
          '百数表中，35在同一行右边紧邻的数是多少？',
          36,
          '同一行向右增加1。',
          '35右边同一行紧邻的数是36。',
          { kind: 'hundred-chart', value: 35 },
        ),
        number(
          '百数表中，46在同一行左边紧邻的数是多少？',
          45,
          '同一行向左减少1。',
          '46左边同一行紧邻的数是45。',
          { kind: 'hundred-chart', value: 46 },
        ),
        number(
          '百数表中，27在同一列下一行的数是多少？',
          37,
          '同一列向下一行增加10。',
          '27+10=37。',
          { kind: 'hundred-chart', value: 27 },
        ),
        number(
          '百数表中，68在同一列上一行的数是多少？',
          58,
          '同一列向上一行减少10。',
          '68-10=58。',
          { kind: 'hundred-chart', value: 68 },
        ),
        choice(
          '百数表中，10在第一行最后一格。它在同一行还有右边紧邻的格子吗？',
          ['有', '没有'],
          '没有',
          '每行只有10格，先看看是否已经在行末。',
          '10在第一行最后一格；11是下一行第一格，不能说是同一行的右邻。',
          { kind: 'hundred-chart', value: 10 },
        ),
        number(
          '从90开始，接着数十个数，最后数到几？',
          100,
          '按数的顺序从91接着数到100；这里是接着数，不是同一行移动。',
          '从90接着数十个数，依次到91、92……100。',
          { kind: 'hundred-chart', value: 90 },
        ),
      ],
      { kind: 'hundred-chart', value: 35 },
    ),
    ...hundredPracticeLessons,
  ],
  u4: [
    arithmetic(
      'ml-oral-add',
      '100以内的口算加、减法',
      '两位数加一位数、整十数',
      43,
      '按数位口算，区分加几个一和加几个十。',
      '加一位数先加个位，加整十数先加十位；个位满十，要把十个一合成一个十。',
      [
        [32, '+', 4],
        [32, '+', 20],
        [27, '+', 6],
        [46, '+', 8],
        [58, '+', 30],
        [63, '+', 7],
      ],
    ),
    arithmetic(
      'ml-oral-sub',
      '100以内的口算加、减法',
      '两位数减一位数、整十数',
      43,
      '按数位口算，理解需要退位的情形。',
      '减整十数先减十位。减一位数时个位不够，就拆一个十成十个一，再减；剩下的十和一合起来。',
      [
        [48, '-', 3],
        [48, '-', 20],
        [32, '-', 6],
        [61, '-', 8],
        [77, '-', 30],
        [40, '-', 5],
      ],
    ),
  ],
  u5: [
    arithmetic(
      'ml-written-add',
      '100以内的笔算加、减法',
      '列竖式加法与进位',
      56,
      '相同数位对齐，从个位算起；满十进一。',
      '个位对个位，十位对十位，先算个位。个位满十，把1个十记到十位，十位计算时不要漏掉这个1。',
      [
        [23, '+', 14],
        [36, '+', 21],
        [28, '+', 35],
        [46, '+', 27],
        [57, '+', 8],
        [19, '+', 61],
      ],
      'column',
    ),
    arithmetic(
      'ml-written-sub',
      '100以内的笔算加、减法',
      '列竖式减法与退位',
      56,
      '相同数位对齐，从个位算起；个位不够减时退一。',
      '个位不够减，就从十位拆1个十到个位；十位已经少1，计算十位时要记住。用结果加上减数检查。',
      [
        [68, '-', 23],
        [75, '-', 41],
        [52, '-', 27],
        [64, '-', 38],
        [80, '-', 16],
        [43, '-', 7],
      ],
      'column',
    ),
  ],
  u6: [
    relations('ml-relations', '数量间的加减关系', 69, true),
    ...relationPracticeLessons,
  ],
  shopping: shopping(),
  u7: [
    arithmetic(
      'ml-review',
      '复习与关联',
      '数与计算综合复习',
      83,
      '综合运用数位与加减法解决问题。',
      '联系数位、凑十、退位与笔算。',
      [
        [13, '-', 7],
        [45, '+', 8],
        [67, '-', 20],
        [38, '+', 26],
        [71, '-', 35],
        [49, '+', 21],
      ],
      'column',
    ),
    relations('ml-review-story', '复习与关联', 83, true),
  ],
};

export const mathBooks: Book[] = textbooks
  .filter((item) => item.subject === 'math')
  .map((item) => {
    const lessons = item.volume === 'upper' ? upper : lower;
    const units: Unit[] = item.units.map((unit) => ({
      id: unit.id,
      title: unit.title,
      page: unit.items[0]?.page ?? 1,
      lessons: (lessons[unit.id] ?? []).map((lesson) => ({
        ...lesson,
        reviewQuestions: lesson.reviewQuestions ?? mathReviewQuestions(lesson),
      })),
    }));
    return {
      id: item.id,
      subject: item.subject,
      volume: item.volume,
      edition: item.edition,
      title: `一年级数学${item.volume === 'upper' ? '上' : '下'}册`,
      source: item.source,
      verifiedAt: item.verifiedAt,
      units,
      transitions: item.volume === 'lower' ? mathTransitions : undefined,
      specialties: mathSpecialties(
        item.volume,
        units.flatMap((unit) => unit.lessons),
      ),
    };
  });
