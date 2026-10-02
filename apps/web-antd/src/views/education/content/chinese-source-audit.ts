import type { Volume } from '../learning/types';

export interface ChinesePageAudit {
  volume: Volume;
  itemId: string;
  page: number;
  /** These observations do not certify the remaining pages of each garden. */
  coverage: 'partial';
  topics: string[];
  writing: string;
  readings?: { context: string; pinyin: string }[];
  verifiedAt: string;
}

/** Facts observed directly on the normal official reader's previously saved
 * public pages. Original lesson activities will be authored separately.
 * No textbook scans, page layouts, prose or audio are bundled in this project.
 */
const inspectedPages: Omit<ChinesePageAudit, 'verifiedAt'>[] = [
  {
    volume: 'upper',
    itemId: 'u1-5',
    page: 15,
    coverage: 'partial',
    topics: ['数字汉字六至十', '形近字比较：人/天、口/田、日/目'],
    writing: '六七八十',
  },
  {
    volume: 'upper',
    itemId: 'u2-5',
    page: 28,
    coverage: 'partial',
    topics: ['学习用品上的学校、班级与姓名词语', '声调辨形与亲子朗读'],
    writing: '九王',
  },
  {
    volume: 'upper',
    itemId: 'u3-6',
    page: 42,
    coverage: 'partial',
    topics: ['课程表信息与课程名称', '用不同材料摆字母'],
    writing: '午下',
  },
  {
    volume: 'upper',
    itemId: 'u4-6',
    page: 56,
    coverage: 'partial',
    topics: ['时间词：日、月、年', '音节中韵母与介音的差别'],
    writing: '个去',
  },
  {
    volume: 'upper',
    itemId: 'u5-5',
    page: 68,
    coverage: 'partial',
    topics: ['对应与相反意思的词', '联系季节词语表达喜欢的季节'],
    writing: '女开关先',
  },
  {
    volume: 'upper',
    itemId: 'u6-5',
    page: 80,
    coverage: 'partial',
    topics: ['职业与场所', 'n/l、前后鼻音和平翘舌的字音比较'],
    writing: '工厂门卫',
  },
  {
    volume: 'upper',
    itemId: 'u7-4',
    page: 90,
    coverage: 'partial',
    topics: ['家庭称呼与口头介绍', '形近字和易写错笔画比较'],
    writing: '爸妈',
  },
  {
    volume: 'upper',
    itemId: 'u8-4',
    page: 101,
    coverage: 'partial',
    topics: ['按上下、左右、独体结构观察字形', '同一个字在不同词语中的运用'],
    writing: '牛羊爪白',
  },
  {
    volume: 'lower',
    itemId: 'u1-5',
    page: 10,
    coverage: 'partial',
    topics: ['学习词语与动作', '前后鼻韵母an/ang分类'],
    writing: '文卡片合',
    readings: [
      { context: '看见', pinyin: 'jiàn' },
      { context: '长短', pinyin: 'cháng' },
    ],
  },
  {
    volume: 'lower',
    itemId: 'u2-4',
    page: 22,
    coverage: 'partial',
    topics: ['理解学习要求中的动作', '字母大小写配对'],
    writing: '写认',
  },
];
export const chinesePageAudits: ChinesePageAudit[] = inspectedPages.map(
  (item) => ({ ...item, verifiedAt: '2026-09-30' }),
);

export function chineseAuditSource(volume: Volume) {
  return `https://book.pep.com.cn/${volume === 'upper' ? '1211001101241' : '1211001102241'}/mobile/index.html`;
}

/** Supporting research hosted by PEP, not a substitute for unseen textbook pages. */
export const pinyinRevisionResearch = {
  title: '统编小学语文教科书一年级上册拼音单元修订研究',
  url: 'https://www.pep.com.cn/bks/xxyw/jzjd/202512/W020251202580887481487.pdf',
  checkedAt: '2026-09-30',
  textbookRevisionYear: 2024,
  articlePrintedPages: [25, 26, 27, 28, 29, 30],
  scope: '修订版拼音单元与分类的补充资料；教材正文仍需逐页核验。',
  facts: { pinyinUnits: 3, consonants: 21, ywTaughtSeparately: true },
};

/** Orthographic evidence, not a claim that the whole textbook page was inspected. */
export const pinyinToneStandard = {
  title: '汉语拼音正词法基本规则 GB/T 16159—2012',
  url: 'https://www.moe.gov.cn/ewebeditor/uploadfile/2015/01/13/20150113091717604.pdf',
  checkedAt: '2026-09-30',
  section: '6.5.1',
  facts: ['i标调时省去原小点', '带调ü的两点与调号可同时存在'],
  scope: '支撑原创标调活动，不替代2024教材正文逐页核验。',
};

export const twoPartPinyinTeaching = {
  title: '汉语拼音的教学特色',
  url: 'https://www.moe.gov.cn/s78/A18/A18_ztzl/jnhypyfa/201805/t20180517_336341.html',
  checkedAt: '2026-09-30',
  scope: '两拼教学方式的补充资料，不作为2024教材正文页核验。',
  facts: ['声母轻短、韵母较重并相连', '辨形、实际拼读与规范书写分别练习'],
};

export const zeroInitialSpelling = {
  title: '怎么使用《汉语拼音方案》？',
  url: 'https://jwc.hnfnu.edu.cn/info/1055/3129.htm',
  checkedAt: '2026-09-30',
  facts: ['i/u/ü自成音节换写yi/wu/yu', 'y/w帮助区分音节边界'],
  scope: '原创拼写活动的规则依据，不代替2024教材正文核验。',
};

/** Official public lesson design specifies its PEP August 2024 edition and p8.
 * This verifies the stated teaching scope, not inspection of the original art.
 */
export const firstLessonTeachingSource = {
  title: '吉林智慧教育平台：一年级上册《天地人》教学设计',
  url: 'https://basic.jl.smartedu.cn/swkc/ke/home/new-course/downloadres?course_id=686&fid=1705754045421977600&res_id=2636',
  checkedAt: '2026-09-30',
  publisher: '人民教育出版社',
  textbookPublication: '2024年8月',
  printedPage: 8,
  teacher: '国歌',
  school: '长春市第一〇八学校',
  coverage: [
    '六字分两组认读与朗读',
    '看图联系天、地、人及生活词语',
    '在问答交流中区分你、我、他',
  ],
  limitation:
    '官方课时教学设计的范围证据；不代替原教材国画、标准朗读资源或教师对本站原创内容的最终审校。',
};

/** Negative access observations are not teaching-scope evidence.
 * Keep these separate from inspected pages to avoid claiming unseen content.
 */
export const chineseSourceAccessObservations = [
  {
    itemId: 'u1-2',
    volume: 'upper',
    checkedAt: '2026-10-01',
    url: 'https://basic.jl.smartedu.cn/swkc/ke/home/new-course/info?id=4181',
    outcome: 'login-required',
    observed:
      '正常隔离Chrome显示请登录后查看；未读取课件、教学设计或原教材正文。',
    teachingScopeVerified: false,
  },
  {
    itemId: 'u1-2',
    volume: 'upper',
    checkedAt: '2026-10-01',
    url: 'https://basic.jl.smartedu.cn/swkc/ke/home/new-course/info?id=3779',
    outcome: 'login-required',
    observed:
      '正常隔离Chrome显示请登录后查看；未读取课件、教学设计或原教材正文。',
    teachingScopeVerified: false,
  },
  {
    itemId: 'u1-2',
    volume: 'upper',
    checkedAt: '2026-10-01',
    url: 'https://www.pep.com.cn/products/zhytu/gjshnj/csxp/tbzc/201904/t20190408_1937127.shtml',
    outcome: 'wrong-edition',
    observed:
      '实际读取出版说明为2018年8月1日的同步字词学习手册；目录中的同名课不能核验2024教材正文、写字或朗读要求。',
    teachingScopeVerified: false,
  },
  {
    itemId: 'u1-2',
    volume: 'upper',
    checkedAt: '2026-10-01',
    url: 'https://www.pep.com.cn/bks/xxyw/jzjd/202505/W020250531415592673618.pdf',
    outcome: 'fetch-denied',
    observed:
      '网页工具原PDF读取403；检索摘要关于普通话朗读的修订线索不作为原书页或全课核验。',
    teachingScopeVerified: false,
  },
] as const;
