import type { LangKey } from "./languages";

export interface Verse {
  n: number;
  t: string;
}

export interface Point {
  title: string;
  teaser: string;
  body: string[];
}

export interface ChapterContent {
  verses: Verse[];
  points: Point[];
}

// Bundled seed data: Genesis 1, all four versions, works fully offline with
// no AI key configured. Every other chapter is generated on demand (see
// lib/ai.ts) and cached — this is the one chapter shipped in the app itself
// so the app is usable the moment it's installed.
export const GENESIS_1: Record<LangKey, ChapterContent> = {
  en: {
    verses: [
      { n: 1, t: "In the beginning God created the heaven and the earth." },
      { n: 2, t: "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters." },
      { n: 3, t: "And God said, Let there be light: and there was light." },
      { n: 4, t: "And God saw the light, that it was good: and God divided the light from the darkness." },
      { n: 5, t: "And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day." },
    ],
    points: [
      {
        title: "Light Before the Sun",
        teaser: "Light appears on day one, but the sun and stars aren't made until day four.",
        body: [
          "The text separates <b>light</b> from any single light source. Day and night begin on day one; the sun, moon and stars are placed on day four to \"govern\" a rhythm that already exists.",
          "Read this way, the sun isn't the origin of light — it's a caretaker assigned to a pattern God already set. The point isn't astronomy; it's that light and order come from God's word, not from the objects that later carry them.",
        ],
      },
      {
        title: "Order From Chaos",
        teaser: "Each day works by dividing: light from dark, sky from sea, land from water.",
        body: [
          "Days one through three each perform a <b>separation</b> — light/dark, waters above/below, sea/dry land. Days four through six then fill each space with light-bearers, creatures, and people.",
          "The structure itself is the message: creation moves from formless and empty toward ordered and full. It's less a timeline to defend and more a pattern of how chaos becomes a livable home.",
        ],
      },
      {
        title: "Blessed to Multiply",
        teaser: "Sea and sky creatures are the first living things to receive a blessing.",
        body: [
          "Verse 22 is the first blessing in the Bible, and it lands on fish and birds before it lands on any human: \"be fruitful, and multiply.\"",
          "Blessing here means capacity, not just approval — the ability to keep creation going. It sets up a pattern the text repeats for animals, then for humans, then for the whole seventh day.",
        ],
      },
      {
        title: "Made in God's Image",
        teaser: "Humanity is described as a reflection of God, given care over the earth.",
        body: [
          "\"Image\" in the ancient world often described a king's statue placed in a territory to represent his rule. Genesis extends that role to every human, not just royalty.",
          "Dominion, in that light, reads as representative care rather than exploitation — humans are placed in creation the way a trusted steward is placed in a household, answerable for how it's kept.",
        ],
      },
      {
        title: "“Very Good”",
        teaser: "God's six-day review upgrades from \"good\" to \"very good\" only once everything exists together.",
        body: [
          "Six times across the chapter God evaluates the work as \"good.\" Only once, after humanity joins the rest of creation on day six, does the verdict become <b>very good</b>.",
          "The upgrade suggests the completed system — not any single piece — is what earns the fuller praise. Goodness, here, is relational: everything in right relation to everything else.",
        ],
      },
    ],
  },
  web: {
    verses: [
      { n: 1, t: "In the beginning, God created the heavens and the earth." },
      { n: 2, t: "The earth was formless and empty. Darkness was on the surface of the deep and God's Spirit was hovering over the surface of the waters." },
      { n: 3, t: "God said, \"Let there be light,\" and there was light." },
      { n: 4, t: "God saw the light, and saw that it was good. God divided the light from the darkness." },
      { n: 5, t: "God called the light \"day\", and the darkness he called \"night\". There was evening and there was morning, the first day." },
    ],
    points: [
      {
        title: "Light Before the Sun",
        teaser: "Light appears on day one, but the sun and stars aren't made until day four.",
        body: [
          "The text separates <b>light</b> from any single light source. Day and night begin on day one; the sun, moon and stars are placed on day four to \"govern\" a rhythm that already exists.",
          "Read this way, the sun isn't the origin of light — it's a caretaker assigned to a pattern God already set. The point isn't astronomy; it's that light and order come from God's word, not from the objects that later carry them.",
        ],
      },
      {
        title: "Order From Chaos",
        teaser: "Each day works by dividing: light from dark, sky from sea, land from water.",
        body: [
          "Days one through three each perform a <b>separation</b> — light/dark, waters above/below, sea/dry land. Days four through six then fill each space with light-bearers, creatures, and people.",
          "The structure itself is the message: creation moves from formless and empty toward ordered and full. It's less a timeline to defend and more a pattern of how chaos becomes a livable home.",
        ],
      },
      {
        title: "Blessed to Multiply",
        teaser: "Sea and sky creatures are the first living things to receive a blessing.",
        body: [
          "Verse 22 is the first blessing in the Bible, and it lands on fish and birds before it lands on any human: \"be fruitful, and multiply.\"",
          "Blessing here means capacity, not just approval — the ability to keep creation going. It sets up a pattern the text repeats for animals, then for humans, then for the whole seventh day.",
        ],
      },
      {
        title: "Made in God's Image",
        teaser: "Humanity is described as a reflection of God, given care over the earth.",
        body: [
          "\"Image\" in the ancient world often described a king's statue placed in a territory to represent his rule. Genesis extends that role to every human, not just royalty.",
          "Dominion, in that light, reads as representative care rather than exploitation — humans are placed in creation the way a trusted steward is placed in a household, answerable for how it's kept.",
        ],
      },
      {
        title: "“Very Good”",
        teaser: "God's six-day review upgrades from \"good\" to \"very good\" only once everything exists together.",
        body: [
          "Six times across the chapter God evaluates the work as \"good.\" Only once, after humanity joins the rest of creation on day six, does the verdict become <b>very good</b>.",
          "The upgrade suggests the completed system — not any single piece — is what earns the fuller praise. Goodness, here, is relational: everything in right relation to everything else.",
        ],
      },
    ],
  },
  "zh-hant": {
    verses: [
      { n: 1, t: "起初，神創造天地。" },
      { n: 2, t: "地是空虛混沌，淵面黑暗；神的靈運行在水面上。" },
      { n: 3, t: "神說：「要有光」，就有了光。" },
      { n: 4, t: "神看光是好的，就把光暗分開了。" },
      { n: 5, t: "神稱光為「晝」，稱暗為「夜」。有晚上，有早晨，這是頭一日。" },
    ],
    points: [
      {
        title: "光先於日頭",
        teaser: "光在第一日出現，但太陽、月亮和星星要到第四日才被造。",
        body: [
          "經文把「光」和任何單一光源分開來講。第一日就有了晝夜之分；到第四日，太陽、月亮、星辰才被安放，用來「管理」一個早已存在的節律。",
          "這樣讀來，太陽並不是光的源頭，而是被指派去看管一個神已經設立好的規律的「管理者」。重點不在天文學，而在於光與秩序都出於神的話語，而非出於日後承載它們的那些天體。",
        ],
      },
      {
        title: "從混沌到秩序",
        teaser: "每一日的工作都在「分開」：光暗分開，天海分開，陸地水域分開。",
        body: [
          "第一日到第三日，每一日都完成一次「分開」——光暗、上下之水、海與旱地。第四日到第六日，則把光體、生物和人分別安置在這些空間裡。",
          "這個結構本身就是信息：創造從空虛混沌走向有序豐盈。這不只是一份需要辯護的時間表，更是一個混沌如何變成宜居之地的模式。",
        ],
      },
      {
        title: "蒙福繁衍",
        teaser: "海中和空中的活物，是最早領受祝福的受造物。",
        body: [
          "第 22 節是聖經中第一次的祝福，而領受者是魚和鳥，還在人類之前：「要生養眾多」。",
          "這裡的「祝福」意味著能力，而不僅是認可——是讓創造得以延續下去的能力。這也為後面動物、人類，以至第七日所重複的模式立下先例。",
        ],
      },
      {
        title: "按神的形像所造",
        teaser: "人被描述為神的映照，並被賦予看管大地的責任。",
        body: [
          "在古代世界，「形像」常指立在某片土地上、代表君王統治的雕像。創世記把這個角色擴展到每一個人身上，而不只是君王。",
          "照這樣理解，「管理」更像是代表性的看顧，而不是掠奪——人被安置在創造之中，如同一位受託的管家被安置在一個家中，要為如何看管它負責。",
        ],
      },
      {
        title: "「甚好」",
        teaser: "神在六日的檢視中，只有在萬物齊備之後，評價才從「好」升級為「甚好」。",
        body: [
          "在這一章裡，神六次稱所做的為「好」。只有在第六日，人加入了其餘受造之物的行列之後，評價才升級為「甚好」。",
          "這個升級似乎在說：真正配得更高稱許的，是整個完成了的系統，而不是任何單一的部分。在這裡，「好」是關係性的——萬物彼此之間處於正確的關係。",
        ],
      },
    ],
  },
  "zh-hans": {
    verses: [
      { n: 1, t: "起初，神创造天地。" },
      { n: 2, t: "地是空虚混沌，渊面黑暗；神的灵运行在水面上。" },
      { n: 3, t: "神说：「要有光」，就有了光。" },
      { n: 4, t: "神看光是好的，就把光暗分开了。" },
      { n: 5, t: "神称光为「昼」，称暗为「夜」。有晚上，有早晨，这是头一日。" },
    ],
    points: [
      {
        title: "光先于日头",
        teaser: "光在第一日出现，但太阳、月亮和星星要到第四日才被造。",
        body: [
          "经文把「光」和任何单一光源分开来讲。第一日就有了昼夜之分；到第四日，太阳、月亮、星辰才被安放，用来“管理”一个早已存在的节律。",
          "这样读来，太阳并不是光的源头，而是被指派去看管一个神已经设立好的规律的“管理者”。重点不在天文学，而在于光与秩序都出于神的话语，而非出于日后承载它们的那些天体。",
        ],
      },
      {
        title: "从混沌到秩序",
        teaser: "每一日的工作都在“分开”：光暗分开，天海分开，陆地水域分开。",
        body: [
          "第一日到第三日，每一日都完成一次“分开”——光暗、上下之水、海与旱地。第四日到第六日，则把光体、生物和人分别安置在这些空间里。",
          "这个结构本身就是信息：创造从空虚混沌走向有序丰盈。这不只是一份需要辩护的时间表，更是一个混沌如何变成宜居之地的模式。",
        ],
      },
      {
        title: "蒙福繁衍",
        teaser: "海中和空中的活物，是最早领受祝福的受造物。",
        body: [
          "第 22 节是圣经中第一次的祝福，而领受者是鱼和鸟，还在人类之前：“要生养众多”。",
          "这里的“祝福”意味着能力，而不仅是认可——是让创造得以延续下去的能力。这也为后面动物、人类，以至第七日所重复的模式立下先例。",
        ],
      },
      {
        title: "按神的形象所造",
        teaser: "人被描述为神的映照，并被赋予看管大地的责任。",
        body: [
          "在古代世界，“形象”常指立在某片土地上、代表君王统治的雕像。创世记把这个角色扩展到每一个人身上，而不只是君王。",
          "照这样理解，“管理”更像是代表性的看顾，而不是掠夺——人被安置在创造之中，如同一位受托的管家被安置在一个家中，要为如何看管它负责。",
        ],
      },
      {
        title: "“甚好”",
        teaser: "神在六日的检视中，只有在万物齐备之后，评价才从“好”升级为“甚好”。",
        body: [
          "在这一章里，神六次称所做的为“好”。只有在第六日，人加入了其余受造之物的行列之后，评价才升级为“甚好”。",
          "这个升级似乎在说：真正配得更高称许的，是整个完成了的系统，而不是任何单一的部分。在这里，“好”是关系性的——万物彼此之间处于正确的关系。",
        ],
      },
    ],
  },
};
