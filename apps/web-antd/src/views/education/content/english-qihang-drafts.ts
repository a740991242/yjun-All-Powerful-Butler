import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
import { englishQihangSource } from './english-qihang-source';

/** Original preparatory content. Not registered as an available textbook.
 * page is a teacher chapter start or a cited student page; source scope is explicit.
 */
function task(
  lesson: string,
  suffix: string,
  prompt: string,
  rule: Question['rule'],
  explanation: string,
): Question {
  return {
    id: `${lesson}-${suffix}`,
    knowledge: lesson,
    prompt,
    rule,
    explanation,
    hint: '先理解交际情境或逐个点数，再选词；字形答对不证明听懂、读准或实际交流。',
  };
}
function choose(
  lesson: string,
  suffix: string,
  prompt: string,
  value: string,
  labels: string[],
  explanation: string,
): Question {
  return {
    ...task(lesson, suffix, prompt, { kind: 'choice', value }, explanation),
    choices: labels.map((label) => ({ id: label, label })),
  };
}
function actual(lesson: string, suffix: string, prompt: string) {
  return task(
    lesson,
    suffix,
    prompt,
    { kind: 'manual' },
    '孩子与陪学者实际完成后再确认；没做可跳过。文字练习不能自动确认发音、听辨、绘画或对话。',
  );
}
function record(lesson: string, suffix: string, prompt: string) {
  return task(
    lesson,
    suffix,
    prompt,
    { kind: 'reflection' },
    '按实际情况保留原话，不判对错；未做、实际收获与以后计划分开记录。',
  );
}
function draft(
  id: string,
  title: string,
  page: number,
  goal: string,
  prerequisite: string,
  steps: Lesson['steps'],
  questions: Question[],
  reviewQuestions: Question[],
  sourceScope?: string,
): Lesson {
  return {
    id,
    textbookTitle: '新启航英语教师资源对应原创教学草稿',
    title,
    page,
    version: 1,
    status: 'preparing',
    goal,
    prerequisite,
    parentTip: `${sourceScope ?? '依据官方教师资源上册前两单元的已读范围制作。page为教师分章印刷页起点，学生教材身份尚待核齐。'}情境、练习和圆点图均为原创，不复制原故事、插画、韵文或录音。可用中文帮读任务；不要求写单词、取英文名、上传实名或个人照片。读音请用合法规范示范，本稿无音频，不以选择题评口语。不是苏州译林一年级正式教材，也不证明任何地区统一选用。`,
    review: {
      date: englishQihangSource.checkedAt,
      reviewer: sourceScope
        ? '官方教师教学设计完整文本核对范围，未渲染'
        : '官方教师资源上册前两单元逐页核对范围',
      notes:
        '原创基础草稿；整单元故事与所有活动未完整映射，学生用书身份和最终教学验收继续。',
    },
    steps,
    questions,
    reviewQuestions,
  };
}

const greeting = 'english-qihang-upper-greetings-draft';
const name = 'english-qihang-upper-name-draft';
const numbers = 'english-qihang-upper-number-words-draft';
const counting = 'english-qihang-upper-counting-draft';
const colours = 'english-qihang-upper-colours-draft';
const schoolThings = 'english-qihang-upper-school-things-draft';
const classroom = 'english-qihang-upper-classroom-draft';
const words = ['one', 'two', 'three', 'four', 'five', 'six'];

export const englishQihangDraftLessons: Lesson[] = [
  draft(
    greeting,
    '见面问好与友好邀请',
    1,
    '在见面、初次认识和邀请游戏三个情境中理解简单用语，并尝试与陪学者交流。',
    '不要求已会英语；能在中文帮读下理解见面与邀请。',
    [
      {
        title: '见面先问好',
        text: '小安在活动室遇到新朋友，先说Hello!，朋友可以回应Hi!。Hello和Hi都能用于问好，不给它们虚构不同的标准答案。本课看见文字认意思，实际听音要另用规范示范。',
        activity: '陪学者先示范，小朋友轮流用Hello或Hi问好；没实际练习不确认。',
      },
      {
        title: '第一次认识',
        text: '初次认识时可以说Nice to meet you.，意思是很高兴认识你。这里练理解整句话，不要求拆语法或抄写，也不把一次选对当作已经能流利说出。',
      },
      {
        title: '邀请一起玩',
        text: '小安邀请朋友做桌面卡片游戏：Let’s play!。朋友愿意参加，可以回应OK!。邀请与自我介绍是不同意思；不想参加时可以说明自己的意愿，不强迫说OK。',
        activity: '与陪学者交换邀请者和应答者；实际交流时尊重对方是否愿意。',
      },
      {
        title: '自己安排短对话',
        text: '先见面问好，再说初次认识的友好话，最后在合适时提出游戏邀请。你可以只练两句，也可以多练；交流次数由实际做过决定，网页不会自动代你完成。',
      },
    ],
    [
      choose(
        greeting,
        'hello',
        'Hello!通常用来做什么？',
        '问好',
        ['问好', '数数', '介绍名字'],
        'Hello是问好用语。',
      ),
      choose(
        greeting,
        'hi',
        'Hi!通常用来做什么？',
        '问好',
        ['介绍名字', '问好', '数数'],
        'Hi也能问好。',
      ),
      choose(
        greeting,
        'meet',
        'Nice to meet you.表达哪种意思？',
        '很高兴认识你',
        ['我叫小安', '一起玩吧', '很高兴认识你'],
        '这句话表达认识新朋友的高兴。',
      ),
      choose(
        greeting,
        'invite',
        '想邀请朋友一起玩，可以说哪句？',
        'Let’s play!',
        ['My name is An.', 'Let’s play!', 'Nice to meet you.'],
        'Let’s play是游戏邀请；其它两句意思不同。',
      ),
      choose(
        greeting,
        'ok',
        '朋友邀请游戏，你愿意参加，可回应什么？',
        'OK!',
        ['OK!', 'My name is An.', 'six'],
        '在这个情境下，OK表示同意。',
      ),
      choose(
        greeting,
        'both',
        '关于Hello和Hi，哪句正确？',
        '两句都能问好',
        ['只有Hello能问好', '两句都能问好', '两句都是名字'],
        '不能把Hi当作错误问候。',
      ),
      actual(
        greeting,
        'say',
        '听陪学者的规范示范，再尝试说Hello、Hi和Nice to meet you；实际尝试后确认。',
      ),
      actual(
        greeting,
        'dialogue',
        '与陪学者实际轮换问好、邀请与应答两个角色；没有进行可跳过。',
      ),
      record(
        greeting,
        'today',
        '记录今天实际说过哪句、哪里需要帮助；没练过如实写未做。',
      ),
      record(greeting, 'plan', '另记以后想怎样练习；计划不当作今天已完成。'),
    ],
    [
      choose(
        greeting,
        'review-meet',
        '第一次认识小伙伴，哪句表达很高兴认识你？',
        'Nice to meet you.',
        ['Let’s play!', 'Nice to meet you.', 'My name is Bo.'],
        '新情境仍是初次认识。',
      ),
      choose(
        greeting,
        'review-invite',
        '哪句是在邀请一起玩？',
        'Let’s play!',
        ['Let’s play!', 'Hi!', 'Hello!'],
        '问好与邀请的作用分开。',
      ),
      actual(
        greeting,
        'review-say',
        '在新的原创活动室情境中实际练一轮问好与邀请；未做可跳过。',
      ),
    ],
  ),
  draft(
    name,
    '介绍自己的名字',
    1,
    '理解I’m与My name is两种自我介绍用法，使用自选昵称进行真实交流。',
    '知道Hello和Hi可问好；能区分自己和对方。',
    [
      {
        title: '说自己叫什么',
        text: '示例昵称An：I’m An.可以表示我叫An；My name is An.也可以介绍同一个名字。两种表达都可以，不把一种固定成唯一正确说法。昵称可以用自己的选择，不要求另取英文名。',
      },
      {
        title: '听是谁在介绍',
        text: '新朋友说My name is Bo.，这里Bo是新朋友的名字。自己再介绍时可以说自己的昵称，不需要把对方的名字照搬到自己身上。',
        activity: '陪学者与孩子各用一个虚构昵称，轮流介绍，再指出说话者是谁。',
      },
      {
        title: '制作不公开的昵称卡',
        text: '在纸上画自己的标记，昵称不会写可以请陪学者代写；用名字卡辅助说I’m…或My name is…，不把代写认作孩子会拼写。卡片留在本地，不需要学校、住址、电话或上传照片。',
        activity: '实际制作卡片并用它介绍；只看示例不等于已制作。',
      },
      {
        title: '问好之后介绍',
        text: '先Hello!，再用一种自我介绍方式，接着说Nice to meet you.。这是原创短对话支架，可以按实际能力只练其中两句，不要求固定背诵整段。',
      },
    ],
    [
      choose(
        name,
        'im',
        'I’m An.在名字介绍中是什么意思？',
        '我叫An',
        ['我叫An', '一起玩吧', '你叫An'],
        'I’m在这个名字情境里介绍自己。',
      ),
      choose(
        name,
        'my-name',
        'My name is Bo.介绍的是谁的名字？',
        '说话者',
        ['听话者', '说话者', '桌子'],
        'My name指说话者自己的名字。',
      ),
      choose(
        name,
        'two-forms',
        '哪组都能介绍自己的名字？',
        'I’m An.／My name is An.',
        ['Hello!／Let’s play!', 'I’m An.／My name is An.', 'Hi!／OK!'],
        '两种形式都能用于同一个名字介绍。',
      ),
      choose(
        name,
        'speaker',
        '示例：小安说I’m An.，小波说I’m Bo.。小波介绍什么名字？',
        'Bo',
        ['An', 'Bo', '不知道谁说了话'],
        '题干已经明确谁说哪句，按说话者判断。',
      ),
      choose(
        name,
        'privacy',
        '名字卡必须上传真实姓名、住址和电话吗？',
        '不需要',
        ['必须全部上传', '只要上传电话', '不需要'],
        '练习可以用自选昵称，不需要上传个人信息。',
      ),
      actual(
        name,
        'say-name',
        '用自选昵称实际尝试I’m…和My name is…两种表达；需要帮助可以记录。',
      ),
      actual(
        name,
        'card',
        '在纸上画一个标记并制作昵称卡，再借它介绍；未制作可跳过。',
      ),
      actual(
        name,
        'exchange',
        '与陪学者轮流问好和介绍，辨认两位说话者各是谁；实际做过再确认。',
      ),
      record(
        name,
        'today',
        '记录已尝试哪种表达、是否需要示范或帮读；不要填写住址或电话。',
      ),
      record(name, 'plan', '另记下次想练哪一句，不把未来安排记为已做。'),
    ],
    [
      choose(
        name,
        'review-name',
        '新的示例说话者说My name is Lin.，介绍的名字是哪一个？',
        'Lin',
        ['An', 'Lin', 'Bo'],
        '判断来自本次的新名字，不背旧答案。',
      ),
      choose(
        name,
        'review-im',
        '想介绍自己叫Lin，哪句合适？',
        'I’m Lin.',
        ['OK!', 'Let’s play!', 'I’m Lin.'],
        'I’m加自己的名字可用于自我介绍。',
      ),
      actual(
        name,
        'review-dialogue',
        '换一个虚构昵称，再实际问好和自我介绍；练习结果由陪学者观察。',
      ),
    ],
  ),
  draft(
    numbers,
    '英文数字one到six',
    17,
    '将one、two、three、four、five、six与1～6数量对应，区分看词、听音与实际口说。',
    '能逐一数出1～6个物件；不会英语也能在帮读下开始。',
    [
      {
        title: '一个对象对应一个数',
        text: '本站用圆点表示数量，每个点代表一个。one对应1，two对应2，three对应3。先指点数中文数量，再观察英文词，不把字母个数当物件数。',
        visual: { kind: 'count', count: 3 },
      },
      {
        title: '继续认识四到六',
        text: 'four对应4，five对应5，six对应6。four和five都以f开头，却表示不同数量；要看完整词，不仅凭首字母。先理解词与数量，不要求一年级孩子拼写整词。',
        visual: { kind: 'count', count: 6 },
      },
      {
        title: '点数后选完整词',
        text: '数过一个就指向下一个，不重复、不漏数。最后一个数说明这组共有几个；圆点的颜色、行列和间距改变，不会改变它们的总个数。',
        activity: '实际摆1～6张纸片，依次点数；自己摆了多少要自己核对。',
      },
      {
        title: '听和说另练',
        text: '本稿没有示范录音，文字选对只记录词义或数量对应。陪学者使用规范示范后，孩子可以跟读，再听陪学者说词并指向相应数量；没有示范时如实跳过听说。',
        activity:
          '分别进行实际跟读与听词指数量，记录需要帮助的词，不自动给口语满分。',
      },
    ],
    [
      ...words.map((word, index) => ({
        ...choose(
          numbers,
          `word-${index + 1}`,
          `下图有几个圆点？选对应英文词。`,
          word,
          ['three', 'six', 'one', 'five', 'two', 'four'],
          `${index + 1}个对应${word}，逐个点数再核对词。`,
        ),
        visual: { kind: 'count' as const, count: index + 1 },
      })),
      ...words.map((word, index) =>
        task(
          numbers,
          `meaning-${index + 1}`,
          `英文数字词${word}表示几个？填写数字。`,
          { kind: 'number', value: index + 1 },
          `${word}对应${index + 1}。字母数量不是物件数量。`,
        ),
      ),
      actual(
        numbers,
        'say',
        '听规范示范后实际尝试读one到six；未进行听说可以跳过。',
      ),
      actual(
        numbers,
        'point',
        '陪学者实际说一个1～6英文数字词，孩子指向相应纸片数量，换词再练；确认实际做过，不自动认全答对。',
      ),
      record(
        numbers,
        'today',
        '分别记录看词与听说的实际情况；哪些尚未尝试、哪些需要帮助？',
      ),
      record(numbers, 'plan', '另记以后想练哪个词，计划不是已学会。'),
    ],
    [
      ...[4, 1, 6, 2, 5, 3].map((count) => ({
        ...choose(
          numbers,
          `review-${count}`,
          '复习：先数圆点，再选对应词。',
          required(words[count - 1]),
          ['five', 'one', 'four', 'two', 'six', 'three'],
          `${count}个对应${words[count - 1]}，本次换顺序仍要按数量选。`,
        ),
        visual: { kind: 'count' as const, count },
      })),
    ],
  ),
  draft(
    counting,
    '用数字词表达实际数量',
    17,
    '读懂原创数量卡，区分给定样例与自己的真实数量，制作1～6卡片并交流。',
    '已认识one到six的词与数量对应。',
    [
      {
        title: '给定的数量卡',
        text: '本站卡片A上有2个圆点，对应two；卡片B上有5个圆点，对应five。这是本次给定的样例，不代表孩子手里的实物数量。没有数过自己的物件，就不能自动填two或five。',
      },
      {
        title: '判断词和数量是否相配',
        text: 'three配3个，six配6个。对不上的卡片先重新数点，再检查完整词；调整点数或换正确词都可以修正卡片，网页题目按它明确给出的条件作答。',
      },
      {
        title: '自己制作六张卡',
        text: '用六张小纸片分别画1、2、3、4、5、6个点，陪学者可代写相应英文词。指每一张解释数量，检查漏点或重复；不用购买材料或上传作品。',
        activity:
          '实际绘制六张数量卡并检查各张点数；不会写英文可以由陪学者标注。',
      },
      {
        title: '交流和自我观察',
        text: '陪学者出一张卡，孩子数后尝试说数字词；交换角色，再尝试另一张。分别观察能看词对应、能跟读、能听辨或能自主说，不把一项选择正确扩成全会。实际数量超过6时，本课可以选其中1～6个练，不伪称全堆数量。',
      },
    ],
    [
      choose(
        counting,
        'card-a',
        '给定卡片A有2个圆点，应配哪个词？',
        'two',
        ['one', 'two', 'six'],
        '按给定2个选择two。',
      ),
      choose(
        counting,
        'card-b',
        '给定卡片B有5个圆点，应配哪个词？',
        'five',
        ['five', 'four', 'three'],
        '按给定5个选择five。',
      ),
      choose(
        counting,
        'mismatch',
        'three旁画了4个点，这张卡相配吗？',
        '不相配',
        ['相配', '不相配', 'three表示所有数量'],
        'three是3，给定却有4个。',
      ),
      choose(
        counting,
        'correct-card',
        'six应配哪种数量卡？',
        '6个点',
        ['5个点', '1个点', '6个点'],
        'six对应6个。',
      ),
      choose(
        counting,
        'unknown',
        '没有数过自己手里的纸片，能照抄样例的two吗？',
        '不能，先实际数',
        ['能，样例就是自己的数量', '不能，先实际数', '不知道就填0'],
        '未数过是未知，不是样例数量，也不是0。',
      ),
      choose(
        counting,
        'support',
        '不会写five但理解5个，可以怎样做数量卡？',
        '请陪学者代写，再自己核对5个点',
        ['不允许参加', '请陪学者代写，再自己核对5个点', '必须先会拼写才能数'],
        '本课理解数量，不把英文拼写作为门槛。',
      ),
      actual(
        counting,
        'draw',
        '实际制作1～6六张点数卡，逐张核对，不把看过本页当作已经画完。',
      ),
      actual(
        counting,
        'count-own',
        '从自己的物件中选1～6个，实际数并尝试说对应英文词；没数过可跳过。',
      ),
      actual(
        counting,
        'exchange',
        '与陪学者实际交换出卡、数数量和说词两个角色；确认只记实际活动。',
      ),
      record(
        counting,
        'today',
        '分别写今天实际画卡、数数、看词、听说的情况，尚未进行的项目如实说明。',
      ),
      record(
        counting,
        'plan',
        '另记下次想补哪项活动；计划与本次已做分别记录。',
      ),
    ],
    [
      choose(
        counting,
        'review-three',
        '新卡片画了3个点，配哪个词？',
        'three',
        ['six', 'three', 'five'],
        '新给定3个对应three。',
      ),
      choose(
        counting,
        'review-four',
        'four旁画4个点，相配吗？',
        '相配',
        ['相配', '不相配', 'four只表示4个字母'],
        'four对应数量4，不是按字母个数判断。',
      ),
      choose(
        counting,
        'review-own',
        '样例有6个，你还没有数自己的物件，该怎样记录自己的数量？',
        '待实际数，不填样例',
        ['自动填6', '自动填0', '待实际数，不填样例'],
        '未知与0分开，给定卡不是实际持有数。',
      ),
      actual(
        counting,
        'review-exchange',
        '换一组卡片，实际与陪学者交流数量；未做可跳过。',
      ),
    ],
  ),
  draft(
    colours,
    '认识颜色、询问与表达喜好',
    23,
    '理解五个核心颜色词，区分物品颜色与自己的喜好，尝试问答、混色观察和按图例涂色。',
    '认识1～5的数字；颜色辨认或阅读需要帮助时可由陪学者说明。',
    [
      {
        title: '颜色词表示颜色',
        text: 'red是红色，blue是蓝色，yellow是黄色，green是绿色，orange在本课颜色情境中是橙色。物品的形状、大小或名字不决定它是什么颜色；同一种物品可以有不同颜色。文字词义题不是看真实色块辨色，实际认色另练。',
        activity:
          '任选手边已有色卡或物品，陪学者说明颜色，孩子尝试指认；不要求凑齐五种或购买材料。',
      },
      {
        title: '问颜色与介绍颜色',
        text: 'What’s the colour?是在问颜色；It’s blue.是在说明它是蓝色。本站原创样例明确给一张蓝色卡，就可以用blue描述；若物品颜色没有给定，也没有实际看到，不能猜成blue。',
        activity:
          '陪学者和孩子轮流出示已有色卡，用颜色问句和回答交流；未实际进行可跳过。',
      },
      {
        title: '喜欢什么不等于物品是什么颜色',
        text: 'I like green.表达我喜欢绿色。你可以喜欢一种、多种或暂时没有偏好，不照抄样例作为自己的喜好。图里的物品是什么颜色是观察信息，自己喜欢什么是个人表达，不给不同喜好判错。',
      },
      {
        title: '混色先观察再记录',
        text: '教案探索蓝与黄、红与黄、红与蓝的颜料混合。可由陪学者用适合儿童的现有颜料尝试，观察绿色、橙色或紫色等变化；实际色调受颜料和比例影响，未实验不能把预期填作观察结果。purple为这次探索的补充，不把核心五词改成六词必考；屏幕颜色相叠也不是颜料实做。',
        activity:
          '如果具备材料与陪学条件，可实际混一种组合并记录看到的结果；没有条件如实跳过，不强制购买。',
      },
      {
        title: '读自己的颜色图例',
        text: '本站原创图例：1=blue、2=orange、3=red、4=green、5=yellow。数字只是本次图例编号，不是颜色的永久编号。纸上画五个小区域并写编号，按这份图例涂色，再介绍作品；换图例时要重新看对应关系。',
        activity:
          '实际画编号区域、按图例涂色并介绍；颜色工具没有备齐可只做能完成的部分，记录实际范围。',
      },
    ],
    [
      ...[
        ['red', '红色'],
        ['blue', '蓝色'],
        ['yellow', '黄色'],
        ['green', '绿色'],
        ['orange', '橙色'],
      ].map(([word, meaning]) =>
        choose(
          colours,
          `word-${word}`,
          `在颜色情境中，${word}表示什么颜色？`,
          required(meaning),
          ['绿色', '红色', '黄色', '橙色', '蓝色'],
          `${word}在这个颜色情境中对应${meaning}。`,
        ),
      ),
      choose(
        colours,
        'ask',
        '哪句是在询问颜色？',
        'What’s the colour?',
        ['I’m An.', 'What’s the colour?', 'Let’s play!'],
        'colour是颜色，整句用于询问颜色。',
      ),
      choose(
        colours,
        'given-blue',
        '题干明确卡片是蓝色，应怎样介绍？',
        'It’s blue.',
        ['It’s green.', 'It’s orange.', 'It’s blue.'],
        '按本题给定的蓝色判断，不按个人喜好。',
      ),
      choose(
        colours,
        'like',
        'I like green.在这里表达什么？',
        '我喜欢绿色',
        ['物品一定是绿色', '我喜欢绿色', '每个人都必须喜欢绿色'],
        'I like表达个人喜好，不是所有人的标准答案。',
      ),
      choose(
        colours,
        'key-one',
        '本次图例1=blue、2=orange、3=red、4=green、5=yellow，编号1用什么词？',
        'blue',
        ['red', 'yellow', 'blue'],
        '按本次图例，1对应blue，不沿用其它图例。',
      ),
      choose(
        colours,
        'key-two',
        '同一份本次图例中，编号2应涂哪种颜色？',
        '橙色',
        ['橙色', '绿色', '红色'],
        '2=orange，对应橙色。',
      ),
      choose(
        colours,
        'key-five',
        '同一份本次图例中，yellow对应哪个编号？',
        '5',
        ['1', '3', '5'],
        'yellow在本次图例里对应5。',
      ),
      actual(
        colours,
        'point',
        '任选已有色卡或物品，实际指认并尝试说一个颜色词；确认只记录实际尝试，不表示五词全会。',
      ),
      actual(
        colours,
        'talk',
        '实际与陪学者轮流询问颜色、描述色卡，并表达自己的喜好；需要帮助可以记录。',
      ),
      actual(
        colours,
        'mix',
        '具备材料和陪学条件时实际混一种颜料组合、观察结果；未做不能确认，可跳过。',
      ),
      actual(
        colours,
        'paint',
        '在纸上按本次编号图例实际画涂作品，并介绍已完成的区域；没有做可跳过。',
      ),
      record(
        colours,
        'today',
        '记录实际用了哪些颜色、混色看到什么或尚未实验、问答需要什么帮助；个人喜好不评分。',
      ),
      record(
        colours,
        'plan',
        '另记下一次想观察或练习的颜色；未来计划不当作本次已做。',
      ),
    ],
    [
      choose(
        colours,
        'review-yellow',
        '新样例明确物品是黄色，哪句符合给定信息？',
        'It’s yellow.',
        ['It’s blue.', 'It’s yellow.', 'It’s red.'],
        '按新给定的黄色判断。',
      ),
      choose(
        colours,
        'review-key',
        '换图例：1=red、2=green。编号1这次对应哪个词？',
        'red',
        ['blue', 'green', 'red'],
        '编号意义来自本次图例；不能背旧图例的blue。',
      ),
      choose(
        colours,
        'review-preference',
        '小伙伴喜欢blue，你喜欢red，必须改成和小伙伴相同吗？',
        '不必，可以分别表达喜好',
        ['必须都喜欢blue', '不必，可以分别表达喜好', '不同喜好就是答错'],
        '喜好可以不同，仍能友好交流。',
      ),
      actual(
        colours,
        'review-talk',
        '换一张已有色卡，实际询问和回答颜色，再说自己的喜好；未做可跳过。',
      ),
    ],
    '依据官方上册第三单元教学设计完整文本制作，未渲染Word或读取学生原图。page=23只是教案引用的学生单元起点，不是本轮实际查看过的学生正文页。学生用书身份继续核验。',
  ),
  draft(
    schoolThings,
    '介绍文具与友好互助',
    34,
    '理解六种学习用品名称，在安慰、提供帮助、分享和感谢的情境中交流，并观察自己的实际物品。',
    '知道问好和简单邀请；可由陪学者帮读中文情境。',
    [
      {
        title: '看整词认用品',
        text: 'pencil铅笔、ruler尺子、schoolbag书包、eraser橡皮、book书、pencil case笔盒或笔袋。pencil和pencil case不是同一物品；看完整词，不把含pencil的短语都当一支铅笔。本稿词义题不代实际看物品辨认。',
        activity:
          '用已有物品或自己画的卡片实际指认；没有某种物品可用图卡，不要求购买或数量齐全。',
      },
      {
        title: '先理解发生了什么',
        text: '原创情境：小林画卡片时暂时找不到尺子，小安愿意提供一把尺子。Don’t worry.用于安慰，Here’s a ruler.表示这里有一把尺子。尺子确实拿到或愿意共同使用，才说相应的话；不假装已经借到。',
      },
      {
        title: '分享之后礼貌感谢',
        text: 'Let’s share.表达一起分享的提议，Thank you!用于感谢。对方愿意才借用或共享，自己的用品妥善保管，用后按双方约定归还；不把同意分享设为每个孩子必须完成的固定答案。可以用纸卡进行角色模拟。',
        activity:
          '两人用纸卡实际轮换需要帮助者和帮助者，尝试安慰、提供或分享、感谢三个环节。',
      },
      {
        title: '样例不是自己的书包',
        text: '给定样例书包里有一本书和一把尺子，没有橡皮。自己的书包里有什么需要实际观察；未看过不能自动照填样例，也不能把未知当没有。可以只介绍一件自己确认的物品，不上传书包照片。',
        activity:
          '实际观察自己的用品或自选纸卡，分清已看到、已检查没有和未检查，再介绍已确认的一件。',
      },
      {
        title: '比较后记录真实情况',
        text: '本站原创文字卡A列book、ruler，卡B列book、eraser。两张都有book，A独有ruler，B独有eraser。这是给定信息比较，不能说已经在教材两幅原图里找到了全部差异；真实找图差异需要另看对应材料。',
      },
    ],
    [
      ...[
        ['pencil', '铅笔'],
        ['ruler', '尺子'],
        ['schoolbag', '书包'],
        ['eraser', '橡皮'],
        ['book', '书'],
        ['pencil case', '笔盒或笔袋'],
      ].map(([word, meaning]) =>
        choose(
          schoolThings,
          `word-${word?.replaceAll(' ', '-')}`,
          `${word}在学习用品情境中表示什么？`,
          required(meaning),
          ['书', '笔盒或笔袋', '尺子', '书包', '铅笔', '橡皮'],
          `${word}对应${meaning}，完整短语与单个词分清。`,
        ),
      ),
      choose(
        schoolThings,
        'comfort',
        '同伴暂时找不到尺子，哪句可以先表达安慰？',
        'Don’t worry.',
        ['Thank you!', 'Don’t worry.', 'My name is An.'],
        'Don’t worry在这里表达安慰。',
      ),
      choose(
        schoolThings,
        'offer',
        '你愿意提供一把尺子，哪句符合情境？',
        'Here’s a ruler.',
        ['Here’s a ruler.', 'Here’s a book.', 'It’s orange.'],
        '按本次给定物品选择ruler。',
      ),
      choose(
        schoolThings,
        'share',
        'Let’s share.表达哪种意思？',
        '一起分享吧',
        ['我叫小林', '一起分享吧', '我喜欢绿色'],
        '这是分享的提议。',
      ),
      choose(
        schoolThings,
        'thanks',
        '同伴提供了帮助，表达感谢可以说什么？',
        'Thank you!',
        ['Thank you!', 'pencil case', 'I’m An.'],
        'Thank you用于感谢。',
      ),
      choose(
        schoolThings,
        'unknown',
        '尚未看过自己书包，能把样例的book直接记为自己有吗？',
        '不能，先实际观察',
        ['能，样例就是我的书包', '不能，先实际观察', '没看过就是没有'],
        '未知不等于拥有，也不等于没有。',
      ),
      choose(
        schoolThings,
        'difference',
        '文字卡A是book、ruler；卡B是book、eraser。A独有哪一种？',
        'ruler',
        ['eraser', 'book', 'ruler'],
        '给定两卡都有book，A独有ruler。',
      ),
      actual(
        schoolThings,
        'point',
        '用已有物品或自画卡片实际指认并尝试说一种用品名称；确认不代表六词全会。',
      ),
      actual(
        schoolThings,
        'talk',
        '实际用纸卡角色模拟安慰、提供或分享、感谢，并交换两个角色；未做可跳过。',
      ),
      actual(
        schoolThings,
        'own',
        '实际观察自己的用品或所选卡片，尝试介绍一件已确认的物品；不要上传个人照片。',
      ),
      record(
        schoolThings,
        'today',
        '记录实际看过的用品、已经进行的交流与需要帮助之处；没检查的保持未知。',
      ),
      record(
        schoolThings,
        'plan',
        '另记下次想整理或练习的项目，不把未来安排算作已经完成。',
      ),
    ],
    [
      choose(
        schoolThings,
        'review-offer',
        '新情境要提供一本书，哪句符合？',
        'Here’s a book.',
        ['Here’s a ruler.', 'Here’s a book.', 'Here’s an eraser.'],
        '换物品后按book判断，不重复旧尺子答案。',
      ),
      choose(
        schoolThings,
        'review-case',
        'pencil case和pencil相同吗？',
        '不同，前者是笔盒或笔袋，后者是铅笔',
        [
          '相同，都只有一支铅笔',
          '不同，前者是笔盒或笔袋，后者是铅笔',
          '前者是书包',
        ],
        '完整短语的意义不同。',
      ),
      choose(
        schoolThings,
        'review-common',
        '新文字卡A列eraser、book，B列ruler、book，两卡共有哪种？',
        'book',
        ['book', 'ruler', 'eraser'],
        '本次两卡都列有book。',
      ),
      actual(
        schoolThings,
        'review-talk',
        '换成书或自选纸卡，实际轮换提供帮助与表达感谢；未做可跳过。',
      ),
    ],
    '依据官方上册第四单元教学设计完整文本制作，未渲染Word或读取学生原图。page=34只是教案引用的学生单元起点，文本抽取中的图形坐标不当作数量或题目。学生用书身份继续核验。',
  ),
  draft(
    classroom,
    '介绍教室与提出整理建议',
    45,
    '理解教室、人物与设施名称，区分我的和我们的，尝试晨间问候、介绍与整理提议。',
    '知道Hello、OK和简单物品介绍；可用中文帮助理解。',
    [
      {
        title: '认识场所与设施',
        text: 'classroom教室、teacher教师、blackboard黑板、desk课桌、chair椅子。teacher是人，不是桌椅等设施；classroom是场所。用词要看指向的对象，不把一个词用到所有东西。',
        activity:
          '用自己画的卡片或身边合适对象尝试指认，无需进入学校或上传室内照片。',
      },
      {
        title: '问好与介绍分开',
        text: '早晨可以说Good morning.；This is our classroom.用于介绍我们的教室，This is my desk.可以在自己使用的课桌情境中介绍我的桌子。our表示我们的，my表示我的；语言练习不证明物品的法律所有权。',
        activity:
          '用虚构教室图尝试早晨问候，再介绍一个场所或对象，陪学者观察需要的帮助。',
      },
      {
        title: '整理还有哪些对象',
        text: 'floor地面、window窗户、door门，也是教案清洁情境中的词。Let’s clean the desk.是在提出清洁课桌的建议，OK!可以在愿意参与时回应。clean在这句里表示清洁动作；答对文字题不证明已经擦干净。',
      },
      {
        title: '提议、实际活动与结果分开',
        text: '先与陪学者商量一个适合自己的整理任务，再实际做，最后观察结果。本站建议桌面整理或擦拭可触及的小区域；窗户可用图卡模拟，不要求爬高、操作清洁剂或完成所有设施的清洁。未做可跳过，计划不能自动变成完成记录。',
        activity:
          '在陪学者指导下任选一项适合的桌面整理实做；如果只进行了纸卡模拟，就只记录模拟。',
      },
      {
        title: '画自己的教室或想象空间',
        text: '可以观察后画真实教室，也可以画一个想象学习空间，两者标清。给自己的桌椅画记号，再介绍已经画出的对象。给定文字卡A列desk、chair，B列desk、window，共有desk；这种文字比较不能代替在学生原图里找出全部不同。',
        activity:
          '实际画图、标记并介绍；没有现成教室资料可画想象空间，不要求透露学校信息。',
      },
    ],
    [
      ...[
        ['classroom', '教室'],
        ['teacher', '教师'],
        ['blackboard', '黑板'],
        ['desk', '课桌'],
        ['chair', '椅子'],
        ['floor', '地面'],
        ['window', '窗户'],
        ['door', '门'],
      ].map(([word, meaning]) =>
        choose(
          classroom,
          `word-${word}`,
          `${word}在本课情境中表示什么？`,
          required(meaning),
          ['黑板', '窗户', '课桌', '教师', '椅子', '教室', '地面', '门'],
          `${word}对应${meaning}。人物、场所与设施不同。`,
        ),
      ),
      choose(
        classroom,
        'morning',
        'Good morning.用于哪种情境？',
        '早晨问好',
        ['介绍名字', '早晨问好', '清点纸片'],
        'morning是早晨，这句用于晨间问候。',
      ),
      choose(
        classroom,
        'our',
        'This is our classroom.里的our表示什么？',
        '我们的',
        ['我的', '我们的', '红色的'],
        'our表达我们的，my表达我的。',
      ),
      choose(
        classroom,
        'suggest',
        '哪句是在建议一起清洁桌子？',
        'Let’s clean the desk.',
        ['I like blue.', 'My name is An.', 'Let’s clean the desk.'],
        'Let’s clean在这个情境里提出清洁建议。',
      ),
      choose(
        classroom,
        'done',
        '只选对Let’s clean的意思，桌子就实际擦干净了吗？',
        '不能证明，须实际做并观察',
        ['已经自动擦干净', '不能证明，须实际做并观察', '所有整理都算完成'],
        '文字理解、行动和实际结果分别记录。',
      ),
      choose(
        classroom,
        'difference',
        '文字卡A列desk、chair，B列desk、window，A独有哪种？',
        'chair',
        ['window', 'desk', 'chair'],
        'chair只在A里，desk是共有。',
      ),
      actual(
        classroom,
        'point',
        '用卡片或身边合适对象实际指认一个词，再尝试晨间问好与介绍；不表示八词全会。',
      ),
      actual(
        classroom,
        'talk',
        '与陪学者实际轮流提出整理桌面的建议并回应；确认仅表示进行过交流。',
      ),
      actual(
        classroom,
        'tidy',
        '在陪学者指导下实际完成一项适合的桌面整理，再观察结果；只模拟或没做时可跳过实做确认。',
      ),
      actual(
        classroom,
        'draw',
        '实际画真实教室或标为想象的学习空间，圈出自己的桌椅或位置，并介绍作品；未画可跳过。',
      ),
      record(
        classroom,
        'today',
        '分别记录实际问答、绘画、整理和结果；模拟不能写成真的清洁完成。',
      ),
      record(
        classroom,
        'plan',
        '另记以后想改进或练习的内容；计划不代实际完成。',
      ),
    ],
    [
      choose(
        classroom,
        'review-my',
        'This is my desk.里的my表示什么？',
        '我的',
        ['我们的', '我的', '蓝色的'],
        '换成my后是我的，不沿用our答案。',
      ),
      choose(
        classroom,
        'review-door',
        '新情境是提议清洁门，哪句符合？',
        'Let’s clean the door.',
        [
          'Let’s clean the desk.',
          'Let’s clean the door.',
          'Let’s clean the blackboard.',
        ],
        '按新对象door选择。',
      ),
      choose(
        classroom,
        'review-common',
        '新文字卡A列door、chair，B列window、chair，共有哪一种？',
        'chair',
        ['door', 'window', 'chair'],
        'chair在两份给定列表里都有。',
      ),
      actual(
        classroom,
        'review-talk',
        '换一张对象卡，实际交流一个整理提议；只做模拟不确认实际清洁完成。',
      ),
    ],
    '依据官方上册第五单元教学设计完整文本制作，未渲染Word或读取学生原图。page=45只是教案引用的学生单元起点，不是本轮实际查看过的学生正文页。学生用书身份继续核验。',
  ),
];
