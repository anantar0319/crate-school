/* Book: Sound Box (English phonics, UKG). Content only — see books/_template.js
 *
 * The word-family lists are copied from Manreet's school workbook (the "Revision"
 * pages for a, e, i, o and u, and the 'ch' / 'sh' sound pages). They are kept
 * word-for-word on the "Read aloud" pages so that what she reads here is exactly
 * what she is tested on at school.
 *
 * A few workbook words are read-aloud only and are left out of the games and
 * quizzes, because they are not words a five-year-old can use: see SKIP below.
 */
(function(){
const CS = window.CS;

/* ---------- the workbook's word families, word for word ---------- */
const FAMS = {
  a:[["ad", "dad lad mad pad sad"], ["ag", "bag rag tag wag"], ["am", "dam ham jam ram yam"],
     ["an", "can fan man pan ran van"], ["ap", "cap lap map nap tap"], ["at", "bat cat fat hat mat rat"]],
  e:[["ed", "bed fed led ted"], ["eg", "beg leg keg peg"], ["en", "den hen men pen ten"],
     ["et", "jet met net pet wet"]],
  i:[["ib", "bib nib rib"], ["id", "hid kid lid mid"], ["ig", "big dig fig wig"],
     ["in", "bin fin pin tin"], ["ip", "dip rip sip zip"], ["it", "bit fit hit kit"]],
  o:[["ob", "cob job rob sob"], ["od", "cod god pod rod"], ["og", "dog fog jog log"],
     ["op", "cop hop mop top"], ["ot", "cot dot not pot"], ["ox", "box fox ox"], ["oy", "boy coy joy toy"]],
  u:[["ub", "cub rub tub"], ["ug", "bug jug mug rug"], ["um", "gum mum sum yum"],
     ["un", "bun fun nun run sun"], ["ut", "but cut hut nut"], ["up", "pup up cup"]]
};
/* read-aloud only: too rare, too grown-up, or not really a word on its own */
const SKIP = new Set(["lad", "pad", "dam", "ted", "keg", "beg", "led", "fed", "met", "mid", "hid",
  "bit", "rob", "god", "cod", "coy", "nun", "rub", "but", "not", "fat", "mad", "ran", "wag", "rag", "lap"]);

const fams = v => FAMS[v].map(([end, ws]) => ({end, words:ws.split(" ")}));
const famsPlay = v => fams(v).map(f => ({end:f.end, words:f.words.filter(w => !SKIP.has(w))})).filter(f => f.words.length > 1);
const allWords = v => [].concat.apply([], fams(v).map(f => f.words));
const playWords = v => allWords(v).filter(w => !SKIP.has(w));

/* ---------- pictures ----------
 * One emoji per word, and never the same emoji for two different words, so a
 * picture question always has exactly one right answer. Words with no honest
 * emoji (fat, top, mat, lid...) still appear in reading, sorting and popping —
 * they just never turn up as a picture. */
const PIC = {
  /* a */ dad:"🧔", sad:"😢", bag:"🎒", tag:"🏷️", ham:"🍖", jam:"🍯", ram:"🐏", yam:"🍠",
  fan:"🌀", man:"👨", pan:"🍳", van:"🚐", cap:"🧢", map:"🗺️", nap:"😴", tap:"🚰",
  bat:"🦇", cat:"🐱", hat:"🎩", rat:"🐀",
  /* e */ bed:"🛏️", leg:"🦵", peg:"📎", den:"🕳️", hen:"🐔", men:"👬", pen:"🖊️", ten:"🔟",
  jet:"✈️", net:"🥅", pet:"🐩", wet:"💧",
  /* i */ bib:"🧷", nib:"🖋️", rib:"🍗", kid:"🧒", dig:"⛏️", fig:"🫐", wig:"💇", big:"🐘",
  bin:"🗑️", fin:"🐬", pin:"📌", tin:"🥫", sip:"🧃", zip:"🤐", fit:"💪", hit:"👊", kit:"🧰",
  /* o */ cob:"🌽", job:"💼", sob:"😭", pod:"🫛", rod:"🎣", dog:"🐶", fog:"🌫️", jog:"🏃", log:"🪵",
  cop:"👮", hop:"🐰", mop:"🧹", cot:"🛌", dot:"🔴", pot:"🍲", box:"📦", fox:"🦊", ox:"🐂",
  boy:"👦", joy:"😊", toy:"🧸",
  /* u */ cub:"🐻", tub:"🛁", bug:"🐛", jug:"🫙", mug:"☕", rug:"🧶", gum:"🍬", mum:"👩", sum:"➕",
  yum:"😋", bun:"🍞", fun:"🎉", run:"🏃‍♀️", sun:"☀️", cut:"✂️", hut:"🛖", nut:"🥜", pup:"🐕",
  cup:"🥤", up:"⬆️", hug:"🤗", bus:"🚌"
};
const pics = list => list.filter(w => PIC[w]).map(w => ({w, pic:PIC[w]}));
const picsOf = v => pics(playWords(v));
/* spell the word out, then blend it: "b, a, t. bat." */
const blendSay = w => w.split("").join(", ") + ". " + w + ".";
const wordCards = list => pics(list).map(o => ({big:o.w, pic:o.pic, say:blendSay(o.w)}));
/* one card per family: the ending in big letters, the whole family underneath */
const famCards = v => fams(v).map(f => ({big:"-" + f.end, sub:f.words.join("  "),
  say:f.end + ". " + f.words.join(", ") + "."}));

/* ---------- 'ch' and 'sh', from the workbook's sound pages ---------- */
const DIG = [
  {w:"shop", pic:"🏪", d:"sh"}, {w:"shirt", pic:"👕", d:"sh"}, {w:"shoes", pic:"👟", d:"sh"},
  {w:"shark", pic:"🦈", d:"sh"}, {w:"ship", pic:"🚢", d:"sh"}, {w:"shell", pic:"🐚", d:"sh"},
  {w:"sheep", pic:"🐑", d:"sh"}, {w:"fish", pic:"🐟", d:"sh"}, {w:"brush", pic:"🖌️", d:"sh"},
  {w:"dish", pic:"🍽️", d:"sh"}, {w:"shed", pic:"🏚️", d:"sh"},
  {w:"chair", pic:"🪑", d:"ch"}, {w:"child", pic:"👶", d:"ch"}, {w:"torch", pic:"🔦", d:"ch"},
  {w:"peach", pic:"🍑", d:"ch"}, {w:"chips", pic:"🍟", d:"ch"}, {w:"cheese", pic:"🧀", d:"ch"},
  {w:"chick", pic:"🐤", d:"ch"}, {w:"cherry", pic:"🍒", d:"ch"}, {w:"lunch", pic:"🍱", d:"ch"},
  {w:"church", pic:"⛪", d:"ch"}, {w:"chain", pic:"⛓️", d:"ch"}
];
/* no honest emoji, but still read and sorted */
const DIG_NOPIC = [{w:"cheek", d:"ch"}, {w:"bench", d:"ch"}, {w:"chin", d:"ch"}, {w:"shelf", d:"sh"},
  {w:"shut", d:"sh"}, {w:"wash", d:"sh"}];
const dig = d => DIG.filter(x => x.d === d);
const digAll = d => dig(d).concat(DIG_NOPIC.filter(x => x.d === d));
const digCards = d => dig(d).map(o => ({big:o.w, pic:o.pic, say:d + "... " + o.w + ". " + o.w + "."}));

const TH = [
  {w:"thumb", pic:"👍", d:"th"}, {w:"three", pic:"3️⃣", d:"th"}, {w:"teeth", pic:"🦷", d:"th"},
  {w:"thread", pic:"🧵", d:"th"}, {w:"thorn", pic:"🌹", d:"th"}, {w:"bath", pic:"🚿", d:"th"},
  {w:"whale", pic:"🐳", d:"wh"}, {w:"wheat", pic:"🌾", d:"wh"}, {w:"wheel", pic:"🎡", d:"wh"},
  {w:"white", pic:"⬜", d:"wh"}, {w:"whisk", pic:"🥄", d:"wh"}, {w:"whistle", pic:"📯", d:"wh"}
];

/* ---------- look-alike words: the same word with a different middle sound ----------
 * Every teacher's note in the workbook asks for exactly this (bad-bed, pat-pet,
 * pit-pot), because the middle vowel is where five-year-olds slip. */
const NEAR = [
  {w:"bat", pic:"🦇", near:["bet", "bit", "but"]},
  {w:"bed", pic:"🛏️", near:["bad", "bid", "bud"]},
  {w:"pin", pic:"📌", near:["pan", "pen", "pun"]},
  {w:"pot", pic:"🍲", near:["pat", "pet", "pit"]},
  {w:"cup", pic:"🥤", near:["cap", "cop", "chip"]},
  {w:"hat", pic:"🎩", near:["hit", "hot", "hut"]},
  {w:"hut", pic:"🛖", near:["hat", "hit", "hot"]},
  {w:"bug", pic:"🐛", near:["bag", "beg", "big"]},
  {w:"bag", pic:"🎒", near:["beg", "big", "bug"]},
  {w:"fan", pic:"🌀", near:["fin", "fun", "van"]},
  {w:"sun", pic:"☀️", near:["son", "sin", "san"]},
  {w:"cat", pic:"🐱", near:["cot", "cut", "kit"]},
  {w:"cot", pic:"🛌", near:["cat", "cut", "coat"]},
  {w:"box", pic:"📦", near:["bix", "bax", "bux"]},
  {w:"mug", pic:"☕", near:["mag", "meg", "mig"]},
  {w:"pen", pic:"🖊️", near:["pan", "pin", "pun"]}
];

/* the vowel a child actually hears in the middle */
const MIDDLE = [["a", "🍎", "apple", ["cat", "bag", "hat", "van", "jam"]],
  ["e", "🥚", "egg", ["bed", "hen", "pen", "ten", "net"]],
  ["i", "🐛", "insect", ["pin", "tin", "kid", "bin", "fig"]],
  ["o", "🐙", "octopus", ["dog", "pot", "box", "fox", "log"]],
  ["u", "☂️", "umbrella", ["sun", "bus", "cup", "nut", "hut"]]];

/* ---------- page builders used by every vowel chapter ---------- */
const VN = {a:"a", e:"e", i:"i", o:"o", u:"u"};
/* which families get a word-builder wheel, and which first letters to offer.
 * The extra letters are real letters that do NOT make a word — spotting that is
 * half the skill. */
const WHEELS = {
  a:[{end:"at", onsets:["b", "c", "f", "h", "m", "r", "s", "z"], real:["bat", "cat", "fat", "hat", "mat", "rat", "sat"]},
     {end:"an", onsets:["c", "f", "m", "p", "r", "v", "z"], real:["can", "fan", "man", "pan", "ran", "van"]}],
  e:[{end:"en", onsets:["d", "h", "m", "p", "t", "z"], real:["den", "hen", "men", "pen", "ten"]},
     {end:"et", onsets:["g", "j", "n", "p", "s", "w", "z"], real:["get", "jet", "net", "pet", "set", "wet"]}],
  i:[{end:"ig", onsets:["b", "d", "f", "j", "p", "w", "z"], real:["big", "dig", "fig", "jig", "pig", "wig"]},
     {end:"in", onsets:["b", "f", "p", "t", "w", "z"], real:["bin", "fin", "pin", "tin", "win"]}],
  o:[{end:"og", onsets:["d", "f", "h", "j", "l", "z"], real:["dog", "fog", "hog", "jog", "log"]},
     {end:"ot", onsets:["c", "d", "h", "n", "p", "z"], real:["cot", "dot", "hot", "not", "pot"]}],
  u:[{end:"ug", onsets:["b", "d", "h", "j", "m", "r", "z"], real:["bug", "dug", "hug", "jug", "mug", "rug"]},
     {end:"un", onsets:["b", "f", "r", "s", "z"], real:["bun", "fun", "run", "sun"]}]
};
const wheel = v => ({type:"build", title:"Make new words", fams:WHEELS[v].map(f => ({end:f.end, onsets:f.onsets,
  words:f.real.reduce((m, w) => { m[w] = PIC[w] || ""; return m; }, {})}))});

/* balloons: the target words rise with words from the other vowels mixed in */
const otherWords = v => ["a", "e", "i", "o", "u"].filter(x => x !== v)
  .reduce((all, x) => all.concat(playWords(x).slice(0, 6)), []);

function vowelChapter(v, opts){
  const P = picsOf(v), F = famsPlay(v), W = playWords(v);
  return {
    id:"f" + v, title:"The Sound of " + v, icon:opts.icon, sticker:opts.sticker,
    goals:["Read the -" + F.map(f => f.end).join(", -") + " word families",
      "Hear " + v + " in the middle of a word",
      "Build new words by changing the first letter"],
    note:opts.note,
    home:opts.home,
    pages:[
      {type:"learn", title:"Read aloud", cards:famCards(v), cols:2,
       tip:"Read across each row: the ending first, then the whole word."},
      {type:"learn", title:"Say the sounds, then the word", cards:P.slice(0, 9).map(o => ({big:o.w, pic:o.pic, say:blendSay(o.w)})), cols:3},
      wheel(v),
      {type:"mcq", title:"Fill in the missing letter", gen:"missing", args:{pool:P, letters:["a", "e", "i", "o", "u"], vowel:true},
       tip:"This is the workbook exercise: look at the picture, then find the letter that is missing."},
      {type:"match", title:"Match the word to its picture", pairs:P.slice(0, 8).map(o => [o.w, {pic:o.pic, say:o.w}]), n:4},
      {type:"pop", title:"Pop the " + v + " words", make:"an " + v + " sound", makeSay:"the sound " + v,
       targets:W.slice(0, 14), pool:otherWords(v), goal:6,
       tip:"Same idea as colouring the circles in the workbook — only the words with " + v + " in the middle count."},
      {type:"sort", title:"Put each word in its basket", bins:F.slice(0, 3).map(f => ({t:"-" + f.end, pic:"🧺"})),
       items:[].concat.apply([], F.slice(0, 3).map((f, j) => f.words.slice(0, 3).map(w => [w, j, w]))), n:8},
      {type:"mcq", title:opts.extraTitle, gen:opts.extraGen, args:opts.extraGen === "famWord" || opts.extraGen === "famPick"
        ? {fams:F} : opts.extraGen === "blend" ? {pool:P} : {pool:P}},
      {type:"quiz", title:"Check yourself", rounds:6, gens:[["missing", {pool:P, letters:["a", "e", "i", "o", "u"], vowel:true}],
        ["picWord", {pool:P}], ["famWord", {fams:F}], ["blend", {pool:P}]]}
    ]
  };
}

CS.addBook({
  id:"phonics", title:"Sound Box", short:"Phonics", lang:"en",
  theme:{main:"#7b3fb5", main2:"#a96de0", accent:"#ffc93c", soft:"#f3ebfc", ink:"#3a1260", sky:"#cdb6ea"},
  cover:{title:"Sound Box", sub:"Phonics", badge:"UKG", kids:["👧🏽", "🧒🏽"], mascot:"🦉", floats:["a", "sh", "ch"],
    ribbon:"Word families & sounds · UKG"},
  chapters:[
    vowelChapter("a", {icon:"🍎", sticker:"🐱",
      note:"The short 'a' is the first vowel sound children learn to read. Say the ending first (-at), then put a letter in front (b-at). Changing only the first letter is what makes reading click.",
      home:"Fridge letters: build 'cat', then swap the c for b, h, m and r. Let her say each new word before you tell her.",
      extraTitle:"Which word is in this family?", extraGen:"famWord"}),
    vowelChapter("e", {icon:"🥚", sticker:"🐔",
      note:"Short 'e' is the easiest one to lose — it often gets read as 'a'. If she reads 'bed' as 'bad', say both words yourself and let her hear the difference before correcting her.",
      home:"Say a pair out loud — bad / bed, pat / pet — and ask which one you said second.",
      extraTitle:"Put the sounds together", extraGen:"blend"}),
    vowelChapter("i", {icon:"🐛", sticker:"🐷",
      note:"Short 'i' sits between 'e' and 'u' and is the one most often guessed. Stretch the middle of the word when you read it: p-i-i-i-n.",
      home:"Point at things and ask for the middle sound: pin, lip, bin, fish.",
      extraTitle:"Which family does it belong to?", extraGen:"famPick"}),
    vowelChapter("o", {icon:"🐙", sticker:"🦊",
      note:"The workbook's note for this page is worth repeating: it does not matter if she makes a word you have never heard. Making 'pob' and laughing at it is still good practice — the sounds are what count.",
      home:"Play 'silly word or real word?' — you say dog, pog, log, mog; she calls out which are real.",
      extraTitle:"Listen and find the word", extraGen:"spell"}),
    vowelChapter("u", {icon:"☂️", sticker:"🐛",
      note:"Short 'u' is the last vowel to settle. It is the sound in 'up', not the one in 'you' — keep it short and flat.",
      home:"Hunt around the house for u words: cup, mug, nut, bus, rug, tub.",
      extraTitle:"Which word is in this family?", extraGen:"famWord"}),

    {id:"mix", title:"Mix the Vowels", icon:"🔀", sticker:"🦉",
     goals:["Hear the middle sound in a word", "Tell bat, bet, bit and but apart", "Write the word you hear"],
     note:"Every teacher's note in the workbook asks for this page: bad-bed, pat-pet, pit-pot. Once each vowel is known on its own, the real skill is telling them apart. Go slowly — this is the page to come back to.",
     home:"Dictation, three words a day. Say the word twice, let her write it, then read back what she wrote — even if it is wrong, so she can hear the difference herself.",
     pages:[
       {type:"learn", title:"The five middle sounds", cols:3,
        cards:MIDDLE.map(([v, pic, word, ws]) => ({big:v, pic, sub:ws.slice(0, 3).join(" "),
          say:v + " for " + word + ". " + ws.slice(0, 3).join(", ") + "."}))},
       {type:"learn", title:"Look-alike words", cols:2,
        cards:[["bat", "bet"], ["pin", "pen"], ["cap", "cup"], ["hat", "hut"], ["bag", "bug"], ["cot", "cat"]]
          .map(([x, y]) => ({big:x + " · " + y, pic:(PIC[x] || "") + (PIC[y] || ""),
            say:x + ". " + y + ". Only the middle sound changes."}))},
       {type:"mcq", title:"Which word is it?", gen:"nearWord", args:{pool:NEAR},
        tip:"Only the middle letter is different. Say all four out loud before choosing."},
       {type:"mcq", title:"Dictation: find the word", gen:"spell", args:{pool:NEAR},
        tip:"Tap the speaker, listen, then pick the spelling. This is the dictation homework, done out loud."},
       {type:"sort", title:"Sort by the middle sound",
        bins:[{t:"a", pic:"🍎"}, {t:"i", pic:"🐛"}, {t:"u", pic:"☂️"}],
        items:[["cat", 0, "cat"], ["bag", 0, "bag"], ["van", 0, "van"], ["pin", 1, "pin"], ["tin", 1, "tin"],
          ["fig", 1, "fig"], ["sun", 2, "sun"], ["cup", 2, "cup"], ["nut", 2, "nut"]], n:9},
       {type:"pop", title:"Pop the u words", make:"a u sound", makeSay:"the sound u",
        targets:playWords("u").slice(0, 12).concat(["bus", "hug"]), pool:["tag", "sip", "led", "fox", "pan", "hen", "bin", "top"], goal:6,
        tip:"This is the caterpillar page from the workbook: colour only the circles with a u sound."},
       {type:"crate", title:"Crate challenge", subject:"english", level:13, face:"cap or cup?",
        text:"The same words, against the clock. Open the crates before the timer runs out!"},
       {type:"memory", title:"Find the pairs", n:6,
        pairs:[["cat", {pic:"🐱", say:"cat"}], ["bed", {pic:"🛏️", say:"bed"}], ["pin", {pic:"📌", say:"pin"}],
          ["fox", {pic:"🦊", say:"fox"}], ["sun", {pic:"☀️", say:"sun"}], ["mug", {pic:"☕", say:"mug"}]]},
       {type:"quiz", title:"Check yourself", rounds:8,
        gens:[["nearWord", {pool:NEAR}], ["spell", {pool:NEAR}],
          ["blend", {pool:NEAR.map(o => ({w:o.w, pic:o.pic}))}],
          ["picWord", {pool:NEAR.map(o => ({w:o.w, pic:o.pic}))}]]}
     ]},

    {id:"chsh", title:"'ch' and 'sh'", icon:"🐑", sticker:"🐚",
     goals:["Know that two letters can make one sound", "Read ch words and sh words", "Hear ch and sh at the start and at the end"],
     note:"Here two letters join to make one brand-new sound — c and h do not say 'c' 'h', they say 'ch'. Point at the two letters together with one finger so she sees them as a pair.",
     home:"'sh' is the quiet sound you make to hush someone, and 'ch' is the sound of a train. Make both sounds before reading the words.",
     pages:[
       {type:"learn", title:"'sh' sound words", cards:digCards("sh").slice(0, 9), cols:3,
        tip:"sh is the quiet sound: shhh."},
       {type:"learn", title:"'ch' sound words", cards:digCards("ch").slice(0, 9), cols:3,
        tip:"ch is the train sound: ch-ch-ch."},
       {type:"mcq", title:"Fill in the blanks with 'sh'", gen:"digraph", args:{pool:dig("sh"), digraphs:["sh", "ch", "th", "s"]},
        tip:"Straight from the workbook: put 'sh' in the gap and read the new word."},
       {type:"mcq", title:"Fill in the blanks with 'ch'", gen:"digraph", args:{pool:dig("ch"), digraphs:["ch", "sh", "th", "c"]}},
       {type:"mcq", title:"ch or sh?", gen:"digraph", args:{pool:DIG, digraphs:["ch", "sh"]},
        tip:"Only two to choose from now — say the word and listen hard."},
       {type:"match", title:"Match the word to its picture", n:4,
        pairs:DIG.map(o => [o.w, {pic:o.pic, say:o.w}])},
       {type:"sort", title:"Which basket?", bins:[{t:"ch", pic:"🚂"}, {t:"sh", pic:"🤫"}],
        items:digAll("ch").slice(0, 5).map(o => [o.w, 0, o.w]).concat(digAll("sh").slice(0, 5).map(o => [o.w, 1, o.w])), n:8},
       {type:"pop", title:"Pop the 'sh' words", make:"an sh sound", makeSay:"the sound sh",
        targets:digAll("sh").map(o => o.w), pool:digAll("ch").map(o => o.w), goal:6},
       {type:"crate", title:"Crate challenge", subject:"english", level:14, face:"__eep",
        text:"ch and sh, against the clock. Open the crates before the timer runs out!"},
       {type:"quiz", title:"Check yourself", rounds:8,
        gens:[["digraph", {pool:DIG, digraphs:["ch", "sh", "th", "wh"]}], ["picWord", {pool:DIG}],
          ["spell", {pool:DIG}], ["wordPic", {pool:DIG}]]}
     ]},

    {id:"thwh", title:"'th' and 'wh'", icon:"👍", sticker:"🐳",
     goals:["Read th words and wh words", "Read the little words this, that, then", "Read the asking words what, when, why"],
     note:"These two come straight after ch and sh. They matter more than they look: this, that, the, then, what, when, where and why are among the commonest words in every storybook.",
     home:"Open any picture book and hunt for 'the' and 'this' on one page. She will find more than she expects.",
     pages:[
       {type:"learn", title:"'th' sound words", cols:3,
        cards:TH.filter(o => o.d === "th").map(o => ({big:o.w, pic:o.pic, say:"th... " + o.w + ". " + o.w + "."})),
        tip:"For th, the tongue peeps out between the teeth."},
       {type:"learn", title:"'wh' sound words", cols:3,
        cards:TH.filter(o => o.d === "wh").map(o => ({big:o.w, pic:o.pic, say:"wh... " + o.w + ". " + o.w + "."}))},
       {type:"learn", title:"Little words we read every day", cols:3,
        cards:["the", "this", "that", "then", "them", "what", "when", "why", "where"].map(w => ({big:w, say:w + ". " + w + "."})),
        tip:"These are not sounded out — they are learned by sight. Read them together every day for a week."},
       {type:"mcq", title:"th or wh?", gen:"digraph", args:{pool:TH, digraphs:["th", "wh"]}},
       {type:"mcq", title:"Which sound is missing?", gen:"digraph",
        args:{pool:TH.concat(DIG), digraphs:["ch", "sh", "th", "wh"]},
        tip:"All four sounds mixed up. Say the word slowly before choosing."},
       {type:"match", title:"Match the word to its picture", n:4,
        pairs:TH.map(o => [o.w, {pic:o.pic, say:o.w}])},
       {type:"sort", title:"Which basket?", bins:[{t:"th", pic:"👍"}, {t:"wh", pic:"🐳"}],
        items:TH.map(o => [o.w, o.d === "th" ? 0 : 1, o.w]), n:8},
       {type:"quiz", title:"Check yourself", rounds:6,
        gens:[["digraph", {pool:TH, digraphs:["th", "wh"]}], ["picWord", {pool:TH}], ["spell", {pool:TH}]]}
     ]}
  ]
});
})();
