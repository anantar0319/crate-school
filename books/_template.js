/* ============================================================================
 * HOW TO ADD A NEW BOOK  (this file is a guide; it is not loaded)
 * ----------------------------------------------------------------------------
 * 1. Copy this file to books/evs.js (any name) and fill it in.
 * 2. Add   <script src="books/evs.js"></script>   inside the BOOKS block of index.html.
 * 3. Add "books/evs.js" to CORE in sw.js so it works offline.
 * The cover, contents, chapter openers, sticker page, report card, certificate,
 * drawing page and back cover are all made automatically.
 *
 * PAGE TYPES (inside a chapter's pages list)
 *  learn   {cards:[{big, word, pic, n, sw, shape, sub, say}], cols}   tap to hear, "listen to all"
 *  chart   {from, to, step}                                         number chart, step highlights 2s/5s
 *  trace   {glyphs:["A", {g:"B", pic:"⚽", word:"Ball", say}]}      finger tracing with auto-checking
 *  mcq     {gen:"name", args:{...}, rounds}                         practice with hints (see js/gens.js)
 *  quiz    {gens:[["name",{args}], ...], rounds}                    chapter check: score + sticker at 60%+
 *  match   {pairs:[[left, right], ...], n}                          tap left then right
 *  sort    {bins:[{t, pic}], items:[[item, binIndex, say], ...]}    put things in baskets
 *  dots    {seq:["1","2",...], shape:"star|house|fish|kite|heart|tree|circle", pic}
 *  memory  {pairs:[[a, b], ...], n}                                 flip-card pairs
 *  pop     {target, pool} or {make:"5", targets:[...], pool}        balloon game
 *  colour  {scene:"fruits|shapes|garden", names, colours, free}     colour by instruction
 *  rhyme   {lines:[...], pics}                                      sing-along with line highlight
 *  build   {fams:[{end:"at", onsets:["b","c","z"], words:{bat:"\u{1F987}", cat:"\u{1F431}"}}]}
 *                  word builder: tap a first letter to make a word. Onsets that are
 *                  NOT in `words` are letters that make no word - spotting that is the skill.
 *  crate   {subject, level, face}                                   link to the timed Crate game
 * Any page can have  title, say (instruction to read aloud), tip (teacher sticky note).
 * An item can be "🍎", "cat", or {t, pic, n, sw, shape, say}.
 *
 * GENERATORS for mcq/quiz (js/gens.js): count more after before between gap compare symbol
 *  add sub addNum subNum skip table numWord wordNum shapeName shapeFind shapeReal pattern
 *  picWord wordPic firstLetter letterPic seqGap seqNext binary swName nameSw glyphName
 *  famWord famPick digraph nearWord spell blend      (phonics - see books/phonics.js)
 *  nameGlyph caseMatch missing rhyme opposite sound
 * ========================================================================== */
(function(){
const CS = window.CS;
CS.addBook({
  id:"evs",                         // unique, never change it later (progress is saved under it)
  title:"My World", short:"EVS",
  lang:"en",                        // "en", "hi" or "pa" — sets fonts, voice and button words
  theme:{main:"#0f9d8a", main2:"#35c9b4", accent:"#ffc107", soft:"#e3f7f3", ink:"#083b34", sky:"#9fdcff"},
  cover:{title:"My World", sub:"EVS", badge:"UKG", kids:["🧒🏽","👧🏽"], mascot:"🐢", floats:["🌳","☀️","💧"], ribbon:"Early Years EVS · UKG"},
  chapters:[
    {id:"body", title:"My Body", icon:"🧍", sticker:"👋",
     goals:["Name the parts of my body"],
     note:"For grown-ups: what this chapter teaches and how to help.",
     home:"A small thing to try at home.",
     pages:[
       {type:"learn", title:"Parts of my body", cards:[{pic:"👀", word:"eyes"}, {pic:"👂", word:"ears"}, {pic:"👃", word:"nose"}, {pic:"✋", word:"hand"}]},
       {type:"mcq", title:"What is this?", gen:"picWord", args:{pool:[{w:"eyes",pic:"👀"},{w:"ears",pic:"👂"},{w:"nose",pic:"👃"},{w:"hand",pic:"✋"}]}},
       {type:"quiz", title:"Check yourself", gens:[["picWord",{pool:[{w:"eyes",pic:"👀"},{w:"ears",pic:"👂"},{w:"nose",pic:"👃"},{w:"hand",pic:"✋"}]}]], rounds:5}
     ]}
  ]
});
})();
