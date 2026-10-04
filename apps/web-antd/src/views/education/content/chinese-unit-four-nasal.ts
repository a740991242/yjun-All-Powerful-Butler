import type { Lesson } from '../learning/types';
import type { Body } from './chinese-unit-four-middle';

import { makeFormal } from './chinese-unit-four-middle';

const bodies: Body[] = [
  {
    itemId: 'u4-4',
    title: 'an en in un ün',
    pages: [51, 52, 53],
    writingPage: 52,
    wordPage: 52,
    scene:
      '与家长查看教材第51页看电视的情境，听标准示范认识an、en、in、un、ün。先看这组都以n结尾，再比较un与ün的两点；字形选择不能代替真实鼻音听辨，不要求上传家庭照片或电视内容。',
    characters: [
      ['蓝', '蓝天中的第一个字。', '蓝色中的第一个字。'],
      ['云', '白云中的第二个字。', '云朵中的第一个字。'],
      ['草', '草原中的第一个字。', '小草中的第二个字。'],
      ['原', '草原中的第二个字。', '原来中的第一个字。'],
    ],
    words: 'lán tiān蓝天、bái yún白云、cǎo yuán草原、sēn lín森林',
    syllables: ['lún', 'chuán'],
    readingTitle: '家',
    readingActivity:
      '共读后在原书中分别指白云、小鸟、鱼儿、种子与它们的家；可以说一个自己的发现或疑问，不要求填写真实家庭住址。',
    sourceNote:
      '原书注明选自北京师范大学出版社《义务教育课程标准实验教科书语文一年级上册》。诗中的家有适合生活或生长的地方的意思，不都指人的房屋；儿童与花朵是比喻，不说孩子实际变成植物。',
    focusSteps: [
      {
        title: '三项整体认读分别记',
        text: 'yuan、yin、yun是本课列出的整体认读音节，听规范示范整体读，不机械拆成声母y加本组某个普通韵母。yin对应in，yun对应ün；yuan对应üan，不把yuan看成yun或ün。y后相应的ü省去两点，仍要分清完整写法。',
        visual: {
          kind: 'characters',
          grid: 'pinyin',
          characters: ['yuan', 'yin', 'yun', 'yuán', 'yīn', 'yún'],
        },
        activity:
          '分别指出三个整体认读写法，参考规范示范尝试读，比较yuan与yun中间是否有a。',
      },
      {
        title: '三拼与音节组重新比较',
        text: 'g/k/h + u + ān → guān/kuān/huān；j/q/x + ü + ān → juān/quān/xuān。后者书写省去ü两点，中间仍对应ü，不能当普通u。第52页音节组还可选读wān、yàn、nán、zhàn、duǎn、rǎn、jiǎn、quán；chén、kěn、zhēn、rén、wèn、nèn；pīn、nín、jìn、xīn、qīn、mín；rùn、tūn、hūn、zhǔn、lún、chūn；jūn、qún、xún。实际发音请跟规范示范，不用字母结尾自动给声音打分。',
        visual: {
          kind: 'characters',
          grid: 'pinyin',
          characters: ['guān', 'kuān', 'juān', 'quān', 'jūn', 'qún'],
        },
        activity:
          '用纸卡摆出一组u三拼和一组ü三拼，换一个声母再读；从音节组中任选一组逐个尝试。',
      },
    ],
    focusQuestions: [
      {
        key: 'whole-select',
        prompt: [
          '比较材料指定的yuan与guān，这一对哪个属于本课整体认读？',
          '比较新材料指定的yin与jìn，这一对哪个属于本课整体认读？',
        ],
        labels: ['yuan', 'yin', 'guān', 'jìn'],
        value: ['yuan', 'yin'],
        material: ['yuan / guān', 'yin / jìn'],
        explanation:
          'yuan、yin、yun整体认读；guān和jìn是普通拼读。只在本题指定的一对中选择，不泛问整个列表。',
      },
      {
        key: 'whole-final',
        prompt: ['yun省去两点前对应哪一种韵母？', '换成yin，对应哪一种韵母？'],
        labels: ['ün', 'in', 'un', 'an'],
        value: ['ün', 'in'],
        material: ['yun', 'yin'],
        explanation: 'yun对应ün，yin对应in。省点的表面写法不把ün改变成un。',
      },
      {
        key: 'whole-yuan',
        prompt: [
          '看完整整体认读yuan，省点前对应哪一写法？',
          '看新材料yun，省点前对应哪一写法？',
        ],
        labels: ['üan', 'ün', 'uan', 'un'],
        value: ['üan', 'ün'],
        material: ['yuan', 'yun'],
        explanation:
          'yuan对应üan，yun对应ün；看清中间a，不把两个整体认读混同。',
      },
      {
        key: 'triple-u',
        prompt: [
          '根据三部分选择完整音节。',
          '换一个声母，三拼中间缺少哪一部分？',
        ],
        labels: ['guān', 'gān', 'u', 'ü'],
        value: ['guān', 'u'],
        material: ['g + u + ān', 'k + □ + ān → kuān'],
        explanation: 'g/u/ān组成guān，k/u/ān组成kuān；中间u不能漏掉。',
      },
      {
        key: 'triple-ue',
        prompt: [
          '根据三部分，选择省去两点后的完整音节。',
          '换成q，中间省去两点前是哪一部分？',
        ],
        labels: ['juān', 'jüān', 'u', 'ü'],
        value: ['juān', 'ü'],
        material: ['j + ü + ān', 'q + □ + ān → quān'],
        explanation: 'j/ü/ān写juān，q/ü/ān写quān；书写省点，中间仍对应ü。',
      },
    ],
    readingQuestions: [
      {
        key: 'reading-home',
        prompt: ['《家》中，蓝天是谁的家？', '《家》中，树林是谁的家？'],
        labels: ['白云', '小鸟', '鱼儿', '种子'],
        value: ['白云', '小鸟'],
        explanation:
          '回看本诗中蓝天与白云、树林与小鸟的对应；诗中的家不是只指人的房屋。',
      },
      {
        key: 'reading-life',
        prompt: ['《家》中，小河是谁的家？', '《家》中，泥土是谁的家？'],
        labels: ['鱼儿', '种子', '白云', '小鸟'],
        value: ['鱼儿', '种子'],
        explanation:
          '本诗中小河对应鱼儿，泥土对应种子；不泛化所有生命都只住在这一个地方。',
      },
      {
        key: 'reading-metaphor',
        prompt: [
          '《家》中，哪个地方被说成我们的家？',
          '《家》中，孩子们被比作什么？',
        ],
        labels: ['祖国', '花朵', '一间教室'],
        value: ['祖国', '花朵'],
        explanation:
          '祖国是我们的家、孩子像花朵属于诗的表达，不表示孩子实际成为植物，也不要求填住址。',
      },
    ],
    actualFocus:
      '参考规范示范实际尝试读yuan、yin、yun，再摆一组u三拼与一组ü三拼并尝试读；从第52页任选一个音节组跟读。家长确认尝试，没有示范可跳过。',
  },
  {
    itemId: 'u4-5',
    version: 2,
    title: 'ang eng ing ong',
    pages: [54, 55],
    scene:
      '与家长查看第54页灯光、钟表和抱婴儿的情境，听规范示范认识ang、eng、ing、ong，再看单独列出的ying。图中联想不代表声学曲线或声音评分，本站不采集家庭或孩子照片。',
    characters: [
      ['冰', '滑冰中的第二个字。', '冰块中的第一个字。'],
      ['自', '自行车中的第一个字。', '自己中的第一个字。'],
      ['行', '自行车中的第二个字。', '行走中的第一个字。'],
      ['车', '自行车中的最后一个字。', '车站中的第一个字。'],
    ],
    words:
      'yóu yǒng游泳、huá bīng滑冰、qí zì xíng chē骑自行车、dǎ pīng pāng qiú打乒乓球',
    syllables: ['míng', 'liàng'],
    readingTitle: '两只羊',
    readingActivity:
      '共读后说一说两只羊从哪边来、在哪里遇见、后来发生了什么；再用桌面纸卡讨论一种礼让办法，自己的办法不是原文情节。',
    sourceNote:
      '原书注明选自中华书局《新小学教科书国语读本初级第三册》，有改动。故事中的两只羊不肯让路是文学情境，不要求在真桥上模仿，更不进行落水实验；另谈礼让办法时允许多种合理表达。',
    focusSteps: [
      {
        title: 'ying整体认读，与ing分开看',
        text: 'ying是本课整体认读音节，参考规范示范整体读；ing是韵母，不把ying机械拆成声母y加普通ing。ying和yin字形末尾不同，不能漏看g。yīng、yíng、yǐng、yìng的调号都在i上，带调i不保留原来的点。',
        visual: {
          kind: 'characters',
          grid: 'pinyin',
          characters: ['ing', 'ying', 'yīng', 'yíng', 'yǐng', 'yìng'],
        },
        activity:
          '先指韵母ing，再指整体音节ying，比较yin/ying；实际声音听辨与字形比较分开确认。',
      },
      {
        title: '前后鼻音先看字形，再实际听读',
        text: 'an/ang、en/eng、in/ing分别比较结尾n与ng，ong也属于本课以ng结尾的一组。不能仅凭写对字母认定鼻音发准。第54页音节可读bàng、huáng、chuāng、qiáng；réng、héng、děng、fēng；jǐng、bǐng、qīng、tīng；hóng、zhōng、qióng、sòng。先看完整韵母与调号，再跟规范示范逐组读。',
        visual: {
          kind: 'characters',
          grid: 'pinyin',
          characters: ['an', 'ang', 'en', 'eng', 'in', 'ing', 'ong'],
        },
        activity:
          '任选一对前后鼻音，请家长用规范示范陪听、陪读；再从四个音节组各选一个尝试读，不用屏幕字体代替声音。',
      },
    ],
    focusQuestions: [
      {
        key: 'whole-ying',
        prompt: [
          '比较ying与ing，这一对中哪项是整体认读音节？',
          '新材料yíng属于本课哪个不带调的整体认读音节？',
        ],
        labels: ['ying', 'ing', 'yin', 'in'],
        value: ['ying', 'ying'],
        material: ['ying / ing', 'yíng'],
        explanation:
          'ying是整体认读，ing是韵母；yíng仍是ying带第二声，不漏写末尾g。',
      },
      {
        key: 'front-back',
        prompt: ['比较in与ing，哪项以ng结尾？', '比较en与eng，哪项以ng结尾？'],
        labels: ['in', 'ing', 'en', 'eng'],
        value: ['ing', 'eng'],
        material: ['in / ing', 'en / eng'],
        explanation: 'ing、eng以ng结尾；这题只比较字形，实际前后鼻音另听示范。',
      },
      {
        key: 'fan-final',
        prompt: [
          '看所示音节，chuāng对应本组哪个韵母？',
          '换成qióng，对应本组哪个韵母？',
        ],
        labels: ['ang', 'eng', 'ing', 'ong'],
        value: ['ang', 'ong'],
        material: ['chuāng', 'qióng'],
        explanation:
          'chuāng对应ang，qióng对应ong；看完整音节，不由题目次序猜韵母。',
      },
      {
        key: 'fan-tone',
        prompt: ['看新音节，bǐng是哪一声？', '换成hóng，这个音节是哪一声？'],
        labels: ['第一声', '第二声', '第三声', '第四声'],
        value: ['第三声', '第二声'],
        material: ['bǐng', 'hóng'],
        explanation:
          'bǐng带第三声标记，hóng带第二声标记；调号形状不自动证明实际发音质量。',
      },
    ],
    readingQuestions: [
      {
        key: 'reading-bridge',
        prompt: [
          '《两只羊》中，桥东的羊从哪边走来？',
          '《两只羊》中，另一只羊从哪边走来？',
        ],
        labels: ['东边', '西边', '天上'],
        value: ['东边', '西边'],
        explanation:
          '回看原书两只羊走来的方向，一只桥东、一只桥西；不要混同两只羊。',
      },
      {
        key: 'reading-event',
        prompt: [
          '《两只羊》中，两只羊在哪儿相遇？',
          '《两只羊》中，最后掉到哪里？',
        ],
        labels: ['小桥上', '河中', '教室'],
        value: ['小桥上', '河中'],
        explanation: '按故事找相遇处与最后发生的事；现实中不模仿落水。',
      },
      {
        key: 'reading-yield',
        prompt: [
          '《两只羊》中，两只羊有没有肯让路？',
          '共读《两只羊》后，看材料中的说法，结合故事结尾选择判断。',
        ],
        labels: ['都不肯', '都愿意', '没有提到'],
        reviewLabels: ['与原文不符', '与原文相符', '原文没有结尾'],
        value: ['都不肯', '与原文不符'],
        material: ['', '待判断的说法：两只羊都肯让路，最后顺利走过了小桥。'],
        explanation:
          '原故事中双方都不肯让，最后掉进河中，材料里肯让路并顺利过桥的说法与原文不符；自己的礼让办法可以另谈，不改写原文情节，也不模仿落水。',
      },
    ],
    actualFocus:
      '参考规范示范实际尝试ying整体认读，再任选一组前后鼻音陪听、陪读；从第54页四个音节组各选一个尝试读。家长确认尝试，不由字形题判断实际鼻音正确。',
  },
];

export const formalUnitFourNasal: Record<string, Lesson> = Object.fromEntries(
  bodies.map((body) => [body.itemId, makeFormal(body)]),
);
