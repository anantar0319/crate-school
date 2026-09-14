/* Book: ਮੇਰੀ ਪੰਜਾਬੀ (Punjabi, UKG). Content only — see books/_template.js
 * The 35 letters (ਪੈਂਤੀ) are taught in the same rows of five as the Crate game levels 1–7. */
(function(){
const CS = window.CS;
/* letter, its name, a word that starts with it, picture */
const PENTI = [
  ["ੳ","ਊੜਾ","ਊਠ","🐫"],["ਅ","ਐੜਾ","ਅੰਬ","🥭"],["ੲ","ਈੜੀ","ਇੱਟ","🧱"],["ਸ","ਸੱਸਾ","ਸੇਬ","🍎"],["ਹ","ਹਾਹਾ","ਹਾਥੀ","🐘"],
  ["ਕ","ਕੱਕਾ","ਕਬੂਤਰ","🕊️"],["ਖ","ਖੱਖਾ","ਖਰਗੋਸ਼","🐰"],["ਗ","ਗੱਗਾ","ਗਾਂ","🐄"],["ਘ","ਘੱਗਾ","ਘੜੀ","⌚"],["ਙ","ਙੰਙਾ","",""],
  ["ਚ","ਚੱਚਾ","ਚਿੜੀ","🐦"],["ਛ","ਛੱਛਾ","ਛੱਤਰੀ","☂️"],["ਜ","ਜੱਜਾ","ਜਹਾਜ਼","✈️"],["ਝ","ਝੱਜਾ","ਝੰਡਾ","🚩"],["ਞ","ਞੰਞਾ","",""],
  ["ਟ","ਟੈਂਕਾ","ਟਮਾਟਰ","🍅"],["ਠ","ਠੱਠਾ","",""],["ਡ","ਡੱਡਾ","ਡੱਡੂ","🐸"],["ਢ","ਢੱਡਾ","ਢੋਲ","🥁"],["ਣ","ਣਾਣਾ","",""],
  ["ਤ","ਤੱਤਾ","ਤਿੱਤਲੀ","🦋"],["ਥ","ਥੱਥਾ","ਥਾਲੀ","🍽️"],["ਦ","ਦੱਦਾ","ਦੰਦ","🦷"],["ਧ","ਧੱਦਾ","ਧਨੁਸ਼","🏹"],["ਨ","ਨੰਨਾ","ਨਲਕਾ","🚰"],
  ["ਪ","ਪੱਪਾ","ਪਤੰਗ","🪁"],["ਫ","ਫੱਫਾ","ਫੁੱਲ","🌸"],["ਬ","ਬੱਬਾ","ਬਿੱਲੀ","🐱"],["ਭ","ਭੱਬਾ","ਭਾਲੂ","🐻"],["ਮ","ਮੰਮਾ","ਮੋਰ","🦚"],
  ["ਯ","ਯੱਯਾ","ਯੋਗ","🧘"],["ਰ","ਰਾਰਾ","ਰੇਲ","🚂"],["ਲ","ਲੱਲਾ","ਲੱਕੜ","🪵"],["ਵ","ਵੱਵਾ","ਵਰਖਾ","🌧️"],["ੜ","ੜਾੜਾ","",""]
].map(([l, nm, w, pic]) => ({l, nm, w, pic}));
const LETTERS = PENTI.map(x => x.l);
const row = r => PENTI.slice(r * 5, r * 5 + 5);
const withWord = r => row(r).filter(x => x.w).map(x => ({f:x.l, w:x.w, pic:x.pic}));
const learnRow = r => row(r).map(x => x.w
  ? {big:x.l, sub:x.nm, word:x.w, pic:x.pic, say:x.nm + "। " + x.l + " ਤੋਂ " + x.w}
  : {big:x.l, sub:x.nm, say:x.nm});
const ROWS = ["ੳ ਤੋਂ ਹ", "ਕ ਤੋਂ ਙ", "ਚ ਤੋਂ ਞ", "ਟ ਤੋਂ ਣ", "ਤ ਤੋਂ ਨ", "ਪ ਤੋਂ ਮ", "ਯ ਤੋਂ ੜ"];
const STICKERS = ["🌻","🥁","🪁","🐸","🦋","🦚","🚂"];
const GAMES = [
  r => ({type:"dots", title:"ਅੱਖਰ ਜੋੜੋ", seq:row(r).map(x => x.l), shape:"house", pic:"🏠"}),
  r => ({type:"match", title:"ਅੱਖਰ ਤੇ ਤਸਵੀਰ", pairs:withWord(r).map(x => [x.f, {pic:x.pic, say:x.w}])}),
  r => ({type:"memory", title:"ਅੱਖਰ ਤੇ ਤਸਵੀਰ", pairs:withWord(r).map(x => [x.f, {pic:x.pic, say:x.w}])}),
  r => ({type:"pop", title:"ਡ ਵਾਲੇ ਗੁਬਾਰੇ", target:"ਡ", pool:["ਟ","ਠ","ਢ","ਣ"], tip:"ਡ and ਢ look alike; ਢ has a little tail at the top. Say ਡੱਡਾ and ਢੱਡਾ slowly."}),
  r => ({type:"match", title:"ਅੱਖਰ ਤੇ ਤਸਵੀਰ", pairs:withWord(r).map(x => [x.f, {pic:x.pic, say:x.w}])}),
  r => ({type:"memory", title:"ਅੱਖਰ ਤੇ ਨਾਂ", pairs:row(r).map(x => [x.l, x.nm])}),
  r => ({type:"pop", title:"ਵ ਵਾਲੇ ਗੁਬਾਰੇ", target:"ਵ", pool:["ਰ","ਲ","ਯ","ੜ"]})
];
const letterChapter = r => ({
  id:"p" + (r + 1), title:"ਪੈਂਤੀ: " + ROWS[r], en:"Letters " + (r * 5 + 1) + "–" + (r * 5 + 5), icon:row(r)[0].l, sticker:STICKERS[r],
  goals:["ਅੱਖਰ ਪਛਾਣਨਾ: " + row(r).map(x => x.l).join(" "), "ਹਰ ਅੱਖਰ ਦਾ ਨਾਂ ਬੋਲਣਾ", "ਅੱਖਰ ਲਿਖਣਾ"],
  note:r === 0 ? "Gurmukhi letters each have a name (ੳ is ਊੜਾ, ਅ is ਐੜਾ). Say the name, then the word: 'ਊੜਾ — ੳ ਤੋਂ ਊਠ'. If this device has no Punjabi voice, a Hindi voice reads the same sounds."
       : "Recite the whole row like a chant each day before starting. Letters without a word card (like ਙ, ਞ, ਣ, ਠ, ੜ) rarely start words — recognising them is enough.",
  home:"Write this row's letters on paper. Say a letter name; your child points to it.",
  pages:[
    {type:"learn", title:ROWS[r], cards:learnRow(r)},
    {type:"trace", title:"ਲਿਖੋ: " + row(r).map(x => x.l).join(" "), glyphs:row(r).map(x => ({g:x.l, word:x.nm, say:x.nm}))},
    {type:"mcq", title:"ਅੱਖਰ ਦਾ ਨਾਂ", gen:"glyphName", args:{pool:row(r), from:PENTI}},
    {type:"mcq", title:"ਨਾਂ ਸੁਣੋ, ਅੱਖਰ ਲੱਭੋ", gen:"nameGlyph", args:{pool:row(r), from:PENTI}},
    GAMES[r](r),
    {type:"crate", title:"ਕਰੇਟ ਖੇਡ", subject:"punjabi", level:r + 1, face:row(r)[0].l, text:"ਸਮੇਂ ਨਾਲ ਖੇਡੋ! Open the crates before the timer runs out."},
    {type:"quiz", title:"ਆਪਣੀ ਜਾਂਚ ਕਰੋ", gens:[["glyphName",{pool:row(r), from:PENTI}],["nameGlyph",{pool:row(r), from:PENTI}]]
      .concat(withWord(r).length >= 3 ? [["firstLetter",{pool:withWord(r), letters:LETTERS}]] : []), rounds:6}
  ]
});
const DIG = ["੦","੧","੨","੩","੪","੫","੬","੭","੮","੯","੧੦","੧੧"];
const NUMW = ["","ਇੱਕ","ਦੋ","ਤਿੰਨ","ਚਾਰ","ਪੰਜ","ਛੇ","ਸੱਤ","ਅੱਠ","ਨੌਂ","ਦਸ"];
const NUMS = CS.range(1, 10).map(n => ({d:DIG[n], w:NUMW[n]}));
const PICS = ["🍎","🐥","🎈","🐟","⭐","🌸","🐞","🍪","🚗","🧁"];
const WORDS = [["ਘਰ","🏠"],["ਨਲ","🚰"],["ਜਲ","💧"],["ਕਲਮ","🖊️"],["ਫਲ","🍎"],["ਮਗਰ","🐊"],["ਨਮਕ","🧂"]].map(([w, pic]) => ({w, pic}));
const COLOURS = [["ਲਾਲ","#e53935","🍎"],["ਨੀਲਾ","#1e88e5","🐳"],["ਹਰਾ","#43a047","🥦"],["ਪੀਲਾ","#fdd835","🍌"],["ਸੰਤਰੀ","#fb8c00","🥕"],
  ["ਜਾਮਨੀ","#8e24aa","🍇"],["ਗੁਲਾਬੀ","#f06292","🌸"],["ਭੂਰਾ","#8d5524","🐻"],["ਕਾਲਾ","#212121","🎩"],["ਚਿੱਟਾ","#ffffff","☁️"]].map(([w, hex, pic]) => ({w, hex, pic}));
const FRUITS = [["ਸੇਬ","🍎"],["ਅੰਬ","🥭"],["ਕੇਲਾ","🍌"],["ਅੰਗੂਰ","🍇"],["ਸੰਤਰਾ","🍊"],["ਤਰਬੂਜ਼","🍉"]].map(([w, pic]) => ({w, pic}));
const ANIMALS = [["ਕੁੱਤਾ","🐶"],["ਬਿੱਲੀ","🐱"],["ਗਾਂ","🐄"],["ਬੱਕਰੀ","🐐"],["ਹਾਥੀ","🐘"],["ਸ਼ੇਰ","🦁"],["ਬਾਂਦਰ","🐒"],["ਮੱਛੀ","🐟"],["ਘੋੜਾ","🐴"],["ਚੂਹਾ","🐭"],["ਖਰਗੋਸ਼","🐰"],["ਮੋਰ","🦚"]]
  .map(([w, pic]) => ({w, pic}));

CS.addBook({
  id:"punjabi", title:"ਮੇਰੀ ਪੰਜਾਬੀ", short:"Punjabi", lang:"pa",
  theme:{main:"#1f9d55", main2:"#43c979", accent:"#ffc300", soft:"#e8f8ee", ink:"#0c4a2a", sky:"#9fdcff"},
  cover:{title:"ਮੇਰੀ ਪੰਜਾਬੀ", sub:"ਪੰਜਾਬੀ", badge:"UKG", kids:["👧🏽","🧒🏽"], mascot:"🦚", floats:["ੳ","ਅ","ੲ"], script:true, ribbon:"Early Years Punjabi · UKG"},
  chapters:[0,1,2,3,4,5,6].map(letterChapter).concat([
    {id:"pg", title:"ਗਿਣਤੀ ੧ ਤੋਂ ੧੦", en:"Numbers", icon:"੧", sticker:"🎈",
     goals:["੧ ਤੋਂ ੧੦ ਤੱਕ ਗਿਣਨਾ", "ਨੰਬਰਾਂ ਦੇ ਨਾਂ ਬੋਲਣਾ", "ਗੁਰਮੁਖੀ ਅੰਕ ਲਿਖਣਾ"],
     note:"Gurmukhi numerals (੧, ੨, ੩) sit beside counting pictures. Count objects first, then match the numeral.",
     home:"Count steps or chapatis in Punjabi: ਇੱਕ, ਦੋ, ਤਿੰਨ…",
     pages:[
       {type:"learn", title:"ਇੱਕ ਤੋਂ ਪੰਜ", cards:CS.range(1, 5).map(n => ({big:DIG[n], pic:PICS[n - 1], n, word:NUMW[n], say:NUMW[n]}))},
       {type:"learn", title:"ਛੇ ਤੋਂ ਦਸ", cards:CS.range(6, 10).map(n => ({big:DIG[n], pic:PICS[n - 1], n, word:NUMW[n], say:NUMW[n]}))},
       {type:"trace", title:"ਲਿਖੋ: ੧ ੨ ੩ ੪ ੫", glyphs:DIG.slice(1, 6).map((g, i) => ({g, word:NUMW[i + 1], say:NUMW[i + 1]}))},
       {type:"trace", title:"ਲਿਖੋ: ੬ ੭ ੮ ੯", glyphs:DIG.slice(6, 10).map((g, i) => ({g, word:NUMW[i + 6], say:NUMW[i + 6]}))},
       {type:"mcq", title:"ਗਿਣੋ ਤੇ ਚੁਣੋ", gen:"count", args:{max:10, labels:DIG}},
       {type:"mcq", title:"ਨੰਬਰ ਦਾ ਨਾਂ", gen:"numWord", args:{pool:NUMS}},
       {type:"rhyme", title:"ਗਿਣਤੀ ਗੀਤ", pics:"🔢🎶", lines:["ਇੱਕ ਦੋ ਤਿੰਨ ਚਾਰ,", "ਅਸੀਂ ਹਾਂ ਤਿਆਰ!", "ਪੰਜ ਛੇ ਸੱਤ ਅੱਠ,", "ਚਲੋ ਪੜ੍ਹੀਏ ਪਾਠ!", "ਨੌਂ ਤੇ ਦਸ,", "ਖਿੜ ਖਿੜ ਹੱਸ!"],
        tip:"A simple counting chant written for this book. Clap on each number."},
       {type:"quiz", title:"ਆਪਣੀ ਜਾਂਚ ਕਰੋ", gens:[["count",{max:10, labels:DIG}],["numWord",{pool:NUMS}],["wordNum",{pool:NUMS}]], rounds:6}
     ]},
    {id:"mukta", title:"ਮੁਕਤਾ ਸ਼ਬਦ", en:"First words", icon:"📖", sticker:"🐊",
     goals:["ਬਿਨਾਂ ਲਗਾਂ ਵਾਲੇ ਸ਼ਬਦ ਪੜ੍ਹਨਾ", "ਗਾਇਬ ਅੱਖਰ ਲੱਭਣਾ"],
     note:"ਮੁਕਤਾ words have no vowel signs, so each letter keeps its own short 'a' sound: ਘ-ਰ, ਘਰ.",
     home:"Write ਘਰ, ਨਲ and ਫਲ on paper and let your child read them to you.",
     pages:[
       {type:"learn", title:"ਸ਼ਬਦ ਪੜ੍ਹੋ", cards:WORDS.map(({w, pic}) => ({big:w, pic, say:CS.graphemes(w).join(", ") + "। " + w}))},
       {type:"mcq", title:"ਇਹ ਕੀ ਹੈ?", gen:"picWord", args:{pool:WORDS}},
       {type:"mcq", title:"ਗਾਇਬ ਅੱਖਰ", gen:"missing", args:{pool:WORDS, letters:["ਕ","ਘ","ਜ","ਨ","ਫ","ਮ","ਲ","ਰ","ਗ","ਸ","ਤ","ਬ"]}},
       {type:"match", title:"ਸ਼ਬਦ ਤੇ ਤਸਵੀਰ", pairs:WORDS.map(x => [x.w, {pic:x.pic, say:x.w}])},
       {type:"quiz", title:"ਆਪਣੀ ਜਾਂਚ ਕਰੋ", gens:[["picWord",{pool:WORDS}],["wordPic",{pool:WORDS}],["missing",{pool:WORDS, letters:["ਕ","ਘ","ਜ","ਨ","ਫ","ਮ","ਲ","ਰ"]}]], rounds:6}
     ]},
    {id:"rfj", title:"ਰੰਗ, ਫਲ ਤੇ ਜਾਨਵਰ", en:"Colours, fruits, animals", icon:"🦚", sticker:"🌈",
     goals:["ਰੰਗਾਂ ਦੇ ਨਾਂ ਬੋਲਣਾ", "ਫਲਾਂ ਅਤੇ ਜਾਨਵਰਾਂ ਦੇ ਨਾਂ ਬੋਲਣਾ"],
     note:"Use Punjabi names at home for colours, fruits and animals every day — little and often.",
     home:"Ask your child to find something ਲਾਲ and something ਹਰਾ in the house.",
     pages:[
       {type:"learn", title:"ਰੰਗ", cards:COLOURS.map(c => ({sw:c.hex, pic:c.pic, word:c.w, say:c.w}))},
       {type:"colour", title:"ਫਲਾਂ ਵਿੱਚ ਰੰਗ ਭਰੋ", scene:"fruits", names:{apple:"ਸੇਬ", leaf:"ਪੱਤੇ", banana:"ਕੇਲੇ", grapes:"ਅੰਗੂਰਾਂ", orange:"ਸੰਤਰੇ"},
        colours:{red:"ਲਾਲ", green:"ਹਰਾ", yellow:"ਪੀਲਾ", purple:"ਜਾਮਨੀ", orange:"ਸੰਤਰੀ", blue:"ਨੀਲਾ", pink:"ਗੁਲਾਬੀ", brown:"ਭੂਰਾ"}},
       {type:"learn", title:"ਜਾਨਵਰ", cards:ANIMALS.map(a => ({pic:a.pic, word:a.w}))},
       {type:"sort", title:"ਫਲ ਜਾਂ ਜਾਨਵਰ?", bins:[{t:"ਫਲ", pic:"🧺"},{t:"ਜਾਨਵਰ", pic:"🐾"}],
        items:FRUITS.slice(0, 4).map(f => [f.pic, 0, f.w]).concat(ANIMALS.slice(0, 4).map(a => [a.pic, 1, a.w]))},
       {type:"mcq", title:"ਕਿਹੜਾ ਰੰਗ?", gen:"swName", args:{pool:COLOURS}},
       {type:"mcq", title:"ਇਹ ਕੀ ਹੈ?", gen:"picWord", args:{pool:FRUITS.concat(ANIMALS)}},
       {type:"quiz", title:"ਆਪਣੀ ਜਾਂਚ ਕਰੋ", gens:[["swName",{pool:COLOURS}],["picWord",{pool:FRUITS.concat(ANIMALS)}],["wordPic",{pool:ANIMALS}]], rounds:6}
     ]}
  ])
});
})();
