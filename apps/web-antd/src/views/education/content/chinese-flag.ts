import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';

export const flagPageAudit = {
  itemId: 'u6-4',
  title: '升国旗',
  pages: [78, 79],
  recognize: '升国旗中们声起多么向立',
  write: '中五风立正',
  sourceUrl: 'https://keben.app/book/0025',
  provider: '第三方原书公开预览',
  checkedAt: '2026-10-01',
  isbn: null,
  editionDate: null,
  printingDate: null,
  author: null,
  adapted: true,
  sourceNote: '人民教育出版社《九年一贯制试用课本（全日制）语文第一册》',
  activities: ['朗读课文', '背诵课文', '认读十一字', '规范书写五字'],
};
const id = 'cu-u6-4';
const reading =
  '先与家长共读教材印刷第78—79页《升国旗》，再回看指定信息。原书脚注注明选自人教社旧试用课本语文第一册、有改动，未署个人作者，不补造署名；本站不提供教材全文、原画或录音。缺原书可跳过，不凭题目猜原文。';
const characters = [
  ['升', '升起中的第一个字。', '上升中的第二个字。'],
  ['国', '国旗中的第一个字。', '中国中的第二个字。'],
  ['旗', '国旗中的第二个字。', '红旗中的第二个字。'],
  ['中', '中国中的第一个字。', '中间中的第一个字。'],
  ['们', '我们中的第二个字。', '他们中的第二个字。'],
  ['声', '歌声中的第二个字。', '声音中的第一个字。'],
  ['起', '升起中的第二个字。', '起来中的第一个字。'],
  ['多', '多么中的第一个字。', '多少中的第一个字。'],
  ['么', '多么中的第二个字。', '那么中的第二个字。'],
  ['向', '向着中的第一个字。', '方向中的第二个字。'],
  ['立', '立正中的第一个字。', '站立中的第二个字。'],
];
function choice(
  key: string,
  prompt: string,
  labels: string[],
  value: string,
  explanation: string,
  review: boolean,
  material?: string,
): Question {
  return {
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
    material,
    choices: labels.map((label) => ({ id: label, label })),
    rule: { kind: 'choice', value },
    hint: '先共读原书，再回看所问字词或动作，不用选择题代替真实活动。',
    explanation,
  };
}
function objective(review: boolean): Question[] {
  return [
    ...characters.map((row, n) =>
      choice(
        `char-${n}`,
        required(row[review ? 2 : 1]),
        characters.map((r) => required(r[0])),
        required(row[0]),
        `本课认${row[0]}；写中五风立正另看会写清单，不把全部会认字加入会写。`,
        review,
      ),
    ),
    choice(
      'flag-name',
      review
        ? '按第78页词语，这里讲哪个国家的国旗？'
        : '按第78页词语，中国国旗叫什么？',
      ['五星红旗', '中国', '普通彩旗'],
      review ? '中国' : '五星红旗',
      '原书词语把中国国旗与五星红旗对应；本课按教材查信息，不把普通彩旗混为国旗。',
      review,
      reading,
    ),
    choice(
      'scene',
      review
        ? '按课文，飘扬的景象联系什么？'
        : '按课文，徐徐升起中的徐徐最接近什么？',
      ['慢慢', '迎风', '立正'],
      review ? '迎风' : '慢慢',
      '徐徐描述缓慢升起，迎风飘扬是本课写的景象；不能据一张静态图推算真实速度或风力。',
      review,
      reading,
    ),
    choice(
      'pose',
      review
        ? '按课文，望着国旗时我们做什么？'
        : '按课文，向着国旗时我们怎样站？',
      ['立正', '敬礼', '四处跑'],
      review ? '敬礼' : '立正',
      '回看课文不同语句，立正与敬礼的描写分别找。网络信息题不自动算已做动作，也不替代现场教师指导。',
      review,
      reading,
    ),
    choice(
      'sound-light',
      review
        ? '对照本课注音，多么中的么是哪项？'
        : '对照本课注音，我们中的们是哪项？',
      ['men', 'me', 'mén'],
      review ? 'me' : 'men',
      '们在我们中读轻声men，么在多么中读轻声me；轻声不当第一声，字形选择不能自动评实际声音。',
      review,
    ),
    choice(
      'writing-scope',
      review
        ? '只比较正与旗，哪项在本课会写清单？'
        : '只比较中与国，哪项在本课会写清单？',
      ['中', '国', '正', '旗'],
      review ? '正' : '中',
      '本课写中五风立正，国旗两字本课仅会认。只比较指定一对，不扩大写字范围。',
      review,
    ),
    choice(
      'homophone',
      review
        ? '只比较升与声，歌声中用哪一个字？'
        : '只比较升与声，向上升起中用哪一个字？',
      ['升', '声', '生'],
      review ? '声' : '升',
      '升与声在这里都读shēng，字形和意思不同；看语境，不用同音字随意替换。',
      review,
    ),
  ];
}
function manual(key: string, prompt: string, material?: string): Question {
  return {
    id: `${id}-manual-${key}`,
    knowledge: `${id}-manual-${key}`,
    prompt,
    material,
    rule: { kind: 'manual' },
    hint: '实际尝试后由家长确认；缺原书、纸笔或规范示范可跳过。',
    explanation: '只记录真实尝试，不自动评声音、笔顺或表达，不把计划当完成。',
  };
}
export const flagLesson: Lesson = {
  id,
  title: '升国旗',
  textbookTitle: '升国旗',
  page: 78,
  version: 1,
  status: 'available',
  goal: '认十一字写中五风立正；联系国旗词语、升声同音字与景象动作，分别朗读和背诵。',
  prerequisite: '准备第78—79页原书与田字格纸，可请家长陪读。',
  parentTip:
    '实读第三方公开原书78—79两页，来源脚注旧试用课本改选、无个人署名，未知ISBN版印次不补造。朗读背诵分别确认，动作按课文找信息，不自动认定参加现场仪式。实际交流允许不同表达和适合自身的姿势，不根据答案推定个人态度或能力。教师最终审校待完成。',
  steps: [
    {
      title: '共读并认十一字',
      text: `${reading}本课认升、国、旗、中、们、声、起、多、么、向、立。先听规范示范再放回词语，们在我们、么在多么中读轻声，不当第一声。`,
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: characters.map((r) => required(r[0])),
      },
      activity: '实际打乱十一字顺序指读，听原书注音示范尝试读两个轻声词。',
    },
    {
      title: '联系中国与国旗词语',
      text: '第78页先列中国国旗、五星红旗两组词，借助原图认名称，再回到第79页课文。普通彩旗与国旗分别看，原图只作外部教材观察，网站不打包原画。',
      activity: '实际在原书指读两组词，向家长说它们的联系；缺原书可跳过。',
    },
    {
      title: '升与声同音，意思不同',
      text: '本课升起用升，国歌声中用声，两字这里都读shēng。把字放回各自语境，分别看向上变化与声音，不因读音相同就互换，也不把生当作本课新增认写字。',
      visual: { kind: 'characters', grid: 'tian', characters: ['升', '声'] },
      activity: '实际读两个词，再指字说明哪一个联系向上、哪一个联系声音。',
    },
    {
      title: '看升起与飘扬的描写',
      text: '回看第79页徐徐升起、迎风飘扬的描写。徐徐指慢慢，迎风联系风中的景象；教材插图是静态图，不能用它推算真实速度、风力或一次实际过程。',
      activity:
        '与家长实际交流一种课文景象，说清词语依据；表达不要求唯一句子。',
    },
    {
      title: '分别找立正与敬礼',
      text: '按原书分别找向着国旗与立正、望着国旗与敬礼的联系。字词理解和真实动作是两件事，不因答对自动认定做过动作或参加过仪式。可向家长描述图中动作，不要求重复图中姿势或长时间站立，现场活动按教师指导和自身情况进行。',
      activity:
        '实际向家长描述一处动作及对应词语；只记录交流，不推定个人态度或能力。',
    },
    {
      title: '按规范示范写五字',
      text: '本课会写中、五、风、立、正。对照第79页逐笔和田字格示范，观察笔画与位置；普通网页字体只供认字，不能代替规范笔顺或描红，不把国旗等会认字加入会写。',
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: [...'中五风立正'],
      },
      activity: '用田字格纸实际尝试五字，请家长看字形、笔顺和位置。',
    },
    {
      title: '实际朗读',
      text: '按第79页课后要求朗读课文，先听家长借助拼音规范示范，再尝试按词语和语句停顿读。读音、节奏由家长观察，不从选择题自动评声音，不把朗读确认当背诵完成。',
      activity: '实际朗读后请家长给一条回应，再尝试调整。',
    },
    {
      title: '另做背诵并记录发现',
      text: '第79页另要求背诵课文，可以先借助词卡回想，再合上原书尝试。背诵独立确认，还没尝试或资料不足可跳过后再练；反思保留原话，未来计划不当完成，不需姓名学校照片等身份信息。',
      activity: '实际尝试背诵后确认；还想练哪个字或句子可以请家长代写。',
    },
  ],
  questions: [
    ...objective(false),
    manual(
      'recognize',
      '实际打乱顺序指读升国旗中们声起多么向立十一字，再尝试读我们和多么。',
    ),
    manual(
      'read',
      '与家长实际朗读原书第78—79页升国旗，观察字词及停顿；不自动评声音。',
      reading,
    ),
    manual(
      'recite',
      '按第79页另行实际尝试背诵；不把朗读确认当背诵完成。',
      reading,
    ),
    manual(
      'words',
      '实际指读第78页中国国旗、五星红旗，并说一个词语联系；不要求下载原画。',
    ),
    manual(
      'talk',
      '实际向家长说一处课文景象或动作及词语依据；只确认交流，不把题目当现场仪式或身体动作完成。',
      reading,
    ),
    manual(
      'write',
      '按第79页规范示范，用田字格纸实际尝试写中五风立正；家长看字形笔顺位置。',
    ),
    {
      id: `${id}-reflect-discovery`,
      knowledge: `${id}-reflect-discovery`,
      prompt: '记录一个字词或朗读发现，也可明确写下一次想练的计划。',
      rule: { kind: 'reflection' },
      hint: '用自己的话，家长可以代写。',
      explanation: '保留原话，正确性为null，不把未来计划当完成或推定个人态度。',
    },
  ],
  reviewQuestions: objective(true),
  review: {
    date: '2026-10-01',
    reviewer: '原书两页与原创教学范围校验',
    notes:
      '实读78—79两页，十一会认五会写、两组词、升声同音、景象动作及朗读背诵分别核对。旧试用课本来源与有改动脚注保留，未知个人作者ISBN版印次不补造，全文原画录音外部共读。静态图不推算物理速度，课文字词不自动记实际动作或仪式参与；实际活动人工确认、反思null，教师最终审校和全年仍待逐项验收。',
  },
};
