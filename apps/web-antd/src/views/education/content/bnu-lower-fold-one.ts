import type { BnuFoldOneVisual } from '../learning/bnu-fold-one';
import type { Lesson, Question, Visual } from '../learning/types';

import { bnuLowerFoldOneSource as source } from './bnu-lower-fold-one-source';

const id = 'bnu-lower-fold-one';
const diagram = (
  scene: BnuFoldOneVisual['scene'],
  variant: BnuFoldOneVisual['variant'] = 'main',
): BnuFoldOneVisual => ({ kind: 'bnu-fold-one', scene, variant });
function task(
  suffix: string,
  prompt: string,
  rule: Question['rule'],
  explanation: string,
  visual?: Visual,
): Question {
  return {
    id: `${id}-${suffix}`,
    knowledge: id,
    prompt,
    rule,
    explanation,
    hint: '先看每片完整边界和本题条件。看网页不替代实际折剪拼；空白不当0。',
    ...(visual ? { visual } : {}),
  };
}
function choose(
  suffix: string,
  prompt: string,
  labels: string[],
  value: string,
  explanation: string,
  visual?: Visual,
): Question {
  return {
    ...task(suffix, prompt, { kind: 'choice', value }, explanation, visual),
    choices: labels.map((label) => ({ id: label, label })),
  };
}
const actual = (suffix: string, prompt: string) =>
  task(
    suffix,
    prompt,
    { kind: 'manual' },
    '实际完成本项才确认；只有看图或计划请跳过。成人协助、代剪或替代材料如实说明。',
  );
const record = (suffix: string, prompt: string) =>
  task(
    suffix,
    prompt,
    { kind: 'reflection' },
    '按实际情况用自己的话记录，不自动判正确或确认实做。',
  );
/** Full source-mapped teaching; browser verification is required before publication. */
export const bnuLowerFoldOneLesson: Lesson = {
  id,
  textbookTitle: source.title,
  title: '折、剪、比与四片拼组',
  page: 78,
  version: 1,
  status: 'available',
  goal: '分别尝试对折和剪后比同形，完整照样拼四图，合作创作，并沿箭头折飞机、折出方形、用四片探索新的外轮廓。',
  prerequisite: '认识正方形、长方形、三角形和圆，能逐片计数并观察完整边界。',
  parentTip:
    '依据已读78～79页与97页附页。所有网页图为原创，不是扫描或原书精确尺寸；花鱼图保留分片思路而使用本站造型，不冒原书配色或比例。附页图1两方形、图2长方形/等腰三角形/圆、图3长条长方形，无印刷厘米数。使用已有纸笔，剪具成人协助或代剪，不要求购买；没有实物或原书可如实待做。长方形第三照片折痕尚需操作核对，不补造第三条对称轴。',
  review: {
    date: '2026-10-05',
    reviewer:
      '公开第三方扫描78～79页与附页97页逐项来源核对，原创教学与程序验收',
    notes:
      '七原活动逐项对应，三宽完整39主任务与6新复习、中英主题、图示几何、零值刷新、重试历史与旧记录备份已验；第三长方形照片折痕仍需实物核对，不补造；不冒人工最终审校或全册完成。',
  },
  steps: [
    {
      title: '正方形先沿中间折',
      text: '用附页图1的一张正方形，选一对相对边中点相连的折痕，折时两边对齐。打开再沿这一条折痕剪成两片，拿起转动、叠放比较，两片都是同样大的长方形。本站A、B示意同一方形的两片，内部线是剪缝。',
      visual: diagram('square-mid'),
      activity: '实际折、打开、沿痕剪并叠合比较，记录是否对齐；代剪如实说明。',
    },
    {
      title: '再用另一张沿对角线折',
      text: '换另一张完整正方形，把相对角对齐，打开沿折痕剪成两片三角形，两片可重合。两种剪法各用一张完整纸；剪完的第一张不能当作又恢复成完整纸。本图两条短边相等，不将结论推广所有三角形。',
      visual: diagram('square-diagonal'),
      activity:
        '实际用第二张正方形试对角线剪法，再叠合比较；分别保存两次发现。',
    },
    {
      title: '长方形：折合与剪后转动不同',
      text: '附页图2的长方形可先选中线对折，使对应边对齐，打开剪开再比较。原照片摆向不自动代表三条能叠合的折痕。非正方形的长方形沿对角线剪，两片可转动重合，但沿该线直接翻折不保证重合；不能把这两种操作混为一谈。第三张照片折痕先回原书实际核对，不猜。',
      visual: diagram('rectangle-mid'),
      activity:
        '实际尝试长方形的中线折剪，叠放比较；另试对角线须用另一完整纸并分别记录操作。',
    },
    {
      title: '等腰三角形：顶点对底边中点',
      text: '这里用原附页等腰三角形的思路，从顶点折到底边中点，两个相等的斜边对应，打开剪后两片可叠合。本站示意两片的两条直角边不一样长；原三角形是等腰，不代表任意三角形沿任意折痕都能叠合。',
      visual: diagram('triangle-mid'),
      activity: '实际拿等腰三角形纸，折、剪、比；若材料不同请先说明条件。',
    },
    {
      title: '圆：过圆心折成两半',
      text: '选一条过圆心的直径作折痕，将两半对齐，打开剪开。两片各是半圆：有一条直边和一段弯边，不是两个小圆，也不是四分之一圆。换另一条直径可再试，图中水平只是本站一种摆向。',
      visual: diagram('circle-mid'),
      activity: '实际圆纸对折，打开沿痕剪并叠合比较；直径位置靠实际纸核对。',
    },
    {
      title: '照样拼第1图',
      text: '原78页照样拼共四个作品，第1图外轮廓为三角形，里面两片三角形的接缝仍看得到。本站用两片原创等大三角形展示一种拼法，不冒原书剪片的实际边长。先试边能否对上，再沿整个外边看。',
      visual: diagram('copy-triangle'),
      activity: '实际回原第1图照样拼，并指出每片与整体；与其他作品分开核对。',
    },
    {
      title: '照样拼第2图',
      text: '两片三角形另摆成斜四边形，里面一条接缝不是整个作品的外边。不能因内部都是三角形，就说整个作品也是三角形；纸片转向不增加片数。本站画法供看接缝，原书照样活动仍回原图核对。',
      visual: diagram('copy-slant'),
      activity: '实际回原第2图照样拼，指一圈外轮廓和内部缝。',
    },
    {
      title: '照样拼第3图',
      text: '蘑菇示意的上部为半圆片，下部长方形为柄，两片相接。物品名称不是几何类别；半圆有直径边，不能说整个蘑菇就是一个圆。已有剪片不合适可另用纸描制，不假设每次都由同一材料直接变成。',
      visual: diagram('copy-mushroom'),
      activity: '实际回原第3图照样拼，再说明两片的轮廓。',
    },
    {
      title: '照样拼第4图',
      text: '小旗的三角片为旗面，旗杆由上下两片长方形组成，内部横缝不能忽略，完整一共三片。同一作品的两片长方形相接后看似长杆，仍不是只用一片。四作品可先后复用材料，如实说明，不要求同时保留。',
      visual: diagram('copy-flag'),
      activity: '实际回原第4图照样拼，逐片点数并核对缝。',
    },
    {
      title: '合作创作：花朵思路',
      text: '原79页花和鱼是示例，不限定只能做这两种。本站花朵为原创单色七片图，四个半圆、一个长方形和两个三角形分片可见，并非原书配色或比例。先商量作品、分工和材料，再拼摆；不因有一幅图就确认已经合作。',
      visual: diagram('flower'),
      activity: '实际和同伴商量、分工、拼摆一种作品；可以选择其他合理造型。',
    },
    {
      title: '合作创作：小鱼与着色说明',
      text: '本站鱼图为原创八片示意，两片三角形、两片长方形、四片半圆；两对半圆各合为圆轮廓，圆的内部缝不新增一片。材料连接处可按纸片实际试摆，本站接点和比例不冒教材原图。实际涂色可以自选颜色，再说明用了哪些片、怎样合作及是否重叠。',
      visual: diagram('fish'),
      activity:
        '实际给自己的作品涂色并向同伴说明材料与拼法，分别记录涂色和说明。',
    },
    {
      title: '纸飞机：沿七幅图的箭头读',
      text: '回79页练1，七幅图按上排左起四幅，再从右端向下，下排右到左读。第一幅已经出现折后的纸形，不自行补造原图未给的前一步。跟着每一幅的折痕和箭头实际试，纸层与外边分清；网页次序题不是折飞机动作，飞得远也不是本课完成标准。',
      activity: '实际对照原七图顺序折，每一步对齐核对；不会的折痕请成人协助。',
    },
    {
      title: '长方形折成正方形，不强制剪',
      text: '原练2要求折出正方形，不是必须剪去余纸。本站另给一个2比1长方形的例子，沿长边中间折一次，折后外轮廓为正方形。这个比例是本站明确条件，不由附页照片像素推算；其他比例请另试。纸层增加不等于又多一张原纸。本例停在折一次的正方形；学具图上的下一次虚线是继续折的说明，本项不要求再折。',
      visual: {
        kind: 'paper-fold',
        paper: 'rectangle',
        method: 'parallel',
        stage: 1,
      },
      activity: '实际拿附页图3长方形试折出方形，不强制剪；说明所用纸和折法。',
    },
    {
      title: '正方形沿两条对角线剪四片',
      text: '练3用一张正方形，沿两条对角线打开剪出四片等大的三角形。横竖中线剪的是四个小正方形，不能代替本题。本站A～D原方形示意每片大小一样；不要看图像大就猜实际厘米，不需学习面积公式。',
      visual: diagram('four-triangles'),
      activity: '实际折出两条对角线、打开剪四片，并逐片叠合核对。',
    },
    {
      title: '四片拼成大三角形',
      text: '四片全用，不拉长纸片，也不叠在下面藏住。本例相邻边对应，整体外轮廓三角形，内部三个接缝不当新的外边。图示经过几何核对，但实际纸片是否有缝要自己检查；这是一个例子，不是所有可能拼法。',
      visual: diagram('joined-triangle'),
      activity: '实际用同一四片尝试大三角形，沿外边一圈检查是否有空缺和重叠。',
    },
    {
      title: '再拼梯形，继续开放探索',
      text: '仍用同一四片，另拼成梯形；总片数和每片形状不因转动或换摆法改变。原问还可拼什么，原示例大三角形、梯形不表示只有两种答案。允许其他合理完整作品，自己说明边怎样对上、是否全用，不按作品名字唯一评判。',
      visual: diagram('joined-trapezoid'),
      activity:
        '实际换拼梯形，再尝试自己的一种新拼法；保留发现和仍想核对的问题。',
    },
  ],
  questions: [
    ...(
      [
        ['square-mid', '长方形'],
        ['square-diagonal', '三角形'],
        ['rectangle-mid', '长方形'],
        ['triangle-mid', '三角形'],
      ] as const
    ).map(([scene, shape], index) =>
      choose(
        `halves-${index}`,
        `本站图中A片的完整轮廓是什么？`,
        ['长方形', '三角形', '圆'],
        shape,
        '看这一片完整边界，不看整体名称。',
        diagram(scene),
      ),
    ),
    choose(
      'circle-half',
      '圆沿直径剪开后A片是哪一种？',
      ['半圆', '整个圆', '四分之一圆'],
      '半圆',
      '一条直径和一段半圆弧围成半圆。',
      diagram('circle-mid'),
    ),
    choose(
      'diagonal-compare',
      '非正方形长方形沿对角线剪后能转动重合，就能说沿该线直接翻折必定重合吗？',
      ['不能，剪后转动与沿痕翻折不同', '能，两个操作完全一样'],
      '不能，剪后转动与沿痕翻折不同',
      '操作条件不同，不能据剪后全等补造对称轴。',
    ),
    ...(
      [
        ['copy-triangle', 2],
        ['copy-slant', 2],
        ['copy-mushroom', 2],
        ['copy-flag', 3],
      ] as const
    ).map(([scene, count], index) =>
      task(
        `copy-count-${index}`,
        `本站照样拼第${index + 1}图一共几片？沿每片边界数。`,
        { kind: 'number', value: count },
        '内部接缝区分纸片，不按整个作品外轮廓当成一片。',
        diagram(scene),
      ),
    ),
    task(
      'four-count',
      '本站正方形沿两条对角线剪开，一共几片？',
      { kind: 'number', value: 4 },
      '四片等大三角形，中心不是另一个纸片。',
      diagram('four-triangles'),
    ),
    task(
      'zero-square',
      '已给完整四片清单，里面正方形纸片有几片？未填不当0。',
      { kind: 'number', value: 0 },
      '四片全是三角形，正方形纸片0片；原材料方形不等于剪后片形。',
      diagram('four-triangles'),
    ),
    choose(
      'whole-triangle',
      '全用四片后只沿外边看，这个整体是什么？',
      ['三角形', '四个独立外轮廓', '圆'],
      '三角形',
      '内部缝不当整个外轮廓。',
      diagram('joined-triangle'),
    ),
    choose(
      'whole-trapezoid',
      '全用同四片，这个整体轮廓是什么？',
      ['梯形', '正方形', '圆'],
      '梯形',
      '另摆成梯形，每片大小不变。',
      diagram('joined-trapezoid'),
    ),
    choose(
      'open',
      '原书还有哪些拼法，只能交三角形和梯形吗？',
      ['不是，可以继续探索合理拼法', '是，只能两种'],
      '不是，可以继续探索合理拼法',
      '两种是示例，不把开放问题改成封闭唯一答案。',
    ),
    choose(
      'fold-not-cut',
      '原练2把长方形变正方形，必须先剪去纸吗？',
      ['不必须，原要求折', '必须先剪'],
      '不必须，原要求折',
      '折与剪是不同操作，本站2比1只是一例。',
    ),
    choose(
      'airplane-order',
      '读完上排第四幅，接下来怎么沿箭头读？',
      ['右端向下，再下排右到左', '跳到下排左端再向右'],
      '右端向下，再下排右到左',
      '原七幅按箭头连续核对，不颠倒下排。',
    ),
    choose(
      'cutlines',
      '原一方形剪四个等大三角形，应选哪两条线？',
      ['两条对角线', '横竖中线'],
      '两条对角线',
      '横竖中线产生四小方形，片形不同。',
    ),
    ...['square-mid', 'square-diagonal', 'rectangle', 'triangle', 'circle'].map(
      (key, index) =>
        actual(
          `actual-halves-${key}`,
          `实际完成第${index + 1}项${['方形中线', '另一方形对角线', '长方形', '等腰三角形', '圆'][index]}折、剪、叠合比较；每项分别确认。`,
        ),
    ),
    ...[1, 2, 3, 4].map((n) =>
      actual(
        `actual-copy-${n}`,
        `实际回原78页第${n}幅照样拼完整作品，核对所有片和接缝；做过才确认。`,
      ),
    ),
    actual(
      'actual-cooperate',
      '实际与同伴约定分工并拼出一种作品；看示例不当合作。',
    ),
    actual(
      'actual-color',
      '实际给自己的合作作品着色，颜色可自选；未涂请跳过。',
    ),
    actual(
      'actual-describe',
      '实际向同伴说明所用片与拼法并听对方看法；只有计划请跳过。',
    ),
    actual(
      'actual-airplane',
      '实际对照原七幅箭头顺序折纸飞机并逐步核对；未折请跳过。',
    ),
    actual(
      'actual-square-fold',
      '实际将长方形折出正方形，说明材料与方法；不以剪替代必做折。',
    ),
    actual(
      'actual-four-cut',
      '实际用一方形沿两对角线剪出四片并叠合检查；代剪如实说明。',
    ),
    actual(
      'actual-four-triangle',
      '实际全用同一四片拼大三角形，检查重叠空缺；只看图请跳过。',
    ),
    actual(
      'actual-four-trapezoid',
      '实际换用同四片拼梯形，检查接边与外轮廓；未做请跳过。',
    ),
    actual(
      'actual-four-new',
      '实际用同四片探索另一个合理拼法并说明发现；不限唯一造型。',
    ),
    record(
      'reflection',
      '记录折痕、剪后比较或拼接的发现，仍不确定的原照片折法如实记。',
    ),
    record(
      'cooperation-record',
      '记录实际合作与作品；独自做或未做如实说明，不自动认定已合作。',
    ),
    record('plan', '记录下次想试的折法或作品，未来计划不当本次已完成。'),
  ],
  reviewQuestions: [
    task(
      'review-pieces',
      '整幅四片拼图转了半圈，现在仍一共几片？',
      { kind: 'number', value: 4 },
      '转整个图不改变原四片数量。',
      diagram('joined-triangle', 'review'),
    ),
    choose(
      'review-outline',
      '转半圈后只沿外轮廓看，整体还是哪类？',
      ['三角形', '圆', '正方形'],
      '三角形',
      '转向不改变整体类别。',
      diagram('joined-triangle', 'review'),
    ),
    task(
      'review-flag',
      '小旗转半圈后，旗杆由几片长方形组成？只数旗杆。',
      { kind: 'number', value: 2 },
      '两片旗杆仍两片，三角旗面不算旗杆。',
      diagram('copy-flag', 'review'),
    ),
    choose(
      'review-fold',
      '换成不是2比1的长方形，可以直接保证沿长边中线折后正方形吗？',
      ['不能，需要按新比例试', '能，所有长方形都这样'],
      '不能，需要按新比例试',
      '比例条件改变，不照抄本站特例。',
    ),
    choose(
      'review-open',
      '同伴用四片全用、无重叠空缺拼出另一完整作品，原开放探索要因不是两种示例而拒绝吗？',
      ['不拒绝，要观察并说明', '拒绝，只许示例'],
      '不拒绝，要观察并说明',
      '按条件检查合理拼法，不按示例限制开放创作。',
    ),
    choose(
      'review-compare',
      '同伴剪出的两片可旋转重合，能据此自动确认他已经沿折痕直接叠合成功吗？',
      ['不能，需分别观察实际操作', '能，无需观察'],
      '不能，需分别观察实际操作',
      '剪后移动和折痕翻折不同，实际事实单独核对。',
    ),
  ],
};
