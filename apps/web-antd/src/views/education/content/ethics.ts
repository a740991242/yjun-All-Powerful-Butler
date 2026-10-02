import type { Book, Lesson, Question, Volume } from '../learning/types';
import type { Textbook } from './textbooks';

import { required } from '../learning/required';
import sources from './ethics-source.json';

export const ethicsTextbooks: Textbook[] = (['upper', 'lower'] as const).map(
  (volume) => {
    const source = required(sources.find((item) => item.volume === volume));
    return {
      id: source.id,
      subject: 'ethics',
      volume,
      edition: 'pep-2024',
      resourceId: source.resourceId,
      source: source.source,
      verifiedAt: source.verifiedAt,
      units: source.units.map((unit) => ({
        id: unit.id,
        title: unit.title,
        items: unit.items.map((item) => ({
          id: item.id,
          title: item.title,
          page: item.page,
          kind: 'lesson',
        })),
      })),
    };
  },
);

/** Availability follows authored lessons, not contents or body-read metadata alone. */
function authoredLesson(
  volume: Volume,
  number: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
  page: number,
  t: (key: string) => string,
): Lesson {
  const id = `ethics-${volume}-lesson-${number}`;
  const text = (key: string) => t(`educationEthics.${key}`);
  const prefix = number === 1 ? volume : `${volume}.lesson${number}`;
  const own = (key: string) => text(`${prefix}.${key}`);
  const objectiveIndexes = number === 1 ? [0, 1, 2] : [0, 1, 2, 3];
  let manualIndexes = [0, 1, 2, 3];
  if (number === 6) {
    manualIndexes = [0, 1, 2, 3, 4];
    if (volume === 'upper') manualIndexes.push(5);
  }
  if (number === 7) {
    manualIndexes = [0, 1, 2, 3, 4, 5];
    if (volume === 'upper') manualIndexes.push(6, 7);
  }
  if (number === 8) {
    manualIndexes = [0, 1, 2, 3, 4, 5];
    if (volume === 'lower') manualIndexes.push(6);
  }
  if (number === 9) {
    manualIndexes = [0, 1, 2, 3, 4, 5];
    if (volume === 'lower') manualIndexes.push(6);
  }
  if (number === 10) manualIndexes = [0, 1, 2, 3, 4, 5, 6];
  if (number === 11) {
    manualIndexes = [0, 1, 2, 3, 4, 5];
    if (volume === 'lower') manualIndexes.push(6, 7);
  }
  if (number === 12) {
    manualIndexes = [0, 1, 2, 3, 4, 5, 6];
    if (volume === 'lower') manualIndexes.push(7, 8);
  }
  let reviewer = '原书第四课与原创活动范围核对，非教师最终审校';
  let notes =
    '六三来源0001/0002印刷14～16页已实际阅读；行人设施和信号、道路和铁路分清，安全只纸面演练不冒实地通行；有精神不按外貌音量情绪或辅助方式评分，读说唱分别实际人工、反思null、计划另记。';
  if (number === 1) {
    reviewer = '原书首课与原创情境范围核对，非教师最终审校';
    notes =
      '六三来源0001/0002印刷2～5页已实际阅读；个人情绪、计划和共同目标不自动评分，实际活动人工确认，未来计划与已做分开；其它正文未核对课保持制作中。';
  } else if (number === 2) {
    reviewer = '原书第二课与原创活动范围核对，非教师最终审校';
    notes =
      '六三来源0001/0002印刷6～9页已实际阅读；升旗角色明确、国歌外部合法示范、个人感受不判对错，原创六位置图与原书找不同分开；实际活动人工、反思null、计划另记。';
  } else if (number === 3) {
    reviewer = '原书第三课与原创活动范围核对，非教师最终审校';
    notes =
      '六三来源0001/0002印刷10～13页已实际阅读；校园示例不冒本校设施与权限，道歉与补救、原因与改法、模拟与实际分开；个人偏好与反思不判对错，实际活动人工、计划另记。';
  } else if (number === 5) {
    reviewer = '原书第五课与原创活动范围核对，非教师最终审校';
    notes =
      '六三来源0001/0002印刷18～21页已实际阅读；老师与工作人员角色明示、三类求助各演练、帮助感谢与安静求助分清；请求回应与参与、共同规则与实际轮流、四加入方法和三友好办法分别实际人工，反思null、计划另记。';
  }
  if (number === 6) {
    reviewer = '原书第六课与原创活动范围核对，非教师最终审校';
    notes =
      '上册印刷22～24页、下册22～25页已实际阅读；完整八幅交友故事与两种情绪关心分别人工，求助六情境、请求回应与帮助传递实际演练；危险只纸面讨论、双方同意先于活动，模拟与真实分开，反思null、计划另记。';
  }
  if (number === 7) {
    reviewer = '原书第七课与原创活动范围核对，非教师最终审校';
    notes =
      '上册印刷25～28页、下册26～29页已实际阅读；课表示例与真实学校分开，准备听想提问、复习手工及读写艺术音乐体育分别实际；图书四阶段、方法玩法、爱护归还与三边界沟通人工，不强迫分享或原谅、不制造损坏，反思null、计划另记。';
  }
  if (number === 8) {
    reviewer = '原书第八课与原创活动范围核对，非教师最终审校';
    notes =
      '上册印刷29～32页、下册30～32页已实际阅读；课间需要与结束、课后服务兴趣和计划分记，合作分工各贡献、四角色冲突与六动物故事完整读听分别人工；可见桌面替代不冒蒙眼/运动/危险动作，协作不保证效率快乐，反思null、计划另记。';
  }
  if (number === 9) {
    reviewer = '原书第九课与原创活动范围核对，非教师最终审校';
    notes =
      '上册印刷34～36页、下册34～37页实际阅读；作息记录与未知、三早晨和六睡眠故事完整、陪伴及提醒和真实次日分记；家庭关系明示、相似不证血缘、八兄妹故事完整、不收隐私，反思null、计划另记。';
  }
  if (number === 10) {
    reviewer = '原书第十课与原创活动范围核对，非教师最终审校';
    notes =
      '上册印刷37～40页、下册38～40页实际阅读；洗手七部位与全过程、食物三提醒、餐桌四幅及需要分记；家庭三关怀、两工作三照顾、完整四背包、三情境与四虚构生日分别人工；不强迫清盘/接触/披露，不冒扮演为真实经历，反思null、计划另记。';
  }
  if (number === 11) {
    reviewer = '原书第十一课与原创活动范围核对，非教师最终审校';
    notes =
      '上册印刷41～43页、下册41～44页实际阅读；两组四礼貌情境、请求回应/倾听等待/花瓣分别实际，不迫表情眼神或服从；物品双谜语、两散放、六卡分类标签找回、取用归位与适合照顾、真实时机参与分记，不把辅助或未来安排当品德错/已执行，反思null、计划另记。';
  }
  if (number === 12) {
    reviewer = '原书第十二课与原创活动范围核对，非教师最终审校';
    notes =
      '上册印刷44～46页、下册45～48页实际阅读；两安全/三节制与四求助资料完整读听，号码纸卡、不做危险或医疗处理，换玩法/新纸玩具/原创规则与停止实际分记；家务五苹果/三经历/六叠衣图、真实两衣物、已知系带或自会方法、三沟通和七天提示/实际贡献分记，不补造未来或强迫能力，反思null、计划另记。';
  }
  const objective = (review: boolean): Question[] =>
    objectiveIndexes.map((index) => ({
      id: `${id}-${review ? 'review' : 'main'}-${index}`,
      knowledge: `${id}-scenario-${index}`,
      prompt: own(`pairs.${index}.${review ? 'reviewPrompt' : 'prompt'}`),
      material: own(
        `pairs.${index}.${review && number === 2 && index === 2 ? 'reviewMaterial' : 'material'}`,
      ),
      choices: [
        { id: 'first', label: own(`pairs.${index}.first`) },
        { id: 'second', label: own(`pairs.${index}.second`) },
      ],
      rule: { kind: 'choice', value: review ? 'second' : 'first' },
      hint: text('hint'),
      explanation: own(`pairs.${index}.explanation`),
    }));
  return {
    id,
    title: own(number === 1 ? 'l1' : 'title'),
    textbookTitle: own(number === 1 ? 'l1' : 'title'),
    page,
    version: 1,
    status: 'available',
    goal: own('goal'),
    prerequisite: number === 1 ? text('prerequisite') : own('prerequisite'),
    parentTip: number === 1 ? text('parentTip') : own('parentTip'),
    steps: [0, 1, 2, 3, 4].map((index) => ({
      title: own(`steps.${index}.title`),
      text: own(`steps.${index}.text`),
      activity: own(`steps.${index}.activity`),
    })),
    questions: [
      ...objective(false),
      ...manualIndexes.map((index): Question => ({
        id: `${id}-manual-${index}`,
        knowledge: `${id}-manual-${index}`,
        prompt: own(`manual.${index}`),
        rule: { kind: 'manual' },
        hint: text('manualHint'),
        explanation: text('manualExplanation'),
      })),
      ...[0, 1].map((index): Question => ({
        id: `${id}-reflection-${index}`,
        knowledge: `${id}-reflection-${index}`,
        prompt: own(`reflections.${index}`),
        rule: { kind: 'reflection' },
        hint: text('reflectionHint'),
        explanation: text('reflectionExplanation'),
      })),
    ],
    reviewQuestions: objective(true),
    review: {
      date: '2026-10-02',
      reviewer,
      notes,
    },
  };
}

export function createEthicsBooks(t: (key: string) => string): Book[] {
  return ethicsTextbooks.map((book) => ({
    ...book,
    title: t(`educationEthics.${book.volume}.title`),
    units: book.units.map((unit, unitIndex) => ({
      id: unit.id,
      title: t(`educationEthics.${book.volume}.u${unitIndex + 1}`),
      page: required(unit.items[0]).page - 1,
      lessons: unit.items.map((item, itemIndex): Lesson => {
        const number = unitIndex * 4 + itemIndex + 1;
        if (
          number === 1 ||
          number === 2 ||
          number === 3 ||
          number === 4 ||
          number === 5 ||
          number === 6 ||
          number === 7 ||
          number === 8 ||
          number === 9 ||
          number === 10 ||
          number === 11 ||
          number === 12
        )
          return authoredLesson(book.volume, number, item.page, t);
        const title = t(`educationEthics.${book.volume}.l${number}`);
        return {
          id: item.id,
          title,
          textbookTitle: title,
          page: item.page,
          version: 1,
          status: 'preparing',
          goal: t('educationEthics.pendingGoal'),
          prerequisite: '',
          parentTip: t('educationEthics.sourceNotice'),
          steps: [],
          questions: [],
          review: { date: '', reviewer: '', notes: '' },
        };
      }),
    })),
  }));
}
