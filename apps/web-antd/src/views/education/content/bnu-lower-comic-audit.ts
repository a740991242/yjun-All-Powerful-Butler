import { bnuLowerComicLesson, bnuLowerComicMapping } from './bnu-lower-comic';
import { bnuLowerComicSource } from './bnu-lower-comic-source';
export const bnuLowerComicAudit = {
  source: bnuLowerComicSource.source,
  checkedAt: '2026-10-06',
  readPrintedPages: [87, 88, 89],
  status: 'original-teaching-mapped',
  finalTeacherReview: 'not-verified',
  scope:
    '十一原活动对应12讲解、17客观、10真实人工及8开放记录，三项自评分别保留原话、不自动赋星；8复习题改变条件与范围。两源例数量关系重述、图为本站原创。375/768/1200全流程、图形/字号/ARIA/中英主题、0刷新/重试/旧人教会话/schema1备份已检查；程序核验不代全书、全年完整审计，90页起总复习另核。',
  activities: bnuLowerComicMapping.map((activity) => ({
    ...activity,
    lesson: bnuLowerComicLesson.id,
  })),
} as const;
