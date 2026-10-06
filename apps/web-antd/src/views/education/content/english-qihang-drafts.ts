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
const feelings = 'english-qihang-lower-feelings-draft';
const family = 'english-qihang-lower-family-draft';
const pets = 'english-qihang-lower-pets-draft';
const farmNumbers = 'english-qihang-lower-farm-numbers-draft';
const farmTime = 'english-qihang-lower-farm-time-draft';
const room = 'english-qihang-lower-room-draft';
const colourProject = 'english-qihang-upper-colour-project-draft';
const roomProject = 'english-qihang-lower-room-project-draft';
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
  draft(
    feelings,
    '表达感受与关心他人',
    1,
    '理解五个感受词和I’m表达，在明确的原创情境中判断词义，尝试表达与倾听，不替别人认定真实感受。',
    '能够在中文帮读下说出简单感受；不要求已有英语基础。',
    [
      {
        title: '五个词，不只一个开心',
        text: 'happy开心、hungry饿、tired累、sad难过、scared害怕。hungry和tired也描述身体感受。词义练习可以有答案，孩子此刻的真实感受却不统一判为happy；可以用中文说明、暂不表达或用虚构角色练习。',
      },
      {
        title: '说明自己与描述角色分开',
        text: 'I’m tired.可以表达我累了。原创文字情境明确“小林说自己累了”，才能在本题对应tired。仅凭一次笑脸、皱眉或样例，不能自动认定孩子或同伴的真实感受；需要倾听对方的话。',
        activity:
          '听陪学者的规范示范，任选两个词尝试跟读，再用虚构角色或自己愿意分享的感受练I’m…。',
      },
      {
        title: '先听，再友好回应',
        text: '对方表达sad或scared时，先听他愿意说的话，不嘲笑，也不要求马上开心。教案还包括礼貌请求与安全指令，本站原创例Please wait.请等一下，Don’t run.不要跑。语言理解不等于真实听从，也不做情绪诊断。',
        activity:
          '陪学者和孩子用纸卡角色交换表达与倾听，并实际练一次礼貌请求；未做可以跳过。',
      },
      {
        title: '规则卡不是心情预测',
        text: '本站词卡规则明确按happy、sad两个词依次重复：happy、sad、happy、sad、空格，下一张按给定规则是happy。这只是在读规则，不是在预测某个人下一刻必定开心。没有重复规则或真实反馈时，不能猜成固定答案。',
      },
      {
        title: '画卡与实际记录',
        text: '可以给虚构角色画表情卡，再说明你想让它表达哪个感受；他人可能有不同理解，交流时解释自己的设计。不要求填写私人经历或公开照片。今天实际练过什么、哪里需要帮助、下次想做什么，分别保留。',
        activity:
          '实际画一张角色感受卡，与陪学者说明设计并听反馈；画卡不自动证明所有词都会读。',
      },
    ],
    [
      ...[
        ['happy', '开心'],
        ['hungry', '饿'],
        ['tired', '累'],
        ['sad', '难过'],
        ['scared', '害怕'],
      ].map(([word, meaning]) =>
        choose(
          feelings,
          `word-${word}`,
          `${word}在本课感受表达中表示什么？`,
          required(meaning),
          ['累', '开心', '害怕', '饿', '难过'],
          `${word}对应${meaning}；这是词义，不决定你的真实感受。`,
        ),
      ),
      choose(
        feelings,
        'given-tired',
        '原创文字情境明确“小林说自己累了”，哪句对应这份给定信息？',
        'I’m tired.',
        ['I’m happy.', 'I’m hungry.', 'I’m tired.'],
        '本题给定的是累，选择tired，不推断真人感受。',
      ),
      choose(
        feelings,
        'wait',
        'Please wait.表示哪种意思？',
        '请等一下',
        ['请等一下', '我很开心', '一起数数'],
        'Please用于礼貌请求，本句请求等候。',
      ),
      choose(
        feelings,
        'dont',
        'Don’t run.在这个指令情境中是什么意思？',
        '不要跑',
        ['一起跑吧', '不要跑', '我喜欢跑'],
        'Don’t表示不要，本例为安全指令。',
      ),
      choose(
        feelings,
        'care',
        '同伴愿意告诉你他有点sad，哪种回应更合适？',
        '先倾听，不嘲笑或强迫开心',
        ['嘲笑他', '先倾听，不嘲笑或强迫开心', '强迫他立即说happy'],
        '可以友好倾听；不把开心作为唯一允许的感受。',
      ),
      choose(
        feelings,
        'pattern',
        '按happy、sad两个词依次重复：happy、sad、happy、sad、空格。下一词是哪一个？',
        'happy',
        ['sad', 'hungry', 'happy'],
        '按题干明确的交替规则选择happy，不是预测真人心情。',
      ),
      choose(
        feelings,
        'unknown',
        '没有询问同伴，也没有对方给出的感受信息，能自动填他很happy吗？',
        '不能，保持未知并尊重对方',
        ['能，每个人都必须开心', '不能，保持未知并尊重对方', '不知道就是sad'],
        '未知不等于happy或sad，不能替别人认定。',
      ),
      actual(
        feelings,
        'say',
        '听规范示范后实际尝试两个感受词或一句I’m表达，可用虚构角色；未练可跳过。',
      ),
      actual(
        feelings,
        'listen',
        '与陪学者实际交换表达与倾听两个角色，再尝试礼貌请求；确认只记录做过，不评真实感受对错。',
      ),
      actual(
        feelings,
        'draw',
        '实际绘制一张虚构角色的感受卡，并向陪学者解释设计；未画可跳过。',
      ),
      record(
        feelings,
        'today',
        '记录今天实际练习与需要帮助之处；不要求描述私人经历或评价自己的感受对错。',
      ),
      record(
        feelings,
        'observed',
        '如实际交流过，记录对方愿意给出的反馈；没交流写未做，不用猜测代替。',
      ),
      record(feelings, 'plan', '另记以后想练什么；未来安排不算本次已经完成。'),
    ],
    [
      choose(
        feelings,
        'review-hungry',
        '新原创文字情境明确角色说自己饿了，哪句对应？',
        'I’m hungry.',
        ['I’m tired.', 'I’m hungry.', 'I’m scared.'],
        '这次给定是饿，不能沿用上一题的tired。',
      ),
      choose(
        feelings,
        'review-pattern',
        '新规则按sad、happy依次重复：sad、happy、sad、happy、空格，下一词是什么？',
        'sad',
        ['happy', 'sad', 'tired'],
        '重新读取本次规则，开头已经换为sad。',
      ),
      choose(
        feelings,
        'review-personal',
        '角色卡画了笑脸，就能自动把孩子此刻的感受记为happy吗？',
        '不能，角色卡不等于本人感受',
        ['能，卡片决定本人心情', '必须记happy', '不能，角色卡不等于本人感受'],
        '绘画、给定角色与孩子真实感受分别记录。',
      ),
      actual(
        feelings,
        'review-talk',
        '换一张角色卡，实际进行一轮表达与倾听；未做可跳过。',
      ),
    ],
    '依据官方下册第一单元教学设计完整文本制作，未渲染Word或读取学生原图。page=1只是教案引用的学生单元起点，学生用书身份继续核验。',
  ),
  draft(
    family,
    '家庭称谓、介绍与分享',
    12,
    '理解家庭成员称谓、介绍和分享用语，以给定虚构关系练习，不要求孩子具有同样的家庭结构。',
    '知道简单自我介绍；可由陪学者帮读角色关系。',
    [
      {
        title: '称谓按关系理解',
        text: 'dad爸爸、mum妈妈、brother兄弟、sister姐妹、grandpa爷爷或外公、grandma奶奶或外婆。brother与sister本身没有区分哥哥弟弟、姐姐妹妹；要靠具体关系知道年龄。grandpa与grandma也不能仅凭英文词判定父系或母系。',
      },
      {
        title: '家庭样例与现实分开',
        text: '原创虚构角色小林有一个妹妹，在本例中可以介绍This is my sister.。并非每个孩子都有兄弟姐妹或六种成员，不要求照抄样例家庭。不愿介绍实际家庭时，可以用虚构卡片；不用上传家庭照片、真实姓名或地址。',
        activity:
          '任选一个虚构人物卡，在明确关系后用This is my…尝试介绍；无需透露自己的家庭情况。',
      },
      {
        title: '理解关爱表达',
        text: 'love表示爱或喜爱，family表示家庭；I love my family.是表达对家人的爱，We love…用我们作说话者。文字题理解意思可以判题，孩子真实想表达的话保持开放，不强迫背句或给情感表达打分。',
      },
      {
        title: '分享不必真的切蛋糕',
        text: 'This is for…可以说明某件东西给谁。本站原创情境是分享自己画的纸卡，This is for Grandma.表示这张卡给奶奶或外婆。可与陪学者模拟轮流分享和感谢，不要求食物、庆生或每个家庭同样的分享顺序；尊重对方意愿。',
        activity:
          '两人用自画纸卡实际角色模拟介绍、提供与感谢，再交换角色；模拟不记为已经向真实家人赠送。',
      },
      {
        title: '关系卡先有信息再排列',
        text: '本站给定：小安的爸爸是小安的父亲，小波是小安的哥哥。在以小安为中心的关系卡里，爸爸对应dad、小波对应brother。只有“某个男性”或“年纪大”不足以确定是爸爸或爷爷。自己的关系图可以只画愿意表示的角色，未知关系保持未知，不补齐固定人数。',
        activity:
          '实际画一张标为虚构的关系卡，说明至少一条已给定关系；不要求画自己的真实家庭。',
      },
    ],
    [
      ...[
        ['dad', '爸爸'],
        ['mum', '妈妈'],
        ['brother', '兄弟'],
        ['sister', '姐妹'],
        ['grandpa', '爷爷或外公'],
        ['grandma', '奶奶或外婆'],
        ['love', '爱或喜爱'],
        ['family', '家庭'],
      ].map(([word, meaning]) =>
        choose(
          family,
          `word-${word}`,
          `${word}在本课家庭情境中表示什么？`,
          required(meaning),
          [
            '家庭',
            '兄弟',
            '爱或喜爱',
            '奶奶或外婆',
            '妈妈',
            '姐妹',
            '爷爷或外公',
            '爸爸',
          ],
          `${word}对应${meaning}，年龄和父系母系还需具体关系。`,
        ),
      ),
      choose(
        family,
        'sister',
        '题干明确小林正在介绍自己的妹妹，哪句符合？',
        'This is my sister.',
        ['This is my brother.', 'This is my sister.', 'This is my dad.'],
        'sister可以指姐姐或妹妹；这里关系已明确为妹妹。',
      ),
      choose(
        family,
        'for',
        'This is for Grandma.在纸卡分享情境中说明什么？',
        '这张卡给奶奶或外婆',
        ['这张卡给奶奶或外婆', '我就是奶奶', '这张卡给爸爸'],
        'for在这个情境说明给谁，不说明说话者就是该成员。',
      ),
      choose(
        family,
        'love-family',
        'I love my family.表达什么？',
        '我爱我的家人',
        ['我喜欢一种颜色', '我爱我的家人', '我要数纸卡'],
        '理解表达意思，不给孩子的真实情感打分。',
      ),
      choose(
        family,
        'different',
        '每个孩子都必须有样例中的六种家庭成员吗？',
        '不必，家庭情况可以不同',
        ['必须一样', '不必，家庭情况可以不同', '没有一样的成员就不能练习'],
        '家庭结构可以不同，可用虚构卡练习。',
      ),
      choose(
        family,
        'unknown',
        '只知道某个角色是男性，没有关系信息，能确定他是dad吗？',
        '不能，需关系信息',
        ['能，男性都是爸爸', '能，年长就是爸爸', '不能，需关系信息'],
        '成员称谓依据关系，不只依据外表。',
      ),
      actual(
        family,
        'say',
        '听规范示范后实际尝试两个称谓，并用一张虚构关系卡介绍；未练可跳过。',
      ),
      actual(
        family,
        'share',
        '用纸卡实际模拟介绍、分享和感谢，并交换角色；不把模拟记为已向真实家人赠送。',
      ),
      actual(
        family,
        'draw',
        '实际制作一张虚构关系卡并解释至少一条已给定关系；不要求真实家庭照片。',
      ),
      record(
        family,
        'today',
        '记录今天实际练了哪些词、关系卡或交流，哪里需要帮助；不要求填私人家庭情况。',
      ),
      record(
        family,
        'plan',
        '另记下一次想练什么；计划不能写成今天已赠送或已交流。',
      ),
    ],
    [
      choose(
        family,
        'review-brother',
        '新的给定角色正在介绍自己的弟弟，哪句合适？',
        'This is my brother.',
        ['This is my sister.', 'This is my brother.', 'This is my grandpa.'],
        'brother可指哥哥或弟弟，按本次给定关系判断。',
      ),
      choose(
        family,
        'review-for',
        '新纸卡上写This is for Mum.，卡片给谁？',
        '妈妈',
        ['奶奶或外婆', '爸爸', '妈妈'],
        '本次收卡者换为Mum。',
      ),
      choose(
        family,
        'review-age',
        '只看到brother一词，能确定一定是哥哥不是弟弟吗？',
        '不能，需具体年龄关系',
        ['一定是哥哥', '一定是弟弟', '不能，需具体年龄关系'],
        '这个词没有独立给定年长或年幼关系。',
      ),
      actual(
        family,
        'review-talk',
        '换一张虚构关系卡，实际介绍与模拟分享；未做可跳过。',
      ),
    ],
    '依据官方下册第二单元教学设计完整文本制作，未渲染Word或读取学生原图。page=12只是教案引用的学生单元起点，学生用书身份继续核验。',
  ),
  draft(
    pets,
    '认识动物与介绍宠物卡',
    23,
    '理解五种动物名称，用明确的虚构角色或实际情况尝试介绍，不要求真实养宠物。',
    '知道简单的I’m和It’s表达；可由陪学者帮读动物名称。',
    [
      {
        title: '五种动物名称',
        text: 'dog狗、cat猫、fish鱼、bird鸟、rabbit兔子。本稿文字词义题不代实际看图认动物；不知道动物种类时保留未知，不仅凭叫声、笼子或颜色作确定结论。',
        activity:
          '用已有图片或自己画的卡片实际指认一个动物，尝试说英文词；不用购买或接触真实动物。',
      },
      {
        title: '角色拥有与自己拥有分开',
        text: '本站明确给定虚构角色小安有一只兔子，他可以说I have a pet. It’s a rabbit.。这不表示读题的孩子也有兔子。自己没有宠物或不想介绍实际情况，可以只扮演标为虚构的角色。',
      },
      {
        title: '介绍卡片上的动物',
        text: 'It’s a cat.可用来说明给定卡片上的动物是猫，I have a pet.在角色介绍中表达我有一只宠物。完整情境不同，不能把看过一张动物卡自动记为实际拥有宠物。',
        activity: '陪学者出一张动物卡，孩子尝试介绍；换另一张并交换角色。',
      },
      {
        title: '画卡与关爱',
        text: '可以画喜欢的动物或想象宠物，并标明是绘画或虚构。介绍已画出的动物与颜色，不要求触摸、喂养或收养动物。关爱可以表现为尊重、不追赶，不以养宠物作为完成条件。',
        activity:
          '实际画卡并向陪学者介绍；没画可跳过，不把网页答题当作完成绘画。',
      },
      {
        title: '观察与计划分开',
        text: '本课可以记录实际用了哪张卡、尝试了哪句、哪里需要帮助。下次想画另一只动物是计划，不当作今天已经画过或已经养过；自主喜好不设统一正确答案。',
      },
    ],
    [
      ...[
        ['dog', '狗'],
        ['cat', '猫'],
        ['fish', '鱼'],
        ['bird', '鸟'],
        ['rabbit', '兔子'],
      ].map(([word, meaning]) =>
        choose(
          pets,
          `word-${word}`,
          `${word}在动物情境中表示什么？`,
          required(meaning),
          ['鸟', '狗', '兔子', '猫', '鱼'],
          `${word}对应${meaning}；实际物种仍需明确观察。`,
        ),
      ),
      choose(
        pets,
        'given-rabbit',
        '题干明确虚构角色的宠物是兔子，哪句符合？',
        'It’s a rabbit.',
        ['It’s a cat.', 'It’s a rabbit.', 'It’s a fish.'],
        '按给定rabbit判断，不代表孩子真实拥有。',
      ),
      choose(
        pets,
        'have',
        'I have a pet.在角色介绍中表达什么？',
        '我有一只宠物',
        ['我有一只宠物', '我喜欢一种颜色', '这是一个教室'],
        '这是角色说明拥有宠物的表达。',
      ),
      choose(
        pets,
        'card',
        '读到虚构角色有猫，就能把自己实际拥有猫自动记为已确认吗？',
        '不能，角色与自己分开',
        ['能，读过就拥有', '不能，角色与自己分开', '每个人必须养猫'],
        '自己的实际情况不能由样例代填。',
      ),
      choose(
        pets,
        'unknown',
        '只见一个笼子，没有看见动物也没有明确说明，能确定里面是bird吗？',
        '不能，种类保持未知',
        ['能，笼子一定是鸟', '不能，种类保持未知', '不知道就填rabbit'],
        '线索可以用于猜测，但不足以确定种类。',
      ),
      choose(
        pets,
        'care',
        '完成本课必须收养一只宠物吗？',
        '不必，可用绘画或卡片',
        ['必须养宠物', '不必，可用绘画或卡片', '没有宠物不能学习'],
        '课包允许虚构卡片，不要求真实饲养。',
      ),
      actual(
        pets,
        'point',
        '实际指认一张明确动物卡，听规范示范后尝试说词；未做可跳过。',
      ),
      actual(
        pets,
        'talk',
        '用虚构角色卡实际轮换介绍与回应；不把角色拥有记为自己实际拥有。',
      ),
      actual(
        pets,
        'draw',
        '实际画一张动物卡，标明绘画或虚构，再介绍作品；没画可跳过。',
      ),
      record(
        pets,
        'today',
        '记录今天实际用了哪张卡、练过哪句、需要什么帮助；不要求透露实际宠物情况。',
      ),
      record(pets, 'plan', '另记以后想画或练什么，不把计划填作已做。'),
    ],
    [
      choose(
        pets,
        'review-fish',
        '新给定动物卡明确是鱼，哪句符合？',
        'It’s a fish.',
        ['It’s a rabbit.', 'It’s a fish.', 'It’s a bird.'],
        '按新给定fish判断。',
      ),
      choose(
        pets,
        'review-cat',
        'cat表示哪种动物？',
        '猫',
        ['狗', '鱼', '猫'],
        'cat对应猫。',
      ),
      choose(
        pets,
        'review-art',
        '画了一个想象动物，就说明已经饲养它吗？',
        '不能，绘画与实际饲养分开',
        ['已经饲养', '不能，绘画与实际饲养分开', '必须立刻饲养'],
        '创作不代替现实情况。',
      ),
      actual(
        pets,
        'review-talk',
        '换一张动物卡，实际进行一轮介绍；未做可跳过。',
      ),
    ],
    '依据官方下册第三单元教学设计完整文本制作，未渲染Word或读取学生原图。page=23仅为教案引用的学生单元起点，学生用书身份继续核验。',
  ),
  draft(
    farmNumbers,
    '数字七到十二与数量问答',
    34,
    '在one～six基础上理解seven～twelve，按明确的数量图问答，区别样例数量与实际观察。',
    '能逐一点数1～12，已认识one～six的对应；需要帮助可先复习。',
    [
      {
        title: '六之后继续数',
        text: 'one、two、three、four、five、six对应1～6；继续是seven=7、eight=8、nine=9、ten=10、eleven=11、twelve=12。每个标记代表一个，不把eleven的字母数当物件数量。',
        visual: { kind: 'count', count: 12 },
      },
      {
        title: '数量问句先理解',
        text: 'How many?是在问多少个。I have…在给定数量情境中可说明我有多少；不知道某种物品的英文名称时，可以指着明确对象问How many?，不要求所有动植物名称都先会说。',
        activity:
          '实际摆1～12张纸片，逐个点数后由两人轮换问数量与说词；确认只记录做过。',
      },
      {
        title: '农场词与数量分开',
        text: 'cow奶牛、egg鸡蛋是本单元词。one egg和多个eggs的表达不同；本稿词义题分别认识词，数量图使用原创圆点，不冒实际看过教材牛或鸡蛋原图。',
      },
      {
        title: '样例不是自己的实际数量',
        text: '给定原创卡有9个标记，对应nine；自己的物件要实际数。未数过不填9，也不填0；数过发现没有才是0。本课英文数字练习范围1～12，不凭样例推断自己的所有物件数。',
      },
      {
        title: '制作与换卡',
        text: '可以在纸上按1～12顺序标点，自己设计一幅简单连点画，实际连接、涂色并分享。点序号是连接顺序，不保证任何一幅未见原图一定画出某种动物；本站只记录自己的作品。',
        activity:
          '实际画、连、涂一张原创点序卡，再向陪学者介绍；未制作可跳过。',
      },
    ],
    [
      ...['seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'].map(
        (word, index) => ({
          ...choose(
            farmNumbers,
            `word-${index + 7}`,
            '逐一点数下图的标记，选对应英文词。',
            word,
            ['ten', 'seven', 'twelve', 'eight', 'eleven', 'nine'],
            `${index + 7}个对应${word}。`,
          ),
          visual: { kind: 'count' as const, count: index + 7 },
        }),
      ),
      ...['seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'].map(
        (word, index) =>
          task(
            farmNumbers,
            `meaning-${index + 7}`,
            `${word}表示几个？填写数字。`,
            { kind: 'number', value: index + 7 },
            `${word}对应${index + 7}。`,
          ),
      ),
      choose(
        farmNumbers,
        'cow',
        'cow在本单元表示什么？',
        '奶牛',
        ['奶牛', '鸡蛋', '课桌'],
        'cow是奶牛。',
      ),
      choose(
        farmNumbers,
        'egg',
        'egg在本单元表示什么？',
        '鸡蛋',
        ['橡皮', '奶牛', '鸡蛋'],
        'egg是鸡蛋，数量另需观察或给定。',
      ),
      choose(
        farmNumbers,
        'ask',
        'How many?在数量问答中是什么意思？',
        '有多少个',
        ['什么颜色', '有多少个', '我叫什么'],
        '这句用于询问数量。',
      ),
      choose(
        farmNumbers,
        'unknown',
        '未数自己的纸片，可以直接把样例nine记为自己有9张吗？',
        '不能，先实际数',
        ['能，样例就是自己的', '不能，先实际数', '未知自动记0'],
        '未知和样例数量、0分别处理。',
      ),
      actual(
        farmNumbers,
        'say',
        '听规范示范后实际尝试seven～twelve中的词；未练可跳过，不自动评全会。',
      ),
      actual(
        farmNumbers,
        'count',
        '实际用自己的纸片逐一点数，与陪学者轮换问数量和回答；未数可跳过。',
      ),
      actual(
        farmNumbers,
        'draw',
        '实际设计一张1～12点序画、连线涂色并介绍；没有做可跳过。',
      ),
      record(
        farmNumbers,
        'today',
        '记录实际点数、听说、绘画与需要的帮助；未数对象保持未知。',
      ),
      record(farmNumbers, 'plan', '另记未来练习安排，不当作已完成。'),
    ],
    [
      ...[12, 8, 11, 7, 10, 9].map((count) => ({
        ...choose(
          farmNumbers,
          `review-${count}`,
          '复习：先数本次标记，再选词。',
          required(
            ['seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'][count - 7],
          ),
          ['nine', 'twelve', 'seven', 'eleven', 'eight', 'ten'],
          `${count}个按本次图选择对应数字词。`,
        ),
        visual: { kind: 'count' as const, count },
      })),
      actual(
        farmNumbers,
        'review-talk',
        '换一组实际纸片，重新点数并轮换问答；未做可跳过。',
      ),
    ],
    '依据官方下册第四单元教学设计完整文本制作，未渲染Word或读取学生原图。page=34仅为教案引用的学生单元起点，圆点为原创数量表示，学生用书身份继续核验。',
  ),
  draft(
    farmTime,
    '理解整点与活动提议',
    34,
    '用数字词理解整点表达，区别钟面、给定活动、实际作息与计划。',
    '认识1～12和整点钟面；数字词不熟悉可先复习数量课。',
    [
      {
        title: '整点看两根针',
        text: '整点时长分针指12，短时针指相应的小时数。原创示例短针指4、长针指12，是4点；英文可表达It’s four o’clock.。本课只用整点，不扩教半点或分钟。',
        visual: { kind: 'clock', hour: 4, minute: 0 },
      },
      {
        title: '数量与时间不同',
        text: 'four表示4这个数；four o’clock表达4点，不是4个物件。没有日期或上午下午信息的12小时钟面，不能独自判定是上午还是下午，也不能把12点自动认定只有中午。',
      },
      {
        title: '活动由明确情境给出',
        text: 'Time to…可在给定情境里提示到做某事的时间。原创计划卡明确8点开始数卡片，就按该卡安排；钟面本身不能证明所有孩子8点都要做同一件事，也不能证明活动已经完成。',
      },
      {
        title: '自己的作息另记',
        text: '可以与陪学者在纸上画一个整点钟面，再写一个适合自己的活动。日常起床、吃饭和学习不强制与样例相同；计划、现在显示的时间、实际做过的活动分别记录。',
        activity:
          '实际画一个整点钟面并尝试说英文时间，陪学者观察两针是否符合自己的画法。',
      },
      {
        title: '对话与完成分开',
        text: '两人用纸面计划卡轮流说一个整点和活动提议，再回应是否愿意。说出计划不等于真的完成活动，网页题答对也不确认口语或真实劳动；没做可跳过。',
        activity: '实际轮换说时间与活动提议两个角色，并记录需要帮助之处。',
      },
    ],
    [
      ...[
        [2, 'two'],
        [5, 'five'],
        [11, 'eleven'],
      ].map(([hour, word]) => ({
        ...choose(
          farmTime,
          `clock-${hour}`,
          '看原创整点钟面，哪句符合？',
          `It’s ${word} o’clock.`,
          ['It’s two o’clock.', 'It’s five o’clock.', 'It’s eleven o’clock.'],
          `长针指12、短针指${hour}，对应${word} o’clock。`,
        ),
        visual: {
          kind: 'clock' as const,
          hour: Number(hour),
          minute: 0 as const,
        },
      })),
      choose(
        farmTime,
        'meaning',
        'four o’clock在时间情境中表示什么？',
        '4点',
        ['4个物件', '4点', '4种颜色'],
        '数字加o’clock在这里表示整点时间。',
      ),
      choose(
        farmTime,
        'time-to',
        'Time to…在本课情境中有什么作用？',
        '提示到做某事的时间',
        ['介绍动物种类', '提示到做某事的时间', '证明事情已完成'],
        '提示活动时间，不自动确认完成。',
      ),
      choose(
        farmTime,
        'period',
        '只看短针指12、长针指12，没有其它信息，能确定一定是中午而非午夜吗？',
        '不能，需要时段信息',
        ['一定是中午', '一定是午夜', '不能，需要时段信息'],
        '12小时钟面本身不足以区分时段。',
      ),
      choose(
        farmTime,
        'plan',
        '纸卡写8点做活动，就能记为已完成活动吗？',
        '不能，计划与实做分开',
        ['能，写了就完成', '不能，计划与实做分开', '每人必须按样例作息'],
        '真实完成须实际进行，自己的作息也可以不同。',
      ),
      actual(
        farmTime,
        'say',
        '听规范示范后用纸面整点卡实际尝试说时间；没练可跳过。',
      ),
      actual(
        farmTime,
        'draw',
        '实际画一张整点计划卡，分别标清时间与计划活动；不确认该活动已实际完成。',
      ),
      actual(
        farmTime,
        'talk',
        '与陪学者实际轮换时间与活动提议对话；未交流可跳过。',
      ),
      record(
        farmTime,
        'today',
        '记录实际画卡与问答，哪里需要帮助；不要把计划活动填为已经完成。',
      ),
      record(
        farmTime,
        'plan-next',
        '另记下次想练的时间表达，保留与本次实际活动的区别。',
      ),
    ],
    [
      ...[
        [7, 'seven'],
        [12, 'twelve'],
      ].map(([hour, word]) => ({
        ...choose(
          farmTime,
          `review-clock-${hour}`,
          '复习：看新整点钟面选择对应表达。',
          `It’s ${word} o’clock.`,
          ['It’s twelve o’clock.', 'It’s seven o’clock.', 'It’s four o’clock.'],
          `本次钟面是${hour}点，不沿用旧图。`,
        ),
        visual: {
          kind: 'clock' as const,
          hour: Number(hour),
          minute: 0 as const,
        },
      })),
      choose(
        farmTime,
        'review-count',
        'twelve o’clock与twelve个圆点是同一类信息吗？',
        '不同，一个是时间一个是数量',
        ['完全相同', '不同，一个是时间一个是数量', '都证明活动完成'],
        '相同数字可以用于不同信息。',
      ),
      actual(
        farmTime,
        'review-talk',
        '换整点卡实际说时间并提出活动计划；不要自动确认活动做完。',
      ),
    ],
    '依据官方下册第四单元教学设计完整文本制作，未渲染Word或读取学生原图。page=34仅引用单元起点，钟面为原创实例，不据此宣称原故事逐图已完整映射。学生用书身份继续核验。',
  ),
  draft(
    room,
    '房间物品、位置与整理',
    45,
    '理解房间物品和in/on/under/behind，在明确位置条件下问答，并记录实际观察与创作。',
    '认识简单物品介绍；可以用中文说明容器里面、上面、下面和后面。',
    [
      {
        title: '物品词与位置词',
        text: 'living room客厅、table桌子、sofa沙发、bed床、room房间、water bottle水壶或水瓶。位置词in在里面、on在上面、under在下面、behind在后面。一个物品可以在不同时间放到不同位置，名称不决定位置。',
      },
      {
        title: '问在哪里与检查猜测',
        text: 'Where is…?用于询问位置；It’s…说明位置。原创条件明确“书在盒子里面”，用in；“书放在桌面上”，用on。Is it…?可以检查位置猜测，不是猜了就确定在那个位置。',
      },
      {
        title: '给定条件按对象理解',
        text: '原创条件“水壶在床下面”用under，“书包在门后面”用behind。屏幕上的上下排列不是房间里的实际上下关系；本稿文字位置题没有展示学生原图，不说已经看图找到了原教材物品。',
      },
      {
        title: '先实际观察再介绍',
        text: '自己的书在哪里需实际观察；没有看过时不自动填样例的位置，也不说物品一定不存在。可用纸盒、物品卡或绘画模拟，不要求上传住址或真实房间照片。',
        activity:
          '用现有纸盒或画卡实际摆一个明确位置，陪学者和孩子轮换问答，再换位置重新说明。',
      },
      {
        title: '设计空间与真实整理分开',
        text: '可以画梦想房间并标明是设计，再描述一件物品位置；画了整齐的房间不等于现实已收拾。真实整理任选适合自己的桌面任务，在陪学者指导下实际做，未做可跳过。',
        activity: '实际画一张标明设计的空间卡并介绍；真实整理与绘画另行记录。',
      },
    ],
    [
      ...[
        ['living room', '客厅'],
        ['table', '桌子'],
        ['sofa', '沙发'],
        ['bed', '床'],
        ['room', '房间'],
        ['water bottle', '水壶或水瓶'],
        ['in', '在里面'],
        ['on', '在上面'],
        ['under', '在下面'],
        ['behind', '在后面'],
      ].map(([word, meaning]) =>
        choose(
          room,
          `word-${word?.replaceAll(' ', '-')}`,
          `${word}在本课位置情境中表示什么？`,
          required(meaning),
          [
            '在后面',
            '床',
            '桌子',
            '客厅',
            '在里面',
            '沙发',
            '在下面',
            '水壶或水瓶',
            '房间',
            '在上面',
          ],
          `${word}对应${meaning}，物品名称与位置条件分清。`,
        ),
      ),
      choose(
        room,
        'ask',
        'Where is…?在本课有什么作用？',
        '询问在哪里',
        ['询问颜色', '询问在哪里', '说明已收拾完'],
        '这句用于询问位置。',
      ),
      choose(
        room,
        'inside',
        '明确条件是“书在盒子里面”，对应哪个位置词？',
        'in',
        ['on', 'in', 'behind'],
        'in说明在容器里面，不是桌面上。',
      ),
      choose(
        room,
        'under',
        '明确条件是“水壶在床下面”，对应哪个位置词？',
        'under',
        ['under', 'on', 'in'],
        'under说明在下面。',
      ),
      choose(
        room,
        'behind',
        '明确条件是“书包在门后面”，对应哪个位置词？',
        'behind',
        ['in', 'on', 'behind'],
        'behind说明在后面。',
      ),
      choose(
        room,
        'unknown',
        '没有看过自己的书，也没有位置说明，能自动填in吗？',
        '不能，位置保持未知',
        ['能，所有书都在里面', '不能，位置保持未知', '不知道就是没有这本书'],
        '未知位置不等于某个位置，也不证明物品不存在。',
      ),
      actual(
        room,
        'place',
        '实际用物品卡或纸盒摆出一个明确位置，并轮换问答；不把卡片位置填为自己真实房间情况。',
      ),
      actual(
        room,
        'draw',
        '实际画一张标为设计的房间卡，说明至少一件物品的位置；未画可跳过。',
      ),
      actual(
        room,
        'tidy',
        '在陪学者指导下实际整理一个适合的桌面区域，再观察结果；只绘画或模拟不确认真实整理。',
      ),
      record(
        room,
        'today',
        '分别记录实际摆卡、问答、设计和真实整理，未观察的位置保持未知；无需填住址。',
      ),
      record(room, 'plan', '另记以后想怎样摆放或整理，不当作本次已经做过。'),
    ],
    [
      choose(
        room,
        'review-on',
        '新条件明确“书放在桌面上”，位置词是哪一个？',
        'on',
        ['under', 'on', 'in'],
        '新条件为桌面上，不沿用里面的in。',
      ),
      choose(
        room,
        'review-check',
        'Is it under the bed?只是一个位置猜测，就能确认水壶在床下吗？',
        '不能，需观察或明确回应',
        ['能，问了就在那里', '不能，需观察或明确回应', '必须填under'],
        '检查猜测与确认事实不同。',
      ),
      choose(
        room,
        'review-art',
        '画了整齐的梦想房间，就说明真实房间已经整理好吗？',
        '不能，设计与实际整理分开',
        ['已经整理好', '不能，设计与实际整理分开', '绘画自动完成劳动'],
        '真实完成须实际进行。',
      ),
      actual(
        room,
        'review-talk',
        '换一个纸卡位置，实际重新问答与介绍；未做可跳过。',
      ),
    ],
    '依据官方下册第五单元教学设计完整文本制作，未渲染Word或读取学生原图。page=45仅为教案引用的学生单元起点，学生用书身份继续核验。',
  ),
  draft(
    colourProject,
    '颜色实验与编号创作',
    32,
    '先预测再观察颜料变化，完整读取五色图例，换图例后重新判断，并介绍实际完成的作品。',
    '认识1～5及red、blue、yellow、green、orange；可由陪学者帮读，不要求写单词。',
    [
      {
        title: '预测不是观察结果',
        text: '教案第三课时探索蓝与黄、红与黄、红与蓝的颜料混合，介绍green、orange与补充词purple。先说自己猜会怎样，再实际观察；颜料种类和比例会影响结果，不给所有实际混色指定同一个必答色调。没有材料可以跳过，不把屏幕上的颜色当实物实验。',
        activity:
          '先记录一个预测；有适合儿童的现有颜料和陪学条件，再实际混一种组合。未实验保持未知。',
      },
      {
        title: '用给定记录练介绍',
        text: '本站虚构记录A：混蓝与黄后观察到绿色，可以说It’s green.。虚构记录B：混红与黄后观察到橙色，可以说It’s orange.。这两条记录用于练表达，不是你的实测结果；实际实验没有发生时，不能据此确认完成。',
      },
      {
        title: '逐项读完五色图例',
        text: '本站原创图例甲：1=red、2=green、3=blue、4=yellow、5=orange。每个数字只是这次的编号。逐项找到对应词，也能从词找回编号，再在纸上画五个编号区域；这是本站创作，不是学生书第33页的原图或原图例。',
        activity:
          '实际按甲图例给自己画的编号区域涂色，记录已涂的范围；缺少工具时完成能做的部分即可。',
      },
      {
        title: '换图例就重新核对',
        text: '复习换用原创图例乙：1=yellow、2=blue、3=orange、4=red、5=green。同样的编号这次可能表示不同颜色，不能照旧答案涂；同一种颜色也可能换了编号。先读当前图例，再做问答。',
      },
      {
        title: '介绍自己的实际作品',
        text: '陪学者指向你实际完成的区域，问What’s the colour?，你尝试用It’s…回应，再交换角色。喜欢什么可以用I like…表达，个人喜好没有统一答案。不确定颜色时请对方帮助说明；纸面作画、实际交流和以后想做的事分开记录。',
        activity:
          '实际指向自己画涂的作品交流，再用原话记录看到的颜色与需要的帮助；没有画或没有交流可分别跳过。',
      },
    ],
    [
      choose(
        colourProject,
        'observed-green',
        '虚构记录A明确观察到绿色，哪句描述符合记录？',
        'It’s green.',
        ['It’s red.', 'It’s green.', 'It’s orange.'],
        '按给定观察记录介绍，不把这条虚构记录当自己的实测。',
      ),
      choose(
        colourProject,
        'observed-orange',
        '虚构记录B明确观察到橙色，哪句描述符合记录？',
        'It’s orange.',
        ['It’s blue.', 'It’s yellow.', 'It’s orange.'],
        'orange对应橙色；这不是孩子已完成实验的证明。',
      ),
      choose(
        colourProject,
        'unperformed',
        '只猜了混色结果，还没混颜料，实际结果应怎样记？',
        '尚未观察',
        ['一定成功变绿', '尚未观察', '实验已完成'],
        '预测与观察分开，未实验不代填结果。',
      ),
      ...['red', 'green', 'blue', 'yellow', 'orange'].map((word, index) =>
        choose(
          colourProject,
          `key-${index + 1}`,
          `原创图例甲：1=red、2=green、3=blue、4=yellow、5=orange。编号${index + 1}对应哪个词？`,
          word,
          ['yellow', 'red', 'orange', 'blue', 'green'],
          '依据甲图例逐项对应，不背永久颜色编号。',
        ),
      ),
      ...['red', 'green', 'blue', 'yellow', 'orange'].map((word, index) =>
        task(
          colourProject,
          `reverse-${word}`,
          `同一份原创甲图例：1=red、2=green、3=blue、4=yellow、5=orange。${word}对应编号几？`,
          { kind: 'number', value: index + 1 },
          '从词找回本次图例编号；数字不是颜色本身。',
        ),
      ),
      actual(
        colourProject,
        'mix',
        '有材料与陪学条件时，先预测再实际混一种颜料，观察结果；没有做可跳过，不以虚构记录代做。',
      ),
      actual(
        colourProject,
        'paint',
        '实际画编号区域并按甲图例涂色；只确认自己做过的部分，未做可跳过。',
      ),
      actual(
        colourProject,
        'talk',
        '指向自己实际完成的区域，与陪学者互换问答角色，介绍颜色并表达喜好；未交流可跳过。',
      ),
      record(
        colourProject,
        'observations',
        '分别记录混色前的预测、实际结果或尚未实验、已涂哪些区域、交流与帮助。不要把预测抄为实测。',
      ),
      record(
        colourProject,
        'plan',
        '另记下次想尝试的组合或作品；以后计划不计为本次已做。',
      ),
    ],
    [
      ...['yellow', 'blue', 'orange', 'red', 'green'].map((word, index) =>
        choose(
          colourProject,
          `review-key-${index + 1}`,
          `换用原创图例乙：1=yellow、2=blue、3=orange、4=red、5=green。编号${index + 1}现在对应哪个词？`,
          word,
          ['red', 'orange', 'green', 'yellow', 'blue'],
          '重新读乙图例，不沿用甲图例的编号。',
        ),
      ),
      choose(
        colourProject,
        'review-prediction',
        '先猜会变成橙色，实际观察到另一种色调，应保留哪种记录？',
        '预测和实际结果分别记录',
        ['把实际结果改成橙色', '预测和实际结果分别记录', '没猜对就不记实验'],
        '尊重实际观察，不能为符合预期而改写记录。',
      ),
      actual(
        colourProject,
        'review-talk',
        '换用乙图例实际做一次新的作品问答；未制作或未交流可跳过，不自动沿用主课确认。',
      ),
      record(
        colourProject,
        'review-record',
        '记录换图例后实际重新核对了什么、是否做了新作品与交流；未做的事项保持未做。',
      ),
    ],
    '依据官方上册第三单元教学设计第三课时完整文本制作，未渲染Word或读取学生原图。page=32是教案引用的活动页，教案还引用33页数字涂色，但未给完整原图例；本站甲乙图例与虚构观察记录均为原创，不冒充原书。',
  ),
  draft(
    roomProject,
    '换位置再问答',
    53,
    '按三套独立的原创位置条件理解in/on/under/behind，核对位置猜测，实际轮换问答并区别设计与实做。',
    '先学习房间物品、位置与整理；认识book、schoolbag、water bottle，允许陪学者用中文读位置条件。',
    [
      {
        title: '先看完整的位置条件',
        text: '本课三套位置卡都是本站原创文字情境，不是教材原图。甲卡：book书在schoolbag书包里面；water bottle水瓶在bed床下面；schoolbag书包在door门后面；颜色卡在desk课桌面上。in在里面，on在上面，under在下面，behind在后面。先确定问的是哪件物品，再找它的位置。',
      },
      {
        title: '询问位置与检查猜测',
        text: 'Where is the book?询问书的位置。甲卡可以答It’s in the schoolbag.。Is it on the desk?是检查“在桌面上”这个猜测；甲卡有书在包里的明确条件，因此这个猜测不对。仅仅说No, it’s not there.没有给出具体位置，还需继续问或观察。',
      },
      {
        title: '移动后重新判断',
        text: '乙卡表示新的位置，不是甲卡的重复：书放到课桌面上；水瓶放入书包；书包放到课桌下面；颜色卡放到门后面。同一件物品位置变了，答案要随新条件改变。题目只说移动后的乙卡时，不用甲卡回答。',
        activity:
          '实际用安全的纸卡和盒子模拟一次移动，移动前后各问一次位置；屏幕读卡不算已经实做。',
      },
      {
        title: '换角色再问一次',
        text: '一人提问，另一人先查看本次位置再回答，再交换角色。没看过自己的物品时，位置保持未知；不知道不等于物品不存在，也不能拿位置卡当真实房间情况。本课没有录音，点击正确不代表发音已经合格。',
        activity:
          '实际轮换问答，可以借助中文说明；未做或没有同伴可以跳过，不需要上传照片。',
      },
      {
        title: '设计、模拟与真实整理分开',
        text: '可以画自己的梦想空间并描述物品位置，标明这是设计。画卡或模拟摆卡没有证明真实房间已经收拾。真实整理和未来计划分别记录，不要求孩子提供家庭地址或所有房间都有同样家具。',
        activity:
          '实际画一张位置设计卡并介绍至少一件物品；若只计划还未画，不确认绘画已完成。',
      },
    ],
    [
      ...[
        [
          'a-book',
          '甲卡：书在书包里面。Where is the book?选本卡的位置词。',
          'in',
        ],
        [
          'a-bottle',
          '甲卡：水瓶在床下面。Where is the water bottle?选本卡的位置词。',
          'under',
        ],
        [
          'a-bag',
          '甲卡：书包在门后面。Where is the schoolbag?选本卡的位置词。',
          'behind',
        ],
        ['a-card', '甲卡：颜色卡在课桌面上。选择这张卡的位置词。', 'on'],
        [
          'b-book',
          '换为乙卡：书现在在课桌面上。Where is the book?选新位置词。',
          'on',
        ],
        [
          'b-bottle',
          '换为乙卡：水瓶现在在书包里面。Where is the water bottle?选新位置词。',
          'in',
        ],
        [
          'b-bag',
          '换为乙卡：书包现在在课桌下面。Where is the schoolbag?选新位置词。',
          'under',
        ],
        [
          'b-card',
          '换为乙卡：颜色卡现在在门后面。选择这张卡的新位置词。',
          'behind',
        ],
      ].map(([suffix, prompt, answer]) =>
        choose(
          roomProject,
          required(suffix),
          required(prompt),
          required(answer),
          ['in', 'on', 'under', 'behind'],
          '先核对当前卡片、提问对象和明确的位置条件；同一物品的旧位置不能代替新位置。',
        ),
      ),
      choose(
        roomProject,
        'full-reply',
        '乙卡明确书在桌面上。Where is the book?哪句回答符合乙卡？',
        'It’s on the desk.',
        ['It’s in the schoolbag.', 'It’s on the desk.', 'It’s under the bed.'],
        '乙卡的书在桌面上，用on the desk；不是甲卡的in the schoolbag。',
      ),
      choose(
        roomProject,
        'check',
        '甲卡明确书在包里面。Is it on the desk?这个位置猜测对吗？',
        'No, it’s not there.',
        ['Yes.', 'No, it’s not there.', '问了就一定在桌面上'],
        '甲卡已明确书在包里面，不能因为问了on the desk就改变事实。',
      ),
      choose(
        roomProject,
        'negative',
        '只有No, it’s not there.，没有其他位置条件。能确定物品在床下面吗？',
        '不能，还需新的位置条件',
        [
          '能，一定用under',
          '不能，还需新的位置条件',
          '能，所有不在桌上的东西都在床下',
        ],
        '排除一个位置不能自动确定另一个位置，也不证明物品不存在。',
      ),
      choose(
        roomProject,
        'design',
        '画了一张整齐的梦想房间卡，哪项记录符合事实？',
        '完成了设计，真实整理另核',
        [
          '真实房间自动已整理',
          '完成了设计，真实整理另核',
          '所有物品真实位置都是图上的位置',
        ],
        '设计、纸卡模拟与真实整理是不同活动。',
      ),
      actual(
        roomProject,
        'move',
        '实际用纸卡与盒子模拟一次物品位置变化，移动前后各说明位置；没摆可跳过。',
      ),
      actual(
        roomProject,
        'dialogue',
        '和陪学者实际轮换Where is…?问答，再用Is it…?检查猜测；仅答屏幕题不确认口语已做。',
      ),
      actual(
        roomProject,
        'draw',
        '实际画一张注明“设计”的位置卡，并介绍至少一件物品；未画可跳过。',
      ),
      record(
        roomProject,
        'today',
        '分别记录已做的移动、轮换问答和绘画，没做或没观察就如实写；不填写住址或照片。',
      ),
      record(
        roomProject,
        'plan',
        '另写下一次想试的新位置或真实整理安排，不把计划记为今天已做。',
      ),
    ],
    [
      ...[
        [
          'book',
          '丙卡新条件：书在课桌下面。选择book的位置词，不沿用乙卡。',
          'under',
        ],
        [
          'bottle',
          '丙卡新条件：水瓶在门后面。选择water bottle的位置词，不沿用乙卡。',
          'behind',
        ],
        [
          'bag',
          '丙卡新条件：书包在椅子座面上。选择schoolbag的位置词，不沿用乙卡。',
          'on',
        ],
        [
          'card',
          '丙卡新条件：颜色卡在书包里面。选择卡片的位置词，不沿用乙卡。',
          'in',
        ],
      ].map(([suffix, prompt, answer]) =>
        choose(
          roomProject,
          `review-${suffix}`,
          required(prompt),
          required(answer),
          ['behind', 'under', 'in', 'on'],
          '丙卡提供了新的明确位置，每项都与乙卡不同；按本次对象和条件重新回答。',
        ),
      ),
      choose(
        roomProject,
        'review-unknown',
        '只知道书不在课桌上，其他位置没有观察。现在怎么记录？',
        '具体位置仍未知，继续核对',
        ['一定在书包里', '具体位置仍未知，继续核对', '这本书不存在'],
        '没有确认其他位置时，否定一个猜测不足以确定位置。',
      ),
      actual(
        roomProject,
        'review-talk',
        '实际换一张新位置卡并交换角色问答；未做可以跳过，点击正确不评价发音。',
      ),
      record(
        roomProject,
        'review-reflection',
        '记录本次用了什么新的位置条件，以及真实问答是否做过；想做的另写计划。',
      ),
    ],
    '依据官方下册第五单元教学设计第三课时的询问位置、轮换交流和设计活动制作。page=53是教案引用的练习页，未渲染Word或读取学生原图；甲乙丙位置条件为本站原创，不照搬故事和原图答案。学生用书身份继续核验。',
  ),
];
