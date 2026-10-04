import type { Question } from '../learning/types';

const process = 'ml-borrow-process';
const relations = 'ml-borrow-relations';
const organize = 'ml-borrow-organize';
function question(
  id: string,
  group: string,
  index: number,
  review: boolean,
  prompt: string,
  rule: Question['rule'],
  explanation: string,
  labels?: string[],
): Question {
  return {
    id: `${id}-${review ? 'r' : 'q'}-complete-${group}-${index}`,
    knowledge: `${id}-complete-${group}`,
    prompt,
    rule,
    explanation,
    hint: '逐个读清所求，填写全部字段；0不是没填。每道题恢复自己的原条件。',
    choices: labels?.map((label) => ({ id: label, label })),
  };
}
export function borrowCompleteComparisons(review: boolean): Question[] {
  const rows: [number, number, number][] = review
    ? [
        [17, 9, 8],
        [15, 8, 6],
        [13, 7, 7],
        [16, 8, 8],
        [14, 6, 9],
        [12, 5, 6],
      ]
    : [
        [15, 7, 9],
        [13, 6, 6],
        [11, 5, 6],
        [16, 9, 5],
        [14, 8, 7],
        [12, 7, 8],
      ];
  return rows.map(([a, b, c], i) => {
    const result = a - b;
    let value = '=';
    if (result > c) value = '>';
    else if (result < c) value = '<';
    return question(
      organize,
      'compare',
      i,
      review,
      `比较${a}−${b}与${c}，前一边应填哪种关系？`,
      { kind: 'choice', value },
      `先算${a}−${b}=${result}，再比较：${result}${value}${
        c
      }。不是直接比较被减数。`,
      ['>', '<', '='],
    );
  });
}
export function borrowCompleteMissing(review: boolean): Question[] {
  const rows: [number, number][] = review
    ? [
        [8, 12],
        [6, 14],
        [7, 13],
        [4, 12],
        [5, 14],
        [7, 11],
      ]
    : [
        [6, 11],
        [7, 12],
        [5, 13],
        [4, 11],
        [6, 13],
        [5, 12],
      ];
  return rows.map(([part, whole], i) => {
    const missing = whole - part;
    const addition = i === 2 ? `□+${part}` : `${part}+□`;
    return question(
      process,
      'missing-pair',
      i,
      review,
      `依次填${addition}=${whole}、${whole}−${part}=□中的数。两个空都要填。`,
      { kind: 'steps', values: [missing, missing] },
      `缺少的加数为${missing}，因为${part}+${missing}=${whole}；${whole}−${
        part
      }=${missing}，两式表示同一分合。`,
    );
  });
}
export function borrowCompleteBranches(review: boolean): Question[] {
  const rows: [number, number, number, number][] = review
    ? [
        [12, 2, 3, 4],
        [13, 3, 4, 5],
        [14, 4, 5, 6],
        [14, 5, 6, 7],
        [15, 6, 7, 8],
        [16, 7, 8, 9],
      ]
    : [
        [11, 3, 4, 5],
        [12, 4, 5, 6],
        [13, 5, 6, 7],
        [12, 5, 6, 7],
        [13, 6, 7, 8],
        [14, 7, 8, 9],
      ];
  return rows.map(([a, b, c, d], i) =>
    question(
      process,
      'branches',
      i,
      review,
      `分别从${a}出发，依次填${a}−${b}、${a}−${c}、${a}−${
        d
      }的结果，不是连续减三次。`,
      { kind: 'steps', values: [a - b, a - c, a - d] },
      `三式的被减数都为${a}，依次得到${[a - b, a - c, a - d].join(
        '、',
      )}。减数每增加1，差减少1；每式恢复同一整体。`,
    ),
  );
}
export function borrowCompleteChains(review: boolean): Question[] {
  const rows = review
    ? ([
        [7, '+', 3, '-', 8],
        [8, '+', 7, '-', 9],
        [19, '-', 6, '-', 8],
        [16, '-', 9, '+', 3],
        [13, '-', 8, '-', 5],
        [17, '-', 9, '-', 4],
        [15, '-', 8, '+', 4],
        [13, '-', 7, '+', 8],
        [8, '+', 6, '+', 4],
        [12, '+', 3, '-', 9],
        [18, '-', 9, '-', 8],
        [14, '-', 8, '+', 8],
        [12, '-', 7, '+', 4],
        [8, '+', 5, '-', 7],
        [7, '+', 8, '-', 8],
        [16, '-', 9, '-', 4],
        [6, '+', 8, '-', 7],
        [6, '+', 3, '+', 8],
      ] as const)
    : ([
        [5, '+', 5, '-', 8],
        [6, '+', 8, '-', 9],
        [17, '-', 4, '-', 8],
        [18, '-', 9, '+', 1],
        [11, '-', 8, '-', 3],
        [18, '-', 8, '-', 5],
        [13, '-', 6, '+', 4],
        [11, '-', 5, '+', 9],
        [8, '+', 5, '+', 5],
        [10, '+', 5, '-', 9],
        [16, '-', 7, '-', 8],
        [12, '-', 8, '+', 8],
        [10, '-', 5, '+', 4],
        [8, '+', 4, '-', 7],
        [7, '+', 7, '-', 8],
        [18, '-', 9, '-', 4],
        [4, '+', 9, '-', 7],
        [4, '+', 5, '+', 8],
      ] as const);
  return rows.map(([a, op, b, second, c], i) => {
    const intermediate = op === '+' ? a + b : a - b;
    const result = second === '+' ? intermediate + c : intermediate - c;
    const expression =
      String(a) +
      (op === '-' ? '−' : '+') +
      b +
      (second === '-' ? '−' : '+') +
      c;
    return question(
      organize,
      'chain',
      i,
      review,
      `${expression}，依次填第一步结果、最终结果。每题从自己的起点算。`,
      { kind: 'steps', values: [intermediate, result] },
      `先算${a}${op}${b}=${intermediate}，再算${intermediate}${second}${c}=${
        result
      }。中间结果与最终结果分别保存，0也是有效结果。`,
    );
  });
}
export function borrowCompleteHidden(review: boolean): Question[] {
  const rows: [number, number, number][] = review
    ? [
        [14, 8, 5],
        [10, 7, 6],
        [9, 4, 3],
      ]
    : [
        [12, 8, 5],
        [8, 6, 5],
        [7, 3, 4],
      ];
  return rows.map(([total, addend, subtrahend], i) =>
    question(
      organize,
      'hidden',
      i,
      review,
      `三式得数都为${total}：□+${addend}、□−${subtrahend}、${
        total
      }+0。依次填两个遮住的数。`,
      { kind: 'steps', values: [total - addend, total + subtrahend] },
      `前空${total - addend}加${addend}得${total}；后空${total + subtrahend}减${
        subtrahend
      }得${total}。两空所处位置不同，分别代回检查。`,
    ),
  );
}
export function borrowCompletePairs(review: boolean): Question[] {
  const values = review
    ? [1, 2, 5, 6, 7, 10, 11, 12, 13, 14]
    : [2, 3, 6, 7, 8, 11, 12, 13, 14, 15];
  const matches: string[] = [];
  for (const a of values)
    for (const b of values) if (a - b === 5) matches.push(`${a}−${b}`);
  const distractors = review ? ['14−10', '12−6'] : ['15−11', '13−7'];
  const labels = [...matches, ...distractors];
  return [
    question(
      organize,
      'all-pairs',
      0,
      review,
      `数卡${values.join(
        '、',
      )}均可选；不限哪一排。选出全部差为5的式子，不漏同一小数组内的搭配。`,
      { kind: 'set', values: matches },
      `全部合法搭配为${matches.join('、')}，共${
        matches.length
      }组。每一对用大数减小数，所有给定数都要检查，不额外添加跨排限制。`,
      labels,
    ),
  ];
}
export function borrowCompleteClassifications(review: boolean): Question[] {
  const rows: [number, number, number][] = review
    ? [
        [18, 9, 8],
        [19, 8, 9],
      ]
    : [
        [17, 8, 7],
        [16, 7, 6],
      ];
  return rows.map(([whole, red, inside], i) =>
    question(
      relations,
      'classifications',
      i,
      review,
      `同一份${whole}张纸卡，按颜色分红色${red}张和蓝色；按位置分盒内${
        inside
      }张和盒外。依次填蓝色、盒外数量。两种分类各自覆盖全部卡。`,
      { kind: 'steps', values: [whole - red, whole - inside] },
      `蓝色为${whole}−${red}=${whole - red}张；盒外为${whole}−${inside}=${
        whole - inside
      }张。两次恢复同一整体，不能连续减去两种分类的已知部分。`,
    ),
  );
}
export function borrowCompleteQueues(review: boolean): Question[] {
  const rows: [number, number][] = review
    ? [
        [16, 8],
        [13, 12],
      ]
    : [
        [17, 8],
        [12, 11],
      ];
  return rows.map(([whole, left], i) =>
    question(
      relations,
      'queue',
      i,
      review,
      `一行${whole}人包括我，我左边有${left}人。依次填：自己占几人、右边几人。`,
      { kind: 'steps', values: [1, whole - left - 1] },
      `整体包含自己1人；右边为${whole}−${left}−1=${
        whole - left - 1
      }人。若在队尾，右边0人合法，不是未填写。`,
    ),
  );
}
export const borrowProcessSourceTasks = [
  [
    'page-9-methods',
    '实际回第9页原气球题，完整阅读平十、破十、想加算减三种表示，逐个说拆分、中间结果和最终结果，恢复同一整体再换法。原图与本站16张纸片不同，不强迫只会一种合法算法。',
  ],
  [
    'page-9-practice',
    '实际完成第9页做一做全部要求：两条原减9用小棒分别摆、两组加减对应四个式子逐项算、四个原口算式全部核对。缺棒可如实注明纸画替代，不把只填结果当真实摆棒。',
  ],
  [
    'page-10-circle',
    '实际完成第10页两幅原水果图的圈一圈、算一算，两图都按原数量处理，圈走与剩余分别辨认，不只口算或仅处理一图。',
  ],
  [
    'page-10-match',
    '实际完成第10页全部六个减9式子与六个结果的连线，每个式子先算再匹配，全部核对。',
  ],
  [
    'page-10-wheels',
    '实际完成第10页原两轮各八个位置：先一轮加9，再另一轮减9。已给示例与未填分别核对，每位置独立计算，不沿轮圈累计加减。',
  ],
  [
    'page-10-moving',
    '实际回第10页原移动9条，把十个原方格全部分别减9并核对；每次恢复原方格的数，不接着减上一步结果。原顺序与本站第6步原创条不同。',
  ],
  [
    'page-12-method',
    '实际回第12页原风车情境，说已知/所求，分别摆材料或纸画说明破十、想加算减及自己的正确方法，再回看所得剩余。本站其他纸片数不冒原图实践。',
  ],
  [
    'page-12-practice',
    '实际完成第12页两幅原圈图、三组加减对应共六式、三条口算，全部分别核对。图的总量、拿走和剩余分清，不能只完成一组。',
  ],
  [
    'page-13-parts',
    '实际完成第13页原两幅点/三角形分组，分别写两条从同整体出发的减法，全部八个空填完；第二式不是在第一式剩余上继续拿走。',
  ],
  [
    'page-13-families',
    '实际回第13页三个加法与两减法组，全部九式计算，并用同一整体与两个部分解释，每组各自恢复整体。',
  ],
  [
    'page-13-missing',
    '实际完成第13页三组缺加数和对应减法的全部六个空，包含未知数在加法左边的情形；每个答案代回自己的算式。',
  ],
  [
    'page-16-missing',
    '实际完成第16页三组缺加数/对应减法全部六空，与第13页另一组分开完成，不能用本页一个例子代替三组。',
  ],
  [
    'page-16-small',
    '实际完成第16页上方六个原小减数式，并逐个说方法；下方三条口算也全部核对。个位够减与需退位分别判断，不是小减数都不用退位。',
  ],
  [
    'page-16-branches',
    '实际完成第16页三条原分支，每条三个结果共九空。三式都重新从该分支的被减数出发，不连着减三个数；完成后说减数改变时差怎样变。',
  ],
] as const;
export const borrowOrganizeSourceTasks = [
  [
    'page-11-chains',
    '实际回第11页原六条混合计算，逐条记录第一步和最终结果，含最终0。原式与本站六个原创变式分开完成，0不留空。',
  ],
  [
    'page-14-oral-match',
    '实际完成第14页原六条口算、五个式子与结果的全部连线，逐式回看，不只找第一条正确连线。',
  ],
  [
    'page-14-wheels',
    '实际完成第14页原减8、减7、减6三个轮盘的全部外围位置，每轮恢复自己的原数，已给示例也核对，不沿周边连续减。',
  ],
  [
    'page-14-moving',
    '实际回第14页原移动7条，全部十个方格分别减7，包含个位够减的对照式；不能把非退位式说成不能计算，也不套第10页移动9的原顺序。',
  ],
  [
    'page-14-comparisons',
    '实际完成第14页全部六个关系，先算减法结果再比较常数，大于/小于/等于都允许，符号可重复，不凭被减数大小或各用一次猜。',
  ],
  [
    'page-15-matching',
    '实际完成第15页原第6项左右两部分：左边四式对应6/7/8；右边两列共八式按相同得数配对，包含结果5。虚线分开两任务，不把右边结果5强连到左边没有的目标或遗漏不连。',
  ],
  [
    'page-15-chains',
    '实际完成第15页全部六条原混合计算，每条第一步和最终结果均记录，与第11页和本站变式分开；连减/先加再减/连加分别逐步回看。',
  ],
  [
    'page-16-cards',
    '实际回第16页数学游戏全部十五张原卡，逐张算，再找出得数相同的所有卡。可有多张同结果，不限定每组两张；独自排卡与真实同伴游戏分别记，没交流不冒已交流。',
  ],
  [
    'page-19-branches-match',
    '实际完成第19页三个分支的全部九空，每式恢复原被减数；另完成全部七个食物式子与四个结果的连线，同一结果允许连多式。两组各自全部核对。',
  ],
  [
    'page-20-table',
    '实际回第20页原完整退位表，四要求分别完成：说明排列并补剩余算式、任指式说得数、第一列全部减9并说明规律、再说明自己的其他发现。完整45式不等于待填45格；已给示例/范围外格分清，不以旧36式表代替。',
  ],
  [
    'page-21-oral',
    '实际完成第21页原十二个口算式，全部逐式核对，含加法和减法，不只算退位式或网页几个例子。',
  ],
  [
    'page-21-open',
    '实际回第21页两组同差填式，分别完成差6、差9各两个未给式，并说明为什么；再自主写差7和差8的算式。原开放题没限定10～18范围，自己的合理式子不因本站旧活动范围而判错。',
  ],
  [
    'page-22-hidden',
    '实际完成第22页三组相同得数的遮数，共六个未知空，每空先看在加法或减法的哪个位置，再代回；不能把已知得数直接填全部空。',
  ],
  [
    'page-22-pairs',
    '实际回第22页全部十棵白菜的数，找全差5的所有两棵并连线；原题未限定从两排各选一棵，同一排也须检查，包含8与3、9与4，不能只找跨排三组。',
  ],
  [
    'page-22-chains',
    '实际完成第22页全部六条原混合计算，每条第一步和最终结果保存；与第11/15页原式分别完成，不只把最终答案串成一个数组。',
  ],
  [
    'page-22-growth',
    '实际回第22页成长小档案，两方面分别回顾：实际怎样计算并分享方法、实际问题中怎样找到数量关系。交流未发生如实记未做；不会/困难不自动当品德或全部学会，未来安排单列。',
  ],
] as const;
export const borrowRelationSourceTasks = [
  [
    'page-8-scene',
    '实际回第8页原气球、风车、鱼三个情境，分别读图数与文字、提出完整问题并说明所求。遮挡或看不清的数量保留待核对，不把未知猜0；原人物动作与本站故事不混。',
  ],
  [
    'page-11-problems',
    '实际完成第11页原胡萝卜与编筐两题，分别求送出后的剩余、距离目标还需量；全部条件、算式、单位、答句和回看都写，筐的目标不当已经完成数量。',
  ],
  [
    'page-11-gaps',
    '实际回第11页相邻黄旗之间插红旗的原问题，画出原十面黄旗、逐个标出九个相邻间隔，不在两端另加，不把旗面数当间隔数。',
  ],
  [
    'page-13-fish',
    '实际回第13页原13条鱼的两种所求，分别求红鱼和黑鱼，说明同一时刻同一整体的两个部分。第二问恢复原整体，不把静态颜色当鱼游走事件。',
  ],
  [
    'page-15-cars',
    '实际完成第15页原出租车辆表三行全部剩余空，同一行共有减出租，保留辆单位；行之间条件不交叉，不冒本站纸面商店是原车表。',
  ],
  [
    'page-15-dumplings',
    '实际回第15页原汤圆问题，先按原图数已包好的完整汤圆，手中未完成的不能随意算入；再填全部算式、个单位及还需数。没读清实际数量可待核对，不猜一个数把任务勾完成。',
  ],
  [
    'page-15-swans',
    '实际完成第15页原天鹅两分类：整体15，按左右已知左7求右，按颜色已知白6求黑。文字整体不改成只数可见图；两次恢复同整体，不能连减7和6。',
  ],
  [
    'page-17-reading',
    '实际回第17页原团扇情境，完整做阅读理解、分析解答、回顾反思三阶段；已知和所求、图式、算式把单位、答句、两部分合整体核对分别完成，4人不是团扇数量，原情境与本站纸作品数分开。',
  ],
  [
    'page-18-apples',
    '实际完成第18页原苹果题，求吃掉而不是剩下，2天不当吃掉2个；写完整算式单位答句并回看，再自主提一个类似的完整问题并解决。真实互相交流另记，未来准备不当已完成。',
  ],
  [
    'page-18-hidden',
    '实际完成第18页原羽毛球与菠萝两幅隐藏部分题，各自读总量、数可见部分、求隐藏部分，全部算式单位答句填写；括号整体不是容器本身的数量，未知不编。',
  ],
  [
    'page-18-dolphins-squirrels',
    '实际完成第18页原海豚和松果两题，前者总量与跃出量求水下，后者总量与妈妈量求宝宝；数量、对象与只/个单位分别核对。原图实际数不由本站卡片数代替。',
  ],
  [
    'page-19-problems',
    '实际完成第19页原框架题与树上树下猴子/吃桃两题，三个完整问题分别列式、单位、答句和回看。三角形框不是正方形，静态位置与吃掉事件分清，不把猴子只数当桃个数。',
  ],
  [
    'page-21-hidden',
    '实际完成第21页原玩具/粉笔两幅隐藏部分，全部算式与个/支单位分别填写，外面已知与总量完整读清，盒内看不见不等于0。',
  ],
  [
    'page-21-boats',
    '实际完成第21页原折船题，按制作人分整体与部分求小月，黄色船数量为另一个分类信息；不能用黄色6替代小军8，完整解答并回看。',
  ],
  [
    'page-22-queue',
    '实际完成第22页原15人队伍问题，整体包括小红自己，左边8、自己1、右边分开画出再求右边；不能少减自己。实际画队/解释与未来安排分开。',
  ],
  [
    'page-22-story',
    '实际回第22页原7、16、9三数关系，自主编完整数学故事，说明两个部分与整体、已知/所求/单位，列式答句并回看。合理合并、静态部分或减少故事均可，本站17/9/8不同例子不冒原三数已做。',
  ],
] as const;
