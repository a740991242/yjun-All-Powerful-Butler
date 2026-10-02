import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
import { firstLessonTeachingSource } from './chinese-source-audit';

const id = 'cu-u1-1';
const characters = ['天', '地', '人', '你', '我', '他'];
const charSkill = (character: string) =>
  `cu-recognize-u${required(character.codePointAt(0)).toString(16)}`;
function choose(
  suffix: string,
  knowledge: string,
  prompt: string,
  labels: string[],
  value: string,
  hint: string,
  explanation: string,
): Question {
  return {
    id: `${id}-${suffix}`,
    knowledge,
    prompt,
    choices: labels.map((label) => ({ id: label, label })),
    rule: { kind: 'choice', value },
    hint,
    explanation,
  };
}
const contexts = [
  [
    '天',
    '蓝色的天空在头顶。选出“天空”的第一个字。',
    '雨过后，抬头看见天空。选出表示天空的字。',
    '抬头观察天空。',
    '“天”可以表示天空。',
  ],
  [
    '地',
    '小朋友站在地面上。选出“地面”的第一个字。',
    '我们把落叶捡起来，地面变干净了。选出表示地面的字。',
    '想一想脚踩在哪里。',
    '这里的“地”读dì，表示地面。',
  ],
  [
    '人',
    '老师和同学都是人。选出表示人的字。',
    '公园里有大人和小朋友。选出表示人的字。',
    '观察由撇和捺组成的字。',
    '“人”表示人。',
  ],
  [
    '你',
    '小林对爸爸说：“你坐这里。”选出他称呼正在对话的爸爸所用的字。',
    '爸爸对小林说：“你看这朵花。”选出他称呼正在对话的小林所用的字。',
    '找正在听对方说话的人。',
    '称呼正在对话的人可以用“你”。',
  ],
  [
    '我',
    '小乐指着自己说：“我来了。”选出他称呼自己的字。',
    '老师指着自己说：“我来示范。”选出老师称呼自己的字。',
    '找正在说话的人自己。',
    '说话的人用“我”称自己。',
  ],
  [
    '他',
    '小林和爸爸谈起没有参加对话的弟弟：“他在看书。”选出称呼这位弟弟的字。',
    '老师和孩子谈起旁边没有参加对话的男孩：“他在画画。”选出称呼这个男孩的字。',
    '谈到另一位男性时可以用哪个字？',
    '这里用“他”称谈到的另一位男性。',
  ],
];
const characterTasks = (review: boolean) =>
  contexts.map(([character, prompt, reviewPrompt, hint, explanation], index) =>
    choose(
      `${review ? 'r' : 'q'}-char-${index}`,
      charSkill(required(character)),
      required(review ? reviewPrompt : prompt),
      characters,
      required(character),
      required(hint),
      required(explanation),
    ),
  );
const sceneTasks = (review: boolean): Question[] => {
  const variant = review ? 'garden' : 'hill';
  return [
    ['sky', '天空', review ? '2' : '1'],
    ['ground', '地面', review ? '3' : '2'],
    ['person', '人', review ? '1' : '3'],
  ].map(([skill, name, number]) => ({
    ...choose(
      `${review ? 'r' : 'q'}-scene-${skill}`,
      `${id}-scene-${skill}`,
      `看这幅原创生活示意图，哪个编号指向${name}？`,
      ['1', '2', '3'],
      required(number),
      '观察编号旁的景物或人物。',
      `本图中编号${number}指向${name}。编号只用于指认这幅图，不是汉字的固定含义。`,
    ),
    visual: { kind: 'nature-scene', variant },
  }));
};
const dialogueTasks = (review: boolean) => {
  const speaker = review ? '爸爸' : '小林';
  const listener = review ? '小林' : '爸爸';
  const third = review ? '哥哥' : '弟弟';
  const material = `${speaker}正在对${listener}说话，${third}没有参加他们的对话。
${speaker}说：“我在和你说话，他在看书。”`;
  return [
    ['me', '我', speaker],
    ['you', '你', listener],
    ['he', '他', third],
  ].map(([skill, word, value]) => ({
    ...choose(
      `${review ? 'r' : 'q'}-role-${skill}`,
      `${id}-pronoun-${skill}`,
      `这句话里的“${word}”指谁？`,
      [speaker, listener, third],
      required(value),
      '先看清谁在说话、谁在听，以及他们谈到的另一位男性。',
      `在这一次对话中，“${word}”指${value}。换说话的人后要重新判断。`,
    ),
    material,
  }));
};
const objective = (review: boolean) => [
  ...characterTasks(review),
  ...sceneTasks(review),
  ...dialogueTasks(review),
];
export const firstChineseLesson: Lesson = {
  id,
  textbookTitle: '天地人',
  title: '天地人',
  page: 8,
  goal: '认读六个字，分组朗读，观察天空、地面与人物；通过交换角色理解你、我、他。',
  prerequisite: '请家长陪读题目；尚未学习拼音，不要求独立拼读注音。',
  parentTip:
    '本站提供原创示意图和活动。教材第8页国画请通过纸质教材或官方电子教材观察；朗读由家长或教师示范与确认，不自动评定发音，不新增写字要求。',
  version: 1,
  status: 'available',
  steps: [
    {
      title: '看看天、地、人',
      text: '看本站原创示意图：上面有天空，下面有地面，地面上站着人。指一指这些地方，再联系身边的景物说一说。图中的数字只是方便指认。',
      visual: { kind: 'nature-scene', variant: 'hill' },
      activity:
        '回看教材第8页原图，分别找天空、地面和人物；本站示意图不代替教材国画。',
    },
    {
      title: '分成两组认读',
      text: '先认天、地、人，再认你、我、他。请家长逐字示范，孩子跟读，再连起来读每组三个字。这里不要求写六个字。',
      visual: { kind: 'characters', characters, grid: 'tian' },
      activity: '在教材上指读两组字；如果还不会，请家长再示范。',
    },
    {
      title: '联系生活说一说',
      text: '天空中有云，操场的地面可以走路，家长和孩子都是人。把字与身边的事物联系起来，自己说一个包含天、地或人的句子。',
      activity: '先指字，再说一个生活中的例子。',
    },
    {
      title: '交换说话的角色',
      text: '小林对爸爸说“我在和你说话”；这时我指小林，你指爸爸。爸爸对小林说同一句话时，我指爸爸，你指小林。谈起没有参加对话的弟弟时，可以用他。她与他读音相同，但本课会认字范围只列他。',
      activity: '两人轮流说话并指出我和你各指谁；倾听对方，把话说清楚。',
    },
    {
      title: '回到教材，朗读与交流',
      text: '请对照教材第8页，在家长或教师示范后认读和朗读两组字。再观察原图，说说看到了什么。练习的选择题检查辨认与理解；朗读、看图表达和交流由人工确认，完成不等于掌握。',
      activity:
        '准备教材与朗读示范；缺少示范时可以稍后完成，不用文字转语音冒充教材标准录音。',
    },
  ],
  questions: [
    ...objective(false),
    {
      id: `${id}-manual-read`,
      knowledge: `${id}-oral-reading`,
      prompt:
        '请家长或教师示范，孩子认读天、地、人、你、我、他，再按两组朗读。可对照教材第8页。本站没有教材录音或自动语音评分。',
      visual: { kind: 'characters', characters, grid: 'tian' },
      rule: { kind: 'manual' },
      hint: '一字一字跟读，再读每组三个字。',
      explanation: '认读与朗读由孩子或家长确认完成，不纳入客观题正确率。',
    },
    {
      id: `${id}-manual-picture`,
      knowledge: `${id}-picture-expression`,
      prompt:
        '看这幅原创图，指一指天空、地面和人物，用自己的话说说看到的景物。还可以回看教材第8页原图，比较它们。',
      visual: { kind: 'nature-scene', variant: 'hill' },
      rule: { kind: 'manual' },
      hint: '可以从“我看见……”开始说。',
      explanation: '允许不同的完整表达，由孩子或家长确认，不自动给口语打分。',
    },
    {
      id: `${id}-manual-dialogue`,
      knowledge: `${id}-role-exchange`,
      prompt:
        '孩子和家长轮流说“我在和你说话”，每人指出这次我和你指谁；再谈起一位没有参加对话的男性，试着用他称呼。倾听对方说完。',
      rule: { kind: 'manual' },
      hint: '换说话的人时，再找一遍我和你。',
      explanation:
        '角色交流由孩子或家长确认完成，不用选择题结果代替实际表达能力。',
    },
  ],
  reviewQuestions: objective(true),
  review: {
    date: firstLessonTeachingSource.checkedAt,
    reviewer: '官方2024课时教学设计范围核验与原创课包程序校验',
    notes: `依据：${firstLessonTeachingSource.title}（${firstLessonTeachingSource.url}），明确人民教育出版社2024年8月教材、第8页及六字认读、朗读、看图与人称交流范围。本站场景、生活语境和问答均为原创。原教材国画与标准音频未在本站复制，本站原创内容尚待教师最终人工审校；此开放仅针对本课，不表示全册完成。`,
  },
};
