import { bnuLowerFinalGeometryMapping } from './bnu-lower-final-geometry';
import { bnuLowerFinalNumberMapping } from './bnu-lower-final-numbers';
import { bnuLowerFinalSource } from './bnu-lower-final-source';

export const bnuLowerFinalAudit = {
  resourceId: bnuLowerFinalSource.resourceId,
  checkedAt: '2026-10-06',
  readPrintedPages: bnuLowerFinalSource.readPrintedPages,
  taughtPrintedPages: [90, 91, 92, 93, 94],
  pendingTeachingPages: [95],
  status: 'partial-original-teaching',
  finalTeacherReview: 'not-verified',
  scope:
    '90～92页十三原活动对应两课26讲解、69主任务（37客观/22真实人工/10开放记录）和15换条件复习。两数列全部空位、三组成、四比较、下半年范围、两种数线、两群熊猫、同量白菜、套圈两问、四人排名与自主问题分别覆盖；32多种表示、四竖式及两个生活问题保留实作。375/768/1200完整流程、已知条件表/数字条/竖式字号和空位、表格中英主题与键盘滚动、0刷新/重试/旧人教会话/schema1备份已检查。93～94七项活动已接入图形教学；40主任务（18客观/17真实人工/5开放记录）及8换条件复习在375/768/1200完整流程通过，图形实际边界、字号、中英主题、0刷新/重试/旧记录/schema1备份已检查，95仍待教学，原机器人/火车计数未核清保留null；映射与程序核验不代全册全年或人工最终审校。',
  activities: [...bnuLowerFinalNumberMapping, ...bnuLowerFinalGeometryMapping],
  pendingActivities: bnuLowerFinalSource.activities.filter(
    (activity) => activity.page === 95,
  ),
} as const;
