import type { Lesson, Question } from '../learning/types';

import { sujiaoUpperSource } from './sujiao-upper-source';

function tasks(review: boolean): Question[] {
  const prefix = `sj-upper-intro-games-${review ? 'r' : 'q'}`;
  const counts = review ? [3, 5, 7] : [2, 4, 6];
  const amount = review ? 7 : 6;
  return [
    ...counts.map((count, index): Question => ({
      id: `${prefix}-count-${index}`,
      knowledge: `sj-intro-point-count-${index}`,
      prompt: review
        ? '这次只数第二组圆点，每个只数一次，第二组有几个？'
        : '报数拿物前先观察，只数第一组圆点，第一组有几个？',
      visual: {
        kind: 'count',
        count: review ? 2 : count,
        other: review ? count : 3,
      },
      rule: { kind: 'number', value: count },
      hint: '先认清指定的组，再逐个点数；另一组不算进来。',
      explanation: `指定的一组有${count}个圆点，最后说出的数表示这组的数量。`,
    })),
    {
      id: `${prefix}-number-meaning`,
      knowledge: 'sj-intro-number-meaning',
      prompt: review
        ? '小禾说“我有7支笔”，这里的7表示什么？'
        : '小禾说“我有6本书”，这里的6表示什么？',
      choices: [
        { id: 'quantity', label: review ? '笔的数量' : '书的数量' },
        { id: 'age', label: '小禾的年龄' },
        { id: 'code', label: '物品的编号' },
      ],
      rule: { kind: 'choice', value: 'quantity' },
      hint: '听完整句子，数字表示什么要看它描述的事情。',
      explanation: '这句话在说有多少件物品，没有提供年龄或编号。',
    },
    {
      id: `${prefix}-compare`,
      knowledge: 'sj-intro-compare',
      prompt: review
        ? '小雨拿5个圆片，小林拿3个圆片，谁拿得多？'
        : '小雨拿3个圆片，小林拿5个圆片，谁拿得多？',
      choices: [
        { id: 'rain', label: '小雨' },
        { id: 'forest', label: '小林' },
        { id: 'same', label: '同样多' },
      ],
      rule: { kind: 'choice', value: review ? 'rain' : 'forest' },
      hint: '先数实际圆片，也可以一对一摆好，看哪边还有多余。',
      explanation: '5个比3个多，与圆片摆得疏或密无关。',
    },
    {
      id: `${prefix}-rearrange`,
      knowledge: 'sj-intro-quantity-conservation',
      prompt: `把${amount}个圆片从一排改摆成一圈，没有添也没有拿走。现在还是几个？`,
      rule: { kind: 'number', value: amount },
      hint: '换了摆法，每个圆片还在；重新点数检查。',
      explanation: `只是改变位置，仍有${amount}个。圆片占的地方大小不是圆片数量。`,
    },
    {
      id: `${prefix}-sort-use`,
      knowledge: 'sj-intro-sort-use',
      prompt: review
        ? '按用途整理，把所有用来写字的物品选出来。'
        : '按用途整理，把所有用来读的书选出来。',
      choices: [
        { id: 'story', label: '一本故事书' },
        { id: 'pencil', label: '一支铅笔' },
        { id: 'picture', label: '一本图画书' },
        { id: 'pen', label: '一支水笔' },
      ],
      rule: {
        kind: 'set',
        values: review ? ['pencil', 'pen'] : ['story', 'picture'],
      },
      hint: '这次按用途，不按颜色或大小；要把符合的全部选上。',
      explanation: review
        ? '铅笔和水笔用来写字，故事书与图画书用来读。'
        : '故事书与图画书放入书的一类，不把笔混进去。',
    },
    {
      id: `${prefix}-sort-subject`,
      knowledge: 'sj-intro-sort-subject',
      prompt: review
        ? '按学科整理，把所有语文课使用的本子选出来。'
        : '按学科整理，把所有数学课使用的本子选出来。',
      choices: [
        { id: 'math-book', label: '数学课本' },
        { id: 'chinese-book', label: '语文课本' },
        { id: 'math-work', label: '数学练习本' },
        { id: 'chinese-work', label: '语文练习本' },
      ],
      rule: {
        kind: 'set',
        values: review
          ? ['chinese-book', 'chinese-work']
          : ['math-book', 'math-work'],
      },
      hint: '按题目约定的学科，不是把所有课本放一起。',
      explanation: '同一学科的课本与练习本归在一起，分类标准要保持一致。',
    },
    {
      id: `${prefix}-sort-color`,
      knowledge: 'sj-intro-sort-color',
      prompt: review
        ? '这次改按颜色，把所有蓝色圆片选出来。'
        : '这次改按颜色，把所有红色圆片选出来。',
      choices: [
        { id: 'red-small', label: '小红圆片' },
        { id: 'blue-big', label: '大蓝圆片' },
        { id: 'red-big', label: '大红圆片' },
        { id: 'blue-small', label: '小蓝圆片' },
      ],
      rule: {
        kind: 'set',
        values: review ? ['blue-big', 'blue-small'] : ['red-small', 'red-big'],
      },
      hint: '同一种颜色中可以有不同大小，这次大小不影响分组。',
      explanation: '只按颜色选择；不能把“同样大”偷偷变成新的条件。',
    },
    {
      id: `${prefix}-different-methods`,
      knowledge: 'sj-intro-different-criteria',
      prompt: review
        ? '小禾把课本和练习本分开放，小林把同学科的课本和练习本放一起。能只因分法不同就说其中一人错吗？'
        : '小禾按颜色整理圆片，小林按大小整理圆片。能只因分法不同就说其中一人错吗？',
      choices: [
        { id: 'criteria', label: '不能，要先听各自的分类标准，再检查是否一致' },
        { id: 'same-only', label: '能，所有人必须只有一种分法' },
      ],
      rule: { kind: 'choice', value: 'criteria' },
      hint: '整理方法可以不同，但每种方法要说清标准，实际分组要符合标准。',
      explanation: '不同的合理标准都可以使用，不能只看分组不同就判错。',
    },
  ];
}

export const sujiaoIntroGamesDraft: Lesson = {
  id: 'sj-upper-intro-games',
  textbookTitle: '数学游戏分享',
  title: '入学游戏：报数拿物、比较与整理',
  page: 1,
  status: 'preparing',
  version: 1,
  goal: '通过报数拿物与画物建立数量对应，比较和解释不同摆法；按约定标准整理物品，听取不同分法并表达自己的想法。',
  prerequisite:
    '家长可以帮读题和示范口头数数。准备10个安全圆片、纸笔、几本书和笔；这是入学观察，不要求已掌握写数字。',
  parentTip:
    '数错或不会认数字时允许家长帮助并如实记录，不用初次结果给孩子贴标签。介绍可以只说物品数量，不要求提供生日、真实年龄或个人信息。拼搭、拼图、围区域和路径活动还需独立课包，本课不代表全部开篇游戏已完成。',
  steps: [
    {
      title: '用数量介绍，先听清数什么',
      text: '说“这里有4块积木”，数字说的是积木数量。听清要数哪组物品，边指边数，每个只数一次；最后的数表示总数。不把另一组或物品编号混进来。',
      visual: { kind: 'count', count: 4, other: 3 },
      activity: '请家长报一个1～10的数，拿出相应数量圆片，再互换角色检查。',
    },
    {
      title: '画物、换摆法与比较',
      text: '拿几片就在纸上画几个圆，一片对应一个圆。把同一批圆片改摆成一排或一圈，再点数验证数量没变。两组比较时可以一对一配好，看哪组还多出圆片；不按占的位置判断多少。',
      activity:
        '实际数出10个圆片，换两种摆法；另拿两组不同数量圆片，配对比较。',
    },
    {
      title: '按一个说清的标准整理',
      text: '可以把笔与书分开，也可以将同学科的课本和练习本放一起。开始前说清这一次按什么分，整理后检查每件物品是否放对，不同时悄悄改变标准。',
      activity: '先按物品用途整理，再重新混合，换一个能说明的标准整理。',
    },
    {
      title: '听不同办法，再说自己的发现',
      text: '同一批物品按颜色或按大小，可以得到不同分组。先听理由，再检查每组是否符合这次标准。说一个自己喜欢的游戏、一个还想试的办法，完成观察不表示所有知识已经掌握。',
      activity:
        '向家长介绍自己的整理办法，听家长另一种办法，再说一项还想练的活动。',
    },
  ],
  questions: [
    ...tasks(false),
    {
      id: 'sj-intro-manual-count',
      knowledge: 'sj-intro-physical-count-draw',
      prompt:
        '实际玩报数拿物：家长报一个1～10的数，你拿相应圆片，再每片画一个圆并点数核对。互换角色后再玩一次。',
      rule: { kind: 'manual' },
      hint: '看实际拿取和纸上画的数量，逐项对应；帮助了就记录帮助。',
      explanation: '实物拿取、画物和检查人工确认，不以屏幕填数代替。',
    },
    {
      id: 'sj-intro-manual-arrange',
      knowledge: 'sj-intro-physical-conservation',
      prompt:
        '数出10个圆片，改摆成两种样子，每次点数；另摆两组圆片，一对一比较，说谁多或同样多。',
      rule: { kind: 'manual' },
      hint: '不添不减时数量不变；比较不同组时分别数清，不按疏密判断。',
      explanation: '真实改摆、配对和解释由家长查看，平台不自动评价动作。',
    },
    {
      id: 'sj-intro-manual-sort',
      knowledge: 'sj-intro-physical-sort-reflect',
      prompt:
        '实际整理几件书或文具，说清一个标准，再换一个标准重新整理。向家长解释分组，并说一个喜欢的游戏和还想试的办法。',
      rule: { kind: 'manual' },
      hint: '每次保持标准一致；不需要上传书包或个人照片。',
      explanation: '实际整理与表达单独人工确认，不把客观分类题答对当作已操作。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: sujiaoUpperSource.checkedAt,
    reviewer: '同册原书范围核验与原创课包',
    notes: `已实际查看${sujiaoUpperSource.preview}同册印刷第1～4、9～10页，版权为2024年7月第1版、2025年7月第2次印刷。本站故事、数量、图示和问答原创；尚未覆盖原书第5～8页拼搭、拼图、围区域与路径活动。保持筹备，未登记成完整教材或替换人教版。`,
  },
};
