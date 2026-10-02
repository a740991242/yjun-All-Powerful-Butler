import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';

export const schoolEntrySource = {
  sourceUrl: 'https://keben.app/book/0025',
  provider: '第三方原书公开预览',
  checkedAt: '2026-10-01',
  isbn: null,
  editionDate: null,
  printingDate: null,
};
export const schoolEntryPageAudits = {
  'school-1': {
    pages: [2, 3],
    recognize: '',
    write: '',
    activities: ['读图', '跟读三句', '团结友爱交流'],
  },
  'school-2': {
    pages: [4, 5],
    recognize: '',
    write: '',
    activities: ['四景物名称', '跟读表达', '开放交流'],
  },
  'school-3': {
    pages: [6],
    recognize: '',
    write: '',
    song: '上学歌',
    creator: '北京市小学唱歌教研组',
    creationKind: '集体创作',
    adapted: true,
    activities: ['共读歌曲', '说上学期待', '原创准备活动'],
  },
  'school-4': {
    pages: [7],
    recognize: '',
    write: '',
    activities: ['读书', '写字', '讲故事', '听故事'],
  },
};
type Pair = {
  key: string;
  prompts: [string, string];
  values: [string, string];
  labels: string[];
  material: string;
  explanation: string;
};
type Actual = { key: string; prompt: string; material?: string };
type Entry = {
  itemId: keyof typeof schoolEntryPageAudits;
  title: string;
  goal: string;
  steps: Lesson['steps'];
  pairs: Pair[];
  actual: Actual[];
  reflections: string[];
};
const originalPeople =
  '本站原创虚构对话卡：小禾对小安说，我们一起看图；随后小安说，我想再看一次。这里只比较说话者与词语指代，不采集学习者国籍、民族或真实姓名。';
export const schoolEntryOriginalStory =
  '本站原创小故事：小禾先借来一本图画书，再和小安一起看；两人轮流说自己发现的细节，最后归还图画书。小禾先讲自己的发现，小安先听，然后交换角色。';
const entries: Entry[] = [
  {
    itemId: 'school-1',
    title: '我是中国人',
    goal: '看第2—3页的场景与人物，跟读引导语，用自己的话交流团结友爱。',
    steps: [
      {
        title: '看看教材中的中国',
        text: '与家长看第2页原图，背景有天安门和国旗，前景有穿着不同服饰的儿童。先指自己看到的事物，再听家长读名称。原画在原书查看；这里不要求到现场，也不按服饰猜个人民族、国籍或能力。',
        activity: '实际指原图中的建筑、旗帜或人物，说一个观察。',
      },
      {
        title: '我与我们，谁在说',
        text: '第3页用个人和大家的表达引导认识中国。跟读时可以作为教材中的人物说话；本站原创小禾、小安对话只练习我与我们的指代，换说话者时我所指的人会变。不要求填真实身份，教材角色不是系统对学习者身份的判断。',
        activity: '与家长按虚构对话交换说话者，各指出我或我们指谁。',
      },
      {
        title: '不同服饰，一起相处',
        text: '第2—3页人物服饰多样，最后的引导表达中华民族团结如一家。这里一家是团结友爱的表达，不是所有人住在同一所房子。可以说互相倾听、互相帮助的例子，不按衣着判喜好、能力或高低。',
        activity: '实际说一个尊重、帮助或倾听的例子，合理说法可不同。',
      },
      {
        title: '听示范，再试着读',
        text: '请家长读第3页三句引导语，孩子按自己的节奏跟读；暂时不认识的字可由家长帮读。这六页没有新增会认会写清单，跟读标题不把所有字新增为必认必写；网页选项不自动评发音或个人态度。',
        activity:
          '实际尝试跟读三句，家长根据实际尝试记录，不强迫公开身份表达。',
      },
      {
        title: '说发现，留一个计划',
        text: '说一个图中发现，再说下一次想练的表达。自己的理解开放，家长可以代写；下一次想帮助或倾听别人是计划，不是已经完成的行动。',
        activity: '记录发现与下一步时分清已尝试和打算做。',
      },
    ],
    pairs: [
      {
        key: 'scene',
        prompts: ['第2页背景中的建筑是哪项？', '第2页建筑前的国旗是哪项？'],
        values: ['天安门', '五星红旗'],
        labels: ['天安门', '五星红旗', '长江'],
        material: '与家长回看第2页原图，分别找建筑和旗帜。',
        explanation: '建筑与国旗是两个观察对象，指图不等于已经到现场。',
      },
      {
        key: 'pronoun',
        prompts: [
          '按原创对话卡，第一句我们包括谁？',
          '按原创对话卡，第二句我指谁？',
        ],
        values: ['小禾和小安', '小安'],
        labels: ['小禾和小安', '小安', '只有小禾'],
        material: originalPeople,
        explanation: '第一句包括说话者小禾及对话者小安，第二句说话者换为小安。',
      },
      {
        key: 'together',
        prompts: [
          '第3页中华民族如一家主要表达哪项？',
          '按原创相处卡，哪项是不同服饰的朋友交流时实际做的事？',
        ],
        values: ['团结友爱', '互相倾听'],
        labels: ['团结友爱', '互相倾听', '必须住同一房子'],
        material:
          '回看第3页引导语；本站原创相处卡：两位穿着不同服饰的虚构朋友，轮流说自己的发现，也互相倾听。',
        explanation:
          '教材的一家表达团结友爱，原创卡的交流行为另按实际文字判断，不推定个人身份。',
      },
      {
        key: 'clothing',
        prompts: [
          '第2—3页人物衣着的直接观察是哪项？',
          '只凭第2—3页衣着，能否确认每个人的能力？',
        ],
        values: ['服饰多样', '不能据衣着确定能力'],
        labels: ['服饰多样', '不能据衣着确定能力', '所有人能力相同'],
        material:
          '先看原书中的人物服饰，再区分看得见的外观与无法由图确定的个人信息。',
        explanation:
          '看得见的服饰与个人能力不是同一信息；不从外表猜实际民族或身份。',
      },
    ],
    actual: [
      {
        key: 'look',
        prompt: '实际回看第2—3页，指一个人物或场景并说观察，不按服饰猜身份。',
      },
      {
        key: 'roles',
        prompt: '实际与家长按虚构对话交换说话者，指出每次我或我们指谁。',
        material: originalPeople,
      },
      {
        key: 'read',
        prompt: '实际听家长示范后尝试跟读第3页三句，不自动评发音或个人态度。',
      },
      {
        key: 'say',
        prompt: '实际交流一个团结、帮助或倾听的例子，允许不同合理表达。',
      },
    ],
    reflections: [
      '记录一个图中发现或表达。',
      '明确写下一次想练的表达或相处计划。',
    ],
  },
  {
    itemId: 'school-2',
    title: '我爱我们的祖国',
    goal: '认识原书四个景物名称，听读表达，开放交流自己的发现。',
    steps: [
      {
        title: '先看第4—5页',
        text: '第4页展示五星红旗和北京天安门，第5页展示长江、黄河。先逐项看原书图片和名称，不能仅凭图片推断拍摄日期或自己的出行经历。这里不提供原画副本。',
        activity: '实际在两页中分别指四项景物名称。',
      },
      {
        title: '旗帜与建筑分开找',
        text: '五星红旗是国旗名称，北京天安门是建筑景物名称；两种对象分开认识，读到一个名称可以指对应原图。选择题查阅读信息，不代替实际指图或参加仪式。',
        activity: '听家长读两项名称，实际指第4页对应图。',
      },
      {
        title: '看看长江和黄河',
        text: '第5页上图标长江，下图标黄河，两者都是河流。按原页名称找对应，不凭水色判所有地方的河流，也不要求到河岸观察或用照片推算长度。',
        activity: '实际指两幅图名称，说出自己观察到的一处细节。',
      },
      {
        title: '听读教材里的表达',
        text: '与家长共读两页引导句，最后的国家名称是中华人民共和国。可以按教材语境跟读，发音由陪读者根据实际尝试查看；不将跟读或单选答案当学习者个人态度的自动评价。',
        activity: '实际听家长示范，再按自己节奏尝试跟读。',
      },
      {
        title: '说自己的发现',
        text: '可以介绍一个景物名称、分享一个愿意说的发现或提出疑问。这里的表达开放，不要求统一喜好、到过景点或上传家庭旅行经历；不熟悉时也可以提出问题。',
        activity: '实际与家长交流一个发现或疑问，允许不同回答。',
      },
      {
        title: '记录下一步',
        text: '记录下一次还想了解哪个名称或图中细节。家长可代写，计划与已读、已说的活动分别记录，反思不唯一判分。',
        activity: '保留自己的话。',
      },
    ],
    pairs: [
      {
        key: 'objects',
        prompts: ['第4页国旗名称是哪项？', '第4页建筑景物名称是哪项？'],
        values: ['五星红旗', '北京天安门'],
        labels: ['五星红旗', '北京天安门', '黄河'],
        material: '回看第4页原图与名称，问题分别指向旗帜和建筑。',
        explanation: '同页两个对象分开看，不用建筑名称回答国旗问题。',
      },
      {
        key: 'place',
        prompts: [
          '第4页天安门名称前是哪座城市？',
          '第5页最后的引导句使用哪个国家名称？',
        ],
        values: ['北京', '中华人民共和国'],
        labels: ['北京', '中华人民共和国', '长江'],
        material: '与家长回看第4—5页名称与引导句。',
        explanation: '城市与国家名称按原页文字找，不推定个人身份或经历。',
      },
      {
        key: 'rivers',
        prompts: ['第5页上方河流图标哪个名称？', '第5页下方河流图标哪个名称？'],
        values: ['长江', '黄河'],
        labels: ['长江', '黄河', '北京天安门'],
        material: '先共读第5页，再按上方与下方位置查名称。',
        explanation: '位置按这一页的排列，不用照片水色推广所有河段。',
      },
    ],
    actual: [
      {
        key: 'look',
        prompt: '实际回看第4—5页，逐项指五星红旗、北京天安门、长江和黄河。',
      },
      {
        key: 'read',
        prompt: '实际听示范后尝试跟读两页表达，不自动评价发音或态度。',
      },
      {
        key: 'say',
        prompt:
          '实际交流一个景物发现、介绍或疑问，表达开放，不要求真实旅行资料。',
      },
    ],
    reflections: ['明确写下一次还想了解的名称或细节。'],
  },
  {
    itemId: 'school-3',
    title: '我是小学生',
    goal: '与家长共读上学歌，理解人物问答，交流上学期待并试做准备。',
    steps: [
      {
        title: '一起打开上学歌',
        text: '第6页是上学歌，脚注为北京市小学唱歌教研组集体创作、选作课文有改动。先看原书、听家长示范，再尝试读；也可在有合适示范时唱，不要求必唱或背诵。本站不提供歌曲全文、原画或录音，不能补造个人作者。',
        activity: '实际与家长共读第6页，选择适合自己的读或唱方式。',
      },
      {
        title: '问的人与回答的人',
        text: '歌里小鸟问孩子为什么背小书包，孩子回答要去学校。先分别找提问者与回答者；小鸟说话是歌曲表现，不是要求实际听见鸟说人话，也不把教材角色当真实学习者经历。',
        activity: '实际与家长说说谁问、谁回答，再解释书包与上学的联系。',
      },
      {
        title: '学习与劳动的表达',
        text: '歌中表达爱学习、爱劳动，孩子可以说自己期待的一件学习活动或愿意尝试的帮助。歌里的不迟到是表达内容，不是系统对实际出勤的确认；期待、计划和实际已做分别记录。',
        activity: '实际说一件期待的学习或帮助活动，合理回答可不同。',
      },
      {
        title: '试做一项准备',
        text: '本站原创准备活动：与家长按老师实际安排看一看书包里的用品，可整理一件文具或一本书。原创活动不是原书已印课后题，不要求购买用品或上传学校、姓名和时间表；先想做不等于已经整理。',
        activity: '在家长帮助下实际尝试整理一件用品，按实际完成确认。',
      },
      {
        title: '留下自己的下一步',
        text: '写或请家长代写下一次想尝试的学习或准备。反思不评唯一好答案，未来计划不作为已完成；实际跟读、表达和整理分别确认。',
        activity: '明确标注下一次想做。',
      },
    ],
    pairs: [
      {
        key: 'speaker',
        prompts: ['歌里是谁提出书包的问题？', '歌里是谁回答要去学校？'],
        values: ['小鸟', '孩子'],
        labels: ['小鸟', '孩子', '图画书'],
        material: '先与家长共读第6页原书，再按歌曲问答找信息。',
        explanation: '歌曲拟人问答与实际鸟类行为分开，回答者是歌曲中的孩子。',
      },
      {
        key: 'destination',
        prompts: ['歌里孩子回答要去哪里？', '歌里小鸟的问题提到孩子背着什么？'],
        values: ['学校', '小书包'],
        labels: ['学校', '小书包', '黄河'],
        material: '回看第6页问答，分别找目的地与用品。',
        explanation: '目的地和背着的用品是不同信息，不据选择确认实际上学。',
      },
      {
        key: 'values',
        prompts: [
          '歌中爱字联系的学习活动是哪项？',
          '歌中与爱学习相连的另一项是哪项？',
        ],
        values: ['爱学习', '爱劳动'],
        labels: ['爱学习', '爱劳动', '不需要学习'],
        material: '与家长共读第6页后半部分，按原书词语对应。',
        explanation: '查歌曲表达，不把选择题当实际行动或态度自动评价。',
      },
    ],
    actual: [
      {
        key: 'read',
        prompt: '实际听示范后尝试读第6页，也可选择唱，不设必唱或背诵要求。',
      },
      {
        key: 'explain',
        prompt: '实际与家长解释第6页歌曲中谁问、谁回答，以及书包和上学的联系。',
      },
      {
        key: 'say',
        prompt: '实际交流一件期待的学习或帮助活动，打算做不当已经完成。',
      },
      {
        key: 'prepare',
        prompt:
          '按老师实际安排，在家长帮助下实际试整理一件用品；想做不等于已经整理。',
      },
    ],
    reflections: ['明确写下一次想尝试的学习或准备计划。'],
  },
  {
    itemId: 'school-4',
    title: '我爱学语文',
    goal: '认识读书写字讲故事听故事四种活动，分别实际尝试并交流发现。',
    steps: [
      {
        title: '四种语文活动',
        text: '第7页有读书、写字、讲故事、听故事的图示与名称。与家长看原图，说说各自在做什么；四活动都可尝试，不按图中人物外表规定谁只能读或写，网站界面看完不当实际完成四活动。',
        activity: '实际在原页指出四种活动并交流名称。',
      },
      {
        title: '试读自己熟悉的一页',
        text: '本站原创读书活动：选一本现有的合适图画书或已熟悉文字，和家长看一页、指一处图或词。不会的字可以请家长帮读，不要求在入学活动里新增整页会认字。坐稳、书本放在方便观看的位置即可，具体方法可依需要调整。',
        activity: '实际与家长看读一页，指出一个发现。',
      },
      {
        title: '看看示范，再试着写',
        text: '第7页展示写字活动，但没有本项新增会写字清单。可请家长在纸面示范已学字或简单线条，再实际尝试；不把标题所有字列为必须会写，网页字体不能替代逐笔示范，也不自动判握笔或字迹。',
        activity: '实际纸面尝试一项示范，家长按真实尝试记录。',
      },
      {
        title: '轮流讲一个小故事',
        text: `${schoolEntryOriginalStory}这段是本站原创，不是教材配图的完整故事。先讲一段自己熟悉的故事或这一卡的经过，可以用自己的话和顺序说明。`,
        activity: '实际向家长讲一个简短经过，不唯一判表达方式。',
      },
      {
        title: '听，再回应',
        text: '听家长或同伴讲一段，等对方说完再说听到的发现或提一个问题，也可交换角色。原图只是活动示意，本站原创小禾小安卡用于比较说听角色，不规定必须照图表演，也不强迫持续对视或录音。',
        activity: '实际听一段并回应，讲与听分别确认。',
      },
      {
        title: '说发现与下一次计划',
        text: '记录一个读书、写字、讲或听的发现，再写下一次还想试哪一种。个人喜好开放，实际做过与未来计划分开，家长可代写，反思不判对错。',
        activity: '保留自己的发现和计划。',
      },
    ],
    pairs: [
      {
        key: 'activity',
        prompts: [
          '按原创活动卡，观察图画书文字和图片属于哪项？',
          '按原创活动卡，用纸笔尝试记录已学字属于哪项？',
        ],
        values: ['读书', '写字'],
        labels: ['读书', '写字', '只有听故事'],
        material:
          '本站原创活动卡：一项是与家长看图画书的文字和图片；另一项是按示范用纸笔尝试已学字。',
        explanation: '读书与写字的对象和动作不同，选卡不当实际读写完成。',
      },
      {
        key: 'roles',
        prompts: [
          '按原创故事卡，谁先讲自己的发现？',
          '按原创故事卡，谁先听对方的发现？',
        ],
        values: ['小禾', '小安'],
        labels: ['小禾', '小安', '两人都没听'],
        material: schoolEntryOriginalStory,
        explanation:
          '小禾先讲、小安先听，然后交换；角色可变化，不按外表规定说听能力。',
      },
      {
        key: 'order',
        prompts: [
          '按原创故事卡，最先做的是哪项？',
          '按原创故事卡，最后做的是哪项？',
        ],
        values: ['借来图画书', '归还图画书'],
        labels: ['借来图画书', '归还图画书', '去河岸拍照'],
        material: schoolEntryOriginalStory,
        explanation:
          '先借、共看并交流、最后归还是这张原创卡的经过，不冒充原图已印故事。',
      },
    ],
    actual: [
      {
        key: 'look',
        prompt: '实际在第7页原图中指出读书、写字、讲故事、听故事四种活动。',
      },
      {
        key: 'read',
        prompt:
          '实际与家长看读一页现有图画书或熟悉文字，帮读允许，不扩大新增识字范围。',
      },
      {
        key: 'write',
        prompt:
          '实际在纸面按家长示范尝试已学字或线条，没有本项新增会写字要求。',
      },
      {
        key: 'tell',
        prompt: '实际讲一个简短故事或经过，允许自己的合理表达。',
        material: schoolEntryOriginalStory,
      },
      {
        key: 'listen',
        prompt: '实际听家长一段故事，等讲完回应或提问；实际讲与听分别记录。',
      },
    ],
    reflections: [
      '记录一个读写说听的实际发现。',
      '明确写下一次还想尝试哪种语文活动。',
    ],
  },
];
function makeLesson(entry: Entry): Lesson {
  const id = `cu-${entry.itemId}`;
  const objective = (review: boolean): Question[] =>
    entry.pairs.map((p) => ({
      id: `${id}-${review ? 'r' : 'q'}-${p.key}`,
      knowledge: `${id}-${p.key}`,
      prompt: p.prompts[review ? 1 : 0],
      material: p.material,
      choices: p.labels.map((label) => ({ id: label, label })),
      rule: { kind: 'choice', value: p.values[review ? 1 : 0] },
      hint: '请家长帮读，先按指定原页或原创卡找信息。',
      explanation: p.explanation,
    }));
  return {
    id,
    title: entry.title,
    textbookTitle: entry.title,
    page: required(schoolEntryPageAudits[entry.itemId].pages[0]),
    status: 'available',
    version: 1,
    goal: entry.goal,
    prerequisite: '准备第2—7页原书，可由家长陪读；各项按对应页尝试。',
    parentTip:
      '入学六页没有新增会认会写清单，活动本身与识字课分开。现代原图全文歌声在原书或合法示范中查看，不提供自动发音评价；开放表达与个人身份、态度不自动评分，未来计划不当实际完成。未知ISBN版印次不补造，教师最终审校仍待完成。',
    steps: entry.steps,
    questions: [
      ...objective(false),
      ...entry.actual.map((a): Question => ({
        id: `${id}-manual-${a.key}`,
        knowledge: `${id}-manual-${a.key}`,
        prompt: a.prompt,
        material: a.material,
        rule: { kind: 'manual' },
        hint: '实际尝试后确认，缺书、示范或材料可以暂时跳过。',
        explanation:
          '记录实际尝试，不以客观选择或打算做代替实际完成；正确性null。',
      })),
      ...entry.reflections.map((prompt, i): Question => ({
        id: `${id}-reflect-${i}`,
        knowledge: `${id}-reflect-${i}`,
        prompt,
        rule: { kind: 'reflection' },
        hint: '自己的话，家长可代写。',
        explanation: '原话保留、正确性null，未来计划不当完成。',
      })),
    ],
    reviewQuestions: objective(true),
    review: {
      date: '2026-10-01',
      reviewer: '原书入学六页与原创活动范围校验',
      notes:
        '按2—7六页分四项入学活动，无新增认写字清单；原书观察与原创虚构对话/故事/准备分开，实际活动人工确认、反思null、计划不当完成。现代原图歌曲全文录音外部共读，未知元数据不补造，不推断个人身份或自动评价态度；上册有课包不表示全年或教师最终审校完成。',
    },
  };
}
export const schoolEntryLessons: Record<string, Lesson> = Object.fromEntries(
  entries.map((entry) => [entry.itemId, makeLesson(entry)]),
);
