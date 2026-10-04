import type { Lesson, Question, Volume } from '../learning/types';

import { required } from '../learning/required';
import { characterScopes } from './characters';

export type WordRow = [
  character: string,
  word: string,
  meaning: string,
  reviewSentence: string,
];
export interface RecognitionPack {
  itemId: string;
  title: string;
  page: number;
  version?: number;
  activity: string;
  rows: WordRow[];
  distractors?: string[];
  writingPage?: number;
}

export function makeRecognitionPack(
  pack: RecognitionPack,
  volume: Volume,
): Lesson {
  const scope = characterScopes(volume)[pack.itemId];
  if (
    !scope ||
    pack.rows.map(([character]) => character).join('') !== scope.recognize ||
    pack.rows.some(
      ([character, word, , sentence]) =>
        !word.includes(character) || !sentence.includes('□'),
    )
  )
    throw new Error('educationLearning.invalidRecord');
  const writingAvailable =
    pack.writingPage !== undefined &&
    scope.writeVerified &&
    scope.write.length > 0;
  const volumeName = volume === 'upper' ? '上册' : '下册';
  const id = `c${volume === 'upper' ? 'u' : 'l'}-${pack.itemId}-recognition`;
  const choicesFor = (target: string) =>
    [
      target,
      ...(pack.distractors ?? pack.rows.map(([character]) => character))
        .filter((character) => character !== target)
        .slice(0, 2),
    ].map((label) => ({ id: label, label }));
  const task = (row: WordRow, index: number, review: boolean): Question => {
    const [character, word, meaning, sentence] = row;
    const completed = review ? sentence.replaceAll('□', character) : word;
    const choices = choicesFor(character);
    if (
      choices.length !== 3 ||
      new Set(choices.map((choice) => choice.id)).size !== 3
    )
      throw new Error('educationLearning.invalidRecord');
    return {
      id: `${id}-${review ? 'r' : 'q'}${index + 1}`,
      knowledge: `c${volume === 'upper' ? 'u' : 'l'}-recognize-u${required(character.codePointAt(0)).toString(16)}`,
      prompt: review
        ? `把句子里的□补成同一个合适的字：${sentence}`
        : `补全词语“${word.replace(character, '□')}”。意思提示：${meaning}`,
      choices,
      rule: { kind: 'choice', value: character },
      hint: `可以先请家长读意思，再看字形。“${word}”里有“${character}”。`,
      explanation: `这里应选“${character}”，补完整是“${completed}”。这道题判断字词对应，不自动评价朗读或书写。`,
    };
  };
  const result: Lesson = {
    id,
    textbookTitle: pack.title,
    title: `${pack.title}：会认字与生活词语（原创补充）`,
    page: pack.page,
    goal: `在家长陪读下认读本课字表范围：${scope.recognize}。用原创词语和情境联系字义，不替代教材整课。`,
    prerequisite:
      volume === 'lower'
        ? '可先复习上册识字与拼音；家长可以读题，不要求孩子独立读懂所有提示。'
        : '还未学拼音时请家长读题；不要求孩子独立认读所有说明。',
    parentTip: (() => {
      if (writingAvailable)
        return `本课会写字范围已核验：${scope.write}，来源为写字表第${pack.writingPage}页。纸笔练习请对照教材本课的规范示范；没有示范可跳过。本站不自动判断笔顺、字形或书写质量，方格字卡不是描红范本。`;
      return (() => {
        if (volume === 'lower' && scope.writeVerified)
          return '本包仅覆盖会认字补充，不新增会写字任务。对应课目的会写范围另见教材查询，不能因认字练习推断已经会写。朗读与表达人工确认，不自动评分。';
        return volume === 'lower'
          ? '本包仅覆盖会认字补充，不新增会写字要求。对应写字表第117页尚待核验，不能因认字练习推断已经会写。朗读与表达人工确认，不自动评分。'
          : '本包仅覆盖会认字补充，不新增会写字要求，也不根据认字练习推断已经会写。朗读与表达人工确认，不自动评分。';
      })();
    })(),
    version: pack.version ?? 1,
    status: 'available',
    steps: [
      {
        title: '看清本课会认字',
        text: `本包认读范围来自人教社2024版${volumeName}识字表：${[...scope.recognize].join('、')}。家长逐个指读，孩子可以跟读。方格仅帮助辨形，不提供未核实的笔顺或描红范本。`,
        visual: {
          kind: 'characters',
          characters: [...scope.recognize],
          grid: 'tian',
        },
        activity:
          '先按顺序认字，再让家长任意指一个字。暂时不会时可以示范后重读。',
      },
      {
        title: '放进词语里理解',
        text: pack.rows
          .map(([, word, meaning]) => `${word}：${meaning}`)
          .join('\n'),
        activity:
          '家长分次读词语和意思，孩子把听到的词与字卡对应。可以分几次学习，不必一次记住所有词。',
      },
      {
        title: '联系生活，说出理由',
        text: pack.activity,
        activity:
          '挑两个词说一说自己的理解；口头表达由家长陪同，不根据固定句式自动评分。',
      },
      {
        title: '练习与朗读分开记录',
        text: '选择题根据所示词语和句子判断。看提示会记录帮助使用；后面的认读和表达由孩子或家长确认，完成不表示系统已经判定发音、阅读或写字水平。',
      },
    ],
    questions: [
      ...pack.rows.map((row, index) => task(row, index, false)),
      {
        id: `${id}-read`,
        knowledge: `${id}-manual`,
        prompt:
          '请家长打乱会认字顺序，孩子逐个指读；不会时可以再次示范。由孩子或家长确认完成，不自动评分。',
        material: [...scope.recognize].join('　'),
        rule: { kind: 'manual' },
        hint: '每次可以少读几个字；先指字，再读词语。',
        explanation: '这项活动记录人工确认完成，不纳入首次独立正确率。',
      },
      {
        id: `${id}-express`,
        knowledge: `${id}-manual`,
        prompt: pack.activity,
        rule: { kind: 'manual' },
        hint: '用自己熟悉的生活例子；不会表达时请家长帮助，不必照抄。',
        explanation:
          '表达可以有不同的合理答案，由孩子或家长确认完成，不用固定句子自动判分。',
      },
    ],
    reviewQuestions: pack.rows.map((row, index) => task(row, index, true)),
    review: {
      date: '2026-09-30',
      reviewer: '官方字表范围与原创任务校验',
      notes:
        volume === 'lower'
          ? `课目与页码来自官方目录，会认范围来自下册第114–116页识字表。${writingAvailable ? `本包会写范围已核验于写字表第${pack.writingPage}页，纸笔活动人工确认。` : '本包未提供会写字练习。'}词语、情境和题目为原创补充；不搬运课文，不宣称正文完整审校或第117页写字要求已核验。尚待教师人工审校。`
          : `课目与页码来自官方目录，会认范围来自上册第105–107页识字表。${writingAvailable ? `会写范围来自第${pack.writingPage}页写字表。` : '本包未提供会写字练习。'}词语、情境与任务为原创补充，不搬运课文或笔顺图，不宣称正文已完整审校；纸笔练习人工确认，尚待教师人工审校。`,
    },
  };
  if (writingAvailable) {
    result.steps.splice(-1, 0, {
      title: '会写字：用纸笔练习',
      text: `本课会写字是${[...scope.write].join('、')}。请打开教材本课的规范示范或使用教师示范，再在纸上练习。注意坐姿、握笔与观察字在田字格中的位置；本页不提供未核验的笔顺动画，也不把普通屏幕字体当成规范描红范本。`,
      activity:
        '选一个会写字，先观察示范，再尝试写。由家长查看并交流；没有示范时可以先跳过，后续再练。',
    });
    result.questions.push({
      id: `${id}-write`,
      knowledge: `${id}-manual-writing`,
      prompt: `有教材或教师示范时，用纸笔练习本课会写字：${[...scope.write].join('、')}。家长查看后确认完成；没有示范可以跳过，不自动判断笔顺、字形或书写质量。`,
      material: [...scope.write].join('　'),
      rule: { kind: 'manual' },
      hint: '先看标准示范，再动笔；写完与示范比较。不熟悉时请家长指导，暂时无法完成可以跳过。',
      explanation:
        '这是纸笔活动的人工完成记录，不是自动书写评分，也不计入客观题正确率。',
    });
  }
  return result;
}
