import type { Book, Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
import { referenceKind } from './character-reference';
import { upperCharacters } from './characters';
import { autumnLesson } from './chinese-autumn';
import { compoundVowelPacks } from './chinese-compound-vowels';
import { consonantPacks } from './chinese-consonants';
import { duiyunLesson } from './chinese-duiyun';
import { firstChineseLesson } from './chinese-first-lesson';
import { firstPhonics, firstReading } from './chinese-first-packs';
import { firstUnitChineseLessons } from './chinese-first-unit-lessons';
import { flagLesson } from './chinese-flag';
import { fourSeasonsLesson } from './chinese-four-seasons';
import { gardenEightLesson } from './chinese-garden-eight';
import { gardenFiveLesson } from './chinese-garden-five';
import { gardenFourLesson } from './chinese-garden-four';
import { gardenOneComparison } from './chinese-garden-one';
import { gardenOneLesson, happyReadingLesson } from './chinese-garden-reading';
import { gardenSevenLesson } from './chinese-garden-seven';
import { gardenSixLesson } from './chinese-garden-six';
import { gardenThreeLesson } from './chinese-garden-three';
import { iuuPhonics } from './chinese-iuu';
import { jiangnanLesson } from './chinese-jiangnan';
import { lowerAnimalStoriesLessons } from './chinese-lower-animal-stories';
import { lowerCottonLessons } from './chinese-lower-cotton';
import { lowerFirstReadingLessons } from './chinese-lower-first-reading';
import { lowerFrogRiddleLessons } from './chinese-lower-frog-riddle';
import { lowerGardenEightLessons } from './chinese-lower-garden-eight';
import { lowerGardenFiveLesson } from './chinese-lower-garden-five';
import { lowerGardenFourLesson } from './chinese-lower-garden-four';
import { lowerGardenOneLesson } from './chinese-lower-garden-one';
import { lowerGardenSevenLessons } from './chinese-lower-garden-seven';
import { lowerGardenSixLesson } from './chinese-lower-garden-six';
import { lowerGardenThreeLesson } from './chinese-lower-garden-three';
import { lowerGardenTwoLesson } from './chinese-lower-garden-two';
import { lowerHappyReadingLesson } from './chinese-lower-happy-reading';
import { lowerLastStoriesLessons } from './chinese-lower-last-stories';
import { lowerMinuteLessons } from './chinese-lower-minute';
import { lowerRecognitionPacks } from './chinese-lower-recognition';
import { lowerStationeryLessons } from './chinese-lower-stationery';
import { lowerUnitFiveReadingLessons } from './chinese-lower-unit-five-reading';
import { lowerUnitFourReadingLessons } from './chinese-lower-unit-four-reading';
import { lowerUnitSixReadingLessons } from './chinese-lower-unit-six-reading';
import { lowerUnitThreeReadingLessons } from './chinese-lower-unit-three-reading';
import { lowerUnitTwoReadingLessons } from './chinese-lower-unit-two-reading';
import { riyuemingLesson } from './chinese-riyueming';
import { schoolEntryLessons } from './chinese-school-entry';
import { schoolbagLesson } from './chinese-schoolbag';
import { snowPaintersLesson } from './chinese-snow-painters';
import { chineseSpecialties } from './chinese-specialties';
import { tailsLesson } from './chinese-tails';
import { timetableLesson } from './chinese-timetable';
import { chineseTransitions } from './chinese-transitions';
import { twoTreasuresLesson } from './chinese-two-treasures';
import { crowLesson, rainLesson } from './chinese-unit-eight-reading';
import { formalAiEiUiLesson } from './chinese-unit-four';
import { formalUnitFourMiddle } from './chinese-unit-four-middle';
import { formalUnitFourNasal } from './chinese-unit-four-nasal';
import { littleBoatLesson, shadowLesson } from './chinese-unit-seven-reading';
import { formalUnitThreeInitials, formalYwLesson } from './chinese-unit-three';
import { unitTwoChineseLessons } from './chinese-unit-two';
import { upperRecognitionPacks } from './chinese-upper-recognition';
import { ywLesson } from './chinese-yw';
import { textbooks } from './textbooks';

const recognitionId = 'cu-u1-1-recognition';
function choice(
  index: number,
  prompt: string,
  labels: string[],
  value: string,
  hint: string,
  explanation: string,
): Question {
  return {
    id: `${recognitionId}-q${index}`,
    knowledge: recognitionId,
    prompt,
    choices: labels.map((label) => ({ id: label, label })),
    rule: { kind: 'choice', value },
    hint,
    explanation,
  };
}

/** Original recognition supplement using the verified p105 character scope.
 * It is not a claim that the whole printed lesson has been reproduced or reviewed.
 */
const firstRecognition: Lesson = {
  id: recognitionId,
  textbookTitle: '天地人',
  title: '天地人：六字认读与表达',
  page: 8,
  goal: '认读天、地、人、你、我、他，联系生活理解字义；本包为字表支持的原创识字补充。',
  prerequisite: '请家长读题。还没有学拼音时，不要求孩子独立拼读注音。',
  parentTip:
    '读字和读题由家长陪同；本站没有听音识别或自动发音评分。这里不新增会写字要求。',
  version: 1,
  status: 'available',
  steps: [
    {
      title: '先认字，再联系生活',
      text: '本课字表要求认读：天、地、人、你、我、他。家长依次指字并示范读音：天 tiān，地 dì，人 rén，你 nǐ，我 wǒ，他 tā。孩子可以跟读；这些注音用于家长陪读，不作为孩子已经掌握拼音的证据。',
      visual: {
        kind: 'characters',
        characters: [...required(upperCharacters['u1-1']).recognize],
        grid: 'tian',
      },
    },
    {
      title: '天、地、人，找得到',
      text: '抬头看，云在天上；低头看，脚踩在地上。我们都是人。认字时注意：“天”中有横画；“人”由撇和捺组成。先指字，再说一个生活中的例子。',
      activity:
        '请孩子分别指向天、地，再指向一个人；家长展示这三个字，让孩子把字与动作对应。',
    },
    {
      title: '你、我、他，换个人说',
      text: '正在说话的人用“我”称自己，用“你”称正在对话的人，可以用“他”称谈到的另一位男性。换一个人说话，“我”所指的人也会变化。遇到“她”时，它与“他”读音相同；本包会认字清单不因此增加“她”。',
      activity:
        '孩子对家长说“我在和你说话”；再由家长对孩子说同一句话。两人分别指出这一次“我”和“你”指的是谁。',
    },
    {
      title: '朗读与表达分开记录',
      text: '家长打乱六字顺序，孩子逐个指读。再用自己的话说一个包含“天”“地”或“人”的句子。暂时不会的字可以重新示范；练习中看提示会单独记录，人工确认不作为自动判对。',
      activity:
        '家长记录孩子是否能认读六个字；这一步不要求照抄汉字或自动评判发音。',
    },
  ],
  questions: [
    choice(
      1,
      '云在头顶的空中。下面哪个字表示这里说的“天”？',
      ['地', '天', '人'],
      '天',
      '想一想，抬头看到的是什么。',
      '“天”可以表示天空。云在天上。',
    ),
    choice(
      2,
      '我们走路时，脚踩在地面上。选择表示这里“地面”的第一个字。',
      ['天', '人', '地'],
      '地',
      '低头看看脚踩在哪里。',
      '这里的“地”读dì，表示地面。',
    ),
    choice(
      3,
      '小朋友和家长都是人。选出表示人的字。',
      ['人', '天', '地'],
      '人',
      '观察两笔向左右展开的字。',
      '“人”表示人，字形由撇和捺组成。',
    ),
    choice(
      4,
      '小明对爸爸说：“我在这里。”这句话里的“我”指谁？',
      ['小明', '爸爸'],
      '小明',
      '是谁正在说这句话？',
      '说话的人是小明，他用“我”称自己。',
    ),
    {
      id: `${recognitionId}-q5`,
      knowledge: recognitionId,
      prompt:
        '请家长任意指读天、地、人、你、我、他六个字，再请孩子认读。读音由家长判断；可以重新示范，不进行自动语音评分。',
      visual: {
        kind: 'characters',
        characters: ['他', '地', '你', '天', '我', '人'],
        grid: 'tian',
      },
      rule: { kind: 'manual' },
      hint: '先看字形；需要时请家长示范读音，再跟读。',
      explanation:
        '这是一项人工确认的认读活动。记录完成情况，不等于系统已经确认发音正确。',
    },
    {
      id: `${recognitionId}-q6`,
      knowledge: recognitionId,
      prompt:
        '和家长交换说话的角色，各说一次“我在和你说话”，并指出“我”“你”分别指谁。完成后由孩子或家长确认。',
      rule: { kind: 'manual' },
      hint: '先找正在说话的人，再找正在听这句话的人。',
      explanation:
        '“我”指说话者，“你”指对话者。交换说话者后，两个词所指的人相应变化。表达由孩子或家长确认，不自动评分。',
    },
  ],
  review: {
    date: '2026-09-30',
    reviewer: '官方字表范围核验与原创内容校验',
    notes:
      '教材目录第8页课目及第105页识字表支持六字范围；上册写字表未对这一课列新增会写字。本包是原创识字补充，不宣称该课正文全部已审校，不搬运教材全文或录音。读音、字义与生活情境为原创教学组织，尚未经过教师人工审校。',
  },
};

export const chineseBooks: Book[] = textbooks
  .filter((textbook) => textbook.subject === 'chinese')
  .map((textbook) => ({
    id: textbook.id,
    subject: textbook.subject,
    volume: textbook.volume,
    edition: textbook.edition,
    title: `语文 · ${textbook.volume === 'upper' ? '上册' : '下册'}`,
    source: textbook.source,
    verifiedAt: textbook.verifiedAt,
    transitions: chineseTransitions,
    units: textbook.units.map((unit) => ({
      id: unit.id,
      title: unit.title,
      page: unit.items[0]?.page ?? 1,
      lessons: unit.items.flatMap((item): Lesson[] => {
        const pending: Lesson = {
          reference:
            item.kind === 'reference' ? referenceKind(item.title) : undefined,
          id: `c${textbook.volume === 'upper' ? 'u' : 'l'}-${item.id}`,
          textbookTitle: item.title,
          title: item.title,
          page: item.page,
          goal:
            item.kind === 'reference'
              ? '已核验字表事实可查询，未核验范围单独标注；查询不自动记录掌握。'
              : '正文核验与原创课程制作中；目录条目不是已完成课包。',
          prerequisite: '',
          parentTip: '',
          version: 1,
          status: 'preparing',
          steps: [],
          questions: [],
          review: {
            date: textbook.verifiedAt,
            reviewer: '官方目录核验',
            notes: '仅核对目录，不宣称该课教学内容已完成。',
          },
        };
        const supplements: Record<string, Lesson> = {
          ...upperRecognitionPacks,
          ...consonantPacks,
          ...compoundVowelPacks,
          'u1-1': firstRecognition,
          'u2-1': firstPhonics,
          'u2-2': iuuPhonics,
          'u5-1': firstReading,
          'u3-6': timetableLesson,
          'u3-5': ywLesson,
        };
        const supplement =
          textbook.volume === 'upper'
            ? supplements[item.id]
            : lowerRecognitionPacks[item.id];
        const course = (() => {
          if (textbook.volume === 'upper')
            return item.id === 'u1-1'
              ? firstChineseLesson
              : (schoolEntryLessons[item.id] ??
                  firstUnitChineseLessons[item.id] ??
                  unitTwoChineseLessons[item.id] ??
                  formalUnitThreeInitials[item.id] ??
                  (item.id === 'u4-1' ? formalAiEiUiLesson : undefined) ??
                  formalUnitFourMiddle[item.id] ??
                  formalUnitFourNasal[item.id] ??
                  (item.id === 'u3-6' ? gardenThreeLesson : undefined) ??
                  (item.id === 'u4-6' ? gardenFourLesson : undefined) ??
                  (item.id === 'u5-1' ? autumnLesson : undefined) ??
                  (item.id === 'u5-2' ? jiangnanLesson : undefined) ??
                  (item.id === 'u5-3' ? snowPaintersLesson : undefined) ??
                  (item.id === 'u5-4' ? fourSeasonsLesson : undefined) ??
                  (item.id === 'u5-5' ? gardenFiveLesson : undefined) ??
                  (item.id === 'u6-1' ? duiyunLesson : undefined) ??
                  (item.id === 'u6-2' ? riyuemingLesson : undefined) ??
                  (item.id === 'u6-3' ? schoolbagLesson : undefined) ??
                  (item.id === 'u6-4' ? flagLesson : undefined) ??
                  (item.id === 'u6-5' ? gardenSixLesson : undefined) ??
                  (item.id === 'u7-1' ? littleBoatLesson : undefined) ??
                  (item.id === 'u7-2' ? shadowLesson : undefined) ??
                  (item.id === 'u7-3' ? twoTreasuresLesson : undefined) ??
                  (item.id === 'u7-4' ? gardenSevenLesson : undefined) ??
                  (item.id === 'u8-1' ? tailsLesson : undefined) ??
                  (item.id === 'u8-2' ? crowLesson : undefined) ??
                  (item.id === 'u8-3' ? rainLesson : undefined) ??
                  (item.id === 'u8-4' ? gardenEightLesson : undefined) ??
                  (item.id === 'u3-5' ? formalYwLesson : undefined) ??
                  (
                    {
                      'u1-5': gardenOneLesson,
                      'u1-6': happyReadingLesson,
                    } as Record<string, Lesson>
                  )[item.id] ??
                  pending);
          return (
            lowerFirstReadingLessons[item.id] ??
            lowerFrogRiddleLessons[item.id] ??
            lowerUnitTwoReadingLessons[item.id] ??
            lowerUnitThreeReadingLessons[item.id] ??
            lowerUnitFiveReadingLessons[item.id] ??
            lowerGardenEightLessons[item.id] ??
            lowerLastStoriesLessons[item.id] ??
            lowerCottonLessons[item.id] ??
            lowerGardenSevenLessons[item.id] ??
            lowerAnimalStoriesLessons[item.id] ??
            lowerMinuteLessons[item.id] ??
            lowerStationeryLessons[item.id] ??
            lowerUnitSixReadingLessons[item.id] ??
            lowerUnitFourReadingLessons[item.id] ??
            (item.id === 'u1-5' ? lowerGardenOneLesson : undefined) ??
            (item.id === 'u1-6' ? lowerHappyReadingLesson : undefined) ??
            (item.id === 'u2-4' ? lowerGardenTwoLesson : undefined) ??
            (item.id === 'u3-4' ? lowerGardenThreeLesson : undefined) ??
            (item.id === 'u5-5' ? lowerGardenFiveLesson : undefined) ??
            (item.id === 'u6-5' ? lowerGardenSixLesson : undefined) ??
            (item.id === 'u4-4' ? lowerGardenFourLesson : undefined) ??
            pending
          );
        })();
        const activities =
          textbook.volume === 'upper' && item.id === 'u1-5'
            ? [gardenOneComparison]
            : [];
        return supplement
          ? [course, supplement, ...activities]
          : [course, ...activities];
      }),
    })),
  }))
  .map((book) => ({
    ...book,
    specialties: chineseSpecialties(book.volume, [
      ...book.units.flatMap((unit) => unit.lessons),
      ...book.transitions,
    ]),
  }));
